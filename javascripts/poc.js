var JSON_SERVER = "";
var TESTING = false,allCategory = [];networkStatus="online";
        // TESTING = true;
var categoryname="",notesVisitTime,productNameArray,allProducts=[],previousPage,newsTopic,pushpinCompanyId="",isClickPushpin=false, mapLoaded = false;isClickFromContactPage = false;
var isClickFromCart=false;
var consumer_key = "247fmvid6e8k";
var shared_secret = "4WWHRnj9YbTsw4cr";
var callbackUrl = "http://ec2-75-101-169-93.compute-1.amazonaws.com:8080/callback.html";
var oauth_info = {};
var jive_img_url = "https://sandbox.jiveon.com/gadgets/proxy?container=default&gadget=http%3A%2F%2Fapphosting.jivesoftware.com%2Fapps%2Fdev%2Fvaluechain_poc%2Fapp.xml&debug=0&nocache=1&html_tag_context=img&url=http%3A%2F%2Fapphosting.jivesoftware.com%2Fapps%2Fdev%2Fvaluechain_poc%2Fimages%2F";
var oauth = OAuthSimple(consumer_key, shared_secret);
var product={  
    id:0,  
    name:"",  
    num:0,  
    price:0.00,
    quoted:0.00,
    orgQuoted:0.00,
    pic:""
};  
var orderdetail={  
    username:"",  
    phone:"",  
    address:"",  
    zipcode:"",  
    totalNumber:0,  
    totalAmount:0.00,
    totalQuoted:0.00     
};

var fakeQuotes = {
        "openQuotes" : 0,
        "completedQuotes" : 100
};

