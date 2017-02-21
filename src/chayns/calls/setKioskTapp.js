import { chaynsCall } from '../chaynsCall';
import { propTypes } from '../propTypes';

function _setKioskTapp(show, tappId, tapCount, password, automaticClose) {
	return chaynsCall({
		'call': {
			'action': 95,
			'value': {
				show,
				tappId,
				tapCount,
				password,
				automaticClose
			}
		},
		'app': {
			'support': {'android': 4972, 'ios': 4538}
		},
		'web': false,
		'propTypes': {
			'show': propTypes.boolean.isRequired,
			'tappId': propTypes.number,
			'tapCount': propTypes.number,
			'password': propTypes.string,
			'automaticClose': propTypes.number
		}
	});
}

export function setKioskTapp(tappId, tappCount, password, automaticClose) {
	return _setKioskTapp(true, tappId, tappCount, password, automaticClose);
}

export function removeKioskTapp() {
	return _setKioskTapp(false);
}
