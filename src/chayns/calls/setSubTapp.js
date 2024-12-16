import {chaynsCall} from '../chaynsCall';
import {propTypes} from '../propTypes';

export function setSubTapp(subTapp, version = 1) {
    const tapp = {
        ...subTapp
    };

    if (version === 2) {
        return chaynsCall({
            'call': {
                'action': 69,
                'value': {
                    'tappData': tapp
                }
            },
            'app': {
                'support': {'android': 4769, 'ios': 4329}
            },
            'propTypes': {
                'tappData': propTypes.shape({
                    'url': propTypes.string.isRequired,
                    'customUrl': propTypes.string,
                    'denyUacGroups': propTypes.array,
                    'hideFromMenu': propTypes.boolean,
                    'icon': propTypes.string,
                    'iconStyle': propTypes.number,
                    'iconType': propTypes.number,
                    'ignoreComingSoon': propTypes.boolean,
                    'managerUacGroups': propTypes.array,
                    'minAge': propTypes.number,
                    'path': propTypes.string,
                    'postTobitAccessToken': propTypes.boolean,
                    'requiresLogin': propTypes.boolean,
                    'showApp': propTypes.boolean,
                    'showDesktop': propTypes.boolean,
                    'showMobile': propTypes.boolean,
                    'showName': propTypes.string,
                    'siteId': propTypes.string,
                    'sortId': propTypes.number,
                    'uacGroups': propTypes.array,
                    'useChatHead': propTypes.boolean,
                    'viewMode': propTypes.number,
                    'apiVersion': propTypes.number,
                }).isRequired
            }
        });
    }

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
