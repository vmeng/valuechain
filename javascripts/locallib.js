var lib = new localStorageDB('library', localStorage);
if( lib.isNew() ) {
  try{
    lib.dropTable('X_C_REVENUE_PER_MONTH');
  } catch (ex){
  }
  lib.createTable('X_C_REVENUE_PER_MONTH', ['CUSTOMER_ID', 'YEAR_', 'MONTH_', 'REVENUE_EARNED']);
  $.each(CustomerList_new_json.customers,function(index,value){
    for(var i = 1; i < 10; i++){
      lib.insert('X_C_REVENUE_PER_MONTH', {CUSTOMER_ID: '' + value.CUST_ACCOUNT_ID, YEAR_: '2013', MONTH_: '0' + i, REVENUE_EARNED: Math.ceil(Math.random()*100000)})
    }
  });
  
  try{
    lib.dropTable('QUOTE_HEADER');
  } catch (ex){
  }
  lib.createTable('QUOTE_HEADER', ['QUOTE_CREATE_DATE', 'QUOTE_STATUS', 'QUOTE_NUMBER', 'QUOTE_NAME', 'CUSTOMER_ID', 'CUSTOMER_NAME', 'PARTY_SITE_ID', 'CONTACT_ID', 'CONTACT_NAME']);
  
  var num = 1;
  $.each(CustomerList_new_json.customers,function(index,value){
    var contacts = [];
    $.each(ContactList_new_json.contacts, function(contact_index, contact){
      if('' + value.CUST_ACCOUNT_ID == '' + contact.Customer_account_id){
        contacts.push(contact);
      }
    })
    var random_day = Math.round(Math.random()*200);
    var random_contact = Math.floor(Math.random()*(contacts.length-1));
    if(contacts.length > 0){
      lib.insert('QUOTE_HEADER', {QUOTE_CREATE_DATE: moment().add('days', -random_day).format('YYYY/MM/DD'), QUOTE_STATUS: 'Draft', QUOTE_NUMBER: '' + num, QUOTE_NAME: 'quote' + num, CUSTOMER_ID: '' + value.CUST_ACCOUNT_ID, CUSTOMER_NAME:value.PARTY_NAME, PARTY_SITE_ID: '' + value.PARTY_SITE_ID, CONTACT_ID: contacts[random_contact].Contact_id, CONTACT_NAME: contacts[random_contact].Contact_First_Name + ' ' + contacts[random_contact].Contact_Last_Name});
      num++;
      random_day = Math.round(Math.random()*200);
      random_contact = Math.floor(Math.random()*(contacts.length-1));
      lib.insert('QUOTE_HEADER', {QUOTE_CREATE_DATE: moment().add('days', -random_day).format('YYYY/MM/DD'), QUOTE_STATUS: 'Accepted', QUOTE_NUMBER: '' + num, QUOTE_NAME: 'quote' + num, CUSTOMER_ID: '' + value.CUST_ACCOUNT_ID, CUSTOMER_NAME:value.PARTY_NAME, PARTY_SITE_ID: '' + value.PARTY_SITE_ID, CONTACT_ID: contacts[random_contact].Contact_id, CONTACT_NAME: contacts[random_contact].Contact_First_Name + ' ' + contacts[random_contact].Contact_Last_Name});
      num++;
      random_day = Math.round(Math.random()*200);
      random_contact = Math.floor(Math.random()*(contacts.length-1));
      lib.insert('QUOTE_HEADER', {QUOTE_CREATE_DATE: moment().add('days', -random_day).format('YYYY/MM/DD'), QUOTE_STATUS: 'Accepted', QUOTE_NUMBER: '' + num, QUOTE_NAME: 'quote' + num, CUSTOMER_ID: '' + value.CUST_ACCOUNT_ID, CUSTOMER_NAME:value.PARTY_NAME, PARTY_SITE_ID: '' + value.PARTY_SITE_ID, CONTACT_ID: contacts[random_contact].Contact_id, CONTACT_NAME: contacts[random_contact].Contact_First_Name + ' ' + contacts[random_contact].Contact_Last_Name});
      num++;
    }
  });
  // lib.insert('QUOTE_HEADER', {QUOTE_CREATE_DATE: '2013/6/1', QUOTE_STATUS: 'Draft', QUOTE_NUMBER: '1', QUOTE_NAME: 'quote1', CUSTOMER_ID: '1004', CUSTOMER_NAME:'Hilman and Associates', PARTY_SITE_ID:'1030', CONTACT_ID: '442774', CONTACT_NAME: 'John Rainwater'});
  // lib.insert('QUOTE_HEADER', {QUOTE_CREATE_DATE: '2013/6/3', QUOTE_STATUS: 'Accepted', QUOTE_NUMBER: '2', QUOTE_NAME: 'quote2', CUSTOMER_ID: '1004', CUSTOMER_NAME:'Hilman and Associates', PARTY_SITE_ID:'1030', CONTACT_ID: '442768', CONTACT_NAME: 'John Rainwater'});
  // lib.insert('QUOTE_HEADER', {QUOTE_CREATE_DATE: '2013/6/3', QUOTE_STATUS: 'Draft', QUOTE_NUMBER: '3', QUOTE_NAME: 'quote3', CUSTOMER_ID: '1006', CUSTOMER_NAME:'Computer Service and Rentals', PARTY_SITE_ID:'1090', CONTACT_ID: '442774', CONTACT_NAME: 'John Rainwater'});
  
  try{
    lib.dropTable('QUOTE_DETAIL');
  } catch (ex){
  }
  lib.createTable('QUOTE_DETAIL', ['QUOTE_NUMBER', 'ITEM_ID', 'ITEM_SHORT_DESCRIPTION', 'LIST_PRICE', 'QUOTED_PRICE', 'QUANTITY']);
  lib.insert('QUOTE_DETAIL', {QUOTE_NUMBER: '1', ITEM_ID: '247', ITEM_SHORT_DESCRIPTION: 'Monitor - 17\"', LIST_PRICE: 322.00, QUOTED_PRICE: 300, QUANTITY: 100});
  lib.insert('QUOTE_DETAIL', {QUOTE_NUMBER: '2', ITEM_ID: '247', ITEM_SHORT_DESCRIPTION: 'Monitor - 17\"', LIST_PRICE: 322.00, QUOTED_PRICE: 200, QUANTITY: 200});
  lib.insert('QUOTE_DETAIL', {QUOTE_NUMBER: '3', ITEM_ID: '247', ITEM_SHORT_DESCRIPTION: 'Monitor - 17\"', LIST_PRICE: 322.00, QUOTED_PRICE: 200, QUANTITY: 200});
  
  try{
    lib.dropTable('VISIT_HISTORY');
  } catch (ex){
  }
  lib.createTable('VISIT_HISTORY', ['CUSTOMER_ID', 'CONTACT_ID', 'CREATION_DATE']);
  
  $.each(CustomerList_new_json.customers,function(index,value){
    var contacts = [];
    $.each(ContactList_new_json.contacts, function(contact_index, contact){
      if('' + value.CUST_ACCOUNT_ID == '' + contact.Customer_account_id){
        contacts.push(contact);
      }
    })
    if(contacts.length > 0){
      for(var i = 4; i < 9; i++){
        var random_day = Math.round(Math.random()*200);
        var random_contact = Math.floor(Math.random()*(contacts.length-1));
        lib.insert('VISIT_HISTORY', {CUSTOMER_ID: '' + value.CUST_ACCOUNT_ID, CONTACT_ID: contacts[random_contact].Contact_id, CREATION_DATE: moment().add('days', -random_day).format('YYYY-MM-DD')});
      }
    }
  });
  
  try{
    lib.dropTable('MEETING');
  } catch (ex){
  }
  lib.createTable('MEETING', ['MEETING_MINUTES_ID', 'CUSTOMER_ID', 'CONTACT_ID', 'MEETING_MINUTES', 'CREATION_DATE']);
  meeting_mins = [
    ''
  ];
  $.each(lib.query('VISIT_HISTORY'), function(index, value){
    var time = moment(value.CREATION_DATE).add('m', Math.round(Math.random()*600)).format('YYYY-MM-DD hh:mm:ss');
    lib.insert('MEETING', {MEETING_MINUTES_ID: '' + index, CUSTOMER_ID: '' + value.CUSTOMER_ID, CONTACT_ID: '' + value.CONTACT_ID, MEETING_MINUTES: 'Introduce the 17-inch-LCD-Monitor and 19-inch-LCD-Monitor, dicussed on the price and quote quantity.', CREATION_DATE: time});
  });
  
  // lib.insert('MEETING', {MEETING_MINUTES_ID: '2', CUSTOMER_ID: '1004', CONTACT_ID: '442774', MEETING_MINUTES: 'Goods Introduction, discussed some points on price.', CREATION_DATE: '2013-10-21 02:20:10'});
  // lib.insert('MEETING', {MEETING_MINUTES_ID: '3', CUSTOMER_ID: '1004', CONTACT_ID: '442774', MEETING_MINUTES: 'Discussion mainly focused on quote.', CREATION_DATE: '2013-10-21 03:20:10'});
  // lib.insert('MEETING', {MEETING_MINUTES_ID: '4', CUSTOMER_ID: '1004', CONTACT_ID: '442774', MEETING_MINUTES: 'Discussion mainly focused on quote.', CREATION_DATE: '2013-10-22 04:20:10'});
  // lib.insert('MEETING', {MEETING_MINUTES_ID: '5', CUSTOMER_ID: '1004', CONTACT_ID: '442774', MEETING_MINUTES: 'Discussion mainly focused on quote.', CREATION_DATE: '2013-10-23 05:20:10'});
  // lib.insert('MEETING', {MEETING_MINUTES_ID: '6', CUSTOMER_ID: '1004', CONTACT_ID: '442774', MEETING_MINUTES: 'Discussion mainly focused on quote.', CREATION_DATE: '2013-10-24 06:20:10'});
  
  try{
    lib.dropTable('INTERESTED_ITEM');
  } catch (ex){
  }
  lib.createTable('INTERESTED_ITEM', ['PITEM_ID', 'CONTACT_ID']);
  $.each(ContactList_new_json.contacts, function(index, value){
    $.each(ProductList_new_json.products, function(item_index, item){
      lib.insert('INTERESTED_ITEM', {PITEM_ID: '' + item.Item_Id, CONTACT_ID: value.Contact_id});
    });
  });
  
  lib.commit();
}

