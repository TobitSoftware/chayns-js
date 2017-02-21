import { isString, isArray } from './is';
import { environment } from '../chayns/environment';

/**
 * Removes whitespaces.
 *
 * @param {string} value Reference to check.
 * @returns {String} Trimmed  value
 */
export function trim(value) {
	return isString(value) ? value.replace(/^\s+|\s+$/g, '') : value;
}

/**
 * Returns the string with replaced placeholders
 *
 * @param {string} text Text with placeholders
 * @param {[{}]} replacements Placeholder object
 * @returns {string} The text with replaced placeholders
 */
export function replacePlaceholder(text, replacements) {
	if (!isArray(replacements)) {
		replacements = [replacements];
	}

	for (let i = 0, l = replacements.length; i < l; i++) {
		const regex = new RegExp(`##${replacements[i].key}##`, 'g');
		text = text.replace(regex, replacements[i].value);
	}

	return text;
}

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

/**
 * A more basic implementation of the modulo function.
 *
 * @param {number} number Number
 * @param {number} modulo Modulo
 * @returns {number} Result
 */
export function mod(number, modulo) {
	let remain = number % modulo;

	if (remain === -0) {
		remain = 0;
	}

	return remain >= 0 ? remain : remain + modulo;
}

export const createTappUrl = (
	url,
	{
		tappId = chayns.env.site.tapp.id,
		appVersion = chayns.env.appVersion,
		os = chayns.env.os,
		color = chayns.env.parameters.color,
		colorMode = chayns.env.site.colorMode,
		font = environment.site.font
	} = {}
) => `${url}?AppVersion=${appVersion}&OS=${os}&font=${font}&color=${color}&colormode=${colorMode}&TappID=${tappId}`;

