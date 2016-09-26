const
    express = require('express'), 
    router = express.Router(),
    AADBearerStrategy = require('passport-azure-ad').BearerStrategy,
    ObjectID = require('mongodb').ObjectID;


module.exports = function (passport, options) {

    console.log ('setting up auth routes ');
    var db = options.db;

    // Passport session setup.
    // To support persistent login sessions, Passport needs to be able to
    // serialize users into and deserialize users out of the session. Typically,
    // this will be as simple as storing the user ID when serializing, and
    // finding the user by ID when deserializing.
    passport.serializeUser(function (user, done) {
        console.log ("passport.serializeUser");
        done(null, user._id);
    });

    // from the id, retrieve the user details
    passport.deserializeUser(function (id, done) {
        console.log(`-------- passport.deserializeUser : ${id}`);
        done(null, {_id: id}); 
/*
        orm.find(meta.forms.Users , null , {_id: id} , true , false ).then( user => {
            console.log("-------- passport.deserializeUser : got user");
            done(null, user);
        }, err => res.status(400).send(err)).catch (err => res.status(400).send(err));
*/
    });

    var gotSocialLoginDetails = function(mappedUserObj, provider, provider_id, done) {
        return done(null, mappedUserObj);
    /*
      orm.find(meta.forms.Users, null, {q: {'provider.provider_id': provider_id}}, true, false).then(function success(existinguser) {

          if (!existinguser) {
              mappedUserObj.provider = [{type: provider, provider_id: provider_id }]
              console.log(provider + ' strategy: no existing user, creating from social profile : ' + JSON.stringify(mappedUserObj));

              // exps.forms.AuthProviders
              orm.save (meta.forms.Users, null,null,mappedUserObj).then(function success(newuser) {
                      console.log (provider + ' saved new user : ' + JSON.stringify(newuser));
                      done(null, newuser);
                  }, function error(ee) {
                      console.log ('create user error: ' + ee);
                      return done(null, false, 'error creating user');
                  });
          } else {
              console.log(provider + ' found existing user :' + JSON.stringify(existinguser));
              return done(null, existinguser);
          }
      }, function error (e) {
        console.log(provider + ' strategy find user error:' + JSON.stringify(e));
        return done(provider + ' strategy find user error:' + JSON.stringify(e));
       });
       */
    }

    passport.use(new AADBearerStrategy({
            identityMetadata: 'https://login.microsoftonline.com/72f988bf-86f1-41af-91ab-2d7cd011db47/.well-known/openid-configuration', // TenentId
            clientID: '33cec1bf-65a9-41b2-b63a-7902675bf5f8', // ApplicationId
            audience: 'http://localhost:3000'
        },
        function (accessToken, refreshToken, profile, done) {
          console.log ('AADBearerStrategy : got profile: ' + JSON.stringify(profile));
          return gotSocialLoginDetails({
              name: profile.name.givenName + ' ' + profile.name.familyName,
              role: "new",
              email: profile.emails[0].value
            }, "facebook", profile.id, done);
        }));


    // redirects the user to Facebook login, including the relay
    router.get('/azuread-openidconnect', function (req, res, next) {

        var startURL = req.query.state  || '/';
        console.log ('/auth/azuread-openidconnect : ' + startURL);
        console.log ('user : ' + JSON.stringify(req.user));

        passport.authenticate('azuread-openidconnect', {  state: startURL, scope: 'email' })(req, res, next);

    });


    router.get('/azuread-openidconnect/callback',
/*
        passport.authenticate('facebook', { successRedirect: '/',
                failureRedirect: '/login' })
*/
        function (req, res, next) {

            console.log ('/auth/azuread-openidconnect/callback, custom callback to handle the state');
            // supplying a function to 'authenticate' makes this a Custom Callback,
            // When using a custom callback, it becomes the application's responsibility to establish a session
            passport.authenticate('azuread-openidconnect', function(err, user, info) {

                if (err) { return next(err); }
                if (!user) { return res.redirect('/'); }

                // res.send(req.user);
                console.log('azuread-openidconnect callback: authenticate, err : ' + JSON.stringify(err) + ' user : ' + JSON.stringify(user) + ' info : ' + JSON.stringify(info));
                req.logIn(user, function(err){
                    if (err) {
                        return next(err);
                    }
                    console.log ('azuread-openidconnect callback: req.logIn successm now : redirect user to relaystate: ' + req.query.state);
                    res.redirect(req.query.state || '/');
                });
            })(req,res,next);
        }

    );

    router.post('/ajaxlogin', function (req, res, next) {
        passport.authenticate('local', function (err, user, info) {

            if (err) {
                return next(err);
            }
            if (!user) {
                console.log('local  ajaxlogin : NO user : ' + JSON.stringify(info));
                return res.json({result: false, message: info});
            } else {

                // res.send(req.user);
                console.log('local  ajaxlogin : user : ' + JSON.stringify(user) + ' info : ' + JSON.stringify(info) + ' state : ' + req.query.state);

                req.logIn(user, function (err) {
                    if (err) {
                        return next(err);
                    }
                    return res.json({result: true, user: user});
                });
            }
        })(req, res, next);
    });
/*

            { failureFlash: true}),
        function(req, res) {
            console.log('ajaxlogin: ' + JSON.stringify(req.user));
            res.send(req.user);
        });
*/

    router.get('/me',   function(req, res) {
        console.log('/me: ' + JSON.stringify(req.user));
        res.send(req.user);
    });

    router.get('/logout', function (req,res) {
        console.error('logout called');
        req.logOut();
        res.send({ok: 1});

    });

    return router;
}