'use strict';

var mongoose = require('mongoose');
var qdataa = require('./question.json');
qdataa = qdataa.result;

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

	commonModel.find(req.body.condition).sort({
        updatedAt: -1
    }).lean().exec(function(err, response) {
		if(err) {
			res.json({
				status: false,
				result: response
			});
			return;
		} 


        if (req.body.model == 'categories') {
            var langIds = [];

            for (var i in response) {
                langIds.push(response[i].langId);
            }          
           
            var model = mongoose.model('language');
            model.find({
                _id: {
                    $in: langIds
                }
            }).exec(function(err, userRes) {
               for (var i in userRes) {
                    for (var j in response) {
                        if (userRes[i]._id == response[j].langId) {
                            response[j].language = userRes[i].name;
                        }
                    }
                }
           
                res.json({
                    status: true,
                    result: response
                });
            });
            return;
        }


        if (req.body.model == 'questions') {
            var catIds = [];
            var langIds = [];
            for (var i in response) {
                catIds.push(response[i].catId);
                langIds.push(response[i].langId);
            }
            var model = mongoose.model('categories');
            model.find({
                _id: {
                    $in: catIds
                }
            }).exec(function(err, userRes) {
                for (var i in userRes) {
                    for (var j in response) {
                        if (userRes[i]._id == response[j].catId) {
                            response[j].category = userRes[i].name;
                        }
                    }
                }

               var model = mongoose.model('language');
              model.find({
                _id: {
                    $in: langIds
                }
            }).exec(function(err, langRes) {
                for (var i in langRes) {
                    for (var j in response) {
                        if (langRes[i]._id == response[j].langId) {
                            response[j].language = langRes[i].name;
                        }
                    }
                }
                res.json({
                    status: true,
                    result: response
                });
            });
            return;
                res.json({
                    status: true,
                    result: response
                });
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
    req.body.updatedAt = new Date().getTime();

    var commonModel = mongoose.model(req.body.model);

     var update = function() {
            commonModel.update({
            _id: req.body._id
        }, req.body, {
            multi: true
        }).exec(function(err, result) {
            commonModel.findOne({
                _id: req.body._id
            }).exec(function(err, resD) {
                res.json({
                    status: true,
                    result: resD
                });
            });
        });
    }
    if (req.body.model == 'language') {
        commonModel.find({
        	_id: { $ne: req.body._id },
            name: req.body.name
        }, function(err, category) {
            if (category.length) {
                res.json({
                    msg: 'Language already availabel',
                    status: false
                });
                return;
            }
            update();
        });
    } else if (req.body.model == 'questions') {
        commonModel.find({
        	 _id: { $ne: req.body._id },
            langId: req.body.langId,
            catId: req.body.catId,
            question: req.body.question
        }, function(err, question) {
            if (question.length) {
                res.json({
                    msg: 'Question already availabel this category',
                    status: false
                });
                return;
            }
            update();
        });
    } else {
        update();
    }
};


exports.postAddData = function(req, res) {

	if (!req.body.model) {
		res.json([]);
		return;
	}

	var commonModel = mongoose.model(req.body.model);

	 var insert = function() {
        req.body.model = '';
        req.body.createdAt = new Date().getTime();
        req.body.updatedAt = new Date().getTime();

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
    }
    if (req.body.model == 'language') {
        commonModel.find({
            name: req.body.name
        }, function(err, category) {
            if (category.length) {
                res.json({
                    msg: 'Language already availabel',
                    status: false
                });
                return;
            }
            insert();
        });
    } else if (req.body.model == 'questions') {
        commonModel.find({
            langId: req.body.langId,
            catId: req.body.catId,
            question: req.body.question
        }, function(err, question) {
            if (question.length) {
                res.json({
                    msg: 'Question already availabel this category',
                    status: false
                });
                return;
            }
            insert();
        });
    } else {
        insert();
    }
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
	if (!req.body.model) {
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


exports.cronUpdateData = function(req, res) {
	var commonModel = mongoose.model('questions');

	// var update = function(data) {
	// 	commonModel.update({
	// 	    _id: data._id
	// 	},{
	// 	    updatedAt: data.createdAt || new Date()
	// 	}).exec(function(err, result) {
	// 		console.log('result >>>', result);
	// 	});
	// }

	// commonModel.find({}).lean().exec(function(err, responseData) {
	// 	if (responseData && responseData.length) {
	// 		for (var i in responseData) {
	// 			update(responseData[i]);
	// 		}
	// 	}
	// });



    // console.log("qdataa >>>", qdataa.length);

    // var resultss = [];
    // var answer = [];
    // for (var i in qdataa) {
    //     answer = [];
        
    //     for (var j=1; j<=4; j++) {
    //         if (qdataa[i].qdata[qdataa[i].qdata.answer] != qdataa[i].qdata[j]) {
    //             answer.push(qdataa[i].qdata[j]);
    //         }
    //     }

    //     resultss.push({
    //         "answers": answer,
    //         "langId": "5e509f100eb4b600044221d2",
    //         "catId": "5e509f320eb4b600044221d3",
    //         "question": qdataa[i].qdata.question,
    //         "correctAnswer": qdataa[i].qdata[qdataa[i].qdata.answer],
    //         "category": "Mix",
    //         "language": "Mix",
    //         "language": "Mix",
    //         "type": "multiple",
    //         "difficulty": "Hard"
    //     });
    // }


    // var count = 0;
    //  var insert = function(data) {
    //     data.createdAt = new Date();
    //     data.updatedAt = new Date();

    //     var commonFormData = new commonModel(data);
    //     commonFormData.save(function(err, result) {
    //         count += 1;
    //         console.log('count >>>>', count);
    //     });
    // }

    // for (var i in resultss) {
    //     insert(resultss[i]);
    // }
};