import { chaynsCall } from '../chaynsCall';
import { getCallbackName } from '../callback';
import { propTypes } from '../propTypes';

export function setIntercomChatData(data, callback){
    let callbackName = 'setIntercomChatData';
    return chaynsCall({
        'call': {
            'action': 128,
            'value': {
                'callback': getCallbackName(callbackName),
                'data' : data
            }
        },
        'app': false,
        'web': false,
        'cwl': {'version': 2},
        callbackName,
        'callbackFunction': callback,
        'propTypes': {
            'callback': propTypes.string.isRequired,
            'data': propTypes.object.isRequired
        }
    });
}