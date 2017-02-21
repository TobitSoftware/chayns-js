import { chaynsCall } from '../chaynsCall';
import { propTypes } from '../propTypes';
import { getCallbackName } from '../callback';

export function setNetworkChangeCallback(callback, ongoing) {
	const callbackName = 'setNetworkChangeCallback';

	return chaynsCall({
		'call': {
			'action': 76,
			'value': {
				ongoing,
				'callback': getCallbackName(callbackName)
			}
		},
		'app': {
			'support': {'android': 4792, 'ios': 4380}
		},
		'web': {
			'fn': webNetworkChange.bind(this, callback)
		},
		callbackName,
		'callbackFunction': callback,
		'timeout': 0,
		'propTypes': {
			'ongoing': propTypes.boolean,
			'callback': propTypes.string.isRequired
		}
	});
}

export const networkType = {
	'NO_NETWORK': 0,
	'NETWORK_TYPE_UNKNOWN': 1,
	'IDEN': 2,
	'GPRS': 3,
	'EGDE': 4,
	'CDMA_1xRTT': 5,
	'CDMA_EVDO_0': 6,
	'CDMA_EVDO_A': 7,
	'CDMA_EVDO_B': 8,
	'UMTS': 9,
	'EHRPD': 10,
	'HSDPA': 11,
	'HSPA': 12,
	'HSPAP': 13,
	'HSUPA': 14,
	'LTE': 15,
	'WIFI': 16,
	'ETHERNET': 17
};

function webNetworkChange(callback) {
	callback({
		'isConnected': true,
		'type': 1
	});

	return Promise.resolve();
}
