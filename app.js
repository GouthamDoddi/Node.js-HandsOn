/* eslint-disable no-shadow */
const express = require('express');
const routes = require('./routes');
const http = require('http');
const path = require('path');
const urlencoded = require('url');
const parser = require('body-parser');
const json = require('json');
const logger = require('logger');
const moethodOverride = require('method-override');

const nano = require('nano')('http://localhost:5948');

const db = nano.use('adress');
const app = express();

app.set('port', process.env.PORT || 3000);
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

app.use(parser.json());
app.use(parser.urlencoded());
app.use(moethodOverride());
app.use(express.static(path.join(__dirname, 'public')));

app.get('/', routes.index);

app.post('/createdb', (req, res) => {
    nano.db.create(req.body.dbname, err => {
        if (err)
            res.send(`Erro creating Dtabase ${res.body.dbname}`);


        res.send(`Database ${req.body.dbname} created sucessfully`);
    });
});

app.post('/new_contacts', (req, res) => {
    const { name } = req.body;
    const { phone } = req.body;

    db.insert({ name, phone, crazy: true }, phone, (err, body, header) => {
        if (err)
            res.send('Error creating contacts');


        res.send('Contact created sucessfully');
    });
});

app.post('/view_contact', (req, res) => {
    let allDoc = 'Following are the constacts';

    db.get(req.body.phone, { revsInfo: true }, (err, body) => {
        if (!err)
            console.log(body);

        if (body)
            allDoc += `Name ${body.name} <br/> Phone Number ${body.phone}`;

        else
            allDoc = 'No records found';

        res.send(allDoc);
    });
});

app.post('/delete_contact', (req, res) => {
    db.get(req.body.phone, { revsInfo: true }, (err, body) => {
        if (!err) {
            db.destroy(req.body.phone, body._rev, (err, body) => {
                if (err)
                    res.send('error deleting contact');
            });
            res.send('Contacts deleted successfully');
        }
    });
});

http.createServer(app).listen(app.get('port'), () => {
    console.log(`Express server listing on port ${app.get('port')}`);
});
