import { useState, useRef, useCallback } from 'react';
import { 
  Upload,
  Download,
  Camera,
  Image as ImageIcon,
  X,
  Check,
  Smartphone,
  Monitor,
  Cloud,
  FolderOpen,
  Eye,
  Edit2,
  Trash2,
  Copy,
  ExternalLink,
  Loader2
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

interface ProductImage {
  id: string;
  url: string;
  name: string;
  size: number;
  type: string;
  uploadedAt: Date;
  isMain: boolean;
  alt?: string;
  tags?: string[];
}

interface ImageManagerProps {
  productId?: string;
  existingImages?: ProductImage[];
  onImagesChange?: (images: ProductImage[]) => void;
  maxImages?: number;
  acceptedFormats?: string[];
}

export default function ImageManager({
  productId,
  existingImages = [],
  onImagesChange,
  maxImages = 10,
  acceptedFormats = ['image/jpeg', 'image/png', 'image/webp']
}: ImageManagerProps) {
  const [images, setImages] = useState<ProductImage[]>(existingImages);
  const [uploading, setUploading] = useState(false);
  const [previewImage, setPreviewImage] = useState<string | null>(null);
  const [dragActive, setDragActive] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const cameraInputRef = useRef<HTMLInputElement>(null);

  // Gestion du drag & drop
  const handleDrag = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  }, []);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFileUpload(Array.from(e.dataTransfer.files));
    }
  }, []);

  // Conversion d'un fichier en ProductImage
  const createImageFromFile = async (file: File): Promise<ProductImage> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = (e) => {
        const newImage: ProductImage = {
          id: `temp_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
          url: e.target?.result as string,
          name: file.name,
          size: file.size,
          type: file.type,
          uploadedAt: new Date(),
          isMain: images.length === 0,
          alt: file.name.replace(/\.[^/.]+$/, ''),
          tags: []
        };
        resolve(newImage);
      };
      reader.onerror = reject;
      reader.readAsDataURL(file);
    });
  };

  // Upload de fichiers
  const handleFileUpload = async (files: File[]) => {
    if (images.length + files.length > maxImages) {
      alert(`Vous ne pouvez télécharger que ${maxImages} images maximum`);
      return;
    }

    setUploading(true);
    try {
      const newImages: ProductImage[] = [];
      
      for (const file of files) {
        if (!acceptedFormats.includes(file.type)) {
          alert(`Format ${file.type} non accepté`);
          continue;
        }
        
        if (file.size > 5 * 1024 * 1024) { // 5MB
          alert(`Le fichier ${file.name} est trop volumineux (max 5MB)`);
          continue;
        }

        const imageObj = await createImageFromFile(file);
        newImages.push(imageObj);
      }

      const updatedImages = [...images, ...newImages];
      setImages(updatedImages);
      onImagesChange?.(updatedImages);
      
    } catch (error) {
      console.error('Erreur lors du téléchargement:', error);
      alert('Erreur lors du téléchargement des images');
    } finally {
      setUploading(false);
    }
  };

  // Supprimer une image
  const removeImage = (imageId: string) => {
    const updatedImages = images.filter(img => img.id !== imageId);
    
    // Si l'image supprimée était l'image principale, définir la première comme principale
    if (updatedImages.length > 0 && !updatedImages.some(img => img.isMain)) {
      updatedImages[0].isMain = true;
    }
    
    setImages(updatedImages);
    onImagesChange?.(updatedImages);
  };

  // Définir comme image principale
  const setAsMainImage = (imageId: string) => {
    const updatedImages = images.map(img => ({
      ...img,
      isMain: img.id === imageId
    }));
    
    setImages(updatedImages);
    onImagesChange?.(updatedImages);
  };

  // Télécharger une image
  const downloadImage = (image: ProductImage) => {
    const link = document.createElement('a');
    link.href = image.url;
    link.download = image.name;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Copier l'URL de l'image
  const copyImageUrl = async (imageUrl: string) => {
    try {
      await navigator.clipboard.writeText(imageUrl);
      alert('URL copiée dans le presse-papiers');
    } catch (err) {
      console.error('Erreur lors de la copie:', err);
    }
  };

  // Formatage de la taille de fichier
  const formatFileSize = (bytes: number): string => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <ImageIcon size={20} />
          Gestion des images produit
          <Badge variant="outline">{images.length}/{maxImages}</Badge>
        </CardTitle>
      </CardHeader>
      
      <CardContent className="space-y-6">
        {/* Zone de téléchargement */}
        <div 
          className={`border-2 border-dashed rounded-lg p-8 text-center transition-colors ${
            dragActive 
              ? 'border-[#2d7a3e] bg-green-50' 
              : 'border-gray-300 hover:border-gray-400'
          }`}
          onDragEnter={handleDrag}
          onDragLeave={handleDrag}
          onDragOver={handleDrag}
          onDrop={handleDrop}
        >
          <div className="space-y-4">
            <div className="flex justify-center">
              {uploading ? (
                <Loader2 className="animate-spin text-[#2d7a3e]" size={48} />
              ) : (
                <Upload className="text-gray-400" size={48} />
              )}
            </div>
            
            <div>
              <h3 className="text-lg font-semibold text-gray-900">
                Télécharger des images
              </h3>
              <p className="text-gray-600 mt-1">
                Glissez-déposez vos images ici ou cliquez pour sélectionner
              </p>
            </div>

            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button
                onClick={() => fileInputRef.current?.click()}
                disabled={uploading || images.length >= maxImages}
                className="bg-[#2d7a3e] hover:bg-[#1f5028] text-white flex items-center gap-2"
              >
                <FolderOpen size={16} />
                Depuis l'ordinateur
              </Button>
              
              <Button
                onClick={() => cameraInputRef.current?.click()}
                disabled={uploading || images.length >= maxImages}
                variant="outline"
                className="flex items-center gap-2"
              >
                <Camera size={16} />
                Prendre une photo
              </Button>
            </div>

            <div className="text-xs text-gray-500">
              Formats acceptés: JPEG, PNG, WebP • Taille max: 5MB
            </div>
          </div>
        </div>

        {/* Inputs cachés */}
        <input
          ref={fileInputRef}
          type="file"
          multiple
          accept={acceptedFormats.join(',')}
          onChange={(e) => e.target.files && handleFileUpload(Array.from(e.target.files))}
          className="hidden"
        />
        <input
          ref={cameraInputRef}
          type="file"
          accept="image/*"
          capture="environment"
          onChange={(e) => e.target.files && handleFileUpload(Array.from(e.target.files))}
          className="hidden"
        />

        {/* Liste des images */}
        {images.length > 0 && (
          <div className="space-y-4">
            <h4 className="font-semibold text-gray-900">Images téléchargées</h4>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {images.map((image) => (
                <Card key={image.id} className="overflow-hidden">
                  <div className="relative">
                    <img
                      src={image.url}
                      alt={image.alt}
                      className="w-full h-48 object-cover cursor-pointer"
                      onClick={() => setPreviewImage(image.url)}
                    />
                    
                    {image.isMain && (
                      <Badge className="absolute top-2 left-2 bg-[#2d7a3e] text-white">
                        Principale
                      </Badge>
                    )}
                    
                    <div className="absolute top-2 right-2 flex gap-1">
                      <Button
                        size="sm"
                        variant="outline"
                        className="p-1 bg-white/90 hover:bg-white"
                        onClick={() => setPreviewImage(image.url)}
                      >
                        <Eye size={14} />
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        className="p-1 bg-white/90 hover:bg-white text-red-600"
                        onClick={() => removeImage(image.id)}
                      >
                        <Trash2 size={14} />
                      </Button>
                    </div>
                  </div>
                  
                  <CardContent className="p-4 space-y-3">
                    <div>
                      <h5 className="font-medium text-sm text-gray-900 truncate">
                        {image.name}
                      </h5>
                      <p className="text-xs text-gray-500">
                        {formatFileSize(image.size)} • {image.type.split('/')[1].toUpperCase()}
                      </p>
                    </div>
                    
                    <div className="flex gap-2">
                      {!image.isMain && (
                        <Button
                          size="sm"
                          variant="outline"
                          className="flex-1 text-xs"
                          onClick={() => setAsMainImage(image.id)}
                        >
                          <Check size={12} className="mr-1" />
                          Principale
                        </Button>
                      )}
                      
                      <Button
                        size="sm"
                        variant="outline"
                        className="p-2"
                        onClick={() => downloadImage(image)}
                        title="Télécharger"
                      >
                        <Download size={12} />
                      </Button>
                      
                      <Button
                        size="sm"
                        variant="outline"
                        className="p-2"
                        onClick={() => copyImageUrl(image.url)}
                        title="Copier l'URL"
                      >
                        <Copy size={12} />
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        )}

        {/* Options d'export */}
        {images.length > 0 && (
          <Card>
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <Download size={18} />
                Actions groupées
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex flex-wrap gap-4">
                <Button
                  variant="outline"
                  onClick={() => {
                    images.forEach(image => downloadImage(image));
                  }}
                  className="flex items-center gap-2"
                >
                  <Download size={16} />
                  Tout télécharger
                </Button>
                
                <Button
                  variant="outline"
                  onClick={() => {
                    const urls = images.map(img => img.url).join('\n');
                    navigator.clipboard.writeText(urls);
                    alert('URLs copiées dans le presse-papiers');
                  }}
                  className="flex items-center gap-2"
                >
                  <Copy size={16} />
                  Copier toutes les URLs
                </Button>
                
                <Button
                  variant="outline"
                  onClick={() => {
                    const data = JSON.stringify(images, null, 2);
                    const blob = new Blob([data], { type: 'application/json' });
                    const url = URL.createObjectURL(blob);
                    const link = document.createElement('a');
                    link.href = url;
                    link.download = `images_${productId || 'product'}.json`;
                    link.click();
                  }}
                  className="flex items-center gap-2"
                >
                  <ExternalLink size={16} />
                  Exporter les métadonnées
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Support mobile */}
        <Card className="bg-blue-50">
          <CardContent className="p-4">
            <div className="flex items-start gap-3">
              <Smartphone className="text-blue-600 mt-0.5" size={20} />
              <div>
                <h4 className="font-semibold text-blue-900">Support mobile</h4>
                <p className="text-sm text-blue-700 mt-1">
                  Sur mobile, utilisez le bouton "Prendre une photo" pour accéder directement à l'appareil photo.
                  Vous pouvez également sélectionner des photos depuis votre galerie.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Prévisualisation en modal */}
        {previewImage && (
          <div 
            className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 p-4"
            onClick={() => setPreviewImage(null)}
          >
            <div className="relative max-w-4xl max-h-full">
              <img
                src={previewImage}
                alt="Prévisualisation"
                className="max-w-full max-h-full object-contain"
              />
              <Button
                size="sm"
                variant="outline"
                className="absolute top-4 right-4 bg-white"
                onClick={() => setPreviewImage(null)}
              >
                <X size={16} />
              </Button>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}