var customerAppendix = {
        "avatar": "logo.png",
        "lat":37.42,
        "lng":-122.08,
        "contact":"(212) 210 -2100",
        "fullRates":"66%",
        "revenue":"200",
        "openQuotes":0,
        "completedQuotes":0,
        "industry":"Search Engine"
};
$.ajaxSetup({
        headers : {
                "x-li-format" : "json"
        }
});
var linkedInIds = ["t_HizPsSCe","CCrrwLl_xe","DXDOEWcGm1","kZIdxc9AWg","VmJyNRr9mh","poiiRe9DzE","N2BsNAK1yA","BSuZfDRU3y"];
var OPEN_STATUS_LIST = ["Draft"], CLOSED_STATUS_LIST = ["Accepted"]; 
var currentContact={};
var contactList=[];
var notesItem={};
var service = {
        revenue: {
                "customer-id" : "rev", //sample:1001:200
        },
        historicalQuotes:{
                "customer-id":{},//sample:1001:[quotes]
        },
        status:{
                "customer-id":{},//sample:1001:[quotes]
        }
};
var app = {
        allProducts:{},
        categoryScroller :null,
        productScroller : null,
        searchScroller : null,
        $searchPrePage:null,
        ready : function() {
                app.bind();
                app.initScroller();
                app.loadCategory();
                app.loadProduct();
                app.loadcarouselScrolls();
                $(".contact-btn").hide();
                 utils.setParam("ShoppingCart","");
                 utils.setParam("QUTOLIST","");
        sdc.updateHistoryQuotes(fakeQuotes);                 
                 app.updateRevenue("all");
        },
        bind:function(){
                $("#btn-back-to-category").click(app.back2Category);
                $("#gotoCatalog").click(app.gotoCategory);
                $("#btn-back-to-product").click(app.back2Product);
                $(".btnTohome").click(app.backtoHome);
                $("#quotelist-back-btn").click(app.backtoPage);
                $("#btn-To-Cart").unbind("click").click(app.goToCart);
                
                $(".cartbutton-product").click(app.goToCart);
                $("#btn-back-to-details").click(app.backToDetails);
                $("#btn-add-Product").unbind("click").click(app.addProductToCart);
                $("#btn-back-search").click(app.searchBack);
                $(".search-input").keyup(app.searchProduct);
                $(".searchButton").click(app.searchProduct);
                $("#qutoed-Price").keypress(app.phoneKeyPressed);
        $("#qutoed-Price").keyup(app.updateDetailQuotedPrice).blur(app.updateDetailQuotedPrice);
        $("#quantity-num").keyup(app.updateDetailQuotedPrice).blur(app.updateDetailQuotedPrice);
        $("#search-img").click(app.searchProduct);
                $("#gotoQuote").click(app.go2Quote);
                $("#cart-contact-comp").change(app.updateCartContactNameList);
                $("#cart-contact-per").change(app.updateCartContactPerson);
                $("#request-quote").click(app.submitQuote);
                $("#email-quote").click(app.sendQuoteEmail);
        $("#industry-option").click(function(){
            var value = $("#industry-option").attr('data-attr');
            contact.buildNewsList(value);
        });
        $("#company-option").click(function(){
             var value = $("#company-option").attr('data-attr');
            contact.buildNewsList(value);
        });
        
        $(".ui-listview-filter input.ui-input-text ").keyup(function(){
           sdc.refresh(); 
        });
                // $("#historical-quotes").click(quoto.onCallHistoricalQuotesWebService);
                
                //$("#news-select").change(app.switchNewsFeeds);
        },
        onServiceError : function(jqXHR, textStatus, errorThrown) {
                console.log("Error. Response:" + jqXHR.responseText);
        },
        cartOwner:function(){
            var valueContent = $(".currentContact").text();
            if(valueContent =="" || valueContent==undefined){
                $(".contact-btn").hide();
            }else{
                $(".contact-btn").show();
            }
        },
        getServerTime:function(){
            var offset = moment().zone()-240;
            var currentTime =  moment().add('minutes', offset).format('YYYY-MM-DD,HH:mm:ss');
            return currentTime;
        },
        phoneKeyPressed :function(e){
            var $val =$(e.target).val();
        if ($(e.target).hasClass('quote-float-input')) {
            if(event.which < 46 || event.which >57 || event.which==47 ){
                event.preventDefault();
            }
            if(event.which == 46 && $(e.target).val().indexOf('.')!=-1)
            {
                event.preventDefault();
            }
        }
        },
    onPhoneKeyup : function(e) {
        var $val =$(e).val();
        if ($(e).hasClass('quote-count-input')) {
            var replaced = "", reg = /[^\d]/g;
            replaced = $val.replace(reg, "");
            if (replaced !== $val) {
                $(e).val(replaced);
            }
        }
    },
    loadCurrentContact:function(){
            var value =  utils.getParam("currentContact");
               if(value !=undefined && value !=""){
                       var jsonstr = JSON.parse(value.substr(1,value.length));  
                   $(".currentContact").text(jsonstr.Contact_First_Name);
               }
               else{
                       $(".currentContact").text("");
               } 
               app.cartOwner();
    },
    searchBack:function(){       
        app.changePage($("#product-search-page"),$searchPrePage);
    },

    showSearchResult:function(content) {
        $("#search-list").find("li.search-item").remove();
        var searchResult = [];
        var startIndex = 0;
        for (var i = 0; i < allProducts.length; i++) {
            if (allProducts[i].Category_Name.toLowerCase().indexOf(content.toLowerCase()) != -1 || allProducts[i].Item_Number.toLowerCase().indexOf(content.toLowerCase()) != -1 || allProducts[i].Item_Description.toLowerCase().indexOf(content.toLowerCase()) != -1 || allProducts[i].Item_Feature.toLowerCase().indexOf(content.toLowerCase()) != -1) {
                searchResult[startIndex] = allProducts[i];
                startIndex++;
            }
        }

        if (searchResult.length > 0) {
            $(".na").addClass('hidden');
            $(".no").removeClass('hidden');
            $(".popover").removeClass("active").attr("display", "none");
            $("#search-list").find("li.search-item").remove();
            var $prod = $("#search-list");
            $.each(searchResult, function(index, val) {
                var $feed = $("#search-feed").clone();
                $feed.find("img").attr("src", jive_img_url + val.Item_Image[0]);
                $feed.find(".title-wrapper").html(val.Item_Number);
                $feed.find(".desc-wrapper").html(val.Item_Description);
                $feed.find(".search-item-category span").html(val.Category_Name);
                $feed.data("PRODUCT", val);
                $prod.append($feed.removeClass("hidden").addClass("search-item"));
            });
            var toRemove = $("#search-feed").remove();
            $prod.find("li:nth-child(4n)").css("margin-right", 0);
            $prod.find("li").click(app.onProductClick);
            $prod.append(toRemove);
            app.refresh();
        }else{
            $(".na").removeClass('hidden');
            $(".no").addClass('hidden');
        }
    },

        searchProduct:function() {
        var $currentPage = $(".page:not(:hidden)");         
        var content = $currentPage.find($(".search-input")).closest("input").val();
        if (content != "" && content != undefined) {
            app.showSearchResult(content);
            $currentPage.find($(".none-search")).addClass('hidden');
            $(".no").appendTo($currentPage);
            $(".na").appendTo($currentPage);
        } else {
            $(".no").appendTo($("#product-search-page"));
            $(".na").appendTo($("#product-search-page"));
            $(".none-search").removeClass('hidden');
        }
        app.refresh();
            // if ($currentPage[0] != $("#product-search-page")[0]) {
               // if (event.keyCode == 13||event.keyCode == 0) {
                // $searchPrePage = $currentPage;
                // var inputValue = $currentPage.find($(".search-input")).val();
                // if (inputValue != undefined && inputValue != '') {
                    // $("#product-search-page").find($(".search-input")).val(inputValue);
                    // $(".page:not(:hidden)").hide();
                    // $("#product-search-page").removeClass("hidden").show();
                    // $currentPage.find($(".search-input")).val('');
                    // $(".search-input").blur();
                    // app.showSearchResult();
                // }
           // }
            // } else{
                // app.showSearchResult();
            // }
        },
        addProductToCart:function(){
          var item = product;
          var obj =  $("#product-detail-page").data("productitem");
          item.id =obj.Item_Id;
          item.name=obj.Item_Number;
          item.pic = obj.Item_Image[0];
          var price =$("#prod-price").text();
          item.price = Number(price.replace(/\$/g,""));
          var quotedPrice = $("#qutoed-Price").val();
          item.quoted = Number(quotedPrice);
          if(Number(item.quoted) == undefined || Number(item.quoted)=="" || Number(item.quoted)==0){
                  valueChain.tool.alertInfo("Please input quoted price");
                  return;
          }
          item.orgQuoted = item.quoted;         
          var quantity = $("#quantity-num").val();
          item.num = Number(quantity) ;
          if(Number(item.num) == undefined || Number(item.num)=="" || Number(item.num)==0){
              // if(item.quoted ==0 ||item.quoted==""||item.num == undefined){
                   // alert("Please input quantity");   
                    valueChain.tool.alertInfo("Please input quantity");        
              // }else
              // {
                  // // cart.addproduct(item);
                  // // alert("Quoted price updated");          
              // }
             
          }else{
         cart.addproduct(item);
         
         valueChain.tool.alertSucceed(
                "Quantity "+item.num+' of Product \"'+item.name+"\" is added to cart."
            );
          }
        },
        minusProductCount:function(e){
           var cartItem = product;
           var $tr = $(this).closest("tr");
           cartItem = $tr.data("CARTITEM");
       if(cartItem.num > 1){
           cartItem.num = cartItem.num -1;
           $tr.data("CARTITEM",cartItem);
           app.updateCartItemStatus($tr);
           cart.updateproductnum(cartItem.id, cartItem.num);
           $("#total-tag").text(orderdetail.totalAmount);
           $("#total-quoted").text(orderdetail.totalQuoted); 
       } 
    },
    plusProductionCount:function(e){
       var cartItem = product;
       var $tr = $(this).closest("tr");
       cartItem = $tr.data("CARTITEM");
       if(cartItem.num < 1000){         
       cartItem.num = cartItem.num +1;
       $tr.data("CARTITEM",cartItem);
       app.updateCartItemStatus($tr);
       cart.updateproductnum(cartItem.id, cartItem.num);
       $("#total-tag").text(orderdetail.totalAmount);
       $("#total-quoted").text(orderdetail.totalQuoted); 
       }
    },
    cartProductionCountChange:function(e){
        app.onPhoneKeyup(e.target);
        var $tr = $(this).closest("tr");
        var $cartNum = $tr.find('.cart-text');
        var $cartQuote = $tr.find('.cart-qutoed-input');
        var cartItem = product;
            cartItem = $tr.data("CARTITEM");
        var quoteVal = Number($cartQuote.val());
 
        if(quoteVal!=0&&quoteVal!=undefined){
              if(quoteVal >cartItem.orgQuoted)
              {
                  $cartQuote.val(cartItem.orgQuoted);
              }
        }
        if($cartNum.val() !=""){ 
            if (Number($cartNum.val()) == 0) {
                $cartNum.val(1);
            }
           var inputValue = Number($cartNum.val());
           quoteVal = Number($cartQuote.val());
           cartItem.num = cartItem.num +(inputValue-cartItem.num);
           cartItem.quoted = quoteVal;
           $tr.data("CARTITEM",cartItem);
           app.updateCartItemStatus($tr);
           cart.updateproductnum(cartItem.id, cartItem.num);
           cart.updateproductquoted(cartItem.id,cartItem.quoted);
           $("#total-tag").text(orderdetail.totalAmount);
           $("#total-quoted").text(orderdetail.totalQuoted); 
        }
    },
    deleteProductItem:function(e){
        var cartItem = product;
        var $tr = $(this).closest("tr");
        cartItem =  $tr.data("CARTITEM");
        
        try{
                                confirm("Do you want to delete?",         
                                function(buttonIndex){
                            app.deleteConfirm(buttonIndex, $tr);
                        },"", "Yes,No");
                }catch(e){
                        if(confirm("Do you want to delete ?")){
                           cartItem.num = 0;
                           $tr.data("CARTITEM",cartItem);
                           app.updateCartItemStatus($tr);
                           cart.deleteproduct(cartItem.id);
                           $tr.remove();
                           $("#total-tag").text(orderdetail.totalAmount);
                           $("#total-quoted").text(orderdetail.totalQuoted); 
                }
                }
        if($('.cart_item').length<=0){
            $("#request-quote").addClass("qutoe-btn-disable");
            $("#request-quote").attr("disabled", "disabled"); 
        }
    },
    deleteConfirm : function(buttonIndex, object) {
        if (buttonIndex == 1) {
                var cartItem = product;
                cartItem =  object.data("CARTITEM");
        
                        cartItem.num = 0;
                   object.data("CARTITEM",cartItem);
                   app.updateCartItemStatus(object);
                   cart.deleteproduct(cartItem.id);
                   object.remove();
                   $("#total-tag").text(orderdetail.totalAmount);
                   $("#total-quoted").text(orderdetail.totalQuoted); 
                   
                   var ShoppingCart = utils.getParam("ShoppingCart");  
                var jsonstr = JSON.parse(ShoppingCart.substr(1,ShoppingCart.length));  
                var productlist = jsonstr.productlist; 
                if(productlist.length<=0){
                        $("#request-quote").addClass("qutoe-btn-disable");
                     $("#request-quote").attr("disabled","disabled");
                }
        } 
    },
    updateCartItemStatus:function($item){
        var cartItem = product;
        cartItem = $item.data("CARTITEM");
        if (cartItem.num > 1) {
            $item.find($(".minus")).removeClass("minus-off");
        }else
        {
             $item.find($(".minus")).addClass("minus-off");
        }
        if(cartItem.num ==1000)
        {
             $item.find($(".plus")).addClass("plus-off");
        }else
        {
            $item.find($(".plus")).removeClass("plus-off");
        }
        $item.find($(".cart-text")).val(cartItem.num);
        $item.find($(".cart-subtotal")).text(parseFloat((Number(cartItem.num) * cartItem.price).toFixed(2)));
        $item.find($(".cart-subqutoed")).text(parseFloat((Number(cartItem.num) * cartItem.quoted).toFixed(2)));
    },
    updateCartContactPerson:function(){
        var personSelected = $("#cart-contact-per option:selected").val();
                // $("#request-quote").show();
        $("#request-quote").removeClass("qutoe-btn-disable");
        $("#request-quote").removeAttr("disabled");
        if (personSelected == "" || personSelected == undefined) {
             $("#request-quote").addClass("qutoe-btn-disable");
             $("#request-quote").attr("disabled","disabled");
        }
        app.cartOwner();
    },
    updateCartContactNameList:function(){
        var compVal = $("#cart-contact-comp option:selected").val();
        if(compVal != "" && compVal != undefined){
            var contacts = contact.findContactsByCust(compVal);
                $("#cart-contact-per").html("<option value=''>Select a Contact</option>");
                $.each(contacts,function(index,val){
                        $("#cart-contact-per").append("<option data-first-name="+val.Contact_First_Name+" value="+val.Contact_id+">"+val.Contact_First_Name+" "+val.Contact_Last_Name+"</option>");
                });
                //select default contact
                if(contact.xCurrentContact != null){
                    $("#cart-contact-per").val(contact.xCurrentContact.Contact_id).change();
                    if( $("#cart-contact-per option:selected").text()==""){
                        $("#cart-contact-per").val("");
                    }
                }   
        }else{
             $("#cart-contact-per").html("<option value=''>Select a Contact</option>");
             // $("#request-quote").hide();
             $("#request-quote").addClass("qutoe-btn-disable");
             $("#request-quote").attr("disabled","disabled");
        }
         
    },
        showCart:function(){
            $("#product-cart-page tbody").html("");
            var productlist = cart.getproductlist();
            var i = 0;
            var total = 0,qutoed = 0;
            for (i in productlist)
            {
                var tag ="";
                var item = productlist[i];
                var subtotal =parseFloat((Number(item.num) *Number(item.price)).toFixed(2));
                
                var subqutoed =parseFloat((item.quoted *Number(item.num)).toFixed(2));
                    tag = "<tr class='cart_item'>" + ("<td><img src ='"+ jive_img_url + item.pic+"' width='40px' height='30px'></td>");
                tag += ("<td>" + (item.name ? item.name : "") + "</td>");
                tag += ("<td>" + (item.price ? "$"+item.price : "") + "</td>");
                tag += ("<td style='padding:2px'><input type='text' data-role='none' style='width: 80px;height:34px;text-align: center;border:1px solid #ccc' maxlength='10' placeholder=0 class='cart-qutoed-input quote-float-input' value="+(item.quoted ? item.quoted : "") + "></td>");
                tag += ("<td style='padding:2px'><span class='minus minus-off'></span><input type='text' class='cart-text quote-count-input' max-length='3' value=" + (item.num ? item.num : '') +"><span class='plus'></span></td>");
                tag += ("<td class='cart-subtotal'>" + (subtotal ? subtotal : "") + "</td>");
                tag += ("<td class='cart-subqutoed'>" + (subqutoed ? subqutoed : "") + "</td>");
                tag += ("<td><a href='#' class='delete_cartItem' >Delete</a></td>") + "</tr>";
                $("#product-cart-page tbody").append(tag);
                var $tag = $("#product-cart-page tbody tr:last-child");
                $tag.data("CARTITEM",item);
                $tag.find($(".minus")).click(app.minusProductCount);
                $tag.find($(".plus")).click(app.plusProductionCount);
                $tag.find($(".cart-text")).keyup(app.cartProductionCountChange);
                $tag.find($(".delete_cartItem")).click(app.deleteProductItem);
                // $tag.find($(".cart-qutoed-input")).keyup(app.cartProductionCountChange).blur(app.cartProductionCountChange);
                $tag.find($(".cart-qutoed-input")).keypress(app.phoneKeyPressed);
                $tag.find($(".cart-qutoed-input")).keyup(app.cartProductionCountChange);
                app.updateCartItemStatus($tag);
                total +=subtotal ? subtotal:0;
                qutoed +=subqutoed?subqutoed:0;
            }
            //loadcontact
            var y = 0;
            $("#cart-contact-comp").html("<option value=''>Select a Company</option>");
            $("#cart-contact-per").html("<option  value=''>Select a Contact</option>");
            $.each(sdc.customerList, function(index,val){
                    $("#cart-contact-comp").append("<option data-cust-acct-id="+val.CUST_ACCOUNT_ID+" data-party-site-id="+val.PARTY_SITE_ID+" value="+val.PARTY_ID+">"+val.PARTY_NAME+"</option>");
            });
            //select default customer
            if(contact.xCurrentCustomer != null){
                    $("#cart-contact-comp").val(contact.xCurrentCustomer.PARTY_ID).change();
            }else{
                $("#request-quote").addClass("qutoe-btn-disable");
                $("#request-quote").attr("disabled","disabled");
            }
            $("#product-cart-page tbody tr:odd").css('background','#EAF4FF');
            $("#total-tag").text(total);
            $("#total-quoted").text(qutoed);
            app.refresh();
        },
        submitQuote:function(){
                if(app.getNetworkStatus() == "offline"){
                    valueChain.tool.alertWarning("Network is not available, please check the Network settings");
                    return;
            }
                var success;
                function getPartyId(){
                        return $("#cart-contact-comp").val();
                }
                function getCustAcctId(){
                        return $("#cart-contact-comp option:selected").attr("data-cust-acct-id");
                }
                function getPartySiteId(){
                        return $("#cart-contact-comp option:selected").attr("data-party-site-id");;
                }
                function getContactId(){
                        return $("#cart-contact-per").val();
                }
                function getQuoteName(){
                        return $("#cart-contact-per option:selected").text();
                }
                function onBeforeSend(jqXHR, settings){
                        success = false;
                        valueChain.tool.loading.show();
                }
                function onSuccess(data, textStatus, jqXHR){
                        var errorMsg = "", quoteId = "";
                        try{
                                errorMsg = $.xml2json(data).Body.OutputParameters.Output_Message;
                                quoteId = $.xml2json(data).Body.OutputParameters.Quote_Number;
                        }catch(e){}
                        if(errorMsg != ""){
                                success = false;
                                // alert(errorMsg);
                                valueChain.tool.alertInfo(errorMsg);
                        }else{
                                success = true;
                                // alert("Quote "+quoteId+" Created.");
                                valueChain.tool.alertSucceed("Quote "+quoteId+" Created.");
                // app.go2QuoteFromCart(getCustAcctId());
           }
                }
                function onComplete(jqXHR, textStatus){
                        valueChain.tool.loading.hide();
                        if(success){
                                app.go2QuoteFromCart(getCustAcctId());        
                        }
                        // sdc.clearCurrentContact();
            utils.setParam("ShoppingCart", "");
                }
                function onError(jqXHR, textStatus, errorThrown){
                        
                }
            var perName = $("#cart-contact-per option:selected").val();
            var contactName = $("#cart-contact-per option:selected").text();
            var action = valueChain.ws.soapAction.GETHISTORICALQUOTES;
                var soapUrl = valueChain.ws.url.CREATE_QUOTO;
                var totalQuoted = $("#total-quoted").text();
                if(totalQuoted == 0){
                    // alert("Quoted Price should not be empty!");
                    valueChain.tool.alertInfo("Quoted Price should not be empty!");
                        return;
                }
        if (perName != "" && perName != undefined) {
            var qutoList = utils.getParam("QUTOLIST");
            var productlist = cart.getproductlist();
            var today = new Date();
            var currentTime = today.getDate() + "/" + (today.getMonth() + 1) + "/" + today.getFullYear();
            var company = $("#cart-contact-comp option:selected").text();
            var lineItem = {
                        itemId:1,
                        quantity:1,
                        price:22,
                        quotePrice:12
                };
            var option = {
                    quotoName:getQuoteName(),
                    customerId:getPartyId(),
                    custAcctId:getCustAcctId(),
                    contactId:getContactId(),
                    partySiteId:getPartySiteId(),
                    lineItems:[]
            };
            $.each(productlist,function(index,val){
                    var line = $.extend({},lineItem);
                    line.itemId = val.id;
                    line.quantity = val.num;
                    line.price = val.price;
                    line.quotePrice = val.quoted;
                    option.lineItems.push(line);
            });
            valueChain.tool.callService({
                                url : soapUrl,
                                soapAction : action,
                                beforeSend : onBeforeSend,
                                success : onSuccess,
                                error : app.onServiceError,
                                complete : onComplete,
                                data : valueChain.ws.getCreateQuotoRequest(option)
                        }); 
        } else {
            // alert("Please select Contact Person");
            valueChain.tool.alertInfo("Please select Contact Person");
        }

        },
        sendQuoteEmail:function(){
                 
                 var quote = $("#quote-email").data('QUOTECONTACT');
        var toEmail = '';
        var obj = $.grep(contact.allContacts, function(obj, index) {
            return (obj.Contact_id == quote.contactId);
        });
        var toEmail = obj[0].Contact_Email_Address;
        if (toEmail == undefined || toEmail == "") {
            toEmail = "testValueChain@google.com";
        }
        var quotehtml = "";
        var $quoteId = $("#quote-id").text();
        var $quoteItemTable = $(".quote-item-table").clone();
        $quoteItemTable.css('border-collapse', 'collapse');
       // $("table").css('border-spacing', '0');
        $quoteItemTable.find('th').css({
            'text-align' : 'center',
            'background' : '-webkit-gradient(linear, 0% 0%, 0% 100%, from(#fc5412), to(#fd682e))',
            'color' : 'white',
            'border' : '1px solid black',
            'border-bottom' : 'none',
            'border-right' : 'none',
            'height' : '30px',
            'font-size' : '12px'
        });
        $quoteItemTable.find('td').css({
            'text-align' : 'center',
            'border' : '1px solid black',
            'border-bottom' : 'none',
            'border-right' : 'none',
            'height' : '40px',
            'font-size' : '12px'
        });
        $quoteItemTable.find('th:last-child').css('border-right', '1px solid black');
        $quoteItemTable.find('td:last-child').css('border-right', '1px solid black');
        $quoteItemTable.find('tr:last-child td').css('border-bottom', '1px solid black');
        $quoteItemTable.find('tr:first-child th:last-child').css('border-top-right-radius', '5px');
        $quoteItemTable.find('tr:first-child th:first-child').css('border-top-left-radius', '5px');
              $quoteItemTable.find('tr:last-child td:last-child').css('border-bottom-right-radius', '5px');
        $quoteItemTable.find('tr:last-child td:first-child').css('border-bottom-left-radius', '5px');
        var $quoteForm = $(".quote-total-form").clone();
        var $quoteHead = $(".quote-heading").clone();
        quotehtml = $quoteHead.html() + "<br/><table style='border-spacing:0'>" + $quoteItemTable.html() + "</table><br/>" + $quoteForm.html();
        var email = window.plugins.emailComposer;
        email.showEmailComposer("Quote Number "+$quoteId, quotehtml, toEmail, '', '', true); 

        },
        gotoCategory:function(){
                sdc.alertNotesNotSave();
        },
        backtoHome:function(e){
            var $currentPage = $(".page:not(:hidden)");
            app.clearSearchResult($currentPage);
            $(".search-input").val('');
                // app.changePage($("#contact-list-page"), $("#customer-page"));
                $("#contact-phone-a").html("");
                $("#contact-email-a").html("");
                $("#contact-addr-a").html("");
                $("#contact-avatar-a").attr("src","");
                $("#contact-visit-history-list").html("");
                $("#chart-container2").html("");
                $("#chart-container3").html("");
                $("#social-entry-wrapper").html("");
                $('#quote-list input[data-type="search"]').val("");
                $("#social-entry-wrapper").find("._not-feed").remove();
                contact.xCurrentContact = null;
                contact.xCurrentCustomer = null;
                quoto.clearTableData();
                app.changePage($currentPage, $("#customer-page"));
                isClickFromContactPage = false;
                isClickFromCart = false;
        setTimeout(function() {
            sdc.custScroll.refresh();
        }, 500); 
        
                if (networkStatus == "online") {
                        sdc.loadCustomer();
                        if(isClickPushpin){
                                app.updateRevenue(pushpinCompanyId);
                        }else{
                                app.updateRevenue("all");
                        }
                        
                }

        
        },
        backtoPage:function(){
                if (isClickFromCart) {
                        if ($previousPage != undefined) {
                                var $currentPage = $(".page:not(:hidden)");
                                app.changePage($currentPage, $previousPage);
                        }
                } else {
                        app.backtoHome();
                }
        },
        back2Category:function(){
                app.changePage($("#product-list-page"), $("#category-page"));
                $(".search-input").val('');
                app.clearSearchResult($("#product-list-page"));
        },
        addToCart:function(){
        var ShoppingCart = utils.getParam("ShoppingCart");
        if (ShoppingCart != "" && ShoppingCart != undefined) {
            if(cart.getproductlist.length >0){
                $previousPage = $(this).closest($(".page"));
                app.changePage($previousPage, $("#product-cart-page"));        
                app.showCart();
                return;
            }
        }        
         valueChain.tool.alertInfo("Shopping Cart is Empty.");           

        },
        goToCart:function(e){
        var ShoppingCart = utils.getParam("ShoppingCart");
        if (ShoppingCart != "" && ShoppingCart != undefined) {
            if(cart.getproductlist().length >0){
                $previousPage = $(this).closest($(".page"));
                app.changePage($previousPage, $("#product-cart-page"));        
                app.showCart();
                return;
            }
        }        
         valueChain.tool.alertInfo("Shopping Cart is Empty.");    
        
        },
        go2Quote : function(){
                // var $currentPage = $(".page:not(:hidden)");
                // app.changePage($currentPage, $("#quotelist-page")); 
                if(app.getNetworkStatus() == "offline"){
                    valueChain.tool.alertWarning("Network is not available, please check the Network settings");
                    return;
            }
                if(isClickPushpin){
                        quoto.loadQuote(pushpinCompanyId);
                }else{
            quoto.loadQuote("");
                }
                isClickFromCart = false;
        },
        go2QuoteFromCart : function(id){
            // app.changePage($("#product-cart-page"), $("#quotelist-page"));
                quoto.loadQuote(id);
                isClickFromCart = true;
        },
        back2Product:function(e){
                if(isClickFromContactPage){
                        sdc.go2PreviousContact();
                        isClickFromContactPage=false;
                }else{
                        $("#product-list").find("li.prod-item").remove();
                        app.buildProduct(categoryname);
                        app.changePage($("#product-detail-page"), $("#product-list-page"));
                        app.refresh(); 
                }
                app.clearSearchResult($("#product-detail-page"));
        },
        clearSearchResult:function($currentPage){
        if ($currentPage.find($(".no")).hasClass('no')) {
            $(".no").appendTo($("#product-search-page"));
            $(".na").appendTo($("#product-search-page"));
            $(".none-search").removeClass('hidden');
        }
        },
        backToDetails:function(){
            app.changePage($("#product-cart-page"), $previousPage);
            $("#quantity-num").val('1');
            $("#qutoed-Price").val($("#prod-price").text());
                   var quotedPrice =  Number($("#qutoed-Price").val());
            var quatity = Number($("#quantity-num").val());
            $("#quotedTotal-price").text((quotedPrice*quatity).toFixed(2));
        },
        scroller : [],
    featureScroll:[],
    carouselScrolls:[],
    initScroller : function() {
            if(app.categoryScroller == null){
                    app.categoryScroller = new iScroll("category-scroll-wrapper");
            }else{
                    app.categoryScroller.refresh();
            }
            if(app.productScroller == null){
                    app.productScroller = new iScroll("product-scroll-wrapper");
            }else{
                    app.productScroller.refresh();
            }   
        if (app.checkPlatformIpad()) {
            var els = document.querySelectorAll(".scroll-wrapper"), i;
            for ( i = 0; i < els.length; i++) {
                app.scroller[i] = new iScroll(els[i]);
                app.scroller[i].options.onBeforeScrollStart = app.onBeforeScrollStart;
            }
            $(".scroll-wrapper").css("max-height","698px");
             var feas = document.querySelectorAll(".feature-wrapper"), y;
            for ( y = 0; y < feas.length; y++) {
                app.featureScroll[y] = new iScroll(feas[y],{hScrollbar:true,vScrollbar:true});
                app.featureScroll[y].options.onBeforeScrollStart = app.onBeforeScrollStart;
            }           
            $(".feature-wrapper").css("max-height","300px");
        }
    }, 
    featureCarousel:null,
    loadcarouselScrolls:function(){
        app.featureCarousel = new iScroll("featureCarousel-wrapper",{
            snap: true,   
            momentum: false,
            hScrollbar: false,
            vScrollbar: false,
            onBeforeScrollStart:function(e) {
                $scrolltarget = $(e.target).closest('ul').closest('#featureCarousel-wrapper').parent();
            }, onScrollEnd: function () {
                var $name = $scrolltarget.find('.indicator-wrapper');
                $name.find('.indicator > li.active').removeClass('active');
                $name.find('.indicator > li:nth-child(' + (this.currPageX + 1) + ')').addClass('active');
            }

        });

        $("#featureCarousel-wrapper").css("overflow-x", "hidden");
        $("#featureCarousel-wrapper").css("overflow-y", "scroll"); 

        var els = document.querySelectorAll(".carousel-wrapper"),i;
        for (i = 0; i < els.length; i++) {
            app.carouselScrolls[i] = new iScroll(els[i],{
                   snap: 'li',
                   momentum: false,
                   hScrollbar: false,
                   onBeforeScrollStart:function(e){
                          $scrolltarget =$(e.target).closest('ul').closest('.carousel-wrapper').parent(); 
                          e.preventDefault();
                          e.stopPropagation();  
                       
                   },
                   onScrollEnd: function () {              
                        var $name = $scrolltarget.find('.indicator-wrapper');
                        $name.find('.indicator > li.active').removeClass('active');
                        $name.find('.indicator > li:nth-child(' + (this.currPageX+1) + ')').addClass('active');
                        e.preventDefault();
                        e.stopPropagation();
            }
        } );
        }

    },    
    refresh:function() {
        var i;
        // The setTimeout method is recommended to avoid the "rubber band" effect
        setTimeout(function() {
            for ( i = 0; i < app.scroller.length; i++) {
                app.scroller[i].refresh();
            }
        }, 500);
         setTimeout(function() {
            for ( i = 0; i < app.featureScroll.length; i++) {
                app.featureScroll[i].refresh();
            }    
        }, 500);
          setTimeout(function() {
            for ( i = 0; i < app.carouselScrolls.length; i++) {
                app.carouselScrolls[i].refresh();
            }    
        }, 500);
        setTimeout(function() {
           app.featureCarousel.refresh();  
        }, 500);
                if(app.categoryScroller == null){
                    app.categoryScroller = new iScroll("category-scroll-wrapper");
            }else{
                    app.categoryScroller.refresh();
            } 
            if(app.productScroller == null){
                    app.productScroller = new iScroll("product-scroll-wrapper");
            }else{
                    app.productScroller.refresh();
            }     

        if (app.searchScroller == null) {
            app.searchScroller = new iScroll("search-scroll-wrapper");
        } else {
            app.searchScroller.refresh();
        } 

    },

        onBeforeScrollStart : function(e) {"use strict";
                var nodeType = e.explicitOriginalTarget ? e.explicitOriginalTarget.nodeName.toLowerCase() : (e.target ? e.target.nodeName.toLowerCase() : '');
                if (nodeType !== 'select' && nodeType !== 'option' && nodeType !== 'input' && nodeType !== 'textarea') {
                    $("input").blur();
                        e.preventDefault();
                        e.stopPropagation();
                }
        },
        checkPlatformIpad : function() {
                var platform = navigator.platform;
                if (platform.indexOf("iPad") >= 0) {
                        return true;
                } else
                        return false;
        },
        /*
         * return true if client is safari on iPad
         */
        checkBrowserMobileSafari : function() {
                var x = navigator;
                var userAgent = x.userAgent;
                var lowerUA = userAgent.toLowerCase();
                if (this.checkPlatformIpad() && null != lowerUA.match("applewebkit") && null != lowerUA.match("safari")) {
                        return true;
                }
                return false;
        },
        loadRelatedProduct:function(e){
           var item = $(e.target).closest($(".relative-pro")).data('RELATEDPROITEM');
        // var str = "json/"+item.category+".json";
                    var data = ProductList_new_json; 
                $.each(data.products,function(index,value){
                    if(value.Item_Id == item.id){
                        // app.changePage($("#product-detail-page"), $("#product-detail-page"));
                        $("#quantity-num").val('');
                        $("#qutoed-Price").val('');                       
                        $("#product-detail-page").data("productitem",value);
                        app.loadDetail(value);
                        app.refresh();
                        $('.carousel').carousel("cycle");
                        return;
                    }
        });
                
        },
        loadCategory : function() {
                // categoryJsonFileArray = new Array();
                productNameArray = [];
                allCategory = [];
                
                                $category = $("#category-list");
                                data = CategoryList_new_json;
                                $.each(data.categories, function(index, val) {
                                        var $feed = $("#category-feed").clone();
                                        
                                        $feed.find("img").attr("src", jive_img_url + val.avatar);
                                        $feed.find(".title-wrapper").html(val.name);
                                        $feed.data("CATEGORY",val);
                                        $category.append($feed.removeClass("hidden").addClass("_category-item"));
                                        // categoryJsonFileArray[index] = val.desc;
                                });
                                var toRemove = $("#category-feed").remove();
                                $category.find("li:nth-child(4n)").css("margin-right", 0);
                                $category.find("li").click(app.onCategoryClick);
                                $category.append(toRemove);
                                //traversal all categories' json file
                                app.traversalAllProducts();
                                app.refresh();                        
                                

        },
        changePage : function($from, $to) {
                $from.fadeOut(500).hide();
                $to.removeClass("hidden").fadeIn().show();
                app.refresh();
                if($to.attr("id") === "customer-page"){
                map.mapResize();
                }
        },
        onCategoryClick : function(e) {
                var $target = $(e.targte);
                var categoryData = $(this).closest("li").data("CATEGORY");
                app.changePage($("#category-page"), $("#product-list-page"));
                $("#product-list").find("li.prod-item").remove();
                
                app.buildProduct(categoryData.name);
                app.refresh();
        },
        buildProduct : function(categoryName){
                var $prod = $("#product-list");
                $.each(app.allProducts.products, function(index, val) {
                        if(val.Category_Name==categoryName){
                                var $feed = $("#product-feed").clone();
                                $feed.find("img").attr("src", jive_img_url + val.Item_Image[0]);
                                $feed.find(".title-wrapper").html(val.Item_Number);
                                $feed.find(".desc-wrapper").html(val.Item_Description);
                                $feed.data("PRODUCT",val);
                                $prod.append($feed.removeClass("hidden").addClass("prod-item"));
                        }
                });
                var toRemove = $("#product-feed").remove();
                $prod.find("li:nth-child(4n)").css("margin-right", 0);
                $prod.find("li").click(app.onProductClick);
                $prod.append(toRemove);
        },
        loadProduct : function(categoryName) {
                // var str = "json/"+path+".json";
                                var data = ProductList_new_json;
                                app.allProducts = data;
        },
        loadDetialPicImage:function(e){
            var pic =  $(e.target).closest('img').data('ITEMDETAILPIC');
            $(".prod-pic").attr('src',jive_img_url + pic);
        },
        onProductClick: function(e) {
            $('.search-input').blur();
            $('.search-input').val('');
            var $currentPage = $(".page:not(:hidden)");
            if($currentPage[0] != $("#product-detail-page")[0]){
                app.clearSearchResult($currentPage);        
                app.changePage($currentPage, $("#product-detail-page"));
            }else{
            app.clearSearchResult($currentPage);
            $(".none-search").removeClass('hidden'); 
            }                
                $("#quantity-num").val('');
                $("#qutoed-Price").val('');
                var productData = $(this).closest("li").data("PRODUCT");
                 $("#product-detail-page").data("productitem",productData);
                app.loadDetail(productData);
                app.refresh();
        },
        onLoadRightTopCarousel:function(data)
        {
            $("#pro_spec").html("");
            $("#prod_feature").html("");
            // $("#pro_spec").html(data.Item_Specification);
            $("#prod_feature").html(data.Item_Feature);
            $(".scroll-topRight-Content").css("width","200%");
        $(".detail-all .thelist li").css("width","50%");
            app.refresh();
        },
        onLoadLeftTopCarousel:function(data)
        {            
            var temple = Handlebars.compile($("#template-leftTopImageCarousel").html());
            var $indicatoritem = $(".detail-prod-pic-list .indicator");
            $(".detail-prod-pic-list .thelist").html("");
            $indicatoritem.html("");
            var count = data.Item_Image.length;
            var sectionNum =Math.ceil(count/3);
            var i =0;
            for(;i < sectionNum;i++){
               var array = data.Item_Image.slice(i*3,i*3+3);
               var context ={
                   'pic_detail':array
               };
               Handlebars.registerHelper('fullName', function() {
                    return jive_img_url + this;
               });
               $(".detail-prod-pic-list .thelist").append(temple(context));
            $(".detail-prod-pic-list .thelist li").last().find('img').each(function(index, value) {
                var $item = $(value);
                $item.data('ITEMDETAILPIC', array[index]);
                $item.click(app.loadDetialPicImage);
            });      
            if (i === 0) {
                $indicatoritem.append("<li class='active'>1</li>");
            } else {
                $indicatoritem.append("<li>" + i + 1 + "</li>");
            }
             }
             var sectionLength = 100*sectionNum;
             $(".scroll-leftTop-Content").css("width",sectionLength+"%");
             $(".detail-prod-pic-list .thelist li").css("width",100/sectionNum+"%");
             app.refresh();  
        },
        onLoadRightBottomCarousel:function(data)
        {
        var temple = Handlebars.compile($("#template-RightBottomCarousel").html());
        var $indicatoritem = $(".detail-related-prod .indicator");
         $indicatoritem.html("");
        $(".detail-related-prod .thelist").html("");
        var count = data.Item_Related_Product_id.length;
        var sectionNum = Math.ceil(count / 3);
        var i = 0;
        for (; i < sectionNum; i++) {
            var array = data.Item_Related_Product_id.slice(i * 3, i * 3 + 3),j=0;
            var context = {
                'prod_related' : array
            };
            Handlebars.registerHelper('fullPath', function() {
                return jive_img_url + this.img;
            });
            Handlebars.registerHelper('shortDesc', function() {
                var desc =this.description;
                if (this.description.length > 20) {
                     desc = this.description.substring(0, 19) + "...";
                }
                return desc;
            });
            $(".detail-related-prod  .thelist").append(temple(context));
            $(".detail-related-prod .thelist li").last().find($(".relative-pro")).each(function(index,value){
               var $item = $(value);
               $item.data('RELATEDPROITEM',array[index]);
               $item.click(app.loadRelatedProduct); 
            });

            if (i === 0) {
                $indicatoritem.append("<li class='active'>1</li>");
            } else {
                $indicatoritem.append("<li>" + i + 1 + "</li>");
            }

        }
          var sectionLength = 100*sectionNum;
         $(".detail-related-prod .scroll-bottomRight-Content").css("width",sectionLength+"%");
         $(".detail-related-prod .thelist li").css("width",100/sectionNum+"%");
         app.refresh();  
        },
        loadDetail : function(data) {
                $("#prod-name").text(data.Item_Number);
                $("#prod-description").text(data.Item_Description);
                $("#prod-type").text(data.Category_Name);
                categoryname=data.Category_Name;
                $("#prod-price").text(data.Item_List_Price);
                $("#qutoed-Price").val(data.Item_List_Price);
                $("#quantity-num").val(1);
                $(".prod-pic").attr("src", jive_img_url + data.Item_Image[0]);
                // var currentPrice = Number(data.Item_List_Price.replace(/\$/g,""));
                var currentPrice = Number(data.Item_List_Price);
                if(currentPrice!=undefined){
                    $("#quotedTotal-price").text(currentPrice*1);
                }else{
                    $("#quotedTotal-price").text('');
                }
                app.onLoadLeftTopCarousel(data);
                app.onLoadRightTopCarousel(data);
                app.onLoadRightBottomCarousel(data);
                //bind thumbnail list                 
        },
        updateDetailQuotedPrice:function(e){
            app.onPhoneKeyup(e.target);
            var quotedPrice =  Number($("#qutoed-Price").val());
            var quatity = Number($("#quantity-num").val());
            var total =parseFloat((quotedPrice*quatity).toFixed(2));
            if(isNaN(total)){
                total = 0
            }
            $("#quotedTotal-price").text(total);
        },
        traversalAllProducts:function() {
                
                                        var successData = ProductList_new_json; 
                                        var tempArray = [];
                                        var temp = [];
                                        $.each(successData.products, function(i, val) {
                                                tempArray[i] = val.Item_Number;
                                                temp[i]=val;
                                        });
                                productNameArray=tempArray;        
                                allProducts=temp;
                        
        },
        updateRevenue:function (id) {
                function onUpdate() {
                        var action = valueChain.ws.soapAction.GETCUSTOMERREVENUESTATISTIC;
                        var soapUrl = valueChain.ws.url.GET_CUSTOMER_REVENUE_STATISTIC;
                        function onComplete() {
                        }

                        function handleErrorResponse(responseString) {
                                var errorMsg = valueChain.tool.extractErrorMsg(responseString);
                                console.log("error:" + errorMsg);
                        }

                        function onSuccess(responseString, textStatus, jqXHR) {
                                var error = $(responseString).find("Error");
                                if (error && error.length > 0) {
                                        handleErrorResponse(responseString);
                                        return;
                                }
                                var item = $.xml2json(responseString).Body.OutputParameters.X_REVENUE_ALL_TBL_TYPE.X_REVENUE_ALL_TBL_TYPE_ITEM;
                                if (item != undefined) {
                                         var rev = item.REVENUE_EARNED;
                                         if(rev==undefined||rev==""){
                                                 rev="0";
                                         }
                                         var openQuote = item.OPEN_QUOTE_AMOUNT;
                                         if(openQuote==undefined||openQuote==""){
                                                 openQuote="0";
                                         }
                                         var completedQuote = item.COMPLETED_QUOTE_AMOUNT;
                                         if(completedQuote==undefined||completedQuote==""){
                                                 completedQuote="0";
                                         }
                                         var rate = item.FULL_RATE;
                                         if(rate==undefined||rate==""){
                                                 rate="0";
                                         }
                                         
                                        var formateRate;
                                        var pointPos = rate.indexOf(".");
                                        if (pointPos == -1 || rate == "1") {
                                                formateRate = "100";
                                        } else {
                                                if (rate.charAt(2) == "0") {
                                                        if (rate.charAt(3) == "0") {
                                                                formateRate = 0;
                                                        } else {
                                                                formateRate = rate.substr(pointPos + 2, 1);
                                                        }
                                                } else {
                                                        formateRate = rate.substr(pointPos + 1, 2) ;
                                                }
                                        }

                                         
                                         var quotes = {
                                                 "openQuotes" :  Number(app.formatData(openQuote).number),
                                                 "completedQuotes" :Number(app.formatData(completedQuote).number)
                                         }; 
                                         
                                        var stat = {
                                                "fullRates" :formateRate,
                                                "revenue" : app.formatData(rev).number,
                                                "openQuotes" : app.formatData(openQuote).number,
                                                "completedQuotes" : app.formatData(completedQuote).number,
                                                "revenueMetric": app.formatData(rev).metric,
                                                "openQuotesMetric": app.formatData(openQuote).metric,
                                                "completedQuotesMetric": app.formatData(completedQuote).metric
                                        }


                                        sdc.updateHistoryQuotes(quotes);
                                        sdc.updateStat(stat);
                                        service.revenue[id] = rev;
                                        service.historicalQuotes[id] = quotes;
                                        service.status[id] = stat;
                                }
                        }
                        var requestId = id;
                        if(id==="all"){
                                requestId="";
                        }
                        valueChain.tool.callServiceNoLoadingShow({
                                url : soapUrl,
                                soapAction : action,
                                success : onSuccess,
                                error : app.onServiceError,
                                complete : onComplete,
                                data : valueChain.ws.getCustomerStatisticRevenueRequest({
                                        customerAccId : requestId
                                })
                        }); 

                }
                if (service.revenue[id] === undefined) {
                         onUpdate();
                } else {
                        // $("#v-revenue").html(service.revenue[id]);
                        sdc.updateHistoryQuotes(service.historicalQuotes[id]);
                        sdc.updateStat(service.status[id]);
                }
                
        },
        formatData:function(data){
                var result,metr,pointPos1="";
                if(data!=undefined&&data!=""){
                        pointPos1 = data.indexOf(".");
                        var dataInt;
                        if(pointPos1==-1){
                                dataInt = data;
                        }else{
                                dataInt = data.substring(0,pointPos1);
                        }
                        var size = dataInt.length;
                        switch(size){
                                case 1:
                                case 2:
                                case 3:
                                result = dataInt;
                                metr = '';
                                break;
                                case 4:
                                case 5:
                                case 6:
                                result = (dataInt.substring(0,size-3));
                                metr = 'K';
                                break;
                                case 7:
                                case 8:
                                case 9:
                                result = (dataInt.substring(0,size-6));
                                metr ='M';
                                break;
                                case 10:
                                case 11:
                                case 12:
                                result = (dataInt.substring(0,size-9));
                                metr = 'B'
                                break;
                        }
                }
                return {"number":result,"metric":metr};
                
        },
        getNetworkStatus:function(){
                return networkStatus;
        }
}
;
var utils = {  
    setParam : function (name,value){  
        localStorage.setItem(name,value);
    },  
    getParam : function(name){  
        return localStorage.getItem(name);
    }  
};

