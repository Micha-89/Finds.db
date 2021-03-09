const router = require("express").Router();
const Location = require('../models/Location');
const Hunt = require('../models/Hunt');
const Find = require('../models/Find');
const uploader = require('../config/cloudinary-setup.config')

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
  .then(hunt => {
    if (!hunt) {
      res.status(404).json(hunt);
    } else {
      res.json(hunt)
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

router.put('/hunts/removeFind/:id', (req, res) => {
  const { find } = req.body
  Hunt.findByIdAndUpdate(req.params.id, {$pull: { finds: find } })
  .then(() => {
    res.json({ message: `Hunt with ${req.params.id} is updated successfully.` });
  })
  .catch(error => {
    res.json(error);
  });
})

router.post('/finds', (req, res) => {
  const { objectType, age, description, location, hunt, imageUrl } = req.body;
  Find.create({
    objectType,
    age,
    description, 
    location, 
    hunt,
    imageUrl
  })
  .then(response => {
    res.json(response)
  })
  .catch(err => {
    res.jason(err)
  })
})

router.get('/finds', (req, res) => {

  Find.find()
  .populate('location')
  .then(allFinds => {
    res.status(200).json(allFinds);
  })
  .catch(err => {
    res.json(err);
  });

});

router.get('/finds/:id', (req, res) => {

  Find.findById(req.params.id)
  .then(find => {
    if (!find) {
      res.status(404).json(find);
    } else {
      res.json(find)
    }
  })
  .catch(err => {
    res.status(200).json(err)
  })

})

router.put('/finds/:id', (req, res) => {
  const { objectType, age, description, imageUrl } = req.body
  Find.findByIdAndUpdate(req.params.id, { objectType, age, description, imageUrl })
  .then(() => {
    res.json({ message: `Find with ${req.params.id} is updated successfully.` });
  })
  .catch(error => {
    res.json(error);
  });
})

router.delete('/finds/:id', (req, res, next) => {
  
  Find.findByIdAndDelete(req.params.id)
  .then(() => {
    res.status(200).json(console.log('hunt deleted'))
  })
  .catch(err => {
    next(err)
  })

});

router.post('/upload', uploader.single('imageUrl'), (req, res, next) => {
  if (!req.file) {
    next(new Error('No file uploaded!'));
    return;
  }
  res.json({ secure_url: req.file.path });
});

module.exports = router;
