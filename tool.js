'use strict';
const ResultBuilder = require('result-builder')


class Tool {
    constructor({ page, consoleMessages }) {
        this.page = page;
        this.consoleMessages = consoleMessages;
        //Build result by result-builder
        this.builder = new ResultBuilder()
    }

    async run() {
        // Scroll down to the bottm of the page
        await this.page.evaluate(async () => {
            await new Promise((resolve, reject) => {
                window.scrollBy({
                    top: document.body.scrollHeight,
                    behavior: 'smooth'
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
        return this.builder.toArray()
    };
    checkErrors(){
        const result = this.builder.newTest("errors")
        result.setTitle("Errors")
            .setDescription("A list of error messages appearing in the browser\'s console when visiting your page.")
            .setWeight(.9)
            .setScore(1 - Math.min(this.consoleMessages.errors.length, 10) * .1)
            .addRecommendation(this.consoleMessages.errors.length ? 'Fix the errors that appear in the browser\'s console when visiting your website.' : null)
            .addTableRows(['Error message'].concat(this.consoleMessages.errors).map(msg => [msg]))
    }
    checkWarnings(){
        const result = this.builder.newTest("warnings")
        result.setTitle("warnings")
            .setDescription("A list of warning messages appearing in the browser\'s console when visiting your page.")
            .setWeight(.1)
            .setScore(1 - Math.min(this.consoleMessages.errors.length, 10) * .1)
            .addTableRows(['Warning message'].concat(this.consoleMessages.warnings).map(msg => [msg]))
    }
    checkLogs(){
        const result = this.builder.newTest("logs")
        result.setTitle("Logs")
            .setDescription("Logs and information messages")
            .setWeight(0)
            .setScore(0)
            .addTableRows(['Message'].concat(this.consoleMessages.others).map(msg => [msg]))
    }

    async cleanup() {

    };
}

module.exports = Tool;
