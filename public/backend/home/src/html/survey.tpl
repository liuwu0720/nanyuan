<div id="content-page">
    <div class="content-left">
        <div class="action survey-tool">
            <a href="javascript:" class="action-item" style="margin-right: 10px;" ms-click="addGroup()"><i class="iconfont">&#xe60f;</i>&nbsp;添加</a>
            <a href="javascript:" class="action-item" style="margin-right: 10px;" ms-click="editGroup()"><i class="iconfont">&#xe60c;</i>&nbsp;修改</a>
            <a href="javascript:" class="action-item"  ms-click="delGroup()"><i class="iconfont">&#xe60b;</i>&nbsp;删除</a>
        </div>
        <ul id="survey-list" ms-repeat="surveyGroup">
           <li class="survey-group" ms-class="survey-active:el.rid==group.rid" ms-click="queryByGroup(el)"><a>{{el.title}}</a></li>
        </ul>
    </div>
    <div class="content-right">
        <div class="toolbar text-right">
            <a class="ui-button ui-button-sblue" ms-click="edit('')"><i class="iconfont">&#xe60f;</i>&nbsp;添加</a>
        </div>
        <div class="ui-table-container">
            <table class="ui-table ui-table-inbox"><!-- 可以在class中加入ui-table-inbox或ui-table-noborder分别适应不同的情况 -->
                <thead>
                <tr>
                    <th>编号</th>
                    <th>试卷</th>
                    <th>题&nbsp;&nbsp;&nbsp;目</th>
                    <th>操&nbsp;&nbsp;&nbsp;作</th>
                </tr>
                </thead>
                <!-- 表头可选 -->
                <tbody>
                <tr ms-repeat="list">
                    <td>{{$index+1}}</td>
                    <td>{{el.groupTitle}}</td>
                    <td>{{el.title}}</td>
                    <td class="action">
                        <a href="javascript:" ms-click="del(el)" class="action-item" style="padding:2px 5px;"><i
                                class="iconfont">&#xe60b;</i></a>
                        <a href="javascript:" ms-click="edit(el)" class="action-item" style="padding:2px 5px;"><i
                                class="iconfont">&#xe60c;</i></a>
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