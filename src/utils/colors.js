import {environment} from '../chayns/environment';
import {isHex, isArray} from './is';

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

const colorPalette = {
    '0': {
        '100': ['#FFFFFF', 0],
        '101': ['#FFFFFF', 10],
        '102': ['#FFFFFF', 20],
        '103': ['#FFFFFF', 30],
        '104': ['#FFFFFF', 40],
        '105': ['#FFFFFF', 50],
        '106': ['#FFFFFF', 60],
        '107': ['#FFFFFF', 70],
        '108': ['#FFFFFF', 80],
        '109': ['#FFFFFF', 90],
        '200': ['#E4E4E4', 0],
        '201': ['#E4E4E4', 10],
        '202': ['#E4E4E4', 20],
        '203': ['#E4E4E4', 30],
        '204': ['#E4E4E4', 40],
        '205': ['#E4E4E4', 50],
        '206': ['#E4E4E4', 60],
        '207': ['#E4E4E4', 70],
        '208': ['#E4E4E4', 80],
        '209': ['#E4E4E4', 90],
        '300': ['#242424', 0],
        '301': ['#242424', 10],
        '302': ['#242424', 20],
        '303': ['#242424', 30],
        '304': ['#242424', 40],
        '305': ['#242424', 50],
        '306': ['#242424', 60],
        '307': ['#242424', 70],
        '308': ['#242424', 80],
        '309': ['#242424', 90],
        'primary': ['#FFFFFF', 100], // site color
        'headline': ['#FFFFFF', 100], // site color
        'text': '#222222',
        'grey': '#888888',
        'red-1': '#5a0303',
        'red-2': '#96060b',
        'red-3': '#ca8181',
        'red-4': '#e9cccc',
        'yellow-1': '#9F5F00',
        'yellow-2': '#FF9800',
        'yellow-3': '#FFB74D',
        'yellow-4': '#FFF3E0',
        'green-1': '#074709',
        'green-2': '#0e7710',
        'green-3': '#85ba87',
        'green-4': '#cde3ce'
    },
    '1': {
        '100': ['#2F2F2F', 20],
        '101': ['#2F2F2F', 20],
        '102': ['#2F2F2F', 30],
        '103': ['#2F2F2F', 40],
        '104': ['#2F2F2F', 50],
        '105': ['#2F2F2F', 60],
        '106': ['#2F2F2F', 70],
        '107': ['#2F2F2F', 80],
        '108': ['#2F2F2F', 90],
        '109': ['#2F2F2F', 100],
        '200': ['#777777', 0],
        '201': ['#777777', 10],
        '202': ['#777777', 20],
        '203': ['#777777', 30],
        '204': ['#777777', 40],
        '205': ['#777777', 50],
        '206': ['#777777', 60],
        '207': ['#777777', 70],
        '208': ['#777777', 80],
        '209': ['#777777', 90],
        '300': ['#242424', 90],
        '301': ['#242424', 80],
        '302': ['#242424', 70],
        '303': ['#242424', 60],
        '304': ['#242424', 50],
        '305': ['#242424', 40],
        '306': ['#242424', 30],
        '307': ['#242424', 20],
        '308': ['#242424', 10],
        '309': ['#242424', 0],
        'primary': ['#FFFFFF', 100], // site color
        'headline': '#ffffff',
        'text': '#ffffff',
        'grey': '#888888',
        'red-1': '#5a0303',
        'red-2': '#96060b',
        'red-3': '#ca8181',
        'red-4': '#e9cccc',
        'yellow-1': '#9F5F00',
        'yellow-2': '#FF9800',
        'yellow-3': '#FFB74D',
        'yellow-4': '#FFF3E0',
        'green-1': '#074709',
        'green-2': '#0e7710',
        'green-3': '#85ba87',
        'green-4': '#cde3ce'
    },
    '2': {
        '100': ['#FFFFFF', 10],
        '101': ['#FFFFFF', 10],
        '102': ['#FFFFFF', 20],
        '103': ['#FFFFFF', 30],
        '104': ['#FFFFFF', 40],
        '105': ['#FFFFFF', 50],
        '106': ['#FFFFFF', 60],
        '107': ['#FFFFFF', 70],
        '108': ['#FFFFFF', 80],
        '109': ['#FFFFFF', 90],
        '200': ['#E4E4E4', 0],
        '201': ['#E4E4E4', 10],
        '202': ['#E4E4E4', 20],
        '203': ['#E4E4E4', 30],
        '204': ['#E4E4E4', 40],
        '205': ['#E4E4E4', 50],
        '206': ['#E4E4E4', 60],
        '207': ['#E4E4E4', 70],
        '208': ['#E4E4E4', 80],
        '209': ['#E4E4E4', 90],
        '300': ['#242424', 0],
        '301': ['#242424', 10],
        '302': ['#242424', 20],
        '303': ['#242424', 30],
        '304': ['#242424', 40],
        '305': ['#242424', 50],
        '306': ['#242424', 60],
        '307': ['#242424', 70],
        '308': ['#242424', 80],
        '309': ['#242424', 90],
        'primary': ['#FFFFFF', 100], // site color
        'headline': ['#FFFFFF', 100], // site color
        'text': '#222222',
        'grey': '#888888',
        'red-1': '#5a0303',
        'red-2': '#96060b',
        'red-3': '#ca8181',
        'red-4': '#e9cccc',
        'yellow-1': '#9F5F00',
        'yellow-2': '#FF9800',
        'yellow-3': '#FFB74D',
        'yellow-4': '#FFF3E0',
        'green-1': '#074709',
        'green-2': '#0e7710',
        'green-3': '#85ba87',
        'green-4': '#cde3ce'
    }

};

export function getColorFromPalette(colorId) {
    const colorData = colorPalette[environment.site.colorMode][colorId];
    if (isArray(colorData)) {
        return mix(chayns.env.site.color, colorData[0], colorData[1]);
    }
    return colorData;
}
