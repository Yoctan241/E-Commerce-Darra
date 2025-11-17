#!/usr/bin/env powershell

# 🧪 TEST COMPLET BOUTIQUE DARRA - VÉRIFICATION PERSISTANCE
# Teste toutes les fonctionnalités e-commerce

Write-Host "🧪========================================🧪" -ForegroundColor Cyan
Write-Host "🔍   TESTS BOUTIQUE DARRA COMPLÈTE   🔍" -ForegroundColor Cyan
Write-Host "🧪========================================🧪" -ForegroundColor Cyan
Write-Host ""

$baseUrl = "http://localhost:5000"

# Fonction pour tester une API
function Test-API {
    param(
        [string]$Url,
        [string]$Method = "GET",
        [hashtable]$Headers = @{},
        [string]$Body = $null,
        [string]$Description
    )
    
    Write-Host "🔍 Test: $Description" -ForegroundColor Yellow
    Write-Host "   URL: $Method $Url" -ForegroundColor Gray
    
    try {
        $params = @{
            Uri = $Url
            Method = $Method
            Headers = $Headers
            TimeoutSec = 10
        }
        
        if ($Body) {
            $params.Body = $Body
            $params.ContentType = "application/json"
        }
        
        $response = Invoke-RestMethod @params
        
        Write-Host "   ✅ Succès" -ForegroundColor Green
        return @{ Success = $true; Data = $response }
    } catch {
        Write-Host "   ❌ Échec: $($_.Exception.Message)" -ForegroundColor Red
        return @{ Success = $false; Error = $_.Exception.Message }
    }
}

# 1. Test de santé du serveur
Write-Host "🏥 ÉTAPE 1: Santé du serveur" -ForegroundColor Cyan
$healthResult = Test-API -Url "$baseUrl/health" -Description "État du serveur"

if (-not $healthResult.Success) {
    Write-Host "❌ Serveur non accessible. Démarrez-le d'abord!" -ForegroundColor Red
    Write-Host "   Commande: node src/serverPersistantJSON.js" -ForegroundColor Yellow
    exit 1
}

$health = $healthResult.Data
Write-Host "   📊 Mode DB: $($health.database.mode)" -ForegroundColor Green
Write-Host "   📦 Produits: $($health.database.productCount)" -ForegroundColor Green  
Write-Host "   👤 Users: $($health.database.userCount)" -ForegroundColor Green
Write-Host "   ⏱️ Uptime: $($health.server.uptime)s" -ForegroundColor Green
Write-Host ""

# 2. Test des produits
Write-Host "📦 ÉTAPE 2: Catalogue produits" -ForegroundColor Cyan
$productsResult = Test-API -Url "$baseUrl/api/products" -Description "Liste des produits"

if ($productsResult.Success) {
    $products = $productsResult.Data.data
    Write-Host "   ✅ $($products.Count) produits trouvés" -ForegroundColor Green
    
    # Afficher quelques produits
    for ($i = 0; $i -lt [Math]::Min(3, $products.Count); $i++) {
        $p = $products[$i]
        Write-Host "   🌿 $($p.name) - $($p.price)€" -ForegroundColor Green
    }
}
Write-Host ""

# 3. Test des catégories
Write-Host "🏷️ ÉTAPE 3: Catégories produits" -ForegroundColor Cyan
$categoriesResult = Test-API -Url "$baseUrl/api/categories" -Description "Liste des catégories"

if ($categoriesResult.Success) {
    $categories = $categoriesResult.Data.data
    Write-Host "   ✅ $($categories.Count) catégories disponibles:" -ForegroundColor Green
    foreach ($cat in $categories) {
        Write-Host "   📂 $cat" -ForegroundColor Green
    }
}
Write-Host ""

# 4. Test de création d'utilisateur
Write-Host "👤 ÉTAPE 4: Création utilisateur test" -ForegroundColor Cyan
$newUser = @{
    firstName = "Test"
    lastName = "User"
    email = "test-$(Get-Random)@exemple.com"
    password = "test123"
} | ConvertTo-Json

$registerResult = Test-API -Url "$baseUrl/auth/register" -Method "POST" -Body $newUser -Description "Inscription nouveau user"

$userToken = $null
if ($registerResult.Success) {
    $userToken = $registerResult.Data.token
    Write-Host "   👤 User créé: $($registerResult.Data.user.email)" -ForegroundColor Green
    Write-Host "   🔑 Token reçu" -ForegroundColor Green
}
Write-Host ""

# 5. Test de connexion admin
Write-Host "🔐 ÉTAPE 5: Connexion administrateur" -ForegroundColor Cyan
$adminLogin = @{
    email = "admin@darra.com"
    password = "admin123"
} | ConvertTo-Json

$loginResult = Test-API -Url "$baseUrl/auth/login" -Method "POST" -Body $adminLogin -Description "Login admin"

$adminToken = $null
if ($loginResult.Success) {
    $adminToken = $loginResult.Data.token
    Write-Host "   👑 Admin connecté: $($loginResult.Data.user.email)" -ForegroundColor Green
    Write-Host "   🔑 Token admin reçu" -ForegroundColor Green
}
Write-Host ""

# 6. Test des utilisateurs (admin requis)
if ($adminToken) {
    Write-Host "👥 ÉTAPE 6: Liste utilisateurs (admin)" -ForegroundColor Cyan
    $usersHeaders = @{ Authorization = "Bearer $adminToken" }
    $usersResult = Test-API -Url "$baseUrl/api/users" -Headers $usersHeaders -Description "Liste users (admin)"
    
    if ($usersResult.Success) {
        $users = $usersResult.Data.data
        Write-Host "   ✅ $($users.Count) utilisateurs trouvés" -ForegroundColor Green
        foreach ($user in $users) {
            $role = if ($user.isAdmin) { "👑 Admin" } else { "👤 User" }
            Write-Host "   $role $($user.email)" -ForegroundColor Green
        }
    }
    Write-Host ""
}

