import Config from './Config';
import {messageListener} from './callback';
import {getGlobalData} from './calls/getGlobalData';
import {setHeight} from './calls/setHeight';
import {environment, setEnv} from './environment';
import {getLogger} from '../utils/logger';
import {isObject, isPresent, isString} from '../utils/is';
import {addWidthChangeListener} from './calls/widthChangeListener';
import {addAccessTokenChangeListener, addDesignSettingsChangeListener} from './calls';
import {parseGlobalData} from '../utils/parseGlobalData';
import throttle from 'lodash.throttle';
import {getAvailableColorList, getColorFromPalette, hexToRgb} from '../utils/colors';

const log = getLogger('chayns.core'),
    html = document.documentElement,
    prefix = 'chayns-';

/**
 * Run necessary operations to prepare chayns.
 *
 * @param {object} config Reference passed
 * @returns {undefined}
 */
export function register(config) {
    if (!isObject(config)) {
        throw new Error('Invalid config object');
    }

    log.info('chayns.register');
    Config.setConfig(config);
}

/**
 * Run necessary operations to prepare chayns.
 *
 * @returns {Promise} chayns ready
 */
const setup = () => new Promise((resolve, reject) => {
    log.info('start chayns setup');

    // chayns is running
    html.classList.add('chayns');

    // add vendor classes (OS, Browser) which is already in chayns.env
    html.classList.add(`${prefix}os--${environment.os}`);
    html.classList.add(`${prefix}browser--${environment.browser.name}`);

    // DOM ready promise
    // interactive can occur when chayns.js is dynamically loaded
    if (document.readyState === 'complete' || document.readyState === 'interactive') {
        domReadySetup().then(resolve, reject);
        return;
    }

    const domReady = function domReady() {
        domReadySetup().then(resolve, reject);
        window.removeEventListener('DOMContentLoaded', domReady, true);
    };
    window.addEventListener('DOMContentLoaded', domReady, true);
});

/**
 * Updates chayns.env when the user logs in/out or the token expires
 *
 * @param {object} data - New environment data
 * @returns {undefined}
 */
const accessTokenChangeListener = (data) => {
    const gd = parseGlobalData(data);
    setEnv(gd);
};

function designSettingsChangeListener({color = environment.site.color, colorMode = environment.site.colorMode}) {
    // css variables
    let styles = '';
    for (const colorName of getAvailableColorList()) {
        const hexColor = getColorFromPalette(colorName, color, colorMode);
        styles += `--chayns-color--${colorName}: ${hexColor}; `;
        const rgbColor = hexToRgb(hexColor);
        styles += `--chayns-color-rgb--${colorName}: ${rgbColor.r}, ${rgbColor.g}, ${rgbColor.b}; `;
    }
    let rgbColor = hexToRgb(color);
    styles += `--chayns-color-rgb: ${rgbColor.r}, ${rgbColor.g}, ${rgbColor.b};`;
    rgbColor = hexToRgb(getColorFromPalette(100, color, colorMode));
    styles += `--chayns-bg-rgb: ${rgbColor.r}, ${rgbColor.g}, ${rgbColor.b};`;
    document.documentElement.style.cssText = styles;
    // chayns environment
    if (color !== environment.site.color) {
        environment.site.color = color;
    }
    if (colorMode !== environment.site.colorMode) {
        environment.site.colorMode = colorMode;
    }
}

/**
 * When the DOM is ready
 * Chayns sets all the default classes and receives App/Chayns Web Information
 *
 * @returns {Promise} Chayns ready
 */
const domReadySetup = () => new Promise((resolve, reject) => {
    log.debug('DOM ready');

    // dom-ready class
    html.classList.add('dom-ready');

    // Environment
    if (environment.isChaynsWeb) {
        html.classList.add(`${prefix}-web`);
    }
    if (environment.isChaynsWebMobile) {
        html.classList.add(`${prefix}-mobile`);
    } else if (environment.isChaynsWebDesktop || environment.isChaynsnetRuntime) {
        html.classList.add(`${prefix}-desktop`);
    }
    if (environment.isChaynsnetRuntime) {
        html.classList.add(`${prefix}-net_runtime`);
    }
    if (environment.isChaynsParent) {
        html.classList.add(`${prefix}-parent`);
    }
    if (environment.isApp) {
        html.classList.add(`${prefix}-app`);
    }
    if (environment.isApp || environment.isMyChaynsApp) {
        html.classList.add(`${prefix}-noSelection`);
    }
    if (environment.isInFrame) {
        html.classList.add(`${prefix}-frame`);
    }
    if (environment.isTablet) {
        html.classList.add(`${prefix}-tablet`);
    }

    // start window.on('message') listener for iFrame communication
    messageListener();


    // wait for the ios javascript interface to be ready
    const shouldWait = environment.isIOS && (!window.webkit || !window.webkit.messageHandlers || !window.webkit.messageHandlers.jsonCall);

    setTimeout(() => {
        // get chayns data (either from Chayns Web (parent frame) or chayns app)
        // get the App Information
        getGlobalData()
            .then((data) => {
                // if (environment.isInFrame) {// TODO activate dynamicFontSize only if it's activated in getGlobalData
                dynamicFontSize();
                // }
                chaynsReadySetup(data).then(resolve, reject);
                addAccessTokenChangeListener(accessTokenChangeListener, true);
                if (environment.isApp && environment.site.locationId === 378) {// register designSettingsChangeListener only in chayns app
                    addDesignSettingsChangeListener(designSettingsChangeListener);
                }
            })
            .catch(() => {
                log.debug('Error: The App Information could not be received.');
                reject('The App Information could not be received.');
            });
    }, shouldWait ? 200 : 0);
});

