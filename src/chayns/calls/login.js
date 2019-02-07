import {chaynsCall} from '../chaynsCall';
import {propTypes} from '../propTypes';
import {getCallbackName} from '../callback';

/**
 * This call will open the login dialog.
 * <div>Call: 54</div>
 * @param {array} params -An array of strings which are added to the url after login. The values can be found in chayns.env.parameters
 * @param {array} permissions -An array of special Facebook permissions. The Facebook login will be opened and asked for the given permissions. You can find all facebook permissions on https://developers.facebook.com/docs/facebook-login/permissions/
 * @return {Promise} An object which contains the current login state. Use chayns.loginState to find out hte meaning of this types.
 * @example chayns.login();
 * chayns.login(['chayns=nice', 'tobit=software'], ).then(console.log)
 *chayns.login(['chayns=nice', 'tobit=software'], ['business_management']).then(console.log)
 */
export function login(params = [], permissions = []) {

    const callbackName = 'login';

    return chaynsCall({
        'call': {
            'action': 54,
            'value': {
                'urlParams': params,
                'fbPermissions': permissions,
                'callback': getCallbackName(callbackName)
            }
        },
        'app': {
            'support': {'android': 4783, 'ios': 4301}
        },
        callbackName,
        'propTypes': {
            'urlParams': propTypes.array,
            'fbPermissions': propTypes.array
        }
    });
}

/**
 * This call will perform a logout.
 * <div>Call: 56</div>
 * @param {number} logoutType -A force logout will logout the user direct, when normal is used, the user will be asked if he want to perform a logout. Apps have only implemented the force logout.
 * @return {undefined}
 * @example chayns.logout();
 * chayns.logout(chayns.logoutType.NORMAL);
 * chayns.logout(chayns.logoutType.FORCE);
 */
export function logout(logoutType) {
    return chaynsCall({
        'call': {
            'action': 56,
            'value': {
                'type': logoutType
            }
        },
        'app': {'android': 4727, 'ios': 4301},
        'propTypes': {
            'type': propTypes.number
        }
    });
}

/**
 * Enum for the logoutTypes
 * @type {{NORMAL: number, FORCE: number}}
 */
export const logoutType = {
    'NORMAL': 0,
    'FORCE': 1
};

/**
 * Enum for loginState
 * @type {{FACEBOOK: number, T_WEB: number, CANCEL: number, ALREADY_LOGGED_IN: number}}
 */
export const loginState = {
    'FACEBOOK': 0,
    'T_WEB': 1,
    'CANCEL': 2,
    'ALREADY_LOGGED_IN': 3
};
