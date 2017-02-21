import { delegate } from '../utils/delegate';
import { getSchemeColor } from '../chayns/colors';
import { environment } from '../chayns/environment';

export function init() {
	delegate(document, '.slider', 'mouseup', blurEventListener);

	if (environment.browser.name === 'chrome' || chayns.env.isIOS) {
		delegate(document, '.slider', 'input', inputEventListener);
		refreshTrack();
	}
}

export function refreshTrack() {
	if (environment.browser.name === 'chrome' || chayns.env.isIOS) {
		const $slider = document.querySelectorAll('.slider');

		for (let i = 0, l = $slider.length; i < l; i++) {
			inputEventListener({
				'target': $slider[i]
			});
		}
	}
}

export function inputEventListener(event) {
	const target = event.target,
		color = getSchemeColor();

	const min = parseFloat(target.min),
		max = parseFloat(target.max),
		value = parseFloat(target.value);

	const percent = Math.ceil((value - min) / (max - min) * 100);
	target.style.background = `-webkit-linear-gradient(left, ${color} 0%, ${color} ${percent}%, #ddd ${percent}%`;
}

function blurEventListener(event) {
	event.target.blur();
}
