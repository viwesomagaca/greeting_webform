const express = require('express');
const app = express();
const exphbs = require('express-handlebars');
const bodyParser = require('body-parser');
const flash = require('express-flash');
const session = require('express-session');
const changeCase = require("change-case");
const Models = require('./models');

const mongoose = require("mongoose");
const models = Models(process.env.MONGO_DB_URL || "mongodb://localhost/greetingwebapp");
//var Schema = mongoose.Schema;
// mongoose.connect('mongodb://localhost/namesGreeted', function(){
//     console.log('Connected to Mongo db');
// })

app.use(express.static('public'));
app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())

const GreetingRoutes = require("./greetings");
const greetingRoutes = GreetingRoutes(models);

app.engine('handlebars',exphbs({defaultLayout : 'main'}) );
app.set('view engine', 'handlebars');

app.use(session({
    secret:'keyboard cat',
    cookie: { maxAge: 60000 *30 },
    resave: true,
    saveUninitialized: true

}));
app.use(flash());

function storeNames(name, cb){
    var saveNamesGreeted = new Models.Name({
        dbnames: names,
        counter: 1
    })
    saveNamesGreeted.save(cb)
}

app.get("/", function(req,res){
   res.send("Greeting Web Form");
});


app.get("/greetings" ,greetingRoutes.add);
app.get("/greetings/add",greetingRoutes.index);

app.get("/greetings/namesgreeted",greetingRoutes.greeted);


// app.get("/greetings/add/counter", greetingRoutes.counter);
// app.post("/greetings/add/counter", greetingRoutes.counter);
app.post("/greetings/add" ,greetingRoutes.add);
app.post("/greetings" , greetingRoutes.add);


let portNumber = process.env.PORT || 3003;
app.listen(portNumber, function(){
    console.log('Web application started on port ' + portNumber);
});
