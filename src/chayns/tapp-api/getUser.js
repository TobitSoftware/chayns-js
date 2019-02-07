import {isArray, isObject, isPresent} from '../../utils/is';
import {tappApi} from './tappApi';

export function getUser(obj) {
    if (!obj || !isObject(obj)) {
        // log.warn('Error while getting basic information');
        return Promise.reject(new Error('There was no parameter Object'));
    }

    let data = '';
    if (isPresent(obj.userId)) {
        data = 'UserID=' + obj.userId;
    }
    if (isPresent(obj.facebookId)) {
        data = 'FBID=' + obj.facebookId;
    }
    if (isPresent(obj.personId)) {
        data = 'PersonID=' + obj.personId;
    }
    if (isPresent(obj.accessToken)) {
        data = 'AccessToken=' + obj.accessToken;
    }

    return tappApi(`User/BasicInfo?${data}`)
        .then((json) => isArray(json) ? json.map((user) => parseUser(user)) : json);
}

function parseUser(user) {
    return {
        'userId': user.UserID,
        'facebookId': user.ID || user.FacebookID,
        'name': user.Name || user.UserFullName,
        'firstName': user.FirstName,
        'lastName': user.Lastname,
        'picture': `https://graph.facebook.com/${user.ID}/picture`,
        'chaynsLogin': user.ChaynsLogin
    };
}
