require('dotenv').config();
const express = require('express');
const exphbs = require('express-handlebars');
const expsesh = require('express-session');

const SequelizeStore = require('connect-session-sequelize')(expsesh.Store);
const sequelize = require('./config/connection');
const routes = require('./controllers');

// handlebars helpers
const helpers = require('./util/helpers');

// handlebars init
const hbs = exphbs.create({
    helpers,
});

// express session settings
const sessionSettings = {
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    store: new SequelizeStore({
        db: sequelize,
    }),
};

const app = express();

const PORT = process.env.PORT || 3001;

// handlebars template engine
app.engine('handlebars', hbs.engine);
app.set('view engine', 'handlebars');

// middlewares
app.use(express.static('public'));

app.use(expsesh(sessionSettings));

app.use(express.json());
app.use(express.urlencoded({extended: true}));

app.use(routes);

// server listener + sequelize sync
sequelize.sync({force: true}).then(() => {
    app.listen(PORT, () => console.log(`Server listening to PORT ${PORT}`));
});