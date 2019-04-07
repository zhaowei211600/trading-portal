var productId;
var isFollow = false;
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
productId = param['productId'];

function checkProduct() {
    if($.cookie('Authorization')){
        $.ajax({
            url: BASEURL + "/follow/check" ,
            data: {'productId':productId},
            type: "get",
            success: function (resultData) {
                if (resultData.returnCode == 200) {
                    $("#isFollow").removeClass("icon-weixuanzhong");
                    $("#isFollow").addClass("icon-yixuanzhong");
                    $("#isFollow").html("取消关注");
                    isFollow = true;
                }else{
                    $("#isFollow").removeClass("icon-yixuanzhong");
                    $("#isFollow").addClass("icon-weixuanzhong");
                    $("#isFollow").html("关注");
                    isFollow = false;
                }
            }
        });
    }
}

function initProduct() {
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
                $("#productName").html(data.name);
                /*if (data.descImg) {
                    //Blue();
                    $.ajax({
                        type: "post",
                        url: BASEURL + '/user/file/download',
                        data: {'fileName': data.descImg},
                        contentType: 'application/x-www-form-urlencoded;charset=utf-8',
                        // dataType: 'json',
                        async: true,
                        crossDomain: true == !(document.all),
                        success: function (data) {
                            //$('.loadingBlue').remove()
                            if (data.returnCode == 200) {
                                $('#descImg').attr('src', 'data:image/png;base64,' + data.data)
                            }
                        }
                    });
                }*/
            }
            if($.cookie('Authorization')){
                $(".unLogin").css('display','none');

            }else {
                $(".displayUnLogin").css('display','none');
            }
        }
    })
}

function getProductType() {
    console.log("获取type");
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
        },
        error: function (data) {
            console.log(JSON.stringify(data));
        }
    })
}

function followProduct() {
    var followType = 1;
    if(isFollow){
        followType = 2;
    }
    if($.cookie('Authorization')){
        $.ajax({
            url: BASEURL + "/follow" ,
            data: {'productId':productId,'followType':followType},
            type: "get",
            success: function (resultData) {
                if (resultData.returnCode == 200) {
                    if(isFollow){
                        $("#isFollow").removeClass("icon-yixuanzhong");
                        $("#isFollow").addClass("icon-weixuanzhong");
                        $("#isFollow").html("关注");
                        isFollow = false;
                    }else{
                        $("#isFollow").removeClass("icon-weixuanzhong");
                        $("#isFollow").addClass("icon-yixuanzhong");
                        $("#isFollow").html("取消关注");
                        isFollow = true;
                    }
                }
            }
        });
    }else{
        window.location.href = '../pages/login.html';
    }
}
function addBackGround() {
    $('.isShowShare').show()

}

$(function () {

    checkProduct();
    $('.itemBtn').click(function () {

        $('.itemBtn').removeClass('active')
        $(this).addClass('active')
        var item = $(this).attr('title')
        $('.itemText').addClass('hidden')
        switch (item){
            case '0':
            {
                $('.itemText:eq(0)').removeClass('hidden')
                break;
            }
            case '1':
            {
                $('.itemText:eq(1)').removeClass('hidden')
                break;
            }
            case '2':
            {
                $('.itemText:eq(2)').removeClass('hidden')
                break;
            }
            case '3':
            {
                $('.itemText:eq(3)').removeClass('hidden')
                break;
            }
        }
    })

    initProduct();

    getProductType();

    $('.isShowShare').click(function () {
        $('.isShowShare').hide()
    })
});