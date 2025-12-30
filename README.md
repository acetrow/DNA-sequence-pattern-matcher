# DNA Sequence Pattern Matcher

A Node.js application for analyzing DNA sequences and identifying specific patterns using streaming data processing. The program detects both simple nucleotide patterns and complex IUPAC ambiguity code patterns, reports their positions, and generates frequency statistics for genomic analysis.

Developed as a bioinformatics tool demonstrating event-driven programming, pattern matching algorithms, and real-time data stream processing.

---

## Features

### Dual Pattern Detection System

**Simple Nucleotide Patterns**
- Detects basic DNA patterns: AA, TT, GG, CC
- Reports exact position (offset) of each match
- Zero-based indexing for precise location tracking
- Handles overlapping pattern occurrences

**Complex IUPAC Patterns**
- Supports IUPAC nucleotide ambiguity codes
- Patterns: RTMY, CANT, YYY, VCHYB, RMGAK, CSH, YMM, KSGC
- Maps ambiguous symbols to possible nucleotides
- Frequency analysis for complex pattern combinations

### IUPAC Nucleotide Code Support

| Code | Represents | Meaning |
|------|-----------|---------|
| R | G, A | puRine |
| Y | T, C | pYrimidine |
| K | G, T | Keto |
| M | A, C | aMino |
| S | G, C | Strong (3 H-bonds) |
| W | A, T | Weak (2 H-bonds) |
| B | G, T, C | not A (B comes after A) |
| D | G, A, T | not C (D comes after C) |
| H | A, C, T | not G (H comes after G) |
| V | G, C, A | not T/U (V comes after U) |
| N | A, G, C, T | aNy nucleotide |

### Data Processing

**Streaming Architecture**
- Character-by-character data processing
- Event-driven pattern detection
- Configurable I/O delay simulation (1ms default)
- Multi-line sequence file handling

**Real-Time Analysis**
- Sliding window algorithm for pattern matching
- Continuous sequence building
- Overlapping pattern detection
- Position offset tracking per character

**Statistical Output**
- Per-line frequency tables for all patterns
- Pattern occurrence counting
- Match position reporting with [MATCH] prefix
- Cumulative statistics across sequences

---

## Project Structure

- `minimal_demo.js` — Main program with complete pattern detection implementation
- `testlib.js` — Event-driven testing framework and data streaming engine
- `task3.data` — DNA sequence data file with multiple lines
- `task3.seq` — Pattern list file (optional - patterns hardcoded in script)

---

## Requirements

Node.js 10.0 or newer

Built-in modules only:
- fs (File system operations)

No external dependencies required

---

## Installation and Setup

### 1. Install Node.js

Download and install from https://nodejs.org/
Verify installation: node --version

### 2. Clone Repository

git clone https://github.com/acetrow/DNA-sequence-pattern-matcher.git
cd dna-pattern-matcher

### 3. Verify Data Files

Ensure these files are present in the project directory:
- minimal_demo.js
- testlib.js
- task3.data

---

## Usage

### Running the Pattern Matcher

node minimal_demo.js

### Expected Output Format
```
Patterns: [ 'AA', 'CC', 'TT', 'GG', 'RTMY', 'CANT', 'YYY', 'VCHYB', 'RMGAK', 'CSH', 'YMM', 'KSGC' ]
[MATCH] AA found at 3
[MATCH] TT found at 12
[MATCH] CC found at 8
[MATCH] RTMY found at 15
[MATCH] GG found at 18
... (continues for all matches)

for line 1, Counts:
AA 15
TT 12
GG 18
CC 20
RTMY 45
CANT 12
YYY 8
VCHYB 5
RMGAK 22
CSH 18
YMM 15
KSGC 10

for line 2, Counts:
AA 18
TT 14
GG 22
CC 16
RTMY 38
CANT 9
YYY 11
VCHYB 7
RMGAK 19
CSH 21
YMM 13
KSGC 8
... (continues for each line in data file)
```

---

## Implementation Details

### Event-Driven Architecture

The testlib.js framework provides four event hooks:

**ready Event**
```javascript
testlib.on('ready', function(receivedPatterns) {
    console.log("Patterns:", receivedPatterns);
    testlib.runTests();
});
```
- Fired when pattern list is loaded
- Receives array of patterns to detect
- Triggers test execution

**data Event**
```javascript
testlib.on('data', function(data) {
    currentSeq += data;  // Add character to sequence
    offset++;            // Track position
    
    // Check all patterns
    patterns.forEach(pattern => {
        if (currentSeq.endsWith(pattern)) {
            counts[pattern]++;
            currentSeq = currentSeq.substring(1);
        }
    });
    
    patterns.forEach(checkPatterns);
});
```
- Fired for each character in DNA sequence
- Builds current sequence string
- Performs pattern matching

**reset Event**
```javascript
testlib.on('reset', function() {
    printCounts();       // Output frequency table
    resetCounts();       // Clear counters
    currentSeq = '';     // Clear sequence buffer
    numOfLines++;        // Increment line counter
});
```
- Fired at end of each sequence line
- Triggers statistics output
- Resets state for next line

**end Event**
```javascript
testlib.on('end', function() {
    printCounts();  // Final statistics
});
```
- Fired when all data is processed
- Outputs final line statistics
- Program termination point

### Pattern Matching Algorithm

