document.addEventListener('DOMContentLoaded', function() {
    // Agregar manejo del loader
    const loader = document.querySelector('.loader-container');
    
    // Función para ocultar el loader
    function hideLoader() {
        loader.classList.add('hidden');
        setTimeout(() => {
            loader.style.display = 'none';
        }, 500); // Esperar a que termine la transición
    }

    // Ocultar loader cuando la página esté completamente cargada
    window.addEventListener('load', function() {
        // Se asegura que el loader permanezca visible por un poco más de tiempo
        setTimeout(hideLoader, 2000); // Retraso de 2000ms antes de ejecutar hideLoader
    });

    const generateButton = document.getElementById('generateButton');
    const baseColorInput = document.getElementById('baseColor');
    const paletteTypeSelect = document.getElementById('paletteType');
    const colorSquares = document.querySelectorAll('.color-square');
    const heptagon = document.getElementById('heptagon');
    const toggleThemeButton = document.getElementById('toggleTheme');

    // Configurar eventos iniciales
    generateButton.addEventListener('click', generatePalette);
    toggleThemeButton.addEventListener('click', () => {
        document.body.classList.toggle('dark-mode');
        document.body.classList.toggle('light-mode');
    });

    // Función auxiliar para obtener un número aleatorio dentro de un rango
    function randomInRange(min, max) {
        return Math.floor(Math.random() * (max - min + 1)) + min;
    }

    // Función para variar ligeramente un valor HSL manteniendo límites seguros
    function varyHSL(value, range, min = 0, max = 100) {
        const variation = (Math.random() - 0.5) * 2 * range;
        return Math.max(min, Math.min(max, value + variation));
    }

    // Función principal para generar la paleta
    function generatePalette() {
        const baseColor = baseColorInput.value;
        const paletteType = paletteTypeSelect.value;
        const colors = generateColors(baseColor, paletteType);

        updateColorSquares(colors);
        updateHeptagon(colors);
    }

    // Funciones de generación de colores
    function generateColors(baseColor, paletteType) {
        const hsl = hexToHSL(baseColor);

        switch (paletteType) {
            case 'complementary':
                return generateComplementaryColors(hsl);
            case 'triadic':
                return generateTriadicColors(hsl);
            case 'analogous':
                return generateAnalogousColors(hsl);
            case 'pastel':
                return generatePastelColors(hsl);
            default:
                return [baseColor, baseColor, baseColor, baseColor];
        }
    }

    function generateComplementaryColors(hsl) {
        // Calculamos el complementario con una ligera variación
        const complementHue = (hsl.h + 180 + randomInRange(-10, 10)) % 360;
        
        // Variamos la saturación y luminosidad para cada color
        return [
            // Color base con ligeras variaciones
            hslToHex(
                hsl.h,
                varyHSL(hsl.s, 10),
                varyHSL(hsl.l, 10)
            ),
            // Complementario
            hslToHex(
                complementHue,
                varyHSL(hsl.s, 15),
                varyHSL(hsl.l, 15)
            ),
            // Variación del color base
            hslToHex(
                (hsl.h + randomInRange(-15, 15) + 360) % 360,
                varyHSL(hsl.s, 20),
                varyHSL(hsl.l + 20, 10, 0, 100)
            ),
            // Variación del complementario
            hslToHex(
                (complementHue + randomInRange(-15, 15) + 360) % 360,
                varyHSL(hsl.s, 20),
                varyHSL(hsl.l - 20, 10, 0, 100)
            )
        ];
    }

    function generateTriadicColors(hsl) {
        // Añadimos pequeñas variaciones a los ángulos triádicos
        const triad1 = (hsl.h + 120 + randomInRange(-10, 10)) % 360;
        const triad2 = (hsl.h + 240 + randomInRange(-10, 10)) % 360;

        return [
            hslToHex(
                hsl.h,
                varyHSL(hsl.s, 15),
                varyHSL(hsl.l, 10)
            ),
            hslToHex(
                triad1,
                varyHSL(hsl.s, 15),
                varyHSL(hsl.l, 10)
            ),
            hslToHex(
                triad2,
                varyHSL(hsl.s, 15),
                varyHSL(hsl.l, 10)
            ),
            // Color adicional basado en una mezcla de los tres
            hslToHex(
                (hsl.h + randomInRange(0, 360)) % 360,
                varyHSL(hsl.s - 20, 10),
                varyHSL(hsl.l - 15, 10)
            )
        ];
    }

    function generateAnalogousColors(hsl) {
        // Variamos los ángulos para los colores análogos
        const angle1 = randomInRange(20, 40);
        const angle2 = randomInRange(40, 60);
        const angle3 = randomInRange(-30, -20);

        return [
            hslToHex(
                hsl.h,
                varyHSL(hsl.s, 10),
                varyHSL(hsl.l, 10)
            ),
            hslToHex(
                (hsl.h + angle1) % 360,
                varyHSL(hsl.s, 15),
                varyHSL(hsl.l, 10)
            ),
            hslToHex(
                (hsl.h + angle2) % 360,
                varyHSL(hsl.s, 20),
                varyHSL(hsl.l, 15)
            ),
            hslToHex(
                (hsl.h + angle3 + 360) % 360,
                varyHSL(hsl.s, 15),
                varyHSL(hsl.l, 10)
            )
        ];
    }

    function generatePastelColors(hsl) {
        // Generamos variaciones más aleatorias para los pasteles
        const hueShifts = [
            0,
            randomInRange(60, 120),
            randomInRange(180, 240),
            randomInRange(270, 330)
        ];

        return hueShifts.map(shift => {
            const newHue = (hsl.h + shift) % 360;
            // Los pasteles tienen alta luminosidad y baja saturación
            return hslToHex(
                newHue,
                varyHSL(70, 15, 50, 85), // Saturación variable pero suave
                varyHSL(85, 10, 75, 95)  // Luminosidad alta pero variable
            );
        });
    }

    // Funciones de actualización de UI con animaciones
    function updateColorSquares(colors) {
        colorSquares.forEach((square, index) => {
            square.classList.remove('visible');
            setTimeout(() => {
                square.style.backgroundColor = colors[index];
                square.classList.add('visible');
                
                // Limpiar eventos anteriores para evitar duplicados
                square.removeEventListener('click', createRippleEffect);
                square.addEventListener('click', createRippleEffect);
            }, 150 * index);
        });
    }

    function updateHeptagon(colors) {
        heptagon.style.background = `conic-gradient(
            ${colors[0]} 0deg,
            ${colors[1]} 51deg,
            ${colors[2]} 102deg,
            ${colors[3]} 153deg,
            ${colors[0]} 204deg,
            ${colors[1]} 255deg,
            ${colors[2]} 306deg,
            ${colors[3]} 357deg
        )`;
        
        // Animación de pulso
        heptagon.animate([
            { transform: 'scale(1) rotate(0deg)' },
            { transform: 'scale(1.05) rotate(180deg)' },
            { transform: 'scale(1) rotate(360deg)' }
        ], {
            duration: 2000,
            easing: 'ease-in-out'
        });
    }

    // Efectos visuales y animaciones
    function createRippleEffect(event) {
        const square = event.currentTarget;
        const ripple = document.createElement('div');
        const rect = square.getBoundingClientRect();
        
        ripple.style.cssText = `
            position: absolute;
            background: rgba(255,255,255,0.7);
            border-radius: 50%;
            pointer-events: none;
            width: 100px;
            height: 100px;
            transform: translate(-50%, -50%) scale(0);
        `;
        
        ripple.style.left = event.clientX - rect.left + 'px';
        ripple.style.top = event.clientY - rect.top + 'px';
        
        square.appendChild(ripple);
        
        ripple.animate([
            { transform: 'translate(-50%, -50%) scale(0)', opacity: 1 },
            { transform: 'translate(-50%, -50%) scale(4)', opacity: 0 }
        ], {
            duration: 600,
            easing: 'ease-out'
        }).onfinish = () => ripple.remove();

        // Copiar color y mostrar notificación
        const color = square.style.backgroundColor;
        const cmyk = rgbToCMYK(color);
        navigator.clipboard.writeText(cmyk);
        showNotification(`¡Color copiado! ${cmyk}`);
    }

    // Sistema de notificaciones
    function showNotification(message) {
        // Eliminar notificaciones anteriores
        const existingNotifications = document.querySelectorAll('.notification');
        existingNotifications.forEach(notification => notification.remove());

        const notification = document.createElement('div');
        notification.className = 'notification';
        notification.textContent = message;
        
        document.body.appendChild(notification);
        
        // Forzar un reflow para que la transición funcione
        notification.offsetHeight;
        
        requestAnimationFrame(() => {
            notification.classList.add('show');
        });

        setTimeout(() => {
            notification.classList.remove('show');
            setTimeout(() => notification.remove(), 300);
        }, 3000);
    }

    // Funciones de conversión de colores
    function hexToHSL(hex) {
        let r = 0, g = 0, b = 0;
        if (hex.length === 4) {
            r = parseInt(hex[1] + hex[1], 16);
            g = parseInt(hex[2] + hex[2], 16);
            b = parseInt(hex[3] + hex[3], 16);
        } else if (hex.length === 7) {
            r = parseInt(hex.slice(1, 3), 16);
            g = parseInt(hex.slice(3, 5), 16);
            b = parseInt(hex.slice(5, 7), 16);
        }
        r /= 255;
        g /= 255;
        b /= 255;
        const max = Math.max(r, g, b), min = Math.min(r, g, b);
        let h, s, l = (max + min) / 2;

        if (max === min) {
            h = s = 0;
        } else {
            const d = max - min;
            s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
            switch (max) {
                case r: h = (g - b) / d + (g < b ? 6 : 0); break;
                case g: h = (b - r) / d + 2; break;
                case b: h = (r - g) / d + 4; break;
            }
            h /= 6;
        }

        return { h: Math.round(h * 360), s: Math.round(s * 100), l: Math.round(l * 100) };
    }

    function hslToHex(h, s, l) {
        l /= 100;
        const a = s * Math.min(l, 1 - l) / 100;
        const f = n => {
            const k = (n + h / 30) % 12;
            const color = l - a * Math.max(Math.min(k - 3, 9 - k, 1), -1);
            return Math.round(255 * color).toString(16).padStart(2, '0');
        };
        return `#${f(0)}${f(8)}${f(4)}`;
    }

    function rgbToCMYK(rgb) {
        const result = rgb.match(/\d+/g);
        let r = parseInt(result[0]) / 255,
            g = parseInt(result[1]) / 255,
            b = parseInt(result[2]) / 255;

        let k = 1 - Math.max(r, g, b);
        let c = (1 - r - k) / (1 - k) || 0;
        let m = (1 - g - k) / (1 - k) || 0;
        let y = (1 - b - k) / (1 - k) || 0;

        return `CMYK(${Math.round(c * 100)}, ${Math.round(m * 100)}, ${Math.round(y * 100)}, ${Math.round(k * 100)})`;
    }

    // Generar paleta inicial
    generatePalette();
});