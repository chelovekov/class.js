describe("Class methods", function() {
  it("Class.define", function() {
    var MyClass = require("class").define(function(add) {
      // constructor
      this.a = 3 + add;
    },
    {
      // instance methods
      getA : function() {
        return this.a;
      }
    },
    {
      // static methods
      getC : function() {
        return 7;
      }
    });

    expect(MyClass.getC()).toBe(7);
    myObj = new MyClass(1);
    expect(myObj.a).toBe(4);
    expect(myObj.getA()).toBe(4);
  });

  it("Class.extend with property support", function() {
    var MyClass = require("class").define(undefined,
    {
      storedValue: 0,

      value: {
        set: function(newValue) {
          this.storedValue = newValue + 42;
        },
        get: function() {
          return this.storedValue;
        }
      }
    },undefined);

    myObj = new MyClass();
    expect(myObj.value).toBe(0);

    myObj.value = 8;
    expect(myObj.value).toBe(50);
  });

  it("_extended call", function() {
    var staticMethods = { 
      value: 5
    };
    staticMethods.prototype = {
      _extended: function(base) {
        base.value = 10;
      }
    };

    var MyClass = require("class").define(undefined, undefined, staticMethods);
    
    expect(MyClass.value).toBe(10);
  });

  it("iterator example", function() {
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
  });
});

describe("Class.Namespace", function() {
  it("Class.Namespace.define", function() {
    var Namespace = require("class").Namespace;
    var Application = {};
    Namespace.define(Application, "Class", require("class"));
    expect(Application.Class.Namespace).toBe(require("class").Namespace);
  });
});