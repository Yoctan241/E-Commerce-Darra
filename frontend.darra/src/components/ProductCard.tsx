import { ShoppingCart, Heart, Star, Info } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useState } from 'react';
import { PriceDisplay } from './PriceDisplay';

export interface Product {
  id: string;
  name: string;
  price: number;
  image: string;
  category: string;
  rating?: number;
  reviews?: number;
  description?: string;
  brand?: string;
  type?: string;
  ingredients?: string[];
  specifications?: string[];
  inStock?: boolean;
  isOrganic?: boolean;
}

interface ProductCardProps {
  product: Product;
  onAddToCart?: (product: Product) => void;
  onViewDetails?: (product: Product) => void;
}

export default function ProductCard({ product, onAddToCart, onViewDetails }: ProductCardProps) {
  const [isFavorite, setIsFavorite] = useState(false);
  const [isHovered, setIsHovered] = useState(false);

  return (
    <div
      className="bg-white rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300 border-2 border-[#e8f5e9] hover:border-[#4a9d5f]"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Image Container */}
      <div className="relative h-64 bg-gradient-to-br from-[#faf8f3] to-[#e8f5e9] overflow-hidden">
        <img
          src={product.image}
          alt={product.name}
          className="w-full h-full object-cover hover:scale-110 transition-transform duration-300"
        />
        
        {/* Category and Brand Badges */}
        <div className="absolute top-4 left-4 flex flex-col gap-2">
          <Badge className="bg-[#2d7a3e] text-white px-3 py-1 text-xs font-bold shadow-lg">
            {product.category}
          </Badge>
          {product.brand && (
            <Badge variant="secondary" className="bg-white/90 text-[#2d7a3e] px-3 py-1 text-xs font-semibold">
              {product.brand}
            </Badge>
          )}
        </div>

        {/* Favorite Button */}
        <button
          onClick={() => setIsFavorite(!isFavorite)}
          className="absolute top-4 right-4 p-3 bg-white rounded-full shadow-lg hover:bg-[#e8f5e9] transition"
        >
          <Heart
            size={22}
            className={isFavorite ? 'fill-[#ff9a56] text-[#ff9a56]' : 'text-[#999]'}
          />
        </button>

        {/* Quick Add Button - Shows on Hover */}
        {isHovered && (
          <div className="absolute inset-0 bg-gradient-to-t from-[#2d7a3e]/70 via-[#2d7a3e]/40 to-transparent flex items-center justify-center">
            <Button
              onClick={() => onAddToCart?.(product)}
              className="bg-white text-[#2d7a3e] hover:bg-[#e8f5e9] font-bold flex items-center gap-2 shadow-xl rounded-xl px-6 py-3"
            >
              <ShoppingCart size={20} />
              Ajouter
            </Button>
          </div>
        )}
      </div>

      {/* Content */}
      <div className="p-5">
        <div className="flex items-start justify-between mb-3">
          <h3 className="font-bold text-[#2d7a3e] line-clamp-2 text-sm flex-1 pr-2">
            {product.name}
          </h3>
          {product.isOrganic && (
            <Badge variant="outline" className="text-[#2d7a3e] border-[#2d7a3e] text-xs">
              Bio
            </Badge>
          )}
        </div>

        {/* Description */}
        {product.description && (
          <p className="text-xs text-gray-600 mb-3 line-clamp-2">
            {product.description}
          </p>
        )}
        
        {/* Rating */}
        {product.rating && (
          <div className="flex items-center gap-2 mb-4">
            <div className="flex text-[#ff9a56]">
              {[...Array(5)].map((_, i) => (
                <Star
                  key={i}
                  size={14}
                  className={i < Math.floor(product.rating!) ? 'fill-current' : ''}
                />
              ))}
            </div>
            <span className="text-xs text-gray-500">
              {product.rating.toFixed(1)} ({product.reviews || 0})
            </span>
          </div>
        )}

        {/* Stock Status */}
        {product.inStock === false && (
          <Badge variant="destructive" className="mb-3">
            Rupture de stock
          </Badge>
        )}

        {/* Price with Currency Conversion */}
        <div className="flex items-center justify-between">
          <PriceDisplay 
            basePrice={product.price} 
            baseCurrency="FCFA"
            showBothCurrencies={false}
            size="sm"
            className="text-lg font-bold text-[#2d7a3e]"
          />
          <div className="flex gap-2">
            <Button
              onClick={() => onViewDetails?.(product)}
              variant="outline"
              size="sm"
              className="text-[#2d7a3e] border-[#2d7a3e] hover:bg-[#e8f5e9] p-2"
            >
              <Info size={16} />
            </Button>
            <Button
              onClick={() => onAddToCart?.(product)}
              size="sm"
              className="bg-[#2d7a3e] hover:bg-[#1f5028] p-2"
              disabled={product.inStock === false}
            >
              <ShoppingCart size={16} />
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}