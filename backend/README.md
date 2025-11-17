# 🚀 DARRA Backend API

Backend Node.js + Express + MongoDB pour l'application e-commerce DARRA spécialisée dans les produits alimentaires africains.

## 🛠️ Technologies utilisées

- **Node.js** - Runtime JavaScript
- **Express.js** - Framework web
- **MongoDB** - Base de données NoSQL
- **Mongoose** - ODM pour MongoDB
- **JWT** - Authentification par tokens
- **Bcryptjs** - Hashage des mots de passe
- **Joi** - Validation des données
- **Multer** - Upload de fichiers
- **Cloudinary** - Stockage d'images

## 📋 Prérequis

- Node.js 18+ 
- MongoDB (local ou Atlas)
- NPM ou Yarn

## ⚙️ Installation

1. **Cloner le projet**
```bash
git clone <repository-url>
cd backend
```

2. **Installer les dépendances**
```bash
npm install
```

3. **Configurer les variables d'environnement**
```bash
cp .env.example .env
# Puis éditer le fichier .env avec vos valeurs
```

4. **Démarrer MongoDB (si local)**
```bash
mongod
```

5. **Démarrer le serveur**
```bash
# Mode développement
npm run dev

# Mode production
npm start
```

## 🌐 Endpoints API

### Authentication (`/api/auth`)

| Méthode | Endpoint | Description | Auth |
|---------|----------|-------------|------|
| POST | `/register` | Inscription | Public |
| POST | `/login` | Connexion | Public |
| POST | `/logout` | Déconnexion | Private |
| POST | `/logout-all` | Déconnexion tous appareils | Private |
| POST | `/refresh-token` | Renouveler token | Public |
| GET | `/profile` | Profil utilisateur | Private |
| PUT | `/profile` | Mettre à jour profil | Private |
| PUT | `/change-password` | Changer mot de passe | Private |
| POST | `/forgot-password` | Mot de passe oublié | Public |
| POST | `/reset-password` | Réinitialiser mot de passe | Public |
| POST | `/addresses` | Ajouter adresse | Private |
| PUT | `/addresses/:id` | Modifier adresse | Private |
| DELETE | `/addresses/:id` | Supprimer adresse | Private |

### Exemples d'utilisation

**Inscription**
```bash
curl -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "name": "John Doe",
    "email": "john@example.com",
    "password": "password123",
    "phone": "+221701234567"
  }'
```

**Connexion**
```bash
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "john@example.com",
    "password": "password123"
  }'
```

**Profil (avec token)**
```bash
curl -X GET http://localhost:5000/api/auth/profile \
  -H "Authorization: Bearer YOUR_TOKEN_HERE"
```

## 📊 Structure des données

### User
```json
{
  "name": "John Doe",
  "email": "john@example.com",
  "role": "user",
  "phone": "+221701234567",
  "addresses": [
    {
      "name": "Domicile",
      "street": "Rue 123",
      "city": "Dakar",
      "state": "Dakar",
      "zipCode": "12345",
      "country": "Sénégal",
      "isDefault": true
    }
  ],
  "isActive": true,
  "emailVerified": false
}
```

## 🔒 Sécurité

- Hashage des mots de passe avec bcrypt
- Authentification JWT avec refresh tokens
- Rate limiting sur les API
- Validation stricte des données
- Headers de sécurité avec Helmet
- Protection CORS

## 🧪 Tests

```bash
# Lancer tous les tests
npm test

# Tests en mode watch
npm run test:watch

# Coverage
npm run test:coverage
```

## 📝 Logs

Les logs sont configurés avec Morgan et affichent :
- Requêtes HTTP entrantes
- Erreurs serveur
- Connexions base de données

## 🚀 Déploiement

### Variables d'environnement requises

```env
NODE_ENV=production
PORT=5000
MONGODB_URI=mongodb+srv://...
JWT_SECRET=your-secret-key
JWT_REFRESH_SECRET=your-refresh-secret
CLOUDINARY_CLOUD_NAME=your-cloud-name
CLOUDINARY_API_KEY=your-api-key
CLOUDINARY_API_SECRET=your-api-secret
```

### Commandes de déploiement

```bash
npm run build
npm start
```

## 📈 Monitoring

- Health check: `GET /health`
- Métriques disponibles sur les endpoints
- Logs centralisés

## 🤝 Contribution

1. Fork le projet
2. Créer une branche feature (`git checkout -b feature/AmazingFeature`)
3. Commit les changements (`git commit -m 'Add AmazingFeature'`)
4. Push vers la branche (`git push origin feature/AmazingFeature`)
5. Ouvrir une Pull Request

## 📄 Licence

MIT License - voir le fichier LICENSE

## 📞 Support

Pour toute question ou problème, créer une issue sur le repository GitHub.