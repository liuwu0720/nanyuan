<div id="list-page">
    <div class="ui-table-container" >
        <table class="ui-table ui-table-inbox" ><!-- 可以在class中加入ui-table-inbox或ui-table-noborder分别适应不同的情况 -->
            <thead>
            <tr>
                <th style="width:100px;">预约类型</th>
                <th style="width:100px;">预约编号</th>
                <th style="width:80px;">预约人</th>
                <th style="width:100px;">预约时间</th>
                <th style="width:100px;">联系电话</th>
                <th >描&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;述</th>
                <th style="width:60px;">状态</th>
                <th style="width:120px;">操作</th>
            </tr>
            </thead><!-- 表头可选 -->
            <tbody>
                <tr ms-repeat="list">
                    <td>{{el.typeName}}</td>
                    <td>{{el.bookingNo}}</td>
                    <td>{{el.contacts}}</td>
                    <td>{{el.booked_time |  date("yyyy-mm-dd HH:mm:ss")}}</td>
                    <td>{{el.telephone}}</td>
                    <td>{{el.content}}</td>
                    <td>{{el.status=="booking"?"未受理":(el.status=="booked"?"已受理":"处理完成")}}</td>
                    <td class="action">
                        <a class="action-item" ms-click="del(el.rid)" style="padding:2px 5px;"><i class="iconfont">&#xe60b;</i>&nbsp;删除</a>
                        <a class="action-item" ms-click="update(el)" ms-if="el.status!='handled'" style="padding:2px 5px;">
                            <i class="iconfont" ms-if="el.status=='booking'">&#xe613;</i> <i class="iconfont" ms-if="el.status=='booked'">&#xe611;</i>&nbsp;{{el.status =='booking'?"受理":"完成"}}
                        </a>
                    </td>
                </tr>
            <tr ms-if="!list.size()">
                <td colspan="8" style="font-weight: bold;font-style: italic;color: silver;">
                    没 有 查 询 到 相 关 记 录!
                </td>
            </tr>
            </tbody>
        </table>
        <div id="paging" style="margin: 20px 0px;">
        </div>
    </div>
</div>