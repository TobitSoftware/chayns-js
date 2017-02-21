import { chaynsCall } from '../chaynsCall';
import { getCallbackName } from '../callback';
import { propTypes } from '../propTypes';

function setOverlay(enabled, color, transition) {
	const callbackName = 'showOverlay';

	return chaynsCall({
		call: {
			'action': 116,
			'value': {
				'callback': getCallbackName(callbackName),
				enabled,
				color,
				transition,
			}
		},
		app: false,
		callbackName,
		propTypes: {
			'enabled': propTypes.boolean.isRequired,
			'callback': propTypes.string.isRequired,
			'color': propTypes.string,
			'transition': propTypes.string
		}
	});
}

export function showOverlay(color, transition) {
	return setOverlay(true, color, transition);
}

export function hideOverlay() {
	return setOverlay(false);
}