import { Observable } from "domodel"

/**
 * @global
 */
class Form extends Observable {

	/**
	 * @param {object} initialData
	 */
	constructor(initialData) {
		super()
		this._initialData = initialData
		this._data = {}
	}

	/**
	 * @readonly
	 * @type {object}
	 */
	get initialData() {
		return this._initialData
	}

	/**
	 * @readonly
	 * @type {object}
	 */
	get data() {
		return this._data
	}

}

export default Form
