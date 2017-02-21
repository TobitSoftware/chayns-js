import { chaynsCall } from '../chaynsCall';
import { getCallbackName } from '../callback';
import { propTypes } from '../propTypes';

export function addScrollListener(callback, throttle = 200) {
	const callbackName = 'addScrollListener';

	return chaynsCall({
		'call': {
			'action': 102,
			'value': {
				'callback': getCallbackName(callbackName),
				'throttle': throttle
			}
		},
		'app': false,
		callbackName,
		'callbackFunction': callback,
		'propTypes': {
			'callback': propTypes.string.isRequired,
			'throttle': propTypes.number
		}
	});
}
