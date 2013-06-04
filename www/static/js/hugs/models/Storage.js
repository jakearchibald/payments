(function() {
  function Storage(name) {
    this.name_ = name;
    this.obj_ = JSON.parse(localStorage.getItem(name) || '{}');
  }

  var StorageProto = Storage.prototype;

  StorageProto.get = function() {
    return this.obj_;
  };

  StorageProto.set = function(obj) {
    this.obj_ = obj;
    this.save_();
  };

  StorageProto.clear = function(obj) {
    this.obj_ = {};
    this.save_();
  };

  StorageProto.save_ = function(obj) {
    localStorage.setItem(this.name_, JSON.stringify(this.obj_));
  };

  hugs.models.Storage = Storage;
})();