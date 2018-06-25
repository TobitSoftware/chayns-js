import { chaynsCall } from '../chaynsCall';
import { propTypes } from '../propTypes';

export function login(params = [], permissions = []) {
	return chaynsCall({
		'call': {
			'action': 54,
			'value': {
				'urlParams': params,
				'fbPermissions': permissions
			}
		},
		'app': {
			'support': {'android': 4783, 'ios': 4301}
		},
		'propTypes': {
			'urlParams': propTypes.array,
			'fbPermissions': propTypes.array
		}
	});
}

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

export const logoutType = {
    'NORMAL': 0,
    'FORCE': 1
};

export const loginState = {
	'FACEBOOK': 0,
	'T_WEB': 1,
	'CANCEL': 2,
	'ALREADY_LOGGED_IN': 3
};
