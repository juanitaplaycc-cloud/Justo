"use strict";

// ============================================================
// JUSTO EXPERIENCIA - Comportamiento del sitio
//
// Índice:
//   1. Utilidades y WhatsApp
//   2. Variedades (carta y lanzamientos)
//   3. Filtros de la página de cafés
//   4. Menú, cabecera y botón flotante
//   5. Preguntas frecuentes (acordeón)
//   6. Animaciones de entrada
//   7. Inicio
//
// Las variedades se editan en js/variedades.js
// ============================================================


// ============================================================
// 1. UTILIDADES Y WHATSAPP
// ============================================================
const ETIQUETAS_ESTADO = {
  disponible: "Disponible",
  consultar: "Consultar lote",
  proximo: "Próximo lote",
  agotado: "Agotado",
};

// Crea un enlace de WhatsApp con el mensaje ya escrito
function enlaceWhatsApp(mensaje) {
  return `https://wa.me/${WHATSAPP_NUMERO}?text=${encodeURIComponent(mensaje)}`;
}

// Mensaje y texto del botón según el estado del lote
function accionDeVariedad(variedad) {
  if (variedad.estado === "agotado") {
    return {
      texto: "Avísame",
      mensaje: `Hola, quiero que me avisen cuando haya un nuevo lote de ${variedad.nombre}.`,
    };
  }
  if (variedad.estado === "proximo") {
    return {
      texto: "Preguntar",
      mensaje: `Hola, quiero saber cuándo estará disponible el café ${variedad.nombre}.`,
    };
  }
  return {
    texto: "Pedir",
    mensaje: `Hola, quiero pedir el café ${variedad.nombre} de Justo. ¿Me confirman la disponibilidad?`,
  };
}

// Crea un elemento con texto y clase opcionales
function crear(etiqueta, clase, texto) {
  const elemento = document.createElement(etiqueta);
  if (clase) elemento.className = clase;
  if (texto !== undefined) elemento.textContent = texto;
  return elemento;
}

// Dónde se busca la foto de cada variedad (Linux distingue mayúsculas de minúsculas)
const CARPETAS_IMAGEN = ["/img/variedades/", "/img/"];
const EXTENSIONES_IMAGEN = ["png", "webp", "jpg", "jpeg"];

// Lista de rutas posibles: primero la que se indique en variedades.js, luego las habituales
function rutasDeImagen(variedad) {
  const habituales = CARPETAS_IMAGEN.flatMap((carpeta) =>
    EXTENSIONES_IMAGEN.map((extension) => `${carpeta}${variedad.slug}.${extension}`)
  );
  return [variedad.imagen, ...habituales].filter(Boolean);
}

// Crea el marco con la imagen. Si la imagen no existe, queda el nombre como respaldo.
function crearMedia(variedad, clase) {
  const media = crear("div", `media ${clase || ""}`.trim());
  const lienzo = crear("div", "media__lienzo");
  lienzo.appendChild(crear("span", "media__ph", variedad.nombre));

  const imagen = document.createElement("img");
  imagen.alt = `Café ${variedad.nombre} de Justo`;
  imagen.loading = "lazy";
  imagen.decoding = "async";
  // Opcional: en variedades.js puedes poner posicion: "50% 30%" para elegir qué parte de la foto se ve
  if (variedad.posicion) imagen.style.objectPosition = variedad.posicion;
  imagen.addEventListener("load", () => media.classList.add("ok"));
  imagen.addEventListener("error", () => imagen.remove());
  imagen.src = `/img/variedades/${variedad.slug}.png`;
  if (imagen.complete && imagen.naturalWidth > 0) media.classList.add("ok");

  lienzo.appendChild(imagen);
  media.appendChild(lienzo);
  registrarParalaje(media);

  return media;
}

// Crea el botón de WhatsApp de una variedad
function crearBotonPedido(variedad, clase) {
  const accion = accionDeVariedad(variedad);
  const enlace = crear("a", clase, accion.texto);
  enlace.href = enlaceWhatsApp(accion.mensaje);
  enlace.target = "_blank";
  enlace.rel = "noopener";
  return enlace;
}

// Línea corta que acompaña a cada variedad
function lineaDeVariedad(variedad) {
  const partes = [variedad.descripcion, variedad.notas].filter(Boolean);
  return partes.length > 0
    ? partes.join(" ")
    : "Pregúntanos por el perfil de taza del lote actual.";
}


