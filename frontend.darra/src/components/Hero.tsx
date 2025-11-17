import { Button } from '@/components/ui/button';

interface HeroProps {
  onShopClick?: () => void;
}

export default function Hero({ onShopClick }: HeroProps) {
  return (
    <section className="relative bg-gradient-to-r from-[#4a9d5f] to-[#2d7a3e] overflow-hidden py-0">
      {/* Main container with cream background */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="bg-[#faf8f3] rounded-3xl overflow-hidden shadow-2xl relative">
          {/* Decorative leaves - Top left */}
          <div className="absolute -top-8 -left-12 w-48 h-48 opacity-80 pointer-events-none z-0">
            <svg viewBox="0 0 200 200" className="w-full h-full">
              <path d="M100,20 Q120,40 110,80 Q100,120 80,140 Q90,100 100,60 Z" fill="#2d7a3e"/>
              <path d="M140,30 Q160,50 150,90 Q140,130 120,150 Q130,110 140,70 Z" fill="#4a9d5f"/>
              <path d="M60,40 Q75,55 70,95 Q65,135 50,155 Q60,115 65,75 Z" fill="#2d7a3e" opacity="0.7"/>
            </svg>
          </div>

          {/* Decorative leaves - Top right */}
          <div className="absolute -top-4 -right-16 w-56 h-56 opacity-70 pointer-events-none z-0">
            <svg viewBox="0 0 200 200" className="w-full h-full">
              <path d="M100,20 Q120,40 110,80 Q100,120 80,140 Q90,100 100,60 Z" fill="#ff9a56"/>
              <path d="M140,30 Q160,50 150,90 Q140,130 120,150 Q130,110 140,70 Z" fill="#2d7a3e" opacity="0.6"/>
              <path d="M60,40 Q75,55 70,95 Q65,135 50,155 Q60,115 65,75 Z" fill="#4a9d5f" opacity="0.5"/>
            </svg>
          </div>

          {/* Decorative leaves - Bottom right */}
          <div className="absolute -bottom-12 -right-8 w-64 h-64 opacity-60 pointer-events-none z-0">
            <svg viewBox="0 0 200 200" className="w-full h-full">
              <path d="M100,20 Q120,40 110,80 Q100,120 80,140 Q90,100 100,60 Z" fill="#2d7a3e"/>
              <path d="M140,30 Q160,50 150,90 Q140,130 120,150 Q130,110 140,70 Z" fill="#4a9d5f"/>
            </svg>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center p-8 md:p-12 relative z-10">
            {/* Left Content */}
            <div className="flex flex-col gap-6">
              {/* Logo */}
              <div className="flex items-center gap-2 mb-4">
                <div className="w-8 h-8 bg-[#2d7a3e] rounded flex items-center justify-center">
                  <span className="text-white font-bold text-sm">D</span>
                </div>
                <span className="text-lg font-bold text-[#2d7a3e]">DARRA</span>
              </div>

              <div>
                <h1 className="text-5xl md:text-6xl font-bold text-[#2d7a3e] mb-2 leading-tight">
                  Ajouter une
                </h1>
                <h2 className="text-5xl md:text-6xl font-serif italic text-[#4a9d5f] leading-tight">
                  Touche de Confort
                </h2>
                <p className="text-4xl md:text-5xl font-serif italic text-[#2d7a3e] mt-2">
                  à Votre Vie
                </p>
              </div>

              <div className="flex gap-4 pt-4">
                <Button
                  onClick={onShopClick}
                  className="bg-[#2d7a3e] hover:bg-[#1f5028] text-white px-8 py-3 rounded-lg font-bold transition shadow-lg"
                >
                  Pricelist
                </Button>
                <Button
                  variant="outline"
                  className="px-8 py-3 border-2 border-[#2d7a3e] text-[#2d7a3e] hover:bg-[#e8f5e9] rounded-lg font-bold"
                >
                  Read More
                </Button>
              </div>
            </div>

            {/* Right Image */}
            <div className="relative h-96 md:h-full flex items-center justify-center">
              <img
                src="https://images.unsplash.com/photo-1556228578-8c89e6adf883?w=500&q=80"
                alt="Comfort products"
                className="w-full h-80 object-cover rounded-2xl shadow-xl"
              />
              
              {/* Free Delivery Badge */}
              <div className="absolute top-8 right-8 bg-white rounded-full px-6 py-3 shadow-lg flex items-center gap-2">
                <div className="w-8 h-8 bg-[#4a9d5f] rounded-full flex items-center justify-center text-white text-sm">✓</div>
                <div>
                  <p className="text-xs text-[#999]">Free</p>
                  <p className="font-bold text-[#2d7a3e]">Delivery Fee</p>
                </div>
              </div>

              {/* Offer Box */}
              <div className="absolute bottom-8 right-8 bg-white rounded-2xl p-6 shadow-lg max-w-xs">
                <p className="font-bold text-[#2d7a3e] mb-2">Buy at our Shop and</p>
                <p className="text-2xl font-bold text-[#2d7a3e] mb-3">Get 50% Off!</p>
                <p className="text-sm text-[#666]">Lorem ipsum dolor sit amet, consectetur adipiscing elit. Etiam eget elementum nisi.</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}