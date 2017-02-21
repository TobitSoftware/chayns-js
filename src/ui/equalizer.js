const dimension = {
	'WIDTH': 'width',
	'HEIGHT': 'height'
};

/**
 * Initializes equalizer
 */
export function init(element) {
	const parents = Array.prototype.slice.call((element || document).querySelectorAll('[data-equalize]'));

	if (element && element.hasAttribute('data-equalize')) {
		parents.push(element);
	}

	for (let i = 0, l = parents.length; i < l; i++) {
		const parent = parents[i];
		const equalizeId = parent.getAttribute('data-equalize') || '';

		// equalize width
		let elements = parent.querySelectorAll(`[data-equalize-width="${equalizeId}"]`);
		if (elements.length) {
			equalize(elements, dimension.WIDTH);
		}

		// equalize height
		elements = parent.querySelectorAll(`[data-equalize-height="${equalizeId}"]`);
		if (elements.length) {
			equalize(elements, dimension.HEIGHT);
		}

		// equalize both
		elements = parent.querySelectorAll(`[data-equalize-both="${equalizeId}"]`);
		if (elements.length) {
			equalize(elements, dimension.WIDTH);
			equalize(elements, dimension.HEIGHT);
		}
	}
}

/**
 * Equalizes the dimension of the specified elements.
 *
 * @param elements Elements to be equalized
 * @param d Dimension
 */
function equalize(elements, d) {
	let max = 0;
	const length = elements.length;

	if (length > 1) {
		let currentDim;

		for (let i = 0; i < length; i++) {
			currentDim = Math.ceil(elements[i].getBoundingClientRect()[d]);

			// find maximum dimension
			if (max < currentDim) {
				max = currentDim;
			}
		}

		if (max > 0) {
			// set all elements to max dimension
			for (let i = 0; i < length; i++) {
				elements[i].style[d] = `${max}px`;
			}
		}
	}
}
