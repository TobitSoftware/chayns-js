import Config from './Config';
import {messageListener} from './callback';
import {
    setHeight,
    getGlobalData,
    addDesignSettingsChangeListener,
    addAccessTokenChangeListener
} from './calls';
import {environment} from './environment';
import {getLogger} from '../utils/logger';
import {isObject, isPresent} from '../utils';
import throttle from 'lodash.throttle';
import {getAvailableColorList, getColorFromPalette, hexToRgb} from '../utils/colors';
import {dynamicFontSize} from './calls/dynamicFontSize';

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

function designSettingsChangeListener({color = environment.site.color, colorMode = environment.site.colorMode}) {
    // css variables
    let styles = '';
    // because iOS chayns app uses colorMode 2 but chaynsCall returns 0 instead
    if (environment.isApp && environment.isIOS && environment.site.locationId === 378 && colorMode === 0) {
        colorMode = 2;
    }
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
    if (environment.isChaynsDe) {
        html.classList.add(`${prefix}-chayns_de`);
    }

    // start window.on('message') listener for iFrame communication
    messageListener();


    // wait for the ios javascript interface to be ready
    const shouldWait = environment.isIOS && (!window.webkit || !window.webkit.messageHandlers || !window.webkit.messageHandlers.jsonCall);

    setTimeout(() => {
        // get chayns data (either from Chayns Web (parent frame) or chayns app)
        // get the App Information
        getGlobalData(undefined, true)
            .then((data) => {
                chaynsReadySetup(data).then(resolve, reject);

                /**
                 * Register the designSettingsChangeListener in chayns-App (locationId=378)
                 * and Intercom-App (locationId=186225)
                 */
                if (environment.isApp && [378, 186225].indexOf(environment.site.locationId) > -1) {
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

    if (isPresent(environment.site.generalComponentDesign)) {
        html.classList.add(`${prefix}general-component-design--${environment.site.generalComponentDesign}`);
    }

    chaynsTranslate();

    if (data.site.dynamicFontSize) {
        dynamicFontSize();
    }

    if (environment.isApp) {
        addAccessTokenChangeListener();
    }

    // chayns is ready
    html.classList.add(`${prefix}ready`);

    log.info('finished chayns setup');

    return Promise.resolve(data);
};

function chaynsTranslate() {
    if (!document.querySelector('script[src*="chaynsTranslate.min.js"]') && environment._parameters.lang && environment._parameters.translang && environment._parameters.lang !== environment._parameters.translang) {
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
    let heightCache = Math.max(Config.get('initialHeight'), document.body.offsetHeight);

    if (Config.get('initialHeight') > 0) {
        setHeight({
            'height': heightCache,
            'growOnly': false
        }); // default value is 500
    }

    const resizeHandler = function resizeHandler() {
        // ResizeObserver in iFrame does not work when iFrame not in view
        let interval = null;
        let cleared = false;
        const resize = (clear = false) => {
            if (clear && cleared === false) {
                clearInterval(interval);
                cleared = true;
            }

            const height = parseInt(String(document.body.offsetHeight), 10);
            if (heightCache === height) { // needed for site intercom in david client / chayns runtime
                return;
            }

            setHeight({
                'height': height,
                'growOnly': false
            });

            heightCache = height;
        };

        interval = setInterval(() => {
            resize();
        }, 200);

        if (window.ResizeObserver) {
            const resizeObserver = new window.ResizeObserver(throttle(() => {
                resize(true);
            }, 100));
            resizeObserver.observe(document.body);
        }
    };

    log.debug('start height observer interval');
    resizeHandler();
}

export const ready = setup();
