var url = "http://localhost/pdf/wordfinder/API_Rest/catalogs/gasetamunicipalbarcelona/";
var documents = [];
var searching_word = "";

var show_text = function(id_text, id_link){
  $('#results .text_page').hide();
  console.log('id_text'+id_text);
  $('a.page_item').removeClass('active');
  $('a#'+id_link).addClass('active');
  $(id_text).show("slow");
}

//url+"documents/2015_01_03/"
var call_next_document = function(){
  if (documents.length > 0) {
    var urlDocument = url+"documents/"+documents[0];
    var restAPI_document = $.getJSON( urlDocument, function() {
    });
    restAPI_document.done(function(data, textStatus) {
        console.log(  urlDocument+" -> " + textStatus );
        $( "#"+data.id ).append('<a class="glyphicon glyphicon-download-alt" aria-hidden="true" href="'+data.url+'"></a> - ');
        $( "#"+data.id ).append('<a data-toggle="collapse" data-parent="#accordion" href="#'+data.id+'_body" aria-expanded="false"  href="'+data.url+'">'+data.name+'</a>');
        $( "#"+data.id ).append('<div class="panel-body panel-collapse collapse" id="'+data.id+'_body" aria-expanded="false"></div>');
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
          $( '#'+documents[0] +' .panel-body').append('<a href="#" onclick="show_text(result_'+page_id+',\''+page_id+'\')" id="'+page_id+'" class="page_item list-group-item">'+doc.num_page+'</a>');
          
          //highlight finded words
          var positions=[],i=-1, content="";
          while((i=doc.content.toLowerCase().indexOf(searching_word.toLowerCase(),i+1)) >= 0) {
            positions.push(i);
          }
          var start = 0;
          for (i = 0; i < positions.length; i++) {
            content += doc.content.substring(start,positions[i]);
            content += "<span class='word_selected'>"+doc.content.substring(positions[i],positions[i]+searching_word.length)+"</span>";
            start = positions[i]+searching_word.length;
          }
          content += doc.content.substring(start,doc.content.length);
          console.log(positions);
          $('#results').append('<div class="text_page" id="result_'+page_id+'">'+content+'</div>');
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