var csv = require('csv');
var fs = require('fs');
var formidable = require('formidable');

/* constants into csv */
const ARTIST_IDX = 0;
const SONG_IDX = 1;
const RECORD_IDX = 2;
const LABEL_IDX = 3;
const COUNT_IDX = 4; 


/* process the songs and store them in this arr */
let songs = [];
var songsLog = '';

var parser = csv.parse({delimiter: ','}, function(err, data){

    /* test if two rows in csv file are the same. */
    let match = function(a, b) {
        return a[ARTIST_IDX].trim().toLowerCase() == b[ARTIST_IDX].trim().toLowerCase()
            //&& a[SONG_IDX].trim().toLowerCase() == b[SONG_IDX].trim().toLowerCase()
            && a[RECORD_IDX].trim().toLowerCase() == b[RECORD_IDX].trim().toLowerCase();
    }

    /* iterate over all rows. for each entry, check if it matches any existing processed songs.
     * if so, increase the count variable. if not, set count variable to one and add it to
     * processed songs */
    data.forEach(entry => {
        let found = false;
        for (var i = 0; i < songs.length; i++) {
            if (match(songs[i], entry)) {
                found = true;
                songs[i][COUNT_IDX]++;
            }
        }
        if (!found) {
            entry.push(1); /* count idx */
            songs.push(entry)
        }
    });

    /* sort the array based on count idx */
    songs.sort((a, b) => {
        return b[COUNT_IDX] - a[COUNT_IDX];
    })

    /* top 50 only */
    songs = songs.slice(0, 50);



    /* string.format() from the internet */
    if (!String.prototype.format) {
      String.prototype.format = function() {
        var args = arguments;
        return this.replace(/{(\d+)}/g, function(match, number) {
          return typeof args[number] != 'undefined'
            ? args[number]
            : match
          ;
        });
      };
    }

    /* display it */ //send log back to server

    songs.forEach(song => {
        songsLog += "{0} - {1} by {2}. Album: {3} Label: {4}".format(song[COUNT_IDX], song[SONG_IDX], song[ARTIST_IDX], song[RECORD_IDX], song[LABEL_IDX]) + '\n';
        //console.log("{0} - {1} by {2}. Album: {3} Label: {4}".format(song[COUNT_IDX], song[SONG_IDX], song[ARTIST_IDX], song[RECORD_IDX], song[LABEL_IDX]));

    })


});
module.exports = function(filePath) {
    var stream = fs.createReadStream(filePath);
    stream.pipe(parser);
    //when the stream is done, songsLog is complete and ready to be returned
    stream.on('close', function() {
        console.log('returning');
        return songsLog;
    });
};
