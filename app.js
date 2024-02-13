// server.js
const express = require('express');
const bodyParser = require('body-parser');
const session = require('express-session');
const multer = require('multer');
const path = require('path');

const app = express();
const port = 3000;

// In-memory storage for user data
const users = [];
const uploadedImages = [];

// Middleware
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(session({ secret: 'secret-key', resave: true, saveUninitialized: true }));
app.use(express.static('public'));

// Multer configuration for image uploads
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

// Routes
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

app.get('/login', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'login.html'));
});

app.get('/signup', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'signup.html'));
});

app.post('/login', (req, res) => {
  const { username, password } = req.body;
  const user = users.find(u => u.username === username && u.password === password);

  if (user) {
    req.session.user = user;
    res.redirect('./dashboard.html');
  } else {
    res.redirect('./login.html');
  }
});

app.post('/signup', (req, res) => {
  const { username, password } = req.body;
    console.log("test signup")
  // Check if the username is already taken
  if (users.some(u => u.username === username)) {
    res.redirect('./signup.html');
  } else {
    const newUser = { username, password };
    users.push(newUser);
    req.session.user = newUser;
    res.redirect('./dashboard.html');
  }
});

app.get('/dashboard', authenticateUser, (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'dashboard.html'));
});

app.post('/upload', authenticateUser, upload.single('image'), (req, res) => {
  if (req.file) {
    const image = {
      username: req.session.user.username,
      data: req.file.buffer.toString('base64'),
    };
    uploadedImages.push(image);
    res.redirect('./dashboard.html');
  } else {
    res.status(400).send('Bad Request');
  }
});

app.get('/images', authenticateUser, (req, res) => {
  const userImages = uploadedImages.filter(img => img.username === req.session.user.username);
  res.json(userImages);
});

// Helper function to authenticate user
function authenticateUser(req, res, next) {
  if (req.session.user) {
    next();
  } else {
    res.redirect('./login.html');
  }
}

// Start the server
app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
