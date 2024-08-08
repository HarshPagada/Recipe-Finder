const express = require('express');
const path = require('path');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const User = require('./models/register');
const session = require('express-session');
const isAuthenticated = require('./loginAuth');
const Recipe = require('./models/recipe');

const app = express();
require('dotenv').config();

const staticPath = path.join(__dirname, '../public');
let url = process.env.URL_key

// Middleware
app.use(express.static(staticPath));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(session({
    secret: 'abcd1234',
    resave: false,
    saveUninitialized: true,
  }));

// MongoDB connection
mongoose.connect(url, {
  useNewUrlParser: true,
  useUnifiedTopology: true
}).then(() => {
  console.log('Connected to MongoDB');
}).catch((err) => {
  console.error('Error connecting to MongoDB:', err);
});


// Route to handle registration form submission
app.post("/register", async (req, res) => {
  const username = req.body.username;
  const password = req.body.password;
  const confirmPassword = req.body.confirmPassword;
  console.log(req.body.username);
  console.log(req.body.password);

  if (password !== confirmPassword) {
    console.error('Passwords do not match');
    return res.redirect('/register.html');
  }

  try {
    const newUser = new User({ username, password });
    await newUser.save();
    console.log('New user saved:', newUser);
    res.redirect('/login.html');
  } catch (error) {
    console.error('Error saving user:', error);
    res.redirect('/register.html');
  }
});

//login form
app.post('/login', async(req, res)=>{
    const username=req.body.username;
    const password=req.body.password;

    try {
        const user = await User.findOne({ username });
        if (!user) {
          return res.json({ success: false, message: 'User not found' });
        }
    
        // Simple password comparison for this example (no hashing)
        if (user.password !== password) {
          return res.json({ success: false, message: 'Incorrect password' });
        }
    
        console.log('User logged in:', user);
        req.session.user = user;
        res.redirect('/index.html');
      } catch (error) {
        console.error('Error logging in user:', error);
        res.redirect('/login.html');
      }

});

// Add to favourites route
app.post('/add-to-favourites', isAuthenticated, async (req, res) => {
    const { name, image, summary, sourceUrl, instructions } = req.body;
    console.log('User session data:', req.session.user); 
    console.log('Requested data :', req.body);
    
    try {

        const user = await User.findById(req.session.user._id);
        if (!user) {
            return res.status(404).send('User not found');
        }

        const transformedInstructions = instructions.steps.map(step => step.step);
        const recipe = new Recipe({
        name,
        image,
        summary,
        sourceUrl,
        instructions: transformedInstructions,
        user: user._id 
      });
  
      await recipe.save();
  
      res.status(200).send('Recipe added to favourites');
    } catch (error) {
      console.error('Error adding to favourites:', error);
      res.status(500).send('Internal server error');
    }
  });

app.get('/get-favourites', isAuthenticated, async (req, res) => {
    try {
        const userId = req.session.user._id;
        const recipes = await Recipe.find({ user: userId });
        res.status(200).json(recipes);
    } catch (error) {
        console.error('Error fetching favourites:', error);
        res.status(500).send('Internal server error');
    }
});


// Server setup
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
