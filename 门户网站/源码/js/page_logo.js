/**
 * Created by 腾讯互联.
 * User: jinjingcao
 * Date: 11-9-2
 * Time: 下午9:08
 * To change this template use File | Settings | File Templates.
 */

//*************************Global********************************//
siDomain='qzonestyle.gtimg.cn';
imgcacheDomain='qzs.qq.com';
g_Base_Domain='base.s7.qzone.qq.com';
g_Main_Domain='users.qzone.qq.com';
g_W_Domain='w.qzone.qq.com';
g_R_Domain='r.qzone.qq.com';
g_My_Main_Domain='users.qzone.qq.com';
g_Music_Domain='qzone-music.qq.com';
g_My_Music_Domain='qzone-music.qq.com';
g_Photo_Domain='photo.qq.com';
g_Static_Photo_Domain='p5.photo.qq.com';
g_MsgBoard_Domain='m.qzone.qq.com';
g_Ic_Domain='ic.s7.qzone.qq.com';
g_Emotion_Domain='e.qzone.qq.com';
g_NewBlog_Domain='b.qzone.qq.com';
g_Statistic_Domain='g.qzone.qq.com';
g_Src_Domain='u.s7.qzone.qq.com';
iiDomain='i.gtimg.cn';

//*************************越狱..********************************//
(function(){
	QZFL.JSONGetter.prototype.checkResponse = QZFL.FormSender.prototype.checkResponse = function(resp) {//debugger
		var ret, retCode = resp.ret, fun;
		if(fun = this[retCode] || arguments.callee[retCode]) {
			ret = fun(resp);
		} else {
			ret = !~~retCode;
		}
		return ret;
	};

	QZFL.JSONGetter.prototype.checkResponse["-20"] = QZFL.FormSender.prototype.checkResponse["-20"] = function(dt) {
//		alert(dt);
		QZFL.object.each(QZFL.dialog.items, function(itm){
			itm&&itm.unload();
		});

		V.login.show();
		return false;
	};
})();

//*************************工具********************************//
$QC = QQ_Connect = function() {
	var Console = function() {
		var parse = function(o) {
			o=o||"[EMPTY]";
			return typeof o == "object"
				? (function(){
					var ret = [];
					for(var i in o){
						ret.push([i,o[i]].join(":"));
					}
					return ret.join(", ");
				})() : o+"";
		};

		return {
			log : function(o, lbl) {
				window.console && console.log("\t"+(lbl||"")+" -> "+parse(o));
			},
			info : function(o, lbl) {
				window.console && console.info("\t"+(lbl||"")+" -> "+parse(o));
			},
			warn : function(o, lbl) {
				window.console && console.warn("\t"+(lbl||"")+" -> "+parse(o));
			},
			error : function(o, lbl) {
				window.console && console.error("\t"+(lbl||"")+" -> "+parse(o));
			}
		}
	}();

	var Toolkit = function() {
		var _getParam = function(F, para) {
			para = para||document.location.search;
			var E="[?&# ]+"+F+"=([^(&)]*)[&]?";
			var A=new RegExp(E);
			return (A.test(para)) ? RegExp["$1"]||"" : "";//{try{return decodeURIComponent(RegExp["$1"])}catch(D){return RegExp["$1"]}}else{return""}
		};

		/**
		 * 不要再构造函数传递参数
		 * @param _Cld
		 * @param _Prt
		 */
		var extend = function(_Cld, _Prt) {
			_Cld.prototype = new _Prt();
			_Cld.prototype.constructor = _Cld;
		};

		return {
			getQuery : function(F) {
				return _getParam(F, location.search);
			},
			getHash : function(F) {
				var h = location.href;
				return _getParam(F, h.substr(h.indexOf("#")));
			},

			extend : extend
		}
	}();

	var Dialog = function() {
		var dialogs = [];

		return {
			create : function(t, c, w, h) {
				if(dialogs.length) return;
				var dlg,msk;
				msk=QZFL.maskLayout.create();
				dlg=QZFL.dialog.create(t, c, w, h);
				dlg.onUnload = function() {
					QZFL.maskLayout.remove(msk);
					dlg.$onUnload && dlg.$onUnload();
					dialogs.pop();
				};
				dialogs.push(dlg);
				return dlg;
			},
			confirm : function() {
				var dlg = dialogs[0];
				if(dlg&&dlg.onConfirm) {
					dlg.onConfirm();
				}
			},
			close : function() {
				var dlg = dialogs[0];
				if(dlg&&dlg.onConfirm) {
					dlg.unload();
					QZFL.maskLayout.remove();
				}
			},
			get : function() {
				return dialogs[0];
			}
		}
	}();

	var Input = function(){
		var placeHolderSupport = function() {
			return arguments.callee._support != undefined ? arguments.callee._support : arguments.callee._support = 'placeholder' in document.createElement('input')
		};

		var bindPlaceHolder = function() {
			function pc_focus(){
				var evt = QZFL.event.getTarget();
				if(!evt.value || evt.value==evt.getAttribute("placeholder")) {
					evt.value = "";
					QZFL.css.addClassName(evt, "input_text_click");
				}
			}
			function pc_blur(){
				var evt = QZFL.event.getTarget();
				if(!evt.value) {
					evt.value = evt.getAttribute("placeholder");
					QZFL.css.removeClassName(evt, "input_text_click");
				}

			}
			function getVal() {
				var v = QZFL.string.trim(this.value),
					pc = this.getAttribute("placeholder");
				return v==pc?"":v;
			}

			function doBind(ipts) {
				for(var i=0, dom, ph;i<ipts.length;i++) {
					dom = ipts[i], ph = dom.getAttribute("placeholder");
					dom.getValue = getVal;
					if(ph) {
						if(!placeHolderSupport()) {
							QZFL.event.addEvent(dom, "focus", pc_focus);
							QZFL.event.addEvent(dom, "blur", pc_blur);
							if(!dom.value){
								dom.value = ph;
							}
						}
					}
				}
			}

			function retFun(_docScope){
				_docScope = _docScope||document;
				var ipts = _docScope.getElementsByTagName("input");
				doBind(ipts);
				ipts = _docScope.getElementsByTagName("textarea");
				doBind(ipts);
			}
			retFun.bind = function(ipt) {
				doBind([ipt]);
			};

			return retFun;
		}();

		var bindMaxLength = function(dom, maxLen) {
			if(!dom.getAttribute("_maxLenBinded")){
				if(~~maxLen) {dom.setAttribute("maxLength", maxLen)}
				QZFL.event.addEvent(dom, "keydown", bindMaxLength.fire);
				QZFL.event.addEvent(dom, "paste", bindMaxLength.fire);
			}
		};
		bindMaxLength.fire = function() {
			var dom, evt;
			if(dom=QZFL.event.getTarget(), evt=QZFL.event.getEvent()) {
				var maxLen = dom.getAttribute("maxLength");
//				console.log(evt.keyCode)
				if(
						QZFL.string.getRealLen(dom.value)>=maxLen
						&& (arguments.callee.checkNotAvaliable(evt.keyCode))
					) {//删除、回退等操作符的length总为0
					QZFL.event.preventDefault();
				}else if(evt.type=="paste"){
					setTimeout(function(){//paste时间触发的时候，值还没贴进去，要延时截断。。
						dom.value = QZFL.string.cut(dom.value, maxLen);
					},20);
				}
			}
		};
		bindMaxLength.fire.checkNotAvaliable = function(code){
			return code==32 || (code >48 && code<123) || code>=229;
				/*( code==32 //space
						|| code==144 //numlock
						|| code==145	//scrolllock
						|| (code>=48 && code<=123)	//number \ pad | f1-f12
						|| (code>=186 && code<=192)	//symbol
						|| (code>=219 && code <=222) ); //symbol
						====>*/

		};

		return {
			getValue : function(name) {
				var inputs = document.getElementsByName(name),
					ret = [];

				for(var i=0;i<inputs.length;i++) {
					var ipt = inputs[i],type = ipt.type,val = QZFL.string.trim(ipt.value);
					//解决placeholder和空值处理
					if(!placeHolderSupport() && val==ipt.getAttribute("placeholder")) {
						val = "";
					}
					switch(type) {
						case "checkbox":
						case "radio":
								ipt.checked&&ret.push(val);
							break;

						case "text":
						case "select-one":
						default:
								ret.push(val);
							break;
					}
				}

				return ret.join();
			},
			setValue : function(name, value) {
				value==null&&(value="");
				var inputs = document.getElementsByName(name),r;

				for(var i=0;i<inputs.length;i++) {
					var ipt = inputs[i],type = ipt.type;
					switch(type) {
						case "checkbox":
								r = new RegExp("\\b"+ipt.value+"\\b");
								ipt.checked = r.test(value);
							break;
						case "radio":
								ipt.checked = ipt.value == value;
							break;

						case "text":
						case "select-one":
						default:
								ipt.value = value;
							break;
					}
					//解决placeholder和空值处理
					if(!ipt.value&&!placeHolderSupport() && ipt.getAttribute("placeholder")) {
						ipt.value = ipt.getAttribute("placeholder")||"";
					}
				}
			},
			bindPlaceHolder : bindPlaceHolder,
			bindMaxLength : bindMaxLength
		}
	}();

	return {
		Console : Console,
		Toolkit : Toolkit,
		Dialog : Dialog,
		Input : Input
	}
}();

QQ_Connect.Common = function(){
	return {
		nav : function(u) {
			setTimeout(function(){location.href = u});
		},
		takePartIn : function() {
			if(V.login.getUin()) {
				var loader = new QZFL.JsLoader();
				loader.onload = function(){
					$QC.Mgmt.Developer.getInfo(function() {
						location.href = "http://connect.qq.com/manage/";
					},function(){
						location.href = "http://connect.qq.com/manage/";
						/*$QC.Mgmt.Developer.openPanel*/
					});
				}
				loader.load("http://"+siDomain+"/qzone/connect.qq.com/manage/common.js", null, {charset:"utf-8"});
			}else{
				V.login.show({sUrl:'http://connect.qq.com/manage/'});
			}
		}
	}
}();


//alert("c")


