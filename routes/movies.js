const router = require("express").Router();
const movieModel = require('../models/Movie');
const verify = require("../verifyToken")

//CREATE

router.post("/", verify, async (req, res) => {
    if (req.user.isAdmin) {
      const newMovie = new movieModel(req.body)
      try{
        const movie = await newMovie.save()
        res.status(201).json(movie)
      }catch(err){
        res.status(500).json(err)
        console.log(err)
      }
    } else {
      res.status(403).json("You're not allowed to alter this data!");
    }
  });

//UPDATE
router.put('/id/:id', async (req,res) => {
    const updatedMovie = await movieModel.findByIdAndUpdate(
        req.params.id,
        {
          $set: req.body,
        },
        { new: true }
      );
    try{
        res.status(200).json({
            status : 'Success',
            data : {
              updatedMovie
            }
          })
    }catch(err){
        console.log(err)
    }
})

//DELETE

router.delete("/id/:id", verify, async (req, res) => {
  if (req.user.isAdmin) {
    try{
      await movieModel.findByIdAndDelete(req.params.id)
      res.status(200).json("the movie has been deleted!")
    }catch(err){
      res.status(500).json(err)
    }
  } else {
    res.status(403).json("You're not allowed to alter this data!");
  }
});

//GET

router.get("/id/:id", verify, async (req, res) => {
    try{
      const movie = await movieModel.findById(req.params.id)
      res.status(200).json(movie)
    }catch(err){
      res.status(500).json(err)
    }
});

//GET ALL

router.get("/", verify, async (req, res) => {
  if (req.user.isAdmin) {
    try {
      const shows = await movieModel.find();
      res.status(200).json(shows.reverse());
    } catch (err) {
      res.status(500).json(err);
    }
  } else {
    res.status(403).json("You can are not allowed to see all users");
  }
});

//GET RANDOM

router.get("/random", verify, async (req, res) => {
  const type = req.query.type
  let movie
  try{
    if(type === "series"){
      movie = await movieModel.aggregate([
        { $match : {isSeries : true} },
        { $sample: { size : 1 }}
      ])
    } else {
      movie = await movieModel.aggregate([
        { $match : {isSeries : false} },
        { $sample: { size : 1 }}
      ])
    }
    res.status(200).json(movie)
  }catch(err){
    res.status(500).json(err)
  }
});

module.exports = router
