import {tappApi} from './tappApi';
import {environment} from '../environment';

export function findSite(query, skip = 0, take = 20) {
    let u = '';
    if(environment.user && environment.user.userId) {
        u = '&userId=' + environment.user.userId;
    }
    return tappApi(`Global/Search?SearchString=${query}&LocationId=${environment.site.locationId}${u}&Skip=${skip}&Take=${take}`, true)
        .then((json) => json);
}
