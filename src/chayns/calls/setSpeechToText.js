import { chaynsCall } from '../chaynsCall';
import { getCallbackName } from '../callback';
import { propTypes } from '../propTypes';

function setSpeechToText(enabled, title) {
	const callbackName = 'setSpeechToText';

	return chaynsCall({
		'call': {
			'action': 82,
			'value': {
				enabled,
				title,
				'callback': getCallbackName(callbackName)
			}
		},
		'app': {
			'support': {'android': 4860}
		},
		'web': false,
		callbackName,
		'propTypes': {
			'title': propTypes.string.isRequired,
			'enabled': propTypes.boolean.isRequired,
			'callback': propTypes.string.isRequired
		}
	});
}

export function startSpeechToText(title) {
	return setSpeechToText(true, title);
}

export function stopSpeechToText() {
	return setSpeechToText(false);
}
