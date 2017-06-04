const express = require('express');
const path = require('path');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const expressValidator = require('express-validator');
const flash = require('connect-flash');
const session = require('express-session');

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

app.use(session({
  secret: 'some secret',
  resave: true,
  saveUninitialized: true
}));

app.use(require('connect-flash')());
app.use(function(req, res, next) {
  res.locals.messages = require('express-messages')(req, res);
  next();
});

app.use(expressValidator({
  errorFormatter: function(param, msg, value) {
      var namespace = param.split('.')
      , root    = namespace.shift()
      , formParam = root;

    while(namespace.length) {
      formParam += '[' + namespace.shift() + ']';
    }
    return {
      param : formParam,
      msg   : msg,
      value : value
    };
  }
}));

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
  req.checkBody('title', 'Title is required!').notEmpty();
  req.checkBody('author', 'Author is required!').notEmpty();
  req.checkBody('body', 'Body is required!').notEmpty();

  let errors = req.validationErrors();

  if(errors) {
    res.render('add_article', {
      title: 'Add Article',
      errors: errors
    })
  } else {
    let article = new Article();
    article.title = req.body.title;
    article.author = req.body.author;
    article.body = req.body.body;

    article.save(function(err){
      if(err) {
        console.log(err);
        return;
      } else {
        req.flash('success', 'Article Added!');
        res.redirect('/');
      }
    });
  }
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

app.get('/articles/edit/:id', function(req, res) {
  Article.findById(req.params.id, function(err, article) {
    if(err) {
      console.log(err);
    } else {
      res.render('edit_article', {
        article: article
      })
    }
  });
});

app.post('/articles/edit/:id', function(req, res) {
  let article = {};
  article.title = req.body.title;
  article.author = req.body.author;
  article.body = req.body.body;

  let query = { _id: req.params.id };

  Article.update(query, article, function(err) {
    if(err) {
      console.log(err);
    }else{
      req.flash('success', 'Article edited');
      res.redirect('/');
    }
  });
});

app.delete('/articles/:id', function(req, res) {
  let query = { _id: req.params.id };

  Article.remove(query, function(err) {
    if(err) {
      console.log(err);
    } else {
      req.flash('danger', 'Article removed');
      res.send('Success');
    }
  })
});

app.listen(3000, function() {
  console.log("Server started on port 3000...");
})
