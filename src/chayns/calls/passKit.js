import { chaynsCall } from '../chaynsCall';
import { getCallbackName } from '../callback';
import { propTypes } from '../propTypes';

export function getInstalled() {
	const callbackName = 'getInstalledPassKit';

	return chaynsCall({
		'call': {
			'action': 90,
			'value': {
				'callback': getCallbackName(callbackName)
			}
		},
		'app': {
			'support': {'ios': 4493}
		},
		'web': false,
		callbackName,
		'propTypes': {
			'callback': propTypes.string.isRequired
		}
	});
}

export function isInstalled(passTypeIdentifier) {
	const callbackName = 'IsInstalledPassKit';

	return chaynsCall({
		'call': {
			'action': 91,
			'value': {
				passTypeIdentifier,
				'callback': getCallbackName(callbackName)
			}
		},
		'app': {
			'support': {'ios': 4493}
		},
		'web': false,
		callbackName,
		'propTypes': {
			'callback': propTypes.string.isRequired,
			'passTypeIdentifier': propTypes.string.isRequired
		}
	});
}
