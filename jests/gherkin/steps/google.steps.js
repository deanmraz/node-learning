import { defineFeature, loadFeature } from 'jest-cucumber';
const puppeteer = require('puppeteer');
const feature = loadFeature('./features/google.feature');
const { PendingXHR } = require('pending-xhr-puppeteer');
import { kebabCase } from 'lodash';

let browser; 
let page; 
let pendingXHR;

beforeAll(async () => {
  browser = await puppeteer.launch({
    headless: false,
  });
  page = await browser.newPage();
  pendingXHR = new PendingXHR(page);
  await page.setViewport({ width: 1280, height: 800 })
});
afterAll(async () => {
  await page.close();
  await browser.close();
});

defineFeature(feature, test => {

  test('Searching', ({ given, when, and, then }) => {

    const scenarioName = `${kebabCase(feature.title.toLowerCase())}-searching`

    given('I am a user', async () => {
      
    });

    when(/^I launch (.*)$/, async (site) => {
      console.log(site);
      await page.goto(site, { waitUntil: 'networkidle0' });
    });

    and(/^I type (.*) into (.*)$/, async (term, input) => {
      const selector = `input[${input}]`;
      await page.waitFor(selector);
      await page.click(selector);
      await page.keyboard.type(term);
      try {
        const image = await page.screenshot({
          // fullPage: true
        });
        expect(image).toMatchImageSnapshot({
          failureThreshold: '0.05',
          failureThresholdType: 'percent',
          customSnapshotIdentifier: `${scenarioName}-${term}-into-${input}`
        });
      } catch (e) {
        console.error(e);
      }
    });

    and(/^I click on input (.*) I press (.*)$/, async (input, key) => {
      const selector = `input[${input}]`;
      await page.waitFor(selector);
      await page.click(selector);
      await page.keyboard.press(key);
    });

    then('I see search result', async () => {
      await page.waitForNavigation({ waitUntil: 'networkidle0' })
      await pendingXHR.waitForAllXhrFinished();
      try {
        const image = await page.screenshot({
          // fullPage: true
        });
        expect(image).toMatchImageSnapshot({
          failureThreshold: '0.15',
          failureThresholdType: 'percent',
          customSnapshotIdentifier: `${scenarioName}-result`
        });
      } catch (e) {
        console.error(e);
      }
    });

  }, 15000);
});
