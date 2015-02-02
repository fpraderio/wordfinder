var url = ".../API_Rest/catalogs/gasetamunicipalbarcelona/";
var documents = [];
var searching_word = "";

var show_text = function(id_text){
  $('#results .text_page').hide();
  console.log(id_text);
  $(id_text).show( "slow" );
}

//url+"documents/2015_01_03/"
var call_next_document = function(){
  if (documents.length > 0) {
    var urlDocument = url+"documents/"+documents[0];
    var restAPI_document = $.getJSON( urlDocument, function() {
    });
    restAPI_document.done(function(data, textStatus) {
        console.log(  urlDocument+" -> " + textStatus );
        $( "#"+data.id ).append('<a href="'+data.url+'">'+data.name+'</a><div class="panel-body"></div>');
        call_pages();
    });
    restAPI_document.fail(function() {
      console.log( urlDocument+" -> error" );
    });
    restAPI_document.always(function() {
    });
  }
}

//url+"documents/2015_01_03/pages"
var call_pages = function(){
  if (documents.length > 0) {
    var urlPages = url+"documents/"+documents[0]+"/pages?contains="+searching_word;
    var restAPI_pages = $.getJSON( urlPages, function() {
    });
    restAPI_pages.done(function(data, textStatus) {
      console.log( urlPages+" -> " + textStatus );
      if (textStatus == 'success') {
        $( '#'+documents[0]).addClass( "list-group-item-success" );
        data.forEach(function (doc){
          var page_id = documents[0]+doc.num_page;
          $( '#'+documents[0] +' .panel-body').append('<a href="#" onclick="show_text(result_'+page_id+')" id="'+page_id+'" class="page_item list-group-item">'+doc.num_page+'<span class="badge">?</span></a>');
          $('#results').append('<div class="text_page" id="result_'+page_id+'">'+doc.content+'</div>');
        });        
      }

      documents.shift();
      call_next_document();
    });
    restAPI_pages.fail(function() {
      console.log( urlPages+" -> error" );
    });
    restAPI_pages.always(function() {
    });
  }
}


var find_word = function(word){
  searching_word = word;
  $('#documents .list-group').empty();
  $('#results .text_page').empty();

  var restAPI_documents = $.getJSON( url+"documents", function() {
  });
  restAPI_documents.done(function(data, textStatus) {
    console.log(  url+"documents"+" -> "+ textStatus );
    documents = data;
    data.forEach(function (document_id){
    $( "#documents ul" ).append('<li class="list-group-item" id="'+document_id+'"></li>');
    });
    call_next_document();
  });
  restAPI_documents.fail(function() {
    console.log( url+"documents"+" -> error" );
  });
  restAPI_documents.always(function() {
  });


}