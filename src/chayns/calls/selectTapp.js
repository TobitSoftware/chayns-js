import {chaynsCall} from '../chaynsCall';
import {propTypes} from '../propTypes';
import {isArray, isNumber} from '../../utils/is';
import {environment} from '../environment';
import {openUrlInBrowser} from './openUrlInBrowser';

export function selectTapp(tapp, param) {
    const value = {
        ...tapp
    };

    if (param) {
        value.params = isArray(param) ? param : [param];
    }

    if (value.params && !isArray(value.params)) {
        value.params = [value.params];
    }

    if (environment.isAndroid && environment.isApp && environment.appVersion >= 6464 && environment.appVersion < 6513 && value.customDomain) {
        delete value.customDomain;
    }

    if (value.siteId) {
        const params = value.params ? value.params.join('&') : '';
        if (value.siteId !== environment.site.id) {
            if (environment.isApp || environment.isMyChaynsApp) {
                return chaynsCall({
                    'call': {
                        'action': 142,
                        'value': {
                            'siteId': value.siteId,
                            'tappIdUrl': `/tapp/index/${value.id}?${params}`,
                        }
                    },
                    'app': {'support': {'android': 5589, 'ios': 5627}},
                    'propTypes': {
                        'siteId': propTypes.string,
                        'tappIdUrl': propTypes.string
                    }
                });
            } else {
                return openUrlInBrowser(`https://chayns.net/${value.siteId}/tapp/index/${value.id}?${params}`);
            }
        } else {
            delete value.siteId;
        }
    }

    return chaynsCall({
        'call': {
            'action': 2,
            value
        },
        'app': {
            'support': {'android': 4727, 'ios': 4301}
        },
        'propTypes': {
            'id': propTypes.number,
            'position': propTypes.number,
            'internalName': propTypes.string,
            'showName': propTypes.string,
            'params': propTypes.array
        }
    });
}
