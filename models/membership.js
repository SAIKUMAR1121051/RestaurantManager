const mongoose = require('mongoose');

const membershipSchema = mongoose.Schema({
    name:  { type: String},
    contact: { type: String}
});

module.exports = mongoose.model('membership', membershipSchema);