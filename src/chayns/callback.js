import { isFunction, isString, isDeferred } from '../utils/is';
import { getLogger } from '../utils/logger';
import { environment } from './environment';
import Config from './Config';

const log = getLogger('chayns.core.callback'),
	callbackPrefix = Config.get('callbackPrefix');
let messageListening = false;
window[callbackPrefix] = {
	'setOnActivateCallback': () => {},
	'addErrorListener_0': () => {},
	'addErrorListener_1': () => {}
};

/**
 * Returns the name of the callback with all prefixes.
 *
 * @param {string} fnName Name of the function
 * @returns {string} Callback name
 */
export function getCallbackName(fnName) {
	return `window.${callbackPrefix}.${fnName}`;
}

/**
 * Register a new callback function with it's name
 *
 * @param {string} name Callbacks with the same name are overwritten
 * @param {function|Deferred} fn Callback Function to be invoked or Deferred
 */
export function setCallback(name, fn) {
	if (!isString(name)) {
		return log.warn('setCallback: name is no string');
	}

	// strip '()'
	if (name.indexOf('()') !== -1) {
		name = name.replace('()', '');
	}

	log.debug(`setCallback: set Callback: ${name}`);
	window[callbackPrefix][name] = callback(name, fn);
}

/**
 * Returns the callback function fot the matching callbackName
 *
 * @param {string} callbackName Name of the Function
 * @param {function} fn Function
 * @returns {function} handleData Receives callback data
 */
function callback(callbackName, fn) {
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
export function messageListener() {
	if (messageListening) {
		return log.info('there is already a message listener attached to the window');
	}

	window.addEventListener('message', (event) => {
		const data = event.data,
			namespace = `chayns.${environment.isInFrame && !Config.get('forceAjaxCalls') ? 'customTab' : 'ajaxTab'}.jsoncall:`;


		if (isString(data) && data.indexOf(namespace) !== -1) {
			log.debug('new message', data);

			// strip namespace from data to get params
			let params = data.substr(namespace.length, data.length - namespace.length);

			if (!params) {
				return log.debug('ignoring message: ', data);
			}

			try {
				params = JSON.parse(params);
			} catch (e) {
				return log.error('onMessage: params could not be parsed', e);
			}

			if (!params.callback) {
				return log.debug('onMessage: no callback', event);
			}

			const namespaces = params.callback.split('.');
			let func = window;
			for (let i = 1, l = namespaces.length; i < l; i++) {
				func = func[namespaces[i]];
			}

			if (func && isFunction(func)) {
				func(params);
			}
		}
	});

	messageListening = true;
	log.debug('message listener is started');
}
