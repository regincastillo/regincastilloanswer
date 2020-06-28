const axios = require('axios');

function Service() {
    const axiosConfig = {
        headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json'
        },
        timeout: 15000
    };
    const baseUrl = 'http://private-38e18c-uzduotis.apiary-mock.com/config/'
    this.getCommissionFees = async ({
        user_type,
        type
    }) => {
        this.returnData;
        let url;
        if (type === 'cash_in') {
            url = `${baseUrl}${type.replace('_','-')}`
        } else {
            url = `${baseUrl}${type.replace('_','-')}/${user_type}`
        }
        try {

            const res = await axios.get(url, axiosConfig)

            this.returnData = res.data;

        } catch {
            this.returnData = {
                type: 'error',
                message: 'Something went wrong!'
            }
            throw new Error('Something went wrong!, No API found')
        }

        return this.returnData;
    }
}


module.exports = Service;