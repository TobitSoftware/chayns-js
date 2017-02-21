import { chaynsCall } from '../chaynsCall';
import { getCallbackName } from '../callback';
import { propTypes } from '../propTypes';

export function getBeaconHistory(subNumber) {
	const callbackName = 'getBeaconHistory';

	return chaynsCall({
		'call': {
			'action': 36,
			'value': {
				subNumber,
				'callback': getCallbackName(callbackName)
			}
		},
		'app': {
			'support': {'android': 4727, 'ios': 4301}
		},
		'web': false,
		callbackName,
		'propTypes': {
			'subNumber': propTypes.number,
			'callback': propTypes.string.isRequired
		}
	});
}
