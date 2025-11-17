# Système E-commerce Cosmétiques avec Conversion de Devises

## 🎯 Fonctionnalités Implémentées

### 💄 Catalogue de Produits Cosmétiques
- **12 produits cosmétiques** organisés en 3 catégories :
  - **Maquillage** : Fonds de teint, rouges à lèvres, mascaras
  - **Soins du visage** : Crèmes hydratantes, sérums, nettoyants
  - **Parfums** : Parfums de luxe pour hommes et femmes

### 💱 Système de Conversion de Devises
- **Conversion automatique FCFA ↔ EUR**
- **Taux de change en temps réel** avec mise à jour horaire
- **Affichage flexible** : prix en FCFA, EUR ou les deux
- **Cache local** pour optimiser les performances

### 📸 Gestion Avancée des Images
- **Upload par glisser-déposer**
- **Capture photo depuis la caméra** (mobile/desktop)
- **Redimensionnement automatique** des images
- **Téléchargement local** pour les administrateurs
- **Support multi-formats** (JPG, PNG, WebP)

### 🛍️ Interface Utilisateur Avancée
- **Grille produits responsive** avec vue liste/grille
- **Filtres dynamiques** par catégorie et recherche
- **Tri intelligent** par prix, nom, note, catégorie
- **Cartes produits** avec évaluations et badges
- **États de stock** et indicateurs bio/organiques

## 🏗️ Architecture Technique

### Composants Frontend (`src/components/`)
```
ProductGrid.tsx      # Affichage principal des produits
ProductCard.tsx      # Carte individuelle de produit
PriceDisplay.tsx     # Système d'affichage des prix
ImageManager.tsx     # Gestionnaire d'images admin
```

### Utilitaires (`src/utils/`)
```
currency.ts          # Système de conversion de devises
```

### Scripts Backend
```
create-cosmetics-data.js  # Population de la base de données
```

## 🚀 Installation et Configuration

### 1. Installation des Dépendances
```bash
npm install
```

### 2. Configuration de la Base de Données
```bash
# Exécuter le script de création des données cosmétiques
node create-cosmetics-data.js
```

### 3. Démarrage du Serveur
```bash
# Backend (port 5000)
npm run server

# Frontend (port 5173)
npm run dev
```

## 💰 Utilisation du Système de Devises

### Conversion Automatique
```typescript
import { CurrencyConverter } from './utils/currency';

const converter = new CurrencyConverter();

// Conversion FCFA vers EUR
const priceEUR = converter.convert(8500, 'FCFA', 'EUR'); // ~12.96 EUR

// Formatage avec symboles
const formatted = converter.formatPrice(8500, 'FCFA'); // "8 500 FCFA"
```

### Composant PriceDisplay
```tsx
<PriceDisplay 
  basePrice={8500}
  baseCurrency="FCFA"
  showBothCurrencies={true}
  size="md"
/>
```

## 🛠️ Fonctionnalités Administrateur

### Gestion des Images
```tsx
import { ImageManager } from './components/ImageManager';

<ImageManager
  productId="product-123"
  existingImages={[]}
  onImagesUpdate={(images) => console.log(images)}
  maxImages={5}
  allowCamera={true}
/>
```

### Fonctionnalités disponibles :
- ✅ **Upload par glisser-déposer**
- ✅ **Capture depuis caméra**
- ✅ **Redimensionnement automatique**
- ✅ **Téléchargement sur appareil**
- ✅ **Prévisualisation en temps réel**
- ✅ **Gestion multi-images**

## 📱 Compatibilité Mobile

### Interface Responsive
- **Grille adaptative** : 1-4 colonnes selon l'écran
- **Navigation tactile** optimisée
- **Boutons de taille appropriée**
- **Texte lisible** sur tous les appareils

### Fonctionnalités Mobiles
- **Capture photo native** via caméra
- **Upload depuis galerie** photo
- **Conversion de devises** en temps réel
- **Filtres et recherche** tactiles

## 🎨 Produits Cosmétiques Inclus

### Maquillage
- **Maybelline Fit Me Foundation** - 8 500 FCFA
- **L'Oréal Rouge à Lèvres** - 6 500 FCFA  
- **Maybelline Lash Sensational** - 7 200 FCFA
- **Dior Addict Lip Glow** - 18 900 FCFA

### Soins du Visage
- **L'Oréal Revitalift Crème** - 12 800 FCFA
- **Chanel Hydra Beauty** - 35 600 FCFA
- **Maybelline BB Cream** - 5 900 FCFA
- **Dior Capture Totale** - 42 300 FCFA

### Parfums
- **Chanel N°5** - 45 000 FCFA
- **Dior Sauvage** - 38 500 FCFA
- **L'Oréal Paris Mon Paris** - 15 600 FCFA
- **Maybelline Baby Lips** - 3 200 FCFA

## 🔧 Tests et Validation

### Script de Test Automatique
```bash
node test-cosmetics-system.js
```

### Tests Inclus :
- ✅ **API des produits** - Chargement et affichage
- ✅ **Conversion de devises** - Précision des calculs
- ✅ **Composants React** - Rendu et fonctionnalités
- ✅ **Données cosmétiques** - Intégrité et structure

## 📞 Support et Maintenance

### Mise à Jour des Taux de Change
Les taux sont automatiquement mis à jour toutes les heures. Pour une mise à jour manuelle :

```typescript
const converter = new CurrencyConverter();
await converter.updateRates(); // Force la mise à jour
```

### Cache et Performance
- **Cache localStorage** : 1 heure de validité
- **Images optimisées** : Redimensionnement automatique
- **Requêtes API** : Mise en cache côté client

### Logs et Debugging
```typescript
// Activation des logs détaillés
localStorage.setItem('currency-debug', 'true');
```

## 🚀 Prochaines Améliorations

### Fonctionnalités Futures
- [ ] **Panier persistant** avec sauvegarde locale
- [ ] **Comparateur de produits** cosmétiques
- [ ] **Système de recommandations** basé sur l'historique
- [ ] **Notifications push** pour les promotions
- [ ] **Mode sombre** pour l'interface utilisateur
- [ ] **Réalité augmentée** pour test virtuel de maquillage

### Optimisations Techniques
- [ ] **Service Worker** pour le cache offline
- [ ] **Lazy Loading** pour les images produits
- [ ] **Compression WebP** avancée
- [ ] **PWA** pour installation mobile
- [ ] **Analytics** détaillées d'utilisation

---

*Système développé pour Darra.e - E-commerce cosmétiques et alimentaires africains*