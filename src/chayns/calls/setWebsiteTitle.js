import { chaynsCall } from '../chaynsCall';
import { propTypes } from '../propTypes';

export function setWebsiteTitle(title) {
	return chaynsCall({
		call: {
			'action': 114,
			'value': {
				title
			}
		},
		app: false,
		propTypes: {
			'title': propTypes.string.isRequired
		}
	});
}