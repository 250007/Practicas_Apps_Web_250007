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
        
        // Desplaza horizontalmente solo una tarjeta a la vez (100% por slide)
        track.style.transform = `translateX(-${currentIndex * 100}%)`;

        // Actualiza el estado activo de los puntos de navegación
        dots.forEach((dot, index) => {
            dot.classList.toggle("active", index === currentIndex);
        });
    }

    if (nextBtn) {
        nextBtn.addEventListener("click", () => {
            if (currentIndex < slides.length - 1) {
                currentIndex++;
            } else {
                currentIndex = 0; // Vuelve al primer slide al llegar al final
            }
            updateCarousel();
        });
    }

    if (prevBtn) {
        prevBtn.addEventListener("click", () => {
            if (currentIndex > 0) {
                currentIndex--;
            } else {
                currentIndex = slides.length - 1; // Vuelve al último slide
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
