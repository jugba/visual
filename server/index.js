const express = require('express');
const bodyParser = require('body-parser');
const logger = require('morgan');
const path = require('path');
const cors = require('cors');

// a.Diseases.aggregate([{ "$group": {"_id": "$disease", "drugs": {"$push": "$drug"}}}, {"$sort": {"_id": 1}}])

let index = require('./routes/index');

const app = express();


app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));
app.use(express.static(path.join(__dirname, 'public')));

let whitelist = ['http://http://localhost:3005/', 'http://localhost:3000/']
let corsOptions = {
  origin: function (origin, callback) {
    if (whitelist.indexOf(origin) !== -1) {
      callback(null, true)
    } else {
      callback(new Error('Not allowed by CORS'))
    }
  }
}
// app.use(cors(corsOptions));

app.use(cors())
app.use('/', index)

app.use(function(req, res, next){
  let err = new Error('Not Found');
  err.status = 404;
  next(err);
})



app.use(function(err, req, res, next){
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  res.status(err.status || 500);
  res.json({error: err.message})
})

module.exports = app;