var cart = {  
    //add Products to the Cart  
    addproduct:function(product){  
        var ShoppingCart = utils.getParam("ShoppingCart");  
        
        if(ShoppingCart==null||ShoppingCart==""){  
            //add product first time  
            var jsonstr = {
                "productlist":[{"id":product.id,"name":product.name,"num":product.num,"price":product.price,"quoted":product.quoted,"orgQuoted":product.orgQuoted,"pic":product.pic}],
                "totalNumber":product.num,
                "totalAmount":(product.price*product.num),
                "totalQuoted":(product.quoted*product.num)};  
            utils.setParam("ShoppingCart","'"+JSON.stringify(jsonstr));  
        }else{  
            var jsonstr = JSON.parse(ShoppingCart.substr(1,ShoppingCart.length));  
            var productlist = jsonstr.productlist;  
            var result=false; 
            var minue = 0;
            //if profuct already exists  
            for(var i in productlist){  
                if(productlist[i].id==product.id){  
                    productlist[i].num=parseInt(productlist[i].num)+parseInt(product.num);
                    if(parseFloat(product.quoted) ==0 ||parseFloat(product.quoted) ==undefined){
                        productlist[i].quoted = parseFloat(productlist[i].quoted);
                        productlist[i].orgQuoted = parseFloat(productlist[i].quoted);
                        minue = 0;
                    }else{
                        var minue = product.quoted - productlist[i].quoted;
                        productlist[i].quoted = parseFloat(product.quoted);
                        productlist[i].orgQuoted = parseFloat(product.quoted);
                    }
                   
                    result = true;  
                }  
            }  
            if(!result){  
                //if car do not have this product, add it  
                productlist.push({"id":product.id,"name":product.name,"num":product.num,"price":product.price,"quoted":product.quoted,"orgQuoted":product.orgQuoted,"pic":product.pic});  
            }  
            //calculate the total Value
            jsonstr.totalNumber=parseInt(jsonstr.totalNumber)+parseInt(product.num);  
            jsonstr.totalAmount=parseFloat(jsonstr.totalAmount)+(parseInt(product.num)*parseFloat(product.price));
            if (result) {
                jsonstr.totalQuoted = parseFloat(jsonstr.totalQuoted) + minue*(jsonstr.totalNumber-parseInt(product.num)) + (parseInt(product.num)*parseFloat(product.quoted));
            }else{
               jsonstr.totalQuoted = parseFloat(jsonstr.totalQuoted)+(parseInt(product.num)*parseFloat(product.quoted));
            }

            jsonstr.totalAmount = parseFloat(jsonstr.totalAmount.toFixed(2));
            jsonstr.totalQuoted = parseFloat(jsonstr.totalQuoted.toFixed(2));           
            orderdetail.totalNumber = jsonstr.totalNumber;  
            orderdetail.totalAmount = jsonstr.totalAmount; 
            orderdetail.totalQuoted = jsonstr.totalQuoted; 
            //Save the Shopping Cart  
            utils.setParam("ShoppingCart","'"+JSON.stringify(jsonstr));  
        }  
    },  
    //modified shoping quantity  
    updateproductnum:function(id,num){  
        var ShoppingCart = utils.getParam("ShoppingCart");  
        var jsonstr = JSON.parse(ShoppingCart.substr(1,ShoppingCart.length));  
        var productlist = jsonstr.productlist;  
          
        for(var i in productlist){  
            if(productlist[i].id==id){  
                jsonstr.totalNumber=parseInt(jsonstr.totalNumber)+(parseInt(num)-parseInt(productlist[i].num));  
                jsonstr.totalAmount=parseFloat(jsonstr.totalAmount)+((parseInt(num)*parseFloat(productlist[i].price))-parseInt(productlist[i].num)*parseFloat(productlist[i].price));  
                jsonstr.totalQuoted=parseFloat(jsonstr.totalQuoted)+((parseInt(num)*parseFloat(productlist[i].quoted))-parseInt(productlist[i].num)*parseFloat(productlist[i].quoted)); 
                productlist[i].num=parseInt(num);  

                jsonstr.totalAmount = parseFloat(jsonstr.totalAmount.toFixed(2));
                jsonstr.totalQuoted = parseFloat(jsonstr.totalQuoted.toFixed(2)); 
                orderdetail.totalNumber = jsonstr.totalNumber;  
                orderdetail.totalAmount = jsonstr.totalAmount; 
                orderdetail.totalQuoted = jsonstr.totalQuoted; 
                utils.setParam("ShoppingCart","'"+JSON.stringify(jsonstr));  
                return;  
            }  
        }  
    },  
    updateproductquoted:function(id,quoted)
    {
        var ShoppingCart = utils.getParam("ShoppingCart");
        var jsonstr = JSON.parse(ShoppingCart.substr(1, ShoppingCart.length));
        var productlist = jsonstr.productlist;
        var minue = 0;
        for (var i in productlist) {
            if (productlist[i].id == id) {
                minue = quoted - productlist[i].quoted;
                productlist[i].quoted = parseFloat(quoted); 
                if(minue!=0){
                     jsonstr.totalQuoted = parseFloat(jsonstr.totalQuoted) + minue*(productlist[i].num);
                }
                if(jsonstr.totalQuoted <0)
                {
                    jsonstr.totalQuoted =0;
                }
                jsonstr.totalAmount = parseFloat(jsonstr.totalAmount.toFixed(2));
                jsonstr.totalQuoted = parseFloat(jsonstr.totalQuoted.toFixed(2));
                orderdetail.totalNumber = jsonstr.totalNumber;
                orderdetail.totalAmount = jsonstr.totalAmount;
                orderdetail.totalQuoted = jsonstr.totalQuoted;
                utils.setParam("ShoppingCart", "'" + JSON.stringify(jsonstr));
                return;
            }
        }  
    },
    //get the product list in the shopping cart
    getproductlist:function(){  
        var ShoppingCart = utils.getParam("ShoppingCart");  
        var jsonstr = JSON.parse(ShoppingCart.substr(1,ShoppingCart.length));  
        var productlist = jsonstr.productlist;  
        orderdetail.totalNumber = jsonstr.totalNumber;  
        orderdetail.totalAmount = jsonstr.totalAmount;
        orderdetail.totalQuoted = jsonstr.totalQuoted;
        return productlist;  
    },  
    //exist product? 
    existproduct:function(id){  
        var ShoppingCart = utils.getParam("ShoppingCart");  
        var jsonstr = JSON.parse(ShoppingCart.substr(1,ShoppingCart.length));  
        var productlist = jsonstr.productlist;  
        var result=false;  
        for(var i in productlist){  
            if(productlist[i].id==product.id){  
                result = true;  
            }  
        }  
        return result;  
    },  
    //delete product  
    deleteproduct:function(id){  
        var ShoppingCart = utils.getParam("ShoppingCart");  
        var jsonstr = JSON.parse(ShoppingCart.substr(1,ShoppingCart.length));  
        var productlist = jsonstr.productlist; 
        var list=[];  
        for(var i in productlist){  
            if(productlist[i].id==id){  
                jsonstr.totalNumber=parseInt(jsonstr.totalNumber)-parseInt(productlist[i].num);  
                jsonstr.totalAmount=parseFloat(jsonstr.totalAmount)-parseInt(productlist[i].num)*parseFloat(productlist[i].price);  
                jsonstr.totalQuoted=parseFloat(jsonstr.totalQuoted)-parseInt(productlist[i].num)*parseFloat(productlist[i].quoted); 

            }else{  
                list.push(productlist[i]);  
            }  
        }  
        jsonstr.productlist = list;  
        jsonstr.totalAmount = parseFloat(jsonstr.totalAmount.toFixed(2));
        jsonstr.totalQuoted = parseFloat(jsonstr.totalQuoted.toFixed(2));
        orderdetail.totalNumber = jsonstr.totalNumber;  
        orderdetail.totalAmount = jsonstr.totalAmount;
        orderdetail.totalQuoted = jsonstr.totalQuoted;
        if (jsonstr.productlist == '' || jsonstr.productlist == undefined) {
            var jsonstr = {
                "productlist" : [],
                "totalNumber" : 0,
                "totalAmount" : 0,
                "totalQuoted" : 0,
            };          
            orderdetail.totalNumber = jsonstr.totalNumber;
            orderdetail.totalAmount = jsonstr.totalAmount;
        }

        utils.setParam("ShoppingCart","'"+JSON.stringify(jsonstr));  
    }  
};  

