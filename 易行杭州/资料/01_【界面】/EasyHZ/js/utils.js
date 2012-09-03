function Utils(){}
//将xml字符串转换为dom对象
Utils.stringToXml = function(str){
    var xmlDoc;
    if (window.ActiveXObject) { // IE
        try {
            xmlDoc = new ActiveXObject("Microsoft.XMLDOM");
            if(!xmlDoc){
                xmlDoc = new ActiveXObject("MSXML2.DOMDocument.3.0");
            }
            
            xmlDoc.loadXML(str);
        } catch(e){
        }
    }else
        if(window.XMLHttpRequest) { //firefox
            var oParser = new DOMParser();
            xmlDoc = oParser.parseFromString(str,"text/xml");
            if (xmlDoc.documentElement.tagName == "parsererror") {
                var oSerializer = new XMLSerializer();
            }
        }
    
    return xmlDoc;
}

//读取xml文件
Utils.loadXML=function(url){
    var obj = null;
    if(navigator.appName.charAt(0) == "M") {
        obj =  new ActiveXObject('Microsoft.XMLDOM');
        obj.async = false;
        obj.onreadystatechange = function() {
        if(obj.readyState==4) {
         //callback(obj);
        }
    }
    obj.load(url);
    } else {
        obj = document.implementation.createDocument("", "", null);
        obj.async = false;
        obj.onload = function() {
          //callback(obj);
    }
    obj.load(url);
    }
    return obj;
}

Utils.createXMLHttp=function(){
    var req=null;
	if(window.XMLHttpRequest) 
	{
		try
		{ 
			req = new XMLHttpRequest();
		} 
		catch(e) 
		{ 
			req = false; 
		}
	}
	else if(window.ActiveXObject) 
	{
		try 
		{ 
			req = new ActiveXObject('Msxml2.XMLHTTP');
    		} 
    		catch(e) 
    		{
    			try 
    			{ req = new ActiveXObject('Microsoft.XMLHTTP');} 
    			catch(e) { req = false; }
  		} 
  	}
	return req; 
}

Utils.trimString = function(str){
    str = str +"";
    
    return str.replace(/(^\s*)|(\s*$)/g, "");
}

String.prototype.trim=function(){
    return this.replace(/(^\s*)|(\s*$)/g, "");
}

Utils.pad = function(tbl) {
    return function(num, n){
        return (0 >= (n - ''+num.length)) ? num : (tbl[n] || (tbl[n] = Array(n + 1).join(0)))+num;
    }    
}([]);

function randomColor( ) {//随机生成颜色
    var rand = Math.floor(Math.random( ) * 0xFFFFFF).toString(16);
    if(rand.length == 6){
        return rand;
    }else{
        return randomColor();
    }
}

function callColorDlg(offsetHeight,offsetLeft){
    if(offsetHeight&&offsetLeft){
        dlgHelper.style.top=offsetHeight;
        dlgHelper.style.left=offsetLeft;
    }
    var  sColor;
    sColor= dlgHelper.ChooseColorDlg();     
    sColor = sColor.toString(16);       
    if(sColor.length < 6){       
        var  sTempString = "000000".substring(0,6-sColor.length);       
        sColor =sTempString.concat(sColor);       
    }       
    return sColor ;      
}

function LongToRGB(ColorStr)//颜色格式转换   
{ 
  var colorArr=[];
  var Red=parseInt("0x"+ColorStr.substr(1,2));   
  var Green=parseInt("0x"+ColorStr.substr(3,2));   
  var Blue=parseInt("0x"+ColorStr.substr(5,2)); 
  colorArr.push(Red);
  colorArr.push(Green);
  colorArr.push(Blue);
  return colorArr;   
} 


function toHexColor(r,g,b){  
    var hex='#';  
    var hexStr = '0123456789ABCDEF';  
    low = r % 16;  
    high = (r - low)/16;  
    hex+=hexStr.charAt(high) + hexStr.charAt(low);  
    low = g % 16;  
    high = (g - low)/16;  
    hex+=hexStr.charAt(high) + hexStr.charAt(low); 
    low = b % 16;  
    high = (b - low)/16;  
    hex+=hexStr.charAt(high) + hexStr.charAt(low);  
    return hex;  
}  

/*UUID.js 合并*/
//**生成GUID唯一码
function UUID(){
    this.id = this.createUUID();
}

UUID.prototype.valueOf = function(){ return this.id; }
UUID.prototype.toString = function(){ return this.id; }

