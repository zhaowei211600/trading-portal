var typeId = '';
var isFollow = false;
var productList = {
    init: function(){
        this.loadOK = false;
        this.params = {};
        this.initParams();
        this.common();
        this.searchLayer();
        this.query();
        this.loadMore();
        checkProduct(typeId);

    },
    initParams: function(){
        this.params.pageNum = 1;
        this.params.pageSize = 10;
        this.params.status = 1;
        //this.params.sendStatus = "";
        this.params.firstType = "";
        this.params.productName = "";
        //this.params.invoiceCode = "";
        //this.params.invoiceNumber = "";
    },
    common: function(){
        var urlParams = "";
        if(window.location.search.substr(1).split("=")[1]) {
            urlParams = JSON.parse(decodeURI(window.location.search.substr(1).split("=")[1]));
            this.params.firstType = urlParams;
            typeId = urlParams;
        }
    },
    // 弹层
    searchLayer: function(){
        var _this = this;
        // 打开
        $(".top-search .search-bar .s-btn").click(function(){
            $(".search-body").show();
            // 禁止页面滚动（解决苹果下 小键盘出现 输入数据时导致的一些问题）
            $("html").css({"overflow": "hidden", "height": "100%"});
            $("body").css({"overflow": "hidden", "height": "100%"});

            //_this.resetLayer();
            _this.initParams();
        });
        // 关闭
        $(".top-search .search-body .layer-close").click(function(){
            $("html").css({"overflow": "visible", "height": "auto"});
            $("body").css({"overflow": "visible", "height": "auto"});
            $(".search-body").hide();
        });

        /*$(".email-status .layer-btn-es").on("click", "a", function(){
            $(this).addClass("on").siblings().removeClass("on");
        });*/
        $(".check-status .layer-btn-cs").on("click", "a", function(){
            $(this).addClass("on").siblings().removeClass("on");
        });

        // 重置
        $(".reset").click(function () {
            _this.resetLayer();
        });

        // 确认
        $(".submit").click(function(){
            //_this.params.sendStatus = $(".email-status .layer-btn-es a").hasClass("on") ? $(".email-status .layer-btn-es .on").attr("data-sendStatus") : "";
            _this.params.firstType = $(".check-status .layer-btn-cs a").hasClass("on") ? $(".check-status .layer-btn-cs .on").attr("data-checkResult") : "";
            _this.params.productName = $(".search-info .productName").val();
            //_this.params.invoiceCode = $(".search-info .invoiceCode").val();
            //_this.params.invoiceNumber = $(".search-info .invoiceNumber").val();

            $(".content-body ul").html("");
            checkProduct(_this.params.firstType);
            _this.query();
            $("html").css({"overflow": "visible", "height": "auto"});
            $("body").css({"overflow": "visible", "height": "auto"});
            $(".search-body").hide();
        });
    },
    // 重置弹层
    resetLayer: function(){
        //$(".email-status a").removeClass("on");
        $(".check-status a").removeClass("on");
        $(".search-info input").val("");
    },
    query: function(){

        var _this = this;
        $.ajax({
            url: BASEURL + "/product/list",
            data: JSON.stringify(_this.params),
            type: "post",
            dataType: "json",
            contentType: "application/json",
            success: function(data) {
                var mapData = [];
                if (data.returnCode == "200") {
                    mapData = data.data;
                    $(".monitor-footer .f1 .totals").text(data.total);
                    $(".content-wrap .content-body").show();
                    $(".content-wrap .data-empty").hide();
                    var dataHTML = "";
                    // 将 返回数据中每一项下的checkInvoice属性扩展到该项后面
                    mapData.forEach(function (item, index, array) {
                        var productType = '';
                        var auditStatus = '';
                        if(item.productType == '1'){
                            productType = '买方';
                        }else{
                            productType = '卖方';
                        }
                        if(item.auditStatus == '1'){
                            auditStatus = '已认证';
                        }else if(item.auditStatus == '2'){
                            auditStatus = '未认证';
                        }
                        var descImg = '';
                        if(item.descImg){
                            descImg = '/images/'+ item.descImg;
                        }
                        dataHTML +=
                            "<li style=\"margin-bottom: 10px;margin-top: 0;padding: 10px 15px;border: none;background: white;display: flex;flex-direction: row;\" onclick='showDetail("+item.id+","+item.productType+")'>" +
                            "<div>" +
                            "    <img style=\"width: 95px;height: 80px;\" src=\""+descImg+"\"/>\n" +
                            "</div>"+
                            "                <div style='margin-left: 15px;flex: 1;'>" +
                            "                    <div style=\"font-size: 16px;\">" +
                            "                        <span>"+item.name+"</span>" +
                            "                    </div>" +
                            "                    <div style=\"padding-top: 5px;\">" +
                            "                        <span style=\"color: red;\">￥"+item.budget+"</span>" +
                            "                    </div>" +
                            "                    <div style=\"padding-top: 5px;color: #999999;\">\n" + item.createTime +
                            "                        <span style='color: #999999;margin-left:40px;'>"+auditStatus+"</span>" +
                            "                           <span style=\"font-size: 12px;color: #999999;margin-left:40px;\">"+productType+"</span>"+
                            "                    </div>" +
                            "                    <div style=\"padding-top: 5px;color: #999999;\">" + item.area + "</div>" +
                            "                </div>" +
                            "            </li>";
                    });
                    $(".content-body ul").append(dataHTML);
                    if($(".content-body ul").children().length < data.total){
                        $(".load-more").text("加载更多");
                        _this.loadOK = true;
                    }else{
                        $(".load-more").text("没有更多");
                    }
                };
                if(mapData.length <= 0 && $(".content-body ul").children().length<=0 ){
                    $(".content-wrap .content-body").hide();
                    $(".content-wrap .data-empty").show();
                }
            }
        })
    },
    loadMore: function(){
        var _this = this;
        $(window).scroll(function(){
            if(_this.loadOK && ($(this).scrollTop() + $(this).height()) >= $(".load-more").offset().top){
                _this.loadOK = false;

                _this.params.pageNum ++;
                _this.query();
            }
        });
    }
};

