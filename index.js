const express = require("express");
const helmet = require("helmet");
const knex = require("knex");

const knexConfig = require("./knexfile.js");

const server = express();

server.use(express.json());
server.use(helmet());

const db = knex(knexConfig.development);

// endpoints here

// server.get('/api/zoos', (req, res) => {
//   res.send('api working')
// })

server.get('/api/zoos', (req, res) => {
  db('zoos')
  .then(zoos => {
    res.status(200).json(zoos);
  })
  .catch(err => res.status(500).json({ error: "The zoo information could not be retrieved." }))
})

server.get('/api/zoos/:id', (req, res) => {
  db('zoos')
  .where({ id: req.params.id })
  .then(zoo => {
    if (zoo) {
      res.status(200).json(zoo)
    } else {
      res.status(404).json({ error: "Zoo not found" })
    }
  })
  .catch(err => res.status(500).json({ error: "The zoo information could not be retrieved." }))
})

server.post('/api/zoos', (req, res) => {
  const changes = req.body;

  db.insert(changes)
  .into('zoos')
  .then(ids => {
    res.status(201).json(ids);
  })
  .catch(err => {
    res.status(500).json({ error: "There was an error while saving the zoo to the database." });
  })
})

server.delete('/api/zoos/:id', (req, res) => {
  db('zoos')
  .where({ id: req.params.id })
  .del()
  .then(count => {
    if (count) {
      res.status(200).json(count)
    } else {
      res.status(404).json({ error: "Zoo not found" })
    }
  })
  .catch(err => res.status(500).json({ error: "The zoo could not be removed." }))
})

server.put('/api/zoos/:id', (req, res) => {
  const changes = req.body;

  db('zoos')
  .where({ id: req.params.id })
  .update(changes)
  .then(count => {
    res.status(200).json(count)
  })
  .catch(err => res.status(500).json({ error: "The zoo information could not be modified." }));
})




const port = 3300;
server.listen(port, function() {
  console.log(`\n=== Web API Listening on http://localhost:${port} ===\n`);
});
