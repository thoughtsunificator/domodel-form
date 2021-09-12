export default Model => ({
	tagName: "form",
	className: "form",
	children: [
		Model,
		{
			tagName: "div",
			className: "form-footer",
			children: [
				{
					tagName: "input",
					type: "reset",
				},
				{
					tagName: "input",
					type: "submit"
				}
			]
		}
	]
})
