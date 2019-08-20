const mongoose = require('mongoose');
mongoose.connect('mongodb://localhost/power',  { useNewUrlParser: true })

const DiseaseSchema = mongoose.Schema({
  'doid_id': {
    type:String
  },
  'drugbank_id': {
    type: String
  },
  'disease': {
    type: String
  },
  'drug': {
    type: String
  },
  'category': {
    type: String
  },
  "n_resources":  {
    type: String
  }
}, {'collection': 'catalog'})

const Diseases = mongoose.model('Disease', DiseaseSchema);
module.exports = Diseases