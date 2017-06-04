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

let articles = require('./routes/articles');
app.use('/articles', articles);

app.listen(3000, function() {
  console.log("Server started on port 3000...");
})
