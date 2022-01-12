const { toBN, BN } = require('web3-utils');
const { ethers } = require('ethers');

const abi_balanceOf = [{"constant": true,"inputs": [{"name": "_owner","type": "address"}],"name": "balanceOf","outputs": [{"name": "balance","type": "uint256"}],"payable": false,"stateMutability": "view","type": "function"}]

const token = require('./tokenInfo.js')
const MGH_TREASURY_ETHEREUM = "0x2a9Da28bCbF97A8C008Fd211f5127b860613922D";
const MGH_TREASURY_POLYGON = "0x16d0F35b8A4bfc49391d9c374d5AF4ec2dFB25bc";

const getTokenAmount = async() => {
    let treasury_address;
    let balances = [];
    let tokenContract;
    let token_info_for_chain;
    let provider;
    for (let i = 0; i < token.length; i++) {
        let token_balance = new BN("0");
        try {
            let chains = Object.keys(token[i].chains);
            console.log("chains keys: ", chains)
            for(let k = 0; k < chains.length; k++) {
                console.log("chain now: ", chains[k])
                console.log("chains detected: ", chains[k]);
                switch (chains[k]) {
                    case "eth":
                        provider = new ethers.providers.InfuraProvider('mainnet', process.env.INFURA_ID_ETHEREUM);
                        treasury_address = MGH_TREASURY_ETHEREUM;
                        token_info_for_chain = token[i].chains.eth;
                        console.log("ETH!");
                        break;
                    case "pol":
                        provider = new ethers.providers.InfuraProvider("matic", process.env.INFURA_ID_POLYGON);
                        treasury_address = MGH_TREASURY_POLYGON;
                        token_info_for_chain = token[i].chains.pol;
                        break;
                    default:
                        throw "no provider for chain found. Please add a provider.";
                }
                if(token_info_for_chain.address) {
                    tokenContract = new ethers.Contract(token_info_for_chain.address, abi_balanceOf, provider);
                    let amount_to_add = toBN(await tokenContract.balanceOf(treasury_address))
                    token_balance = token_balance.add(amount_to_add);
                }else {
                    let amount_to_add = toBN(await provider.getBalance(treasury_address))
                    token_balance = token_balance.add(amount_to_add);
                }
            }
        } catch(err) {
            console.log("error caught: ", err);
        }
        
        balances.push(token_balance);
    }
    return balances;
}
module.exports=getTokenAmount;