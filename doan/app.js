var express = require('express');
var exphdb = require('express-handlebars');
var mongoose = require('mongoose');
var morgan = require('morgan');
var bodyParser = require('body-parser');
var hbs_section = require('express-handlebars-sections');
var moment = require('moment');
var config = require('./config/database');
var h_dateformat = require('helper-dateformat');


mongoose.set('useCreateIndex', true);
mongoose.connect(config.database, { useNewUrlParser: true }).then(() => console.log('MongoDB Connected'))
    .catch(err => console.log(`Connect fail!!!! with error: ${err}`));
mongoose.Promise = global.Promise;

var app = express();
app.use(morgan('dev'));



require('./middlewares/session')(app);
require('./middlewares/passport')(app);
require('./middlewares/upload')(app);

app.get('/XD', (req, res) => {
    res.render('XD');
})

app.use(require('./middlewares/auth.mdw'));

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

app.engine('hbs', exphdb({
    layoutsDir: 'views/layouts',
    defaultLayout: 'main.hbs',
    helpers: {
        section: hbs_section(),
        moment: moment(),
        h_dateformat: (date) => {
            return h_dateformat(date, "dd/mm/yyyy");
        },
        ifConTrue: (value1, option) => {
            if (value1 === true) {
                return option.fn(this);
            };
            return option.inverse(this);
        }
    }
}));
app.set('view engine', 'hbs');

app.use(express.json());
app.use('/public', express.static('public'));

var indexRouter = require('./routes/index');
app.use('/', indexRouter);

var userRouter = require('./routes/Users');
app.use('/user', userRouter);

var writerRouter = require('./routes/writer');
app.use('/writer', writerRouter);

var editorRouter = require('./routes/editor');
app.use('/editor',editorRouter);


var port = 3000;
app.listen(port, () => {
    console.log(`sever is running at ${port}`);
});
