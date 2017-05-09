import { chaynsCall } from '../chaynsCall';
import { propTypes } from '../propTypes';
import { getCallbackName } from '../callback';

function setFloatingButton(value, callback) {
	const callbackName = 'showFloatingButton';
	value.callback = getCallbackName(callbackName);

	return chaynsCall({
		'call': {
			'action': 72,
			value
		},
		'app': {
			'support': {'android': 4762, 'ios': 4337}
		},
		callbackName,
		'callbackFunction': callback,
		'propTypes': {
			'text': propTypes.string,
			'color': propTypes.string,
			'colorText': propTypes.string,
			'icon': propTypes.string,
			'callback': propTypes.string,
			'enabled': propTypes.boolean.isRequired
		}
	});
}

export function showFloatingButton(value, callback) {
	value.enabled = true;
	return setFloatingButton(value, callback);
}

export function hideFloatingButton() {
	return setFloatingButton({'enabled': false});
}

export const floatingButtonPosition = {
	'RIGHT': 0,
	'CENTER': 1,
	'LEFT': 2
};