// ============================================================
// 2. VARIEDADES (carta y lanzamientos)
// ============================================================
function crearFila(variedad) {
  const fila = crear("li", "fila reveal");

  fila.appendChild(crearMedia(variedad));

  const nombre = crear("div", "fila__nombre");
  nombre.appendChild(crear("h3", "", variedad.nombre));
  if (variedad.nuevo) nombre.appendChild(crear("span", "badge", "Nuevo"));
  fila.appendChild(nombre);

  fila.appendChild(crear("p", "fila__linea", lineaDeVariedad(variedad)));

  const acciones = crear("div", "fila__acciones");
  acciones.appendChild(crear("span", `estado estado--${variedad.estado}`, ETIQUETAS_ESTADO[variedad.estado]));
  acciones.appendChild(crearBotonPedido(variedad, "btn"));
  fila.appendChild(acciones);

  return fila;
}

function crearPanel(variedad) {
  const panel = crear("article", "panel reveal");

  const media = crearMedia(variedad, "panel__media");
  media.appendChild(crear("span", "badge", "Nuevo"));
  panel.appendChild(media);

  const cuerpo = crear("div", "panel__cuerpo");
  cuerpo.appendChild(crear("h3", "", variedad.nombre));
  cuerpo.appendChild(crear("p", "", `${lineaDeVariedad(variedad)} Lote limitado.`));
  cuerpo.appendChild(crearBotonPedido(variedad, "btn btn--crema"));
  panel.appendChild(cuerpo);

  return panel;
}

// Pinta la carta aplicando el filtro elegido
function renderizarCarta(contenedor, filtro) {
  let lista = VARIEDADES;

  if (contenedor.dataset.sinNuevas === "true") {
    lista = lista.filter((variedad) => !variedad.nuevo);
  }
  if (filtro === "disponible") {
    lista = lista.filter((variedad) => variedad.estado === "disponible");
  }
  if (filtro === "nuevas") {
    lista = lista.filter((variedad) => variedad.nuevo);
  }

  contenedor.innerHTML = "";

  if (lista.length === 0) {
    contenedor.appendChild(crear("li", "carta__vacio", "No hay variedades con este filtro en este momento."));
    return;
  }

  lista.forEach((variedad, indice) => {
    const fila = crearFila(variedad);
    fila.style.setProperty("--d", `${Math.min(indice, 5) * 0.06}s`);
    contenedor.appendChild(fila);
  });

  observarRevelados(contenedor);
}

function renderizarLanzamientos(contenedor) {
  contenedor.innerHTML = "";
  VARIEDADES.filter((variedad) => variedad.nuevo).forEach((variedad, indice) => {
    const panel = crearPanel(variedad);
    panel.style.setProperty("--d", `${indice * 0.12}s`);
    contenedor.appendChild(panel);
  });
  observarRevelados(contenedor);
}

function renderizarVariedades() {
  document.querySelectorAll('[data-render="carta"]').forEach((contenedor) => renderizarCarta(contenedor, "todas"));
  document.querySelectorAll('[data-render="lanzamientos"]').forEach(renderizarLanzamientos);
}


// ============================================================
// 3. FILTROS DE LA PÁGINA DE CAFÉS
// ============================================================
function iniciarFiltros() {
  const botones = document.querySelectorAll(".filtro");
  const carta = document.querySelector('[data-filtrable="true"]');
  if (botones.length === 0 || !carta) return;

  botones.forEach((boton) => {
    boton.addEventListener("click", () => {
      botones.forEach((otro) => otro.setAttribute("aria-pressed", String(otro === boton)));
      renderizarCarta(carta, boton.dataset.filtro);
    });
  });
}


// ============================================================
// 4. MENÚ, CABECERA Y BOTÓN FLOTANTE
// ============================================================
function iniciarMenu() {
  const boton = document.querySelector(".menu-btn");
  const menu = document.getElementById("menu");
  if (!boton || !menu) return;

  const cerrar = () => {
    document.body.classList.remove("menu-abierto");
    boton.setAttribute("aria-expanded", "false");
  };

  boton.addEventListener("click", () => {
    const abierto = document.body.classList.toggle("menu-abierto");
    boton.setAttribute("aria-expanded", String(abierto));
  });

  menu.querySelectorAll("a").forEach((enlace) => enlace.addEventListener("click", cerrar));
  document.addEventListener("keydown", (evento) => {
    if (evento.key === "Escape") cerrar();
  });
}

