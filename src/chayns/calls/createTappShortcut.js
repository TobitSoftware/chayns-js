import { chaynsCall } from '../chaynsCall';
import { propTypes } from '../propTypes';

export function createTappShortcut(name, url) {
	return chaynsCall({
		'call': {
			'action': 59,
			'value': {
				name,
				url
			}
		},
		'app': {
			'support': {'android': 4787, 'ios': 4301}
		},
		'web': false,
		'propTypes': {
			'name': propTypes.string.isRequired,
			'url': propTypes.string
		}
	});
}
