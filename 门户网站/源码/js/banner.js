$QC = QQ_Connect = function(){};

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
		//debugger;
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
//debugger;
QQ_Connect.CarouselAd.init({
		revealtype : 'click',
		autoPlay : true,
		autoPlayInterval : 5000,
		duration : 500,
		btnItems : [{eid:'btn0'},{eid:'btn1'},{eid:'btn2'}],
		imgItems : [{imgid:'img0'},{imgid:'img1'},{imgid:'img2'}],
		clickIndex : 0,
		index : 0,
		direction : 'l2r'/*,
		container : $("ca_container")*/
});