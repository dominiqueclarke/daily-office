angular.module('dailyOffice')
.service('calendarService', function($http, $sce) {
  this.getDailyCalendar = () => {
    return $http.get('//calapi.inadiutorium.cz/api/v0/en/calendars/general-en/today')
    .then(calendar => {
      //console.log(scripture.data);
      //console.log($sce.trustAsHtml(scripture.data));
      console.log(calendar);
      return calendar.data;
    });
  };
});
