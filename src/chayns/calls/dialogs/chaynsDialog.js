import { chaynsCall } from '../../chaynsCall';
import { getCallbackName } from '../../callback';
import { propTypes } from '../../propTypes';
import { environment } from '../../environment';

export const buttonText = {
	'YES': {
		'de': 'Ja',
		'en': 'Yes',
		'nl': 'Ja'
	}[environment.language],
	'NO': {
		'de': 'Nein',
		'en': 'No',
		'nl': 'Nee'
	}[environment.language],
	'OK': 'OK',
	'CANCEL': {
		'de': 'Abbrechen',
		'en': 'Cancel',
		'nl': 'Annuleren'
	}[environment.language]
};

export const buttonType = {
	'CANCEL': -1,
	'NEGATIVE': 0,
	'POSITIVE': 1
};

export function chaynsDialog(config) {
	const callbackName = 'chaynsDialog';

	config.callback = getCallbackName(callbackName);

	return chaynsCall({
		'call': {
			'action': 16,
			'value': config
		},
		'app': {
			'support': {'android': 4794, 'ios': 4301}
		},
		callbackName,
		'propTypes': {
			'callback': propTypes.string.isRequired,
			'dialog': propTypes.object.isRequired
		}
	}).then((data) => Promise.resolve(data.buttonType));
}
