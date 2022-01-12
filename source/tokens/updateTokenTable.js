const { toBN } = require('web3-utils');

var getTokenPrices = require('./helperScriptsTokens/getTokenPrices.js');
var getTokenAmount = require('./helperScriptsTokens/getTokenAmount.js');
const connectToMySQL = require('../helpers/connect.js');
const token = require('./helperScriptsTokens/tokenInfo.js');

const updateToken = async () => {
    let token_updates = [];
    try {
        const result_prices = await getTokenPrices(token);
        const result_amounts = await getTokenAmount(token);
        const result_prices_parsed = JSON.parse(result_prices.responseText).data;
        const keys = Object.values(result_prices_parsed);
        if(keys.length != result_amounts.length) throw "PRICE AND AMOUNT LENGTHS DO NOT MATCH";
        for (let i = 0; i < keys.length; i++) {
            const value = toBN(Math.round(keys[i].quote.USD.price * 10000))
                .mul(result_amounts[i]).div(toBN(10).pow(toBN(token[i].decimals)))
                .div(toBN(10000));
            console.log(value);
            token_updates.push([keys[i].symbol, token[i].decimals, keys[i].quote.USD.price, result_amounts[i], value]);
        }
        console.log(token_updates);
    } catch(err) {
        console.log(err);
    }
 
    const con = connectToMySQL();
    con.connect(function(err) {
        if (err) throw err;
        var sql = `REPLACE INTO tokens (symbol, decimals, price, amount, value) VALUES ?`;
        con.query(sql, [token_updates], function(err, res) {
            if(err) throw err;
            console.log("Number of records inserted: " + res.affectedRows);
        })
        con.end();
    });

    return;
}
module.exports=updateToken;