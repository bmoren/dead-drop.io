Dead-Drop.io
=========
Media dead-drops!

A Node.JS based media sharing app that gives the media you uploaded to the next user!

Dead-Drop.io is a place for media dead-drops. To use it, simply drag and drop a supported file onto this page, or copy and paste a media url into the box. When you share a piece of media, you will get to see the previous users share. No files are stored, its a one time share for the next user. You give one, you get one.


Install / Run the app
------------

1. Clone or Download the project
2. `cd` into the project folder in a terminal and run `npm install`
3. Start the app with: `node app.js`, then visit `http://localhost:8999`


Todo
------

* Add support for txt, md, csv
* Support for soundcloud, bandcamp, youtube links
* Data persistence, for if/when the server crashes
* Stress-test the application (using `ab` or something)
* ~~Properly Remove temporary uploaded data after it's been viewed~~
* ~~Create deploy script / stuff~~
* ~~Setup the "donate" button stuff (donate with btc)~~


Contributors
-----------
- @mediaupstream
- @bmoren
