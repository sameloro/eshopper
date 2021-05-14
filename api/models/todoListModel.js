'use strict';
var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var ObjectId = mongoose.Types.ObjectId;

/*
var TaskSchema = new Schema({
    _id: String,
    name: {
        type: String,
        required: 'Kindly enter the name of the task'
    },
    Created_date: {
        type: Date,
        default: Date.now
    },
    status: {
        type: [{
        type: String,
        enum: ['pending', 'ongoing', 'completed']
        }],
        default: ['completed']
    }
});
*/

var TaskSchema = new Schema({_id: String});

module.exports = mongoose.model('Products', TaskSchema);
module.exports = mongoose.model('Customers', TaskSchema);
module.exports = mongoose.model('Admins', TaskSchema);
module.exports = mongoose.model('Promotions', TaskSchema);
module.exports = mongoose.model('Orders', TaskSchema);
module.exports = mongoose.model('Basket', TaskSchema);