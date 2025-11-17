import { useState, useEffect } from 'react';
import { Plus, Edit2, Trash2, X, Save, AlertCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { apiService, Product } from '@/services/api';

export default function AdminPanel() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isAddingProduct, setIsAddingProduct] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formData, setFormData] = useState<Partial<Product>>({
    name: '',
    price: 0,
    category: 'Alimentaire',
    description: '',
    image: '',
    stockQuantity: 0,
  });

  // Load products from API
  useEffect(() => {
    loadProducts();
  }, []);

  const loadProducts = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await apiService.getProducts();
      setProducts(data);
    } catch (err) {
      setError('Erreur lors du chargement des produits');
      console.error('Error loading products:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleAddProduct = async () => {
    if (!formData.name || !formData.price || !formData.image) {
      setError('Veuillez remplir tous les champs obligatoires');
      return;
    }

    setLoading(true);
    setError(null);
    
    try {
      const productData = {
        name: formData.name!,
        price: formData.price!,
        category: formData.category || 'Alimentaire',
        description: formData.description || '',
        image: formData.image!,
        images: [formData.image!],
        stockQuantity: formData.stockQuantity || 0,
        inStock: (formData.stockQuantity || 0) > 0,
        tags: [],
      };

      const newProduct = await apiService.createProduct(productData);
      if (newProduct) {
        await loadProducts(); // Reload products
        setFormData({ name: '', price: 0, category: 'Alimentaire', description: '', image: '', stockQuantity: 0 });
        setIsAddingProduct(false);
      } else {
        setError('Erreur lors de l\'ajout du produit');
      }
    } catch (err) {
      setError('Erreur lors de l\'ajout du produit');
      console.error('Error adding product:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleEditProduct = (product: Product) => {
    setEditingId(product._id || product.id || '');
    setFormData({
      name: product.name,
      price: product.price,
      category: product.category,
      description: product.description,
      image: product.image,
      stockQuantity: product.stockQuantity,
    });
  };

  const handleSaveEdit = async () => {
    if (!editingId || !formData.name || !formData.price) {
      setError('Veuillez remplir tous les champs obligatoires');
      return;
    }

    setLoading(true);
    setError(null);
    
    try {
      const updateData = {
        name: formData.name,
        price: formData.price,
        category: formData.category,
        description: formData.description,
        image: formData.image,
        stockQuantity: formData.stockQuantity,
        inStock: (formData.stockQuantity || 0) > 0,
      };

      const updatedProduct = await apiService.updateProduct(editingId, updateData);
      if (updatedProduct) {
        await loadProducts(); // Reload products
        setEditingId(null);
        setFormData({ name: '', price: 0, category: 'Alimentaire', description: '', image: '', stockQuantity: 0 });
      } else {
        setError('Erreur lors de la modification du produit');
      }
    } catch (err) {
      setError('Erreur lors de la modification du produit');
      console.error('Error updating product:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteProduct = async (id: string) => {
    if (!window.confirm('Êtes-vous sûr de vouloir supprimer ce produit ?')) {
      return;
    }

    setLoading(true);
    setError(null);
    
    try {
      const success = await apiService.deleteProduct(id);
      if (success) {
        await loadProducts(); // Reload products
      } else {
        setError('Erreur lors de la suppression du produit');
      }
    } catch (err) {
      setError('Erreur lors de la suppression du produit');
      console.error('Error deleting product:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleCancelEdit = () => {
    setEditingId(null);
    setIsAddingProduct(false);
    setFormData({ name: '', price: 0, category: 'Alimentaire', description: '', image: '', stockQuantity: 0 });
  };

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900">Gestion des Produits</h1>
          <p className="text-gray-600 mt-2">Ajouter, modifier ou supprimer les produits alimentaires africains</p>
        </div>

        {/* Error Alert */}
        {error && (
          <div className="mb-6 bg-red-50 border border-red-200 rounded-lg p-4 flex items-center gap-3">
            <AlertCircle className="text-red-500" size={20} />
            <span className="text-red-700">{error}</span>
            <button 
              onClick={() => setError(null)}
              className="ml-auto text-red-500 hover:text-red-700"
            >
              <X size={16} />
            </button>
          </div>
        )}

        {/* Loading */}
        {loading && (
          <div className="mb-6 text-center">
            <div className="inline-flex items-center gap-2">
              <div className="animate-spin rounded-full h-5 w-5 border-2 border-[#2d7a3e] border-t-transparent"></div>
              <span className="text-gray-600">Chargement...</span>
            </div>
          </div>
        )}

        <Tabs defaultValue="products" className="w-full">
          <TabsList className="grid w-full grid-cols-2 mb-8">
            <TabsTrigger value="products">Tous les Produits</TabsTrigger>
            <TabsTrigger value="add">Ajouter un Produit</TabsTrigger>
          </TabsList>

          {/* Products List Tab */}
          <TabsContent value="products">
            <div className="space-y-4">
              {products.length === 0 ? (
                <div className="bg-white rounded-lg shadow-md p-8 text-center">
                  <p className="text-gray-600">Aucun produit trouvé. Commencez par en ajouter un !</p>
                </div>
              ) : (
                products.map(product => (
                  <div key={product.id} className="bg-white rounded-lg shadow-md p-6">
                    {editingId === product.id ? (
                      <div className="space-y-4">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div>
                            <label className="block text-sm font-semibold text-gray-900 mb-2">Nom du Produit</label>
                            <input
                              type="text"
                              value={formData.name || ''}
                              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#2d7a3e]"
                            />
                          </div>
                          <div>
                            <label className="block text-sm font-semibold text-gray-900 mb-2">Prix</label>
                            <input
                              type="number"
                              value={formData.price || 0}
                              onChange={(e) => setFormData({ ...formData, price: parseFloat(e.target.value) })}
                              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#2d7a3e]"
                            />
                          </div>
                          <div>
                            <label className="block text-sm font-semibold text-gray-900 mb-2">Catégorie</label>
                            <select
                              value={formData.category || 'Alimentaire'}
                              onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#2d7a3e]"
                            >
                              <option value="Alimentaire">Alimentaire</option>
                              <option value="Électroménager">Électroménager</option>
                            </select>
                          </div>
                          <div>
                            <label className="block text-sm font-semibold text-gray-900 mb-2">Stock</label>
                            <input
                              type="number"
                              value={formData.stockQuantity || 0}
                              onChange={(e) => setFormData({ ...formData, stockQuantity: parseInt(e.target.value) })}
                              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#2d7a3e]"
                            />
                          </div>
                          <div className="md:col-span-2">
                            <label className="block text-sm font-semibold text-gray-900 mb-2">Description</label>
                            <textarea
                              value={formData.description || ''}
                              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#2d7a3e]"
                              rows={3}
                            />
                          </div>
                          <div className="md:col-span-2">
                            <label className="block text-sm font-semibold text-gray-900 mb-2">URL de l'Image</label>
                            <input
                              type="text"
                              value={formData.image || ''}
                              onChange={(e) => setFormData({ ...formData, image: e.target.value })}
                              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#2d7a3e]"
                            />
                          </div>
                        </div>
                        <div className="flex gap-4 pt-4">
                          <Button
                            onClick={handleSaveEdit}
                            className="flex-1 bg-[#2d7a3e] hover:bg-[#1f5028] text-white flex items-center justify-center gap-2"
                          >
                            <Save size={18} />
                            Enregistrer
                          </Button>
                          <Button onClick={handleCancelEdit} variant="outline" className="flex-1">
                            Annuler
                          </Button>
                        </div>
                      </div>
                    ) : (
                      <div className="flex flex-col md:flex-row gap-6">
                        <img
                          src={(img => {
                            if (!img) return '/images/placeholder.jpg';
                            if (img.startsWith('http') || img.startsWith('data:')) return img;
                            const base = import.meta.env.VITE_API_BASE_URL || '';
                            return base ? `${base}${img}` : img;
                          })(product.image)}
                          alt={product.name}
                          className="w-32 h-32 object-cover rounded-lg"
                        />
                        <div className="flex-1">
                          <div className="flex items-start justify-between mb-2">
                            <div>
                              <h3 className="text-xl font-bold text-gray-900">{product.name}</h3>
                              <span className="inline-block mt-1 px-3 py-1 bg-[#e8f5e9] text-[#2d7a3e] text-sm font-semibold rounded">
                                {product.category}
                              </span>
                            </div>
                            <div className="text-right">
                              <p className="text-2xl font-bold text-[#2d7a3e]">${product.price.toFixed(2)}</p>
                              <p className="text-sm text-gray-600">Stock: {product.stockQuantity || 0}</p>
                            </div>
                          </div>
                          <p className="text-gray-600 mb-4">{product.description}</p>
                          <div className="flex gap-2">
                            <Button
                              onClick={() => handleEditProduct(product)}
                              className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white"
                            >
                              <Edit2 size={18} />
                              Modifier
                            </Button>
                            <Button
                              onClick={() => handleDeleteProduct(product.id)}
                              className="flex items-center gap-2 bg-red-600 hover:bg-red-700 text-white"
                            >
                              <Trash2 size={18} />
                              Supprimer
                            </Button>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                ))
              )}
            </div>
          </TabsContent>

          {/* Add Product Tab */}
          <TabsContent value="add">
            <div className="bg-white rounded-lg shadow-md p-8">
              <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-semibold text-gray-900 mb-2">Nom du Produit *</label>
                    <input
                      type="text"
                      placeholder="Ex: Riz Blanc Premium"
                      value={formData.name || ''}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#2d7a3e]"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-900 mb-2">Prix *</label>
                    <input
                      type="number"
                      placeholder="0.00"
                      value={formData.price || ''}
                      onChange={(e) => setFormData({ ...formData, price: parseFloat(e.target.value) })}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#2d7a3e]"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-900 mb-2">Catégorie</label>
                    <select
                      value={formData.category || 'Alimentaire'}
                      onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#2d7a3e]"
                    >
                      <option value="Alimentaire">Alimentaire</option>
                      <option value="Électroménager">Électroménager</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-900 mb-2">Stock</label>
                    <input
                      type="number"
                      placeholder="0"
                      value={formData.stockQuantity || ''}
                      onChange={(e) => setFormData({ ...formData, stockQuantity: parseInt(e.target.value) })}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#2d7a3e]"
                    />
                  </div>
                  <div className="md:col-span-2">
                    <label className="block text-sm font-semibold text-gray-900 mb-2">Description</label>
                    <textarea
                      placeholder="Décrivez le produit..."
                      value={formData.description || ''}
                      onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#2d7a3e]"
                      rows={4}
                    />
                  </div>
                  <div className="md:col-span-2">
                    <label className="block text-sm font-semibold text-gray-900 mb-2">URL de l'Image *</label>
                    <input
                      type="text"
                      placeholder="https://..."
                      value={formData.image || ''}
                      onChange={(e) => setFormData({ ...formData, image: e.target.value })}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#2d7a3e]"
                    />
                  </div>
                </div>
                <div className="flex gap-4 pt-4">
                  <Button
                    onClick={handleAddProduct}
                    className="flex-1 bg-[#2d7a3e] hover:bg-[#1f5028] text-white flex items-center justify-center gap-2 py-3"
                  >
                    <Plus size={18} />
                    Ajouter le Produit
                  </Button>
                </div>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}