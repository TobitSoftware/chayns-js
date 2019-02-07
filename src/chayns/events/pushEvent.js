import {addChaynsEventListener} from '../chaynsEvent';
import {getLastPushNotification} from '../calls/getLastPushNotification';

/**
 * With this call you can register a function to push notifications.
 * You cannot call chayns.getLastPushNotification() again after register this call. You only get the information ones.
 * You can only get this information in the tapp, who should get the push. The push contains a tappId.
 * <div>Event: push</div>
 * @since Android: 4.961 | iOS: 4516 | Web not supported
 * @param {function} callback - This function will be called when you get a push notification.
 * @return {undefined}
 * @example chayns.event.addPushListener((res)=>{chayns.dialog.alert(JSON.stringify(res))});
 */
export function addPushListener(callback) {
    getLastPushNotification()
        .then((data) => {
            if (data && data.items && data.items.length && data.items.length > 0) {
                for (let i = 0, l = data.items.length; i < l; i++) {
                    if (data.items[i].actionId === -1) {
                        return callback(parsePush(data.items[i]));
                    }
                }
            }
        });

    return addChaynsEventListener({
        'event': {
            'name': 'Push',
            'callback': (data) => callback(parsePush(data)),
            'useCapture': false
        },
        'web': false,
        'app': {'android': 4961, 'ios': 4516}
    });
}

/**
 * Remove push listner.
 * @since Android: 4.961 | iOS: 4516 | Web not supported
 * @param {function} callback -The name if the function you want to remove.
 * @return {undefined} nothing
 * @example chayns.removePushListner('myPushFunction');
 */
export function removePushListener(callback) {
    document.removeEventListener('Push', callback);
}

function parsePush(data) {
    if (data && data.chaynsData) {
        const {push, category, actionId, value} = data.chaynsData;

        return {
            'push': {
                'alert': push.aps.alert,
                'payload': {
                    'tappId': push.tp1.t,
                    'actions': push.tp1.a.map(parsePushAction)
                },
                'customPayload': push.tp1.pl
            },
            'category': parsePushCategory(category),
            actionId,
            value
        };
    }
    return data;
}

function parsePushCategory(category) {
    if (!category) {
        return undefined;
    }

    return {
        'id': category.id,
        'inputPlaceholder': category.textInput,
        'buttons': category.buttons.map(parsePushButton)
    };
}

function parsePushAction(action) {
    return {
        'id': action.id,
        'type': action.a,
        'url': action.u
    };
}

function parsePushButton(button) {
    return {
        'id': button.id,
        'title': button.title,
        'active': button.activeMode
    };
}
