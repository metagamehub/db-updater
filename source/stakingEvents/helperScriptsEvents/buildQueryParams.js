module.exports = function buildQueryParams(param, blocks) {
    try {
        const queryParams = {
            "jsonrpc": "2.0",
            "method": "eth_getLogs",
            "params": 
            [
                {
                    "fromBlock": blocks.start,
                    "toBlock": blocks.end,
                    "address": [
                        param.address
                    ],
                    "topics": [
                        param.hash
                    ],
                }
            ],
            "id": param.id
        }
        console.log("params for event query: ", queryParams);
        return queryParams;
    }
    catch(err) {
        console.error("error building query params: ", err);
    }
}