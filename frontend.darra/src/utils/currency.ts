// Système de conversion de devises FCFA ↔ EUR
import { useState, useEffect } from 'react';

export interface CurrencyRate {
  fcfaToEur: number;
  eurToFcfa: number;
  lastUpdated: Date;
}

export type Currency = 'FCFA' | 'EUR';

// Taux de change approximatif (1 EUR = 655 FCFA)
const DEFAULT_RATES: CurrencyRate = {
  fcfaToEur: 0.00152671755725,  // 1 FCFA = 0.00152671755725 EUR
  eurToFcfa: 655.957,           // 1 EUR = 655.957 FCFA
  lastUpdated: new Date()
};

class CurrencyConverter {
  private rates: CurrencyRate = DEFAULT_RATES;
  private lastFetchTime: Date = new Date();
  private readonly CACHE_DURATION = 1000 * 60 * 60; // 1 heure en millisecondes

  constructor() {
    // Tenter de charger les taux depuis le localStorage
    const stored = localStorage.getItem('darra_currency_rates');
    if (stored) {
      try {
        const parsed = JSON.parse(stored);
        this.rates = {
          ...parsed,
          lastUpdated: new Date(parsed.lastUpdated)
        };
        this.lastFetchTime = this.rates.lastUpdated;
      } catch (error) {
        console.warn('Erreur lors du chargement des taux de change:', error);
      }
    }
  }

  /**
   * Obtenir les taux de change actuels
   */
  getCurrentRates(): CurrencyRate {
    return { ...this.rates };
  }

  /**
   * Vérifier si les taux doivent être actualisés
   */
  private shouldUpdateRates(): boolean {
    const now = new Date();
    const timeDiff = now.getTime() - this.lastFetchTime.getTime();
    return timeDiff > this.CACHE_DURATION;
  }

  /**
   * Mettre à jour les taux de change (simulation - remplacer par vraie API)
   */
  async updateRates(): Promise<void> {
    if (!this.shouldUpdateRates()) {
      return;
    }

    try {
      // Simulation d'appel API - remplacer par une vraie API comme exchangerate-api.com
      // const response = await fetch('https://api.exchangerate-api.com/v4/latest/EUR');
      // const data = await response.json();
      
      // Simulation avec variation aléatoire de ±2%
      const variation = (Math.random() - 0.5) * 0.04; // ±2%
      const baseRate = 655.957;
      const newEurToFcfa = baseRate * (1 + variation);
      
      this.rates = {
        fcfaToEur: 1 / newEurToFcfa,
        eurToFcfa: newEurToFcfa,
        lastUpdated: new Date()
      };

      this.lastFetchTime = new Date();
      
      // Sauvegarder dans localStorage
      localStorage.setItem('darra_currency_rates', JSON.stringify(this.rates));
      
    } catch (error) {
      console.error('Erreur lors de la mise à jour des taux:', error);
    }
  }

  /**
   * Convertir un montant de FCFA vers EUR
   */
  fcfaToEur(amount: number): number {
    return Math.round(amount * this.rates.fcfaToEur * 100) / 100;
  }

  /**
   * Convertir un montant de EUR vers FCFA
   */
  eurToFcfa(amount: number): number {
    return Math.round(amount * this.rates.eurToFcfa);
  }

  /**
   * Convertir entre deux devises
   */
  convert(amount: number, from: Currency, to: Currency): number {
    if (from === to) return amount;
    
    if (from === 'FCFA' && to === 'EUR') {
      return this.fcfaToEur(amount);
    } else if (from === 'EUR' && to === 'FCFA') {
      return this.eurToFcfa(amount);
    }
    
    return amount;
  }

  /**
   * Formater un prix avec la devise
   */
  formatPrice(amount: number, currency: Currency): string {
    if (currency === 'FCFA') {
      return `${amount.toLocaleString('fr-FR')} FCFA`;
    } else {
      return `${amount.toLocaleString('fr-FR', {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2
      })} €`;
    }
  }

  /**
   * Obtenir le symbole de la devise
   */
  getCurrencySymbol(currency: Currency): string {
    return currency === 'FCFA' ? 'FCFA' : '€';
  }
}

// Instance singleton
export const currencyConverter = new CurrencyConverter();

// Hook React pour utiliser la conversion
export function useCurrencyConverter() {
  const [rates, setRates] = useState<CurrencyRate>(currencyConverter.getCurrentRates());
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const updateRates = async () => {
      setIsLoading(true);
      await currencyConverter.updateRates();
      setRates(currencyConverter.getCurrentRates());
      setIsLoading(false);
    };

    updateRates();
    
    // Mettre à jour toutes les heures
    const interval = setInterval(updateRates, 1000 * 60 * 60);
    
    return () => clearInterval(interval);
  }, []);

  return {
    rates,
    isLoading,
    convert: (amount: number, from: Currency, to: Currency) => 
      currencyConverter.convert(amount, from, to),
    formatPrice: (amount: number, currency: Currency) => 
      currencyConverter.formatPrice(amount, currency),
    fcfaToEur: (amount: number) => currencyConverter.fcfaToEur(amount),
    eurToFcfa: (amount: number) => currencyConverter.eurToFcfa(amount),
    updateRates: () => currencyConverter.updateRates()
  };
}

// Types pour les produits avec support multi-devises
export interface PriceWithCurrency {
  fcfa: number;
  eur: number;
  currency: Currency;
}

export function createPrice(baseAmount: number, baseCurrency: Currency = 'FCFA'): PriceWithCurrency {
  if (baseCurrency === 'FCFA') {
    return {
      fcfa: baseAmount,
      eur: currencyConverter.fcfaToEur(baseAmount),
      currency: 'FCFA'
    };
  } else {
    return {
      fcfa: currencyConverter.eurToFcfa(baseAmount),
      eur: baseAmount,
      currency: 'EUR'
    };
  }
}