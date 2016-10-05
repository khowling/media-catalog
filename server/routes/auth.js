const   https = require('https'),
        express = require('express'), 
        router = express.Router(),
        url = require('url'),
        ObjectID = require('mongodb').ObjectID;


module.exports = function (options) {

    console.log ('setting up auth routes ');
    var db = options.db;

// To exlain how to fill in the parmaters for AAD
    //https://azure.microsoft.com/en-us/documentation/articles/active-directory-protocols-oauth-code/
// To get your AAD settings, browse to: [DIRECTORY_NAME] = "microsoft" or "khb2b"
    //  https://login.windows.net/[DIRECTORY_NAME].onmicrosoft.com/.well-known/openid-configuration

    const authorization_endpoint = "https://login.microsoftonline.com/c1563e10-1ee7-4920-94c1-0fd7891c9845/oauth2/authorize",
          token_endpoint = "https://login.microsoftonline.com/c1563e10-1ee7-4920-94c1-0fd7891c9845/oauth2/token",
          Application_Id = '43eaeff2-e93a-481b-800e-e9762ab0b209',
          Application_Key = encodeURIComponent('cCt7HGiggDXLi7E18oXOMzgPFr/1pUycSVCJ3pDCDNw='),
          Application_Name = encodeURIComponent('http://webcatalog-dev.kh.com'),
          Callback_Url = 'http://localhost:5000/auth/aad/callback'

  // redirects the user to authorization_endpoint to login the user & get the AAD security token (authorisation code)
  router.get('/aad',  (req, res) => {
    res.location(
      `${authorization_endpoint}`+
      `?client_id=${Application_Id}`+
      `&response_type=code`+
      `&redirect_uri=${encodeURIComponent(Callback_Url)}`+
      `&response_mode=query`+
      `&resource=${Application_Name}`+
      `&state=12345`).status(302).end()
    });

    router.get('/aad/callback', (req, res) => {
        let code = req.query['code'],
            state = req.query['state'],
            tep = url.parse(token_endpoint),
            token_req = `redirect_uri=${encodeURIComponent(Callback_Url)}&grant_type=authorization_code&resource=${Application_Name}&client_id=${Application_Id}&client_secret=${Application_Key}&code=${code}`
        //console.log ('callback with ' + tep.hostname + ' : ' + tep.pathname)

        // validate the token?
        // by using a public signing key and issuer information 

        let putreq = https.request({
            hostname: tep.hostname,
            path: tep.pathname,
            method: 'POST',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
                'Content-Length': Buffer.byteLength(token_req)
            }
            }, (tep_res) => {
                // Azure AD starts a new session with the user
                tep_res.on('data', (d1) => {
                    //console.log (`chunk : ${d1}`)
                    let auth = JSON.parse(d1),
                        [part1, part2, part3] = auth.id_token.split('.'),
                        user = JSON.parse(Buffer.from(part2,'base64'))

                    console.log (`decode : ${JSON.stringify(auth)} ::: ${JSON.stringify(user)}`)
                    req.session.user = user
                    req.session.aadauth = auth
                    res.location('http://localhost:3000/?login=true').status(302).end()
                })

                tep_res.on('error', (e) =>  res.status(400).send(e));
                console.log (`status ${tep_res.statusCode}`)
                if(tep_res.statusCode == 200 || tep_res.statusCode == 201) {
                
                } else {
                  //  res.status(tep_res.statusCode).send(tep_res.statusMessage)
                }

        }).on('error', (e) =>  res.status(400).send(e));

        putreq.write (token_req)
        putreq.end()
        console.log (`written : ${token_req}`)
    })

    return router;
}