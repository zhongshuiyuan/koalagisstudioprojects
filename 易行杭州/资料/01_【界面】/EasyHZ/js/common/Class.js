/**
* Constructor: KoalaGIS.EASYHZ.Class
* Base class used to construct all other classes. Includes support for 
*     multiple inheritance. 
*     
* To create a new class, use the following syntax:
* (code)
*     var MyClass = KoalaGIS.EASYHZ.Class(prototype);
* (end)
*
* To create a new OpenLayers-style class with multiple inheritance, use the
*     following syntax:
* (code)
*     var MyClass = KoalaGIS.EASYHZ.Class(Class1, Class2, prototype);
* (end)
* 
* Note that instanceof reflection will only reveal Class1 as superclass.
*
*/
KoalaGIS.EASYHZ.Class = function () {
    var len = arguments.length;
    var P = arguments[0];       //基类或是构建对象的属性集合
    var F = arguments[len - 1]; //扩展的属性集合，如果只有一个参数，即创建新类

    var C = typeof F.initialize == "function" ?
        F.initialize :
        function () { P.prototype.initialize.apply(this, arguments); };

    if (len > 1) {              //继承
        var newArgs = [C, P].concat(
                Array.prototype.slice.call(arguments).slice(1, len - 1), F);
        KoalaGIS.EASYHZ.inherit.apply(null, newArgs);
    } else {
        C.prototype = F;
    }
    return C;
};

/**
* Property: isPrototype
* *Deprecated*.  This is no longer needed and will be removed at 3.0.
*/
KoalaGIS.EASYHZ.Class.isPrototype = function () { };

/**
* Function: OpenLayers.inherit
*
* Parameters:
* C - {Object} the class that inherits
* P - {Object} the superclass to inherit from
*
* In addition to the mandatory C and P parameters, an arbitrary number of
* objects can be passed, which will extend C.
*/
KoalaGIS.EASYHZ.inherit = function (C, P) {
    var F = function () { };
    F.prototype = P.prototype;
    C.prototype = new F;
    var i, l, o;
    for (i = 2, l = arguments.length; i < l; i++) {
        o = arguments[i];
        if (typeof o === "function") {
            o = o.prototype;
        }
        OpenLayers.Util.extend(C.prototype, o);
    }
};

/**
* APIFunction: extend
* Copy all properties of a source object to a destination object.  Modifies
*     the passed in destination object.  Any properties on the source object
*     that are set to undefined will not be (re)set on the destination object.
*
* Parameters:
* destination - {Object} The object that will be modified
* source - {Object} The object with properties to be set on the destination
*
* Returns:
* {Object} The destination object.
*/
KoalaGIS.EASYHZ.Util = KoalaGIS.EASYHZ.Util || {};
KoalaGIS.EASYHZ.Util.extend = function (destination, source) {
    destination = destination || {};
    if (source) {
        for (var property in source) {
            var value = source[property];
            if (value !== undefined) {
                destination[property] = value;
            }
        }

        /**
        * IE doesn't include the toString property when iterating over an object's
        * properties with the for(property in object) syntax.  Explicitly check if
        * the source has its own toString property.
        */

        /*
        * FF/Windows < 2.0.0.13 reports "Illegal operation on WrappedNative
        * prototype object" when calling hawOwnProperty if the source object
        * is an instance of window.Event.
        */

        var sourceIsEvt = typeof window.Event == "function"
                          && source instanceof window.Event;

        if (!sourceIsEvt
           && source.hasOwnProperty && source.hasOwnProperty("toString")) {
            destination.toString = source.toString;
        }
    }
    return destination;
};
