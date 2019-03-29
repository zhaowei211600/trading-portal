//点击事件
$(function () {

        $("#aboutUs").click(function () {
            window.location.href = "../pages/aboutUs.html";
            //greenAlertBox('正在开发中...')
            return false
        });
        $("#changePassword").click(function () {
            window.location.href = "../pages/changePassword.html";
        });
        $(".wrap-btn-quit").click(function () {
            loadingBlue()
            exitSystem();
        });
});

/*我的钱包*/
var walletList = {
    init: function(){
        this.loadOK = false;
        this.params = {};
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
        //只显示待接单
        _this.params.status = 1;
        $.ajax({
            url: BASEURL + "/product/home",
            type: "get",
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
                        if(item.productType == '1'){
                            productType = '买方';
                        }else{
                            productType = '卖方';
                        }
                        dataHTML +=
                            "<li style=\"margin-bottom: 10px;margin-top: 0;padding: 10px 15px;border: none;background: white;\" onclick='showDetail("+item.id+","+item.productType+")'>" +
                            "                <div>" +
                            "                    <div style=\"font-size: 16px;\">" +
                            "                        <span>"+item.name+"</span>" +
                            "                    </div>" +
                            "                    <div style=\"padding-top: 5px;\">" +
                            "                        预算：<span style=\"color: red;\">￥"+item.budget+"</span>" +
                            "                    </div>" +
                            "                    <div style=\"padding-top: 5px;color: #999999;\">\n" + item.createTime +
                            "                           <span style=\"font-size: 12px;color: #999999;float: right;\">"+productType+"</span>"+
                            "                    </div>" +
                            "                    <div style=\"padding-top: 5px;color: #999999;\">" + item.area + "</div>" +
                            "                </div>" +
                            "            </li>";
                    });
                    $(".content-body ul").append(dataHTML);
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

                _this.params.page ++;
                _this.query();
            }
        });
    }
};

+(function(){
    walletList.init();
    showFirstType();
})();

//1-居间 2-承接
function showDetail(id,productType){
    if(productType == 2){
        window.location.href = '../pages/productDetail_2.html?productId='+id;
    }else{
        window.location.href = '../pages/productDetail_1.html?productId='+id;
    }
}

function showFirstType() {
    $.ajax({
        url: BASEURL + "/user/type/first" ,
        type: "get",
        success: function (resultData) {
            if (resultData.returnCode == 200) {
                var list = resultData.data;
                var tbody = "";
                for (var i = 0; (i < list.length && i<5); i++) {
                    var content = list[i];
                    tbody += "<div onclick=\"gotoList("+content.id+")\">" +
                        "            <div class=\"content-item\">" +
                        "                <div>"+content.typeName+"</div>" +
                        "            </div>" +
                        "        </div>";
                }
                $("#productItem").html(tbody);
            }
        }
    });
}

function gotoList(firstType) {
    window.location.href = '../pages/productList.html?firstType='+firstType;
}

