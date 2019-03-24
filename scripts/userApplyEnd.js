$(function () {
    $("#reApply").click(function () {
        window.location.href = "../pages/userApply.html";
    });
    //获取认证状态
    getAccount();

    /*if(!$('#realName').text() || !$('#comEmail').text()){
        $(".wrap-title").hide();
        $(".wrap-main").hide();
        $(".wrap-btn").hide();
        $(".wrap-success").show();
    }else{
        $(".wrap-title").show();
        $(".wrap-main").show();
        $(".wrap-btn").show();
        $(".wrap-success").hide();
    }*/


});

function getAccount() {
    $.ajax({
        type: "post",
        url: BASEURL + '/user/info',
        data: '',
        contentType: 'application/json;charset=utf-8',
        dataType: 'json',
        async: true,
        crossDomain: true == !(document.all),
        // beforeSend: function(request) {
        // 	request.setRequestHeader("Authorization", tokenString);
        // },
        success: function (data) {
            $('.loadingBlue').remove()
            // console.log(data);
            var infoData = data.data
            if (data.returnCode == '200') {
                $('#orgName').text(infoData.orgName);
                $('#position').text(infoData.position);
                $('#address').text(infoData.address);
                $('#contactPhone').text(infoData.contactPhone);
                $('#email').text(infoData.email);
                //1:注册游客 2:会员代理 3:分柜 4:掌柜
                var approveState = infoData.authStatus;
                if (approveState == 1) {
                    $('#authResult').text("认证审核中");
                    $('#reApply').attr('disabled','disabled');
                }else if(approveState == 2){
                    $('#authResult').text("认证通过");
                }else if(approveState == 3){
                    $('#authResult').text("抱歉，认证未通过");
                }
                if (infoData.cardImg) {
                    loadingBlue();
                    console.log('请求下载文件')
                    $.ajax({
                        type: "post",
                        url: BASEURL + '/user/file/download',
                        data: {'fileName': infoData.cardImg},
                        contentType: 'application/x-www-form-urlencoded;charset=utf-8',
                        // dataType: 'json',
                        async: true,
                        crossDomain: true == !(document.all),
                        success: function (data) {
                            $('.loadingBlue').remove()
                            if (data.returnCode == 200) {
                                $('.wrap-main-messages-img .file').attr('src', 'data:image/png;base64,' + data.data)
                            }
                        }
                    });
                }

            } else {
                // alert(data.returnMessage)
            }
        }
    });
}

