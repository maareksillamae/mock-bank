const fetch = require('node-fetch');
const AbortController = require('abort-controller');
const nock = require('nock')
require('dotenv').config();

const RemoteBank = require("../models/RemoteBank");

// Set up an abort controller
const controller = new AbortController();

// Set up 10 sec timer for abort
const timeout = setTimeout(() => controller.abort(), 10000);

module.exports.refreshCentralPank = async () => {
  try {
    // Add console logs for later debugging.
    console.log("Refreshing remote bank's collection'!");
    console.log("Contacting central bank at " + `${process.env.CENTRAL_BANK_URL}/banks`);

    // Delete all the banks from remote banks collection.
    const deleted = await RemoteBank.deleteMany();
    console.log("Deleted " + deleted.deletedCount + " banks");

    // Test mode
    if(process.env.TEST_MODE === 'true') {
      console.log("Calling refresh bank from testmode")
      // Fictional banks
      const centralBankScope = nock(`${process.env.CENTRAL_BANK_URL}`)
      .persist()
      .get('/banks')
      .reply(200,
        [{
        name: "testbank",
        transactionUrl: "http://testbank.test.com/transactions/b2b",
        apiKey: "94d21b14-b77b-402d-a2f5-35f85889d480",
        bankPrefix: "666",
        owners: "Künter Pärtel",
        jwksUrl: "http://testbank.test.com/jwks.json"
        },
        {
        name: "Demo pank",
        apiKey: "7ec31850-2f99-4601-a161-5d151213a590",
        transactionUrl: "http://demo-bank.xyz/transactions/b2b",
        bankPrefix: "7v7",
        owners: "Demo Bank",
        jwksUrl: "http://demo-bank.xyz/transactions/jwks"
        }]
      )
    }

    // Fetch all banks from central bank to local remote bank collection.
    const banks = await fetch(`${process.env.CENTRAL_BANK_URL}/banks`, {
      headers: { 'api-key' : process.env.API_KEY},
      // Assign timeout to this fetch
      signal: controller.signal,
    })
    .then(res => res.json())
    .then(json => {
      console.log(json);

      // User insertMany to insert all documents received as JSON at once.
      RemoteBank.insertMany(json, {
        // Skips over problematic banks, which are missing some important pieces.
        lean: true
      })
      .then(() => {
        console.log("Remote banks from central bank inserted.");
      })
      .catch(err => {
        console.log(err);
      })
    });
  } catch (err) {
    return {error: err.message};
  }
  // If fetch is successful clear timeout.
  clearTimeout(timeout);
}