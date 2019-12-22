'use strict';

var express = require('express');
var router = express.Router();
var cors = require('cors');

require('../model/model');

var home = require('../controllers/home'); 
var icdb = require('../icdb');


// define the home page route
router.get('/', home.index);

//Common routes
router.all('/api/common/get-data', cors(), icdb.getData);
router.all('/api/common/get-condition', cors(), icdb.getCondition);
router.all('/api/common/single-data', cors(), icdb.getSingle);
router.all('/api/common/edit-data', cors(), icdb.getEditData);
router.all('/api/common/delete', cors(), icdb.getDeleteData);


module.exports = router;
