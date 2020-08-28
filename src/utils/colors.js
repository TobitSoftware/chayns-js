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

function rgbToHsl({r, g, b}) {
    const rr = r / 255, gg = g / 255, bb = b / 255;
    const max = Math.max(rr, gg, bb);
    const min = Math.min(rr, gg, bb);
    let h;
    if (max === min) {
        h = 0;
    } else if (max === rr) {
        h = 60 * (0 + ((gg - bb) / (max - min)));
    } else if (max === gg) {
        h = 60 * (2 + ((bb - rr) / (max - min)));
    } else if (max === bb) {
        h = 60 * (4 + ((rr - gg) / (max - min)));
    }
    if (h < 0) {
        h += 360;
    }
    let s;
    if (max === 0 || min === 1) {
        s = 0;
    } else {
        s = ((max - min) / (1 - Math.abs(max + min - 1))) * 100;
    }
    let l = ((max + min) / 2) * 100;
    return {h, s, l};
}

function hslToRgb({h, s, l}) {
    let r, g, b;

    if (s === 0) {
        r = g = b = l / 100 * 255;
    } else {
        let t1;
        if (l < 50) {
            t1 = (l / 100) * (1 + s / 100);
        } else {
            t1 = l / 100 + s / 100 - (l / 100) * (s / 100);
        }
        let t2 = 2 * (l / 100) - t1;
        let hue = h / 360;
        let tR = hue + (1 / 3);
        let tG = hue;
        let tB = hue - (1 / 3);
        let getColor = (t) => {
            if (t < 0) {
                t += 1;
            } else if (t > 1) {
                t -= 1;
            }
            if ((6 * t) < 1) {
                return t2 + (t1 - t2) * 6 * t;
            } else if ((2 * t) < 1) {
                return t1;
            } else if ((3 * t) < 2) {
                return t2 + (t1 - t2) * (2 / 3 - t) * 6;
            }
            return t2;
        };
        r = getColor(tR) * 255;
        g = getColor(tG) * 255;
        b = getColor(tB) * 255;
    }
    return {r, g, b};
}

