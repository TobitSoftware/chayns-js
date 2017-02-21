import { chaynsCall } from '../chaynsCall';
import { propTypes } from '../propTypes';

export function updateChaynsWeb(component, param) {
	return chaynsCall({
		'call': {
			'action': 101,
			'value': {
				component,
				param
			}
		},
		'app': false,
		'propTypes': {
			'component': propTypes.string.isRequired,
			'param': propTypes.oneOfType([
				propTypes.string,
				propTypes.object,
				propTypes.boolean
			]).isRequired
		}
	});
}
