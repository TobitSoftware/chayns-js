import {chaynsCall} from '../chaynsCall';
import {propTypes} from '../propTypes';

function setTitleImage(show) {
    return chaynsCall({
        'call': {
            'action': 89,
            'value': {
                show
            }
        },
        'app': {
            'support': {'android': 4899, 'ios': 4447}
        },
        'propTypes': {
            'show': propTypes.boolean.isRequired
        }
    });
}

export function showTitleImage() {
    return setTitleImage(true);
}

export function hideTitleImage() {
    return setTitleImage(false);
}
