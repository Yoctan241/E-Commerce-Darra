import { useState, useEffect } from 'react';
import { Search, Filter, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';

interface Category {
  id: string;
  name: string;
  slug: string;
  productCount?: number;
}

interface ProductFiltersProps {
  onFiltersChange: (filters: {
    category?: string;
    priceRange?: { min: number; max: number };
    searchQuery?: string;
    brand?: string;
  }) => void;
}

export default function ProductFilters({ onFiltersChange }: ProductFiltersProps) {
  const [categories, setCategories] = useState<Category[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>('');
  const [priceRange, setPriceRange] = useState({ min: 0, max: 200000 });
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedBrand, setSelectedBrand] = useState('');
  const [brands, setBrands] = useState<string[]>([]);
  const [showFilters, setShowFilters] = useState(false);

  // Catégories prédéfinies (puisqu'on n'a pas d'endpoint /categories)
  const predefinedCategories: Category[] = [
    { id: 'all', name: 'Toutes les catégories', slug: 'all' },
    { id: 'cosmetiques', name: '💄 Cosmétiques', slug: 'cosmetiques' },
    { id: 'parfums', name: '🌸 Parfums', slug: 'parfums' },
    { id: 'soins-du-visage', name: '✨ Soins du visage', slug: 'soins-du-visage' },
    { id: 'alimentaire', name: '🥘 Alimentaire', slug: 'alimentaire' },
    { id: 'electronique', name: '📱 Électroniques', slug: 'electronique' },
    { id: 'vetements', name: '👕 Vêtements', slug: 'vetements' },
    { id: 'chaussures', name: '👟 Chaussures', slug: 'chaussures' },
    { id: 'maison-decoration', name: '🏡 Maison & Déco', slug: 'maison-decoration' },
    { id: 'beaute-bien-etre', name: '🌿 Beauté & Bien-être', slug: 'beaute-bien-etre' },
    { id: 'sport-loisirs', name: '⚽ Sport & Loisirs', slug: 'sport-loisirs' }
  ];

  // Marques populaires
  const popularBrands = [
    'L\'Oréal', 'Maybelline', 'Chanel', 'Dior', 'Nike', 'Adidas', 
    'Samsung', 'Apple', 'Zara', 'H&M', 'Nivea', 'Garnier'
  ];

  useEffect(() => {
    setCategories(predefinedCategories);
    setBrands(popularBrands);
  }, []);

  useEffect(() => {
    // Appliquer les filtres
    const filters: any = {};
    
    if (selectedCategory && selectedCategory !== 'all') {
      filters.category = selectedCategory;
    }
    
    if (priceRange.min > 0 || priceRange.max < 200000) {
      filters.priceRange = priceRange;
    }
    
    if (searchQuery.trim()) {
      filters.searchQuery = searchQuery.trim();
    }
    
    if (selectedBrand) {
      filters.brand = selectedBrand;
    }

    onFiltersChange(filters);
  }, [selectedCategory, priceRange, searchQuery, selectedBrand, onFiltersChange]);

  const clearFilters = () => {
    setSelectedCategory('all');
    setPriceRange({ min: 0, max: 200000 });
    setSearchQuery('');
    setSelectedBrand('');
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('fr-FR').format(price) + ' FCFA';
  };

  return (
    <div className="space-y-6">
      {/* Barre de recherche */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Rechercher un produit, une marque..."
          className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#2d7a3e] focus:border-transparent"
        />
      </div>

      {/* Bouton toggle filtres sur mobile */}
      <div className="flex items-center justify-between md:hidden">
        <Button
          variant="outline"
          onClick={() => setShowFilters(!showFilters)}
          className="flex items-center gap-2"
        >
          <Filter size={16} />
          Filtres
        </Button>
        {(selectedCategory !== 'all' || selectedBrand || searchQuery) && (
          <Button variant="ghost" onClick={clearFilters} className="text-red-600">
            Effacer
          </Button>
        )}
      </div>

      {/* Filtres */}
      <div className={`space-y-6 ${showFilters ? 'block' : 'hidden md:block'}`}>
        {/* Catégories */}
        <Card>
          <CardContent className="p-4">
            <h3 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
              📂 Catégories
            </h3>
            <div className="grid grid-cols-1 gap-2">
              {categories.map((category) => (
                <button
                  key={category.id}
                  onClick={() => setSelectedCategory(category.id)}
                  className={`text-left p-3 rounded-lg transition-colors ${
                    selectedCategory === category.id
                      ? 'bg-[#2d7a3e] text-white'
                      : 'hover:bg-gray-100 text-gray-700'
                  }`}
                >
                  <span className="text-sm font-medium">{category.name}</span>
                  {category.productCount && (
                    <span className="text-xs opacity-75 ml-2">({category.productCount})</span>
                  )}
                </button>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Prix */}
        <Card>
          <CardContent className="p-4">
            <h3 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
              💰 Prix
            </h3>
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs text-gray-600 mb-1">Min</label>
                  <input
                    type="number"
                    value={priceRange.min}
                    onChange={(e) => setPriceRange(prev => ({ ...prev, min: Number(e.target.value) }))}
                    className="w-full px-3 py-2 text-sm border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-[#2d7a3e]"
                  />
                </div>
                <div>
                  <label className="block text-xs text-gray-600 mb-1">Max</label>
                  <input
                    type="number"
                    value={priceRange.max}
                    onChange={(e) => setPriceRange(prev => ({ ...prev, max: Number(e.target.value) }))}
                    className="w-full px-3 py-2 text-sm border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-[#2d7a3e]"
                  />
                </div>
              </div>
              <div className="text-xs text-gray-600">
                {formatPrice(priceRange.min)} - {formatPrice(priceRange.max)}
              </div>
              
              {/* Raccourcis prix */}
              <div className="grid grid-cols-2 gap-2 text-xs">
                <button
                  onClick={() => setPriceRange({ min: 0, max: 10000 })}
                  className="p-2 text-gray-600 border border-gray-200 rounded hover:bg-gray-50"
                >
                  &lt; 10k FCFA
                </button>
                <button
                  onClick={() => setPriceRange({ min: 10000, max: 50000 })}
                  className="p-2 text-gray-600 border border-gray-200 rounded hover:bg-gray-50"
                >
                  10k - 50k
                </button>
                <button
                  onClick={() => setPriceRange({ min: 50000, max: 100000 })}
                  className="p-2 text-gray-600 border border-gray-200 rounded hover:bg-gray-50"
                >
                  50k - 100k
                </button>
                <button
                  onClick={() => setPriceRange({ min: 100000, max: 200000 })}
                  className="p-2 text-gray-600 border border-gray-200 rounded hover:bg-gray-50"
                >
                  &gt; 100k
                </button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Marques */}
        <Card>
          <CardContent className="p-4">
            <h3 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
              🏷️ Marques
            </h3>
            <div className="space-y-2">
              <button
                onClick={() => setSelectedBrand('')}
                className={`block w-full text-left p-2 rounded transition-colors ${
                  selectedBrand === ''
                    ? 'bg-[#2d7a3e] text-white'
                    : 'hover:bg-gray-100 text-gray-700'
                }`}
              >
                <span className="text-sm">Toutes les marques</span>
              </button>
              {brands.map((brand) => (
                <button
                  key={brand}
                  onClick={() => setSelectedBrand(brand)}
                  className={`block w-full text-left p-2 rounded transition-colors ${
                    selectedBrand === brand
                      ? 'bg-[#2d7a3e] text-white'
                      : 'hover:bg-gray-100 text-gray-700'
                  }`}
                >
                  <span className="text-sm">{brand}</span>
                </button>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Bouton effacer filtres */}
        {(selectedCategory !== 'all' || selectedBrand || searchQuery || priceRange.min > 0 || priceRange.max < 200000) && (
          <Button
            variant="outline"
            onClick={clearFilters}
            className="w-full text-red-600 border-red-200 hover:bg-red-50"
          >
            <X size={16} className="mr-2" />
            Effacer tous les filtres
          </Button>
        )}
      </div>
    </div>
  );
}