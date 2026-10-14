document.addEventListener("DOMContentLoaded", () => {
    const track = document.getElementById("carouselTrack");
    const prevBtn = document.getElementById("prevBtn");
    const nextBtn = document.getElementById("nextBtn");
    const dots = document.querySelectorAll(".dot");
    const totalSlides = 3;

    let currentIndex = 0;

    function updateCarousel() {
        if (!track) return;

        // Cada slide equivale al 33.3333% del ancho total de la pista (100% / 3)
        const shiftPercentage = currentIndex * (100 / totalSlides);
        track.style.transform = `translateX(-${shiftPercentage}%)`;

        // Actualizar el estado visual de los puntos indicadores
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
            if (currentIndex < totalSlides - 1) {
                currentIndex++;
            } else {
                currentIndex = 0; // Vuelve al inicio
            }
            updateCarousel();
        });
    }

    if (prevBtn) {
        prevBtn.addEventListener("click", () => {
            if (currentIndex > 0) {
                currentIndex--;
            } else {
                currentIndex = totalSlides - 1; // Salta al último
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

    // Iniciar posicionamiento correcto
    updateCarousel();
});
