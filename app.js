const express = require('express');
const path = require('path');

const app = express();

app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

app.get('/', (req, resp) => {
  let articles = [
    {
      id: 1,
      title: 'title 1',
      author: 'John Doe'
    },
    {
      id: 2,
      title: 'title 2',
      author: 'Mark Prin'
    },
    {
      id: 3,
      title: 'title 3',
      author: 'JLo'
    }
  ];
  resp.render('index', {
    title: 'List Articles',
    articles: articles
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
