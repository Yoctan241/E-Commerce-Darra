/*
 * 🚀 SERVEUR DARRA PERSISTANT - FICHIERS JSON PERMANENTS
 * Users et produits sauvés en temps réel dans des fichiers
 */

import dotenv from 'dotenv';
import express from 'express';
import cors from 'cors';
import morgan from 'morgan';
import multer from 'multer';
import path from 'path';
import fs from 'fs';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { fileURLToPath } from 'url';
import { dirname } from 'path';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// ==========================================
// 🗄️ PERSISTANCE FICHIER JSON
// ==========================================
const dataDir = path.join(process.cwd(), 'data');
const usersFile = path.join(dataDir, 'users.json');
const productsFile = path.join(dataDir, 'products.json');
const ordersFile = path.join(dataDir, 'orders.json');

// Créer le dossier data
if (!fs.existsSync(dataDir)) {
  fs.mkdirSync(dataDir, { recursive: true });
  console.log('📁 Dossier data créé');
}

// Gestion gracieuse des erreurs
process.on('uncaughtException', (error) => {
  console.error('💥 Erreur non gérée:', error.message);
  saveAllData(); // Sauvegarder avant crash
  process.exit(1);
});

process.on('unhandledRejection', (reason, promise) => {
  console.error('💥 Promesse rejetée:', reason);
  saveAllData();
  process.exit(1);
});

process.on('SIGINT', () => {
  console.log('\n🛑 Arrêt demandé, sauvegarde...');
  saveAllData();
  console.log('✅ Données sauvegardées, serveur arrêté');
  process.exit(0);
});

// Variables globales avec persistance
let users = [];
let products = [];
let orders = [];
let dbStatus = { 
  connected: true, 
  mode: 'Persistance JSON',
  productCount: 0,
  userCount: 0,
  lastSave: new Date().toISOString()
};

const EUR_TO_FCFA = 656.0;

// ==========================================
// 📁 FONCTIONS DE PERSISTANCE
// ==========================================
function loadData() {
  try {
    // Charger users
    if (fs.existsSync(usersFile)) {
      const userData = fs.readFileSync(usersFile, 'utf8');
      users = JSON.parse(userData);
      console.log(`👤 ${users.length} users chargés depuis ${usersFile}`);
    } else {
      users = [];
    }

    // Charger products
    if (fs.existsSync(productsFile)) {
      const productData = fs.readFileSync(productsFile, 'utf8');
      products = JSON.parse(productData);
      console.log(`📦 ${products.length} produits chargés depuis ${productsFile}`);
    } else {
      products = [];
    }

    // Charger orders
    if (fs.existsSync(ordersFile)) {
      const orderData = fs.readFileSync(ordersFile, 'utf8');
      orders = JSON.parse(orderData);
      console.log(`📋 ${orders.length} commandes chargées depuis ${ordersFile}`);
    } else {
      orders = [];
    }

    dbStatus.productCount = products.length;
    dbStatus.userCount = users.length;

  } catch (error) {
    console.error('❌ Erreur chargement données:', error.message);
    users = [];
    products = [];
    orders = [];
  }
}

function saveData(type, data) {
  try {
    let filename;
    switch (type) {
      case 'users':
        filename = usersFile;
        break;
      case 'products':
        filename = productsFile;
        break;
      case 'orders':
        filename = ordersFile;
        break;
      default:
        return;
    }

    fs.writeFileSync(filename, JSON.stringify(data, null, 2));
    dbStatus.lastSave = new Date().toISOString();
    console.log(`💾 ${type} sauvegardés dans ${filename}`);
  } catch (error) {
    console.error(`❌ Erreur sauvegarde ${type}:`, error.message);
  }
}

function saveAllData() {
  saveData('users', users);
  saveData('products', products);
  saveData('orders', orders);
  console.log('✅ Toutes les données sauvegardées');
}

function generateId() {
  return Date.now().toString(36) + Math.random().toString(36).substr(2, 9);
}

