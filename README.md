# domodel-form

Form system for [domodel](https://github.com/thoughtsunificator/domodel).

## Getting started

### Installing

- ``npm install @domodel/form``

### Usage

```javascript
import { Core, Observable, Binding } from "domodel"
import { FormModel, FormBinding, Form } from "@domodel/form"
import MyFormModel from "./form.js"

export default class extends Binding {

	onCreated() {

		const form = new Form()

		this.listen(form, "submitted", data => {
			console.log(`Your name is: ${data.name}`)
		})

		Core.run(FormModel(MyFormModel), { binding: new FormBinding({ form }) })

	}

}

```
