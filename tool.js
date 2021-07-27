"use strict";

const ResultBuilder = require("@koalati/result-builder");

class Tool {
	constructor({ page, consoleMessages }) {
		this.page = page;
		this.consoleMessages = consoleMessages;
		this.builder = new ResultBuilder();
	}

	async run() {
		// Scroll down to the bottm of the page
		await this.page.evaluate(async () => {
			await new Promise((resolve) => {
				window.scrollBy({
					top: document.body.scrollHeight,
					behavior: "smooth"
				});
				setTimeout(() => {
					resolve();
				}, 500);
			});
		});
		this.checkErrors();
		this.checkWarnings();
		this.checkLogs();
	}

	get results() {
		return this.builder.toArray();
	}

	checkErrors(){
		const result = this.builder.newTest("errors");
		result.setTitle("Errors")
			.setDescription("A list of error messages appearing in the browser's console when visiting your page.")
			.setWeight(.9)
			.setScore(1 - Math.min(this.consoleMessages.errors.length, 10) * .1);
		result.table = ["Error message"].concat(this.consoleMessages.errors).map(msg => [msg]);

		if (this.consoleMessages.errors.length) {
			result.addRecommendation("Fix the errors that appear in the browser's console when visiting your website.");
		}
	}

	checkWarnings(){
		const result = this.builder.newTest("warnings");
		result.setTitle("Warnings")
			.setDescription("A list of warning messages appearing in the browser's console when visiting your page.")
			.setWeight(.1)
			.setScore(1 - Math.min(this.consoleMessages.errors.length, 10) * .1);
		result.table = ["Warning message"].concat(this.consoleMessages.warnings).map(msg => [msg]);
	}

	checkLogs(){
		const result = this.builder.newTest("logs");
		result.setTitle("Logs")
			.setDescription("Logs and information messages")
			.setWeight(0)
			.setScore(1);
		result.table = ["Message"].concat(this.consoleMessages.others).map(msg => [msg]);
	}

	async cleanup() {

	}
}

module.exports = Tool;
