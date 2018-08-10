import { chaynsCall } from '../chaynsCall';
import { getCallbackName } from '../callback';
import { propTypes } from '../propTypes';

export function setAdminSwitchCallback(callback) {
	const callbackName = 'setAdminSwitchCallback';

	return chaynsCall({
		'call': {
			'action': 88,
			'value': {
				'callback': getCallbackName(callbackName)
			}
		},
		'app':{
            'support': {'android': 5735, 'ios': 5795 }
        },
		callbackName,
        'callbackFunction': (data) => {
            environment.user.adminMode = data.mode === adminSwitchStatus.ADMIN;

            if (callback) {
                callback(data);
            }
        },
		'propTypes': {
			'callback': propTypes.string.isRequired
		}
	});
}

export const adminSwitchStatus = {
	'ADMIN': 1,
	'USER': 0
};
