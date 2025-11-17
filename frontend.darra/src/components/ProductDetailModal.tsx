import { X, Heart, ShoppingCart } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useState, useEffect } from 'react';
import { Product } from './ProductCard';
import { apiService, Product as ApiProduct } from '@/services/api';

interface ProductDetailModalProps {
  isOpen: boolean;
  onClose: () => void;
  product?: Product;
  onAddToCart?: (product: Product, quantity: number, variant: string) => void;
}

export default function ProductDetailModal({
  isOpen,
  onClose,
  product,
  onAddToCart,
}: ProductDetailModalProps) {
  const [quantity, setQuantity] = useState(1);
  const [selectedSize, setSelectedSize] = useState('M');
  const [isFavorite, setIsFavorite] = useState(false);
  const [productDetails, setProductDetails] = useState<ApiProduct | null>(null);
  const [loading, setLoading] = useState(false);

  // Load full product details when modal opens
  useEffect(() => {
    if (isOpen && product?.id) {
      loadProductDetails(product.id);
    }
  }, [isOpen, product?.id]);

  const loadProductDetails = async (productId: string) => {
    setLoading(true);
    try {
      const details = await apiService.getProduct(productId);
      setProductDetails(details);
    } catch (error) {
      console.error('Error loading product details:', error);
    } finally {
      setLoading(false);
    }
  };

  if (!product) return null;

  const sizes = ['XS', 'S', 'M', 'L', 'XL', 'XXL'];

  return (
    <>
      {/* Overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 transition-opacity"
          onClick={onClose}
        />
      )}

      {/* Modal */}
      <div
        className={`fixed inset-0 z-50 flex items-center justify-center p-4 transition-opacity ${
          isOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'
        }`}
      >
        <div className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto">
          {/* Header */}
          <div className="flex items-center justify-between p-6 border-b border-gray-200 sticky top-0 bg-white">
            <h2 className="text-2xl font-bold text-gray-900">Product Details</h2>
            <button
              onClick={onClose}
              className="p-2 hover:bg-gray-100 rounded-lg transition"
            >
              <X size={24} />
            </button>
          </div>

          {/* Content */}
          <div className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {/* Image Gallery */}
              <div className="flex flex-col gap-4">
                <div className="relative h-96 bg-gray-100 rounded-lg overflow-hidden">
                  <img
                    src={product.image}
                    alt={product.name}
                    className="w-full h-full object-cover"
                  />
                  <button
                    onClick={() => setIsFavorite(!isFavorite)}
                    className="absolute top-4 right-4 p-3 bg-white rounded-full shadow-md hover:bg-gray-100 transition"
                  >
                    <Heart
                      size={24}
                      className={isFavorite ? 'fill-red-500 text-red-500' : 'text-gray-400'}
                    />
                  </button>
                </div>
                <div className="grid grid-cols-3 gap-2">
                  {[product.image, product.image, product.image].map((img, i) => (
                    <img
                      key={i}
                      src={img}
                      alt={`View ${i + 1}`}
                      className="h-20 object-cover rounded-lg cursor-pointer hover:opacity-75 transition"
                    />
                  ))}
                </div>
              </div>

              {/* Product Info */}
              <div className="flex flex-col gap-6">
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <h1 className="text-3xl font-bold text-gray-900">{product.name}</h1>
                  </div>
                  <p className="text-sm text-gray-500 mb-4">{product.category}</p>

                  {/* Rating */}
                  <div className="flex items-center gap-2 mb-4">
                    <div className="flex text-yellow-400">
                      {[...Array(5)].map((_, i) => (
                        <span key={i}>{i < (product.rating || 0) ? '★' : '☆'}</span>
                      ))}
                    </div>
                    <span className="text-sm text-gray-500">({product.reviews} reviews)</span>
                  </div>

                  {/* Price */}
                  <p className="text-4xl font-bold text-[#2d7a3e] mb-6">
                    ${product.price.toFixed(2)}
                  </p>

                  {/* Description */}
                  {loading ? (
                    <div className="bg-gray-100 rounded-lg p-4 animate-pulse">
                      <div className="h-4 bg-gray-300 rounded mb-2"></div>
                      <div className="h-4 bg-gray-300 rounded mb-2"></div>
                      <div className="h-4 bg-gray-300 rounded w-3/4"></div>
                    </div>
                  ) : (
                    <div className="bg-gray-50 rounded-lg p-4">
                      <h4 className="font-semibold text-gray-900 mb-2">Description</h4>
                      <p className="text-gray-600 leading-relaxed">
                        {productDetails?.description || 
                         `Découvrez notre ${product.name} de qualité exceptionnelle. Ce produit africain authentique vous offre une expérience unique avec des saveurs et des propriétés nutritionnelles remarquables. Soigneusement sélectionné pour sa fraîcheur et sa qualité, il représente le meilleur de nos traditions culinaires africaines.`}
                      </p>
                      
                      {/* Nutritional Info */}
                      {productDetails?.nutritionalInfo && (
                        <div className="mt-4 p-3 bg-white rounded border">
                          <h5 className="font-medium text-gray-900 mb-2">Informations Nutritionnelles</h5>
                          <div className="grid grid-cols-2 gap-2 text-sm text-gray-600">
                            {productDetails.nutritionalInfo.calories && (
                              <div>Calories: {productDetails.nutritionalInfo.calories}</div>
                            )}
                            {productDetails.nutritionalInfo.protein && (
                              <div>Protéines: {productDetails.nutritionalInfo.protein}g</div>
                            )}
                            {productDetails.nutritionalInfo.carbs && (
                              <div>Glucides: {productDetails.nutritionalInfo.carbs}g</div>
                            )}
                            {productDetails.nutritionalInfo.fat && (
                              <div>Lipides: {productDetails.nutritionalInfo.fat}g</div>
                            )}
                          </div>
                        </div>
                      )}

                      {/* Origin */}
                      {productDetails?.origin && (
                        <div className="mt-3 flex items-center gap-2">
                          <span className="text-sm font-medium text-gray-700">Origine:</span>
                          <span className="text-sm text-gray-600">{productDetails.origin}</span>
                        </div>
                      )}

                      {/* Tags */}
                      {productDetails?.tags && productDetails.tags.length > 0 && (
                        <div className="mt-3 flex flex-wrap gap-1">
                          {productDetails.tags.map((tag, index) => (
                            <span key={index} className="px-2 py-1 bg-[#e8f5e9] text-[#2d7a3e] text-xs rounded font-medium">
                              {tag}
                            </span>
                          ))}
                        </div>
                      )}
                    </div>
                  )}
                </div>

                {/* Size Selection */}
                <div>
                  <label className="block text-sm font-semibold text-gray-900 mb-3">
                    Select Size
                  </label>
                  <div className="grid grid-cols-3 gap-2">
                    {sizes.map(size => (
                      <button
                        key={size}
                        onClick={() => setSelectedSize(size)}
                        className={`py-2 px-4 rounded-lg font-semibold transition ${
                          selectedSize === size
                            ? 'bg-[#2d7a3e] text-white'
                            : 'bg-gray-100 text-gray-900 hover:bg-gray-200'
                        }`}
                      >
                        {size}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Quantity */}
                <div>
                  <label className="block text-sm font-semibold text-gray-900 mb-3">
                    Quantity
                  </label>
                  <div className="flex items-center gap-4">
                    <button
                      onClick={() => setQuantity(Math.max(1, quantity - 1))}
                      className="p-2 border border-gray-300 rounded-lg hover:bg-gray-100 transition"
                    >
                      −
                    </button>
                    <span className="text-xl font-semibold w-8 text-center">{quantity}</span>
                    <button
                      onClick={() => setQuantity(quantity + 1)}
                      className="p-2 border border-gray-300 rounded-lg hover:bg-gray-100 transition"
                    >
                      +
                    </button>
                  </div>
                </div>

                {/* Actions */}
                <div className="flex gap-3 pt-4">
                  <Button
                    onClick={() => {
                      onAddToCart?.(product, quantity, selectedSize);
                      onClose();
                    }}
                    className="flex-1 bg-[#2d7a3e] hover:bg-[#1f5028] text-white py-3 rounded-lg font-semibold flex items-center justify-center gap-2"
                  >
                    <ShoppingCart size={20} />
                    Add to Cart
                  </Button>
                  <Button
                    onClick={onClose}
                    variant="outline"
                    className="flex-1 border-[#2d7a3e] text-[#2d7a3e] hover:bg-[#e8f5e9]"
                  >
                    Cancel
                  </Button>
                </div>

                {/* Features */}
                <div className="pt-4 border-t border-gray-200 space-y-2 text-sm text-gray-600">
                  <p>✓ Free shipping on orders over $100</p>
                  <p>✓ 30-day money-back guarantee</p>
                  <p>✓ 2-year warranty included</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
