//2012-12-14
//by:zhj

//微软时间格式转换函数
function MSTimeFormat (input, strict) {
    // note: the timezone offset is ignored since the MS Ajax server sends
    // a UTC milliseconds-since-Unix-epoch value (negative values are allowed)
    var re = new RegExp('\\/Date\\(([-+])?(\\d+)(?:[+-]\\d{4})?\\)\\/');
    var r = (input || '').match(re);
    //return r ? new Date(((r[1] || '') + r[2]) * 1) : null;
    return r ? new Date( r[2] * 1) : null;
}

function loadNews() {
    var url = 'News/NewsHandler.ashx';
    jQuery.ajax(url, {
        dataType: 'json',
        data: {
            request: 'querytopnews',
            top: 5
        },
        error: function () {
        },
        success: function (data, textStatus, jqXHR) {
            var news = data.ResultSet;
            var html = [];
            for (var i = 0; i < news.length; i++) {
                var ID = news[i].ID;
                var TITLE = news[i].TITLE;
                var DATE = news[i].POSTTIME;
                DATE = MSTimeFormat(DATE);
                DATE = DATE.getFullYear() + '-' + DATE.getMonth() + '-' + DATE.getDay();
                html.push("<li><a href='news/details.htm?id="+ ID +"' title='" + TITLE + "' target='_blank'>" + TITLE + "</a><span class='data'>" + DATE + "</span></li> ");
            }

            html = html.join('');

            $('#ulHotNews').html(html);
        }
    });
}

$(document).ready(function () {
    loadNews();
});

