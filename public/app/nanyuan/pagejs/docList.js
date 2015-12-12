var docListModel = createModel('docList', function (modelName) {

    return avalon.define(modelName, function (vm) {
        vm.list = [];
        vm.currentItem = {title: '', description: '', publishDate: null, publisher: '', content: ''};
        vm.type = clientInfoModel.$initPageParameters.documents.type;
        vm.$groupId = -1;
        vm.banner = "";
        vm.$banners = {};

        vm.init = function () {
            clientInfoModel.setScrollRefreshHandler(vm.onScrollRefreshScreen);
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
        vm.onScrollRefreshScreen = function () {
            if ($("#frameDocList").css("display") == "block") {
                vm.refreshList(vm.$groupId);
            }
        }
        vm.refreshList = function (groupId, cb) {
            ajaxGet('/documents/retrieveList', {
                type: vm.type,
                arrayLength: vm.list.length,
                groupId: groupId
            }, function (result) {
                vm.banner = vm.$banners[vm.type] ||  "url(" + result.banner + ")";
                if (vm.banner) {
                    vm.$banners[vm.type] = vm.banner;
                }
                if (result.data && result.data.length) {
                    vm.list.pushArray(result.data);
                }
                typeof cb === 'function' && cb();
            });
        }


        vm.$watch("load-list", function (groupId, doc_type) {
            if (vm.$groupId != groupId) {
                vm.$groupId = groupId;
                vm.type = doc_type;
                vm.list.removeAll();
            }
            vm.refreshList(groupId);
        });
    });
});
