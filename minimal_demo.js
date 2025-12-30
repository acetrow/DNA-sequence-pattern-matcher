"use strict";

const testlib = require('./testlib.js');

//initializes empty string to store current sequence
let currentSeq = '';
//set offset =0
let offset = 0;
//initialize object to store counts for different patterns 
let counts = { AA: 0, TT: 0, GG: 0, CC: 0, RTMY: 0, CANT: 0, YYY: 0, VCHYB: 0, RMGAK: 0, CSH: 0, YMM: 0, KSGC: 0 };
//initialize line number
let numOfLines = 0;

//defining an array of patterns to match
let patterns = ['AA', 'CC', 'TT', 'GG', 'RTMY', 'CANT', 'YYY', 'VCHYB', 'RMGAK', 'CSH', 'YMM', 'KSGC'];

//function to reset counts and offset to the initial values
function resetCounts() 
{
    counts = { AA: 0, TT: 0, GG: 0, CC: 0, RTMY: 0, CANT: 0, YYY: 0, VCHYB: 0, RMGAK: 0, CSH: 0, YMM: 0, KSGC: 0 };
    offset = 0; 
}

//patterns for additional symbols
const MappingSymbol = {
    'R': ['G', 'A'],
    'Y': ['T', 'C'],
    'K': ['G', 'T'],
    'M': ['A', 'C'],
    'S': ['G', 'C'],
    'W': ['A', 'T'],
    'B': ['G', 'T', 'C'],
    'D': ['G', 'A', 'T'],
    'H': ['A', 'C', 'T'],
    'V': ['G', 'C', 'A'],
    'N': ['A', 'G', 'C', 'T']
};
  
//function to call the 'foundMatch' function iss pattern is found
function checkPatterns(pattern) {
    if (currentSeq.endsWith(pattern)) {
        testlib.foundMatch(pattern, offset - pattern.length); // Correct position calculation
    }
}

function printCounts() {
    if (numOfLines > 0) {
        //print the line number and counts
        console.log(`for line ${numOfLines}, Counts:`);
        //display the frequency table
        testlib.frequencyTable(counts);
    }
}

testlib.on('ready', function(receivedPatterns) {
    //prints received patterns
    console.log("Patterns:", receivedPatterns);
    testlib.runTests();
});

testlib.on('data', function(data) {
    //adding data to the current sequence
    currentSeq += data;
    //add offset by 1
    offset++; 
    patterns.forEach(pattern => {
        if (currentSeq.endsWith(pattern)) {
            counts[pattern]++;
            //remove first character of the sequence
            currentSeq = currentSeq.substring(1);
        }
    });

    patterns.forEach(checkPatterns);

});

testlib.on('reset', function() {
    //print
    printCounts();
    //reset
    resetCounts();
    currentSeq = '';
    //add line number by 1
    numOfLines++;
});

testlib.on('end', function() {
    //print
    printCounts();
});

testlib.setup(3,1);
