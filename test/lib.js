/* globals describe, it */

var mocha = require('mocha');
var chai = require("chai");
var expect = chai.expect;
chai.use(require('chai-as-promised'));

describe('core checks', function() {
  
  var writeGood = require('../write-good-as-promised');
  
  describe('lexical-illusions.js', function() {
  
    it('should detect lexical illusions', function () {
      expect(writeGood('the the')).to.eventually.equal([
        { index: 4, offset: 3, reason: '"the" is repeated', type: [ 'illusion' ] }
      ]);
    });
    
    it('should not detect lexical illusions if that check is disabled', function () {
      expect(writeGood('the the', { illusion: false })).to.eventually.equal([]);
    });
    
    it('should detect lexical illusions with line breaks', function () {
      expect(writeGood('the\nthe')).to.eventually.equal([
        { index: 4, offset: 3, reason: '"the" is repeated', type: [ 'illusion']  }
      ]);
    });
    
    it('should detect lexical illusions with case insensitivity', function () {
      expect(writeGood('The the')).to.eventually.equal([
        { index: 4, offset: 3, reason: '"the" is repeated', type: [ 'illusion'] }
      ]);
    });
    
    it('should not detect lexical illusions for non-words', function () {
      expect(writeGood('// //')).to.eventually.equal([]);
    });
  });
  
  describe('starts-with-so.js', function() {
    
    it('should detect sentences that start with "so"', function () {
      expect(writeGood('So the best thing to do is wait.')).to.eventually.equal([
        { index: 0, offset: 2, reason: '"So" adds no meaning', type: [ 'so' ] }
      ]);
    });
    
    it('should not detect sentences that start with "so" if that check is disabled', function () {
      expect(writeGood('So the best thing to do is wait.', { so: false })).to.eventually.equal([]);
    });
    
    it('should not detect "So?"', function () {
      expect(writeGood('So?')).to.eventually.equal([]);
    });
    
    it('should not detect "so" in the middle of a sentence', function () {
      expect(writeGood('This changes the code so that it works.')).to.eventually.equal([]);
    });
    
    it('should not detect words starting with "so"', function () {
      expect(writeGood('Some silly sausages start sentences stating so.')).to.eventually.equal([]);
      expect(writeGood('Sorry, everyone.')).to.eventually.equal([]);
    });
    
    it('should detect clauses after a semicolon that start with "so"', function () {
      expect(writeGood('This is a test; so it should pass or fail.')).to.eventually.equal([
        { index: 16, offset: 2, reason: '"so" adds no meaning', type: [ 'so' ] }
      ]);
    });
  })
  
  describe('there-is.js', function() {
    it('should detect sentences starting with "there is"', function () {
      expect(writeGood('There is a use for this construction.')).to.eventually.equal([
        { index: 0, offset: 8, reason: '"There is" is unnecessary verbiage', type: ['thereIs'] }
      ]);
    });
    
    it('should detect sentences starting with "there are"', function () {
      expect(writeGood('There are uses for this construction.')).to.eventually.equal([
        { index: 0, offset: 9, reason: '"There are" is unnecessary verbiage', type: ['thereIs'] }
      ]);
    });
  })
  
});