# 7. Test création produit
if ($adminToken) {
    Write-Host "➕ ÉTAPE 7: Création nouveau produit" -ForegroundColor Cyan
    $newProduct = @{
        name = "Produit Test $(Get-Random)"
        description = "Produit créé par les tests automatiques"
        price = 19.99
        category = "💄 Cosmétiques"
        brand = "DARRA"
        stock = 10
        origin = "Test Lab"
        tags = @("test", "automatique")
    } | ConvertTo-Json
    
    $createProductHeaders = @{ Authorization = "Bearer $adminToken" }
    $productResult = Test-API -Url "$baseUrl/api/products" -Method "POST" -Headers $createProductHeaders -Body $newProduct -Description "Création produit"
    
    if ($productResult.Success) {
        Write-Host "   ✅ Produit créé: $($productResult.Data.data.name)" -ForegroundColor Green
        Write-Host "   💰 Prix: $($productResult.Data.data.price)€" -ForegroundColor Green
    }
    Write-Host ""
}

# 8. Test des statistiques
Write-Host "📊 ÉTAPE 8: Statistiques générales" -ForegroundColor Cyan
$statsResult = Test-API -Url "$baseUrl/api/stats" -Description "Statistiques globales"

if ($statsResult.Success) {
    $stats = $statsResult.Data.data
    Write-Host "   📦 Total produits: $($stats.totalProducts)" -ForegroundColor Green
    Write-Host "   👤 Total users: $($stats.totalUsers)" -ForegroundColor Green
    Write-Host "   📋 Total commandes: $($stats.totalOrders)" -ForegroundColor Green
    Write-Host "   🏷️ Total catégories: $($stats.totalCategories)" -ForegroundColor Green
    Write-Host "   ⏱️ Uptime: $($stats.uptime)s" -ForegroundColor Green
}
Write-Host ""

# 9. Test de persistance - Vérifier les fichiers
Write-Host "💾 ÉTAPE 9: Vérification persistance fichiers" -ForegroundColor Cyan
$dataPath = "backend\data"
$files = @("users.json", "products.json", "orders.json")

foreach ($file in $files) {
    $filePath = Join-Path $dataPath $file
    if (Test-Path $filePath) {
        $fileSize = (Get-Item $filePath).Length
        Write-Host "   ✅ $file existe ($fileSize octets)" -ForegroundColor Green
    } else {
        Write-Host "   ❌ $file manquant" -ForegroundColor Red
    }
}
Write-Host ""

# 10. Test erreur 404
Write-Host "❌ ÉTAPE 10: Test gestion erreurs" -ForegroundColor Cyan
$notFoundResult = Test-API -Url "$baseUrl/route-inexistante" -Description "Test 404"

if (-not $notFoundResult.Success) {
    Write-Host "   ✅ Erreur 404 bien gérée" -ForegroundColor Green
} else {
    Write-Host "   ⚠️ Erreur 404 mal gérée" -ForegroundColor Yellow
}
Write-Host ""

# Résumé final
Write-Host "🎯========================================🎯" -ForegroundColor Green
Write-Host "✅        RÉSUMÉ DES TESTS COMPLETS      ✅" -ForegroundColor Green
Write-Host "🎯========================================🎯" -ForegroundColor Green
Write-Host ""

$testResults = @(
    @{ Name = "Santé serveur"; Result = $healthResult.Success },
    @{ Name = "Catalogue produits"; Result = $productsResult.Success },
    @{ Name = "Catégories"; Result = $categoriesResult.Success },
    @{ Name = "Inscription user"; Result = $registerResult.Success },
    @{ Name = "Login admin"; Result = $loginResult.Success },
    @{ Name = "Liste users (admin)"; Result = ($usersResult.Success -if $usersResult else $false) },
    @{ Name = "Création produit"; Result = ($productResult.Success -if $productResult else $false) },
    @{ Name = "Statistiques"; Result = $statsResult.Success }
)

$successCount = ($testResults | Where-Object { $_.Result }).Count
$totalCount = $testResults.Count

Write-Host "📊 SCORE GLOBAL: $successCount/$totalCount tests réussis" -ForegroundColor Cyan
Write-Host ""

foreach ($test in $testResults) {
    $icon = if ($test.Result) { "✅" } else { "❌" }
    $color = if ($test.Result) { "Green" } else { "Red" }
    Write-Host "   $icon $($test.Name)" -ForegroundColor $color
}

Write-Host ""

if ($successCount -eq $totalCount) {
    Write-Host "🎉 FÉLICITATIONS! TOUS LES TESTS PASSÉS! 🎉" -ForegroundColor Green
    Write-Host "🛒 Votre boutique e-commerce est 100% fonctionnelle!" -ForegroundColor Green
} elseif ($successCount -ge ($totalCount * 0.8)) {
    Write-Host "✅ TRÈS BIEN! Boutique majoritairement fonctionnelle" -ForegroundColor Yellow
    Write-Host "🔧 Quelques ajustements mineurs nécessaires" -ForegroundColor Yellow
} else {
    Write-Host "⚠️ ATTENTION! Plusieurs problèmes détectés" -ForegroundColor Red
    Write-Host "🔧 Vérifiez la configuration et les logs" -ForegroundColor Red
}

Write-Host ""
Write-Host "🌟 BOUTIQUE DARRA - TESTS TERMINÉS 🌟" -ForegroundColor Magenta