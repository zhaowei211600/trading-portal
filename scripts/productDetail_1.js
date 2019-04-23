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
$(function () {
    checkProduct();
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
            case '4':
            {
                $('.maginBottom:eq(4)').removeClass('hidden')
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
                $("#productName").html(data.name);
                $("#productId").html(data.productId);
                $("#type").html(data.firstTypeName +"-"+ data.secondTypeName);
                $("#budget").html(data.budget);
                $("#createTime").html(data.createTime);
                $("#area").html(data.area);

                $("#acceptingSide").html(data.acceptingSide);
                $("#desc").html(data.desc);
                $("#attachmentDesc").html(data.attachmentDesc);


                if($.cookie('Authorization')){
                    $(".unLogin").css('display','none');
                    $("#tradeDetail").html(data.tradeDetail);
                    $("#process").html(data.process);
                }else {

                    $(".displayUnLogin").css('display','none');
                }
                var descImg = '';
                if(data.descImg){
                    descImg = '/images/'+ data.descImg;
                    $('#descImg').attr('src', descImg)

                }
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
                    tbody += "<div class=\"flex\"><div>附件：</div>" +
                        "<div>"+item.fileName+"</div>" +
                        "<a class=\"look\" target='_blank' href='"+BASEURL+"/user/file/attachment?fileName="+item.filePath+"'>查看</a></div>";
                }
                $("#attachmentList").html(tbody);

            }
            if(result.returnCode == "11012"){
                $("#attachmentList").html("您的等级不足，暂时不能查看相关内容");
            }
        }
    })

    $('.isShowShare').click(function () {
        $('.isShowShare').hide()
        $('html,body').removeClass('ovfHiden');

    })
});

function checkProduct() {
    if($.cookie('Authorization')){
        $.ajax({
            url: BASEURL + "/follow/check" ,
            data: {'productId':productId},
            type: "get",
            success: function (resultData) {
                if (resultData.returnCode == 200) {
                    $("#followImg").attr("src","../styles/images/StarFilled.png");
                    $("#isFollow").html("取消关注");
                    isFollow = true;
                }else{
                    $("#followImg").attr("src","../styles/images/star.png");
                    $("#isFollow").html("关注");
                    isFollow = false;
                }
            }
        });
    }
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
                        $("#followImg").attr("src","../styles/images/star.png");
                        $("#isFollow").html("关注");
                        isFollow = false;
                    }else{
                        $("#followImg").attr("src","../styles/images/StarFilled.png");
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
    $('html,body').addClass('ovfHiden');


}