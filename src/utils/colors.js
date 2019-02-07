import {environment} from '../chayns/environment';
import {isHex} from './is';

export function get(saturation, color) {
    color = color || environment.site.color;

    if (saturation > 0 && saturation < 100) {
        saturation = 1 - (saturation / 100);

        const rgb = color.match(/[0-9A-F]{2}/gi);
        let retColor = '#';

        for (let i = 0, l = rgb.length; i < l; i++) {
            let colorPart = parseInt(rgb[i], 16);
            colorPart += Math.floor((255 - colorPart) * saturation);

            retColor += colorPart.toString(16);
        }

        return retColor;
    }

    return color;
}

export function mix(color1, color2, weight = 100) {
    if (!isHex(color1) || !isHex(color2)) {
        return color1;
    }

    weight /= 100;
    const rgbColor1 = hexToRgb(color1);
    const rgbColor2 = hexToRgb(color2);

    const weightColor2 = 1 - weight;

    const r = weight * rgbColor1.r + weightColor2 * rgbColor2.r;
    const g = weight * rgbColor1.g + weightColor2 * rgbColor2.g;
    const b = weight * rgbColor1.b + weightColor2 * rgbColor2.b;

    return rgbToHex(Math.round(r), Math.round(g), Math.round(b));
}

function hexToRgb(hex) {
    if (hex.charAt(0) === '#') {
        hex = hex.substring(1);
    }

    let r, g, b;
    if (hex.length === 3) {
        r = parseInt(hex.substring(0, 1) + hex.substring(0, 1), 16);
        g = parseInt(hex.substring(1, 2) + hex.substring(1, 2), 16);
        b = parseInt(hex.substring(2, 3) + hex.substring(2, 3), 16);
    } else {
        r = parseInt(hex.substring(0, 2), 16);
        g = parseInt(hex.substring(2, 4), 16);
        b = parseInt(hex.substring(4, 6), 16);
    }


    return {r, g, b};

}

function rgbToHex(r, g, b) {
    return `#${toHex(r)}${toHex(g)}${toHex(b)}`;
}

function toHex(n) {
    n = parseInt(n, 10);
    if (isNaN(n)) {
        return '00';
    }

    if (n < 0) {
        n = 0;
    } else if (n > 255) {
        n = 255;
    }

    if (n < 16) {
        return '0' + n.toString(16);
    }

    return n.toString(16);
}
