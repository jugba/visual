const router = require('express').Router();
const db = require('../models');

router.get('/', function(req, res){
    db.aggregate([{ "$group": {"_id": "$disease", "children": { "$push": {'name': "$drug", 'size': 1000} }}}, 
    {$project: {
      "_id": 0,
      "name": "$_id",
      "children": 1, 
    }},
      {"$sort": {"name": 1}}]).then((results)=>{
        res.json({name: "all", children: results})
      })
})
router.get('/d', function(req, res){
  res.sendfile('server/views/index.html');
})

module.exports = router;