valueChain.tool={
	initConsole:function(){
        if (!window.console) console = {log: function() {}}
   	},
    extractErrorMsg :function(responseString) {
        var errorMsg = '', isxml = true;
        try {
            $(responseString).find("ErrorMsg").text();
        } catch(e) {
            isxml = false;
        }
        if (isxml) {
            errorMsg = $(responseString).find("ErrorMsg").text();
        }else{
            errorMsg = responseString;
        }
        return errorMsg;
    },

    callService:function(opt){
    	opt = $.extend({
            url : "",
            soapAction : "",
            data : "",
            success : function(response, textStatus, jqXHR) {
                console.log(response);
            },
            error : function(jqXHR, textStatus, errorThrown) {
                console.log(errorThrown);
            },
            beforeSend : function(){
                valueChain.tool.loading.show();
            },
            complete : function(){
                valueChain.tool.loading.hide();
            }
        },opt || {});
        //console.log("--------Start calling web service. Time:"+new Date().getTime()+", URL:"+opt.url);
        $.ajax({
            url : opt.url+"?nocache="+new Date().getTime(),
            type : "POST",                            
			contentType : "text/xml; charset=\"utf-8\"",
			dataType : "xml",
			beforeSend: opt.beforeSend,
			complete:opt.complete,
			data : opt.data,
            success : function(responseString, textStatus, jqXHR){
            	//console.log("--------End calling web service. Time:"+new Date().getTime()+", URL:"+opt.url);
            	opt.success(responseString, textStatus, jqXHR);
            	//console.log("--------End processing web service. Time:"+new Date().getTime()+", URL:"+opt.url);
            },
            error : opt.error
        });
    },
    callServiceNoLoadingShow:function(opt){
    	opt = $.extend({
            url : "",
            soapAction : "",
            data : "",
            success : function(response, textStatus, jqXHR) {
                console.log(response);
            },
            error : function(jqXHR, textStatus, errorThrown) {
                console.log(errorThrown);
            },
            beforeSend : function(){
            },
            complete : function(){
            }
        },opt || {});
        $.ajax({
            url : opt.url+"?nocache="+new Date().getTime(),
            type : "POST",                               
			contentType : "text/xml; charset=\"utf-8\"",
			dataType : "xml",
			beforeSend: opt.beforeSend,
			complete:opt.complete,
			data : opt.data,
            success : opt.success,
            error : opt.error
        });
    },
	/*Utility for page loading*/
	loading : {
		/*Show the page loading mask*/
		show : function(opt) {
			// 'use strict';
            opt = $.extend({
                msg : "Loading..." 
            }, opt || {});

            $('.ess-loading-mask, .ess-loading-indicator-wrapper').remove();
            var $wrapper = $("<div class='ess-loading-indicator-wrapper'></div><div class='ess-loading-mask'>"+opt.msg+"</div>");
            $wrapper.appendTo('body');
            valueChain.tool.loading.position();
		},
		/*Hide the page loading mask*/
		hide : function() {
			// 'use strict';
			$(".ess-loading-mask, .ess-loading-indicator-wrapper").css('opacity', '0').css('width', '0px').css('height', '0px');
		},
		position : function() {
			// 'use strict';
			if($('.ess-loading-mask').width() > 0){/*$('.ess-loading-mask').width()  will return null if mask not exist*/
				$('.ess-loading-mask').css({
					position : 'absolute',
					left : ($(window).width() - $('.ess-loading-mask').outerWidth()) / 2,
					top : ($(window).height() - $('.ess-loading-mask').outerHeight()) / 2
				});
				$('.ess-loading-indicator-wrapper').css({
					width : $(window).width(),
					height : $(window).height()
				});
			}
		}
	},
	/*Utility for page message*/
	message : {
		/*Show the page loading mask*/
		show : function(opt) {

            $('.message, .message-indicator-wrapper').remove();
            var $wrapper = $("<div class='message-indicator-wrapper'></div><div class='message'>"+opt+"</div>");
            $wrapper.appendTo('body');
            valueChain.tool.message.position().fadeIn();
            setTimeout(valueChain.tool.message.hide,3000);
		},
		/*Hide the page loading mask*/
		hide : function() {
			// 'use strict';
			$(".message, .message-indicator-wrapper").css('opacity', '0').css('width', '0px').css('height', '0px');
		},
		position : function() {
			// 'use strict';
			if($('.message').width() > 0){/*$('.ess-loading-mask').width()  will return null if mask not exist*/
				$('.message').css({
					position : 'absolute',
					left : ($(window).width() - $('.message').outerWidth()) / 2,
					top : ($(window).height() - $('.message').outerHeight()) / 2
				});
				$('.message-indicator-wrapper').css({
					width : $(window).width(),
					height : $(window).height()
				});
			}
		}
	},
	
	alertInfo:function(str){
		alert(
                str,
                callback,   // callback
                "Information",      // title
                "OK"  // buttonName
            );
          function callback(){
          	
          }
	},
	alertWarning:function(str){
		alert(
                str,
                callback,   // callback
                "Warning",      // title
                "OK"  // buttonName
            );
          function callback(){
          	
          }
	},
	alertSucceed:function(str){
		alert(
                str,
                callback,   // callback
                "Success",      // title
                "OK"  // buttonName
            );
          function callback(){
          	
          }
	},
	readableAddress : function(arr){
		var res = "";
		if($.isArray(arr)){
			$.each(arr,function(index,val){
				if(val != undefined && val != null && val != ""){
					if(index != arr.length-1){
						res = res + val +", ";
					}else{
						res = res + val;
					}
				}
			});
		}
		return res;
	}
};
