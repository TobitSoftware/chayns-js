import {environment} from '../environment';

export function findPerson(query) {
    return fetch(`https://relations.chayns.net/relations/user/findUser?searchString=${query}`, {
        'headers': {
            'authorization': `bearer ${environment.user.tobitAccessToken}`
        }
    }).then(response => response.json()).then((json) => ({
        'Status': {
            'ResultCode': json.length === 0 ? 1 : 0,
            'RestultText': json.length === 0 ? 'No Match' : 'Ok',
            'Exception': null
        },
        'Value': json
    }));
}
