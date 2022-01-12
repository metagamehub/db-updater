var XMLHttpRequest = require("xmlhttprequest") .XMLHttpRequest;
require('dotenv').config();

const INF_URL_ETH = process.env.INFURA_URL_ETH;
const INF_URL_POL = process.env.INFURA_URL_POL;

var buildQueryParams = require('./buildQueryParams');

var events = require('./eventParams');

module.exports = async function make_request(event_name, blocks) {
    switch (event_name) {
        case "STAKING_ETHEREUM_STAKED":
            return await request(buildQueryParams(events.ethereum.staking.staked, blocks));
        case "STAKING_ETHEREUM_UNSTAKED":
            return await request(buildQueryParams(events.ethereum.staking.unstaked, blocks));
        case "STAKING_POLYGON_STAKED":
            return await request(buildQueryParams(events.polygon.staking.staked, blocks));
        case "STAKING_POLYGON_UNSTAKED":
            return await request(buildQueryParams(events.polygon.staking.unstaked, blocks));
        case "STAKING_POLYGON_REWARD":
            return await request(buildQueryParams(events.polygon.staking.reward, blocks));
        case "STAKING_POLYGON_COMPOUNDED":
            return await request(buildQueryParams(events.polygon.staking.compounded, blocks));
        case "BLOCKNUMBER_ETH":
            return await request({
                "jsonrpc": "2.0",
                "method": "eth_blockNumber",
                "params": [],
                "id": 1
            })
        case "BLOCKNUMBER_POL":
            return await request({
                "jsonrpc": "2.0",
                "method": "eth_blockNumber",
                "params": [],
                "id": 137
            })
        default:
            console.log("no matching events in eventParams.js found for: \n", param);
            return process.exit()
    }
}

async function request(params) {

    let url;
    switch (params.id) {
        case 1:
            url = INF_URL_ETH;
            break;
        case 137:
            url = INF_URL_POL;
            break;
        default:
            console.log("no match for network id: \n", params.id);
            process.exit();
    }   

    return new Promise(function (resolve, reject) {
        let xhr = new XMLHttpRequest();
        let json = JSON.stringify(params);

        xhr.open("POST", url);
        xhr.setRequestHeader('Content-type', 'application/json');
        xhr.onload = function () {
            if (this.status >= 200 && this.status < 300) {
                resolve(xhr);
                console.log(xhr);
            } else {
                reject({
                    status: this.status,
                    statusText: xhr.statusText
                });
            }
        };
        xhr.send(json);
    })
}