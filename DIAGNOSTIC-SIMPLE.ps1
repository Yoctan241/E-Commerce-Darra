# DARRA - DIAGNOSTIC ET REDEMARRAGE INTELLIGENT
# Ce script diagnostique et relance automatiquement DARRA

function Write-ColorOutput($ForegroundColor, $Text) {
    Write-Host $Text -ForegroundColor $ForegroundColor
}

function Test-Port {
    param([int]$Port)
    
    try {
        $listener = [System.Net.Sockets.TcpListener]::new([System.Net.IPAddress]::Loopback, $Port)
        $listener.Start()
        $listener.Stop()
        return $true
    } catch {
        return $false
    }
}

function Stop-ProcessOnPort {
    param([int]$Port)
    
    $processes = netstat -ano | Select-String ":$Port" | Where-Object { $_ -match "LISTENING" }
    $killedCount = 0
    
    if ($processes) {
        Write-ColorOutput "Yellow" "Processus detectes sur le port $Port :"
        foreach ($line in $processes) {
            $parts = $line -split '\s+' | Where-Object { $_ -ne '' }
            $pid = $parts[-1]
            
            if ($pid -match '^\d+$') {
                try {
                    $processInfo = Get-Process -Id $pid -ErrorAction SilentlyContinue
                    if ($processInfo) {
                        Write-ColorOutput "White" "   PID: $pid ($($processInfo.ProcessName))"
                        Stop-Process -Id $pid -Force -ErrorAction SilentlyContinue
                        $killedCount++
                        Write-ColorOutput "Green" "   Processus $pid termine"
                    }
                } catch {
                    Write-ColorOutput "Red" "   Impossible de terminer le processus $pid"
                }
            }
        }
    }
    
    return $killedCount
}

function Test-BackendHealth {
    try {
        $response = Invoke-RestMethod -Uri "http://localhost:5000/health" -TimeoutSec 5 -ErrorAction Stop
        return $response.status -eq "OK"
    } catch {
        return $false
    }
}

function Test-FrontendHealth {
    try {
        $response = Invoke-WebRequest -Uri "http://localhost:5173" -TimeoutSec 5 -UseBasicParsing -ErrorAction Stop
        return $response.StatusCode -eq 200
    } catch {
        return $false
    }
}

Write-ColorOutput "Cyan" "========================================="
Write-ColorOutput "Cyan" "    DIAGNOSTIC DARRA INTELLIGENT     "
Write-ColorOutput "Cyan" "========================================="

# Diagnostic des ports
Write-ColorOutput "Yellow" "DIAGNOSTIC DES PORTS..."
$backendPortFree = Test-Port -Port 5000
$frontendPortFree = Test-Port -Port 5173

if (-not $backendPortFree) {
    Write-ColorOutput "Red" "Port 5000 (Backend) occupe"
    $killed = Stop-ProcessOnPort -Port 5000
    if ($killed -gt 0) {
        Write-ColorOutput "Green" "$killed processus termines sur le port 5000"
        Start-Sleep -Seconds 3
    }
} else {
    Write-ColorOutput "Green" "Port 5000 (Backend) libre"
}

if (-not $frontendPortFree) {
    Write-ColorOutput "Red" "Port 5173 (Frontend) occupe"
    $killed = Stop-ProcessOnPort -Port 5173
    if ($killed -gt 0) {
        Write-ColorOutput "Green" "$killed processus termines sur le port 5173"
        Start-Sleep -Seconds 3
    }
} else {
    Write-ColorOutput "Green" "Port 5173 (Frontend) libre"
}

# Test de sante des services
Write-ColorOutput "Yellow" "TEST DE SANTE DES SERVICES..."

$backendHealthy = Test-BackendHealth
$frontendHealthy = Test-FrontendHealth

if ($backendHealthy) {
    Write-ColorOutput "Green" "Backend DARRA operationnel"
} else {
    Write-ColorOutput "Red" "Backend DARRA non disponible"
}

if ($frontendHealthy) {
    Write-ColorOutput "Green" "Frontend DARRA operationnel"
} else {
    Write-ColorOutput "Red" "Frontend DARRA non disponible"
}

# Decision de redemarrage
$needsRestart = -not $backendHealthy -or -not $frontendHealthy