function seedInitialData() {
  // Créer admin si absent
  if (!users.find(u => u.email === 'admin@darra.com')) {
    const adminId = generateId();
    const hashedPassword = bcrypt.hashSync('admin123', 10);
    const admin = {
      id: adminId,
      firstName: 'Admin',
      lastName: 'DARRA',
      email: 'admin@darra.com',
      password: hashedPassword,
      isAdmin: true,
      createdAt: new Date().toISOString()
    };
    users.push(admin);
    console.log('👤 Admin créé: admin@darra.com / admin123');
  }

  // PAS DE PRODUITS MOCK - Base de données vide pour tes propres produits !
  console.log('📦 Base de données vide - Prête pour tes vrais produits !');
  
  dbStatus.productCount = products.length;
  dbStatus.userCount = users.length;
  saveAllData();
}

// ==========================================
// 📁 CONFIGURATION UPLOAD
// ==========================================
const uploadsDir = path.join(process.cwd(), 'uploads');
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
}

const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, uploadsDir),
  filename: (req, file, cb) => {
    const uniqueName = `${Date.now()}-${Math.round(Math.random() * 1E9)}${path.extname(file.originalname)}`;
    cb(null, uniqueName);
  }
});

const upload = multer({
  storage,
  fileFilter: (req, file, cb) => {
    if (file.mimetype.startsWith('image/')) {
      cb(null, true);
    } else {
      cb(new Error('Seules les images sont acceptées'), false);
    }
  },
  limits: { fileSize: 5 * 1024 * 1024, files: 5 }
});

// ==========================================
// 🌐 APPLICATION EXPRESS
// ==========================================
const app = express();

const corsOptions = {
  origin: process.env.CORS_ORIGIN || 'http://localhost:5173',
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true
};

app.use(cors(corsOptions));
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ extended: true, limit: '50mb' }));
app.use(morgan('combined'));
app.use('/uploads', express.static(uploadsDir));

// ==========================================
// 🔐 MIDDLEWARE D'AUTHENTIFICATION
// ==========================================
const authenticateToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return res.status(401).json({ success: false, error: 'Token manquant' });
  }

  jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
    if (err) return res.status(403).json({ success: false, error: 'Token invalide' });
    req.user = user;
    next();
  });
};

// ==========================================
// 📍 ROUTES API PERSISTANTES
// ==========================================

// Health check
app.get('/health', (req, res) => {
  dbStatus.lastCheck = new Date().toISOString();
  dbStatus.productCount = products.length;
  dbStatus.userCount = users.length;
  
  res.json({
    status: 'OK',
    timestamp: new Date().toISOString(),
    database: dbStatus,
    server: {
      uptime: Math.floor(process.uptime()),
      port: process.env.PORT || 5000,
      cors: corsOptions.origin,
      persistent: true,
      files: {
        users: fs.existsSync(usersFile) ? 'Existe' : 'Manquant',
        products: fs.existsSync(productsFile) ? 'Existe' : 'Manquant',
        orders: fs.existsSync(ordersFile) ? 'Existe' : 'Manquant'
      }
    }
  });
});

// API Produits avec persistance
app.get('/api/products', (req, res) => {
  try {
    const activeProducts = products.filter(p => p.isActive !== false);
    
    res.json({
      success: true,
      data: activeProducts,
      meta: {
        total: activeProducts.length,
        database: dbStatus,
        timestamp: new Date().toISOString()
      }
    });
  } catch (error) {
    console.error('❌ Erreur API produits:', error.message);
    res.status(500).json({
      success: false,
      error: 'Erreur serveur'
    });
  }
});

