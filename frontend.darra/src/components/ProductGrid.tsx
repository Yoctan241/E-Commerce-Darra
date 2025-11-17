import { useState, useEffect } from 'react';
import { Plus, Search, Filter, Grid, List, SortAsc } from 'lucide-react';
import ProductCard, { Product } from './ProductCard';
import ProductFilters from './ProductFilters';
import AddProductForm from './AddProductForm';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

interface ProductGridProps {
  onAddToCart?: (product: Product) => void;
  onViewDetails?: (product: Product) => void;
}

export default function ProductGrid({ onAddToCart, onViewDetails }: ProductGridProps) {
  const [products, setProducts] = useState<Product[]>([]);
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [sortBy, setSortBy] = useState<string>('name');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [showAddForm, setShowAddForm] = useState(false);
  const [showMobileFilters, setShowMobileFilters] = useState(false);
  const [currentFilters, setCurrentFilters] = useState<any>({});

  useEffect(() => {
    loadProducts();
  }, []);

  useEffect(() => {
    filterProducts();
  }, [products, currentFilters, sortBy]);

  const loadProducts = async () => {
    setLoading(true);
    setError(null);
    try {
      console.log('🔄 Chargement des produits depuis l\'API...');
      const response = await fetch('http://localhost:5000/api/products');
      
      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }
      
      const apiResponse = await response.json();
      console.log('📦 Réponse API reçue:', apiResponse);
      
      // Notre API retourne { success: true, data: [...], meta: {...} }
      if (apiResponse.success && apiResponse.data) {
        setProducts(apiResponse.data);
        console.log(`✅ ${apiResponse.data.length} produits chargés`);
      } else {
        throw new Error('Format de réponse API invalide');
      }
    } catch (err) {
      const errorMsg = err instanceof Error ? err.message : 'Erreur de connexion au serveur';
      setError(errorMsg);
      console.error('❌ Erreur chargement produits:', errorMsg);
    } finally {
      setLoading(false);
    }
  };

  const filterProducts = () => {
    let filtered = [...products];

    if (currentFilters.category) {
      filtered = filtered.filter(product => product.category === currentFilters.category);
    }

    if (currentFilters.searchQuery) {
      const query = currentFilters.searchQuery.toLowerCase();
      filtered = filtered.filter(product =>
        product.name.toLowerCase().includes(query) ||
        (product.description && product.description.toLowerCase().includes(query)) ||
        product.category.toLowerCase().includes(query) ||
        (product.brand && product.brand.toLowerCase().includes(query))
      );
    }

    if (currentFilters.brand) {
      filtered = filtered.filter(product => product.brand === currentFilters.brand);
    }

    if (currentFilters.priceRange) {
      filtered = filtered.filter(product => 
        product.price >= currentFilters.priceRange.min && 
        product.price <= currentFilters.priceRange.max
      );
    }

    filtered.sort((a, b) => {
      switch (sortBy) {
        case 'price-asc':
          return a.price - b.price;
        case 'price-desc':
          return b.price - a.price;
        case 'name':
          return a.name.localeCompare(b.name);
        case 'category':
          return a.category.localeCompare(b.category);
        case 'rating':
          return (b.rating || 0) - (a.rating || 0);
        default:
          return 0;
      }
    });

    setFilteredProducts(filtered);
  };

  const handleFiltersChange = (filters: any) => {
    setCurrentFilters(filters);
  };

  const handleAddProduct = async (productData: FormData) => {
    try {
      console.log('➕ Ajout d\'un nouveau produit...');
      const response = await fetch('http://localhost:5000/api/products', {
        method: 'POST',
        body: productData,
      });

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }

      const apiResponse = await response.json();
      console.log('✅ Produit ajouté:', apiResponse);
      
      if (apiResponse.success) {
        setShowAddForm(false);
        await loadProducts(); // Recharger les produits
        alert('Produit ajouté avec succès !');
      } else {
        throw new Error(apiResponse.message || 'Erreur lors de l\'ajout du produit');
      }
    } catch (err) {
      const errorMsg = err instanceof Error ? err.message : 'Erreur de connexion au serveur';
      console.error('❌ Erreur ajout produit:', errorMsg);
      alert(errorMsg);
    }
  };

  if (showAddForm) {
    return (
      <section className="bg-gradient-to-br from-orange-50 to-red-50 py-16">
        <div className="max-w-7xl mx-auto px-4">
          <AddProductForm
            onSubmit={handleAddProduct}
            onCancel={() => setShowAddForm(false)}
          />
        </div>
      </section>
    );
  }

  if (loading) {
    return (
      <section className="bg-gradient-to-br from-orange-50 to-red-50 py-16">
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {[...Array(8)].map((_, index) => (
              <div key={index} className="animate-pulse">
                <div className="bg-gray-300 rounded-lg h-64 mb-4"></div>
                <div className="h-4 bg-gray-300 rounded mb-2"></div>
                <div className="h-4 bg-gray-300 rounded w-2/3 mb-2"></div>
                <div className="h-6 bg-gray-300 rounded w-1/3"></div>
              </div>
            ))}
          </div>
        </div>
      </section>
    );
  }

  if (error) {
    return (
      <section className="bg-gradient-to-br from-orange-50 to-red-50 py-16">
        <div className="max-w-7xl mx-auto px-4">
          <Card>
            <CardContent className="p-12 text-center">
              <div className="text-red-500 mb-4">⚠️</div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Erreur de chargement</h3>
              <p className="text-gray-600 mb-4">{error}</p>
              <Button onClick={loadProducts} className="bg-[#2d7a3e] hover:bg-[#1f5028] text-white">
                Réessayer
              </Button>
            </CardContent>
          </Card>
        </div>
      </section>
    );
  }

  return (
    <section className="bg-gradient-to-br from-orange-50 to-red-50 py-16">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Sidebar Filtres - Desktop */}
          <div className="lg:w-80 lg:flex-shrink-0 hidden lg:block">
            <div className="sticky top-4">
              <ProductFilters onFiltersChange={handleFiltersChange} />
            </div>
          </div>

          {/* Contenu principal */}
          <div className="flex-1">
            {/* Header */}
            <div className="mb-8">
              <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 mb-6">
                <div>
                  <h2 className="text-3xl font-bold text-gray-900 mb-2">
                    Nos Produits
                  </h2>
                  <p className="text-gray-600">
                    Découvrez notre sélection de produits cosmétiques et alimentaires de qualité
                  </p>
                </div>
                
                <Button
                  onClick={() => setShowAddForm(true)}
                  className="bg-[#2d7a3e] hover:bg-[#235230] text-white"
                >
                  <Plus className="w-4 h-4 mr-2" />
                  Ajouter un produit
                </Button>
              </div>

              <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="flex items-center gap-2">
                    <SortAsc size={20} className="text-gray-400" />
                    <select
                      value={sortBy}
                      onChange={(e) => setSortBy(e.target.value)}
                      className="px-3 py-2 border border-gray-300 rounded-lg bg-white focus:ring-2 focus:ring-[#2d7a3e] focus:border-transparent"
                    >
                      <option value="name">Nom A-Z</option>
                      <option value="price-asc">Prix croissant</option>
                      <option value="price-desc">Prix décroissant</option>
                      <option value="category">Catégorie</option>
                      <option value="rating">Mieux noté</option>
                    </select>
                  </div>

                  <div className="flex bg-white rounded-lg shadow-sm border">
                    <Button
                      variant={viewMode === 'grid' ? 'default' : 'ghost'}
                      size="sm"
                      onClick={() => setViewMode('grid')}
                      className={viewMode === 'grid' ? 'bg-[#2d7a3e] text-white' : 'text-gray-600'}
                    >
                      <Grid size={16} />
                    </Button>
                    <Button
                      variant={viewMode === 'list' ? 'default' : 'ghost'}
                      size="sm"
                      onClick={() => setViewMode('list')}
                      className={viewMode === 'list' ? 'bg-[#2d7a3e] text-white' : 'text-gray-600'}
                    >
                      <List size={16} />
                    </Button>
                  </div>
                </div>

                <Button
                  variant="outline"
                  onClick={() => setShowMobileFilters(!showMobileFilters)}
                  className="lg:hidden flex items-center gap-2"
                >
                  <Filter size={16} />
                  Filtres
                </Button>
              </div>
            </div>

            {/* Filtres mobiles */}
            {showMobileFilters && (
              <div className="lg:hidden mb-6 p-4 bg-white rounded-lg shadow-md">
                <ProductFilters onFiltersChange={handleFiltersChange} />
              </div>
            )}

            {/* Results Count */}
            <div className="mb-6">
              <p className="text-gray-600">
                {filteredProducts.length} produit{filteredProducts.length > 1 ? 's' : ''} trouvé{filteredProducts.length > 1 ? 's' : ''}
                {currentFilters.category && ` dans la catégorie "${currentFilters.category}"`}
                {currentFilters.searchQuery && ` pour "${currentFilters.searchQuery}"`}
              </p>
              
              {Object.keys(currentFilters).length > 0 && (
                <div className="flex flex-wrap gap-2 mt-2">
                  {currentFilters.category && (
                    <Badge variant="secondary" className="bg-[#2d7a3e] text-white">
                      Catégorie: {currentFilters.category}
                    </Badge>
                  )}
                  {currentFilters.brand && (
                    <Badge variant="secondary" className="bg-[#2d7a3e] text-white">
                      Marque: {currentFilters.brand}
                    </Badge>
                  )}
                  {currentFilters.priceRange && (
                    <Badge variant="secondary" className="bg-[#2d7a3e] text-white">
                      Prix: {currentFilters.priceRange.min} - {currentFilters.priceRange.max} FCFA
                    </Badge>
                  )}
                </div>
              )}
            </div>

            {/* Products Grid */}
            {filteredProducts.length === 0 ? (
              <Card>
                <CardContent className="p-12 text-center">
                  <div className="text-gray-400 mb-4 text-6xl">🔍</div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">Aucun produit trouvé</h3>
                  <p className="text-gray-600 mb-4">
                    Essayez de modifier vos filtres ou votre terme de recherche.
                  </p>
                  <Button 
                    onClick={() => setCurrentFilters({})}
                    variant="outline"
                    className="text-[#2d7a3e] border-[#2d7a3e] hover:bg-[#e8f5e9]"
                  >
                    Réinitialiser les filtres
                  </Button>
                </CardContent>
              </Card>
            ) : (
              <div 
                className={
                  viewMode === 'grid' 
                    ? 'grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 gap-6'
                    : 'space-y-4'
                }
              >
                {filteredProducts.map((product) => (
                  <ProductCard
                    key={product.id}
                    product={product}
                    onAddToCart={onAddToCart}
                    onViewDetails={onViewDetails}
                  />
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}