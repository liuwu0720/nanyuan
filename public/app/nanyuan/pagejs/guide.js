var guideModel = createModel('guide', function (modelName) {
    return avalon.define(modelName, function (vm) {
        vm.list = [];
        vm.groupList = [];
        vm.type = clientInfoModel.$initPageParameters.documents.type;
        vm.$groupId = -1;
        vm.banner = "";
        vm.currentItem = {title: '', description: '', publishDate: null, publisher: '', content: ''};
        vm.$allList = [];
        vm.$allBanners = [];

        vm.switchType = function (type) {
            if (type == vm.type) {
                return;
            } else {
                var newList = vm.$allList[type];
                vm.type = type;
                if (newList) {
                    vm.list = newList;
                    vm.banner = vm.$allBanners[type];
                } else {
                    vm.list = [];
                    vm.banner = "";
                    vm.initGroupList();
                }
            }
        }

        vm.openDocumentsItem = function (el) {
            vm.currentItem = el;
            ajaxGet('/documents/retrieveDetail', {rid: el.rid}, function (result) {
                if (result.code == 0) {
                    vm.currentItem.content = result.data.content;
                    var content = null;
                    content = '<div class="ui-whitespace" style="background-color:white;padding-top: 20px">' +
                        '<h1 style="font-size: 1.5em">' + vm.currentItem.title + '</h1>' +
                        '<h6 style="padding-top: 10px">' + vm.currentItem.publishDate + '&nbsp;&nbsp;' + "<span style='color:#6FB1C7'>" + ('南园民生') + '</h6>' +
                        '<div style="padding-top: 10px">' +
                        vm.currentItem.content +
                        '</div>' +
                        '</div>';
                    $("#frameContentDetail").html(content);
                    dynamicImageHandler("frameContentDetail");
                    clientInfoModel.openScreen("ContentDetail");
                }
            });
        }

        vm.initGroupList = function (cb) {
            if (!vm.list.length) {
                vm.refreshGroupList(cb);
            } else {
                if (cb) {
                    cb();
                }
            }
        }

        vm.openList = function (groupId) {
            clientInfoModel.openScreen("DocList");
            vm.$fire("all!load-list",groupId,vm.type);
        }

        vm.refreshGroupList = function () {
            ajaxGet('/documents/retrieveGroupList', {type: vm.type}, function (result) {
                result.data && result.data.length && (vm.groupList = result.data);
            });
        }

        vm.onFocus = function () {
        }

        vm.initApp = function () {
            vm.initGroupList();
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
