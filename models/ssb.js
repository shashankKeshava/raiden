// DB
var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var ssbSchema = new Schema({
    name: String,
    IT: Number,
    GD: Boolean
});

module.exports = mongoose.model( 'ssb', ssbSchema );
