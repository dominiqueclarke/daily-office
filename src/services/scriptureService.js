angular.module('dailyOffice')
.service('scriptureService', function($http, $sce) {
  this.getDailyScripture = () => {
    return $http.get('http://www.esvapi.org/v2/rest/readingPlanQuery?key=IP&reading-plan=bcp')
    .then(scripture => {
      console.log(scripture.data);
      //console.log($sce.trustAsHtml(scripture.data));
      return scripture.data;
    });
  };
});