UUID.prototype.createUUID = function(){

	var dg = new Date(1582, 10, 15, 0, 0, 0, 0);
	var dc = new Date();
	var t = dc.getTime() - dg.getTime();
	var h = '-';
	var tl = UUID.getIntegerBits(t,0,31);
	var tm = UUID.getIntegerBits(t,32,47);
	var thv = UUID.getIntegerBits(t,48,59) + '1'; // version 1, security version is 2
	var csar = UUID.getIntegerBits(UUID.rand(4095),0,7);
	var csl = UUID.getIntegerBits(UUID.rand(4095),0,7);

	var n = UUID.getIntegerBits(UUID.rand(8191),0,7) + 
			UUID.getIntegerBits(UUID.rand(8191),8,15) + 
			UUID.getIntegerBits(UUID.rand(8191),0,7) + 
			UUID.getIntegerBits(UUID.rand(8191),8,15) + 
			UUID.getIntegerBits(UUID.rand(8191),0,15); // this last number is two octets long
	return tl + h + tm + h + thv + h + csar + csl + h + n; 
}

UUID.getIntegerBits = function(val,start,end){
	var base16 = UUID.returnBase(val,16);
	var quadArray = new Array();
	var quadString = '';
	var i = 0;
	for(i=0;i<base16.length;i++){
		quadArray.push(base16.substring(i,i+1));	
	}
	for(i=Math.floor(start/4);i<=Math.floor(end/4);i++){
		if(!quadArray[i] || quadArray[i] == '') quadString += '0';
		else quadString += quadArray[i];
	}
	return quadString;
}

UUID.returnBase = function(number, base){

	var convert = ['0','1','2','3','4','5','6','7','8','9','A','B','C','D','E','F','G','H','I','J','K','L','M','N','O','P','Q','R','S','T','U','V','W','X','Y','Z'];
    if (number < base) var output = convert[number];
    else {
        var MSD = '' + Math.floor(number / base);
        var LSD = number - MSD*base;
        if (MSD >= base) var output = this.returnBase(MSD,base) + convert[LSD];
        else var output = convert[MSD] + convert[LSD];
    }
    return output;
}

UUID.rand = function(max){
	return Math.floor(Math.random() * max);
}

/*g2w 合并*/
//geometry转wkt
/*WKT类型
ST_Point 

ST_LineString 

ST_Polygon 

ST_MultiPoint 

ST_MultiLineString 

ST_MultiPolygon 
*/
function GeometryToWKT(){}

GeometryToWKT.prototype.write=function(geometry){
    var wkt="";
    var wkt=new Array();
    switch(geometry.type){
        case "point": 
            wkt.push("POINT(");
            wkt=this.AppendCoordinate(geometry,wkt);
            wkt.push(")");
            break;
        case "extent":
            wkt.push("POLYGON((");
            wkt=this.AppendExtentText(geometry,wkt);
            wkt.push("))");
            break;
        case "polyline":
            wkt.push("LINESTRING(");
            wkt=this.AppendLineStringText(geometry,wkt);
            wkt.push(")");
            break;
        case "polygon":
            wkt.push("POLYGON((");
            wkt=this.AppendPolygonText(geometry,wkt);
            wkt.push("))");
            break;
        default:
            wkt="";
    }
    wkt=wkt.join("");
    return wkt;
};

GeometryToWKT.prototype.AppendCoordinate=function(geometry,wkt){
    wkt.push(geometry.x);
    wkt.push(" ");
    wkt.push(geometry.y);
    return wkt;
};

GeometryToWKT.prototype.AppendExtentText=function(geometry,wkt){
    wkt.push(geometry.xmin);
    wkt.push(" ");
    wkt.push(geometry.ymin);
    wkt.push(",");
    wkt.push(geometry.xmax);
    wkt.push(" ");
    wkt.push(geometry.ymin);
    wkt.push(",");
    wkt.push(geometry.xmax);
    wkt.push(" ");
    wkt.push(geometry.ymax);
    wkt.push(",");
    wkt.push(geometry.xmin);
    wkt.push(" ");
    wkt.push(geometry.ymax);
    wkt.push(",");
    wkt.push(geometry.xmin);
    wkt.push(" ");
    wkt.push(geometry.ymin);
    return wkt;
};

GeometryToWKT.prototype.AppendLineStringText=function(geometry,wkt){
    if(geometry.paths.length==1){
        var path=geometry.paths[0];
        for(var i=0;i<path.length;i++){
            wkt.push(path[i][0]);
            wkt.push(" ");
            wkt.push(path[i][1]);
            if(i+1<path.length)
                wkt.push(",");
        }
    }
    return wkt;
}

