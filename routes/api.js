/*
*
*
*       Complete the API routing below
*       
*       
*/

'use strict';

const database = require('../database.js');

module.exports = function(app) {

  app.route('/api/books')
    .get(async function(req, res) {
      //response will be array of book objects
      //json res format: [{"_id": bookid, "title": book_title, "commentcount": num_of_comments },...]
      const books = await database.getAllBooks();
      res.send(books);
    })

    .post(async function(req, res) {
      let title = req.body.title;
      //response will contain new book object including atleast _id and title
      if (title === "" || title === null) {
        res.send("missing required field title");
      }
      else {
        const json = await database.addBook(title);
        res.json(json);
      }
    })

    .delete(async function(req, res) {
      //if successful response will be 'complete delete successful'
      const deleteSuccessful = await database.deleteAllBooks();
      if (deleteSuccessful) {
        res.send("complete delete successful");
      }
    });



  app.route('/api/books/:id')
    .get(async function(req, res) {
      let bookid = req.params.id;
      //json res format: {"_id": bookid, "title": book_title, "comments": [comment,comment,...]}
      const book = await database.getBook(bookid);
      if (book === null) {
        res.send("no book exists");
      }
      else {
        res.json({
          title: book.title,
          _id: book._id,
          comments: book.comments
        });
      }
    })

    .post(async function(req, res) {
      let bookid = req.params.id;
      let comment = req.body.comment;
      //json res format same as .get
      if (comment == null) {
        res.send("missing required field comment");
      }
      else {
        const book = await database.addCommentToBook(bookid, comment);
        if (book == null) {
          res.send("no book exists");
        }
        else {
          res.json({
            title: book.title,
            _id: book._id,
            comments: book.comments
          });
        }
      }
    })

    .delete(async function(req, res) {
      let bookid = req.params.id;
      //if successful response will be 'delete successful'
      const deleteSuccessful = await database.deleteBook(bookid);
      if (deleteSuccessful) {
        res.send("delete successful");
      }
      else {
        res.send("no book exists");
      }
    });

};
