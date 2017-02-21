import { chaynsCall } from '../chaynsCall';
import { getCallbackName } from '../callback';
import { propTypes } from '../propTypes';

export function showSnackbar(value) {
	const callbackName = 'showSnackbar';

	value.callback = getCallbackName(callbackName);

	return chaynsCall({
		'call': {
			'action': 109,
			value
		},
		'app': {
			'support': {'android': 5281, 'ios': 5228}
		},
		'web': false,
		callbackName,
		'timeout': 0,
		'propTypes': {
			'message': propTypes.object,
			'icon': propTypes.object,
			'button': propTypes.object,
			'permanent': propTypes.bool,
			'duration': propTypes.number,
			'backgroundColor': propTypes.string,
			'callback': propTypes.string
		}
	});
}
