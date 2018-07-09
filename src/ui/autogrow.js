import { delegate } from '../utils/delegate';

let isInitialized = false;

export function init(parent) {
	if (!isInitialized) {
		delegate((parent || document), '[autogrow]', 'input', initialGrow);
		isInitialized = true;
	}

	if (parent && parent.hasAttribute('autogrow')) {
		initialGrow.call(parent);
	}

	const $inputs = (parent || document).querySelectorAll('[autogrow]');
	for (let i = 0, l = $inputs.length; i < l; i++) {
		initialGrow.call($inputs[i]);
	}
}

function initialGrow() {
	const offset = this.offsetHeight - this.clientHeight;
    this.setAttribute('rows', '1');
	this.addEventListener('input', grow.bind(this, offset, 'auto'));
    grow.call(this, offset, 'auto');

	this.removeAttribute('autogrow');
    this.style.overflow = 'hidden';
}

function grow(offset, initHeight) {
	if (initHeight) {
		this.style.height = initHeight;
	}

	if (this.scrollHeight + offset > 0) {
		this.style.height = `${this.scrollHeight + offset}px`;
	}
}
