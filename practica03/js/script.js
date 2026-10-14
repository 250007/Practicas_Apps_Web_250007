document.addEventListener("DOMContentLoaded", () => {
    const track = document.getElementById("carouselTrack");
    const prevBtn = document.getElementById("prevBtn");
    const nextBtn = document.getElementById("nextBtn");
    const dots = document.querySelectorAll(".dot");
    const slides = document.querySelectorAll(".carrusel-slide");

    let currentIndex = 0;

    function updateCarousel() {
        if (!track || slides.length === 0) return;

        // Obtenemos el ancho exacto del slide visible
        const slideWidth = slides[0].offsetWidth;
        
        // Desplazamos la pista en píxeles exactos
        track.style.transform = `translateX(-${currentIndex * slideWidth}px)`;

        // Actualizamos las bolitas (puntos)
        dots.forEach((dot, index) => {
            if (index === currentIndex) {
                dot.classList.add("active");
            } else {
                dot.classList.remove("active");
            }
        });
    }

    if (nextBtn) {
        nextBtn.addEventListener("click", () => {
            if (currentIndex < slides.length - 1) {
                currentIndex++;
            } else {
                currentIndex = 0; // Regresa al primero
            }
            updateCarousel();
        });
    }

    if (prevBtn) {
        prevBtn.addEventListener("click", () => {
            if (currentIndex > 0) {
                currentIndex--;
            } else {
                currentIndex = slides.length - 1; // Salta al último
            }
            updateCarousel();
        });
    }

    dots.forEach((dot) => {
        dot.addEventListener("click", (e) => {
            const index = parseInt(e.target.getAttribute("data-index"));
            if (!isNaN(index)) {
                currentIndex = index;
                updateCarousel();
            }
        });
    });

    // Recalcular posición si se cambia el tamaño de la ventana
    window.addEventListener("resize", updateCarousel);
    
    // Ejecutar una vez al cargar para asegurar posicionamiento
    updateCarousel();
});
