import { Binding } from "domodel"

import FormEventListener from "./form.event.js"

class FormBinding extends Binding {

	/**
	 * @param {object} properties
	 * @param {Form}   properties.form
	 */
	constructor(properties) {
		super(properties, new FormEventListener(properties.form))
	}

	onCreated() {

		const { form } = this.properties

		this.keys = Object.keys(this.identifier)

		this.root.addEventListener("submit", event => {
			event.preventDefault()
			form.emit("submit")
		})

	}

}

export default FormBinding