/**
 * When Chayns has received data from Chayns Web or an Chayns App
 * The data is passed to this function
 *
 * @param {object} data - Environment data
 * @returns {Promise} chayns ready
 */
const chaynsReadySetup = (data) => {
    if (environment.isChaynsWeb && environment.isInFrame || environment.isWidget) {
        resizeListener();
    }

    // add chayns root element
    // only used for popup fallback
    const chaynsRoot = document.createElement('div');
    chaynsRoot.setAttribute('id', `${prefix}root`);
    chaynsRoot.setAttribute('class', 'chayns__root');
    document.body.appendChild(chaynsRoot);

    if (environment.site.tapp.isExclusiveView) {
        html.classList.add(`${prefix}-exclusive`);
    }

    if (isPresent(environment.site.colorMode)) {
        html.classList.add(`${prefix}color-mode--${environment.site.colorMode}`);
    }

    chaynsTranslate();

    // chayns is ready
    html.classList.add(`${prefix}ready`);

    log.info('finished chayns setup');

    return Promise.resolve(data);
};

function chaynsTranslate() {
    if (!document.querySelector('script[src*="chaynsTranslate.min.js"]')) {
        const script = document.createElement('script');
        script.setAttribute('src', 'https://api.chayns-static.space/translate/js/chaynsTranslate.min.js');
        script.setAttribute('onload', 'chayns.utils.translate.init();');
        document.body.appendChild(script);
    }
}

/**
 * Resize Listener (Height check interval)
 * Checks each 200ms whether the window heights did change
 * and sends the new height to the parent frame window (Chayns Web)
 * in order that it can update the iframe height
 *
 * @returns {undefined}
 */
function resizeListener() {
    if (!Config.get('autoResize')) {
        return;
    }

    let heightCache;
    if (Config.get('initialHeight') > 0) {
        heightCache = Config.get('initialHeight');
        setHeight({
            'height': heightCache,
            'growOnly': false
        }); // default value is 500
    }

    const resizeHandler = function resizeHandler() {

        // ResizeObserver in iFrame does not work when iFrame not in view
        let i = 0;
        let count = 0;
        let cleared = false;

        const resize = (clear = false) => {
            if (heightCache === document.body.offsetHeight) {
                return;
            }

            if (clear && count > 1 && cleared === false) {
                clearInterval(i);
                count = 0;
                cleared = true;
            }
            log.debug('old height', heightCache, 'new height: ', document.body.offsetHeight);
            heightCache = document.body.offsetHeight;

            setHeight({
                'height': heightCache,
                'growOnly': false
            });
            count++;
        };

        if (window.ResizeObserver) {
            const resizeObserver = new window.ResizeObserver(throttle(() => {
                resize(true);
            }, 200));
            resizeObserver.observe(document.body);
        }

        i = setInterval(() => {
            resize();
        }, 200);
    };

    log.debug('start height observer interval');
    resizeHandler();
}

const callbacks = {};

const setWidthVariable = (data) => {
    if (data.width < 1400) { // max width
        document.documentElement.style.setProperty('--width', data.width + 'px');
    }
};

export function activateDynamicFontSize() {
    const callFrames = (width) => {
        document.querySelectorAll('iframe').forEach((iframe) => {
            if (callbacks[iframe.name]) {
                callbacks[iframe.name].forEach((callbackName) => {
                    let message = `chayns.${(!environment.isWidget ? 'customTab' : 'widget')}.jsoncall:`;
                    message += JSON.stringify({'callback': callbackName, 'retVal': {width}});
                    iframe.contentWindow.postMessage(message, '*');
                });
            }
        });
    };

    window.addEventListener('resize', (data) => {
        const width = data.target.innerWidth;
        callFrames(width);
        setWidthVariable({width});
    });

    const width = window.innerWidth;
    callFrames(width);
    setWidthVariable({width});
}

function dynamicFontSize() {
    if (environment.isInFrame) {
        addWidthChangeListener(setWidthVariable);
    } else {
        window.addEventListener('message', (event) => {
            try {
                const data = event.data;

                if (!data || !isString(data)) {
                    return;
                }

                let callPrefix = data.split(':', 1);
                let prefixLength = callPrefix[0].length + 1; // also cut the first :
                let params = JSON.parse(data.substr(prefixLength, data.length - prefixLength));
                if (params.action === 237) {
                    const frameName = callPrefix[0].split('@')[1];
                    if (!callbacks[frameName]) {
                        callbacks[frameName] = [];
                    }
                    callbacks[frameName].push(params.value.callback);
                }
            } catch (ex) {
                log.warn(ex);
            }

        });


    }
}

export const ready = setup();
