/*我的钱包*/
var orderList = {
    init: function(){
        this.loadOK = false;
        this.params = {};
        this.initParams();
        //this.common();
        this.searchLayer();
        this.query();
        this.loadMore();
    },
    common: function(){
        var urlParams = "";
        if(window.location.search.substr(1).split("=")[1]) {
            urlParams = JSON.parse(decodeURI(window.location.search.substr(1).split("=")[1]));
            this.params = urlParams;
        }
    },
    initParams: function(){
        this.params.pageNum = 1;
        this.params.pageSize = 10;
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

            _this.resetLayer();
            _this.initParams();
        });
        // 关闭
        $(".top-search .search-body .layer-close").click(function(){
            $("html").css({"overflow": "visible", "height": "auto"});
            $("body").css({"overflow": "visible", "height": "auto"});
            $(".search-body").hide();
        });

        $(".email-status .layer-btn-es").on("click", "a", function(){
            $(this).addClass("on").siblings().removeClass("on");
        });
        $(".check-status .layer-btn-cs").on("click", "a", function(){
            $(this).addClass("on").siblings().removeClass("on");
        });

    },
    // 重置弹层
    resetLayer: function(){
        $(".email-status a").removeClass("on");
        $(".check-status a").removeClass("on");
        $(".search-info input").val("");
    },
    query: function(){
        var _this = this;
        $.ajax({
            url: BASEURL + "/message/list",
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
                    var status = "";
                    // 将 返回数据中每一项下的checkInvoice属性扩展到该项后面
                    mapData.forEach(function (item, index, array) {

                        dataHTML +=
                            "<li>" +
                            "<table >" +
                            "<tr class='standard'>" +
                            "<td style='font-weight:normal;'>"+ item.title + "</td>" +
                            "<td>" + item.firstTypeName + "/"+ item.secondTypeName + "</td>" +
                            "</tr>" +
                            "<tr>" +
                            "<td >" + item.createTime + "</td>" +
                            "</tr>" +
                            "<tr>" +
                            "<td colspan='2'>" + item.content + "</td>" +
                            "</tr>" +
                            "</table>" +
                            "<a href='#' onclick='showDetail("+ item.productId+","+item.productType+")' class='ticket-info'>" +
                            "</a >" +
                            "</li>";
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
    orderList.init();

    if(!$.cookie('Authorization')){
        greenAlertBox("未登录，需登录后查看");
        setTimeout("window.location.href = '../pages/login.html'", 1500);
    }else{
        //点击菜单跳转
        $(".home").click(function () {
            window.location.href = "../pages/home.html";
        });
        $(".user_center").click(function () {
            window.location.href = "../pages/userCenter.html";
        });
        $("#find_product").click(function () {
            window.location.href = "../pages/home.html";
        });
    }
})();

//1-居间 2-承接
function showDetail(id,productType){
    if(productType == 2){
        window.location.href = '../pages/productDetail_2.html?productId='+id;
    }else{
        window.location.href = '../pages/productDetail_1.html?productId='+id;
    }
}