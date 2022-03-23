import * as assert from "assert";
import puppeteer from "puppeteer";
import * as dappeteer from "@chainsafe/dappeteer";

const RECOMMENDED_METAMASK_VERSION = "v10.1.1";

let browser: puppeteer.Browser;
let metamask: dappeteer.Dappeteer;
let generatedUrl = "";

const test1PK = "c04e5ac4fa2bf69c239650ad29cd61d5e5b44374eb5df7bf2c24c89538483bdc";
const test2PK = "739a34b1a567dc6b90686174a2f8f07aa9990c5e2ec274a0c78dccf4ad4ceed0";

const test1Address = "0xE2661235b116781a7b30D4a675898cF9E61298Df";
const test2Address = "0xeF8eD509Ee41Cee037736Eb841D52c1c3a714019";

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

const removeStartText = (text: string, start: string) => text.toLowerCase().split(start.toLowerCase())[1];

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

        const from = removeStartText(await getText(transferPage, "#from"), "from: ");
        assert.strictEqual(from.toLowerCase(), test1Address.toLowerCase());

        const to = removeStartText(await getText(transferPage, "#to"), "to: ");
        assert.strictEqual(to.toLowerCase(), test2Address.toLowerCase());

        const tokenAddress = removeStartText(await getText(transferPage, "#tokenAddress"), "token address: ");
        assert.strictEqual(tokenAddress.toLowerCase(), DaiAddress.toLowerCase());

        await delay(3000);
        const value = removeStartText(await getText(transferPage, "#value"), "value: ");
        assert.strictEqual(value.toLowerCase(), `${DaiValue} tdai`);

        await clickElement(transferPage, ".transfer-form__button");
        await metamask.confirmTransaction();
        await transferPage.bringToFront();

        await transferPage.waitForSelector("#thanks");
        const thanksText = await getText(transferPage, "#thanks");
        assert.ok(thanksText.length > 0);
    });

    after(async () => {
        await delay(1000);
        await browser.close();
    });
});