var sdc = {
        customerList : [],
    ready : function() {
        document.addEventListener('touchmove', function(e) {
            var $target =$(e.target);
            var $a = $target.closest("div#featureCarousel-wrapper");
            // if ($a.is("#featureCarousel-wrapper")) {
                // null;
            // }else{
                 // e.preventDefault(); 
            // }
            e.preventDefault(); 
        }, false);
        sdc.checkNetwork();
        sdc.bind();
        sdc.loadCustomer();
        contact.loadCustomerInfo();
        // sdc.initRecordMeeting();
        // utils.setParam('MEETINGRECOR','');
        sdc.initScroller();
       
    },
        
        checkNetwork : function() {
                // var i = 0;
                document.addEventListener("offline", function() {
                        valueChain.tool.alertWarning("Network is not available, please check the Network settings");
                        networkStatus = "offline"
                }, false);
                document.addEventListener("online", function() {
                        networkStatus = "online"
                }, false);
                
        },

    updateStat : function(val){
        $("#v-full-rates").html(val.fullRates);
        $("#v-revenue").html(val.revenue);
        $("#v-open-quotes").html(val.openQuotes);
        $("#v-completed-quotes").html(val.completedQuotes);            
        $("#v-revenue-metric").html(val.revenueMetric);
        $("#v-open-quotes-metric").html(val.openQuotesMetric);
        $("#v-completed-quotes-metric").html(val.completedQuotesMetric);            
    },
    clearStat : function(val){
        $("#v-full-rates").html(0);
        $("#v-revenue").html(0);
        $("#v-open-quotes").html(0);
        $("#v-completed-quotes").html(0);            
        $("#v-revenue-metric").html("");
        $("#v-open-quotes-metric").html("");
        $("#v-completed-quotes-metric").html(""); 
    },
    updateHistoryQuotes : function(val){
                var chart = new Highcharts.Chart({

                        chart : {
                                renderTo : 'quote-speed-meter',
                                type : 'gauge',
                                plotBackgroundColor: 'rgba(255, 255, 255, 0.1)',
                        plotBackgroundImage: null,
                        plotBorderWidth: 0,
                        plotShadow: false,
                        backgroundColor:'rgba(255, 255, 255, 0.1)'
                        },

                        title : {
                                text : ''
                        },

                        pane : {
                                startAngle : -150,
                                endAngle : 150,
                                background : [{
                                        backgroundColor : {
                                                linearGradient : {
                                                        x1 : 0,
                                                        y1 : 0,
                                                        x2 : 0,
                                                        y2 : 1
                                                },
                                                stops : [[0, '#FFF'], [1, '#333']]
                                        },
                                        borderWidth : 0,
                                        outerRadius : '109%'
                                }, {
                                        backgroundColor : {
                                                linearGradient : {
                                                        x1 : 0,
                                                        y1 : 0,
                                                        x2 : 0,
                                                        y2 : 1
                                                },
                                                stops : [[0, '#333'], [1, '#FFF']]
                                        },
                                        borderWidth : 1,
                                        outerRadius : '107%'
                                }, {
                                        // default background
                                }, {
                                        backgroundColor : '#DDD',
                                        borderWidth : 0,
                                        outerRadius : '105%',
                                        innerRadius : '103%'
                                }]
                        },

                        // the value axis
                        yAxis : {
                                min : 0,
                                max : (val.openQuotes+val.completedQuotes),

                                minorTickInterval : 'auto',
                                minorTickWidth : 1,
                                minorTickLength : 10,
                                minorTickPosition : 'inside',
                                minorTickColor : '#666',

                                tickPixelInterval : 30,
                                tickWidth : 2,
                                tickPosition : 'inside',
                                tickLength : 10,
                                tickColor : '#666',
                                labels : {
                                        distance: -20,
                                        step : 2,
                                        rotation : 'auto',
                        style:{
                            fontSize:"10px"
                        }
                                },
                                title : {
                                        text : ''
                                },
                                plotBands : [{
                                        from : 0,
                                        to : (val.openQuotes+val.completedQuotes)/2,
                                        color : '#55BF3B' // green
                                }, {
                                        from : (val.openQuotes+val.completedQuotes)/2,
                                        to : (val.openQuotes+val.completedQuotes)*3/4,
                                        color : '#DDDF0D' // yellow
                                }, {
                                        from : (val.openQuotes+val.completedQuotes)*3/4,
                                        to : (val.openQuotes+val.completedQuotes),
                                        color : '#DF5353' // red
                                }]
                        },

                        series : [{
                                name : 'Open Quotes',
                                data : [val.openQuotes],
                                tooltip : {
                                        valueSuffix : ''
                                }
                        }],
                        credits : {
                                text : ""
                        }

                });
        },
    bind : function() {
        // $("#gotoContact").click(sdc.goToContactDetail);
        $(".currentContact").click(sdc.go2PreviousContact);
        $("#btn-back-to-home1").click(sdc.go2nexPage);
        $("#quotelist-img").click(sdc.go2Quotelist);
        $("#meeting-record").click(sdc.recordMeeting);
        $("#contact-back-detail").click(sdc.go2Detail);
        $("#gotoProductCatalog").click(sdc.go2Catalog);
        $("#customer-page").click(function(){
                $("#customer-list input").blur();
        });
    },
    dynaBind : function(){
            $("li.customer-li").unbind("click").click(sdc.onCustomerClick);
    },
    onCustomerClick :function(){
            //change page
                sdc.changePage($("#customer-page"),$("#contact-list-page"));
                //load data
                var dataIndex = $(this).attr("data-index");
                contact.onContactPageShow(sdc.customerList[dataIndex]);
    },
    clearCurrentContact:function(){
            utils.setParam("currentContact",""); 
            currentContact = {};
    },
    currentMetting:{},
    // initRecordMeeting:function(){
       // var value =  utils.getParam("MEETINGRECOR");
       // if(value !=undefined && value !=""){
           // $("#input-meeting").val(value.MEETING_MINUTES);
       // }
       // sdc.currentMetting = value;
    // },
    recordMeeting:function(){
            if(app.getNetworkStatus() == "offline"){
                    valueChain.tool.alertWarning("Network is not available, please check the Network settings");
                    return;
            }
            if($("#input-meeting").val()==""){
                        return;
            }       
        var createMeetingURL = valueChain.ws.url.CREATE_MEETING;
        var createMeetingAction = valueChain.ws.soapAction.CREATEMEETING;
        var content=$("#input-meeting").val();
        var meetingId =sdc.currentMetting.MEETING_MINUTES_ID ? sdc.currentMetting.MEETING_MINUTES_ID:"";
        var salesName = "Lewis, Mr. David";
        // var salesName = currentContact.Contact_First_Name + currentContact.Contact_Last_Name;
        //var constomerId = "5453";
        var constomerId =currentContact.Customer_account_id;
        //var contactId = "442698";
        var contactId = currentContact.Contact_id


        function onComplete(){
            valueChain.tool.loading.hide();
             $("#input-meeting").val('');
             if(notesVisitTime){
                     sdc.showMeetingNotes(notesVisitTime);
             }
             else sdc.showMeetingNotes(app.getServerTime());
             sdc.refresh();
             sdc.currentMetting = {};
       };
    
       function handleErrorResponse(responseString) {
            var errorMsg = valueChain.tool.extractErrorMsg(responseString);
            console.log("error:" + errorMsg);
        };

       function onSuccess(responseString, textStatus, jqXHR){
            var error = $(responseString).find("Error");
            if (error && error.length > 0) {
                handleErrorResponse(responseString);
                return;
            }
            console.log('success');
       };
        valueChain.tool.callService({
                url : createMeetingURL,
                soapAction : createMeetingAction,
                success : onSuccess,
                error : app.onServiceError,
                complete : onComplete,
                data : valueChain.ws.createUpdateMeetingMinutes({
                        salesName : salesName,
                        constomerId : constomerId,
                        contactId:contactId,
                        content : content,
                        meetingId:meetingId,
                })
            });          
        
    },
        loadCustomer : function() {
                
                                var data = CustomerList_new_json;
                                var arr = [];
                                $.each(data.customers,function(ind,val){
                                    arr.push($.extend({},customerAppendix,val));
                            });
                                sdc.buildCustomerList(arr);
                                sdc.customerList = arr;
                                sdc.dynaBind();
                                map.loadMapInterval();
    },
    buildCustomerList : function(data) {
        var temple = Handlebars.compile($("#customer-template").html());
        $("#customer-listview>ul").html("");
        var context = {
            "li_related" : data
        };

        Handlebars.registerHelper('logoPath', function() {
            return jive_img_url + this.PARTY_IMAGE;
        });
        $("#customer-listview>ul").append(temple(context)).listview().listview("refresh");
        $("#customer-listview input.ui-input-text").unbind("keyup").keyup(map.updateMapCenter);
        $("#customer-listview .ui-icon-delete").click(function(){
            setTimeout(map.updateMapCenter,100);
        });       
        sdc.refresh();
    },
    go2PreviousContact:function(){
            $("#input-meeting").val('');
            var $currentPage = $(".page:not(:hidden)");
            app.clearSearchResult($currentPage);
            contact.onNotesClick();
            sdc.changePage($currentPage, $("#customer-contact-detail"));
            // contact.currentContact = currentContact
            app.refresh();
    },
    go2nexPage:function(){
            if(isClickFromContactPage){
                    sdc.go2PreviousContact();
                    isClickFromContactPage = false;
            }else{
                    app.backtoHome();
            }
            
            app.refresh();
    },
    go2Detail : function() {
            sdc.alertNotesNotSave1();
    },
    go2Catalog : function() {
            sdc.clearCurrentContact();
            app.loadCurrentContact();
        sdc.changePage($("#customer-page"), $("#category-page"));
        app.refresh();
    },
        onBeforeScrollStart : function(e) {"use strict";
                var nodeType = e.explicitOriginalTarget ? e.explicitOriginalTarget.nodeName.toLowerCase() : (e.target ? e.target.nodeName.toLowerCase() : '');
                if (nodeType !== 'select' && nodeType !== 'option' && nodeType !== 'input' && nodeType !== 'textarea') {
                    $("input").blur();
                        e.preventDefault();
                        e.stopPropagation();
                }
        },    
    notesScroll:null,
    pageScroll:[],
    custScroll:null,
    quotelistScroll:null,
    initScroller : function() {
            sdc.notesScroll = new iScroll("notes-wrapper");
            sdc.notesScroll.options.onBeforeScrollStart = sdc.onBeforeScrollStart;             
            sdc.custScroll = new iScroll("customer-scroll");
            sdc.custScroll.options.onBeforeScrollStart = sdc.onBeforeScrollStart;
            sdc.quotelistScroll = new iScroll("quote-list-scroll");
            sdc.quotelistScroll.options.onBeforeScrollStart = sdc.onBeforeScrollStart;
    },
    refresh:function() {
        var i;
        setTimeout(function() {
                sdc.notesScroll.refresh();
        }, 500);
         setTimeout(function() {
                sdc.custScroll.refresh();
        }, 500);
         setTimeout(function() {
                sdc.quotelistScroll.refresh();
        }, 500);
    },
    go2ContactDetail : function(data,time) {
            contact.xCurrentContact = data;
            currentContact = data;
            var customer = contact.findCustomerById(data.Customer_account_id);
            if(customer !=null){
                    $("#crm-comp-name").text(customer.PARTY_NAME);
            }
        $("#crm-person-name").text(currentContact.Contact_First_Name+" "+currentContact.Contact_Last_Name);
        $("#crm-person-title").text(currentContact.Contact_job_title);
        $("#crm-person-headPic").attr('src', jive_img_url + currentContact.Contact_Image);
        $("#crm-person-tel").text(currentContact.Contact_Phone_Number);
        $("#crm-person-email").text(currentContact.Contact_Email_Address);
        $("#crm-person-street").text(valueChain.tool.readableAddress([currentContact.Contact_Address1,currentContact.Contact_Address2,currentContact.Contact_City,currentContact.Contact_Postal_Code]));
        $("#input-meeting").val('');
        sdc.changePage($("#contact-list-page"), $("#customer-contact-detail"));
        // sdc.initScroller();
        notesVisitTime=time;
        sdc.showMeetingNotes(time);
        sdc.loadInterestedProduct(currentContact.Contact_id);
        utils.setParam("currentContact","'"+JSON.stringify(currentContact));  
    },
    loadInterestedProduct : function(contactId){
                var url = valueChain.ws.url.GET_INTERESTED_ITEM;
                var soapAction = "process";//execute
                function onSuccess(responseString, textStatus, jqXHR){
                        var nodes = $.xml2json(responseString).Body.OutputParameters.X_GET_ITEMS_TBL;
                        var data = {};
                        data["Contact_Interested_item"] = [];
                        if(nodes != ""){
                                if($.isArray(nodes.X_GET_ITEMS_TBL_ITEM)){
                                        $.each(nodes.X_GET_ITEMS_TBL_ITEM,function(index,val){
                                                var itemId = val.PITEM_ID;
                                                var arr = $.grep(app.allProducts.products, function(element, index){
                                                        return (element.Item_Id == itemId);
                                                });
                                                $.merge(data["Contact_Interested_item"], arr);                                
                                        });
                                }else{
                                        var val = nodes.X_GET_ITEMS_TBL_ITEM;
                                        var itemId = val.PITEM_ID;
                                        var arr = $.grep(app.allProducts.products, function(element, index){
                                                return (element.Item_Id == itemId);
                                        });
                                        $.merge(data["Contact_Interested_item"], arr);
                                }
                                
                        }
                        sdc.buildInterestedCarousel(data);
                }
                function onError(responseString, textStatus, jqXHR){
                        console.log(responseString);
                }
                function onComplete(){
                        app.refresh();
                }
                valueChain.tool.callService({
                        url:url,
                        soapAction:soapAction,
                        success:onSuccess,
                        error:onError,
                        complete : onComplete,
                        data: valueChain.ws.getGetInterestedProd({
                                "contactId" : contactId
                        })
                });
    },
    buildInterestedCarousel:function(data){
            var temple = Handlebars.compile($("#template-RightBottomCarousel1").html());
                var $indicatoritem = $(".detail-interested-prod .indicator");
                $indicatoritem.html("");
                $(".detail-interested-prod .thelist").html("");
                var count = data.Contact_Interested_item.length;
                var sectionNum = Math.ceil(count / 3);
                var i = 0;
                for (; i < sectionNum; i++) {
                        var array = data.Contact_Interested_item.slice(i * 3, i * 3 + 3), j = 0;
                        var context = {
                                'prod_related' : array
                        };
                        Handlebars.registerHelper('fullPath', function() {
                                return jive_img_url + this.Item_Image[0];
                        });
                        
            Handlebars.registerHelper('shortDesc', function() {
                var desc =this.Item_Description;
                if (this.Item_Description.length > 20) {
                     desc = this.Item_Description.substring(0, 16) + "...";
                }
                return desc;
            });                        
                        $(".detail-interested-prod  .thelist").append(temple(context));
                        $(".detail-interested-prod .thelist li").last().find($(".relative-pro")).each(function(index, value) {
                                var $item = $(value);
                                $item.data('INTERESTEDPROITEM', array[index]);
                                $item.click(sdc.loadInterestedProduct2);
                        });

                        if (i === 0) {
                                $indicatoritem.append("<li class='active'>1</li>");
                        } else {
                                $indicatoritem.append("<li>" + i + 1 + "</li>");
                        }

                }
                var sectionLength = 100 * sectionNum;
                $(".detail-interested-prod .scroll-bottomRight-Content").css("width", sectionLength + "%");
                $(".detail-interested-prod .thelist li").css("width", 100 / sectionNum + "%");
                app.refresh();
        },
        loadInterestedProduct2:function(e){
           var item = $(e.target).closest($(".relative-pro")).data('INTERESTEDPROITEM');
        // var str = JSON_SERVER + "json/"+item.category+".json";
                    var data = ProductList_new_json;
                $.each(data.products,function(index,value){
                    if(value.Item_Id == item.Item_Id){
                            sdc.alertNotesNotSave2(value);
                    }
                });
                
        },
    showMeetingNotes:function(date){
        var getMeetingURL = valueChain.ws.url.FIND_MEETING;
        var getMeetingAction = valueChain.ws.soapAction.FINDMEETING;
        $("#meetingNotes-tbody").html("");
       function onComplete(){
            valueChain.tool.loading.hide();
            sdc.refresh();
       };

       function handleErrorResponse(responseString) {
            var errorMsg = valueChain.tool.extractErrorMsg(responseString);
            console.log("error:" + errorMsg);
        };

       function onSuccess(responseString, textStatus, jqXHR){
            var error = $(responseString).find("Error");
            if (error && error.length > 0) {
                handleErrorResponse(responseString);
                return;
            }
            notesList = $.xml2json(responseString).Body.OutputParameters.X_FETCH_MM_TBL_TYPE.X_FETCH_MM_TBL_TYPE_ITEM;
            if(notesList !=undefined&&notesList!=''){ 
                if ($.isArray(notesList)) {
                    $.each(notesList, function(index, val) {
                        var meetingNotesContent = "";
                        meetingNotesContent += "<tr>";
                        meetingNotesContent += "<td><a href='#' class='selecte_meetingNotes' >";
                        var str = moment(val.CREATION_DATE,'YYYY-MM-DD,HH:mm:ss').format('YYYY-MM-DD,HH:mm:ss') + " " + val.MEETING_MINUTES;
                        // var str = moment(val.CREATION_DATE).local().format('YYYY-MM-DD,HH:mm:ss') + " " + val.MEETING_MINUTES;
                        if (str.length > 55) {
                            meetingNotesContent += str.substr(0, 55) + "...";
                        } else
                            meetingNotesContent += str;
                        meetingNotesContent += "</a></td>";
                        meetingNotesContent += "</tr>";

                        $("#meetingNotes-tbody").append(meetingNotesContent);
                        var $tag = $("#meetingNotes-tbody tr:last-child");
                        $tag.data("MEETINGNOTES", val);
                        $tag.find($('.selecte_meetingNotes')).click(sdc.onMeetingNotesClick);
                    });
                } else {
                    var meetingNotesContent = "";
                    meetingNotesContent += "<tr>";
                    meetingNotesContent += "<td><a href='#' class='selecte_meetingNotes' >";
                    var str = moment(notesList.CREATION_DATE,'YYYY-MM-DD,HH:mm:ss').format('YYYY-MM-DD,HH:mm:ss') + " " + notesList.MEETING_MINUTES;
                    // var str = moment(notesList.CREATION_DATE).local().format('YYYY-MM-DD,HH:mm:ss') + " " + notesList.MEETING_MINUTES;
                    if (str.length > 55) {
                        meetingNotesContent += str.substr(0, 55) + "...";
                    } else
                        meetingNotesContent += str;
                    meetingNotesContent += "</a></td>";
                    meetingNotesContent += "</tr>";

                    $("#meetingNotes-tbody").append(meetingNotesContent);
                    var $tag = $("#meetingNotes-tbody tr:last-child");
                    $tag.data("MEETINGNOTES", notesList);
                    $tag.find($('.selecte_meetingNotes')).click(sdc.onMeetingNotesClick);
                }
            }
       };

        var salesName = "Lewis, Mr. David";
        var constomerId =currentContact.Customer_account_id;
        var contactId = currentContact.Contact_id;
        if(date ==undefined || date ==''){
            date = app.getServerTime();
        }
        var createDate = moment(date,'YYYY-MM-DD').format('YYYY-MM-DD');

               valueChain.tool.callService({
                url : getMeetingURL,
                soapAction : getMeetingAction,
                success : onSuccess,
                error : app.onServiceError,
                complete : onComplete,
                data : valueChain.ws.findMeetingMinutes({
                    salesName : salesName,
                    constomerId : constomerId,
                    contactId : contactId,
                    createDate:createDate
                })
            });            
        }, 
        onMeetingNotesClick : function(e) {
        var $tr = $(this).closest("tr");
        notesItem =  $tr.data("MEETINGNOTES");
        $("#input-meeting").val(notesItem.MEETING_MINUTES);
        sdc.currentMetting = notesItem;
        },
        alertNotesNotSave:function(e){
                if($("#input-meeting").val()!=""){
                        try{
                                confirm("Do you want to save the meeting notes?", sdc.autoSaveNotes,"", "Yes,No");
                        }catch(e){
                                app.loadCurrentContact();
                                app.changePage($("#customer-contact-detail"), $("#category-page"));
                                isClickFromContactPage = true;
                        }
            }
            else{
                    app.loadCurrentContact();
                        app.changePage($("#customer-contact-detail"), $("#category-page"));
                        isClickFromContactPage = true;
            }
        },
        alertNotesNotSave1:function(e){
                if($("#input-meeting").val()!=""){
                        try{
                                confirm("Do you want to save the meeting notes?", sdc.autoSaveNotes1,"", "Yes,No");
                        }catch(e){
                                app.changePage($("#customer-contact-detail"), $("#contact-list-page"));
                        }
            }
            else {app.changePage($("#customer-contact-detail"), $("#contact-list-page"));notesVisitTime=null;contact.buildVisitHistory();}
            sdc.refresh();
        },
        alertNotesNotSave2:function(data){
                if($("#input-meeting").val()!=""){
                        try{
                                confirm("Do you want to save the meeting notes?",         
                                function(buttonIndex){
                            sdc.autoSaveNotes2(buttonIndex, data);
                        },"", "Yes,No");
                        }catch(e){
                                app.loadCurrentContact();
                    app.changePage($("#customer-contact-detail"), $("#product-detail-page"));
                    isClickFromContactPage = true;
                    $("#quantity-num").val('');
                    $("#qutoed-Price").val('');                       
                    $("#product-detail-page").data("productitem",data);
                    app.loadDetail(data);
                    app.refresh();        
                    $('.carousel').carousel("cycle");
                        }
            }
            else{
                    app.loadCurrentContact();
            app.changePage($("#customer-contact-detail"), $("#product-detail-page"));
            isClickFromContactPage = true;
            $("#quantity-num").val('');
            $("#qutoed-Price").val('');                       
            $("#product-detail-page").data("productitem",data);
            app.loadDetail(data);
            app.refresh();
            $('.carousel').carousel("cycle");
            }
        },
        autoSaveNotes : function(button) {
        if (button == 1) {
                  sdc.recordMeeting();
        } 
        app.loadCurrentContact();
                app.changePage($("#customer-contact-detail"), $("#category-page"));
                isClickFromContactPage = true;
    },
    autoSaveNotes1 : function(button) {
        if (button == 1) {
                  sdc.recordMeeting();
        } 
        notesVisitTime=null;
                app.changePage($("#customer-contact-detail"), $("#contact-list-page"));
                contact.buildVisitHistory();
    },
    autoSaveNotes2 : function(buttonIndex, data) {
        if (buttonIndex == 1) {
                  sdc.recordMeeting();
        } 
                app.loadCurrentContact();
        app.changePage($("#customer-contact-detail"), $("#product-detail-page"));
        isClickFromContactPage = true;
        $("#quantity-num").val('');
        $("#qutoed-Price").val('');                       
        $("#product-detail-page").data("productitem",data);
        app.loadDetail(data);
        app.refresh();
        $('.carousel').carousel("cycle");
    },
    changePage : function($from, $to) {
        $from.fadeOut(500).hide();
        $to.removeClass("hidden").fadeIn().show();
        if($to.attr("id") === "customer-page"){
                        map.mapResize();
                }
    }
};