function submitQuote(option){
  var quote_number = moment().format('YYYYMMDDhhmmss');
  var customer_name = '';
  var party_site_id = '';
  var contact_name = '';
  $.each(CustomerList_new_json.customers,function(index,value){
      if('' + value.CUST_ACCOUNT_ID == '' + option['customerId']){
          customer_name = value.PARTY_NAME;
          party_site_id = value.PARTY_SITE_ID;
          return;
      }
  });
  $.each(ContactList_new_json.contacts,function(index,value){
      if('' + value.Contact_id == '' + option['contactId']){
          contact_name = value.Contact_First_Name + ' ' + value.Contact_Last_Name;
          return;
      }
  });
  lib.insert('QUOTE_HEADER', {
      QUOTE_CREATE_DATE: moment().format('YYYY-MM-DD'), 
      QUOTE_STATUS: 'Draft', 
      QUOTE_NUMBER: quote_number, 
      QUOTE_NAME: option['quotoName'], 
      CUSTOMER_ID: option['customerId'], 
      CUSTOMER_NAME:customer_name, 
      PARTY_SITE_ID:party_site_id, 
      CONTACT_ID: option['contactId'], 
      CONTACT_NAME: 'John Rainwater'});

  option['lineItems'].forEach(function(line){
    var item_name = '';
    $.each(ProductList_new_json.products,function(index,value){
        if('' + value.Item_Id == '' + line.itemId){
            item_name = value.Item_Description;
            return;
        }
    });
    lib.insert('QUOTE_DETAIL', { QUOTE_NUMBER: quote_number, 
                                 ITEM_ID: line.itemId, 
                                 ITEM_SHORT_DESCRIPTION: item_name, 
                                 LIST_PRICE: line.price, 
                                 QUOTED_PRICE: line.quotePrice, 
                                 QUANTITY: line.quantity});
  });
  lib.commit();
  return quote_number;
}

