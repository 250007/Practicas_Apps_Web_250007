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
        
        // Mueve la pista el 100% del ancho por cada slide
        track.style.transform = `translateX(-${currentIndex * 100}%)`;

        // Actualiza los puntos indicadores
        dots.forEach((dot, index) => {
            dot.classList.toggle("active", index === currentIndex);
        });
    }

    if (nextBtn) {
        nextBtn.addEventListener("click", () => {
            if (currentIndex < slides.length - 1) {
                currentIndex++;
            } else {
                currentIndex = 0; // Regresa al inicio al llegar al final
            }
            updateCarousel();
        });
    }

    if (prevBtn) {
        prevBtn.addEventListener("click", () => {
            if (currentIndex > 0) {
                currentIndex--;
            } else {
                currentIndex = slides.length - 1; // Va al último si está en el primero
            }
            updateCarousel();
        });
    }

    dots.forEach((dot) => {
        dot.addEventListener("click", (e) => {
            currentIndex = parseInt(e.target.getAttribute("data-index"));
            updateCarousel();
        });
    });

    window.addEventListener("resize", updateCarousel);
});
