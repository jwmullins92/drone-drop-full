// server/index.js

const path = require('path');
const express = require("express");
const mongoose = require('mongoose')
const cors = require('cors')
const app = express();
require('dotenv').config();
const bcrypt = require('bcrypt')

const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const session = require('express-session');

const UserModel = require("./models/User");


app.use(express.json())
app.use(express.static(path.resolve(__dirname, '../client/build')));
app.use(cors({
    origin: ["http://localhost:3000", "https://drone-drop-full.herokuapp.com"],
    methods: ["GET", "POST", "DELETE"],
    credentials: true
}))
app.use(cookieParser())
app.use(bodyParser.urlencoded({ extended: true }))

app.use(session({
    key: "username",
    secret: "my-secret",
    resave: false,
    saveUninitialized: false,
    cookie: {
        expires: 1000 * 60 * 60 * 24
    }
}))

mongoose.connect(process.env.DB_URL, {
    useNewUrlParser: true
})
const db = mongoose.connection
db.once('connected', () => {
    console.log('Database Connected');
})


app.get("/api", (req, res) => {
    res.json({ message: "Hello from server!" });
});

app.get('/users', async (req, res) => {
    try {
        const users = await UserModel.find();
        res.json(users)
    } catch (err) {
        res.status(500).json({ messgae: err.messgae })
    }
})

app.get('/user/:username', async (req, res) => {
    try {
        const user = await UserModel.findOne({ username: req.params.username });
        res.json(user)
    } catch (err) {
        res.status(500).json({ messgae: err.messgae })
    }
})

app.post("/login", async (req, res) => {
    const { username, password } = req.body
    const user = await UserModel.findOne({ username })
    if (user) {
        bcrypt.compare(password, user.password, (err, result) => {
            if (result) {
                req.session.user = user
                res.send(user)
            } else {
                res.send("Invalid username or password")
            }
        })
    } else {
        res.send("Invalid username or password")
    }
})

app.delete("/logout", async (req, res) => {
    if (req.session) {
        req.session.destroy(err => {
            if (err) {
                res.status(400).send('Unable to log out')
            } else {
                res.send('Logged out')
            }
        });
    } else {
        res.send("You are not logged in")
    }
})

app.post('/user', async (req, res) => {

    bcrypt.hash(req.body.password, 10, async (err, hash) => {

        if (err) {
            console.log(err)
        }

        const user = new UserModel(req.body)
        user.password = hash;
        try {
            const newUser = await user.save();
            res.send(newUser)
        } catch (err) {
            console.log(err)
        }
    })


})

app.delete('/user/:username', async (req, res) => {
    try {
        const user = await UserModel.findOneAndDelete({ username: req.params.username })
        res.json(user)
    } catch (err) {
        res.status(500).json({ message: err.message })
    }
})

// All other GET requests not handled before will return our React app
app.get('*', (req, res) => {
    res.sendFile(path.resolve(__dirname, '../client/build', 'index.html'));
});

const port = process.env.PORT || 5000;


app.listen(port, () => {
    console.log(`Server listening on ${port}`);
});