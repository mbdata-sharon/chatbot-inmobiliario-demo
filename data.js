// ============================================================
// BASE DE DATOS MOCK · UNIVERSO DE INMUEBLES
//   U = { i_1, i_2, ..., i_30 }  →  |U| = 30
//
// Diseñado para que la intersección A ∩ B ∩ C dé EXACTAMENTE 18
// cuando el usuario elige:
//   A = { i ∈ U : ciudad(i) = 'Bogotá'      }
//   B = { i ∈ U : tipo(i)   = 'Apartamento' }
//   C = { i ∈ U : precio(i) ≤ 250.000.000   }
//
// Verificación: ids 1..18 pertenecen a A ∩ B ∩ C   →  |A∩B∩C| = 18
// ============================================================

const INMUEBLES = [
  // ---------- 18 inmuebles que cumplen A ∩ B ∩ C ----------
  { id: 1,  ciudad: "Bogotá", tipo: "Apartamento", precio: 130000000, habitaciones: 1, area: 42,  img: "https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=400&q=80" },
  { id: 2,  ciudad: "Bogotá", tipo: "Apartamento", precio: 145000000, habitaciones: 2, area: 48,  img: "https://images.unsplash.com/photo-1493809842364-78817add7ffb?w=400&q=80" },
  { id: 3,  ciudad: "Bogotá", tipo: "Apartamento", precio: 155000000, habitaciones: 2, area: 52,  img: "https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=400&q=80" },
  { id: 4,  ciudad: "Bogotá", tipo: "Apartamento", precio: 165000000, habitaciones: 2, area: 55,  img: "https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=400&q=80" },
  { id: 5,  ciudad: "Bogotá", tipo: "Apartamento", precio: 168000000, habitaciones: 2, area: 56,  img: "https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?w=400&q=80" },
  { id: 6,  ciudad: "Bogotá", tipo: "Apartamento", precio: 175000000, habitaciones: 2, area: 60,  img: "https://images.unsplash.com/photo-1493809842364-78817add7ffb?w=400&q=80" },
  { id: 7,  ciudad: "Bogotá", tipo: "Apartamento", precio: 178000000, habitaciones: 2, area: 61,  img: "https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=400&q=80" },
  { id: 8,  ciudad: "Bogotá", tipo: "Apartamento", precio: 180000000, habitaciones: 2, area: 62,  img: "https://images.unsplash.com/photo-1560185009-5bf9f2849488?w=400&q=80" },
  { id: 9,  ciudad: "Bogotá", tipo: "Apartamento", precio: 185000000, habitaciones: 2, area: 64,  img: "https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=400&q=80" },
  { id: 10, ciudad: "Bogotá", tipo: "Apartamento", precio: 192000000, habitaciones: 3, area: 68,  img: "https://images.unsplash.com/photo-1493809842364-78817add7ffb?w=400&q=80" },
  { id: 11, ciudad: "Bogotá", tipo: "Apartamento", precio: 199000000, habitaciones: 3, area: 70,  img: "https://images.unsplash.com/photo-1502672023488-70e25813eb80?w=400&q=80" },
  { id: 12, ciudad: "Bogotá", tipo: "Apartamento", precio: 205000000, habitaciones: 3, area: 72,  img: "https://images.unsplash.com/photo-1560448204-603b3fc33ddc?w=400&q=80" },
  { id: 13, ciudad: "Bogotá", tipo: "Apartamento", precio: 215000000, habitaciones: 3, area: 75,  img: "https://images.unsplash.com/photo-1493809842364-78817add7ffb?w=400&q=80" },
  { id: 14, ciudad: "Bogotá", tipo: "Apartamento", precio: 225000000, habitaciones: 3, area: 78,  img: "https://images.unsplash.com/photo-1560185007-cde436f6a4d0?w=400&q=80" },
  { id: 15, ciudad: "Bogotá", tipo: "Apartamento", precio: 230000000, habitaciones: 3, area: 80,  img: "https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=400&q=80" },
  { id: 16, ciudad: "Bogotá", tipo: "Apartamento", precio: 240000000, habitaciones: 3, area: 82,  img: "https://images.unsplash.com/photo-1494526585095-c41746248156?w=400&q=80" },
  { id: 17, ciudad: "Bogotá", tipo: "Apartamento", precio: 245000000, habitaciones: 3, area: 84,  img: "https://images.unsplash.com/photo-1567496898669-ee935f5f647a?w=400&q=80" },
  { id: 18, ciudad: "Bogotá", tipo: "Apartamento", precio: 250000000, habitaciones: 3, area: 86,  img: "https://images.unsplash.com/photo-1502672023488-70e25813eb80?w=400&q=80" },

  // ---------- 12 inmuebles fuera de la intersección ----------
  // (Bogotá + Apartamento pero precio > 250M)
  { id: 19, ciudad: "Bogotá",       tipo: "Apartamento",    precio: 290000000, habitaciones: 3, area: 95,  img: "https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?w=400&q=80" },
  { id: 20, ciudad: "Bogotá",       tipo: "Apartamento",    precio: 340000000, habitaciones: 4, area: 105, img: "https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=400&q=80" },
  // (Bogotá pero otro tipo)
  { id: 21, ciudad: "Bogotá",       tipo: "Casa",           precio: 380000000, habitaciones: 4, area: 150, img: "https://images.unsplash.com/photo-1568605114967-8130f3a36994?w=400&q=80" },
  { id: 22, ciudad: "Bogotá",       tipo: "Penthouse",      precio: 580000000, habitaciones: 3, area: 130, img: "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=400&q=80" },
  // (Otra ciudad, varios tipos)
  { id: 23, ciudad: "Medellín",     tipo: "Apartamento",    precio: 180000000, habitaciones: 2, area: 60,  img: "https://images.unsplash.com/photo-1560185007-cde436f6a4d0?w=400&q=80" },
  { id: 24, ciudad: "Medellín",     tipo: "Apartamento",    precio: 220000000, habitaciones: 3, area: 75,  img: "https://images.unsplash.com/photo-1567496898669-ee935f5f647a?w=400&q=80" },
  { id: 25, ciudad: "Medellín",     tipo: "Casa",           precio: 320000000, habitaciones: 4, area: 160, img: "https://images.unsplash.com/photo-1564013799919-ab600027ffc6?w=400&q=80" },
  { id: 26, ciudad: "Cali",         tipo: "Apartamento",    precio: 195000000, habitaciones: 3, area: 70,  img: "https://images.unsplash.com/photo-1494526585095-c41746248156?w=400&q=80" },
  { id: 27, ciudad: "Cali",         tipo: "Casa",           precio: 290000000, habitaciones: 3, area: 120, img: "https://images.unsplash.com/photo-1605276374104-dee2a0ed3cd6?w=400&q=80" },
  { id: 28, ciudad: "Barranquilla", tipo: "Apartamento",    precio: 175000000, habitaciones: 2, area: 62,  img: "https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=400&q=80" },
  { id: 29, ciudad: "Barranquilla", tipo: "Casa Campestre", precio: 420000000, habitaciones: 4, area: 220, img: "https://images.unsplash.com/photo-1518780664697-55e3ad937233?w=400&q=80" },
  { id: 30, ciudad: "Cartagena",    tipo: "Penthouse",      precio: 780000000, habitaciones: 3, area: 160, img: "https://images.unsplash.com/photo-1613977257363-707ba9348227?w=400&q=80" },
];

// Opciones que se muestran en los selects del chat
const CIUDADES = ["Bogotá", "Medellín", "Cali", "Barranquilla", "Cartagena"];
const TIPOS    = ["Apartamento", "Casa", "Casa Campestre", "Penthouse"];
const RANGOS_PRECIO = [
  { label: "Hasta 200M",  max: 200000000 },
  { label: "Hasta 250M",  max: 250000000 },
  { label: "Hasta 350M",  max: 350000000 },
  { label: "Sin límite",  max: Infinity   },
];
