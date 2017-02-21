import { findPerson } from '../chayns/tapp-api/findPerson';
import { findSite } from '../chayns/tapp-api/findSite';
import { delegate } from '../utils';
import throttle from 'lodash.throttle';
import DOM from '../utils/Dom';

const TAKE = 20;
const PERSON = 'person';
const SITE = 'site';

const finderCache = {};
let currentFinder;

export function init(selector) {
	selector = selector || '[finder]';
	document.addEventListener('click', handleBlur);
	delegate(document, selector, 'input', throttledHandleInput);
	delegate(document, selector, 'focus', handleFocus);
}

function handleInput(event) {
	const target = event.target;
	currentFinder.value = target.value;
	currentFinder.skip = 0;

	if (currentFinder.value.length === 0) {
		throttledHandleInput.cancel();
		currentFinder.timestamp = Date.now();
		currentFinder.results = [];
		return removeFinderPopup();
	}

	const container = document.querySelector('#finder-popup') || createFinderPopup(target);
	loadData(container, true);
}

const throttledHandleInput = throttle(handleInput, 500);

function handleFocus(event) {
	currentFinder = getFinderCache(event.target);

	removeFinderPopup();
	const container = createFinderPopup(event.target);
	for (let i = 0; i < currentFinder.results.length; i++) {
		container.append(createItem(currentFinder.results[i]));
	}
}

function handleBlur(event) {
	if (currentFinder && currentFinder.id !== event.target.getAttribute('data-finderId')) {
		removeFinderPopup();
	}
}

function handleLazyLoad(event) {
	const container = event.target;
	const { scrollTop, offsetHeight, scrollHeight } = container;

	//person endpoint doesnt support lazyloading (31.01.2017)
	if (currentFinder.type === PERSON) {
		return;
	}

	if (!currentFinder.isLazyLoading && (scrollHeight - scrollTop - offsetHeight) <= 0 && currentFinder.skip % TAKE === 0) {
		currentFinder.isLazyLoading = true;
		loadData().then(() => {
			currentFinder.isLazyLoading = false;
		});
	}
}

function handleItemClick(result) {
	const target = document.querySelector(`input[data-finderId="${currentFinder.id}"]`);

	target.value = result.personId ? `${result.name} (${result.personId})` : result.name || result.appstoreName;
	const customEvent = new CustomEvent('finderChange', {
		'bubbles': true
	});

	if (result.personId) {
		target.setAttribute('finder-personId', result.personId);
		customEvent.user = result;
	} else {
		target.setAttribute('finder-locationId', result.locationId);
		target.setAttribute('finder-siteId', result.siteId);
		customEvent.siteId = result.siteId;
		customEvent.locationId = result.locationId;
		customEvent.site = result;
	}

	target.dispatchEvent(customEvent);
}

const loadData = (target, clear) => new Promise((resolve, reject) => {
	const container = target || document.querySelector('#finder-popup');
	const timestamp = Date.now();

	(currentFinder.type === PERSON ? findPerson(currentFinder.value, currentFinder.locationId) : findSite(currentFinder.value, currentFinder.skip, TAKE))
		.then((res) => {
			if (currentFinder.timestamp && currentFinder.timestamp > timestamp) {
				return reject({currentFinder, res, message: 'outdated'});
			}

			currentFinder.timestamp = timestamp;
			if (res.Status.ResultCode === 0 || res.Status.ResultCode === 2 || res.Status.ResultCode === 3) {
				const length = res.Value.length;

				if (clear) {
					DOM.clear(container);
				}

				for (let i = 0; i < length; i++) {
					container.append(createItem(res.Value[i]));
				}

				currentFinder.skip += length;
				currentFinder.results = currentFinder.results.concat(res.Value);
			} else if (res.Status.ResultCode === 1) {
				DOM.clear(container);
				container.append(createPlaceholder('Keine Treffer.'));

				currentFinder.skip = 0;
				currentFinder.results = [];
			} else {
				return reject();
			}
			resolve({currentFinder, res, message: 'unhandled status'});
		});
});

