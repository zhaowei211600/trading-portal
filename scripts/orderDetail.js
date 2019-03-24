var orderStatus;
function GetRequest() {
    var url = location.search; //获取url中"?"符后的字串
    var theRequest = new Object();
    if (url.indexOf("?") != -1) {
        var str = url.substr(1);
        strs = str.split("&");
        for(var i = 0; i < strs.length; i ++) {
            theRequest[strs[i].split("=")[0]]=unescape(strs[i].split("=")[1]);
        }
    }
    return theRequest;
}
var param = GetRequest();
$(function () {
    $.ajax({
        url: BASEURL + "/user/require/detail?requirementId="+param['requirementId'],
        type: "get",
        dataType: "json",
        contentType: "application/json",
        success: function(result) {
            if (result.returnCode == "200") {
                var status = '';
                var data = result.data;
                orderStatus = data.status;
                $("#requirementId").html(data.requirementId);
                $("#createTime").html(data.createTime);
                $("#desc").html(data.desc);
                $("#typeName").html(data.typeName);
                if(data.status == '1'){
                    status = '待审核';
                }else if(data.status == '2'){
                    status = '已确认';
                }else if(data.status == '3'){
                    status = '已发布';
                }
                $("#status").html(status);

            }
        }
    })
});
/*

$(function () {
    $("#apply").click(function () {
        if(orderStatus != '2'){
            greenAlertBox('当前状态无法结项');
            return false;
        }else{
            window.location.href = '../pages/order-apply.html?productId='+param['productId'];
        }
    });
});*/
