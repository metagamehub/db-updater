var XMLHttpRequest = require("xmlhttprequest") .XMLHttpRequest;

const baseUrlCMC = 'https://pro-api.coinmarketcap.com/v1/cryptocurrency/quotes/latest?id=';

const request = async (token) => {
    let url = baseUrlCMC;
    for (let i = 0; i < token.length; i++) {
        url = url + token[i].cmc_id;
        if(i < token.length - 1) url += ","
    }
    console.log("query URL: ", url)
    return new Promise(function (resolve, reject) {
        let xhr = new XMLHttpRequest();

        xhr.open("GET", url);
        xhr.setRequestHeader("X-CMC_PRO_API_KEY", process.env.CMC_API_KEY);
        xhr.onload = function () {
            if (this.status >= 200 && this.status < 300) {
                resolve(xhr);
                console.log("successfull request: ", xhr)
            } else {
                reject({
                    status: this.status,
                    statusText: xhr.statusText,
                    responseText: xhr.responseText
                });
            }
        };
        xhr.send();
    })
}
module.exports=request;
