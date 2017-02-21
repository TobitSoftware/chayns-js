import { chaynsCall } from '../chaynsCall';
import { getCallbackName } from '../callback';
import { propTypes } from '../propTypes';
import { isFunction } from '../../utils/is';

function setBackButton(enabled, callback) {
	const callbackName = 'setBackButton';

	return chaynsCall({
		'call': {
			'action': 10,
			'value': {
				enabled,
				'callback': getCallbackName(callbackName)
			}
		},
		'app': {
			'support': {'android': 4727, 'ios': 4301}
		},
		callbackName,
		'callbackFunction': callback,
		'propTypes': {
			'callback': propTypes.string.isRequired,
			'enabled': propTypes.boolean.isRequired
		}
	});
}

export function showBackButton(callback) {
	if (!isFunction(callback)) {
		callback = function backButtonCallback() {
			history.back();
			hideBackButton();
		};
	}

	return setBackButton(true, callback, 0);
}

export function hideBackButton() {
	return setBackButton(false);
}

