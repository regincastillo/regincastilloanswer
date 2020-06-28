function Utils() {

   Date.prototype.getWeek = function () {
      var onejan = new Date(this.getFullYear(), 0, 1);
      var today = new Date(this.getFullYear(), this.getMonth(), this.getDate());
      var dayOfYear = ((today - onejan + 86400000) / 86400000);
      return Math.ceil(dayOfYear / 7)
   };


   const compare = (a, b) => {
      let item1 = new Date(a.date);
      let item2 = new Date(b.date);
      let comparison = 0;
      if (item1 > item2) {
         comparison = -1;
      } else if (item1 < item2) {
         comparision = 1
      }
      return comparison;
   }

   const isSameWeek = ({
      currentOperationDate,
      recentOperationDate
   }) => {
      let valid = false;
      let currentDate = new Date(currentOperationDate).getWeek();
      let recentDate = new Date(recentOperationDate).getWeek();
      if (currentDate === recentDate) {
         valid = true;
      }

      return valid
   }

   const getRecentOperationDate = ({
      inputData,
      currentOperation
   }) => {
      let data = [];
      for (let item of inputData) {
         let currentOperationDate = new Date(currentOperation.date);
         let itemDate = new Date(item.date);
         // console.log('currentOperationDate:', currentOperationDate, '------------itemDate:', itemDate )
         if (
            item.id !== currentOperation.id &&
            item.user_id === currentOperation.user_id &&
            item.type === 'cash_out' &&
            item.user_type == 'natural' &&
            itemDate <= currentOperationDate &&
            isSameWeek({
               currentOperationDate: currentOperationDate,
               recentOperationDate: itemDate
            })) {

            data.push(item);
         }
      }

      let sortData = data.sort(compare);

      let recentDate = null;

      if (sortData.length > 0) {
         recentDate = sortData[0];
      }

      return {
         recentDate: recentDate,
         recentDates: sortData
      }
   }

   const getCashOutNaturalFee = ({
      percents,
      weekLimit,
      operationAmount
   }) => {
      let percentage = percents / 100;
      let fee = 0;
      if (operationAmount > weekLimit) {
         let diff = (operationAmount - weekLimit).toFixed(2);
         fee = (percentage * diff).toFixed(2);
      }
      return fee;
   }

   const SameWeekValidateFee = ({
      currentOperation,
      recentOperation,
      percents,
      weekLimit
      
   }) => {
      let fee = 0;
      let percentage = percents / 100;
      let weeklyTotalAmount = 0;

      for (let item of recentOperation) {
         weeklyTotalAmount = weeklyTotalAmount + item.operation.amount

      }

      if (weeklyTotalAmount > weekLimit) {
         // console.log('--------need fees')
         fee = (percentage * currentOperation.operation.amount).toFixed(2);
      }

      return fee;
   }


   this.cashIn = ({
      percents,
      maxFees,
      amount
   }) => {
      let percentage = percents / 100;
      let fee = (percentage * amount).toFixed(2);
      return fee <= maxFees ? fee : 5.00;
   }

   this.cashOutJuridical = ({
      minAmount,
      percents,
      amount
   }) => {
      let fee = 0;
      if (amount >= minAmount) {
         let percentage = percents / 100
         fee = (percentage * amount).toFixed(2);
      }
      return fee;
   }


   this.cashOutNatural = ({
      currentOperation,
      inputData,
      percents,
      weekLimit
   }) => {

      let fee = 0;
      let recentOperationDates = getRecentOperationDate({
         inputData,
         currentOperation
      });


      if (recentOperationDates.recentDate == null) {
         
         fee = getCashOutNaturalFee({
            percents,
            weekLimit,
            operationAmount: currentOperation.operation.amount
         })

      } else if (isSameWeek({
            currentOperationDate: currentOperation.date,
            recentOperationDate: recentOperationDates.recentDate.date
         })) {

         fee = SameWeekValidateFee({
            currentOperation: currentOperation,
            recentOperation: recentOperationDates.recentDates,
            percents,
            weekLimit
         })
      }

      // console.log('recent date', recentOperationDates)
      return fee;
   }

   this.addUnquieId = (data) => {
      let parseData = [];

      for (let [index, item] of data.entries()) {
         item.id = index + 1
         parseData.push(item)
      }

      return parseData;
   }

};

module.exports = Utils;