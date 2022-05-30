const puppeteer = require('puppeteer');

const sessionFactory = require('../factories/sessionFactory');
const userFactory = require('../factories/userFactory');



class CustomPage {

    static async build() {

        // All operations that we can do with puppeteer are asynchronous.
        // launch receives options to customize how the browser is created.
        const browser = await puppeteer.launch({
            headless: false
        });

        const page = await browser.newPage(); // this creates a new page that is opened inside of the browser that we just created. 

        const customPage = new CustomPage(page);

        return new Proxy(customPage, {
            get: function (target, property) {

                // methods will be checked in the order they are in the following return declaration:
                return customPage[property] || browser[property] || page[property]
            }
        })
    }

    constructor(page) {//we could also include  browser here
        this.page = page;
        //this.browser = browser
    }

    async login() {
        const user = await userFactory();

        const { session, sig } = sessionFactory(user);

        await this.page.setCookie({ name: 'session', value: session });
        await this.page.setCookie({ name: 'session.sig', value: sig });
        await this.page.goto('localhost:3000/blogs');
        await this.page.waitFor('a[href="/auth/logout"]');
    }

    async getContentsOf(selector) {
        return this.page.$eval(selector, el => el.innerHTML)
    }


    // we do the following because both browser and page have a 'close' method but we only want to use the one that belongs to the browser, so here we are passing the browser's close methof to customPage so it gets called first:
    // close(){
    //     this.browser.close();
    // }


}

module.exports = CustomPage;

/*
Whenever a Jest test runs, by default, it has 5 seconds to either pass or fail. 
*/