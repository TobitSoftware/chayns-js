import { chaynsCall } from '../chaynsCall';
import { getCallbackName } from '../callback';
import { propTypes } from '../propTypes';

export function setOnActivateCallback(callback) {
	const callbackName = 'setOnActivateCallback';

	return chaynsCall({
		'call': {
			'action': 60,
			'value': {
				'callback': getCallbackName(callbackName)
			}
		},
		'app': {
			'support': {'android': 4727, 'ios': 4301}
		},
		'web': false,
		callbackName,
		'callbackFunction': callback,
		'timeout': 0,
		'propTypes': {
			'callback': propTypes.string.isRequired
		}
	});
}

export const tappEvent = {
	'ON_SHOW': 0,
	'ON_HIDE': 1,
	'ON_REFRESH': 2
};
