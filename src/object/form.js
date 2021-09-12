import { Observable } from "domodel"

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
	 * @type {object}
	 */
	get initialData() {
		return this._initialData
	}

	/**
	 * @type {object}
	 */
	get data() {
		return this._data
	}

}

export default Form
