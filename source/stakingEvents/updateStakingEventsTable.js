require('dotenv').config();

const { BN, toBN } = require("web3-utils");

const make_request = require('./helperScriptsEvents/getEvents.js');
const connectToMySQL = require('../helpers/connect.js');

async function saveEvents(event_name, blocks) {
    let event_array = [];
    try {
        const result = await make_request(event_name, blocks);
        let result_array = await JSON.parse(result.responseText).result;
        if(result_array.length == 0) {
           console.log("no events found");
           return;
        }
        for(i=0; i < result_array.length; i++) {
            const result_i = result_array[i];
            if(result_i.topics.length < 3) {
                topic_2 = null;
            } else {
                topic_2 = toBN(result_i.topics[2]).toString();
            }
            event_array.push(
                [
                    result_i.transactionHash, 
                    result_i.topics[1],
                    topic_2,
                    toBN(result_i.data).div(new BN("1000000000000000000")).toString(), 
                    event_name,
                    toBN(result_i.blockNumber).toString()
                ]
            )
        }
    }catch(err) {
        console.error("error requesting Events: ", err);
    }
    const con = connectToMySQL();
    con.connect(function(err) {
        if (err) throw err;
        let table;
        if(event_name.includes("STAKING_ETHEREUM")) table = "STAKING_ETHEREUM";
        if(event_name.includes("STAKING_POLYGON")) table = "STAKING_POLYGON";
        var sql = `REPLACE INTO ${table} (hash, user, pool, amount, type, blockNumber) VALUES ?`;
        con.query(sql, [event_array], function(err, res) {
            if(err) throw err;
            console.log("Number of records inserted: " + res.affectedRows);
        })
        con.end();
    });

    return;
}

const aggregateRequests = async (chain, blockRange) => {
    if(chain == "ETH") {
        console.log(blockRange.start, blockRange.end);
        saveEvents("STAKING_ETHEREUM_STAKED", blockRange);
        saveEvents("STAKING_ETHEREUM_UNSTAKED", blockRange);
    }else if(chain =="POL") {
        saveEvents("STAKING_POLYGON_STAKED", blockRange);
        saveEvents("STAKING_POLYGON_UNSTAKED", blockRange);
        saveEvents("STAKING_POLYGON_REWARD", blockRange);
        saveEvents("STAKING_POLYGON_COMPOUNDED"), blockRange;
    } else {
        throw "chain not found";
    }
    return 
}
module.exports=aggregateRequests;