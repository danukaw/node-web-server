const express = require('express');
const hbs = require('hbs');
const fs = require('fs');

let app = express();

hbs.registerPartials(__dirname + '/views/partials');

app.set('view engine', 'hbs');

app.use((req, res, next)=> {
    let now = new Date().toString();
    let log = `http request method is ${req.method} and path ${req.url} time : ${now}`;
    fs.appendFile('server.log', log + '\n',(err) => {
        if (err) throw err;
        console.log('The "data to append" was appended to file!');
    });
    next();
});

app.use((req, res, next) => {
    //res.render('update.hbs');
    if (req.headers['x-forwarded-proto'] === 'https') {
        
              res.redirect('http://' + req.hostname + req.url);
            } else {
              next();
            }
    next();
});

app.use(express.static(__dirname + "/public"));

hbs.registerHelper('getCurrentYear', ()=> {
    return new Date().getFullYear();
});

hbs.registerHelper('screamIt', (text)=> {
    return text.toUpperCase();
});

app.get('/', (request, response) => {
    response.render('home.hbs', {
        pageTitle : 'Home Page ...',
        welcomeMessage : 'Welcome to my website'
    });
});

app.get('/about', (request, response) => {
    //response.send('<h4>About page</h4>');
    response.render('about.hbs', {
        pageTitle : 'About Page...',
    });
});

app.get('/error', (req, res) => {
    res.send({
        error : {
            errorCode : 404,
            errorMessage : "Page cannot be found"
        }
    })
});

app.listen(3000, () => {
    console.log('server is up on port 3000');
});