import { chaynsCall } from '../chaynsCall';
import { getCallbackName } from '../callback';
import { propTypes } from '../propTypes';
import { setupEnvironment } from '../core';

export function setAccessTokenChange(silentLogin, callback) {
	const callbackName = 'setAccessTokenChange';

	return chaynsCall({
		'call': {
			'action': 66,
			'value': {
				'enabled': !!silentLogin,
				'callback': getCallbackName(callbackName)
			}
		},
		'app': {
			'support': {'android': 4728, 'ios': 4301}
		},
		callbackName,
		'callbackFunction': (data) => {
			setupEnvironment(data);

			if (callback) {
				callback(data);
			}
		},
		'propTypes': {
			'enabled': propTypes.boolean.isRequired,
			'callback': propTypes.string.isRequired
		}
	});
}
