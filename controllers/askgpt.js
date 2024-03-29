const OpenAI = require('openai');
const {Configuration, OpenAIApi} = OpenAI;
const configuration = new Configuration({
  organization: "org-ur58xhyOEu4Z69CbXTO9Osb4",
  apiKey: process.env.OPENAI_API_KEY,
});
const openai = new OpenAIApi(configuration);
const Event = require('../models/event');

module.exports = {
  askGPT: async (req) => {
    let user = req.user;
    let events = await Event.find({user: req.user});
    let today = new Date() + 'T00:00';
  
    let message = req.body.message;
    const response = await openai.createCompletion({
      model: "text-davinci-003",
      prompt: `You are a personal assistant. Give suggestions, locations, tasks, events if asked. Present lists in a bullet format. Greet with a message for ${user}. Look up ${events} and its properties if asked. Only refer to ${today} if event date matches. Add an emoji that represents an event or suggestion. >${message}?`,
      max_tokens: 300,
      temperature: 0.45,
    });
    if (response.data) {
      if (response.data.choices) {
        return response;
      }
    }
  return response;
  }
}