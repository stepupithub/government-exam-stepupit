'use strict';
appModule.controller('DashboardController', ['$scope', '$http', 'icdb', 'alertService',
    function ($scope, $http, icdb, alertService) {
        $scope.db = {};




        // --------------------------------------------
        // Init lang
        // --------------------------------------------

        $scope.lang = {};
        $scope.lang.data = [];
        $scope.lang.isloading = false;

        $scope.lang.init = function() {
            $scope.lang.isloading = true;

            icdb.getCondition('language', {}, function(response) {
                $scope.lang.data = response.result;
                $scope.lang.isloading = false;
            });
        }


        $scope.lang.model = {};
        $scope.lang.submit = function() {
            if (!$scope.lang.model.name) {
                return;
            }

            icdb.insert('language', {
                name: $scope.lang.model.name,
            }, function(response) {
                if(response.status==true){
                    $scope.lang.model = {};
                    $scope.lang.data.push(response.result);
                    alertService.flash('success', "Language Added Successfully");
                }
                else {
                    alertService.flash('error', response.msg);
                }  
            });
        }


        $scope.lang.postedit = function(row) {
            row.isEdit = !row.isEdit;

            $scope.lang.editsubmit = function(row) {
                if (!row.name) {
                    return;
                }
                
                icdb.update('language', row._id, {
                    name: row.name,
                }, function(response) {

                    if(response.status==true){
                        row.updatedAt = response.result.updatedAt;
                        row.isEdit = false;
                        alertService.flash('success', 'Language updated successfully');
                    }
                    else
                    {
                         alertService.flash('error', response.msg);
                    }
                    
                });
            }
        }


        $scope.lang.delete = function(row) {
            icdb.remove('language', row._id, function(response) {
                for (var i in $scope.lang.data) {
                    if ($scope.lang.data[i]._id == row._id) {
                        $scope.lang.data.splice(i, 1);
                    }
                }
            });
        }






        // --------------------------------------------
        // Init cat
        // --------------------------------------------

        $scope.cat = {};
        $scope.cat.init = function() {
            $scope.cat.isloading = true;

            icdb.getCondition('categories', {}, function(response) {
                $scope.cat.data = response.result;
                $scope.cat.isloading = false;
            });
        }


        $scope.cat.model = {};
        $scope.cat.submit = function() {
            if (!$scope.cat.model.name) {
                return;
            }

            $scope.cat.model.langId = [];
            for (var i in $scope.lang.data) {
                if ($scope.lang.data[i].check) {
                    $scope.cat.model.langId.push($scope.lang.data[i]._id);
                    $scope.lang.data[i].check = false;
                }
            }

            if (!$scope.cat.model.langId.length) {
                return;
            }

            icdb.insert('categories', $scope.cat.model, function(response) {
                if(response.status==true){
                    $scope.cat.model = {};
                    $scope.cat.data.push(response.result);
                    alertService.flash('success', 'Category added successfuly');
                } else {
                    alertService.flash('error', response.msg);
                }    
               
            });
        }


        $scope.cat.edit = function(row) {
            row.isEdit = !row.isEdit;

            $scope.cat.editsubmit = function(row) {
                if (!row.name) {
                    return;
                }

                icdb.update('categories', row._id, {
                    name: row.name,
                }, function(response) {
                    if(response.status==true) {
                        row.isEdit = false;
                        row.updatedAt = response.result.updatedAt;
                        alertService.flash('success', 'Category updated successfully');
                    } else
                    {
                         alertService.flash('error', response.msg);
                    }
                    
                });
            }
        }


        $scope.cat.delete = function(row) {
            icdb.remove('categories', row._id, function(response) {
                for (var i in $scope.cat.data) {
                    if ($scope.cat.data[i]._id == row._id) {
                        $scope.cat.data.splice(i, 1);
                    }
                }
            });
        }









        // --------------------------------------------
        // Quastion Model
        // --------------------------------------------
        $scope.db.subcat = {};
        $scope.db.subcat.data = [];

        $scope.db.question = {};
        $scope.db.question.data = [];
        $scope.db.question.isloading = false;
        $scope.db.question.init = function() {
            $scope.db.question.isloading = true;

            icdb.getCondition('questions', {}, function(response) {
                $scope.db.question.data = response.result;
                $scope.db.question.isloading = false;
            });
        }


        $scope.db.question.model = {};
        $scope.db.question.openModal = function(row) {
            if (row && row._id) {
                $scope.db.question.model = angular.copy(row);
                $scope.db.question.model.answer1 = $scope.db.question.model.answers[0];
                $scope.db.question.model.answer2 = $scope.db.question.model.answers[1];
                $scope.db.question.model.answer3 = $scope.db.question.model.answers[2];
                // $scope.db.question.model.answer4 = $scope.db.question.model.answers[3];
            } else {
               $scope.db.question.model.qdata = {};   
            }
            $('#questionpopup').modal('show');
        }


        $scope.db.question.isSubmit = false;
        $scope.db.question.isReqSent = false;
        $scope.db.question.submit = function(form) {

            if (!form.$valid) {
                $scope.db.question.isSubmit = true;
                return;
            }
            $scope.db.question.isSubmit = false;
            if ($scope.db.question.model._id) {
                var answers = [
                    $scope.db.question.model.answer1,
                    $scope.db.question.model.answer2,
                    $scope.db.question.model.answer3,
                    // $scope.db.question.model.answer4
                ];

                $scope.db.question.model.answers = answers;
                
                icdb.update('questions', $scope.db.question.model._id, $scope.db.question.model, function(response) {
                    if(response.status==true){
                        for (var i in $scope.db.question.data) {
                            if ($scope.db.question.data[i]._id == $scope.db.question.model._id) {
                                $scope.db.question.data[i] = angular.copy($scope.db.question.model);
                                $scope.db.question.data[i].updatedAt = response.result.updatedAt;
                            }
                        }
                        alertService.flash('success', 'Question Updated successfully');
                        $scope.db.question.closeModal();
                    }
                    else {
                        alertService.flash('error', response.msg);
                    }  
                });
            } else {
                var answers = [
                    $scope.db.question.model.answer1,
                    $scope.db.question.model.answer2,
                    $scope.db.question.model.answer3,
                    // $scope.db.question.model.answer4
                ];

                $scope.db.question.model.answers = answers;

                icdb.insert('questions', $scope.db.question.model, function(response) {
                    if(response.status==true){
                        $scope.db.question.data.push(response.result);
                        $scope.db.question.model.question= "";
                        $scope.db.question.model.answer1= "";
                        $scope.db.question.model.answer2= "";
                        $scope.db.question.model.answer3= "";
                        $scope.db.question.model.correctAnswer= "";
                        alertService.flash('success', 'Question Added successfully');
                    }
                    else {
                        alertService.flash('error', response.msg);
                    }   

                });
            }
        }

        $scope.db.question.closeModal = function() {
            $scope.db.question.model = {};
            $('#questionpopup').modal('hide');
        }

        $scope.db.question.remove = {};
        $scope.db.question.remove.submit = function(row, model) { 
            $('#removequestion').modal('show');

            $scope.db.question.remove.removeData = function() {
                icdb.remove('questions', row._id, function(response) {
                    for (var i in $scope.db.question.data) {
                        if ($scope.db.question.data[i]._id == row._id) {
                            $scope.db.question.data.splice(i, 1);
                        }
                    }
                    alertService.flash('success', 'Question Remove successfully');
                    $('#removequestion').modal('hide');
                });
            }
        };



    }
]);