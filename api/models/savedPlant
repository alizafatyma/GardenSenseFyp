const mongoose = require('mongoose');
const { Schema } = mongoose;

const savedPlantSchema = new Schema({
  userId: { 
    type: Schema.Types.ObjectId,
     ref: 'user', required: true 
    },
  plantId: {
    type: String,
    required: true
  }
});

const savedPlant = mongoose.model('savedPlant', savedPlantSchema);

module.exports = savedPlant;
