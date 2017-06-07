const express = require('express');
const router = express.Router();

let Article = require('../models/article');
let User = require('../models/user');

router.get('/add',ensureAuthenticated, function(req, res) {
  res.render('add_article', {
    title: 'Add Article'
  })
});

router.post('/add', function(req, res) {
  req.checkBody('title', 'Title is required!').notEmpty();
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
    article.author = req.user._id;
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

router.get('/:id', function(req, res) {
  Article.findById(req.params.id, function(err, article) {
    if(err) {
      console.log(err);
    } else {
      User.findById(article.author, function(err, user) {
        res.render('article', {
          article: article,
          author: user.name
        });
      });
    }
  });
});

router.get('/edit/:id', ensureAuthenticated, function(req, res) {
  Article.findById(req.params.id, function(err, article) {
    if(err) {
      console.log(err);
    } else {
      if(article.author != req.user._id) {
        req.flash('danger', 'not authorize');
        res.redirect('/users/login');
      } else {
        res.render('edit_article', {
          article: article
        });
      }
    }
  });
});

router.post('/edit/:id', function(req, res) {
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

router.delete('/:id', function(req, res) {
  if(!req.user._id)
    res.status(500).send();

  let query = { _id: req.params.id };

  Article.findById(req.params.id, function(err, article) {
    if(article.author != req.user._id) {
      res.status(500).send();
    } else {
      Article.remove(query, function(err) {
        if(err) {
          console.log(err);
        } else {
          req.flash('danger', 'Article removed');
          res.send('Success');
        }
      });
    }
  });
});


function ensureAuthenticated(req, res, next) {
  if(req.isAuthenticated()) {
    return next();
  } else {
    req.flash('danger', 'Please login');
    res.redirect('/users/login');
  }
}

module.exports = router;
