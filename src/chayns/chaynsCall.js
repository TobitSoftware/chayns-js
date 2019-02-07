/* eslint-disable valid-jsdoc */
import {isFunction, isObject} from '../utils/is';
import {getLogger} from '../utils/logger';
import {isPermitted} from '../utils/isPermitted';
import {environment} from './environment';
import Config from './Config';
import {setCallback} from './callback';
import {validatePropTypes} from './propTypes';

let log = getLogger('chayns.core.chayns_calls');
const widgetTappCalls = [133];

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
    } else if (environment.isChaynsnetRuntime && obj.cwl !== undefined) { // chacing call for CWL important! Do not set CWL to false
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
    if (obj && obj.call && obj.call.isApiCall && window.dialog && window.dialog.receiveApiCall && isFunction(window.dialog.receiveApiCall)) {
        try {
            window.dialog.receiveApiCall(obj.call);
        } catch (e) {
            log.error('executeJsonChaynsCall: could not execute call: ', obj.call, e);
            return Promise.reject(e);
        }
    } else {
        try {
            if (isObject(obj.call)) {
                obj.call = JSON.stringify(obj.call);
            }

            log.debug('executeJsonChaynsCall:', obj.call);
            if (window.webkit && window.webkit.messageHandlers && window.webkit.messageHandlers.jsonCall) {
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

    return Promise.resolve();
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
    } else if (environment.isInFrame && !Config.get('forceAjaxCalls')) {
        try {
            if (isObject(obj.call)) {
                obj.call = JSON.stringify(obj.call);
            }

            const url = `chayns.customTab.jsoncall${window.name ? `@${window.name}` : ''}:${obj.call}`;
            log.debug(`chaynsWebCall: ${url}`);
            window.parent.postMessage(url, '*');
        } catch (e) {
            log.error('chaynsWebCall: postMessage failed', e);
            return Promise.reject(e);
        }
    } else {
        const func = window.JsonCalls[obj.call.action];
        if (func) {
            func(obj.call.value, [window, 'chayns.ajaxTab.']);
        } else if (obj.call.isApiCall && window.dialog && isFunction(window.dialog.receiveApiCall)) {
            window.dialog.receiveApiCall(obj.call);
        } else {
            log.error('chaynsWebCall: no function found');
            return Promise.reject();
        }
    }

    return Promise.resolve();
}

export function invokeCall(call) {
    if (chayns.utils.isString(call)) {
        call = JSON.parse(call);
    }
    let obj = {};
    obj.call = call;
    obj.app = {'support': {'android': 1, 'ios': 1}};
    if (environment.isWidget) {
        obj.call.isWidget = true;
    }
    log.debug(`invokeCall: ${call}`);
    if (environment.isApp && !environment.isWidget) {
        return injectCallback(chaynsAppCall, obj);
    }
    return injectCallback(chaynsWebCall, obj);

}
