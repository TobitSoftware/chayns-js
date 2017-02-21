import { getLogger } from '../../utils/logger';

const log = getLogger('chayns.core.call');

/**
 * @returns {*}
 * @deprecated
 */
function setBurgerBadge() {
	return Promise.reject('The badge functions are deprecated and no longer supported.');
}

export function showBurgerBadge() {
	return setBurgerBadge();
}

export function hideBurgerBadge() {
	return setBurgerBadge();
}