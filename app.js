// const dataPath = require(`${}`)
const fs = require('fs');
const inputData = fs.readFileSync(process.argv[2])
const data = JSON.parse(inputData);
const Service = require('./service.js');
const Utils = require('./util.js');

async function init() {
    const Fees = new Service();
    const Util = new Utils();
    const parseData = Util.addUnquieId(data);
    let count = 1 ;
    for (let item of parseData) {
        let commissionFeesData = await Fees.getCommissionFees({
            type: item.type,
            user_type: item.user_type
        });
        let commissionFees = 0;
        if (item.type === 'cash_in') {
            commissionFees = Util.cashIn({
                percents: commissionFeesData.percents,
                maxFees: commissionFeesData.max.amount,
                amount: item.operation.amount
            })
        } else {
            if (item.user_type === 'juridical') {
                commissionFees = Util.cashOutJuridical({
                    minAmount: commissionFeesData.min.amount,
                    percents: commissionFeesData.percents,
                    amount: item.operation.amount
                })
            } else {
                commissionFees = Util.cashOutNatural({
                    currentOperation: item,
                    inputData: parseData,
                    percents: commissionFeesData.percents,
                    weekLimit: commissionFeesData.week_limit.amount
                })
            }
        }
        console.log(parseFloat(commissionFees).toFixed(2));
    }
}

init();