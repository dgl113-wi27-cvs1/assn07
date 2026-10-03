import path from 'path';

describe('all tests', () => {
  beforeAll(async () => {
    const URL = `file:///${path.resolve(__dirname, '../docs/index.html')}`;
    await page.setViewport({ width: 1920, height: 1080 });
    await page.goto(URL, { waitUntil: 'networkidle2' });
  });

  beforeEach(async () => {
    await page.reload({ waitUntil: 'networkidle2' });
  });

  it('case1', async () => {
    await page.waitForSelector('#totalCost');

    let element = await page.$('#totalCost');
    let value = await page.evaluate((el) => el.innerText, element);
    expect(value).toBe('$0.00');
  });

  it('case2', async () => {
    await page.click('#addItem');
    await page.waitForSelector('#totalCost');

    let element = await page.$('#totalCost');
    let value = await page.evaluate((el) => el.innerText, element);
    expect(value).toBe('$2.99');
  });

  it('case3', async () => {
    await page.click('#addItem');
    await page.waitForSelector('#totalCost');

    let element = await page.$('tbody td:first-of-type');
    let value = await page.evaluate((el) => el.innerText, element);
    expect(value).toBe('1');
  });

  it('case4', async () => {
    await page.click('#addItem');
    await page.waitForSelector('#totalCost');

    let element = await page.$('tbody td:nth-of-type(2)');
    let value = await page.evaluate((el) => el.innerText, element);
    expect(value).toBe('Short (236ml)');
  });

  it('case5', async () => {
    await page.click('#addItem');
    await page.waitForSelector('#totalCost');

    let element = await page.$('tbody td:nth-of-type(3)');
    let value = await page.evaluate((el) => el.innerText, element);
    expect(value).toBe('Blonde Roast Coffee');
  });

  it('case6', async () => {
    await page.select('#quantity', '7');
    await page.select('#size', 'Grande (473ml)');
    await page.select('#description', 'Earl Grey Tea');
    await page.click('#addItem');
    await page.waitForSelector('#totalCost');

    let element = await page.$('tbody td:first-of-type');
    let value = await page.evaluate((el) => el.innerText, element);
    expect(value).toBe('7');
    element = await page.$('tbody td:nth-of-type(2)');
    value = await page.evaluate((el) => el.innerText, element);
    expect(value).toBe('Grande (473ml)');
    element = await page.$('tbody td:nth-of-type(3)');
    value = await page.evaluate((el) => el.innerText, element);
    expect(value).toBe('Earl Grey Tea');

    element = await page.$('#totalCost');
    value = await page.evaluate((el) => el.innerText, element);
    expect(value).toBe('$22.75');
  });

  it('case7', async () => {
    await page.select('#quantity', '7');
    await page.select('#size', 'Grande (473ml)');
    await page.select('#description', 'Earl Grey Tea');
    await page.click('#addItem');
    await page.select('#quantity', '3');
    await page.select('#size', 'Venti (591ml)');
    await page.select('#description', 'Dark Roast Coffee');
    await page.click('#addItem');
    await page.waitForSelector('#totalCost');

    let element = await page.$('tbody tr:first-of-type td:first-of-type');
    let value = await page.evaluate((el) => el.innerText, element);
    expect(value).toBe('7');
    element = await page.$('tbody tr:first-of-type td:nth-of-type(2)');
    value = await page.evaluate((el) => el.innerText, element);
    expect(value).toBe('Grande (473ml)');
    element = await page.$('tbody tr:first-of-type td:nth-of-type(3)');
    value = await page.evaluate((el) => el.innerText, element);
    expect(value).toBe('Earl Grey Tea');

    element = await page.$('tbody tr:nth-of-type(2) td:first-of-type');
    value = await page.evaluate((el) => el.innerText, element);
    expect(value).toBe('3');
    element = await page.$('tbody tr:nth-of-type(2) td:nth-of-type(2)');
    value = await page.evaluate((el) => el.innerText, element);
    expect(value).toBe('Venti (591ml)');
    element = await page.$('tbody tr:nth-of-type(2) td:nth-of-type(3)');
    value = await page.evaluate((el) => el.innerText, element);
    expect(value).toBe('Dark Roast Coffee');

    element = await page.$('#totalCost');
    value = await page.evaluate((el) => el.innerText, element);
    expect(value).toBe('$34.72');
  });

  it('case8', async () => {
    await page.select('#quantity', '7');
    await page.select('#size', 'Grande (473ml)');
    await page.select('#description', 'Earl Grey Tea');
    await page.click('#addItem');
    await page.select('#quantity', '3');
    await page.select('#size', 'Venti (591ml)');
    await page.select('#description', 'Dark Roast Coffee');
    await page.click('#addItem');
    await page.click('tbody tr:nth-of-type(1) button');
    await page.waitForSelector('#totalCost');

    let element = await page.$('tbody tr:nth-of-type(1) td:first-of-type');
    let value = await page.evaluate((el) => el.innerText, element);
    expect(value).toBe('3');
    element = await page.$('tbody tr:nth-of-type(1) td:nth-of-type(2)');
    value = await page.evaluate((el) => el.innerText, element);
    expect(value).toBe('Venti (591ml)');
    element = await page.$('tbody tr:nth-of-type(1) td:nth-of-type(3)');
    value = await page.evaluate((el) => el.innerText, element);
    expect(value).toBe('Dark Roast Coffee');

    element = await page.$('#totalCost');
    value = await page.evaluate((el) => el.innerText, element);
    expect(value).toBe('$11.97');
  });

  it('case9', async () => {
    await page.select('#quantity', '2');
    await page.select('#size', 'Grande (473ml)');
    await page.select('#description', 'Earl Grey Tea');
    await page.click('#addItem');
    await page.select('#quantity', '3');
    await page.select('#size', 'Grande (473ml)');
    await page.select('#description', 'Earl Grey Tea');
    await page.click('#addItem');
    await page.waitForSelector('#totalCost');

    let element = await page.$('tbody tr:first-of-type td:first-of-type');
    let value = await page.evaluate((el) => el.innerText, element);
    expect(value).toBe('5');
    element = await page.$('tbody tr:first-of-type td:nth-of-type(2)');
    value = await page.evaluate((el) => el.innerText, element);
    expect(value).toBe('Grande (473ml)');
    element = await page.$('tbody tr:first-of-type td:nth-of-type(3)');
    value = await page.evaluate((el) => el.innerText, element);
    expect(value).toBe('Earl Grey Tea');

    element = await page.$('#totalCost');
    value = await page.evaluate((el) => el.innerText, element);
    expect(value).toBe('$16.25');
  });
});
