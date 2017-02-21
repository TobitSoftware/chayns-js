import { delegate } from '../utils/delegate';

let isInitialized = false;

export function init(root) {
	if (!isInitialized) {
		delegate(document, '[validate]', 'input', validateListener);
	}

	const $inputs = (root || document).querySelectorAll('[validate]');
	for (let i = 0, l = $inputs.length; i < l; i++) {
		validateListener({
			'target': $inputs[i]
		});
	}

	isInitialized = true;
}

function validateListener(event) {
	const $target = event.target,
		regex = $target.getAttribute('validate');

	if ((!regex && $target.value.length > 0) || regex && new RegExp(regex).test($target.value)) {
		$target.classList.add('valid');
	} else {
		$target.classList.remove('valid');
	}
}
