
$(document).ready(function () {
    //Ϊ����������onclick�¼�
    $("#busSearch_appbutton").click(
        function () {
            KoalaGIS.EASYHZ.Util.showPanel("BusSearch");
        });
    $("#drive_appbutton").click(
        function () {
            KoalaGIS.EASYHZ.Util.showPanel("CarSearch");
        });
    $("#tour_appbutton").click(
        function () {
            KoalaGIS.EASYHZ.Util.showPanel("TourSearch");
        });
    $("#shopping_appbutton").click(
        function () {
            KoalaGIS.EASYHZ.Util.showPanel("ShoppingSearch");
        });
    $("#entertainment_appbutton").click(
        function () {
            KoalaGIS.EASYHZ.Util.showPanel("EntertainmentSearch");
        });
    $("#food_appbutton").click(
        function () {
            KoalaGIS.EASYHZ.Util.showPanel("FoodSearch");
        });
    $("#bank_appbutton").click(
        function () {
            KoalaGIS.EASYHZ.Util.showPanel("BankSearch");
        });
    $("#life_appbutton").click(
        function () {
            KoalaGIS.EASYHZ.Util.showPanel("LifeSearch");
        });
    $("#tourspot_appbutton").click(
        function () {
            KoalaGIS.EASYHZ.Util.showPanel("TourSpotSearch");
        });
    $("#hospital_appbutton").click(
        function () {
            KoalaGIS.EASYHZ.Util.showPanel("HospitalSearch");
        });

    //Ϊ��帳click�¼�
    $("#bus_search_panel_control").click(
        function () {
            KoalaGIS.EASYHZ.Util.closePanel("BusSearch");
        });
    $("#car_search_panel_control").click(
        function () {
            KoalaGIS.EASYHZ.Util.closePanel("CarSearch");
        });
    $("#tour_search_panel_control").click(
        function () {
            KoalaGIS.EASYHZ.Util.closePanel("TourSearch");
        });
    $("#shopping_search_panel_control").click(
        function () {
            KoalaGIS.EASYHZ.Util.closePanel("ShoppingSearch");
        });
    $("#entertainment_search_panel_control").click(
        function () {
            KoalaGIS.EASYHZ.Util.closePanel("EntertainmentSearch");
        });
    $("#food_search_panel_control").click(
        function () {
            KoalaGIS.EASYHZ.Util.closePanel("FoodSearch");
        });
    $("#bank_search_panel_control").click(
        function () {
            KoalaGIS.EASYHZ.Util.closePanel("BankSearch");
        });
    $("#life_search_panel_control").click(
        function () {
            KoalaGIS.EASYHZ.Util.closePanel("LifeSearch");
        });
    $("#tourspot_search_panel_control").click(
        function () {
            KoalaGIS.EASYHZ.Util.closePanel("TourSpotSearch");
        });
    $("#hospital_search_panel_control").click(
        function () {
            KoalaGIS.EASYHZ.Util.closePanel("HospitalSearch");
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
