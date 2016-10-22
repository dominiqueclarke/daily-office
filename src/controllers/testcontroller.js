angular.module('dailyOffice')
.controller('testCtrl', function(scriptureService, calendarService, $scope, $sce) {
  let season;
  scriptureService.getDailyScripture().then(scriptureHtml => {
    console.log(scriptureHtml);
    $scope.html = $sce.trustAsHtml(`${scriptureHtml}`);
    console.log($scope.html);
  });
  calendarService.getDailyCalendar().then(calendar => {
    $scope.date = calendar.dateString;
    $scope.season = season = calendar.season;
    if(season === "ordinary") {
      console.log('the season is ordinary');
      chrome.runtime.sendMessage({ "newIconPath" : "icon-green.png" });
    }
  })
  scriptureService.getYesterdaysScripture();
  $scope.getYesterdaysScripture = scriptureService.getYesterdaysScripture;
});
