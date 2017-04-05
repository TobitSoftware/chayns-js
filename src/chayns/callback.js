import { isFunction, isString, isDeferred, isPresent } from '../utils/is';
import { getLogger } from '../utils/logger';
import { environment } from './environment';
import Config from './Config';
import { chaynsCall } from './chaynsCall';


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
export function getCallbackName(fnName, framePrefix = '') {
	if(framePrefix !== '') {
		return `window.${callbackPrefix}.${framePrefix}.${fnName}`;
	}
	return `window.${callbackPrefix}.${fnName}`;
}

/**
 * Register a new callback function with it's name
 *
 * @param {string} name Callbacks with the same name are overwritten
 * @param {function|Deferred} fn Callback Function to be invoked or Deferred
 */
export function setCallback(name, fn, framePrefix = '') {
	if (!isString(name)) {
		return log.warn('setCallback: name is no string');
	}

	// strip '()'
	if (name.indexOf('()') !== -1) {
		name = name.replace('()', '');
	}

	log.debug(`setCallback: set Callback: ${name} ${framePrefix}`);
	if(framePrefix !== '') {
		if(window[callbackPrefix][framePrefix] === undefined) {
			window[callbackPrefix][framePrefix] = {};
		}
		window[callbackPrefix][framePrefix][name] = callback(name, fn);
		log.debug(window[callbackPrefix]);
	}
	else {
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
	log.debug("callback in handle", callbackName , fn);
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
		log.debug('event', event);
		const data = event.data,
			namespace = `chayns.${(environment.isInFrame && !Config.get('forceAjaxCalls')) || environment.isApp ? (!environment.isWidget ? 'customTab' : 'widget') : 'ajaxTab'}.jsoncall:`;

		if(data && isString(data)) {

			let prefix = data.split(':', 1);
			let prefixLength = prefix[0].length + 1; //also cut the first :
			let params = data.substr(prefixLength, data.length - prefixLength);

			if (!params || !isString(params) || params === 'undefined' || prefix[0].indexOf('chayns.') === -1 || prefix[0].indexOf('.jsoncall') === -1) {
				return log.debug('ignoring message: ', data, namespace, event);
			}

			try {
				params = JSON.parse(params);
			} catch (e) {
				return log.error('onMessage: params could not be parsed', e, data, params);
			}

			if (params.call && params.call.isWidget) {

				log.debug('WidgetCall');
				let callback = params.call.value.callback;
				const precallInformation = prefix[0].split('@');
				let fn = postToFrame.bind(this, precallInformation[1], params, callback, precallInformation[0]);
				setCallback('postToFrame', fn, precallInformation[1]);
				let webObj = {};
				webObj.app = params.app;
				webObj.call = params.call;
				webObj.call.value.callback = getCallbackName('postToFrame', precallInformation[1]);
				chaynsCall(webObj);
			}
			else if (data.indexOf(namespace) !== -1) {
				log.debug('new message', data);
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
		}

	});

	messageListening = true;
	log.debug('message listener is started');
}

function postToFrame (name, params, callback, callPrefix, retVal) {
	log.debug('retVal', retVal, params, name, callback);
	let frame = document.querySelector(`[name=${name}]`); // FrameName

	//create new call URL
	let obj = {};
	obj.addJsonParam = params.call.value.addJsonParam ? params.call.value.addJsonParam : {};
	obj.callback = callback;
	obj.retVal = retVal;
	obj = JSON.stringify(obj);
	obj = `${callPrefix}:${obj}`;
	frame.contentWindow.postMessage(obj, '*');
}
