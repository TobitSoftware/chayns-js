import { chaynsCall } from '../chaynsCall';
import { getCallbackName } from '../callback';
import { propTypes } from '../propTypes';

export function uploadFile(serverUrl, mimeType) {
	const callbackName = 'uploadFile';

	return chaynsCall({
		'call': {
			'action': 110,
			'value': {
				serverUrl,
				mimeType,
				'callback': getCallbackName(callbackName)
			}
		},
		'app': {
			'support': {'android': 5282}
		},
		'web': false,
		callbackName,
		'propTypes': {
			'serverUrl': propTypes.string,
			'mimeType': propTypes.number,
			'callback': propTypes.string.isRequired
		}
	});
}

export const mimeType = {
	'DOCUMENT': 0,
	'AUDIO': 1,
	'IMAGE': 2,
	'VIDEO': 3
};
