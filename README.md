## Inspiration

We wanted to create a way to get scripture in front of believers more often and aid them in incorporating daily scripture reading into their lives. At the same time, we wanted to help believers be more mindful about the seasons of the church calendar as the global church reflects on our history together. 

## What it does

In order to accomplish this, we build a Daily Office chrome extension. After installing the extension in your chrome browser, the icon gives quick visual cues based on color of the current time in the liturgical calendar. On clicking the extension icon, a new tab is generated that pulls up the Daily Office readings for the current date, displays the current church season, and displays a dynamically generated liturgical calendar for the full year. 

## How we built it

We used the ESV API to query the Daily Office scriptures for the current date. We then used Advent.js, a JavaScript library based on the liturgical seasons, to determine the season for the current date and the season timeline for the current year. We then used D3.js to visualize the liturgical seasons on the calendar. We decided to package the application as a chrome extension to give believers quick access to this content at the touch of a button. 

## Challenges we ran into

As we were building on our local host, we ran into some issues with cross origin resource sharing as well as mixed content issues (some content being served over http and other content being served over https). Fortunately, after reading up on google chrome extensions, we found that packaging the extension and accurately setting permissions for the extension solved these issues. We all had a crash course in using D3 for the visual display of the seasons along with a refresher on trig to calculate the placement of the current date on the arc.

## Accomplishments that we're proud of

We are happy that we build an application that has immediate utility to believers. Although we are only releasing our first version, the application is immediately useful in it's beta state. We were unsure if we could accomplish the complexities of the dynamically generated D3 calendar in one weekend, but thanks to dedicated and talented developers we were able to accomplish the bulk of the work in one day. Despite not working together previously, we worked well together as a team, organizing tasks, working both independently and as a group, and playing to each other's strengths. 

## What we learned

Many developers working on this project, despite having years of profession development experience, had little experience working in JavaScript. Everyone learned a bit more about JavaScript, packaging chrome extensions, parsing dates accurately using Moment.js, and data visualization with D3.js. In addition to learning new technologies, we also learned a lot about the church calendar throughout our research, discovering just how the seasons are calculated based on the date of Easter. 

## What's next for Daily Office Chrome Extension
Our current application is based on the US Roman Catholic liturgical seasons and displayed in English. It would be great to add localization for multi-language and other countries. It would also be great to add preferences to determine which liturgical calendar you wanted based on your denomination, as well as query for the Daily Office scriptures based on any date (in case you missed a day, as we often do). We'd also like to add the audio so that believers can easily listen to the scripture as well. 
