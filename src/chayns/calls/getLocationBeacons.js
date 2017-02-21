import { chaynsCall } from '../chaynsCall';
import { getCallbackName } from '../callback';
import { propTypes } from '../propTypes';
import { getLogger } from '../../utils/logger';

const log = getLogger('chayns.core.call');
let beaconList;

export function getLocationBeacons(forceReload) {
	if (beaconList && !forceReload) {
		log.debug('getLocationBeacons: return cached data');
		return Promise.resolve(beaconList);
	}

	const callbackName = 'getLocationBeacons';

	return chaynsCall({
		'call': {
			'action': 39,
			'value': {
				'callback': getCallbackName(callbackName)
			}
		},
		'app': {
			'support': {'android': 4727, 'ios': 4301}
		},
		'web': false,
		callbackName,
		'callbackFunction': (data) => beaconList = data,
		'propTypes': {
			'callback': propTypes.string.isRequired
		}
	});
}
