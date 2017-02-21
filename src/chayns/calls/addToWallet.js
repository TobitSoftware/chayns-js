import { chaynsCall } from '../chaynsCall';
import { propTypes } from '../propTypes';

export function addToWallet(url) {
	return chaynsCall({
		'call': {
			'action': 47,
			'value': {
				url
			}
		},
		'app': {
			'support': {'ios': 4301}
		},
		'web': false,
		'propTypes': {
			'url': propTypes.string.isRequired
		}
	});
}
