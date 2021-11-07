const PORT = process.env.PORT || 5000;
const express = require('express');
const app = express();
const path = require('path');
const dotenv = require('dotenv');
const { auth, requiresAuth } = require('express-openid-connect');
const https = require('https')
const fs = require('fs')

const homeRouter = require('./routes/home.routes');
const markersRouter = require('./routes/markers.routes');

dotenv.config();

const config = {
    authRequired : false,
    idpLogout : true, //login not only from the app, but also from identity provider
    secret: process.env.SECRET,
    baseURL: process.env.BASE_URL,
    clientID: process.env.CLIENT_ID,
    issuerBaseURL: 'https://dev-uhrk3a3g.us.auth0.com',
    clientSecret: process.env.CLIENT_SECRET,
    authorizationParams: {
        response_type: 'code' ,
        //scope: "openid profile email"
    },
};

app.use(auth(config));

app.get('/',  function (req, res) {
    // req.user = {
    //     isAuthenticated : req.oidc.isAuthenticated()
    // };
    // if (req.user.isAuthenticated) {
    //     req.user.name = req.oidc.user.name;
    // }
    res.render('pages/index', {user : req.user});
});

app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(express.static(path.join(__dirname, 'public')));

app.use(express.urlencoded({ extended: true }));


app.use('/', homeRouter);
app.use('/markers', markersRouter);

if (process.env.PORT) {
    app.listen(process.env.PORT);
    console.log(`Server running at https://localhost:${process.env.PORT}/`);
} else {
    https.createServer({
        key: fs.readFileSync('key.pem'),
        cert: fs.readFileSync('cert.pem')
    }, app)
    .listen(PORT, function () {
        console.log(`Server running at https://localhost:${PORT}/`);
    });
}


