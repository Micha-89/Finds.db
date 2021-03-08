const router = require("express").Router();
const Location = require('../models/Location')
const Hunt = require('../models/Hunt')
const Find = require('../models/Find')

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
  .populate('hunts')
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

router.put('/locations/:id', (req, res) => {
  const { hunt } = req.body
  Location.findByIdAndUpdate(req.params.id, {$push: { hunts: { $each: [hunt], $position: 0 } } })
  .then(() => {
    res.json({ message: `Location with ${req.params.id} is updated successfully.` });
  })
  .catch(error => {
    res.json(error);
  });
})

router.put('/locations/removeHunt/:id', (req, res) => {
  const { hunt } = req.body
  Location.findByIdAndUpdate(req.params.id, {$pull: { hunts: hunt } })
  .then(() => {
    res.json({ message: `Location with ${req.params.id} is updated successfully.` });
  })
  .catch(error => {
    res.json(error);
  });
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

router.post('/hunts', (req, res) => {
  const { date, location } = req.body;
  Hunt.create({
    date,
    location,
    finds: []
  })
  .then(response => {
    res.json(response);
  })
  .catch(err => {
    res.json(err)
  })
})

router.get('/hunts/:id', (req, res) => {

  Hunt.findById(req.params.id)
  .populate('finds')
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

router.put('/hunts/:id', (req, res) => {
  const { find } = req.body
  Hunt.findByIdAndUpdate(req.params.id, {$push: { finds: { $each: [find], $position: 0 } } })
  .then(() => {
    res.json({ message: `Hunt/session with ${req.params.id} is updated successfully.` });
  })
  .catch(error => {
    res.json(error);
  });
})

router.delete('/hunts/:id', (req, res, next) => {
  
  Hunt.findByIdAndDelete(req.params.id)
  .then(() => {
    res.status(200).json(console.log('hunt deleted'))
  })
  .catch(err => {
    next(err)
  })

});

router.post('/finds', (req, res) => {
  const { objectType, age, description, location, hunt } = req.body;
  Find.create({
    objectType,
    age,
    description, 
    location, 
    hunt
  })
  .then(response => {
    res.json(response)
  })
  .catch(err => {
    res.jason(err)
  })
})

module.exports = router;
