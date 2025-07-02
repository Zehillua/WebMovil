@echo off
echo ⏳ Esperando a que MongoDB esté disponible...

set max_attempts=30
set attempt=1

:check_mongo
mongosh --eval "db.adminCommand('ping')" >nul 2>&1
if %errorlevel% equ 0 (
    echo ✅ MongoDB está disponible!
    goto run_seed
)

echo ⏳ Intento %attempt%/%max_attempts% - MongoDB no está disponible aún...
timeout /t 2 >nul
set /a attempt+=1

if %attempt% leq %max_attempts% goto check_mongo

echo ❌ MongoDB no está disponible después de esperar
exit /b 1

:run_seed
echo 🚀 Ejecutando script de población de datos...
node seed.js