+(function(){
    productList.init();
    showFirstType(typeId);
    /*if(!$.cookie('Authorization')){
        greenAlertBox("未登录，需登录后查看");
        setTimeout("window.location.href = '../pages/login.html'", 1500);
    }else{

    }*/
})();

//1-居间 2-承接
function showDetail(id,productType){
    if(productType == 2){
        window.location.href = '../pages/productDetail_2.html?productId='+id;
    }else{
        window.location.href = '../pages/productDetail_1.html?productId='+id;
    }
}

function showFirstType(typeId) {
    $.ajax({
        url: BASEURL + "/user/type/first" ,
        type: "get",
        success: function (resultData) {
            if (resultData.returnCode == 200) {
                var list = resultData.data;
                var tbody = "";
                for (var i = 0; i < list.length; i++) {
                    var content = list[i];
                    if(content.id == typeId){
                        tbody += "<a href=\"javascript:void(0);\" class=\"check-ok on\" data-checkResult=\""+content.id+"\">"+content.typeName+"</a>\n";
                    }else{
                        tbody += "<a href=\"javascript:void(0);\" class=\"check-ok\" data-checkResult=\""+content.id+"\">"+content.typeName+"</a>\n";
                    }
                }
                $("#typeList").html(tbody);
            }
        }
    });
}

function checkProduct(typeId) {
    if($.cookie('Authorization')){
        $.ajax({
            url: BASEURL + "/follow/check" ,
            data: {'typeId':typeId},
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
    var typeId = $(".check-status .layer-btn-cs a").hasClass("on") ? $(".check-status .layer-btn-cs .on").attr("data-checkResult") : "";
    var followType = 1;
    if(isFollow){
        followType = 2;
    }
    if($.cookie('Authorization')){
        $.ajax({
            url: BASEURL + "/follow" ,
            data: {'typeId':typeId,'followType':followType},
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