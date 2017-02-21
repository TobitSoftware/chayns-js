import { chaynsCall } from '../chaynsCall';
import { propTypes } from '../propTypes';
import { getCallbackName } from '../callback';

function _setNfcCallback(action, enabled, callbackName, callback) {
	return chaynsCall({
		'call': {
			'action': action,
			'value': {
				'callback': getCallbackName(callbackName),
				enabled
			}
		},
		'app': {
			'support': {'android': 4727}
		},
		'web': false,
		callbackName,
		'callbackFunction': (data) => callback(data.nfcRFID || data.personDataRFID),
		'propTypes': {
			'enabled': propTypes.boolean.isRequired,
			'callback': propTypes.string.isRequired
		}
	});
}

export function setNfcCallback(callback, isPersonData) {
	removeNfcCallback(!isPersonData);
	if (isPersonData) {
		_setNfcCallback(37, true, 'NfcCallbackPersonData', callback);
	} else {
		_setNfcCallback(38, true, 'NfcCallbackRfid', callback);
	}

	return Promise.resolve();
}

export function removeNfcCallback(isPersonData) {
	if (isPersonData) {
		_setNfcCallback(37, false, 'NfcCallbackPersonData');
	} else {
		_setNfcCallback(38, false, 'NfcCallbackRfid');
	}
}
