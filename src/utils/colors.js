import {environment} from '../chayns/environment';
import {isNumber} from './is';
import {
    getAvailableColorList,
    getColorFromPalette as getColorFromPaletteNpm,
    normalizeHexString,
    mixHex,
    hexToRgb255, isHex
} from '@chayns/colors';

function get(saturation, color) {
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

function mix(color1, color2, weight = 100) {
    if (!isHex(color1) || !isHex(color2)) {
        return color1;
    }

    return mixHex(color1, color2, weight);
}

function hexToRgb(hex) {
    return hexToRgb255(normalizeHexString(hex));
}

function getColorFromPalette(colorId, colorParameter, colorModeParameter) {
    const color = colorParameter ? colorParameter : environment.site.color;
    const colorMode = colorModeParameter ? colorModeParameter : environment.site.colorMode;

    if (!colorParameter && !isNumber(colorModeParameter)) {
        const returnColor = normalizeHexString(getComputedStyle(document.documentElement).getPropertyValue(`--chayns-color--${colorId}`).trim());
        if (returnColor) {
            return returnColor;
        }
    }

    let secondaryColor = color;
    if (environment.site.id === '60021-08989' && ((environment.isIOS && environment.appVersion >= 6260) || (environment.isAndroid && environment.appVersion >= 6338))) {
        secondaryColor = '#8e8e93';
    }

    return getColorFromPaletteNpm(colorId, {color, colorMode, secondaryColor});
}

export {getAvailableColorList, getColorFromPalette, mix, hexToRgb, get};
