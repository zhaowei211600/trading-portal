var productList = {
    init: function(){
        this.loadOK = false;
        this.params = {};
        this.initParams();
        this.common();
        this.searchLayer();
        this.query();
        this.loadMore();
    },
    initParams: function(){
        this.params.page = 1;
        this.params.pageSize = 10;
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

        // 重置
        $(".reset").click(_this.resetLayer);

        // 确认
        $(".submit").click(function(){
            //_this.params.sendStatus = $(".email-status .layer-btn-es a").hasClass("on") ? $(".email-status .layer-btn-es .on").attr("data-sendStatus") : "";
            _this.params.firstType = $(".check-status .layer-btn-cs a").hasClass("on") ? $(".check-status .layer-btn-cs .on").attr("data-checkResult") : "";
            _this.params.productName = $(".search-info .productName").val();
            //_this.params.invoiceCode = $(".search-info .invoiceCode").val();
            //_this.params.invoiceNumber = $(".search-info .invoiceNumber").val();

            $(".content-body ul").html("");

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
                        if(item.productType == '1'){
                            productType = '买方';
                        }else{
                            productType = '卖方';
                        }
                        dataHTML +=
                            "<li style=\"margin-bottom: 10px;margin-top: 0;padding: 10px 15px;border: none;background: white;\" " +
                            "   onclick='showDetail("+item.id+","+item.productType+")'>" +
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

                _this.params.page ++;
                _this.query();
            }
        });
    }
};

+(function(){
    productList.init();
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
                for (var i = 0; i < list.length; i++) {
                    var content = list[i];
                    tbody += "<a href=\"javascript:void(0);\" class=\"check-ok\" data-checkResult=\""+content.id+"\">"+content.typeName+"</a>\n";
                }
                $("#typeList").html(tbody);
            }
        }
    });
}