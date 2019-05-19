var express = require('express');
var exphdb = require('express-handlebars');
var mongoose = require('mongoose');
var morgan = require('morgan');
var bodyParser = require('body-parser');



var app = express();
app.use(morgan('dev'));

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.engine('.hbs',exphdb({defaultLayout:'main',extname:'.hbs'}));
app.set('view engine','.hbs');

mongoose.connect('mongodb://localhost:27017/test', { useNewUrlParser: true }).then(() => console.log('MongoDB Connected'))
.catch(err => console.log(`Connect fail!!!! with error: ${err}`));

app.use('/public',express.static('public'));

var indexRouter = require('./routes/index');
app.use('/', indexRouter);
var port = 3000;
app.listen(port,()=>{
    console.log(`sever is running at ${port}`);
});
