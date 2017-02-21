import { chaynsCall } from '../chaynsCall';
import { propTypes } from '../propTypes';

export function setTextToSpeech(text, playOnMute) {

	return chaynsCall({
		'call': {
			'action': 83,
			'value': {
				text,
				playOnMute
			}
		},
		'app': {
			'support': {'android': 4860}
		},
		'web': false,
		'propTypes': {
			'title': propTypes.string.isRequired,
			'playOnMute': propTypes.boolean
		}
	});
}