**Sliding Window Approach**
```javascript
currentSeq += data;  // Add new character

// Check if current sequence ends with pattern
if (currentSeq.endsWith(pattern)) {
    counts[pattern]++;                    // Increment frequency
    currentSeq = currentSeq.substring(1); // Slide window forward
}
```

**Position Tracking**
```javascript
let offset = 0;

// For each character processed
offset++;

// When pattern matches
if (currentSeq.endsWith(pattern)) {
    position = offset - pattern.length;
    testlib.foundMatch(pattern, position);
}
```

### IUPAC Code Mapping
```javascript
const MappingSymbol = {
    'R': ['G', 'A'],           // puRine
    'Y': ['T', 'C'],           // pYrimidine
    'K': ['G', 'T'],           // Keto
    'M': ['A', 'C'],           // aMino
    'S': ['G', 'C'],           // Strong
    'W': ['A', 'T'],           // Weak
    'B': ['G', 'T', 'C'],      // not A
    'D': ['G', 'A', 'T'],      // not C
    'H': ['A', 'C', 'T'],      // not G
    'V': ['G', 'C', 'A'],      // not T
    'N': ['A', 'G', 'C', 'T']  // aNy
};
```

Pattern 'RTMY' expands to match:
- GTAC, GTAT, ATAC, ATAT, GTCC, GTCT, ATCC, ATCT

### Configuration Setup
```javascript
testlib.setup(3, 1);
// Parameter 1: Task number (3 = task3.data)
// Parameter 2: I/O delay in milliseconds (1ms between characters)
```

---

## Data File Format

### task3.data Structure

Plain text file containing DNA sequences:
- Multiple lines of nucleotide sequences
- Standard nucleotides: A, C, G, T
- IUPAC ambiguity codes: R, Y, K, M, S, W, B, D, H, V, N
- Each line processed independently
- Newline character triggers reset event

Example:
```
RTMYYCDYWNGRCYCANTKMHYATBWWMYYYVCHYBMNADCSKKVGAVCN
ANMYWNWAARCCSDVASYVRTNMTKVDHWNATRCGWCCWSGWBNYTWMVS
VATRNGDKVVBKGYHBWKRARWVVSHMCVGGRDSAMCBMVNVAYDBRGNW
```

---

## Output Interpretation

### Match Position Report
```
[MATCH] AA found at 3
```
- Pattern: AA
- Position: 3 (zero-based index)
- Sequence location: characters at index 3 and 4
- First character of sequence is at position 0

### Frequency Table
```
for line 1, Counts:
AA 15
```
- Line number: 1 (1-indexed)
- Pattern: AA
- Occurrences: 15 times in that line
- Counts overlapping matches

---

## Algorithm Analysis

### Time Complexity

O(n × m × p) where:
- n = total sequence length (all characters)
- m = number of patterns (12 patterns)
- p = average pattern length

### Space Complexity

O(m + w) where:
- m = storage for pattern counts dictionary
- w = sliding window size (longest pattern length)

### Performance Characteristics

- Processes sequences character-by-character
- Memory-efficient streaming approach
- Configurable delay simulates I/O constraints
- Handles large genomic datasets incrementally

---

## Biological Applications

### Restriction Enzyme Sites

Identify DNA cutting sites for molecular cloning:
- Type II restriction enzymes
- Palindromic recognition sequences
- Cut site prediction

### Regulatory Elements

Detect gene expression control regions:
- Transcription factor binding sites (TFBS)
- Promoter motifs (TATA box, CAAT box)
- Ribosome binding sites (Shine-Dalgarno)
- Polyadenylation signals

### Sequence Motifs

Find conserved functional patterns:
- CpG islands (gene regulation)
- Splice site consensus sequences
- Start/stop codons
- Signal peptides

### Quality Control

Screen sequencing data:
- Adapter contamination
- Homopolymer runs
- Low complexity regions
- GC content analysis

---

## Extending the Application

### Adding New Patterns

Edit the patterns array in minimal_demo.js:
```javascript
let patterns = [
    'AA', 'CC', 'TT', 'GG',
    'RTMY', 'CANT', 'YYY', 'VCHYB',
    'RMGAK', 'CSH', 'YMM', 'KSGC',
    'NEWPATTERN'  // Add here
];
```

Update counts initialization:
```javascript
let counts = {
    AA: 0, TT: 0, GG: 0, CC: 0,
    RTMY: 0, CANT: 0, YYY: 0, VCHYB: 0,
    RMGAK: 0, CSH: 0, YMM: 0, KSGC: 0,
    NEWPATTERN: 0  // Add here
};
```

### Modifying I/O Delay

Change the second parameter in testlib.setup():
```javascript
testlib.setup(3, 50);  // 50ms delay between characters
```

### Processing Different Data Files

Change the first parameter in testlib.setup():
```javascript
testlib.setup(1, 1);  // Uses task1.data
testlib.setup(2, 1);  // Uses task2.data
testlib.setup(3, 1);  // Uses task3.data
```

---

## Troubleshooting

### "Cannot find module './testlib.js'"

Ensure testlib.js is in the same directory as minimal_demo.js

### "ENOENT: no such file or directory, open 'task3.data'"

Ensure task3.data file exists in the project directory

### No output appears

Check that testlib.runTests() is called in the 'ready' event handler

### Incorrect match counts

Verify pattern definitions match expected sequences
Check that resetCounts() properly reinitializes all counters

---

## License

This project is released under the MIT License.