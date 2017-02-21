import { environment } from '../environment';
import { tappApi } from './tappApi';

export function isUserAdminOfLocation(userId) {
	if (!userId) {
		return Promise.reject(Error('No userId was supplied.'));
	}

	return tappApi(`User/IsUserAdmin?SiteID=${environment.site.siteId}&FBID=${userId}`)
		.then((json) => json);
}
