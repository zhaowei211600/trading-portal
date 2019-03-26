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
    $('.itemBtn').click(function () {
        $('.itemBtn').removeClass('active')
        $(this).addClass('active')
        var item = $(this).attr('title')
        $('.maginBottom').addClass('hidden')
        switch (item){
            case '0':
            {
                $('.maginBottom:eq(0)').removeClass('hidden')
                break;
            }
            case '1':
            {
                $('.maginBottom:eq(1)').removeClass('hidden')
                break;
            }
            case '2':
            {
                $('.maginBottom:eq(2)').removeClass('hidden')
                break;
            }
            case '3':
            {

                $('.maginBottom:eq(3)').removeClass('hidden')
                break;
            }
        }
    })
    $.ajax({
        url: BASEURL + "/product/find?productId="+param['productId'],
        type: "get",
        dataType: "json",
        contentType: "application/json",
        success: function(result) {
            if (result.returnCode == "200") {
                var data = result.data;
                $("#productId").html(data.productId);
                $("#type").html(data.firstTypeName +"-"+ data.secondTypeName);
                $("#budget").html(data.budget);
                $("#createTime").html(data.createTime);
                $("#area").html(data.area);

                $("#acceptingSide").html(data.acceptingSide);
                $("#process").html(data.process);
                $("#tradeDetail").html(data.tradeDetail);
                $("#desc").html(data.desc);

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

    $.ajax({
        url: BASEURL + "/product/attachment?productId="+param['productId'],
        type: "get",
        dataType: "json",
        contentType: "application/json",
        success: function(result) {
            if (result.returnCode == "200") {
                var data = result.data;
                var tbody = "";
                for (var i = 0; i < data.length; i++) {
                    var item = data[i];
                    tbody += "<div class=\"flex\"><div>附件：</div><div>"+item.fileName+"</div><div class=\"look\">查看</div></div>";
                }
                $("#attachmentList").html(tbody);

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
