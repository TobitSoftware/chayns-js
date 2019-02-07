import {environment} from '../environment';

const INTERCOM_URL = 'https://sub54.tobit.com/rest/api';

export function sendMessageToUser(userId, object) {
    if (!object.text) {
        return Promise.reject('no text specified');
    }

    return sendMessage(`/user/${environment.user.id}/message`, {
        'receivers': [{
            'tobitId': userId
        }],
        'message': {
            'text': object.text,
            'typeId': 1
        }
    });
}

export function sendMessageToPage(object) {
    if (!object.text) {
        return Promise.reject('no text specified');
    }

    return sendMessage(`/user/${environment.user.id}/message`, {
        'receivers': [{
            'locationId': environment.site.locationId
        }],
        'message': {
            'text': object.text,
            'typeId': 1
        }
    });
}

export function sendMessageToGroup(groupId, object) {
    if (!object.text) {
        return Promise.reject('no text specified');
    }

    return sendMessage(`/location/${environment.site.locationId}/broadcast`, {
        'receivers': [{
            groupId
        }],
        'message': {
            'text': object.text,
            'typeId': 1
        }
    });
}

function sendMessage(endpoint, body) {
    return fetch(`${INTERCOM_URL}${endpoint}`, {
        'method': 'post',
        'headers': {
            'Content-Type': 'application/json',
            'Authorization': `${environment.user.tobitAccessToken}`
        },
        'body': JSON.stringify(body)
    });
}
