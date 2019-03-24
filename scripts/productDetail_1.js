var productId;
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
        url: BASEURL + "/product/find?productId="+param['productId'],
        type: "get",
        dataType: "json",
        contentType: "application/json",
        success: function(result) {
            if (result.returnCode == "200") {
                var data = result.data;
                $("#acceptingSide").html(data.acceptingSide);
                $("#process").html(data.process);
                $("#tradeDetail").html(data.tradeDetail);
            }
        }
    })

    $.ajax({
        url: BASEURL + "/user/type/product?productId="+param['productId'],
        type: "get",
        dataType: "json",
        contentType: "application/json",
        success: function(result) {
            if (result.returnCode == "200") {
                var data = result.data;
                orderStatus = data.status;
                $("#typeDesc").html(data.typeDesc);
                $("#typeProcess").html(data.process);
                $("#typeName").html(data.typeName);
                $("#rules").html(data.rules);
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
