import { Observable } from "domodel"

import Form from "../src/object/form.js"

export function instance(test) {
	test.expect(4)
	const obj = { a: 1 }
	const form = new Form(obj)
	test.ok(form instanceof Observable)
	test.deepEqual(form.initialData, obj)
	test.strictEqual(typeof form.data, "object")
	test.strictEqual(Object.entries(form.data).length, 0)
	test.done()
}