function recordMeeting(customer_id, contact_id, content, meeting_id){
  if(meeting_id == ''){
    // create meeting
    meeting_id = new Date().toString();
    var now = new Date();
    lib.insert('MEETING', {MEETING_MINUTES_ID: meeting_id, CUSTOMER_ID: customer_id, CONTACT_ID: contact_id, MEETING_MINUTES: content, CREATION_DATE: moment(now).format('YYYY-MM-DD hh:mm:ss')});
  } else {
    // update meeting
    lib.update("MEETING", {MEETING_MINUTES_ID: meeting_id}, function(row) {
      row.MEETING_MINUTES = content;
      return row;
    });
  }
  lib.commit();
}

function loadInterestedProduct(contact_id){
  return lib.query('INTERESTED_ITEM', {CONTACT_ID: '' + contact_id});
}

function showMeetingNotes(customer_id, contact_id, create_date){
  return lib.query("MEETING", function(row) {  // the callback function is applied to every row in the table
    if(row.CUSTOMER_ID == '' + customer_id
      && row.CONTACT_ID == '' + contact_id
      && moment(row.CREATION_DATE).format('YYYY-MM-DD') == '' + create_date) {       // if it returns true, the row is selected
        return true;
    } else {
        return false;
    }
  });
}

function loadRevenue(customer_id){
  return lib.query('X_C_REVENUE_PER_MONTH', {CUSTOMER_ID: '' + customer_id});
}

