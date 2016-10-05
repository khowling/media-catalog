const 
    express = require('express'),
    session    = require('express-session'),
    MongoStore = require('connect-mongo')(session),
//    passport = require ('passport'),
    MongoClient = require('mongodb').MongoClient,
    ObjectID = require('mongodb').ObjectID;
//    cookieParser = require('cookie-parser'),
//    bodyParser = require('body-parser');
    
let mongoPool = { db: null},
    app = express();


/* Although OAuth2 provides a framework in which any known token type can be issued, 
   For protecting endpoints,  Bearer Tokens are almost always used. 
   Bearer tokens are the most widely issued type of token in OAuth2
*/


let pdb = new Promise((resolve, reject) => {

  MongoClient.connect(process.env.MONGO_DB || "mongodb://localhost:27017/mediacatalog", function(err, database) {
    if (err) throw err;
    mongoPool.db = database;

    // session
    app.use(session({
            secret: '99hashfromthis99',
            store:  new MongoStore(mongoPool),
            saveUninitialized: true,
            resave: true
         //   store: new herokuMemcachedStore({   servers: ["localhost:11211"],  username: "",   password: ""})
        })
    );

    // use passport session (allows user to be captured in req.user)
    //app.use(passport.initialize());
    //app.use(passport.session());

    // routes
    // routes are the last thing to be initialised!
    app.use('/auth', require('./routes/auth')(mongoPool));
    app.use('/api/ams', require('./routes/ams')(mongoPool));
    app.get('/api/auth/loadapp',   function(req, res) {
        console.log('/loadapp: ' + JSON.stringify(req.session.user));
        res.send(req.session.user ? {auth: true, user: req.session.user} : {auth: false});
    });
    app.get('/api/auth/logout', function (req,res) {
        console.error('logout called');
        req.session.destroy(function(err) {
            if(err) {
                console.log(err);
            } else {
                res.send({ok: 1});
            }
        })
    })

    /// catch 404 and forward to error handler
    app.use(function (req, res, next) {
        var err = new Error('Not Found');
        err.status = 404;
        next(err);
    });

    /// error handlers

    // development error handler
    // will print stacktrace
    if (app.get('env') === 'development') {
        app.use(function (err, req, res, next) {
            res.status(err.status || 500).json({
                message: 'dev : ' + err.message,
                error: err
            });
        });
    } else {

      // production error handler
      // no stacktraces leaked to user
      app.use(function (err, req, res, next) {
          res.status(err.status || 500);
          res.render('error', {
            message: err.message,
            error: {}
          });
      });
    }

    resolve(database);
  });
});


//var urlencodedParser = bodyParser.urlencoded({ extended: false })
//app.use(bodyParser.json());
//app.use(bodyParser.urlencoded({extended: true}));
//app.use(cookieParser());

app.get('/dbready', (req,res) => {
  pdb.then((db) => res.json({"gotdb": 1}));
})

app.listen(process.env.PORT || 3000);
console.log(`Listening on port ${process.env.PORT || 3000}`);


module.exports = app;
