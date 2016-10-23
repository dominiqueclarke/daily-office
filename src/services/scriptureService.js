angular.module('dailyOffice')
.service('scriptureService', function($http, $sce) {
  this.getDailyScripture = (date) => {
    return $http.get(`http://www.esvapi.org/v2/rest/readingPlanQuery?key=IP&reading-plan=bcp&date=${date}&include-footnotes=0&include-footnote-links=0&include-short-copyright=0&include-copyright=1&include-audio-link=0`)
    .then(scripture => {
      console.log(scripture);
      return scripture.data;
    });
  };
  this.getYesterdaysScripture = () => {
    const yesterday = new Date().getTime() - 86400000;
    const yesterdayString = isoToQueryString(yesterday);
    console.log(yesterdayString);
    return $http.get('http://www.esvapi.org/v2/rest/readingPlanQuery?key=IP&reading-plan=bcp&include-footnotes=0&include-footnote-links=0&include-short-copyright=0&include-copyright=1&include-audio-link=0&date=' + yesterdayString)
    .then(scripture => {
      console.log('yesterday scripture', scripture.data)
      //console.log($sce.trustAsHtml(scripture.data));
      return scripture.data;
    });
  }

  function isoToQueryString(milliseconds) {
    var date = new Date(milliseconds);
    var y = date.getFullYear()
    var m = date.getMonth() + 1;
    var d = date.getDate();
    m = (m < 10) ? '0' + m : m;
    d = (d < 10) ? '0' + d : d;
    return [y, m, d].join('-');
  }
});