var map = {
        map:null,
        geoCoder:null,
        center : null,
        mapInterval : null,
        locations :{},
        loadMapInterval : function() {
                setTimeout(map.loadGoogleMapScript,100);
                if (!mapLoaded) {
                        if(map.mapInterval == null){
                                map.mapInterval = setInterval(map.loadGoogleMapScript, 1000 * 3);
                        }
                }
        },
    updateMapCenter : function(){
        try{
            //get all the cords
            if($(".customer-li:visible").size() == 0){
                return;
            }
            var bounds = new google.maps.LatLngBounds();
            $(".customer-li:visible").each(function(){
                var partyId = $(this).attr("data-id");
                bounds.extend(map.locations[partyId]);
            });
            //update map
            map.map.fitBounds(bounds);
        }catch(e){
            //don't break the page if google map is not loaded correctly.
        }
    },        
        init : function(){
                mapLoaded = true;
                if(sdc.customerList.size > 0){
                        map.center =  new google.maps.LatLng(sdc.customerList[0].lat,sdc.customerList[0].lng);
                        
                }else{
                        map.center =  new google.maps.LatLng(37.672, -122.388);
                }
                var mapOptions = {
                        zoom : 8,
                center : map.center,
                mapTypeId : google.maps.MapTypeId.ROADMAP
                };
                map.geoCoder = new google.maps.Geocoder();
                map.map = new google.maps.Map(document.getElementById('map-canvas'), mapOptions);
                google.maps.event.addListener(map.map, 'click', function(event) {
            $("#customer-list input").blur();
        });
        var infowindow = new google.maps.InfoWindow();
                $.each(sdc.customerList, function(index, val) {
                        setTimeout(function(){
                                var address = val.ADDRESS1 +","+val.ADDRESS2+","+val.ADDRESS3+","+val.ADDRESS4+","+val.CITY+","+val.STATE+","+val.COUNTRY;
                                map.geoCoder.geocode({"address":address},function(results,status){
                                        if (status == google.maps.GeocoderStatus.OK) {
                                                //alert(address+" "+results[0].geometry.location);
                        //cache locations
                        map.locations[val.PARTY_ID] = results[0].geometry.location;                                                
                                                var marker = new google.maps.Marker({
                                                    position:  results[0].geometry.location,
                                                    map: map.map,
                                                    title: val.name
                                            });
                                            google.maps.event.addListener(marker, 'click', function() {
                                                    infowindow.close();
                                                    infowindow.setContent('<div id="content">' + '<div id="siteNotice"></div> <h4 id="firstHeading" data-index="'+index+'" class="firstHeading">'+val.PARTY_NAME+'</h4><div id="bodyContent"><p>Address: '+val.ADDRESS1 +', '+val.CITY+'</p><p>Contact: '+val.contact+'</p> </div> </div>');
                                                infowindow.open(map.map, marker);
                                                sdc.clearStat();
                                                app.updateRevenue(val.CUST_ACCOUNT_ID);
                                                        var allQuotes = {
                                                                "openQuotes" : val.openQuotes,
                                                                "completedQuotes" : val.completedQuotes
                                                        };
                                                pushpinCompanyId = val.CUST_ACCOUNT_ID;
                                                isClickPushpin = true;
                                            });
                                        }else {
                                                //alert(address+" "+status);
                                            console.log('Geocode was not successful for the following reason: ' + status);
                                    }
                                });
                        },500*index);
                    
            });
            google.maps.event.addListener(infowindow,'closeclick',function(){
                   isClickPushpin = false;
                   pushpinCompanyId="";
                   sdc.clearStat();
                   app.updateRevenue("all");
                });
                google.maps.event.addListener(infowindow,"domready",function(){
                        $("#firstHeading").unbind("click").click(sdc.onCustomerClick);
                });
                        
                var controlDiv = document.createElement('div');
                controlDiv.style.padding = '5px';
                var controlUI = document.createElement('div');
                controlUI.style.backgroundColor = 'white';
                controlUI.style.border = '1px solid rgba(0, 0, 0, 0.14902)';
        controlUI.style.cursor = 'pointer';
        controlUI.style.textAlign = 'center';
        controlUI.title = 'Click to set the map to Home';
        controlDiv.appendChild(controlUI); 
        
        var controlText = document.createElement('div');
        controlText.style.background = 'url('+jive_img_url+'location.png) no-repeat';
        controlText.style.width='12px';
        controlText.style.height='18px';
        controlText.style.display='inline-block';
        controlText.style.backgroundSize='12px';
        controlUI.appendChild(controlText); 
        controlDiv.index =1;
        google.maps.event.addDomListener(controlUI,'click',function(){
            if(navigator.geolocation){
                 navigator.geolocation.getCurrentPosition(function(position) {
                     initialLocation = new google.maps.LatLng(position.coords.latitude, position.coords.longitude);
                    map.map.setCenter(initialLocation);  
                    var marker = new google.maps.Marker({
                        position : initialLocation,
                        map : map.map,
                        icon:jive_img_url + 'gpsloc.png'
                    }); 

                 }, function() {
                    handleNoGeolocation(browserSupportFlag);
                 }); 
                     function handleNoGeolocation (errorflat) {
                       // alert('haha');
                     }

            }else{
                  valueChain.tool.alertInfo('Your browser does not support geolocation');
            }
        });
    
        map.map.controls[google.maps.ControlPosition.TOP_RIGHT].push(controlDiv);
        },
        loadGoogleMapScript : function(){
                if(mapLoaded){
                        clearInterval(map.mapInterval);
                        return;
                }
                $("#google-script").remove();
            var script = document.createElement("script");
            script.type = "text/javascript";
            script.id = "google-script";
            script.src = "https://maps.googleapis.com/maps/api/js?v=3.exp&sensor=false&callback=map.init";
            document.body.appendChild(script);

        },
        mapResize : function(){
        try {
            google.maps.event.trigger(map.map, "resize");
        } catch(e) {
            console.log(e);
        }
        }
};
var pwc = {
        loading : {
                /*Show the page loading mask*/
                show : function(opt) {
                        'use strict';
                        var defaultMsg = "Loading...";
                        opt = $.extend({
                                msg : defaultMsg
                        }, opt || {});

                        $('.ess-loading-mask, .ess-loading-indicator-wrapper').remove();
                        var $wrapper = $("<div class='ess-loading-indicator-wrapper'></div><div class='ess-loading-mask'>"+opt.msg+"</div>");
                        $wrapper.appendTo('body');
                        pwc.loading.position();
                },
                /*Hide the page loading mask*/
                hide : function() {
                        'use strict';
                        $(".ess-loading-mask, .ess-loading-indicator-wrapper").css('opacity', '0').css('width', '0px').css('height', '0px');
                },
                position : function() {
                        'use strict';
                        if($('.ess-loading-mask').width() > 0){/*$('.ess-loading-mask').width()  will return null if mask not exist*/
                                $('.ess-loading-mask').css({
                                        position : 'absolute',
                                        left : ($(window).width() - $('.ess-loading-mask').outerWidth()) / 2,
                                        top : ($(window).height() - $('.ess-loading-mask').outerHeight()) / 2
                                });
                                $('.ess-loading-indicator-wrapper').css({
                                        width : $(document).width(),
                                        height : $(document).height()
                                });
                        }
                }
        }
};
var contact = {
        linkedInNetworkUpdates : {},
        companyDetail : {},
        currentContact : {},
        contactScroll:null,
        socialScroll:null,
        historyScroll:null,
        newsScroll : null,
        xCurrentCustomer : null,
        xCurrentContact : null,
        bind:function(){
                contact.dynaBind();
                contact.initScroll();
                $("#linkedin-logo").unbind("click").click(contact.clearLinkedInToken);
                $("#contact-email-a").unbind("click").click(contact.sendEmail);
                $("#crm-person-email").unbind("click").click(contact.sendEmail);
                $("#linkedin-login").unbind("click").click(contact.initLinkedInLogin);
                $("#linkedin-logout").unbind("click").click(contact.clearLinkedInToken);
        },
        dynaBind:function(){
                $("#contact-notes").unbind("click").click(contact.onNotesClick);
                $(".contact-personnel").unbind("click").click(contact.onContactPersonnelClick);
        },
        initScroll:function(){           
             contact.initSocialScroll();   
             contact.initContactScroll(); 
             contact.initHistoryScroll();  
             contact.initNewsScroll();                      
        },
        initSocialScroll : function(){
                if(contact.socialScroll != null){
                        contact.socialScroll.refresh();
                }else{
                        contact.socialScroll = new iScroll("social-scroll-wrapper");
                }
        },
        initContactScroll : function(){
                if(contact.contactScroll != null){
                        contact.contactScroll.refresh();
                }else{
                        contact.contactScroll = new iScroll("contact-list-wrap");
                }
        },
        initHistoryScroll : function(){
                if(contact.historyScroll != null){
                        contact.historyScroll.refresh();
                }else{
                        contact.historyScroll = new iScroll("visit-history-scroll-wrapper");
                }
        },
        initNewsScroll : function(){
                if(contact.newsScroll != null){
                        contact.newsScroll.refresh();
                }else{
                        contact.newsScroll = new iScroll("news-scroll-wrapper");
                }
        },
        onNotesClick : function(){
                // var companyDetail = $.extend({},contact.companyDetail);
                // companyDetail.contacts = [contact.currentContact];
                if(notesVisitTime){
                        sdc.go2ContactDetail(contact.currentContact,notesVisitTime);
                }
                else sdc.go2ContactDetail(contact.currentContact,app.getServerTime());
        },
        onContactPersonnelClick:function(e){
                //cleanup
                $("div.cr66-active").removeClass("cr66-active");
                var target = $(e.target).closest(".cr666")[0], $target = $(target);
                var linkedInId = $target.attr("data-linkedin-id"), name=$target.find(".cr-name").text();
                
                var dataIndex = $target.attr("data-index");
                contact.currentContact = contact.groupedContacts[contact.companyDetail.PARTY_ID][dataIndex];
                contact.xCurrentContact  = contact.currentContact;
                $target.parent().addClass("cr66-active");
                contact.buildSocialFeeds(linkedInId,name);
                contact.initScroll();
                contact.buildVisitHistory();
                contact.buildContactDetail();
        },
        buildSocialFeeds : function(linkedInId, name){
                $("#social-entry-wrapper").html("");
                var arr = contact.linkedInNetworkUpdates[linkedInId];
                var template = Handlebars.compile($("#social-entry-template").html());
                if(arr){
                        $.each(arr,function(ind,val){
                                val.name = name;
                                val.c = (val.content?val.content.description:"");
                                val.url =  (val.content?val.content.shortenedUrl:"");
                        });
                        $("#social-entry-wrapper").append(template({arr:arr}));
                        $("#social-entry-wrapper tr").click(contact.showChildPage);
                }
        },
        onContactPageShow : function(data) {
                contact.xCurrentCustomer = data;
                chart.buildChart();
                if (!contact.isLinkedInLogin()) {
                        $("#linkedin-login").show();
                        $("#linkedin-logout").hide();
                }else{
                        $("#linkedin-login").hide();
                        $("#linkedin-logout").show();
                        contact.loadLinkedInNetworkUpdates();
                }
                $("#customer-name").html(data.PARTY_NAME);
                $("#customer-name-2").html(data.PARTY_NAME);
                // newsTopic = data.name;
                
                $("#company-option").attr('data-attr',data.PARTY_NAME);
        $("#industry-option").attr('data-attr',data.CATEGORY_CODE);
                $("#company-option").text("Company");
                $("#industry-option").text("Industry");
                contact.loadCustomerInfo(data);
        },
        isLinkedInLogin : function() {
                var accessToken = localStorage.getItem("LINKEDIN-ACCESSTOKEN"), accessTokenSecret = localStorage.getItem("LINKEDIN-ACCESSTOKENSECRET");
                if (accessToken === undefined || accessToken === null) {
                        return false;
                } else {
                        oauth_info.oauth_token = accessToken;
                        oauth_info.oauth_token_secret = accessTokenSecret;
                        return true;
                }
        },
        clearLinkedInToken : function(e){
                localStorage.removeItem("LINKEDIN-ACCESSTOKEN");
                localStorage.removeItem("LINKEDIN-ACCESSTOKENSECRET");
                $("#linkedin-login").show();
                $("#linkedin-logout").hide();
                contact.linkedInNetworkUpdates = {};
                $(".social-entry").remove();
                oauth = OAuthSimple(consumer_key, shared_secret);
        },
        parseResponse : function(response) {
                response.replace(new RegExp("([^?=&]+)(=([^&]*))?", "g"), function($0, $1, $2, $3) {
                        oauth_info[$1] = $3;
                });
        },
        getLinkedInNetworkUpdateUrl : function() {
                oauth.reset();

                var url = oauth.sign({
                        action : "GET",
                        path : "http://api.linkedin.com/v1/people/~/network/updates",
                        parameters : {
                                "type" : "SHAR",
                                "count" : 250
                        },
                        signatures : oauth_info
                }).signed_url;

                return url;
        },

        loadLinkedInNetworkUpdates : function() {
                // pwc.loading.show();
                var url = contact.getLinkedInNetworkUpdateUrl();
                $.get(url, contact.parseUpdateJsonSuccess);
        },

        parseUpdateJsonSuccess : function(data) {
                var groupedUpdates = {};
                $.each(data.values, function(ind, val) {
                        var userId = val.updateContent.person.currentShare.author.id;
                        if (groupedUpdates[userId] === undefined || groupedUpdates[userId] === null) {
                                groupedUpdates[userId] = [];
                        }
                        groupedUpdates[userId].push(val.updateContent.person.currentShare);
                });
                contact.linkedInNetworkUpdates = groupedUpdates;
                //find the active contact and update social media feeds
                var activeLinkedInId = $(".cr66-active         .contact-personnel").attr("data-linkedin-id"),
                        activeName = $(".cr66-active .cr-name").text();
                contact.buildSocialFeeds(activeLinkedInId,activeName);
        },
        onLinkedInSuccess : function(loc) {
                if (loc.indexOf("http://ec2-75-101-169-93.compute-1.amazonaws.com:8080") >= 0) {
                        // Parse the returned URL
                        var index, verifier = '';
                        var params = loc.substr(loc.indexOf('?') + 1);

                        params = params.split('&');
                        if (params[0].split("=")[0] === "oauth_problem") {
                                cb.close();
                                // alert(params[0].split("=")[1]);
                                return;
                        }
                        for (var i = 0; i < params.length; i++) {
                                var y = params[i].split('=');
                                if (y[0] === 'oauth_verifier') {
                                        verifier = y[1];
                                } else if (y[0] === 'oauth_token') {
                                        oauthToken = y[1];
                                }
                        }

                        oauth.reset();
                        var url = oauth.sign({
                                action : "GET",
                                path : "https://api.linkedin.com/uas/oauth/accessToken",
                                parameters : {
                                        oauth_verifier : verifier
                                },
                                signatures : oauth_info
                        }).signed_url;

                        $.get(url, function(data) {
                                contact.parseResponse(data);
                                cb.close();
                                localStorage.setItem("LINKEDIN-ACCESSTOKEN", oauth_info.oauth_token);
                                localStorage.setItem("LINKEDIN-ACCESSTOKENSECRET", oauth_info.oauth_token_secret);
                                contact.loadLinkedInNetworkUpdates();
                                $("#linkedin-login").hide();
                                $("#linkedin-logout").show();
                        });
                } else {
                        // Just Empty
                }
        },

        initLinkedInLogin : function() {
                if(app.getNetworkStatus() == "offline"){
                    valueChain.tool.alertWarning("Network is not available, please check the Network settings");
                    return;
            }
        if (!$("#linkedin-login").hasClass("processing")) {
            $("#linkedin-login").addClass("processing")
            valueChain.tool.loading.show();
            oauth.reset();
            var url = oauth.sign({
                action : "GET",
                path : "https://api.linkedin.com/uas/oauth/requestToken",
                parameters : {
                    oauth_callback : callbackUrl
                }
            }).signed_url;

            $.get(url, function(data) {
                contact.parseResponse(data);
                var authorize_url = "https://www.linkedin.com/uas/oauth/authenticate?oauth_token=" + oauth_info.oauth_token;
                valueChain.tool.loading.hide();
                cb = window.plugins.childBrowser;
                cb.showWebPage(authorize_url);
                setTimeout(function() {
                    $("#linkedin-login").removeClass("processing");
                }, 2000); 
                cb.onLocationChange = function(loc) {
                    contact.onLinkedInSuccess(loc);
                };
            });
        }else{
            return false;
        }

        },
        allContacts : null,
        groupedContacts : {},
        loadCustomerInfo:function(customerData){
                if(customerData && customerData.PARTY_ID  && customerData.PARTY_ID !== null){
                        var arr = contact.findContactsByCust(customerData.PARTY_ID);
                        contact.companyDetail = customerData;
                        try{
                                contact.buildNewsList();
                        }catch(e){}
                        // contact.buildContactList(value.customer.contacts);
                        contact.buildContactList(arr);
                        if(arr.length>0){
                                contact.loadContactFirstItem(arr[0]);
                        }        
                        contact.dynaBind();
                }else{
                        if(contact.allContacts == null){
                                
                                                var data = ContactList_new_json;
                                                contact.allContacts = data.contacts;
                        }
                }
        },
        findContactsByCust : function(custId){
                if(contact.groupedContacts[custId] != null){
                        return contact.groupedContacts[custId];
                }
                var arr = [];
                $.each(contact.allContacts,function(index,value){
                        if(value.Customer_account_id==custId){
                                arr.push(value);
                        }
                });
                if(contact.groupedContacts[custId] ==null){
                        contact.groupedContacts[custId] = arr;
                }
                return arr;
        },
        findCustomerById : function(custId){
                var arr = $.grep(sdc.customerList,function(e,ind){
                        return (e.PARTY_ID == custId);
                });
                if(arr != null && arr.length > 0){
                        return arr[0];
                }else{
                        return null;
                }
        },
        loadContactFirstItem:function(data){
                contact.currentContact = data;
                contact.buildVisitHistory();
                contact.buildContactDetail();
                $(".contact-personnel:first").parent().addClass("cr66-active"); 
                var arr = contact.linkedInNetworkUpdates[contact.currentContact.linkedin_id];
                if(arr){
                        $.each(arr,function(ind,val){
                                var $feed = $("._s-e-feed").clone();
                                $feed.find(".s-e-name").html(contact.currentContact.name);
                                $feed.find(".s-e-comment").html(val.comment);
                                $feed.find(".s-e-description").html(val.content?val.content.description:"");
                                $feed.show().addClass("_not-feed").removeClass("_s-e-feed");
                                $("#social-entry-wrapper").append($feed);
                        });
                }
        },
        buildContactList : function(data){
                var temple = Handlebars.compile($("#contact-list-template").html());
        $("#contact-content").html("");
               Handlebars.registerHelper('fullName', function() {
                    return this.Contact_First_Name + " "+ this.Contact_Last_Name;
               });
        var context = {
            "li_related" : data
        };
        $("#contact-content").append(temple(context));
        contact.initContactScroll();
        },
        buildNewsList : function(value){
            if(value=="" || value == undefined){
                newsTopic =  $("#company-option").attr('data-attr');
            }
            else{                
                 newsTopic = value;
            }

                var feedcontainer = $("#news-feeds-content");
                feedcontainer.html("");
                // var topic = $("#customer-name").val();
                var feedurl = 'http://news.google.com/news?q='+newsTopic+'&output=rss';
                var feedlimit = 8;
                var rssoutput = "";
                rssfeedsetup();

                function rssfeedsetup() {
                        var feedpointer = new google.feeds.Feed(feedurl);
                        feedpointer.setNumEntries(feedlimit);
                        feedpointer.load(displayfeed);
                }

                function displayfeed(result) {
                        if (!result.error) {
                                var thefeeds = result.feed.entries;
                                for (var i = 0; i < thefeeds.length; i++)
                                        rssoutput += "<tr><td><div class='cr71'><p data-role='none' href='" + thefeeds[i].link + "'>" + thefeeds[i].title + "</p></div></td></tr>";
                                feedcontainer.append(rssoutput);
                                contact.initNewsScroll();
                                $("#news-feeds-content tr").click(contact.showChildPage);
                        } else
                                 valueChain.tool.alertInfo("Error fetching feeds!");
                }        
        },
                
                
        showChildPage:function(e) {
                if(app.getNetworkStatus() == "offline"){
                    valueChain.tool.alertWarning("Network is not available, please check the Network settings");
                    return;
            }
                var url = $(this).find('p').attr('href');
                childBrowser = window.plugins.childBrowser;
                childBrowser.showWebPage(url);
        },

        loadCustomerVisitNote : function(e){
                if(app.getNetworkStatus() == "offline"){
                    valueChain.tool.alertWarning("Network is not available, please check the Network settings");
                    return;
            }
            var visitTime =  $(this).find('span').text();
            sdc.go2ContactDetail(contact.currentContact,moment(visitTime));
        },
        buildVisitHistory : function(){
                var action = valueChain.ws.soapAction.GETVISITHISTORY;
                var soapUrl = valueChain.ws.url.GET_VISIT_HISTORY;
                $("#contact-visit-history-list").html("");
                function onComplete() {
                }

                function handleErrorResponse(responseString) {
                        var errorMsg = valueChain.tool.extractErrorMsg(responseString);
                        console.log("error:" + errorMsg);
                }

                function onSuccess(responseString, textStatus, jqXHR) {
                        var error = $(responseString).find("Error"), arr = [];
                        if (error && error.length > 0) {
                                handleErrorResponse(responseString);
                                return;
                        }
                        var items = $.xml2json(responseString).Body.OutputParameters.X_VISIT_HISTORICAL_TBL.X_VISIT_HISTORICAL_TBL_ITEM;
                        var template = Handlebars.compile($("#visit-history-template").html());
                        if(!$.isArray(items)){
                if (items != undefined && items != "") {
                    var date = "";
                    if (items.CREATION_DATE != undefined && items.CREATION_DATE != "") {
                        date = moment(items.CREATION_DATE,'YYYY-MM-DD').format('YYYY-MM-DD');
                        // date = moment(items.CREATION_DATE).local().format('YYYY-MM-DD')
                        arr.push({
                            content : date
                        });

                        Handlebars.registerHelper('dateFormat', function() {
                            return new Handlebars.SafeString("Customer Visit on <span>" + this.content + "</span>");
                        });

                        $("#contact-visit-history-list").html(template({
                            arr : arr
                        }));
                        $("#contact-visit-history-list tr").click(contact.loadCustomerVisitNote);
                    }
                }
                        }else{
                                var hist = items;
                                if(hist != null && hist !=""){
                                        $.each(hist,function(index, val){
                                                var date="",topic="";
                                                if (val.CREATION_DATE != undefined && val.CREATION_DATE != ""){
                                                        date = moment(val.CREATION_DATE,'YYYY-MM-DD').format('YYYY-MM-DD');
                                                        arr.push({content:date});
                                                }
                                        });
                    Handlebars.registerHelper('dateFormat', function() {
                        return new Handlebars.SafeString("Customer Visit on <span>" + this.content  + "</span>");
                    });                                         
                                        $("#contact-visit-history-list").html(template({arr:arr}));
                                        $("#contact-visit-history-list tr").click(contact.loadCustomerVisitNote);
                                        contact.initHistoryScroll();
                                }
                        }
                        
                }
                valueChain.tool.callServiceNoLoadingShow({
                        url : soapUrl,
                        soapAction : action,
                        success : onSuccess,
                        error : app.onServiceError,
                        complete : onComplete,
                        data : valueChain.ws.getVisitHistoryRequest({

                                name : "Lewis, Mr. David",
                   // customerAccId:"5453",
                    //customerContactId:"442698",
                    //orgId:"204"
                    customerAccId:contact.currentContact.Customer_account_id,
                    customerContactId:contact.currentContact.Contact_id,
                    orgId:"204"
                        })
                }); 
        },
        buildContactDetail : function(){
                $("#contact-phone-a").html(contact.currentContact.Contact_Phone_Number);
                $("#contact-email-a").html(contact.currentContact.Contact_Email_Address);
                $("#contact-addr-a").html(contact.currentContact.Contact_Address1);
                $("#contact-avatar-a").attr("src",jive_img_url + contact.currentContact.Contact_Image);
        },
        sendEmail : function(e){
                var email = window.plugins.emailComposer;
                var toEmail = $(e.target).text();
                if(toEmail != ""){
                       email.showEmailComposer("","",toEmail,'','',false);
               }
        }
};