// Création produit avec sauvegarde
app.post('/api/products', upload.array('images', 5), (req, res) => {
  try {
    const {
      name, description, price, currency = 'EUR',
      category, brand = 'DARRA', stock = 0, tags, origin
    } = req.body;

    if (!name || !description || !price || !category) {
      return res.status(400).json({
        success: false,
        error: 'Champs requis: nom, description, prix, catégorie'
      });
    }

    let tagsArray = [];
    if (tags) {
      try {
        tagsArray = typeof tags === 'string' ? JSON.parse(tags) : tags;
      } catch (e) {
        tagsArray = typeof tags === 'string' ? [tags] : [];
      }
    }

    let imageUrls = [];
    if (req.files && req.files.length > 0) {
      imageUrls = req.files.map(file => `/uploads/${file.filename}`);
    }

    const priceNum = Math.abs(parseFloat(price)) || 0;
    
    const newProduct = {
      id: generateId(),
      name: String(name).trim(),
      description: String(description).trim(),
      price: priceNum,
      priceEUR: currency === 'EUR' ? priceNum : priceNum / EUR_TO_FCFA,
      priceFCFA: currency === 'EUR' ? priceNum * EUR_TO_FCFA : priceNum,
      currency,
      category,
      brand: String(brand).trim(),
      origin: origin || '',
      stock: Math.max(0, parseInt(stock) || 0),
      inStock: parseInt(stock) > 0,
      tags: tagsArray,
      image: imageUrls[0] || '/images/placeholder.jpg',
      images: imageUrls,
      rating: 0,
      reviews: 0,
      isActive: true,
      createdAt: new Date().toISOString()
    };

    products.push(newProduct);
    saveData('products', products);
    
    dbStatus.productCount = products.length;
    console.log('✅ Nouveau produit sauvé:', newProduct.name);

    res.status(201).json({
      success: true,
      data: newProduct,
      message: 'Produit créé et sauvé de façon permanente'
    });
  } catch (error) {
    console.error('❌ Erreur création produit:', error.message);
    res.status(500).json({
      success: false,
      error: 'Erreur lors de la création du produit'
    });
  }
});

// API Catégories
app.get('/api/categories', (req, res) => {
  const categories = [
    '💄 Cosmétiques',
    '🌸 Parfums et fragrances', 
    '✨ Soins du visage',
    '💅 Soins des ongles',
    '🧴 Soins capillaires'
  ];

  res.json({
    success: true,
    data: categories,
    meta: { total: categories.length }
  });
});

// Inscription avec sauvegarde
app.post('/auth/register', async (req, res) => {
  try {
    const { firstName, lastName, email, password } = req.body;
    
    if (!firstName || !lastName || !email || !password) {
      return res.status(400).json({
        success: false,
        error: 'Tous les champs sont requis'
      });
    }

    const existingUser = users.find(u => u.email === email.toLowerCase());
    if (existingUser) {
      return res.status(400).json({
        success: false,
        error: 'Utilisateur déjà existant'
      });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = {
      id: generateId(),
      firstName,
      lastName,
      email: email.toLowerCase(),
      password: hashedPassword,
      isAdmin: false,
      createdAt: new Date().toISOString()
    };

    users.push(newUser);
    saveData('users', users);
    dbStatus.userCount = users.length;

    const token = jwt.sign(
      { userId: newUser.id, email: newUser.email },
      process.env.JWT_SECRET,
      { expiresIn: process.env.JWT_EXPIRES_IN }
    );

    console.log('✅ Nouvel utilisateur sauvé:', newUser.email);

    res.status(201).json({
      success: true,
      token,
      user: {
        id: newUser.id,
        firstName: newUser.firstName,
        lastName: newUser.lastName,
        email: newUser.email,
        isAdmin: newUser.isAdmin
      },
      message: 'Utilisateur créé avec succès'
    });
  } catch (error) {
    console.error('❌ Erreur inscription:', error.message);
    res.status(500).json({
      success: false,
      error: 'Erreur lors de l\'inscription'
    });
  }
});

// Login
app.post('/auth/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    
    const user = users.find(u => u.email === email.toLowerCase());
    if (!user) {
      return res.status(400).json({
        success: false,
        error: 'Identifiants invalides'
      });
    }

    const validPassword = await bcrypt.compare(password, user.password);
    if (!validPassword) {
      return res.status(400).json({
        success: false,
        error: 'Identifiants invalides'
      });
    }

    const token = jwt.sign(
      { userId: user.id, email: user.email },
      process.env.JWT_SECRET,
      { expiresIn: process.env.JWT_EXPIRES_IN }
    );

    res.json({
      success: true,
      token,
      user: {
        id: user.id,
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        isAdmin: user.isAdmin
      }
    });
  } catch (error) {
    console.error('❌ Erreur login:', error.message);
    res.status(500).json({
      success: false,
      error: 'Erreur lors de la connexion'
    });
  }
});

