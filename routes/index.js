const OpenAI = require('openai');
const {Configuration, OpenAIApi} = OpenAI;
const configuration = new Configuration({
  organization: "org-ur58xhyOEu4Z69CbXTO9Osb4",
  apiKey: process.env.OPENAI_API_KEY,
});
const openai = new OpenAIApi(configuration);

const express = require('express');
const router = express.Router();
const passport = require('passport');

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Planit' });
});

// Google OAuth login route
router.get('/auth/google', passport.authenticate(
  // Which passport strategy is being used?
  'google',
  {
    // Requesting the user's profile and email
    scope: ['profile', 'email'],
    // Optionally force pick account every time
    prompt: "select_account"
  }
));

// Google OAuth callback route
router.get('/oauth2callback', passport.authenticate(
  'google',
  {
    successRedirect: '/dashboard',
    failureRedirect: '/'
  }
));

// OAuth logout route
router.get('/logout', function(req, res){
  req.logout(function() {
    res.redirect('/');
  });
});

// async function askGPT(req, res, renderPath, title) {
//   let message = req.body.message;
//   const response = await openai.createCompletion({
//     model: "text-davinci-003",
//     prompt: `You are a personal assistant. Give suggestions, locations, tasks, events. Present lists in a bullet format. >${message}?`,
//     max_tokens: 300,
//     temperature: 0.45,
//   });
//   if (response.data) {
//     if (response.data.choices) {
//       res.render(renderPath, {
//         title: title,
//         user: req.user,
//         message: response.data.choices[0].text,
//         url: req._parsedOriginalUrl.href,        
//       })      
//     }
//   }
// }

// /* */
// router.post('/dashboard', async (req, res) => {
//   askGPT(req, res, 'dashboard/index', 'Dashboard');
// })
// router.post('/dashboard/show', async (req, res) => {
//   askGPT(req, res, 'dashboard/show', 'Dashboard');
// })

module.exports = router;
