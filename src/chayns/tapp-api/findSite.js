import {environment} from '../environment';

export function findSite(query, skip = 0, take = 20) {
    return fetch(`https://relations.chayns.net/relations/site?query=${query}&skip=${skip}&take=${take}`, {
        'headers': {
            'authorization': `bearer ${environment.user.tobitAccessToken}`
        }
    }).then(response => response.json()).then((json) => ({
        'Status': {
            'ResultCode': json.length === 0 ? 1 : 0,
            'RestultText': json.length === 0 ? 'No Match' : 'Ok',
            'Exception': null
        },
        'Value': json.list && json.list.length > 0
            ? json.list.map((site) => ({
                'siteId': site.siteId,
                'locationId': site.locationId,
                'facebookId': '',
                'appstoreName': site.name
            }))
            : null
    }));
}
