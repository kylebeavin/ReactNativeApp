export default () => {
  const formatDate = (date: Date) => {
    var d = new Date(date),
      month = '' + (d.getMonth() + 1),
      day = '' + d.getDate(),
      year = d.getFullYear();

    if (month.length < 2) month = '0' + month;
    if (day.length < 2) day = '0' + day;

    return [year, month, day].join('-');
  };

  const getSelectedDateRange = () : {gte: Date, lt: number} => {
    let date = new Date();
    let lessThan = date.setDate(date.getDate() + 1)

    let dateRangeObject = {gte: new Date(), lt: lessThan};
    return dateRangeObject;
  }

  const addDays = (date: Date, days: number) : Date => {
    // Add number of days to date and return new Date.
    let nextDate: Date = new Date(date);
    nextDate.setDate(nextDate.getDate() + days);
    return nextDate;
  }

  return {
    formatDate,
    getSelectedDateRange,
    addDays
  };
};
