const router = require("express").Router();
const Location = require('../models/Location')

router.get("/", (req, res, next) => {
  res.json("All good in here");
});

// You put the next routes here 👇
// example: router.use("/auth", authRoutes)

router.get('/locations', (req, res) => {

  Location.find()
  .then(allLocations => {
    res.status(200).json(allLocations);
  })
  .catch(err => {
    res.json(err);
  });

});

router.post('/locations', (req, res) => {
  const owner = req.user._id;
  const { longitude, latitude } = req.body;
  Location.create({
    owner,
    longitude,
    latitude,
    hunts: []
  })
  .then(response => {
    res.json(response);
  })
  .catch(err => {
    res.json(err)
  })
})

router.get('/locations/:id', (req, res) => {

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

router.delete('/locations/:id', (req, res, next) => {
  
  Location.findByIdAndDelete(req.params.id)
  .then(() => {
    res.status(200).json(console.log('location deleted'))
  })
  .catch(err => {
    next(err)
  })

});

module.exports = router;
