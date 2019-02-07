import {environment} from '../environment';
import {tappApi} from './tappApi';

export function findPerson(query, location = -1) {
    let data = `?SearchString=${query}&CurrentLocationId=${location}`;

    if (environment.user.isAuthenticated) {
        data += `&AccessToken=${environment.user.tobitAccessToken}`;
    }

    return tappApi(`User/FindUser${data}`, true)
        .then((json) => json);
}
