/* ==========================================================================
   MecaGest · app.js
   1. Utilidades de validación
   2. Asistente de registro (5 pasos)
   3. Cálculo de edad
   4. Vista previa del QR de WhatsApp
   4B. Facturación (paso 5, opcional)
   5. Solicitar cita (sección 02 de la página)
   6. Módulos de práctica (citas, interfaz, perfil, fiscal, herramientas)
   ========================================================================== */
(() => {
    'use strict';

    const $  = (sel, ctx = document) => ctx.querySelector(sel);
    const $$ = (sel, ctx = document) => [...ctx.querySelectorAll(sel)];

    /* ======================================================================
       1. UTILIDADES DE VALIDACIÓN
       ====================================================================== */

    /** Traduce el estado de validez del navegador a un mensaje en español. */
    function messageFor(el) {
        const v = el.validity;
        if (v.valid) return '';
        if (v.customError) return el.validationMessage;
        if (v.valueMissing) {
            if (el.type === 'checkbox') return 'Debes aceptar los términos antes de continuar.';
            if (el.type === 'file') return 'Selecciona un archivo.';
            return 'Este campo es obligatorio.';
        }
        if (v.typeMismatch || v.patternMismatch) return el.dataset.msg || 'El formato no es válido.';
        if (v.rangeUnderflow || v.rangeOverflow) return el.dataset.msg || 'El valor está fuera del rango permitido.';
        if (v.tooShort) return `Usa al menos ${el.minLength} caracteres.`;
        return el.validationMessage;
    }

    /** Muestra u oculta el error de un campo dentro de su contenedor [data-field]. */
    function showFieldState(el) {
        const box = el.closest('[data-field]');
        if (!box || el.disabled) return true;
        const msg = messageFor(el);
        const out = $('.error', box);
        if (out) out.textContent = msg;
        box.classList.toggle('is-invalid', Boolean(msg));
        el.setAttribute('aria-invalid', msg ? 'true' : 'false');
        return !msg;
    }

    /** Controles que participan en la validación (ignora botones y ocultos). */
    const controlsOf = (root) =>
        $$('input, select, textarea', root).filter((c) => !['button', 'submit', 'reset', 'hidden'].includes(c.type));

    /* ======================================================================
       2. ASISTENTE DE REGISTRO
       ====================================================================== */
    const form      = $('#registroForm');
    const panels    = $$('.wizard-panel', form);
    const stepBtns  = $$('.stepper__btn', form);
    const stepper   = $('#stepper');
    const prevBtn   = $('#btnPrev');
    const clearBtn  = $('#btnClear');
    const nextText  = $('#btnNextText');
    const alertBox  = $('#formAlert');
    const LAST      = panels.length - 1;
    let current     = 0;

    function setAlert(text, ok = false) {
        alertBox.hidden = !text;
        alertBox.textContent = text || '';
        alertBox.classList.toggle('form-alert--ok', ok);
    }

    function showStep(i, { scroll = false } = {}) {
        current = i;
        panels.forEach((p, idx) => { p.hidden = idx !== i; });
        stepBtns.forEach((b, idx) => {
            b.classList.toggle('is-active', idx === i);
            b.classList.toggle('is-done', idx < i);
            if (idx === i) b.setAttribute('aria-current', 'step'); else b.removeAttribute('aria-current');
        });
        stepper.style.setProperty('--progress-ratio', i / LAST);
        prevBtn.disabled = i === 0;
        nextText.textContent = i === LAST ? 'Enviar solicitud' : 'Siguiente';
        $('i', $('#btnNext')).className = i === LAST ? 'ri-check-line' : 'ri-arrow-right-s-line';
        setAlert('');
        if (scroll) form.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }

    /** Reglas que dependen de más de un campo (se aplican con setCustomValidity). */
    function applyCustomRules() {
        // Fecha de nacimiento: sin fecha futura y solo mayores de edad
        const fecha = $('#fechaNacimiento');
        const edad = calcAge(fecha.value);
        fecha.setCustomValidity(
            !edad ? '' :
            edad.future ? 'La fecha de nacimiento no puede ser futura.' :
            edad.age < 18 ? 'Debes ser mayor de edad para registrarte.' : ''
        );

        // Horario: "Hasta" debe ser posterior a "Desde"
        const ini = $('#horarioContactoInicio'), fin = $('#horarioContactoFin');
        fin.setCustomValidity(ini.value && fin.value && fin.value <= ini.value
            ? 'La hora final debe ser posterior a la inicial.' : '');

        // Confirmación de contraseña
        const pass = $('#contrasena'), conf = $('#confirmarContrasena');
        conf.setCustomValidity(conf.value && conf.value !== pass.value ? 'Las contraseñas no coinciden.' : '');

        // Facturación: la longitud del RFC debe coincidir con el régimen
        const rfcF = $('#rfcFactura'), reg = $('#regimenFiscal');
        let rfcMsg = '';
        if (rfcF.value && reg.value) {
            const n = rfcF.value.length;
            if (reg.value === '601' && n !== 12) rfcMsg = 'El régimen 601 es de persona moral: el RFC debe tener 12 caracteres.';
            else if (['605', '612'].includes(reg.value) && n !== 13) rfcMsg = 'Este régimen es de persona física: el RFC debe tener 13 caracteres.';
        }
        rfcF.setCustomValidity(rfcMsg);
    }

    /** Valida un paso completo; devuelve el primer control inválido (o null). */
    function validateStep(i) {
        applyCustomRules();
        let firstInvalid = null;
        controlsOf(panels[i]).forEach((c) => {
            const ok = showFieldState(c);
            if (!ok && !firstInvalid) firstInvalid = c;
        });
        return firstInvalid;
    }

    function goTo(target) {
        for (let i = current; i < target; i++) {
            const bad = validateStep(i);
            if (bad) {
                showStep(i);
                setAlert('Completa los campos obligatorios antes de continuar:');
                validateStep(i);
                bad.focus();
                return;
            }
        }
        showStep(target, { scroll: true });
    }

    // Envío del formulario = botón "Siguiente" / "Enviar solicitud"
    form.addEventListener('submit', (e) => {
        e.preventDefault();
        if (current < LAST) { goTo(current + 1); return; }

        // Último paso: se revisan todos los pasos
        for (let i = 0; i <= LAST; i++) {
            const bad = validateStep(i);
            if (bad) {
                showStep(i);
                validateStep(i);
                setAlert('Completa los campos obligatorios antes de continuar:');
                bad.focus();
                return;
            }
        }
        setAlert('¡Registro revisado! Envío simulado: los datos no se almacenan.', true);
    });

    prevBtn.addEventListener('click', () => current > 0 && showStep(current - 1, { scroll: true }));
    stepBtns.forEach((b) => b.addEventListener('click', () => {
        const target = Number(b.dataset.step);
        if (target <= current) showStep(target, { scroll: true }); else goTo(target);
    }));

    // "Limpiar": vacía únicamente el paso visible
    clearBtn.addEventListener('click', () => {
        const panel = panels[current];
        controlsOf(panel).forEach((c) => {
            if (c.type === 'checkbox' || c.type === 'radio') c.checked = c.defaultChecked;
            else if (c.type === 'file') c.value = '';
            else if (c.tagName === 'SELECT') c.selectedIndex = 0;
            else c.value = c.defaultValue;
            c.setCustomValidity('');
            c.dispatchEvent(new Event('change', { bubbles: true }));
        });
        $$('[data-field]', panel).forEach((b) => { b.classList.remove('is-invalid'); const o = $('.error', b); if (o) o.textContent = ''; });
        setAlert('');
    });

    // Validación en vivo: solo re-evalúa campos que ya mostraron error
    form.addEventListener('input', (e) => {
        const c = e.target;
        if (!c.matches('input, select, textarea')) return;
        applyCustomRules();
        const box = c.closest('[data-field]');
        if (box && box.classList.contains('is-invalid')) showFieldState(c);
        // si cambia la contraseña, vuelve a comprobar la confirmación
        if (c.id === 'contrasena' && $('#confirmarContrasena').value) showFieldState($('#confirmarContrasena'));
    });
    form.addEventListener('change', (e) => {
        const box = e.target.closest && e.target.closest('[data-field]');
        if (box && box.classList.contains('is-invalid')) { applyCustomRules(); showFieldState(e.target); }
    });

    // Usuario sin espacios
    $('#usuario').addEventListener('input', (e) => { e.target.value = e.target.value.replace(/\s/g, ''); });

    /* ======================================================================
       3. CÁLCULO DE EDAD
       ====================================================================== */
    function calcAge(value) {
        if (!value) return null;
        const [y, m, d] = value.split('-').map(Number);
        const hoy = new Date();
        if (new Date(y, m - 1, d) > hoy) return { future: true };
        let age = hoy.getFullYear() - y;
        if (hoy.getMonth() < m - 1 || (hoy.getMonth() === m - 1 && hoy.getDate() < d)) age--;
        return { age };
    }

    const edadBox = $('#edadMensaje');
    function updateAge() {
        const r = calcAge($('#fechaNacimiento').value);
        edadBox.className = 'age-box';
        if (!r) { edadBox.textContent = 'Selecciona una fecha para calcular tu edad.'; return; }
        if (r.future) {
            edadBox.textContent = 'Error: no se puede calcular la edad con los datos elegidos. La fecha es futura.';
            edadBox.classList.add('age-box--error');
        } else if (r.age >= 18) {
            edadBox.textContent = `Eres mayor de edad. Tienes ${r.age} años.`;
            edadBox.classList.add('age-box--ok');
        } else {
            edadBox.textContent = `Eres menor de edad. Tienes ${r.age} años.`;
            edadBox.classList.add('age-box--error');
        }
    }
    $('#fechaNacimiento').addEventListener('input', updateAge);
    $('#fechaNacimiento').addEventListener('change', updateAge);

    /* ======================================================================
       4. REDES SOCIALES Y VISTA PREVIA DEL QR
       ====================================================================== */
    // Cada casilla habilita (y vuelve obligatorio) su campo asociado
    $$('.social-row', form).forEach((row) => {
        const cb = $('input[type="checkbox"]', row);
        const target = $('[data-social-target]', row);
        const sync = () => {
            target.disabled = !cb.checked;
            target.required = cb.checked;
            if (!cb.checked) {
                row.classList.remove('is-invalid');
                $('.error', row).textContent = '';
            }
        };
        cb.addEventListener('change', sync);
        sync();
    });

    const qrInput = $('#whatsAppQR'), qrImg = $('#qrImage'), qrEmpty = $('#qrEmpty');
    const qrError = $('#qrError'), qrName = $('#qrFileName'), qrRemove = $('#qrRemove');
    let qrUrl = null;
    const MAX_QR = 2 * 1024 * 1024; // 2 MB

    function resetQr(message = '') {
        if (qrUrl) { URL.revokeObjectURL(qrUrl); qrUrl = null; }
        qrImg.hidden = true; qrImg.removeAttribute('src');
        qrEmpty.hidden = Boolean(message);
        qrError.hidden = !message; qrError.textContent = message;
        qrName.textContent = ''; qrRemove.hidden = true;
    }

    qrInput.addEventListener('change', () => {
        const file = qrInput.files[0];
        if (!file) { resetQr(); return; }
        if (!file.type.startsWith('image/')) { qrInput.value = ''; resetQr('El archivo debe ser una imagen (PNG, JPG, etc.).'); return; }
        if (file.size > MAX_QR) { qrInput.value = ''; resetQr('La imagen supera el máximo de 2 MB.'); return; }
        resetQr();
        qrUrl = URL.createObjectURL(file);
        qrImg.src = qrUrl; qrImg.hidden = false; qrEmpty.hidden = true;
        qrName.textContent = `Archivo: ${file.name}`;
        qrRemove.hidden = false;
    });
    qrRemove.addEventListener('click', () => { qrInput.value = ''; resetQr(); qrInput.focus(); });

    /* ======================================================================
       4B. FACTURACIÓN (paso 5, opcional)
       ====================================================================== */
    const chkFactura  = $('#requiereFactura');
    const cajaFactura = $('#facturaCampos');
    const camposFact  = $$('[data-billing]', cajaFactura);
    const rfcFactura  = $('#rfcFactura');

    // La casilla muestra/oculta los campos y los habilita o deshabilita.
    // Un campo deshabilitado se ignora en showFieldState(), así que no bloquea el envío.
    function syncFactura() {
        const on = chkFactura.checked;
        cajaFactura.hidden = !on;
        camposFact.forEach((c) => {
            c.disabled = !on;
            c.required = on && c.hasAttribute('data-billing-required');
            if (!on) {
                c.setCustomValidity('');
                const box = c.closest('[data-field]');
                box.classList.remove('is-invalid');
                $('.error', box).textContent = '';
            }
        });
    }
    chkFactura.addEventListener('change', syncFactura);

    rfcFactura.addEventListener('input', () => {
        rfcFactura.value = rfcFactura.value.toUpperCase().replace(/\s/g, '');
    });
    $('#regimenFiscal').addEventListener('change', () => {
        applyCustomRules();
        if (rfcFactura.value) showFieldState(rfcFactura);
    });
    $('#constanciaFiscal').addEventListener('change', (e) => {
        const f = e.target.files[0];
        e.target.setCustomValidity(
            !f ? '' :
            f.type !== 'application/pdf' ? 'El archivo debe ser un PDF.' :
            f.size > 3 * 1024 * 1024 ? 'El PDF supera el máximo de 3 MB.' : ''
        );
        showFieldState(e.target);
    });
    syncFactura();

    /* ======================================================================
       5. SOLICITAR CITA (sección 02)
       ====================================================================== */
    const citaForm  = $('#citaForm');
    const cAlert    = $('#citaAlert');
    const cFecha    = $('#fechaCita');
    const cSucursal = $('#sucursal');
    const cAnio     = $('#anioVehiculo');
    const cPlacas   = $('#placas');
    const cDesc     = $('#descripcionCita');
    const cContador = $('#descContador');
    const cTbody    = $('#tablaSolicitudes tbody');
    const cVacia    = $('#solicitudesVacia');
    const cConteo   = $('#solicitudesConteo');
    let cConsecutivo = 0;

    const pad = (n) => String(n).padStart(2, '0');
    const toInput = (d) =>
        `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}T${pad(d.getHours())}:${pad(d.getMinutes())}`;

    const citaControls = () => controlsOf(citaForm);

    function setCitaAlert(text, ok = false) {
        cAlert.hidden = !text;
        cAlert.textContent = text || '';
        cAlert.classList.toggle('form-alert--ok', ok);
    }

    // Límites dinámicos: la cita debe ser futura y dentro de 90 días
    const ahora = new Date();
    cFecha.min = toInput(ahora);
    const limite = new Date(ahora); limite.setDate(limite.getDate() + 90);
    cFecha.max = toInput(limite);
    cAnio.min = 1980;
    cAnio.max = ahora.getFullYear() + 1;

    // Reglas de negocio (horario de atención y sucursal de la lista)
    function applyCitaRules() {
        let m = '';
        if (cFecha.value) {
            const d = new Date(cFecha.value);
            const dia = d.getDay(), hora = d.getHours() + d.getMinutes() / 60;
            const cierre = dia === 6 ? 14 : 18;
            if (d < new Date()) m = 'La cita debe ser posterior al momento actual.';
            else if (dia === 0) m = 'No se atiende los domingos.';
            else if (hora < 8 || hora >= cierre) m = `Horario de atención: de 08:00 a ${cierre}:00 h.`;
        }
        cFecha.setCustomValidity(m);

        const validas = $$('#sucursalesList option').map((o) => o.value);
        cSucursal.setCustomValidity(cSucursal.value && !validas.includes(cSucursal.value)
            ? 'Elige una sucursal de la lista.' : '');
    }

    cPlacas.addEventListener('input', () => { cPlacas.value = cPlacas.value.toUpperCase().replace(/\s/g, ''); });
    cDesc.addEventListener('input', () => { cContador.textContent = `${cDesc.value.length}/300`; });

    const revalidarCita = (e) => {
        if (!e.target.matches('input, select, textarea')) return;
        applyCitaRules();
        if (e.target.closest('.is-invalid')) showFieldState(e.target);
    };
    citaForm.addEventListener('input', revalidarCita);
    citaForm.addEventListener('change', revalidarCita);

    // Copia los datos capturados en el registro (si existen) al formulario de cita
    $('#btnUsarRegistro').addEventListener('click', () => {
        const nombreCompleto = [$('#nombre').value, $('#apPaterno').value, $('#apMaterno').value]
            .map((s) => s.trim()).filter(Boolean).join(' ');
        const set = (id, value) => { if (value) $(id).value = value; };
        set('#nombreCliente', nombreCompleto);
        set('#telefonoCliente', $('#numeroTelefonico').value.trim());
        set('#correoCliente', $('#email').value.trim());
        if (!nombreCompleto && !$('#numeroTelefonico').value && !$('#email').value) {
            setCitaAlert('Aún no hay datos en el registro. Captura el paso 1 y 2 del registro o escríbelos aquí.');
        } else {
            setCitaAlert('');
        }
    });

    const celda = (texto) => { const td = document.createElement('td'); td.textContent = texto; return td; };

    function agregarFilaCita(d) {
        const tr = document.createElement('tr');

        const tdCliente = document.createElement('td');
        const strong = document.createElement('strong'); strong.textContent = d.cliente;
        tdCliente.append(strong, document.createElement('br'), d.unidad);

        const tdEstatus = document.createElement('td');
        const badge = document.createElement('span');
        badge.className = 'status status--plan'; badge.textContent = 'Programada';
        tdEstatus.append(badge);

        tr.append(celda(d.folio), tdCliente, celda(d.servicio), celda(d.sucursal), celda(d.fecha), tdEstatus);
        cTbody.prepend(tr);
        cVacia.hidden = true;
        cConteo.textContent = `${cConsecutivo} ${cConsecutivo === 1 ? 'registro' : 'registros'}`;
    }

    function limpiarCita() {
        citaForm.reset();
        $$('[data-field]', citaForm).forEach((b) => { b.classList.remove('is-invalid'); const o = $('.error', b); if (o) o.textContent = ''; });
        citaControls().forEach((c) => { c.setCustomValidity(''); c.removeAttribute('aria-invalid'); });
        cContador.textContent = '0/300';
    }

    citaForm.addEventListener('submit', (e) => {
        e.preventDefault();
        applyCitaRules();
        let bad = null;
        citaControls().forEach((c) => { if (!showFieldState(c) && !bad) bad = c; });
        if (bad) { setCitaAlert('Revisa los campos marcados antes de enviar.'); bad.focus(); return; }

        cConsecutivo++;
        const hoy = new Date();
        const folio = `CT-${hoy.getFullYear()}${pad(hoy.getMonth() + 1)}${pad(hoy.getDate())}-${String(cConsecutivo).padStart(3, '0')}`;
        agregarFilaCita({
            folio,
            cliente: $('#nombreCliente').value.trim(),
            unidad: `${$('#marcaVehiculo').value.trim()} ${$('#modeloVehiculo').value.trim()} ${cAnio.value} · ${cPlacas.value}`,
            servicio: $('#tipoServicio').value,
            sucursal: cSucursal.value,
            fecha: new Date(cFecha.value).toLocaleString('es-MX', { dateStyle: 'long', timeStyle: 'short' })
        });
        limpiarCita();
        setCitaAlert(`Solicitud registrada (simulada) con folio ${folio}. Los datos no se almacenan.`, true);
    });

    $('#btnLimpiarCita').addEventListener('click', () => { limpiarCita(); setCitaAlert(''); });

    /* ======================================================================
       6. MÓDULOS DE PRÁCTICA
       ====================================================================== */

    /* --- 6.1 Visualización de citas --- */
    const radiosCitas = $$('input[name="filtroCitas"]');
    const mes = $('#citasMes'), semana = $('#citasSemana');
    const filasCitas = $$('#tablaCitas tbody tr[data-fecha]');
    const filaVacia = $('#tablaCitas .table-empty');

    function weekRange(value) {               // "2026-W43" -> [lunes, domingo] (UTC)
        const [y, w] = value.split('-W').map(Number);
        const jan4 = new Date(Date.UTC(y, 0, 4));
        const lunes = new Date(jan4);
        lunes.setUTCDate(jan4.getUTCDate() - ((jan4.getUTCDay() || 7) - 1) + (w - 1) * 7);
        const domingo = new Date(lunes);
        domingo.setUTCDate(lunes.getUTCDate() + 6);
        return [lunes, domingo];
    }

    function mostrarCitas() {
        const modo = radiosCitas.find((r) => r.checked).value;
        let n = 0;
        filasCitas.forEach((tr) => {
            const f = new Date(tr.dataset.fecha);          // fecha ISO = UTC
            let visible = false;
            if (modo === 'mes' && mes.value) visible = tr.dataset.fecha.startsWith(mes.value);
            if (modo === 'semana' && semana.value) { const [a, b] = weekRange(semana.value); visible = f >= a && f <= b; }
            tr.hidden = !visible;
            if (visible) tr.firstElementChild.textContent = ++n;
        });
        filaVacia.hidden = n > 0;
        $('#citasConteo').textContent = `${n} ${n === 1 ? 'registro' : 'registros'}`;
        $('#citasNota').textContent = modo === 'mes'
            ? 'Datos de ejemplo para el mes elegido.' : 'Datos de ejemplo para la semana elegida.';
    }

    radiosCitas.forEach((r) => r.addEventListener('change', () => {
        const esMes = radiosCitas.find((x) => x.checked).value === 'mes';
        mes.disabled = !esMes; semana.disabled = esMes;
    }));
    $('#verCitas').addEventListener('click', mostrarCitas);
    mostrarCitas();

    /* --- 6.2 Configuración de la interfaz --- */
    const root = document.documentElement;
    const fontColor = $('#fontColor'), bgColor = $('#backgroundColor');
    fontColor.addEventListener('input', () => root.style.setProperty('--ink', fontColor.value));
    bgColor.addEventListener('input', () => root.style.setProperty('--bg', bgColor.value));
    $('#resetColores').addEventListener('click', () => {
        root.style.removeProperty('--ink'); root.style.removeProperty('--bg');
        fontColor.value = fontColor.defaultValue; bgColor.value = bgColor.defaultValue;
    });

    const vol = $('#soundsVolume'), volOut = $('#volumenValor'), muteBtn = $('#muteSounds');
    let volAnterior = Number(vol.value);
    function renderVolume() {
        volOut.textContent = `${vol.value}%`;
        const mute = Number(vol.value) === 0;
        muteBtn.setAttribute('aria-pressed', String(mute));
        muteBtn.innerHTML = mute
            ? '<i class="ri-volume-up-line" aria-hidden="true"></i> Activar sonidos'
            : '<i class="ri-volume-mute-line" aria-hidden="true"></i> Silenciar sonidos';
    }
    vol.addEventListener('input', () => { if (Number(vol.value) > 0) volAnterior = Number(vol.value); renderVolume(); });
    muteBtn.addEventListener('click', () => {
        if (Number(vol.value) === 0) vol.value = volAnterior || 80;
        else { volAnterior = Number(vol.value); vol.value = 0; }
        renderVolume();
    });

    /* --- 6.3 Foto de perfil (vista previa local) --- */
    const photo = $('#userPhoto'), photoImg = $('#userPhotoImg');
    const photoDefault = photoImg.src;
    let photoUrl = null;
    photo.addEventListener('change', () => {
        const file = photo.files[0];
        const box = photo.closest('[data-field]'), out = $('.error', box);
        if (photoUrl) { URL.revokeObjectURL(photoUrl); photoUrl = null; }
        if (!file) { photoImg.src = photoDefault; return; }
        if (!file.type.startsWith('image/')) {
            out.textContent = 'El archivo debe ser una imagen.'; photo.value = ''; photoImg.src = photoDefault; return;
        }
        out.textContent = '';
        photoUrl = URL.createObjectURL(file);
        photoImg.src = photoUrl;
    });

    /* --- 6.4 Datos fiscales (módulo de práctica) --- */
    const rfc = $('#rfc');
    rfc.addEventListener('input', () => { rfc.value = rfc.value.toUpperCase(); if (rfc.closest('.is-invalid')) showFieldState(rfc); });
    rfc.addEventListener('blur', () => rfc.value && showFieldState(rfc));
    $('#fiscalSituacion').addEventListener('change', (e) => {
        const f = e.target.files[0];
        e.target.setCustomValidity(f && f.type !== 'application/pdf' ? 'El archivo debe ser un PDF.' : '');
        showFieldState(e.target);
    });

    /* --- 6.5 Solicitud de herramientas --- */
    const tbody = $('#tablaTools tbody');
    const toolSel = $('#toolName'), toolQty = $('#toolQuantity');

    const unidad = (u, n) => (n === 1 ? u : `${u}s`);

    function renderTools() {
        let total = 0;
        $$('tr', tbody).forEach((tr, i) => {
            const qty = Number(tr.dataset.qty);
            total += qty;
            const c = tr.children;
            c[0].textContent = i + 1;
            c[3].textContent = qty;
            c[4].textContent = unidad(tr.dataset.unit, qty);
            if (!c[5].firstChild) {
                const b = document.createElement('button');
                b.type = 'button'; b.className = 'row-remove';
                b.setAttribute('aria-label', `Quitar ${c[1].textContent}`);
                b.innerHTML = '<i class="ri-delete-bin-line" aria-hidden="true"></i>';
                c[5].appendChild(b);
            }
        });
        $('#toolsTotal').textContent = total;
    }

    $('#requestTool').addEventListener('click', () => {
        const opt = toolSel.selectedOptions[0];
        let qty = Math.min(10, Math.max(1, parseInt(toolQty.value, 10) || 1));
        toolQty.value = qty;
        const existente = $(`tr[data-key="${opt.value}"]`, tbody);
        if (existente) {
            existente.dataset.qty = Number(existente.dataset.qty) + qty;
        } else {
            const tr = document.createElement('tr');
            tr.dataset.key = opt.value; tr.dataset.qty = qty;
            tr.dataset.unit = opt.dataset.unit; tr.dataset.cat = opt.dataset.cat;
            tr.innerHTML = `<td></td><td></td><td></td><td></td><td></td><td></td>`;
            tr.children[1].textContent = opt.textContent;
            tr.children[2].textContent = opt.dataset.cat;
            tbody.appendChild(tr);
        }
        renderTools();
    });
    tbody.addEventListener('click', (e) => {
        const b = e.target.closest('.row-remove');
        if (b) { b.closest('tr').remove(); renderTools(); }
    });
    renderTools();

    /* ---------- Arranque ---------- */
    document.documentElement.classList.add('js');
    updateAge();
    resetQr();
    showStep(0);
})();