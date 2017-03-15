
import { chaynsCall } from '../chaynsCall';
import { getCallbackName } from '../callback';
import { propTypes } from '../propTypes';

export function getBeaconMonitoringStatus() {
    const callbackName = 'getBeaconMonitoringStatus';

    return chaynsCall({
        'call': {
            'action': 46,
            'value': {
                'callback': getCallbackName(callbackName)
            }
        },
        'app': {
            'support': {'android': 4727, 'ios': 4301}
        },
        'web': false,
        callbackName,
        'propTypes': {
            'callback': propTypes.string.isRequired
        }
    });
}
