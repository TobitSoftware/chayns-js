import { delegate } from '../utils/delegate';
import DOM from '../utils/Dom';

const clickTriggers = `
	.accordion .accordion__head,
	.accordion .accordion__head .arrow,
	.accordion .accordion__head .accordion--trigger,
	.accordion .accordion__head .accordion--trigger *,
	.accordion .accordion__head .ellipsis
`;

export function init(selector) {
	selector = selector || clickTriggers;
	delegate(document, selector, 'click', handleClickEvent);
}

function handleClickEvent(e) {
	let target = e.target;

	// also include elements with .arrow, .accordion--trigger and .ellipsis
	if (DOM.hasClass(target, 'arrow', 'ellipsis') || !!DOM.getElementByClass(target, 'accordion--trigger', 'accordion__head')) {
		target = DOM.getElementByClass(target, 'accordion__head', 'accordion');
	}

	if (target) {
		toggleAccordion(target.parentElement, target);
		e.preventDefault();
		e.stopPropagation();
	}
}

function toggleAccordion(accordion, target) {
	const body = accordion.querySelector('.accordion__body'),
		classList = accordion.classList;

	// skip choosebutton and box fields
	if (DOM.hasClass(target, 'choosebutton', 'box') || classList.contains('accordion--fixed') || classList.contains('accordion--disabled') || classList.contains('accordion--controlled')) {
		return;
	}

	if (!classList.contains('accordion--open')) {
		const groupId = accordion.getAttribute('data-group');

		if (groupId) {
			const elements = document.querySelectorAll(`.accordion[data-group="${groupId}"].accordion--open`);

			if (elements && elements.length) {
				for (let i = 0, l = elements.length; i < l; i++) {
					closeAccordion(elements[i].querySelector('.accordion__body'), elements[i], elements[i].classList);
				}
			}
		}

		openAccordion(body, accordion, classList);
	} else {
		closeAccordion(body, accordion, classList);
	}
}

function openAccordion(body, accordion, classList) {
	trigger(accordion, 'open');

	function listener() {
		if (classList.contains('accordion--open')) {
			trigger(accordion, 'opened');
		}

		body.removeEventListener('transitionend', listener);
		body.hasOpenedListener = false;
	}

	if (!body.hasOpenedListener) {
		body.addEventListener('transitionend', listener, false);
		body.hasOpenedListener = true;
	}

	classList.add('accordion--open');
}

function closeAccordion(body, accordion, classList) {
	trigger(accordion, 'close');

	function listener() {
		if (!classList.contains('accordion--open')) {
			trigger(accordion, 'closed');
		}

		body.removeEventListener('transitionend', listener);
		body.hasClosedListener = false;
	}

	if (!body.hasClosedListener) {
		body.addEventListener('transitionend', listener, false);
		body.hasClosedListener = true;
	}

	classList.remove('accordion--open');
}

function trigger(element, eventName) {
	const event = new CustomEvent(eventName, {
		'bubbles': false
	});

	return !element.dispatchEvent(event);
}

export function closeAccordions($parent) {
	const accordions = ($parent || document).querySelectorAll('.accordion--open');

	for (let i = 0, l = accordions.length; i < l; i++) {
		closeAccordion(accordions[i].querySelector('.accordion__body'), accordions[i], accordions[i].classList);
	}
}