function libLoadRevenue(customer_id){
  var item = {
    REVENUE_EARNED : '0',
    OPEN_QUOTE_AMOUNT : '13823', // TODO need calculate from QUOTE_HEADER
    COMPLETED_QUOTE_AMOUNT : '847965',// TODO need calculate from QUOTE_HEADER
    FULL_RATE : '0.986' // TODO ?????
  };
  var rs = [];
  if(customer_id == 'all'){
    rs = lib.query('X_C_REVENUE_PER_MONTH');
  } else {
    rs = lib.query('X_C_REVENUE_PER_MONTH', {CUSTOMER_ID: '' + customer_id});
  }
  var totalRevenue = 0;
  rs.forEach(function(result){
    totalRevenue += result.REVENUE_EARNED;
  })
  item['REVENUE_EARNED'] = '' + totalRevenue;
  return item;
}

function loadQuote(customer_id){
  // var items = [];
  var rs = [];
  rs = lib.query('QUOTE_HEADER', {CUSTOMER_ID: '' + customer_id});
  rs.forEach(function(result){
    result["QUOTE_LINE_ITEMS"] = {}
    result["QUOTE_LINE_ITEMS"]['QUOTE_LINE_ITEMS_ITEM'] = []
    rs2 = lib.query('QUOTE_DETAIL', {QUOTE_NUMBER: result['QUOTE_NUMBER']});
    rs2.forEach(function(result2){
      result["QUOTE_LINE_ITEMS"]['QUOTE_LINE_ITEMS_ITEM'].push(result2);
    })
  })
  return rs;
}

function buildVisitHistory(customer_id, contact_id){
  return lib.query('VISIT_HISTORY', {CUSTOMER_ID: '' + customer_id, CONTACT_ID: '' + contact_id});
}
