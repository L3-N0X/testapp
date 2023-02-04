(function() {

    var stateKey = 'spotify_auth_state';

    /**
     * Obtains parameters from the hash of the URL
     * @return Object
     */
    function getHashParams() {
      var hashParams = {};
      var e, r = /([^&;=]+)=?([^&;]*)/g,
          q = window.location.hash.substring(1);
      while ( e = r.exec(q)) {
         hashParams[e[1]] = decodeURIComponent(e[2]);
      }
      return hashParams;
    }

    /**
     * Generates a random string containing numbers and letters
     * @param  {number} length The length of the string
     * @return {string} The generated string
     */
    function generateRandomString(length) {
      var text = '';
      var possible = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';

      for (var i = 0; i < length; i++) {
        text += possible.charAt(Math.floor(Math.random() * possible.length));
      }
      return text;
    };

    var userProfileSource = document.getElementById('user-profile-template').innerHTML,
        userProfileTemplate = Handlebars.compile(userProfileSource),
        userProfilePlaceholder = document.getElementById('user-profile');

        oauthSource = document.getElementById('oauth-template').innerHTML,
        oauthTemplate = Handlebars.compile(oauthSource),
        oauthPlaceholder = document.getElementById('oauth');

    var params = getHashParams();

    var access_token = params.access_token,
        state = params.state,
        storedState = localStorage.getItem(stateKey);

    if (access_token && (state == null || state !== storedState)) {
      alert('There was an error during the authentication');
    } else {
      localStorage.removeItem(stateKey);
      if (access_token) {
        $.ajax({
            url: 'https://api.spotify.com/v1/me',
            headers: {
              'Authorization': 'Bearer ' + access_token
            },
            success: function(response) {
              userProfilePlaceholder.innerHTML = userProfileTemplate(response);

              $('#login').hide();
              $('#loggedin').show();
            }
        });
      } else {
          $('#login').show();
          $('#loggedin').hide();
      }

      document.getElementById('login-btn').addEventListener('click', function() {

        var client_id = '7c35e3a74f364538866db979db4f35f1'; // Your client id
        var redirect_uri = 'http://localhost/index.html'; // Your redirect uri

        var state = generateRandomString(16);

        localStorage.setItem(stateKey, state);
        var scope = 'user-read-private user-read-email';

        var url = 'https://accounts.spotify.com/authorize';
        url += '?response_type=token';
        url += '&client_id=' + encodeURIComponent(client_id);
        url += '&scope=' + encodeURIComponent(scope);
        url += '&redirect_uri=' + encodeURIComponent(redirect_uri);
        url += '&state=' + encodeURIComponent(state);

        window.location = url;
      }, false);
    }
  })();




// var express = require('express'); // Express web server framework
// var request = require('request'); // "Request" library
// var cors = require('cors');
// var querystring = require('querystring');
// var cookieParser = require('cookie-parser');

// var client_id = '7c35e3a74f364538866db979db4f35f1'; // Your client id
// var client_secret = '83c191e5d6a6440dbf94179e0e29d832'; // Your secret
// var redirect_uri = 'http://localhost/index.html/callback'; // Your redirect uri


// /**
//  * Generates a random string containing numbers and letters
//  * @param  {number} length The length of the string
//  * @return {string} The generated string
//  */
// var generateRandomString = function(length) {
//     var text = '';
//     var possible = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';

//     for (var i = 0; i < length; i++) {
//         text += possible.charAt(Math.floor(Math.random() * possible.length));
//     }
//     return text;
// };

// var stateKey = 'spotify_auth_state';

// // var app = express.Router();
// var app = express();

// app.use((req, res, next) => {
//     res.header("Access-Control-Allow-Origin", "*");
//     res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
//     next();
// });

// app.all(function(req, res, next) {
//     res.header("Access-Control-Allow-Origin", "*");
//     res.header("Access-Control-Allow-Methods", "GET, POST, OPTIONS");
//     res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
//     next();
// });

// app.use(express.static(__dirname + '/public'))
//     .use(cors())
//     .use(cookieParser());

// app.get('/login', function(req, res) {

//     var state = generateRandomString(16);
//     res.cookie(stateKey, state);

//     // your application requests authorization
//     var scope = 'user-read-private user-read-email user-read-playback-state app-remote-control user-modify-playback-state user-read-currently-playing streaming';
//     res.redirect('https://accounts.spotify.com/authorize?' +
//         querystring.stringify({
//             response_type: 'code',
//             client_id: client_id,
//             scope: scope,
//             redirect_uri: redirect_uri,
//             state: state,
//             show_dialog: true
//         }));
// });

// app.get('/callback', function(req, res) {

//     // your application requests refresh and access tokens
//     // after checking the state parameter

//     var code = req.query.code || null;
//     var state = req.query.state || null;
//     var storedState = req.cookies ? req.cookies[stateKey] : null;

//     if (state === null || state !== storedState) {
//         res.redirect('/#' +
//             querystring.stringify({
//                 error: 'state_mismatch'
//             }));
//     } else {
//         res.clearCookie(stateKey);
//         var authOptions = {
//             url: 'https://accounts.spotify.com/api/token',
//             form: {
//                 code: code,
//                 redirect_uri: redirect_uri,
//                 grant_type: 'authorization_code'
//             },
//             headers: {
//                 'Authorization': 'Basic ' + (new Buffer(client_id + ':' + client_secret).toString('base64'))
//             },
//             json: true
//         };

//         request.post(authOptions, function(error, response, body) {
//             if (!error && response.statusCode === 200) {

//                 var access_token = body.access_token,
//                     refresh_token = body.refresh_token;

//                 var options = {
//                     url: 'https://api.spotify.com/v1/me',
//                     headers: { 'Authorization': 'Bearer ' + access_token },
//                     json: true
//                 };

//                 // use the access token to access the Spotify Web API
//                 request.get(options, function(error, response, body) {
//                     console.log(body);
//                 });

//                 // we can also pass the token to the browser to make requests from there
//                 res.redirect('/#' +
//                     querystring.stringify({
//                         access_token: access_token,
//                         refresh_token: refresh_token
//                     }));
//             } else {
//                 res.redirect('/#' +
//                     querystring.stringify({
//                         error: 'invalid_token'
//                     }));
//             }
//         });
//     }
// });

// setInterval(function(req, res) {
//     // requesting access token from refresh token
//     var refresh_token = req.query.refresh_token;
//     var authOptions = {
//         url: 'https://accounts.spotify.com/api/token',
//         headers: { 'Authorization': 'Basic ' + (new Buffer(client_id + ':' + client_secret).toString('base64')) },
//         form: {
//             grant_type: 'refresh_token',
//             refresh_token: refresh_token
//         },
//         json: true
//     };

//     request.post(authOptions, function(error, response, body) {
//         if (!error && response.statusCode === 200) {
//             var access_token = body.access_token;
//             res.send({
//                 'access_token': access_token
//             });
//         }
//     });
// }, 3500);

// setTimeout(() => {
//     document.getElementById('song-title').innerHTML = "ready";
// }, 5000);


// // console.log('Listening on 8888');
// app.listen(3000);
// module.exports = router;
// //const server = app.listen(3000, () => console.log(`Express server listening on port 3000`));