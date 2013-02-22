var express = require('express');
var passport = require('passport');
var util = require('util');
var SamlStrategy = require('./node_modules/passport-saml/lib/passport-saml/index').Strategy;
var fs = require('fs');
var https = require('https');
var http = require('http');


var app = express();

var users = [
    { id: 1, givenName: 'bob', email: 'bob@example.com' }
  , { id: 2, givenName: 'joe', email: 'joe@example.com' }
];

function findByEmail(email, fn) {
  for (var i = 0, len = users.length; i < len; i++) {
    var user = users[i];
    if (user.email === email) {
      return fn(null, user);
    }
  }
  return fn(null, null);
}


app.get('/', function(req, res){
  res.send('hello world');
});


/*
app.post('/login/callback',
  passport.authenticate('saml', { failureRedirect: '/', failureFlash: true }),
  function(req, res) {
    res.redirect('/');
  }
);
*/

app.get('/login',
  passport.authenticate('saml', { failureRedirect: '/', failureFlash: true }),
  function(req, res) {
    res.redirect('/');
  }
);

passport.use(new SamlStrategy(
  {
    path: '/login/callback',
    entryPoint: 'https://app.onelogin.com/trust/saml2/http-post/sso/90575',
    issuer: 'passport-saml',
    protocol: 'https://',
    cert: 'MIIEHjCCAwagAwIBAgIBATANBgkqhkiG9w0BAQUFADBnMQswCQYDVQQGEwJVUzETMBEGA1UECAwKQ2FsaWZvcm5pYTEVMBMGA1UEBwwMU2FudGEgTW9uaWNhMREwDwYDVQQKDAhPbmVMb2dpbjEZMBcGA1UEAwwQYXBwLm9uZWxvZ2luLmNvbTAeFw0xMjEwMDgxNzM2MTlaFw0xNzEwMDgxNzM2MTlaMGcxCzAJBgNVBAYTAlVTMRMwEQYDVQQIDApDYWxpZm9ybmlhMRUwEwYDVQQHDAxTYW50YSBNb25pY2ExETAPBgNVBAoMCE9uZUxvZ2luMRkwFwYDVQQDDBBhcHAub25lbG9naW4uY29tMIIBIjANBgkqhkiG9w0BAQEFAAOCAQ8AMIIBCgKCAQEAwaE64QDO2Ytq77nE0rJguLqF02RJEx3LJ0r+iUbfBw64v916JJ/SYUHIA3OX4WB1ZSimIfkU3/BBNozpiRy4Lh3otZdJ2R9FtI/jM7ELiLmaRCpzRBw+rIf1qWs5OA1hyfgOaonP6w1dpW8x2TcQSZcjZRfEGOgu54bhnIdAhecQvXteIvpFovJmpupSO/bNKw9K+CxhM4zI/NavHM+CIPw9NGKz2yZm8NqA8nSTP3jIumf7lk2rZNVn+2P0B9oEBWOX+9/1Hn2qYuOpA+Yo5lCxiVrq0M6fQvJkdcfPiKmmSAR2W90yw8sAlck0dkpyzkbmm4plQ0CuqwhjgdgZ5QIDAQABo4HUMIHRMAwGA1UdEwEB/wQCMAAwHQYDVR0OBBYEFHPi+apxDIHUh6E9d/wFp/petkXlMIGRBgNVHSMEgYkwgYaAFHPi+apxDIHUh6E9d/wFp/petkXloWukaTBnMQswCQYDVQQGEwJVUzETMBEGA1UECAwKQ2FsaWZvcm5pYTEVMBMGA1UEBwwMU2FudGEgTW9uaWNhMREwDwYDVQQKDAhPbmVMb2dpbjEZMBcGA1UEAwwQYXBwLm9uZWxvZ2luLmNvbYIBATAOBgNVHQ8BAf8EBAMCBPAwDQYJKoZIhvcNAQEFBQADggEBAFaSDjtbz6FVhWuFVOdnlcuZNtbcMB9tSbf+6YnJf4B0eqVqGk5HBtBOax3vNAQG12w0rwbQg+6lDntSaqhWYbKdRj0y+N3aNloH8T88GqFm4Mr9U0zwEIOxXPMnkw6SNxGkYbz8ut+7lpMar2R/YP+1kzuIjBWPmGjn47GXNduXzJbm0jmiHXImRTeLKFoDveYBePi/cAJltY/S6Su4cwjrChDs7kjdzO6vc94iFmfUJyVTA+AMLJYHKN/qClj5xkAvlYNYe+hGjYlOfuSBfb921CJ1hICUy6iHfC1gSBlUN3FtQuPTVRyPY93KN1+3i4DlUPL4UsN/Fl10HvVOC+4='
  },
  
  function(profile, done) {
    console.log("Auth with", profile);
    if (!profile.email) {
      return done(new Error("No email found"), null);
    }
    // asynchronous verification, for effect...
    process.nextTick(function () {
      findByEmail(profile.email, function(err, user) {
        if (err) {
          return done(err);
        }
        if (!user) {
          // "Auto-registration"
          users.push(profile);
          return done(null, profile);
        }
        return done(null, user);
      })
    });
  }
));

var options = {
  key: fs.readFileSync('./server.key'),
  cert: fs.readFileSync('./server.crt')
};

app.listen(process.env.PORT, process.env.IP);
//http.createServer(app).listen(80);
//https.createServer(options, app).listen(process.env.PORT, process.env.IP);


