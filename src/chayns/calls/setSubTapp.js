import {chaynsCall} from '../chaynsCall';
import {propTypes} from '../propTypes';

export function setSubTapp(subTapp) {
    const tapp = {
        ...subTapp
    };

    return chaynsCall({
        'call': {
            'action': 69,
            'value': {
                tapp
            }
        },
        'app': {
            'support': {'android': 4769, 'ios': 4329}
        },
        'propTypes': {
            'tapp': propTypes.shape({
                'name': propTypes.string.isRequired,
                'color': propTypes.string,
                'colorText': propTypes.string,
                'sortID': propTypes.number.isRequired,
                'icon': propTypes.string,
                'callbackURL': propTypes.string,
                'url': propTypes.string.isRequired,
                'tappID': propTypes.number.isRequired,
                'buttonName': propTypes.string,
                'isExclusiveView': propTypes.boolean,
                'replaceParent': propTypes.boolean,
                'boldText': propTypes.boolean
            }).isRequired
        }
    });
}

export function removeSubTapp(value) {
    return chaynsCall({
        'call': {
            'action': 70,
            value
        },
        'app': {
            'support': {'android': 4769, 'ios': 4329}
        },
        'propTypes': {
            'tappID': propTypes.number.isRequired,
            'close': propTypes.boolean,
            'remove': propTypes.boolean
        }
    });
}
