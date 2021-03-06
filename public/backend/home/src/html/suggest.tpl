<div id="list-page">
   <!-- <div class="toolbar">
        <a class="ui-button ui-button-sblue" ms-click="edit('')"><i class="iconfont">&#xe625;</i>&nbsp;添加</a>
    </div>-->
    <div class="ui-table-container">
        <table class="ui-table ui-table-inbox"><!-- 可以在class中加入ui-table-inbox或ui-table-noborder分别适应不同的情况 -->
            <thead>
            <tr>
                <th style="width:100px;">联系人</th>
                <th style="width:100px;">手机号码</th>
                <th>类别</th>
                <th>意见与建议</th>
                <th>日期</th>
                <th style="width:200px;">操作</th>
            </tr>
            </thead>
            <!-- 表头可选 -->
            <tbody>
            <tr ms-repeat="list">
                <td>{{el.contact}}</td>
                <td>{{el.mobile}}</td>
                <td>{{el.typeDesc}}</td>
                <td>{{el.description}}</td>
                <td>{{el.create_time | date("yyyy-MM-dd")}}</td>
                <td class="action">
                    <a class="ui-button ui-button-swhite" ms-click="del(el.rid)" style="padding:2px 5px;"><i
                            class="iconfont">&#xe60b;</i>&nbsp;删除</a>
                </td>
            </tr>
            <tr ms-if="!list.size()">
                <td colspan="5" style="font-weight: bold;font-style: italic;color: silver;">
                    没 有 查 询 到 相 关 记 录!
                </td>
            </tr>
            </tbody>
        </table>
        <div id="paging" style="margin: 20px 0px;">
        </div>
    </div>
</div>