function iniciarCabecera() {
  const cabecera = document.getElementById("cabecera");
  const flotante = document.getElementById("flotante");

  const actualizar = () => {
    const bajado = window.scrollY > 40;
    if (cabecera) cabecera.classList.toggle("cabecera--fija", bajado);
    if (flotante) flotante.classList.toggle("visible", window.scrollY > window.innerHeight * 0.6);
  };

  window.addEventListener("scroll", actualizar, { passive: true });
  actualizar();
}


// ============================================================
// 5. PREGUNTAS FRECUENTES (acordeón)
// ============================================================
function iniciarPreguntas() {
  document.querySelectorAll(".faq__q").forEach((boton) => {
    boton.addEventListener("click", () => {
      const item = boton.closest(".faq__item");
      const abierto = item.classList.toggle("abierto");
      boton.setAttribute("aria-expanded", String(abierto));
    });
  });
}


// ============================================================
// 6. ANIMACIONES DE ENTRADA
// ============================================================
let observador = null;

function observarRevelados(raiz) {
  const elementos = (raiz || document).querySelectorAll(".reveal:not(.visible)");

  if (!("IntersectionObserver" in window)) {
    elementos.forEach((elemento) => elemento.classList.add("visible"));
    return;
  }

  if (!observador) {
    observador = new IntersectionObserver((entradas) => {
      entradas.forEach((entrada) => {
        if (entrada.isIntersecting) {
          entrada.target.classList.add("visible");
          observador.unobserve(entrada.target);
        }
      });
    }, { threshold: 0.12, rootMargin: "0px 0px -6% 0px" });
  }

  elementos.forEach((elemento) => observador.observe(elemento));
}

// Escalona la aparición de bloques hermanos (por ejemplo, las columnas de una franja)
function escalonarGrupos() {
  document.querySelectorAll(".franja__grid, .pasos, .info-3, .habitos").forEach((grupo) => {
    grupo.querySelectorAll(".reveal").forEach((elemento, indice) => {
      elemento.style.setProperty("--d", `${indice * 0.1}s`);
    });
  });
}

// Mueve suavemente cada foto dentro de su marco mientras se hace scroll
const marcosVisibles = new Set();
let observadorMarcos = null;
let actualizacionPendiente = false;

function registrarParalaje(media) {
  if (window.matchMedia("(prefers-reduced-motion: reduce)").matches || !("IntersectionObserver" in window)) return;

  if (!observadorMarcos) {
    observadorMarcos = new IntersectionObserver((entradas) => {
      entradas.forEach((entrada) => {
        if (entrada.isIntersecting) marcosVisibles.add(entrada.target);
        else marcosVisibles.delete(entrada.target);
      });
      programarParalaje();
    }, { rootMargin: "120px 0px" });

    window.addEventListener("scroll", programarParalaje, { passive: true });
    window.addEventListener("resize", programarParalaje);
  }

  observadorMarcos.observe(media);
}

function programarParalaje() {
  if (actualizacionPendiente) return;
  actualizacionPendiente = true;
  requestAnimationFrame(() => {
    actualizacionPendiente = false;
    const altoVentana = window.innerHeight;
    marcosVisibles.forEach((media) => {
      const caja = media.getBoundingClientRect();
      const progreso = (caja.top + caja.height / 2 - altoVentana / 2) / altoVentana;
      const limitado = Math.max(-1, Math.min(1, progreso));
      media.style.setProperty("--py", (limitado * -7).toFixed(2));
    });
  });
}

function iniciarPortada() {
  // La secuencia de entrada de la portada empieza cuando las tipografías están listas
  const arrancar = () => requestAnimationFrame(() => document.body.classList.add("cargado"));
  if (document.fonts && document.fonts.ready) {
    document.fonts.ready.then(arrancar);
    setTimeout(arrancar, 1200);
  } else {
    arrancar();
  }
}


// ============================================================
// 7. INICIO
// ============================================================
document.addEventListener("DOMContentLoaded", () => {
  renderizarVariedades();
  iniciarFiltros();
  iniciarMenu();
  iniciarCabecera();
  iniciarPreguntas();
  escalonarGrupos();
  observarRevelados();
  iniciarPortada();
});