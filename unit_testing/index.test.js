const myFunctions = require('./index.js');


//Testing div function
test('Testing div basic -- success', () => {
  const target = 2/3;
  const result = myFunctions.div(12, 18);
  expect(target).toBe(result);
});

test('Testing div basic -- success', () => {
    const target = 2;
    const result = myFunctions.div(8, 4);
    expect(target).toBe(result);
});

test('Testing div negative first -- success', () => {
    const target = -8;
    const result = myFunctions.div(-8, 1);
    expect(target).toBe(result);
});

test('Testing div negative second -- success', () => {
    const target = -11/6;
    const result = myFunctions.div(110, -60);
    expect(target).toBe(result);
});

test('Testing div negative both -- success', () => {
    const target = 20;
    const result = myFunctions.div(-800, -40);
    expect(target).toBe(result);
});

test('Testing div by 0 -- success', () => {
    const target = Infinity;
    const result = myFunctions.div(52, 0);
    expect(target).toBe(result);
});

test('Testing 0/0 -- success', () => {
    const target = NaN;
    const result = myFunctions.div(0, 0);
    expect(target).toBe(result);
});

test('Testing decimals 1 -- success', () => {
    const target = 9.2;
    const result = myFunctions.div(57.5, 6.25);
    expect(target).toBe(result);
});

test('Testing decimals 2 -- success', () => {
    const target = 25.2125;
    const result = myFunctions.div(100.85, 4);
    expect(target).toBe(result);
});

test('Testing decimals 3 -- success', () => {
    const target = 15121.93548;
    const result = myFunctions.div(93756, 6.2);
    expect(target).toBeCloseTo(result);
});

//Testing containsNumbers function
test('Testing containsNumbers, basic false -- success', () => {
    const target = false;
    const result = myFunctions.containsNumbers("hello");
    expect(target).toBe(result);
});

test('Testing containsNumbers, basic true -- success', () => {
    const target = true;
    const result = myFunctions.containsNumbers("hell0");
    expect(target).toBe(result);
});

test('Testing containsNumbers, empty string false -- success', () => {
    const target = false;
    const result = myFunctions.containsNumbers("");
    expect(target).toBe(result);
});

test('Testing containsNumbers, single character true -- success', () => {
    const target = true;
    const result = myFunctions.containsNumbers("5");
    expect(target).toBe(result);
});

test('Testing containsNumbers, single character false -- success', () => {
    const target = false;
    const result = myFunctions.containsNumbers("a");
    expect(target).toBe(result);
});

test('Testing containsNumbers, long input false -- success', () => {
    const target = false;
    const result = myFunctions.containsNumbers("this is a sentence without digits!@#$%^&*()-=_+/.,';[]{}\|:?>~");
    expect(target).toBe(result);
});

test('Testing containsNumbers, long input true -- success', () => {
    const target = true;
    const result = myFunctions.containsNumbers("this is a sentence w1th digits!");
    expect(target).toBe(result);
});