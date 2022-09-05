import {chaynsCall} from '../chaynsCall';
import {getCallbackName} from '../callback';
import {propTypes} from '../propTypes';
import {environment, setEnv} from '../environment';
import {parseGlobalData} from '../../utils/parseGlobalData';

let id = 0;

export function getGlobalData(raw = false, loadAllTapps = false) {
    const callbackName = 'getGlobalData' + (++id);

    let loadAllTappInfos = loadAllTapps;

    try {
        if (!loadAllTapps) {
            loadAllTappInfos = [...document.querySelectorAll('script')].some(x => x && x.src && x.src.includes('#chayns-load-all-tapp-infos'));
        }
    } catch(e) {
        console.error(e);
    }

    return chaynsCall({
        'call': {
            'action': 18,
            'value': {
                'callback': getCallbackName(callbackName),
                'apiVersion': environment.apiVersion,
                'loadAllTappInfos': loadAllTappInfos
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

        if (window._chaynsCallbacks) {
            delete window._chaynsCallbacks[callbackName];
        }

        return raw ? Promise.resolve(data) : Promise.resolve(gd);
    });
}

