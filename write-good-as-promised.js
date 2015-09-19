var dl = require('wgap-datalist');

var checks = {
  weasel: { fn: require('weasel-words'), explanation: 'is a weasel word' },
  illusion: { fn: require('./lib/lexical-illusions'), explanation: 'is repeated' },
  so: { fn: require('./lib/starts-with-so'), explanation: 'adds no meaning' },
  thereIs: { fn: require('./lib/there-is'), explanation: 'is unnecessary verbiage' },
  passive: { fn: require('passive-voice'), explanation: 'may be passive voice' },
  adverb: { fn: require('adverb-where'), explanation: 'can weaken meaning' },
  wordy: { fn: require('too-wordy'), explanation: 'is wordy or unneeded' },
  cliche: { fn: require('no-cliches'), explanation: 'is a cliche' },
  readability: { fn: require('wgap-flesch-kincaid') },
  frankenword: { fn: require('frankenword'), explanation: 'is ghastly' },
  buzzword: { fn: dl(require('buzzwords')), explanation: 'is a buzzword' },
  filler: { fn: dl(require('fillers')), explanation: 'is filler' },
  hedge: { fn: dl(require('hedges')), explanation: 'is a hedge word' }
};

module.exports = function (text, opts) {

  // Generate a reason for a suggestion, truncated appropriately.  
  function reasonable(reason) {
    return suggestion => {
      var txt = text.substr(suggestion.index, suggestion.offset);
      var truncated = txt.length > 64 ? txt.substr(0, 64) + '...' : txt;
      suggestion.reason = `"${ truncated }" ${ (reason || suggestion.reason) }`;
      return suggestion;
    };
  }

  // Concatenate reasons for passages with multiple errors.
  function dedup(suggestions) {
    var dupsHash = {};
    return suggestions.reduce((memo, suggestion) => {
      var key = suggestion.index + ':' + suggestion.offset;
      if (!dupsHash[key]) {
        dupsHash[key] = suggestion;
        memo.push(suggestion);
      } else {
        dupsHash[key].reason += ' and ' + suggestion.reason.substring(suggestion.offset + 3);
      }
      return memo;
    }, []);
  }

  return new Promise((resolve, reject) => {
    
    // Go ahead and resolve if we haven't been given any text.
    if (text === undefined || text === '') {
      resolve([]);
    } else {
      opts = opts || {};
      var suggestions = Object.keys(checks)
        .filter(check => {
          return opts[check] !== false;
        }).map(check => {
          return new Promise((resolve, reject) => {
            var res = checks[check].fn(text, opts[check]);
            Promise.resolve(res)
              .then(items => {
                var reasoned = items
                  .map(reasonable(checks[check].explanation))
                  .map(suggestion => {
                    suggestion.type = check;
                    return suggestion;
                  });
                resolve(reasoned);
              });
          });
        });
      Promise.all(suggestions)
        .then(suggestions => {
          var reduced = suggestions.reduce((prev, curr) => {
            return prev.concat(curr);
          });
          var out = dedup(reduced).sort((a, b) => {
            return a.index < b.index ? -1 : 1;
          });
          resolve(out);
        });
    }
  });
}

module.exports.annotate = require('./lib/annotate');
