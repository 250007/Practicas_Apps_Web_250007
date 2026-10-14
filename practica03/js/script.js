document.addEventListener("DOMContentLoaded", () => {
    // ================= CARRUSEL MULTIMEDIA =================
    const track = document.getElementById("carouselTrack");
    const prevBtn = document.getElementById("prevBtn");
    const nextBtn = document.getElementById("nextBtn");
    const dots = document.querySelectorAll(".dot");
    const slides = document.querySelectorAll(".carrusel-slide");

    let currentIndex = 0;

    function updateCarousel() {
        if (!track || !slides.length) return;
        
        // Mueve la pista horizontalmente el 100% del ancho del slide actual
        track.style.transform = `translateX(-${currentIndex * 100}%)`;

        // Actualiza el indicador activo (puntos)
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
                currentIndex = 0; // Regresa al primer slide
            }
            updateCarousel();
        });
    }

    if (prevBtn) {
        prevBtn.addEventListener("click", () => {
            if (currentIndex > 0) {
                currentIndex--;
            } else {
                currentIndex = slides.length - 1; // Salta al último slide
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

    window.addEventListener("resize", updateCarousel);
});
