/*
  Class.js
*/

define(function(require, exports, module) {
	"use strict";

  var Class = exports;

  /* Methods: Class.extend, Class.Class.define, Class.derive, Class.mix */
  
  exports.extend = function (origin, staticMethods) {
    var keys = Object.keys(staticMethods),
      extended = staticMethods.prototype ? staticMethods.prototype._extended : undefined,
      index = keys.length,
      properties;

    while (index--) {
      var key = keys[index],
          method = staticMethods[key],
          enumerable = key.charCodeAt(0) !== 95; // "_" symbol

      if (typeof method === 'object') {
        if (method.value !== undefined || typeof method.get === 'function' || typeof method.set === 'function') {
          if (method.enumerable === undefined) {
            method.enumerable = enumerable;
            properties = properties || {};
            properties[key] = method;
            continue;
          }
        }
      }

      if (!enumerable) {
        properties = properties || {};
        properties[key] = { value: method, enumerable: enumerable, configurable: true, writable: true }
        continue;
      }
      // define method
      origin[key] = method;
    }
    // define properties
    if (properties) {
      Object.defineProperties(origin, properties);
    }

    if (extended) {
      extended(origin);
    }

    return origin;        
  };

  exports.mix = function (origin) {
    var index = arguments.length;
    while (index--) {
      Class.extend(origin.prototype, arguments[index]);
    }
    return origin;
  };

  exports.define = function (constructor, instanceMethods, staticMethods) {
    constructor = constructor || function () { };
    if (instanceMethods) {
        Class.mix(constructor, instanceMethods);
    }
    if (staticMethods) {
        Class.extend(constructor, staticMethods);
    }
    return constructor;
  };

  exports.derive = function derive(baseClass, constructor, instanceMethods, staticMethods) {
    // ignore baseClass if undefined
    if (!baseClass) {
      return define(constructor, instanceMethods, staticMethods);
    }

    constructor = constructor || function () { };
    var basePrototype = baseClass.prototype;
    // copy prototype to new class
    constructor.prototype = Object.create(basePrototype,
      {
        constructor: {
          value: constructor,
          enumerable: true,
          writable: true,
          configurable: true
        }
      }
    );

    if (instanceMethods) {
        Class.extend(constructor.prototype, instanceMethods);
    }
    if (staticMethods) {
        Class.extend(constructor, staticMethods);
    }
    return constructor;
  };


  /* Namespace Method Class.Namespace.define(global, "name") */
	exports.Namespace = {
		define: function (rootNamespace, name, object) {
      var currentNamespace = rootNamespace,
          namespaceFragments = name.split("."),
          length = namespaceFragments.length,
          index;

      for (index = 0; index < length; index++) {
        var namespaceName = namespaceFragments[index];
        if (index == length-1 && object) {
          currentNamespace[namespaceName] = object;
        } else {
          if (!currentNamespace[namespaceName]) {
            currentNamespace[namespaceName] = {};
          }
          currentNamespace = currentNamespace[namespaceName];
        }
      }

      return currentNamespace;
    }
	};

});