GeometryToWKT.prototype.AppendPolygonText=function(geometry,wkt){
    if(geometry.rings.length==1){
        var ring=geometry.rings[0];
        for(var i=0;i<ring.length;i++){
            wkt.push(ring[i][0]);
            wkt.push(" ");
            wkt.push(ring[i][1]);
            if(i+1<ring.length)
                wkt.push(",");
        }
    }
    return wkt;
};

//wkt转geometry
function WKTToGeometry(){}

WKTToGeometry.prototype.write=function(type,wkt){
    var geometry=null;
    switch(type){
        case "multiline"://多段线
            var json="{\"paths\":";
            var lineJson=wkt.replace(/\(/g,"[").replace(/\)/g,"]");
            re = /([\d\.]+)\s([\d\.]+)/g;        // 创建正则表达式模式。
            lineJson = lineJson.replace(re, "[$1,$2]");
            json+=lineJson;
            json+=",\"spatialReference\":{\"wkid\":"+map.srsId+"}}";
            json=Eval2Obj(json);
            geometry = new esri.geometry.Polyline(json); 
            break;
        case "line1":
            var json="{\"paths\":[";
            var lineJson=wkt.replace(/\(/g,"[").replace(/\)/g,"]");
            re = /([\d\.]+)\s([\d\.]+)/g;        // 创建正则表达式模式。
            lineJson = lineJson.replace(re, "[$1,$2]");
            json+=lineJson;
            json+="],\"spatialReference\":{\"wkid\":"+map.srsId+"}}";
            json=Eval2Obj(json);
            geometry = new esri.geometry.Polyline(json);
            break;
        case "point1":
            var pointJson=wkt.replace(/\(/g,"[").replace(/\)/g,"]");
            re = /([\d\.]+)\s([\d\.]+)/g;        // 创建正则表达式模式。
            pointJson = pointJson.replace(re, "[$1,$2]");
            pointJson=Eval2Obj(pointJson);
            geometry=new esri.geometry.Point(pointJson[0][0], pointJson[0][1], new esri.SpatialReference({ wkid: map.srsId }));
            break;
        case "polygon1":
            var json="{\"rings\":";
            var lineJson=wkt.replace(/\(/g,"[").replace(/\)/g,"]");
            re = /([\d\.]+)\s([\d\.]+)/g;        // 创建正则表达式模式。
            lineJson = lineJson.replace(re, "[$1,$2]");
            json+=lineJson;
            json+=",\"spatialReference\":{\"wkid\":"+map.srsId+"}}";
            json=Eval2Obj(json);
            geometry = new esri.geometry.Polygon(json);   
            break;
        case "multipolygon1":
            var json="{\"rings\":[";
            var lineJson=wkt.replace(/\(/g,"[").replace(/\)/g,"]");
            re = /([\d\.]+)\s([\d\.]+)/g;        // 创建正则表达式模式。
            lineJson = lineJson.replace(re, "[$1,$2]");
            json+=lineJson;
            json+="],\"spatialReference\":{\"wkid\":"+map.srsId+"}}";
            json=Eval2Obj(json);
            geometry = new esri.geometry.Polygon(json);   
            break;
        default:
            geometry=null;
    }
    return geometry;
};



function includeJsScript(src) {
    HTMLCode = '<script language="javascript" src="' + src + '"></script>';
    document.write(HTMLCode);
}

function includeVbScript(src) {
    HTMLCode = '<script language="vbscript" src="' + src + '"></script>';
    document.write(HTMLCode);
}


function abspath() {
    var abspath = "";
    try {
        abspath = unescape(window.location.href);
    }
    catch (e) {
        abspath = unescape(this.__location);
    }
    // Remove query String 
    var index = abspath.indexOf("?");
    if (index > 0) abspath = abspath.substr(0, index - 1);

    index = abspath.lastIndexOf("/");
    var index2 = abspath.lastIndexOf("\\");

    index = (index > index2) ? index : index2;
    if (index <= 0) return abspath;

    abspath = abspath.substring(0, index);

    if (abspath.substring(0, 1) == "/") abspath = abspath.slice(1);

    var re = /file:\/\/\//gi;
    if (abspath.match(re) != null) abspath = abspath.replace(re, ""); // if this is indeed a local file, we strip the "file://" prefix from it.    

    return (abspath);
}

var basePath = abspath();