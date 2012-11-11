/*
jQuery Color Picker
--------------------------------------------------
Require:
	jquery.latest.js
	jquery.dimensions.js
--------------------------------------------------
Author: Zhiwei Ou <ouzhiwei@gmail.com>
*/

(function($) {

var imageDir = '/ddeditor/img/ddeditor/';
var $color_menu = $('<div id="menu_colorpicker"></div>');

$.fn.extend({
	//*******************************************************
	// 色選択Plugin
	//*******************************************************
	colorPicker: function (options) {

		return this.each(function() {
			$.colorInput.apply(this);
		});
	}
});

$.extend({
	//*******************************************************
	// 色入力機能の実現
	//*******************************************************
	colorInput: {
		currentBox:null,
		callBack:function(sColor){},
		//*******************************************************
		// 初期化
		//*******************************************************
		apply: function (input) {
			var $input = $(input);
			if(!$input.hasClass('jq_color_picker')) {
				if(!$input.attr('id')) {
					$input.attr('id', $(parent).attr('name'))
				}
				var inputId = $input.attr('id');
				$.colorInput._createSampleBox($input);
				$input.addClass('jq_color_picker');
			}
		},
		//*******************************************************
		// メニュー表示/非表示
		//*******************************************************
		toggleMenu: function($box, func) {
			$.colorInput.currentBox = $box;
			$.colorInput.callBack = func;
			if($color_menu.hasClass('ready')) {
				var pos = $.colorInput._getMenuPos($box, $color_menu);
				$color_menu.css('position', 'absolute').css(pos);
				$color_menu.toggle();
			} else {
				$.colorInput.initColorMenu();
			}
		},
		//*******************************************************
		// 色サンプルボックス作成
		//*******************************************************
		 _createSampleBox: function($input) {
		  	var sColor = $input.val();
		  	if(!sColor.match('^#[0-9A-Fa-f]+')){
		  		sColor = '';
		  	}
			var boxId = $input.attr('id') + '_colorbox';
		  	var $box = $('<span id="' + boxId + '">&nbsp;&nbsp;&nbsp;&nbsp;</span>');
			$box.css({
				'background-color': sColor,
				'width':'30px',
				'height':$input.height(),
				'border': '1px solid #333',
				'margin-left': '4px',
				'cursor': 'default'
			});
			$box.css('height', $input.height() + 2);
			$box.input = $input;
		  	$input.after($box);
		  	$box.click(function(){
				if($input.attr('disabled')) {
					return;
				}
		  		$.colorInput.toggleMenu($box, $.colorInput._updateColor);
		  	});
			$box.input.change(function() {
			  	var sColor = $(this).val();
			  	var sTitle = sColor;
			  	if(!sColor.match('^#[0-9A-Fa-f]{3,6}$')){
			  		sColor = '';
			  		sTitle = '';
			  	}
				$box.css('background-color', sColor).attr('title', sTitle);
			});
		},
		//*******************************************************
		// 入力フィールド更新
		//*******************************************************
		 _updateColor: function(sColor) {
			$.colorInput.currentBox.input.val(sColor || '').trigger('change').triggerHandler('blur');
		},
		//*******************************************************
		// 表示位置の取得
		//*******************************************************
		 _getMenuPos: function($box, $color_menu) {
			var pos = $box.offset();
			pos.top += $box.height();
			if((pos.left + $color_menu.width()) > $(window).width()) {
				pos.left -= $color_menu.width();
			}
			if((pos.top + $color_menu.height()) > $(window).height()) {
				pos.top -= $color_menu.height();
			}
			return pos;
		},
		//*******************************************************
		// 色選択
		//*******************************************************
		initColorMenu: function() {
			var closeImg = '<img src="' + imageDir  + 'cross.gif" alt="閉じる">';
			var hex  =  ["00", "33", "66", "99", "CC", "FF"];
			var width = hex.length * 3;
			sHtml = '<table cellspacing="2"><tbody>';	
			sHtml += '<tr height="18">'
				   + '<td colspan="3"><label id="colorpicker_preview"></label></td>'
				   + '<td colspan="'+(width-6)+'" align="left"><label id="colorpicker_value" style="font-size:small;"></label></td>'
				   + '<td colspan="3" align="right"><div id="colorpicker_close">' + closeImg + '</div></td>'
				   + '</tr>'
				   + '<tr>';
			var count = 0;
			for(var r=0; r< hex.length; r++){
				for(var g=0; g < hex.length; g++){
					if(count == width) {
						sHtml += "</tr><tr>";
						count = 0;
					}
					for (var b=0;  b< hex.length;  b++){
						var color  =  '#' + hex[r] + hex[g] + hex[b];
						sHtml += '<td class="colorPicker" title="'+color+'" style="background-color:'+color+'" width="14" height="14"></td>';
						count++;
					}
				}
			}
			sHtml += '</tr><tr>';
			hex  =  '0123456789ABCDEF'.split(''); 
			for(var i=0; i < hex.length; i++) {
				var color  =  '#' + hex[i] + hex[i] + hex[i] + hex[i] + hex[i] + hex[i];
				sHtml += '<td class="colorPicker" title="'+color+'" style="background-color:'+color+';" height="14"></td>';
			}
			var colspan = width - i;
			if(colspan > 0) {
				sHtml += '<td colspan="'+colspan+'" align="center" class="colorPicker" title="" style="font-size:small;cursor:default;">自動</td>'
			}
			sHtml += "</tr>";
				   + '</tbody></table>';
				   + '</div>';

			$color_menu.html(sHtml).appendTo('body').css({
				'position':'absolute',
				'display': 'none',
				'z-index':'10000',
				'background-color': '#FFF',
				'border': '1px solid #333',
				'padding': '1px',
				'overflow': 'auto'
			}).addClass('ready');
			
			if($.colorInput.currentBox) {
				var pos = $.colorInput._getMenuPos($.colorInput.currentBox, $color_menu);
				$color_menu.css('position', 'absolute').css(pos);
				$color_menu.slideDown('fast');
			}
			
			$('#colorpicker_close').click(function(){
				$color_menu.hide();
				if($.colorInput.currentBox.input) {
					$.colorInput.currentBox.input.focus();
				}
			});
			$('td.colorPicker').mouseover(function() {
				var sColor = $(this).attr('title');
				$('#colorpicker_value').text(sColor || '自動');
				$('#colorpicker_preview').parent().css('background-color', sColor);
			}).bind('click', function() {
				$color_menu.hide();
				var sColor = $(this).attr('title');
				$.colorInput.callBack(sColor);
			});
		}
	}
});
})(jQuery);
