# 🔗 GUIDE COMPLET : CONNEXION FRONTEND-BACKEND DÉPLOYÉ

## 🎯 PROBLÈME RÉSOLU
Votre frontend Netlify ne peut pas se connecter à votre backend local (localhost:5000).

## ✅ SOLUTIONS APPLIQUÉES

### 1. Configuration des variables d'environnement
- ✅ Créé `.env` dans frontend.darra
- ✅ Modifié `api.ts` pour utiliser `VITE_API_BASE_URL`
- ✅ Corrigé tous les fichiers avec URLs hardcodées
- ✅ Mis à jour `netlify.toml` avec la variable d'environnement

### 2. Préparation du backend pour le déploiement
- ✅ Package.json prêt avec engines Node 18+
- ✅ Script start configuré
- ✅ Variables d'environnement documentées
- ✅ Configuration CORS flexible

## 🚀 ÉTAPES DE DÉPLOIEMENT

### A. DÉPLOYER LE BACKEND (Render.com)
1. Aller sur https://render.com
2. Créer un "Web Service"
3. Connecter le repo GitHub
4. Configuration:
   - Root Directory: `backend`
   - Build Command: `npm install`
   - Start Command: `npm start`
5. Variables d'environnement:
   ```
   NODE_ENV=production
   CORS_ORIGIN=https://votre-site.netlify.app
   JWT_SECRET=darra_secret_key_2024_ultra_secure_production
   ```

### B. METTRE À JOUR NETLIFY
1. Une fois le backend déployé, récupérer l'URL (ex: https://darra-backend.onrender.com)
2. Dans netlify.toml, remplacer:
   ```
   VITE_API_BASE_URL = "https://darra-backend.onrender.com"
   ```
3. Push les changements sur GitHub
4. Netlify redéploiera automatiquement

## 🔄 WORKFLOW FINAL
1. Code → GitHub
2. GitHub → Render (backend)
3. GitHub → Netlify (frontend)
4. Frontend connecté au backend déployé

## 🎉 RÉSULTAT
Votre boutique DARRA sera 100% fonctionnelle avec backend et frontend déployés et connectés !

---
Date: 17 novembre 2025
Statut: Configuration prête pour déploiement