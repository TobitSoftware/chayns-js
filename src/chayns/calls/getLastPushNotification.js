import { chaynsCall } from '../chaynsCall';
import { getCallbackName } from '../callback';
import { propTypes } from '../propTypes';

export function getLastPushNotification() {
	let callbackName = 'getLastPushNotification';

	return chaynsCall({
		call: {
			'action': 119,
			'value': {
				'callback': getCallbackName(callbackName)
			}
		},
		app: {
			support: {android: 5423, ios: 5420}
		},
		callbackName,
		propTypes: {
			'callback': propTypes.string.isRequired
		}
	}).then((data) => Promise.resolve(data.items ? data : {items: []}));
}