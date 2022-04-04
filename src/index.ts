import express from 'express';
import mongoose from 'mongoose';

// routes
import api from './routers/api';
import poll from './routers/polls';

// models 
import {pollModel} from './models/pollModel';

const app = express();

// add  body parser
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static('public'));

// set trust proxy
app.set('trust proxy', true);

// connect to mongoose 
mongoose.connect('mongodb://localhost:27017/polls');

// get port from dotenv
const port = process.env.PORT || 3000;

// register mongoose models
mongoose.model('Poll', pollModel);

// set ejs as view engine
app.set('view engine', 'ejs');

// define a route handler for the default home page
app.get('/', (req, res) => res.render('index'));

app.get('/create', (req, res) => res.render('create'));

app.use('/api/v1', api);
app.use('/polls', poll);

// start the express server
app.listen(port, () => console.log(`server started at http://localhost:${port}`));