//**********************************************************//
window.V = window.V || {};
V.dialog = V.dialog || (function() {
	function show(title, content, width, height, opt) {
		opt = opt || {};
		var useTween = opt.useTween,noBorder = opt.noBorder,callback = opt.callback;
		var _dialog = QZFL.dialog.create(title, content, width, height, useTween, noBorder);
		var _maskID = QZFL.maskLayout.create();
		_dialog.onUnload = function() {
			if (typeof callback == 'function') {
				callback();
			}
			QZFL.maskLayout.remove(_maskID);
		};
		return _dialog;
	}

	return{show:show};
})();
V.login = V.login || (function() {
	var _RET_HASH = {'SUCCESS':0,'FAIL':1,'CANCEL':2};
	var _dialog = null;
	var _targetWindow = null;
	var _sUrl = '';
	var _appCallback = null;

	function _callback(ret) {
		if (_appCallback) {
			_appCallback(ret);
			if (ret === _RET_HASH['SUCCESS']) {
				_appCallback = null;
				hide();
			}
		} else {
			if (ret === _RET_HASH['SUCCESS']) {
				_targetWindow.location.href = _sUrl;
			} else if (ret === _RET_HASH['FAIL']) {
				hide();
				alert('登录失败');
			}
		}
	}

	function _dialogCallback() {
		if (_appCallback) {
			_appCallback(_RET_HASH['CANCEL']);
		}
	}

	function show(opt) {
		opt = opt || {};
		var _html = '<iframe scrolling="no" style="width: 370px; height: 278px;" frameborder="0" allowtransparency="yes" src="http://qzs.qq.com/qzone/vas/login/jump.html"></iframe>';
		_targetWindow = opt.targetWindow || window;
		_sUrl = opt.sUrl || location.href;
		_appCallback = typeof opt.callback == 'function' ? opt.callback : null;
		_dialog = V.dialog.show('登录', _html, 372, 280, {callback:QZFL.event.bind(this, _dialogCallback)});
	}

	function hide() {
		_dialog.unload();
	}

	function exit(target) {
		QZFL.object.each(['uin','skey','zzpaneluin','zzpanelkey'], function(value) {
			QZFL.cookie.set(value, '');
		});
		target ? window.location.href = target : window.location.reload();
	}

	function resize(w, h) {
		if (_dialog) {
			_dialog.setSize(w, h);
		}
	}

	function getUin() {
		var uin = QZFL.cookie.get('uin') || QZFL.cookie.get('zzpaneluin');
		if (uin.length > 4) {
			return+uin.replace(/o(\d+)/g, '$1');
		}
		return 0;
	}

	function getUinsInfo(uins, callback) {
		var _url = 'http://r.qzone.qq.com/fcg-bin/cgi_get_score.fcg?mask=4&uins=';
		var g = new QZFL.JSONGetter(_url + uins.join(','), Math.random().toString(), null);
		g.onSuccess = function(o) {
			callback(o);
		};
		g.onError = function() {
			return;
		};
		g.send('portraitCallBack');
	}

	function call(opt) {
		var callback;
		opt = opt || {};
		if (getUin()) {
			opt.callback && opt.callback();
			return;
		}
		if (opt.callback) {
			callback = opt.callback;
			opt.callback = function(ret) {
				if (ret == _RET_HASH['SUCCESS']) {
					callback();
					opt.onLoginSuccess && opt.onLoginSuccess();
				} else if (ret == _RET_HASH['CANCEL']) {
					opt.onLoginCancel && opt.onLoginCancel();
				} else {
					opt.onLoginFail && opt.onLoginFail();
				}
			};
		}
		show(opt);
	}

	return{_callback:_callback,RET_HASH:_RET_HASH,show:show,hide:hide,exit:exit,resize:resize,getUin:getUin,getUinsInfo:getUinsInfo,call:call}
})();

//常用正则
$QC.Reg = function(){
	return {
		domain : /^http(s)?:\/\/[\w-]+(\.[\w-]+)+\/?$/i,
		ip : /^http(s)?:\/\/\d+(\.\d+){3}$/,
		ipCallback : /\b\d+(\.\d+){3}\b/,
		callback : /^([\w-]+(\.[\w-]+)+)+(\s*;\s*[\w-]+(\.[\w-]+)+)*$/,///^http(s)?:\/\/[\w-]+(\.[\w-]+)+\/?$/i,
		url : /^http(s)*:\/\/[0-9A-Za-z\-_]+(\.[0-9A-Za-z\-_]+)+(\/[0-9A-Za-z\-_\.%\?&=]+)*\/?$/
	}
}();

$QC.Dict = function() {
	function exchangeKeyValue(obj) {
		var ret = {};
		for(var i in obj) {
			ret[obj[i]] = i;
		}
		return ret;
	}

	//所属平台字典映射关系
	var _mobile_platform_type={
		"1":"iPhone",
		"2":"Android",
		"3":"BlackBerry",
		"4":"Windows Phone",
		"5":"Symbian",
		"6":"WebOS",
		"99":"Other"
	};

	return {
		"mobile_platform_type_key":_mobile_platform_type,
		"mobile_platform_type_value":exchangeKeyValue(_mobile_platform_type)
	}
}();

//**********************************************************//
QZFL.event.onDomReady(function(){
	var uin = V.login.getUin();
	var userInfo = {login:uin >= 10000,uin:uin,nick:''};
	var postInit = function() {
		var loginInfo = 'loginInfo';
		loginInfo = $(loginInfo);
		if (loginInfo) {
			if (userInfo.login) {
				loginInfo.innerHTML = userInfo.nick + ' <a href="javascript:void(0);" onclick="V.login.exit();return false">退出</a>';
			} else {
				loginInfo.innerHTML = '<a href="javascript:void(0);" onclick="V.login.show();return false">登录</a>';
			}
		}
	};
	if (userInfo.login) {
		V.login.getUinsInfo([uin], function(obj) {
			if (obj && obj[uin]) {
				var info = obj[uin];
				userInfo.nick = info[6];
			}
			postInit();
		});
	} else {
		postInit();
	}
});/*  |xGv00|63fc0ccca99dcd6355508cad0010f247 *//**
 * Created by detail.
 * User: jinjingcao
 * Date: 11-9-9
 * Time: 下午4:13
 * To change this template use File | Settings | File Templates.
 */


QQ_Connect.Mgmt=QQ_Connect.Mgmt||{};

//*************************app基本信息********************************//
QQ_Connect.Mgmt.AppInfo = function() {
	var detail = null, uin = V.login.getUin(), id = $QC.Toolkit.getQuery("id");

	function getDetail(_cb) {
		if(detail) {
			_cb(detail.data, detail);
			return;
		}

		var _pool = arguments.callee.pool;
		_pool.push(_cb);
		var jg = new QZFL.JSONGetter("http://"+g_R_Domain+"/cgi-bin/oauth_apply/get_app_info", "get_app_info", {uin:uin, id:id}, "utf-8");
		jg.onSuccess = function(o) {
			var tmp;
			if(this.checkResponse(o)&&o.data){
				var bl = o.bind_list, flag_10001;
				if(bl&&!~~bl.ret) {
					for(var _bIdx =0; _bIdx<bl.data.length; _bIdx++) {
						if(bl.data[_bIdx].type=='10001') {
							flag_10001 = true;
							break;
						}
					}

					if(!flag_10001) {//hard code 财付通
						bl.data.push({
							sid:[],
							type:10001
						});
					}
				}
				detail = o;
				while(tmp=_pool.shift()) {
					tmp(o.data, detail);
				}
			}else{
				this.onError(o);
			}
//			if(!~~o.ret&&o.data) {
//				detail = o;
//				while(tmp=_pool.shift()) {
//					tmp(o.data, detail);
//				}
////				_cb&&_cb(appList);
//			}else if(this[o.ret]){
//				this[o.ret](o);
//			}else{
//				this.onError(o);
//			}
		};
		jg.onError = function(o) {
			QZFL.widget.msgbox.show("网络繁忙，请稍后再试！", 5, 2000);
			$QC.Console.error(o, 'get_app_info');
		};
		jg.send("_Callback");
	}
	getDetail.pool=[];



	return {
		clearCache : function() {
			detail = null;
		},
		update : function(dt) {
			if(detail) {
				for(var key in dt) {
					detail[key] = dt[key];
				}
			}
		},
		init : function(fun) {
			getDetail(fun);
		}/*,
		add : add,
		modify : modify*/
	}
}();

