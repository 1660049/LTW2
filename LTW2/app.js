//var db = require('./ultils/db');
var exphbs = require('express-handlebars');
var express = require('express');
var morgan = require('morgan');

var app = express();

app.use(morgan('dev'));

app.engine('handlebars', exphbs({defaultLayout: 'main'}));
app.set('view engine', 'handlebars');

var ThoiSuRoutes = require('./routes/ThoiSu');
app.use('/ThoiSu',ThoiSuRoutes);

app.get('/',(req, res) => {
    res.render('home');
})

var port = 3000;
app.listen(port, ()=>{
    console.log(`sever is running at port ${port}`);
}
);

