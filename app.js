var express = require('express');
var app = express();
var bodyParser = require('body-parser'); // Gives middleware available under the req.body property
var mongoose = require('mongoose');
mongoose.connect('mongodb://localhost/ima');
var SSB = require('./models/ssb');


// configure app to use bodyParser()
// this will let us get the data from a POST
app.use(bodyParser.urlencoded({ extended: true }));
//  Parse Application/JSON
app.use(bodyParser.json());

var port = process.env.port || 8000;

var router = express.Router(); // Instance of Express Router

// Routes in Raiden for POST operations
router.route('/ssbs')
    .post(function(req, res) {
        var msg = null;
        var ssb = new SSB();
        ssb.name = req.body.name;
        ssb.IT = req.body.IT;
        ssb.GD = req.body.GD;

        ssb.save(function(err) {
            if (err) console.log('Error in POST:', err);
            else {
                msg = ssb.name + ' Created';
                res.json({ message: msg });
            }
        })
    })
// GET API 
.get(function(req, res) {
    SSB.find(function(err, ssb) {
        if (err) console.log('Err in GET', err);
        else {
            res.json({ ssb });
        }
    })
})



// Middleware to use for all requests
router.use(function(req, res, next) {
    console.log(req.method, 'API triggered...');
    next();
})

// GET API
router.get('/', function(req, res) {
    res.json({ message: 'API working...' });
})

app.use('/api', router);
app.listen(port);
console.log('Server running on ', port);
