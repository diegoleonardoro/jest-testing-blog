// const Page = require("./helpers/page");

// let page;

// beforeEach(async () => {
//   page = await Page.build();

//   await page.goto("localhost:3000");
// });

// afterEach(async () => {
//   await page.close();
// });

// describe("When logged in", async () => {
//   beforeEach(async () => {
//     await page.login();
//     await page.click("a.btn-floating"); // click on the add new blog button
//   });

//   test("can see blog create form", async () => {
//     const label = await page.getContentsOf("form label");
//     expect(label).toEqual("Blog Title");
//   });

//   describe("And using valid inputs", async () => {
//     beforeEach(async () => {
//       await page.type(".title input", "My Title");
//       await page.type(".content input", "My Content");
//       await page.click("form button");
//     });

//     test("Submitting takes user to review screen", async () => {
//       const text = await page.getContentsOf("h5");
//       expect(text).toEqual("Please confirm your entries");
//     });

//     test("Submitting then saving adds blog to index page", async () => {
//       await page.click("button.green");
//       await page.waitFor(".card"); // here we have to use 'waitFor' because when we clicked 'button.green' we are doing a data base request which may take some time to finalize.

//       const title = await page.getContentsOf(".card-title");
//       const content = await page.getContentsOf("p");

//       expect(title).toEqual("My Title");
//       expect(content).toEqual("My Content");
//     });
//   });

//   describe("And using invalid input", async () => {
//     beforeEach(async () => {
//       await page.click("form button"); // click on the post form button
//     });

//     test("the form shows an error message", async () => {
//       const titleError = await page.getContentsOf(".title .red-text");
//       const contentError = await page.getContentsOf(".content .red-text");

//       expect(titleError).toEqual("You must provide a value");
//       expect(contentError).toEqual("You must provide a value");
//     });
//   });
// });

// describe("User is not logged in", async () => {
//   test("User cannot create blog post", async () => {
//     //Evaluate method of Pupetteer: is used to execute some code inside to the Chromium instance: page.evaluate(pageFunction, ...args)

//     const result = await page.evaluate(() => {
//       return fetch("/api/blogs", {
//         method: "POST",
//         credentials: "same-origin",
//         headers: {
//           "Content-Type": "application/json"
//         },
//         body: JSON.stringify({
//           title: "My Title",
//           content: "My Content"
//         })
//       }).then(res => res.json());
//     });

//     expect(result).toEqual({ error: "You must log in!" });
//   });

  
//   test("User cannot get a list of posts", async () => {

//     const result = await page.evaluate(() => {
//       return fetch("/api/blogs", {
//         method: "GET",
//         credentials: "same-origin",
//         headers: {
//           "Content-Type": "application/json"
//         },

//       }).then(res => res.json());
//     });

//     expect(result).toEqual({ error: "You must log in!" });
//   });

 
// });




/*

describe statement is used to group together sets of common tests that all share some similar testing, set up logic.

It can container other 'test' statements or other 'describe' statements.

They can also have a beforeEach and afterEach statements, which are used to set up the common conditions tha are shared for all the tests that exist inside of it. 





 */
