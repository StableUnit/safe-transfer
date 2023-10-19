[![License: GPL v3](https://img.shields.io/badge/License-GPLv3-blue.svg)](https://www.gnu.org/licenses/gpl-3.0)

# ERC-20 Safe Transfer

This project was made by [StableUnit team](https://stableunit.org/).

Safe Transfer is a tool that makes blockchain assets transfers really safe! No more lost funds because of address misstape or un-deployed multisig! 

It’s like when you want to send any tokens to your friend you do not just send it with a chance that you do a mistake with one letter in the address or your friend use not that blockchain that you expected. Because this way you could easily lose your money. Instead, you could use Safe Transfer and give an **allowance** to your friend to take this **specific amount** of **specific tokes** in the **specific blockchain**. This way, if you did a mistake with the address or blockchain, your friend would be unable to claim this transfer and you can easily cancel it, and submit a new correct one. Your money will not leave your wallet before correct approval from your friend's wallet. 

Safe Transfer doesn’t lock the assets in the smart contract, it only sets a limit amount of your tokens that can be claimed by the receiver (token allowance). You can still revoke the token approval to cancel the allowance.

**Your money transfer is safe with Safe Transfer**

## Available Scripts

In the project directory, you can run:

### `yarn start`

Runs the app in the development mode.\
Open [http://localhost:3000](http://localhost:3000) to view it in the browser.

The page will reload if you make edits.\
You will also see any lint errors in the console.

### `yarn test`

Launches the test launcher by `@chainsafe/dappeteer`\
You can find E2E tests in `test/test.spec.ts`. They will be run in emulated browser with metamask.


### Releases
After PR approve you should merge it into master and run
```
npm run release -- --release-as minor
```
If it's small bugfix you should update only patch:
```
npm run release
```