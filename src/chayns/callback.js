import {isDeferred, isFunction, isString} from '../utils/is';
import {getLogger} from '../utils/logger';
import {environment} from './environment';
import Config from './Config';
import {chaynsCall, widgetTappCalls} from './chaynsCall';
import { addDesignSettingsChangeListener, listeners as accessTokenListener } from './calls';


const log = getLogger('chayns.core.callback'),
    callbackPrefix = Config.get('callbackPrefix');
let messageListening = false;
window[callbackPrefix] = {
    'setOnActivateCallback': () => {
    }
};

/**
 * Returns the name of the callback with all prefixes.
 *
 * @param {string} fnName Name of the function
 * @param {string} framePrefix, prefix of the frame
 * @returns {string} Callback name
 */
export function getCallbackName(fnName, framePrefix = '') {
    if (framePrefix !== '') {
        return `window.${callbackPrefix}.${framePrefix}.${fnName}`;
    }
    return `window.${callbackPrefix}.${fnName}`;
}

/**
 * Register a new callback function with it's name
 *
 * @param {string} name Callbacks with the same name are overwritten
 * @param {function|Deferred} fn Callback Function to be invoked or Deferred
 * @param {string} framePrefix, prefix of the frame
 *
 * @returns {undefined}
 */
export function setCallback(name, fn, framePrefix = '') {
    if (!isString(name)) {
        log.warn('setCallback: name is no string');
        return;
    }

    // strip '()'
    if (name.indexOf('()') !== -1) {
        name = name.replace('()', '');
    }

    log.debug(`setCallback: set Callback: ${name} ${framePrefix}`);
    if (framePrefix !== '') {
        if (window[callbackPrefix][framePrefix] === undefined) {
            window[callbackPrefix][framePrefix] = {};
        }
        window[callbackPrefix][framePrefix][name] = callback(name, fn);
        log.debug(window[callbackPrefix]);
    } else {
        window[callbackPrefix][name] = callback(name, fn);
    }
}

/**
 * Returns the callback function fot the matching callbackName
 *
 * @param {string} callbackName Name of the Function
 * @param {function} fn Function
 * @returns {function} handleData Receives callback data
 */
function callback(callbackName, fn) {
    log.debug('callback in handle', callbackName, fn);
    return function handleData(data) {
        if (isFunction(fn)) {
            log.debug('invoke callback: ', callbackName, data.retVal);
            fn(data.retVal);
        } else if (isDeferred(fn)) {
            log.debug('resolve call promise: ', callbackName, data.retVal);
            fn.resolve(data.retVal);
        }
    };
}

/**
 * Used when the chayns web (parent window) communicates with the tapp
 * Will invoke the callback() method with the event's methodName and params
 *
 * @returns {undefined}
 */

let counter = 0;

export function messageListener() {
    if (messageListening) {
        log.info('there is already a message listener attached to the window');
        return;
    }

    window.addEventListener('message', (event) => {
        log.debug('event', event);
        const data = event.data,
            namespace = `chayns.${(environment.isInFrame && !Config.get('forceAjaxCalls') && !environment.isChaynsParent) || environment.isApp ? (!environment.isWidget ? 'customTab' : 'widget') : 'ajaxTab'}.jsoncall:`;

        if (!data || !isString(data)) {
            return;
        }

        let prefix = data.split(':', 1);
        let prefixLength = prefix[0].length + 1; // also cut the first :
        let params = data.substr(prefixLength, data.length - prefixLength);

        if (!params || !isString(params) || params === 'undefined' || prefix[0].indexOf('chayns.') === -1 || prefix[0].indexOf('.jsoncall') === -1) {
            log.debug('ignoring message: ', data, namespace, event);
            return;
        }

        try {
            params = JSON.parse(params);
        } catch (e) {
            log.error('onMessage: params could not be parsed', e, data, params);
            return;
        }

        if (params.call && params.call.isWidget) {
            if (params.call && params.call.action && widgetTappCalls.indexOf(params.call.action) >= 0) {
                return;
            }
            log.debug('WidgetCall');
            let cb = params.call.value.callback;
            params.call.value.callback += '_' + (params.call.action || '');
            const preCallInformation = prefix[0].split('@');
            let fn = postToFrame.bind(this, preCallInformation[1], params, cb, preCallInformation[0]);
            setCallback('postToFrame' + '_' + (params.call.action || '') + '_' + counter, fn, preCallInformation[1]);
            let webObj = {};
            webObj.app = params.app;
            webObj.call = params.call;
            webObj.call.value.callback = getCallbackName('postToFrame' + '_' + (params.call.action || '') + '_' + counter, preCallInformation[1]);
            if (webObj.call.action === 281 && webObj.call.value.directExport && webObj.call.value.directExport.callback) {
                webObj.call.value.directExport.callback = webObj.call.value.callback;
            }
            if (webObj.call.action === 18) {
                if (!Array.isArray(webObj.call.value.urls)) {
                    webObj.call.value.urls = [];
                }
                webObj.call.value.urls.unshift(event.origin);
            }
            counter++;

            // Prevent widget design settings change listeners to override the app callback
            if (webObj.call.action === 254) {
                addDesignSettingsChangeListener(fn);
                return;
            }
            chaynsCall(webObj);
        } else if (data.indexOf(namespace) !== -1) {
            log.debug('new message', data);
            if (!params.callback) {
                log.debug('onMessage: no callback', event);
                return;
            }
            const namespaces = params.callback.split('.');

            let func = window;
            for (let i = 1, l = namespaces.length; i < l; i++) {
                if (typeof func !== 'undefined') {
                    func = func[namespaces[i]];
                }
            }
            if (func && isFunction(func)) {
                func(params);
            }
        } else if(window.chaynsElectron && window.chaynsElectron.jsonCall && (params && params.value && params.value.invokeInTop)) {
            window.chaynsElectron.jsonCall(params);
        }
    });

    messageListening = true;
    log.debug('message listener is started');
}

function postToFrame(name, params, cb, callPrefix, retVal) {
    log.debug('retVal', retVal, params, name, cb);
    const frame = document.body.querySelector(`[name="${name}"]`); // FrameName
    if (params.call.action === 66 && params.callbackName === 'setAccessTokenChange') {
        accessTokenListener.forEach((listener) => {
            listener(retVal);
        });
    }
    // create new call URL
    let obj = {};
    obj.addJsonParam = params.call.value.addJsonParam ? params.call.value.addJsonParam : {};
    obj.callback = cb;
    obj.retVal = retVal;
    obj = JSON.stringify(obj);
    obj = `${callPrefix}:${obj}`;
    if (frame && frame.contentWindow) {
        frame.contentWindow.postMessage(obj, '*');
    }
}
