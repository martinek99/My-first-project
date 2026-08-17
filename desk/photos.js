window.careyPhotos = (function () {
  var MAX = 8;
  var MAXW = 1100;
  var QUALITY = 0.72;

  function compress(file, cb) {
    if (!file || !file.type || file.type.indexOf("image/") !== 0) { cb(""); return; }
    var url = URL.createObjectURL(file);
    var img = new Image();
    img.onload = function () {
      var w = img.naturalWidth || img.width;
      var h = img.naturalHeight || img.height;
      if (w > MAXW) { h = Math.round(h * MAXW / w); w = MAXW; }
      var c = document.createElement("canvas");
      c.width = w;
      c.height = h;
      c.getContext("2d").drawImage(img, 0, 0, w, h);
      URL.revokeObjectURL(url);
      try { cb(c.toDataURL("image/jpeg", QUALITY)); }
      catch (e) { cb(""); }
    };
    img.onerror = function () { URL.revokeObjectURL(url); cb(""); };
    img.src = url;
  }

  function addFiles(files, current, onDone) {
    var list = Array.prototype.slice.call(files || []);
    var room = Math.max(0, MAX - (current || []).length);
    var out = (current || []).slice();
    var i = 0;
    function next() {
      if (i >= list.length || out.length >= MAX) { onDone(out); return; }
      compress(list[i++], function (data) {
        if (data) out.push(data);
        next();
      });
    }
    if (!room) { onDone(out); return; }
    next();
  }

  return { MAX: MAX, addFiles: addFiles };
})();
