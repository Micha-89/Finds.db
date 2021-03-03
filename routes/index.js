const router = require("express").Router();
const Location = require('../models/Location')

router.get("/", (req, res, next) => {
  res.json("All good in here");
});

// You put the next routes here 👇
// example: router.use("/auth", authRoutes)

router.post('/locations', (req, res) => {
  const name = req.body.name;

  Location.create({
    name: name
  })
  .then(location => {
    res.status(201).json(location);
  })
  .catch(err => {
    res.json(err);
  });

});

router.get('/locations', (req, res) => {

  Location.find()
  .then(allLocations => {
    res.status(200).json(allLocations);
  })
  .catch(err => {
    res.json(err);
  });

});

router.get('locations/:id', (req, res) => {

  Location.findById(req.params.id)
  .populate('sessions')
  .then(location => {
    if (!location) {
      res.status(404).json(location);
    } else {
      res.json(location)
    }
  })
  .catch(err => {
    res.status(200).json(err)
  })

})

module.exports = router;
