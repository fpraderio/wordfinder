

'use strict';

var callbackPageDone = function(page, total_pages, page_text, indexes){
  var result = document.getElementById('result');
  result.innerHTML = result.innerHTML + 'page:' + page + ' total_pages: ' + total_pages + '</br>';
  if (indexes.length > 0) {
    var start = 0;
    var custom_text = '';
    for (i = 0; i < indexes.length; i++) {
      custom_text = custom_text + page_text.substring(start, indexes[i]) + '*';
      start = indexes[i];
    }
    custom_text = custom_text + page_text.substring(start, page_text.length);
    result.innerHTML = result.innerHTML + custom_text + '</br>';
  }
}
var callbackAllDone = function(total){
  var result = document.getElementById('result');

  result.innerHTML = result.innerHTML + 'total: ' + total ;
}

var pdf2TextClass = new Pdf2TextClass();
pdf2TextClass.pdfToText('gm2014_32.pdf','plenari', callbackPageDone, callbackAllDone);


