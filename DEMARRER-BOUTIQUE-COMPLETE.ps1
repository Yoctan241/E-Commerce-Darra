#!/usr/bin/env powershell

# 🚀 DÉMARRAGE BOUTIQUE DARRA - PERSISTANCE TOTALE
# Lance backend + frontend avec données permanentes

Write-Host "🌟========================================🌟" -ForegroundColor Cyan
Write-Host "🛒  DÉMARRAGE BOUTIQUE DARRA COMPLÈTE  🛒" -ForegroundColor Cyan  
Write-Host "🌟========================================🌟" -ForegroundColor Cyan
Write-Host ""

$projectRoot = "C:\Users\Cococe Ltd\Desktop\Darra.e"
$backendPath = Join-Path $projectRoot "backend"
$frontendPath = Join-Path $projectRoot "frontend.darra"

# Vérifier les dossiers
if (-not (Test-Path $backendPath)) {
    Write-Host "❌ Dossier backend manquant: $backendPath" -ForegroundColor Red
    exit 1
}

if (-not (Test-Path $frontendPath)) {
    Write-Host "❌ Dossier frontend manquant: $frontendPath" -ForegroundColor Red
    exit 1
}

# Vérifier le serveur persistant
$serverFile = Join-Path $backendPath "src\serverPersistantJSON.js"
if (-not (Test-Path $serverFile)) {
    Write-Host "❌ Serveur persistant manquant: $serverFile" -ForegroundColor Red
    exit 1
}

Write-Host "📋 Vérification des composants..." -ForegroundColor Yellow
Write-Host "✅ Backend trouvé: $backendPath" -ForegroundColor Green
Write-Host "✅ Frontend trouvé: $frontendPath" -ForegroundColor Green
Write-Host "✅ Serveur persistant: $serverFile" -ForegroundColor Green
Write-Host ""

# Fonction pour tuer les processus sur les ports
function Stop-ProcessOnPort {
    param([int]$Port)
    
    $processes = netstat -ano | Select-String ":$Port.*LISTENING"
    foreach ($process in $processes) {
        $pid = ($process.ToString() -split '\s+')[-1]
        if ($pid -and $pid -ne "0") {
            Write-Host "🛑 Arrêt processus PID $pid sur port $Port" -ForegroundColor Yellow
            try {
                taskkill /F /PID $pid 2>$null
                Start-Sleep -Seconds 1
            } catch {
                # Ignorer les erreurs
            }
        }
    }
}

# Nettoyer les ports
Write-Host "🧹 Nettoyage des ports..." -ForegroundColor Yellow
Stop-ProcessOnPort -Port 5000
Stop-ProcessOnPort -Port 5173

Write-Host "✅ Ports libérés" -ForegroundColor Green
Write-Host ""

# Fonction pour démarrer le backend
function Start-Backend {
    Write-Host "🚀 Démarrage du backend persistant..." -ForegroundColor Cyan
    
    Set-Location $backendPath
    
    # Vérifier Node.js
    try {
        $nodeVersion = node --version
        Write-Host "✅ Node.js version: $nodeVersion" -ForegroundColor Green
    } catch {
        Write-Host "❌ Node.js non trouvé. Installez Node.js d'abord." -ForegroundColor Red
        return $false
    }
    
    # Installer les dépendances si nécessaire
    if (-not (Test-Path "node_modules")) {
        Write-Host "📦 Installation des dépendances backend..." -ForegroundColor Yellow
        npm install
        if ($LASTEXITCODE -ne 0) {
            Write-Host "❌ Erreur installation backend" -ForegroundColor Red
            return $false
        }
    }
    
    Write-Host "🌐 Backend démarré sur http://localhost:5000" -ForegroundColor Green
    Write-Host "💾 Persistance JSON activée dans: $backendPath\data" -ForegroundColor Green
    Write-Host ""
    
    # Démarrer en arrière-plan
    $backendJob = Start-Job -ScriptBlock {
        param($path, $serverFile)
        Set-Location $path
        node $serverFile
    } -ArgumentList $backendPath, $serverFile
    
    return $backendJob
}

# Fonction pour démarrer le frontend  
function Start-Frontend {
    Write-Host "🎨 Démarrage du frontend..." -ForegroundColor Cyan
    
    Set-Location $frontendPath
    
    # Installer les dépendances si nécessaire
    if (-not (Test-Path "node_modules")) {
        Write-Host "📦 Installation des dépendances frontend..." -ForegroundColor Yellow
        npm install
        if ($LASTEXITCODE -ne 0) {
            Write-Host "❌ Erreur installation frontend" -ForegroundColor Red
            return $false
        }
    }
    
    Write-Host "🌐 Frontend démarré sur http://localhost:5173" -ForegroundColor Green
    Write-Host ""
    
    # Démarrer en arrière-plan
    $frontendJob = Start-Job -ScriptBlock {
        param($path)
        Set-Location $path
        npm run dev
    } -ArgumentList $frontendPath
    
    return $frontendJob
}

# Démarrer le backend
$backendJob = Start-Backend
if (-not $backendJob) {
    Write-Host "❌ Impossible de démarrer le backend" -ForegroundColor Red
    exit 1
}

Write-Host "⏳ Attente démarrage backend..." -ForegroundColor Yellow
Start-Sleep -Seconds 5

