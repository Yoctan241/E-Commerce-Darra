import { useState, useEffect } from 'react';
import { RotateCcw, TrendingUp, Info } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { useCurrencyConverter, Currency, createPrice, type PriceWithCurrency } from '../utils/currency';

interface PriceDisplayProps {
  basePrice: number;
  baseCurrency?: Currency;
  showBothCurrencies?: boolean;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
  onCurrencyChange?: (currency: Currency) => void;
}

interface PriceSelectorProps {
  basePrice: number;
  baseCurrency?: Currency;
  onPriceChange: (price: PriceWithCurrency) => void;
  className?: string;
}

// Composant d'affichage des prix avec conversion
export function PriceDisplay({ 
  basePrice, 
  baseCurrency = 'FCFA', 
  showBothCurrencies = true,
  size = 'md',
  className = '',
  onCurrencyChange 
}: PriceDisplayProps) {
  const { convert, formatPrice, rates, isLoading } = useCurrencyConverter();
  const [primaryCurrency, setPrimaryCurrency] = useState<Currency>(baseCurrency);

  const price = createPrice(basePrice, baseCurrency);
  
  const primaryAmount = primaryCurrency === 'FCFA' ? price.fcfa : price.eur;
  const secondaryAmount = primaryCurrency === 'FCFA' ? price.eur : price.fcfa;
  const secondaryCurrency = primaryCurrency === 'FCFA' ? 'EUR' : 'FCFA';

  const toggleCurrency = () => {
    const newCurrency = primaryCurrency === 'FCFA' ? 'EUR' : 'FCFA';
    setPrimaryCurrency(newCurrency);
    onCurrencyChange?.(newCurrency);
  };

  const getSizeClasses = () => {
    switch (size) {
      case 'sm':
        return {
          primary: 'text-lg font-bold',
          secondary: 'text-sm',
          button: 'text-xs p-1'
        };
      case 'lg':
        return {
          primary: 'text-3xl font-bold',
          secondary: 'text-lg',
          button: 'text-sm p-2'
        };
      default:
        return {
          primary: 'text-2xl font-bold',
          secondary: 'text-base',
          button: 'text-sm p-1.5'
        };
    }
  };

  const sizeClasses = getSizeClasses();

  return (
    <div className={`flex items-center gap-3 ${className}`}>
      <div className="flex flex-col">
        <div className={`${sizeClasses.primary} text-[#2d7a3e]`}>
          {formatPrice(primaryAmount, primaryCurrency)}
        </div>
        
        {showBothCurrencies && (
          <div className={`${sizeClasses.secondary} text-gray-600 flex items-center gap-2`}>
            ≈ {formatPrice(secondaryAmount, secondaryCurrency)}
            {isLoading && (
              <Badge variant="outline" className="text-xs">
                Mise à jour...
              </Badge>
            )}
          </div>
        )}
      </div>
      
      <Button
        variant="outline"
        size="sm"
        onClick={toggleCurrency}
        className={`${sizeClasses.button} flex items-center gap-1 hover:bg-gray-50`}
        title={`Afficher en ${primaryCurrency === 'FCFA' ? 'EUR' : 'FCFA'}`}
      >
        <RotateCcw size={12} />
      </Button>
    </div>
  );
}

