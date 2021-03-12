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

  const getSelectedDateRange = (date: Date) : {gte: Date, lt: Date} => {
    let dateRangeObject = {gte: date, lt: date};
    return dateRangeObject;
  }

  return {
    formatDate,
    getSelectedDateRange,
  };
};
