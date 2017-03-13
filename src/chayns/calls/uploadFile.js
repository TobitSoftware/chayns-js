import { chaynsCall } from '../chaynsCall';
import { getCallbackName } from '../callback';
import { propTypes } from '../propTypes';
import { showWaitCursor, hideWaitCursor } from './setWaitCursor';
import { uploadToCloud } from '../tapp-api';
import { defer } from '../../utils/defer';



export function uploadFile(serverUrl, mimeType) {
	const callbackName = 'uploadFile';

	return chaynsCall({
		'call': {
			'action': 110,
			'value': {
				serverUrl,
				mimeType,
				'callback': getCallbackName(callbackName)
			}
		},
		'app': {
			'support': {'ios': 5532}
		},
		'web': {
			'fn': webUpload.bind(this, serverUrl, mimeType)
		},
		callbackName,
		'propTypes': {
			'serverUrl': propTypes.string,
			'mimeType': propTypes.number,
			'callback': propTypes.string.isRequired
		}
	});
}

export const mimeType = {
	'DOCUMENT': 0,
	'AUDIO': 1,
	'IMAGE': 2,
	'VIDEO': 3
};

const acceptData = {
	0: 'text/*',
	1: 'audio/*',
	2: 'image/*',
	3: 'video/*'
};

function webUpload(serverUrl, mimeType) {
	const chaynsRoot = document.querySelector('#chayns-root');

	if (!chaynsRoot) {
		return Promise.reject('No chayns root');
	}


	let input = chaynsRoot.querySelector('.chayns__upload-file');
	const deferred = defer();

	if (!input) {
		// create input file element
		input = document.createElement('input');

		input.style.position = 'absolute';
		input.style.top = '-100px';

		input.setAttribute('type', 'file');
		//input.setAttribute('accept', 'image/*');
		input.setAttribute('accept', acceptData[mimeType]);
		input.setAttribute('onchange', '_chaynsFileChosen()');
		input.classList.add('chayns__upload-file');

		chaynsRoot.appendChild(input);
	}

	window._chaynsFileChosen = function _chaynsFileChosen() {
		if (input.files && input.files.length > 0) {
			showWaitCursor();
			uploadToCloud(serverUrl, input.files[0])
				.then(deferred.resolve)
				.catch(deferred.reject)
				.then(hideWaitCursor);
		}
		window._chaynsFileChosen = undefined;
	};

	input.value = null;
	input.click();

	return deferred.promise;
}
