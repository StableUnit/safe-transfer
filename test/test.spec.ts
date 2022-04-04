import * as assert from "assert";
import puppeteer from "puppeteer";
import * as dappeteer from "@chainsafe/dappeteer";
import { getShortHash } from "../src/utils/urlGenerator";

const RECOMMENDED_METAMASK_VERSION = "v10.1.1";

let browser: puppeteer.Browser;
let metamask: dappeteer.Dappeteer;
let generatedUrl = "";

const test1PK = process.env.FROM_PK ?? "";
const test2PK = process.env.TO_PK ?? "";

const test1Address = process.env.FROM_ADDRESS ?? "";
const test2Address = process.env.TO_ADDRESS ?? "";

function delay(time: number) {
    return new Promise((resolve) => {
        setTimeout(resolve, time);
    });
}

const DaiAddress = "0x0911e3bbf1ee834269b4187fbafd95a07aa4aeda";
const DaiValue = "1";
const DEFAULT_WAIT_TIME = 60000;

async function clickElement(page: puppeteer.Page, selector: string): Promise<void> {
    await page.bringToFront();
    await page.waitForSelector(selector);
    const element = await page.$(selector);
    await element?.click();
}

const getText = async (page: puppeteer.Page, selector: string): Promise<string> => {
    return (await (await (await page.$(selector))?.getProperty("textContent"))?.jsonValue()) ?? "";
};

const simpleClick = async (page: puppeteer.Page, selector: string) => {
    await page.waitForSelector(selector);
    await page.click(selector);
};

describe("dappeteer", () => {
    beforeEach(async () => {
        browser = await dappeteer.launch(puppeteer, {
            metamaskVersion: process.env.METAMASK_VERSION || RECOMMENDED_METAMASK_VERSION,
        });
        metamask = await dappeteer.setupMetamask(browser);
        await metamask.switchNetwork("rinkeby");
    });

    it("should Approve", async () => {
        await metamask.importPK(test1PK);
        const testPage = await browser.newPage();
        await testPage.goto("http://localhost:3000/");
        await testPage.click("#connect-button-metamask");
        await testPage.setDefaultTimeout(DEFAULT_WAIT_TIME);
        await metamask.approve();
        await testPage.bringToFront();

        await simpleClick(testPage, ".approve-form__token-form");
        await simpleClick(testPage, `li[data-value="${DaiAddress}"]`);

        await testPage.focus("#address");
        await testPage.keyboard.type(test2Address);

        await testPage.focus("#value");
        await testPage.keyboard.type(DaiValue);

        await delay(500);
        await clickElement(testPage, ".approve-form__button");

        await metamask.confirmTransaction();
        await delay(3000);
        await clickElement(metamask.page, ".btn-primary");
        await testPage.bringToFront();
        await testPage.waitForSelector("#generated-url");
        generatedUrl = await getText(testPage, "#generated-url");
        assert.ok(generatedUrl.startsWith("http://localhost:3000?token="));
    });

    it("should Transfer", async () => {
        await metamask.importPK(test2PK);
        const transferPage = await browser.newPage();
        await transferPage.setDefaultTimeout(DEFAULT_WAIT_TIME);
        await transferPage.goto(generatedUrl);
        await transferPage.click("#connect-button-metamask");
        await metamask.approve();
        await transferPage.bringToFront();

        await transferPage.waitForSelector("#from");

        const from = await getText(transferPage, "#from");
        assert.strictEqual(from.toLowerCase(), getShortHash(test1Address).toLowerCase());

        const to = await getText(transferPage, "#to");
        assert.strictEqual(to.toLowerCase(), getShortHash(test2Address).toLowerCase());

        const tokenAddress = await getText(transferPage, "#tokenAddress");
        assert.strictEqual(tokenAddress.toLowerCase(), getShortHash(DaiAddress).toLowerCase());

        await delay(3000);
        const value = await getText(transferPage, "#value");
        assert.strictEqual(value.toLowerCase(), `${DaiValue} tdai`);

        await clickElement(transferPage, ".transfer-form__button");
        await metamask.confirmTransaction();
        await transferPage.bringToFront();

        await transferPage.waitForSelector(".rnc__notification-title");
        const thanksText = await getText(transferPage, ".rnc__notification-title");
        assert.ok(thanksText.length > 0);
    });

    after(async () => {
        await delay(1000);
        await browser.close();
    });
});
