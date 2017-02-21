import { chaynsCall } from '../chaynsCall';
import { propTypes } from '../propTypes';

export function playSound(url, playOnMute) {
	return chaynsCall({
		'call': {
			'action': 98,
			'value': {
				url,
				playOnMute
			}
		},
		'app': {
			'support': {'android': 4993, 'ios': 5101}
		},
		'web': false,
		'propTypes': {
			'url': propTypes.string.isRequired,
			'playOnMute': propTypes.boolean
		}
	});
}
