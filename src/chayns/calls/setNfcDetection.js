import { chaynsCall } from '../chaynsCall';
import { getCallbackName } from '../callback';
import { propTypes } from '../propTypes';

function setNfcDetection(enabled, callback, interval, vibrate, silentDisconnectCallback) {
	const callbackName = 'setNfcDetection';

	return chaynsCall({
		'call': {
			'action': 93,
			'value': {
				enabled,
				vibrate,
				interval,
				silentDisconnectCallback,
				'callback': getCallbackName(callbackName),
			}
		},
		'app': {
			'support': {'android': 4960}
		},
		'web': false,
		callbackName,
		'callbackFunction': callback,
		'timeout': 0,
		'propTypes': {
			'enabled': propTypes.boolean.isRequired,
			'interval': propTypes.number,
			'vibrate': propTypes.boolean,
			'silentDisconnectCallback': propTypes.string,
			'callback': propTypes.string.isRequired
		}
	});
}

export function startNfcDetection(callback, interval, vibrate, silentDisconnectCallback) {
	return setNfcDetection(true, callback, interval, vibrate, silentDisconnectCallback);
}

export function stopNfcDetection() {
	return setNfcDetection(false);
}
