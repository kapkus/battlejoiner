import express from 'express';
const app = express()
import bodyParser from 'body-parser';
const port = 3000
import path from 'path';
import {runPuppeteer, checkAccount, getCurrentAccounts, checkIfInstanceRunning, deleteAccount} from './src/utils/addAccount.js';
import { dirname } from 'path';
import { fileURLToPath } from 'url';
import {engine} from 'express-handlebars';
import fs from 'fs';
import router from './src/routes/puppeteerRoutes.js'

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

app.use(bodyParser.json());
app.use(express.static(path.join(__dirname + '/public')));
app.use(express.static(path.join(__dirname + '/node_modules')));

app.engine('handlebars', engine({
    extname: 'handlebars',
    defaultLayout: 'main',
    layoutsDir: path.join(__dirname, '/public/views/layouts'),
    partialsDir: path.join(__dirname, '/public/views/partials')
}));
app.set('view engine', 'handlebars');
app.set('views', path.join(__dirname + '/public/views'));

app.use('/puppeteer', router);

app.get('/', function (req, res) {
    const accounts = getCurrentAccounts();
    res.render('index',  { layout: 'layout', data: accounts });
});

app.get('/getCurrentAccounts', (req, res) => {
    const accounts = getCurrentAccounts();
    res.send(accounts);
});

app.listen(port, () => {
    console.log(`Server started on port ${port}.`)
});



