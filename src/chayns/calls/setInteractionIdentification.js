import { chaynsCall } from '../chaynsCall';
import { getCallbackName } from '../callback';
import { propTypes } from '../propTypes';

function setInteractionIdentification(value, callback) {
	const callbackName = '_setInteractionIdentification';
	value.callback = getCallbackName(callbackName);

	return chaynsCall({
		call: {
			'action': 117,
			value
		},
		app: {
			support: {android: 5409}
		},
		web: false,
		callbackName,
		callbackFunction: callback,
		propTypes: {
			'enabled': propTypes.boolean.isRequired,
			'duration': propTypes.number,
			'delay': propTypes.number,
			'foregroundColor': propTypes.string,
			'backgroundColor': propTypes.string,
			'callback': propTypes.string.isRequired
		}
	});
}

export function startInteractionIdentification(value, callback) {
	value.enabled = true;
	return setInteractionIdentification(value, callback);
}

export function stopInteractionIdentification() {
	return setInteractionIdentification({'enabled': false});
}