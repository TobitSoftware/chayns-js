import { environment } from '../chayns/environment';
import { getWindowMetrics } from '../chayns/calls/getWindowMetrics';

let _config,
	tooltipClass,
	preventAnimation,
	animationTimeout,

	$doc,
	$tooltip;

const HORIZONTAL_OFFSET = 10,
	VERTICAL_OFFSET = 20;

/**
 * @param config
 * @param rootElement
 */
export function init(config, rootElement) {
	const tooltips = (rootElement || document).querySelectorAll('[tooltip]');
	const customTooltips = (rootElement || document).querySelectorAll('[custom-tooltip]');

	if ((tooltips.length + customTooltips.length) === 0) {
		return false;
	}

	if (config) {
		_config = config;
		tooltipClass = config.tooltipClass;
		preventAnimation = config.preventAnimation;
	}

	$doc = document.documentElement;

	const element = document.createElement('span');
	element.innerHTML = '?';
	element.classList.add('chayns__tooltip--trigger');
	for (let i = 0, length = tooltips.length; i < length; i++) {
		if (!hasTrigger(tooltips[i])) {
			const curElement = element.cloneNode(true);
			curElement.addEventListener('mouseenter', showTooltip);
			curElement.addEventListener('mouseleave', hideTooltip);
			tooltips[i].appendChild(curElement);
		}
	}

	for (let i = 0, length = customTooltips.length; i < length; i++) {
		customTooltips[i].addEventListener('mouseenter', showTooltip);
		customTooltips[i].addEventListener('mouseleave', hideTooltip);
	}

	const root = document.querySelector('.chayns__root');
	$tooltip = root.querySelector('.chayns__tooltip');
	if (!$tooltip) {
		$tooltip = document.createElement('span');
		$tooltip.classList.add('chayns__tooltip', 'chayns__tooltip--hidden');

		if (!preventAnimation) {
			$tooltip.classList.add('chayns__tooltip--animation');
		}

		if (tooltipClass) {
			$tooltip.classList.add(tooltipClass);
		}

		root.appendChild($tooltip);
	}
	return true;
}

/**
 * @param element
 * @returns {boolean}
 */
function hasTrigger(element) {
	const children = element.children;

	for (let i = 0, l = children.length; i < l; i++) {
		if (children[i].classList.contains('chayns__tooltip--trigger')) {
			return true;
		}
	}

	return false;
}

/**
 * @param event
 */
function showTooltip(event) {
	let yOffset = 0;

	getWindowMetrics()
		.then((data) => {
			yOffset = data.scrollTop;
		}, undefined)
		.then(() => {
			if (animationTimeout) {
				clearTimeout(animationTimeout);
			}

			const trigger = event.target;
			const triggerRect = trigger.getBoundingClientRect();

			$tooltip.innerHTML = (trigger.parentNode.getAttribute('tooltip') || trigger.getAttribute('custom-tooltip'));
			const tooltipRect = $tooltip.getBoundingClientRect();

			triggerRect.relativeTop = (triggerRect.top - $doc.clientTop + (environment.isApp || !environment.isInFrame ? yOffset : 0));

			const top = (triggerRect.relativeTop - tooltipRect.height - HORIZONTAL_OFFSET - (parseInt(document.body.style.paddingTop) || 0));
			if (top < yOffset) {
				//below trigger
				$tooltip.style.top = `${triggerRect.relativeTop + triggerRect.height + HORIZONTAL_OFFSET}px`;
			} else {
				//above trigger
				$tooltip.style.top = `${top}px`;
			}

			const left = triggerRect.left + (triggerRect.width / 2) - tooltipRect.width / 2;
			if (left < VERTICAL_OFFSET) {
				//margin left
				$tooltip.style.left = `${VERTICAL_OFFSET}px`;
			} else if ((left + tooltipRect.width) > ($doc.clientWidth - VERTICAL_OFFSET)) {
				//margin right
				$tooltip.style.left = `${$doc.clientWidth - tooltipRect.width - VERTICAL_OFFSET}px`;
			} else {
				//centered
				$tooltip.style.left = `${left}px`;
			}

			$tooltip.classList.remove('chayns__tooltip--hidden');
		});
}

/**
 *
 */
function hideTooltip() {
	$tooltip.classList.add('chayns__tooltip--hidden');
	animationTimeout = setTimeout(() => {
		$tooltip.style.left = '';
		$tooltip.style.top = '';
		$tooltip.innerHTML = '';
		animationTimeout = null;
	}, preventAnimation ? 0 : 350);
}
