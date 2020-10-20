import {isBlank, isPresent, isUndefined} from '../utils/is';


/**
 * Store internal chayns configuration
 * @private
 */
let _config = {
    'appName': 'Chayns App',              // app Name
    'cssPrefix': 'chayns-',               // css prefix
    'callbackPrefix': '_chaynsCallbacks', // chayns (web) call callback prefix
    'initialHeight': 500,                 // initial chayns web height
    'autoResize': true,                   // manages automatic resizing of the tapp
    'strictMode': 1,                      // cancels calls if parameters are wrong / missing
    'forceAjaxCalls': false,              // forces ajax calls even if chayns is in an iFrame
    'apiDialogs': true                    // enable api dialogs by default
};

class Config {

    /**
     * Returns the value for the key from the config.
     *
     * @param {string} key Key
     * @returns {*} Value for the key
     */
    static get(key) {
        if (isPresent(key)) {
            return _config[key];
        }
        return undefined;
    }

    /**
     * Sets the value for the key in the config.
     *
     * @param {string} key Key
     * @param {*} value Value
     * @returns {boolean} Returns true if the value was set
     */
    static set(key, value) {
        if (isBlank(key) || isUndefined(value)) {
            return false;
        }
        _config[key] = value;
        return true;
    }

    /**
     * Extends the current config with the reference one.
     *
     * @param {{}} config Config reference
     * @returns {boolean} Returns true if the config was extended
     */
    static setConfig(config) {
        if (isUndefined(config)) {
            return false;
        }

        _config = {
            ..._config,
            ...config
        };

        return true;
    }

    /**
     * Checks if the current config contains the key
     *
     * @param {string} key Key
     * @returns {boolean} True if key is present
     */
    static has(key) {
        return !!key && (key in _config);
    }
}

export default Config;