const specials = {
    'COLOR': -1,
    'BRIGHTNESS': -2,
    'NEW_BRIGHTNESS': -3,
    'BASE400': -4,
    'SECOND400': -5
};
const colorPalette = {
    '0': {
        '000': ['#000000', '#FFFFFF', 0],
        '001': ['#000000', '#FFFFFF', 3],
        '002': ['#000000', '#FFFFFF', 10],
        '003': ['#000000', '#FFFFFF', 25],
        '004': ['#000000', '#FFFFFF', 40],
        '005': ['#000000', '#FFFFFF', 50],
        '006': ['#000000', '#FFFFFF', 60],
        '007': ['#000000', '#FFFFFF', 75],
        '008': ['#000000', '#FFFFFF', 90],
        '009': ['#000000', '#FFFFFF', 100],
        '100': [specials.COLOR, '#FFFFFF', 0],
        '101': [specials.COLOR, '#FFFFFF', 10],
        '102': [specials.COLOR, '#FFFFFF', 20],
        '103': [specials.COLOR, '#FFFFFF', 30],
        '104': [specials.COLOR, '#FFFFFF', 40],
        '105': [specials.COLOR, '#FFFFFF', 50],
        '106': [specials.COLOR, '#FFFFFF', 60],
        '107': [specials.COLOR, '#FFFFFF', 70],
        '108': [specials.COLOR, '#FFFFFF', 80],
        '109': [specials.COLOR, '#FFFFFF', 90],
        '200': [specials.COLOR, '#E4E4E4', 0],
        '201': [specials.COLOR, '#E4E4E4', 10],
        '202': [specials.COLOR, '#E4E4E4', 20],
        '203': [specials.COLOR, '#E4E4E4', 30],
        '204': [specials.COLOR, '#E4E4E4', 40],
        '205': [specials.COLOR, '#E4E4E4', 50],
        '206': [specials.COLOR, '#E4E4E4', 60],
        '207': [specials.COLOR, '#E4E4E4', 70],
        '208': [specials.COLOR, '#E4E4E4', 80],
        '209': [specials.COLOR, '#E4E4E4', 90],
        '300': [specials.COLOR, '#242424', 0],
        '301': [specials.COLOR, '#242424', 10],
        '302': [specials.COLOR, '#242424', 20],
        '303': [specials.COLOR, '#242424', 30],
        '304': [specials.COLOR, '#242424', 40],
        '305': [specials.COLOR, '#242424', 50],
        '306': [specials.COLOR, '#242424', 60],
        '307': [specials.COLOR, '#242424', 70],
        '308': [specials.COLOR, '#242424', 80],
        '309': [specials.COLOR, '#242424', 90],
        '400': [specials.COLOR, '#FFFFFF', 0],
        '401': [specials.COLOR, '#FFFFFF', 10],
        '402': [specials.COLOR, '#FFFFFF', 20],
        '403': [specials.COLOR, '#FFFFFF', 30],
        '404': [specials.COLOR, '#FFFFFF', 40],
        '405': [specials.COLOR, '#FFFFFF', 50],
        '406': [specials.COLOR, '#FFFFFF', 60],
        '407': [specials.COLOR, '#FFFFFF', 70],
        '408': [specials.COLOR, '#FFFFFF', 80],
        '409': [specials.COLOR, '#FFFFFF', 90],
        'primary': [specials.COLOR, '#FFFFFF', 100], // site color
        'headline': [specials.COLOR, '#FFFFFF', 100], // site color
        'text': '#222222',
        'cw-body-background': [specials.COLOR, '#FFFFFF', 10],
        'red': '#976464',
        'green': '#349044',
        'wrong': '#96060B',
        'depend-on-brightness': [specials.COLOR, '#FFFFFF', specials.BRIGHTNESS]
    },
    '1': {
        '000': ['#000000', '#FFFFFF', 100],
        '001': ['#000000', '#FFFFFF', 97],
        '002': ['#000000', '#FFFFFF', 90],
        '003': ['#000000', '#FFFFFF', 75],
        '004': ['#000000', '#FFFFFF', 60],
        '005': ['#000000', '#FFFFFF', 50],
        '006': ['#000000', '#FFFFFF', 40],
        '007': ['#000000', '#FFFFFF', 25],
        '008': ['#000000', '#FFFFFF', 10],
        '009': ['#000000', '#FFFFFF', 0],
        '100': [specials.COLOR, '#2F2F2F', 20],
        '101': [specials.COLOR, '#2F2F2F', 20],
        '102': [specials.COLOR, '#2F2F2F', 30],
        '103': [specials.COLOR, '#2F2F2F', 40],
        '104': [specials.COLOR, '#2F2F2F', 50],
        '105': [specials.COLOR, '#2F2F2F', 60],
        '106': [specials.COLOR, '#2F2F2F', 70],
        '107': [specials.COLOR, '#2F2F2F', 80],
        '108': [specials.COLOR, '#2F2F2F', 90],
        '109': [specials.COLOR, '#2F2F2F', 100],
        '200': [specials.COLOR, '#777777', 0],
        '201': [specials.COLOR, '#777777', 10],
        '202': [specials.COLOR, '#777777', 20],
        '203': [specials.COLOR, '#777777', 30],
        '204': [specials.COLOR, '#777777', 40],
        '205': [specials.COLOR, '#777777', 50],
        '206': [specials.COLOR, '#777777', 60],
        '207': [specials.COLOR, '#777777', 70],
        '208': [specials.COLOR, '#777777', 80],
        '209': [specials.COLOR, '#777777', 90],
        '300': [specials.COLOR, '#242424', 90],
        '301': [specials.COLOR, '#242424', 80],
        '302': [specials.COLOR, '#242424', 70],
        '303': [specials.COLOR, '#242424', 60],
        '304': [specials.COLOR, '#242424', 50],
        '305': [specials.COLOR, '#242424', 40],
        '306': [specials.COLOR, '#242424', 30],
        '307': [specials.COLOR, '#242424', 20],
        '308': [specials.COLOR, '#242424', 10],
        '309': [specials.COLOR, '#242424', 0],
        '400': [specials.BASE400, specials.SECOND400, 20],
        '401': [specials.BASE400, specials.SECOND400, 20],
        '402': [specials.BASE400, specials.SECOND400, 30],
        '403': [specials.BASE400, specials.SECOND400, 40],
        '404': [specials.BASE400, specials.SECOND400, 50],
        '405': [specials.BASE400, specials.SECOND400, 60],
        '406': [specials.BASE400, specials.SECOND400, 70],
        '407': [specials.BASE400, specials.SECOND400, 80],
        '408': [specials.BASE400, specials.SECOND400, 90],
        '409': [specials.BASE400, specials.SECOND400, 100],
        'primary': [specials.COLOR, '#FFFFFF', 100], // site color
        'headline': '#FFFFFF',
        'text': '#FFFFFF',
        'cw-body-background': [specials.COLOR, '#222222', 10],
        'red': '#723F3F',
        'green': '#198B2C',
        'wrong': '#CA8181',
        'depend-on-brightness': [specials.COLOR, '#FFFFFF', specials.NEW_BRIGHTNESS]
    },
    '2': {
        '000': ['#000000', '#FFFFFF', 0],
        '001': ['#000000', '#FFFFFF', 3],
        '002': ['#000000', '#FFFFFF', 10],
        '003': ['#000000', '#FFFFFF', 25],
        '004': ['#000000', '#FFFFFF', 40],
        '005': ['#000000', '#FFFFFF', 50],
        '006': ['#000000', '#FFFFFF', 60],
        '007': ['#000000', '#FFFFFF', 75],
        '008': ['#000000', '#FFFFFF', 90],
        '009': ['#000000', '#FFFFFF', 100],
        '100': [specials.COLOR, '#FFFFFF', 10],
        '101': [specials.COLOR, '#FFFFFF', 10],
        '102': [specials.COLOR, '#FFFFFF', 20],
        '103': [specials.COLOR, '#FFFFFF', 30],
        '104': [specials.COLOR, '#FFFFFF', 40],
        '105': [specials.COLOR, '#FFFFFF', 50],
        '106': [specials.COLOR, '#FFFFFF', 60],
        '107': [specials.COLOR, '#FFFFFF', 70],
        '108': [specials.COLOR, '#FFFFFF', 80],
        '109': [specials.COLOR, '#FFFFFF', 90],
        '200': [specials.COLOR, '#E4E4E4', 0],
        '201': [specials.COLOR, '#E4E4E4', 10],
        '202': [specials.COLOR, '#E4E4E4', 20],
        '203': [specials.COLOR, '#E4E4E4', 30],
        '204': [specials.COLOR, '#E4E4E4', 40],
        '205': [specials.COLOR, '#E4E4E4', 50],
        '206': [specials.COLOR, '#E4E4E4', 60],
        '207': [specials.COLOR, '#E4E4E4', 70],
        '208': [specials.COLOR, '#E4E4E4', 80],
        '209': [specials.COLOR, '#E4E4E4', 90],
        '300': [specials.COLOR, '#242424', 0],
        '301': [specials.COLOR, '#242424', 10],
        '302': [specials.COLOR, '#242424', 20],
        '303': [specials.COLOR, '#242424', 30],
        '304': [specials.COLOR, '#242424', 40],
        '305': [specials.COLOR, '#242424', 50],
        '306': [specials.COLOR, '#242424', 60],
        '307': [specials.COLOR, '#242424', 70],
        '308': [specials.COLOR, '#242424', 80],
        '309': [specials.COLOR, '#242424', 90],
        '400': [specials.COLOR, '#FFFFFF', 10],
        '401': [specials.COLOR, '#FFFFFF', 10],
        '402': [specials.COLOR, '#FFFFFF', 20],
        '403': [specials.COLOR, '#FFFFFF', 30],
        '404': [specials.COLOR, '#FFFFFF', 40],
        '405': [specials.COLOR, '#FFFFFF', 50],
        '406': [specials.COLOR, '#FFFFFF', 60],
        '407': [specials.COLOR, '#FFFFFF', 70],
        '408': [specials.COLOR, '#FFFFFF', 80],
        '409': [specials.COLOR, '#FFFFFF', 90],
        'primary': [specials.COLOR, '#FFFFFF', 100], // site color
        'headline': [specials.COLOR, '#FFFFFF', 100], // site color
        'text': '#222222',
        'cw-body-background': '#FFFFFF',
        'red': '#976464',
        'green': '#349044',
        'wrong': '#96060B',
        'depend-on-brightness': [specials.COLOR, '#FFFFFF', specials.BRIGHTNESS]
    }
};

