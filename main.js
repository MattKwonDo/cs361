var express = require('express');
var mysql = require('./dbcon.js');
var bodyParser = require('body-parser');

var app = express();
var handlebars = require('express-handlebars').create({defaultLayout:'main'});

app.engine('handlebars', handlebars.engine);
app.use(bodyParser.urlencoded({extended:true}));
app.use('/static', express.static('public'));
app.set('view engine', 'handlebars');
app.set('port', process.argv[2]);
app.set('mysql', mysql);
//app.use('/branch', require('./branch.js'));
//app.use('/department', require('./department.js'));
//app.use('/doctor', require('./doctor.js'));
//app.use('/doctor_branch', require('./doctor_branch.js'));
//app.use('/doctor_department', require('./doctor_department.js'));
//app.use('/patient', require('./patient.js'));
//app.use('/update_patient', require('./update_patient.js'));
app.use('/', express.static('public'));


////auth
//https://codeshack.io/basic-login-system-nodejs-express-mysql/

app.use(bodyParser.json());

//manage session for auth
var session = require('express-session');
app.use(session({
  secret: 'legalese',
  resave: true,
  saveUninitialized: true,
  cookie: { maxAge: 15000 }
}));

var router = express.Router();

//log in and authenticate it
app.post('/authenticate', function(req, res){
    console.log('post /authenticate');
    var username = req.body.username;
    var password = req.body.password;

    var mysql = req.app.get('mysql');
    var sql = "SELECT * FROM UserInfo WHERE username = ? AND password = ?";
    var inserts = [username, password];
    mysql.pool.query(sql, inserts, function(error, results, fields){
          if(error){
              res.send('danger will robinson, pls enter pw or user');
              console.log('danger will robinson, pls enter pw or user');
              console.log(JSON.stringify(error));
              res.write(JSON.stringify(error));
              res.end();
          }
          else if (results.length > 0) {
            req.session.loggedin = true;
            req.session.username = username;
            console.log("post successment");
            console.log(JSON.stringify(results));
            console.log('req.session: ');
            console.log(req.session);
            res.redirect('/userMainPage');
          } else {
            res.send('danger will robinson, wrong pw or user');
            console.log('danger will robinson, wrong pw or user');
          }
          res.end();
        });
});


//delete session
// req.session.destroy(function(err) {
//     //callback method
// })


//////end authenticate



//create a user
app.get('/createUser',function(req,res){
  res.render('createUser');
});



app.get('/createUser', function(req, res) {
	console.log('get /createUser');
  if (req.session.loggedin) {
		// res.send('hello, ' + req.session.username + '!');
    console.log('hello, ' + req.session.username + '!');
    // var callbackCount = 0;
    var context = {};
    // function complete() {
    //   callbackCount++;
    //   if (callbackCount >= 1) {
        console.log('render /createUser');
        res.render('createUser', context);
    //   }
    // }
  } else {
		console.log('log in, you must');
    // res.send('log in, you must');
    res.redirect('/');
	}
	// res.end();
});

//display user home page after log in
app.get('/userMainPage', function(req, res) {
	console.log('get /createUser');
  if (req.session.loggedin) {
    console.log('hello, ' + req.session.username + '!');
    var context = {};
        console.log('render /createUser');
        res.render('userMainPage', context);
  } else {
		console.log('log in, you must');
    res.redirect('/');
	}
});


//question page after "ask a question"
app.get('/questionMain', function(req, res) {
	console.log('get /questionMain');
  if (req.session.loggedin) {
    console.log('hello, ' + req.session.username + '!');
    var context = {};
        console.log('render /questionMain');
        res.render('questionMain', context);
  } else {
		console.log('log in, you must');
    res.redirect('/');
	}
});



app.use(function(req,res){
  res.status(404);
  res.render('404');
});

app.use(function(err, req, res, next){
  console.error(err.stack);
  res.status(500);
  res.render('500');
});

app.listen(app.get('port'), function(){
  console.log('Express started on http://flip2.engr.oregonstate.edu:' + app.get('port') + '; press Ctrl-C to terminate.');
});
