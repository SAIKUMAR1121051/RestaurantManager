const mongoose = require('mongoose');

const restaurantSchema = mongoose.Schema({
   
    title: { type: String, required: true },
    location: { type: String, required: true },
    membershipId: {type: mongoose.Schema.Types.ObjectId, ref: 'membership'}
});

module.exports = mongoose.model('restaurant', restaurantSchema);