if ($needsRestart) {
    Write-ColorOutput "Yellow" "REDEMARRAGE NECESSAIRE..."
    
    # Verification des chemins
    $backendPath = "C:\Users\Cococe Ltd\Desktop\Darra.e\backend"
    $frontendPath = "C:\Users\Cococe Ltd\Desktop\Darra.e\frontend.darra"
    
    if (-not (Test-Path $backendPath)) {
        Write-ColorOutput "Red" "Chemin backend non trouve: $backendPath"
        exit 1
    }
    
    if (-not (Test-Path $frontendPath)) {
        Write-ColorOutput "Red" "Chemin frontend non trouve: $frontendPath"
        exit 1
    }
    
    Write-ColorOutput "Green" "LANCEMENT DES SERVICES..."
    
    # Demarrer le backend ultra-stable
    if (-not $backendHealthy) {
        Write-ColorOutput "Cyan" "Lancement Backend Ultra-Stable..."
        Set-Location $backendPath
        $backendJob = Start-Process powershell -ArgumentList "-NoExit", "-Command", "npm run start:stable" -PassThru
        Start-Sleep -Seconds 8
        
        # Verifier le demarrage
        $attempts = 0
        $maxAttempts = 10
        do {
            $backendHealthy = Test-BackendHealth
            if (-not $backendHealthy) {
                Start-Sleep -Seconds 2
                $attempts++
                Write-ColorOutput "Yellow" "Attente backend... ($attempts/$maxAttempts)"
            }
        } while (-not $backendHealthy -and $attempts -lt $maxAttempts)
        
        if ($backendHealthy) {
            Write-ColorOutput "Green" "Backend demarre avec succes"
        } else {
            Write-ColorOutput "Red" "Echec du demarrage du backend"
        }
    }
    
    # Demarrer le frontend
    if (-not $frontendHealthy) {
        Write-ColorOutput "Cyan" "Lancement Frontend..."
        Set-Location $frontendPath
        $frontendJob = Start-Process powershell -ArgumentList "-NoExit", "-Command", "npm run dev" -PassThru
        Start-Sleep -Seconds 6
        
        # Verifier le demarrage
        $attempts = 0
        $maxAttempts = 10
        do {
            $frontendHealthy = Test-FrontendHealth
            if (-not $frontendHealthy) {
                Start-Sleep -Seconds 2
                $attempts++
                Write-ColorOutput "Yellow" "Attente frontend... ($attempts/$maxAttempts)"
            }
        } while (-not $frontendHealthy -and $attempts -lt $maxAttempts)
        
        if ($frontendHealthy) {
            Write-ColorOutput "Green" "Frontend demarre avec succes"
        } else {
            Write-ColorOutput "Red" "Echec du demarrage du frontend"
        }
    }
    
    # Test final complet
    Start-Sleep -Seconds 3
    Write-ColorOutput "Yellow" "TEST FINAL DE VALIDATION..."
    
    $finalBackendTest = Test-BackendHealth
    $finalFrontendTest = Test-FrontendHealth
    
    if ($finalBackendTest -and $finalFrontendTest) {
        Write-ColorOutput "Green" "DARRA DEMARRE AVEC SUCCES !"
        Write-ColorOutput "Cyan" "========================================"
        Write-ColorOutput "Green" "Backend: http://localhost:5000"
        Write-ColorOutput "Green" "Frontend: http://localhost:5173"
        Write-ColorOutput "Cyan" "========================================"
        
        # Ouvrir le navigateur
        Start-Sleep -Seconds 2
        Write-ColorOutput "Yellow" "Ouverture du navigateur..."
        Start-Process "http://localhost:5173"
        
    } else {
        Write-ColorOutput "Red" "ERREUR: Certains services n'ont pas demarre correctement"
        if (-not $finalBackendTest) { Write-ColorOutput "Red" "   - Backend non operationnel" }
        if (-not $finalFrontendTest) { Write-ColorOutput "Red" "   - Frontend non operationnel" }
    }
    
} else {
    Write-ColorOutput "Green" "DARRA EST DEJA OPERATIONNEL !"
    Write-ColorOutput "Cyan" "========================================"
    Write-ColorOutput "Green" "Backend: http://localhost:5000"
    Write-ColorOutput "Green" "Frontend: http://localhost:5173"
    Write-ColorOutput "Cyan" "========================================"
    
    # Ouvrir le navigateur si pas deja ouvert
    Start-Process "http://localhost:5173"
}

Write-ColorOutput "White" "Diagnostic termine !"