export function getAvailableColorList() {
    return Object.keys(colorPalette[0]);
}

function getColorBrightness(color, newCalculation) {
    const rgb = hexToRgb(color);

    const brightnessRgb = Math.max(rgb.r, rgb.g, rgb.b);

    let brightness;
    if (newCalculation) {
        const max = Math.max(rgb.r, rgb.g, rgb.b);
        let min = Math.min(rgb.r, rgb.g, rgb.b);
        brightness = (((max + min) / 2) / 255) * 100;
    } else if (brightnessRgb < 64) {
        brightness = 40;
    } else if (brightnessRgb < 128) {
        brightness = 60;
    } else if (brightnessRgb < 192) {
        brightness = 80;
    } else {
        brightness = 100;
    }

    return brightness;
}

function roundValues(obj) {
    const retObj = {};
    for (let key of Object.keys(obj)) {
        retObj[key] = Math.round(obj[key]);
    }
    return retObj;
}

function lightenColor(hex, percent) {
    const rgb = hexToRgb(hex);
    const hsl = rgbToHsl(rgb);
    hsl.l += percent;
    if (hsl.l > 100) {
        hsl.l = 100;
    }
    const newRgb = roundValues(hslToRgb(hsl));
    return rgbToHex(newRgb.r, newRgb.g, newRgb.b);
}

