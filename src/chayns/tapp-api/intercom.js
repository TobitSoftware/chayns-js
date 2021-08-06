import {environment} from '../environment';
import {isArray} from '../../utils';

const INTERCOM_URL = 'https://sub54.tobit.com/rest/api';

export function sendMessageToUser(userId, object) {
    if (!object.text) {
        return Promise.reject('no text specified');
    }
    let images = [];
    if (isArray(object.images)) {
        images = object.images.map(imageUrl => ({'url': imageUrl}));
    }

    return sendMessage(`/user/${environment.user.id}/message`, {
        'receivers': [{
            'tobitId': userId
        }],
        'message': {
            'images': images,
            'text': object.text,
            'typeId': 1
        }
    });
}

export function sendMessageToPage(object) {
    if (!object.text) {
        return Promise.reject('no text specified');
    }
    let images = [];
    if (isArray(object.images)) {
        images = object.images.map(imageUrl => ({'url': imageUrl}));
    }

    return sendMessage(`/user/${environment.user.id}/message`, {
        'receivers': [{
            'locationId': environment.site.locationId
        }],
        'message': {
            'images': images,
            'text': object.text,
            'typeId': 1
        }
    });
}

export function sendMessageToGroup(groupId, object) {
    if (!object.text) {
        return Promise.reject('no text specified');
    }
    let images = [];
    if (isArray(object.images)) {
        images = object.images.map(imageUrl => ({'url': imageUrl}));
    }

    return sendMessage(`/location/${environment.site.locationId}/broadcast`, {
        'receivers': [{
            groupId
        }],
        'message': {
            'images': images,
            'text': object.text,
            'typeId': 6
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
