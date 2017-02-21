import { chaynsCall } from '../chaynsCall';
import { getCallbackName } from '../callback';
import { propTypes } from '../propTypes';

function _setCaptionButton(enabled, text, callback) {
	const callbackName = 'setCaptionButton';

	return chaynsCall({
		'call': {
			'action': 5,
			'value': {
				enabled,
				'name': text,
				'callback': getCallbackName(callbackName)
			}
		},
		'app': {
			'support': {'android': 4727, 'ios': 4301}
		},
		'web': false,
		callbackName,
		'callbackFunction': callback,
		'propTypes': {
			'enabled': propTypes.boolean.isRequired,
			'name': propTypes.string,
			'callback': propTypes.string
		}
	});
}

export function setCaptionButton(text, callback) {
	return _setCaptionButton(true, text, callback);
}

export function hideCaptionButton() {
	return _setCaptionButton(false);
}

