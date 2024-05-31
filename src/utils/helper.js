import {isString} from './is';
import {environment, setEnv} from '../chayns/environment';
import {getGlobalData} from '../chayns/calls';

/**
 * Decodes base64 to utf 8 text
 *
 * @param {string} base64 Utf encoded base64
 * @returns {string} Decoded Text
 */
function decodeBase64(base64) {
    const text = atob(base64);
    const length = text.length;
    const bytes = new Uint8Array(length);
    for (let i = 0; i < length; i++) {
        bytes[i] = text.charCodeAt(i);
    }
    const decoder = new TextDecoder(); // default is utf-8
    return decoder.decode(bytes);
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
                return JSON.parse(decodeBase64(spl[1]));
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
    return getGlobalData().then((res) => {
        chayns.env = environment;
        if (params) {
            const paramKeys = Object.keys(params);
            if(!res._parameters) {
                res._parameters = {};
            }
            if(!res.parameters) {
                res.parameters = {};
            }
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
