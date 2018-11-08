import { chaynsCall } from './chaynsCall';
import { getCallbackName } from './callback';
import { propTypes } from './propTypes';

export function closeWindow(callback){

    let callbackName = 'getSavedIntercomChats';

    return chaynsCall({
        'call': {
            'action': 129,
            'value': {
                'callback': getCallbackName(callbackName),
            }
        },
        'app': false,
        'web': false,
        'cwl': {'version': 2},
        callbackName,
        'callbackFunction': callback,
        'propTypes': {
            'callback': propTypes.string.isRequired
        }
    });
}
