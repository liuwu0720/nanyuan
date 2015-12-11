<div  id="staff-page">
    <div class="toolbar text-right">
        <a class="ui-button ui-button-sblue" ms-click="edit('')" ><i class="iconfont">&#xe60f;</i>&nbsp;添加</a>
    </div>
    <div  class="staff-left">
        <ul id="staff-departmentTree" class="ztree"></ul>
    </div>
    <div class="staff-right">
        <div class="ui-table-container" >
            <table class="ui-table ui-table-inbox" ><!-- 可以在class中加入ui-table-inbox或ui-table-noborder分别适应不同的情况 -->
                <thead>
                <tr>
                    <th>用户名</th>
                    <th>部&nbsp;&nbsp;&nbsp;门</th>
                    <th>职&nbsp;&nbsp;&nbsp;务</th>
                    <th>角&nbsp;&nbsp;&nbsp;色</th>
                    <th>手&nbsp;&nbsp;&nbsp;机</th>
                    <th>操&nbsp;&nbsp;&nbsp;作</th>
                </tr>
                </thead><!-- 表头可选 -->
                <tbody>
                <tr ms-repeat="list">
                    <td>{{el.username}}</td>
                    <td>{{el.department}}</td>
                    <td>{{el.title}}</td>
                    <td>{{el.role | userType}}</td>
                    <td>{{el.mobile}}</td>
                    <td class="action">
                        <a href="javascript:" ms-click="del(el)" class="action-item" style="padding:2px 5px;"><i class="iconfont">&#xe60b;</i></a>
                        <a href="javascript:" ms-click="edit(el)" class="action-item"  style="padding:2px 5px;"><i class="iconfont">&#xe60c;</i></a>
                    </td>
                </tr>
                <tr ms-if="!list.size()">
                    <td colspan="6" style="font-weight: bold;font-style: italic;color: silver;text-align: center;">
                        没 有 查 询 到 相 关 记 录!
                    </td>
                </tr>
                </tbody>
            </table>
            <div id="paging" style="margin: 20px 0px;">
            </div>
        </div>
    </div>
</div>