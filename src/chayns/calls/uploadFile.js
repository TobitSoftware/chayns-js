import {chaynsCall} from '../chaynsCall';
import {getCallbackName} from '../callback';
import {propTypes} from '../propTypes';
import {hideWaitCursor, showWaitCursor} from './setWaitCursor';
import {uploadToCloud} from '../tapp-api';
import { environment } from '../environment';

export function uploadCloudImage() {
    let uploadUrl, imageUrl;
    if (environment.isApp || environment.isMyChaynsApp) {
        uploadUrl = 'https://tsimg.space/v1/images';
        imageUrl = 'https://tsimg.space';
    } else {
        uploadUrl = 'https://api.tsimg.cloud/image';
        imageUrl = 'https://tsimg.cloud';
    }

    return uploadFile(uploadUrl, chayns.mimeType.IMAGE).then((data) => {
        if (data.response.statusCode !== 200) {
            return data;
        }

        try {
            let img = JSON.parse(data.response.data);
            if (img.imageLocations) {
                img.url = `${imageUrl}${img.imageLocations[0]}`;
            } else if (img.key) {
                img.url = `${imageUrl}/${img.key}`;
                img.imageLocations = ['/' + data.key];
            }
            return img;
        } catch (err) {
            return err;
        }
    });
}

export function uploadFile(serverUrl, mimeType, statusCodes) {
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
            'support': {'ios': 5532, 'android': 5491}
        },
        'web': {
            'fn': webUpload.bind(this, serverUrl, mimeType, statusCodes)
        },
        'myChaynsApp': {
            'support': {'ios': 5764, 'android': 5708}
        },
        callbackName,
        'propTypes': {
            'serverUrl': propTypes.string,
            'mimeType': propTypes.number,
            'callback': propTypes.string.isRequired
        }
    });
}

function webUpload(serverUrl, mimeType, statusCodes) {
    const chaynsRoot = document.querySelector('#chayns-root');

    if (!chaynsRoot) {
        return Promise.reject('No chayns root');
    }


    let input = chaynsRoot.querySelector('.chayns__upload-file');

    if (!input) {
        // create input file element
        input = document.createElement('input');

        input.style.position = 'absolute';
        input.style.top = '-100px';

        input.setAttribute('type', 'file');
        // input.setAttribute('accept', 'image/*');
        input.setAttribute('onchange', '_chaynsFileChosen()');
        input.classList.add('chayns__upload-file');

        chaynsRoot.appendChild(input);
    }

    return new Promise((resolve, reject) => {
        window._chaynsFileChosen = function _chaynsFileChosen() {
            if (input.files && input.files.length > 0) {
                showWaitCursor();
                if (serverUrl === 'https://api.tsimg.cloud/image') {
                    const reader = new FileReader();
                    reader.onload = (e) => uploadToCloud(serverUrl, e.target.result, statusCodes).then(resolve)
                        .catch(reject)
                        .then(hideWaitCursor);
                    reader.onerror = reject;
                    reader.readAsArrayBuffer(input.files[0]);
                } else {
                    uploadToCloud(serverUrl, input.files[0], statusCodes)
                        .then(resolve)
                        .catch(reject)
                        .then(hideWaitCursor);
                }
            }
            window._chaynsFileChosen = undefined;
        };

        input.setAttribute('accept', acceptData[mimeType]);
        input.value = null;
        input.click();
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
