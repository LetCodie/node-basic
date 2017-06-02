const express = require('express');

const app = express();

app.get('/', (req, resp) => {
  resp.send("Hello World");
});

app.listen(3000, function() {
  console.log("Server started on port 3000...");
})