var chart = {
        chartOption2 : {
                colors : ['#FC5412', '#F0B21F'],
                credits : {
                        text : ""
                },
                chart : {
                        type : 'column'
                },
                title : {
                        text : 'Historical Quotes',
                        style:{
                                color:"#5a5a5a"
                        }
                },

                xAxis : {
                        categories : ['Africa', 'America', 'Asia', 'Europe'],
                        title : {
                                text : null
                        }
                },
                yAxis : {
                        min : 0,
                        title : {
                                text : '',
                                align : 'high'
                        },
                        labels : {
                                overflow : 'justify'
                        }
                },
                plotOptions : {
                        column : {
                                pointPadding : 0.1,
                                borderWidth : 0,
                                events: {
                            legendItemClick: function () {
                                return false; 
                            }
                        }
                        }
                },
                credits : {
                        enabled : false
                },
                series : [{
                        name : 'Year 1900',
                        data : [133, 156, 947, 6]
                }, {
                        name : 'Year 2008',
                        data : [973, 914, 404, 732]
                }]
        },
        chartOption3 : {
                colors :  ['#FC5412', '#F0B21F'],
                credits : {
                        text : ""
                },
                chart : {
                        type : 'column'
                },
                title : {
                        text : 'Revenue & Margin',
                        style:{
                                color:"#5a5a5a"
                        }
                },
                xAxis : {
                        categories : ['East', 'N. America', 'Asia', 'Euro'],
                        labels: {
                rotation: -45,
                align: 'right',
                style: {
                    fontSize: '8px',
                    fontFamily: 'Verdana, sans-serif'
                }
            }
                },
                yAxis : {
                        min : 0,
                        title : {
                                text : '',
                                style:{
                                        color:"#5a5a5a"
                                }
                        },
                        stackLabels : {
                                enabled : false,
                                style : {
                                        fontWeight : 'bold',
                                        color : (Highcharts.theme && Highcharts.theme.textColor) || 'gray'
                                }
                        }
                },
                plotOptions : {
                        column : {
                                pointPadding : 0.1,
                                borderWidth : 0,
                                stacking : 'normal',
                                dataLabels : {
                                        enabled : false,
                                        color : (Highcharts.theme && Highcharts.theme.dataLabelsColor) || 'white'
                                },
                                events: {
                            legendItemClick: function () {
                                return false; 
                            }
                        }
                        }
                },
                series : [{
                        name : 'Margin',
                        data : [5, 3, 4, 7]
                }, {
                        name : 'Revenue',
                        data : [2, 2, 3, 2]
                }]
        },
        kpiScroller : null,
        buildChart : function() {
                chart.loadQuote(contact.xCurrentCustomer.CUST_ACCOUNT_ID);
                chart.loadRevenue(contact.xCurrentCustomer.CUST_ACCOUNT_ID);
                chart.buildChartCarousel();
        },
        buildChartCarousel : function() {
                chart.kpiScroller = new iScroll('kpi-wrapper', {
                        snap : true,
                        momentum : false,
                        hScrollbar : false,
                        onScrollEnd : function() {
                                document.querySelector('#kpi-indicator > li.kpi-active').className = '';
                                document.querySelector('#kpi-indicator > li:nth-child(' + (this.currPageX + 1) + ')').className = 'kpi-active';
                        }
                });
        },
        loadQuote : function(customerId) {
                var a = valueChain.ws.soapAction.GETHISTORICALQUOTES;
                var u = valueChain.ws.url.GET_HISTORICAL_QUOTES;
                // var u = "json/a.xml";
                function onSuccess(data, textStatus, jqXHR) {
                        var dates = [];
                        var series = [];
                        var openQuoteCount = {};
                        var closedQuoteCount = {};
                        var $json = $.xml2json(data);
                        if($json.Body.OutputParameters.X_HISTORICAL_QUOTE_TBL == undefined || $json.Body.OutputParameters.X_HISTORICAL_QUOTE_TBL == ""){
                                $('#chart-container2').html("<div style='line-height:300px; height:300px;text-align:center'>No Data Found</div>");
                                return false;
                        }
                        var items = $json.Body.OutputParameters.X_HISTORICAL_QUOTE_TBL.X_HISTORICAL_QUOTE_TBL_ITEM;
                        $.each(items, function(index, val) {
                                var transformedDate = moment(val.QUOTE_CREATE_DATE).format("MMM DD");
                                if ($.inArray(transformedDate, dates)<0 && dates.length < 7) {
                                        dates.push(transformedDate);
                                }
                        });
                        dates.reverse();
                        $.each(dates, function(index, val) {
                                openQuoteCount[val] = 0;
                                closedQuoteCount[val] = 0;
                                $.each(items, function(index2, val2) {
                                        var transformedDate = moment(val2.QUOTE_CREATE_DATE).format("MMM DD");
                                        var status = val2.QUOTE_STATUS;
                                        if (transformedDate == val) {
                                                if ($.inArray(status, OPEN_STATUS_LIST)>-1) {
                                                        openQuoteCount[val] += 1;
                                                } else if ($.inArray(status, CLOSED_STATUS_LIST)>-1) {
                                                        closedQuoteCount[val] += 1;
                                                }
                                        }
                                });
                        });
                        var openQuotesByDate = [], closedQuoteByDate = [];
                        for (key in openQuoteCount) {
                                openQuotesByDate.push(openQuoteCount[key]);
                        }
                        for (key in closedQuoteCount) {
                                closedQuoteByDate.push(closedQuoteCount[key]);
                        }
                        series = [{
                                name : "Open",
                                data : openQuotesByDate
                        }, {
                                name : "Closed",
                                data : closedQuoteByDate
                        }];

                        var opt = $.extend({}, chart.chartOption2, {
                                xAxis : {
                                        categories : dates
                                },
                                series : series
                        });

                        $('#chart-container2').highcharts(opt);
                }

                function onError(data, textStatus, jqXHR) {
                        console.log(data);
                }

                valueChain.tool.callService({
                        url : u,
                        soapAction : a,
                        success : onSuccess,
                        error : onError,
                        data : valueChain.ws.getHistoricalQuotesRequest({
                                accountId : customerId
                        })
                }); 

                // $.ajax({
                        // url : u,
                        // success : onSuccess
                // });
        },
        loadRevenue : function(customerId) {
                var a = valueChain.ws.soapAction.GETHISTORICALQUOTES;
                var u = valueChain.ws.url.GET_CUSTOMER_REVENUE;
                // var u = "json/b.xml";
                function onSuccess(data, textStatus, jqXHR) {
                        var dates = [];
                        var revenues = [];
                        var margins = [];
                        var $json = $.xml2json(data);
                        if($json.Body.OutputParameters.X_C_REVENUE_PER_MONTH_REC == undefined || $json.Body.OutputParameters.X_C_REVENUE_PER_MONTH_REC == ""){
                                $('#chart-container3').html("<div style='line-height:300px; height:300px;text-align:center'>No Data Found</div>");
                                return false;
                        }
                        var items = $json.Body.OutputParameters.X_C_REVENUE_PER_MONTH_REC.X_C_REVENUE_PER_MONTH_REC_ITEM;
                        //sort the items
                        items.sort(function(a,b){
                                var _a = Number(a.YEAR_)*12+Number(a.MONTH_);
                                var _b = Number(b.YEAR_)*12+Number(b.MONTH_);
                                if(_a == _b) return 0;
                                return _a< _b? 1: -1;
                        });
                        $.each(items, function(index, val) {
                                if(index > 11){
                                        return;
                                }
                                var year = val.YEAR_, month = val.MONTH_, revenue = val.REVENUE_EARNED;
                                var margin = parseInt(Number(revenue)*0.1,10);
                                dates.push(year+"-"+month);
                                revenues.push(parseInt(Number(revenue)*0.9,10));
                                margins.push(margin);
                        });

                        series = [{
                                name : "Margin",
                                data : margins.reverse()
                        }, {
                                name : "Revenue",
                                data : revenues.reverse()
                        }];
                        chart.chartOption3.xAxis.categories = dates.reverse();
                        var opt = $.extend({}, chart.chartOption3, {
                                series : series
                        });

                        $('#chart-container3').highcharts(opt);
                }

                function onError(data, textStatus, jqXHR) {
                        console.log(data);
                }


                valueChain.tool.callService({
                        url : u,
                        soapAction : a,
                        success : onSuccess,
                        error : onError,
                        data : valueChain.ws.getCustomerRevenueRequest({
                                customerAccId : customerId
                        })
                }); 

                // $.ajax({
                        // url : u,
                        // success : onSuccess
                // });
        }
}; 

