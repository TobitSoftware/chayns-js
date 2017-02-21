import { chaynsCall } from '../chaynsCall';
import { getLogger } from '../../utils/logger';

const log = getLogger('chayns.core.call');

export function showFinetradingQRCode() {
	return chaynsCall({
		'call': {
			'action': 61,
			'value': {}
		},
		'app': {
			'support': {'android': 4728, 'ios': 4301}
		}
	});
}

/**
 * @deprecated
 */
export function showOpmQRCode() {
	log.warn('\'showOpmQRCode\' is deprecated, use \'showFinetradingQRCode\' instead!');
	return showFinetradingQRCode();
}
