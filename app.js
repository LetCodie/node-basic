const express = require('express');
const path = require('path');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');

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

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.use(express.static(path.join(__dirname, 'public')));

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
});

app.post('/articles/add', function(req, res) {
  let article = new Article();
  article.title = req.body.title;
  article.author = req.body.author;
  article.body = req.body.body;

  article.save(function(err){
    if(err) {
      console.log(err);
      return;
    } else {
      res.redirect('/');
    }
  });
})

app.get('/articles/:id', function(req, res) {
  Article.findById(req.params.id, function(err, article) {
    if(err) {
      console.log(err);
    } else {
      res.render('article', {
        article: article
      })
    }
  });
});

app.listen(3000, function() {
  console.log("Server started on port 3000...");
})
