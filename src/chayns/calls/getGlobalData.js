import { chaynsCall } from '../chaynsCall';
import { getCallbackName } from '../callback';
import { propTypes } from '../propTypes';
import { environment } from '../environment';
import { getLogger } from '../../utils/logger';

const log = getLogger('chayns.core.call');
let globalData;

export function getGlobalData(forceReload) {
	if (!forceReload && globalData) {
		log.debug('getGlobalData: return cached data');
		return Promise.resolve(globalData);
	}

	const callbackName = 'getGlobalData';

	return chaynsCall({
		'call': {
			'action': 18,
			'value': {
				'callback': getCallbackName(callbackName),
				'apiVersion': environment.apiVersion
			}
		},
		'app': {
			'support': {'android': 4727, 'ios': 4301}
		},
		callbackName,
		'propTypes': {
			'callback': propTypes.string.isRequired,
			'apiVersion': propTypes.number.isRequired
		}
	}).then((data) => Promise.resolve(globalData = data));
}
