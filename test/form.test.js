import assert from "assert"
import { Observable } from "domodel"

import Form from "../src/object/form.js"

describe("form", () => {

	it("instance", () => {
		const obj = { a: 1 }
		const form = new Form(obj)
		assert.ok(form instanceof Observable)
		assert.deepEqual(form.initialData, obj)
		assert.strictEqual(typeof form.data, "object")
		assert.strictEqual(Object.entries(form.data).length, 0)
	})

})
