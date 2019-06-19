import {isString} from './is';
import {environment, setEnv} from '../chayns/environment';
import {getGlobalData} from '../chayns/calls';

/**
 * Decodes a utf 8 text
 *
 * @param {string} utfText Utf encoded text
 * @returns {string} Decoded Text
 */
function decodeUtf8(utfText) {
    let result = '',
        i = 0, c = 0, c1 = 0, c2 = 0;

    while (i < utfText.length) {
        c = utfText.charCodeAt(i);
        if (c < 128) {
            result += String.fromCharCode(c);
            i++;
        } else if (c > 191 && c < 224) {
            c1 = utfText.charCodeAt(i + 1);
            result += String.fromCharCode(((c & 31) << 6) | (c1 & 63));
            i += 2;
        } else {
            c1 = utfText.charCodeAt(i + 1);
            c2 = utfText.charCodeAt(i + 2);
            result += String.fromCharCode(((c & 15) << 12) | ((c1 & 63) << 6) | (c2 & 63));
            i += 3;
        }
    }

    return result;
}

/**
 * Returns the JWT payload as JSON.
 *
 * @param {string} tobitAccessToken Tobit Access Token.
 * @returns {{} | *} Json object
 */
export function getJwtPayload(tobitAccessToken) {
    if (tobitAccessToken && isString(tobitAccessToken) && tobitAccessToken.length > 0) {
        const spl = tobitAccessToken.split('.');
        if (spl && spl.length === 3) {
            try {
                spl[1] = spl[1].replace(/-/g, '+').replace(/_/g, '/');
                return JSON.parse(decodeUtf8(atob(spl[1])));
            } catch (e) {
                return null;
            }
        }
    }
    return null;
}

export const createTappUrl = (url, {
    tappId = environment.site.tapp.id,
    appVersion = environment.appVersion,
    os = environment.os,
    color = environment.parameters.color,
    colorMode = environment.site.colorMode,
    font = environment.site.font
} = {}) => `${url}?AppVersion=${appVersion}&OS=${os}&font=${font}&color=${color}&colormode=${colorMode}&TappID=${tappId}`;

/**
 * This function reset chayns.env, we need to update the environment when a tapp is displayed in a div inside the chaynsWeb.
 * The function will ask for new data with getGlobalData, setup the environment like chayns.ready an return the received data.
 * @return {Promise} Returns the getGlobalData object with AppUser, AppInfo and Device
 */
export function resetEnvironment(params) {
    const INTERNAL_PARAMETERS = [
        'appversion',
        'os',
        'tappid'
    ];
    return getGlobalData(true).then((res) => {
        chayns.env = environment;
        if (params) {
            const paramKeys = Object.keys(params);
            for (let i = 0; i < paramKeys.length; i++) {
                res._parameters[paramKeys[i]] = params[paramKeys[i]];
                if (INTERNAL_PARAMETERS.indexOf(params[paramKeys[i]].toLowerCase()) === -1) {
                    res.parameters[paramKeys[i]] = params[paramKeys[i]];
                }
            }
        }
        setEnv(res);
        return res;
    });
}
