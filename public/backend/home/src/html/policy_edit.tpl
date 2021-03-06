<div style="width:100%;text-align: left;margin:0 auto;clear: both;padding-top:50px">
    <form class="ui-form ui-form-large" name="" method="post" action="#" id="">
        <fieldset>
            <legend>标题</legend>
            <div class="ui-form-item">
                <p class="error error-title">*&nbsp;<span>填写标题</span></p>
                <label for="" class="ui-label">
                    <span class="ui-form-required">*</span>标&nbsp;&nbsp;&nbsp;题
                </label>
                <input class="ui-input" type="text" ms-duplex="obj.title" style="width:580px;"> <span
                    class="ui-form-other"></span>
            </div>
            <div class="ui-form-item">
                <p class="error error-group">*&nbsp;<span>选择分组</span></p>
                <label for="" class="ui-label">
                    <span class="ui-form-required">*</span>类&nbsp;别&nbsp;分&nbsp;组
                </label>
                <select class="ui-select ui-select-item"  ms-duplex="obj.group_id" >
                    <option value="">选择分组</option>
                    <option  ms-repeat="groupList" ms-value="el.rid">{{el.group_name}}</option>
                </select>
                <span class="ui-form-other"></span>
            </div>
            <div class="ui-form-item ui-form-item-success">
                <label for="" class="ui-label">内&nbsp;&nbsp;&nbsp;容</label>
                <script id="policy-editor" name="content" type="text/plain">
                </script>
            </div>
            <div class="ui-form-item">
                <input type="button" class="ui-button ui-button-mblue" value="确&nbsp;&nbsp;&nbsp;定" ms-click="save()">
                <input type="button" class="ui-button ui-button-mwhite" value="返&nbsp;&nbsp;&nbsp;回" ms-click="back()">
            </div>
        </fieldset>
    </form>
</div>
