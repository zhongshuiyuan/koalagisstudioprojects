function Bind(instance, method) {
    return function () {
        return method.apply(instance, arguments);
    }
}

var PanelTemplate = {
	Base:{
		width:"260",
		height:"500"
	},
    BusSearch: {
        id:"bus_search_panel",
        title:"公交查询",
		icon:"",
        content:"",
        panel:null
    },
    BikeSearch: {
        id:"bike_search_panel",
        title:"公共自行车",
		icon:"",
        content:"",
        panel:null
    },
    CarSearch: {
        id:"car_search_panel",
        title:"自驾导航",
		icon:"",
        content:"",
        panel:null
    },
    TourSearch: {
        id:"tour_search_panel",
        title:"酒店住宿",
		icon:"",
        content:"",
        panel:null
    },
    ShoppingSearch: {
        id:"shopping_search_panel",
        title:"购物逛街",
		icon:"",
        content:"",
        panel:null
    },
    EntertainmentSearch: {
        id:"entertainment_search_panel",
        title:"休闲娱乐",
		icon:"",
        content:"",
        panel:null
    },
    FoodSearch: {
        id:"food_search_panel",
        title:"餐饮美食",
		icon:"",
        content:"",
        panel:null
    },
    BankSearch: {
        id:"bank_search_panel",
        title:"金融银行",
		icon:"",
        content:"",
        panel:null
    },
    LifeSearch: {
        id:"life_search_panel",
        title:"生活便利",
		icon:"",
        content:"",
        panel:null
    },
    TourSpotSearch: {
        id:"tourspot_search_panel",
        title:"旅游景点",
		icon:"",
        content:"",
        panel:null
    },
    HospitalSearch: {
        id:"hospital_search_panel",
        title:"医疗健康",
		icon:"",
        content:"",
        panel:null
    }
}

var FuncPanel = function (panelname) {
    if (PanelTemplate[panelname] == undefined || PanelTemplate[panelname] == null) {
        alert("未初始化" + panelname + "面板！");
        return;
    }

    PanelTemplate[panelname]["panel"] = this;
    this.id = PanelTemplate[panelname]["id"];
	this.icon = PanelTemplate[panelname]["icon"],
    this.title = PanelTemplate[panelname]["title"];
    this.content = PanelTemplate[panelname]["content"];
	this.width = PanelTemplate["Base"]["width"];
	this.height = PanelTemplate["Base"]["height"];

    this.ini();
}

