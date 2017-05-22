import { isHex } from '../utils/is';


export function mixColor(color1, color2, weight = 100) {
    if(isHex(color1) && isHex(color2)) {
        weight = weight / 100;
        const rgbColor1 = hexToRgb(color1);
        const rgbColor2 = hexToRgb(color2);

        const weightColor2 = 1 - weight;

        const r = weight * rgbColor1.r + weightColor2 * rgbColor2.r;
        const g = weight * rgbColor1.g + weightColor2 * rgbColor2.g;
        const b = weight * rgbColor1.b + weightColor2 * rgbColor2.b;

        return rgbToHex(Math.round(r), Math.round(g), Math.round(b));
    }
    return color1;
}


function hexToRgb(hex) {
    if(hex.charAt(0) === '#') {
        hex = hex.substring(1, 7);
    }

    const r = parseInt(hex.substring(0, 2), 16);
    const g = parseInt(hex.substring(2, 4), 16);
    const b = parseInt(hex.substring(4, 6), 16);

    return {
        r,
        g,
        b
    };

}

function rgbToHex(r, g, b) {
    return `#${toHex(r)}${toHex(g)}${toHex(b)}`;
}

function toHex(n) {
    n = parseInt(n, 10);
    if (isNaN(n)) return '00';

    if(n < 0) n = 0;
    if(n > 255) n = 255;

    if(n < 16) {
        return '0' + n.toString(16);
    }
    return n.toString(16);
}
