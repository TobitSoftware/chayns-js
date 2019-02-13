import Config from '../chayns/Config';
import {environment} from '../chayns/environment';
import {isBlank, isPresent} from './is';

/**
 * checks if local storage exists
 */
const hasLocalStorage = (function hasLocalStorage() {
    const key = 'chayns.hasLocalStorage';

    try {
        localStorage.setItem(key, '0');
        localStorage.removeItem(key);
        return true;
    } catch (e) {
        return false;
    }
}());

/**
 * Sets key and value in localStorage
 *
 * @param {string} key Key to set
 * @param {*} value Value for key
 * @returns {boolean} true if value was set for the key
 */
export function set(key, value) {
    if (!key || isBlank(value) || !hasLocalStorage) {
        return false;
    }

    localStorage[this.getPrefix() + key] = JSON.stringify(value);
    return true;
}


/**
 * Retrieves key from localStorage.
 *
 * @param {string} key Key to retrieve
 * @returns {object} value of key
 */
export function get(key) {
    if (!hasLocalStorage) {
        return false;
    }

    const value = localStorage[this.getPrefix() + key];
    return isPresent(value) ? JSON.parse(value) : value;
}

/**
 * Removes key from localStorage
 *
 * @param {string} key Key to remove
 * @returns {boolean} true if removed successfully
 */
export function remove(key) {
    if (!hasLocalStorage) {
        return false;
    }

    key = this.getPrefix() + key;

    if (!localStorage[key]) {
        return false;
    }

    localStorage.removeItem(key);
    return true;
}

/**
 * Removes entire localStorage
 *
 * @returns {boolean} true if cleared successfully
 */
export function removeAll() {
    if (!hasLocalStorage) {
        return false;
    }

    localStorage.clear();
    return true;
}

/**
 * Returns app prefix.
 *
 * @returns {string} Prefix
 */
export function getPrefix() {
    return `${(Config.get('appName') || 'chayns').replace(/\s/g, '_')}_${(environment.site.id ? environment.site.id : 0)}_${(environment.site.tapp ? environment.site.tapp.id : 0)}__`;
}