// API Utilisateurs (protégée)
app.get('/api/users', authenticateToken, (req, res) => {
  try {
    const usersWithoutPasswords = users.map(user => {
      const { password, ...userWithoutPassword } = user;
      return userWithoutPassword;
    });
    
    res.json({
      success: true,
      data: usersWithoutPasswords,
      meta: { total: usersWithoutPasswords.length }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Erreur serveur'
    });
  }
});

// Stats
app.get('/api/stats', (req, res) => {
  try {
    res.json({
      success: true,
      data: {
        totalProducts: products.length,
        totalUsers: users.length,
        totalOrders: orders.length,
        totalCategories: 5,
        database: dbStatus.mode,
        uptime: Math.floor(process.uptime()),
        lastSave: dbStatus.lastSave
      },
      meta: { timestamp: new Date().toISOString() }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Erreur serveur'
    });
  }
});

// Middleware d'erreurs
app.use((err, req, res, next) => {
  console.error('💥 Erreur middleware:', err.message);
  res.status(500).json({
    success: false,
    error: 'Erreur interne serveur'
  });
});

// 404
app.use('*', (req, res) => {
  res.status(404).json({
    success: false,
    error: 'Route non trouvée'
  });
});

// ==========================================
// 🚀 DÉMARRAGE SERVEUR AVEC PERSISTANCE
// ==========================================
function startServerWithPersistence() {
  const PORT = process.env.PORT || 5000;
  
  console.log('🌟========================================🌟');
  console.log('💾  SERVEUR DARRA - PERSISTANCE JSON  💾');
  console.log('🌟========================================🌟\n');
  
  // Charger les données existantes
  loadData();
  
  // Créer données initiales si nécessaire
  seedInitialData();
  
  // Auto-sauvegarde toutes les 30 secondes
  setInterval(() => {
    saveAllData();
  }, 30000);

  // Démarrer le serveur
  const server = app.listen(PORT, () => {
    console.log('✅ SERVEUR PERSISTANT DÉMARRÉ !');
    console.log('========================================');
    console.log(`🌐 URL: http://localhost:${PORT}`);
    console.log(`💾 Persistance: ${dbStatus.mode}`);
    console.log(`📦 Produits: ${dbStatus.productCount}`);
    console.log(`👤 Utilisateurs: ${dbStatus.userCount}`);
    console.log(`🌍 CORS: ${corsOptions.origin}`);
    console.log('========================================');
    console.log('🔥 FONCTIONNALITÉS PERSISTANTES:');
    console.log('   ✅ Produits sauvés dans data/products.json');
    console.log('   ✅ Users sauvés dans data/users.json');
    console.log('   ✅ Commandes sauvées dans data/orders.json');
    console.log('   ✅ Auto-sauvegarde toutes les 30s');
    console.log('   ✅ Upload images permanent');
    console.log('========================================');
    console.log(`💾 Fichiers: ${usersFile}`);
    console.log(`💾 Fichiers: ${productsFile}`);
    console.log(`💾 Fichiers: ${ordersFile}`);
    console.log('========================================');
    console.log('🌟 PERSISTANCE 100% ACTIVE ! 🌟');
    console.log('========================================');
  });

  return server;
}

// Démarrage
startServerWithPersistence();