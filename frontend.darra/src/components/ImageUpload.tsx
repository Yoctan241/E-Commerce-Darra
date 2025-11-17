import { useState, useRef } from 'react';
import { Upload, Image, X, FileImage, AlertCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';

interface ImageUploadProps {
  onImagesChange: (images: File[]) => void;
  maxImages?: number;
  maxSize?: number; // en MB
  existingImages?: string[]; // URLs des images existantes
}

export default function ImageUpload({ 
  onImagesChange, 
  maxImages = 5, 
  maxSize = 5,
  existingImages = []
}: ImageUploadProps) {
  const [selectedImages, setSelectedImages] = useState<File[]>([]);
  const [previews, setPreviews] = useState<string[]>([]);
  const [dragActive, setDragActive] = useState(false);
  const [errors, setErrors] = useState<string[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const validateFile = (file: File): string | null => {
    // Vérifier le type de fichier
    if (!file.type.startsWith('image/')) {
      return `${file.name} n'est pas une image valide`;
    }

    // Vérifier la taille
    if (file.size > maxSize * 1024 * 1024) {
      return `${file.name} est trop volumineux (max ${maxSize}MB)`;
    }

    // Vérifier les formats supportés
    const supportedFormats = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp', 'image/gif'];
    if (!supportedFormats.includes(file.type)) {
      return `Format non supporté pour ${file.name}. Utilisez JPG, PNG, WebP ou GIF`;
    }

    return null;
  };

  const handleFiles = (files: FileList | null) => {
    if (!files) return;

    const newErrors: string[] = [];
    const validFiles: File[] = [];
    const newPreviews: string[] = [...previews];

    // Vérifier le nombre total d'images
    if (selectedImages.length + existingImages.length + files.length > maxImages) {
      newErrors.push(`Maximum ${maxImages} images autorisées`);
      setErrors(newErrors);
      return;
    }

    Array.from(files).forEach((file) => {
      const error = validateFile(file);
      if (error) {
        newErrors.push(error);
      } else {
        validFiles.push(file);
        // Créer une preview
        const reader = new FileReader();
        reader.onload = (e) => {
          if (e.target?.result) {
            newPreviews.push(e.target.result as string);
            setPreviews([...newPreviews]);
          }
        };
        reader.readAsDataURL(file);
      }
    });

    if (validFiles.length > 0) {
      const updatedImages = [...selectedImages, ...validFiles];
      setSelectedImages(updatedImages);
      onImagesChange(updatedImages);
    }

    setErrors(newErrors);
  };

  const removeImage = (index: number) => {
    const updatedImages = selectedImages.filter((_, i) => i !== index);
    const updatedPreviews = previews.filter((_, i) => i !== index);
    
    setSelectedImages(updatedImages);
    setPreviews(updatedPreviews);
    onImagesChange(updatedImages);
  };

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    
    if (e.dataTransfer.files) {
      handleFiles(e.dataTransfer.files);
    }
  };

  const openFileDialog = () => {
    fileInputRef.current?.click();
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  return (
    <div className="space-y-4">
      {/* Zone de drop */}
      <div
        onDragEnter={handleDrag}
        onDragLeave={handleDrag}
        onDragOver={handleDrag}
        onDrop={handleDrop}
        className={`relative border-2 border-dashed rounded-lg p-8 text-center transition-colors ${
          dragActive
            ? 'border-[#2d7a3e] bg-green-50'
            : 'border-gray-300 hover:border-gray-400'
        }`}
      >
        <input
          ref={fileInputRef}
          type="file"
          multiple
          accept="image/*"
          onChange={(e) => handleFiles(e.target.files)}
          className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
        />
        
        <div className="space-y-4">
          <div className="mx-auto w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center">
            <Upload className="w-6 h-6 text-gray-400" />
          </div>
          
          <div>
            <p className="text-lg font-medium text-gray-900">
              Déposez vos images ici
            </p>
            <p className="text-sm text-gray-600 mt-1">
              ou <button
                type="button"
                onClick={openFileDialog}
                className="text-[#2d7a3e] font-medium hover:underline"
              >
                parcourez votre ordinateur
              </button>
            </p>
          </div>
          
          <div className="text-xs text-gray-500">
            <p>JPG, PNG, WebP, GIF jusqu'à {maxSize}MB</p>
            <p>Maximum {maxImages} images</p>
          </div>
        </div>
      </div>

      {/* Bouton d'upload alternatif */}
      <Button
        type="button"
        variant="outline"
        onClick={openFileDialog}
        className="w-full"
        disabled={selectedImages.length + existingImages.length >= maxImages}
      >
        <FileImage className="w-4 h-4 mr-2" />
        Choisir des images ({selectedImages.length + existingImages.length}/{maxImages})
      </Button>

      {/* Erreurs */}
      {errors.length > 0 && (
        <Card className="border-red-200 bg-red-50">
          <CardContent className="p-4">
            <div className="flex items-start gap-2">
              <AlertCircle className="w-5 h-5 text-red-500 mt-0.5" />
              <div>
                <h4 className="font-medium text-red-900 mb-1">Erreurs détectées :</h4>
                <ul className="text-sm text-red-700 space-y-1">
                  {errors.map((error, index) => (
                    <li key={index}>• {error}</li>
                  ))}
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Images existantes (URLs) */}
      {existingImages.length > 0 && (
        <div>
          <h4 className="font-medium text-gray-900 mb-3">Images actuelles :</h4>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
            {existingImages.map((url, index) => (
              <div key={index} className="relative group">
                <div className="aspect-square rounded-lg border-2 border-gray-200 overflow-hidden bg-gray-100">
                  <img
                    src={url}
                    alt={`Image ${index + 1}`}
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      const target = e.target as HTMLImageElement;
                      target.src = '/api/placeholder/200/200';
                    }}
                  />
                </div>
                <div className="absolute -top-2 -right-2 opacity-0 group-hover:opacity-100 transition-opacity">
                  <button
                    type="button"
                    className="bg-red-500 text-white rounded-full p-1 hover:bg-red-600 shadow-lg"
                  >
                    <X className="w-3 h-3" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Preview des nouvelles images */}
      {previews.length > 0 && (
        <div>
          <h4 className="font-medium text-gray-900 mb-3">
            Nouvelles images sélectionnées :
          </h4>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
            {previews.map((preview, index) => (
              <div key={index} className="relative group">
                <div className="aspect-square rounded-lg border-2 border-gray-200 overflow-hidden bg-gray-100">
                  <img
                    src={preview}
                    alt={`Preview ${index + 1}`}
                    className="w-full h-full object-cover"
                  />
                </div>
                
                {/* Info fichier */}
                <div className="absolute bottom-0 left-0 right-0 bg-black bg-opacity-75 text-white p-2 text-xs">
                  <p className="truncate">{selectedImages[index]?.name}</p>
                  <p>{formatFileSize(selectedImages[index]?.size || 0)}</p>
                </div>
                
                {/* Bouton supprimer */}
                <div className="absolute -top-2 -right-2">
                  <button
                    type="button"
                    onClick={() => removeImage(index)}
                    className="bg-red-500 text-white rounded-full p-1 hover:bg-red-600 shadow-lg transition-colors"
                  >
                    <X className="w-3 h-3" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Conseils */}
      {selectedImages.length === 0 && existingImages.length === 0 && (
        <Card className="bg-blue-50 border-blue-200">
          <CardContent className="p-4">
            <div className="flex items-start gap-2">
              <Image className="w-5 h-5 text-blue-500 mt-0.5" />
              <div>
                <h4 className="font-medium text-blue-900 mb-1">Conseils pour de meilleures images :</h4>
                <ul className="text-sm text-blue-700 space-y-1">
                  <li>• Utilisez des images de haute qualité (minimum 800x600px)</li>
                  <li>• Assurez-vous que l'éclairage est bon</li>
                  <li>• Montrez le produit sous différents angles</li>
                  <li>• Évitez les arrière-plans encombrés</li>
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}