$(function () {
    showFirstType();
});
$(function () {
    $("#apply").click(function () {
        var desc = $("#desc").val();
        var firstType = $("#firstType").val();
        var firstTypeName = $("#firstType").find("option:selected").text();
        var param = {};
        param["desc"] = desc;
        param["typeId"] = firstType;
        param["typeName"] = firstTypeName;

        if (desc=='' || desc==null){
            greenAlertBox("需求信息不允许为空");
            return false
        }
        if (firstType=='' || firstType==null){
            greenAlertBox("请选择项目类型");
            return false
        }

        $.ajax({
            url: BASEURL + "/user/require/save",
            data: JSON.stringify(param),
            type: "post",
            dataType: "json",
            contentType: "application/json",
            success: function(result) {
                if (result.returnCode == "200") {
                    greenAlertBox("提交成功，请等待审核！");
                    window.location.href = '../pages/myOrder.html';
                }
            }
        })
    });
});

function showFirstType() {
    $.ajax({
        url: BASEURL + "/user/type/first" ,
        type: "get",
        success: function (resultData) {
            if (resultData.returnCode == 200) {
                var list = resultData.data;
                var tbody = "<option value=\"\">请选择</option>";
                for (var i = 0; i < list.length; i++) {
                    var content = list[i];
                    tbody += "<option value=" + content.id + ">" + content.typeName + "</option>";
                }
                $("#firstType").html(tbody);
            }
        }
    });
}