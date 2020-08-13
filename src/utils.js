var equal = require('fast-deep-equal/es6');


/**
 * General utilities
 * 
 * @class
 */
class Utils {

	/**
	 * Checks whether a variable is a real object or not.
	 * 
	 * This is a more strict version of `typeof x === 'object'` as this example would also succeeds for arrays and `null`.
	 * This function only returns `true` for real objects and not for arrays, `null` or any other data types.
	 * 
	 * @param {*} obj - A variable to check.
	 * @returns {boolean} - `true` is the given variable is an object, `false` otherwise.
	 */
	static isObject(obj) {
		return (typeof obj === 'object' && obj === Object(obj) && !Array.isArray(obj));
	}

	/**
	 * Performs a deep comparison between two values to determine if they are equivalent.
	 * 
	 * @param {*} x - The value to compare.
	 * @param {*} y - The other value to compare.
	 * @returns {boolean} - Returns true if the values are equivalent, else false.
	 */
	static equals(x, y) {
		return equal(x, y);
	}

	/**
	 * Creates an object composed of the picked object properties.
	 * 
	 * Returns a shallow copy!
	 * 
	 * @param {object} obj - The source object.
	 * @param {string|array} toPick - The properties to pick.
	 * @returns {object}
	 */
	static pickFromObject(obj, toPick) {
		obj = Object(obj);
		if (typeof toPick === 'string') {
			toPick = [toPick];
		}
		const copy = {};
		toPick.forEach(key => copy[key] = obj[key]);
		return copy;
	}

	/**
	 * This method creates an object composed of the own and inherited enumerable property paths of object that are not omitted.
	 * 
	 * Returns a shallow copy!
	 * 
	 * @param {object} obj - The source object.
	 * @param {string|array} toOmit - The properties to omit.
	 * @returns {object}
	 */
	static omitFromObject(obj, toOmit) {
		obj = Object(obj);
		if (typeof toOmit === 'string') {
			toOmit = [toOmit];
		}
		var copy = Object.assign({}, obj);
		for(let key of toOmit) {
			delete copy[key];
		}
		return copy;
	}

	/**
	 *  Creates an array of values by running each property of `object` thru function.
	 * 
	 * The function is invoked with three arguments: (value, key, object).
	 * 
	 * @param {object} obj 
	 * @param {function} func 
	 * @returns {object}
	 */
	static mapObject(obj, func) {
		// Taken from lodash, see https://github.com/lodash/lodash/blob/master/mapObject.js
		const props = Object.keys(obj);
		const result = new Array(props.length);
		props.forEach((key, index) => {
			result[index] = func(obj[key], key, obj);
		});
		return result;
	}

	/**
	 * Creates an object with the same keys as object and values generated by running each own enumerable string keyed property of object thru the function.
	 * 
	 * The function is invoked with three arguments: (value, key, object).
	 * 
	 * @param {object} obj 
	 * @param {function} func 
	 * @returns {object}
	 */
	static mapObjectValues(obj, func) {
		// Taken from lodash, see https://github.com/lodash/lodash/blob/master/mapValue.js
		obj = Object(obj);
		const result = {};
		Object.keys(obj).forEach((key) => {
			result[key] = func(obj[key], key, obj);
		});
		return result;
	}

	/**
	 * Creates a duplicate-free version of an array.
	 * 
	 * If useEquals is set to true, uses the `Utils.equals` function for comparison instead of 
	 * the JS === operator. Thus, if the array contains objects, you likely want to set 
	 * `useEquals` to `true`.
	 * 
	 * @param {array} array
	 * @param {boolean} useEquals
	 * @returns {array}
	 */
	static unique(array, useEquals = false) {
		if (useEquals) {
			return array.filter((s1, pos, arr) => arr.findIndex(s2 => Utils.equals(s1, s2)) === pos);
		}
		else {
			return [...new Set(array)];
		}
	}
	
	/**
	 * Computes the size of an array (number of array elements) or object (number of key-value-pairs).
	 * 
	 * Returns 0 for all other data types.
	 * 
	 * @param {*} obj 
	 * @returns {integer}
	 */
	static size(obj) {
		if (typeof obj === 'object' && obj !== null) {
			if (Array.isArray(obj)) {
				return obj.length;
			}
			else {
				return Object.keys(obj).length;
			}
		}
		return 0;
	}

	/**
	 * Checks whether a variable is numeric.
	 * 
	 * Numeric is every string with numeric data or a number, excluding NaN and finite numbers.
	 * 
	 * @param {*} n - A variable to check.
	 * @returns {boolean} - `true` is the given variable is numeric, `false` otherwise.
	 */
	static isNumeric(n) {
		return !isNaN(parseFloat(n)) && isFinite(n);
    }
    
    /**
     * Deep clone for JSON-compatible data.
     * 
     * @param {*} x - The data to clone.
     * @returns {*} - The cloned data.
     */
    static deepClone(x) {
		return JSON.parse(JSON.stringify(x));
    }

