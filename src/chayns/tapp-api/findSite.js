import { tappApi } from './tappApi';

export function findSite(query, skip = 0, take = 20) {
	return tappApi(`Site/SlitteAppBySearchString?SearchString=${query}&Skip=${skip}&Take=${take}`, true)
		.then((json) => json);
}