import {isObject, isPresent} from '../../utils';
import {environment} from '../environment';

export function getUser(obj) {
    if (!obj || !isObject(obj)) {
        // log.warn('Error while getting basic information');
        return Promise.reject(new Error('There was no parameter Object'));
    }

    let query = '';
    if (isPresent(obj.userId)) {
        query = obj.userId;
    } else if (isPresent(obj.personId)) {
        query = obj.personId;
    } else {
        return Promise.reject(new Error('Invalid Parameters - You have to provide at least one of these Parameters: userId, personId'));
    }

    return fetch(`https://relations.chayns.net/relations/user/findUser?searchString=${query}`, {
        'headers': {
            'authorization': `bearer ${environment.user.tobitAccessToken}`
        }
    }).then(response => response.json()).then((json) => {
        if (json.length === 0) {
            return ({
                'Error': {
                    'ResultCode': json.length === 0 ? 4 : 0,
                    'RestultText': null,
                    'Exception': null
                }
            });
        } else if (json.length === 1) {
            return {
                FirstName: json[0].firstName,
                LastName: json[0].lastName,
                PersonID: json[0].personId,
                UserID: json[0].userId,
                UserFullName: json[0].name
            };
        }
        return json;
    });
}
