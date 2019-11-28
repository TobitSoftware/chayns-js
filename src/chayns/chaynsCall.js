/* eslint-disable valid-jsdoc */
import {isFunction, isObject} from '../utils/is';
import {getLogger} from '../utils/logger';
import {isPermitted} from '../utils/isPermitted';
import {environment} from './environment';
import Config from './Config';
import {getCallbackName, setCallback} from './callback';
import {validatePropTypes} from './propTypes';
import {isString} from '../utils';

let log = getLogger('chayns.core.chayns_calls');
export const widgetTappCalls = [133];

/**
 * Evaluate api call
 *
 * @param obj The object that contains the call data
 * @returns {*}
 */
export function chaynsCall(obj) {
    if (obj.propTypes && !validatePropTypes(obj.propTypes, obj.call.value)) {
        return Promise.reject({
            'message': 'chaynsCall: check parameters or deactivate strict mode',
            'call': obj.call
        });
    }
    if (environment.isMyChaynsApp && isObject(obj.myChaynsApp)) { // myChaynsCall
        log.debug('chaynsCall: attempt chayns web call for myChaynsApp');
        const myChaynsAppObj = obj.myChaynsApp;
        const os = environment.isAndroid ? 'android' : environment.isIOS ? 'ios' : environment.os;
        const version = navigator.userAgent.match(/(mychayns\/)(\d+)/i);
        if (!myChaynsAppObj.support || isPermitted(myChaynsAppObj.support, os, version[2])) {
            if (environment.isWidget) {
                log.debug('isMyChaynsApp Call in widget');
                obj.call.isWidget = true;
            }

            log.debug('supportedMyChaynsAppCall');
            return injectCallback(chaynsWebCall, obj);
        }
    } else if (environment.isWidget) {
        if (environment.isChaynsWeb && obj.web !== false || environment.isApp && obj.app !== false || environment.isMyChaynsApp && obj.myChaynsApp === true || widgetTappCalls.indexOf(obj.call.action) > -1) {
            obj.call.isWidget = true;

            log.debug('chaynsCall: attempt chayns web call for widget');
            const webObj = obj.web;

            // if there is a function registered it will be executed instead of the call
            if (!environment.isApp && webObj && webObj.fn && isFunction(webObj.fn)) {
                log.debug('chaynsWebCall: fallback invoke will be attempted');
                return webObj.fn();
            }

            return injectCallback(chaynsWebCall, obj);
        }
    } else if (environment.isChaynsnetRuntime && obj.cwl !== undefined) { // caching call for CWL important! Do not set CWL to false
        log.debug('chaynsCall: attempt chayns cwl call');
        const cwlObj = obj.cwl;

        // will be executed instead of the call
        if (cwlObj && cwlObj.fn && isFunction(cwlObj.fn)) {
            log.debug('chaynsCall: fallback invoke will be attempted');
            return cwlObj.fn();
        }

        if (cwlObj.version <= environment.appVersion) {
            return injectCallback(chaynsWebCall, obj);
        }

        return notSupported(obj);
    } else if (environment.isApp && obj.app !== false) { // chayns call (native app)
        log.debug('chaynsCall: attempt chayns app call');
        const appObj = obj.app;

        if (appObj && appObj.fn && isFunction(appObj.fn)) {
            log.debug('chaynsCall: fallback invoke will be attempted');
            return appObj.fn();
        }

        if (!appObj.support || isPermitted(appObj.support)) {
            log.debug('supportedAppCall');
            return injectCallback(chaynsAppCall, obj);
        }
    } else if (environment.isChaynsWeb && obj.web !== false) { // chayns web call (custom tapp communication)
        log.debug('chaynsCall: attempt chayns web call');
        const webObj = obj.web;

        // if there is a function registered it will be executed instead of the call
        if (webObj && webObj.fn && isFunction(webObj.fn)) {
            log.debug('chaynsCall: fallback invoke will be attempted');
            return webObj.fn();
        }

        return injectCallback(chaynsWebCall, obj);
    }

    if (widgetTappCalls.indexOf(obj.call.action) > -1) {
        // Call which is not supported in App, but is handled by the Tapp
        return Promise.resolve({
            'message': 'This call is handled by the Tapp not by ChaynsWeb or App.',
            'value': obj.call.value
        });
    }

    return notSupported(obj);
}

function notSupported(obj) {
    log.debug('chaynsCall: chayns call is not supported in this version.');
    return Promise.reject({
        'message': 'chaynsCall: chayns call is not supported in this version.',
        'call': obj.call
    });
}

/**
 *
 * @param callFn Chayns/ChaynsWeb call
 * @param obj apiCall Object
 * @returns {*}
 */
