document.addEventListener("DOMContentLoaded", () => {
    (function () {
        const carrusel = document.querySelector('.carrusel');
        if (!carrusel) return;

        const pista = carrusel.querySelector('.carrusel-pista');
        const slides = carrusel.querySelectorAll('.carrusel-slide');
        const btnPrev = carrusel.querySelector('.carrusel-prev');
        const btnNext = carrusel.querySelector('.carrusel-next');
        const contPuntos = document.querySelector('.carrusel-puntos');
        let actual = 0;

        // Generar puntos dinámicamente
        if (contPuntos) {
            contPuntos.innerHTML = ""; // Limpiar si había algo antes
            slides.forEach(function (_, i) {
                const punto = document.createElement('button');
                punto.type = 'button';
                punto.setAttribute('aria-label', 'Ir al favorito ' + (i + 1));
                punto.addEventListener('click', function () { ir(i); });
                contPuntos.appendChild(punto);
            });
        }

        const puntos = contPuntos ? contPuntos.querySelectorAll('button') : [];

        function ir(i) {
            actual = (i + slides.length) % slides.length;
            pista.style.transform = 'translateX(-' + (actual * 100) + '%)';
            puntos.forEach(function (p, n) {
                p.classList.toggle('activo', n === actual);
            });
        }

        if (btnPrev) btnPrev.addEventListener('click', function () { ir(actual - 1); });
        if (btnNext) btnNext.addEventListener('click', function () { ir(actual + 1); });

        // Navegación con flechas del teclado
        carrusel.setAttribute('tabindex', '0');
        carrusel.addEventListener('keydown', function (e) {
            if (e.key === 'ArrowLeft') ir(actual - 1);
            if (e.key === 'ArrowRight') ir(actual + 1);
        });

        // Deslizar con el dedo en pantallas táctiles (celulares)
        let inicioX = null;
        carrusel.addEventListener('touchstart', function (e) {
            inicioX = e.touches[0].clientX;
        }, { passive: true });

        carrusel.addEventListener('touchend', function (e) {
            if (inicioX === null) return;
            const dif = e.changedTouches[0].clientX - inicioX;
            if (Math.abs(dif) > 50) ir(dif < 0 ? actual + 1 : actual - 1);
            inicioX = null;
        });

        ir(0);
    })();
});
