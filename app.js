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
        var ssb = new SSB(req.body);
        ssb.save(function(err) {
            if (err) {
                res.json({ 'Status': 400 });
                console.log('Error in POST:', err);
            } else {
                msg = ssb.name + ' Created';
                res.json({ message: msg, 'Status': 201 });
                console.log(req.method, req.originalUrl);
            }
        })
    })
    // GET API 
    .get(function(req, res) {
        SSB.find(function(err, ssb) {
            if (err) {
                res.json({ 'Status': 404 });
                console.log('Err in GET', err);
            } else {
                res.json({ ssb, 'Status': 200 });
                console.log(req.method, req.originalUrl);
            }
        })
    });

router.route('/ssbs/:ssb_id')
    .get(function(req, res) {
        SSB.findById(req.params.ssb_id,
            function(err, ssb) {
                if (err) {
                    res.json({ 'Status': 404 });
                    console.log('Err in GET', err);
                } else {
                    res.json({ ssb, 'Status': 200 });
                    console.log(req.method, req.originalUrl);
                }
            }
        )
    })

// PUT API to change name
.put(function(req, res) {
    var ssb = new SSB(req.body);
    SSB.findById(req.params.ssb_id, function(err, ssb) {
        if (err) {
            res.json({ 'Status': 404 });
            console.log('Err in GET', err);
        } else {
            if (req.body.name) ssb.name = req.body.name;
            if (req.body.IT) ssb.IT = req.body.IT;
            if (req.body.GD) ssb.GD = req.body.GD;

            ssb.save(function(err) {
                if (err) {
                    res.json({ 'Status': 400 });
                    console.log('Error in PUT:', err);
                } else {
                    msg = ssb.name + ' Updated';
                    res.json({ message: msg, 'Status': 202 });
                    console.log(req.method, req.originalUrl);
                }
            })
        }
    })
})

// Delete API
.delete(function(req, res) {
    var ssb = new SSB(req.body);
    SSB.findById(req.params.ssb_id, function(err, ssb) {
        if (err) {
            res.json({ 'Status': 404 });
            console.log('Err in GET', err);
        } else {
            ssb.deleteFlag = true;
            ssb.save(function(err) {
                if (err) {
                    res.json({ 'Status': 400 });
                    console.log('Error in DELETE:', err);
                } else {
                    msg = ssb.name + ' Deleted';
                    res.json({ message: msg, 'Status': 200 });
                    console.log(req.method, req.originalUrl);
                }
            })
        }
    })
})



// Middleware to use for all requests
router.use(function(req, res, next) {
    console.log(req.method, 'Request triggered...');
    next();
})

// GET API
router.get('/', function(req, res) {
    res.json({ message: 'API working...' });
})

app.use('/api', router);
app.listen(port);
console.log('Server running on ', port);
