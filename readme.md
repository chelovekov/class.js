Class.js
========

```javascript
var Iterator = require("class").define(function(value){
  // here is constructor
  this.storedValue = value;
}, {
  storedValue: 0,

  // static methods
  inc: function() {
    this.storedValue += 1
  },

  value: {
    get: function() {
      return this.storedValue;
    }
  }
}, {
  // instance methods
  default: function() {
    return new Iterator(1);
  }
});

i1 = Iterator.default();
i2 = new Iterator(3);
i1.inc();
i1.inc();
expect(i1.value).toBe(3);
expect(i2.value).toBe(3);
```