//*************************验证框架********************************//
QQ_Connect.Mgmt.Verify = function() {
//	var pool = {};
	var VerifyItem = function(key, domId) {
		this.key = key;
		this.domId = domId;
		this.dom = null;
		this.status = arguments.callee.STATUS.UNKNOWN;

		this.init();
		return this;
//		pool[this.id] = this;
	};
	VerifyItem.STATUS = {
		 "UNKNOWN" : 1,
		"CHECKING" : 2,
		"PASS" : 4,
		"FORBIDDEN" : 8
	};
	QZFL.object.extend(VerifyItem.prototype, function(){
		
		function change(_, _this) {
			var crtTarget = QZFL.event.getTarget();
//				id = tgt.id,
			var ins = _this;//pool[id];

			ins.$onChange && ins.$onChange(ins.getValue(), ins, crtTarget);
			ins._onChecking(function(_ins, _ret){QZFL.string.escHTML
//				_ins.$onChange && _ins.$onChange(_ret);
			});
		}

		function blur(_, _this) {
			var tgt = QZFL.event.getTarget(),
				id = tgt.id,
				ins = _this;//pool[id];

			ins&&ins.$onBlur(tgt);
			ins.status==VerifyItem.STATUS.UNKNOWN && ins._onChecking(function(_ins, _ret){
//				_ins.$onChange && _ins.$onChange(_ret);
			});
		}

		function focus(_, _this) {
			var tgt = QZFL.event.getTarget(),
				id = tgt.id,
				ins = _this;//pool[id];

			ins&&ins.$onFocus(tgt);
		}

		function adapte(_this, _fun) {
			return function(){
				_fun(arguments[0], _this);
			}
		}

		return {
			extend : function(f) {
				QZFL.object.extend(this, f);
				return this;
			},
			doChange : function() {
				change(null, this);
			},
			$onStatusChange : QZFL.emptyFn,
			$onFocus : QZFL.emptyFn,
			$onBlur : QZFL.emptyFn,
			$onPassed : QZFL.emptyFn,
			$onForbidden : QZFL.emptyFn,
			$onCheck : function(_cb) {
				_cb && _cb(true);
			},
			init : function() {
				this.dom = document.getElementById(this.domId);// || document.getElementsByName(this.domId)[0];//todo
				if(this.dom&&this.dom.id!=this.domId){this.dom=null;}//过滤的版本ie6的问题
				this.doms = document.getElementsByName(this.domId);
				var singleDom;
				if(singleDom = this.dom||this.doms[0]) {
					switch(singleDom.type) {
						case "radio":
						case "checkbox":
							this._bind4Radio();
							break;
						default:
							this._bind();
							break;
					}
				}else{
					$QC.Console.error("dom 未找到", "QQ_Connect.Mgmt.Verify");
				}

				return this;
			},
			//绑定默认方法
			_bind : function() {
				QZFL.event.addEvent(this.dom, "blur", adapte(this, blur));
				QZFL.event.addEvent(this.dom, "focus", adapte(this, focus));
				QZFL.event.addEvent(this.dom, "change", adapte(this, change));
			},
			_bind4Radio : function() {//todo
				var me = this;
				QZFL.object.each(this.doms, function(dom) {
					QZFL.event.addEvent(dom, "blur", adapte(me, blur));
					QZFL.event.addEvent(dom, "focus", adapte(me, focus));
					QZFL.event.addEvent(dom, "click", adapte(me, change));
				});
			},

			_onChecking : function(_cb) {
				var me = this;
				this.status = VerifyItem.STATUS.CHECKING;
				this.$onStatusChange(this.status);

				this.$onCheck(function(_ret){
					if(_ret!==true&&_ret!==false){
						$QC.Console.error("验证参数返回类型错误，期待Boolean，当前:"+_ret, "_onChecking->$onCheck");
					}
					_ret === true ? me._onPassed() : me._onForbidden();
					_cb && _cb(me, _ret);
				});

//				this.$onCheck(function(_this){
//					return function(_ret) {
//						_ret === true ? _this._onPassed() : _this._onForbidden();
//						_cb && _cb(_this, _ret);
//					}
//				}(this));
			},
			_onPassed : function() {
				this.status = VerifyItem.STATUS.PASS;
				this.$onStatusChange(this.status);

				this.$onPassed();
			},
			_onForbidden : function() {
				this.status = VerifyItem.STATUS.FORBIDDEN;
				this.$onStatusChange(this.status);

				this.$onForbidden();
			},
			getValue : function() {
				return this.dom?QZFL.string.trim(this.dom.value||""):$QC.Input.getValue(this.domId);	//todo 用getInputValue替换？
			},
			setValue : function(v) {
				this.dom?(this.dom.value = v):$QC.Input.setValue(this.domId, v);
				return this;
			}
		}
	}());

	
	var VerifyGroup = function(id, verifyMethod) {
		this.id = id;
		this.method = verifyMethod||arguments.callee.METHOD.BATH;

//		this.items = [];
//		this.groupStatus = VerifyItem.STATUS.UNKNOWN;
//		this._vls = null;
		this.reset();

		arguments.callee.get.pool[id] = this;

		return this;
	};
	//验证方式
	VerifyGroup.METHOD = {
		"BATH" : 0,	//所有项目一起验证
		"ORDER" : 1	//项目依次验证
	};
	VerifyGroup.get = function(id) {
		return arguments.callee.pool[id]||null;
	};
	VerifyGroup.get.pool = {};
	QZFL.object.extend(VerifyGroup.prototype, {
		reset : function() {//重置验证项目
			this.items=[];
			this.groupStatus = VerifyItem.STATUS.UNKNOWN
			this._vls = null;
		},
		extend : function(f) {
			QZFL.object.extend(this, f);
			return this;
		},
		attachItem : function(item) {
			item&&this.items.push(item);
			return this;
		},
		getItem : function(_key) {
			var ret = null;
			for(var i=0;i<this.items.length;i++) {
				if(this.items[i].key == _key) {
					ret = this.items[i];
					break;
				}
			}
			return ret;
		},
		_onItemCheckBack : function(_ins, _ret) {//debugger
			var retSts/* = VerifyItem.STATUS.PASS*/,me=this,vls={};
			this.$onItemCheckBack(_ins, _ret);

			for(var i in this.items) {
				var itm = this.items[i];
				$QC.Console.log(itm.status, itm.key);
				retSts = retSts | itm.status;// == VerifyItem.STATUS.PASS
				vls[itm.key] = QZFL.string.trim(itm.getValue());	//收集界面上的值-->getInputValue??
			}
			$QC.Console.warn("----------------------------------", retSts);

			this.groupStatus = retSts;

//			ret == VerifyItem.STATUS.PASS
//					? (function(){
//							clearTimeout(me.tmr);
//							me.tmr = setTimeout(function(){me.$onPassed(vls)},200);
//					}())
//					: ( this.method != VerifyGroup.METHOD.ORDER && ((ret & VerifyItem.STATUS.UNKNOWN) != VerifyItem.STATUS.UNKNOWN)
//							&& ((ret & VerifyItem.STATUS.CHECKING) != VerifyItem.STATUS.CHECKING)  ) ? this.$onForbidden() : this.$onForbidden();	//非ORDER模式顺序匹配完毕：ORDER模式只要有一个验证失败就中断

//			if(this.method == VerifyGroup.METHOD.ORDER) {
//				ret == VerifyItem.STATUS.PASS
//						? this.$onPassed(vls, _ins, _ret)
//						: _ret == false//(ret == VerifyItem.STATUS.FORBIDDEN || (ret ==(VerifyItem.STATUS.FORBIDDEN | VerifyItem.STATUS.PASS)))
//								? this.$onForbidden(vls, _ins, _ret) : null;
//			}else{
//				ret == VerifyItem.STATUS.PASS
//						? this.$onPassed(vls, _ins, _ret)
//						: (ret == VerifyItem.STATUS.FORBIDDEN || (ret ==(VerifyItem.STATUS.FORBIDDEN | VerifyItem.STATUS.PASS)))
////								((ret & VerifyItem.STATUS.UNKNOWN) != VerifyItem.STATUS.UNKNOWN)
////								&& ((ret & VerifyItem.STATUS.CHECKING) != VerifyItem.STATUS.CHECKING)
////								&& ((ret & VerifyItem.STATUS.FORBIDDEN) == VerifyItem.STATUS.FORBIDDEN ) )
//										? this.$onForbidden(vls, _ins, _ret) : null;//检测中的状态并且不为pass，没有checkine，有forbidden，则认为是forbidden
//			}

			this._vls = vls;

			this.method == VerifyGroup.METHOD.ORDER
					? this._onOrderCheckBack(vls, _ins, _ret)
					: this._onBathCheckBack(vls, _ins, _ret);

			return retSts;
		},
		onCheck : function() {//todo 包含子组的情况
			//复位status
//			for(var i in this.items) {
//				this.items[i].status = VerifyItem.STATUS.UNKNOWN;
//			}
			this.method == VerifyGroup.METHOD.ORDER ? this._onOrderCheck() : this._onBathCheck();
		},
		$onPassed : QZFL.emptyFn,
		$onForbidden : QZFL.emptyFn,
		/**
		 * 每个项目检测完成后的回调
		 */
		$onItemCheckBack : QZFL.emptyFn,
		_onBathCheck : function() {
			var me = this,item,last=this.items.length-1,flag=true;
			for(var i in this.items) {
				item = this.items[i];
//				if(r == VerifyItem.STATUS.PASS) break;
				//pass状态不在检测
				if(item.status!=VerifyItem.STATUS.PASS){
					item._onChecking(function(_ins, _ret){
						me._onItemCheckBack( _ins, _ret );
					});
				}
				
				flag = flag && (item.status==VerifyItem.STATUS.PASS);
				//如果全部状态都为缓存成功，模拟触发一次CheckBack回调
				(flag==true && i==last) && me._onItemCheckBack(item, item.status==VerifyItem.STATUS.PASS);//todo ????是否需要
			}
		},
		_onBathCheckBack : function(vls, _ins, _ret) {
			var ret;
			(ret = this.groupStatus)==VerifyItem.STATUS.PASS
					? this.$onPassed(vls, _ins, _ret)
					: (ret == VerifyItem.STATUS.FORBIDDEN || (ret ==(VerifyItem.STATUS.FORBIDDEN | VerifyItem.STATUS.PASS)))
//								((ret & VerifyItem.STATUS.UNKNOWN) != VerifyItem.STATUS.UNKNOWN)
//								&& ((ret & VerifyItem.STATUS.CHECKING) != VerifyItem.STATUS.CHECKING)
//								&& ((ret & VerifyItem.STATUS.FORBIDDEN) == VerifyItem.STATUS.FORBIDDEN ) )
									? this.$onForbidden(vls, _ins, _ret) : null;//检测中的状态并且不为pass，没有checkine，有forbidden，则认为是forbidden

		},
		_onOrderCheck : function() {
			var me = this, idx=0, crt, vRet = true;
			(function() {
				var callee = arguments.callee;
				if(crt=me.items[idx]) {
					crt.status!=VerifyItem.STATUS.PASS
							? crt._onChecking(function(_ins, _ret){
								vRet = me._onItemCheckBack(_ins, _ret);
								idx++;
								if(_ret && vRet != VerifyItem.STATUS.PASS){callee();}else{return;}
							}) : (idx++, callee()) ;
				}else{
					crt = me.items[me.items.length-1];
					me._onItemCheckBack(crt, crt.status==VerifyItem.STATUS.PASS);
				}
			})();
		},
		_onOrderCheckBack : function(vls, _ins, _ret) {
			var ret;
			(ret = this.groupStatus)==VerifyItem.STATUS.PASS
				? this.$onPassed(vls, _ins, _ret)
				: _ret == false//(ret == VerifyItem.STATUS.FORBIDDEN || (ret ==(VerifyItem.STATUS.FORBIDDEN | VerifyItem.STATUS.PASS)))
						? this.$onForbidden(vls, _ins, _ret) : null;
		},
		getValues : function() {debugger
			var me = this;
			return this._vls || function(){
				var ret = {};
				for(var i in me.items) {
					ret[i] = me.items[i].getValue();
				}
				return ret;
			}();
		}
	});
//	$QC.Toolkit.extend(VerifyGroup, VerifyItem);


	return {
		Group : VerifyGroup,
		Item : VerifyItem
	}
}();

