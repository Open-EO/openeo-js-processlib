/** General utilities */
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
	 * Tries to make a string more readable.
	 * 
	 * Supports converting from:
	 * - Snake Case (abc_def)
	 * - Kebab Case (abc-def)
	 * - Camel Case (abcDef)
	 * 
	 * @param {string} str String to make readable.
	 * @returns {string}
	 */
    static prettifyString(str) {
        if(Utils.isNumeric(str)) {
            return str;
        }
        else if (str.length >= 2) {
            if (str.includes('_')) {
                // Snake case converter
                str = str.replace(/([a-zA-Z\d])_([a-zA-Z\d])/g, '$1 $2');
            }
            else if (str.includes('-')) {
                // Kebab case converter
                str = str.replace(/([a-zA-Z\d])-([a-zA-Z\d])/g, '$1 $2');
            }
            else {
                // Camelcase converter
                str = str.replace(/([a-z])([A-Z])/g, '$1 $2');
            }
            // Uppercase the first letter in the first word
            return str.charAt(0).toUpperCase() + str.substr(1);
        }
        else {
            return String(str);
        }
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