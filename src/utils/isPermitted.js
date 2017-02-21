import { getLogger } from './logger';
import { isObject } from './is';
import { environment } from '../chayns/environment';

const log = getLogger('chayns.utils.isPermitted');

/**
 * Determine whether the current user's OS and OS Version is higher
 * or equal to the passed reference `Object`.
 *
 * @param {Object} versions Versions `Object` with permitted OSs and their version.
 * @param {string} os OS Name as lowercase string.
 * @param {Number} appVersion App Version Number as Integer
 * @returns {Boolean} True if the current OS & Version are defined in the versions `Object`
 */
export function isPermitted(versions, os = environment.os, appVersion = environment.appVersion) {
	if (!versions || !isObject(versions)) {
		log.warn('No versions object was passed!');
		return false;
	}

	return versions[os] && appVersion >= versions[os] && versions[os] !== -1;
}
