
////////////////////////////////////////////////////////////////////////////

const express = require('express');
const app = express();
const path = require('path');
const session = require('express-session');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');

app.use(session({
  secret: 'your-secret-key',
  resave: false,
  saveUninitialized: true
}));

require("./db/conn"); 

const Register = require("./models/registers");

const port = process.env.PORT || 5006;

const static_path = path.join(__dirname, "../public");

app.use(express.static(static_path));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

app.get('/', (req, res) => {
    if (req.session.userEmail) {
        res.sendFile(path.join(__dirname, 'public', 'index2.html'));
    } else {
        res.sendFile(path.join(__dirname, 'public', 'index1.html'));
    }
});

app.get('/index1', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index1.html'));
});

app.get('/index2', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index2.html'));
});

app.get('/index', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

app.get('/room', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'room.html'));
});

app.get('/login', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'login.html'));
});

app.get('/register', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'register.html'));
});

app.get('/osmcq', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'osmcq.html'));
});

app.get('/software', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'software.html'));
});

app.get('/cn', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'cn.html'));
});

app.get('/dbms', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'dbms.html'));
});

app.post('/login', async (req, res) => {
    try {
        const email = req.body.email;
        const password = req.body.password;
        const user = await Register.findOne({ email: email, password: password });
        
        if (user) {
            req.session.userEmail = email;
            res.redirect('/');
        } else {
            res.send("Invalid email or password");
        }

    } catch(error) {
        res.status(400).send("Error logging in: " + error.message);
    }
});

app.post('/register', async (req, res) => {
    try {
        const password = req.body.password;
        const cpassword = req.body.confirmpassword;

        if (password === cpassword) {
            const registerEmployee = new Register({
                username: req.body.username,
                email: req.body.email,
                password: password,
                confirmpassword: cpassword
            });

            const registered = await registerEmployee.save();
            req.session.userEmail = req.body.email;

            res.redirect('/');
        } else {
            res.send("Passwords do not match");
        }
    } catch(error) {
        res.status(400).send(error);
    }
});

app.listen(port, () => {
    console.log(`Server is running at port ${port}`);
});



