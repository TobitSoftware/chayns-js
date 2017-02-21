import { chaynsCall } from '../chaynsCall';
import { propTypes } from '../propTypes';
import { getCallbackName } from '../callback';
import { uploadImageToServer } from '../tapp-api/uploadImageToServer';
import { defer } from '../../utils/defer';
import { showWaitCursor, hideWaitCursor } from './setWaitCursor';

export function uploadImage(maxHeight, maxWidth) {
	const callbackName = 'uploadImage';

	return chaynsCall({
		'call': {
			'action': 21,
			'value': {
				maxHeight,
				maxWidth,
				'callback': getCallbackName(callbackName)
			}
		},
		'app': {
			'support': {'android': 4728, 'ios': 4301}
		},
		'web': {
			'fn': webUpload.bind(this, maxHeight, maxWidth)
		},
		callbackName,
		'propTypes': {
			'callback': propTypes.string.isRequired,
			'maxHeight': propTypes.number,
			'maxWidth': propTypes.number
		}
	}).then((data) => Promise.resolve((data && data.url) ? data.url.replace('http://', 'https://') : data));
}

function webUpload(maxHeight, maxWidth) {
	const chaynsRoot = document.querySelector('#chayns-root');

	if (!chaynsRoot) {
		return Promise.reject('No chayns root');
	}

	let input = chaynsRoot.querySelector('.chayns__upload-image');
	const deferred = defer();

	if (!input) {
		// create input file element
		input = document.createElement('input');

		input.style.position = 'absolute';
		input.style.top = '-100px';

		input.setAttribute('type', 'file');
		input.setAttribute('accept', 'image/*');
		input.setAttribute('onchange', '_chaynsImageChosen()');
		input.classList.add('chayns__upload-image');

		chaynsRoot.appendChild(input);
	}

	window._chaynsImageChosen = function _chaynsImageChosen() {
		if (input.files && input.files.length > 0) {
			showWaitCursor();
			uploadImageToServer(input.files[0], maxHeight, maxWidth)
				.then(deferred.resolve)
				.catch(deferred.reject)
				.then(hideWaitCursor);
		}
		window._chaynsImageChosen = undefined;
	};

	input.value = null;
	input.click();

	return deferred.promise;
}
