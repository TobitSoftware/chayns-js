import { isFunction, isObject } from '../utils/is';
import { getLogger } from '../utils/logger';
import { isPermitted } from '../utils/isPermitted';
import { defer } from '../utils/defer';
import { environment } from './environment';
import Config from './Config';
import { setCallback } from './callback';
import { validatePropTypes } from './propTypes';

let log = getLogger('chayns.core.chayns_calls');

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

	// chayns call (native app)
	if (environment.isApp && obj.app !== false) {
		log.debug('chaynsCall: attempt chayns call');
		const appObj = obj.app;

		if (appObj && appObj.fn && isFunction(appObj.fn)) {
			log.debug('chaynsCall: fallback invoke will be attempted');
			return appObj.fn();
		}

		if (!appObj.support || isPermitted(appObj.support)) {
			return injectCallback(chaynsAppCall, obj);
		}

		// chayns web call (custom tapp communication)
	} else if (environment.isChaynsWeb && obj.web !== false) {
		log.debug('chaynsCall: attempt chayns web call');
		const webObj = obj.web;

		// if there is a function registered it will be executed instead of the call
		if (webObj && webObj.fn && isFunction(webObj.fn)) {
			log.debug('chaynsCall: fallback invoke will be attempted');
			return webObj.fn();
		}

		return injectCallback(chaynsWebCall, obj);
	}

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
		return callFn(obj.call);
	} else if (obj.callbackName) {
		const callPromise = defer();
		setCallback(obj.callbackName, callPromise);
		return callFn(obj.call).then(() => callPromise.promise);
	}

	return callFn(obj.call);
}

/**
 *
 * @param call
 * @returns {Array|Promise|*}
 */
function chaynsAppCall(call) {
	try {
		if (isObject(call)) {
			call = JSON.stringify(call);
		}

		log.debug('executeJsonChaynsCall:', call);
		if (window.webkit && window.webkit.messageHandlers && window.webkit.messageHandlers.jsonCall) {
			window.webkit.messageHandlers.jsonCall.postMessage(call);
		} else {
			window.chaynsApp.jsonCall(call);
		}

		return Promise.resolve();
	} catch (e) {
		log.error('executeJsonChaynsCall: could not execute call: ', call, e);
		return Promise.reject(e);
	}
}

/**
 * Execute a ChaynsWeb Call in the parent window.
 *
 * @private
 * @param {Object} call Call object
 * @returns {Promise} True if chaynsWebCall succeeded
 */
function chaynsWebCall(call) {
	if (environment.isInFrame && !Config.get('forceAjaxCalls')) {
		try {
			if (isObject(call)) {
				call = JSON.stringify(call);
			}

			const url = `chayns.customTab.jsoncall${window.name ? `@${window.name}` : ''}:${call}`;
			log.debug(`chaynsWebCall: ${url}`);
			window.parent.postMessage(url, '*');
		} catch (e) {
			log.error('chaynsWebCall: postMessage failed', e);
			return Promise.reject(e);
		}
	} else {
		const func = window.JsonCalls[call.action];
		if (func) {
			func(call.value, [window, 'chayns.ajaxTab.']);
		} else {
			log.error('chaynsWebCall: no function found');
			return Promise.reject();
		}
	}

	return Promise.resolve();
}

export function invokeCall(call) {
	log.debug(`invokeCall: ${call}`);

	if (environment.isApp) {
		return chaynsAppCall(call);
	} else if (environment.isChaynsWeb) {
		return chaynsWebCall(call);
	}
}