var quoto={
        quoteDetailScroller : null,
        ready : function() {
                quoto.bind();
                quoto.initScroller();
                quoto.bind();
                quoto.quoteDetailScroller = new iScroll("quoteslist-detail-table");
        },
        bind:function(){
                $("#quote-list").bind("click", function(e) {
                        var quoteData = $(e.target).closest("li").data("QUOTE");
                        $('#quote-list li').attr("data-theme", "c").removeClass("ui-btn-up-e").removeClass('ui-btn-hover-e');
                        $(e.target).closest("li").attr("data-theme", "b").addClass("ui-btn-up-e").addClass('ui-btn-hover-e');
                        quoto.loadQuoteItem(quoteData);
                }); 

        },
        loadQuote : function(id) {
                $("#quote-list>ul").html("");
                quoto.onCallHistoricalQuotesWebService(id);  
        },
        loadQuoteNext : function(data) {
                var quotes = data;
        quoto.loadQuoteList(quotes);
        quoto.appendDataForLi(quotes);
        quoto.showFirstItems(quotes);
        },
        loadQuoteList :function(data) {
                var temple = Handlebars.compile($("#quote-template").html());
                var context = {
                        "li_related1" : data
                };
                $("#quote-list>ul").append(temple(context)).listview().listview("refresh");
                sdc.refresh();
        },
        appendDataForLi:function(quoteData){
                var listObj = $("#quote-list li");
                for (var i = 0; i <= listObj.length; i++) {        
                $(listObj[i]).data("QUOTE",quoteData[i]);
            } 
        },
        showFirstItems:function(data){
                // quoto.clearTableData();
                var quoteArray = data;
                if(quoteArray.length>0){
                        quoto.loadQuoteItem(quoteArray[0]);
                        $("#quote-list li:first").attr("data-theme", "b").addClass("ui-btn-up-e").addClass('ui-btn-hover-e');
                        setTimeout(function() {
                                quoto.quoteDetailScroller.refresh();
                        }, 500); 

                }
                
        },
        clearTableData:function(){
                $("#quote-item-tbody").html("<tr><td></td><td></td><td></td><td></td><td></td><td></td><td></td></tr>");
                $("#quote-status-tbody").html("<tr><td></td><td></td></tr>");
                $("#quote-id").text("");
                $("#lable-company").text("");
                $("#lable-contact").text("");
                $("#total-tag1").text("");
                $("#total-quoted1").text(""); 
        },
        loadQuoteItem:function(quoteData){
                $("#quote-id").text(quoteData.id);
                var companyName = quoteData.company_name;
                if(companyName.length>29){
                        companyName = companyName.substring(0,26)+"...";
                }
                var contactName = quoteData.contact_name;
                if(contactName.length>15){
                        contactName = contactName.substring(0,12)+"...";
                }
                $("#lable-company").text(companyName);
                $("#lable-contact").text(contactName);
                $("#total-tag1").text(quoteData.list_amount);
                $("#total-quoted1").text(quoteData.quoted_amount); 
                $("#quote-item-tbody").html("");
                $("#quote-status-tbody").html("");
                var $itemBody = $("#quote-item-tbody");
                var $statusBody = $("#quote-status-tbody");
                var itemArray = quoteData.items;
                var statusArray = quoteData.quote_status;
                var itemBodyContent="";
                var statusBodyContent="";
                        $.each(itemArray, function(index, val) {
                                itemBodyContent += "<tr>";
                                itemBodyContent += "<td style='width:60px'>";
                                itemBodyContent += val.id;
                                itemBodyContent += "</td><td style='width:155px'>";
                                itemBodyContent += val.name;
                                itemBodyContent += "</td><td style='width:80px'>";
                                itemBodyContent += val.price;
                                itemBodyContent += "</td><td style='width:95px'>";
                                itemBodyContent += val.quoted;
                                itemBodyContent += "</td><td style='width:80px'>";
                                itemBodyContent += val.num;
                                itemBodyContent += "</td><td style='width:95px'>";
                                itemBodyContent += parseFloat((val.num * val.price).toFixed(2));
                                itemBodyContent += "</td><td style='width:95px'>";
                                itemBodyContent += parseFloat((val.num * val.quoted).toFixed(2));
                                itemBodyContent += "</td>";
                                itemBodyContent += "</tr>";
                        });
                        $.each(statusArray, function(index, val) {
                                statusBodyContent += "<tr>";
                                statusBodyContent += "<td style='width:360px'>";
                                statusBodyContent += val.status_name;
                                statusBodyContent += "</td><td style='width:300px'>";
                                statusBodyContent += val.status_date;
                                statusBodyContent += "</td>";
                                statusBodyContent += "</tr>";
                        });
                $("#quote-item-tbody").html(itemBodyContent);
                $("#quote-status-tbody").html(statusBodyContent);
                $("#quote-email").data('QUOTECONTACT',quoteData);
                if(quoto.quoteDetailScroller != null){
                        quoto.quoteDetailScroller.refresh();
                }else{
                        quoto.quoteDetailScroller = new iScroll("quoteslist-detail-table");
                }
        },
        refresh:function() {
        var i;
        // The setTimeout method is recommended to avoid the "rubber band" effect
        setTimeout(function() {
            for ( i = 0; i < quoto.scroller.length; i++) {
                quoto.scroller[i].refresh();
            }
        }, 500);
        setTimeout(function() {
            for ( i = 0; i < quoto.featureScroll.length; i++) {
                quoto.featureScroll[i].refresh();
            }    
        }, 500);
    },
    scroller : [],
    featureScroll:[],
    initScroller : function() {
        if (app.checkPlatformIpad()) {
            var els = document.querySelectorAll(".quto-scroll-wrapper"), i;
            for ( i = 0; i < els.length; i++) {
                quoto.scroller[i] = new iScroll(els[i]);
                quoto.scroller[i].options.onBeforeScrollStart = quoto.onBeforeScrollStart;
            }
            $(".quto-scroll-wrapper").css("max-height","640px");
             var feas = document.querySelectorAll(".feature-wrapper"), y;
            for ( y = 0; y < feas.length; y++) {
                quoto.featureScroll[y] = new iScroll(feas[y]);
                quoto.featureScroll[y].options.onBeforeScrollStart = quoto.onBeforeScrollStart;
            }           
            $(".feature-wrapper").css("max-height","350px");
        }
    }, 
    onBeforeScrollStart : function(e) {"use strict";
                var nodeType = e.explicitOriginalTarget ? e.explicitOriginalTarget.nodeName.toLowerCase() : (e.target ? e.target.nodeName.toLowerCase() : '');
                if (nodeType !== 'select' && nodeType !== 'option' && nodeType !== 'input' && nodeType !== 'textarea') {
                    $("input").blur();
                        e.preventDefault();
                        e.stopPropagation();
                }
        },
        
        onCallHistoricalQuotesWebService:function(id) {
                var action = valueChain.ws.soapAction.GETHISTORICALQUOTES;
                var soapUrl = valueChain.ws.url.GET_HISTORICAL_QUOTES;
                var detail, quoteArray = [], loadQuoteArray = [];

                function onComplete() {
                        valueChain.tool.loading.hide();
                        sdc.refresh();
                }

                function handleErrorResponse(responseString) {
                        var errorMsg = valueChain.tool.extractErrorMsg(responseString);
                        console.log("error:" + errorMsg);
                }

                function onSuccess(responseString, textStatus, jqXHR) {
                        var error = $(responseString).find("Error");
                        if (error && error.length > 0) {
                                handleErrorResponse(responseString);
                                return;
                        }
                        detail = $.xml2json(responseString).Body.OutputParameters.X_HISTORICAL_QUOTE_TBL;
                        if(detail!=undefined&&detail!=""){
                                quoteArray = detail.X_HISTORICAL_QUOTE_TBL_ITEM;
                                for (var i = 0; i < quoteArray.length; i++) {
                                        var obj = {};
                                        var item = [], itemStatus = [];
                                        obj.id = quoteArray[i].QUOTE_NUMBER;
                                        obj.desc = quoteArray[i].QUOTE_NAME;
                    obj.customerId = quoteArray[i].CUSTOMER_ID;
                    obj.contactId = quoteArray[i].CONTACT_ID;
                                        // obj.company_name = quoto.getCompanyName(quoteArray[i].CUSTOMER_ID);
                                        // obj.contact_name = quoto.getContactName(quoteArray[i].CONTACT_ID);
                                        obj.company_name = quoteArray[i].CUSTOMER_NAME;
                                        obj.contact_name = quoteArray[i].CONTACT_NAME;
                                        obj.date = (quoteArray[i].QUOTE_CREATE_DATE).substring(0, 10);
                                        var temp_quoted_amount = 0, temp_list_amount = 0;
                                        var backItem = quoteArray[i].QUOTE_LINE_ITEMS.QUOTE_LINE_ITEMS_ITEM;
                                        if (backItem != undefined && backItem != "") {
                                                if (!$.isArray(backItem)) {
                                                        var temp = {};
                                                        temp.id = backItem.ITEM_ID;
                                                        temp.name = backItem.ITEM_SHORT_DESCRIPTION;
                                                        temp.price = backItem.LIST_PRICE;
                                                        temp.quoted = backItem.QUOTED_PRICE;
                                                        temp.num = backItem.QUANTITY;
                                                        temp.list_total = parseFloat((Number(backItem.LIST_PRICE) * Number(backItem.QUANTITY)).toFixed(2));
                                                        temp.quoted_total = parseFloat((Number(backItem.QUOTED_PRICE) * Number(backItem.QUANTITY)).toFixed(2));
                                                        temp_list_amount += temp.list_total;
                                                        temp_quoted_amount += temp.quoted_total;
                                                        item.push(temp);
                                                } else {
                                                        for (var j = 0; j < backItem.length; j++) {
                                                                var temp = {};
                                                                temp.id = backItem[j].ITEM_ID;
                                                                temp.name = backItem[j].ITEM_SHORT_DESCRIPTION;
                                                                temp.price = backItem[j].LIST_PRICE;
                                                                temp.quoted = backItem[j].QUOTED_PRICE;
                                                                temp.num = backItem[j].QUANTITY;
                                                                temp.list_total = parseFloat((Number(backItem[j].LIST_PRICE) * Number(backItem[j].QUANTITY)).toFixed(2));
                                                                temp.quoted_total = parseFloat((Number(backItem[j].QUOTED_PRICE) * Number(backItem[j].QUANTITY)).toFixed(2));
                                                                temp_list_amount += temp.list_total;
                                                                temp_quoted_amount += temp.quoted_total;
                                                                item.push(temp);
                                                        }
                                                }
                                        }

                                        obj.list_amount = parseFloat(temp_list_amount.toFixed(2));
                                        obj.quoted_amount = parseFloat(temp_quoted_amount.toFixed(2));
                                        obj.items = item;
                                        
                                        var quoteStatus = quoteArray[i].QUOTE_STATUS;
                                        var createdStatus = {},  completeStatus = {};
                                        if(quoteStatus == "Draft"){
                                                if (quoteArray[i].QUOTE_CREATE_DATE != undefined && quoteArray[i].QUOTE_CREATE_DATE != "") {
                                                        createdStatus.status_name = "Quote Created", createdStatus.status_date = (quoteArray[i].QUOTE_CREATE_DATE).substring(0, 10);
                                                        itemStatus.push(createdStatus);
                                                }
                                        }else if(quoteStatus == "Accepted"){
                                                if (quoteArray[i].QUOTE_COMPLETE_DATE != undefined && quoteArray[i].QUOTE_COMPLETE_DATE != "") {
                                                        completeStatus.status_name = "Quote Completed", completeStatus.status_date = (quoteArray[i].QUOTE_COMPLETE_DATE).substring(0, 10);
                                                        itemStatus.push(completeStatus);
                                                }
                                        }else{
                                                if (quoteArray[i].QUOTE_CREATE_DATE != undefined && quoteArray[i].QUOTE_CREATE_DATE != "") {
                                                        createdStatus.status_name = "Quote Created", createdStatus.status_date = (quoteArray[i].QUOTE_CREATE_DATE).substring(0, 10);
                                                        itemStatus.push(createdStatus);
                                                }
                                        }
                                        obj.quote_status = itemStatus;
                                        loadQuoteArray.push(obj);
                                }

                        }
                        
                        if (loadQuoteArray.length > 0) {
                                quoto.loadQuoteNext(loadQuoteArray);
                                app.changePage($(".page:not(:hidden)"), $("#quotelist-page"));
                        }else{
                                 valueChain.tool.alertInfo("QuoteList is Empty");
                         
                        }
                }

                if (id == undefined) {
                        id = '';
                }
                valueChain.tool.callService({
                        url : soapUrl,
                        soapAction : action,
                        success : onSuccess,
                        error : app.onServiceError,
                        complete : onComplete,
                        data : valueChain.ws.getHistoricalQuotesRequest({
                                accountId : id
                        })
                });

        }
        
};

$(sdc.ready);
$(app.ready);
$(quoto.ready);
contact.bind();