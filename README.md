# domodel-form

Form system for [domodel](https://github.com/thoughtsunificator/domodel).

## Getting started

### Prerequisites

- [domodel](https://github.com/thoughtsunificator/domodel)

### Installing

- ``npm install @domodel/form``

### Usage

``src/model/your-form.js``
```javascript
export default {
	tagName: "div",
	style: "display: contents",
	children: [
		{
			tagName: "h3",
			textContent: "My Form"
		},
		{
			tagName: "div",
			children: [
				{
					tagName: "label",
					textContent: "Your name:",
					children: [
						{
							tagName: "div",
							children: [
								{
									tagName: "input",
									identifier: "name"
								}
							]
						}
					]
				}
			]
		}
	]
}
```

``src/binding/demo.js``
```javascript
import { Core, Observable, Binding } from "domodel"
import { FormModel, FormBinding } from "@domodel/form"
import YourFormModel from "../model/your-form.js"

export default class extends Binding {

	async onCreated() {

		const form = new Observable()

		form.listen("submitted", data => {
			console.log(`Your name is: ${data.name}`)
		})

		Core.run(FormModel(YourFormModel), { parentNode: document.body, binding: new FormBinding({ observable: form }) })

	}

}

```

### Events

| Name       | Description      
| ---------- |----------------------
| submitted  | Form was submitted.
| reset      | Reset values to defaults.     
| load       | Load form with data.     

