import { environment } from '../environment';
import { tappApi } from './tappApi';

export function getUacGroups(siteId) {
	return tappApi(`Tapp/GetUACGroups?SiteID=${siteId || environment.site.siteId}`)
		.then((json) => json.map((group) => parseGroup(group)));
}

function parseGroup(group) {
	return {
		'id': group.ID,
		'name': group.Name,
		'showName': group.ShowName
	};
}