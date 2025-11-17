// Script de création des données cosmétiques pour la base de données
// Exécuter avec: node create-cosmetics-data.js

const mongoose = require('mongoose');

// Configuration de la base de données
const DB_URL = process.env.MONGODB_URI || 'mongodb://localhost:27017/darra';

// Schéma Product (simplifié pour ce script)
const productSchema = new mongoose.Schema({
  name: String,
  description: String,
  price: Number,
  category: String,
  brand: String,
  type: String,
  image: String,
  ingredients: [String],
  specifications: [String],
  rating: Number,
  reviews: Number,
  inStock: Boolean,
  isOrganic: Boolean,
  createdAt: { type: Date, default: Date.now }
});

const Product = mongoose.model('Product', productSchema);

// Données des produits cosmétiques
const cosmeticsData = [
  // Maquillage
  {
    name: "Maybelline Fit Me Matte Foundation",
    description: "Fond de teint matifiant longue durée pour tous types de peau",
    price: 8500,
    category: "Maquillage", 
    brand: "Maybelline",
    type: "Fond de teint",
    image: "/images/cosmetics/maybelline-fitme.jpg",
    ingredients: ["Talc", "Dimethicone", "Zinc Stearate", "Nylon-12"],
    specifications: ["Couvrance moyenne", "Fini mat", "12h de tenue", "Non comédogène"],
    rating: 4.2,
    reviews: 156,
    inStock: true,
    isOrganic: false
  },
  {
    name: "L'Oréal Rouge à Lèvres Color Riche",
    description: "Rouge à lèvres crémeux haute pigmentation",
    price: 6500,
    category: "Maquillage",
    brand: "L'Oréal",
    type: "Rouge à lèvres",
    image: "/images/cosmetics/loreal-rouge.jpg", 
    ingredients: ["Cera Alba", "Ozokerite", "Paraffinum Liquidum"],
    specifications: ["Couleur intense", "Hydratant", "6h de tenue"],
    rating: 4.5,
    reviews: 89,
    inStock: true,
    isOrganic: false
  },
  {
    name: "Maybelline Lash Sensational Mascara",
    description: "Mascara volume et longueur effet cils de biche",
    price: 7200,
    category: "Maquillage",
    brand: "Maybelline", 
    type: "Mascara",
    image: "/images/cosmetics/maybelline-mascara.jpg",
    ingredients: ["Aqua", "Cera Alba", "Copernicia Cerifera Cera"],
    specifications: ["Volume x3", "Longueur +40%", "Waterproof", "Brosse flexible"],
    rating: 4.0,
    reviews: 203,
    inStock: true,
    isOrganic: false
  },
  {
    name: "Dior Addict Lip Glow",
    description: "Baume à lèvres révélateur de couleur naturelle",
    price: 18900,
    category: "Maquillage",
    brand: "Dior",
    type: "Baume à lèvres",
    image: "/images/cosmetics/dior-lipglow.jpg",
    ingredients: ["Polyglyceryl-2", "Diisostearate", "Hydrogenated Polyisobutene"],
    specifications: ["Couleur sur-mesure", "Hydratation 24h", "SPF 10"],
    rating: 4.8,
    reviews: 67,
    inStock: true,
    isOrganic: false
  },

  // Soins du visage  
  {
    name: "L'Oréal Revitalift Anti-Age Crème",
    description: "Crème anti-âge revitalisante à l'acide hyaluronique",
    price: 12800,
    category: "Soins du visage",
    brand: "L'Oréal",
    type: "Crème anti-âge", 
    image: "/images/cosmetics/loreal-revitalift.jpg",
    ingredients: ["Aqua", "Glycerin", "Sodium Hyaluronate", "Pro-Retinol A"],
    specifications: ["Anti-rides", "Fermeté", "Hydratation 24h", "Tous types de peau"],
    rating: 4.3,
    reviews: 134,
    inStock: true,
    isOrganic: false
  },
  {
    name: "Chanel Hydra Beauty Crème",
    description: "Crème hydratante luxueuse aux actifs botaniques",
    price: 35600,
    category: "Soins du visage",
    brand: "Chanel",
    type: "Crème hydratante",
    image: "/images/cosmetics/chanel-hydra.jpg",
    ingredients: ["Camellia Alba PFA", "Blue Ginger PFA", "Aqua", "Glycerin"],
    specifications: ["Hydratation intense", "Anti-pollution", "Texture soyeuse"],
    rating: 4.7,
    reviews: 45,
    inStock: true,
    isOrganic: true
  },
  {
    name: "Maybelline Baby Skin Primer",
    description: "Base de maquillage lissante effet peau de bébé",
    price: 5900,
    category: "Soins du visage",
    brand: "Maybelline", 
    type: "Primer",
    image: "/images/cosmetics/maybelline-primer.jpg",
    ingredients: ["Dimethicone", "Dimethicone Crosspolymer", "Isododecane"],
    specifications: ["Pores invisibles", "Tenue maquillage", "Texture légère"],
    rating: 4.1,
    reviews: 178,
    inStock: true,
    isOrganic: false
  },
  {
    name: "Dior Capture Totale Sérum",
    description: "Sérum anti-âge global aux cellules natives de longoza",
    price: 42300,
    category: "Soins du visage",
    brand: "Dior",
    type: "Sérum",
    image: "/images/cosmetics/dior-capture.jpg", 
    ingredients: ["Aqua", "Longoza Extract", "Hyaluronic Acid", "Vitamin C"],
    specifications: ["Anti-âge global", "Fermeté", "Éclat", "Texture ultra-fine"],
    rating: 4.9,
    reviews: 23,
    inStock: true,
    isOrganic: false
  },

  // Parfums
  {
    name: "Chanel N°5 Eau de Parfum 50ml",
    description: "Le parfum mythique aux notes florales intemporelles",
    price: 45000,
    category: "Parfum",
    brand: "Chanel",
    type: "Eau de Parfum",
    image: "/images/cosmetics/chanel-n5.jpg",
    ingredients: ["Ylang-Ylang", "Rose de Grasse", "Jasmin", "Vétiver", "Santal"],
    specifications: ["50ml", "Vaporisateur", "Notes florales", "Longue tenue"],
    rating: 4.8,
    reviews: 89,
    inStock: true,
    isOrganic: false
  },
  {
    name: "Dior Sauvage Eau de Toilette 100ml",
    description: "Parfum masculin frais et puissant aux notes épicées",
    price: 38500,
    category: "Parfum", 
    brand: "Dior",
    type: "Eau de Toilette",
    image: "/images/cosmetics/dior-sauvage.jpg",
    ingredients: ["Bergamote", "Poivre de Sichuan", "Ambroxan", "Vétiver"],
    specifications: ["100ml", "Spray", "Notes fraîches épicées", "Homme"],
    rating: 4.6,
    reviews: 156,
    inStock: true,
    isOrganic: false
  },
  {
    name: "L'Oréal Paris Mon Paris Eau de Parfum",
    description: "Parfum féminin gourmand aux notes de fraise et framboise",
    price: 15600,
    category: "Parfum",
    brand: "L'Oréal", 
    type: "Eau de Parfum",
    image: "/images/cosmetics/loreal-monparis.jpg",
    ingredients: ["Fraise", "Framboise", "Pivoine", "Mousse de Chêne", "Patchouli"],
    specifications: ["50ml", "Notes gourmandes florales", "Femme", "Romantique"],
    rating: 4.2,
    reviews: 112,
    inStock: true,
    isOrganic: false
  },
  {
    name: "Maybelline Baby Lips Baume Parfumé",
    description: "Baume à lèvres hydratant parfumé aux fruits",
    price: 3200,
    category: "Parfum",
    brand: "Maybelline",
    type: "Baume parfumé", 
    image: "/images/cosmetics/maybelline-babylips.jpg",
    ingredients: ["Cera Alba", "Butyrospermum Parkii", "Parfum Naturel Fruits"],
    specifications: ["Hydratation 8h", "Parfum fruité", "SPF 20", "Sans paraben"],
    rating: 4.0,
    reviews: 267,
    inStock: true,
    isOrganic: true
  }
];

