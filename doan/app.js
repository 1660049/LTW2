var express = require('express');
var exphdb = require('express-handlebars');
var mongoose = require('mongoose');
var morgan = require('morgan');
var bodyParser = require('body-parser');
var hbs_section = require('express-handlebars-sections');



var config = require('./config/database');
mongoose.set('useCreateIndex', true);
mongoose.connect(config.database, { useNewUrlParser: true }).then(() => console.log('MongoDB Connected'))
.catch(err => console.log(`Connect fail!!!! with error: ${err}`));


var app = express();
app.use(morgan('dev'));

require('./middlewares/session')(app);
require('./middlewares/passport')(app);


app.use(require('./middlewares/auth.mdw'));

app.use(bodyParser.urlencoded({ extended: true}));
app.use(bodyParser.json());



app.engine('.hbs',exphdb({
    defaultLayout:'main',
    extname:'.hbs',
    helpers: {
        section: hbs_section()
    }
}));
app.set('view engine','.hbs');

app.use(express.json());
app.use('/public',express.static('public'));

app.get('/', (req,res)=>{
    res.render('dashboard');
});

var indexRouter = require('./routes/Users');
app.use('/user', indexRouter);




var port = 3000;
app.listen(port,()=>{
    console.log(`sever is running at ${port}`);
});
