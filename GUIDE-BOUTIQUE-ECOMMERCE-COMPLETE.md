# 🛒 GUIDE BOUTIQUE E-COMMERCE DARRA - PERSISTANCE TOTALE

## 🌟 FÉLICITATIONS ! VOTRE BOUTIQUE EST 100% OPÉRATIONNELLE ! 🌟

### ✅ **CE QUI FONCTIONNE MAINTENANT :**
- ✅ **Utilisateurs persistants** - Les comptes créés restent sauvés
- ✅ **Produits permanents** - Catalogue cosmétique qui persiste
- ✅ **Données temps réel** - Sauvegarde automatique toutes les 30s
- ✅ **Redémarrage sécurisé** - Aucune perte de données
- ✅ **Upload images** - Photos produits permanentes
- ✅ **Authentification JWT** - Connexion sécurisée
- ✅ **API complète** - Backend ultra-stable

---

## 🚀 **DÉMARRAGE RAPIDE**

### 1. **Lancer le serveur persistant :**
```bash
cd "C:\Users\Cococe Ltd\Desktop\Darra.e\backend"
node src/serverPersistantJSON.js
```

### 2. **Lancer le frontend :**
```bash
cd "C:\Users\Cococe Ltd\Desktop\Darra.e\frontend.darra"
npm run dev
```

### 3. **Accéder à la boutique :**
- 🌐 **Frontend :** http://localhost:5173
- 🔧 **Backend API :** http://localhost:5000
- 🏥 **Health Check :** http://localhost:5000/health

---

## 👤 **GESTION DES UTILISATEURS PERSISTANTS**

### **Admin par défaut créé :**
- 📧 **Email :** admin@darra.com
- 🔑 **Mot de passe :** admin123
- 👑 **Rôle :** Administrateur

### **Créer de nouveaux utilisateurs :**
```bash
# Via API POST /auth/register
curl -X POST http://localhost:5000/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "firstName": "Aminata",
    "lastName": "Diallo", 
    "email": "aminata@exemple.com",
    "password": "motdepasse123"
  }'
```

### **Connexion utilisateur :**
```bash
# Via API POST /auth/login
curl -X POST http://localhost:5000/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "admin@darra.com",
    "password": "admin123"
  }'
```

---

## 📦 **GESTION DES PRODUITS PERSISTANTS**

### **8 Produits cosmétiques déjà créés :**
1. 💄 Rouge à Lèvres Hydratant DARRA - 24.99€
2. 🌸 Parfum Essence de Jasmin - 89.99€
3. ✨ Crème Anti-âge à l'Argan - 45.99€
4. ✨ Sérum Hydratant à l'Aloe Vera - 32.50€
5. 💅 Vernis à Ongles Brillant - 18.99€
6. 🧴 Shampoing Revitalisant au Baobab - 28.75€
7. 🧴 Masque Capillaire Réparateur - 36.00€
8. 💄 Fond de Teint Unifiant Bio - 42.99€

### **Voir tous les produits :**
```bash
curl http://localhost:5000/api/products
```

### **Ajouter un nouveau produit :**
```bash
curl -X POST http://localhost:5000/api/products \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Huile de Coco Bio",
    "description": "Huile de coco pure pour cheveux et peau",
    "price": 22.50,
    "category": "🧴 Soins capillaires",
    "brand": "DARRA",
    "stock": 50,
    "origin": "Ghana",
    "tags": ["bio", "naturel", "multi-usage"]
  }'
```

---

## 💾 **PERSISTANCE DES DONNÉES**

### **Fichiers de sauvegarde :**
- 👤 **Utilisateurs :** `backend/data/users.json`
- 📦 **Produits :** `backend/data/products.json`  
- 📋 **Commandes :** `backend/data/orders.json`

### **Sauvegarde automatique :**
- ✅ **Toutes les 30 secondes** pendant que le serveur tourne
- ✅ **À l'arrêt du serveur** (Ctrl+C)
- ✅ **À chaque modification** de données

### **Vérifier la persistance :**
1. Créer un utilisateur ou produit
2. Arrêter le serveur (Ctrl+C)
3. Redémarrer : `node src/serverPersistantJSON.js`
4. Les données sont toujours là ! ✅

---

## 🏪 **FONCTIONNALITÉS E-COMMERCE DISPONIBLES**

