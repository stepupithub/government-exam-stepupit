'use strict';

var mongoose = require('mongoose');
require('date-utils');



exports.getSingle = function(req, res) {

	if (!req.body.model || !req.body._id) {
		res.json([]);
		return;
	}

	var commonModel = mongoose.model(req.body.model);

	commonModel.findById(req.body._id, function(err, result) {
		res.json(result);
	});
};


exports.getData = function(req, res) {
	if (!req.body.model) {
		res.json([]);
		return;
	}

	var commonModel = mongoose.model(req.body.model);

	commonModel.find().exec(function(err, responseData) {

		if(err) {
			res.json({
				status: false,
				data: responseData
			});
			return;
		}

		res.json(responseData);
		return;
	});
};


exports.getCondition = function(req, res) {
	if (!req.body.model) {
		res.json([]);
		return;
	}

	var commonModel = mongoose.model(req.body.model);

	commonModel.find(req.body.condition).lean().exec(function(err, response) {
		if(err) {
			res.json({
				status: false,
				result: response
			});
			return;
		}

		res.json({
			status: true,
			result: response
		});
	});

};


exports.getEditData = function(req, res) {

    if (!req.body.model) {
        return res.json([]);
    }

    var commonModel = mongoose.model(req.body.model);

    commonModel.update({
        _id: req.body._id
    }, req.body, {
        multi: true
    }).exec(function(err, result) {

		if (req.body.model == 'OurTeam') {
			req.session.user = req.body;
		}

        res.json({
            status: true,
            result: result
        });
    });
};


exports.postAddData = function(req, res) {

	if (!req.body.model) {
		res.json([]);
		return;
	}

	var commonModel = mongoose.model(req.body.model);
	req.body.model = '';
	req.body.createdAt = new Date().getTime();
	
	var commonFormData = new commonModel(req.body);

	commonFormData.save(function(err, result) {

		if (err) {
			res.json({
				status: false
			});
			return;
		}

		res.json({
			status: true,
			result: result
		});
	});
	return;
}


exports.getDeleteData = function(req, res) {

	if (!req.body.model || !req.body._id) {
		res.json([]);
		return;
	}

	var commonModel = mongoose.model(req.body.model);

	// Delete common Data
	commonModel.findOne({ _id: req.body._id}).remove(function(err, result) {
		if (err) {
			res.json({
				status: false
			});
			return;
		}

		res.json({
			status: true,
			responseIds: req.body._id
		});
		return;
	});
};


exports.getDeleteDataCondition = function(req, res) {
	if (!req.body.model || !req.body._id) {
		res.json([]);
		return;
	}

	var commonModel = mongoose.model(req.body.model);

	// Delete common Data
	commonModel.find(req.body.condition).remove(function(err, result) {

		if (err) {
			res.json({
				status: false
			});
			return;
		}

		res.json({
			status: true
		});
		return;
	});
};