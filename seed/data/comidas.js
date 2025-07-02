// ✅ COMIDAS POR LOCAL - 3 comidas por cada local

// McDonald's - locatarioId se asignará dinámicamente
const mcdonaldsComidas = [
  {
    nombre: "Big Mac",
    precio: 6500,
    cantidad: 25,
    ingredientes: ["Carne de res", "Lechuga", "Queso cheddar", "Salsa especial", "Cebolla", "Pepinillos", "Pan con sésamo"],
    descripcion: "La icónica hamburguesa con dos carnes de res, lechuga, queso, salsa especial, cebolla y pepinillos en un pan con sésamo de tres capas.",
    imagenUrl: "/uploads/HamburguesaMcDonald.jpg",
    __v: 0
  },
  {
    nombre: "Papas Fritas Grandes",
    precio: 2200,
    cantidad: 30,
    ingredientes: ["Papas"],
    descripcion: "Deliciosas papas con nuestra receta especial. Incluye salsas a elección.",
    imagenUrl: "/uploads/PapasMcDonald.jpeg",
    __v: 0
  },
  {
    nombre: "Bebida",
    precio: 1500,
    cantidad: 40,
    ingredientes: ["Bebida en lata"],
    descripcion: "Una rica bebida.",
    imagenUrl: "/uploads/BebidaMcDonald.jpg",
    __v: 0
  }
];

// Papa John's - locatarioId se asignará dinámicamente
const papajohnsComidas = [
  {
    nombre: "Pizza Pepperoni Familiar",
    precio: 12900,
    cantidad: 15,
    ingredientes: ["Masa artesanal", "Salsa de tomate", "Queso mozzarella", "Pepperoni premium"],
    descripcion: "Pizza familiar con pepperoni premium, queso mozzarella 100% natural y nuestra exclusiva salsa de tomate sobre masa artesanal.",
    imagenUrl: "/uploads/PizzaPapaJohons.jpeg",
    __v: 0
  },
  {
    nombre: "Bebida",
    precio: 1800,
    cantidad: 20,
    ingredientes: ["Rica Pepsi"],
    descripcion: "Perfecto para acompañar tu pizza, una refrescante bebida Pepsi.",
    imagenUrl: "/uploads/PepsiPapaJohons.jpeg",
    __v: 0
  },
  {
    nombre: "Pan de Ajo x8",
    precio: 3500,
    cantidad: 35,
    ingredientes: ["Pan artesanal", "Mantequilla de ajo", "Perejil", "Queso parmesano"],
    descripcion: "Delicioso pan artesanal con mantequilla de ajo, perejil fresco y queso parmesano gratinado.",
    imagenUrl: "/uploads/Palos_AjosPapaJohons.jpg",
    __v: 0
  }
];

// KFC - locatarioId se asignará dinámicamente
const crunchyComidas = [
  {
    nombre: "Gohan Crunchy Rolls",
    precio: 8500,
    cantidad: 10,
    ingredientes: ["Pollo", "Arroz", "Alga nori", "Salsa de soya", "Aguacate"],
    descripcion: "Rico Gohan Crunchy Rolls con pollo tierno, arroz, alga nori, salsa de soya y aguacate fresco. ¡Una explosión de sabor en cada bocado!",
    imagenUrl: "/uploads/gohanCrunchyRolls.jpg",
    __v: 0
  },
  {
    nombre: "Bebida",
    precio: 1800,
    cantidad: 25,
    ingredientes: ["Rica Bebida"],
    descripcion: "Perfecto para acompañar tu sushi o gohan, una refrescante bebida.",
    imagenUrl: "/uploads/FantaCrunchyRolls.jpg",
    __v: 0
  },
  {
    nombre: "Sushi",
    precio: 15000,
    cantidad: 30,
    ingredientes: ["Sushi variado", "Salsa de soya", "Wasabi", "Jengibre encurtido"],
    descripcion: "Delicioso sushi variado con pescado fresco, arroz, alga nori y acompañamientos tradicionales como salsa de soya, wasabi y jengibre encurtido.",
    imagenUrl: "/uploads/SushiCrunchyRolls.jpg",
    __v: 0
  }
];

module.exports = {
  mcdonaldsComidas,
  papajohnsComidas,
  crunchyComidas
};
