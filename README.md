# Practicas de la asignatura de Aplicaciones Web
## Alumno: Jimena Garcia Ramirez
## T.S.U en Desarrollo de Software Multiplataforma

Periodo Septiembre - Diciembre 2026

---
### Tabla de Práctica de la Materia

| No. | Nombre | Descripción | Potenciador | Estatus |
|-----|--------|-------------|-------------|---------|
| 1. | Metodología de Evaluación de la Materia | Transcribir en libreta y comprender la metodología y fechas de evaluación de la asignatura | 5 | 🟢 Concluida |
| 2. | Mi Primer Página Web | Codificar la primer página web con HTML puro, sin estilos ni funcionalidades | 10 | 🟢 Concluida |


## 🎯 Objetivo del Proyecto
Desarrollar una aplicación web interactiva y responsiva integrando la maquetación semántica con HTML5, estilos avanzados con CSS3 y manipulación dinámica del DOM con JavaScript para la incorporación de componentes como carruseles multimedia y ventanas modales de pantalla completa.

## 📝 Descripción del Proyecto
Este proyecto es un portafolio personal interactivo que presenta la trayectoria, aspiraciones, hobbies, contenidos multimedia favoritos (películas, música y libros) y redes sociales de Jimena. La interfaz cuenta con efectos visuales modernos (*glassmorphism*, parallax, sombras y bordes redondeados), un carrusel dinámico e integración de reproductores multimedia dentro de ventanas modales que bloquean el desplazamiento de fondo.

---

## 📁 Estructura de Directorios

```text
Practicas_Aplicaciones_Web_250007/
├── práctica02/             # Archivos de la práctica anterior
├── practica03/             # Código fuente principal del portafolio
│   ├── assets/             # Archivos multimedia (imágenes, audios, videos, PDF)
│   ├── styles/             # Hojas de estilo CSS
│   ├── MiPerfil.html       # Estructura principal
│   └── script.js           # Lógica interactiva en JS
└── README.md               # Documentación técnica del repositorio
```

---

## 🛠️ Tecnologías Utilizadas
- **HTML5:** Marcado semántico para la estructura general del sitio.
- **CSS3:** Flexbox para alineación y simetría, `clamp()` para tipografía fluida, variables y propiedades visuales de estilo (*glassmorphism*, bordes, sombras, `@media queries`).
- **JavaScript (ES6):** Manipulación del DOM, manejo de eventos con `addEventListener` y funciones para control de carrusel y modales.
- **Google Fonts:** Tipografía *Poppins* integrada globalmente.
- **Git & GitHub:** Control de versiones con ramas integradas (`Practica02` y `master`).

---

## 🔍 Explicación de las Secciones HTML
1. **`<nav>` (Menú de Navegación):** Barra fija superior con efecto de desenfoque (*glassmorphism*) que permite el desplazamiento suave entre secciones.
2. **`#inicio` (Portada / Hero Section):** Tarjeta central con la foto de perfil, descripción personal y una frase destacada.
3. **`#acerca-de-mi`:** Tarjetas informativas con edad, ciudad y ocupación actual.
4. **`#aspiraciones` y Hobbies:** Tarjetas en formato de cuadrícula (*flexbox*) con detalles de metas personales y profesionales.
5. **`#favoritos` (Carrusel Multimedia):** Sección que envuelve tres tarjetas interactivas (Película, Canción y Libro favorito) preparadas para activar componentes multimedia.
6. **`#redes-sociales`:** Enlaces externos estilizados hacia perfiles profesionales e institucionales.

---

## 🎨 Principales Propiedades CSS Implementadas
- **`display: flex;` / `justify-content: space-between;`:** Organiza y alinea simétricamente las tarjetas dentro de los contenedores principales.
- **`font-size: clamp(2rem, 5vw, 3.5rem);`:** Garantiza la adaptación de la tipografía de forma proporcional al tamaño de la pantalla.
- **`backdrop-filter: blur(15px);`:** Crea el efecto visual esmerilado en menús y modales (*glassmorphism*).
- **`@media (max-width: 768px)`:** Cambia el flujo visual a una sola columna en pantallas móviles para garantizar la legibilidad.

---

## ⚡ Funcionalidades JavaScript
- **Manipulación del DOM & `addEventListener`:** Selección de botones e inyección dinámica de código HTML.
- **Carrusel Multimedia:** Navegación entre las tarjetas de la sección de favoritos por medio de botones laterales (anterior/siguiente) e indicadores de puntos (*dots*).
- **Ventana Modal de Pantalla Completa:**
  - Abre reproductores de video (`<video>`), audio (`<audio>`) o visualizadores PDF (`<iframe>`) según la tarjeta seleccionada.
  - Bloquea temporalmente el desplazamiento de la página agregando la clase `no-scroll` al `body`.
  - Se cierra automáticamente al presionar el botón `×` o al hacer clic fuera del contenido principal.

---

## 🚀 Instrucciones de Ejecución
1. Clonar el repositorio localmente:
   ```bash
   git clone [https://github.com/250007/Practicas_Aplicaciones_Web_250007.git](https://github.com/250007/Practicas_Aplicaciones_Web_250007.git)
   ```
2. Abrir el archivo `index.html` en cualquier navegador moderno o utilizando la extensión *Live Server* en Visual Studio Code.

---

## 💡 Conclusiones sobre los Conocimientos Adquiridos
Mediante esta práctica se logró dominar la interacción cliente-servidor mediante JavaScript nativo, consolidando el uso de `addEventListener` para responder a eventos del usuario sin necesidad de bibliotecas externas. Asimismo, se comprendió la importancia de utilizar unidades de medida flexibles (`clamp()`) y controladores de flujo en Git para mantener un repositorio ordenado mediante ramas de trabajo y desarrollo limpio.

