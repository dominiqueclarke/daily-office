angular.module('dailyOffice')
.directive('calendar', function() {
  return {
    restrict: 'E'
    , replace: true
    , scope: {
      date: "="
    }
    , templateUrl: './src/components/calendar.html'
    , controller($scope) {

        const today = $scope.date;

          // ---------------------------------------------------------------
          // SOURCES
          // ---------------------------------------------------------------
          //      BLOG: http://www.visualcinnamon.com/2015/09/placing-text-on-arcs.html,
          //      CODE: http://bl.ocks.org/nbremer/bf6d15082ea81ce69b55
          //
          // ---------------------------------------------------------------



          // ---------------------------------------------------------------
          // Config
          // ---------------------------------------------------------------

            var width = 400;
            var height = 400;

            var margin = { left: 20, top: 20, right: 20, bottom: 20 };


          // ---------------------------------------------------------------
          // Data
          // ---------------------------------------------------------------

            //The start date number and end date number of the months in a year
            var monthDataNonLeap = [
              { month: "January", startDateID: 0, endDateID: 30 },
              { month: "February", startDateID: 31, endDateID: 58 },
              { month: "March", startDateID: 59, endDateID: 89 },
              { month: "April", startDateID: 90, endDateID: 119 },
              { month: "May", startDateID: 120, endDateID: 150 },
              { month: "June", startDateID: 151, endDateID: 180 },
              { month: "July", startDateID: 181, endDateID: 211 },
              { month: "August", startDateID: 212, endDateID: 242 },
              { month: "September", startDateID: 243, endDateID: 272 },
              { month: "October", startDateID: 273, endDateID: 303 },
              { month: "November", startDateID: 304, endDateID: 334 },
              { month: "December", startDateID: 335, endDateID: 364 }
            ];

            var monthDataLeap = [
                          { month: "January", startDateID: 0, endDateID: 30 },
                          { month: "February", startDateID: 31, endDateID: 59 },   // leap year
                          { month: "March", startDateID: 60, endDateID: 90 },
                          { month: "April", startDateID: 91, endDateID: 120 },
                          { month: "May", startDateID: 121, endDateID: 151 },
                          { month: "June", startDateID: 152, endDateID: 181 },
                          { month: "July", startDateID: 182, endDateID: 212 },
                          { month: "August", startDateID: 213, endDateID: 243 },
                          { month: "September", startDateID: 244, endDateID: 273 },
                          { month: "October", startDateID: 274, endDateID: 304 },
                          { month: "November", startDateID: 305, endDateID: 334 },
                          { month: "December", startDateID: 335, endDateID: 366 }
            ];

            var monthData = monthDataNonLeap;
            if (moment().isLeapYear()) {
                monthData = monthDataLeap;
            }

          // ---------------------------------------------------------------
          // Calculate seasons
          // ---------------------------------------------------------------
            // var today = new Date();  // new Date("2016-1-22");
            var year = today.getFullYear();
            var adventSeasonArr = advent(year).toDate();
            var christmasDay = new Date(year, 11, 25);
            var christmasSeasonArr = moment().range(new Date(year, 11, 26), new Date(year+1, 0, 6));   // we're not consistently paying attention to year+1
            //var epiphanySeason = moment().range(epiphany(year).dayAfter(), ashWednesday(year)).toDate();
            var epiphanySeasonUSArr = epiphanySeasonUS(year).toDate();  // fixed date for Epiphany
            var lentSeasonArr = lent(year).toDate();
            var holyweekSeasonArr = moment().range(palmSunday(year), easter(year)).toDate();
            var easterSeasonArr = easterSeason(year).toDate();
            var ordinarySeasonArr = secondOrdinaryTime(year).toDate();


            console.log('this is supposed to be today', today);

            var currentSeasonStr = seasonOfUS(today);

            var seasonData = [
                  { season: "Advent",        label:  "Advent",        startDateID: DaysFromAdvent(adventSeasonArr[1], year), endDateID: DaysFromAdvent(adventSeasonArr[0], year) },
                  { season: "Christmas",     label:  "",              startDateID: DaysFromAdvent(christmasSeasonArr[1], year), endDateID: DaysFromAdvent(christmasSeasonArr[1], year) + 12 },
                  { season: "Epiphany",      label:  "Epiphany",      startDateID: DaysFromAdvent(epiphanySeasonUSArr[1], year), endDateID: DaysFromAdvent(epiphanySeasonUSArr[0], year) },
                  { season: "Lent",          label:  "Lent",          startDateID: DaysFromAdvent(lentSeasonArr[1], year), endDateID: DaysFromAdvent(lentSeasonArr[0], year) },
                  { season: "Holy Week",     label:  "",              startDateID: DaysFromAdvent(holyweekSeasonArr[1], year), endDateID: DaysFromAdvent(holyweekSeasonArr[0], year) },
                  { season: "Easter",        label:  "Easter",        startDateID: DaysFromAdvent(easterSeasonArr[1], year), endDateID: DaysFromAdvent(easterSeasonArr[0], year) },
                  { season: "Ordinary Time", label:  "Ordinary Time", startDateID: DaysFromAdvent(ordinarySeasonArr[1], year), endDateID: DaysFromAdvent(ordinarySeasonArr[0], year) },
            ];

            var seasonCss = [
                      { season: "Advent",        body: "seasonArcAdvent", text: "seasonText" },
                      { season: "Christmas",     body: "seasonArcChristmas", text: "seasonTextAlt" },
                      { season: "Epiphany",      body: "seasonArcEpiphany", text: "seasonText" },
                      { season: "Lent",          body: "seasonArcLent", text: "seasonText" },
                      { season: "Holy Week",     body: "seasonArcHolyWeek", text: "seasonText" },
                      { season: "Easter",        body: "seasonArcEaster", text: "seasonTextAlt" },
                      { season: "Ordinary Time", body: "seasonArcOrdinary", text: "seasonText" },
            ];



          // ---------------------------------------------------------------
          // D3 Functions
          // ---------------------------------------------------------------

          //Function to make SVG arc paths with inner and outer radius

          // outer ring (Seasons)
            var arc = d3.svg.arc()
              .innerRadius(width * 0.9 / 2 - 10)
              .outerRadius(width * 0.9 / 2 + 30);

          // inner ring (Months)
            var arc_in = d3.svg.arc()
                  .innerRadius(width * 0.9 / 2 - 50)
                  .outerRadius(width * 0.9 / 2 - 15);


          //Function to turn the month data into start and end angles

              // inner ring (months)
            var janDiff = DaysFromAdvent(new Date(year, 0, 1), year);
            janRotate = (365 - janDiff) / 360 * 365;
            var pie_in = d3.layout.pie()
                          .startAngle(janRotate * Math.PI / 180)
                        .endAngle(janRotate * Math.PI / 180 + 2 * Math.PI)
                .value(function (d) { return d.endDateID - d.startDateID; })
                .padAngle(.01)
                .sort(null);


            // Outer ring (seasons)
            var pie = d3.layout.pie()
              .value(function (d) { return d.endDateID - d.startDateID; })
              .padAngle(.01)
              .sort(null);



          // ---------------------------------------------------------------
          // Start drawing
          // ---------------------------------------------------------------

            //Create SVG element
            var svg = d3.select("#liturgical_cal").append("svg")
                  .attr("width", (width + margin.left + margin.right))
                  .attr("height", (height + margin.top + margin.bottom))
                    .append("g").attr("class", "wrapper")
                  .attr("transform", "translate(" + (width / 2 + margin.left) + "," + (height / 2 + margin.top) + ")");

            svg.transition()
                      .duration(1500)
                      .attrTween("opacity", function () { return d3.interpolateString("0.0", "1.0"); });


            // Create divs for the tooltips
            var tip = d3.select("#liturgical_cal").append("div")
                      .attr("class", "tooltip")
                      .style("opacity", 0);

            var tip_plain = d3.select("#liturgical_cal").append("div")
                          .attr("class", "tooltip-plain")
                          .style("opacity", 0);

            //Draw the arcs
            svg.selectAll(".seasonArc")
              .data(pie(seasonData))
              .enter().append("path")
              //.attr("class", "seasonArc")
                      .attr("class", function (d, i) {
                          if (currentSeasonStr === seasonCss[i].season)
                              return "seasonArc " + seasonCss[i].body;
                          else
                              return "seasonArc " + seasonCss[i].body + " notInSeason";
                      })
                      .on("mouseover", function (d, i) {
                          if (seasonCss[i].season === "Christmas" || seasonCss[i].season === "Holy Week") {  // only show for the seasons where labels don't fit
                              tip_plain.transition()
                                  .duration(200)
                                  .style("opacity", 1.0);
                              tip_plain.html(seasonCss[i].season)
                                  .style("left", (d3.event.pageX) - 50 + "px")
                                  .style("top", (d3.event.pageY - 50) + "px");
                          }
                      })
                      .on("mouseout", function (d) {
                          tip_plain.transition()
                              .duration(200)
                              .style("opacity", 0);

                      })
              .attr("d", arc)
              .each(function (d, i) {

                //A regular expression that captures all in between the start of a string (denoted by ^) and a capital letter L
                //The letter L denotes the start of a line segment
                //The "all in between" is denoted by the .+?
                //where the . is a regular expression for "match any single character except the newline character"
                //the + means "match the preceding expression 1 or more times" (thus any single character 1 or more times)
                //the ? has to be added to make sure that it stops at the first L it finds, not the last L
                //It thus makes sure that the idea of ^.*L matches the fewest possible characters
                //For more information on regular expressions see: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Regular_Expressions
                var firstArcSection = /(^.+?)L/;

                //Grab everything up to the first Line statement
                //The [1] gives back the expression between the () (thus not the L as well) which is exactly the arc statement
                var newArc = firstArcSection.exec(d3.select(this).attr("d"))[1];
                //Replace all the comma's so that IE can handle it -_-
                //The g after the / is a modifier that "find all matches rather than stopping after the first match"
                newArc = newArc.replace(/,/g, " ");

                //Create a new invisible arc that the text can flow along
                svg.append("path")
                .attr("class", "hiddenMonthArcs")
                .attr("id", "seasonArc_" + i)
                .attr("d", newArc)
                .style("fill", "none");
              });

            svg.selectAll(".monthArcInner")
                .data(pie_in(monthData))
                .enter().append("path")
                .attr("class", "monthArc")
                .attr("d", arc_in)
                .each(function (d, i) {

                  var firstArcSection = /(^.+?)L/;
                  var newArc = firstArcSection.exec(d3.select(this).attr("d"))[1];
                  newArc = newArc.replace(/,/g, " ");

                  //Create a new invisible arc that the text can flow along
                  svg.append("path")
                  .attr("class", "hiddenMonthArcsInner")
                  .attr("id", "monthArcInner_" + i)
                  .attr("d", newArc)
                  .style("fill", "none");
                });


            //Append the month names within the arcs
            svg.selectAll(".monthTextInner")
              .data(monthData)
              .enter().append("text")
              .attr("class", "monthText")
              //.attr("x", 5) //Move the text from the start angle of the arc
              .attr("dy", 24) //Move the text down
              .append("textPath")
              .attr("startOffset", "50%")
              .style("text-anchor", "middle")
              .attr("xlink:href", function (d, i) { return "#monthArcInner_" + i; })
              .text(function (d) { return d.month; });


            svg.selectAll(".seasonText")
               .data(seasonData)
               .enter().append("text")
                       .attr("class", function (d, i) {
                           if (currentSeasonStr === seasonCss[i].season)
                               return seasonCss[i].text;
                           else
                               return seasonCss[i].text + " notInSeasonText";
                       })
               //.attr("x", 5) //Move the text from the start angle of the arc
               .attr("dy", 23) //Move the text down
               .append("textPath")
               .attr("startOffset", "50%")
               .style("text-anchor", "middle")
               .attr("xlink:href", function (d, i) { return "#seasonArc_" + i; })
               .text(function (d) { return d.label; });

              // draw circle showing today's date


            var todayValDegrees = DateToDegrees(today, year);
            var todayCircle = svg.append("circle")
                        .attr("cx", 0)
                        .attr("cy", -1 * (width * 0.9 / 2 + 28))
                        .attr("r", 8)
                        .attr('class', 'todayPointer')
                              .attr("transform", "rotate(" + todayValDegrees + ")")
                              .on("mouseover", function (d) {
                                  tip.transition()
                                      .duration(100)
                                      .style("opacity", 1.0);
                                  tip.html(new moment(today).format("MMMM D, Y"))
                                      .style("left", (d3.event.pageX) - 40 + "px")
                                      .style("top", (d3.event.pageY - 50) + "px");
                              })
                              .on("mouseout", function (d) {
                                  tip.transition()
                                      .duration(800)
                                      .style("opacity", 0);
                              });


            todayCircle.transition()
                          .duration(todayValDegrees / 360 * 8000)
                          .attrTween("transform", function () { return d3.interpolateString("rotate(0)", "rotate(" + todayValDegrees + ")"); });


            var allSaintsVal = DateToXY(new Date(year, 10, 1), width * 0.9 / 2 - 50 - 3, year);
                  var allSaintsLine = svg.append("line")
                        .attr("x1", 0)
                        .attr("y1", 0)
                        .attr("x2", allSaintsVal.x)
                              .attr("y2", allSaintsVal.y)
                        .attr('class', 'feastLine')
                              .on("mouseover", function (d) {
                                  tip.transition()
                                      .duration(100)
                                      .style("opacity", 1.0);
                                  tip.html('All Saints Day, November 1')
                                      .style("left", (d3.event.pageX) + 20 + "px")
                                      .style("top", (d3.event.pageY - 28) + "px");
                              })
                              .on("mouseout", function (d) {
                                  tip.transition()
                                      .duration(800)
                                      .style("opacity", 0);
                              });

                  //var allSaintsText = svg.append("text")
                  //            .style("text-anchor", "beginning")
                  //            .attr("dx", "30px")
                  //            .attr("dy", "0px")
                  //            .attr("transform", function (d) {
                  //                return "rotate(-30)"
                  //            })
                  //           .attr("class", "feastText")
                  //           .text("All Saints Day");


                  var christmasVal = DateToXY(new Date(year, 11, 25), width * 0.9 / 2 - 50 - 3, year);
                  var christmasLine = svg.append("line")
                        .attr("x1", 0)
                        .attr("y1", 0)
                        .attr("x2", christmasVal.x)
                              .attr("y2", christmasVal.y)
                        .attr('class', 'feastLine')
                              .on("mouseover", function (d) {
                                  tip.transition()
                                      .duration(100)
                                      .style("opacity", 1.0);
                                  tip.html('Christmas Day, December 25')
                                      .style("left", (d3.event.pageX) + 20 + "px")
                                      .style("top", (d3.event.pageY - 28) + "px");
                              })
                              .on("mouseout", function (d) {
                                  tip.transition()
                                      .duration(800)
                                      .style("opacity", 0);
                              });

                  var christTheKingVal = DateToXY(new Date(year, 10, 20), width * 0.9 / 2 - 50 - 3, year);
                  var christTheKingLine = svg.append("line")
                        .attr("x1", 0)
                        .attr("y1", 0)
                        .attr("x2", christTheKingVal.x)
                              .attr("y2", christTheKingVal.y)
                        .attr('class', 'feastLine')
                              .on("mouseover", function (d) {
                                  tip.transition()
                                      .duration(100)
                                      .style("opacity", 1.0);
                                  tip.html('Christ the King, November 20')
                                      .style("left", (d3.event.pageX) + 20 + "px")
                                      .style("top", (d3.event.pageY - 28) + "px");
                              })
                              .on("mouseout", function (d) {
                                  tip.transition()
                                      .duration(800)
                                      .style("opacity", 0);
                              });

                  var epiphanyVal = DateToXY(new Date(year+1, 0, 6), width * 0.9 / 2 - 50 - 3, year);
                  var epiphanyLine = svg.append("line")
                        .attr("x1", 0)
                        .attr("y1", 0)
                        .attr("x2", epiphanyVal.x)
                              .attr("y2", epiphanyVal.y)
                        .attr('class', 'feastLine')
                              .on("mouseover", function (d) {
                                  tip.transition()
                                      .duration(100)
                                      .style("opacity", 1.0);
                                  tip.html('Epiphany, January 6')
                                      .style("left", (d3.event.pageX) + 20 + "px")
                                      .style("top", (d3.event.pageY - 28) + "px");
                              })
                              .on("mouseout", function (d) {
                                  tip.transition()
                                      .duration(800)
                                      .style("opacity", 0);
                              });


                  var ashWedVal = DateToXY(ashWednesday(year).toDate(), width * 0.9 / 2 - 50 - 3, year);
                  var ashWedLine = svg.append("line")
                        .attr("x1", 0)
                        .attr("y1", 0)
                        .attr("x2", ashWedVal.x)
                              .attr("y2", ashWedVal.y)
                        .attr('class', 'feastLine')
                              .on("mouseover", function (d) {
                                  tip.transition()
                                      .duration(100)
                                      .style("opacity", 1.0);
                                  tip.html('Ash Wednesday, ' + ashWednesday(year).format("MMMM D"))
                                      .style("left", (d3.event.pageX) + 20 + "px")
                                      .style("top", (d3.event.pageY - 28) + "px");
                              })
                              .on("mouseout", function (d) {
                                  tip.transition()
                                      .duration(800)
                                      .style("opacity", 0);
                              });

                  var palmSundayVal = DateToXY(palmSunday(year).toDate(), width * 0.9 / 2 - 50 - 3, year);
                  var palmSundayLine = svg.append("line")
                        .attr("x1", 0)
                        .attr("y1", 0)
                        .attr("x2", palmSundayVal.x)
                              .attr("y2", palmSundayVal.y)
                        .attr('class', 'feastLine')
                              .on("mouseover", function (d) {
                                  tip.transition()
                                      .duration(100)
                                      .style("opacity", 1.0);
                                  tip.html('Palm Sunday, ' + palmSunday(year).format("MMMM D"))
                                      .style("left", (d3.event.pageX) + 20 + "px")
                                      .style("top", (d3.event.pageY - 28) + "px");
                              })
                              .on("mouseout", function (d) {
                                  tip.transition()
                                      .duration(800)
                                      .style("opacity", 0);
                              });

                  var pentecostVal = DateToXY(pentecost(year).toDate(), width * 0.9 / 2 - 50 - 3, year);
                  var pentecostLine = svg.append("line")
                        .attr("x1", 0)
                        .attr("y1", 0)
                        .attr("x2", pentecostVal.x)
                              .attr("y2", pentecostVal.y)
                        .attr('class', 'feastLine')
                              .on("mouseover", function (d) {
                                  tip.transition()
                                      .duration(100)
                                      .style("opacity", 1.0);
                                  tip.html('Pentecost, ' + pentecost(year).format("MMMM D"))
                                      .style("left", (d3.event.pageX) + 20 + "px")
                                      .style("top", (d3.event.pageY - 28) + "px");
                              })
                              .on("mouseout", function (d) {
                                  tip.transition()
                                      .duration(800)
                                      .style("opacity", 0);
                              });

                  var innerCircleBak = svg.append("circle")
                              .attr("cx", 0)
                              .attr("cy", 0)
                              .attr("r", 43)
                              .attr('fill', 'white')
                              .attr('stroke', 'white')

            var innerCircle = svg.append("circle")
                          .attr("cx", 0)
                          .attr("cy", 0)
                          .attr("r", 40)
                          .attr('class', 'centercircle');

            function DaysFromAdvent(adate, yr) {   // adate is a javascript date object
                var b = moment(adventSunday(yr).toDate());
                var a = moment(adate);
                //b.setHours(0, 0, 0, 0); // get rid of time portion
                //a.setHours(0, 0, 0, 0); // get rid of time portion
                var diff = b.diff(a, 'days');
                return Math.floor(diff);
            }

            function DateToXY(adate, radius, year)
            {

                var myDateDegrees = DateToDegrees(adate, year); // treating 0 degrees as straight up (Advent)
                var myDateRadians = myDateDegrees * Math.PI / 180;

                var myDatex = 0;
                var myDatey = 0;

                //alert(myDate + "days |" + myDateDegrees + "degrees | " + myDateRadians + " radians");
                if (myDateDegrees >= 0 && myDateDegrees < 90) {
                    myDatex = radius * Math.sin(myDateRadians);
                    myDatey = -1 * radius * Math.cos(myDateRadians);
                }
                else if (myDateDegrees >= 90 && myDateDegrees < 180) {
                    myDatex = radius * Math.sin(myDateRadians);
                    myDatey = -1 * radius * Math.cos(myDateRadians);
                }
                else if (myDateDegrees >= 180 && myDateDegrees < 270) {
                    myDatex = radius * Math.sin(myDateRadians);
                    myDatey = -1 * radius * Math.cos(myDateRadians);
                }
                else {
                    myDatex = radius * Math.sin(myDateRadians);
                    myDatey = -1 * radius * Math.cos(myDateRadians);
                }

                var myReturn = { x: myDatex, y: myDatey };
                return myReturn;

            }

                  // 0 degrees is straight up!
            function DateToDegrees(adate, year) {
                var myDate = DaysFromAdvent(adate, year);

                var myDateDegrees = 0;

                if (myDate < 0)
                    myDateDegrees = -1 * (360 - (365 - myDate) * 360 / 365);
                else
                    myDateDegrees = (365 - myDate) * 360 / 365;


                return myDateDegrees;

            }

            function epiphanySeasonUS(year) {
                return moment().range(new Date(year, 0, 6), ashWednesday(year));  // fixed date for our Epiphany
            }

            function seasonOfUS(date) {

                var momentDate = moment(date);
                var year = momentDate.year();

                var result;
                var seasonFuncs = [advent, firstChristmasSeason, secondChristmasSeason, epiphanySeasonUS, lent, holyWeek, triduum, easterSeason, secondOrdinaryTime];

                for (var i = 0; i < seasonFuncs.length; i++) {
                    if (seasonFuncs[i](year).contains(momentDate, true)) {
                        result = seasonFuncs[i];
                        console.log('result', result);
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

    }
  }
});
