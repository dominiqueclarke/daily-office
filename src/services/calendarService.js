angular.module('dailyOffice')
.service('calendarService', function($http, $sce) {
  this.getDailyCalendar = () => {
    return $http.get('http://calapi.inadiutorium.cz/api/v0/en/calendars/general-en/today')
    .then(calendar => {
      //console.log(scripture.data);
      //console.log($sce.trustAsHtml(scripture.data));
      const calendarData = calendar.data;
      const dateString = isoToDateString(calendarData.weekday, calendarData.date);
      calendarData.dateString = dateString;
      return calendarData;
    });
  };

  function isoToDateString(weekday, date) {
    const months = [
      "January",
      "February",
      "March",
      "April",
      "May",
      "June",
      "July",
      "August",
      "September",
      "October",
      "November",
      "December"
    ]

    const month = months[date.slice(5,7) - 1];
    console.log(date.slice(5,6));
    console.log(month);
    const day = date.slice(-2);

    return `${weekday}, ${month} ${day}`;
  }

});
