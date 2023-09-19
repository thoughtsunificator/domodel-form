import assert from "assert"
import { JSDOM } from "jsdom"
import { Core, Binding } from "domodel"

import { FormModel, FormBinding, Form } from "../index.js"

const virtualDOM = new JSDOM(``)
const window = virtualDOM.window
const { document } = window

const RootModel = FormModel({
	tagName: "form",
	children: [
		{
			tagName: "input",
			identifier: "name"
		},
		{
			tagName: "textarea",
			identifier: "body"
		},
		{
			tagName: "select",
			identifier: "choices",
			children: ["a", "b", "c"].map(value => ({
				tagName: "option",
				textContent: value,
				value
			}))
		},
		{
			tagName: "input",
			type: "date",
			identifier: "date"
		},
		{
			tagName: "input",
			type: "date",
			identifier: "date2"
		},
		{
			tagName: "div",
			children: [
				{
					tagName: "input",
					type: "radio",
					name: "gender",
					value: "male",
					identifier: "gender"
				},
				{
					tagName: "input",
					type: "radio",
					name: "gender",
					value: "female"
				},
			]
		},
		{
			tagName: "div",
			children: [
				{
					tagName: "input",
					type: "checkbox",
					value: "married",
					identifier: "married"
				},
				{
					tagName: "input",
					type: "checkbox",
					value: "kids",
					identifier: "kids"
				},
			]
		},
		{
			tagName: "div",
			children: [
				{
					tagName: "input",
					value: "1",
					identifier: "number1"
				},
				{
					tagName: "input",
					value: "1.1",
					identifier: "number2"
				},
				{
					tagName: "input",
					value: "1.1.1",
					identifier: "number3"
				},
			]
		},
		{
			tagName: "input",
			type: "file",
			identifier: "file"
		},
	]
})
let rootBinding


describe("form.binding", () => {

	beforeEach(() => {
		rootBinding = new Binding()
		Core.run({ tagName: "div" }, { parentNode: document.body, binding: rootBinding })
	})

	afterEach(() => {
		rootBinding.remove()
	})

	it("instance", () => {
		assert.ok(FormBinding.prototype instanceof Binding)
	})

	it("onCreated", () => {
		const form = new Form()
		const binding = new FormBinding({ form })
		rootBinding.run(RootModel, { binding })
		assert.strictEqual(Object.keys(binding.keys).length, 12)
		assert.strictEqual(binding.root.tagName, "FORM")
		assert.strictEqual(binding.root.className, "form")
		assert.deepEqual(Object.keys(binding.identifier), binding.keys)
		assert.strictEqual(binding.identifier.name, binding.identifier[binding.keys[0]])
		assert.strictEqual(binding.identifier.file, binding.identifier[binding.keys[11]])
	})

	it("focus", () => {
		const form = new Form()
		const binding = new FormBinding({ form })
		rootBinding.run(RootModel, { binding })
		assert.strictEqual(document.activeElement, document.body)
		form.emit("focus")
		assert.strictEqual(document.activeElement, binding.identifier.name)
	})

	it("load", () => {
		const form = new Form()
		const binding = new FormBinding({ form })
		rootBinding.run(RootModel, { binding })
		form.emit("load", {
			name: "Yasuhito",
			choices: "b",
			body: "fdslfsdifhdsfds",
			date: new Date("1990-02-20"),
			date2: "1990-02-20",
			gender: "female",
			married: true,
			kids: false,
			number1: 1,
			number2: 1.1,
			number3: "1.1.1",
		})
		assert.strictEqual(binding.identifier.name.value, "Yasuhito")
		assert.strictEqual(binding.identifier.choices.value, "b")
		// assert.strictEqual(binding.identifier.body.textContent, "fdslfsdifhdsfds") // JSDOM bug
		assert.strictEqual(binding.identifier.date.value, "1990-02-20")
		assert.strictEqual(binding.identifier.date2.value, "1990-02-20")
		assert.strictEqual(binding.root.querySelector("input[name=gender]:checked").value, "female")
		assert.strictEqual(binding.identifier.married.checked, true)
		assert.strictEqual(binding.identifier.kids.checked, false)
		assert.strictEqual(binding.identifier.number1.value, "1")
		assert.strictEqual(binding.identifier.number2.value, "1.1")
		assert.strictEqual(binding.identifier.number3.value, "1.1.1")
	})

	it("clear", () => {
		const form = new Form()
		const binding = new FormBinding({ form })
		rootBinding.run(RootModel, { binding })
		form.emit("clear")
		assert.strictEqual(binding.identifier.name.value, "")
		assert.strictEqual(binding.identifier.choices.value, "a")
		assert.strictEqual(binding.identifier.date.value, "")
	})

	it("submit", () => {
		const form = new Form()
		const binding = new FormBinding({ form })
		rootBinding.run(RootModel, { binding })
		form.listen("submitted", data => {
			assert.deepEqual(Object.keys(data), ["name", "body", "choices", "date", "date2", "gender", "married", "kids", "number1", "number2", "number3", "file"])
			assert.strictEqual(data.name, "")
			assert.strictEqual(data.choices, "a")
			assert.strictEqual(data.body, "")
			assert.strictEqual(data.date, "")
			assert.strictEqual(data.date2, "")
			assert.strictEqual(data.gender, null)
			assert.strictEqual(data.married, false)
			assert.strictEqual(data.kids, false)
			assert.strictEqual(data.number1, 1)
			assert.strictEqual(data.number2, 1.1)
			assert.strictEqual(data.number3, "1.1.1")
			assert.ok(data.file instanceof window.FileList)
			assert.strictEqual(data.file.length, 0)
		})
		form.emit("submit")
	})

	it("onSubmit", () => {
		let href = window.location.href
		const form = new Form()
		const binding = new FormBinding({ form })
		rootBinding.run(RootModel, { binding })
		form.listen("submit", () => {
			assert.strictEqual(href, window.location.href)
		})
		binding.root.querySelector("input[type=submit]").click()
	})

})
