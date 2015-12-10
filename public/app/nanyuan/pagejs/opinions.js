var opinionsModel = createModel('opinions', function (modelName) {
    return avalon.define(modelName, function (vm) {
        vm.list = [];
        vm.type = clientInfoModel.$initPageParameters.opinions.type;
        vm.currentItem = {title: '', publishDate: null, publisher: '', cover: '', rowCount: 0};
        vm.opinionCollectionList = [];
        vm.newDescription = "";
        vm.$allList = [];

        vm.switchType = function (type) {
            if (type == vm.type) {
                return;
            } else {
                var newList = vm.$allList[type];
                vm.type = type;
                if (newList) {
                    vm.list = newList;
                } else {
                    vm.list = [];
                    vm.initList();
                }
            }
        }

        vm.openOpinionsItem = function (el) {
            vm.currentItem = el;
            vm.opinionCollectionList.clear();
            ajaxGet('/opinions/retrieveDetail', {rid: el.rid}, function (result) {
                if (result.code == 0) {
                    for (var i = 0; i < result.data.length; i++) {
                        vm.opinionCollectionList.push(result.data[i]);
                    }
                    clientInfoModel.openScreen("OpinionsDetail");
                }
            });
        }

        vm.openAddOpinion = function () {
            vm.newDescription = "";
            clientInfoModel.openScreen("OpinionEdit");
        }

        vm.saveOpinionEdit = function () {
            if (vm.newDescription.length <= 0) {
                showConfirmDialog("", "请输入您的意见");
                return;
            }
            var opinion = {opinionId: vm.currentItem.rid, description: vm.newDescription};
            ajaxGet('/opinions/saveOpinion', {opinion: opinion}, function (result) {
                if (result.code == 0) {
                    opinion.clientId = clientInfoModel.clientDetail.rid
                    opinion.rid = result.insertId;
                    opinion.creDate = new Date();
                    opinion.username = clientInfoModel.clientDetail.username;
                    opinion.headimgurl = clientInfoModel.clientDetail.headimgurl;
                    vm.opinionCollectionList.splice(0, 0, opinion);
                    vm.currentItem.rowCount++;
                    window.history.go(-1);
                } else {
                    showConfirmDialog("", "保存意见错误");
                }
            });
        }

        vm.addFavorite = function (el) {
            if (el.myFavoriteCount > 0) {
                showConfirmDialog("", "您已经点过赞了");
                return;
            }
            ajaxGet('/opinions/addFavorite', {opinion: {opinionDetailId: el.rid}}, function (result) {
                if (result.code == 0) {
                    el.favoriteCount++;
                    el.myFavoriteCount++;
                    showSuccessTip("点赞成功！");
                } else {
                    showConfirmDialog("", "保存错误");
                }
            });
        }
        vm.initList = function (cb) {
            if (vm.list.length <= 0) {
                vm.refreshList(cb);
                clientInfoModel.setScrollRefreshHandler(vm.onScrollRefreshScreen);
            } else {
                if (cb) {
                    cb();
                }
            }
        }

        vm.onScrollRefreshScreen = function () {
            if ($("#frameContentDetail").css("display") == "none") {
                vm.refreshList(function () {
                });
            }
        }

        vm.refreshList = function (cb) {
            ajaxGet('/opinions/retrieveList', {type: vm.type, arrayLength: vm.list.length}, function (result) {
                if (result.code == 0) {
                    if (result.data.length > 0) {
                        if (!vm.$allList[vm.type]) {
                            vm.$allList[vm.type] = [];
                        }
                        for (var i = 0; i < result.data.length; i++) {
                            var item = result.data[i];
                            item.cover = "url('" + item.cover + "')";
                            vm.list.push(item);
                            vm.$allList[vm.type].push(result.data[i]);
                        }
                    }
                }
                if (cb) {
                    cb();
                }
            });
        }

        vm.onFocus = function () {
        }

        vm.initApp = function () {
            if (!clientInfoModel.gotoAccessRightScreen("nanyuan", "accessRight", "nanyuan", "2.1minyizhengji")) {
                vm.initList();
            }
        }

        vm.init = function () {
            if (clientInfoModel.$initializeStatus == 'Y') {
                vm.initApp();
            } else {
                clientInfoModel.addInitializeHandler(function (cb) {
                    vm.initApp();
                    if (cb) {
                        cb();
                    }
                });
            }
        }
    });
});
