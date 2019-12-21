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
router.post('/api/common/add-data', cors(), icdb.postAddData);
router.post('/api/common/get-data', cors(), icdb.getData);
router.post('/api/common/get-condition', cors(), icdb.getCondition);
router.post('/api/common/single-data', cors(), icdb.getSingle);
router.post('/api/common/edit-data', cors(), icdb.getEditData);
router.post('/api/common/delete', cors(), icdb.getDeleteData);


module.exports = router;
