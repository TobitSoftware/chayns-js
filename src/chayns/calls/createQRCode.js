import { chaynsCall } from '../chaynsCall';
import { getCallbackName } from '../callback';
import { propTypes } from '../propTypes';

export function createQRCode(text) {
	const callbackName = 'createQRCode';

	return chaynsCall({
		'call': {
			'action': 33,
			'value': {
				text,
				'callback': getCallbackName(callbackName)
			}
		},
		'app': {
			'support': {'android': 4727, 'ios': 4301}
		},
		'web': {
			'fn': () => {
				return Promise.resolve(`//qr.tobit.com/?SizeStrategy=FIXEDCODESIZE&width=250&value=${text}`);
			}
		},
		callbackName,
		'propTypes': {
			'text': propTypes.string.isRequired,
			'callback': propTypes.string.isRequired
		}
	});
}
