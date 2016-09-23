// DB
var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var ssbSchema = new Schema({
    name: String,
    IT: Number,
    GD: Boolean,
    deleteFlag: {
        type: Boolean,
        default: false
    }
});

module.exports = mongoose.model('ssb', ssbSchema);
