import { chaynsCall } from '../chaynsCall';
import { propTypes } from '../propTypes';
import { getCallbackName } from '../callback';

let errorListenerCount = 0;

export function addErrorListener(callback, filter) {
	const callbackName = `addErrorListener_${errorListenerCount}`;
	errorListenerCount++;

	return chaynsCall({
		'call': {
			'action': 68,
			'value': {
				'callback': getCallbackName(callbackName),
				'filter': filter || ''
			}
		},
		'app': {
			'support': {'android': 4754}
		},
		'web': false,
		callbackName,
		'callbackFunction': callback,
		'propTypes': {
			'callback': propTypes.string.isRequired,
			'filter': propTypes.string.isRequired
		}
	});
}