function isolateScroll(event) {
	const { scrollTop, offsetHeight, scrollHeight } = this;

	const delta = event.wheelDelta,
		bottomOverflow = (scrollHeight - scrollTop - offsetHeight) <= 0,
		topOverflow = scrollTop <= 0;

	if ((delta < 0 && bottomOverflow) || (delta > 0 && topOverflow)) {
		event.preventDefault();
	}
}

function createFinderPopup($element) {
	const container = document.createElement('div');
	container.setAttribute('id', 'finder-popup');
	container.classList.add('finder__results');
	container.addEventListener('scroll', handleLazyLoad);
	container.addEventListener('mousewheel', isolateScroll);

	const rect = getRelativeElementRect($element);
	container.style.left = rect.relLeft + 'px';
	container.style.top = rect.relBottom + 'px';
	container.style.width = rect.width + 'px';

	document.body.appendChild(container);
	return container;
}

function removeFinderPopup() {
	const container = document.querySelector('#finder-popup');
	return container ? document.body.removeChild(container) : undefined;
}

function createItem(result) {
	const resultItem = document.createElement('div');
	resultItem.classList.add('result');

	const pictureItem = document.createElement('div');
	pictureItem.classList.add('img');

	const picture = document.createElement('img');
	pictureItem.appendChild(picture);

	const textItem = document.createElement('div');
	textItem.classList.add('text');

	const nameItem = document.createElement('div');
	nameItem.classList.add('name');
	textItem.appendChild(nameItem);

	resultItem.appendChild(pictureItem);
	resultItem.appendChild(textItem);

	if (currentFinder.type === PERSON) {
		nameItem.innerHTML = result.name;
		picture.setAttribute('src', `//graph.facebook.com/${result.facebookId}/picture?type=square`);

		const personIdItem = document.createElement('div');
		personIdItem.classList.add('person_id');
		personIdItem.innerHTML = result.personId;
		textItem.appendChild(personIdItem);
	} else {
		nameItem.innerHTML = result.appstoreName;
		picture.setAttribute('src', `//barforce.tobit.com/storage/${result.siteId}/Images/icon-75.png`);
		picture.setAttribute('onerror', `this.onerror=null; this.src = '//graph.facebook.com/${result.facebookId}/picture'`);
	}

	resultItem.addEventListener('click', handleItemClick.bind(undefined, result));

	return resultItem;
}

function createPlaceholder(caption) {
	const placeholder = document.createElement('div');
	placeholder.classList.add('result');

	const text = document.createElement('div');
	text.classList.add('placeholder');
	text.innerHTML = caption;

	placeholder.appendChild(text);
	placeholder.addEventListener('click', (e) => {
		e.preventDefault();
		e.stopPropagation();
	});

	return placeholder;
}

function getRelativeElementRect($element) {
	const rect = $element.getBoundingClientRect();

	rect.relBottom = (rect.bottom + window.pageYOffset - $element.ownerDocument.documentElement.clientTop);
	rect.relLeft = (rect.left + window.pageXOffset - $element.ownerDocument.documentElement.clientLeft);

	return rect;
}

function getFinderCache(target) {
	let id = target.getAttribute('data-finderId');

	if (!id) {
		id = Date.now().toString();
		target.setAttribute('data-finderId', id);
	}

	if (!finderCache.hasOwnProperty(id)) {
		return finderCache[id] = {
			id,
			value: target.value,
			type: target.getAttribute('finder') || PERSON,
			locationId: target.getAttribute('finder-locationId') || -1,
			forceLocationMatch: target.getAttribute('finder-forceLocationMatch') || false,
			isLazyLoading: false,
			skip: 0,
			results: []
		};
	} else {
		return finderCache[id];
	}
}
