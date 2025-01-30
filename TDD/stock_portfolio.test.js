/*
REFLECTION:
My experience with using TDD was alright. I thought that it was useful to do and see its benefits and withdrawls.
I was able to follow the test-first approach and go over the red-green-blue cycle. This was because I felt like
it was pretty intuitive to code out the step, make a test, make sure the tests pass, and then looking to make 
sure nothing else was needed to fix. It felt natural and I have done this before in a data structures class,
so with this it was easy to follow. My opinion on TDD is that it is very useful if needed for a small scale
project, but on larger scale projects, I would say this is good but with bigger steps in between the 
testing portion. I think that even potentially coding out all of the test cases initially and then coding
wouldn't be a terrible way to do this as well, just so you can code in a "fluent" matter, which takes
less time for me.
*/



const myFunctions = require('./stock_portfolio.js');

let port; //Global variable

//Initialize stockPortfolio before each test
beforeEach(() => {
    port = new myFunctions.StockPortfolio();
});

//Testing creation of stock portfolio object
test('Testing creation', () => {
    const target = {};
    const result = port.portfolio;
    expect(target).toEqual(result);
});

//Testing if stock portfolio correctly returns whether it is empty
test('Testing empty when empty', () => {
    const target = port.is_empty();
    expect(target).toBe(true);
});

//Testing empty when not empty
test('Testing empty when not empty', () => {
    port.make_purchase('ABC', 1);
    expect(port.is_empty()).toBe(false);
});

//Test if adding to the portfolio correctly stores adds shares
test('Testing shares are added correctly', () => {
    port.make_purchase('ABC', 4);
    port.make_purchase('def', 1);
    port.make_purchase('ABC', 6);
    expect(port.portfolio['ABC']).toBe(10);
});

//Testing to make sure the portfolio correctly subtracts the amount of shares
test('Testing shares are subtracted correctly', () => {
    port.make_purchase('ABC', 4);
    port.make_purchase('def', 3);
    port.make_sale('def', 1);
    expect(port.portfolio['def']).toBe(2);
});

//Testing to make sure the portfolio correctly takes overflows into account (can't have negative shares)
test('Testing negative shares are not possible', () => {
    port.make_purchase('ABC', 5);
    port.make_sale('ABC', 10);
    expect(port.portfolio['ABC']).toBeUndefined();
});

//Testing to make sure that the portfolio correctly keeps track of count of unique shares
test('Testing portfolio keeps track of unique shares', () => {
    expect(port.unique_shares).toBe(0);
    port.make_purchase('ABC', 4);
    expect(port.unique_shares).toBe(1);
    port.make_purchase('def', 1);
    expect(port.unique_shares).toBe(2);
    port.make_purchase('abc', 2)
    expect(port.unique_shares).toBe(3);
    port.make_purchase('ABC', 1);
    expect(port.unique_shares).toBe(3);
    port.make_sale('ABC', 4);
    expect(port.unique_shares).toBe(3);
});

//Testing to make sure that the portfolio correctly removes items if shares are 0 and keeps track of count of shares
test('Testing correct remove logic', () => {
    expect(port.portfolio['ABC']).toBeUndefined();
    port.make_purchase('ABC', 4);
    port.make_purchase('def', 1);
    port.make_purchase('abc', 2)
    port.make_sale('def', 1);
    expect(port.unique_shares).toBe(2);
    expect(port.portfolio['def']).toBeUndefined();
    port.make_sale('ABC', 100);
    expect(port.unique_shares).toBe(1);
    expect(port.portfolio['ABC']).toBeUndefined();
    port.make_purchase('lfG', 0);
    port.make_purchase('what', -1);
    expect(port.unique_shares).toBe(1);
    expect(port.portfolio['lfG']).toBeUndefined();
    expect(port.portfolio['what']).toBeUndefined();
    expect(port.portfolio['abc']).toBe(2);
});