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
			tagName: "input",
			type: "file",
			identifier: "file"
		},
	]
})
let rootBinding

export function setUp(callback) {
	rootBinding = new Binding()
	Core.run({ tagName: "div" }, { parentNode: document.body, binding: rootBinding })
	callback()
}

export function tearDown(callback) {
	rootBinding.remove()
	callback()
}

export function instance(test) {
	test.expect(1)
	test.ok(new FormBinding() instanceof Binding)
	test.done()
}

export function onCreated(test) {
	test.expect(6)
	const form = new Form()
	const binding = new FormBinding({ form })
	rootBinding.run(RootModel, { binding })
	test.strictEqual(Object.keys(binding.keys).length, 8)
	test.strictEqual(binding.root.tagName, "FORM")
	test.strictEqual(binding.root.className, "form")
	test.deepEqual(Object.keys(binding.identifier), binding.keys)
	test.strictEqual(binding.identifier.name, binding.identifier[binding.keys[0]])
	test.strictEqual(binding.identifier.file, binding.identifier[binding.keys[7]])
	test.done()
}

export function focus(test) {
	test.expect(2)
	const form = new Form()
	const binding = new FormBinding({ form })
	rootBinding.run(RootModel, { binding })
	test.strictEqual(document.activeElement, document.body)
	form.emit("focus")
	test.strictEqual(document.activeElement, binding.identifier.name)
	test.done()
}

export function load(test) {
	test.expect(6)
	const form = new Form()
	const binding = new FormBinding({ form })
	rootBinding.run(RootModel, { binding })
	form.emit("load", {
		name: "Yasuhito",
		choices: "b",
		body: "fdslfsdifhdsfds",
		date: new Date("1990-02-20"),
		gender: "female",
		married: true,
		kids: false
	})
	test.strictEqual(binding.identifier.name.value, "Yasuhito")
	test.strictEqual(binding.identifier.choices.value, "b")
	// test.strictEqual(binding.identifier.body.textContent, "fdslfsdifhdsfds") // JSDOM bug
	test.strictEqual(binding.identifier.date.value, "1990-02-20")
	test.strictEqual(binding.root.querySelector("input[name=gender]:checked").value, "female")
	test.strictEqual(binding.identifier.married.checked, true)
	test.strictEqual(binding.identifier.kids.checked, false)
	test.done()
}

export function clear(test) {
	test.expect(3)
	const form = new Form()
	const binding = new FormBinding({ form })
	rootBinding.run(RootModel, { binding })
	form.emit("clear")
	test.strictEqual(binding.identifier.name.value, "")
	test.strictEqual(binding.identifier.choices.value, "a")
	test.strictEqual(binding.identifier.date.value, "")
	test.done()
}

export function submit(test) {
	test.expect(10)
	const form = new Form()
	const binding = new FormBinding({ form })
	rootBinding.run(RootModel, { binding })
	form.listen("submitted", data => {
		test.deepEqual(Object.keys(data), ["name", "body", "choices", "date", "gender", "married", "kids", "file"])
		test.strictEqual(data.name, "")
		test.strictEqual(data.choices, "a")
		test.strictEqual(data.body, "")
		test.strictEqual(data.date, "")
		test.strictEqual(data.gender, null)
		test.strictEqual(data.married, false)
		test.strictEqual(data.kids, false)
		test.ok(data.file instanceof window.FileList)
		test.strictEqual(data.file.length, 0)
		test.done()
	})
	form.emit("submit")
}

export function onSubmit(test) {
	test.expect(1)
	let href = window.location.href
	const form = new Form()
	const binding = new FormBinding({ form })
	rootBinding.run(RootModel, { binding })
	form.listen("submit", () => {
		test.strictEqual(href, window.location.href)
		test.done()
	})
	binding.root.querySelector("input[type=submit]").click()
}
