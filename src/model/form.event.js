import { EventListener } from "domodel"

/**
 * @global
 */
class FormEventListener extends EventListener {

	/**
	 * @event FormEventListener#submitted
	 * @property {object} data
	 *
	*/

	/**
	 * @event FormEventListener#focus
	 */
	focus() {
		this.identifier[this.keys[0]].focus()
	}

	/**
	 * @event FormEventListener#load
	 * @property {object} data
	 */
	load(data) {
		for(const key in data) {
			if (!(key in this.identifier)) {
				continue;
			}
			if(this.identifier[key].tagName === "INPUT" && this.identifier[key].type === "checkbox") {
				this.identifier[key].checked = data[key] || false
			} else if(this.identifier[key].tagName === "INPUT" && this.identifier[key].type === "radio") {
				[...this.root.querySelectorAll(`input[name=${this.identifier[key].name}]`)].find(element => element.value == data[key]).checked = true
			} else if(this.identifier[key].tagName === "INPUT" && this.identifier[key].type === "date" && data[key] instanceof Date) {
				this.identifier[key].valueAsDate = data[key]
			} else if(this.identifier[key].tagName === "SELECT") {
				let value
				if(typeof data[key] !== "string") {
					value = `${data[key]}`
				} else {
					value = data[key]
				}
				for(const option of this.identifier[key].options) {
					if(option.value === value) {
						option.selected = true
						break
					}
				}
			} else {
				this.identifier[key].value = data[key]
			}
		}
	}

	/**
	 * @event FormEventListener#clear
	 */
	clear() {
		for(const key in this.identifier) {
			if(this.identifier[key].tagName === "INPUT" && (this.identifier[key].type === "checkbox" || this.identifier[key].type === "radio" )) {
				this.identifier[key].checked = false
			} else if(this.identifier[key].tagName === "SELECT") {
				this.identifier[key].selectedIndex = 0
			} else if(this.identifier[key].tagName === "TEXTAREA") {
				this.identifier[key].value = ""
			} else {
				this.identifier[key].value = ""
			}
		}
	}

	/**
	 * @event FormEventListener#submit
	 */
	submit() {
		const { form } = this.properties
		const data = {}
		for(const key of this.keys) {
			if(this.identifier[key].tagName === "INPUT" && this.identifier[key].type === "checkbox") {
				data[key] = this.identifier[key].checked
			} else if(this.identifier[key].tagName === "INPUT" && this.identifier[key].type === "radio") {
				const checkedInput = this.root.querySelector(`input[name=${this.identifier[key].name}]:checked`)
				if(checkedInput) {
					data[key] = checkedInput.value
				} else {
					data[key] = null
				}
			} else if(this.identifier[key].tagName === "INPUT" && this.identifier[key].type === "file") {
				data[key] = this.identifier[key].files
			} else {
				data[key] = this.identifier[key].value
			}
		}
		for(const key in data) {
			if(data[key] === "false") {
				data[key] = false
			} else if( data[key] === "true") {
				data[key] = true
			} else {
				const value = parseFloat(data[key])
				if(!isNaN(value) && isFinite(data[key])) {
					data[key] = value
				}
			}
		}
		form.emit("submitted", data)
	}

}

export default FormEventListener
