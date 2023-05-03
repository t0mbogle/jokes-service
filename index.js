const express = require('express');
const app = express();
const { Joke } = require('./db');
const { Op } = require("sequelize");
//  
app.use(express.json());
app.use(express.urlencoded({extended:true}));

app.get('/jokes', async (req, res, next) => {
  if (req.query) {
    try {
      const jokes = await Joke.findAll({
        where: {
          tags: {
            [Op.substring]: req.query.tags ?? "",
          },
          joke: {
            [Op.substring]: req.query.content ?? "",
          }
        },
      });
      res.send(jokes); 
    } catch (error) {
        console.error(error);
        next(error)
    }
  }

  try {
      const jokes = await Joke.findAll();
      res.send(jokes);
  } catch (error) {
      console.error(error);
      next(error)
  }
});


app.post("/jokes", async (req, res, next) => {
  try {
    const { joke, tags } = req.body;
    const newJoke = await Joke.create({ joke: joke, tags: tags });
    res.status(201).send(newJoke);
  } catch (error) {
      console.error(error);
      next(error)
  }
})

app.put("/jokes/:id", async (req, res, next) => {
  try {
    const { joke, tags } = req.body;
    
    const updatedJoke = await Joke.update({ joke: joke, tags: tags }, { 
      where: { id: req.params.id }
    });

    res.status(200).send(updatedJoke);
  } catch (error) {
    console.error(error);
    next(error)
  }
})

app.delete("/jokes/:id", async (req, res, next) => {
  try {
    const id = req.params.id;
    await Joke.destroy({ where: { id: id } });
    res.sendStatus(204);
  } catch (error) {
      console.error(error);
      next(error)
  }
})


// we export the app, not listening in here, so that we can run tests
module.exports = app;
