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
                $('#phone').text(infoData.phone);
                $('#name').text(infoData.realName);
                $('#score').text(infoData.score);
                //1:注册游客 2:会员代理 3:分柜 4:掌柜
                var userType = '';
                if(infoData.type == '2'){
                    userType = '会员代理';
                }else if(infoData.type == '3'){
                    userType = '分柜';
                }else if(infoData.type == '4'){
                    userType = '掌柜';
                }else{
                    userType = '注册游客';
                }
                $('#userType').text(userType);

                var approveState = infoData.authStatus;
                if (approveState == 1) {
                    $('#authResult').text("认证审核中");
                }else if(approveState == 2){
                    $('#authResult').text("认证通过");
                    $("#applyMessage").click(function () {
                        window.location.href = "../pages/userApplyEnd.html";
                    });
                }else if(approveState == 3){
                    $('#authResult').text("认证失败");
                    $("#applyMessage").click(function () {
                        window.location.href = "../pages/userApplyEnd.html";
                    });
                }else{
                    $('#authResult').text("未认证");
                    $("#applyMessage").click(function () {
                        window.location.href = "../pages/userApplyEnd.html";
                    });
                }

                /*if(infoData.authStatus != 0) {
                    $('.wrap-top-dy').show();
                    $('.main_top_org').hide();
                    $('.red-prompt').hide();
                    $('.userCenter-authentication').text(infoData.orgName).css({"color":"#495060"});

                }else{
                    $('.wrap-top-dy').hide();
                    $('.main_top_org').show();
                    $('.red-prompt').show();
                    $('.userCenter-authentication').text("未认证").css({"color":"#F44336"});
                    $("#applyMessage").click(function () {
                        window.location.href = "../pages/userApply.html";
                    });

                }*/
                /*else if (infoData.state ==3) {
                    $('.wrap-top-dy').hide();
                    $('.main_top_org').show();
                    $('.red-prompt').show();
                    $('.userCenter-authentication').text("认证中").css({"color":"#F44336"});
                    $("#applyMessage").click(function () {
                        window.location.href = "/wechat/src/pages/userApplyNext.html";
                    });
                    $("#assetsTransfer").click(function () {
                        $('.main_top_org').show();
                        $('.main_top_org').addClass('layui-anim layui-anim-scale layui-anim-scaleSpring')
                        // console.log('未认证，增加效果')
                        setTimeout(function () {
                            $('.main_top_org').removeClass('layui-anim layui-anim-scale layui-anim-scaleSpring')
                        }, 1000)
                    });
                }else if (infoData.state == 5) {
                    $('.wrap-top-dy').hide();
                    $('.main_top_org').show();
                    $('.red-prompt').show();
                    $('.userCenter-authentication').text("认证失败").css({"color":"#F44336"});
                    $("#applyMessage").click(function () {
                        window.location.href = "/wechat/src/pages/userApplyFail.html";
                    });
                    $("#assetsTransfer").click(function () {
                        $('.main_top_org').show();
                        $('.main_top_org').addClass('layui-anim layui-anim-scale layui-anim-scaleSpring')
                        // console.log('未认证，增加效果')
                        setTimeout(function () {
                            $('.main_top_org').removeClass('layui-anim layui-anim-scale layui-anim-scaleSpring')
                        }, 1000)
                    });
                }else if (infoData.state == 6) {
                    $('.wrap-top-dy').hide();
                    $('.main_top_org').show();
                    $('.red-prompt').show();
                    $('.userCenter-authentication').text("已冻结").css({"color":"#F44336"});
                    $("#applyMessage").click(function () {
                        window.location.href = "/wechat/src/pages/userApplyFail.html";
                    });
                    $("#assetsTransfer").click(function () {
                        $('.main_top_org').show();
                        $('.main_top_org').addClass('layui-anim layui-anim-scale layui-anim-scaleSpring')
                        // console.log('未认证，增加效果')
                        setTimeout(function () {
                            $('.main_top_org').removeClass('layui-anim layui-anim-scale layui-anim-scaleSpring')
                        }, 1000)
                    });
                } else {
                    $('.wrap-top-dy').hide();
                    $('.main_top_org').show();
                    $('.red-prompt').show();
                    $('.userCenter-authentication').text("注销").css({"color":"#F44336"});
                    $("#applyMessage").click(function () {
                        window.location.href = "/wechat/src/pages/userApply.html";
                    });
                    $("#assetsTransfer").click(function () {
                        $('.main_top_org').show();
                        $('.main_top_org').addClass('layui-anim layui-anim-scale layui-anim-scaleSpring')
                        // console.log('未认证，增加效果')
                        setTimeout(function () {
                            $('.main_top_org').removeClass('layui-anim layui-anim-scale layui-anim-scaleSpring')
                        }, 1000)
                    });
                }*/

            } else {
                // alert(data.returnMessage)
            }
        }
    });
}
loadingBlue()
getAccount();


//点击事件
$(function () {

    if(!$.cookie('Authorization')){
        greenAlertBox("未登录，需登录后查看");
        setTimeout("window.location.href = '../pages/login.html'", 1500);
    }else{
        $("#applyMessage").click(function () {
            window.location.href = "../pages/userApply.html";
        });
        $("#aboutUs").click(function () {
            window.location.href = "../pages/aboutUs.html";
            // greenAlertBox('正在开发中...')
            // return false
        });
        $("#changePassword").click(function () {
            window.location.href = "../pages/changePassword.html";
        });
        $("#myOrder").click(function () {
            window.location.href = "../pages/order-apply.html";
        });
        $("#messageManagement").click(function () {
            //window.location.href = "../pages/aboutUs.html";
            greenAlertBox('正在开发中...')
            return false
        });
        $("#productList").click(function () {
            window.location.href = "../pages/productList.html";
        });

        $(".wrap-btn-quit").click(function () {
            loadingBlue()
            exitSystem();
        });
    }

    // $.ajax({
    //     url: BASEURL + "/order/stat",
    //     type: "post",
    //     crossDomain: true == !(document.all),
    //     success: function (resultData) {
    //         if (resultData.returnCode == 200) {
    //             if (resultData.data != null) {
    //                 $("#totalCount").html("("+resultData.data.totalCount+")");
    //                 $("#finishAmount").html("¥"+resultData.data.finishAmount);
    //             }
    //         }
    //         return false;
    //     },
    //     complete: function () {
    //     }
    // });

});