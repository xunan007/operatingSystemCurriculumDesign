var express = require('express');
var app = express();

app.use(express.static('./dist'));

var port = process.env.PORT || 3000;

module.exports = app.listen(port, err => {
    if (err) {
        console.log(err);
        return false;
    }
    console.log('listening at http://localhost:' + port + '\n');
});
