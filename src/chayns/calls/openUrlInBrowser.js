import {chaynsCall} from '../chaynsCall';
import {propTypes} from '../propTypes';

export function openUrlInBrowser(url, target) {
    let cleanedUrl = url;
    try {
        cleanedUrl = new URL(url).toString();
    } catch (ex) {
        console.warn('cannot parse url:', url);
    }

    return chaynsCall({
        'call': {
            'action': 9,
            'value': {
                'url': cleanedUrl,
                target
            }
        },
        'app': {
            'support': {'android': 4727, 'ios': 4301}
        },
        'web': {
            'fn': () => Promise.resolve(window.open(url, target ? target : '_blank'))
        },
        'myChaynsApp': {
            'support': {'android': 6000, 'ios': 6000}
        },
        'propTypes': {
            'url': propTypes.string.isRequired,
            'target': propTypes.string
        }
    });
}
