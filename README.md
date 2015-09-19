# Write Good (As Promised)

[![Build Status](https://travis-ci.org/noahlange/write-good-as-promised.svg?branch=master)](https://travis-ci.org/noahlange/write-good-as-promised)
[![Coverage Status](https://coveralls.io/repos/noahlange/write-good-as-promised/badge.svg?branch=master&service=github)](https://coveralls.io/github/noahlange/write-good-as-promised?branch=master)

Naive linter for English prose for developers who can't write good and wanna learn to do other stuff good too. (Now with Promises and ES6 and a few more checks.)

## Use
```shell
git clone http://github.com/noahlange/write-good-as-promised.git
cd write-good-as-promised
npm install
```

**Important:** Do not use this tool to be a jerk to other people about their writing.

## API
`writeGood` is a function that takes a string and resolves to an array of suggestions.

```javascript
var writeGood = require('write-good');

writeGood('So the cat was stolen.')
  .then(suggestions => {
    console.log(suggestions);  
  });
  
// [{
//   suggestion: "omit 'So' from the beginning of sentences",
//   index: 0, offset: 2, type: [ 'so' ]
// }, {
//   suggestion: "'was stolen' is passive voice",
//   index: 11, offset: 10, type: [ 'passiveVoice' ]
// }]

```

`writeGood` takes an optional second argument that allows you to disable or pass options through to checks.

You can disable checking for passive voice like this:

```javascript
var writeGood = require('write-good');

writeGood('So the cat was stolen', { passive: false })
  .then(suggestions => {
    console.log(suggestions);
  });
  
// []
```

Or provide a maximum grade level for the Flesch-Kincaid readibility test:

```javascript
var writeGood = require('write-good');
var text = 'The Australian platypus is seemingly a hybrid of mammalian and reptilian creatures.';

writeGood(text)
  .then(suggestions => {
    console.log(suggestions);
  });

// []

writeGood(text, { readability: { level: 10 } })
  .then(suggestions => {
    console.log(suggestions);
  });
  
// [{
//    index: 0,
//    offset: 83,
//    reason: ""The Australian platypus is seemingly a hybrid of mammalian and r..." has a Flesch-Kincaid readibility score is 11.265.",
//    type: ['readability']
//  }]
``` 

## Checks
You can disable any combination of the following by providing a key with value `false` as the second argument to `writeGood`.

| Check           | Description                                                            | Package             |
|-----------------|------------------------------------------------------------------------|---------------------|
| `illusion`      | Checks for lexical illusions – cases where a word is repeated.         | -                   |
| `so`            | Checks for `so` at the beginning of the sentence.                      | -                   |
| `thereIs`       | Checks for `there is` or `there are` at the beginning of the sentence. | -                   |
| `passive`       | Checks for passive voice.                                              | passive-voice       |
| `weasel`        | Checks for "weasel words."                                             | weasel-words        |
| `adverb`        | Checks for adverbs that can weaken meaning: really, extremely, etc.    | adverb-where        |
| `tooWordy`      | Checks for wordy phrases and unnecessary words                         | too-wordy           |
| `cliches`       | Checks for common cliches                                              | no-cliches          |
| `frankenwords`  | Checks for 'frankenwords'                                              | frankenword         |
| `fleschKincaid` | Checks for sentence readability.                                       | wgap-flesch-kincaid |
| `filler`        | Checks for filler words: like, frankly, just, etc.                     | fillers             |
| `hedge`         | Checks for hedge words: basically, appears to be, clearly, etc.        | hedges              |
| `buzzword`      | Checks for buzzwords: synergy, big data, devops, etc.                  | buzzwords           |

## See also

The author of the original module came across these resources while doing research to make this module.
They might be helpful.

### Code

* [shell script for avoiding "weasel words"](http://matt.might.net/articles/shell-scripts-for-passive-voice-weasel-words-duplicates/) – I based my initial implementation on this
* [Academic Writing Check](https://github.com/devd/Academic-Writing-Check) – a perl script similar to above
* [writegood mode](https://github.com/bnbeckwith/writegood-mode) for emacs
* [natural](https://github.com/NaturalNode/natural) – general purpose NLP toolkit in JavaScript
* [WordNet](http://wordnet.princeton.edu/) – lexical database of the English language
* [LanguageTool](https://languagetool.org/) – style and grammar checker implemented in Java
* [linter-write-good](https://github.com/gepoch/linter-write-good) for [Atom](https://atom.io/)

### Prose

* [Elements of Style](http://www.bartleby.com/141/)
* [Flesch–Kincaid readability](http://en.wikipedia.org/wiki/Flesch%E2%80%93Kincaid_readability_test)
* [Fear and Loathing of the English passive](http://www.lel.ed.ac.uk/~gpullum/passive_loathing.pdf)
* [Words to Avoid in Educational Writing](http://css-tricks.com/words-avoid-educational-writing/)

### Apps

This is not an endorsement.
These apps have similar functionality that you may find useful.

* [Hemingway App](http://www.hemingwayapp.com/)
* [Nitpicker](http://nitpickertool.com)

## License
MIT
