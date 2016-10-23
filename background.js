const today = moment().toDate();
const season = seasonOfUS(today);

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

if(season === "Ordinary Time" || season === "Epiphany") {
  chrome.browserAction.setIcon({
    path: "icon-green2.png"
  });
}
if(season === "Lent" || season === "Advent") {
  chrome.browserAction.setIcon({
    path: "icon-purple2.png"
  });
}
if(season === "Christmas" || season === "Easter") {
  chrome.browserAction.setIcon({
    path: "icon-white2.png"
  });
}
if(season === "Holy Week") {
  chrome.browserAction.setIcon({
    path: "icon-red2.png"
  });
}

chrome.browserAction.onClicked.addListener(function(tab) {
    chrome.tabs.create({'url': chrome.extension.getURL('main.html'), 'selected': true});
});