//*************************黑名单检测********************************//
QQ_Connect.Mgmt.BlackList = function(){
	var uin = V.login.getUin();

	return {
		check : function(domain, _cb) {
			var _postVars = {domain: QZFL.string.trim(domain).replace(/^http(s)?:\/\//i, '') , uin:uin};
			var jg = new QZFL.JSONGetter("http://"+g_R_Domain+"/cgi-bin/oauth_apply/check_black_domain", "check_black_domain", _postVars, "utf-8");
			jg.onSuccess = function(o) {
				//if(!~~o.ret){
				if(this.checkResponse(o)){
					if(o.data.flag) {
						_cb(0);
					}else{
						_cb(1);
					}
				}else{
					this.onError(o);
				}
			};
			jg.onError = function(o) {
//				QZFL.widget.msgbox.show(o&&o.msg||"网络繁忙，请稍后再试！", 5, 2000);
				$QC.Console.error(o, 'check_black_domain');
			};
			jg.send("_Callback");
//			setTimeout(function(){
//				_cb(1);
//			})
		}
	}
}();

//*************************认证空间检测********************************//
QQ_Connect.Mgmt.FamousSpace = function(){

	return {
		check : function(uin, _cb) {
			var _postVars = {uin:uin};
			var jg = new QZFL.JSONGetter("http://open.qzone.qq.com/check_brand", "check_brand", _postVars, "utf-8");
			jg.onSuccess = function(o) {
				//if(!~~o.ret){
				if(this.checkResponse(o)){
						_cb(1);
				}else{
					if(~~o.ret==-2||~~o.ret==-3) {
						_cb(0);
					}else{
						this.onError(o);
					}
				}
			};
			jg.onError = function(o) {
				$QC.Console.error(o, 'check_brand');
			};
			jg.send("_Callback");
//			setTimeout(function(){
//				_cb(1);
//			})
		}
	}
}();

//*************************微博帐号检测********************************//
QQ_Connect.Mgmt.Weibo = function(){
	var uin = V.login.getUin();

	return {
		check : function(weibo, _cb) {
			var _postVars = {uin:uin, weibo:weibo};
			var jg = new QZFL.JSONGetter("http://"+g_R_Domain+"/cgi-bin/oauth_apply/check_famous_weibo", "check_famous_weibo", _postVars, "utf-8");
			jg.onSuccess = function(o) {
				//if(!~~o.ret){
				if(this.checkResponse(o)){
					if(o.data.flag) {
						_cb(1);
					}else{
						_cb(0);
					}
				}else{
					this.onError(o);
				}
			};
			jg.onError = function(o) {
				$QC.Console.error(o, 'check_famous_weibo');
				_cb(-1);
			};
			jg.send("_Callback");
//			setTimeout(function(){
//				_cb(1);
//			})
		}
	}
}();

//*************************网站meta-code检测********************************//
QQ_Connect.Mgmt.DomainMeta = function() {
	var uin = V.login.getUin();
	
	var _createMetaContent = function (uin, domainUrl){
			if(!uin || !domainUrl){return false;}

			var i,
				ret="";

			uin= uin.toString();
			if(uin.length<= domainUrl.length){
				for(i=0; i<uin.length; i++){
					ret+=((domainUrl.charCodeAt(i)^ uin.charCodeAt(i))& 7);
				}
				for(i= uin.length; i< domainUrl.length; i++){
					ret+= (domainUrl.charCodeAt(i)^0)& 7;
				}
			}
			else{
				for(i= 0; i< domainUrl.length; i++){
					ret+=((domainUrl.charCodeAt(i)^ uin.charCodeAt(i))& 7);
				}
				for(i= domainUrl.length; i< uin.length; i++){
					ret+= (uin.charCodeAt(i)^0)& 7;
				}
			}
			return ret;
		};

		var _getDomain = function(v) {
			return v/*.replace(/http:\/\//i, '') */;
		};

	return {
		getCode : function(domain) {
			return _createMetaContent(uin, _getDomain(domain));
		},
		check : function(url, _cb) {
			var meta = _createMetaContent(uin, _getDomain(url)),
				_postVars = {uin:uin, meta:meta, url:url};//meta无意义，用来前端验证
			var jg = new QZFL.JSONGetter("http://"+g_R_Domain+"/cgi-bin/oauth_apply/verify_site_domain", "verify_site_domain", _postVars, "utf-8");
			jg.onSuccess = function(o) {
				//if(!~~o.ret){
				if(this.checkResponse(o)){
					if(o.data.flag) {
						_cb(1);
					}else{
						_cb(0);
					}
				}else{
					this.onError(o);
				}
			};
			jg.onError = function(o) {
				$QC.Console.error(o, 'verify_site_domain');
				_cb(-1);
			};
			jg.send("_Callback");
		}
	}
}();

//*************************开发者********************************//
QQ_Connect.Mgmt.Developer = function() {
	var devInfo = null, uin = V.login.getUin(),
		dialog, mask;//开发者弹框

	function _getInfo(_cb, _ecb) {
			devInfo ? _cb(devInfo) : arguments.callee.send(_cb, _ecb);
	}
	_getInfo.send = function(_cb, _ecb) {
		var _pool = arguments.callee.pool;
		_pool.push([_cb, _ecb]);
		var jg = new QZFL.JSONGetter("http://"+g_R_Domain+"/cgi-bin/oauth_apply/get_dev_info", "get_dev_info", {uin:uin}, "utf-8");
		jg.onSuccess = function(o) {
			//if(!~~o.ret){
				if(this.checkResponse(o)&&o.data){
					devInfo=o.data;
					_getInfo.send.bath(true, devInfo);
				}else{
					this.onError(o);
				}
//			if(!~~o.ret&&o.data) {
//				devInfo=o.data;
//				_getInfo.send.bath(true, devInfo);
////				_cb&&_cb(devInfo);
//			}else if(this[o.ret]){
//				this[o.ret](o);
//			}else{
//				this.onError(o);
//			}
		};
		//未获得开发者身份
		jg["404"] = function(o) {
//			http://open.qq.com/api/developer
			_getInfo.showPanel();
			_getInfo.send.bath(false, o);
//			_ecb&&_ecb(o);
	//		dialog.fillTitle(fmt(act + '{0}模块', Name[type]));
		};
		jg.onError = function(o) {
			if(this[o.ret]) return;
//			QZFL.widget.msgbox.show("网络繁忙，请稍后再试！", 5, 2000);
			$QC.Console.error(o, 'get_dev_info');
			$e('#side_basic_info p').setHtml("获取开发者信息失败");
//			$e('#side_basic_info p').elements[0].innerHTML = "获取开发者信息失败";
		};
		jg.send("_Callback");
	};
	_getInfo.send.pool=[];
	_getInfo.send.bath = function(flag, o) {
		var _pool = _getInfo.send.pool, tmp;
		while(tmp = _pool.shift()) {
			var _cb = tmp[0], _ecb = tmp[1];
			flag ? _cb(o) : _ecb(o);
		}
	};
	_getInfo.fill = function(dt) {
		var d = QZFL.object.extend({}, dt), T=$QC.Manage.getTemplate("BASIC");
		T=QZFL.string.format(T, {
			_contact:d.type>0?[
					'<dt>联系人：</dt>',
					'<dd title="{contact}">{contact}</dd>'
				].join(''):'',
			_website:d.type>0?'':[
					'<dt>网站：</dt>',
					'<dd title="{website}" class="breakword">{website}</dd>'
				].join('')
		});
		d._type = d.type=="1" ? "公司" : "个人";
		$("side_basic_info").innerHTML = QZFL.string.format(T, d);
	};
	_getInfo.fillNoData = function() {
		$("side_basic_info").innerHTML = [
			'<div class="side_basic_info">',
				'<header>',
					'<h2>开发者信息</h2>',
//					'<a class="op" title="编辑" href="管理中心.html##">编辑</a>',
				'</header>',
				'<dl>',
				'<a href="javascript:;" onclick="$QC.Mgmt.Developer.refresh();">注册成为开发者</a>',
				'</dl>',
			'</div>'
		].join("");//'<a href="javascript:;" onclick="$QC.Mgmt.Developer.refresh();">注册开发者</a>';
	};
	_getInfo.showPanel = function() {
		var _preventCache = "";//QZFL.userAgent.ie<=6 ? "?c="+new Date().getTime() : "";
		var content = '<iframe id="devFrm" height="520" width="100%" src="http://open.qq.com/api/developer'+_preventCache+'#cb=$QC_Manage_Developer_refresh&closeHandler=$QC_Manage_Developer_closePanel" width="100%" allowTransparency="1" scrolling="no" frameborder="0"></iframe>';
		if(!dialog) {
			dialog = QZFL.dialog.create('开发者信息', '', {
				width: 485,
				height: 550,
				tween: true
			});
			dialog.onUnload = function(){
				mask && QZFL.maskLayout.remove(mask);
				dialog = mask = null;
			};
			mask = QZFL.maskLayout.create();
		}

		dialog.fillContent(content);
		if(QZFL.userAgent.ie<=6) {
			var devFrm = $("devFrm"), prt = $("devFrm").parentNode;
			prt.removeChild(devFrm);
			setTimeout(function(){prt.appendChild(devFrm);},1000);
		}
	};


	return {
		/**
		 * 获取基本信息
		 * @param _cb
		 */
		getInfo : function() {
			_getInfo.apply(null, arguments);
		},
		init : function() {
			this.getInfo(_getInfo.fill, _getInfo.fillNoData);
		},
		modify : function() {
			if(V.login.getUin()) {
				_getInfo.showPanel();
			}else{
				location.href=location.href;//触发服务端302跳转
			}
		},
		refresh : function() {
			devInfo=null;
			$QC.Mgmt.Developer.closePanel();
			$QC.Mgmt.Developer.init();
		},
		openPanel : function(){
			_getInfo.showPanel();
		},
		closePanel : function() {
			dialog && dialog.unload();
		}
	}
}();
//开发者页面接口 适配中转
$QC_Manage_Developer_refresh = $QC.Mgmt.Developer.refresh;
$QC_Manage_Developer_closePanel = $QC.Mgmt.Developer.closePanel;

//*************************域名与回调联合检测********************************//
QQ_Connect.Mgmt.Domain = function(){
	var _checkDomain = function(a, b) {
		var domainDomain = _getDomain(a);
		var callbackDomain = _getDomain(b);
		return domainDomain == callbackDomain && domainDomain!="";
	};

	var _getDomain = function(str) {
			var regDomain = /\/\/([^/]+)\/?/,		//(?:www\.)?
					_mainDomain = /(?:www\.)?([\w-]+\.)+?((com\.cn)|(net\.cn)|(gov\.cn)|(org\.cn)|(com)|(cn)|(mobi)|(net)|(org)|(so)|(co)|(tel)|(tv)|(biz)|(cc)|(hk)|(name)|(info)|(asia)|(me)|([a-z]+))$/i;

			return function(){
				var ret = '',
					hostName="",
					domainSuffix="";

				var match = QZFL.string.trim(str.toLowerCase()).match(regDomain);
				if(match&&match[1]) {
					var hMatch = match[1].match(_mainDomain);

					if(hMatch) {
						hostName = hMatch[1];
						domainSuffix = hMatch[2];
						ret = [hostName, domainSuffix].join('');
					}
				}
				QZFL.console.print('::ret->' + ret);
				return ret;
			}();
	};

	return {
		checkEqual : function(a, b) {
			return _checkDomain(a, b);
		},
		getDomain : _getDomain
	}
}();


////////////////////////////////////////////////////////////////////////////////////////
QQ_Connect.Mgmt.getSeed = function() {//debugger
	return parseInt(QZFL.cookie.get("_LG_SD"))||0;
};
QQ_Connect.Mgmt.getSeedUrl = function(url) {
	var seed = QQ_Connect.Mgmt.getSeed(),
		_t = "t="+seed;
	return  url+ (url.indexOf('?')>-1 ? '&' : '?') + _t;
};
QQ_Connect.Mgmt.setSeed = function() {
	return QZFL.cookie.set("_LG_SD", QQ_Connect.Mgmt.getSeed()+1, "connect.qq.com", "/");
};

////////////////////////////////////////////////////////////////////////////////////////
QZONE.event.onDomReady(function(){//导航地图逻辑
	var top_nav_appName = $("top_nav_appName");
	if(top_nav_appName) {
		$QC.Mgmt.AppInfo.init(function(dt){
			if(dt.appname) {
				top_nav_appName.innerHTML = escHTML(dt.appname);
			}
		});
	}
});

//**********************************************************//
//QZFL.event.onDomReady(function(){
//	var uin = V.login.getUin();
//	var userInfo = {login:uin >= 10000,uin:uin,nick:''};
//	var postInit = function() {
//		var loginInfo = 'loginInfo';
//		loginInfo = $(loginInfo);
//		if (loginInfo) {
//			if (userInfo.login) {
//				loginInfo.innerHTML = userInfo.nick + ' <a href="javascript:void(0);" onclick="V.login.exit();return false">退出</a>';
//			} else {
//				loginInfo.innerHTML = '<a href="javascript:void(0);" onclick="V.login.show();return false">登录</a>';
//			}
//		}
//	};
//	if (userInfo.login) {
//		V.login.getUinsInfo([uin], function(obj) {
//			if (obj && obj[uin]) {
//				var info = obj[uin];
//				userInfo.nick = info[6];
//			}
//			postInit();
//		});
//	} else {
//		postInit();
//	}
//});
/*  |xGv00|52c66ceb410741b6c9240aff2fa6dda3 *//**
 * Created by 腾讯互联.
 * User: jinjingcao
 * Date: 11-9-2
 * Time: 下午9:08
 * To change this template use File | Settings | File Templates.
 */


/*
 * QQ互联首页轮播广告
 * author: erain
 */

QQ_Connect.CarouselAd = {
	_times : {},
	
	isbind : false,				//标志是否对按钮绑定好事件
	
	/*
	 * 默认配置
	 */
	defaultConfig : {
		revealtype : 'click',	//事件类型，控制换位
		autoPlay : true,		//是否自动滚动
		autoPlayInterval : 5000,	//自动切换时间
		duration : 500,			//滚动的时间
		btnItems : null,		//按钮ID
		imgItems : null,		//图片ID
		clickIndex : 0,	    	//点击的页面
		index : 0,				//存储当前的页面
		direction : 'l2r' 		//广告滚动方向 默认从左到右
	},
	
	
	/*
	 * 初始化
	 * @param {Object} _config 传入的配置参数
	 */
	init : function(_config){
		debugger;
		var qc = QQ_Connect.CarouselAd,
			qcd = qc.defaultConfig;
		for(key in _config){
			qcd[key] = _config[key];
		}
		if(!qcd.imgItems || !qcd.btnItems){
			return;
		}		
		var r = Math.floor(Math.random()*qcd.btnItems.length),
			e = $(qcd.imgItems[r].imgid);
		qcd.index = r;
		
		$(qcd.btnItems[r].eid).className="current";
		e.style.display='';
		e.style.zIndex='5';
		
		qc.play(r, false);

		if(_config.container) {
			QZFL.event.onHover(
			function(){console.info("hover")
				qc.stop();
			},function(){
				qc.play(r,false);
			});
		}
	},
	
	/*
	 * 广告轮播
	 * @param {Number} index 当前页的下标
	 * @param {Boolean} isClick 是否是点击小按钮，这个值可以看出是自动滚，还是点击滚。默认false（自动档）
	 */
	play : function(index, isClick){
		var qc = QQ_Connect.CarouselAd,
			qcd = qc.defaultConfig;
			
		isClick = isClick || false;
		clearTimeout(qc._times.autoPlayItv);
		
		if(!qc.isbind){
			qc.bindBtn();
		}

		//点击事件都能进入手动档，但是一种情况除外 就是自己点自己
		if(isClick && (qcd.index != qcd.clickIndex)){
			qc.btnChange(qcd.index, true);
			qc.imgChange(qcd.index, true);			
			qc._times.autoPlayItv = setTimeout(function(){
				qc.play(qcd.index);
			},(qcd.autoPlayInterval + qcd.duration));
		}else{
			qc._times.autoPlayItv = setTimeout(function(){
				qc.btnChange(qcd.index, false);
				qc.imgChange(qcd.index, false);
				qc.play(qcd.index);
			},(qcd.autoPlayInterval + qcd.duration));
		}
	},

	stop : function() {
		if(qc._times.autoPlayItv){
			clearTimeout(qc._times.autoPlayItv);
		}
	},
	
	 /*
	  * 按钮也给调整下
	  */
	 btnChange : function(index, isClick){
	 	var qc = QQ_Connect.CarouselAd,
	 		qcd = qc.defaultConfig,
	 		curId = qcd.btnItems[index].eid,
	 		cure = $(curId),
	 		nextId = qcd.btnItems[qc.nextIndex(index)].eid,
	 		nexte;
	 	if(isClick){
	 		nextId = qcd.btnItems[qcd.clickIndex].eid;
	 	}
 		nexte = $(nextId);
	 	cure.className = '';
	 	nexte.className = 'current';
	 },
	
	/*
	 * 当前图片给调整下
	 * @param {Number} index 当前页的下标
	 * @param {boolean} isClick 否是点击小按钮，这个值可以看出是自动滚，还是点击滚。默认false（自动档） 
	 */
	 imgChange : function(index, isClick){
	 	var qc = QQ_Connect.CarouselAd,
	 		qcd = qc.defaultConfig,
	 		curId = qcd.imgItems[index].imgid,
	 		cure = $(curId),
	 		nextId = qcd.imgItems[qc.nextIndex(index)].imgid,
	 		nexte;
	 	qcd.index = qc.nextIndex(index);
	 	if(isClick){
	 		nextId = qcd.imgItems[qcd.clickIndex].imgid;
	 		//判断出滚动方向
	 		if(qcd.clickIndex > index){
	 			qcd.direction = 'r2l';
	 		}
	 		qcd.index = qcd.clickIndex;
	 	}
	 	nexte = $(nextId);
	 	 	
	 	//根据滚动方向的不同，来将图片进行滚动方向的调整
	 	if(qcd.direction && (qcd.direction == 'l2r')){
		 	//将本张图片移走
		 	QZFL.effect.run(cure,{
		 			left : '+=960'
		 		},{
		 			duration:qcd.duration,
		 			complete:function(){
		 				qc.backImgInfo(cure);
		 			},
		 			functor : {functor : qc.functor}
		 		});
		 	//将下张图片推上来
		 	QZFL.effect.run(nexte,{
		 			left : '+=960'
		 		},{
		 			duration:qcd.duration,
		 			start:function(){
		 				qc.setImgInfo(nexte, qcd.direction);
		 				qc.unbindBtn();
		 			},
		 			complete:function(){
		 				qc.backImgInfo(cure);
		 				qc.bindBtn();
		 			},
		 			functor : {functor : qc.functor}
		 		});
	 	}else if(qcd.direction && (qcd.direction == 'r2l')){
	 		//将本张图片移走
		 	QZFL.effect.run(cure,{
		 			left : '-=960'
		 		},{
		 			duration:qcd.duration,
		 			complete:function(){
		 				qc.backImgInfo(cure);
		 			},
		 			functor : {functor : qc.functor}
		 		});
		 	//将下张图片推上来
		 	QZFL.effect.run(nexte,{
		 			left : '-=960'
		 		},{
		 			duration:qcd.duration,
		 			start:function(){
		 				qc.setImgInfo(nexte, qcd.direction);
		 				qc.unbindBtn();
		 			},
		 			complete:function(){
		 				qc.backImgInfo(cure);
		 				qcd.direction = 'l2r';
		 				qc.bindBtn();
		 			},
		 			functor : {functor : qc.functor}
		 		});
	 	}
	 },
	 
	 /*
	  * 绑定下按钮事件
	  */
	 bindBtn : function(){
	 	var ali = $e("ul.pagination li").elements,
	 		qc = QQ_Connect.CarouselAd,
			qcd = qc.defaultConfig;		
		for(var i = 0, len = ali.length; i < len; i++){
			var col = new qc.btnClickEvent(i);
			ali[i]['on'+qcd.revealtype] = col.clickFunc;
		}
		qc.isbind = true;	
	 },
	 
	 /*
	 * 建立一个闭包来循环绑定事件
	 */
	 btnClickEvent : function(k){
	 	this.clickFunc = function(){
	 		var qc = QQ_Connect.CarouselAd,
	 			qcd = qc.defaultConfig;
	 		qcd.clickIndex = k;
	 		qc.play(k,true);
	 	};
	 },
	 
	 /*
	  * 解除下绑定按钮的事件
	  */
	  unbindBtn : function(){
	  	var ali = $e("ul.pagination li").elements,
	  		qc = QQ_Connect.CarouselAd,
	  		qcd = qc.defaultConfig;
	  	for(var i = 0, len = ali.length ; i < len ; i++){
			QZFL.event.removeEvent(ali[i], qcd.revealtype);
		}
		qc.isbind = false;
	  },
	  
	 /*
	  * 下一个按钮的index
	  */
	 nextIndex : function(index){
	 	var qc = QQ_Connect.CarouselAd,
			qcd = qc.defaultConfig;
	 	return (index == qcd.btnItems.length-1) ? 0 : (index + 1);
	 },
	  
	 /*
	  * 将当前图片的改变再给调整回来
	  */
	  backImgInfo : function(obj){
	  	if(!obj){
	  		return;
	  	}
	  	obj.style.display = 'none';
	  	obj.style.zIndex = '0';
  		obj.style.left = '960px';
	  },
	  
	  /*
	   * 将即将出场的图片给设置好
	   */
	  setImgInfo : function(obj, direction){
	  	if(!obj){
	  		return;
	  	}
	  	obj.style.zIndex='5';
	 	obj.style.display='';
	 	if(direction == 'l2r'){
			obj.style.left='0px';
	 	}else{
	 		obj.style.left='1920px';
	 	}
	  },

	  /*
	   * 动画算子,需要修改下底层库
	   * @param t：current time（当前时间）；
	   * @param b：beginning value（初始值）；
	   * @param c：change in value（变化量）；
	   * @param d：duration（持续时间）。
	   */
	  functor : function(t,b,c,d){
	  	 if (t==0) return b;
		 if (t==d) return b+c;
		 if ((t/=d/2) < 1) return c/2 * Math.pow(2, 10 * (t - 1)) + b;
		 return c/2 * (-Math.pow(2, -10 * --t) + 2) + b;
	  }
};
debugger;
QQ_Connect.CarouselAd.init({
		revealtype : 'click',
		autoPlay : true,
		autoPlayInterval : 5000,
		duration : 500,
		btnItems : [{eid:'btn0'},{eid:'btn1'},{eid:'btn2'},{eid:'btn3'}],
		imgItems : [{imgid:'img0'},{imgid:'img1'},{imgid:'img2'},{imgid:'img3'}],
		clickIndex : 0,
		index : 0,
		direction : 'l2r'/*,
		container : $("ca_container")*/
});/*  |xGv00|0997a4ace91139e999f4bc5515dbfa18 *//**
 * Created by popup.
 * User: jinjingcao
 * Date: 11-9-7
 * Time: 下午8:31
 * To change this template use File | Settings | File Templates.
 */
QZFL.dialog = {
	items:[],
	lastFocus:null,
	tween:false,
	create:function(title, content, config) {
	var width = 300,height = 400,tween = false,noborder = false;
	if ((config != null) && (typeof(config) == "object")) {
		width = config.width || 300;
		height = config.height || 400;
		tween = config.tween || false;
		noborder = config.noborder || false;
	} else {
		width = arguments[2] || 300;
		height = arguments[3] || 400;
		tween = arguments[4] || false;
		noborder = arguments[5] || false;
	}
	var _i = this.items;
	_i.push(new QZFL.DialogHandler(_i.length, noborder, tween));
	var dialog = _i[_i.length - 1];
	dialog.init(width, height);
	dialog.fillTitle(title || "无标题");
	dialog.fillContent(content || "");
	return dialog;
},createBorderNone:function(content, width, height) {
	var _i = this.items;
	var dialog;
	_i.push(dialog = (new QZFL.DialogHandler(_i.length, true)));
	dialog.init(width || 300, height || 200, true);
	dialog.fillContent(content || "");
	return dialog;
}};
QZFL.DialogHandler = function(id, isNoBorder, useTween) {
	this._id = id;
	this.isNoBorder = !!isNoBorder;
	this._isIE6 = (QZFL.userAgent.ie && QZFL.userAgent.ie < 7);
	this.id = "dialog_" + id;
	this.mainId = "dialog_main_" + id;
	this.headId = "dialog_head_" + id;
	this.titleId = "dialog_title_" + id;
	this.closeId = "dialog_button_" + id;
	this.contentId = "dialog_content_" + id;
	this.frameId = "dialog_frame_" + id;
	this.useTween = (typeof(useTween) != "boolean") ? QZFL.dialog.tween : useTween;
	this.zIndex = 6000 + this._id;
	this.iconClass = "none";
	this.onBeforeUnload = function() {
		return true;
	};
	this.onUnload = QZFL.emptyFn;
	this.isFocus = false;
	var _t = ['<div id="',this.mainId,'" class="',(isNoBorder ? "" : "layer_opensns_main"),'">','<div id=',this.headId,' class="',(isNoBorder ? "none" : "layer_opensns_title"),'">','<a class="ms_c" href="javascript:void(0);" id="',this.closeId,'" title="关闭"><span>&#9587;</span></a>','<span id=',this.titleId,' ></span>','</div>','<div id="',this.contentId,'"></div>','</div>'];
	if (this._isIE6 && !isNoBorder) {
		_t.push('<iframe allowtransparency="yes" id="' + this.frameId + '" frameBorder="no" style="position:absolute;top:0;left:0;z-index:-1;" width="100%" height="100%"></iframe>');
	}
	this.temlate = _t.join("");
};
QZFL.DialogHandler.prototype.init = function(width, height, isNoneBerder) {
	this.dialog = document.createElement("div");
	this.dialog.id = this.id;
	var _l = (QZFL.dom.getClientWidth() - width) / 2 + QZFL.dom.getScrollLeft();
	var _t = Math.max((QZFL.dom.getClientHeight() - height) / 2 + QZFL.dom.getScrollTop(), 0);
	with (this.dialog) {
		if (!isNoneBerder) {
			className = "layer_global";
		}
		style.position = "absolute";
		style.left = _l + "px";
		style.top = _t + "px";
		style.zIndex = this.zIndex;
		innerHTML = this.temlate;
	}
	document.body.appendChild(this.dialog);
	this.dialogClose = QZFL.dom.get(this.closeId);
	var o = this;
	QZFL.event.addEvent(this.dialog, "mousedown", QZFL.event.bind(o, o.focus));
	QZFL.event.addEvent(this.dialogClose, "click", function() {
		var t = QZFL.dialog.items[o._id];
		if (t) {
			t.unload();
		}
	});
	if (QZFL.dragdrop) {
		QZFL.dragdrop.registerDragdropHandler(QZFL.dom.get(this.headId), QZFL.dom.get(this.id), {range:[0,null,null,null],ghost:0});
	}
	this.focus();
	this.setSize(width, height);
	if (this.useTween && QZFL.Tween) {
		QZFL.dom.setStyle(this.dialog, "opacity", 0);
		var tween1 = new QZFL.Tween(this.dialog, "top", QZFL.transitions.regularEaseIn, _t - 30 + "px", _t + "px", 0.3);
		tween1.onMotionChange = function() {
			QZFL.dom.setStyle(o.dialog, "opacity", this.getPercent() / 100);
		};
		tween1.onMotionStop = function() {
			QZFL.dom.setStyle(o.dialog, "opacity", 1);
			tween1 = null;
		};
		tween1.start();
	} else {
	}
};
QZFL.DialogHandler.prototype.focus = function() {
	if (this.isFocus) {
		return;
	}
	this.dialog.style.zIndex = this.zIndex + 3000;
	if (QZFL.dialog.lastFocus) {
		QZFL.dialog.lastFocus.blur();
	}
	;
	this.isFocus = true;
	QZFL.dialog.lastFocus = this;
};
QZFL.DialogHandler.prototype.blur = function() {
	this.isFocus = false;
	this.dialog.style.zIndex = this.zIndex;
};
QZFL.DialogHandler.prototype.getZIndex = function() {
	return this.dialog.style.zIndex;
};
QZFL.DialogHandler.prototype.fillTitle = function(title) {
	var _t = QZFL.dom.get(this.titleId);
	_t.innerHTML = title;
};
QZFL.DialogHandler.prototype.fillContent = function(html) {
	var _c = QZFL.dom.get(this.contentId);
	_c.innerHTML = html;
};
QZFL.DialogHandler.prototype.setSize = function(width, height) {
	var _m = QZFL.dom.get(this.id);
	_m.style.width = (parseInt(width) + 8) + "px";
	var _c = QZFL.dom.get(this.contentId);
	if (!this.isNoBorder) {
		height = height - 30 < 0 ? 50 : height - 30;
	}
	_c.style[QZFL.userAgent.ie < 7 ? "height" : "minHeight"] = height + "px";
	if (this._isIE6) {
		var _s = QZFL.dom.getSize(QZFL.dom.get(this.id)),_f = QZFL.dom.get(this.frameId);
		if (_f) {
			QZFL.dom.setSize(_f, _s[0], _s[1]);
		}
	}
};
QZFL.DialogHandler.prototype.unload = function() {
	if (!this.onBeforeUnload()) {
		return;
	}
	;
	var o = this;
	if (this.useTween && QZFL.Tween) {
		var tween1 = new QZFL.Tween(this.dialog, "opacity", QZFL.transitions.regularEaseIn, 1, 0, 0.2);
		tween1.onMotionStop = function() {
			o._unload();
			tween1 = null;
		};
		tween1.start();
	} else {
		this._unload();
	}
	;
};
QZFL.DialogHandler.prototype._unload = function() {
	this.onUnload();
	if (QZFL.dragdrop) {
		QZFL.dragdrop.unRegisterDragdropHandler(QZFL.dom.get(this.headId));
	}
	if (QZFL.userAgent.ie) {
		this.dialog.innerHTML = "";
	}
	QZFL.dom.removeElement(this.dialog);
	delete QZFL.dialog.items[this._id];
};
QZFL.maskLayout = {count:0,items:{},create:function(zindex, _doc) {
	this.count++;
	zindex = zindex || 5000;
	_doc = _doc || document;
	//alert([_doc.documentElement.scrollHeight, _doc.body.scrollHeight, _doc.documentElement.clientHeight, _doc.body.clientHeight]);
	var _m = QZFL.dom.createElementIn("div", _doc.body, false, {className:"qz_mask_layout"}),_h,_ua = QZFL.userAgent;
	_h = (_ua.ie && _ua.ie < 7) ? Math.max(_doc.documentElement.scrollHeight, _doc.body.scrollHeight, _doc.documentElement.clientHeight, _doc.body.clientHeight) : QZFL.dom.getClientHeight(_doc);
	_m.style.zIndex = zindex;
	_m.style.height = _h + "px";
	_m.unselectable = "on";
	this.items[this.count] = _m;
	return this.count;
},remove:function(countId) {
	QZFL.dom.removeElement(this.items[countId]);
	delete this.items[countId];
}};
QZFL.dragdrop = {dragdropPool:{},dragTempId:0,_scrollRange:0,dragGhostStyle:"cursor:move;position:absolute;border:1px solid #06c;background:#6cf;z-index:1000;color:#003;overflow:hidden",registerDragdropHandler:function(handler, target, options) {
	var _e = QZFL.event;
	var _hDom = QZFL.dom.get(handler);
	var _tDom = QZFL.dom.get(target);
	options = options || {range:[null,null,null,null],ghost:0};
	if (!_hDom) {
		return null
	}
	var targetObject = _tDom || _hDom;
	if (!_hDom.id) {
		_hDom.id = "dragdrop_" + this.dragTempId;
		QZFL.dragdrop.dragTempId++;
	}
	_hDom.style.cursor = options.cursor || "move";
	this.dragdropPool[_hDom.id] = new this.eventController();
	_e.on(_hDom, "mousedown", _e.bind(this, this.startDrag), [_hDom.id,targetObject,options]);
	return this.dragdropPool[_hDom.id];
},unRegisterDragdropHandler:function(handler) {
	var _hDom = QZFL.dom.get(handler);
	var _e = QZFL.event;
	if (!_hDom) {
		return null
	}
	_hDom.style.cursor = "default";
	delete this.dragdropPool[_hDom.id];
	_e.removeEvent(_hDom, "mousedown");
},startDrag:function(e, handlerId, target, options) {
	var _d = QZFL.dom;
	var _e = QZFL.event;
	if (_e.getButton() != 0 || _e.getTarget().noDrag) {
		return;
	}
	if (options.ignoreTagName == _e.getTarget().tagName || _e.getTarget().noDragdrop) {
		return;
	}
	var size = _d.getSize(target);
	var stylePosition = _d.getStyle(target, "position");
	var isAbsolute = stylePosition == "absolute" || stylePosition == "fixed";
	var ghost = null,hasGhost = false;
	var xy = null;
	if (options.rangeElement) {
		var _re = options.rangeElement;
		var _el = QZFL.dom.get(_re[0]);
		var _elSize = QZFL.dom.getSize(_el);
		var _r = _re[1];
		if (!_re[2]) {
			options.range = [_r[0] ? 0 : null,_r[1] ? 0 : null,_r[2] ? _elSize[1] : null,_r[3] ? _elSize[0] : null];
		} else {
			var _elXY = QZFL.dom.getXY(_el);
			options.range = [_r[0] ? _elXY[1] : null,_r[1] ? _elXY[0] : null,_r[2] ? _elXY[1] + _elSize[1] : null,_r[3] ? _elXY[0] + _elSize[0] : null];
		}
	}
	if (!isAbsolute || options.ghost) {
		xy = isAbsolute ? [parseInt(target.style.left),parseInt(target.style.top)] : _d.getXY(target);
		ghost = _d.createElementIn("div", isAbsolute ? target.parentNode : document.body, false, {style:options.ghostStyle || this.dragGhostStyle});
		ghost.id = "dragGhost";
		_d.setStyle(ghost, "opacity", "0.8");
		setTimeout(function() {
			_d.setStyle(target, "opacity", "0.5");
		}, 0);
		if (options.ghostSize) {
			_d.setSize(ghost, options.ghostSize[0], options.ghostSize[1]);
			xy = [e.clientX + QZFL.dom.getScrollLeft() - 30,e.clientY + QZFL.dom.getScrollTop() - 20];
		} else {
			_d.setSize(ghost, size[0] - 2, size[1] - 2);
		}
		_d.setXY(ghost, xy[0], xy[1]);
		hasGhost = true;
	} else {
		xy = [parseInt(_d.getStyle(target, "left")),parseInt(_d.getStyle(target, "top"))];
	}
	var dragTarget = ghost || target;
	this.currentDragCache = {size:size,xy:xy,mXY:xy,dragTarget:dragTarget,target:target,x:e.clientX - parseInt(xy[0]),y:e.clientY - parseInt(xy[1]),ghost:ghost,hasGhost:hasGhost,isAbsolute:isAbsolute,options:options,scrollRangeTop:QZFL.dragdrop._scrollRange,scrollRangeBottom:QZFL.dom.getClientHeight() - QZFL.dragdrop._scrollRange,maxScrollRange:Math.max(QZFL.dom.getScrollHeight() - QZFL.dom.getClientHeight(), 0)};
	_e.on(document, "mousemove", _e.bind(this, this.doDrag), [handlerId,this.currentDragCache,options]);
	_e.on(document, "mouseup", _e.bind(this, this.endDrag), [handlerId,this.currentDragCache,options]);
	this.dragdropPool[handlerId].onStartDrag.apply(null, [e,handlerId,this.currentDragCache,options]);
	_e.preventDefault();
},doDrag:function(e, handlerId, dragCache, options) {
	var pos = {};
	if (options.autoScroll) {
		if (e.clientY < dragCache.scrollRangeTop) {
			if (!QZFL.dragdrop._scrollTop) {
				QZFL.dragdrop._stopScroll();
				QZFL.dragdrop._scrollTimer = setTimeout(function() {
					QZFL.dragdrop._doScroll(true, dragCache)
				}, 200);
			}
		} else if (e.clientY > dragCache.scrollRangeBottom) {
			if (!QZFL.dragdrop._scrollBottom) {
				QZFL.dragdrop._stopScroll();
				QZFL.dragdrop._scrollTimer = setTimeout(function() {
					QZFL.dragdrop._doScroll(false, dragCache)
				}, 200);
			}
		} else {
			QZFL.dragdrop._stopScroll();
		}
	}
	var mX = e.clientX - dragCache.x;
	var mY = e.clientY - dragCache.y;
	var xy = this._countXY(mX, mY, dragCache.size, options);
	mX = xy.x;
	mY = xy.y;
	QZFL.dom.setXY(dragCache.dragTarget, mX, mY);
	dragCache.mXY = [mX,mY];
	this.dragdropPool[handlerId].onDoDrag.apply(null, [e,handlerId,dragCache,options]);
	if (QZFL.userAgent.ie) {
		document.body.setCapture();
	} else if (window.captureEvents) {
		window.captureEvents(Event.MOUSEMOVE | Event.MOUSEUP);
	}
	QZFL.event.preventDefault();
},endDrag:function(e, handlerId, dragCache, options) {
	var _d = QZFL.dom;
	if (dragCache.hasGhost) {
		QZFL.dom.removeElement(dragCache.dragTarget);
		var _t = dragCache.target;
		setTimeout(function() {
			QZFL.dom.setStyle(_t, "opacity", "1");
			_t = null;
		}, 0);
		if (dragCache.isAbsolute) {
			var x = parseInt(_d.getStyle(dragCache.target, "left")) + (dragCache.mXY[0] - dragCache.xy[0]);
			var y = parseInt(_d.getStyle(dragCache.target, "top")) + (dragCache.mXY[1] - dragCache.xy[1]);
			var xy = this._countXY(x, y, dragCache.size, options);
			QZFL.dom.setXY(dragCache.target, xy.x, xy.y);
		}
	}
	QZFL.event.removeEvent(document, "mousemove");
	QZFL.event.removeEvent(document, "mouseup");
	this.dragdropPool[handlerId].onEndDrag.apply(null, [e,handlerId,dragCache,options]);
	dragCache = null;
	QZFL.dragdrop._stopScroll();
	if (QZFL.userAgent.ie) {
		document.body.releaseCapture();
	} else if (window.releaseEvents) {
		window.releaseEvents(Event.MOUSEMOVE | Event.MOUSEUP);
	}
},_doScroll:function(isUp, dc) {
	step = isUp ? -15 : 15;
	var _st = QZFL.dom.getScrollTop();
	if (isUp && _st + step < 0) {
		step = 0;
	}
	if (!isUp && _st + step > dc.maxScrollRange) {
		step = 0;
	}
	QZFL.dom.setScrollTop(_st + step);
	dc.y = dc.y - step;
	QZFL.dragdrop._scrollTop = isUp;
	QZFL.dragdrop._scrollBottom = !isUp;
	QZFL.dragdrop._scrollTimer = setTimeout(function() {
		QZFL.dragdrop._doScroll(isUp, dc)
	}, 16);
},_stopScroll:function() {
	QZFL.dragdrop._scrollTop = QZFL.dragdrop._scrollBottom = false;
	clearTimeout(QZFL.dragdrop._scrollTimer);
},_countXY:function(x, y, size, options) {
	var pos = {x:x,y:y};
	if (options.x) {
		pos["x"] = parseInt(pos["x"] / options.x, 10) * options.x + (pos["x"] % options.x < options.x / 2 ? 0 : options.x);
	}
	if (options.y) {
		pos["y"] = parseInt(pos["y"] / options.y, 10) * options.y + (pos["y"] % options.y < options.y / 2 ? 0 : options.y);
	}
	if (options.range) {
		var _r = options.range;
		var i = 0,j = 0;
		while (i < _r.length && j < 2) {
			if (typeof _r[i] != "number") {
				i++;
				continue;
			}
			;
			var k = i % 2 ? "x" : "y";
			var v = pos[k];
			pos[k] = i < 2 ? Math.max(pos[k], _r[i]) : Math.min(pos[k], _r[i] - size[(i + 1) % 2]);
			if (pos[k] != v) {
				j++;
			}
			;
			i++;
		}
	}
	return pos;
}};
QZFL.dragdrop.eventController = function() {
	this.onStartDrag = QZFL.emptyFn;
	this.onDoDrag = QZFL.emptyFn;
	this.onEndDrag = QZFL.emptyFn;
};
QZFL.element.extendFn({dragdrop:function(target, options) {
	var _arr = [];
	this.each(function() {
		_arr.push(QZFL.dragdrop.registerDragdropHandler(this, target, options));
	});
	return _arr;
},unDragdrop:function(target, options) {
	this.each(function() {
		_arr.push(QZFL.dragdrop.unRegisterDragdropHandler(this));
	});
}});
QZFL.widget.Confirm = function(title, content, config) {
	this.buttonLayout = "confirm_button_" + QZFL.widget.Confirm.count;
	this.title = title || "这里是标题";
	this.hasTitle = true;
	this.content = '<div style="__CONTENT_STYLE__"><div class="layer_opensns_confirm_cont">' + (content || "这里是内容") + '</div></div><div id="' + this.buttonLayout + '" class="layer_opensns_confirm_bt"></div>';
	var isNewInterface = false;
	if ((config != null) && (typeof(config) == "object")) {
		var iconHash = {"warn":"icon_hint_warn","error":"icon_hint_error","succ":"icon_hint_succeed","help":"icon_hint_help"};
		isNewInterface = true;
		this.hasTitle = (typeof(config.hastitle) == 'undefined') ? true : config.hastitle;
		this.focusBtn = (typeof(config.focusBtn) == 'undefined') ? 0 : config.focusBtn;
		if (!this.hasTitle) {
			this.content = '<div style="background-color:white;height:160px;width:350px;border:2px #6B97C1 solid"><div style="height:89px;padding:18px;"><img style="position:absolute; top:40px; left:40px;" class="' + iconHash[config.icontype] + '" alt="" src="http://imgcache.qq.com/ac/b.gif"/><h1 style="font-size: 14px; position: absolute; top: 40px; left: 76px; color:#424242;">' + (content || "test") + '</h1></div><div id="' + this.buttonLayout + '" class="global_tip_button tx_r" style="text-align:right !important"></div></div>';
		}
	}
	this.type = (isNewInterface ? config.type : config) || 1;
	var _tips = isNewInterface ? config.tips : arguments[3];
	this.tips = _tips ? [_tips[0] ? _tips[0] : "是",_tips[1] ? _tips[1] : "否",_tips[2] ? _tips[2] : "取消"] : ["是","否","取消"];
	this.showMask = (typeof(config.showMask) == "undefined") ? true : config.showMask;
	this.onConfirm = QZFL.emptyFn;
	this.onNo = QZFL.emptyFn;
	this.onCancel = QZFL.emptyFn;
	QZFL.widget.Confirm.count++;
};
QZFL.widget.Confirm.count = 0;
QZFL.widget.Confirm.TYPE = {OK:1,NO:2,OK_NO:3,CANCEL:4,OK_CANCEL:5,NO_CANCEL:6,OK_NO_CANCEL:7};
QZFL.widget.Confirm.prototype.show = function(width, height, cssText) {
	var _lastTween = QZFL.dialog.tween;
	QZFL.dialog.tween = false;
	if (!this.hasTitle) {
		this.dialog = QZFL.dialog.createBorderNone(this.content, width || "352", height || "160");
	} else {
		this.content = this.content.replace(/__CONTENT_STYLE__/, 'width:100%;height:' + (parseInt(height || "140") - 58) + 'px;' + (cssText || ''));
		this.dialog = QZFL.dialog.create(this.title, this.content, width || "300", height || "140");
	}
	if (this.type & 1) {
		var _d = this._createButton(this.onConfirm, 0);
		(this.focusBtn & 1) && _d.focus();
	}
	if (this.type & 2) {
		var _d = this._createButton(this.onNo, 1);
		(this.focusBtn & 2) && _d.focus();
	}
	if (this.type & 4) {
		var _d = this._createButton(this.onCancel, 2);
		(this.focusBtn & 4) && _d.focus();
	}
	this.dialog.onUnload = QZFL.event.bind(this, function() {
		this.hide();
		if (this.type == 1) {
			this.onConfirm();
		} else {
			this.onCancel();
		}
	});
	this._keyEvent = QZFL.event.bind(this, this.keyPress);
	QZFL.event.addEvent(document, "keydown", this._keyEvent);
	QZFL.dialog.tween = _lastTween;
	if (QZFL.maskLayout && this.showMask) {
		setTimeout((function(me, zi) {
			return function() {
				if (me.dialog) {
					me.maskId = QZFL.maskLayout.create(--zi);
				}
			};
		})(this, this.dialog.getZIndex()), 0);
	}
};
QZFL.widget.Confirm.prototype.keyPress = function(e) {
	e = QZFL.event.getEvent(e);
	if (e.keyCode == 27) {
		this.hide();
	}
};
QZFL.widget.Confirm.prototype._createButton = function(e, tipsId, style) {
	var el = QZFL.dom.get(this.buttonLayout),_d = QZFL.dom.createElementIn("button", el, false);
	style && (_d.className = style);
	_d.innerHTML = this.tips[tipsId];
	QZFL.event.addEvent(_d, "click", QZFL.event.bind(this, function() {
		e();
		this.hide();
	}));
	return _d;
};
QZFL.widget.Confirm.prototype.hide = function() {
	this.dialog.onUnload = QZFL.emptyFn;
	this.dialog.unload();
	this.dialog = null;
	QZFL.event.removeEvent(document, "keydown", this._keyEvent);
	this._keyEvent = null;
	if (this.maskId) {
		QZFL.maskLayout.remove(this.maskId);
	}
};
QZFL.widget.msgbox = {_timer:null,cssPath:"http://" + (window.g_ImgCacheDomain || 'qzonestyle.gtimg.cn') + "/ac/qzone/qzfl/css/msgbox.css",_cssLoad:false,useTween:false,_loadCss:function() {
	var th = QZFL.widget.msgbox;
	if (!th._cssLoad) {
		QZFL.css.insertCSSLink(th.cssPath);
		th._cssLoad = true;
	}
},show:function(msgHtml, type, timeout, topPosition) {
	QZFL.widget.msgbox._loadCss();
	var template = '<div id="mode_tips_v2" class="gb_tip_layer" style="display:none;z-index:10000;"><div class="gtl_ico_{type}"></div>{loadIcon}{msgHtml}<div class="gtl_end"></div></div>',loading = '<img src="http://' + (window.g_ImgCacheDomain || 'qzonestyle.gtimg.cn') + '/qzonestyle/qzone_client_v5/img/loading.gif" alt="" />',typeClass = {0:"hits",1:"hits",2:"hits",3:"hits",4:"succ",5:"fail",6:"clear"},mBox,tips;
	mBox = QZFL.dom.get("q_Msgbox") || QZFL.dom.createElementIn("div", document.body, false, {style:"height:0px;"});
	mBox.id = "q_Msgbox";
	mBox.style.display = "";
	mBox.innerHTML = QZFL.string.format(template, {type:typeof(type) == "number" ? (type > 6 ? typeClass[0] : typeClass[type]) : typeClass[0],msgHtml:msgHtml,loadIcon:type == 6 ? loading : ""});
	QZFL.widget.msgbox._setPosition(mBox.firstChild, timeout, topPosition);
},_setPosition:function(tips, timeout, topPosition) {
	if (QZFL.userAgent.ie && QZFL.userAgent.ie < 7) {
		if (typeof topPosition != "number") {
			QZFL.dom.setStyle(tips, "top", (QZFL.dom.getClientHeight() / 2 + QZFL.dom.getScrollTop() - 40) + "px");
		}
	} else {
		QZFL.dom.setStyle(tips, "position", "fixed");
	}
	if (typeof(topPosition) == 'number') {
		QZFL.dom.setStyle(tips, "top", topPosition + "px");
	}
	clearTimeout(QZFL.widget.msgbox._timer);
	if (QZFL.widget.msgbox.useTween && QZFL.Tween) {
		var tween = new QZFL.Tween(tips, "opacity", QZFL.transitions.regularEaseIn, 0, 1, 0.25);
		tween.onMotionStart = function() {
			tips.style.display = "";
			if (timeout) {
				QZFL.widget.msgbox._timer = setTimeout(QZFL.widget.msgbox.hide, timeout);
			}
		};
		tween.onMotionStop = function() {
			tween = null;
		};
		tween.start();
	} else {
		tips.style.display = "";
		timeout && (QZFL.widget.msgbox._timer = setTimeout(QZFL.widget.msgbox.hide, timeout));
	}
},hide:function(timeout) {
	if (timeout) {
		clearTimeout(QZFL.widget.msgbox._timer);
		QZFL.widget.msgbox._timer = setTimeout(QZFL.widget.msgbox._hide, timeout);
	} else {
		QZFL.widget.msgbox._hide();
	}
},_hide:function() {
	var _mBox = QZFL.dom.get("q_Msgbox");
	clearTimeout(QZFL.widget.msgbox._timer);
	if (_mBox) {
		var _tips = _mBox.firstChild;
		if (QZFL.widget.msgbox.useTween && QZFL.Tween) {
			var tween = new QZFL.Tween(_tips, "opacity", QZFL.transitions.regularEaseOut, 1, 0, 0.75);
			tween.onMotionStop = function() {
				QZFL.dom.setStyle(_mBox, "display", "none");
				tween = null;
			};
			tween.start();
		} else {
			QZFL.dom.setStyle(_mBox, "display", "none");
		}
	}
}};
/*  |xGv00|8508181d9aa2efd281523ece018ed8ae */
(function(_wnd,_doc){var noShareDb=_wnd.QZONE&&QZONE.FrontPage&&QZONE.FrontPage.noShareDb;if(noShareDb&&noShareDb.get('_page_logo_hidden')){return;}
var className=".lay_copyright";(function(){var reg=/\/accessory\/page_logo\.js[?#]className=([^?&]+)/i;var scripts=document.getElementsByTagName("script");for(var i=0,mat,l=scripts.length;i<l;i++){mat=scripts[i].src.match(reg);if(mat&&mat[1]){className=mat[1];return;}}})();var cprt=$e(className).eq(0),psl,t,getCurURI=function(){return _wnd.g_iUin?'http%3A%2F%2Fuser.qzone.qq.com%2F'+_wnd.g_iUin+'%2F':encodeURIComponent(location.href);},ie=(QZFL.userAgent.ie?(_doc.documentMode&&parseInt(_doc.documentMode,10)?_doc.documentMode:0):100),w3cm='<a href="http://www.w3.org/" title="万维网联盟(W3C)成员 &#10;World Wide Web Consortium (W3C) member &#10;(点击这里跳转到万维网联盟英文官方网站)" target="_blank"><img id="w3c_logo" height="28" src="http://'+(_wnd.siDomain||'qzonestyle.gtimg.cn')+'/qzone_v6/gb/w3c/w3cmember_28.png" alt="W3C Logo" title="万维网联盟(W3C)成员 &#10;World Wide Web Consortium (W3C) member &#10;(点击这里跳转到万维网联盟英文官方网站)" style="vertical-align:middle;border:solid 1px #AAA;'+(ie>6?'border-radius:4px;':'border-left-width:0;')+'" /></a>',h5p='<a href="http://validator.w3.org/check?uri='+getCurURI()+'" target="_blank" title="本页面采用HTML5技术 &#10;HTML5 Powered &#10;(点击这里跳转到万维网联盟的HTML5规范验证页面)"><img id="html5_logo" height="28" src="http://'+(_wnd.siDomain||'qzonestyle.gtimg.cn')+'/qzone_v6/gb/w3c/html5_28'+(ie>6?'_bp':'')+'.png" title="本页面采用HTML5技术 &#10;HTML5 Powered &#10;(点击这里跳转到万维网联盟的HTML5规范验证页面)" alt="HTML5 Powered" style="'+(ie>6?'margin-right:3px;':'border:solid 1px #AAA;border-top-left-radius:4px;border-bottom-left-radius:4px;border-right-width:0;')+';vertical-align:middle;" /></a>',closeBtn='<a class="page_logo_btn_close" title="点击这里关闭图标" href="javascript:void(0);" onclick="return false;" style="color:gray;display:block;position:absolute;top:-5px;right:0;visibility:hidden;text-decoration:none;">×</a>';if(cprt){psl=_doc.createElement('div');psl.className='page_standard_logos';psl.style.cssText='text-align:center;padding:5px 0 5px;width:98px;position:relative;margin:0 auto;';psl.innerHTML=h5p+w3cm+(noShareDb?closeBtn:'');cprt.appendChild(psl);if(t=$e('.page_standard_logos .page_logo_btn_close').eq(0)){QZFL.event.addEvent(psl,'mouseover',function(){t.style.visibility="visible";});QZFL.event.addEvent(psl,'mouseout',function(){t.style.visibility="hidden";});QZFL.event.addEvent(t,'click',function(){psl.style.visibility='hidden';noShareDb&&noShareDb.set('_page_logo_hidden',true);setTimeout(function(){QZFL.dom.removeElement(psl);},100);});}}})(window,document);/*  |xGv00|8b328b764d877121d80f9ee89f867474 */