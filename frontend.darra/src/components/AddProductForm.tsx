import { useState } from 'react';
import { Plus, Save, ArrowLeft, Package, Tag, DollarSign, FileText, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardContent, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import ImageUpload from './ImageUpload';

interface AddProductFormProps {
  onSubmit: (productData: FormData) => Promise<void>;
  onCancel?: () => void;
  isLoading?: boolean;
}

interface ProductFormData {
  name: string;
  description: string;
  price: number;
  currency: 'EUR' | 'FCFA';
  category: string;
  brand: string;
  stock: number;
  tags: string[];
  images: File[];
}

const CATEGORIES = [
  { id: 'cosmetiques', name: '💄 Cosmétiques', description: 'Rouge à lèvres, fond de teint, mascara...' },
  { id: 'parfums', name: '🌸 Parfums', description: 'Parfums femme, homme, unisexe...' },
  { id: 'soins-du-visage', name: '✨ Soins du visage', description: 'Crèmes anti-âge, sérums, masques...' },
  { id: 'soins-du-corps', name: '🧴 Soins du corps', description: 'Gels douche, crèmes hydratantes...' },
  { id: 'cheveux', name: '💇 Soins cheveux', description: 'Shampooings, après-shampooings, masques...' },
  { id: 'alimentaire', name: '🥘 Alimentaire', description: 'Épices, huiles, céréales africaines...' },
  { id: 'electronique', name: '📱 Électroménager', description: 'Téléphones, ordinateurs, accessoires...' },
  { id: 'vetements', name: '👕 Vêtements', description: 'Habits traditionnels et modernes...' },
  { id: 'chaussures', name: '👟 Chaussures', description: 'Sneakers, sandales, chaussures de ville...' },
  { id: 'maison-decoration', name: '🏡 Maison & Déco', description: 'Artisanat, décoration africaine...' }
];

// Taux de conversion EUR vers FCFA (approximatif)
const EUR_TO_FCFA = 656.0;

const POPULAR_BRANDS = [
  'L\'Oréal', 'Maybelline', 'Chanel', 'Dior', 'Nivea', 'Garnier',
  'Nike', 'Adidas', 'Puma', 'Samsung', 'Apple', 'Huawei',
  'Zara', 'H&M', 'Uniqlo', 'Aucune marque'
];

export default function AddProductForm({ onSubmit, onCancel, isLoading = false }: AddProductFormProps) {
  const [formData, setFormData] = useState<ProductFormData>({
    name: '',
    description: '',
    price: 0,
    currency: 'FCFA',
    category: '',
    brand: '',
    stock: 1,
    tags: [],
    images: []
  });

  const [currentTag, setCurrentTag] = useState('');
  const [errors, setErrors] = useState<Record<string, string>>({});

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!formData.name.trim()) {
      newErrors.name = 'Le nom du produit est requis';
    }

    if (!formData.description.trim()) {
      newErrors.description = 'La description est requise';
    }

    if (formData.price <= 0) {
      newErrors.price = 'Le prix doit être supérieur à 0';
    }

    if (!formData.category) {
      newErrors.category = 'Veuillez sélectionner une catégorie';
    }

    if (!formData.brand.trim()) {
      newErrors.brand = 'La marque est requise';
    }

    if (formData.stock < 0) {
      newErrors.stock = 'Le stock ne peut pas être négatif';
    }

    if (formData.images.length === 0) {
      newErrors.images = 'Au moins une image est requise';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    // Créer FormData pour l'envoi
    const submitData = new FormData();
    submitData.append('name', formData.name.trim());
    submitData.append('description', formData.description.trim());
    
    // Convertir le prix en FCFA pour l'API si nécessaire
    const priceInFCFA = formData.currency === 'EUR' 
      ? Math.round(formData.price * EUR_TO_FCFA)
      : formData.price;
    submitData.append('price', priceInFCFA.toString());
    submitData.append('currency', formData.currency);
    
    submitData.append('category', formData.category);
    submitData.append('brand', formData.brand.trim());
    submitData.append('stock', formData.stock.toString());
    submitData.append('tags', JSON.stringify(formData.tags));

    // Ajouter les images
    formData.images.forEach((image, index) => {
      submitData.append('images', image);
    });

    await onSubmit(submitData);
  };

  const addTag = () => {
    if (currentTag.trim() && !formData.tags.includes(currentTag.trim())) {
      setFormData(prev => ({
        ...prev,
        tags: [...prev.tags, currentTag.trim()]
      }));
      setCurrentTag('');
    }
  };

  const removeTag = (tagToRemove: string) => {
    setFormData(prev => ({
      ...prev,
      tags: prev.tags.filter(tag => tag !== tagToRemove)
    }));
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      addTag();
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        {onCancel && (
          <Button variant="outline" onClick={onCancel}>
            <ArrowLeft className="w-4 h-4 mr-2" />
            Retour
          </Button>
        )}
        <div>
          <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
            <Plus className="w-6 h-6" />
            Ajouter un nouveau produit
          </h1>
          <p className="text-gray-600">Ajoutez un produit à votre catalogue</p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Informations générales */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Package className="w-5 h-5" />
                Informations générales
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Nom */}
              <div>
                <Label htmlFor="name">Nom du produit *</Label>
                <Input
                  id="name"
                  value={formData.name}
                  onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                  placeholder="Ex: Rouge à lèvres mat longue tenue"
                  className={errors.name ? 'border-red-500' : ''}
                />
                {errors.name && <p className="text-red-500 text-sm mt-1">{errors.name}</p>}
              </div>

              {/* Description */}
              <div>
                <Label htmlFor="description">Description *</Label>
                <Textarea
                  id="description"
                  value={formData.description}
                  onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                  placeholder="Décrivez votre produit en détail..."
                  rows={4}
                  className={errors.description ? 'border-red-500' : ''}
                />
                {errors.description && <p className="text-red-500 text-sm mt-1">{errors.description}</p>}
              </div>

              {/* Prix avec Devise et Stock */}
              <div className="grid grid-cols-3 gap-4">
                <div>
                  <Label htmlFor="currency">Devise *</Label>
                  <select
                    id="currency"
                    value={formData.currency}
                    onChange={(e) => {
                      const newCurrency = e.target.value as 'EUR' | 'FCFA';
                      setFormData(prev => {
                        let newPrice = prev.price;
                        // Conversion automatique
                        if (prev.currency === 'EUR' && newCurrency === 'FCFA') {
                          newPrice = Math.round(prev.price * EUR_TO_FCFA);
                        } else if (prev.currency === 'FCFA' && newCurrency === 'EUR') {
                          newPrice = Math.round((prev.price / EUR_TO_FCFA) * 100) / 100;
                        }
                        return { ...prev, currency: newCurrency, price: newPrice };
                      });
                    }}
                    className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                  >
                    <option value="FCFA">🇫🇷 FCFA (Francs CFA)</option>
                    <option value="EUR">💶 EUR (Euros)</option>
                  </select>
                </div>
                <div>
                  <Label htmlFor="price">Prix ({formData.currency}) *</Label>
                  <Input
                    id="price"
                    type="number"
                    step={formData.currency === 'EUR' ? '0.01' : '1'}
                    value={formData.price}
                    onChange={(e) => setFormData(prev => ({ ...prev, price: Number(e.target.value) }))}
                    placeholder={formData.currency === 'EUR' ? '0.00' : '0'}
                    className={errors.price ? 'border-red-500' : ''}
                  />
                  {errors.price && <p className="text-red-500 text-sm mt-1">{errors.price}</p>}
                  {formData.currency === 'EUR' && formData.price > 0 && (
                    <p className="text-sm text-muted-foreground mt-1">
                      ≈ {Math.round(formData.price * EUR_TO_FCFA)} FCFA
                    </p>
                  )}
                  {formData.currency === 'FCFA' && formData.price > 0 && (
                    <p className="text-sm text-muted-foreground mt-1">
                      ≈ {Math.round((formData.price / EUR_TO_FCFA) * 100) / 100} EUR
                    </p>
                  )}
                </div>
                <div>
                  <Label htmlFor="stock">Stock disponible</Label>
                  <Input
                    id="stock"
                    type="number"
                    value={formData.stock}
                    onChange={(e) => setFormData(prev => ({ ...prev, stock: Number(e.target.value) }))}
                    placeholder="1"
                    min="0"
                    className={errors.stock ? 'border-red-500' : ''}
                  />
                  {errors.stock && <p className="text-red-500 text-sm mt-1">{errors.stock}</p>}
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Catégorie et Marque */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Tag className="w-5 h-5" />
                Catégorie et Marque
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Catégorie */}
              <div>
                <Label htmlFor="category">Catégorie *</Label>
                <select
                  id="category"
                  value={formData.category}
                  onChange={(e) => setFormData(prev => ({ ...prev, category: e.target.value }))}
                  className={`w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#2d7a3e] focus:border-transparent ${
                    errors.category ? 'border-red-500' : ''
                  }`}
                >
                  <option value="">Sélectionner une catégorie</option>
                  {CATEGORIES.map((cat) => (
                    <option key={cat.id} value={cat.id}>
                      {cat.name}
                    </option>
                  ))}
                </select>
                {formData.category && (
                  <p className="text-gray-600 text-sm mt-1">
                    {CATEGORIES.find(cat => cat.id === formData.category)?.description}
                  </p>
                )}
                {errors.category && <p className="text-red-500 text-sm mt-1">{errors.category}</p>}
              </div>

              {/* Marque */}
              <div>
                <Label htmlFor="brand">Marque *</Label>
                <Input
                  id="brand"
                  list="brands"
                  value={formData.brand}
                  onChange={(e) => setFormData(prev => ({ ...prev, brand: e.target.value }))}
                  placeholder="Ex: L'Oréal"
                  className={errors.brand ? 'border-red-500' : ''}
                />
                <datalist id="brands">
                  {POPULAR_BRANDS.map((brand) => (
                    <option key={brand} value={brand} />
                  ))}
                </datalist>
                {errors.brand && <p className="text-red-500 text-sm mt-1">{errors.brand}</p>}
              </div>

              {/* Tags */}
              <div>
                <Label htmlFor="tags">Étiquettes</Label>
                <div className="flex gap-2 mb-2">
                  <Input
                    id="tags"
                    value={currentTag}
                    onChange={(e) => setCurrentTag(e.target.value)}
                    onKeyPress={handleKeyPress}
                    placeholder="Ajouter une étiquette..."
                  />
                  <Button type="button" onClick={addTag} variant="outline">
                    Ajouter
                  </Button>
                </div>
                {formData.tags.length > 0 && (
                  <div className="flex flex-wrap gap-2">
                    {formData.tags.map((tag) => (
                      <span
                        key={tag}
                        className="inline-flex items-center gap-1 px-2 py-1 bg-[#2d7a3e] text-white text-sm rounded-full"
                      >
                        {tag}
                        <button
                          type="button"
                          onClick={() => removeTag(tag)}
                          className="text-white hover:text-gray-200"
                        >
                          ×
                        </button>
                      </span>
                    ))}
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Images */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <FileText className="w-5 h-5" />
              Images du produit *
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ImageUpload
              onImagesChange={(images) => setFormData(prev => ({ ...prev, images }))}
              maxImages={5}
              maxSize={5}
            />
            {errors.images && <p className="text-red-500 text-sm mt-1">{errors.images}</p>}
          </CardContent>
        </Card>

        {/* Actions */}
        <div className="flex items-center justify-end gap-4 pt-6 border-t">
          {onCancel && (
            <Button type="button" variant="outline" onClick={onCancel}>
              Annuler
            </Button>
          )}
          <Button
            type="submit"
            disabled={isLoading}
            className="bg-[#2d7a3e] hover:bg-[#235230]"
          >
            {isLoading ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                Ajout en cours...
              </>
            ) : (
              <>
                <Save className="w-4 h-4 mr-2" />
                Ajouter le produit
              </>
            )}
          </Button>
        </div>
      </form>
    </div>
  );
}