function injectCallback(callFn, obj) {
    if (obj.callbackFunction) {
        setCallback(obj.callbackName, obj.callbackFunction);
        return callFn(obj);
    } else if (obj.callbackName) {
        // defer helper
        const callPromise = {};
        callPromise.promise = new Promise((resolve, reject) => {
            callPromise.resolve = resolve;
            callPromise.reject = reject;
        });

        setCallback(obj.callbackName, callPromise);
        return callFn(obj).then(() => callPromise.promise);
    }

    return callFn(obj);
}

/**
 *
 * @param obj
 * @returns {Array|Promise|*}
 */
function chaynsAppCall(obj) {
    try {
        if (isObject(obj.call)) {
            obj.call = JSON.stringify(obj.call);
        }

        log.debug('executeJsonChaynsCall:', obj.call);
        if (obj.useCommunicationInterface && window.webkit && window.webkit.messageHandlers && window.webkit.messageHandlers.chaynsMessage) {
            window.webkit.messageHandlers.chaynsMessage.postMessage(obj.call);
        } else if (window.webkit && window.webkit.messageHandlers && window.webkit.messageHandlers.jsonCall) {
            window.webkit.messageHandlers.jsonCall.postMessage(obj.call);
        } else {
            window.chaynsApp.jsonCall(obj.call);
        }

        return Promise.resolve();
    } catch (e) {
        log.error('executeJsonChaynsCall: could not execute call: ', obj.call, e);
        return Promise.reject(e);
    }
}

/**
 * Execute a ChaynsWeb Call in the parent window.
 *
 * @private
 * @param {Object}  obj
 * @returns {Promise} True if chaynsWebCall succeeded
 */
function chaynsWebCall(obj) {
    if (environment.isWidget) {
        try {
            if (isObject(obj)) {
                obj = JSON.stringify(obj);
            }
            const url = `chayns.widget.jsoncall${window.name ? `@${window.name}` : ''}:${obj}`;
            log.debug(`chaynsWebCall: ${url}`);
            window.parent.postMessage(url, '*');
        } catch (e) {
            log.error('chaynsWebCall: postMessage failed', e);
            return Promise.reject(e);
        }
    } else if (window.JsonCalls) {
        const func = window.JsonCalls[obj.call.action];
        if (func) {
            func(obj.call.value, [window, 'chayns.ajaxTab.']);
        } else if (obj.call.action === 184 && window.dialog && isFunction(window.dialog.receiveApiCall)) {
            window.dialog.receiveApiCall(obj.call);
        } else {
            log.error('chaynsWebCall: no function found');
            return Promise.reject();
        }
    } else {
        try {
            let call = 'ajaxTab';
            if (environment.isInFrame && !Config.get('forceAjaxCalls')) {
                call = 'customTab';
            }

            if (isObject(obj.call)) {
                obj.call = JSON.stringify(obj.call);
            }

            const url = `chayns.${call}.jsoncall${window.name ? `@${window.name}` : ''}:${obj.call}`;
            log.debug(`chaynsWebCall: ${url}`);
            if (environment.isChaynsParent) {
                if (obj.useCommunicationInterface === true) {
                    const dialog = document.querySelector('iframe[name="CustomDialogIframe"]');
                    if (dialog) {
                        dialog.contentWindow.postMessage(url, '*');
                    } else {
                        log.warn('chaynsWebCall: CustomDialogIframe not found');
                    }
                } else {
                    window.postMessage(url, '*');
                }
            } else {
                window.parent.postMessage(url, '*');
            }
        } catch (e) {
            log.error('chaynsWebCall: postMessage failed', e);
            return Promise.reject(e);
        }
    }

    return Promise.resolve();
}

export function invokeCall(call, realResolve) {
    /*
    * expected behaviour:
    * - callback strings won't get touched
    * - callback function will be called by a generated function
    * - if realResolve is set, the generated function will resolve the promise
    * - otherwise the promise is resolved instantly
    * - callback strings are not compatible with realResolve
    * */
    return new Promise((resolve) => {
        if (chayns.utils.isString(call)) {
            call = JSON.parse(call);
        }
        let callback = call.value ? call.value.callback : null;
        let obj = {};
        if (environment.isWidget) {
            call.isWidget = true;
        }
        obj.call = call;
        if (realResolve || (callback && isFunction(callback))) {
            const random = Math.round(Math.random() * 10000);
            obj.callbackName = 'invokeCall' + random;
            if (!obj.call.value) {
                obj.call.value = {};
            }
            obj.call.value.callback = getCallbackName(obj.callbackName);
        }
        obj.app = {'support': {'android': 1, 'ios': 1}};
        log.debug(`invokeCall: ${obj.call}`);
        chaynsCall(obj).then((data) => {
            if (isFunction(callback)) {
                callback({'retVal': data});
            }
            if (realResolve) {
                resolve(data);
            }
        });
        if (!realResolve) {
            resolve(undefined);
        }
    });
}
