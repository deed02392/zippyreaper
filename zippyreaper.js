// ZippyReaper
// @author George Hafiz

var tickimg = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAACmklEQVR4XqWT60tTcRyH+zt2znZsggQyohBBQqi9ChKJTbOhmJdlabqdXbzSNmPYTIsycl7GSCkts9Rqc05t6tTm1pQycdlRQsy96UK1YXSxTz/Oi5kkvvHFA+fFeZ4vv9s+AHviP6HAfzQ+d/qIIdubwmU8OxSRjUgiMnciJ3MlGtIdB+J3DeT5UuUKb3JY71XgTsiKvuUuns7FZpS4T0Lay4SlPYx8xwCZKs8cT4remDPBtdoP+5ubMM9V8pBvOFf70DhThcN2YTTZLpRvC+R4U8SZnqR1IvM/1gTLUBEogXbmPPSEckK1/wIc7x7iylQFJFZ6XXKLFscCCk+SkR3L4icTmRdZ31mopguhmiqAZqoQnrVBGH1qOEkkt+c4Eq7TxlggY0TCdYaaYQs1ocJfDPVzJRHzoZ4kePMx/t4NAAhH19D2qhH2uUbE1dNcLHDCkbDxeOUeaoNa6HxFZA8GsPh5HuxEIcbWhnj59+YvtL28CuNEMfpCnRCZqI1YQPqI2ehf7oYpwKI2oMPXH1946dP3DzHZOlsPjTsbBs859Ic6IKr5N9DDcLfnm9C+cA36SSUs/mpEf37j5c0/m7C+uIwyVxa0JNASrEO7zwKmitpaQupdkVE5kAbHygNUTyih8ZxB3XQ5lj4uoG22AaWDp6BynobelQPH226k246BqaS2NjHZJhQfJEdj8WrxhLuPytE86IZzwA4poHYSeDkbT5e6YBoqhkgjWGc0VOwYeRKbaHlcAxU1e8rgJJHWoAWG0SJcHFailSzBQWSDqwjCUkGUyPIdr/L+BlrOmKmwrEOK9oAFva9t6J23weozI60lFSKVIMywRN7tMTGX6HjGSBmYGooT6QQRESuIkIkcwcCUUjs+pj3xF2fQrOXD2GDaAAAAAElFTkSuQmCC';
var resultlinks = $('a')
	.filter(function() {
		return this.href.match(/zippyshare/);
	});
var zippylinkstd = /www(\d{1,3})\.zippyshare\.com\/view\.jsp\?locale=[A-Za-z]+&key=(\d+)/;
var zippylinkshort = /www(\d{1,3})\.zippyshare\.com\/v\/(\d+)\/file\.html/;
var deadexp = /File does not exist on this server/;
var zippyuri = 'http://www%server%.zippyshare.com/v/%key%/file.html';
var zippylinks = [];
var zippylink = '';

$.each(resultlinks, function(k, v)
	{
		var matches = [];
		if(zippylinkstd.test(v.href))
		{
			matches = zippylinkstd.exec(v.href);
			zippylink = zippyuri;
			zippylink = zippylink.replace('%server%', matches[1]);
			zippylink = zippylink.replace('%key%', matches[2]);
			v.href = zippylink; // rewrite to short for later fixing
			zippylinks.push(zippylink);
		}
		else if(zippylinkshort.test(v.href))
		{
			matches = zippylinkshort.exec(v.href);
			zippylink = zippyuri;
			zippylink = zippylink.replace('%server%', matches[1]);
			zippylink = zippylink.replace('%key%', matches[2]);
			zippylinks.push(zippylink);
		}
	}
);

$.each(unique(zippylinks), function(k, zippysharelink)
	{
		$.get(
			zippysharelink,
			function(data) {
				if(deadexp.test(data))
				{
					// format dead link
					$.each(resultlinks, function(k, pagelink)
						{
							if(zippysharelink == pagelink.href)
							{
								pagelink.style.textDecoration = 'line-through';
								pagelink.style.color = '#ccc';
							}
						}
					);
				}
				else
				{
					// alive!
					$.each(resultlinks, function(k, pagelink)
						{
							if(zippysharelink == pagelink.href)
							{
								tick = document.createElement('img');
								tick.alt = 'Zippyshare link alive!';
								tick.src = tickimg;
								
								pagelink.parentNode.insertBefore(tick, pagelink);
							}
						}
					);
				}
			}
		);
	}
);

function unique(array){
  var b = [];
  for(var i=0; i<array.length; i++){
     if(b.indexOf(array[i]) == -1) b.push(array[i]);
  }
  return b;
}