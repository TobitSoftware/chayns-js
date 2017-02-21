import { TAPP_API_URL } from './tappApi';

export function uploadImageToServer(file, maxHeight, maxWidth) {
	const form = new FormData();

	form.append('Image', file);
	if (maxWidth) {
		form.append('maxHeight', maxHeight);
	}
	if (maxWidth) {
		form.append('maxWidth', maxWidth);
	}

	return fetch(`${TAPP_API_URL}File/Image`, {
		'method': 'post',
		'body': form
	})
		.then((resp) => resp.status === 200 ? resp.json() : Promise.reject(resp))
		.then((data) => Promise.resolve(data.Data));
}