const Page = require('./helpers/page');

let page;


beforeEach(async () => {// execute before each test
    page = await Page.build();

    await page.goto('localhost:3000');
});

afterEach(async () => {// execute after all tests
    await page.close();
    // .close() // close the chromium browser afet all tests are done
    // await browser.close()
})

test('the header has the correct text', async () => {
    // access the DOM:
    const text = await page.getContentsOf('a.brand-logo')
    expect(text).toEqual('Blogster');
})

test('clicking login starts oauth flow', async () => {

    await page.click('.right a');
    // page.url() is a puppeteer method that lets us extraxt the url
    const url = await page.url();

    // .toMatch() is Jest method that receives a regex to match
    expect(url).toMatch(/accounts\.google\.com/);
});

test('When signed in, shows logout button', async () => {

    await page.login();
    const text = await page.getContentsOf('a[href="/auth/logout"]')
    //page.$eval('a[href="/auth/logout"]', el => el.innerHTML)
    expect(text).toEqual('Logout');

})

/*
factory function: returns some common resource that we might need throughout our test suite.

code inside our test files does not share code with the rest of the project

*/

/*

If we wanted to refactor the login functionality by extending the Page class of puppeteer:

const Page = require('puppeteer/lib/Page);

Page.prototype.login = async function(){

   const user = await userFactory();

    const { session, sig } = sessionFactory(user);

    await this.setCookie({ name: 'session', value: session });
    await this.setCookie({ name: 'session.sig', value: sig });
    await this.goto('localhost:3000');
    await this.waitFor('a[href="/auth/logout"]');
} 

Proxies allow us to manage access to some target object or objects, so using it, we can access different objects whithing different classes 


*/

/*

new Proxy()

first argument is the object we want to manage access to 

the second argument is a handler, which is an object that contains a set of functions that are executed any time we want to have access to the underlying target object 


Inside the get function we can include references to multiple objects

target: refers to the targer object 
property: function that we are trying to access from the targer




class Page {
    goto(page) { console.log(page) }
    setCookie() { console.log('Im setting a cookie') }
}

class CustomPage {
    constructor(page) {
        this.page = page;
    }
    login() {
        this.page.goto('localhost...')
        this.page.setCookie()
    }
}

//const page = browser.launch();
const page = new Page();
const customPage = new CustomPage(page);

const superPage = new Proxy (customPage, {
    get: function (targer, property){
        return target[property]||page[property]
    }
})

superPage.goto();
superPage.setCookie();
superPage.login();

*/

/*
static functions can be used without even making an instance of the class itself.
*/
