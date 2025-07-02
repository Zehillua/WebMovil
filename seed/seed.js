const { MongoClient, ObjectId } = require('mongodb');
const { usuarios, locatarios, repartidores, admin } = require('./data/users');
const { mcdonaldsComidas, papajohnsComidas,crunchyComidas } = require('./data/comidas');
const { mcdonaldsPromociones, papajohnsPromociones, crunchyPromociones } = require('./data/promociones');

const MONGO_URI = 'mongodb://mongo:27017';
const DB_NAMES = {
  auth: 'auth',
  locatarios: 'locatarios'
};

async function waitForMongo(client, maxRetries = 30) {
  for (let i = 0; i < maxRetries; i++) {
    try {
      await client.db('admin').admin().ping();
      console.log('✅ MongoDB está disponible');
      return true;
    } catch (error) {
      console.log(`⏳ Esperando MongoDB... intento ${i + 1}/${maxRetries}`);
      await new Promise(resolve => setTimeout(resolve, 2000));
    }
  }
  throw new Error('❌ MongoDB no está disponible después de esperar');
}

async function limpiarColecciones(client) {
  try {
    const authDb = client.db(DB_NAMES.auth);
    const locatariosDb = client.db(DB_NAMES.locatarios);
    
    await authDb.collection('users').deleteMany({});
    console.log('🧹 Colección users limpiada');
    
    await locatariosDb.collection('comidas').deleteMany({});
    await locatariosDb.collection('promocions').deleteMany({});
    console.log('🧹 Colecciones comidas y promocions limpiadas');
    
  } catch (error) {
    console.log('⚠️ Error limpiando colecciones (puede ser normal si no existían):', error.message);
  }
}

