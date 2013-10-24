(function(){
  //Set Elements
  var resultEl = $('#result');
  var imageEl = $('#image');
  var textareaEl = $('#textarea');
  var dataURISizeEl = $('#dataURISize');
  var originalSizeEl = $('#originalSize');
  var upEl = $('#up');
  var nameEl = $('#name');
  var dropZoneEl = $('#drop_zone');
  var captionEl = $('#caption');

  /**
   * addComma
   * @param {Number} n
   * @returns {string}
   */
  var addComma = function(n) {
    var num = n.toString().replace(/,/g, "");
    while(num != (num = num.replace(/^(-?\d+)(\d{3})/, "$1,$2")));
    return num;
  };

  /**
   * HighlightDropZone
   * @param event
   */
  var highlightDropZone = function(event) {
    event.stopPropagation();
    event.preventDefault();
    dropZoneEl.addClass('alert-success');
  };

  /**
   * RemoveDropZoneClass
   */
  var removeDropZoneClass = function () {
    dropZoneEl.removeClass('alert-success');
  };

  /**
   * ProcessFiles
   * @param event
   */
  var processFiles = function(event) {
    event.stopPropagation();
    event.preventDefault();
    removeDropZoneClass();
    var e = event.originalEvent;
    var file = e.dataTransfer.files[0];
    var reader = new FileReader();

    if(!file){
      return;
    }

    // set onload function
    reader.onload = (function(file) {
      var imageType = /image.*/;
      if (!file.type.match(imageType)) {
        //Bad file type.
        return;
      }
      return function(e) {
        var dataUri = e.target.result; //DataURI Strings
        var before = file.size; //Original File Size
        var after = e.target.result.length;
        originalSizeEl.text(addComma(before));
        dataURISizeEl.text(addComma(after));
        imageEl[0].src = dataUri;
        textareaEl.val(dataUri);
        upEl.text(Math.round( ((after - before)/ before) * 10000) / 100);
        nameEl.text(file.name);
        captionEl.hide();
        resultEl.show();

      }
    })(file);

    // read file as data URI
    reader.readAsDataURL(file);
  };

  //setEvents
  if (window.File && window.FileReader && window.FileList && window.Blob) {
    dropZoneEl.bind('drop', processFiles);
    dropZoneEl.bind('dragover', highlightDropZone);
    dropZoneEl.bind('dragenter', highlightDropZone);
    dropZoneEl.bind('dragleave', removeDropZoneClass);
  } else {
    captionEl.text('The File APIs are not fully supported in this browser.');
    captionEl.addClass('error');
  }

})();