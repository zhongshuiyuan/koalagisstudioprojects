/**
 * Method: 初始化酒店住宿面板
 * Parameters:
 *   panel - {FuncPanel}
 */
function FillTourPanelContent(panel){
	var html = '<div id="hotelsearchli_con" class="menucontainer">' + 
				  '<div id="hotelsearch_con" class="bus">' + 
					'<table>' + 
					   '<tbody>' + 
						  '<tr>' +
							'<td>在</td>' +
							'<td>' + 
							  '<select name="hotelContent">' + 
								'<option value="全部" selected="selected">全部</option>' +
								'<option value="快捷酒店">快捷酒店</option>' +
								'<option value="星级酒店">星级酒店</option>' +
								'<option value="旅馆">旅馆</option>' +
								'<option value="度假村">度假村</option>' +
								'<option value="五星级">五星级</option>' +
								'<option value="四星级">四星级</option>' +
								'<option value="三星级">三星级</option>' +
								'<option value="招待所">招待所</option>' +
								'<option value="青年旅舍">青年旅舍</option>' +
								'<option value="如家">如家</option>' +
								'<option value="锦江之星">锦江之星</option>' +
								'<option value="汉庭">汉庭</option>' +
								'<option value="7天">7天</option>' +
								'<option value="莫泰168">莫泰168</option>' +
								'<option value="速8">速8</option>' +
								'<option value="格林豪泰">格林豪泰</option>' +
							  '</select>中寻找' +
							'</td>' +
							'<td></td>' +
						  '</tr>' +
						  '<tr>' +
							'<td colspan="2">' +
								'<input id="hotelCon" type="text" value="" />' +
							'</td>' +
							'<td align="center" valign="middle">' +
								'<input id="hotelSearch" type="button" value="搜索" />' +
							'</td>' +
						  '</tr>' +
						'</tbody>' +
					 '</table>' +
				  '</div>' +
				'</div>';

}