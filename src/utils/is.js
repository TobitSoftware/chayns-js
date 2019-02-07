import {getJwtPayload} from './helper';

/**
 * Determines if a reference is defined.
 *
 * @param {*} value Reference to check.
 * @returns {boolean} True if `value` is defined.
 */
export function isDefined(value) {
    return typeof value !== 'undefined';
}

/**
 * Determines if a reference is undefined.
 *
 * @param {*} value Reference to check.
 * @returns {boolean} True if `value` is undefined.
 */
export function isUndefined(value) {
    return typeof value === 'undefined';
}

/**
 * Determines if a reference is neither undefined nor null.
 *
 * @param {*} value Reference to check.
 * @returns {boolean} True if `value` is present.
 */
export function isPresent(value) {
    return typeof value !== 'undefined' && value !== null;
}

/**
 * Determines if a reference is either undefined or null.
 *
 * @param {*} value Reference to check.
 * @returns {boolean} True if `value` is blank.
 */
export function isBlank(value) {
    return typeof value === 'undefined' || value === null;
}

/**
 * Determines if a reference is a `String`.
 *
 * @param {*} value Reference to check.
 * @returns {boolean} True if `value` is a `String`.
 */
export function isString(value) {
    return typeof value === 'string';
}

/**
 * Determines if a reference is a `Number`.
 *
 * @param {*} value Reference to check.
 * @returns {boolean} True if `value` is a `Number`.
 */
export function isNumber(value) {
    return typeof value === 'number' && !isNaN(value);
}

/**
 * Determines if a reference is an `Object`.
 * null is not treated as an object.
 * In JS arrays are objects
 *
 * @param {*} value Reference to check.
 * @returns {boolean} True if `value` is an `Object`.
 */
export function isObject(value) {
    return value !== null && typeof value === 'object';
}

/**
 * Determines if a reference is an `Array`.
 *
 * @param {*} value Reference to check.
 * @returns {boolean} True if `value` is an `Array`.
 */
export function isArray(value) {
    return Array.isArray(value);
}

/**
 * Determines if a reference is a `boolean`.
 *
 * @param {*} value Reference to check.
 * @returns {boolean} True if `value` is a `boolean`.
 */
export function isBoolean(value) {
    return typeof value === 'boolean';
}

/**
 * Determines if a reference is a `Function`.
 *
 * @param {*} value Reference to check.
 * @returns {boolean} True if `value` is a `Function`.
 */
export function isFunction(value) {
    return typeof value === 'function';
}

/**
 * Determines if a value is a date.
 *
 * @param {*} value Reference to check.
 * @returns {boolean} True if `value` is a `Date`.
 */
export function isDate(value) {
    return Object.prototype.toString.call(value) === '[object Date]';
}

/**
 * Determines if a reference is promise like.
 *
 * @param {*} value Reference to check.
 * @returns {boolean} Returns true if `ob` is a promise or promise-like object.
 */
export function isPromise(value) {
    return value && isFunction(value.then);
}

/**
 * Determines if a reference is deferred like.
 *
 * @param {*} value Reference to check.
 * @returns {boolean} Returns true if `ob` is a promise or deferred-like object.
 */
export function isDeferred(value) {
    return isObject(value) && isFunction(value.resolve) && isFunction(value.reject);
}

/**
 * Determines if a reference is a `UUID` (OSF).
 *
 * @param {*} value Reference to check.
 * @returns {boolean} True if `value` is a `UUID`.
 */
export function isUUID(value) {
    if (isString(value)) {
        return value.trim().match(/^[0-9a-f]{4}([0-9a-f]{4}-){4}[0-9a-z]{12}$/i) !== null;
    }

    return false;
}

/**
 * Determines if a reference is a `GUID` (Microsoft Standard).
 * Is an alias to isUUID
 *
 * @param {*} value Reference to check.
 * @returns {boolean} True if `value` is a `GUID`.
 */
export function isGUID(value) {
    return isUUID(value);
}

/**
 * Determines if a reference is a `MAC Address`.
 *
 * @param {*} value Reference to check.
 * @returns {boolean} True if `value` is a `MAC Address`.
 */
export function isMacAddress(value) {
    if (isString(value)) {
        return value.trim().match(/^([0-9a-f]{2}[-:]){5}[0-9a-f]{2}$/i) !== null;
    }
    return false;
}

/**
 * Determines if a reference is a `BLE Address`
 *
 * @param {*} value Reference to check.
 * @returns {boolean} True if `value` is a `BLE Address`.
 */
export function isBLEAddress(value) {
    return isUUID(value) || isMacAddress(value);
}

/**
 * Determines if a reference is a FormData `Object`.
 *
 * @param {*} value Reference to check.
 * @returns {boolean} True if `obj` is a `FormData` Object.
 */
export function isFormData(value) {
    return toString.call(value) === '[object FormData]';
}

/**
 * Determines if a reference is a FormElement.
 *
 * @param {*} value Reference to check.
 * @returns {boolean} True if `obj` is a `HTMLFormElement`.
 */
export function isFormElement(value) {
    return toString.call(value) === '[object HTMLFormElement]';
}

/**
 * Determines if a reference is JWT like.
 *
 * @param {*} value Reference to check.
 * @returns {boolean} True if `value` is a `JWT`.
 */
export function isJwt(value) {
    return !!getJwtPayload(value);
}

/**
 * Determines if a string is a url
 *
 * @param {*} url url to check
 * @returns {boolean} True if value is a Url.
 */
export function isUrl(url) {
    return url && isString(url) && (/((([A-Za-z]{2,9}:(?:\/\/)?)(?:[-;:&=+$,\w]+@)?[A-Za-z0-9.-]+|(?:www.|[-;:&=+$,\w]+@)[A-Za-z0-9.-]+)((?:\/[+~%\/.\w\-_]*)?\??(?:[-+=&;%@.\w_]*)#?(?:[\w]*))?)/i).test(url);
}

/**
 * Determines if a value is a hexNumber
 *
 * @param {string} value, is the hexColor
 * @returns {*|boolean} True if it is a valid hexColor
 */
export function isHex(value) {
    return value && isString(value) && (/(^#[0-9A-F]{6}$)|(^#[0-9A-F]{3}$)/i).test(value);
}
