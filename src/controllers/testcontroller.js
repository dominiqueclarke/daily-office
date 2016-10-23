angular.module('dailyOffice')
.controller('testCtrl', function(scriptureService, calendarService, $scope, $sce) {
  let season;
  $scope.date = moment().toDate();
  console.log($scope.date);
  // const epochTime = new Date("2016-12-15").getTime();
  // const epochTimeOffset = new Date("2016-12-15").getTimezoneOffset() * 60000;
  // console.log(epochTime);
  // console.log(epochTimeOffset);
  // $scope.date = new Date(epochTime - epochTimeOffset);
  console.log($scope.date);
  const dateQuery = new moment($scope.date).format("YYYY-MM-DD");
  scriptureService.getDailyScripture(dateQuery).then(scriptureHtml => {
    console.log(scriptureHtml);
    $scope.html = $sce.trustAsHtml(`${scriptureHtml}`);
    console.log($scope.html);
  });
  var today = $scope.date;
  var currentSeasonStr = seasonOfUS(today);
  console.log('this is supposed to be a string', currentSeasonStr);
  var seasonClass = currentSeasonStr.replace(/ /g, '').toLowerCase();
  console.log('this is supposed to be the class', seasonClass);
  $scope.seasonbg = seasonClass;
  $scope.season = currentSeasonStr;
  $scope.dateStr = new moment($scope.date).format("MMMM D, Y")
  // calendarService.getDailyCalendar().then(calendar => {
  //   $scope.date = calendar.dateString;
  //   $scope.season = season = calendar.season;
  // })
  scriptureService.getYesterdaysScripture();
  $scope.getYesterdaysScripture = scriptureService.getYesterdaysScripture;

  function seasonOfUS(date) {

      var momentDate = moment(date);
      var year = momentDate.year();

      var result;
      var seasonFuncs = [advent, firstChristmasSeason, secondChristmasSeason, epiphanySeasonUS, lent, holyWeek, triduum, easterSeason, secondOrdinaryTime];

      for (var i = 0; i < seasonFuncs.length; i++) {
          if (seasonFuncs[i](year).contains(momentDate, true)) {
              result = seasonFuncs[i];
              break;
          }
      }

      switch (result) {
          case advent: return "Advent";
          case firstChristmasSeason:
          case secondChristmasSeason: return "Christmas";
          case lent: return "Lent";
          case triduum:
          case holyWeek: return "Holy Week";
          case easterSeason: return "Easter";
          case epiphanySeasonUS: return "Epiphany";
          case secondOrdinaryTime: return "Ordinary Time";
          default: return "Undefined Season"; // this should never happen
      }
  }

  function epiphanySeasonUS(year) {
      return moment().range(new Date(year, 0, 6), ashWednesday(year));  // fixed date for our Epiphany
  }
});
