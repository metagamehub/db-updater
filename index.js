const fs = require('fs');
const readline = require('readline');

const request_block_number = require('./source/stakingEvents/helperScriptsEvents/getEvents.js');
const updateEvents = require('./source/stakingEvents/updateStakingEventsTable.js');
const updateToken = require('./source/tokens/updateTokenTable.js');

function update() {
    updateToken()
    const rl = readline.createInterface({
        input: fs.createReadStream('blockTracker.txt'),
        output: process.stdout,
        terminal: false
    });

    rl.on('line', (line) => {
        request_block_number("BLOCKNUMBER_ETH",).then(function (res) {
            updateEvents("ETH", {
                start: line,
                end: JSON.parse(res.responseText).result
            })
        })
    });
}
update();
