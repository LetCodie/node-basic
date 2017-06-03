const express = require('express');
const path = require('path');
const mongoose = require('mongoose');

mongoose.connect('mongodb://localhost/node-basic');
let db = mongoose.connection;
db.once('open', function(){
    console.log('Connected to mongodb...');
});

db.on('error', function(error){
  console.log(error);
});

const app = express();

let Article = require('./models/article');

app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

app.get('/', (req, resp) => {
  Article.find({}, function(err, articles){
    if(err) {
      console.log(err);
    } else {
      resp.render('index', {
        title: 'List Articles',
        articles: articles
      });
    }
  });
});

app.get('/articles/add', function(req, res) {
  res.render('add_article', {
    title: 'Add Article'
  })
})

app.listen(3000, function() {
  console.log("Server started on port 3000...");
})
