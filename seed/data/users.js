//USUARIOS (3)
const usuarios = [
  {
    tipoUsuario: "usuario",
    nombre: "Cristiano",
    apellido: "Ronaldo",
    correo: "futbol@gmail.com",
    clave: "$2b$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi", // password
    direccion: ["Av. Libertador Bernardo O'Higgins 1234"],
    telefono: "+56987654321",
    isAdmin: false,
    nombreUsuario: "cr7",
    numeroCasaDepto: "Depto 201",
    cartera: 75000,
    comidasStock: [],
    ventas: [],
    ventasPromo: [],
    valoracionRepartidor: 0,
    totalValoraciones: 0,
    totalPuntosValoracion: 0,
    __v: 0
  },
  {
    tipoUsuario: "usuario",
    nombre: "Caitlyn",
    apellido: "Kiramman",
    correo: "arcane@outlook.com",
    clave: "$2b$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi", // password
    direccion: ["Pasaje Los Aromos 567, Las Condes"],
    telefono: "+56965432109",
    isAdmin: false,
    nombreUsuario: "waifu",
    numeroCasaDepto: "Casa 12",
    cartera: 45000,
    comidasStock: [],
    ventas: [],
    ventasPromo: [],
    valoracionRepartidor: 0,
    totalValoraciones: 0,
    totalPuntosValoracion: 0,
    __v: 0
  },
  {
    tipoUsuario: "usuario",
    nombre: "Zero",
    apellido: "Two",
    correo: "bestwaifu@hotmail.com",
    clave: "$2b$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi", // password
    direccion: ["Calle Moneda 890, Santiago Centro"],
    telefono: "+56912345678",
    isAdmin: false,
    nombreUsuario: "diegoandres",
    numeroCasaDepto: "Of. 305",
    cartera: 120000,
    comidasStock: [],
    ventas: [],
    ventasPromo: [],
    valoracionRepartidor: 0,
    totalValoraciones: 0,
    totalPuntosValoracion: 0,
    __v: 0
  }
];

//LOCATARIOS (3)
const locatarios = [
  {
    tipoUsuario: "locatario",
    nombre: "Carlos",
    apellido: "McDonald",
    correo: "gerente@mcdonalds-chile.cl",
    clave: "$2b$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi", // password
    direccion: ["Av. Providencia 1145, Providencia"],
    telefono: "+56222334455",
    isAdmin: false,
    nombreLocal: "McDonald's Providencia",
    numeroLocal: "001",
    comidasStock: [],
    ventas: [],
    ventasPromo: [],
    valoracion: 4.5,
    cartera: 0,
    totalPuntosValoracion: 45,
    totalValoraciones: 10,
    valoracionRepartidor: 0,
    __v: 0
  },
  {
    tipoUsuario: "locatario",
    nombre: "Giuseppe",
    apellido: "Papa John",
    correo: "admin@papajohns-chile.cl",
    clave: "$2b$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi", // password
    direccion: ["Av. Las Condes 12456, Las Condes"],
    telefono: "+56223456789",
    isAdmin: false,
    nombreLocal: "Papa John's Las Condes",
    numeroLocal: "002",
    comidasStock: [],
    ventas: [],
    ventasPromo: [],
    valoracion: 4.2,
    cartera: 0,
    totalPuntosValoracion: 84,
    totalValoraciones: 20,
    valoracionRepartidor: 0,
    __v: 0
  },
  {
    tipoUsuario: "locatario",
    nombre: "Colonel",
    apellido: "Sanders",
    correo: "manager@crunchy-chile.cl",
    clave: "$2b$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi", // password
    direccion: ["Mall Plaza Norte, Av. Américo Vespucio 1501"],
    telefono: "+56234567890",
    isAdmin: false,
    nombreLocal: "Crunchy Plaza Norte",
    numeroLocal: "003",
    comidasStock: [],
    ventas: [],
    ventasPromo: [],
    valoracion: 4.8,
    cartera: 0,
    totalPuntosValoracion: 96,
    totalValoraciones: 20,
    valoracionRepartidor: 0,
    __v: 0
  }
];

//REPARTIDORES (3)
const repartidores = [
  {
    tipoUsuario: "repartidor",
    nombre: "Eren",
    apellido: "Jaeger",
    correo: "shingeki@delivery.cl",
    clave: "$2b$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi", // password
    direccion: ["Villa Los Españoles, Block 15, Depto 304"],
    telefono: "+56987123456",
    isAdmin: false,
    cartera: 0,
    usuarioRepartidor: "erendelivery",
    vehiculo: "Motocicleta",
    patente: "GH-TY-89",
    valoracionRepartidor: 4.7,
    comidasStock: [],
    ventas: [],
    ventasPromo: [],
    totalPuntosValoracion: 94,
    totalValoraciones: 20,
    __v: 0
  },
  {
    tipoUsuario: "repartidor",
    nombre: "Leia",
    apellido: "Organa",
    correo: "starwars@fastdelivery.cl",
    clave: "$2b$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi", // password
    direccion: ["Población San Miguel, Pasaje 3, Casa 45"],
    telefono: "+56956789012",
    isAdmin: false,
    cartera: 0,
    usuarioRepartidor: "leiaskywalker",
    vehiculo: "Bicicleta Eléctrica",
    patente: "BC-EL-67",
    valoracionRepartidor: 4.9,
    comidasStock: [],
    ventas: [],
    ventasPromo: [],
    totalPuntosValoracion: 98,
    totalValoraciones: 20,
    __v: 0
  },
  {
    tipoUsuario: "repartidor",
    nombre: "Boromir",
    apellido: "Ring",
    correo: "LordRing@rapidodelivery.cl",
    clave: "$2b$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi", // password
    direccion: ["Sector Oriente, Calle Principal 789"],
    telefono: "+56923456789",
    isAdmin: false,
    cartera: 0,
    usuarioRepartidor: "BoromirTop",
    vehiculo: "Auto Compacto",
    patente: "KL-MN-34",
    valoracionRepartidor: 4.3,
    comidasStock: [],
    ventas: [],
    ventasPromo: [],
    totalPuntosValoracion: 86,
    totalValoraciones: 20,
    __v: 0
  }
];

//ADMINISTRADOR DEL SISTEMA
const admin = {
  tipoUsuario: "usuario",
  nombre: "Administrador",
  apellido: "VeciMarket",
  correo: "admin@vecimarket.cl",
  clave: "$2b$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi", // password
  direccion: ["Centro de Operaciones VeciMarket, Av. Apoquindo 3000"],
  telefono: "+56223334444",
  isAdmin: true,
  nombreUsuario: "admin",
  numeroCasaDepto: "Torre A, Piso 12",
  cartera: 500000,
  valoracionRepartidor: 0,
  totalValoraciones: 0,
  totalPuntosValoracion: 0,
  comidasStock: [],
  ventas: [],
  ventasPromo: [],
  __v: 0
};

module.exports = {
  usuarios,
  locatarios,
  repartidores,
  admin
};
