import {chaynsCall} from '../chaynsCall';
import {getCallbackName} from '../callback';
import {propTypes} from '../propTypes';

/**
 * This function will return the last push.
 * This call can only be called once. Only the first call will get the correct information.
 * <div>Call: 119</div>
 * @since Android: 5.423 | iOS 5.420 | Web not supported
 * @return {Promise} Contains the raw push information.
 * @example chayns.getLastPushNotification().then((res) => {console.log(res);});
 */
export function getLastPushNotification() {
    let callbackName = 'getLastPushNotification';

    return chaynsCall({
        'call': {
            'action': 119,
            'value': {
                'callback': getCallbackName(callbackName)
            }
        },
        'app': {
            'support': {'android': 5423, 'ios': 5420}
        },
        callbackName,
        'propTypes': {
            'callback': propTypes.string.isRequired
        }
    }).then((data) => Promise.resolve(data && data.items ? data : {'items': []}));
}
