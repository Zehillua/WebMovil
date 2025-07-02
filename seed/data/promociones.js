// McDonald's Promociones
const mcdonaldsPromociones = [
  {
    nombre: "Promo Hamburguesa con Papas y Bebida",
    descripcion: "El combo perfecto: Big Mac + Papas Grandes + Bebida.",
    precio: 5800,
    imagenUrl: "/uploads/Promo_Hamburguesa_Bebida_PapasMcDonald.png",
    comidas: [
      {
        nombre: "Big Mac",
        cantidad: 1,
        precioOriginal: 6500
      },
      {
        nombre: "Papas Fritas Grandes",
        cantidad: 1,
        precioOriginal: 2200
      }
    ],
    activa: true,
    fechaInicio: new Date(),
    fechaFin: null,
    cantidadDisponible: 50,
    cantidadVendida: 0,
    createdAt: new Date(),
    updatedAt: new Date(),
    __v: 0
  },
  {
    nombre: "Promocion Hamburguesa y Papas Grandes",
    descripcion: "Hamburguesa Big Mac + Papas Grandes",
    precio: 5500,
    imagenUrl: "/uploads/Promo_Hamburguesa_PapasMcDonalds.jpg",
    comidas: [
      {
        nombre: "Bebida",
        cantidad: 1,
        precioOriginal: 1500
      },
      {
        nombre: "Big Mac", 
        cantidad: 1,
        precioOriginal: 6500
      }
    ],
    activa: true,
    fechaInicio: new Date(),
    fechaFin: null,
    cantidadDisponible: 30,
    cantidadVendida: 0,
    createdAt: new Date(),
    updatedAt: new Date(),
    __v: 0
  }
];

const papajohnsPromociones = [
  {
    nombre: "Pizza + Pan de Ajo",
    descripcion: "Pizza Pepperoni Familiar + Pan de Ajo x8. ¡Combinación perfecta!",
    precio: 14900,
    imagenUrl: "/uploads/Promo_Pizza_PepsiPapaJohons.jpg",
    comidas: [
      {
        nombre: "Pizza Pepperoni Familiar",
        cantidad: 1,
        precioOriginal: 12900
      },
      {
        nombre: "Pan de Ajo x8",
        cantidad: 1,
        precioOriginal: 3500
      }
    ],
    activa: true,
    fechaInicio: new Date(),
    fechaFin: null,
    cantidadDisponible: 25,
    cantidadVendida: 0,
    createdAt: new Date(),
    updatedAt: new Date(),
    __v: 0
  },
  {
    nombre: "Pizza con Bebida",
    descripcion: "Rica Pizza Hawaiana Mediana + Bebida. ¡Ideal para pasar el rato!",
    precio: 8500,
    imagenUrl: "/uploads/Promo_2PizzasPapaJohons.jpg",
    comidas: [
      {
        nombre: "Pizza Hawaiana Mediana",
        cantidad: 2,
        precioOriginal: 9800
      }
    ],
    activa: true,
    fechaInicio: new Date(),
    fechaFin: null,
    cantidadDisponible: 20,
    cantidadVendida: 0,
    createdAt: new Date(),
    updatedAt: new Date(),
    __v: 0
  }
];

const crunchyPromociones = [
  {
    nombre: "Gohan con Bebida",
    descripcion: "Rico Gohan Crunchy Rolls con bebida. ¡Una explosión de sabor!",
    precio: 7000,
    imagenUrl: "/uploads/Promo_Bebida_GohanCrunchyrolls.webp",
    comidas: [
      {
        nombre: "Gohan Crunchy Rolls",
        cantidad: 1,
        precioOriginal: 8500
      },
      {
        nombre: "Bebida",
        cantidad: 1,
        precioOriginal: 1800
      }
    ],
    activa: true,
    fechaInicio: new Date(),
    fechaFin: null,
    cantidadDisponible: 15,
    cantidadVendida: 0,
    createdAt: new Date(),
    updatedAt: new Date(),
    __v: 0
  },
  {
    nombre: "Sushi Crunchy Rolls con Bebida",
    descripcion: "Sushi Crunchy Rolls + Bebida. ¡Perfecto para almorzar!",
    precio: 12500,
    imagenUrl: "/uploads/Promo_Fanta_SushiCrunchyRolls.webp",
    comidas: [
      {
        nombre: "Sushi",
        cantidad: 1,
        precioOriginal: 15000
      },
      {
        nombre: "Bebida",
        cantidad: 1,
        precioOriginal: 1800
      }
    ],
    activa: true,
    fechaInicio: new Date(),
    fechaFin: null,
    cantidadDisponible: 40,
    cantidadVendida: 0,
    createdAt: new Date(),
    updatedAt: new Date(),
    __v: 0
  }
];

module.exports = {
  mcdonaldsPromociones,
  papajohnsPromociones,
  crunchyPromociones
};