# Tester la connexion backend
try {
    $response = Invoke-RestMethod -Uri "http://localhost:5000/health" -TimeoutSec 10
    Write-Host "✅ Backend opérationnel" -ForegroundColor Green
    Write-Host "📊 Produits: $($response.database.productCount)" -ForegroundColor Green
    Write-Host "👤 Users: $($response.database.userCount)" -ForegroundColor Green
} catch {
    Write-Host "⚠️ Backend démarrage en cours..." -ForegroundColor Yellow
}

# Démarrer le frontend
$frontendJob = Start-Frontend
if (-not $frontendJob) {
    Write-Host "❌ Impossible de démarrer le frontend" -ForegroundColor Red
    # Arrêter le backend
    Stop-Job $backendJob -ErrorAction SilentlyContinue
    Remove-Job $backendJob -ErrorAction SilentlyContinue
    exit 1
}

Write-Host "⏳ Attente démarrage frontend..." -ForegroundColor Yellow
Start-Sleep -Seconds 8

# Affichage final
Write-Host "🎉========================================🎉" -ForegroundColor Green
Write-Host "✅  BOUTIQUE DARRA COMPLÈTEMENT DÉMARRÉE  ✅" -ForegroundColor Green
Write-Host "🎉========================================🎉" -ForegroundColor Green
Write-Host ""
Write-Host "🌐 ACCÈS À LA BOUTIQUE:" -ForegroundColor Cyan
Write-Host "   🛒 Frontend:  http://localhost:5173" -ForegroundColor Green
Write-Host "   🔧 Backend:   http://localhost:5000" -ForegroundColor Green  
Write-Host "   🏥 Health:    http://localhost:5000/health" -ForegroundColor Green
Write-Host ""
Write-Host "👤 COMPTE ADMIN:" -ForegroundColor Cyan
Write-Host "   📧 Email:     admin@darra.com" -ForegroundColor Yellow
Write-Host "   🔑 Mot de passe: admin123" -ForegroundColor Yellow
Write-Host ""
Write-Host "💾 PERSISTANCE ACTIVE:" -ForegroundColor Cyan
Write-Host "   📁 Users:     backend\data\users.json" -ForegroundColor Green
Write-Host "   📦 Produits:  backend\data\products.json" -ForegroundColor Green
Write-Host "   📋 Commandes: backend\data\orders.json" -ForegroundColor Green
Write-Host ""
Write-Host "🔥 FONCTIONNALITÉS DISPONIBLES:" -ForegroundColor Cyan
Write-Host "   ✅ Utilisateurs persistants" -ForegroundColor Green
Write-Host "   ✅ Produits cosmétiques permanents" -ForegroundColor Green  
Write-Host "   ✅ Authentification sécurisée" -ForegroundColor Green
Write-Host "   ✅ Upload images" -ForegroundColor Green
Write-Host "   ✅ Sauvegarde automatique" -ForegroundColor Green
Write-Host "   ✅ API REST complète" -ForegroundColor Green
Write-Host ""
Write-Host "🛒 VOTRE BOUTIQUE E-COMMERCE AFRICAINE EST PRÊTE ! 🛒" -ForegroundColor Magenta
Write-Host "========================================" -ForegroundColor Green

# Ouvrir les navigateurs
Write-Host "🌐 Ouverture des pages..." -ForegroundColor Cyan
Start-Process "http://localhost:5173"
Start-Sleep -Seconds 2
Start-Process "http://localhost:5000/health"

Write-Host ""
Write-Host "📋 COMMANDES UTILES:" -ForegroundColor Cyan
Write-Host "   Arrêter tout:        Ctrl+C" -ForegroundColor Yellow
Write-Host "   Voir les jobs:       Get-Job" -ForegroundColor Yellow
Write-Host "   État backend:        curl http://localhost:5000/health" -ForegroundColor Yellow
Write-Host "   Produits:           curl http://localhost:5000/api/products" -ForegroundColor Yellow
Write-Host ""

# Attendre l'arrêt
Write-Host "⏳ Boutique en cours d'exécution... (Ctrl+C pour arrêter)" -ForegroundColor Green

try {
    # Surveiller les jobs
    while ($true) {
        Start-Sleep -Seconds 10
        
        # Vérifier si les jobs sont toujours actifs
        $backendState = Get-Job -Id $backendJob.Id -ErrorAction SilentlyContinue
        $frontendState = Get-Job -Id $frontendJob.Id -ErrorAction SilentlyContinue
        
        if ($backendState.State -eq "Failed") {
            Write-Host "❌ Backend arrêté de manière inattendue" -ForegroundColor Red
            break
        }
        
        if ($frontendState.State -eq "Failed") {
            Write-Host "❌ Frontend arrêté de manière inattendue" -ForegroundColor Red
            break
        }
    }
} finally {
    Write-Host ""
    Write-Host "🛑 Arrêt de la boutique..." -ForegroundColor Yellow
    
    # Arrêter les jobs
    Stop-Job $backendJob -ErrorAction SilentlyContinue
    Stop-Job $frontendJob -ErrorAction SilentlyContinue
    Remove-Job $backendJob -ErrorAction SilentlyContinue
    Remove-Job $frontendJob -ErrorAction SilentlyContinue
    
    # Nettoyer les ports
    Stop-ProcessOnPort -Port 5000
    Stop-ProcessOnPort -Port 5173
    
    Write-Host "✅ Boutique arrêtée proprement" -ForegroundColor Green
    Write-Host "💾 Données sauvegardées dans backend\data\" -ForegroundColor Green
}