async function seedDatabase() {
  const client = new MongoClient(MONGO_URI);
  
  try {
    console.log('🚀 Iniciando proceso de población de datos...');
    
    await client.connect();
    console.log('🔌 Conectado a MongoDB');

    await waitForMongo(client);
    
    await limpiarColecciones(client);
    
    const authDb = client.db(DB_NAMES.auth);
    const locatariosDb = client.db(DB_NAMES.locatarios);
    
    console.log('\n📝 Insertando usuarios...');
    
    const usuariosResult = await authDb.collection('users').insertMany(usuarios);
    console.log(`✅ ${usuarios.length} usuarios normales insertados`);
    
    const locatariosResult = await authDb.collection('users').insertMany(locatarios);
    console.log(`✅ ${locatarios.length} locatarios insertados`);
    
    const repartidoresResult = await authDb.collection('users').insertMany(repartidores);
    console.log(`✅ ${repartidores.length} repartidores insertados`);
    
    const adminResult = await authDb.collection('users').insertOne(admin);
    console.log(`✅ 1 administrador insertado`);
    
    const locatariosInsertados = await authDb.collection('users').find({ 
      tipoUsuario: 'locatario' 
    }).toArray();
    
    const mcdonaldsId = locatariosInsertados.find(l => l.nombreLocal.includes('McDonald'))?._id;
    const papajohnsId = locatariosInsertados.find(l => l.nombreLocal.includes('Papa John'))?._id;
    const crunchyId = locatariosInsertados.find(l => l.nombreLocal.includes('Crunchy'))?._id;
    
    console.log('\n🍽️ Insertando comidas...');
    
    const mcdonaldsComidasConId = mcdonaldsComidas.map(comida => ({
      ...comida,
      locatarioId: mcdonaldsId
    }));
    const mcdonaldsComidasResult = await locatariosDb.collection('comidas').insertMany(mcdonaldsComidasConId);
    console.log(`✅ ${mcdonaldsComidas.length} comidas de McDonald's insertadas`);
    
    const papajohnsComidasConId = papajohnsComidas.map(comida => ({
      ...comida,
      locatarioId: papajohnsId
    }));
    const papajohnsComidasResult = await locatariosDb.collection('comidas').insertMany(papajohnsComidasConId);
    console.log(`✅ ${papajohnsComidas.length} comidas de Papa John's insertadas`);
    
    const crunchyComidasConId = crunchyComidas.map(comida => ({
      ...comida,
      locatarioId: crunchyId
    }));
    const crunchyComidasResult = await locatariosDb.collection('comidas').insertMany(crunchyComidasConId);
    console.log(`✅ ${crunchyComidas.length} comidas de crunchy insertadas`);
    
    const todasLasComidas = await locatariosDb.collection('comidas').find({}).toArray();
    
    console.log('\n🎉 Insertando promociones...');
    
    const mcdonaldsPromocionesConId = mcdonaldsPromociones.map(promo => {
      const promocionConComidas = {
        ...promo,
        locatarioId: mcdonaldsId,
        comidas: promo.comidas.map(comidaPromo => {
          const comidaEncontrada = todasLasComidas.find(c => 
            c.nombre === comidaPromo.nombre && 
            c.locatarioId.toString() === mcdonaldsId.toString()
          );
          return {
            ...comidaPromo,
            comidaId: comidaEncontrada?._id,
            _id: new ObjectId(),
            createdAt: new Date(),
            updatedAt: new Date()
          };
        })
      };
      return promocionConComidas;
    });
    
    const mcdonaldsPromosResult = await locatariosDb.collection('promocions').insertMany(mcdonaldsPromocionesConId);
    console.log(`✅ ${mcdonaldsPromociones.length} promociones de McDonald's insertadas`);
    
    const papajohnsPromocionesConId = papajohnsPromociones.map(promo => {
      const promocionConComidas = {
        ...promo,
        locatarioId: papajohnsId,
        comidas: promo.comidas.map(comidaPromo => {
          const comidaEncontrada = todasLasComidas.find(c => 
            c.nombre === comidaPromo.nombre && 
            c.locatarioId.toString() === papajohnsId.toString()
          );
          return {
            ...comidaPromo,
            comidaId: comidaEncontrada?._id,
            _id: new ObjectId(),
            createdAt: new Date(),
            updatedAt: new Date()
          };
        })
      };
      return promocionConComidas;
    });
    
    const papajohnsPromosResult = await locatariosDb.collection('promocions').insertMany(papajohnsPromocionesConId);
    console.log(`✅ ${papajohnsPromociones.length} promociones de Papa John's insertadas`);
    
    const crunchyPromocionesConId = crunchyPromociones.map(promo => {
      const promocionConComidas = {
        ...promo,
        locatarioId: crunchyId,
        comidas: promo.comidas.map(comidaPromo => {
          const comidaEncontrada = todasLasComidas.find(c => 
            c.nombre === comidaPromo.nombre && 
            c.locatarioId.toString() === crunchyId.toString()
          );
          return {
            ...comidaPromo,
            comidaId: comidaEncontrada?._id,
            _id: new ObjectId(),
            createdAt: new Date(),
            updatedAt: new Date()
          };
        })
      };
      return promocionConComidas;
    });
    
    const crunchyPromosResult = await locatariosDb.collection('promocions').insertMany(crunchyPromocionesConId);
    console.log(`✅ ${crunchyPromociones.length} promociones de crunchy insertadas`);
    
    console.log('\n🎊 ¡POBLACIÓN DE DATOS COMPLETADA EXITOSAMENTE!');
    console.log('=' * 50);
    console.log(`👥 Usuarios normales: ${usuarios.length}`);
    console.log(`🏪 Locatarios: ${locatarios.length}`);
    console.log(`🚚 Repartidores: ${repartidores.length}`);
    console.log(`👑 Administradores: 1`);
    console.log(`🍽️ Comidas totales: ${mcdonaldsComidas.length + papajohnsComidas.length + crunchyComidas.length}`);
    console.log(`🎉 Promociones totales: ${mcdonaldsPromociones.length + papajohnsPromociones.length + crunchyPromociones.length}`);
    console.log('=' * 50);
    
    console.log('\n🔑 CREDENCIALES DE ACCESO:');
    console.log('Admin: admin@vecimarket.cl / admin123');
    console.log('Usuario: juan.perez@gmail.com / 123456');
    console.log('Locatario: gerente@mcdonalds-chile.cl / mcdonalds123');
    console.log('Repartidor: miguel.torres@delivery.cl / delivery123');
    
  } catch (error) {
    console.error('❌ Error durante la población de datos:', error);
    process.exit(1);
  } finally {
    await client.close();
    console.log('🔌 Conexión a MongoDB cerrada');
  }
}

if (require.main === module) {
  seedDatabase().then(() => {
    console.log('✅ Proceso de seed completado');
    process.exit(0);
  }).catch(error => {
    console.error('❌ Error en el proceso de seed:', error);
    process.exit(1);
  });
}

module.exports = { seedDatabase };
