function Pdf2TextClass(){
     var self = this;
     this.complete = 0;

    /**
     *
     * @param data ArrayBuffer of the pdf file content
     * @param word to find
     * @param callbackPageDone To inform the progress each time
     *        when a page is finished. The callback function's input parameters are:
     *        1) number of pages done;
     *        2) total number of pages in file.
     * @param callbackAllDone The input parameter of callback function is 
     *        the result of extracted text from pdf file.
     *
     */
     this.pdfToText = function(data, word, callbackPageDone, callbackAllDone){
     console.assert( data  instanceof ArrayBuffer  || typeof data == 'string' );
     PDFJS.getDocument( data ).then( function(pdf) {
     var div = document.getElementById('viewer');

     var total = pdf.numPages;        
     var layers = {};        
     for (i = 1; i <= total; i++){
        pdf.getPage(i).then( function(page){
        var n = page.pageNumber;
        page.getTextContent().then( function(textContent){
          var indexis;
          if( null != textContent.items ){
            var page_text = "";
            var last_block = null;
            for( var k = 0; k < textContent.items.length; k++ ){
                var block = textContent.items[k];
                if( last_block != null && last_block.str[last_block.str.length-1] != ' '){
                    if( block.x < last_block.x )
                        page_text += "\r\n"; 
                    else if ( last_block.y != block.y && ( last_block.str.match(/^(\s?[a-zA-Z])$|^(.+\s[a-zA-Z])$/) == null ))
                        page_text += ' ';
                }
                page_text += block.str;
                last_block = block;
            }

            layers[n] =  page_text + "\n\n";
            indexis = getIndicesOf(word, page_text, false);
          }
          ++ self.complete;
          callbackPageDone( self.complete, total, page_text, indexis);
          if (self.complete == total){
              callbackAllDone(total);
          }
        }); // end  of page.getTextContent().then
      }); // end of page.then
    } // of for
  });
 }; // end of pdfToText()

 function getIndicesOf(searchStr, str, caseSensitive) {
    var startIndex = 0, searchStrLen = searchStr.length;
    var index, indices = [];
    if (!caseSensitive) {
        str = str.toLowerCase();
        searchStr = searchStr.toLowerCase();
    }
    while ((index = str.indexOf(searchStr, startIndex)) > -1) {
        indices.push(index);
        startIndex = index + searchStrLen;
    }
    return indices;
}
}; // end of class