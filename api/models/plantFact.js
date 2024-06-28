const mongoose = require('mongoose');

const plantFactSchema = new mongoose.Schema({
    fact: {
        type: String,
        required: true,
        unique: true
    }
});

const plantFact = mongoose.model("plantFact", plantFactSchema);

module.exports = plantFact;