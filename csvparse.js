var csv = require('csv');
var fs = require('fs');


const ARTIST_IDX = 0;
const SONG_IDX = 1;
const RECORD_IDX = 2;
const LABEL_IDX = 3;
const COUNT_IDX = 4;

let songs = [];

var parser = csv.parse({delimiter: ','}, function(err, data){

    let match = function(a, b) {
        return a[ARTIST_IDX].trim().toLowerCase() == b[ARTIST_IDX].trim().toLowerCase()
            && a[SONG_IDX].trim().toLowerCase() == b[SONG_IDX].trim().toLowerCase()
            && a[RECORD_IDX].trim().toLowerCase() == b[RECORD_IDX].trim().toLowerCase();
    }

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


    songs.sort((a, b) => {
        return b[COUNT_IDX] - a[COUNT_IDX];
    })

    songs = songs.slice(0, 50);

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

    songs.forEach(song => {
        console.log("{0} - {1} by {2}. Album: {3} Label: {4}".format(song[COUNT_IDX], song[SONG_IDX], song[ARTIST_IDX], song[RECORD_IDX], song[LABEL_IDX]));

    })



});

fs.createReadStream(__dirname+'/ksdt.csv').pipe(parser);
