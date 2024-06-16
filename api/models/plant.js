const mongoose = require('mongoose');

const plantSchema = new mongoose.Schema({
    id: { type: String, required: true },
    plant_name: { type: String, required: true },
    common_names: [{ type: String }],
    taxonomy: {
        class: { type: String },
        genus: { type: String },
        order: { type: String },
        family: { type: String },
        phylum: { type: String },
        kingdom: { type: String },
    },
    description: {
        value: { type: String },
        citation: { type: String },
        license_name: { type: String },
        license_url: { type: String },
    },
    image: { type: String },
    edible_parts: [{ type: String }],
    propagation_methods: [{ type: String }],
    watering: {
        max: { type: Number },
        min: { type: Number },
    },
});
const plant = mongoose.model('plant', plantSchema);

module.exports = plant;