// Composant de sélection/édition de prix avec conversion
export function PriceSelector({ 
  basePrice, 
  baseCurrency = 'FCFA', 
  onPriceChange, 
  className = '' 
}: PriceSelectorProps) {
  const { convert, formatPrice, rates } = useCurrencyConverter();
  const [currency, setCurrency] = useState<Currency>(baseCurrency);
  const [amount, setAmount] = useState(basePrice.toString());

  useEffect(() => {
    const numericAmount = parseFloat(amount) || 0;
    const priceObj = createPrice(numericAmount, currency);
    onPriceChange(priceObj);
  }, [amount, currency, onPriceChange]);

  const handleAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    // Permettre seulement les nombres et les points décimaux
    if (value === '' || /^\d*\.?\d*$/.test(value)) {
      setAmount(value);
    }
  };

  const toggleCurrency = () => {
    const currentAmount = parseFloat(amount) || 0;
    const newCurrency = currency === 'FCFA' ? 'EUR' : 'FCFA';
    const convertedAmount = convert(currentAmount, currency, newCurrency);
    
    setCurrency(newCurrency);
    setAmount(convertedAmount.toString());
  };

  const getCurrentConversion = () => {
    const numericAmount = parseFloat(amount) || 0;
    const otherCurrency = currency === 'FCFA' ? 'EUR' : 'FCFA';
    const convertedAmount = convert(numericAmount, currency, otherCurrency);
    return formatPrice(convertedAmount, otherCurrency);
  };

  return (
    <div className={`space-y-3 ${className}`}>
      <div className="flex gap-3">
        <div className="flex-1">
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Prix de base
          </label>
          <div className="relative">
            <input
              type="text"
              value={amount}
              onChange={handleAmountChange}
              className="w-full px-4 py-2 pr-20 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#2d7a3e] focus:border-transparent"
              placeholder="0"
            />
            <div className="absolute right-2 top-1/2 transform -translate-y-1/2 text-sm font-medium text-gray-600">
              {currency}
            </div>
          </div>
        </div>
        
        <div className="flex items-end">
          <Button
            type="button"
            variant="outline"
            onClick={toggleCurrency}
            className="px-3 py-2 flex items-center gap-2"
          >
            <RotateCcw size={16} />
            {currency === 'FCFA' ? 'EUR' : 'FCFA'}
          </Button>
        </div>
      </div>

      {amount && parseFloat(amount) > 0 && (
        <Card className="bg-blue-50">
          <CardContent className="p-3">
            <div className="flex items-center gap-2">
              <Info className="text-blue-600" size={16} />
              <div className="text-sm text-blue-700">
                <strong>Conversion automatique:</strong> ≈ {getCurrentConversion()}
              </div>
            </div>
            <div className="text-xs text-blue-600 mt-1">
              Taux de change mis à jour le {rates.lastUpdated.toLocaleDateString('fr-FR')}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}

// Composant de comparaison de prix
export function PriceComparison({ 
  prices 
}: { 
  prices: Array<{ label: string; amount: number; currency: Currency }> 
}) {
  const { convert, formatPrice } = useCurrencyConverter();
  const [displayCurrency, setDisplayCurrency] = useState<Currency>('FCFA');

  return (
    <Card>
      <CardContent className="p-4">
        <div className="flex justify-between items-center mb-4">
          <h4 className="font-semibold text-gray-900">Comparaison de prix</h4>
          <Button
            variant="outline"
            size="sm"
            onClick={() => setDisplayCurrency(displayCurrency === 'FCFA' ? 'EUR' : 'FCFA')}
            className="flex items-center gap-1"
          >
            <RotateCcw size={12} />
            {displayCurrency}
          </Button>
        </div>

        <div className="space-y-3">
          {prices.map((price, index) => {
            const convertedAmount = convert(price.amount, price.currency, displayCurrency);
            return (
              <div key={index} className="flex justify-between items-center">
                <span className="text-gray-700">{price.label}</span>
                <span className="font-semibold text-[#2d7a3e]">
                  {formatPrice(convertedAmount, displayCurrency)}
                </span>
              </div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
}

// Composant d'information sur les taux de change
export function CurrencyInfo() {
  const { rates, updateRates, isLoading } = useCurrencyConverter();

  return (
    <Card className="border-l-4 border-l-blue-500">
      <CardContent className="p-4">
        <div className="flex justify-between items-start">
          <div>
            <h4 className="font-semibold text-gray-900 flex items-center gap-2">
              <TrendingUp size={16} />
              Taux de change
            </h4>
            <div className="mt-2 space-y-1 text-sm text-gray-600">
              <div>1 EUR = {rates.eurToFcfa.toLocaleString('fr-FR')} FCFA</div>
              <div>1 FCFA = {rates.fcfaToEur.toFixed(6)} EUR</div>
              <div className="text-xs text-gray-500">
                Dernière mise à jour: {rates.lastUpdated.toLocaleDateString('fr-FR')} à {rates.lastUpdated.toLocaleTimeString('fr-FR')}
              </div>
            </div>
          </div>
          
          <Button
            variant="outline"
            size="sm"
            onClick={updateRates}
            disabled={isLoading}
            className="flex items-center gap-1"
          >
            <RotateCcw size={12} className={isLoading ? 'animate-spin' : ''} />
            {isLoading ? 'Mise à jour...' : 'Actualiser'}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}