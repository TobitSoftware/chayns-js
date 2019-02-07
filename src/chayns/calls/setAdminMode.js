import {chaynsCall} from '../chaynsCall';
import {propTypes} from '../propTypes';

function setAdminMode(enabled) {
    const callbackName = 'setAccessTokenChange';

    return chaynsCall({
        'call': {
            'action': 162,
            'value': {
                enabled
            }
        },
        'app': false,
        callbackName,
        'propTypes': {
            'enabled': propTypes.boolean.isRequired
        }
    });
}

/**
 * Activate adminmode
 * <div>Call: 162 </div>
 * @since Web supported, App not supported
 * @example chayns.activateAdminMode()
 * @return {Promise} no information
 */
export function activateAdminMode() {
    return setAdminMode(true);
}

/**
 * Deactivate adminmode
 * <div>Call: 162 </div>
 * @since Web supported, App not supported
 * @example chayns.deactivateAdminMode()
 * @return {Promise} no information
 */
export function deactivateAdminMode() {
    return setAdminMode(false);
}
