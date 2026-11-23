// ============================================================
// VARIEDADES DE JUSTO
// Aquí se actualizan los cafés de TODO el sitio (inicio y página de cafés).
//
// Campos:
//   slug         nombre de la imagen: /img/variedades/<slug>.png
//   nombre       nombre que se muestra
//   nuevo        true muestra la etiqueta "Nuevo" y la lista en Lanzamientos
//   estado       "disponible"  lote disponible
//                "consultar"   hay que preguntar por el lote actual
//                "proximo"     próximo lote
//                "agotado"     sin existencias
//   descripcion  frase corta sobre la variedad (puede ir vacía)
//   notas        notas de sabor del lote (puede ir vacía)
// ============================================================
const WHATSAPP_NUMERO = "573161965960";

const VARIEDADES = [
  {
    slug: "caturra-chiroso",
    nombre: "Caturra Chiroso",
    nuevo: true,
    estado: "disponible",
    descripcion: "Llega por primera vez a Justo.",
    notas: "",
  },
  {
    slug: "Castillo Lavado",
    nombre: "Castillo Lavado x 500gr",
    nuevo: true,
    estado: "disponible",
    descripcion: "Llega por primera vez a Justo.",
    notas: "",
  },
  {
    slug: "papayo",
    nombre: "Papayo",
    nuevo: false,
    estado: "disponible",
    descripcion: "",
    notas: "",
  },
  {
    slug: "f6",
    nombre: "F6",
    nuevo: false,
    estado: "disponible",
    descripcion: "",
    notas: "Frutos rojos, cítricos y acidez media.",
  },
  {
    slug: "bourbon-rosado",
    nombre: "Bourbon Rosado",
    nuevo: false,
    estado: "disponible",
    descripcion: "De la familia Bourbon.",
    notas: "",
  },
  {
    slug: "geisha",
    nombre: "Geisha",
    nuevo: false,
    estado: "consultar",
    descripcion: "Variedad de origen etíope.",
    notas: "",
  },
  {
    slug: "tabi-amarillo",
    nombre: "Tabi Amarillo",
    nuevo: false,
    estado: "consultar",
    descripcion: "",
    notas: "",
  },
  {
    slug: "castillo",
    nombre: "Castillo",
    nuevo: false,
    estado: "consultar",
    descripcion: "Variedad colombiana desarrollada por Cenicafé.",
    notas: "",
  },
  {
    slug: "catuai",
    nombre: "Catuaí",
    nuevo: false,
    estado: "consultar",
    descripcion: "Cruce de Mundo Novo y Caturra, desarrollado en Brasil.",
    notas: "Miel, chocolate y maracuyá.",
  },
  {
    slug: "pacamara",
    nombre: "Pacamara",
    nuevo: false,
    estado: "proximo",
    descripcion: "Cruce de Pacas y Maragogipe, de grano grande.",
    notas: "",
  },
];