FuncPanel.prototype = {
    ini: function () { 
        this._createPanel();
        this.set_title(this.title);
        this.set_content(this.content);
        this.set_position(this.defaultPosition);
    },

    _createPanel:function(){
		/*主面板*/
        this.panelEl=document.createElement("div");
        this.panelEl.id=this.id;
        this.panelEl.className="func_panel";
        
        /*icon*/
        this.panelIcon=document.createElement("div");
        this.panelIcon.className="func_panel_icon";
        this.panelIcon.style.background="url("+this.icon+") no-repeat";
        this.panelIcon.id=this.id+"_icon";
        
        /*title*/
        this.panelTitle=document.createElement("div");
        this.panelTitle.className="func_panel_title";
        this.panelTitle.id=this.id+"_title";
        
        this.panelTitleLeft=document.createElement("div");
        this.panelTitleLeft.className="func_panel_title_left";
        this.panelTitleLeft.id=this.id+"_titleleft";
        
        this.panelTitleRight=document.createElement("div");
        this.panelTitleRight.className="func_panel_title_right";
        this.panelTitleRight.id=this.id+"_titleright";
        
        this.panelTitleBg=document.createElement("div");
        this.panelTitleBg.className="func_panel_title_bg";
        this.panelTitleBg.id=this.id+"_titlegb";
        
        this.panelTitle.appendChild(this.panelTitleLeft);
        this.panelTitle.appendChild(this.panelTitleRight);
        this.panelTitle.appendChild(this.panelTitleBg);
        
        /*content*/
        this.panelContent=document.createElement("div");
        this.panelContent.className="func_panel_content";
        this.panelContent.id=this.id+"_content";
        
        this.panelContentLeft=document.createElement("div");
        this.panelContentLeft.className="func_panel_content_left";
        this.panelContentLeft.id=this.id+"_contentleft";
        
        this.panelContentRight=document.createElement("div");
        this.panelContentRight.className="func_panel_content_right";
        this.panelContentRight.id=this.id+"_contentright";
        
        this.panelContentBg=document.createElement("div");
        this.panelContentBg.className="func_panel_content_bg";
        this.panelContentBg.id=this.id+"_contentbg";
        
        /*content text*/
        this.panelContentText=document.createElement("div");
        this.panelContentText.className="func_panel_content_text";
        this.panelContentText.id=this.id+"_contenttext";
        
        this.panelContent.appendChild(this.panelContentLeft);
        this.panelContent.appendChild(this.panelContentRight);
        this.panelContent.appendChild(this.panelContentBg);
        this.panelContentBg.appendChild(this.panelContentText);

        /*foot*/
        this.panelFoot=document.createElement("div");
        this.panelFoot.className="func_panel_foot";
        this.panelFoot.id=this.id+"_foot";
        
        this.panelFootLeft=document.createElement("div");
        this.panelFootLeft.className="func_panel_foot_left";
        this.panelFootLeft.id=this.id+"_footleft";
        
        this.panelFootRight=document.createElement("div");
        this.panelFootRight.className="func_panel_foot_right";
        this.panelFootRight.id=this.id+"_footright";
        
        this.panelFootBg=document.createElement("div");
        this.panelFootBg.className="func_panel_foot_bg";
        this.panelFootBg.id=this.id+"_footbg";
        
        this.panelFoot.appendChild(this.panelFootLeft);
        this.panelFoot.appendChild(this.panelFootRight);
        this.panelFoot.appendChild(this.panelFootBg);
        
        /*sepline*/
        this.panelSepLine=document.createElement("div");
        this.panelSepLine.className="func_panel_sepline";
        this.panelSepLine.id=this.id+"_sepline";
        
        /*title text*/
        this.panelTitleText=document.createElement("div");
        this.panelTitleText.className="func_panel_title_text";
        this.panelTitleText.id=this.id+"_titletext";
        
        /*control*/
        this.panelControl=document.createElement("div");
        this.panelControl.className="func_panel_control";
        this.panelControl.id=this.id+"_control";
        
        this.panelControlClose=document.createElement("a");
        this.panelControlClose.className = "func_panel_control_icon func_panel_close";
        this.panelControlClose.title="关闭";
        this.panelControlClose.onclick=$Bind(this,this.close);
        this.panelControlClose.id=this.id+"_controlclose";
        
        this.panelControlCollapse=document.createElement("a");
        this.panelControlCollapse.className = "func_panel_control_icon func_panel_collapse";
        this.panelControlCollapse.title="折叠";
        this.panelControlCollapse.onclick=$Bind(this,this.collapse);
        this.panelControlCollapse.id=this.id+"_controlcollapse";
        
        this.panelControl.appendChild(this.panelControlClose);
        this.panelControl.appendChild(this.panelControlCollapse);
        
        this.panelEl.appendChild(this.panelTitle);
        this.panelEl.appendChild(this.panelContent);
        this.panelEl.appendChild(this.panelFoot);
        this.panelEl.appendChild(this.panelIcon);
        this.panelEl.appendChild(this.panelSepLine);
        this.panelEl.appendChild(this.panelTitleText);
        this.panelEl.appendChild(this.panelControl);        
        
        this.panelEl.style.width=this.width+"px";
        this.panelEl.style.height=this.height+"px";
        this.panelEl.display="none";
        
        document.body.appendChild(this.panelEl);
    },
	
    show: function (x, y) {
        if (x != null && y != null) this.set_position({ left: x, top: y });
        this.panelEl.style.display = "block";
        this.expand();
    },

    hide: function () {
        this.panelEl.style.display = "none";
    },

    close: function () {
        this.hide();
    },

    set_title: function (text) {
        this.panelTitleText.innerHTML = text;
    },

    set_content: function (html) {
        this.panelContentText.innerHTML = html;
    },

    get_position: function () {
        return [this.panelEl.offsetLeft, this.panelEl.offsetTop];
    }
}