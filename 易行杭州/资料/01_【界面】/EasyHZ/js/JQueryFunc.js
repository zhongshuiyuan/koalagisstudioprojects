
$(document).ready(function () {
    //����toolbar��bottombar�ĸ߶�����resultPanel�߶�
    $(".func_panel").css("height", document.body.clientHeight - /*�����͵ײ�*/125 - /*�͵ײ�����һ������*/10 + "px");
    //Ϊ����������onclick�¼�
    $("#busSearch_appbutton").click(
        function () {
            EasyHZ.Util.showPanel("bus_search_panel");
        });
    $("#bicycleSearch_appbutton").click(
        function () {
            EasyHZ.Util.showPanel("bike_search_panel");
        });
    $("#drive_appbutton").click(
        function () {
            EasyHZ.Util.showPanel("car_search_panel");
        });
    $("#tour_appbutton").click(
        function () {
            EasyHZ.Util.showPanel("tour_search_panel");
        });
    $("#shopping_appbutton").click(
        function () {
            EasyHZ.Util.showPanel("shopping_search_panel");
        });
    $("#entertainment_appbutton").click(
        function () {
            EasyHZ.Util.showPanel("entertainment_search_panel");
        });
    $("#food_appbutton").click(
        function () {
            EasyHZ.Util.showPanel("food_search_panel");
        });
    $("#bank_appbutton").click(
        function () {
            EasyHZ.Util.showPanel("bank_search_panel");
        });
    $("#life_appbutton").click(
        function () {
            EasyHZ.Util.showPanel("life_search_panel");
        });
    $("#tourspot_appbutton").click(
        function () {
            EasyHZ.Util.showPanel("tourspot_search_panel");
        });
    $("#hospital_appbutton").click(
        function () {
            EasyHZ.Util.showPanel("hospital_search_panel");
        });

    //Ϊ��帳click�¼�
    $("#bus_search_panel_control").click(
        function () {
            EasyHZ.Util.closePanel("bus_search_panel");
        });
    $("#bike_search_panel_control").click(
        function () {
            EasyHZ.Util.closePanel("bike_search_panel");
        });
    $("#car_search_panel_control").click(
        function () {
            EasyHZ.Util.closePanel("car_search_panel");
        });
    $("#tour_search_panel_control").click(
        function () {
            EasyHZ.Util.closePanel("tour_search_panel");
        });
    $("#shopping_search_panel_control").click(
        function () {
            EasyHZ.Util.closePanel("shopping_search_panel");
        });
    $("#entertainment_search_panel_control").click(
        function () {
            EasyHZ.Util.closePanel("entertainment_search_panel");
        });
    $("#food_search_panel_control").click(
        function () {
            EasyHZ.Util.closePanel("food_search_panel");
        });
    $("#bank_search_panel_control").click(
        function () {
            EasyHZ.Util.closePanel("bank_search_panel");
        });
    $("#life_search_panel_control").click(
        function () {
            EasyHZ.Util.closePanel("life_search_panel");
        });
    $("#tourspot_search_panel_control").click(
        function () {
            EasyHZ.Util.closePanel("tourspot_search_panel");
        });
    $("#hospital_search_panel_control").click(
        function () {
            EasyHZ.Util.closePanel("hospital_search_panel");
        });

    //������ѯ��壺�������˺���·��ѯ�л�
    $("#busTransferText").click(
        function () {
            $("#busTrans_con").css("display", "block");
            $("#busLine_con").css("display", "none");
        });
    $("#busLineText").click(
        function () {
            $("#busLine_con").css("display", "block");
            $("#busTrans_con").css("display", "none");
        });

});

$(document).ready(addOnLoad());
