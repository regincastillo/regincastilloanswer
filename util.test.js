const Utils = require('./util.js');
const fs = require('fs');
const inputData = fs.readFileSync('./input.json')
const data = JSON.parse(inputData);
const Util = new Utils();

test('should add property ID to the array of objects', () => {
    
    const addId = Util.addUnquieId(data);
    for (let item of addId) {
        expect(item).toHaveProperty('id')
    }
});



test('should compute commission fee for cash in', () => {
    
    const cashIn = Util.cashIn({
        percents: 0.03,
        maxFees: 5,
        amount: 200
    })
    expect(cashIn).toBe('0.06');

})

test('should compute commission fee for cash out for juridical', () => {
    const cashOutJuridical = Util.cashOutJuridical({
        minAmount: 0.5,
        percents: 0.3,
        amount: 300
    })
    expect(cashOutJuridical).toBe('0.90')
})