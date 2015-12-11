<div id="staffEdit-page">
    <p style="line-height: 60px;text-align: center;font-size: 16px;font-weight: bold;;">人&nbsp;员&nbsp;资&nbsp;料</p>
    <div  class="staff-left">
        <ul id="staffEdit-departmentTree" class="ztree"></ul>
    </div>
    <div class="staff-right">
        <form class="ui-form ui-form-large" id="staffEdit-form" style="text-align: left;">
            <fieldset>
                <legend>标题</legend>
                <div class="ui-form-item">
                    <label class="ui-label">
                      <!--  <span class="ui-form-required">*</span>-->照&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;片
                    </label>
                    <div id="icon"
                         style="text-align: center; float: left;margin-right:20px;" ms-if="obj.photo">
                        <img ms-src="obj.photo||''" style="width:100px;height:100px;" ms-if="obj.photo">
                    </div>
                    <div id="upload-photo"
                         style="width:100px;height: 100px; text-align: center; background-color: #E0E0E0;float: left">
                        <i class="iconfont" style="font-size: 1.2rem;color:white;line-height: 100px;">&#xe60f;</i>
                    </div>
                    <p for="photo" class="ui-form-explain"
                       style="clear:both; display: none;color: #f40;"><i class='iconfont'></i>&nbsp;上传照片</p>
                </div>
                <div class="ui-form-item">
                    <label class="ui-label">
                        <span class="ui-form-required">*</span>姓&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;名
                    </label>
                    <input class="ui-input" type="text" name="username" style="width:270px" ms-duplex="obj.username">

                    <p for="username" class="ui-form-explain input-error"
                       style="text-align: left;display: none"></p>
                </div>
                <div class="ui-form-item">
                    <label class="ui-label">
                        <span class="ui-form-required">*</span>密&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;码
                    </label>
                    <input class="ui-input" type="password" name="password" style="width:270px" ms-duplex="obj.password">

                    <p for="password" class="ui-form-explain input-error "
                       style="text-align: left;display: none"></p>
                </div>
                <div class="ui-form-item">
                    <label class="ui-label">
                        <span class="ui-form-required">*</span>政治面貌
                    </label>
                    <input class="ui-input" type="text" name="politics" style="width:270px" ms-duplex="obj.politics">

                    <p for="politics" class="ui-form-explain input-error "
                       style="text-align: left;display: none"></p>
                </div>
                <div class="ui-form-item">
                    <label class="ui-label">
                        <span class="ui-form-required">*</span>部&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;门
                    </label>
                    <input class="ui-input" type="text" style="width:270px" name="department" ms-duplex="department"  placeholder="选择部门" disabled>

                    <p for="department" class="ui-form-explain"
                       style="display: none;color: #f40;"><i class='iconfont'></i>&nbsp;从左侧部门中选择所在部门</p>
                </div>
                <div class="ui-form-item">
                    <label class="ui-label">
                        <span class="ui-form-required">*</span>职&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;务
                    </label>
                    <input class="ui-input" type="text" name="title" style="width:270px" ms-duplex="obj.title">

                    <p for="title" class="ui-form-explain input-error "
                       style="text-align: left;display: none"></p>
                </div>
                <div class="ui-form-item">
                    <label class="ui-label">
                        <span class="ui-form-required">*</span>角&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;色
                    </label>
                    <a href="javascript:" id="role-select" class="ui-select-trigger"></a>
                    <input type="hidden" name="role" ms-duplex="obj.role">
                    <p for="role" class="ui-form-explain input-error "
                       style="text-align: left;display: none"></p>
                </div>
                <div class="ui-form-item">
                    <label class="ui-label">
                        <span class="ui-form-required">*</span>手&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;机
                    </label>
                    <input class="ui-input" type="text" name="mobile" style="width:270px" ms-duplex="obj.mobile"
                           placeholder="手机号">

                    <p for="mobile" class="ui-form-explain input-error "
                       style="text-align: left;display: none"></p>
                </div>
                <div class="ui-form-item">
                    <label class="ui-label">显示序号</label>
                    <input class="ui-input" type="text" name="listOrder" style="width:270px" ms-duplex="obj.listOrder"
                           placeholder="默认1为最高优先级">

                    <p for="listOrder" class="ui-form-explain input-error "
                       style="text-align: left;display: none"></p>
                </div>
                <div class="ui-form-item">
                    <input type="button" class="ui-button ui-button-lblue" value="确&nbsp;&nbsp;&nbsp;定" ms-click="save()">
                    <input type="button" class="ui-button ui-button-lwhite" value="返&nbsp;&nbsp;&nbsp;回" ms-click="back()">
                </div>
            </fieldset>
        </form>
    </div>
</div>


