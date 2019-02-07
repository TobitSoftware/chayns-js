import {chaynsCall} from '../chaynsCall';
import {getCallbackName} from '../callback';
import {propTypes} from '../propTypes';
import {environment, setEnv} from '../environment';
import {parseGlobalData} from '../../utils/parseGlobalData';


export function getGlobalData(raw = false) {
    const callbackName = 'getGlobalData';

    return chaynsCall({
        'call': {
            'action': 18,
            'value': {
                'callback': getCallbackName(callbackName),
                'apiVersion': environment.apiVersion
            }
        },
        'app': {
            'support': {'android': 4727, 'ios': 4301}
        },
        callbackName,
        'propTypes': {
            'callback': propTypes.string.isRequired,
            'apiVersion': propTypes.number.isRequired
        }
    }).then((data) => {
        const gd = parseGlobalData(data);
        setEnv(gd);

        return raw ? Promise.resolve(data) : Promise.resolve(gd);
    });
}