function darkenColor(color, percent) {
    return lightenColor(color, percent * -1);
}

export function getColorFromPalette(colorId, color = environment.site.color, colorMode = environment.site.colorMode) {
    const colorData = JSON.parse(JSON.stringify(colorPalette[colorMode][colorId])); // copy array

    const colorIndex = colorData.indexOf(specials.COLOR);
    if (colorIndex >= 0) {
        colorData[colorIndex] = color;
    }
    const brightnessIndex = colorData.indexOf(specials.BRIGHTNESS);
    if (brightnessIndex >= 0) {
        colorData[brightnessIndex] = getColorBrightness(color, false);
    }
    const newBrightnessIndex = colorData.indexOf(specials.NEW_BRIGHTNESS);
    if (newBrightnessIndex >= 0) {
        colorData[newBrightnessIndex] = getColorBrightness(color, true);
    }
    const base400Index = colorData.indexOf(specials.BASE400);
    if (base400Index >= 0) {
        const brightness = getColorBrightness(color);
        if (brightness < 50) {
            colorData[base400Index] = lightenColor(color, (brightness * -1 + 100) * 0.5);
        } else {
            colorData[base400Index] = color;
        }
    }
    const second400Index = colorData.indexOf(specials.SECOND400);
    if (second400Index >= 0) {
        const brightness = getColorBrightness(color);
        if (brightness < 50) {
            colorData[second400Index] = darkenColor('#2F2F2F', (brightness * -1 + 100) * 0.1);
        } else {
            colorData[second400Index] = '#2F2F2F';
        }
    }

    if (isArray(colorData)) {
        if (colorData.length === 2) {
            return mix(color, colorData[0], colorData[1]);
        } else if (colorData.length === 3) {
            return mix(colorData[0], colorData[1], colorData[2]);
        }
    }
    return colorData;
}
