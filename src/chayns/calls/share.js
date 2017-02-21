import { chaynsCall } from '../chaynsCall';
import { propTypes } from '../propTypes';

export function getAvailableSharingServices() {
	return chaynsCall({
		'call': {
			'action': 79,
			'value': {}
		},
		'app': {
			'support': {'android': 4808, 'ios': 4380}
		},
		'web': false
	});
}

export const sharingApp = {
	'MAIL': 0,
	'WHATSAPP': 1,
	'FACEBOOK': 2,
	'FACEBOOK_MESSANGER': 3,
	'GOOGLE_PLUS': 4,
	'TWITTER': 5
};

export function share(value) {
	return chaynsCall({
		'call': {
			'action': 80,
			value
		},
		'app': {
			'support': {'android': 4808, 'ios': 4380}
		},
		'web': false,
		'propTypes': {
			'title': propTypes.string,
			'text': propTypes.string.isRequired,
			'imageUrl': propTypes.string,
			'sharingApp': propTypes.number,
			'sharingAndroidApp': propTypes.string
		}
	});
}
