if( typeof valueChain === "undefined" || !valueChain) {
    /**
     * If valueChain is already defined, the
     * existing valueChain object will not be overwritten so that defined
     * namespaces are preserved.
     * @static
     */
    var valueChain = {};
}

valueChain.ws = {
	url : {								
		GET_CUSTOMER_REVENUE_STATISTIC : "http://12.154.232.121:8002/soa-infra/services/default/GetCustomerAllRevenue/getcustomerallrevenuebpelprocess_client_ep",
		GET_CUSTOMER_REVENUE : "http://12.154.232.121:8002/soa-infra/services/default/GetCustomerRevenue/GetCustomerRevenueMed_ep",
		GET_HISTORICAL_QUOTES : "http://12.154.232.121:8002/soa-infra/services/default/GetHistoricalQuotesWebService_v1/gethistoricalquoteswebservice_v1bpelprocess_client_ep",
		GET_VISIT_HISTORY : "http://12.154.232.121:8002/soa-infra/services/default/GetAsoVisitHistory/getasovisithistorybpelprocess_client_ep",
		CREATE_QUOTO : "http://12.154.232.121:8002/soa-infra/services/default/CreateQuoteWebService/CreateQuoteMed_ep",
		CREATE_MEETING: "http://12.154.232.121:8002/soa-infra/services/default/CreateMeetingMinutes/CreateMeetingMinutesMed_ep",
		FIND_MEETING: "http://12.154.232.121:8002/soa-infra/services/default/GetAsoFetchMeetingMinutes/getasofetchmeetingminutesbpelprocess_client_ep",
		GET_INTERESTED_ITEM:"http://12.154.232.121:8002/soa-infra/services/default/GetPreferredItemsWebService/GetPreferredItems_ep"
	},

	/**
	 * The soapAction used when invoke jquery ajax request.
	 * @type {Object.<string>}
	 * @const
	 */
	soapAction : {

		GETHISTORICALQUOTES : "process",
		GETCUSTOMERREVENUE : "execute",
		GETCUSTOMERREVENUESTATISTIC : "process",
		GETVISITHISTORY : "process",
		FINDMEETING:"process",
		CREATEMEETING:"execute"

	},
	createUpdateMeetingMinutes :function(opt){
        opt = $.extend({
            salesName : "",
            constomerId : "",
            contactId:"",
            content : "",
            meetingId:"",
            orgId:"",
            userId:""           
        }, opt || {}); 

	    var request = '<soapenv:Envelope xmlns:soapenv="http://schemas.xmlsoap.org/soap/envelope/" xmlns:sin="http://xmlns.oracle.com/singleString">'+
        '<soapenv:Header/>'+
        '<soapenv:Body>'+
        '<sin:InputParameters>'+
        '<sin:P_IN_SALESREP_NAME>'+opt.salesName+'</sin:P_IN_SALESREP_NAME>'+
        '<sin:P_IN_CUST_ACCT_ID>'+opt.constomerId+'</sin:P_IN_CUST_ACCT_ID>'+
        '<sin:P_IN_CUST_CONTACT_ID>'+opt.contactId+'</sin:P_IN_CUST_CONTACT_ID>'+
        '<sin:P_IN_MEETING_MINUTES>'+opt.content+'</sin:P_IN_MEETING_MINUTES>'+
        '<sin:P_IN_MEETING_MINUTES_ID>'+opt.meetingId+'</sin:P_IN_MEETING_MINUTES_ID>'+
        '<sin:P_IN_ORG_ID>'+opt.orgId+'</sin:P_IN_ORG_ID>'+
        '<sin:P_USER_ID>'+opt.userId+'</sin:P_USER_ID>'+        
        '</sin:InputParameters>'+
        '</soapenv:Body>'+
        '</soapenv:Envelope>';
        return request; 
	},
	findMeetingMinutes:function(opt){
	    opt = $.extend({
            salesName : "",
            constomerId : "",
            contactId : "",
            createDate:"",
            orgId:204
        }, opt || {}); 

        var request = '<soapenv:Envelope xmlns:soapenv="http://schemas.xmlsoap.org/soap/envelope/" xmlns:xxas="http://xmlns.oracle.com/pcbpel/adapter/db/APPS/BPEL_GETASOFETCHMEETINGMINUTES/XXASO_MEETING_MINUTES_PKG_V1-24/">'+
        '<soapenv:Header/>'+
        '<soapenv:Body>'+
        '<xxas:InputParameters>'+
        '<xxas:P_IN_SALESREP_NAME>'+opt.salesName+'</xxas:P_IN_SALESREP_NAME>'+
        '<xxas:P_IN_CUST_ACCT_ID>'+opt.constomerId+'</xxas:P_IN_CUST_ACCT_ID>'+
        '<xxas:P_IN_CUST_CONTACT_ID>'+opt.contactId+'</xxas:P_IN_CUST_CONTACT_ID>'+
        '<xxas:P_IN_CREATION_DATE>'+opt.createDate+'</xxas:P_IN_CREATION_DATE>'+
        '<xxas:P_IN_ORG_ID>'+opt.orgId+'</xxas:P_IN_ORG_ID>'+        
        '</xxas:InputParameters>'+
        '</soapenv:Body>'+
        '</soapenv:Envelope>';
        return request; 
	},
	getHistoricalQuotesRequest : function(opt) {
        // 'use strict';
        opt = $.extend({
            accountId : ""
        }, opt || {});
        var request = '<soapenv:Envelope xmlns:soapenv="http://schemas.xmlsoap.org/soap/envelope/" xmlns:xx="http://xmlns.oracle.com/pcbpel/adapter/db/APPS/BPEL_GETHISTORICALQUOTESWEBSER/XX_GET_HISTORICAL_QUOTE_PKG_V/">'+
        '<soapenv:Header/>'+
        '<soapenv:Body>'+
        '<xx:InputParameters>'+
        '<xx:P_IN_CUST_ACCOUNT_ID>'+opt.accountId+'</xx:P_IN_CUST_ACCOUNT_ID>'+
        '</xx:InputParameters>'+
        '</soapenv:Body>'+
        '</soapenv:Envelope>';
        return request; 
    },
    getCreateQuotoRequest : function(opt){
    	var template = Handlebars.compile($("#create-quoto-request-template").html());
    	return template(opt);
    },
    getGetInterestedProd : function(opt){
    	var template = Handlebars.compile($("#get-interested-item-request-template").html());
    	return template(opt);
    },
    getVisitHistoryRequest:function(opt){
    	 opt = $.extend({
            name : "",
            customerAccId:"",
            customerContactId:"",
            orgId:""
        }, opt || {});
        var request = '<soapenv:Envelope xmlns:soapenv="http://schemas.xmlsoap.org/soap/envelope/" xmlns:xxas="http://xmlns.oracle.com/pcbpel/adapter/db/APPS/BPEL_CALLASOVISITHISTORYDB1/XXASO_VISIT_HISTORY_PKG-24VISIT/">'+
  		'<soapenv:Header/>'+
  		'<soapenv:Body>'+
     	'<xxas:InputParameters>'+
        '<xxas:P_IN_SALESREP_NAME>'+opt.name+'</xxas:P_IN_SALESREP_NAME>'+
        '<xxas:P_IN_CUST_ACCT_ID>'+opt.customerAccId+'</xxas:P_IN_CUST_ACCT_ID>'+
        '<xxas:P_IN_CUST_CONTACT_ID>'+opt.customerContactId+'</xxas:P_IN_CUST_CONTACT_ID>'+
        '<xxas:P_IN_ORG_ID>'+opt.orgId+'</xxas:P_IN_ORG_ID>'+
     	'</xxas:InputParameters>'+
   		'</soapenv:Body>'+
		'</soapenv:Envelope>';
		return request;
    },
    getCustomerRevenueRequest:function(opt){
    	opt = $.extend({
            customerAccId : ""
        }, opt || {});
    	var requtest ='<soapenv:Envelope xmlns:soapenv="http://schemas.xmlsoap.org/soap/envelope/" xmlns:sin="http://xmlns.oracle.com/singleString">'+
   		'<soapenv:Header/>'+
   		'<soapenv:Body>'+
      	'<sin:InputParameters>'+
        '<sin:P_IN_CUST_ACCOUNT_ID>'+opt.customerAccId+'</sin:P_IN_CUST_ACCOUNT_ID>'+
      	'</sin:InputParameters>'+
   		'</soapenv:Body>'+
		'</soapenv:Envelope>';
		return requtest;
    },
    getCustomerStatisticRevenueRequest:function(opt){
    	opt = $.extend({
            customerAccId : ""
        }, opt || {});
    	var requtest ='<soapenv:Envelope xmlns:soapenv="http://schemas.xmlsoap.org/soap/envelope/" xmlns:xx="http://xmlns.oracle.com/pcbpel/adapter/db/APPS/BPEL_GETCUSTOMERALLREVENUE1DB/XX_GET_CUST_ALL_REVENUE_PKG-24G/">'+
   		'<soapenv:Header/>'+
   		'<soapenv:Body>'+
      	'<xx:InputParameters>'+
        '<xx:P_IN_CUST_ACCOUNT_ID>'+opt.customerAccId+'</xx:P_IN_CUST_ACCOUNT_ID>'+
      	'</xx:InputParameters>'+
   		'</soapenv:Body>'+
		'</soapenv:Envelope>';
		return requtest;
    }

};