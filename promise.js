function Promise() {
  this.status = "PENDING"; // PENDING | RESOLVED
  this.data   = null;
  this.callbacks = [];
  return this;
};

Promise.prototype.resolve = function(data, multiple) {
  this.status = "RESOLVED";
  this.data = data;

  for(var i = 0; i < this.callbacks.length; i++) {
    if(multiple) this.callbacks[i].apply(this, data);
    else         this.callbacks[i](data);
  }
};

Promise.prototype.done = function(callback) {
  if(this.status === "PENDING") this.callbacks.push(callback);
  else                          callback(this.data);

  return this;
};

Promise.when = function(promises) {
  // Resolve with new promise(p1, p2, p3, ...)
  // when all promises have been fulfilled
  var retpromise      = new Promise();
  var retpromise_data = [];
  var promise_counter = promises.length - 1;

  for(var i = 0; i < promises.length; i++) {
    (function(j) {
      promises[j].done(function(res) {
        retpromise_data[j] = res;
        if(--promise_counter < 0) { retpromise.resolve(retpromise_data, true); }
      });
    })(i);
  }

  return retpromise;
};



(function(Promise) {
  var p1 = new Promise();
  var p2 = new Promise();
  var p3 = new Promise();

  console.log("Initiating promise1");
  // Resolve p1 after 1 second
  setTimeout(function() {
    p1.resolve("promise1");
  }, 1000);

  console.log("Initiating promise2");
  // Resolve p2 after 2 seconds
  setTimeout(function() {
    p2.resolve("promise2");
  }, 2000);

  console.log("Initiating promise3");
  // Resolve p2 after 2 seconds
  setTimeout(function() {
    p3.resolve("promise3");
  }, 5000);

  Promise.when([p1, p2, p3]).done(function(d1, d2, d3) {
    console.log("All promises returned:", d1, d2, d3);
  });
})(Promise);
