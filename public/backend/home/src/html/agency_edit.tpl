<p style="line-height: 60px;text-align: center;font-size: 16px;font-weight: bold;;">办&nbsp;事&nbsp;机&nbsp;构&nbsp;资&nbsp;料</p>
<div  style="width:550px;float: left">
    <form class="ui-form ui-form-large"  id="agency-form">
        <fieldset>
            <legend>标题</legend>
            <div class="ui-form-item">
                <label  class="ui-label">
                    <span class="ui-form-required">*</span>机&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;构
                </label>
                <input class="ui-input" type="text" style="width:270px" name="department" ms-duplex="obj.department" >
                <p for="department" class="ui-form-explain input-error " style="text-align: left;padding-left:20px;display: none"></p>
            </div>
            <div class="ui-form-item">
                <label class="ui-label">
                   联系方式
                </label>
                <input class="ui-input" type="text" name="tel" style="width:270px" ms-duplex="obj.tel"  placeholder="手机号或座机号">
                <p for="tel" class="ui-form-explain input-error " style="text-align: left;padding-left:20px;display: none"></p>
            </div>
            <div class="ui-form-item">
                <label class="ui-label">
                    <span class="ui-form-required">*</span>详细地址
                </label>
                <input class="ui-input" type="text" name="address" style="width:200px" ms-duplex="obj.address"  placeholder="输入地址后,搜索选择标注" >
                <a class="ui-button ui-button-mblue" ms-click="mapSearch()">搜索</a>
                <p for="address" class="ui-form-explain input-error " style="text-align: left;padding-left:20px;display: none"></p>
            </div>
            <div class="ui-form-item">
                <label class="ui-label">显示序号</label>
                <input class="ui-input" type="text" name="listOrder" style="width:270px" ms-duplex="obj.listOrder" placeholder="1为最高优先级" >
                <p for="listOrder"  class="ui-form-explain input-error " style="text-align: left;padding-left:20px;display: none"></p>
            </div>
            <div class="ui-form-item">
                <input type="button" class="ui-button ui-button-lblue" value="确&nbsp;&nbsp;&nbsp;定" ms-click="save()">
                <input type="button" class="ui-button ui-button-lwhite" value="返&nbsp;&nbsp;&nbsp;回" ms-click="back()">
            </div>
        </fieldset>
    </form>
</div>
<div style="overflow: hidden;float: left;">
     <div id="container" style="width:350px;height: 350px;">

     </div>
</div>
