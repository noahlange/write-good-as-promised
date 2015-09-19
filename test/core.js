/* globals describe, it */

var mocha = require('mocha');
var chai = require("chai");
var expect = chai.expect;
chai.use(require('chai-as-promised'));

describe('Write-Good (as Promised)', function() {
  
  var writeGood = require('../write-good-as-promised');
  
  describe('general functionality', function() {
  
    it('should return a Promise', function() {
      expect(writeGood('foobar')).to.be.an.instanceOf(Promise);
    });
    
    it('should have no suggestions for an empty string', function() {
      expect(writeGood()).to.eventually.equal([]);
    });
    
    it('should order suggestions by index', function () {
      expect(writeGood('It has been said that few developers can write.')).to.eventually.equal([
        { index: 7, offset: 9, reason: '"been said" is passive voice' },
        { index: 22, offset: 3, reason: '"few" is a weasel word' }
      ]);
    });  
  });
  
  describe('#reasonable', function() {
  
    it('should return a function', function() {
      expect(writeGood.reasonable('is a buzzword', 'Big data!')).to.be.a('function')
    });
    
    it('should truncate an excessively long reason', function() {
      var reason = writeGood.reasonable('Supercalifragilisticexpialidociousupercalifragilisticexpialidocious!');
      var suggestion = { index: 0, offset: 67, type: [ 'buzzword' ] }
      expect(reason(suggestion)).to.eql({ index: 0, offset: 67, reason: `"Supercalifragilisticexpialidociousupercalifragilisticexpialidoci..." is a buzzword`, type: ['buzzword'] });
    });
  });
  
  describe('#dedup', function() {
        
    it('should combine suggestions with the same index/offset', function() {
      
      var suggestion = writeGood.dedup([
        { index: 17, offset: 9, reason: '"extremely" is a weasel word', type: ['weasel']},
        { index: 17, offset: 9, reason: '"extremely" can weaken meaning', type: ['adverb']},
        { index: 17, offset: 9, reason: '"extremely" is filler', type: ['filler']}]
      );
      expect(suggestion).to.eql([
        { index: 17, offset: 9, reason: '"extremely" is a weasel word and can weaken meaning and is filler', type: ['weasel', 'adverb', 'filler']}
      ]);
    });
    
  })
  
});