import { environment } from '../environment';
import { TAPP_API_URL } from './tappApi';

export function setTappVisibility(userGroupId, exclusiveDisplay) {
	return fetch(`${TAPP_API_URL}Tapp/visibility`, {
		'method': 'post',
		'body': JSON.stringify({
			'siteId': environment.site.id,
			'tappId': environment.site.tapp.id,
			userGroupId,
			exclusiveDisplay
		}),
		'headers': {
			'Content-Type': 'application/json',
			'Accept': 'application/json',
			'Authorization': `bearer ${environment.user.tobitAccessToken}`
		}
	}).then((res) => res.json());
}
