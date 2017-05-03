import { chaynsCall } from '../chaynsCall';
import { getCallbackName } from '../callback';
import { propTypes } from '../propTypes';

export function getSavedIntercomChats(itemId,callback){

    let callbackName = 'getSavedIntercomChats';

    return chaynsCall({
        'call': {
            'action': 127,
            'value': {
                'callback': getCallbackName(callbackName),
                itemId
            }
        },
        'app': false,
        'web': false,
        'cwl': {'version': 2},
        callbackName,
        'callbackFunction': callback,
        'propTypes': {
            'callback': propTypes.string.isRequired,
            'itemId': propTypes.string.isRequired
        }
    });
}