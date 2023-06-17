const router = require("express").Router();
const listModel = require('../models/List');
const verify = require("../verifyToken")

//CREATE

router.post("/", verify, async (req, res) => {
    if (req.user.isAdmin) {
      const newList = new listModel(req.body)
      try{
        const movie = await newList.save()
        res.status(201).json(movie)
      } catch(err){
        res.status(500).json(err)
      }
    } else {
      res.status(403).json("You're not allowed to alter this data!");
    }
  });

//UPDATE
router.put('/id/:id', async (req,res) => {
  const updatedList = await listModel.findByIdAndUpdate(
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
            updatedList
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
        await listModel.findByIdAndDelete(req.params.id)
        res.status(200).json("the list has been deleted!")
      }catch(err){
        res.status(500).json(err)
      }
    } else {
      res.status(403).json("You're not allowed to alter this data!");
    }
  });

//GET

router.get("/", verify, async (req, res)=>{
    const typequery = req.query.type;
    const genrequery = req.query.genre;
    let list = []

    try{
        if(typequery){
            if(genrequery){
                list = await listModel.aggregate([
                    { $sample: { size: 10 }},
                    { $match:{type:typequery, genre:genrequery}}
                ])
            }else{
                list = await listModel.aggregate([
                    { $sample: { size: 10 }},
                    { $match:{ type:typequery }}
                ])
            }
        }else{
            list = await listModel.aggregate([{ $sample: { size: 10 }}])
        }
    res.status(200).json(list)
    }catch(err){
        res.status(500).json(err)
    }
})

module.exports = router