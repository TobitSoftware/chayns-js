import {delegate} from '../utils/delegate';
import {isArray} from '../utils/is';
import DOM from '../utils/Dom';
import {openImage} from '../chayns/calls/openImage';

const galleryUrls = {};

/**
 * Initializes gallery listener
 */
export function init($element) {
	delegate($element || document, '.gallery__item', 'click', openGalleryImages);
}

/**
 * shows the gallery
 */
function openGalleryImages() {
	const $gallery = this.parentNode,
		$children = $gallery.children,
		name = $gallery.getAttribute('gallery');
	let start = 0;

	if (!galleryUrls.hasOwnProperty(name) || ($children.length <= 5 && galleryUrls[name].length <= 5 && $children.length !== galleryUrls[name].length)) {
		galleryUrls[name] = [];

		for (let i = 0, l = $children.length; i < l; i++) {
			const url = $children[i].style.backgroundImage;
			galleryUrls[name].push(url.substring(4, url.length - 1).replace(/"/g, ''));
		}
	}

	for (let i = 0, l = $children.length; i < l; i++) {
		if ($children[i] === (this)) {
			start = i;
			break;
		}
	}

	openImage(galleryUrls[name], start);
}


/**
 * @param name
 * @returns {*}
 */
export function getUrls(name) {
	return galleryUrls[name];
}

/**
 * @param name
 * @param urls
 */
export function setUrls(name, urls) {
	if (isArray(urls) && urls.length > 0) {
		galleryUrls[name] = urls;
		buildGallery(document.querySelector(`[gallery=${name}]`), galleryUrls[name]);
		return true;
	}
	return false;
}

/**
 * @param name
 * @param url
 * @returns {*}
 */
export function addUrl(name, url) {
	if (galleryUrls.hasOwnProperty(name)) {
		galleryUrls[name].push(url);
		buildGallery(document.querySelector(`[gallery=${name}]`), galleryUrls[name]);
		return true;
	}
	return false;
}

/**
 * @param name
 * @param url
 * @returns {*}
 */
export function removeUrl(name, url) {
	if (galleryUrls.hasOwnProperty(name) && galleryUrls[name].length > 1) {
		const index = galleryUrls[name].indexOf(url);

		if (index > -1) {
			galleryUrls[name].splice(index, 1);
			buildGallery(document.querySelector(`[gallery=${name}]`), galleryUrls[name]);
			return true;
		}
	}

	return false;
}

/**
 * @param name
 * @param urls
 * @returns {*}
 */
export function create(name, urls) {
	if (isArray(urls) && urls.length > 0) {
		const $gallery = document.createElement('div');
		$gallery.setAttribute('gallery', name);

		galleryUrls[name] = urls;

		return buildGallery($gallery, urls);
	}

	return false;
}

/**
 * @param $gallery
 * @param urls
 * @returns {*}
 */
function buildGallery($gallery, urls) {
	DOM.clear($gallery);

	for (let i = 0, l = urls.length; i < l && i < 5; i++) {
		$gallery.appendChild(createGalleryItem(urls[i]));
	}

	return $gallery;
}

/**
 * creates a gallery item
 * @param url
 */
function createGalleryItem(url) {
	const $item = document.createElement('div');

	$item.classList.add('gallery__item');
	$item.style.backgroundImage = `url(${url})`;

	return $item;
}
