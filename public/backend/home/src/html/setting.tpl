<div style="text-align: left;">
    <div class="ui-tab">
        <ul class="ui-tab-items">
           <!-- <li class="ui-tab-item" ms-class="ui-tab-item-current:tab_index == 1" ms-click="switchTab(1)">
                <a href="javascript:;">关键词</a>
            </li>-->
            <li class="ui-tab-item" ms-class="ui-tab-item-current:tab_index == 2" ms-click="switchTab(2)">
                <a href="javascript:;">资讯封面</a>
            </li>
        </ul>
    </div>
    <div class="ui-switchable-content">
       <!-- <div ms-class="hidden:tab_index!=1">
            <div style="margin:100px auto;width:360px;">
                <p style="margin-bottom: 20px;;"><span style="font-weight:bold;font-size: 18px;;">关键词:</span></p>
                <textarea style="width: 100%;height: 150px;" ms-duplex="keyword.values"> </textarea>

                <p style="margin-top: 10px;font-size:12px;color:gray">* 关键字用于统计查询,在输入框中填写需要统计的关键词,每行一个! </p>

                <div style="text-align: center;margin-top:20px;">
                    <a class="ui-button ui-button-mblue" ms-click="save(1)">保&nbsp;&nbsp;&nbsp;存</a>
                </div>
            </div>
        </div>-->
        <div ms-class="hidden:tab_index!=2">
            <div id="settingCover-page">
                <div class="cover-item">
                    <span class="cover-title">南园动态:</span>
                    <div >
                         <img ms-src="news1.values" class="cover" alt="">
                    </div>
                    <span id="news1-upload" class="uploader-btn"><i class="iconfont">&#xe60f;</i></span>
                </div>
                <div class="cover-item">
                    <span class="cover-title">民生实事:</span>
                    <div >
                        <img ms-src="news2.values" class="cover" alt="">
                    </div>
                    <span id="news2-upload" class="uploader-btn"><i class="iconfont">&#xe60f;</i></span>
                </div>
                <div class="cover-item">
                    <span class="cover-title">政策法规:</span>
                    <div ><img ms-src="documents1.values" class="cover"  alt="" >
                    </div>
                    <span id="documents2-upload" class="uploader-btn"><i class="iconfont">&#xe60f;</i></span>
                </div>
                <div class="cover-item">
                    <span class="cover-title">办事流程:</span>
                    <div >
                        <img ms-src="documents2.values" class="cover" alt="">
                    </div>
                    <span id="documents1-upload" class="uploader-btn"><i class="iconfont">&#xe60f;</i></span>
                </div>
            </div>
        </div>
    </div>
</div>