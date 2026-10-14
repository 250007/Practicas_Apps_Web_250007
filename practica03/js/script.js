document.addEventListener("DOMContentLoaded", () => {
    // ================= 1. CARRUSEL MULTIMEDIA =================
    const track = document.getElementById("carouselTrack");
    const prevBtn = document.getElementById("prevBtn");
    const nextBtn = document.getElementById("nextBtn");
    const dots = document.querySelectorAll(".dot");
    const cards = document.querySelectorAll(".carousel-card");

    let currentIndex = 0;

    function getCardShift() {
        if (!cards.length) return 0;
        const cardWidth = cards[0].getBoundingClientRect().width;
        const gap = 20; // Espaciado gap entre tarjetas
        return cardWidth + gap;
    }

    function updateCarousel() {
        if (!track) return;
        const shiftAmount = getCardShift();
        track.style.transform = `translateX(-${currentIndex * shiftAmount}px)`;

        dots.forEach((dot, index) => {
            dot.classList.toggle("active", index === currentIndex);
        });
    }

    if (nextBtn) {
        nextBtn.addEventListener("click", () => {
            if (currentIndex < cards.length - 1) {
                currentIndex++;
            } else {
                currentIndex = 0;
            }
            updateCarousel();
        });
    }

    if (prevBtn) {
        prevBtn.addEventListener("click", () => {
            if (currentIndex > 0) {
                currentIndex--;
            } else {
                currentIndex = cards.length - 1;
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

    // ================= 2. CONTROL DE VENTANA MODAL =================
    const modal = document.getElementById("mediaModal");
    const modalBody = document.getElementById("modalBody");
    const closeModal = document.getElementById("closeModal");
    const modalButtons = document.querySelectorAll(".btn-modal");

    // Abrir Modal e inyectar contenido multimedia
    modalButtons.forEach((btn) => {
        btn.addEventListener("click", () => {
            const type = btn.getAttribute("data-type");
            const src = btn.getAttribute("data-src");

            if (!modal || !modalBody) return;

            modalBody.innerHTML = ""; // Limpiar contenido previo

            if (type === "video") {
                modalBody.innerHTML = `
                    <video controls autoplay style="width:100%; max-height:75vh; border-radius:10px;">
                        <source src="${src}" type="video/mp4">
                        Tu navegador no soporta la reproducción de video.
                    </video>`;
            } else if (type === "audio") {
                modalBody.innerHTML = `
                    <div style="text-align:center; padding: 25px; width: 100%; max-width: 500px; background-color: #f9fafb; border-radius: 12px; border: 1px solid #e5e7eb; box-shadow: 0 4px 6px rgba(0,0,0,0.1); display: flex; flex-direction: column; align-items: center;">
                        <p style="color: #1f2937; margin-bottom: 15px; font-weight: 500; font-family: sans-serif;">Reproductor de Canción</p>
                        <audio controls autoplay style="width:100%;">
                            <source src="${src}" type="audio/mp3">
                            Tu navegador no soporta la reproducción de audio.
                        </audio>
                    </div>`;
            } else if (type === "pdf") {
                modalBody.innerHTML = `
                    <iframe src="${src}" style="width:100%; height:75vh; border:none; border-radius:10px;"></iframe>`;
            }

            modal.style.display = "flex";
            document.body.classList.add("no-scroll"); // Bloquear scroll del fondo
        });
    });

    // Función para cerrar el modal
    function hideModal() {
        if (!modal) return;
        modal.style.display = "none";
        if (modalBody) modalBody.innerHTML = ""; // Detener reproducciones al cerrar
        document.body.classList.remove("no-scroll"); // Restaurar scroll
    }

    if (closeModal) {
        closeModal.addEventListener("click", hideModal);
    }

    window.addEventListener("click", (e) => {
        if (e.target === modal) {
            hideModal();
        }
    });
});
