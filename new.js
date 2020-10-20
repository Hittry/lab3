const mUrl = '/api/ShuvalovSasha/lab1/lab3';
var express = require('express');
var app = express();

app.set('view engine', 'pug');
var fs = require('fs');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var mongoose = require('mongoose');
var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;

mongoose.Promise = global.Promise;
mongoose.connect('mongodb://localhost/node-auth', { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() =>  console.log('connection succesful'))
    .catch((err) => console.error(err));

var index = require('./routes/index');


fs.open('errorLog.txt', 'w+', (err, fd) => {
    if (err) throw err;
});
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(require('express-session')({
    secret: 'secret key', //строка, которой подписывается сохраняемый в cookie идентификатор сессии;
    resave: false, //булевое значение, указывает, нужно ли пересохранять сессию в хранилище, если она не изменилась (по умолчанию false);
    saveUninitialized: false //булевое значение, если true, то в хранилище будут попадать пустые сессии;
}));
app.use(passport.initialize());
app.use(passport.session());//Если аутентификация не требуется для каждого обращения пользователя к URL, а будет проходить один раз, то для установки сессии необходимо использовать функцию промежуточной обработки session().


app.use('/', index);


// passport configuration
var User = require('./models/user');
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser()); // Чтобы сохранять пользовательские данные в сессию
passport.deserializeUser(User.deserializeUser()); //чтобы вытаскивать данные из сессии пользователя




app.use(function (req,res,next){
    console.log(req.hostname + req.path)
    next()
});


function checkAuthenticated(req, res, next) {
    if (req.isAuthenticated()) {
        return next()
    }
    fs.appendFile('errorLog.txt', req.hostname + req.path + " error 403 in task" + "\n", (err) => {
        if(err) throw err;
        console.log('Error has been added!');
    });
    res.status(403).send("Not auth");
    res.redirect('/login')
}


app.get(mUrl + "/task1", checkAuthenticated, (req, res) =>{

    console.log(req.query)
    let fruits = req.query.fruit;
    let number = req.query.number;
    let responseText = "Your array:"
    for(let i = 0; i<number;i++){
        fruits.push(fruits[i]);
    }

    for(let i = 0; i<number;i++){
        fruits.shift(fruits[i])
    }
    for (let j = 0; j < fruits.length; j++) {
        responseText +=fruits[j]+ " ";
    }

    res.render("/api/ShuvalovSasha/lab1/lab3/views/T1", {
        title: "work",
        message: responseText
    });
    //res.send(responseText);

});

app.use("/api/ShuvalovSasha/lab1/lab3/views/menu", checkAuthenticated, (req,res)=>{
    res.render("/api/ShuvalovSasha/lab1/lab3/views/menu", {
        title: "work"
    });
});
app.use("/api/ShuvalovSasha/lab1/lab3/views/exampl1", checkAuthenticated, (req,res)=>{
    res.render("/api/ShuvalovSasha/lab1/lab3/views/exampl1", {
        title: "work"
    });
});
app.use("/api/ShuvalovSasha/lab1/lab3/views/exampl2", checkAuthenticated, (req,res)=>{
    res.render("/api/ShuvalovSasha/lab1/lab3/views/exampl2", {
        title: "work"
    });
});
app.use("/api/ShuvalovSasha/lab1/lab3/views/exampl3", checkAuthenticated, (req,res)=>{
    res.render("/api/ShuvalovSasha/lab1/lab3/views/exampl3", {
        title: "work"
    });
});
app.get(mUrl + '/task2', checkAuthenticated, (req, res) => {  //формат ввода д1 = 123221 д2 =654566
    function showMinutes() {
        let m1 = req.query.data1;
        let S1 = req.query.data2;
        let newm1 = m1.split(",");
        let newS1 = S1.split(",");
        console.log(req.query)
        let responseText = "Month difference: ";
        responseText += Math.abs(newm1[0]-newS1[0]);
        responseText += " Hours difference: ";
        responseText += Math.abs(newm1[1]-newS1[1]);
        responseText += " Minutes difference: ";
        responseText += Math.abs(newm1[2]-newS1[2]);
        responseText += " Second difference: ";
        responseText += Math.abs(newm1[3]-newS1[3]);
        res.render("/api/ShuvalovSasha/lab1/lab3/views/T2", {
            title: "work",
            message: responseText
        });
        //res.status(200).send((responseText).toString());

    }
    showMinutes();
});
app.get(mUrl + '/task3', checkAuthenticated, (req, res) => {
    let resText = req.query.Text1;
    let resT = req.query.Text2;
    let resTe = req.query.Text3;
    let rek = req.query.Text4;
    console.log(req.query)
    const promise1 = new Promise((resolve, reject) => {
        setTimeout(() => resolve("Promise1"), resText);
        setTimeout(() => reject(new Error("ignored1")), resT);

    });
    const promise2 = new Promise((resolve, reject) => {
        setTimeout(() => resolve('Promise2 выполнен'),resTe);
        setTimeout(() => reject(new Error("ignored2")), rek);
    });
    Promise.all([promise1, promise2])
        .then((data) => res.render("/api/ShuvalovSasha/lab1/lab3/views/T3", {
                title: "work",
                message: "complete promise"
            })
        )
        .catch((error) => res.render("/api/ShuvalovSasha/lab1/lab3/views/T3", {
            title: "work",
            message: "Error"
        }))
});

app.get('*', function(err,req, res, next){
    res.status(404).send("Not Found")
    fs.appendFile('errorLog.txt', req.hostname + req.path + " error 404 " + "\n", (err) => {
        if(err) throw err;
        console.log('Error has been added!');
    });
    next()
});


app.listen(4000, (error) => {
    if (error) {
        fs.appendFile('errorLog.txt', req.hostname + req.path + " error 404 " + "\n", (err) => {
            if(err) throw err;
            console.log('Error has been added!');
        });
    }
    console.log('Example port 4000')});
