angular.module('dailyOffice')
.controller('testCtrl', function(scriptureService, calendarService, $scope, $sce) {
  scriptureService.getDailyScripture().then(scriptureHtml => {
    console.log(scriptureHtml);
    $scope.html = $sce.trustAsHtml(`${scriptureHtml}`);
    console.log($scope.html);
  });
  calendarService.getDailyCalendar().then(calendar => {
    $scope.season = calendar.season;
  })
});