// Fonction principale
async function createCosmeticsData() {
  try {
    console.log('🔗 Connexion à la base de données...');
    await mongoose.connect(DB_URL);
    console.log('✅ Connexion réussie à MongoDB');

    console.log('🧹 Nettoyage des données existantes...');
    await Product.deleteMany({ category: { $in: ['Maquillage', 'Soins du visage', 'Parfum'] } });
    console.log('✅ Anciens produits cosmétiques supprimés');

    console.log('💄 Ajout des nouveaux produits cosmétiques...');
    const insertedProducts = await Product.insertMany(cosmeticsData);
    console.log(`✅ ${insertedProducts.length} produits cosmétiques ajoutés`);

    // Statistiques par catégorie
    const stats = await Product.aggregate([
      { $match: { category: { $in: ['Maquillage', 'Soins du visage', 'Parfum'] } } },
      { $group: { _id: '$category', count: { $sum: 1 }, avgPrice: { $avg: '$price' } } }
    ]);

    console.log('\n📊 Statistiques des produits:');
    stats.forEach(stat => {
      console.log(`  ${stat._id}: ${stat.count} produits (Prix moyen: ${Math.round(stat.avgPrice)} FCFA)`);
    });

    // Top marques
    const brands = await Product.aggregate([
      { $match: { category: { $in: ['Maquillage', 'Soins du visage', 'Parfum'] } } },
      { $group: { _id: '$brand', count: { $sum: 1 } } },
      { $sort: { count: -1 } }
    ]);

    console.log('\n🏷️ Marques disponibles:');
    brands.forEach(brand => {
      console.log(`  ${brand._id}: ${brand.count} produit${brand.count > 1 ? 's' : ''}`);
    });

    // Gamme de prix
    const priceRange = await Product.aggregate([
      { $match: { category: { $in: ['Maquillage', 'Soins du visage', 'Parfum'] } } },
      { $group: { 
          _id: null, 
          minPrice: { $min: '$price' },
          maxPrice: { $max: '$price' },
          avgPrice: { $avg: '$price' }
        } 
      }
    ]);

    if (priceRange.length > 0) {
      const range = priceRange[0];
      console.log('\n💰 Gamme de prix:');
      console.log(`  Minimum: ${range.minPrice} FCFA (~${(range.minPrice/655.957).toFixed(2)} EUR)`);
      console.log(`  Maximum: ${range.maxPrice} FCFA (~${(range.maxPrice/655.957).toFixed(2)} EUR)`);
      console.log(`  Moyenne: ${Math.round(range.avgPrice)} FCFA (~${(range.avgPrice/655.957).toFixed(2)} EUR)`);
    }

    console.log('\n🎉 Données cosmétiques créées avec succès !');
    console.log('🚀 Le système est prêt pour les tests frontend.');

  } catch (error) {
    console.error('❌ Erreur:', error.message);
    console.log('💡 Assurez-vous que MongoDB est démarré et accessible.');
  } finally {
    await mongoose.disconnect();
    console.log('🔌 Déconnexion de la base de données');
  }
}

// Exécution du script
createCosmeticsData().catch(console.error);