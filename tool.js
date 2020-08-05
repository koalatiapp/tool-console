'use strict';

class Tool {
    constructor({ page, consoleMessages }) {
        this.page = page;
        this.consoleMessages = consoleMessages;
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
    }

    get results() {
        return [
            {
                'uniqueName': 'errors',
                'title': 'Errors',
                'description': 'A list of error messages appearing in the browser\'s console when visiting your page.',
                'weight': .9,
                'score': 1 - Math.min(this.consoleMessages.errors.length, 10) * .1,
                'table': ['Error message'].concat(this.consoleMessages.errors).map(msg => [msg]),
                'recommendations': this.consoleMessages.errors.length ? 'Fix the errors that appear in the browser\'s console when visiting your website.' : null
            },
            {
                'uniqueName': 'warnings',
                'title': 'Warnings',
                'description': 'A list of warning messages appearing in the browser\'s console when visiting your page.',
                'weight': .1,
                'score': 1 - Math.min(this.consoleMessages.warnings.length, 10) * .1,
                'table': ['Warning message'].concat(this.consoleMessages.warnings).map(msg => [msg]),
            },
            {
                'uniqueName': 'logs',
                'title': 'Logs and information messages',
                'description': 'A list of benign log messages appearing in the browser\'s console when visiting your page.',
                'weight': 0,
                'score': 0,
                'table': ['Message'].concat(this.consoleMessages.others).map(msg => [msg]),
            },
        ];
    };

    async cleanup() {

    };
}

module.exports = Tool;
