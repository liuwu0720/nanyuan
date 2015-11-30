$(function(){
    function init(){
        initData();
        initEvent();
    }
    init();

    function initData(){
        appManager.login(function(client){
            if(client) {
                clientInfoModel.initData();
                removeLoadingScreen();
            }
        },false);
    }

    function initEvent(){
        window.addEventListener('load', function(){
            initTabEvent();
        })
    }

    function initTabEvent(){
        var tab=null;
        try{
            tab = new fz.Scroll('.ui-tab', {
                role: 'tab'
            });
            /* 滑动开始前 */
            tab.on('beforeScrollStart', function(from, to) {
                // from 为当前页，to 为下一页
            })

            /* 滑动结束 */
            tab.on('scrollEnd', function(curPage) {
                // curPage 当前页
            });

        }catch(e){
            tab=null;
        }
    }

    function removeLoadingScreen(){
    }

    $(window).scroll(function () {
        var scrollTop = $(this).scrollTop();
        var scrollHeight = $(document).height();
        var windowHeight = $(this).height();
        if (scrollTop + windowHeight == scrollHeight) {
            clientInfoModel.onScrollRefreshScreen();
            //此处是滚动条到底部时候触发的事件，在这里写要加载的数据，或者是拉动滚动条的操作
            //var page = Number($("#redgiftNextPage").attr('currentpage')) + 1;
            //redgiftList(page);
            //$("#redgiftNextPage").attr('currentpage', page + 1);
        }
    });
});
