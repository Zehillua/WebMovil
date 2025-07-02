#!/bin/bash
echo "⏳ Esperando a que MongoDB esté disponible..."

# Función para verificar si MongoDB está disponible
check_mongo() {
    mongosh --eval "db.adminCommand('ping')" > /dev/null 2>&1
}

# Esperar hasta que MongoDB esté disponible
max_attempts=30
attempt=1

while [ $attempt -le $max_attempts ]; do
    if check_mongo; then
        echo "✅ MongoDB está disponible!"
        break
    else
        echo "⏳ Intento $attempt/$max_attempts - MongoDB no está disponible aún..."
        sleep 2
        ((attempt++))
    fi
done

if [ $attempt -gt $max_attempts ]; then
    echo "❌ MongoDB no está disponible después de esperar"
    exit 1
fi

echo "🚀 Ejecutando script de población de datos..."
node seed.js
