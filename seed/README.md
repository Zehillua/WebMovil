# VeciMarket - Sistema de Población de Datos

Este directorio contiene los scripts necesarios para poblar la base de datos con datos de ejemplo realistas.

## 📁 Estructura

```
seed/
├── package.json              # Dependencias del proyecto
├── seed.js                   # Script principal de población
├── wait-for-mongo.sh         # Script para Linux/Mac
├── wait-for-mongo.bat        # Script para Windows  
└── data/
    ├── users.js              # Usuarios, locatarios, repartidores y admin
    ├── comidas.js            # Comidas por local
    └── promociones.js        # Promociones por local
```

## 🚀 Uso

### Opción 1: Ejecutar directamente (después de que Docker esté corriendo)

1. Asegúrate de que Docker Compose esté ejecutándose:
```bash
docker-compose up -d
```

2. Instala las dependencias:
```bash
cd seed
npm install
```

3. Ejecuta el script de población:
```bash
# Windows
wait-for-mongo.bat

# Linux/Mac
chmod +x wait-for-mongo.sh
./wait-for-mongo.sh

# O directamente
npm run seed
```

### Opción 2: Integrar con Docker Compose (Recomendado)

Agrega esto a tu `docker-compose.yml`:

```yaml
  seed-data:
    build:
      context: ./seed
      dockerfile: Dockerfile
    container_name: seed-data
    depends_on:
      - mongo
    environment:
      - MONGO_URI=mongodb://mongo:27017
    volumes:
      - ./seed:/app
    command: ["node", "seed.js"]
    restart: "no"
```

## 📊 Datos Incluidos

### 👥 Usuarios (3)
- **Juan Carlos Pérez** (juancarlos) - $75.000 en cartera
- **María Elena González** (marielena) - $45.000 en cartera  
- **Diego Andrés Ramírez** (diegoandres) - $120.000 en cartera

### 🏪 Locatarios (3)
- **McDonald's Providencia** - 4.5⭐ (10 valoraciones)
- **Papa John's Las Condes** - 4.2⭐ (20 valoraciones)
- **KFC Plaza Norte** - 4.8⭐ (20 valoraciones)

### 🚚 Repartidores (3)
- **Miguel Torres** (migueldelivery) - Motocicleta - 4.7⭐
- **Ana Martínez** (anafast) - Bicicleta Eléctrica - 4.9⭐
- **Roberto Silva** (robertorapido) - Auto Compacto - 4.3⭐

### 👑 Administrador (1)
- **Admin VeciMarket** (admin) - $500.000 en cartera

### 🍽️ Comidas (9 total - 3 por local)
- **McDonald's**: Big Mac, McNuggets x6, Papas Fritas Grandes
- **Papa John's**: Pizza Pepperoni Familiar, Pizza Hawaiana Mediana, Pan de Ajo x8
- **KFC**: Balde Familiar 12 Piezas, Twister Clásico, Puré con Gravy

### 🎉 Promociones (6 total - 2 por local)
- **McDonald's**: Combo Big Mac Completo, McNuggets Familiar
- **Papa John's**: Pizza + Pan de Ajo, Duo Pizzas Medianas
- **KFC**: Balde + Complementos, Twister Combo

## 🔑 Credenciales de Acceso

| Tipo | Email | Contraseña |
|------|-------|------------|
| **Admin** | admin@vecimarket.cl | admin123 |
| **Usuario** | juan.perez@gmail.com | 123456 |
| **Locatario** | gerente@mcdonalds-chile.cl | mcdonalds123 |
| **Repartidor** | miguel.torres@delivery.cl | delivery123 |

## ⚠️ Notas Importantes

1. **Las contraseñas están hasheadas** con bcrypt
2. **Las imágenes son rutas de ejemplo** - asegúrate de tener las imágenes en `/uploads/`
3. **Los precios están en pesos chilenos**
4. **Las patentes son formato chileno**
5. **Los números de teléfono son formato chileno (+56)**

## 🔧 Personalización

Para modificar los datos:

1. **Usuarios**: Edita `data/users.js`
2. **Comidas**: Edita `data/comidas.js`  
3. **Promociones**: Edita `data/promociones.js`

Luego ejecuta nuevamente el script de población.

## 🐛 Resolución de Problemas

### Error: "MongoDB no está disponible"
- Asegúrate de que `docker-compose up -d` esté ejecutándose
- Verifica que el puerto 27017 esté disponible

### Error: "Cannot find module"
- Ejecuta `npm install` en el directorio `seed/`

### Error de conexión
- Verifica que la URI de MongoDB sea correcta
- En Docker usa: `mongodb://mongo:27017`
- En local usa: `mongodb://localhost:27017`
