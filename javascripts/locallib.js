var lib = new localStorageDB('library', localStorage);
// if( lib.isNew() ) {
  try{
    lib.dropTable('X_C_REVENUE_PER_MONTH');
  } catch (ex){
  }
  lib.createTable('X_C_REVENUE_PER_MONTH', ['CUSTOMER_ID', 'YEAR_', 'MONTH_', 'REVENUE_EARNED']);
  lib.insert('X_C_REVENUE_PER_MONTH', {CUSTOMER_ID: '1004', YEAR_: '2013', MONTH_: '01', REVENUE_EARNED: 1000});
  lib.insert('X_C_REVENUE_PER_MONTH', {CUSTOMER_ID: '1004', YEAR_: '2013', MONTH_: '02', REVENUE_EARNED: 2000});
  
  try{
    lib.dropTable('QUOTE_HEADER');
  } catch (ex){
  }
  lib.createTable('QUOTE_HEADER', ['QUOTE_CREATE_DATE', 'QUOTE_STATUS', 'QUOTE_NUMBER', 'QUOTE_NAME', 'CUSTOMER_ID', 'CUSTOMER_NAME', 'PARTY_SITE_ID', 'CONTACT_ID', 'CONTACT_NAME']);
  lib.insert('QUOTE_HEADER', {QUOTE_CREATE_DATE: '2013/6/1', QUOTE_STATUS: 'Draft', QUOTE_NUMBER: '1', QUOTE_NAME: 'quote1', CUSTOMER_ID: '1004', CUSTOMER_NAME:'Hilman and Associates', PARTY_SITE_ID:'1030', CONTACT_ID: '442774', CONTACT_NAME: 'John Rainwater'});
  lib.insert('QUOTE_HEADER', {QUOTE_CREATE_DATE: '2013/6/3', QUOTE_STATUS: 'Accepted', QUOTE_NUMBER: '2', QUOTE_NAME: 'quote2', CUSTOMER_ID: '1004', CUSTOMER_NAME:'Hilman and Associates', PARTY_SITE_ID:'1030', CONTACT_ID: '442768', CONTACT_NAME: 'John Rainwater'});
  lib.insert('QUOTE_HEADER', {QUOTE_CREATE_DATE: '2013/6/3', QUOTE_STATUS: 'Draft', QUOTE_NUMBER: '3', QUOTE_NAME: 'quote3', CUSTOMER_ID: '1006', CUSTOMER_NAME:'Computer Service and Rentals', PARTY_SITE_ID:'1090', CONTACT_ID: '442774', CONTACT_NAME: 'John Rainwater'});
  
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
  lib.insert('VISIT_HISTORY', {CUSTOMER_ID: '1004', CONTACT_ID: '442774', CREATION_DATE: '2013/6/1'});
  lib.insert('VISIT_HISTORY', {CUSTOMER_ID: '1004', CONTACT_ID: '442774', CREATION_DATE: '2013/6/2'});
  lib.insert('VISIT_HISTORY', {CUSTOMER_ID: '1006', CONTACT_ID: '442768', CREATION_DATE: '2013/6/3'});
  
  
  try{
    lib.dropTable('MEETING');
  } catch (ex){
  }
  lib.createTable('MEETING', ['MEETING_MINUTES_ID', 'CUSTOMER_ID', 'CONTACT_ID', 'MEETING_MINUTES', 'CREATION_DATE']);
  lib.insert('MEETING', {MEETING_MINUTES_ID: '1', CUSTOMER_ID: '1004', CONTACT_ID: '442774', MEETING_MINUTES: 'Goods Introduction, discussed some points on price.', CREATION_DATE: '2013-06-01'});
  lib.insert('MEETING', {MEETING_MINUTES_ID: '1', CUSTOMER_ID: '1004', CONTACT_ID: '442774', MEETING_MINUTES: 'Goods Introduction, discussed some points on price.', CREATION_DATE: '2013-10-21'});
  lib.insert('MEETING', {MEETING_MINUTES_ID: '1', CUSTOMER_ID: '1004', CONTACT_ID: '442774', MEETING_MINUTES: 'Discussion mainly focused on quote.', CREATION_DATE: '2013-10-21'});
  lib.insert('MEETING', {MEETING_MINUTES_ID: '1', CUSTOMER_ID: '1004', CONTACT_ID: '442774', MEETING_MINUTES: 'Discussion mainly focused on quote.', CREATION_DATE: '2013-10-22'});
  lib.insert('MEETING', {MEETING_MINUTES_ID: '1', CUSTOMER_ID: '1004', CONTACT_ID: '442774', MEETING_MINUTES: 'Discussion mainly focused on quote.', CREATION_DATE: '2013-10-23'});
  lib.insert('MEETING', {MEETING_MINUTES_ID: '1', CUSTOMER_ID: '1004', CONTACT_ID: '442774', MEETING_MINUTES: 'Discussion mainly focused on quote.', CREATION_DATE: '2013-10-24'});
  
  lib.commit();
// }

function showMeetingNotes(customer_id, contact_id, create_date){
  console.log(customer_id);
  console.log(contact_id);
  console.log(create_date);
  return lib.query('MEETING', {CUSTOMER_ID: '' + customer_id, CONTACT_ID: '' + contact_id, CREATION_DATE: create_date})
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
  var totalRevenue = 891236740;
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
    result["QUOTE_LINE_ITEMS"] = []
    rs2 = lib.query('QUOTE_DETAIL', {QUOTE_NUMBER: rs['QUOTE_NUMBER']});
    rs2.forEach(function(result2){
      result["QUOTE_LINE_ITEMS"].push(result2);
    })
  })
  return rs;
}

function buildVisitHistory(customer_id, contact_id){
  return lib.query('VISIT_HISTORY', {CUSTOMER_ID: '' + customer_id, CONTACT_ID: '' + contact_id});
}