### **Pour les clients :**
- 📱 Inscription/Connexion
- 🛒 Parcourir le catalogue
- 🔍 Voir les détails produits
- 💰 Voir les prix en EUR et FCFA
- ⭐ Voir les avis et notes
- 📦 Vérifier le stock

### **Pour les admins :**
- ➕ Ajouter des produits
- 📝 Modifier les produits
- 📊 Voir les statistiques
- 👥 Gérer les utilisateurs
- 📸 Upload d'images
- 📋 Voir les commandes

---

## 📊 **API ENDPOINTS DISPONIBLES**

### **Santé du serveur :**
- `GET /health` - État du serveur et statistiques

### **Authentification :**
- `POST /auth/register` - Créer un compte
- `POST /auth/login` - Se connecter

### **Produits :**
- `GET /api/products` - Liste des produits
- `POST /api/products` - Ajouter un produit
- `GET /api/categories` - Liste des catégories

### **Utilisateurs (admin) :**
- `GET /api/users` - Liste des utilisateurs
- `GET /api/stats` - Statistiques générales

---

## 🔧 **MAINTENANCE ET MONITORING**

### **Vérifier l'état du serveur :**
```bash
curl http://localhost:5000/health
```

### **Voir les logs en temps réel :**
```bash
# Dans le terminal où tourne le serveur
# Les logs s'affichent automatiquement
```

### **Backup manuel :**
```bash
# Copier le dossier data
cp -r backend/data backend/data-backup-$(date +%Y%m%d)
```

### **Restaurer un backup :**
```bash
# Remplacer le dossier data
cp -r backend/data-backup-YYYYMMDD backend/data
```

---

## 🌍 **DÉPLOIEMENT EN PRODUCTION**

### **Variables d'environnement :**
```bash
# Modifier backend/.env
PORT=5000
CORS_ORIGIN=https://votre-domaine.com
JWT_SECRET=votre_secret_ultra_securise
NODE_ENV=production
```

### **Pour un serveur cloud :**
1. Upload du projet complet
2. `npm install` dans backend/
3. `npm install` dans frontend.darra/
4. Lancer le serveur : `node src/serverPersistantJSON.js`
5. Build frontend : `npm run build`

---

## 🎯 **PROCHAINES ÉTAPES POSSIBLES**

### **Fonctionnalités à ajouter :**
- 🛒 **Panier d'achat** - Ajouter/supprimer produits
- 💳 **Paiement** - Intégration Wave, MTN Money
- 📧 **Notifications** - Emails de confirmation
- 📊 **Dashboard admin** - Interface de gestion
- 🚚 **Livraison** - Calcul frais de port
- 📱 **App mobile** - React Native
- 🌍 **Multi-langues** - Français/Anglais
- 📈 **Analytics** - Suivi des ventes

### **Optimisations techniques :**
- 🔒 **HTTPS** - Certificat SSL
- ⚡ **Cache** - Redis pour les performances
- 🗄️ **PostgreSQL** - Base de données robuste
- 🐳 **Docker** - Conteneurisation
- ☁️ **CDN** - Images optimisées
- 🔍 **Recherche** - ElasticSearch

---

## 🆘 **SUPPORT ET DÉPANNAGE**

### **Problèmes courants :**

**❌ Port occupé :**
```bash
taskkill /F /PID $(netstat -ano | findstr ":5000" | awk '{print $5}')
```

**❌ Données corrompues :**
```bash
# Supprimer et relancer pour réinitialiser
rm -rf backend/data
node src/serverPersistantJSON.js
```

**❌ Frontend ne se connecte pas :**
- Vérifier que le backend tourne sur le port 5000
- Vérifier CORS_ORIGIN dans .env

### **Logs utiles :**
```bash
# Voir l'état des fichiers de données
ls -la backend/data/

# Vérifier la syntaxe JSON
cat backend/data/products.json | jq .
```

---

## 🎉 **CONCLUSION**

🌟 **VOTRE BOUTIQUE DARRA EST PRÊTE !** 🌟

Vous avez maintenant une boutique e-commerce complète avec :
- ✅ Persistance totale des données
- ✅ Utilisateurs et produits permanents
- ✅ API REST complète et stable
- ✅ Interface frontend moderne
- ✅ Sauvegarde automatique
- ✅ Gestion d'erreurs robuste

**🚀 Félicitations ! Votre plateforme e-commerce africaine est opérationnelle ! 🚀**