const https = require('https'),
        url = require('url'),
        express = require('express'), 
        router = express.Router(),
        parseString = require('xml2js').parseString;

// https://msdn.microsoft.com/en-us/library/azure/hh973617.aspx
// 
const
    ams_api_version = '2.13',
    ams_initial_host = 'media.windows.net',
    aad_acs = 'wamsprodglobal001acs.accesscontrol.windows.net',
    aad_acs_path = `/v2/OAuth${ams_api_version.replace(/\./g, '-')}`,
    ams_account_name = 'kehowli',
    ams_account_key = 'huj4dgUqzlffMaufoZec0fuLR6LrP201C7rDdhFpUBI='
    


// ---------------------------------------------- Create Container ACL
function ams_authkey () {
    return new Promise ((acc,rej) => {
        let putreq = https.request({
                hostname: aad_acs,
                path: aad_acs_path,
                method: 'POST',
                headers: {}
                }, (res) => {

                    res.on('data', (d1) => {
                        let auth = {token: JSON.parse(d1), host: ams_initial_host}
                        console.log (`on data ${JSON.stringify(auth.token)}`)
                        https.get({hostname: auth.host, path: '/', headers: {
                            'x-ms-version': ams_api_version,
                            'Authorization': `Bearer ${auth.token.access_token}`
                        }}, (r2) => {
                            if (r2.statusCode == 301) {
                                console.log (`${r2.statusCode}  ${r2.statusMessage} ${(r2.headers.location)}`)
                                auth.host = url.parse(r2.headers.location).hostname
                            }
                            acc(auth)
                        }).on('error', (e) =>  rej(e));
                        
                    });

                    if(res.statusCode == 200 || res.statusCode == 201) {
                        console.log (`status ${res.statusCode}`)
                    } else {
                        rej(res.statusCode)
                    }
                }).on('error', (e) =>  rej(e));

        putreq.write (`grant_type=client_credentials&client_id=${ams_account_name}&client_secret=${encodeURIComponent(ams_account_key)}&scope=urn%3aWindowsAzureMediaServices`)
        putreq.end()
    })
}

function list_things (auth, thing) {
    return new Promise ((acc,rej) => {
        let putreq = https.get({ hostname: auth.host, path: `/api/${thing}`,
            headers: {
                'x-ms-version': ams_api_version,
                'Authorization': `Bearer ${auth.token.access_token}`
            }}, (res) => {

                res.on('data', (d) => {
                    console.log (`on data ${d}`)
                    parseString(d, (err, res) => {
                    if (!err) {
                        acc(res.feed.entry)
                    } else {
                        rej(err)
                    }
                    });
                });

                if(res.statusCode == 200 || res.statusCode == 201) {
                    console.log (`status ${res.statusCode}`)
                } else {
                    rej(`status ${res.statusCode}  ${res.statusMessage}`)
                }
            }).on('error', (e) =>  rej(e));
    })
}



module.exports = function (options) {

    console.log ('setting up auth routes ');
    var db = options.db;

    router.get('/:things',  (req, res) => {
        if (!req.session.ams_auth) {
            ams_authkey().then((ams_auth) => {
                req.session.ams_auth = ams_auth;
                list_things (req.session.ams_auth, req.params.things).then ((things) => res.json (things), (err) => res.status(400).send(err))
            }, (err) => res.status(400).send(err))
        } else {
            list_things (req.session.ams_auth, req.params.things).then ((things) => res.json (things), (err) => res.status(400).send(err))
        }

    })

    return router;
}



//ams_authkey().then ((auth) => list_assets(auth).then((ok) => console.log (ok), (err) => console.log (err)));