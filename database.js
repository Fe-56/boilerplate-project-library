const { MongoClient, ServerApiVersion } = require('mongodb');
const uri = process.env.DB;
var ObjectId = require('mongodb').ObjectId;

const client = new MongoClient(uri);

async function getCollection() {
  await client.connect();
  const collection = client.db("freeCodeCamp").collection("library");
  return collection;
};

async function addBook(title) {
  const collection = await getCollection();
  const book = {
    title: title,
    comments: [],
    commentcount: 0
  };
  const result = await collection.insertOne(book);
  return {
    title: title,
    _id: result.insertedId
  }
}

async function getAllBooks() {
  const collection = await getCollection();
  const rawResult = await collection.find().toArray();
  const books = rawResult.map((item) => {
    return {
      _id: item._id,
      title: item.title,
      commentcount: item.commentcount
    }
  });
  return books;
}

async function getBook(id) {
  const collection = await getCollection();
  const query = {
    _id: new ObjectId(id)
  }
  const book = await collection.findOne(query);
  return book;
}

async function addCommentToBook(id, comment) {
  const collection = await getCollection();
  const result = await collection.updateOne(
    { _id: new ObjectId(id) },
    {
      $push: {
        comments: comment
      },
      $inc: {
        commentcount: 1
      }
    }
  );
  const book = await collection.findOne({ _id: new ObjectId(id) });
  return book;
}

async function deleteBook(id) {
  const collection = await getCollection();
  const result = await collection.deleteOne({ _id: new ObjectId(id) });
  if (result.deletedCount > 0) {
    return true;
  }
  else {
    return false;
  }
}

async function deleteAllBooks() {
  const collection = await getCollection();
  const result = await collection.drop();
  if (result) {
    return true;
  }
  else {
    return false;
  }
}

module.exports = {
  addBook,
  getAllBooks,
  getBook,
  addCommentToBook,
  deleteBook,
  deleteAllBooks
};