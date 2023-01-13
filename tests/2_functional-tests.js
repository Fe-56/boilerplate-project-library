/*
*
*
*       FILL IN EACH FUNCTIONAL TEST BELOW COMPLETELY
*       -----[Keep the tests in the same order!]-----
*       
*/

const chaiHttp = require('chai-http');
const chai = require('chai');
const assert = chai.assert;
const server = require('../server');
var ObjectId = require('mongodb').ObjectId;

chai.use(chaiHttp);

const time = 9000;
let sampleId;
const invalidId = new ObjectId('000000000000000000000000');

suite('Functional Tests', function() {

  /*
  * ----[EXAMPLE TEST]----
  * Each test should completely test the response of the API end-point including response status code!
  */
  // test('#example Test GET /api/books', function(done) {
  //   this.timeout(time);
  //   chai.request(server)
  //     .get('/api/books')
  //     .end(function(err, res) {
  //       assert.equal(res.status, 200);
  //       assert.isArray(res.body, 'response should be an array');
  //       assert.property(res.body[0], 'commentcount', 'Books in array should contain commentcount');
  //       assert.property(res.body[0], 'title', 'Books in array should contain title');
  //       assert.property(res.body[0], '_id', 'Books in array should contain _id');
  //       done();
  //     });
  // });
  /*
  * ----[END of EXAMPLE TEST]----
  */

  suite('Routing tests', function() {


    suite('POST /api/books with title => create book object/expect book object', function() {

      test('Test POST /api/books with title', function(done) {
        //done();
        this.timeout(time);
        chai.request(server)
          .post('/api/books')
          .set('content-type', 'application/x-www-form-urlencoded')
          .send({
            title: 'This is a test title'
          })
          .end((err, res) => {
            assert.equal(res.status, 200);
            assert.isObject(res.body, 'response should be a JSON object');
            assert.property(res.body, 'title', 'Book should contain a title');
            assert.property(res.body, '_id', 'Book should contain _id');
            sampleId = res.body._id;
            done();
          });
      });

      test('Test POST /api/books with no title given', function(done) {
        //done();
        this.timeout(time);
        chai.request(server)
          .post('/api/books')
          .set('content-type', 'application/x-www-form-urlencoded')
          .send({
            title: ''
          })
          .end((err, res) => {
            assert.equal(res.status, 200);
            assert.isString(res.text, 'response should be a string');
            assert.equal(res.text, 'missing required field title');
            done();
          });
      });

    });


    suite('GET /api/books => array of books', function() {

      test('Test GET /api/books', function(done) {
        //done();
        this.timeout(time);
        chai.request(server)
          .get('/api/books')
          .end(function(err, res) {
            assert.equal(res.status, 200);
            assert.isArray(res.body, 'response should be an array');
            assert.property(res.body[0], 'commentcount', 'Books in array should contain commentcount');
            assert.property(res.body[0], 'title', 'Books in array should contain title');
            assert.property(res.body[0], '_id', 'Books in array should contain _id');
            done();
          });
      });

    });


    suite('GET /api/books/[id] => book object with [id]', function() {

      test('Test GET /api/books/[id] with id not in db', function(done) {
        //done();
        this.timeout(time);
        chai.request(server)
          .get(`/api/books/${invalidId}`)
          .end(function(err, res) {
            assert.equal(res.status, 200);
            assert.isString(res.text, 'response should be a string');
            assert.equal(res.text, 'no book exists');
            done();
          });
      });

      test('Test GET /api/books/[id] with valid id in db', function(done) {
        //done();
        this.timeout(time);
        chai.request(server)
          .get(`/api/books/${sampleId}`)
          .end(function(err, res) {
            assert.equal(res.status, 200);
            assert.isObject(res.body, 'response should be a JSON object');
            assert.property(res.body, 'comments', 'Book should contain comments');
            assert.property(res.body, 'title', 'Book should contain title');
            assert.property(res.body, '_id', 'Book should contain _id');
            done();
          });
      });

    });


    suite('POST /api/books/[id] => add comment/expect book object with id', function() {

      test('Test POST /api/books/[id] with comment', function(done) {
        //done();
        this.timeout(time);
        chai.request(server)
          .post(`/api/books/${sampleId}`)
          .set('content-type', 'application/x-www-form-urlencoded')
          .send({
            comment: 'This is a test comment'
          })
          .end(function(err, res) {
            assert.equal(res.status, 200);
            assert.isObject(res.body, 'response should be a JSON object');
            assert.property(res.body, 'comments', 'Book should contain commentcount');
            assert.property(res.body, 'title', 'Book should contain title');
            assert.property(res.body, '_id', 'Book should contain _id');
            done();
          });
      });

      test('Test POST /api/books/[id] without comment field', function(done) {
        //done();
        chai.request(server)
          .post(`/api/books/${sampleId}`)
          .set('content-type', 'application/x-www-form-urlencoded')
          .send({})
          .end(function(err, res) {
            assert.equal(res.status, 200);
            assert.isString(res.text, 'response should be a string');
            assert.equal(res.text, 'missing required field comment');
            done();
          });
      });

      test('Test POST /api/books/[id] with comment, id not in db', function(done) {
        //done();
        this.timeout(time);
        chai.request(server)
          .post(`/api/books/${invalidId}`)
          .set('content-type', 'application/x-www-form-urlencoded')
          .send({
            comment: 'This is a test comment'
          })
          .end(function(err, res) {
            assert.equal(res.status, 200);
            assert.isString(res.text, 'response should be a string');
            assert.equal(res.text, 'no book exists');
            done();
          });
      });

    });

    suite('DELETE /api/books/[id] => delete book object id', function() {

      test('Test DELETE /api/books/[id] with valid id in db', function(done) {
        //done();
        this.timeout(time);
        chai.request(server)
          .delete(`/api/books/${sampleId}`)
          .end(function(err, res) {
            assert.equal(res.status, 200);
            assert.isString(res.text, 'response should be a string');
            assert.equal(res.text, 'delete successful');
            done();
          });
      });

      test('Test DELETE /api/books/[id] with  id not in db', function(done) {
        //done();
        this.timeout(time);
        chai.request(server)
          .delete(`/api/books/${invalidId}`)
          .end(function(err, res) {
            assert.equal(res.status, 200);
            assert.isString(res.text, 'response should be a string');
            assert.equal(res.text, 'no book exists');
            done();
          });
      });

    });

  });

});
