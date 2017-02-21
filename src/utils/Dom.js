export default class DOM {

	/**
	 * Removes class of element, if element is not null.
	 *
	 * @param {Node} $element Element
	 * @param {string} c Class to remove
	 * @returns {undefined}
	 */
	static removeClass($element, c) {
		if ($element) {
			$element.classList.remove(c);
		}
	}

	/**
	 * Removes attribute of element, if element is not null.
	 *
	 * @param {Node} $element Element
	 * @param {string} attribute Attribute to remove
	 * @returns {undefined}
	 */
	static removeAttribute($element, attribute) {
		if ($element) {
			$element.removeAttribute(attribute);
		}
	}

	/**
	 * Checks if the element contains one of the specified classes.
	 *
	 * @param {Node} $element Element
	 * @param {...string} classes Classes to look for
	 * @returns {boolean} Returns true if one of the classes was found
	 */
	static hasClass($element, ...classes) {
		if ($element) {
			const classList = $element.classList,
				classesLength = classes.length;

			for (let i = 0, l = classList.length; i < l; i++) {
				for (let j = 0; j < classesLength; j++) {
					if (classList[i] === classes[j]) {
						return true;
					}
				}
			}
		}

		return false;
	}

	/**
	 * Searches all children of the element and looks for the class.
	 *
	 * @param {Node} $element Element
	 * @param {string} className Classe to look for
	 * @param {string} stop If the element is not found the search will stop here
	 * @returns {*} Returns the first element or null if nothing was found
	 */
	static getElementByClass($element, className, stop) {
		while (!this.hasClass($element, stop || 'tapp')) {
			if (this.hasClass($element, className)) {
				return $element;
			}
			$element = $element.parentNode;
		}

		return null;
	}

	/**
	 * Removes all children from an element.
	 *
	 * @param {Node} $element element
	 * @returns {undefined}
	 */
	static clear($element) {
		if (!$element) {
			return;
		}

		while ($element.firstChild) {
			$element.removeChild($element.firstChild);
		}
	}

};