	/**
	 * Normalize a URL (mostly handling leading and trailing slashes).
	 * 
	 * @static
	 * @param {string} baseUrl - The URL to normalize
	 * @param {string} path - An optional path to add to the URL
	 * @returns {string} Normalized URL.
	 */
	static normalizeUrl(baseUrl, path = null) {
		let url = baseUrl.replace(/\/$/, ""); // Remove trailing slash from base URL
		if (typeof path === 'string') {
			if (path.substr(0, 1) !== '/') {
				path = '/' + path; // Add leading slash to path
			}
			url = url + path.replace(/\/$/, ""); // Remove trailing slash from path
		}
		return url;
	}

	/**
	 * Replaces placeholders in this format: `{var}`.
	 * 
	 * This can be used for the placeholders/variables in the openEO API's errors.json file.
	 * 
	 * @param {string} message - The string to replace the placeholders in.
	 * @param {object} variables - A map with the placeholder names as keys and the replacement value as value.
	 */
	static replacePlaceholders(message, variables = {}) {
		if (typeof message === 'string' && Utils.isObject(variables)) {
			for(var placeholder in variables) {
				let vars = variables[placeholder];
				message = message.replace('{' + placeholder + '}', Array.isArray(vars) ? vars.join("; ") : vars);
			}
		}
		return message;
	}

	/**
	 * Compares two strings case-insensitive, including natural ordering for numbers.
	 * 
	 * @param {string} a 
	 * @param {string} b 
	 * @returns {integer} Numeric value compatible with the [Array.sort(fn) interface](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/sort#Parameters).
	 */
    static compareStringCaseInsensitive(a, b) {
        if (typeof a !== 'string') {
            a = String(a);
        }
        if (typeof b !== 'string') {
            b = String(b);
        }
        return a.localeCompare(b, undefined, {numeric: true, sensitivity: 'base'});
    }

	/**
	 * Tries to make a string more readable by capitalizing it.
	 * Only applies to words with more than two characters.
	 * 
	 * Supports converting from:
	 * - Snake Case (abc_def => Abc Def)
	 * - Kebab Case (abc-def => Abc Def)
	 * - Camel Case (abcDef => Abc Def)
	 * 
	 * Doesn't capitalize if the words are not in any of the casing formats above.
	 * 
	 * @param {*} strings - String(s) to make readable
	 * @param {string} arraySep - String to separate array elements with
	 * @returns {string}
	 */
    static prettifyString(strings, arraySep = '; ') {
		if (!Array.isArray(strings)) {
			strings = [String(strings)];
		}
		strings = strings.map(str => {
			if (str.length >= 3) {
				const replacer = (_,a,b) => a + ' ' + b.toUpperCase();
				if (str.includes('_')) {
					// Snake case converter
					str = str.replace(/([a-zA-Z\d])_([a-zA-Z\d])/g, replacer);
				}
				else if (str.includes('-')) {
					// Kebab case converter
					str = str.replace(/([a-zA-Z\d])-([a-zA-Z\d])/g, replacer);
				}
				else {
					// Camelcase converter
					str = str.replace(/([a-z])([A-Z])/g, replacer);
				}
				// Uppercase the first letter in the first word, too.
				return str.charAt(0).toUpperCase() + str.substr(1);
			}
			return str;
		});
		return strings.join(arraySep);	
    }

	/**
	 * Makes link lists from the openEO API more user-friendly.
	 * 
	 * Supports:
	 * - Set a reasonable title, if not available. Make title more readable.
	 * - Sorting by title (see `sort` parameter)
	 * - Removing given relation types (`rel` property, see `ignoreRel` parameter)
	 * 
	 * @param {array} linkList - List of links
	 * @param {boolean} sort - Enable/Disable sorting by title. Enabled (true) by default.
	 * @param {array} ignoreRel - A list of rel types to remove. By default, removes the self links (rel type = `self`).
	 * @returns {array}
	 */
    static friendlyLinks(linkList, sort = true, ignoreRel = ['self']) {
        let links = [];
        if (!Array.isArray(linkList)) {
            return links;
        }

        for(let link of linkList) {
            link = Object.assign({}, link); // Make sure to work on a copy
            if (typeof link.rel === 'string' && ignoreRel.includes(link.rel.toLowerCase())) {
                continue;
            }
            if (typeof link.title !== 'string' || link.title.length === 0) {
                if (typeof link.rel === 'string' && link.rel.length > 1) {
                    link.title = Utils.prettifyString(link.rel);
                }
                else {
                    link.title = link.href.replace(/^https?:\/\/(www.)?/i, '').replace(/\/$/i, '');
                }
            }
            links.push(link);
        }
        if (sort) {
            links.sort((a, b) => Utils.compareStringCaseInsensitive(a.title, b.title));
        }
        return links;
    }

}

module.exports = Utils;