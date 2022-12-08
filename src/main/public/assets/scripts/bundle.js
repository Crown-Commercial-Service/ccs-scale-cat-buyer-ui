/* global $ */
$('.remove_icon').removeClass('hide');
document.addEventListener("DOMContentLoaded", function (event) {


    if (typeof jQuery != 'undefined') {
        $('body').addClass('js-enabled');
        // Initialise all the GOV.UK Frontend components
        window.GOVUKFrontend.initAll();
    }


        // Check for if an element exists
        function exists (elem) {
            return (elem != null && (elem.length >= 0 || elem.innerHTML.length >= 0))
        }

        if (matchMedia) {
            // This matches the `desk` breakpoint in CSS
            var mq = window.matchMedia('(min-width: 769px)')
            // console.log(mq.matches);
            mq.addListener(updateARIAroles)
            // WidthChange(mq);
        }
        var contentToggler = document.querySelectorAll('[data-toggler]')

        function updateARIAroles () {

            if (exists(contentToggler)) {

                // This allows us to iterate on multiple elements [1]
                var index = 0
                for (index = 0; index < contentToggler.length; index++) {

                    // Find the element's toggle target by looking for data-toggle
                    // Note: we're using `getAttribute` instead of `dataset.` due to better browser support for the former
                    var target = contentToggler[index].getAttribute('data-toggler')
                    var contentTarget = []
                    contentTarget[index] = document.querySelector('[data-toggle="' + target + '"]')

                    if (mq.matches && target == 'nav') {

                        // Set default aria attributes
                        // Hide all elements
                        contentToggler[index].setAttribute('aria-expanded', true)
                        contentTarget[index].setAttribute('aria-hidden', false)
                        // contentTarget[index].setAttribute('hidden', true);

                    }
                    else {

                        // Set default aria attributes
                        // Hide all elements
                        contentToggler[index].setAttribute('aria-expanded', false)
                        contentTarget[index].setAttribute('aria-hidden', true)

                    }

                }

            } // end of exists

        } // end of function



    // call this on page load
    updateARIAroles();


        // Class toggler
        // This is used for the search and the main navigation
        // -----------------------------------------------------------------------------------------

        if (exists(contentToggler)) {

            // This allows us to iterate on multiple elements [1]
            var index = 0
            for (index = 0; index < contentToggler.length; index++) {

                // Find the toggle target by looking for data-toggle
                // Note: we're using `getAttribute` instead of `dataset.` due to better browser support for the former
                var target = contentToggler[index].getAttribute('data-toggler')
                var contentTarget = []
                contentTarget[index] = document.querySelector('[data-toggle="' + target + '"]')

                // Listen for click event, toggle attributes and class names
                contentToggler[index].addEventListener('click', function (e) {

                        // Check the target of the element event
                        // Note: we're using `getAttribute` instead of `dataset.` due to better browser support for the former
                        var target = this.getAttribute('data-toggler')
                        // class to toggle on the body

                        var contentTarget = document.querySelector('[data-toggle="' + target + '"]')

                        var state = this.getAttribute('aria-expanded') === 'false' ? true : false

                        // Loop through all elements because some elements might have the same target and their aria needs to be updated as well
                        var index = 0
                        for (index = 0; index < contentToggler.length; index++) {

                            // Note: we're using `getAttribute` instead of `dataset.` due to better browser support for the former
                            if (contentToggler[index].getAttribute('data-toggler') == target) {
                                contentToggler[index].setAttribute('aria-expanded', state)
                            }
                        }

                        contentTarget.setAttribute('aria-hidden', !state)

                        var toggledLabel = this.getAttribute('data-toggler-toggled')
                        var untoggledLabel = this.getAttribute('data-toggler-untoggled')

                        if (state && toggledLabel && untoggledLabel) {
                            // document.body.classList.add(bodyClass)
                            // Make sure there is a toggled label set, otherwise we'll accidentally replace the entire node of the element (which we don't want)
                            if (exists(toggledLabel)) {
                                this.innerHTML = toggledLabel
                            }
                        } else if (untoggledLabel) {
                            // Make sure there is a toggled label set, otherwise we'll accidentally replace the entire node of the element (which we don't want)
                            if (exists(untoggledLabel)) {
                                this.innerHTML = untoggledLabel
                            }
                            // document.body.classList.remove(bodyClass)
                        }

                        e.preventDefault()

                    }
                    ,
                    false
                )

                // }

            }

        } // end of exists



});

(function (global, factory) {
	typeof exports === 'object' && typeof module !== 'undefined' ? factory(exports) :
	typeof define === 'function' && define.amd ? define('GOVUKFrontend', ['exports'], factory) :
	(factory((global.GOVUKFrontend = {})));
}(this, (function (exports) { 'use strict';

function nodeListForEach (nodes, callback) {
  if (window.NodeList.prototype.forEach) {
    return nodes.forEach(callback)
  }
  for (var i = 0; i < nodes.length; i++) {
    callback.call(window, nodes[i], i, nodes);
  }
}

// Used to generate a unique string, allows multiple instances of the component without
// Them conflicting with each other.
// https://stackoverflow.com/a/8809472
// For generating secure random

class Secure{
  RandomNumber(){
  const Unit8Arr = new Uint8Array(1);
  window.crypto.getRandomValues(Unit8Arr);
  return Unit8Arr[0]
  }
}





function generateUniqueID () {
  var d = new Date().getTime();
  if (typeof window.performance !== 'undefined' && typeof window.performance.now === 'function') {
    d += window.performance.now(); // use high-precision timer if available
  }
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
    let SecureRandom = new Secure();
    let RandomVar = SecureRandom.RandomNumber();
    RandomVar = RandomVar/ 100;
    var r = (d + RandomVar * 16) % 16 | 0;
    d = Math.floor(d / 16);
    return (c === 'x' ? r : (r & 0x3 | 0x8)).toString(16)
  })
}




(function(undefined) {

// Detection from https://github.com/Financial-Times/polyfill-service/blob/master/packages/polyfill-library/polyfills/Object/defineProperty/detect.js
var detect = (
  // In IE8, defineProperty could only act on DOM elements, so full support
  // for the feature requires the ability to set a property on an arbitrary object
  'defineProperty' in Object && (function() {
  	try {
  		var a = {};
  		Object.defineProperty(a, 'test', {value:42});
  		return true;
  	} catch(e) {
  		return false
  	}
  }())
);

if (detect) return

// Polyfill from https://cdn.polyfill.io/v2/polyfill.js?features=Object.defineProperty&flags=always
(function (nativeDefineProperty) {

	var supportsAccessors = Object.prototype.hasOwnProperty('__defineGetter__');
	var ERR_ACCESSORS_NOT_SUPPORTED = 'Getters & setters cannot be defined on this javascript engine';
	var ERR_VALUE_ACCESSORS = 'A property cannot both have accessors and be writable or have a value';

	Object.defineProperty = function defineProperty(object, property, descriptor) {

		// Where native support exists, assume it
		if (nativeDefineProperty && (object === window || object === document || object === Element.prototype || object instanceof Element)) {
			return nativeDefineProperty(object, property, descriptor);
		}

		if (object === null || !(object instanceof Object || typeof object === 'object')) {
			throw new TypeError('Object.defineProperty called on non-object');
		}

		if (!(descriptor instanceof Object)) {
			throw new TypeError('Property description must be an object');
		}

		var propertyString = String(property);
		var hasValueOrWritable = 'value' in descriptor || 'writable' in descriptor;
		var getterType = 'get' in descriptor && typeof descriptor.get;
		var setterType = 'set' in descriptor && typeof descriptor.set;

		// handle descriptor.get
		if (getterType) {
			if (getterType !== 'function') {
				throw new TypeError('Getter must be a function');
			}
			if (!supportsAccessors) {
				throw new TypeError(ERR_ACCESSORS_NOT_SUPPORTED);
			}
			if (hasValueOrWritable) {
				throw new TypeError(ERR_VALUE_ACCESSORS);
			}
			Object.__defineGetter__.call(object, propertyString, descriptor.get);
		} else {
			object[propertyString] = descriptor.value;
		}

		// handle descriptor.set
		if (setterType) {
			if (setterType !== 'function') {
				throw new TypeError('Setter must be a function');
			}
			if (!supportsAccessors) {
				throw new TypeError(ERR_ACCESSORS_NOT_SUPPORTED);
			}
			if (hasValueOrWritable) {
				throw new TypeError(ERR_VALUE_ACCESSORS);
			}
			Object.__defineSetter__.call(object, propertyString, descriptor.set);
		}

		// OK to define value unconditionally - if a getter has been specified as well, an error would be thrown above
		if ('value' in descriptor) {
			object[propertyString] = descriptor.value;
		}

		return object;
	};
}(Object.defineProperty));
})
.call('object' === typeof window && window || 'object' === typeof self && self || 'object' === typeof global && global || {});

(function(undefined) {
  // Detection from https://github.com/Financial-Times/polyfill-service/blob/master/packages/polyfill-library/polyfills/Function/prototype/bind/detect.js
  var detect = 'bind' in Function.prototype;

  if (detect) return

  // Polyfill from https://cdn.polyfill.io/v2/polyfill.js?features=Function.prototype.bind&flags=always
  Object.defineProperty(Function.prototype, 'bind', {
      value: function bind(that) { // .length is 1
          // add necessary es5-shim utilities
          var $Array = Array;
          var $Object = Object;
          var ObjectPrototype = $Object.prototype;
          var ArrayPrototype = $Array.prototype;
          var Empty = function Empty() {};
          var to_string = ObjectPrototype.toString;
          var hasToStringTag = typeof Symbol === 'function' && typeof Symbol.toStringTag === 'symbol';
          var isCallable; /* inlined from https://npmjs.com/is-callable */ var fnToStr = Function.prototype.toString, tryFunctionObject = function tryFunctionObject(value) { try { fnToStr.call(value); return true; } catch (e) { return false; } }, fnClass = '[object Function]', genClass = '[object GeneratorFunction]'; isCallable = function isCallable(value) { if (typeof value !== 'function') { return false; } if (hasToStringTag) { return tryFunctionObject(value); } var strClass = to_string.call(value); return strClass === fnClass || strClass === genClass; };
          var array_slice = ArrayPrototype.slice;
          var array_concat = ArrayPrototype.concat;
          var array_push = ArrayPrototype.push;
          var max = Math.max;
          // /add necessary es5-shim utilities

          // 1. Let Target be the this value.
          var target = this;
          // 2. If IsCallable(Target) is false, throw a TypeError exception.
          if (!isCallable(target)) {
              throw new TypeError('Function.prototype.bind called on incompatible ' + target);
          }
          // 3. Let A be a new (possibly empty) internal list of all of the
          //   argument values provided after thisArg (arg1, arg2 etc), in order.
          // XXX slicedArgs will stand in for "A" if used
          var args = array_slice.call(arguments, 1); // for normal call
          // 4. Let F be a new native ECMAScript object.
          // 11. Set the [[Prototype]] internal property of F to the standard
          //   built-in Function prototype object as specified in 15.3.3.1.
          // 12. Set the [[Call]] internal property of F as described in
          //   15.3.4.5.1.
          // 13. Set the [[Construct]] internal property of F as described in
          //   15.3.4.5.2.
          // 14. Set the [[HasInstance]] internal property of F as described in
          //   15.3.4.5.3.
          var bound;
          var binder = function () {

              if (this instanceof bound) {
                  // 15.3.4.5.2 [[Construct]]
                  // When the [[Construct]] internal method of a function object,
                  // F that was created using the bind function is called with a
                  // list of arguments ExtraArgs, the following steps are taken:
                  // 1. Let target be the value of F's [[TargetFunction]]
                  //   internal property.
                  // 2. If target has no [[Construct]] internal method, a
                  //   TypeError exception is thrown.
                  // 3. Let boundArgs be the value of F's [[BoundArgs]] internal
                  //   property.
                  // 4. Let args be a new list containing the same values as the
                  //   list boundArgs in the same order followed by the same
                  //   values as the list ExtraArgs in the same order.
                  // 5. Return the result of calling the [[Construct]] internal
                  //   method of target providing args as the arguments.

                  var result = target.apply(
                      this,
                      array_concat.call(args, array_slice.call(arguments))
                  );
                  if ($Object(result) === result) {
                      return result;
                  }
                  return this;

              } else {
                  // 15.3.4.5.1 [[Call]]
                  // When the [[Call]] internal method of a function object, F,
                  // which was created using the bind function is called with a
                  // this value and a list of arguments ExtraArgs, the following
                  // steps are taken:
                  // 1. Let boundArgs be the value of F's [[BoundArgs]] internal
                  //   property.
                  // 2. Let boundThis be the value of F's [[BoundThis]] internal
                  //   property.
                  // 3. Let target be the value of F's [[TargetFunction]] internal
                  //   property.
                  // 4. Let args be a new list containing the same values as the
                  //   list boundArgs in the same order followed by the same
                  //   values as the list ExtraArgs in the same order.
                  // 5. Return the result of calling the [[Call]] internal method
                  //   of target providing boundThis as the this value and
                  //   providing args as the arguments.

                  // equiv: target.call(this, ...boundArgs, ...args)
                  return target.apply(
                      that,
                      array_concat.call(args, array_slice.call(arguments))
                  );

              }

          };

          // 15. If the [[Class]] internal property of Target is "Function", then
          //     a. Let L be the length property of Target minus the length of A.
          //     b. Set the length own property of F to either 0 or L, whichever is
          //       larger.
          // 16. Else set the length own property of F to 0.

          var boundLength = max(0, target.length - args.length);

          // 17. Set the attributes of the length own property of F to the values
          //   specified in 15.3.5.1.
          var boundArgs = [];
          for (var i = 0; i < boundLength; i++) {
              array_push.call(boundArgs, '$' + i);
          }

          // XXX Build a dynamic function with desired amount of arguments is the only
          // way to set the length property of a function.
          // In environments where Content Security Policies enabled (Chrome extensions,
          // for ex.) all use of eval or Function costructor throws an exception.
          // However in all of these environments Function.prototype.bind exists
          // and so this code will never be executed.
          bound = Function('binder', 'return function (' + boundArgs.join(',') + '){ return binder.apply(this, arguments); }')(binder);

          if (target.prototype) {
              Empty.prototype = target.prototype;
              bound.prototype = new Empty();
              // Clean up dangling references.
              Empty.prototype = null;
          }
          return bound;
      }
  });
})
.call('object' === typeof window && window || 'object' === typeof self && self || 'object' === typeof global && global || {});

(function(undefined) {

    // Detection from https://raw.githubusercontent.com/Financial-Times/polyfill-service/master/packages/polyfill-library/polyfills/DOMTokenList/detect.js
    var detect = (
      'DOMTokenList' in this && (function (x) {
        return 'classList' in x ? !x.classList.toggle('x', false) && !x.className : true;
      })(document.createElement('x'))
    );

    if (detect) return

    // Polyfill from https://raw.githubusercontent.com/Financial-Times/polyfill-service/master/packages/polyfill-library/polyfills/DOMTokenList/polyfill.js
    (function (global) {
      var nativeImpl = "DOMTokenList" in global && global.DOMTokenList;

      if (
          !nativeImpl ||
          (
            !!document.createElementNS &&
            !!document.createElementNS('http://www.w3.org/2000/svg', 'svg') &&
            !(document.createElementNS("http://www.w3.org/2000/svg", "svg").classList instanceof DOMTokenList)
          )
        ) {
        global.DOMTokenList = (function() { // eslint-disable-line no-unused-vars
          var dpSupport = true;
          var defineGetter = function (object, name, fn, configurable) {
            if (Object.defineProperty)
              Object.defineProperty(object, name, {
                configurable: false === dpSupport ? true : !!configurable,
                get: fn
              });

            else object.__defineGetter__(name, fn);
          };

          /** Ensure the browser allows Object.defineProperty to be used on native JavaScript objects. */
          try {
            defineGetter({}, "support");
          }
          catch (e) {
            dpSupport = false;
          }


          var _DOMTokenList = function (el, prop) {
            var that = this;
            var tokens = [];
            var tokenMap = {};
            var length = 0;
            var maxLength = 0;
            var addIndexGetter = function (i) {
              defineGetter(that, i, function () {
                preop();
                return tokens[i];
              }, false);

            };
            var reindex = function () {

              /** Define getter functions for array-like access to the tokenList's contents. */
              if (length >= maxLength)
                for (; maxLength < length; ++maxLength) {
                  addIndexGetter(maxLength);
                }
            };

            /** Helper function called at the start of each class method. Internal use only. */
            var preop = function () {
              var error;
              var i;
              var args = arguments;
              var rSpace = /\s+/;

              /** Validate the token/s passed to an instance method, if any. */
              if (args.length)
                for (i = 0; i < args.length; ++i)
                  if (rSpace.test(args[i])) {
                    error = new SyntaxError('String "' + args[i] + '" ' + "contains" + ' an invalid character');
                    error.code = 5;
                    error.name = "InvalidCharacterError";
                    throw error;
                  }


              /** Split the new value apart by whitespace*/
              if (typeof el[prop] === "object") {
                tokens = ("" + el[prop].baseVal).replace(/^\s+|\s+$/g, "").split(rSpace);
              } else {
                tokens = ("" + el[prop]).replace(/^\s+|\s+$/g, "").split(rSpace);
              }

              /** Avoid treating blank strings as single-item token lists */
              if ("" === tokens[0]) tokens = [];

              /** Repopulate the internal token lists */
              tokenMap = {};
              for (i = 0; i < tokens.length; ++i)
                tokenMap[tokens[i]] = true;
              length = tokens.length;
              reindex();
            };

            /** Populate our internal token list if the targeted attribute of the subject element isn't empty. */
            preop();

            /** Return the number of tokens in the underlying string. Read-only. */
            defineGetter(that, "length", function () {
              preop();
              return length;
            });

            /** Override the default toString/toLocaleString methods to return a space-delimited list of tokens when typecast. */
            that.toLocaleString =
              that.toString = function () {
                preop();
                return tokens.join(" ");
              };

            that.item = function (idx) {
              preop();
              return tokens[idx];
            };

            that.contains = function (token) {
              preop();
              return !!tokenMap[token];
            };

            that.add = function () {
              preop.apply(that, args = arguments);

              for (var args, token, i = 0, l = args.length; i < l; ++i) {
                token = args[i];
                if (!tokenMap[token]) {
                  tokens.push(token);
                  tokenMap[token] = true;
                }
              }

              /** Update the targeted attribute of the attached element if the token list's changed. */
              if (length !== tokens.length) {
                length = tokens.length >>> 0;
                if (typeof el[prop] === "object") {
                  el[prop].baseVal = tokens.join(" ");
                } else {
                  el[prop] = tokens.join(" ");
                }
                reindex();
              }
            };

            that.remove = function () {
              preop.apply(that, args = arguments);

              /** Build a hash of token names to compare against when recollecting our token list. */
              for (var args, ignore = {}, i = 0, t = []; i < args.length; ++i) {
                ignore[args[i]] = true;
                delete tokenMap[args[i]];
              }

              /** Run through our tokens list and reassign only those that aren't defined in the hash declared above. */
              for (i = 0; i < tokens.length; ++i)
                if (!ignore[tokens[i]]) t.push(tokens[i]);

              tokens = t;
              length = t.length >>> 0;

              /** Update the targeted attribute of the attached element. */
              if (typeof el[prop] === "object") {
                el[prop].baseVal = tokens.join(" ");
              } else {
                el[prop] = tokens.join(" ");
              }
              reindex();
            };

            that.toggle = function (token, force) {
              preop.apply(that, [token]);

              /** Token state's being forced. */
              if (undefined !== force) {
                if (force) {
                  that.add(token);
                  return true;
                } else {
                  that.remove(token);
                  return false;
                }
              }

              /** Token already exists in tokenList. Remove it, and return FALSE. */
              if (tokenMap[token]) {
                that.remove(token);
                return false;
              }

              /** Otherwise, add the token and return TRUE. */
              that.add(token);
              return true;
            };

            return that;
          };

          return _DOMTokenList;
        }());
      }

      // Add second argument to native DOMTokenList.toggle() if necessary
      (function () {
        var e = document.createElement('span');
        if (!('classList' in e)) return;
        e.classList.toggle('x', false);
        if (!e.classList.contains('x')) return;
        e.classList.constructor.prototype.toggle = function toggle(token /*, force*/) {
          var force = arguments[1];
          if (force === undefined) {
            var add = !this.contains(token);
            this[add ? 'add' : 'remove'](token);
            return add;
          }
          force = !!force;
          this[force ? 'add' : 'remove'](token);
          return force;
        };
      }());

      // Add multiple arguments to native DOMTokenList.add() if necessary
      (function () {
        var e = document.createElement('span');
        if (!('classList' in e)) return;
        e.classList.add('a', 'b');
        if (e.classList.contains('b')) return;
        var native = e.classList.constructor.prototype.add;
        e.classList.constructor.prototype.add = function () {
          var args = arguments;
          var l = arguments.length;
          for (var i = 0; i < l; i++) {
            native.call(this, args[i]);
          }
        };
      }());

      // Add multiple arguments to native DOMTokenList.remove() if necessary
      (function () {
        var e = document.createElement('span');
        if (!('classList' in e)) return;
        e.classList.add('a');
        e.classList.add('b');
        e.classList.remove('a', 'b');
        if (!e.classList.contains('b')) return;
        var native = e.classList.constructor.prototype.remove;
        e.classList.constructor.prototype.remove = function () {
          var args = arguments;
          var l = arguments.length;
          for (var i = 0; i < l; i++) {
            native.call(this, args[i]);
          }
        };
      }());

    }(this));

}).call('object' === typeof window && window || 'object' === typeof self && self || 'object' === typeof global && global || {});

(function(undefined) {

// Detection from https://github.com/Financial-Times/polyfill-service/blob/master/packages/polyfill-library/polyfills/Document/detect.js
var detect = ("Document" in this);

if (detect) return

// Polyfill from https://cdn.polyfill.io/v2/polyfill.js?features=Document&flags=always
if ((typeof WorkerGlobalScope === "undefined") && (typeof importScripts !== "function")) {

	if (this.HTMLDocument) { // IE8

		// HTMLDocument is an extension of Document.  If the browser has HTMLDocument but not Document, the former will suffice as an alias for the latter.
		this.Document = this.HTMLDocument;

	} else {

		// Create an empty function to act as the missing constructor for the document object, attach the document object as its prototype.  The function needs to be anonymous else it is hoisted and causes the feature detect to prematurely pass, preventing the assignments below being made.
		this.Document = this.HTMLDocument = document.constructor = (new Function('return function Document() {}')());
		this.Document.prototype = document;
	}
}


})
.call('object' === typeof window && window || 'object' === typeof self && self || 'object' === typeof global && global || {});

(function(undefined) {

// Detection from https://github.com/Financial-Times/polyfill-service/blob/master/packages/polyfill-library/polyfills/Element/detect.js
var detect = ('Element' in this && 'HTMLElement' in this);

if (detect) return

// Polyfill from https://cdn.polyfill.io/v2/polyfill.js?features=Element&flags=always
(function () {

	// IE8
	if (window.Element && !window.HTMLElement) {
		window.HTMLElement = window.Element;
		return;
	}

	// create Element constructor
	window.Element = window.HTMLElement = new Function('return function Element() {}')();

	// generate sandboxed iframe
	var vbody = document.appendChild(document.createElement('body'));
	var frame = vbody.appendChild(document.createElement('iframe'));

	// use sandboxed iframe to replicate Element functionality
	var frameDocument = frame.contentWindow.document;
	var prototype = Element.prototype = frameDocument.appendChild(frameDocument.createElement('*'));
	var cache = {};

	// polyfill Element.prototype on an element
	var shiv = function (element, deep) {
		var
		childNodes = element.childNodes || [],
		index = -1,
		key, value, childNode;

		if (element.nodeType === 1 && element.constructor !== Element) {
			element.constructor = Element;

			for (key in cache) {
				value = cache[key];
				element[key] = value;
			}
		}

		while (childNode = deep && childNodes[++index]) {
			shiv(childNode, deep);
		}

		return element;
	};

	var elements = document.getElementsByTagName('*');
	var nativeCreateElement = document.createElement;
	var interval;
	var loopLimit = 100;

	prototype.attachEvent('onpropertychange', function (event) {
		var
		propertyName = event.propertyName,
		nonValue = !cache.hasOwnProperty(propertyName),
		newValue = prototype[propertyName],
		oldValue = cache[propertyName],
		index = -1,
		element;

		while (element = elements[++index]) {
			if (element.nodeType === 1) {
				if (nonValue || element[propertyName] === oldValue) {
					element[propertyName] = newValue;
				}
			}
		}

		cache[propertyName] = newValue;
	});

	prototype.constructor = Element;

	if (!prototype.hasAttribute) {
		// <Element>.hasAttribute
		prototype.hasAttribute = function hasAttribute(name) {
			return this.getAttribute(name) !== null;
		};
	}

	// Apply Element prototype to the pre-existing DOM as soon as the body element appears.
	function bodyCheck() {
		if (!(loopLimit--)) clearTimeout(interval);
		if (document.body && !document.body.prototype && /(complete|interactive)/.test(document.readyState)) {
			shiv(document, true);
			if (interval && document.body.prototype) clearTimeout(interval);
			return (!!document.body.prototype);
		}
		return false;
	}
	if (!bodyCheck()) {
		document.onreadystatechange = bodyCheck;
		interval = setInterval(bodyCheck, 25);
	}

	// Apply to any new elements created after load
	document.createElement = function createElement(nodeName) {
		var element = nativeCreateElement(String(nodeName).toLowerCase());
		return shiv(element);
	};

	// remove sandboxed iframe
	document.removeChild(vbody);
}());

})
.call('object' === typeof window && window || 'object' === typeof self && self || 'object' === typeof global && global || {});

(function(undefined) {

    // Detection from https://raw.githubusercontent.com/Financial-Times/polyfill-service/8717a9e04ac7aff99b4980fbedead98036b0929a/packages/polyfill-library/polyfills/Element/prototype/classList/detect.js
    var detect = (
      'document' in this && "classList" in document.documentElement && 'Element' in this && 'classList' in Element.prototype && (function () {
        var e = document.createElement('span');
        e.classList.add('a', 'b');
        return e.classList.contains('b');
      }())
    );

    if (detect) return

    // Polyfill from https://cdn.polyfill.io/v2/polyfill.js?features=Element.prototype.classList&flags=always
    (function (global) {
      var dpSupport = true;
      var defineGetter = function (object, name, fn, configurable) {
        if (Object.defineProperty)
          Object.defineProperty(object, name, {
            configurable: false === dpSupport ? true : !!configurable,
            get: fn
          });

        else object.__defineGetter__(name, fn);
      };
      /** Ensure the browser allows Object.defineProperty to be used on native JavaScript objects. */
      try {
        defineGetter({}, "support");
      }
      catch (e) {
        dpSupport = false;
      }
      /** Polyfills a property with a DOMTokenList */
      var addProp = function (o, name, attr) {

        defineGetter(o.prototype, name, function () {
          var tokenList;

          var THIS = this,

          /** Prevent this from firing twice for some reason. What the hell, IE. */
          gibberishProperty = "__defineGetter__" + "DEFINE_PROPERTY" + name;
          if(THIS[gibberishProperty]) return tokenList;
          THIS[gibberishProperty] = true;

          /**
           * IE8 can't define properties on native JavaScript objects, so we'll use a dumb hack instead.
           *
           * What this is doing is creating a dummy element ("reflection") inside a detached phantom node ("mirror")
           * that serves as the target of Object.defineProperty instead. While we could simply use the subject HTML
           * element instead, this would conflict with element types which use indexed properties (such as forms and
           * select lists).
           */
          if (false === dpSupport) {

            var visage;
            var mirror = addProp.mirror || document.createElement("div");
            var reflections = mirror.childNodes;
            var l = reflections.length;

            for (var i = 0; i < l; ++i)
              if (reflections[i]._R === THIS) {
                visage = reflections[i];
                break;
              }

            /** Couldn't find an element's reflection inside the mirror. Materialise one. */
            visage || (visage = mirror.appendChild(document.createElement("div")));

            tokenList = DOMTokenList.call(visage, THIS, attr);
          } else tokenList = new DOMTokenList(THIS, attr);

          defineGetter(THIS, name, function () {
            return tokenList;
          });
          delete THIS[gibberishProperty];

          return tokenList;
        }, true);
      };

      addProp(global.Element, "classList", "className");
      addProp(global.HTMLElement, "classList", "className");
      addProp(global.HTMLLinkElement, "relList", "rel");
      addProp(global.HTMLAnchorElement, "relList", "rel");
      addProp(global.HTMLAreaElement, "relList", "rel");
    }(this));

}).call('object' === typeof window && window || 'object' === typeof self && self || 'object' === typeof global && global || {});

function Accordion ($module) {
  this.$module = $module;
  this.moduleId = $module.getAttribute('id');
  this.$sections = $module.querySelectorAll('.govuk-accordion__section');
  this.$openAllButton = '';
  this.browserSupportsSessionStorage = helper.checkForSessionStorage();

  this.controlsClass = 'govuk-accordion__controls';
  this.openAllClass = 'govuk-accordion__open-all';
  this.iconClass = 'govuk-accordion__icon';

  this.sectionHeaderClass = 'govuk-accordion__section-header';
  this.sectionHeaderFocusedClass = 'govuk-accordion__section-header--focused';
  this.sectionHeadingClass = 'govuk-accordion__section-heading';
  this.sectionSummaryClass = 'govuk-accordion__section-summary';
  this.sectionButtonClass = 'govuk-accordion__section-button';
  this.sectionExpandedClass = 'govuk-accordion__section--expanded';
}

// Initialize component
Accordion.prototype.init = function () {
  // Check for module
  if (!this.$module) {
    return
  }

  this.initControls();

  this.initSectionHeaders();

  // See if "Open all" button text should be updated
  var areAllSectionsOpen = this.checkIfAllSectionsOpen();
  this.updateOpenAllButton(areAllSectionsOpen);
};

// Initialise controls and set attributes
Accordion.prototype.initControls = function () {
  // Create "Open all" button and set attributes
  this.$openAllButton = document.createElement('button');
  this.$openAllButton.setAttribute('type', 'button');
  this.$openAllButton.innerHTML = 'Open all <span class="govuk-visually-hidden">sections</span>';
  this.$openAllButton.setAttribute('class', this.openAllClass);
  this.$openAllButton.setAttribute('aria-expanded', 'false');
  this.$openAllButton.setAttribute('type', 'button');

  // Create control wrapper and add controls to it
  var accordionControls = document.createElement('div');
  accordionControls.setAttribute('class', this.controlsClass);
  accordionControls.appendChild(this.$openAllButton);
  this.$module.insertBefore(accordionControls, this.$module.firstChild);

  // Handle events for the controls
  this.$openAllButton.addEventListener('click', this.onOpenOrCloseAllToggle.bind(this));
};

// Initialise section headers
Accordion.prototype.initSectionHeaders = function () {
  // Loop through section headers
  nodeListForEach(this.$sections, function ($section, i) {
    // Set header attributes
    var header = $section.querySelector('.' + this.sectionHeaderClass);
    this.initHeaderAttributes(header, i);

    this.setExpanded(this.isExpanded($section), $section);

    // Handle events
    header.addEventListener('click', this.onSectionToggle.bind(this, $section));

    // See if there is any state stored in sessionStorage and set the sections to
    // open or closed.
    this.setInitialState($section);
  }.bind(this));
};

// Set individual header attributes
Accordion.prototype.initHeaderAttributes = function ($headerWrapper, index) {
  var $module = this;
  var $span = $headerWrapper.querySelector('.' + this.sectionButtonClass);
  var $heading = $headerWrapper.querySelector('.' + this.sectionHeadingClass);
  var $summary = $headerWrapper.querySelector('.' + this.sectionSummaryClass);

  // Copy existing span element to an actual button element, for improved accessibility.
  var $button = document.createElement('button');
  $button.setAttribute('type', 'button');
  $button.setAttribute('id', this.moduleId + '-heading-' + (index + 1));
  $button.setAttribute('aria-controls', this.moduleId + '-content-' + (index + 1));

  // Copy all attributes (https://developer.mozilla.org/en-US/docs/Web/API/Element/attributes) from $span to $button
  for (var i = 0; i < $span.attributes.length; i++) {
    var attr = $span.attributes.item(i);
    $button.setAttribute(attr.nodeName, attr.nodeValue);
  }

  $button.addEventListener('focusin', function (e) {
    if (!$headerWrapper.classList.contains($module.sectionHeaderFocusedClass)) {
      $headerWrapper.className += ' ' + $module.sectionHeaderFocusedClass;
    }
  });

  $button.addEventListener('blur', function (e) {
    $headerWrapper.classList.remove($module.sectionHeaderFocusedClass);
  });

  if (typeof ($summary) !== 'undefined' && $summary !== null) {
    $button.setAttribute('aria-describedby', this.moduleId + '-summary-' + (index + 1));
  }

  // $span could contain HTML elements (see https://www.w3.org/TR/2011/WD-html5-20110525/content-models.html#phrasing-content)
  $button.innerHTML = $span.innerHTML;

  $heading.removeChild($span);
  $heading.appendChild($button);

  // Add "+/-" icon
  var icon = document.createElement('span');
  icon.className = this.iconClass;
  icon.setAttribute('aria-hidden', 'true');

  $button.appendChild(icon);
};

// When section toggled, set and store state
Accordion.prototype.onSectionToggle = function ($section) {
  var expanded = this.isExpanded($section);
  this.setExpanded(!expanded, $section);

  // Store the state in sessionStorage when a change is triggered
  this.storeState($section);
};

// When Open/Close All toggled, set and store state
Accordion.prototype.onOpenOrCloseAllToggle = function () {
  var $module = this;
  var $sections = this.$sections;

  var nowExpanded = !this.checkIfAllSectionsOpen();

  nodeListForEach($sections, function ($section) {
    $module.setExpanded(nowExpanded, $section);
    // Store the state in sessionStorage when a change is triggered
    $module.storeState($section);
  });

  $module.updateOpenAllButton(nowExpanded);
};

// Set section attributes when opened/closed
Accordion.prototype.setExpanded = function (expanded, $section) {
  var $button = $section.querySelector('.' + this.sectionButtonClass);
  $button.setAttribute('aria-expanded', expanded);

  if (expanded) {
    $section.classList.add(this.sectionExpandedClass);
  } else {
    $section.classList.remove(this.sectionExpandedClass);
  }

  // See if "Open all" button text should be updated
  var areAllSectionsOpen = this.checkIfAllSectionsOpen();
  this.updateOpenAllButton(areAllSectionsOpen);
};

// Get state of section
Accordion.prototype.isExpanded = function ($section) {
  return $section.classList.contains(this.sectionExpandedClass)
};

// Check if all sections are open
Accordion.prototype.checkIfAllSectionsOpen = function () {
  // Get a count of all the Accordion sections
  var sectionsCount = this.$sections.length;
  // Get a count of all Accordion sections that are expanded
  var expandedSectionCount = this.$module.querySelectorAll('.' + this.sectionExpandedClass).length;
  var areAllSectionsOpen = sectionsCount === expandedSectionCount;

  return areAllSectionsOpen
};

// Update "Open all" button
Accordion.prototype.updateOpenAllButton = function (expanded) {
  var newButtonText = expanded ? 'Close all' : 'Open all';
  newButtonText += '<span class="govuk-visually-hidden">sections</span>';
  this.$openAllButton.setAttribute('aria-expanded', expanded);
  this.$openAllButton.innerHTML = newButtonText;
};

// Check for `window.sessionStorage`, and that it actually works.
var helper = {
  checkForSessionStorage: function () {
    var testString = 'this is the test string';
    var result;
    try {
      window.sessionStorage.setItem(testString, testString);
      result = window.sessionStorage.getItem(testString) === testString.toString();
      window.sessionStorage.removeItem(testString);
      return result
    } catch (exception) {
      if ((typeof console === 'undefined' || typeof console.log === 'undefined')) {
        console.log('Notice: sessionStorage not available.');
      }
    }
  }
};

// Set the state of the accordions in sessionStorage
var accordionsCount = 0;
Accordion.prototype.storeState = function ($section) {
  if (this.browserSupportsSessionStorage) {
    // We need a unique way of identifying each content in the accordion. Since
    // an `#id` should be unique and an `id` is required for `aria-` attributes
    // `id` can be safely used.
    var $button = $section.querySelector('.' + this.sectionButtonClass);

    if ($button) {
      var contentId = $button.getAttribute('aria-controls');
      var contentState = $button.getAttribute('aria-expanded');

      if (typeof contentId === 'undefined' && (typeof console === 'undefined' || typeof console.log === 'undefined')) {
        console.error(new Error('No aria controls present in accordion section heading.'));
      }

      if (typeof contentState === 'undefined' && (typeof console === 'undefined' || typeof console.log === 'undefined')) {
        console.error(new Error('No aria expanded present in accordion section heading.'));
      }

      // Only set the state when both `contentId` and `contentState` are taken from the DOM.
      if (contentId && contentState) {
        window.sessionStorage.setItem(contentId, contentState);
      }
    }
  }
};

// Read the state of the accordions from sessionStorage
Accordion.prototype.setInitialState = function ($section) {
  if (this.browserSupportsSessionStorage) {
    var $button = $section.querySelector('.' + this.sectionButtonClass);

    if ($button) {
      var contentId = $button.getAttribute('aria-controls');
      var contentState = contentId ? window.sessionStorage.getItem(contentId) : null;

      if (contentState !== null) {
        this.setExpanded(contentState === 'true', $section);
      }
    }
  }
};

(function(undefined) {

// Detection from https://github.com/Financial-Times/polyfill-service/blob/master/packages/polyfill-library/polyfills/Window/detect.js
var detect = ('Window' in this);

if (detect) return

// Polyfill from https://cdn.polyfill.io/v2/polyfill.js?features=Window&flags=always
if ((typeof WorkerGlobalScope === "undefined") && (typeof importScripts !== "function")) {
	(function (global) {
		if (global.constructor) {
			global.Window = global.constructor;
		} else {
			(global.Window = global.constructor = new Function('return function Window() {}')()).prototype = this;
		}
	}(this));
}

})
.call('object' === typeof window && window || 'object' === typeof self && self || 'object' === typeof global && global || {});

(function(undefined) {

// Detection from https://github.com/Financial-Times/polyfill-service/blob/master/packages/polyfill-library/polyfills/Event/detect.js
var detect = (
  (function(global) {

  	if (!('Event' in global)) return false;
  	if (typeof global.Event === 'function') return true;

  	try {

  		// In IE 9-11, the Event object exists but cannot be instantiated
  		new Event('click');
  		return true;
  	} catch(e) {
  		return false;
  	}
  }(this))
);

if (detect) return

// Polyfill from https://cdn.polyfill.io/v2/polyfill.js?features=Event&flags=always
(function () {
	var unlistenableWindowEvents = {
		click: 1,
		dblclick: 1,
		keyup: 1,
		keypress: 1,
		keydown: 1,
		mousedown: 1,
		mouseup: 1,
		mousemove: 1,
		mouseover: 1,
		mouseenter: 1,
		mouseleave: 1,
		mouseout: 1,
		storage: 1,
		storagecommit: 1,
		textinput: 1
	};

	// This polyfill depends on availability of `document` so will not run in a worker
	// However, we asssume there are no browsers with worker support that lack proper
	// support for `Event` within the worker
	if (typeof document === 'undefined' || typeof window === 'undefined') return;

	function indexOf(array, element) {
		var
		index = -1,
		length = array.length;

		while (++index < length) {
			if (index in array && array[index] === element) {
				return index;
			}
		}

		return -1;
	}

	var existingProto = (window.Event && window.Event.prototype) || null;
	window.Event = Window.prototype.Event = function Event(type, eventInitDict) {
		if (!type) {
			throw new Error('Not enough arguments');
		}

		var event;
		// Shortcut if browser supports createEvent
		if ('createEvent' in document) {
			event = document.createEvent('Event');
			var bubbles = eventInitDict && eventInitDict.bubbles !== undefined ? eventInitDict.bubbles : false;
			var cancelable = eventInitDict && eventInitDict.cancelable !== undefined ? eventInitDict.cancelable : false;

			event.initEvent(type, bubbles, cancelable);

			return event;
		}

		event = document.createEventObject();

		event.type = type;
		event.bubbles = eventInitDict && eventInitDict.bubbles !== undefined ? eventInitDict.bubbles : false;
		event.cancelable = eventInitDict && eventInitDict.cancelable !== undefined ? eventInitDict.cancelable : false;

		return event;
	};
	if (existingProto) {
		Object.defineProperty(window.Event, 'prototype', {
			configurable: false,
			enumerable: false,
			writable: true,
			value: existingProto
		});
	}

	if (!('createEvent' in document)) {
		window.addEventListener = Window.prototype.addEventListener = Document.prototype.addEventListener = Element.prototype.addEventListener = function addEventListener() {
			var
			element = this,
			type = arguments[0],
			listener = arguments[1];

			if (element === window && type in unlistenableWindowEvents) {
				throw new Error('In IE8 the event: ' + type + ' is not available on the window object. Please see https://github.com/Financial-Times/polyfill-service/issues/317 for more information.');
			}

			if (!element._events) {
				element._events = {};
			}

			if (!element._events[type]) {
				element._events[type] = function (event) {
					var
					list = element._events[event.type].list,
					events = list.slice(),
					index = -1,
					length = events.length,
					eventElement;

					event.preventDefault = function preventDefault() {
						if (event.cancelable !== false) {
							event.returnValue = false;
						}
					};

					event.stopPropagation = function stopPropagation() {
						event.cancelBubble = true;
					};

					event.stopImmediatePropagation = function stopImmediatePropagation() {
						event.cancelBubble = true;
						event.cancelImmediate = true;
					};

					event.currentTarget = element;
					event.relatedTarget = event.fromElement || null;
					event.target = event.target || event.srcElement || element;
					event.timeStamp = new Date().getTime();

					if (event.clientX) {
						event.pageX = event.clientX + document.documentElement.scrollLeft;
						event.pageY = event.clientY + document.documentElement.scrollTop;
					}

					while (++index < length && !event.cancelImmediate) {
						if (index in events) {
							eventElement = events[index];

							if (indexOf(list, eventElement) !== -1 && typeof eventElement === 'function') {
								eventElement.call(element, event);
							}
						}
					}
				};

				element._events[type].list = [];

				if (element.attachEvent) {
					element.attachEvent('on' + type, element._events[type]);
				}
			}

			element._events[type].list.push(listener);
		};

		window.removeEventListener = Window.prototype.removeEventListener = Document.prototype.removeEventListener = Element.prototype.removeEventListener = function removeEventListener() {
			var
			element = this,
			type = arguments[0],
			listener = arguments[1],
			index;

			if (element._events && element._events[type] && element._events[type].list) {
				index = indexOf(element._events[type].list, listener);

				if (index !== -1) {
					element._events[type].list.splice(index, 1);

					if (!element._events[type].list.length) {
						if (element.detachEvent) {
							element.detachEvent('on' + type, element._events[type]);
						}
						delete element._events[type];
					}
				}
			}
		};

		window.dispatchEvent = Window.prototype.dispatchEvent = Document.prototype.dispatchEvent = Element.prototype.dispatchEvent = function dispatchEvent(event) {
			if (!arguments.length) {
				throw new Error('Not enough arguments');
			}

			if (!event || typeof event.type !== 'string') {
				throw new Error('DOM Events Exception 0');
			}

			var element = this, type = event.type;

			try {
				if (!event.bubbles) {
					event.cancelBubble = true;

					var cancelBubbleEvent = function (event) {
						event.cancelBubble = true;

						(element || window).detachEvent('on' + type, cancelBubbleEvent);
					};

					this.attachEvent('on' + type, cancelBubbleEvent);
				}

				this.fireEvent('on' + type, event);
			} catch (error) {
				event.target = element;

				do {
					event.currentTarget = element;

					if ('_events' in element && typeof element._events[type] === 'function') {
						element._events[type].call(element, event);
					}

					if (typeof element['on' + type] === 'function') {
						element['on' + type].call(element, event);
					}

					element = element.nodeType === 9 ? element.parentWindow : element.parentNode;
				} while (element && !event.cancelBubble);
			}

			return true;
		};

		// Add the DOMContentLoaded Event
		document.attachEvent('onreadystatechange', function() {
			if (document.readyState === 'complete') {
				document.dispatchEvent(new Event('DOMContentLoaded', {
					bubbles: true
				}));
			}
		});
	}
}());

})
.call('object' === typeof window && window || 'object' === typeof self && self || 'object' === typeof global && global || {});

var KEY_SPACE = 32;
var DEBOUNCE_TIMEOUT_IN_SECONDS = 1;

function Button ($module) {
  this.$module = $module;
  this.debounceFormSubmitTimer = null;
}

/**
* JavaScript 'shim' to trigger the click event of element(s) when the space key is pressed.
*
* Created since some Assistive Technologies (for example some Screenreaders)
* will tell a user to press space on a 'button', so this functionality needs to be shimmed
* See https://github.com/alphagov/govuk_elements/pull/272#issuecomment-233028270
*
* @param {object} event event
*/
Button.prototype.handleKeyDown = function (event) {
  // get the target element
  var target = event.target;
  // if the element has a role='button' and the pressed key is a space, we'll simulate a click
  if (target.getAttribute('role') === 'button' && event.keyCode === KEY_SPACE) {
    event.preventDefault();
    // trigger the target's click event
    target.click();
  }
};

/**
* If the click quickly succeeds a previous click then nothing will happen.
* This stops people accidentally causing multiple form submissions by
* double clicking buttons.
*/
Button.prototype.debounce = function (event) {
  var target = event.target;
  // Check the button that is clicked on has the preventDoubleClick feature enabled
  if (target.getAttribute('data-prevent-double-click') !== 'true') {
    return
  }

  // If the timer is still running then we want to prevent the click from submitting the form
  if (this.debounceFormSubmitTimer) {
    event.preventDefault();
    return false
  }

  this.debounceFormSubmitTimer = setTimeout(function () {
    this.debounceFormSubmitTimer = null;
  }.bind(this), DEBOUNCE_TIMEOUT_IN_SECONDS * 1000);
};

/**
* Initialise an event listener for keydown at document level
* this will help listening for later inserted elements with a role="button"
*/
Button.prototype.init = function () {
  this.$module.addEventListener('keydown', this.handleKeyDown);
  this.$module.addEventListener('click', this.debounce);
};

/**
 * JavaScript 'polyfill' for HTML5's <details> and <summary> elements
 * and 'shim' to add accessiblity enhancements for all browsers
 *
 * http://caniuse.com/#feat=details
 */

var KEY_ENTER = 13;
var KEY_SPACE$1 = 32;

function Details ($module) {
  this.$module = $module;
}

Details.prototype.init = function () {
  if (!this.$module) {
    return
  }

  // If there is native details support, we want to avoid running code to polyfill native behaviour.
  var hasNativeDetails = typeof this.$module.open === 'boolean';

  if (hasNativeDetails) {
    return
  }

  this.polyfillDetails();
};

Details.prototype.polyfillDetails = function () {
  var $module = this.$module;

  // Save shortcuts to the inner summary and content elements
  var $summary = this.$summary = $module.getElementsByTagName('summary').item(0);
  var $content = this.$content = $module.getElementsByTagName('div').item(0);

  // If <details> doesn't have a <summary> and a <div> representing the content
  // it means the required HTML structure is not met so the script will stop
  if (!$summary || !$content) {
    return
  }

  // If the content doesn't have an ID, assign it one now
  // which we'll need for the summary's aria-controls assignment
  if (!$content.id) {
    $content.id = 'details-content-' + generateUniqueID();
  }

  // Add ARIA role="group" to details
  $module.setAttribute('role', 'group');

  // Add role=button to summary
  $summary.setAttribute('role', 'button');

  // Add aria-controls
  $summary.setAttribute('aria-controls', $content.id);

  // Set tabIndex so the summary is keyboard accessible for non-native elements
  //
  // We have to use the camelcase `tabIndex` property as there is a bug in IE6/IE7 when we set the correct attribute lowercase:
  // See http://web.archive.org/web/20170120194036/http://www.saliences.com/browserBugs/tabIndex.html for more information.
  $summary.tabIndex = 0;

  // Detect initial open state
  var openAttr = $module.getAttribute('open') !== null;
  if (openAttr === true) {
    $summary.setAttribute('aria-expanded', 'true');
    $content.setAttribute('aria-hidden', 'false');
  } else {
    $summary.setAttribute('aria-expanded', 'false');
    $content.setAttribute('aria-hidden', 'true');
    $content.style.display = 'none';
  }

  // Bind an event to handle summary elements
  this.polyfillHandleInputs($summary, this.polyfillSetAttributes.bind(this));
};

/**
* Define a statechange function that updates aria-expanded and style.display
* @param {object} summary element
*/
Details.prototype.polyfillSetAttributes = function () {
  var $module = this.$module;
  var $summary = this.$summary;
  var $content = this.$content;

  var expanded = $summary.getAttribute('aria-expanded') === 'true';
  var hidden = $content.getAttribute('aria-hidden') === 'true';

  $summary.setAttribute('aria-expanded', (expanded ? 'false' : 'true'));
  $content.setAttribute('aria-hidden', (hidden ? 'false' : 'true'));

  $content.style.display = (expanded ? 'none' : '');

  var hasOpenAttr = $module.getAttribute('open') !== null;
  if (!hasOpenAttr) {
    $module.setAttribute('open', 'open');
  } else {
    $module.removeAttribute('open');
  }

  return true
};

/**
* Handle cross-modal click events
* @param {object} node element
* @param {function} callback function
*/
Details.prototype.polyfillHandleInputs = function (node, callback) {
  node.addEventListener('keypress', function (event) {
    var target = event.target;
    // When the key gets pressed - check if it is enter or space
    if (event.keyCode === KEY_ENTER || event.keyCode === KEY_SPACE$1) {
      if (target.nodeName.toLowerCase() === 'summary') {
        // Prevent space from scrolling the page
        // and enter from submitting a form
        event.preventDefault();
        // Click to let the click event do all the necessary action
        if (target.click) {
          target.click();
        } else {
          // except Safari 5.1 and under don't support .click() here
          callback(event);
        }
      }
    }
  });

  // Prevent keyup to prevent clicking twice in Firefox when using space key
  node.addEventListener('keyup', function (event) {
    var target = event.target;
    if (event.keyCode === KEY_SPACE$1) {
      if (target.nodeName.toLowerCase() === 'summary') {
        event.preventDefault();
      }
    }
  });

  node.addEventListener('click', callback);
};

function CharacterCount ($module) {
  this.$module = $module;
  this.$textarea = $module.querySelector('.govuk-js-character-count');
  if (this.$textarea) {
    this.$countMessage = $module.querySelector('[id="' + this.$textarea.id + '-info"]');
  }
}

CharacterCount.prototype.defaults = {
  characterCountAttribute: 'data-maxlength',
  wordCountAttribute: 'data-maxwords'
};

// Initialize component
CharacterCount.prototype.init = function () {
  // Check for module
  var $module = this.$module;
  var $textarea = this.$textarea;
  var $countMessage = this.$countMessage;

  if (!$textarea || !$countMessage) {
    return
  }

  // We move count message right after the field
  // Kept for backwards compatibility
  $textarea.insertAdjacentElement('afterend', $countMessage);

  // Read options set using dataset ('data-' values)
  this.options = this.getDataset($module);

  // Determine the limit attribute (characters or words)
  var countAttribute = this.defaults.characterCountAttribute;
  if (this.options.maxwords) {
    countAttribute = this.defaults.wordCountAttribute;
  }

  // Save the element limit
  this.maxLength = $module.getAttribute(countAttribute);

  // Check for limit
  if (!this.maxLength) {
    return
  }

  // Remove hard limit if set
  $module.removeAttribute('maxlength');

  // When the page is restored after navigating 'back' in some browsers the
  // state of the character count is not restored until *after* the DOMContentLoaded
  // event is fired, so we need to sync after the pageshow event in browsers
  // that support it.
  if ('onpageshow' in window) {
    window.addEventListener('pageshow', this.sync.bind(this));
  } else {
    window.addEventListener('DOMContentLoaded', this.sync.bind(this));
  }

  this.sync();
};

CharacterCount.prototype.sync = function () {
  this.bindChangeEvents();
  this.updateCountMessage();
};

// Read data attributes
CharacterCount.prototype.getDataset = function (element) {
  var dataset = {};
  var attributes = element.attributes;
  if (attributes) {
    for (var i = 0; i < attributes.length; i++) {
      var attribute = attributes[i];
      var match = attribute.name.match(/^data-(.+)/);
      if (match) {
        dataset[match[1]] = attribute.value;
      }
    }
  }
  return dataset
};

// Counts characters or words in text
CharacterCount.prototype.count = function (text) {
  var length;
  if (this.options.maxwords) {
    var tokens = text.match(/\S+/g) || []; // Matches consecutive non-whitespace chars
    length = tokens.length;
  } else {
    length = text.length;
  }
  return length
};

// Bind input propertychange to the elements and update based on the change
CharacterCount.prototype.bindChangeEvents = function () {
  var $textarea = this.$textarea;
  $textarea.addEventListener('keyup', this.checkIfValueChanged.bind(this));

  // Bind focus/blur events to start/stop polling
  $textarea.addEventListener('focus', this.handleFocus.bind(this));
  $textarea.addEventListener('blur', this.handleBlur.bind(this));
};

// Speech recognition software such as Dragon NaturallySpeaking will modify the
// fields by directly changing its `value`. These changes don't trigger events
// in JavaScript, so we need to poll to handle when and if they occur.
CharacterCount.prototype.checkIfValueChanged = function () {
  if (!this.$textarea.oldValue) this.$textarea.oldValue = '';
  if (this.$textarea.value !== this.$textarea.oldValue) {
    this.$textarea.oldValue = this.$textarea.value;
    this.updateCountMessage();
  }
};

// Update message box
CharacterCount.prototype.updateCountMessage = function () {
  var countElement = this.$textarea;
  var options = this.options;
  var countMessage = this.$countMessage;

  // Determine the remaining number of characters/words
  var currentLength = this.count(countElement.value);
  var maxLength = this.maxLength;
  var remainingNumber = maxLength - currentLength;

  // Set threshold if presented in options
  var thresholdPercent = options.threshold ? options.threshold : 0;
  var thresholdValue = maxLength * thresholdPercent / 100;
  if (thresholdValue > currentLength) {
    countMessage.classList.add('govuk-character-count__message--disabled');
    // Ensure threshold is hidden for users of assistive technologies
    countMessage.setAttribute('aria-hidden', true);
  } else {
    countMessage.classList.remove('govuk-character-count__message--disabled');
    // Ensure threshold is visible for users of assistive technologies
    countMessage.removeAttribute('aria-hidden');
  }

  // Update styles
  if (remainingNumber < 0) {
    countElement.classList.add('govuk-textarea--error');
    countMessage.classList.remove('govuk-hint');
    countMessage.classList.add('govuk-hint-error-message');
  } else {
    countElement.classList.remove('govuk-textarea--error');
    countMessage.classList.remove('govuk-hint-error-message');
    countMessage.classList.add('govuk-hint');
  }

  // Update message
  var charVerb = 'remaining';
  var charNoun = 'character';
  var displayNumber = remainingNumber;
  if (options.maxwords) {
    charNoun = 'word';
  }
  charNoun = charNoun + ((remainingNumber === -1 || remainingNumber === 1) ? '' : 's');

  charVerb = (remainingNumber < 0) ? 'too many' : 'remaining';
  displayNumber = Math.abs(remainingNumber);

  countMessage.innerHTML = 'You have ' + displayNumber + ' ' + charNoun + ' ' + charVerb;
};

CharacterCount.prototype.handleFocus = function () {
  // Check if value changed on focus
  this.valueChecker = setInterval(this.checkIfValueChanged.bind(this), 1000);
};

CharacterCount.prototype.handleBlur = function () {
  // Cancel value checking on blur
  clearInterval(this.valueChecker);
};

function Checkboxes ($module) {
  this.$module = $module;
  this.$inputs = $module.querySelectorAll('input[type="checkbox"]');
}

/**
 * Initialise Checkboxes
 *
 * Checkboxes can be associated with a 'conditionally revealed' content block –
 * for example, a checkbox for 'Phone' could reveal an additional form field for
 * the user to enter their phone number.
 *
 * These associations are made using a `data-aria-controls` attribute, which is
 * promoted to an aria-controls attribute during initialisation.
 *
 * We also need to restore the state of any conditional reveals on the page (for
 * example if the user has navigated back), and set up event handlers to keep
 * the reveal in sync with the checkbox state.
 */
Checkboxes.prototype.init = function () {
  var $module = this.$module;
  var $inputs = this.$inputs;

  nodeListForEach($inputs, function ($input) {
    var target = $input.getAttribute('data-aria-controls');

    // Skip checkboxes without data-aria-controls attributes, or where the
    // target element does not exist.
    if (!target || !$module.querySelector('#' + target)) {
      return
    }

    // Promote the data-aria-controls attribute to a aria-controls attribute
    // so that the relationship is exposed in the AOM
    $input.setAttribute('aria-controls', target);
    $input.removeAttribute('data-aria-controls');
  });

  // When the page is restored after navigating 'back' in some browsers the
  // state of form controls is not restored until *after* the DOMContentLoaded
  // event is fired, so we need to sync after the pageshow event in browsers
  // that support it.
  if ('onpageshow' in window) {
    window.addEventListener('pageshow', this.syncAllConditionalReveals.bind(this));
  } else {
    window.addEventListener('DOMContentLoaded', this.syncAllConditionalReveals.bind(this));
  }

  // Although we've set up handlers to sync state on the pageshow or
  // DOMContentLoaded event, init could be called after those events have fired,
  // for example if they are added to the page dynamically, so sync now too.
  this.syncAllConditionalReveals();

  $module.addEventListener('click', this.handleClick.bind(this));
};

/**
 * Sync the conditional reveal states for all inputs in this $module.
 */
Checkboxes.prototype.syncAllConditionalReveals = function () {
  nodeListForEach(this.$inputs, this.syncConditionalRevealWithInputState.bind(this));
};

/**
 * Sync conditional reveal with the input state
 *
 * Synchronise the visibility of the conditional reveal, and its accessible
 * state, with the input's checked state.
 *
 * @param {HTMLInputElement} $input Checkbox input
 */
Checkboxes.prototype.syncConditionalRevealWithInputState = function ($input) {
  var $target = this.$module.querySelector('#' + $input.getAttribute('aria-controls'));

  if ($target && $target.classList.contains('govuk-checkboxes__conditional')) {
    var inputIsChecked = $input.checked;

    $input.setAttribute('aria-expanded', inputIsChecked);
    $target.classList.toggle('govuk-checkboxes__conditional--hidden', !inputIsChecked);
  }
};

/**
 * Uncheck other checkboxes
 *
 * Find any other checkbox inputs with the same name value, and uncheck them.
 * This is useful for when a “None of these" checkbox is checked.
 */
Checkboxes.prototype.unCheckAllInputsExcept = function ($input) {
  var allInputsWithSameName = document.querySelectorAll('input[type="checkbox"][name="' + $input.name + '"]');

  nodeListForEach(allInputsWithSameName, function ($inputWithSameName) {
    var hasSameFormOwner = ($input.form === $inputWithSameName.form);
    if (hasSameFormOwner && $inputWithSameName !== $input) {
      $inputWithSameName.checked = false;
    }
  });

  this.syncAllConditionalReveals();
};

/**
 * Uncheck exclusive inputs
 *
 * Find any checkbox inputs with the same name value and the 'exclusive' behaviour,
 * and uncheck them. This helps prevent someone checking both a regular checkbox and a
 * "None of these" checkbox in the same fieldset.
 */
Checkboxes.prototype.unCheckExclusiveInputs = function ($input) {
  var allInputsWithSameNameAndExclusiveBehaviour = document.querySelectorAll(
    'input[data-behaviour="exclusive"][type="checkbox"][name="' + $input.name + '"]'
  );

  nodeListForEach(allInputsWithSameNameAndExclusiveBehaviour, function ($exclusiveInput) {
    var hasSameFormOwner = ($input.form === $exclusiveInput.form);
    if (hasSameFormOwner) {
      $exclusiveInput.checked = false;
    }
  });

  this.syncAllConditionalReveals();
};

/**
 * Click event handler
 *
 * Handle a click within the $module – if the click occurred on a checkbox, sync
 * the state of any associated conditional reveal with the checkbox state.
 *
 * @param {MouseEvent} event Click event
 */
Checkboxes.prototype.handleClick = function (event) {
  var $target = event.target;

  // Ignore clicks on things that aren't checkbox inputs
  if ($target.type !== 'checkbox') {
    return
  }

  // If the checkbox conditionally-reveals some content, sync the state
  var hasAriaControls = $target.getAttribute('aria-controls');
  if (hasAriaControls) {
    this.syncConditionalRevealWithInputState($target);
  }

  // No further behaviour needed for unchecking
  if (!$target.checked) {
    return
  }

  // Handle 'exclusive' checkbox behaviour (ie "None of these")
  var hasBehaviourExclusive = ($target.getAttribute('data-behaviour') === 'exclusive');
  if (hasBehaviourExclusive) {
    this.unCheckAllInputsExcept($target);
  } else {
    this.unCheckExclusiveInputs($target);
  }
};

(function(undefined) {

  // Detection from https://raw.githubusercontent.com/Financial-Times/polyfill-service/1f3c09b402f65bf6e393f933a15ba63f1b86ef1f/packages/polyfill-library/polyfills/Element/prototype/matches/detect.js
  var detect = (
    'document' in this && "matches" in document.documentElement
  );

  if (detect) return

  // Polyfill from https://raw.githubusercontent.com/Financial-Times/polyfill-service/1f3c09b402f65bf6e393f933a15ba63f1b86ef1f/packages/polyfill-library/polyfills/Element/prototype/matches/polyfill.js
  Element.prototype.matches = Element.prototype.webkitMatchesSelector || Element.prototype.oMatchesSelector || Element.prototype.msMatchesSelector || Element.prototype.mozMatchesSelector || function matches(selector) {
    var element = this;
    var elements = (element.document || element.ownerDocument).querySelectorAll(selector);
    var index = 0;

    while (elements[index] && elements[index] !== element) {
      ++index;
    }

    return !!elements[index];
  };

}).call('object' === typeof window && window || 'object' === typeof self && self || 'object' === typeof global && global || {});

(function(undefined) {

  // Detection from https://raw.githubusercontent.com/Financial-Times/polyfill-service/1f3c09b402f65bf6e393f933a15ba63f1b86ef1f/packages/polyfill-library/polyfills/Element/prototype/closest/detect.js
  var detect = (
    'document' in this && "closest" in document.documentElement
  );

  if (detect) return

  // Polyfill from https://raw.githubusercontent.com/Financial-Times/polyfill-service/1f3c09b402f65bf6e393f933a15ba63f1b86ef1f/packages/polyfill-library/polyfills/Element/prototype/closest/polyfill.js
  Element.prototype.closest = function closest(selector) {
    var node = this;

    while (node) {
      if (node.matches(selector)) return node;
      else node = 'SVGElement' in window && node instanceof SVGElement ? node.parentNode : node.parentElement;
    }

    return null;
  };

}).call('object' === typeof window && window || 'object' === typeof self && self || 'object' === typeof global && global || {});

function ErrorSummary ($module) {
  this.$module = $module;
}

ErrorSummary.prototype.init = function () {
  var $module = this.$module;
  if (!$module) {
    return
  }
  $module.focus();

  $module.addEventListener('click', this.handleClick.bind(this));
};

/**
* Click event handler
*
* @param {MouseEvent} event - Click event
*/
ErrorSummary.prototype.handleClick = function (event) {
  var target = event.target;
  if (this.focusTarget(target)) {
    event.preventDefault();
  }
};

/**
 * Focus the target element
 *
 * By default, the browser will scroll the target into view. Because our labels
 * or legends appear above the input, this means the user will be presented with
 * an input without any context, as the label or legend will be off the top of
 * the screen.
 *
 * Manually handling the click event, scrolling the question into view and then
 * focussing the element solves this.
 *
 * This also results in the label and/or legend being announced correctly in
 * NVDA (as tested in 2018.3.2) - without this only the field type is announced
 * (e.g. "Edit, has autocomplete").
 *
 * @param {HTMLElement} $target - Event target
 * @returns {boolean} True if the target was able to be focussed
 */
ErrorSummary.prototype.focusTarget = function ($target) {
  // If the element that was clicked was not a link, return early
  if ($target.tagName !== 'A' || $target.href === false) {
    return false
  }

  var inputId = this.getFragmentFromUrl($target.href);
  var $input = document.getElementById(inputId);
  if (!$input) {
    return false
  }

  var $legendOrLabel = this.getAssociatedLegendOrLabel($input);
  if (!$legendOrLabel) {
    return false
  }

  // Scroll the legend or label into view *before* calling focus on the input to
  // avoid extra scrolling in browsers that don't support `preventScroll` (which
  // at time of writing is most of them...)
  $legendOrLabel.scrollIntoView();
  $input.focus({ preventScroll: true });

  return true
};

/**
 * Get fragment from URL
 *
 * Extract the fragment (everything after the hash) from a URL, but not including
 * the hash.
 *
 * @param {string} url - URL
 * @returns {string} Fragment from URL, without the hash
 */
ErrorSummary.prototype.getFragmentFromUrl = function (url) {
  if (url.indexOf('#') === -1) {
    return false
  }

  return url.split('#').pop()
};

/**
 * Get associated legend or label
 *
 * Returns the first element that exists from this list:
 *
 * - The `<legend>` associated with the closest `<fieldset>` ancestor, as long
 *   as the top of it is no more than half a viewport height away from the
 *   bottom of the input
 * - The first `<label>` that is associated with the input using for="inputId"
 * - The closest parent `<label>`
 *
 * @param {HTMLElement} $input - The input
 * @returns {HTMLElement} Associated legend or label, or null if no associated
 *                        legend or label can be found
 */
ErrorSummary.prototype.getAssociatedLegendOrLabel = function ($input) {
  var $fieldset = $input.closest('fieldset');

  if ($fieldset) {
    var legends = $fieldset.getElementsByTagName('legend');

    if (legends.length) {
      var $candidateLegend = legends[0];

      // If the input type is radio or checkbox, always use the legend if there
      // is one.
      if ($input.type === 'checkbox' || $input.type === 'radio') {
        return $candidateLegend
      }

      // For other input types, only scroll to the fieldset’s legend (instead of
      // the label associated with the input) if the input would end up in the
      // top half of the screen.
      //
      // This should avoid situations where the input either ends up off the
      // screen, or obscured by a software keyboard.
      var legendTop = $candidateLegend.getBoundingClientRect().top;
      var inputRect = $input.getBoundingClientRect();

      // If the browser doesn't support Element.getBoundingClientRect().height
      // or window.innerHeight (like IE8), bail and just link to the label.
      if (inputRect.height && window.innerHeight) {
        var inputBottom = inputRect.top + inputRect.height;

        if (inputBottom - legendTop < window.innerHeight / 2) {
          return $candidateLegend
        }
      }
    }
  }

  return document.querySelector("label[for='" + $input.getAttribute('id') + "']") ||
    $input.closest('label')
};

function NotificationBanner ($module) {
  this.$module = $module;
}

/**
 * Initialise the component
 */
NotificationBanner.prototype.init = function () {
  var $module = this.$module;
  // Check for module
  if (!$module) {
    return
  }

  this.setFocus();
};

/**
 * Focus the element
 *
 * If `role="alert"` is set, focus the element to help some assistive technologies
 * prioritise announcing it.
 *
 * You can turn off the auto-focus functionality by setting `data-disable-auto-focus="true"` in the
 * component HTML. You might wish to do this based on user research findings, or to avoid a clash
 * with another element which should be focused when the page loads.
 */
NotificationBanner.prototype.setFocus = function () {
  var $module = this.$module;

  if ($module.getAttribute('data-disable-auto-focus') === 'true') {
    return
  }

  if ($module.getAttribute('role') !== 'alert') {
    return
  }

  // Set tabindex to -1 to make the element focusable with JavaScript.
  // Remove the tabindex on blur as the component doesn't need to be focusable after the page has
  // loaded.
  if (!$module.getAttribute('tabindex')) {
    $module.setAttribute('tabindex', '-1');

    $module.addEventListener('blur', function () {
      $module.removeAttribute('tabindex');
    });
  }

  $module.focus();
};

function Header ($module) {
  this.$module = $module;
  this.$menuButton = $module && $module.querySelector('.govuk-js-header-toggle');
  this.$menu = this.$menuButton && $module.querySelector(
    '#' + this.$menuButton.getAttribute('aria-controls')
  );
}

/**
 * Initialise header
 *
 * Check for the presence of the header, menu and menu button – if any are
 * missing then there's nothing to do so return early.
 */
Header.prototype.init = function () {
  if (!this.$module || !this.$menuButton || !this.$menu) {
    return
  }

  this.syncState(this.$menu.classList.contains('govuk-header__navigation--open'));
  this.$menuButton.addEventListener('click', this.handleMenuButtonClick.bind(this));
};

/**
 * Sync menu state
 *
 * Sync the menu button class and the accessible state of the menu and the menu
 * button with the visible state of the menu
 *
 * @param {boolean} isVisible Whether the menu is currently visible
 */
Header.prototype.syncState = function (isVisible) {
  this.$menuButton.classList.toggle('govuk-header__menu-button--open', isVisible);
  this.$menuButton.setAttribute('aria-expanded', isVisible);
};

/**
 * Handle menu button click
 *
 * When the menu button is clicked, change the visibility of the menu and then
 * sync the accessibility state and menu button state
 */
Header.prototype.handleMenuButtonClick = function () {
  var isVisible = this.$menu.classList.toggle('govuk-header__navigation--open');
  this.syncState(isVisible);
};

function Radios ($module) {
  this.$module = $module;
  this.$inputs = $module.querySelectorAll('input[type="radio"]');
}

/**
 * Initialise Radios
 *
 * Radios can be associated with a 'conditionally revealed' content block – for
 * example, a radio for 'Phone' could reveal an additional form field for the
 * user to enter their phone number.
 *
 * These associations are made using a `data-aria-controls` attribute, which is
 * promoted to an aria-controls attribute during initialisation.
 *
 * We also need to restore the state of any conditional reveals on the page (for
 * example if the user has navigated back), and set up event handlers to keep
 * the reveal in sync with the radio state.
 */
Radios.prototype.init = function () {
  var $module = this.$module;
  var $inputs = this.$inputs;

  nodeListForEach($inputs, function ($input) {
    var target = $input.getAttribute('data-aria-controls');

    // Skip radios without data-aria-controls attributes, or where the
    // target element does not exist.
    if (!target || !$module.querySelector('#' + target)) {
      return
    }

    // Promote the data-aria-controls attribute to a aria-controls attribute
    // so that the relationship is exposed in the AOM
    $input.setAttribute('aria-controls', target);
    $input.removeAttribute('data-aria-controls');
  });

  // When the page is restored after navigating 'back' in some browsers the
  // state of form controls is not restored until *after* the DOMContentLoaded
  // event is fired, so we need to sync after the pageshow event in browsers
  // that support it.
  if ('onpageshow' in window) {
    window.addEventListener('pageshow', this.syncAllConditionalReveals.bind(this));
  } else {
    window.addEventListener('DOMContentLoaded', this.syncAllConditionalReveals.bind(this));
  }

  // Although we've set up handlers to sync state on the pageshow or
  // DOMContentLoaded event, init could be called after those events have fired,
  // for example if they are added to the page dynamically, so sync now too.
  this.syncAllConditionalReveals();

  // Handle events
  $module.addEventListener('click', this.handleClick.bind(this));
};

/**
 * Sync the conditional reveal states for all inputs in this $module.
 */
Radios.prototype.syncAllConditionalReveals = function () {
  nodeListForEach(this.$inputs, this.syncConditionalRevealWithInputState.bind(this));
};

/**
 * Sync conditional reveal with the input state
 *
 * Synchronise the visibility of the conditional reveal, and its accessible
 * state, with the input's checked state.
 *
 * @param {HTMLInputElement} $input Radio input
 */
Radios.prototype.syncConditionalRevealWithInputState = function ($input) {
  var $target = document.querySelector('#' + $input.getAttribute('aria-controls'));

  if ($target && $target.classList.contains('govuk-radios__conditional')) {
    var inputIsChecked = $input.checked;

    $input.setAttribute('aria-expanded', inputIsChecked);
    $target.classList.toggle('govuk-radios__conditional--hidden', !inputIsChecked);
  }
};

/**
 * Click event handler
 *
 * Handle a click within the $module – if the click occurred on a radio, sync
 * the state of the conditional reveal for all radio buttons in the same form
 * with the same name (because checking one radio could have un-checked a radio
 * in another $module)
 *
 * @param {MouseEvent} event Click event
 */
Radios.prototype.handleClick = function (event) {
  var $clickedInput = event.target;

  // Ignore clicks on things that aren't radio buttons
  if ($clickedInput.type !== 'radio') {
    return
  }

  // We only need to consider radios with conditional reveals, which will have
  // aria-controls attributes.
  var $allInputs = document.querySelectorAll('input[type="radio"][aria-controls]');

  nodeListForEach($allInputs, function ($input) {
    var hasSameFormOwner = ($input.form === $clickedInput.form);
    var hasSameName = ($input.name === $clickedInput.name);

    if (hasSameName && hasSameFormOwner) {
      this.syncConditionalRevealWithInputState($input);
    }
  }.bind(this));
};

(function(undefined) {

    // Detection from https://raw.githubusercontent.com/Financial-Times/polyfill-library/master/polyfills/Element/prototype/nextElementSibling/detect.js
    var detect = (
      'document' in this && "nextElementSibling" in document.documentElement
    );

    if (detect) return

    // Polyfill from https://raw.githubusercontent.com/Financial-Times/polyfill-library/master/polyfills/Element/prototype/nextElementSibling/polyfill.js
    Object.defineProperty(Element.prototype, "nextElementSibling", {
      get: function(){
        var el = this.nextSibling;
        while (el && el.nodeType !== 1) { el = el.nextSibling; }
        return el;
      }
    });

}).call('object' === typeof window && window || 'object' === typeof self && self || 'object' === typeof global && global || {});

(function(undefined) {

    // Detection from https://raw.githubusercontent.com/Financial-Times/polyfill-library/master/polyfills/Element/prototype/previousElementSibling/detect.js
    var detect = (
      'document' in this && "previousElementSibling" in document.documentElement
    );

    if (detect) return

    // Polyfill from https://raw.githubusercontent.com/Financial-Times/polyfill-library/master/polyfills/Element/prototype/previousElementSibling/polyfill.js
    Object.defineProperty(Element.prototype, 'previousElementSibling', {
      get: function(){
        var el = this.previousSibling;
        while (el && el.nodeType !== 1) { el = el.previousSibling; }
        return el;
      }
    });

}).call('object' === typeof window && window || 'object' === typeof self && self || 'object' === typeof global && global || {});

function Tabs ($module) {
  this.$module = $module;
  this.$tabs = $module.querySelectorAll('.govuk-tabs__tab');

  this.keys = { left: 37, right: 39, up: 38, down: 40 };
  this.jsHiddenClass = 'govuk-tabs__panel--hidden';
}

Tabs.prototype.init = function () {
  if (typeof window.matchMedia === 'function') {
    this.setupResponsiveChecks();
  } else {
    this.setup();
  }
};

Tabs.prototype.setupResponsiveChecks = function () {
  this.mql = window.matchMedia('(min-width: 40.0625em)');
  this.mql.addListener(this.checkMode.bind(this));
  this.checkMode();
};

Tabs.prototype.checkMode = function () {
  if (this.mql.matches) {
    this.setup();
  } else {
    this.teardown();
  }
};

Tabs.prototype.setup = function () {
  var $module = this.$module;
  var $tabs = this.$tabs;
  var $tabList = $module.querySelector('.govuk-tabs__list');
  var $tabListItems = $module.querySelectorAll('.govuk-tabs__list-item');

  if (!$tabs || !$tabList || !$tabListItems) {
    return
  }

  $tabList.setAttribute('role', 'tablist');

  nodeListForEach($tabListItems, function ($item) {
    $item.setAttribute('role', 'presentation');
  });

  nodeListForEach($tabs, function ($tab) {
    // Set HTML attributes
    this.setAttributes($tab);

    // Save bounded functions to use when removing event listeners during teardown
    $tab.boundTabClick = this.onTabClick.bind(this);
    $tab.boundTabKeydown = this.onTabKeydown.bind(this);

    // Handle events
    $tab.addEventListener('click', $tab.boundTabClick, true);
    $tab.addEventListener('keydown', $tab.boundTabKeydown, true);

    // Remove old active panels
    this.hideTab($tab);
  }.bind(this));

  // Show either the active tab according to the URL's hash or the first tab
  var $activeTab = this.getTab(window.location.hash) || this.$tabs[0];
  this.showTab($activeTab);

  // Handle hashchange events
  $module.boundOnHashChange = this.onHashChange.bind(this);
  window.addEventListener('hashchange', $module.boundOnHashChange, true);
};

Tabs.prototype.teardown = function () {
  var $module = this.$module;
  var $tabs = this.$tabs;
  var $tabList = $module.querySelector('.govuk-tabs__list');
  var $tabListItems = $module.querySelectorAll('.govuk-tabs__list-item');

  if (!$tabs || !$tabList || !$tabListItems) {
    return
  }

  $tabList.removeAttribute('role');

  nodeListForEach($tabListItems, function ($item) {
    $item.removeAttribute('role', 'presentation');
  });

  nodeListForEach($tabs, function ($tab) {
    // Remove events
    $tab.removeEventListener('click', $tab.boundTabClick, true);
    $tab.removeEventListener('keydown', $tab.boundTabKeydown, true);

    // Unset HTML attributes
    this.unsetAttributes($tab);
  }.bind(this));

  // Remove hashchange event handler
  window.removeEventListener('hashchange', $module.boundOnHashChange, true);
};

Tabs.prototype.onHashChange = function (e) {
  var hash = window.location.hash;
  var $tabWithHash = this.getTab(hash);
  if (!$tabWithHash) {
    return
  }

  // Prevent changing the hash
  if (this.changingHash) {
    this.changingHash = false;
    return
  }

  // Show either the active tab according to the URL's hash or the first tab
  var $previousTab = this.getCurrentTab();

  this.hideTab($previousTab);
  this.showTab($tabWithHash);
  $tabWithHash.focus();
};

Tabs.prototype.hideTab = function ($tab) {
  this.unhighlightTab($tab);
  this.hidePanel($tab);
};

Tabs.prototype.showTab = function ($tab) {
  this.highlightTab($tab);
  this.showPanel($tab);
};

Tabs.prototype.getTab = function (hash) {
  return this.$module.querySelector('.govuk-tabs__tab[href="' + hash + '"]')
};

Tabs.prototype.setAttributes = function ($tab) {
  // set tab attributes
  var panelId = this.getHref($tab).slice(1);
  $tab.setAttribute('id', 'tab_' + panelId);
  $tab.setAttribute('role', 'tab');
  $tab.setAttribute('aria-controls', panelId);
  $tab.setAttribute('aria-selected', 'false');
  $tab.setAttribute('tabindex', '-1');

  // set panel attributes
  var $panel = this.getPanel($tab);
  $panel.setAttribute('role', 'tabpanel');
  $panel.setAttribute('aria-labelledby', $tab.id);
  $panel.classList.add(this.jsHiddenClass);
};

Tabs.prototype.unsetAttributes = function ($tab) {
  // unset tab attributes
  $tab.removeAttribute('id');
  $tab.removeAttribute('role');
  $tab.removeAttribute('aria-controls');
  $tab.removeAttribute('aria-selected');
  $tab.removeAttribute('tabindex');

  // unset panel attributes
  var $panel = this.getPanel($tab);
  $panel.removeAttribute('role');
  $panel.removeAttribute('aria-labelledby');
  $panel.classList.remove(this.jsHiddenClass);
};

Tabs.prototype.onTabClick = function (e) {
  if (!e.target.classList.contains('govuk-tabs__tab')) {
  // Allow events on child DOM elements to bubble up to tab parent
    return false
  }
  e.preventDefault();
  var $newTab = e.target;
  var $currentTab = this.getCurrentTab();
  this.hideTab($currentTab);
  this.showTab($newTab);
  this.createHistoryEntry($newTab);
};

Tabs.prototype.createHistoryEntry = function ($tab) {
  var $panel = this.getPanel($tab);

  // Save and restore the id
  // so the page doesn't jump when a user clicks a tab (which changes the hash)
  var id = $panel.id;
  $panel.id = '';
  this.changingHash = true;
  window.location.hash = this.getHref($tab).slice(1);
  $panel.id = id;
};

Tabs.prototype.onTabKeydown = function (e) {
  switch (e.keyCode) {
    case this.keys.left:
    case this.keys.up:
      this.activatePreviousTab();
      e.preventDefault();
      break
    case this.keys.right:
    case this.keys.down:
      this.activateNextTab();
      e.preventDefault();
      break
  }
};

Tabs.prototype.activateNextTab = function () {
  var currentTab = this.getCurrentTab();
  var nextTabListItem = currentTab.parentNode.nextElementSibling;
  if (nextTabListItem) {
    var nextTab = nextTabListItem.querySelector('.govuk-tabs__tab');
  }
  if (nextTab) {
    this.hideTab(currentTab);
    this.showTab(nextTab);
    nextTab.focus();
    this.createHistoryEntry(nextTab);
  }
};

Tabs.prototype.activatePreviousTab = function () {
  var currentTab = this.getCurrentTab();
  var previousTabListItem = currentTab.parentNode.previousElementSibling;
  if (previousTabListItem) {
    var previousTab = previousTabListItem.querySelector('.govuk-tabs__tab');
  }
  if (previousTab) {
    this.hideTab(currentTab);
    this.showTab(previousTab);
    previousTab.focus();
    this.createHistoryEntry(previousTab);
  }
};

Tabs.prototype.getPanel = function ($tab) {
  var $panel = this.$module.querySelector(this.getHref($tab));
  return $panel
};

Tabs.prototype.showPanel = function ($tab) {
  var $panel = this.getPanel($tab);
  $panel.classList.remove(this.jsHiddenClass);
};

Tabs.prototype.hidePanel = function (tab) {
  var $panel = this.getPanel(tab);
  $panel.classList.add(this.jsHiddenClass);
};

Tabs.prototype.unhighlightTab = function ($tab) {
  $tab.setAttribute('aria-selected', 'false');
  $tab.parentNode.classList.remove('govuk-tabs__list-item--selected');
  $tab.setAttribute('tabindex', '-1');
};

Tabs.prototype.highlightTab = function ($tab) {
  $tab.setAttribute('aria-selected', 'true');
  $tab.parentNode.classList.add('govuk-tabs__list-item--selected');
  $tab.setAttribute('tabindex', '0');
};

Tabs.prototype.getCurrentTab = function () {
  return this.$module.querySelector('.govuk-tabs__list-item--selected .govuk-tabs__tab')
};

// this is because IE doesn't always return the actual value but a relative full path
// should be a utility function most prob
// http://labs.thesedays.com/blog/2010/01/08/getting-the-href-value-with-jquery-in-ie/
Tabs.prototype.getHref = function ($tab) {
  var href = $tab.getAttribute('href');
  var hash = href.slice(href.indexOf('#'), href.length);
  return hash
};

function initAll (options) {
  // Set the options to an empty object by default if no options are passed.
  options = typeof options !== 'undefined' ? options : {};

  // Allow the user to initialise GOV.UK Frontend in only certain sections of the page
  // Defaults to the entire document if nothing is set.
  var scope = typeof options.scope !== 'undefined' ? options.scope : document;

  var $buttons = scope.querySelectorAll('[data-module="govuk-button"]');
  nodeListForEach($buttons, function ($button) {
    new Button($button).init();
  });

  var $accordions = scope.querySelectorAll('[data-module="govuk-accordion"]');
  nodeListForEach($accordions, function ($accordion) {
    if (accordionsCount <  $accordions.length)
      {
        new Accordion($accordion).init();
        accordionsCount = accordionsCount+1;
      }
  });

  var $details = scope.querySelectorAll('[data-module="govuk-details"]');
  nodeListForEach($details, function ($detail) {
    new Details($detail).init();
  });

  var $characterCounts = scope.querySelectorAll('[data-module="govuk-character-count"]');
  nodeListForEach($characterCounts, function ($characterCount) {
    new CharacterCount($characterCount).init();
  });

  var $checkboxes = scope.querySelectorAll('[data-module="govuk-checkboxes"]');
  nodeListForEach($checkboxes, function ($checkbox) {
    new Checkboxes($checkbox).init();
  });

  // Find first error summary module to enhance.
  var $errorSummary = scope.querySelector('[data-module="govuk-error-summary"]');
  new ErrorSummary($errorSummary).init();

  // Find first header module to enhance.
  var $toggleButton = scope.querySelector('[data-module="govuk-header"]');
  new Header($toggleButton).init();

  var $notificationBanners = scope.querySelectorAll('[data-module="govuk-notification-banner"]');
  nodeListForEach($notificationBanners, function ($notificationBanner) {
    new NotificationBanner($notificationBanner).init();
  });

  var $radios = scope.querySelectorAll('[data-module="govuk-radios"]');
  nodeListForEach($radios, function ($radio) {
    new Radios($radio).init();
  });

  var $tabs = scope.querySelectorAll('[data-module="govuk-tabs"]');
  nodeListForEach($tabs, function ($tabs) {
    new Tabs($tabs).init();
  });
}

exports.initAll = initAll;
exports.Accordion = Accordion;
exports.Button = Button;
exports.Details = Details;
exports.CharacterCount = CharacterCount;
exports.Checkboxes = Checkboxes;
exports.ErrorSummary = ErrorSummary;
exports.Header = Header;
exports.Radios = Radios;
exports.Tabs = Tabs;

})));
let tagManagerCookiePrefrences = document.currentScript.getAttribute('tag-manager');

window.readCookie = function (name) {
    var nameEQ = name + "=";
    var ca = document.cookie.split(';');
    for (var i = 0; i < ca.length; i++) {
        var c = ca[i];
        while (c.charAt(0) == ' ') {
            c = c.substring(1, c.length);
        }
        if (c.indexOf(nameEQ) == 0) {
            return c.substring(nameEQ.length, c.length);
        }
    }
    return null;
};


var cookiePreferences = JSON.parse(readCookie('cookie_preferences'));
if (cookiePreferences !== null  && 'prod' == "prod" ) {
    if (cookiePreferences.usage === true) {
        (function (w, d, s, l, i) {
            w[l] = w[l] || [];
            w[l].push({
                'gtm.start':
                    new Date().getTime(), event: 'gtm.js'
            });
            var f = d.getElementsByTagName(s)[0],
                j = d.createElement(s),
                dl = l != 'dataLayer' ? '&l=' + l : '';
            j.async = true;
            j.src =
                'https://www.googletagmanager.com/gtm.js?id=' + i + dl;
            f.parentNode.insertBefore(j, f);
        })(window, document, 'script', 'dataLayer', tagManagerCookiePrefrences);

    }
}

"use strict";
/*\
|*|
|*|  :: cookies.js ::
|*|
|*|  A complete cookies reader/writer framework with full unicode support.
|*|  https://developer.mozilla.org/en-US/docs/Web/API/Document/cookie/Simple_document.cookie_framework
|*|
|*|  Revision #3 - July 13th, 2017
|*|
|*|  https://developer.mozilla.org/en-US/docs/Web/API/document.coaokie
|*|  https://developer.mozilla.org/User:fusionchess
|*|  THIS IS THE ONE : https://github.com/madmurphy/cookies.js
|*|
|*|  This framework is released under the GNU Public License, version 3 or later.
|*|  http://www.gnu.org/licenses/gpl-3.0-standalone.html
|*|
|*|  Syntaxes:
|*|
|*|  * docCookies.setItem(name, value[, end[, path[, domain[, secure]]]])
|*|  * docCookies.getItem(name)
|*|  * docCookies.removeItem(name[, path[, domain]])
|*|  * docCookies.hasItem(name)
|*|  * docCookies.keys()
|*|
\*/ 
let tagManager = document.currentScript.getAttribute('tag-manager');

var docCookies = {
    getItem: function getItem(sKey) {
        if (!sKey) {
            return null;
        }
        return decodeURIComponent(document.cookie.replace(new RegExp("(?:(?:^|.*;)\\s*" + encodeURIComponent(sKey).replace(/[\-\.\+\*]/g, "\\$&") + "\\s*\\=\\s*([^;]*).*$)|^.*$"), "$1")) || null;
    },
    setItem: function setItem(sKey, sValue, vEnd, sPath, sDomain, bSecure) {
        if (!sKey || /^(?:expires|max\-age|path|domain|secure)$/i.test(sKey)) {
            return false;
        }
        var sExpires = "";
        if (vEnd) {
            switch (vEnd.constructor) {
                case Number:
                    sExpires = vEnd === Infinity ? "; expires=Fri, 31 Dec 9999 23:59:59 GMT" : "; expires=" + (new Date(vEnd * 1e3 + Date.now())).toUTCString();
                    /*
                    Note: Despite officially defined in RFC 6265, the use of `max-age` is not compatible with any
                    version of Internet Explorer, Edge and some mobile browsers. Therefore passing a number to
                    the end parameter might not work as expected. A possible solution might be to convert the the
                    relative time to an absolute time. For instance, replacing the previous line with:
                    */ /*
                    sExpires = vEnd === Infinity ? "; expires=Fri, 31 Dec 9999 23:59:59 GMT" : "; expires=" + (new Date(vEnd * 1e3 + Date.now())).toUTCString();
                    */ break;
                case String:
                    sExpires = "; expires=" + vEnd;
                    break;
                case Date:
                    sExpires = "; expires=" + vEnd.toUTCString();
                    break;
            }
        }
        //  const formattedCookie = encodeURIComponent(sKey) + "=" + sValue +  sExpires + (sDomain ? "; domain=" + sDomain : "") + (sPath ? "; path=" + sPath : "") + (bSecure ? "; secure" : "");
        // document.cookie = formattedCookie.toString();
        const FormattedCookies = encodeURIComponent(sKey) + "=" + sValue + sExpires;
        document.cookie = FormattedCookies;
        return true;
    },
    removeItem: function removeItem(sKey, sPath, sDomain) {
        if (!this.hasItem(sKey)) {
            return false;
        }
        document.cookie = encodeURIComponent(sKey) + "=; expires=Thu, 01 Jan 1970 00:00:00 GMT" + (sDomain ? "; domain=" + sDomain : "") + (sPath ? "; path=" + sPath : "");
        return true;
    },
    hasItem: function hasItem(sKey) {
        if (!sKey || /^(?:expires|max\-age|path|domain|secure)$/i.test(sKey)) {
            return false;
        }
        return new RegExp("(?:^|;\\s*)" + encodeURIComponent(sKey).replace(/[\-\.\+\*]/g, "\\$&") + "\\s*\\=").test(document.cookie);
    },
    keys: function keys() {
        var aKeys = document.cookie.replace(/((?:^|\s*;)[^\=]+)(?=;|$)|^\s*|\s*(?:\=[^;]*)?(?:\1|$)/g, "").split(/\s*(?:\=[^;]*)?;\s*/);
        for (var nLen = aKeys.length, nIdx = 0; nIdx < nLen; nIdx++) {
            aKeys[nIdx] = decodeURIComponent(aKeys[nIdx]);
        }
        return aKeys;
    },
};
(function () {
    /**
     * The initial cookie preferences
     *
     * We'll use ES5 Template Literals to output these in a more maintainable way
     * @type {*[]}
     */ var initial_cookie_preferences = [
        {
            title: "Cookies that measure website use",
            description:
                "<p>We use Google Analytics to measure how you use the website so we can improve it based on user needs. Google Analytics sets cookies that store anonymised information about:</p><ul><li>how you got to the site</li><li>the pages you visit on Crown Commercial Service (CCS), and how long you spend on each page</li><li>what you click on while you're visiting the site</li></ul><p>We do not allow Google to use or share the data about how you use this site.</p>",
            cookie_type: "usage",
            enabled: null,
            adjustable: true,
            cookies: [{ name: "1P_JAR", path: "/", domain: ".google.com" }],
        },
        {
            title: "Cookies that help with our communications and marketing",
            description: "These cookies may be set by third party websites and do things like measure how you view YouTube videos that are on Crown Commercial Service (CCS) - Contract Award Service (CAS).",
            cookie_type: "marketing",
            enabled: null,
            adjustable: true,
            cookies: null,
        },
        {
            title: "Strictly necessary cookies",
            description:
                "<p>These essential cookies do things like:</p><ul><li>remember the notifications you've seen so we do not show them to you again</li><li>remember your progress through a form (for example a licence application)</li></ul><p>They always need to be on.</p>",
            cookie_type: "essential",
            enabled: null,
            adjustable: false,
            cookies: null,
        },
    ]; // Duration variables, in seconds (for easier reuse)
    // https://www.google.com/search?q=1+year+in+seconds&oq=1+year+in+seconds&aqs=chrome..69i57j0.2091j0j7&sourceid=chrome&ie=UTF-8
    var oneyear = 31540000;
    var twodays = 172800; // var onemonth = 2.628e+6;
    // Set the default cookies. This JSON Object is saved as the cookie, but we use `initial_cookie_preferences` to maintain structure and various sanity checks
    var cookie_preferences = { essentials: true, usage: false, marketing: false };
    /**
     * When user accept the cookie, show this
     */ function hideMessage() {
        var cookieConsentContainer = document.getElementById("cookie-consent-container");
        if (cookieConsentContainer) {
            cookieConsentContainer.innerHTML =
                '<div class="cookie-message__inner cookie-message__inner--accepted govuk-width-container"><p>You&rsquo;ve accepted all cookies. You can <a href="/cookie-settings">change your cookie settings</a> at any time.</p></div>';
        }
    }
    /**
     * Opt the user in to certain cookies
     */ function optUserIn() {
        hideMessage();
        updateSeenCookie();
        fireGTM();
    }
    function fireGTM() {
        (function (w, d, s, l, i) {
            w[l] = w[l] || [];
            w[l].push({ "gtm.start": new Date().getTime(), event: "gtm.js" });
            var f = d.getElementsByTagName(s)[0],
                j = d.createElement(s),
                dl = l != "dataLayer" ? "&l=" + l : "";
            j.async = true;
            j.src = "https://www.googletagmanager.com/gtm.js?id=" + i + dl;
            f.parentNode.insertBefore(j, f);
        })(window, document, "script", "dataLayer", tagManager);
    }
    function updateSeenCookie() {
        // 1 year = 3.154e+7
        // 1 month = 2.628e+6
        // set the cookie which tells us a user has 'accepted cookies'
        // setItem: function (sKey, sValue, vEnd, sPath, sDomain, bSecure)
        // docCookies.setItem('seen_cookie_message', true, oneyear, '/', '.crowncommercial.gov.uk');
        // the old 'seen' cookie is called `seen-cookie-message` (this should probably be deleted
        // Only set or change the cookies if the user hasn't updated their preferences on the Cookie Settings page
        // This is to check if the method was updateSeenCookie() was called from 'Accept all cookies' or cookie settings page
        // (in which case cookie_preferences_set will be set already)
        if (!docCookies.hasItem("cookie_preferences_set")) {
            var cookie_preferences_accepted = { essentials: true, usage: true, marketing: true };
            docCookies.setItem("cookie_preferences", JSON.stringify(cookie_preferences_accepted), oneyear, "/", ".crowncommercial.gov.uk"); // createCookie('cookie_preferences', JSON.stringify(cookie_preferences), 365, '/');
            // Set the 'cookies_timer_reset' to prevent showing the banner again next time the user visits
            docCookies.setItem("cookies_timer_reset", JSON.stringify(true), oneyear, "/", ".crowncommercial.gov.uk");
            docCookies.setItem("seen_cookie_message", true, oneyear, "/", ".crowncommercial.gov.uk");
        } // this is a case when the user selected cookies on the cookie settings page â€“ the cookie_preferences array
        // will be updated with this user's choices
        else {
            // console.log('cookie_preferences', cookie_preferences);
            var cookie_timer = cookie_preferences["marketing"] === false && cookie_preferences["usage"] === false ? twodays : oneyear;
            docCookies.setItem("cookie_preferences", JSON.stringify(cookie_preferences), cookie_timer, "/", ".crowncommercial.gov.uk"); // Set the 'cookies_timer_reset' to prevent showing the banner again next time the user visits
            docCookies.setItem("cookies_timer_reset", JSON.stringify(true), cookie_timer, "/", ".crowncommercial.gov.uk");
            docCookies.setItem("seen_cookie_message", true, cookie_timer, "/", ".crowncommercial.gov.uk");
        }
    }
    function deleteDisabledCookies(cookie_type) {
        // Loop through each cookie group
        initial_cookie_preferences.forEach(function (cookieGroup, idx) {
            // Check if the loop cookie type matches the selected cookie_type
            if (cookieGroup.cookie_type === cookie_type && cookieGroup.cookies !== null) {
                // Loop through each cookie in the selected cookie_type
                cookieGroup.cookies.forEach(function (cookie, idx) {
                    docCookies.removeItem(cookie.name, cookie.path, cookie.domain); // console.log("delteted: " + cookie.name);
                });
            }
        });
    }
    function UpdateCookiePreferences() {
        // update the cookie references based on user selection
        initial_cookie_preferences.forEach(function (datarecord, idx) {
            if (datarecord.adjustable) {
                var cookieElement = document.getElementById(datarecord.cookie_type);
                if (cookieElement.checked) {
                    cookie_preferences[datarecord.cookie_type] = cookieElement.value === "true";
                } else {
                    cookie_preferences[datarecord.cookie_type] = false; // send the cookie type
                    deleteDisabledCookies(datarecord.cookie_type);
                }
            }
        });
        var cookie_timer = cookie_preferences["usage"] === false && cookie_preferences["marketing"] === false ? twodays : oneyear;
        docCookies.setItem("cookie_preferences", JSON.stringify(cookie_preferences), cookie_timer, "/", ".crowncommercial.gov.uk"); // createCookie('cookie_preferences', JSON.stringify(cookie_preferences), 365, '/');
        // check if cookie_preferences_set is set, if not, set it
        // we're checking this first because we don't want to reset to today every time
        if (!docCookies.hasItem("cookie_preferences_set")) {
            // set the cookie which tells us that a user has saved their cookie preferences
            docCookies.setItem("cookie_preferences_set", true, cookie_timer, "/", ".crowncommercial.gov.uk"); // createCookie('cookie_preferences_set', 'true', 365, '/');
        }
        var SettingsUpdatedArea = document.getElementsByClassName("js-live-area");
        SettingsUpdatedArea[0].innerHTML = "<p>Your cookie settings were saved.</p>";
    }
    function generateCookieSettingsPageContent(appendTo) {
        var CookieSettingsPageContent = document.createDocumentFragment();
        var cookie_preferences = JSON.parse(docCookies.getItem("cookie_preferences")); // console.log({cookie_preferences});
        // loop through the data
        initial_cookie_preferences.forEach(function (datarecord, idx) {
            // If the cookie has already been set, match the key value to the
            // if (cookie_preferences !== null) {
            if (cookie_preferences !== null) {
                datarecord.enabled = cookie_preferences[datarecord.cookie_type];
            } // for each record we call out to a function to create the template
            var markup = createSeries(datarecord, idx); // We make a div to contain the resultant string
            var container = document.createElement("div");
            container.classList.add("govuk-form-group"); // We make the contents of the container be the result of the function
            container.innerHTML = markup; // Append the created markup to the fragment
            CookieSettingsPageContent.appendChild(container);
        });
        function createSeries(datarecord, idx) {
            if (datarecord.adjustable === true) {
                return '\n<fieldset class="govuk-fieldset" aria-describedby="'
                    .concat(datarecord.cookie_type, '-hint">\n    <legend class="govuk-fieldset__legend">\n      <h3 class="heading size--xl">\n        ')
                    .concat(datarecord.title, '\n      </h3>\n    </legend>\n    <span id="')
                    .concat(datarecord.cookie_type, '-hint" class="govuk-hint">\n      ')
                    .concat(datarecord.description, '\n    </span>\n    <div class="govuk-radios govuk-radios--inline">\n      <div class="govuk-radios__item">\n                <input class="govuk-radios__input" id="')
                    .concat(datarecord.cookie_type, '" name="')
                    .concat(datarecord.cookie_type, '" type="radio"\n                ')
                    .concat(datarecord.enabled === true ? "checked" : "", '\n                value="true">\n                <label class="govuk-label govuk-radios__label" for="')
                    .concat(datarecord.cookie_type, '">\n          On\n        </label>\n      </div>\n      <div class="govuk-radios__item">\n        <input class="govuk-radios__input" id="')
                    .concat(datarecord.cookie_type, '-2" name="')
                    .concat(datarecord.cookie_type, '" type="radio"\n        ')
                    .concat(datarecord.enabled === true ? "" : "checked", '\n                value="false">\n                <label class="govuk-label govuk-radios__label" for="')
                    .concat(datarecord.cookie_type, '-2">\n          Off\n        </label>\n      </div>\n    </div>\n  </fieldset>\n            ');
            }
            if (datarecord.adjustable === false) {
                return '\n                <h3 class="heading size--xl">'.concat(datarecord.title, "</h3>\n                <div>").concat(datarecord.description, "</div>\n                ");
            }
        } // var buttonContainer = document.createElement('p');
        var CookieSettingsSubmitButton = document.createElement("button");
        CookieSettingsSubmitButton.classList.add("govuk-!-font-size-18", "govuk-!-font-weight-bold", "govuk-button", "gtm--accept-cookies-in-banner");
        CookieSettingsSubmitButton.innerHTML = "Save changes";
        CookieSettingsSubmitButton.addEventListener("click", function () {
            UpdateCookiePreferences();
            updateSeenCookie();
        });
        var CookieSettingsLiveArea = document.createElement("div");
        CookieSettingsLiveArea.classList.add("cookie-updated-notice", "js-live-area");
        CookieSettingsLiveArea.setAttribute("aria-label", "Notice");
        CookieSettingsLiveArea.setAttribute("aria-live", "polite");
        CookieSettingsLiveArea.setAttribute("role", "region"); // we put the elements in the fragment
        CookieSettingsPageContent.appendChild(CookieSettingsSubmitButton);
        CookieSettingsPageContent.appendChild(CookieSettingsLiveArea); // clear the innerHTML of the container, incase we are regenerating
        // the message (in which case, there will be innacurate content in there)
        appendTo.innerHTML = "";
        appendTo.appendChild(CookieSettingsPageContent);
    }
    /**
     * Programatically creates the cookie message notification
     */ function createCookieMessage() {
        // create the cookie message container
        var cookieMessageContainer = document.createElement("div");
        cookieMessageContainer.classList.add("cookie-message");
        cookieMessageContainer.setAttribute("id", "cookie-consent-container");
        cookieMessageContainer.setAttribute("aria-label", "Cookie Policy");
        cookieMessageContainer.setAttribute("aria-live", "polite"); // create the inner contents of the cookie message
        var cookieMessageInner = document.createElement("div");
        cookieMessageInner.classList.add("cookie-message__inner", "govuk-width-container");
        cookieMessageInner.classList.add("site-container");
        cookieMessageInner.innerHTML =
            '<h2 class="govuk-heading-m">Cookies on Contract Award Service (CAS) / crowncommercial.gov.uk</h2><div class="cookie-message__intro"><p>We use cookies to collect information about how you use crowncommercial.gov.uk.<br><br> We use this information to make the website work as well as possible and improve government services.</p></div>';
        var optInButton = document.createElement("button");
        optInButton.classList.add("govuk-!-font-size-18", "govuk-!-font-weight-bold", "govuk-button", "gtm--accept-cookies-in-banner");
        optInButton.innerHTML = "Accept all cookies";
        optInButton.addEventListener("click", optUserIn);
        var settingsButton = document.createElement("a");
        settingsButton.classList.add("govuk-!-font-size-18", "govuk-!-font-weight-bold", "govuk-button");
        settingsButton.setAttribute("href", "/cookie-settings");
        settingsButton.innerHTML = "Set cookie preferences"; // optOutButton.classList.add('button');
        // optOutButton.classList.add('button--tight');
        // optOutButton.classList.add('button--deny');
        // optOutButton.addEventListener('click', optUserOut);
        var cookieMessageButtons = document.createElement("div");
        cookieMessageButtons.classList.add("cookie-message__actions");
        cookieMessageButtons.appendChild(optInButton);
        cookieMessageButtons.appendChild(settingsButton);
        cookieMessageInner.appendChild(cookieMessageButtons); // append the inner contents to the cookie message container
        cookieMessageContainer.appendChild(cookieMessageInner); // add the cookie message to the start of the document body
        //document.body.prepend(cookieMessageContainer);
        var toContent = document.getElementById("skiplink-container");
        document.body.insertBefore(cookieMessageContainer, toContent);
        cookieMessageContainer.style.display = "block";
    }
    /**
     * Only show the cookie message if the user hasn't previously dismissed it (and we're NOT on the cookie-settings page, matches based on the slug)
     */ if (!docCookies.hasItem("seen_cookie_message") && window.location.href.indexOf("cookie-settings") === -1) {
        createCookieMessage();
    } // Only set the default cookies if they haven't been set
    if (!docCookies.hasItem("cookie_preferences")) {
        docCookies.setItem("cookie_preferences", JSON.stringify(cookie_preferences), twodays, "/", ".crowncommercial.gov.uk"); // docCookies.setItem('cookies_timer_reset', JSON.stringify(cookie_preferences), oneyear, '/', '.crowncommercial.gov.uk');
        // createCookie('cookie_preferences', JSON.stringify(cookie_preferences), 365, '/');
    }
    /** ---------- RESET COOKIE TIMERS ----------
     * 'seen_cookie_message' determines if the current user has previously seen the banner and accepted cookies
     * 'cookies_timer_reset' determines if user has an old version of cookie timers
     * If the user has previously accepted cookies but has an old version of the timers, show the banner again
     */ if (docCookies.hasItem("seen_cookie_message") && !docCookies.hasItem("cookies_timer_reset")) {
        // If not on the cookie settings page, show the banner;
        if (window.location.href.indexOf("cookie-settings") === -1) {
            createCookieMessage();
        }
    }
    /**
     * Run JavaScript for the component (component-cookie-consent) that displays
     * the current user opt-in/out status, with a toggle button
     */ var cookieConsentAreas = document.getElementsByClassName("cookie-consent-information");
    for (var i = 0; i < cookieConsentAreas.length; i++) {
        // generateStatusMessage(cookieConsentAreas[i]);
        generateCookieSettingsPageContent(cookieConsentAreas[i]);
    }
})();

document.addEventListener('DOMContentLoaded', () => {
  let inputs;
  let index;
  let resources = [];
  let weightingStaff = [];
  let weightingVetting = [];

  inputs = $("#ccs_ca_menu_tabs_form .weight")


  function deselect(e) {
    $('.pop').slideFadeToggle(function () {
      e.removeClass('selected');
    });
  }

  /*     $(function () {
        var foundin = $('body:contains("Save and continue")');
        if (foundin.length < 1) {
          removeClass();
        }
      }); */

  function removeClass() {
    var allElements = document.querySelectorAll(".nav-popup");
    for (i = 0; i < allElements.length; i++) {
      allElements[i].classList.remove('nav-popup');
    }
  }


  $(function () {
    $('.nav-popup').on('click', function () {
      if ($(this).hasClass('selected')) {
        deselect($(this));
        $(".backdrop-nav-menu").fadeOut(200);
      } else {
        $(".backdrop-nav-menu").fadeTo(200, 1);
        let btnSend = document.querySelector('#redirect-button-nav-menu');
        if (btnSend && this.className != "logo nav-popup" && this.className != "govuk-footer__link logo nav-popup") {
          btnSend.setAttribute('name', this.innerHTML);
        } else {
          btnSend.setAttribute('name', 'CCS website');
          document.body.scrollTop = document.documentElement.scrollTop = 0;
        }
        // $(this).addClass('selected');
        $('.pop').slideFadeToggle();
      }
      return false;
    });

    $('.ca_da_service_cap').on('click', function () {
      if ($(this).hasClass('selected')) {
        deselect($(this));
        $(".backdrop-vetting").fadeOut(200);
      } else {
        $(".backdrop-vetting").fadeTo(200, 1);
        let btnSend = document.querySelector('#redirect-button-vetting');
        if (btnSend && this.className != "logo rfp_vetting-popup" && this.className != "govuk-footer__link logo rfp_vetting-popup") {
          btnSend.setAttribute('name', this.innerHTML);
        } else {
          btnSend.setAttribute('name', 'CCS website');
          document.body.scrollTop = document.documentElement.scrollTop = 0;
        }
        // $(this).addClass('selected');
        $('.pop').slideFadeToggle();
      }
      return false;
    });

    $('.dialog-close-vetting').on('click', function () {
      $(".backdrop-vetting").fadeOut(200);
      deselect($('.dialog-close-vetting'));
      return false;
    });
    $('.dialog-close-nav-menu').on('click', function () {
      $(".backdrop-nav-menu").fadeOut(200);
      deselect($('.dialog-close-nav-menu'));
      return false;
    });

    $('#redirect-button-nav-menu').on('click', function () {
      deselect($('.dialog-close-nav-menu'));
      $(".backdrop-nav-menu").fadeOut(200);
      var route = this.name;
      if (route == 'Home') {
        document.location.href = "/";
      } else if (route == 'My Projects') {
        document.location.href = "/dashboard";
      } else if (route == 'CCS website') {
        document.location.href = "https://www.crowncommercial.gov.uk/";
      } else if (route == 'Guidance') {
        document.location.href = "#";
      } else if (route == 'Get help') {
        document.location.href = "https://www.crowncommercial.gov.uk/contact";
      } else {
        return false;
      }
      $(".backdrop-nav-menu").fadeOut(200);
    });

    $('#redirect-button-vetting').on('click', function () {
      $('.rfp_cap').attr('checked', false);
      deselect($('.dialog-close-vetting'));
      $(".backdrop-vetting").fadeOut(200);
      var route = this.name;
      if (route == 'Clear form') {
        clearServiceCapabilitiesSubText();
        for (index = 0; index < inputs.length; ++index) {
          inputs[index].value = '';
        }
      } else {
        return false;
      }
    });
  });


  function clearServiceCapabilitiesSubText() {

    var tabLinks = '';
    var totalWeighting = '';
    var daServiceCapaTabLinks = document.querySelectorAll('.da-service-capabilities');
    var caServiceCapaTabLinks = document.querySelectorAll('.ca-service-capabilities');

    if (daServiceCapaTabLinks !== null && daServiceCapaTabLinks.length > 0)
    {
      tabLinks = daServiceCapaTabLinks;
      totalWeighting = $('#da_total_weighting');
    }
    else if(caServiceCapaTabLinks !==null && caServiceCapaTabLinks.length > 0)
    {
      tabLinks = caServiceCapaTabLinks;
      totalWeighting = $('#ca_total_weighting');
    }
    totalWeighting.text('0 of 100% total weighting for service capabilities');

    for (let index = 0; index < tabLinks.length; index++) {
      document.getElementsByClassName('table-item-subtext')[index].innerHTML = '[ 0 % ]';
    }

  }

  $.fn.slideFadeToggle = function (easing, callback) {
    return this.animate({ opacity: 'toggle', height: 'toggle' }, 'fast', easing, callback);
  };


});
/* eslint-disable no-undef */
let inputs;
let index;
let container;
let resources = [];
let weightingStaff = [];
let weightingVetting = [];

container = document.getElementById('ccs_ca_menu_tabs_form_later') || document.getElementById('ccs_rfp_scoring_criteria') || document.getElementById('ccs_da_menu_tabs_form_later');
if(container !== null) {
  inputs = container.getElementsByTagName('input');
}

function deselect(e) {
  $('.pop').slideFadeToggle(function () {
    e.removeClass('selected');
  });
}

$(function () {
  var foundin = $('body:contains("Save and continue")');
  if (foundin.length < 1) {
    removeClass();
  }
});

function removeClass() {
  var allElements = document.querySelectorAll('.nav-popup');
  for (i = 0; i < allElements.length; i++) {
    allElements[i].classList.remove('nav-popup');
  }
}

$(function () {
  $('.nav-popup').on('click', function () {
    if ($(this).hasClass('selected')) {
      deselect($(this));
      $('.backdrop-nav-menu').fadeOut(200);
    } else {
      $('.backdrop-nav-menu').fadeTo(200, 1);
      let btnSend = document.querySelector('#redirect-button-nav-menu');
      if (btnSend && this.className != 'logo nav-popup' && this.className != 'govuk-footer__link logo nav-popup') {
        btnSend.setAttribute('name', this.innerHTML);
      } else {
        btnSend.setAttribute('name', 'CCS website');
        document.body.scrollTop = document.documentElement.scrollTop = 0;
      }
      // $(this).addClass('selected');
      $('.pop').slideFadeToggle();
    }
    return false;
  });

  $('.vetting-popup').on('click', function () {
    if ($(this).hasClass('selected')) {
      deselect($(this));
      $('.backdrop-vetting').fadeOut(200);
    } else {
      $('.backdrop-vetting').fadeTo(200, 1);
      let btnSend = document.querySelector('#redirect-button-vetting');
      if (
        btnSend &&
        this.className != 'logo vetting-popup' &&
        this.className != 'govuk-footer__link logo vetting-popup'
      ) {
        btnSend.setAttribute('name', this.innerHTML);
      } else {
        btnSend.setAttribute('name', 'CCS website');
        document.body.scrollTop = document.documentElement.scrollTop = 0;
      }
      // $(this).addClass('selected');
      $('.pop').slideFadeToggle();
    }
    return false;
  });

  $('.tier-4-popup').on('click', function () {
    if ($(this).hasClass('selected')) {
      deselect($(this));
      $('.backdrop-tier-4').fadeOut(200);
    } else {
      $('.backdrop-tier-4').fadeTo(200, 1);
      let btnSend = document.querySelector('#redirect-button-tier-4');
      if (
        btnSend &&
        this.className != 'logo tier-4-popup' &&
        this.className != 'govuk-footer__link logo tier-4-popup'
      ) {
        btnSend.setAttribute('name', this.innerHTML);
      } else {
        btnSend.setAttribute('name', 'Tier 4');
        document.body.scrollTop = document.documentElement.scrollTop = 0;
      }
      $('.pop').slideFadeToggle();
    }
    return false;
  });

  $('.tier-5-popup').on('click', function () {
    if ($(this).hasClass('selected')) {
      deselect($(this));
      $('.backdrop-tier-5').fadeOut(200);
    } else {
      $('.backdrop-tier-5').fadeTo(200, 1);
      let btnSend = document.querySelector('#redirect-button-tier-5');
      if (
        btnSend &&
        this.className != 'logo tier-5-popup' &&
        this.className != 'govuk-footer__link logo tier-5-popup'
      ) {
        btnSend.setAttribute('name', this.innerHTML);
      } else {
        btnSend.setAttribute('name', 'Tier 5');
        document.body.scrollTop = document.documentElement.scrollTop = 0;
      }
      $('.pop').slideFadeToggle();
    }
    return false;
  });

  $('.dialog-close-vetting').on('click', function () {
    $('.backdrop-vetting').fadeOut(200);
    deselect($('.dialog-close-vetting'));
    return false;
  });

  $('.dialog-close-tier-4').on('click', function () {
    $('.backdrop-tier-4').fadeOut(200);
    deselect($('.dialog-close-tier-4'));
    return false;
  });

  $('.dialog-close-tier-5').on('click', function () {
    $('.backdrop-tier-5').fadeOut(200);
    deselect($('.dialog-close-tier-5'));
    return false;
  });
  $('.dialog-close-tier').on('click', function () {
    $('.backdrop-tier').fadeOut(200);
    deselect($('.dialog-close-tier'));
    return false;
  });
  $('.dialog-close-nav-menu').on('click', function () {
    $('.backdrop-nav-menu').fadeOut(200);
    deselect($('.dialog-close-nav-menu'));
    return false;
  });

  $('#redirect-button-nav-menu').on('click', function () {
    deselect($('.dialog-close-nav-menu'));
    $('.backdrop-nav-menu').fadeOut(200);
    var route = this.name;
    if (route == 'Home') {
      document.location.href = '/';
    } else if (route == 'My Projects') {
      document.location.href = '/dashboard';
    } else if (route == 'CCS website') {
      document.location.href = 'https://www.crowncommercial.gov.uk/';
    } else if (route == 'Guidance') {
      document.location.href = '#';
    } else if (route == 'Get help') {
      document.location.href = 'https://www.crowncommercial.gov.uk/contact';
    } else {
      return false;
    }
    $('.backdrop-nav-menu').fadeOut(200);
  });

  $('#redirect-button-vetting').on('click', function () {
    const total_staffs = document.getElementById('da-total-staff');
    const total_vettings = document.getElementById('da-total-vetting');
    const total_resources = document.getElementById('da-total-resources');
    const ca_total_staff=document.getElementById('ca-total-staff');
    const ca_total_vetting=document.getElementById('ca-total-vetting');
    const ca_total_resource=document.getElementById('ca-total-resources');
    if(total_staffs!=null)total_staffs.innerHTML = 0;
    if(total_vettings!=null)total_vettings.innerHTML = 0;
    if(total_resources!=null)total_resources.innerHTML = 0;
    if(ca_total_staff!=null)ca_total_staff.innerHTML = 0;
    if(ca_total_vetting!=null)ca_total_vetting.innerHTML = 0;
    if(ca_total_resource!=null)ca_total_resource.innerHTML = 0;
    staffs = [];
    vettings = [];
    deselect($('.dialog-close-vetting'));
    $('.backdrop-vetting').fadeOut(200);
    var route = this.name;
    if (route == 'Clear form') {
      for (index = 0; index < inputs.length; ++index) {
        if(inputs[index].type!='hidden'){
        inputs[index].value = '';
        }
      }
      var tabLinks = document.querySelectorAll('.ca-vetting-weighting');
      var tabLinkda = document.querySelectorAll('.da-vetting-weighting');
      if (tabLinkda != null && tabLinkda.length > 0) {
        var tabLinkda = document.querySelectorAll('.ons-list__item');
        tabLinkda.forEach(tab=>{
          tab.getElementsByClassName('table-item-subtext')[0].innerHTML="0 resources added,0% / 0%"//will cause issue
        });
      }

     if (tabLinks != null && tabLinks.length > 0) {
      var tabLinks = document.querySelectorAll('.ons-list__item');
      tabLinks.forEach(tab=>{
        tab.getElementsByClassName('table-item-subtext')[0].innerHTML="0 resources added,0% / 0%"//will cause issue
      });
    }
    } else {
      return false;
    }
  });

  

 


  $('#redirect-button-tier-4').on('click', function () {
    deselect($('.dialog-close-tier-4'));
    $('.backdrop-tier-4').fadeOut(200);
    var route = this.name;
    if (route == 'Use a 4-tier scoring criteria') {
      document.location.href = '/rfp/set-scoring-criteria?id=4';
    } else {
      return false;
    }
  });

  $('#redirect-button-tier-5').on('click', function () {
    deselect($('.dialog-close-tier-5'));
    $('.backdrop-tier-5').fadeOut(200);
    var route = this.name;
    if (route == 'Use a 5-tier scoring criteria') {
      document.location.href = '/rfp/set-scoring-criteria?id=5';
    } else {
      return false;
    }
  });
  $('#redirect-button-tier').on('click', function () {
    deselect($('.dialog-close-tier'));
    $('.backdrop-tier').fadeOut(200);
    var route = this.name;
    if (route == 'Use a 5-tier scoring criteria') {
      document.location.href = '/rfp/set-scoring-criteria?id=5';
    }else if (route == 'Use a 4-tier scoring criteria') {
      document.location.href = '/rfp/set-scoring-criteria?id=4';
    }
     else {
      return false;
    }
  });
});

$.fn.slideFadeToggle = function (easing, callback) {
  return this.animate({ opacity: 'toggle', height: 'toggle' }, 'fast', easing, callback);
};

function deselect(e) {
  $('.pop').slideFadeToggle(function () {
    e.removeClass('selected');
  });
}

$(function () {
  var foundin = $('body:contains("Save and continue")');
  if (foundin.length < 1) {
    removeClass();
  }
});

function removeClass() {
  var allElements = document.querySelectorAll(".nav-popup");
  for (i = 0; i < allElements.length; i++) {
    allElements[i].classList.remove('nav-popup');
  }
}

$(function () {
  $('.close-event').on('click', function () {
    var option = document.querySelector('input[name="event_management_next_step"]:checked').value;
    if (option == 'close') {
      if ($(this).hasClass('selected')) {
        deselect($(this));
        $(".backdrop-close").fadeOut(200);
      } else {
        $(".backdrop-close").fadeTo(200, 1);
        let btnSend = document.querySelector('#redirect-dutton');
        if (btnSend && this.className != "logo nav-popup" && this.className != "govuk-footer__link logo nav-popup") {
          btnSend.setAttribute('name', this.innerHTML);
        } else {
          btnSend.setAttribute('name', 'CCS website');
          document.body.scrollTop = document.documentElement.scrollTop = 0;
        }
        $('.pop').slideFadeToggle();
      }
      return false;
    } else {
      return true;
    }
  });

  $('.close-dialog-close').on('click', function () {
    $(".backdrop-close").fadeOut(200);
    deselect($('.close-dialog-close'));
    return false;
  });

  $('#redirect-dutton').on('click', function () {
    deselect($('.close-dialog-close'));
    $(".backdrop-close").fadeOut(200);
    document.location.href = "/dashboard";
  });

});

$.fn.slideFadeToggle = function (easing, callback) {
  return this.animate({ opacity: 'toggle', height: 'toggle' }, 'fast', easing, callback);
};
const showEvaluateSuppliersPopup = (event) => {
    debugger;
    event.preventDefault();
    //const inputId=event.srcElement.id;
    // const element = document.getElementById("evaluate_suppliers");
    // if(element.checked){
        if ($(this).hasClass('selected')) {
            deselect($(this));
            $(".backdrop-evaluatesuppliers").fadeOut(200);
            // $(".backdrop-evaluatesuppliers").position("relative");
            document.getElementById("evaluatesupplierspopup").style.paddingTop="1000";
          } else {
            $(".backdrop-evaluatesuppliers").fadeTo(200, 1);
            // $(".backdrop-evaluatesuppliers").position("relative");
            document.getElementById("evaluatesupplierspopup").style.paddingTop="1000";
            let btnSend = document.querySelector('#redirect-button-evaluatesuppliers');
            if (btnSend && this.className != "logo rfp_vetting-popup" && this.className != "govuk-footer__link logo rfp_vetting-popup") {
              btnSend.setAttribute('name', 'Evaluate Suppliers');
              document.body.scrollTop = document.documentElement.scrollTop = 0;
            } else {
              btnSend.setAttribute('name', 'CCS website');
              //document.body.scrollTop = document.documentElement.scrollTop = 0;
            }
            $(this).addClass('selected');
            $('.pop').slideFadeToggle();
          }
    // }
    // else
    // {
    //     document.forms['ccs_evaluate_suppliers'].submit();
    // }
    // if(element.)
    //const arr=inputId.split("rfi_question_");
    // if(element.value.length<500)
    // {
    //   for(var i=1;i<=10;i++)
    //   {
    //     document.getElementById("rfi_label_question_"+i).innerText="";
    //   }
    //   let labelElement=document.getElementById("rfi_label_question_"+arr[1]);
    //   let count=500-element.value.length;
    //   labelElement.innerText=count + " remaining of 500";
      //labelElement.classList.remove('ccs-dynaform-hidden')
    // }
    // else
    // {
  
    // }
  };


  const supplierMsgCancelPopup = (event) => {
    console.log("CANCEL")
    
    event.preventDefault();
    //const inputId=event.srcElement.id;
    // const element = document.getElementById("evaluate_suppliers");
    // if(element.checked){
        if ($(this).hasClass('selected')) {
            deselect($(this));
            $(".backdrop-evaluatesuppliers").fadeOut(200);
            // $(".backdrop-evaluatesuppliers").position("relative");
            document.getElementById("suplierevaluatesupplierspopup").style.paddingTop="1000";
          } else {
            $(".backdrop-evaluatesuppliers").fadeTo(200, 1);
            // $(".backdrop-evaluatesuppliers").position("relative");
           // document.getElementById("suplierevaluatesupplierspopup").style.paddingTop="1000";
            let btnSend = document.querySelector('#supplierredirect-button-evaluatesuppliers');
            if (btnSend && this.className != "logo rfp_vetting-popup" && this.className != "govuk-footer__link logo rfp_vetting-popup") {
              btnSend.setAttribute('name', 'Evaluate Suppliers');
              document.body.scrollTop = document.documentElement.scrollTop = 0;
            } else {
             // btnSend.setAttribute('name', 'CCS website');
              //document.body.scrollTop = document.documentElement.scrollTop = 0;
            }
            $(this).addClass('selected');
            $('.pop').slideFadeToggle();
          }
    // }
    // else
    // {
    //     document.forms['ccs_evaluate_suppliers'].submit();
    // }
    // if(element.)
    //const arr=inputId.split("rfi_question_");
    // if(element.value.length<500)
    // {
    //   for(var i=1;i<=10;i++)
    //   {
    //     document.getElementById("rfi_label_question_"+i).innerText="";
    //   }
    //   let labelElement=document.getElementById("rfi_label_question_"+arr[1]);
    //   let count=500-element.value.length;
    //   labelElement.innerText=count + " remaining of 500";
      //labelElement.classList.remove('ccs-dynaform-hidden')
    // }
    // else
    // {
  
    // }
  };


  function deselect(e) {
    $('.pop').slideFadeToggle(function () {
      e.removeClass('selected');
    });
  }

  $(function () {
    var foundin = $('body:contains("Confirm Scores")');
    if (foundin.length < 1) {
      removeClass();
    }
  });

  function removeClass() {
    var allElements = document.querySelectorAll(".nav-popup");
    for (i = 0; i < allElements.length; i++) {
      allElements[i].classList.remove('nav-popup');
    }
  }

  $('.dialog-close-evaluatesuppliers').on('click', function () {
    $(".backdrop-evaluatesuppliers").fadeOut(200);
    deselect($('.dialog-close-evaluatesuppliers'));
    return false;
  });

  $('#redirect-button-evaluatesuppliers').on('click', function () {
    deselect($('.dialog-close-evaluatesuppliers'));
    $(".backdrop-evaluatesuppliers").fadeOut(200);
    document.location.href="/evaluate-confirm"//scat-5013
      return false;
    
  });

  $('#supplierredirect-button-evaluatesuppliers').on('click', function () {
    deselect($('.dialog-close-evaluatesuppliers'));
    $(".backdrop-evaluatesuppliers").fadeOut(200);
    document.location.href="/message/inbox"//scat-6153
      return false;
    
  });
  

  $.fn.slideFadeToggle = function (easing, callback) {
    return this.animate({ opacity: 'toggle', height: 'toggle' }, 'fast', easing, callback);
  };
const showPopup = (event) => {
    debugger;
    event.preventDefault();
    //const inputId=event.srcElement.id;
    //const element = document.getElementById("rfi_next_steps-2");
    const radioValue = document.querySelector('input[type="radio"]:checked').value;
    if(radioValue == 'Close this event and the whole project'){
        if ($(this).hasClass('selected')) {
            deselect($(this));
            $(".backdrop-nextsteps").fadeOut(200);
            // $(".backdrop-nextsteps").position("relative");
            document.getElementById("nextstepspopup").style.paddingTop="1000";
          } else {
            $(".backdrop-nextsteps").fadeTo(200, 1);
            // $(".backdrop-nextsteps").position("relative");
            document.getElementById("nextstepspopup").style.paddingTop="1000";
            let btnSend = document.querySelector('#redirect-button-nextsteps');
            if (btnSend && this.className != "logo rfp_vetting-popup" && this.className != "govuk-footer__link logo rfp_vetting-popup") {
              btnSend.setAttribute('name', 'Next Step');
              document.body.scrollTop = document.documentElement.scrollTop = 0;
            } else {
              btnSend.setAttribute('name', 'CCS website');
              //document.body.scrollTop = document.documentElement.scrollTop = 0;
            }
            $(this).addClass('selected');
            $('.pop').slideFadeToggle();
          }
    }
    else
    {
        document.forms['ccs_rfi_next_steps'].submit();
    }
    // if(element.)
    //const arr=inputId.split("rfi_question_");
    // if(element.value.length<500)
    // {
    //   for(var i=1;i<=10;i++)
    //   {
    //     document.getElementById("rfi_label_question_"+i).innerText="";
    //   }
    //   let labelElement=document.getElementById("rfi_label_question_"+arr[1]);
    //   let count=500-element.value.length;
    //   labelElement.innerText=count + " remaining of 500";
      //labelElement.classList.remove('ccs-dynaform-hidden')
    // }
    // else
    // {
  
    // }
  };

  
  const loseyouprojectShowPopup = (event) => {
    event.preventDefault();
    $(".backdrop-nextsteps").fadeTo(200, 1);
    document.getElementById("nextstepspopup").style.paddingTop="1000";
    let btnSend = document.querySelector('#redirect-button-nextsteps');
    if (btnSend && this.className != "logo rfp_vetting-popup" && this.className != "govuk-footer__link logo rfp_vetting-popup") {
      btnSend.setAttribute('name', 'Next Step');
      document.body.scrollTop = document.documentElement.scrollTop = 0;
    } else {
      btnSend.setAttribute('name', 'CCS website');
    }
    $('.pop').slideFadeToggle();
  };



  function deselect(e) {
    $('.pop').slideFadeToggle(function () {
      e.removeClass('selected');
    });
  }

  $(function () {
    var foundin = $('body:contains("Save and continue")');
    if (foundin.length < 1) {
      removeClass();
    }
  });

  function removeClass() {
    var allElements = document.querySelectorAll(".nav-popup");
    for (i = 0; i < allElements.length; i++) {
      allElements[i].classList.remove('nav-popup');
    }
  }

  $('.dialog-close-nextsteps').on('click', function () {
    $(".backdrop-nextsteps").fadeOut(200);
    deselect($('.dialog-close-nextsteps'));
    return false;
  });

  $('#redirect-button-nextsteps').on('click', function () {
    deselect($('.dialog-close-nextsteps'));
    $(".backdrop-nextsteps").fadeOut(200);
    document.location.href="../rfi/closerfi"//scat-5013
      return false;
    
  });

  $.fn.slideFadeToggle = function (easing, callback) {
    return this.animate({ opacity: 'toggle', height: 'toggle' }, 'fast', easing, callback);
  };
document.addEventListener('DOMContentLoaded', () => {
  let inputs;
  let index;
  let resources = [];
  let weightingStaff = [];
  let weightingVetting = [];

  inputs = $("#ccs_ca_menu_tabs_form_rfp_vetting .weight_vetting_class")
  if (document.querySelectorAll('.ons-list__item') !== null) ccsTabMenuNaviation();

  function deselect(e) {
    $('.pop').slideFadeToggle(function () {
      e.removeClass('selected');
    });
  }

  $(function () {
    var foundin = $('body:contains("Save and continue")');
    if (foundin.length < 1) {
      removeClass();
    }
  });

  function removeClass() {
    var allElements = document.querySelectorAll(".nav-popup");
    for (i = 0; i < allElements.length; i++) {
      allElements[i].classList.remove('nav-popup');
    }
  }


  $(function () {
    $('.nav-popup').on('click', function () {
      if ($(this).hasClass('selected')) {
        deselect($(this));
        $(".backdrop-nav-menu").fadeOut(200);
      } else {
        $(".backdrop-nav-menu").fadeTo(200, 1);
        let btnSend = document.querySelector('#redirect-button-nav-menu');
        if (btnSend && this.className != "logo nav-popup" && this.className != "govuk-footer__link logo nav-popup") {
          btnSend.setAttribute('name', this.innerHTML);
        } else {
          btnSend.setAttribute('name', 'CCS website');
          document.body.scrollTop = document.documentElement.scrollTop = 0;
        }
        // $(this).addClass('selected');
        $('.pop').slideFadeToggle();
      }
      return false;
    });

    $('.rfp_vetting-popup').on('click', function () {
      if ($(this).hasClass('selected')) {
        deselect($(this));
        $(".backdrop-vetting").fadeOut(200);
      } else {
        $(".backdrop-vetting").fadeTo(200, 1);
        let btnSend = document.querySelector('#redirect-button-vetting');
        if (btnSend && this.className != "logo rfp_vetting-popup" && this.className != "govuk-footer__link logo rfp_vetting-popup") {
          btnSend.setAttribute('name', this.innerHTML);
        } else {
          btnSend.setAttribute('name', 'CCS website');
          document.body.scrollTop = document.documentElement.scrollTop = 0;
        }
        // $(this).addClass('selected');
        $('.pop').slideFadeToggle();
      }
      return false;
    });

    $('.dialog-close-vetting').on('click', function () {
      $(".backdrop-vetting").fadeOut(200);
      deselect($('.dialog-close-vetting'));
      return false;
    });
    $('.dialog-close-nav-menu').on('click', function () {
      $(".backdrop-nav-menu").fadeOut(200);
      deselect($('.dialog-close-nav-menu'));
      return false;
    });

    $('#redirect-button-nav-menu').on('click', function () {
      deselect($('.dialog-close-nav-menu'));
      $(".backdrop-nav-menu").fadeOut(200);
      var route = this.name;
      if (route == 'Home') {
        document.location.href = "/";
      } else if (route == 'My Projects') {
        document.location.href = "/dashboard";
      } else if (route == 'CCS website') {
        document.location.href = "https://www.crowncommercial.gov.uk/";
      } else if (route == 'Guidance') {
        document.location.href = "#";
      } else if (route == 'Get help') {
        document.location.href = "https://www.crowncommercial.gov.uk/contact";
      } else {
        return false;
      }
      $(".backdrop-nav-menu").fadeOut(200);
    });

    $('#redirect-button-vetting').on('click', function () {
      deselect($('.dialog-close-vetting'));
      $(".backdrop-vetting").fadeOut(200);
      var route = this.name;
      if (route == 'Clear form') {
        let tabLinks = document.querySelectorAll('.rfp-vetting-weighting');
        if (tabLinks != null) {
          clearRfpResourceVettingData(tabLinks)
        }
        else {
          for (index = 0; index < inputs.length; ++index) {
            inputs[index].value = '';
          }
        }

      } else {
        return false;
      }
    });
  });

  function clearRfpResourceVettingData(tabLinks) {
    $('#rfp_total_resource').text('0');
    $('#rfp_total_resource2').text('0');
    for (var a = 0; a < tabLinks.length; a++) {
      document.getElementsByClassName('table-item-subtext')[a].innerHTML = '0 resources added'
    }
    let totalInputFields = $('.rfp_weight_vetting_class');
    for (a = 0; a < totalInputFields.length; ++a) {
      totalInputFields[a].value = '';
    }

  }

  $.fn.slideFadeToggle = function (easing, callback) {
    return this.animate({ opacity: 'toggle', height: 'toggle' }, 'fast', easing, callback);
  };


});
// Dashboard pagination starts
$(document).ready(function () {
    // Active event
    $('#active-data').after('<div class="ccs-pagination" id="nav"><p class="govuk-visually-hidden" aria-labelledby="pagination-label">Pagination navigation</p></div>');
    var rowsShown = 5;
    var rowsTotal = $('#active-data tbody tr').length;
    var numPages = rowsTotal / rowsShown;
    var pageNum = 0;
    $('#nav').append('<a id="active-data-previous" rel="0" class="ccs-pagination__link" href="#">Previous<span class="govuk-visually-hidden"> set of pages</span></a>');
    for (i = 0; i < numPages; i++) {
      pageNum = i + 1;
      $('#nav').append('<a class="ccs-pagination__link" id="pageId_'+i+'" href="#" rel="' + i + '">' + pageNum + '</a> ');
    }
    $('#nav').append('<a id="active-data-next" rel="1" class="ccs-pagination__link" href="#">Next<span class="govuk-visually-hidden"> set of pages</span></a>');
    $('#active-data-previous').addClass("govuk-visually-hidden");
    $('#nav').append('<span class="govuk-visually-hidden" id="total_page_active_event">' + pageNum + '</span> ');
  
    $('#nav').append('<p class="ccs-pagination__results">Showing <b><label id="start_count">1</label></b> to <b><label id="end_count">' + rowsShown + '</label></b> of <b><label id="total_count">' + rowsTotal + '</label></b> results</p>');
    $('#active-data tbody tr').hide();
    $('#active-data tbody tr').slice(0, rowsShown).show();
    $('#nav a:nth-child(3)').addClass('ccs-pagination__item--active');
    $('#nav a').bind('click', function () {
      var currPage = $(this).attr('rel');
      var activePage = "#pageId_"+currPage;
      $('#nav a').removeClass('ccs-pagination__item--active');
      $(activePage).addClass('ccs-pagination__item--active');
      
      if (currPage != 0) {
        $("#active-data-previous").attr('rel', parseInt(currPage) - 1);
        $('#active-data-previous').removeClass("govuk-visually-hidden");
      } else {
        $('#active-data-previous').addClass("govuk-visually-hidden");
      }
  
      if (parseInt($('#total_page_active_event')[0].innerHTML) - parseInt(currPage) != 1) {
        $("#active-data-next").attr('rel', parseInt(currPage)+1);
        $('#active-data-next').removeClass("govuk-visually-hidden");
      } else {
        $('#active-data-next').addClass("govuk-visually-hidden");
        $("#active-data-next").attr('rel', parseInt(currPage)+1);
      }
  
      var startItem = currPage * rowsShown;
      var endItem = startItem + rowsShown;
  
      document.getElementById('start_count').innerHTML = startItem + 1;
      if (document.getElementById('total_count').innerHTML < endItem) {
        document.getElementById('end_count').innerHTML = document.getElementById('total_count').innerHTML;
      } else {
        document.getElementById('end_count').innerHTML = endItem;
      }
  
      $('#active-data tbody tr').css('opacity', '0.0').hide().slice(startItem, endItem).
        css('display', 'table-row').animate({ opacity: 1 }, 300);
      return false;
    });
  });
  
    // Historical event
    $(document).ready(function () {
    $('#historical-data').after('<div class="ccs-pagination" id="historical-nav"><p class="govuk-visually-hidden" aria-labelledby="pagination-label">Pagination historical-navigation</p></div>');
    var rowsShown = 5;
    var rowsTotal = $('#historical-data tbody tr').length;
    var numPages = rowsTotal / rowsShown;
    var pageNum = 0;
    $('#historical-nav').append('<a id="historical-data-previous" rel="0" class="ccs-pagination__link" href="#">Previous<span class="govuk-visually-hidden"> set of pages</span></a>');
    for (i = 0; i < numPages; i++) {
      pageNum = i + 1;
      $('#historical-nav').append('<a class="ccs-pagination__link" id="pageId_'+i+'" href="#" rel="' + i + '">' + pageNum + '</a> ');
    }
    $('#historical-nav').append('<a id="historical-data-next" rel="1" class="ccs-pagination__link" href="#">Next<span class="govuk-visually-hidden"> set of pages</span></a>');
    $('#historical-data-previous').addClass("govuk-visually-hidden");
    $('#historical-nav').append('<span class="govuk-visually-hidden" id="total_page_active_event">' + pageNum + '</span> ');
  
    $('#historical-nav').append('<p class="ccs-pagination__results">Showing <b><label id="start_count">1</label></b> to <b><label id="end_count">' + rowsShown + '</label></b> of <b><label id="total_count">' + rowsTotal + '</label></b> results</p>');
    $('#historical-data tbody tr').hide();
    $('#historical-data tbody tr').slice(0, rowsShown).show();
    $('#historical-nav a:nth-child(3)').addClass('ccs-pagination__item--active');
    $('#historical-nav a').bind('click', function () {
      var currPage = $(this).attr('rel');
      var activePage = "#pageId_"+currPage;
      $('#historical-nav a').removeClass('ccs-pagination__item--active');
      $(activePage).addClass('ccs-pagination__item--active');
      
      if (currPage != 0) {
        $("#historical-data-previous").attr('rel', parseInt(currPage) - 1);
        $('#historical-data-previous').removeClass("govuk-visually-hidden");
      } else {
        $('#historical-data-previous').addClass("govuk-visually-hidden");
      }
  
      if (parseInt($('#total_page_active_event')[0].innerHTML) - parseInt(currPage) != 1) {
        $("#historical-data-next").attr('rel', parseInt(currPage)+1);
        $('#historical-data-next').removeClass("govuk-visually-hidden");
      } else {
        $('#historical-data-next').addClass("govuk-visually-hidden");
        $("#historical-data-next").attr('rel', parseInt(currPage)+1);
      }
  
      var startItem = currPage * rowsShown;
      var endItem = startItem + rowsShown;
  
      document.getElementById('start_count').innerHTML = startItem + 1;
      if (document.getElementById('total_count').innerHTML < endItem) {
        document.getElementById('end_count').innerHTML = document.getElementById('total_count').innerHTML;
      } else {
        document.getElementById('end_count').innerHTML = endItem;
      }
  
      $('#historical-data tbody tr').css('opacity', '0.0').hide().slice(startItem, endItem).
        css('display', 'table-row').animate({ opacity: 1 }, 300);
      return false;
    });
  });
  // Dashboard pagination ends

  // Messaging pagination starts
  // Sent message
  $(document).ready(function () {
    // debugger;
    $('#sent-message').after('<div class="ccs-pagination" id="historical-nav2"><p class="govuk-visually-hidden" aria-labelledby="pagination-label">Pagination historical-navigation</p></div>');
       var rowsShown = 10;
    var rowsTotal = $('#sent-message tbody tr').length;
       var numPages = rowsTotal / rowsShown;
       var pageNum = 0;
       if(rowsTotal<=rowsShown)
       {
         rowsShown=rowsTotal;
       }
    $('#historical-nav2').append('<a id="sent-message-previous" rel="0" class="ccs-pagination__link" href="#">Previous<span class="govuk-visually-hidden"> set of pages</span></a>');
       for (i = 0; i < numPages; i++) {
         pageNum = i + 1;
         $('#historical-nav2').append('<a class="ccs-pagination__link" id="pageId_'+i+'" href="#" rel="' + i + '">' + pageNum + '</a> ');
       }
       if(rowsTotal!=rowsShown){
        $('#historical-nav2').append('<a id="sent-message-next" rel="1" class="ccs-pagination__link" href="#">Next<span class="govuk-visually-hidden"> set of pages</span></a>');
        }
    $('#sent-message-previous').addClass("govuk-visually-hidden");
       $('#historical-nav2').append('<span class="govuk-visually-hidden" id="total_page_active_event">' + pageNum + '</span> ');
       
       $('#historical-nav2').append('<p class="ccs-pagination__results">Showing <b><label id="start_count">1</label></b> to <b><label id="end_count">' + rowsShown + '</label></b> of <b><label id="total_count">' + rowsTotal + '</label></b> results</p>');
    $('#sent-message tbody tr').hide();
    $('#sent-message tbody tr').slice(0, rowsShown).show();
       $('#historical-nav2 a:nth-child(3)').addClass('ccs-pagination__item--active');
       $('#historical-nav2 a').bind('click', function () {
         var currPage = $(this).attr('rel');
         var activePage = "#pageId_"+currPage;
         $('#historical-nav2 a').removeClass('ccs-pagination__item--active');
         $(activePage).addClass('ccs-pagination__item--active');
         
         if (currPage != 0) {
    $("#sent-message-previous").attr('rel', parseInt(currPage) - 1);
    $('#sent-message-previous').removeClass("govuk-visually-hidden");
         } else {
    $('#sent-message-previous').addClass("govuk-visually-hidden");
         }
     
         if (parseInt($('#total_page_active_event')[0].innerHTML) - parseInt(currPage) != 1) {
    $("#sent-message-next").attr('rel', parseInt(currPage)+1);
    $('#sent-message-next').removeClass("govuk-visually-hidden");
         } else {
    $('#sent-message-next').addClass("govuk-visually-hidden");
    $("#sent-message-next").attr('rel', parseInt(currPage)+1);
         }
     
         var startItem = currPage * rowsShown;
         var endItem = startItem + rowsShown;
     
         document.getElementById('start_count').innerHTML = startItem + 1;
         if (document.getElementById('total_count').innerHTML < endItem) {
           document.getElementById('end_count').innerHTML = document.getElementById('total_count').innerHTML;
         } else {
           document.getElementById('end_count').innerHTML = endItem;
         }
     
    $('#sent-message tbody tr').css('opacity', '0.0').hide().slice(startItem, endItem).
           css('display', 'table-row').animate({ opacity: 1 }, 300);
         return false;
       });
     });

  // Received message
  $(document).ready(function () {
    // Active event 
 $('#received-message').after('<div class="ccs-pagination" id="nav-received"><p class="govuk-visually-hidden" aria-labelledby="pagination-label">Pagination nav-receivedigation</p></div>');
    var rowsShown = 10;
 var rowsTotal = $('#received-message tbody tr').length;
    var numPages = rowsTotal / rowsShown;
    var pageNum = 0;
 $('#nav-received').append('<a id="received-message-previous" rel="0" class="ccs-pagination__link" href="#">Previous<span class="govuk-visually-hidden"> set of pages</span></a>');
    for (i = 0; i < numPages; i++) {
      pageNum = i + 1;
 $('#nav-received').append('<a class="ccs-pagination__link" id="pageId_'+i+'" href="#" rel="' + i + '">' + pageNum + '</a> ');
    }
 $('#nav-received').append('<a id="received-message-next" rel="1" class="ccs-pagination__link" href="#">Next<span class="govuk-visually-hidden"> set of pages</span></a>');
 $('#received-message-previous').addClass("govuk-visually-hidden");
 $('#nav-received').append('<span class="govuk-visually-hidden" id="total_page_active_event">' + pageNum + '</span> ');
  
 $('#nav-received').append('<p class="ccs-pagination__results">Showing <b><label id="start_count">1</label></b> to <b><label id="end_count">' + rowsShown + '</label></b> of <b><label id="total_count">' + rowsTotal + '</label></b> results</p>');
 $('#received-message tbody tr').hide();
 $('#received-message tbody tr').slice(0, rowsShown).show();
 $('#nav-received a:nth-child(3)').addClass('ccs-pagination__item--active');
 $('#nav-received a').bind('click', function () {
      var currPage = $(this).attr('rel');
      var activePage = "#pageId_"+currPage;
 $('#nav-received a').removeClass('ccs-pagination__item--active');
      $(activePage).addClass('ccs-pagination__item--active');
      
      if (currPage != 0) {
 $("#received-message-previous").attr('rel', parseInt(currPage) - 1);
 $('#received-message-previous').removeClass("govuk-visually-hidden");
      } else {
 $('#received-message-previous').addClass("govuk-visually-hidden");
      }
  
      if (parseInt($('#total_page_active_event')[0].innerHTML) - parseInt(currPage) != 1) {
 $("#received-message-next").attr('rel', parseInt(currPage)+1);
 $('#received-message-next').removeClass("govuk-visually-hidden");
      } else {
 $('#received-message-next').addClass("govuk-visually-hidden");
 $("#received-message-next").attr('rel', parseInt(currPage)+1);
      }
  
      var startItem = currPage * rowsShown;
      var endItem = startItem + rowsShown;
  
      document.getElementById('start_count').innerHTML = startItem + 1;
      if (document.getElementById('total_count').innerHTML < endItem) {
        document.getElementById('end_count').innerHTML = document.getElementById('total_count').innerHTML;
      } else {
        document.getElementById('end_count').innerHTML = endItem;
      }
  
 $('#received-message tbody tr').css('opacity', '0.0').hide().slice(startItem, endItem).
        css('display', 'table-row').animate({ opacity: 1 }, 300);
      return false;
    });
  });
  // Messaging pagination end
var inactiviyTime = 0;
let logoutlocationURL = window.location.origin + '/oauth/logout'
var inactivateAfter = 60;

$(document).ready(function () {
    // Increment the idle time counter every minute.
    var idleInterval = setInterval(timerIncrement, 60000); // 1 minute

       // Zero the idle timer on mouse movement.
    $(this).mousemove(function (e) {
        inactiviyTime = 0;
    });
    $(this).keypress(function (e) {
        inactiviyTime = 0;
    });
});

function timerIncrement() {
    inactiviyTime = inactiviyTime + 1;

    if (inactiviyTime > inactivateAfter) { // 15 minutes
        window.location.href= logoutlocationURL
    }
}
var allListOfHeading = new Set();

for (var a = 0; a < document.getElementsByClassName('headings').length; a++) {
    allListOfHeading.add(document.getElementsByClassName('headings')[a].innerHTML);
}

allListOfHeading = [...allListOfHeading].map(items => {
    return {
        partial: items.split(" ").join('_').concat('_partial'),
        whole: items.split(" ").join('_').concat('_whole')
    }
})

const weight_whole_len = $('.weight_vetting_whole').length + 1;
const weight_partial_len = $('.weight_vetting_partial').length + 1;
const weight = $('.weight');

const TotalFieldOnScreen = $('.govuk-radios__input').length / 2 + 1;

for (var a = 0; a < document.getElementsByClassName('weight_vetting_whole').length; a++) {
    document.getElementsByClassName('weight_vetting_whole')[a].checked = true;
}

for (var a = 1; a < weight_whole_len; a++) {
    if ($(`#weight_vetting_whole${a}`).val() !== "") {
        const WholeWeightageCluster = "#whole_weightage_" + a
        $(WholeWeightageCluster).attr('checked', 'checked');
        const WholeclusterDIV = '#whole_cluster_' + a;
        $(WholeclusterDIV).fadeIn();
    }
}
var itemSubText = '';
var itemText = '';
var tabLinks = '';
var totalWeighting = '';

var daServiceCapaTabLinks = document.querySelectorAll('.da-service-capabilities');
var caServiceCapaTabLinks = document.querySelectorAll('.ca-service-capabilities');

if (daServiceCapaTabLinks !== null && daServiceCapaTabLinks.length > 0) {
    tabLinks = daServiceCapaTabLinks;
    ccsTabMenuNaviation();
    totalWeighting = $('#da_total_weighting');
}
else if (caServiceCapaTabLinks !== null && caServiceCapaTabLinks.length > 0) {
    tabLinks = caServiceCapaTabLinks;
    ccsTabMenuNaviation();
    totalWeighting = $('#ca_total_weighting');
}

// chandeshwar 
document.addEventListener('DOMContentLoaded', () => {

    if (tabLinks !== null && tabLinks.length > 0) {

        itemSubText = document.getElementsByClassName('table-item-subtext')[0];;
        itemText = tabLinks[0].getElementsByTagName('a')[0].childNodes[0].data

        if (itemText != null && itemText != '') {

            itemText = itemText.replaceAll(" ", "_");
            weightVettingWholePartialOnClick(itemText);
        }
        Array.from(tabLinks).forEach(link => {

            link.addEventListener('click', function (e) {
                let currentTarget = e.currentTarget;
                let clicked_index = $(this).index();

                itemSubText = currentTarget.getElementsByClassName('table-item-subtext')[0];
                itemText = tabLinks[clicked_index].getElementsByTagName('a')[0].childNodes[0].data

                itemText = itemText.replaceAll(" ", "_");
                weightVettingWholePartialOnClick(itemText);
                // updateTotalWeight();
                resetRadioButtion();
                return false;
            });
        });
    }

    weight.on('keydown', (event) => {
        if (event.key === '.' || event.keyCode === 69)
            event.preventDefault();
    });

    function updateTotalAddedWeight() {
        
        let weightCount = 0
        for (index = 0; index < weight.length; ++index) {
            if (weight[index].value != "" && weight[index].value>0 && weight[index].value<=100)
                weightCount = weightCount + Number(weight[index].value);
        }
        let buildText = weightCount + ' of 100% total weighting for service capabilities'
        totalWeighting.text(buildText);
    }

    // function updateTotalWeight() {

    //     let weightCount = 0;
    //     for (let index = 0; index < tabLinks.length; index++) {

    //         let subText = tabLinks[index].getElementsByTagName('div')[0].childNodes[0].data;
    //         var numbr = subText.match(/\d/g);

    //         if (numbr != null) {
    //             numbr = numbr.join("");
    //             weightCount = weightCount + Number(numbr);
    //         }

    //     }
    //     if (weightCount > 100) {

    //         $('.govuk-error-summary__title').text('There is a problem');

    //         $("#summary_list").html('<li><a href="#">The weighting value(s) for the service capabilities must be equal to 100%</a></li> ');
    //         $([document.documentElement, document.body]).animate({
    //             scrollTop: $("#summary_list").offset().top
    //         }, 1000);

    //         $('#service_capability_error_summary').removeClass('hide-block');
    //     }
    //     else {

    //         let buildText = weightCount + ' of 100% total weighting for service capabilities'
    //         totalWeighting.text(buildText);
    //     }

    // }

    function resetRadioButtion() {
        for (var a = 0; a < TotalFieldOnScreen; a++) {
            const WholeclusterDIV = '#whole_cluster_' + a;
            const PartialClusterDIV = '#partial_cluster_' + a;
            $('#whole_weightage_' + a).prop('checked', false);
            $('#partial_weightage_' + a).prop('checked', false)
            $(PartialClusterDIV).fadeOut();
            $(WholeclusterDIV).fadeOut();
        }
    }

    function weightVettingWholePartialOnClick(category) {

        let vettingPartial = 'weight_vetting_partial' + category;
        const vettingWhole2 = 'weight_vetting_whole_' + category

        for (var a = 1; a < weight_whole_len; a++) {

            let vettingWhole = 'weight_vetting_whole_' + category + a;
            let vettingWholeT = category +'whole'+ a;

            let vetWhole = $(`#${vettingWhole}`);

            vetWhole.on('blur', () => {

                if (vetWhole.val() != undefined && vetWhole.val() !== null && vetWhole.val() !== "") {
                    clearInputData(weight_partial_len, vettingPartial);

                    if (isValidInputData(vettingWhole, vettingWholeT, vetWhole.val()))
                    {
                        
                        updateTotalAddedWeight();
                        itemSubText.innerHTML = '[ ' + vetWhole.val() + ' %' + ' ]';
                    }
                        
                }
                else if (vetWhole.val() != undefined && vetWhole.val() == "") {
                    
                    itemSubText.innerHTML = '[ ' + 0 + ' %' + ' ]';
                    $(`#${vettingWhole}`).removeClass('govuk-input--error');
                    $(`.${vettingWholeT}`).text('');
                    updateTotalAddedWeight();
                }

            });
        }
        for (var a = 1; a < weight_partial_len; a++) {

            let weightId = vettingPartial + a;
            let vetPartial = $(`#${vettingPartial}${a}`);
            let weightT = category + a;

            vetPartial.on('blur', () => {

                clearWholeCluster(category);

                if (vetPartial.val() != undefined && vetPartial.val() !== null && vetPartial.val() !== "") {
                    clearInputData(weight_whole_len, vettingWhole2);
                    if (isValidInputData(weightId, weightT, vetPartial.val()))
                    {
                        updateVettingPartial(vettingPartial);
                        
                        updateTotalAddedWeight();
                    }
                       
                }
                else if (vetPartial.val() != undefined && vetPartial.val() == "") {
                    
                    updateVettingPartial(vettingPartial);
                    updateTotalAddedWeight();
                    $(`#${weightId}`).removeClass('govuk-input--error');
                    $(`.${weightT}`).text('');
                }

            });
        }
    }

    function clearWholeCluster(category) {
        for (var a = 1; a < weight_whole_len; a++) {
            let vettingWhole = 'weight_vetting_whole_' + category + a;
            let vetWhole = $(`#${vettingWhole}`);
            if (vetWhole != undefined && vetWhole != null)
                vetWhole.text('');
        }
    }

    function clearInputData(weightLength, idName) {
        for (var a = 1; a < weightLength; a++) {
            $(`#${idName}${a}`).val('');
        }
    }


    function updateVettingPartial(vettingPartial) {
        let value = 0;
        for (var a = 1; a < weight_partial_len; a++) {
            let vetPartial = $(`#${vettingPartial}${a}`);
            if (vetPartial.val() != undefined && vetPartial.val() != ''&& vetPartial.val()>0 &&vetPartial.val()<=100)
                value = value + Number(vetPartial.val());
        }
        itemSubText.innerHTML = '[ ' + value + ' %' + ' ]';
    }

    /**
     * @FADE_IN_AND_OUT
     */
    for (var a = 0; a < TotalFieldOnScreen; a++) {
        const WholeclusterDIV = '#whole_cluster_' + a;
        const PartialClusterDIV = '#partial_cluster_' + a;
        const WholeWeightageCluster = "#whole_weightage_" + a
        $(PartialClusterDIV).fadeOut();
        $(WholeclusterDIV).fadeOut();
        $('#whole_weightage_' + a).click(function () {
           
            if ($(this).is(':checked')) {
               
                $(PartialClusterDIV).fadeOut();
                $(WholeclusterDIV).fadeIn();
            }
        });
        $('#partial_weightage_' + a).click(function () {
           
            if ($(this).is(':checked')) {
               
                $(PartialClusterDIV).fadeIn();
                $(WholeclusterDIV).fadeOut();
            }
        });
    }


    for (var a = 0; a < allListOfHeading.length; a++) {
        const InputFieldSelector_partial = document.getElementsByClassName(allListOfHeading[a].whole)[a];

        if (InputFieldSelector_partial != null && InputFieldSelector_partial != undefined) {
            const Name = InputFieldSelector_partial.getAttribute('class');
            const Value = InputFieldSelector_partial.value;

            if (Value != "") {
                if ($(`.${allListOfHeading[index].whole}_div`) != undefined) {
                    $(`.${allListOfHeading[a].whole}_div`).fadeIn();
                }
            }
        }
    }

    function isValidInputData(weightClassName, weightPartialClassName, value) {
        var reg = /^\d+$/;
        if (value <= 0) {         
            $(`#${weightClassName}`).addClass('govuk-input--error');
            $(`.${weightPartialClassName}`).text('Please enter a positive integer');
            $('#service_capability_error_summary').removeClass('hide-block');
            $('.govuk-error-summary__title').text('There is a problem');
            $("#summary_list").html('<li><a href="#">The weighting value(s) for the service capabilities must be a positive integer</a></li> ');
            $('html, body').animate({ scrollTop: 0 }, 'fast');
                   }
        else if (Number(value) > 100) {           
            $(`#${weightClassName}`).addClass('govuk-input--error');
            $(`.${weightPartialClassName}`).text('Please enter an integer >0 and <=100 %');
            $('#service_capability_error_summary').removeClass('hide-block');
            $('.govuk-error-summary__title').text('There is a problem');
            $("#summary_list").html('<li><a href="#">The weighting value(s) for the service capabilities must be less or equal 100 %</a></li> ');
            $('html, body').animate({ scrollTop: 0 }, 'fast');
                }
        else if(!value.match(reg))
        {  $(`#${weightClassName}`).addClass('govuk-input--error');
        $(`.${weightPartialClassName}`).text('Please enter only intergers');       
            $('#service_capability_error_summary').removeClass('hide-block');
            $('.govuk-error-summary__title').text('There is a problem');
            $("#summary_list").html('<li><a href="#">The weighting value(s) for the service capabilities must not contain alphabets</a></li>');
            $('html, body').animate({ scrollTop: 0 }, 'fast');
                 }
       else {
            
            $(`#${weightClassName}`).removeClass('govuk-input--error');
            $(`.${weightPartialClassName}`).text('');
            $('#service_capability_error_summary').addClass('hide-block');
            $('.govuk-error-summary__title').text('');
            $("#summary_list").html('');
            return true;
        }
        return false;
    }
    //ccs_ca_menu_tabs_form

    $('#ccs_ca_menu_tabs_form').on('submit', (e) => {
        let negativewholeerror=[], greaterwholeerror=[],alphabetwholeerror=[];
        let negativepartialerror=[], greaterpartialerror=[],alphabetpartialerror=[];
        var isFormValid = true;
        var totalWeightingPercentage = totalWeighting.text().trim().substring(0, 4).match(/\d/g);
        totalWeightingPercentage = totalWeightingPercentage.join("");
        let intWeightingPercentage = Number(totalWeightingPercentage);
        var checkforEmptyBoxes = [];

        const TotalWeightageBox = document.getElementsByClassName('weight');
        for (var i = 0; i < TotalWeightageBox.length; i++) {
            if (TotalWeightageBox[i].value == '') {
                checkforEmptyBoxes.push(true);
            }
        }
        var reg = /^\d+$/;
        for (var a = 1; a < weight_whole_len; a++) {
            const classTarget = document.getElementsByClassName("weight_vetting_whole")[a - 1];
            if (classTarget.value <= 0 && classTarget.value !== '') {
                
                negativewholeerror.push(true)
            }
            else if (classTarget.value > 100 && classTarget.value != '')            
            {
                greaterwholeerror.push(true)
            }
            else if (!classTarget.value.match(reg) && classTarget.value != '')           
                {
                    alphabetwholeerror.push(true)
                }
        }
        for (var a = 1; a < weight_partial_len; a++) {
            const classTarget = document.getElementsByClassName("weight_vetting_partial")[a - 1];
            if (classTarget.value <= 0 && classTarget.value !== '') {
                
                 negativepartialerror.push(true)
            }
            else if (classTarget.value > 100 && classTarget.value != '')            
            {
                greaterpartialerror.push(true)
            }
            else if (!classTarget.value.match(reg) && classTarget.value != '')           
                {
                    alphabetpartialerror.push(true)
                }         
        }
        if(negativewholeerror.length>0 || greaterwholeerror.length>0 ||alphabetwholeerror.length>0
        ||negativepartialerror.length>0 || greaterpartialerror.length>0 ||alphabetpartialerror.length>0)
        {
            
            isFormValid = false;
            e.preventDefault()
               switch (true) {
            case ((negativewholeerror.length>0 || negativepartialerror.length>0) &&(greaterwholeerror.length>0 || greaterpartialerror.length>0) && (alphabetwholeerror.length>0 || alphabetpartialerror.length>0)):

                e.preventDefault();
                $('#service_capability_error_summary').removeClass('hide-block');
                $('.govuk-error-summary__title').text('There is a problem');
                $("#summary_list").html('<li><a href="#">The input field must be a number less than or equal to 100 </a></li><br><li><a href="#">The input field must be greater than 0</a></li><br><li><a href="#">The input field must be a number</a></li>');
                $('html, body').animate({ scrollTop: 0 }, 'fast');
                break;
            case ((negativewholeerror.length>0 || negativepartialerror.length>0) && (greaterwholeerror.length>0 || greaterpartialerror.length>0)):
                
                e.preventDefault();
                $('#service_capability_error_summary').removeClass('hide-block');
                $('.govuk-error-summary__title').text('There is a problem');
                $("#summary_list").html('<li><a href="#">The input field must be a number less than 100</a></li><br><li><a href="#">The input field  must be  greater than 0</a></li>');
                $('html, body').animate({ scrollTop: 0 }, 'fast');
                break;
            case ((negativewholeerror.length>0 || negativepartialerror.length>0) && (alphabetwholeerror.length>0 || alphabetpartialerror.length>0)):
                
                e.preventDefault();
                $('#service_capability_error_summary').removeClass('hide-block');
                $('.govuk-error-summary__title').text('There is a problem');
                $("#summary_list").html('<li><a href="#">The input field must be must be  greater than 0</a></li><br><li><a href="#">The input field must be a number</a></li>');
                $('html, body').animate({ scrollTop: 0 }, 'fast');
                break;
            case ((greaterwholeerror.length>0 || greaterpartialerror.length>0) && (alphabetwholeerror.length>0 || alphabetpartialerror.length>0)):
                
                e.preventDefault();
                $('#service_capability_error_summary').removeClass('hide-block');
                $('.govuk-error-summary__title').text('There is a problem');
                $("#summary_list").html('<li><a href="#">The input field should  must be a number less than 100</a></li><br><li><a href="#">The input field must be a number</a></li>');
                $('html, body').animate({ scrollTop: 0 }, 'fast');
                break;
            case ((negativewholeerror.length>0 || negativepartialerror.length>0)):
                
                e.preventDefault();
                $('#service_capability_error_summary').removeClass('hide-block');
                $('.govuk-error-summary__title').text('There is a problem');
                $("#summary_list").html('<li><a href="#">The input field must be  greater than 0</a></li>');
                $('html, body').animate({ scrollTop: 0 }, 'fast');
                break;
            case ((alphabetwholeerror.length>0 || alphabetpartialerror.length>0)):
                
                e.preventDefault();
                $('#service_capability_error_summary').removeClass('hide-block');
                $('.govuk-error-summary__title').text('There is a problem');
                $("#summary_list").html('<li><a href="#">The input field must be a number</a></li>');
                $('html, body').animate({ scrollTop: 0 }, 'fast');
                break;
            case ((greaterwholeerror.length>0 || greaterpartialerror.length>0)):
                
                e.preventDefault();
                $('#service_capability_error_summary').removeClass('hide-block');
                $('.govuk-error-summary__title').text('There is a problem');
                $("#summary_list").html('<li><a href="#">The input field must be a number less than 100</a></li>');
                $('html, body').animate({ scrollTop: 0 }, 'fast');
                break;
            default:
                console.log("If all else fails");
                break;
        }
        
        }
       else  if (intWeightingPercentage != 100) {
            isFormValid = false;
            e.preventDefault();
            $('#service_capability_error_summary').removeClass('hide-block');
            $('.govuk-error-summary__title').text('There is a problem');

            $("#summary_list").html('<li><a href="#">The weighting value(s) for the service capabilities must be equal to 100%</a></li> ');
            $([document.documentElement, document.body]).animate({
                scrollTop: $("#summary_list").offset().top
            }, 1000);
        }
      else  if (checkforEmptyBoxes.length == TotalWeightageBox.length) {
            isFormValid = false;
            e.preventDefault();
           $('#service_capability_error_summary').removeClass('hide-block');
            $('.govuk-error-summary__title').text('There is a problem');

            $("#summary_list").html('<li><a href="#">Atleast one of the service capability must be selected</a></li> ');
            $([document.documentElement, document.body]).animate({
                scrollTop: $("#summary_list").offset().top
            }, 1000);

        
        }

        else if(isFormValid)
            $('#ccs_ca_menu_tabs_form').submit();

    })
});
document.addEventListener('DOMContentLoaded', () => {

  if ($('#ca_where_work_done').length > 0 || $('#da_where_work_done').length > 0) {
    var total = 0;
    var dimensions = $(".dimensions");
    updateLocationTotal(dimensions);
    dimensions.on("blur", () => {
      updateLocationTotal(dimensions);
    });
  }
//POP-UP START//
  $('.ca_whereworkdone_popup').on('click', function () {
    
    if ($(this).hasClass('selected')) {
      deselect($(this));
      $(".backdrop-vetting").fadeOut(200);
       } else {
      $(".backdrop-vetting").fadeTo(200, 1);
     let btnSend = document.querySelector('#redirect-button-vetting');
      if (btnSend && this.className != "logo rfp_vetting-popup" && this.className != "govuk-footer__link logo rfp_vetting-popup") {
        btnSend.setAttribute('name', this.innerHTML);
      } else {
        btnSend.setAttribute('name', 'CCS website');
        document.body.scrollTop = document.documentElement.scrollTop = 0;
      }
      $(this).addClass('selected');
       $('.pop').slideFadeToggle();
    }
    return false;
  });

  $('.da_whereworkdone_popup').on('click', function () {
    
    if ($(this).hasClass('selected')) {
      deselect($(this));
      $(".backdrop-vetting").fadeOut(200);
       } else {
      $(".backdrop-vetting").fadeTo(200, 1);
     let btnSend = document.querySelector('#redirect-button-vetting');
      if (btnSend && this.className != "logo rfp_vetting-popup" && this.className != "govuk-footer__link logo rfp_vetting-popup") {
        btnSend.setAttribute('name', this.innerHTML);
      } else {
        btnSend.setAttribute('name', 'CCS website');
        document.body.scrollTop = document.documentElement.scrollTop = 0;
      }
      $(this).addClass('selected');
       $('.pop').slideFadeToggle();
    }
    return false;
  });

  function deselect(e) {
    
    $('.pop').slideFadeToggle(function () {
      e.removeClass('selected');
    });
  }

  function removeClass() {
    
    var allElements = document.querySelectorAll(".nav-popup");
    for (i = 0; i < allElements.length; i++) {
      allElements[i].classList.remove('nav-popup');
    }
  }

  $('.dialog-close-vetting').on('click', function () {
    
    $(".backdrop-vetting").fadeOut(200);
    deselect($('.dialog-close-vetting'));
    return false;
  });

  $('#redirect-button-vetting').on('click', function () {
    
    deselect($('.dialog-close-vetting'));
    $(".backdrop-vetting").fadeOut(200);
    var route = this.name;
    if (route == 'Clear form') {
      clearAllTextboxes();
    } else {
      return false;
    }
  });

  $('.nav-popup').on('click', function () {
    
    if ($(this).hasClass('selected')) {
      deselect($(this));
      $(".backdrop-nav-menu").fadeOut(200);
    } else {
      $(".backdrop-nav-menu").fadeTo(200, 1);
      let btnSend = document.querySelector('#redirect-button-nav-menu');
      if (btnSend && this.className != "logo nav-popup" && this.className != "govuk-footer__link logo nav-popup") {
        btnSend.setAttribute('name', this.innerHTML);
      } else {
        btnSend.setAttribute('name', 'CCS website');
        document.body.scrollTop = document.documentElement.scrollTop = 0;
      }
      $('.pop').slideFadeToggle();
    }
    return false;
  });

  $('.dialog-close-nav-menu').on('click', function () {
    
    $(".backdrop-nav-menu").fadeOut(200);
    deselect($('.dialog-close-nav-menu'));
    return false;
  });
});


function clearAllTextboxes()
{
  
  var dimensions = $(".dimensions");
  for(var a =0; a < dimensions.length; a++){
    dimensions[a].value = ''  
  }
}

$.fn.slideFadeToggle = function (easing, callback) {
  
  return this.animate({ opacity: 'toggle', height: 'toggle' }, 'fast', easing, callback);
};
//POP-UP END//

const updateLocationTotal = dimensions => {
  let total = 0;
  dimensions.each(function () {
    
    if (!isNaN($(this).val()) && $(this).val()>0) total = total + Number($(this).val());
  });
  $('#totalPercentage').text(total);
};


const ccsZvalidateDAWhereWorkDone = event => {
  event.preventDefault();
  var dimensions = $(".dimensions")
  let fieldCheck = "",
    errorStore = [], total = 0;
    emptycontent=[];
  dimensions.each(function () {
    var element = document.getElementById($(this).attr('id'));
    ccsZremoveErrorMessage(element)
    let errMsg = "";   
    if (isNaN($(this).val())&&element.value != '')
    {
      errMsg = "Dimension value entered must be an integer"
      emptycontent.push("false")
    }
    else if(element.value.includes('.')&& element.value != '')
    {
      errMsg = "Dimension value entered must not contain decimal values"
      emptycontent.push("false")
    }
    else if(element.value>100 && element.value != '')
    {
      errMsg = "Dimension value entered must be <100"
      emptycontent.push("false")
    } 
    else if(element.value<=0 && element.value != '')
    {
      errMsg = "Dimension value entered must be >0"
      emptycontent.push("false")
    } 
     else if (element.value != '')
      { 
        total += Number(element.value);
        emptycontent.push("true")
      }     
    if (errMsg !== "") {
      ccsZaddErrorMessage(element, errMsg);
      fieldCheck = [$(this).attr('id'), errMsg]
      errorStore.push(fieldCheck);
    }
  });
  if( !emptycontent.length > 0)
  {
      fieldCheck = ["","Entry box must contain a value"]
      errorStore.push(fieldCheck);   
  }
  else if (total !== 100) {
    fieldCheck = ["totalPercentage", "Dimension value entered does not total to 100%"]
    errorStore.push(fieldCheck);
  }
  if (errorStore.length === 0) document.forms["da_where_work_done"].submit();
  else ccsZPresentErrorSummary(errorStore);
};


const ccsZvalidateCAWhereWorkDone = (event) => {
  event.preventDefault();
  var dimensions = $(".dimensions")
  let fieldCheck = "",
    errorStore = [], total = 0;
    emptycontent=[];
  dimensions.each(function () {
    var element = document.getElementById($(this).attr('id'));
    ccsZremoveErrorMessage(element)
    let errMsg = "";   
    if (isNaN($(this).val())&&element.value != '')
    {
      errMsg = "Dimension value entered must be an integer"
      emptycontent.push("false")
    }
    else if(element.value.includes('.')&& element.value != '')
    {
      errMsg = "Dimension value entered must not contain decimal values"
      emptycontent.push("false")
    }
    else if(element.value>100 && element.value != '')
    {
      errMsg = "Dimension value entered must be <100"
      emptycontent.push("false")
    } 
    else if(element.value<=0 && element.value != '')
    {
      errMsg = "Dimension value entered must be >0"
      emptycontent.push("false")
    } 
     else if (element.value != '')
      { 
        total += Number(element.value);
        emptycontent.push("true")
      }     
    if (errMsg !== "") {
      ccsZaddErrorMessage(element, errMsg);
      fieldCheck = [$(this).attr('id'), errMsg]
      errorStore.push(fieldCheck);
    }
  });
  if( !emptycontent.length > 0)
  {
      fieldCheck = ["","Entry box must contain a value"]
      errorStore.push(fieldCheck);   
  }
  else if (total !== 100) {
    fieldCheck = ["totalPercentage", "Dimension value entered does not total to 100%"]
    errorStore.push(fieldCheck);
  }
  if (errorStore.length === 0) document.forms["ca_where_work_done"].submit();
  else ccsZPresentErrorSummary(errorStore);



};

document.addEventListener('DOMContentLoaded', () => {

  if ($('#ccs_ca_weighting').length > 0 || $('#ccs_daa_weighting').length > 0) {
    var dimensions = $(".dimensionweightings");
    updateTotal(dimensions);
    dimensions.on("blur", () => {
      updateTotal(dimensions);
    });
  }
});

const updateTotal = dimensions => {
  let total = 0;
  dimensions.each(function () {
    if (!isNaN($(this).val()) && $(this).val()>0 &&$(this).val()<100) total = total + Number($(this).val());
  });
  $('#totalPercentage').text(total);
};

const ccsZvalidateCAWeightings = event => {
  event.preventDefault();
  var dimensionweightings = $(".dimensionweightings")
  let fieldCheck = "",errorStore = [], total = 0;emptycontent=[];
  dimensionweightings.each(function () {
    var element = document.getElementById($(this).attr('id'));
    var min=element.min
    var max=element.max
    var number=Number(element.value)
    ccsZremoveErrorMessage(element)
    let errMsg = "";   
    if (isNaN($(this).val())&&number != '')
    {
      errMsg = "Dimension value entered must be an integer"
      emptycontent.push("false")
    }
    else if(element.value.includes('.')&& number != '')
    {
      errMsg = "Dimension value entered must not contain decimal values"
      emptycontent.push("false")
    }
    else if(number>100 && number != '')
    {
      errMsg = "Dimension value entered must be <100"
      emptycontent.push("false")
    } 
    else if(number<=0 && number != '')
    {
      errMsg = "Dimension value entered must be >0"
      emptycontent.push("false")
    } 
    else if(number < min || number > max) 
    {
      errMsg = "Dimension value is not in the range."
      emptycontent.push("false")
    } 
     else if (number != '')
      { 
        total += Number(number);
        emptycontent.push("true")
      }     
    if (errMsg !== "") {
      ccsZaddErrorMessage(element, errMsg);
      fieldCheck = [$(this).attr('id'), errMsg]
      errorStore.push(fieldCheck);
    }
  });
  if( !emptycontent.length > 0)
  {
      fieldCheck = ["","Entry box must contain a value"]
      errorStore.push(fieldCheck);   
  }
  else if (total !== 100) {
    fieldCheck = ["totalPercentage", "Your total weighting must add up to 100%"]
    errorStore.push(fieldCheck);
  }
  if (errorStore.length === 0) document.forms["ccs_ca_weighting"].submit();
  else ccsZPresentErrorSummary(errorStore);
};

const ccsZvalidateDAAWeightings = event => {
  event.preventDefault();
  var dimensionweightings = $(".dimensionweightings")
  let fieldCheck = "",errorStore = [], total = 0;emptycontent=[];
  dimensionweightings.each(function () {
    var element = document.getElementById($(this).attr('id'));
    var min=element.min
    var max=element.max
    var number=Number(element.value)
    ccsZremoveErrorMessage(element)
    let errMsg = "";   
    if (isNaN($(this).val())&&number != '')
    {
      errMsg = "Dimension value entered must be an integer"
      emptycontent.push("false")
    }
    else if(element.value.includes('.')&& number != '')
    {
      errMsg = "Dimension value entered must not contain decimal values"
      emptycontent.push("false")
    }
    else if(number>100 && number != '')
    {
      errMsg = "Dimension value entered must be <100"
      emptycontent.push("false")
    } 
    else if(number<=0 && number != '')
    {
      errMsg = "Dimension value entered must be >0"
      emptycontent.push("false")
    } 
    else if(number < min || number > max) 
    {
      errMsg = "Dimension value is not in the range."
      emptycontent.push("false")
    } 
     else if (number != '')
      { 
        total += Number(number);
        emptycontent.push("true")
      }     
    if (errMsg !== "") {
      ccsZaddErrorMessage(element, errMsg);
      fieldCheck = [$(this).attr('id'), errMsg]
      errorStore.push(fieldCheck);
    }
  });
  if( !emptycontent.length > 0)
  {
      fieldCheck = ["","Entry box must contain a value"]
      errorStore.push(fieldCheck);   
  }
  else if (total !== 100) {
    fieldCheck = ["totalPercentage", "Your total weighting must add up to 100%"]
    errorStore.push(fieldCheck);
  }
  if (errorStore.length === 0) document.forms["ccs_daa_weighting"].submit();
  else ccsZPresentErrorSummary(errorStore);
};


document.addEventListener('DOMContentLoaded', () => {
    if (document.getElementById("ccs_ca_procurement_lead") !== null) {
        document.getElementById('ccs_ca_procurement_lead').addEventListener('change', function (event) {
            event.preventDefault();
            $.ajax({
                url: "/ca/users-procurement-lead?id=" + event.target.value,
                type: "GET",
                contentType: "application/json",
            }).done(function (result) {
                setUserDetails(result);
            }).fail((res) => {
                let div_email = document.getElementById('ca-lead-email');
                div_email.innerText = '';
                let div_tel = document.getElementById('ca-lead-telephone');
                div_tel.innerText = '';

            })
        });
        const setUserDetails = (user) => {
            let div_email = document.getElementById('ca-lead-email');
            div_email.innerText = user.userName;
            let div_tel = document.getElementById('ca-lead-telephone');
            div_tel.innerText = '1';
            let div_email_value = document.getElementById('ca_procurement_lead_input');
            div_email_value.value = user.userName;

        };
    }
});

$('.add').addClass('ccs-dynaform-hidden');
const updateToViewCA = (CAtotalStaffWeight, CAtotalVetting) => {
    $('#ca-total-staff').html(CAtotalStaffWeight);
    $('#ca-total-vetting').html(CAtotalVetting);
    $('#ca-total-resources').html(CAtotalSFIA);
}

const CAstaffweightPercentage = $('.ca_weight_staff_class');
const CAvettingPercentage = $('.ca_weight_vetting_class_p');
const CASFIA = $('.ca_weight_vetting_class');
 

var CAtotalStaffWeight = $('#ca-total-staff')[0]!=undefined && $('#ca-total-staff')[0]!=null?Number($('#ca-total-staff')[0].innerHTML):0;
var CAtotalVetting = $('#ca-total-vetting')[0]!=undefined && $('#ca-total-vetting')[0]!=null?Number($('#ca-total-vetting')[0].innerHTML):0;
var CAtotalSFIA=$('#ca-total-resources')[0]!=undefined && $('#ca-total-resources')[0]!=null? Number($('#ca-total-resources')[0].innerHTML):0;

for(var a =0; a < CAstaffweightPercentage.length; a++){
    CAstaffweightPercentage[a].addEventListener('blur', (event)=>{
        CAtotalStaffWeight=0;
        for(var j =0; j < CAstaffweightPercentage.length; j++){
            
            CAtotalStaffWeight = CAtotalStaffWeight + Number(CAstaffweightPercentage[j].value);
        }
        //CAtotalStaffWeight = CAtotalStaffWeight + Number(event.target.value);
        updateToViewCA(CAtotalStaffWeight, CAtotalVetting,CAtotalSFIA);
    })
}

for(var b =0; b < CAvettingPercentage.length; b++){
    CAvettingPercentage[b].addEventListener('blur', (event)=>{
        CAtotalVetting=0;
        for(var j =0; j < CAvettingPercentage.length; j++){
            
            CAtotalVetting = CAtotalVetting + Number(CAvettingPercentage[j].value);
        }
        //CAtotalVetting = CAtotalVetting + Number(event.target.value);
        updateToViewCA(CAtotalStaffWeight, CAtotalVetting,CAtotalSFIA);
        //console.log(totalVetting)
    })
}


for(var a =0; a < CASFIA.length; a++){
    CASFIA[a].addEventListener('blur', (event)=>{
        CAtotalSFIA=0;
        for(var j =0; j < CASFIA.length; j++){
            
            CAtotalSFIA = CAtotalSFIA + Number(CASFIA[j].value);
        }
        // CAtotalSFIA = CAtotalSFIA + Number(event.target.value);
        updateToViewCA(CAtotalStaffWeight, CAtotalVetting,CAtotalSFIA);
    })
}

var tabLinks = document.querySelectorAll('.ca-vetting-weighting');

if (tabLinks != null && tabLinks.length > 0) {

    var tabLinks = document.querySelectorAll('.ons-list__item');
  var tabContainer = document.getElementById('vertical_tab_nav');
  if (tabLinks != undefined && tabLinks != null && tabLinks.length > 0) {


    tabLinks[0].getElementsByTagName('a')[0].classList.add('selected');
    const elems = tabContainer.getElementsByTagName('article');
    for (var i = 0; i < elems.length; i++) {
      if (i === 0) {
        elems[i].style.display = 'block';
        itemSubText = tabLinks[0].getElementsByClassName('table-item-subtext')[0];
        resourceItemOnClick(elems[i],itemSubText);
      } else {
        elems[i].style.display = 'none';
      }
    }
    Array.from(tabLinks).forEach(link => {
      link.addEventListener('click', function (e) {
        let currentTarget = e.currentTarget;
        let clicked_index = $(this).index();
        $('#vertical_tab_nav > div > aside > nav > ol > li > a').removeClass("selected");
        currentTarget.getElementsByTagName('a')[0].classList.add('selected')
        $('#vertical_tab_nav > div > article').css('display', 'none');
        $('#vertical_tab_nav > div > article').eq(clicked_index).fadeIn();
        $(this).blur();
        return false;
      });

    });
  }
    // itemSubText = document.getElementsByClassName('table-item-subtext')[0];;
    // itemText = tabLinks[0].getElementsByTagName('a')[0].childNodes[0].data

    // if (itemText != null && itemText != '') {

    //     itemText = itemText.replaceAll(" ", "_");
    //     resourceItemOnClick(itemText);
    // }
    Array.from(tabLinks).forEach(link => {

        link.addEventListener('click', function (e) {
            let currentTarget = e.currentTarget;
            let clicked_index = $(this).index();

            itemSubText = currentTarget.getElementsByClassName('table-item-subtext')[0];
            //itemText = tabLinks[clicked_index].getElementsByTagName('a')[0].childNodes[0].data

            //itemText = itemText.replaceAll(" ", "_");    
            //itemText =  itemText.replace(/[\])}[{(]/g, '');
            let articles=tabContainer.getElementsByTagName('article');
            resourceItemOnClick(articles[clicked_index],itemSubText);
            //updateTotalResourceAdded();
            return false;
        });
    });


}


function resourceItemOnClick(article,itemSubText) {

    const weightQuantityId = article.querySelectorAll('[id^="ca_sfia_weight_vetting_"]');
    const weightStaffId=article.querySelectorAll('[id^="ca_weight_staff_"]');
    const weightVettingId=article.querySelectorAll('[id^="ca_weight_vetting_"]');
    for (var a = 0; a < weightQuantityId.length; a++) {

        let weightQuantity = $(`#${weightQuantityId[a].id}`);

        weightQuantity.on('blur', () => {

            if(weightQuantity.val() != undefined && weightQuantity.val() !== null && weightQuantity.val() !== "")
                updateWeightVetting(weightQuantityId,weightStaffId,weightVettingId,itemSubText);
        });
    }
    for (var a = 0; a < weightStaffId.length; a++) {

        let weightStaff = $(`#${weightStaffId[a].id}`);

        weightStaff.on('blur', () => {

            if(weightStaff.val() != undefined && weightStaff.val() !== null && weightStaff.val() !== "")
            updateWeightVetting(weightQuantityId,weightStaffId,weightVettingId,itemSubText);
        });
    }
    for (var a = 0; a < weightVettingId.length; a++) {

        let weightVetting = $(`#${weightVettingId[a].id}`);

        weightVetting.on('blur', () => {

            if(weightVetting.val() != undefined && weightVetting.val() !== null && weightVetting.val() !== "")
            updateWeightVetting(weightQuantityId,weightStaffId,weightVettingId,itemSubText);
        });
    }
}

function updateWeightVetting(weightQuantityId,weightStaffId,weightVettingId,itemSubText) {
    let totalQuantity = 0;
    let totalStaff=0;
    let totalVetting=0;
    for (var a = 0; a < weightQuantityId.length; a++) {

        let weightQuantity = $(`#${weightQuantityId[a].id}`);
        if (weightQuantity.val() != undefined && weightQuantity.val() != ''){
         if(weightQuantity.val()<0 || isNaN(weightQuantity.val()))
            totalQuantity = totalQuantity;
         else
              totalQuantity = totalQuantity + Number(weightQuantity.val());
              
        }
    }
    for (var a = 0; a < weightStaffId.length; a++) {

        let weightStaff = $(`#${weightStaffId[a].id}`);
        if (weightStaff.val() != undefined && weightStaff.val() != '')
        totalStaff = totalStaff + Number(weightStaff.val());
    }
    for (var a = 0; a < weightVettingId.length; a++) {

        let weightVetting = $(`#${weightVettingId[a].id}`);
        if (weightVetting.val() != undefined && weightVetting.val() != '')
        totalVetting = totalVetting + Number(weightVetting.val());
    }
    itemSubText.innerHTML =  totalQuantity+" resources added,"+totalStaff+"% / "+totalVetting+"%";
}

function updateTotalResourceAdded() {

    let resourceCount = 0;
    for (let index = 0; index < tabLinks.length; index++) {

        let subText = tabLinks[index].getElementsByTagName('div')[0].childNodes[0].data;
        var numbr = subText.match(/\d/g);

        if(numbr !=null)
        {
            numbr = numbr.join("");
            resourceCount = resourceCount + Number(numbr);
        }
       
    }
    totalResourceAdded.text(resourceCount);
}


document.addEventListener('DOMContentLoaded', () => {
   
    $('#ca_review_ranked_suppliers').on('submit', (e) => {

    var element =  document.getElementById('supplierID');
    var justification=document.getElementById('ca_justification');
    var noofsuppliers=$('#ca_p7').html();
    var matches = noofsuppliers.match(/(\d+)/);
    if (typeof(element) != 'undefined' && element != null &&typeof(justification) != 'undefined' && justification != null)
{
    
    if($('input[type=checkbox]:checked').length == 0)
    {
        
        e.preventDefault();
        $('#ca_reviewrankedsuppliers_error_summary').removeClass('hide-block');
        $('.govuk-error-summary__title').text('There is a problem');
        $("#ca_rank_summary_list").html('<li><a href="#">Please select the suppliers</a></li>');
        $('html, body').animate({ scrollTop: 0 }, 'fast');
    }
    else if($('input[type=checkbox]:checked').length > 0 && $('input[type=checkbox]:checked').length < matches[0])
    {
        e.preventDefault();
        $('#ca_reviewrankedsuppliers_error_summary').removeClass('hide-block');
        $('.govuk-error-summary__title').text('There is a problem');
        $("#ca_rank_summary_list").html('<li><a href="#">Please select the '+matches[0]+' suppliers</a></li>');
        $('html, body').animate({ scrollTop: 0 }, 'fast');
    }
    else if($('input[type=checkbox]:checked').length >= matches[0] && $('#ca_justification').val()==='')
    {
        
        e.preventDefault();
        $('#ca_reviewrankedsuppliers_error_summary').removeClass('hide-block');
        $('.govuk-error-summary__title').text('There is a problem');
        $("#ca_rank_summary_list").html('<li><a href="#">A justification must be provided whether or not a supplier from this tie rank is selected to take forward or not</a></li>');
        $('html, body').animate({ scrollTop: 0 }, 'fast');
    }
}
});  
});
const ccsZCountCAReviewRank = (event) => {
    event.preventDefault();
    const element = document.getElementById("ca_justification"); 
      let labelElement=document.getElementById("ca_textarea_reviewrank");
      let count=5000-element.value.length;
      labelElement.innerText=count + " remaining of 5000";
   
  };
  
document.addEventListener('DOMContentLoaded', () => {
   
  $('#ccs_ca_suppliers_form').on('submit', (e) => {

  e.preventDefault();
  
         let fieldCheck = "";
         var reg = /^\d+$/;
    let errorStore = [];
    const val = $("#ca-supplier-count").val();
    var max = $("#ca_max_suppliers").val();
     if (val.length === 0 || val <3 || val > parseInt(max)){
       
    fieldCheck = ccsZvalidateWithRegex("ca-supplier-count", "Enter a valid value", null);
    if (fieldCheck !== true) errorStore.push(fieldCheck);
  }
  else if (!val.match(reg)){
    fieldCheck = ccsZvalidateWithRegex("ca-supplier-count", "Please enter only numbers", null);
    if (fieldCheck !== true) errorStore.push(fieldCheck);
  } else if (val.includes('.')){
    fieldCheck = ccsZvalidateWithRegex("ca-supplier-count", "Please enter only numbers", null);
    if (fieldCheck !== true) errorStore.push(fieldCheck);
  }
   if (errorStore.length === 0) document.forms["ccs_ca_suppliers_form"].submit();
  else{
    $('.govuk-error-summary__title').text('There is a problem');

    $("#summary_list").html('<li><a href="#summary">There is a problem with the value below</a></li> ');
    $([document.documentElement, document.body]).animate({
        scrollTop: $("#summary_list").offset().top
    }, 1000);     

    $('#service_capability_error_summary').removeClass('hide-block');
  }
});  
});
document.addEventListener('DOMContentLoaded', () => {

    if (document.getElementById('ccs_ca_menu_tabs_form_later') !== null) {
        $('#ccs_ca_menu_tabs_form_later').on('submit', (e) => {

            const totalInputFields = $('.error_check_weight');
            const stafffield = $('.error_check_staff');
            const vettingfield = $('.error_check_vetting');
            const inputFieldsLength = totalInputFields.length + 1

            const preventDefaultState = [];
            const inputtedtext = [];
            const decimalnumber = [];
            const nonnumerical = [];

            for (var a = 1; a < totalInputFields.length; a++) {
                const classTarget = document.getElementsByClassName("error_check_weight")[a - 1];
                if (classTarget.value != '') {
                    inputtedtext.push(true)
                }
                if (classTarget.value.includes('.')) {
                    document.getElementsByClassName("weight_class")[a - 1].classList.add('govuk-input--error')
                    document.getElementsByClassName("ca_weight_class_error")[a - 1].innerHTML = 'All entry boxes are integer numeric  ';

                    decimalnumber.push(true)
                }
                else if (isNaN(classTarget.value) && classTarget.value !== '') {
                    document.getElementsByClassName("weight_class")[a - 1].classList.add('govuk-input--error')
                    document.getElementsByClassName("ca_weight_class_error")[a - 1].innerHTML = 'Alphabetical value is entered. Please enter number <100 and >0';
                    nonnumerical.push(true);
                }
                else if (classTarget.value > 99 && classTarget.value != '') {
                    document.getElementsByClassName("weight_class")[a - 1].classList.add('govuk-input--error')
                    document.getElementsByClassName("ca_weight_class_error")[a - 1].innerHTML = 'Please enter number <100 and >0';
                    preventDefaultState.push(true);
                }
                else if (classTarget.value <= 0 && classTarget.value !== '') {
                    document.getElementsByClassName("weight_class")[a - 1].classList.add('govuk-input--error')
                    document.getElementsByClassName("ca_weight_class_error")[a - 1].innerHTML = 'Please enter number <100 and >0';
                    preventDefaultState.push(true);
                }
                else {
                    document.getElementsByClassName("weight_class")[a - 1].classList.remove('govuk-input--error')
                    document.getElementsByClassName("ca_weight_class_error")[a - 1].innerHTML = '';
                    // $(`#rfp_weight_vetting_${a}`).removeClass('govuk-input--error');
                }
            }

            for (var a = 1; a < stafffield.length; a++) {
                const classTarget = document.getElementsByClassName("error_check_staff")[a - 1];
                if (classTarget.value != '') {
                    inputtedtext.push(true)
                }
                if (classTarget.value.includes('.')) {
                    document.getElementsByClassName("weight_staff_class")[a - 1].classList.add('govuk-input--error')
                    document.getElementsByClassName("ca_weight_staff_class_error")[a - 1].innerHTML = 'Decimal value is entered. Please enter number <100 and >0 ';

                    decimalnumber.push(true)
                }
                else if (isNaN(classTarget.value) && classTarget.value !== '') {
                    document.getElementsByClassName("weight_staff_class")[a - 1].classList.add('govuk-input--error')
                    document.getElementsByClassName("ca_weight_staff_class_error")[a - 1].innerHTML = 'Alphabetical value is entered. Please enter number <100 and >0';
                    nonnumerical.push(true);
                }
                else if (classTarget.value <= 0 && classTarget.value !== '') {
                    document.getElementsByClassName("weight_staff_class")[a - 1].classList.add('govuk-input--error')
                    document.getElementsByClassName("ca_weight_staff_class_error")[a - 1].innerHTML = 'Please enter number <100 and >0';
                    preventDefaultState.push(true);
                }
                else {
                    document.getElementsByClassName("weight_staff_class")[a - 1].classList.remove('govuk-input--error')
                    document.getElementsByClassName("ca_weight_staff_class_error")[a - 1].innerHTML = '';
                    // $(`#rfp_weight_vetting_${a}`).removeClass('govuk-input--error');
                }
            }

            for (var a = 1; a < vettingfield.length; a++) {
                const classTarget = document.getElementsByClassName("error_check_vetting")[a - 1];
                if (classTarget.value != '') {
                    inputtedtext.push(true)
                }
                if (classTarget.value.includes('.')) {
                    document.getElementsByClassName("weight_vetting_class")[a - 1].classList.add('govuk-input--error')
                    document.getElementsByClassName("ca_weight_vetting_class_p_error")[a - 1].innerHTML = 'Decimal value is entered. Please enter number <100 and >0 ';

                    decimalnumber.push(true)
                }
                else if (isNaN(classTarget.value) && classTarget.value !== '') {
                    document.getElementsByClassName("weight_vetting_class")[a - 1].classList.add('govuk-input--error')
                    document.getElementsByClassName("ca_weight_vetting_class_p_error")[a - 1].innerHTML = 'Alphabetical value is entered. Please enter number <100 and >0';
                    nonnumerical.push(true);
                }
                else if (classTarget.value <= 0 && classTarget.value !== '') {
                    document.getElementsByClassName("weight_vetting_class")[a - 1].classList.add('govuk-input--error')
                    document.getElementsByClassName("ca_weight_vetting_class_p_error")[a - 1].innerHTML = 'Please enter number <100 and >0';
                    preventDefaultState.push(true);
                }
                else {
                    document.getElementsByClassName("weight_vetting_class")[a - 1].classList.remove('govuk-input--error')
                    document.getElementsByClassName("ca_weight_vetting_class_p_error")[a - 1].innerHTML = '';
                    // $(`#rfp_weight_vetting_${a}`).removeClass('govuk-input--error');
                }
            }

            /**
             *  
             */

            switch (true) {
                case (preventDefaultState.length > 0 && decimalnumber.length > 0 && nonnumerical.length > 0):

                    e.preventDefault();
                    $('#ca_vetting_error_summary').removeClass('hide-block');
                    $('.govuk-error-summary__title').text('There is a problem');
                    $("#ca_summary_list").html('<li><a href="#">The input field must be a number less than 100 and greater than 0</a></li><br><li><a href="#">The input field should not contain decimal values</a></li><br><li><a href="#">The input field must be a number</a></li>');
                    $('html, body').animate({ scrollTop: 0 }, 'fast');
                    break;
                case (preventDefaultState.length > 0 && decimalnumber.length > 0):

                    e.preventDefault();
                    $('#ca_vetting_error_summary').removeClass('hide-block');
                    $('.govuk-error-summary__title').text('There is a problem');
                    $("#ca_summary_list").html('<li><a href="#">The input field must be a number less than 100 and greater than 0</a></li><br><li><a href="#">The input field should not contain decimal values</a></li>');
                    $('html, body').animate({ scrollTop: 0 }, 'fast');
                    break;
                case (preventDefaultState.length > 0 && nonnumerical.length > 0):

                    e.preventDefault();
                    $('#ca_vetting_error_summary').removeClass('hide-block');
                    $('.govuk-error-summary__title').text('There is a problem');
                    $("#ca_summary_list").html('<li><a href="#">The input field must be a number less than 100 and greater than 0</a></li><br><li><a href="#">The input field must be a number</a></li>');
                    $('html, body').animate({ scrollTop: 0 }, 'fast');
                    break;
                case (decimalnumber.length > 0 && nonnumerical.length > 0):

                    e.preventDefault();
                    $('#ca_vetting_error_summary').removeClass('hide-block');
                    $('.govuk-error-summary__title').text('There is a problem');
                    $("#ca_summary_list").html('<li><a href="#">The input field should not contain decimal values</a></li><br><li><a href="#">The input field must be a number</a></li>');
                    $('html, body').animate({ scrollTop: 0 }, 'fast');
                    break;
                case (preventDefaultState.length > 0):

                    e.preventDefault();
                    $('#ca_vetting_error_summary').removeClass('hide-block');
                    $('.govuk-error-summary__title').text('There is a problem');
                    $("#ca_summary_list").html('<li><a href="#">The input field must be a number less than 100 and greater than 0</a></li>');
                    $('html, body').animate({ scrollTop: 0 }, 'fast');
                    break;
                case (nonnumerical.length > 0):

                    e.preventDefault();
                    $('#ca_vetting_error_summary').removeClass('hide-block');
                    $('.govuk-error-summary__title').text('There is a problem');
                    $("#ca_summary_list").html('<li><a href="#">The input field must be a number</a></li>');
                    $('html, body').animate({ scrollTop: 0 }, 'fast');
                    break;
                case (decimalnumber.length > 0):

                    e.preventDefault();
                    $('#ca_vetting_error_summary').removeClass('hide-block');
                    $('.govuk-error-summary__title').text('There is a problem');
                    $("#ca_summary_list").html('<li><a href="#">The input field should not contain decimal values</a></li>');
                    $('html, body').animate({ scrollTop: 0 }, 'fast');
                    break;
                default:
                    console.log("If all else fails");
                    break;
            }

            if (!inputtedtext.length > 0) {

                e.preventDefault();
                $('#ca_vetting_error_summary').removeClass('hide-block');
                $('.govuk-error-summary__title').text('There is a problem');
                $("#ca_summary_list").html('You must enter atleast on value');
                $('html, body').animate({ scrollTop: 0 }, 'fast');
            }

        });
    }

});

document.addEventListener('DOMContentLoaded', () => {

    $('#ccs_ca_menu_tabs_form_later').on('submit', (e) => {

        const totalInputFields = $('.error_check_weight');
        const stafffield=$('.error_check_staff');
        const vettingfield=$('.error_check_vetting');
        const inputFieldsLength = totalInputFields.length + 1
        const weightStaffId=document.querySelectorAll('[id^="ca_weight_staff_"]');
        const weightQuantityId = document.querySelectorAll('[id^="ca_sfia_weight_vetting_"]');
        const weightVettingId=document.querySelectorAll('[id^="ca_weight_vetting_"]');
        const hiddenId=document.querySelectorAll('[id^="ca_hidden_vetting"]');


        var preventDefaultState = [];
        var inputtedtext = [];
        var decimalnumber = [];
        var nonnumerical = [];
        var rolevalidation=[];
        let totalStaff=0;
        let totalVetting=0;

//staff 100% validation
        for (var a = 0; a < weightStaffId.length; a++) {

            let weightStaff = $(`#${weightStaffId[a].id}`);
            if (weightStaff.val() != undefined && weightStaff.val() != '')
            totalStaff = totalStaff + Number(weightStaff.val());
        }
        if(totalStaff<100 || totalStaff>100)
        {
            ///staffvalidation.push(true);
            e.preventDefault();
            $('#ca_vetting_error_summary').removeClass('hide-block');
            $('.govuk-error-summary__title').text('There is a problem');
            $("#ca_summary_list").html('<li><a href="#">The number of staff weightings for all Role Family entries must = 100%</a></li>');
            $('html, body').animate({ scrollTop: 0 }, 'fast');
        }

// vetting 100% validation    
for (var a = 0; a < weightVettingId.length; a++) {

    let weightVetting = $(`#${weightVettingId[a].id}`);
    if (weightVetting.val() != undefined && weightVetting.val() != '')
    totalVetting = totalVetting + Number(weightVetting.val());
}
if(totalVetting<100 || totalVetting>100)
{
    ///staffvalidation.push(true);
    e.preventDefault();
    $('#ca_vetting_error_summary').removeClass('hide-block');
    $('.govuk-error-summary__title').text('There is a problem');
    $("#ca_summary_list").html('<li><a href="#">The vetting requirement weightings for all Role Family entries must = 100%</a></li>');
    $('html, body').animate({ scrollTop: 0 }, 'fast');
}    
        
        //empty DDAT roles validation
        for (var a = 0; a < weightStaffId.length; a++) {

            let weightStaff = $(`#${weightStaffId[a].id}`);
            if (weightStaff.val() != undefined && weightStaff.val() != '')
            {
                let weightVetting = $(`#${weightVettingId[a].id}`);
                if (weightVetting.val() != undefined && weightVetting.val() != '')
                {
                    let vetting_hidden = $(`#${hiddenId[a].id}`);
                    let name=vetting_hidden.val()
                    let quantity_roles=document.querySelectorAll('[id^="ca_sfia_weight_vetting_"][id$='+name+']');
                    let quantity_flag=false;
                    for (var b = 0; b < quantity_roles.length; b++) {
                        let role_box = $(`#${quantity_roles[b].id}`);
                        if (role_box.val() != undefined && role_box.val() != ''){
                            quantity_flag=true;
                        }
                    }
                    if(quantity_flag==false){
                        rolevalidation.push(true);
                    }
                }
            }
        }
        
        for (var a = 1; a < totalInputFields.length; a++) {
            const classTarget = document.getElementsByClassName("error_check_weight")[a - 1];
            if (classTarget.value != '') {
                inputtedtext.push(true)
            }
            if (classTarget.value.includes('.')) {
                document.getElementsByClassName("weight_class")[a - 1].classList.add('govuk-input--error')
                document.getElementsByClassName("ca_weight_class_error")[a - 1].innerHTML = 'All entry boxes are integer numeric  ';

                decimalnumber.push(true)
            }
            else if (isNaN(classTarget.value) && classTarget.value !== '') {
                document.getElementsByClassName("weight_class")[a - 1].classList.add('govuk-input--error')
                document.getElementsByClassName("ca_weight_class_error")[a - 1].innerHTML = 'Alphabetical value is entered. Please enter number <100 and >0';
                nonnumerical.push(true);
            }
            else if (classTarget.value > 99 && classTarget.value != '') {
                document.getElementsByClassName("weight_class")[a - 1].classList.add('govuk-input--error')
                document.getElementsByClassName("ca_weight_class_error")[a - 1].innerHTML = 'Please enter number <100 and >0';
                preventDefaultState.push(true);
            }
            else if (classTarget.value <= 0 && classTarget.value !== '') {
                document.getElementsByClassName("weight_class")[a - 1].classList.add('govuk-input--error')
                document.getElementsByClassName("ca_weight_class_error")[a - 1].innerHTML = 'Please enter number <100 and >0';
                preventDefaultState.push(true);
            }
            else {
                document.getElementsByClassName("weight_class")[a - 1].classList.remove('govuk-input--error')
                document.getElementsByClassName("ca_weight_class_error")[a - 1].innerHTML = '';
                // $(`#rfp_weight_vetting_${a}`).removeClass('govuk-input--error');
            }
        }

        for (var a = 1; a < stafffield.length; a++) {
            const classTarget = document.getElementsByClassName("error_check_staff")[a - 1];
            if (classTarget.value != '') {
                inputtedtext.push(true)
            }
            if (classTarget.value.includes('.')) {
                document.getElementsByClassName("weight_staff_class")[a - 1].classList.add('govuk-input--error')
                document.getElementsByClassName("ca_weight_staff_class_error")[a - 1].innerHTML = 'Decimal value is entered. Please enter number <100 and >0 ';

                decimalnumber.push(true)
            }
            else if (isNaN(classTarget.value) && classTarget.value !== '') {
                document.getElementsByClassName("weight_staff_class")[a - 1].classList.add('govuk-input--error')
                document.getElementsByClassName("ca_weight_staff_class_error")[a - 1].innerHTML = 'Alphabetical value is entered. Please enter number <100 and >0';
                nonnumerical.push(true);
            }
            else if (classTarget.value <= 0 && classTarget.value !== '') {
                document.getElementsByClassName("weight_staff_class")[a - 1].classList.add('govuk-input--error')
                document.getElementsByClassName("ca_weight_staff_class_error")[a - 1].innerHTML = 'Please enter number <100 and >0';
                preventDefaultState.push(true);
            }
            else {
                document.getElementsByClassName("weight_staff_class")[a - 1].classList.remove('govuk-input--error')
                document.getElementsByClassName("ca_weight_staff_class_error")[a - 1].innerHTML = '';
                // $(`#rfp_weight_vetting_${a}`).removeClass('govuk-input--error');
            }
        }

        for (var a = 1; a < vettingfield.length; a++) {
            const classTarget = document.getElementsByClassName("error_check_vetting")[a - 1];
            if (classTarget.value != '') {
                inputtedtext.push(true)
            }
            if (classTarget.value.includes('.')) {
                document.getElementsByClassName("weight_vetting_class")[a - 1].classList.add('govuk-input--error')
                document.getElementsByClassName("ca_weight_vetting_class_p_error")[a - 1].innerHTML = 'Decimal value is entered. Please enter number <100 and >0 ';

                decimalnumber.push(true)
            }
            else if (isNaN(classTarget.value) && classTarget.value !== '') {
                document.getElementsByClassName("weight_vetting_class")[a - 1].classList.add('govuk-input--error')
                document.getElementsByClassName("ca_weight_vetting_class_p_error")[a - 1].innerHTML = 'Alphabetical value is entered. Please enter number <100 and >0';
                nonnumerical.push(true);
            }
            else if (classTarget.value <= 0 && classTarget.value !== '') {
                document.getElementsByClassName("weight_vetting_class")[a - 1].classList.add('govuk-input--error')
                document.getElementsByClassName("ca_weight_vetting_class_p_error")[a - 1].innerHTML = 'Please enter number <100 and >0';
                preventDefaultState.push(true);
            }
            else {
                document.getElementsByClassName("weight_vetting_class")[a - 1].classList.remove('govuk-input--error')
                document.getElementsByClassName("ca_weight_vetting_class_p_error")[a - 1].innerHTML = '';
                // $(`#rfp_weight_vetting_${a}`).removeClass('govuk-input--error');
            }
        }
        

        /**
         *  
         */

       


    
            switch (true) {
                case (preventDefaultState.length > 0 && decimalnumber.length > 0 && nonnumerical.length > 0):

                    e.preventDefault();
                    $('#ca_vetting_error_summary').removeClass('hide-block');
                    $('.govuk-error-summary__title').text('There is a problem');
                    $("#ca_summary_list").html('<li><a href="#">The input field must be a number less than 100 and greater than 0</a></li><br><li><a href="#">The input field should not contain decimal values</a></li><br><li><a href="#">The input field must be a number</a></li>');
                    $('html, body').animate({ scrollTop: 0 }, 'fast');
                    break;
                case (preventDefaultState.length > 0 && decimalnumber.length > 0):

                    e.preventDefault();
                    $('#ca_vetting_error_summary').removeClass('hide-block');
                    $('.govuk-error-summary__title').text('There is a problem');
                    $("#ca_summary_list").html('<li><a href="#">The input field must be a number less than 100 and greater than 0</a></li><br><li><a href="#">The input field should not contain decimal values</a></li>');
                    $('html, body').animate({ scrollTop: 0 }, 'fast');
                    break;
                case (preventDefaultState.length > 0 && nonnumerical.length > 0):

                    e.preventDefault();
                    $('#ca_vetting_error_summary').removeClass('hide-block');
                    $('.govuk-error-summary__title').text('There is a problem');
                    $("#ca_summary_list").html('<li><a href="#">The input field must be a number less than 100 and greater than 0</a></li><br><li><a href="#">The input field must be a number</a></li>');
                    $('html, body').animate({ scrollTop: 0 }, 'fast');
                    break;
                case (decimalnumber.length > 0 && nonnumerical.length > 0):

                    e.preventDefault();
                    $('#ca_vetting_error_summary').removeClass('hide-block');
                    $('.govuk-error-summary__title').text('There is a problem');
                    $("#ca_summary_list").html('<li><a href="#">The input field should not contain decimal values</a></li><br><li><a href="#">The input field must be a number</a></li>');
                    $('html, body').animate({ scrollTop: 0 }, 'fast');
                    break;
                case (preventDefaultState.length > 0):

                    e.preventDefault();
                    $('#ca_vetting_error_summary').removeClass('hide-block');
                    $('.govuk-error-summary__title').text('There is a problem');
                    $("#ca_summary_list").html('<li><a href="#">The input field must be a number less than 100 and greater than 0</a></li>');
                    $('html, body').animate({ scrollTop: 0 }, 'fast');
                    break;
                case (nonnumerical.length > 0):

                    e.preventDefault();
                    $('#ca_vetting_error_summary').removeClass('hide-block');
                    $('.govuk-error-summary__title').text('There is a problem');
                    $("#ca_summary_list").html('<li><a href="#">The input field must be a number</a></li>');
                    $('html, body').animate({ scrollTop: 0 }, 'fast');
                    break;
                case (decimalnumber.length > 0):

                    e.preventDefault();
                    $('#ca_vetting_error_summary').removeClass('hide-block');
                    $('.govuk-error-summary__title').text('There is a problem');
                    $("#ca_summary_list").html('<li><a href="#">The input field should not contain decimal values</a></li>');
                    $('html, body').animate({ scrollTop: 0 }, 'fast');
                    break;
                   
                 case (rolevalidation.length>0):
                    e.preventDefault();
                     $('#ca_vetting_error_summary').removeClass('hide-block');
                     $('.govuk-error-summary__title').text('There is a problem');
                     $("#ca_summary_list").html('<li><a href="#">At least 1 DDaT role must be populated with a quantity value</a></li>');
                     $('html, body').animate({ scrollTop: 0 }, 'fast'); 
                     break;        
                default:
                    console.log("If all else fails");
                    break;
            }

            


               
            


        if (!inputtedtext.length > 0) {

            e.preventDefault();
            $('#ca_vetting_error_summary').removeClass('hide-block');
            $('.govuk-error-summary__title').text('There is a problem');
            $("#ca_summary_list").html('You must enter atleast on value');
            $('html, body').animate({ scrollTop: 0 }, 'fast');
        }

    });

       
    }


);

document.addEventListener('DOMContentLoaded', () => {

    $('input:radio[name="ccs_rfp_choose_security"]').on('change', function()
        {
            if ($(this).is(':checked')) {                         
               $('.rfp_choosesecurity_resources').val(" ")
            }
        });

        $('input:radio[name="ccs_ca_choose_security"]').on('change', function()
        {
            if ($(this).is(':checked')) {                         
               $('.ca_choosesecurity_resources').val(" ")
            }
        });
        $('input:radio[name="ccs_da_choose_security"]').on('change', function()
        {
            if ($(this).is(':checked')) {                         
               $('.da_choosesecurity_resources').val(" ")
            }
        });
        $('#rfp_choose_security_form').on('submit', (e) => {
            var resources='';
            for(var i=0;i<4;i++)
            {
                var value=document.getElementsByClassName("rfp_choosesecurity_resources")[i].value
               if(value!=undefined && value!='')   
               {
                resources=value;
               }  
            }            
            var totalQuantityrfp=$('#totalQuantityrfp').val();  
            var choosenoption=$('input[name="ccs_rfp_choose_security"]:checked').val();   
            var selectednumber=choosenoption?choosenoption.replace(/[^0-9.]/g, ''):null   
            if( $('input:radio[name="ccs_rfp_choose_security"]:checked').length == 0)
            {                 
                    e.preventDefault();
                    $('#rfp_choose_security_error_summary').removeClass('hide-block');
                    $('.govuk-error-summary__title').text('There is a problem');
                    $("#rfp_choose_security_summary_list").html('<li><a href="#">You must select the highest level of security clearance that staff supplied to the project will need to have.</a></li>');
                    $('html, body').animate({ scrollTop: 0 }, 'fast');
            }
            else if(selectednumber && ['1','2', '3', '4'].includes(selectednumber)&& !resources)           
            {
                e.preventDefault();
                $('#rfp_choose_security_error_summary').removeClass('hide-block');
                $('.govuk-error-summary__title').text('There is a problem');
                $("#rfp_choose_security_summary_list").html('<li><a href="#">You must enter the number of staffs who will need a lower security and vetting requirement.</a></li>');
                $('html, body').animate({ scrollTop: 0 }, 'fast');
            }
            else if(selectednumber && ['1','2', '3', '4'].includes(selectednumber)&&  (resources < 0 || resources > (totalQuantityrfp-1)))           
            {
                e.preventDefault();
                $('#rfp_choose_security_error_summary').removeClass('hide-block');
                $('.govuk-error-summary__title').text('There is a problem');
                $("#rfp_choose_security_summary_list").html('<li><a href="#">A Quantity must be between 1 to Quantity('+totalQuantityrfp+') - 1</a></li>');
                $('html, body').animate({ scrollTop: 0 }, 'fast');
            }
        })

        $('#ca_choose_security_form').on('submit', (e) => {
            var resources='';
            for(var i=0;i<4;i++)
            {
                var value=document.getElementsByClassName("ca_choosesecurity_resources")[i].value
               if(value!=undefined && value!='')   
               {
                resources=value;
               }  
            }  
            var totalQuantityca=$('#totalQuantityca').val();  
            var choosenoption=$('input[name="ccs_ca_choose_security"]:checked').val();   
            var selectednumber=choosenoption?choosenoption.replace(/[^0-9.]/g, ''):null           
            if( $('input:radio[name="ccs_ca_choose_security"]:checked').length == 0)
            {                 
                    e.preventDefault();
                    $('#ca_choose_security_error_summary').removeClass('hide-block');
                    $('.govuk-error-summary__title').text('There is a problem');
                    $("#ca_choose_security_summary_list").html('<li><a href="#">You must select the highest level of security clearance that staff supplied to the project will need to have.</a></li>');
                    $('html, body').animate({ scrollTop: 0 }, 'fast');
            }
            else if(selectednumber && ['1','2', '3', '4'].includes(selectednumber)&& !resources)  
            {
                e.preventDefault();
                $('#ca_choose_security_error_summary').removeClass('hide-block');
                $('.govuk-error-summary__title').text('There is a problem');
                $("#ca_choose_security_summary_list").html('<li><a href="#">You must enter the number of staffs who will need a lower security and vetting requirement.</a></li>');
                $('html, body').animate({ scrollTop: 0 }, 'fast');
            }
            else if(selectednumber && ['1','2', '3', '4'].includes(selectednumber)&&  (resources < 0 || resources > (totalQuantityca-1)))              
            {
                e.preventDefault();
                $('#ca_choose_security_error_summary').removeClass('hide-block');
                $('.govuk-error-summary__title').text('There is a problem');
                $("#ca_choose_security_summary_list").html('<li><a href="#">A Quantity must be between 1 to Quantity('+totalQuantityca+') - 1</a></li>');
                $('html, body').animate({ scrollTop: 0 }, 'fast');
            }
        })

        $('#da_choose_security_form').on('submit', (e) => {
            var resources='';
            for(var i=0;i<4;i++)
            {
                var value=document.getElementsByClassName("da_choosesecurity_resources")[i].value
               if(value!=undefined && value!='')   
               {
                resources=value;
               }  
            }  
            var totalQuantityda=$('#totalQuantityda').val();  
            var choosenoption=$('input[name="ccs_da_choose_security"]:checked').val();   
            var selectednumber=choosenoption?choosenoption.replace(/[^0-9.]/g, ''):null          
            if( $('input:radio[name="ccs_da_choose_security"]:checked').length == 0)
            {                 
                    e.preventDefault();
                    $('#da_choose_security_error_summary').removeClass('hide-block');
                    $('.govuk-error-summary__title').text('There is a problem');
                    $("#da_choose_security_summary_list").html('<li><a href="#">You must select the highest level of security clearance that staff supplied to the project will need to have.</a></li>');
                    $('html, body').animate({ scrollTop: 0 }, 'fast');
            }
            else if(selectednumber && ['1','2', '3', '4'].includes(selectednumber)&& !resources)  
            {
                e.preventDefault();
                $('#da_choose_security_error_summary').removeClass('hide-block');
                $('.govuk-error-summary__title').text('There is a problem');
                $("#da_choose_security_summary_list").html('<li><a href="#">You must enter the number of staffs who will need a lower security and vetting requirement.</a></li>');
                $('html, body').animate({ scrollTop: 0 }, 'fast');
            }
            else if(selectednumber && ['1','2', '3', '4'].includes(selectednumber)&&  (resources < 0 || resources > (totalQuantityda-1)))              
            {
                e.preventDefault();
                $('#da_choose_security_error_summary').removeClass('hide-block');
                $('.govuk-error-summary__title').text('There is a problem');
                $("#da_choose_security_summary_list").html('<li><a href="#">A Quantity must be between 1 to Quantity('+totalQuantityda+') - 1</a></li>');
                $('html, body').animate({ scrollTop: 0 }, 'fast');
            }
        })
});
document.addEventListener('DOMContentLoaded', () => {

  if (document.getElementById("ccs_add_collab") !== null) {

    let with_value_count = 5,
      prev_input = 0,
      deleteButtons = document.querySelectorAll("a.del");

    for (var collab_fieldset = 5; collab_fieldset > 1; collab_fieldset--) {


      let this_fieldset = document.querySelector(".collab_" + collab_fieldset),
        name_box = document.getElementById("proj_collab_name_" + collab_fieldset);

      if (name_box.value !== "") {
        this_fieldset.classList.remove('ccs-dynaform-hidden');

        if (collab_fieldset === 5) {
          document.getElementById("ccs_collab_add").classList.add('ccs-dynaform-hidden');
        }

      } else {

        this_fieldset.classList.add('ccs-dynaform-hidden');
        with_value_count = collab_fieldset;
      }

    }

    document.getElementById("ccs_collab_add").addEventListener('click', (e) => {
      e.preventDefault();

      document.querySelector(".collab_" + with_value_count).classList.remove("ccs-dynaform-hidden");

      if (with_value_count > 2) {
        prev_input = with_value_count - 1;
        document.querySelector(".collab_" + prev_input + " a.del").classList.add("ccs-dynaform-hidden");
      }

      with_value_count++;

      if (with_value_count === 6) {
        document.getElementById("ccs_collab_add").classList.add('ccs-dynaform-hidden');
      }

    });

    // delete buttons
    deleteButtons.forEach((db) => {
      db.addEventListener('click', (e) => {

        e.preventDefault();

        let target = db.href.replace(/^(.+\/)(\d{1,2})$/, "$2"),
          prev_coll = Number(target) - 1,
          target_fieldset = db.closest("fieldset");

        target_fieldset.classList.add("ccs-dynaform-hidden");

        document.getElementById('proj_collab_name_' + target).value = "";
        document.getElementById('proj_collab_email_' + target).value = "";
        document.getElementById('proj_collab_tel_' + target).value = "";

        if (prev_coll > 1) {
          document.querySelector('.collab_' + prev_coll + ' a.del').classList.remove("ccs-dynaform-hidden");
        }

        document.getElementById("ccs_collab_add").classList.remove('ccs-dynaform-hidden');
        with_value_count--;
      });
    });

  }

});

const ccsZvalidateTeamMems = (event) => {
  event.preventDefault();

  let fieldCheck = "",
    errorStore = [],
    longNum = ["zero", "one", "two", "three", "four", "five"];

  for (var x = 1; x < 6; x++) {
    let name_field = document.getElementById('proj_collab_name_' + x);

    if (name_field.closest("fieldset").classList.value.indexOf("ccs-dynaform-hidden") === -1) {
      fieldCheck = ccsZvalidateWithRegex("proj_collab_name_" + x, "Provide the name of team member " + longNum[x], /^[a-z| ]{3,}$/i);
      if (fieldCheck !== true) errorStore.push(fieldCheck);

      fieldCheck = ccsZvalidateWithRegex("proj_collab_email_" + x, "Provide the email of team member " + longNum[x], /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/);
      if (fieldCheck !== true) errorStore.push(fieldCheck);
    }
  }

  if (errorStore.length === 0) document.forms["ccs_add_collab"].submit();
  else ccsZPresentErrorSummary(errorStore);

};

const updateToViewDA = (DAtotalStaffWeight, DAtotalVetting) => {
    $('#da-total-staff').html(DAtotalStaffWeight);
    $('#da-total-vetting').html(DAtotalVetting);
    $('#da-total-resources').html(DAtotalSFIA);
}

const DAstaffweightPercentage = $('.da_weight_staff_class');
const DAvettingPercentage = $('.da_weight_vetting_class_p');
const DASFIA = $('.da_weight_vetting_class');

var DAtotalStaffWeight = $('#da-total-staff')[0]!=undefined && $('#da-total-staff')[0]!=null?Number($('#da-total-staff')[0].innerHTML):0;
var DAtotalVetting = $('#da-total-vetting')[0]!=undefined && $('#da-total-vetting')[0]!=null?Number($('#da-total-vetting')[0].innerHTML):0;
var DAtotalSFIA= $('#da-total-resources')[0]!=undefined && $('#da-total-resources')[0]!=null?Number($('#da-total-resources')[0].innerHTML):0;

for(var a =0; a < DAstaffweightPercentage.length; a++){
    
    DAstaffweightPercentage[a].addEventListener('blur', (event)=>{
        DAtotalStaffWeight=0;
        for(var j =0; j < DAstaffweightPercentage.length; j++){
            
            DAtotalStaffWeight = DAtotalStaffWeight + Number(DAstaffweightPercentage[j].value);
        }
        //DAtotalStaffWeight = DAtotalStaffWeight + Number(event.target.value);
        updateToViewDA(DAtotalStaffWeight, DAtotalVetting,DAtotalSFIA);
    })
}

for(var b =0; b < DAvettingPercentage.length; b++){
    
    DAvettingPercentage[b].addEventListener('blur', (event)=>{
        DAtotalVetting=0;
        for(var j =0; j < DAvettingPercentage.length; j++){
            
            DAtotalVetting = DAtotalVetting + Number(DAvettingPercentage[j].value);
        }
        //DAtotalVetting = DAtotalVetting + Number(event.target.value);
        updateToViewDA(DAtotalStaffWeight, DAtotalVetting,DAtotalSFIA);
        //console.log(totalVetting)
    })
}


for(var a =0; a < DASFIA.length; a++){
    
    DASFIA[a].addEventListener('blur', (event)=>{
        DAtotalSFIA=0;
        for(var j =0; j < DASFIA.length; j++){
            
            DAtotalSFIA = DAtotalSFIA + Number(DASFIA[j].value);
        }
        // DAtotalSFIA = DAtotalSFIA + Number(event.target.value);
        updateToViewDA(DAtotalStaffWeight, DAtotalVetting,DAtotalSFIA);
    })
}

var tabLinks = document.querySelectorAll('.da-vetting-weighting');

if (tabLinks != null && tabLinks.length > 0) {

    var tabLinks = document.querySelectorAll('.ons-list__item');
  var tabContainer = document.getElementById('vertical_tab_nav');
  if (tabLinks != undefined && tabLinks != null && tabLinks.length > 0) {


    tabLinks[0].getElementsByTagName('a')[0].classList.add('selected');
    const elems = tabContainer.getElementsByTagName('article');
    for (var i = 0; i < elems.length; i++) {
      if (i === 0) {
        elems[i].style.display = 'block';
        itemSubText = tabLinks[0].getElementsByClassName('table-item-subtext')[0];
        resourceItemOnClickDA(elems[i],itemSubText);
      } else {
        elems[i].style.display = 'none';
      }
    }
    Array.from(tabLinks).forEach(link => {
      link.addEventListener('click', function (e) {
        let currentTarget = e.currentTarget;
        let clicked_index = $(this).index();
        $('#vertical_tab_nav > div > aside > nav > ol > li > a').removeClass("selected");
        currentTarget.getElementsByTagName('a')[0].classList.add('selected')
        $('#vertical_tab_nav > div > article').css('display', 'none');
        $('#vertical_tab_nav > div > article').eq(clicked_index).fadeIn();
        $(this).blur();
        return false;
      });

    });
  }
    // itemSubText = document.getElementsByClassName('table-item-subtext')[0];;
    // itemText = tabLinks[0].getElementsByTagName('a')[0].childNodes[0].data

    // if (itemText != null && itemText != '') {

    //     itemText = itemText.replaceAll(" ", "_");
    //     resourceItemOnClick(itemText);
    // }
    Array.from(tabLinks).forEach(link => {

        link.addEventListener('click', function (e) {
            let currentTarget = e.currentTarget;
            let clicked_index = $(this).index();

            itemSubText = currentTarget.getElementsByClassName('table-item-subtext')[0];
            //itemText = tabLinks[clicked_index].getElementsByTagName('a')[0].childNodes[0].data

            //itemText = itemText.replaceAll(" ", "_");    
            //itemText =  itemText.replace(/[\])}[{(]/g, '');
            let articles=tabContainer.getElementsByTagName('article');
            
            resourceItemOnClickDA(articles[clicked_index],itemSubText);
            //updateTotalResourceAdded();
            return false;
        });
    });


}


function resourceItemOnClickDA(article,itemSubText) {

    const weightQuantityId = article.querySelectorAll('[id^="da_sfia_weight_vetting_"]');
    const weightStaffId=article.querySelectorAll('[id^="da_weight_staff_"]');
    const weightVettingId=article.querySelectorAll('[id^="da_weight_vetting_"]');
    for (var a = 0; a < weightQuantityId.length; a++) {

        let weightQuantity = $(`#${weightQuantityId[a].id}`);

        weightQuantity.on('blur', () => {

            if(weightQuantity.val() != undefined && weightQuantity.val() !== null && weightQuantity.val() !== "")
                updateWeightVettingDA(weightQuantityId,weightStaffId,weightVettingId,itemSubText);
        });
    }
    for (var a = 0; a < weightStaffId.length; a++) {

        let weightStaff = $(`#${weightStaffId[a].id}`);

        weightStaff.on('blur', () => {

            if(weightStaff.val() != undefined && weightStaff.val() !== null && weightStaff.val() !== "")
            updateWeightVettingDA(weightQuantityId,weightStaffId,weightVettingId,itemSubText);
        });
    }
    for (var a = 0; a < weightVettingId.length; a++) {

        let weightVetting = $(`#${weightVettingId[a].id}`);

        weightVetting.on('blur', () => {

            if(weightVetting.val() != undefined && weightVetting.val() !== null && weightVetting.val() !== "")
            updateWeightVettingDA(weightQuantityId,weightStaffId,weightVettingId,itemSubText);
        });
    }
}

function updateWeightVettingDA(weightQuantityId,weightStaffId,weightVettingId,itemSubText) {
    let totalQuantity = 0;
    let totalStaff=0;
    let totalVetting=0;
    
    for (var a = 0; a < weightQuantityId.length; a++) {

        let weightQuantity = $(`#${weightQuantityId[a].id}`);
        if (weightQuantity.val() != undefined && weightQuantity.val() != '')
        if(weightQuantity.val()<0 || isNaN(weightQuantity.val()))
            totalQuantity = totalQuantity;
         else
              totalQuantity = totalQuantity + Number(weightQuantity.val());
        
    }
    for (var a = 0; a < weightStaffId.length; a++) {

        let weightStaff = $(`#${weightStaffId[a].id}`);
        if (weightStaff.val() != undefined && weightStaff.val() != '')
        totalStaff = totalStaff + Number(weightStaff.val());
    }
    for (var a = 0; a < weightVettingId.length; a++) {

        let weightVetting = $(`#${weightVettingId[a].id}`);
        if (weightVetting.val() != undefined && weightVetting.val() != '')
        totalVetting = totalVetting + Number(weightVetting.val());
    }
    itemSubText.innerHTML =  totalQuantity+" resources added,"+totalStaff+"% / "+totalVetting+"%";
}

function updateTotalResourceAdded() {

    let resourceCount = 0;
    for (let index = 0; index < tabLinks.length; index++) {

        let subText = tabLinks[index].getElementsByTagName('div')[0].childNodes[0].data;
        var numbr = subText.match(/\d/g);

        if(numbr !=null)
        {
            numbr = numbr.join("");
            resourceCount = resourceCount + Number(numbr);
        }
       
    }
    totalResourceAdded.text(resourceCount);
}



document.addEventListener('DOMContentLoaded', () => {
    if (document.getElementById("ccs_da_procurement_lead") !== null) {
        document.getElementById('ccs_da_procurement_lead').addEventListener('change', function (event) {
            event.preventDefault();
            $.ajax({
                url: "/da/users-procurement-lead?id=" + event.target.value,
                type: "GET",
                contentType: "application/json",
            }).done(function (result) {
                setUserDetails(result);
            }).fail((res) => {
                let div_email = document.getElementById('da-lead-email');
                div_email.innerText = '';
                let div_tel = document.getElementById('da-lead-telephone');
                div_tel.innerText = '';

            })
        });
        const setUserDetails = (user) => {
            let div_email = document.getElementById('da-lead-email');
            div_email.innerText = user.userName;
            let div_tel = document.getElementById('da-lead-telephone');
            div_tel.innerText = '1';
            let div_email_value = document.getElementById('da_procurement_lead_input');
            div_email_value.value = user.userName;

        };
    }
});

$('.add').addClass('ccs-dynaform-hidden');
document.addEventListener('DOMContentLoaded', () => {
    // $('.additional').addClass('ccs-dynaform-hidden');
    const removeErrorFieldsDAScoreQuestion = () => {
        $('.govuk-error-message').remove();
        $('.govuk-form-group--error').removeClass('govuk-form-group--error');
        $('.govuk-error-summary').remove();
        $('.govuk-input').removeClass('govuk-input--error');
        $('.govuk-form-group textarea').removeClass('govuk-textarea--error');
    };

    const FormSelector = $('#da_multianswer_question_form');
    if (FormSelector !== undefined && FormSelector.length > 0) {
        $('.additional').addClass('ccs-dynaform-hidden');
        let with_value_count = 10,
            prev_input = 0,
            deleteButtons = document.querySelectorAll('a.del');
        let deleteButtonCount = [];
        let elements = document.querySelectorAll('.weightage');
        let totalPercentage = () => {
            let errorStore = [];
            let weightageSum = 0;
            removeErrorFieldsDAScoreQuestion();
            elements.forEach(el => {
                weightageSum += isNaN(el.value) ? 0 : Number(el.value);
            });
            if (weightageSum > 100) {
                errorStore.push(["There is a problem", "The total weighting is exceeded more than 100%"]);
                ccsZPresentErrorSummary(errorStore);
            }
            $('#totalPercentage').html(weightageSum);
        };
        elements.forEach(ele => {
            ele.addEventListener('focusout', totalPercentage);
            ele.addEventListener('keydown', (event) => {
                if (event.key === '.' || event.keyCode === 69) { event.preventDefault(); }
            });
        });

        const totalAnswerd = () => {
            $('#questionsCount').html(
                $('.order_1').filter(function() {
                    return this.value !== '';
                }).length,
            );
        };

        totalAnswerd();
        totalPercentage();
        deleteButtons.forEach((db) => {
            db.classList.add('ccs-dynaform-hidden')
            db.addEventListener('click', (e) => {
                e.preventDefault();
                let target = db.href.replace(/^(.+\/)(\d{1,2})$/, "$2"),
                    prev_input = Number(target) - 1,
                    target_fieldset = db.closest("div");

                target_fieldset.classList.add("ccs-dynaform-hidden");
                // document.querySelector('#fc_question_'+prev_input+' a.del').classList.remove("ccs-dynaform-hidden");
                //let precentageValueofLast = document.getElementById('fc_question_precenate_'+target).value;

                if (document.getElementById('fc_question_precenate_' + target) != undefined) {
                    
                    var precentageValueofLast = document.getElementById('fc_question_precenate_' + target).value;
                    
                }
                
              //  console.log("Target",precentageValueofLast);
                //let precentageValueofLast = document.getElementById('fc_question_'+target).value;
                if (document.getElementById("totalPercentage") != undefined) {
                    document.getElementById('totalPercentage').textContent = Number(document.getElementById('totalPercentage').textContent) > 0 ? Number(document.getElementById('totalPercentage').textContent) - Number(precentageValueofLast) : 0;

                }

                $('.class_question_remove_' + target).val("");

                if (document.getElementById('fc_question_' + target + "_1") != undefined) {
                    document.getElementById('fc_question_' + target + "_1").value = "";
                }
                if (document.getElementById('fc_question_' + target + "_2") != undefined) {
                    document.getElementById('fc_question_' + target + "_2").value = "";
                }
                if (document.getElementById('fc_question_' + target + "_3") != undefined) {
                    document.getElementById('fc_question_' + target + "_3").value = "";
                }

                if (document.getElementById('fc_question_precenate_' + target) != undefined) {
                    document.getElementById('fc_question_precenate_' + target).value = "";
                }

                // document.getElementById('fc_question_'+target+"_1").value = "";
                // document.getElementById('fc_question_'+target+"_2").value = "";
                // document.getElementById('fc_question_'+target+"_3").value = "";
                // document.getElementById('fc_question_'+target).value = "";
                if (prev_input > 1) {
                    //console.log("PREVIOUSS")
                    document.querySelector('#fc_question_' + prev_input + ' a.del').classList.remove("ccs-dynaform-hidden");
                } else {
                    //console.log("Else statement")
                }

                //document.getElementsByClassName("add-another-btn").classList.remove('ccs-dynaform-hidden');
                with_value_count--;
            });
        });

        for (var box_num = 10; box_num > 1; box_num--) {
            let this_box = document.getElementById('fc_question_' + box_num);
            if (this_box.querySelector('.order_1').value !== '') {
                this_box.classList.remove('ccs-dynaform-hidden');
                if (box_num === 10) {
                    var object = $('.add-another-btn').closest('.ccs-page-section');
                    if (object.length) {
                        $('.add-another-btn').closest('.ccs-page-section').css("border-bottom", "0px");
                    }
                }
                deleteButtonCount.push(box_num);
            } else {
                with_value_count = box_num;
            }

            if (box_num === 2 && deleteButtonCount.length > 0) {
                $("#del_fc_question_" + deleteButtonCount[0]).removeClass("ccs-dynaform-hidden");
            }

            // $("#del_fc_question_"+box_num).removeClass("ccs-dynaform-hidden");
        }

        if (with_value_count > 1) {
            $('#del_fc_question_' + with_value_count).removeClass('ccs-dynaform-hidden');
        }

        $('.add-another-btn').on('click', function() {
         console.log("question selected in DA")
           // $('.govuk-error-summary').remove();
           // $('.govuk-form-group--error').remove();
            removeErrorFieldsDAScoreQuestion();
            
            if (Number($('#totalPercentage').text()) >= 100) {
                errorStore.push(["There is a problem", "The total weighting is 100% so you can not add more questions"]);
            } else {
                errorStore = emptyQuestionFieldCheckDa("add_more");
            }
            
            if (with_value_count === 11 && document.getElementById("fc_question_10_1").value != "") {
                errorStore.push(["There is a problem", "Cannot add another question already 10 questions created"]);
            } else {
                errorStore = emptyQuestionFieldCheckDa("add_more");
            }

            const pageHeading = document.getElementById('page-heading').innerHTML;
            if (errorStore.length == 0) {

                document.getElementById('fc_question_' + with_value_count).classList.remove('ccs-dynaform-hidden');

                if (with_value_count > 2) {
                    prev_input = with_value_count - 1;
                    document.querySelector('label[for=fc_question_' + prev_input + '] a.del').classList.add('ccs-dynaform-hidden');
                }

                if (pageHeading.includes('Write your social value questions')) {
                    if (document.getElementById("questionsCount") != undefined) {
                        document.getElementById("questionsCount").innerHTML = with_value_count;
                    }
                }

                if (pageHeading.includes('Write your technical questions')) {
                    if (document.getElementById("questionsCount") != undefined) {
                        document.getElementById("questionsCount").innerHTML = with_value_count;
                    }
                }

                document.querySelector('label[for=fc_question_' + with_value_count + '] a.del')
                    .classList.remove('ccs-dynaform-hidden');

                // if (pageHeading.includes('Write your social value questions')) {
                //   if (with_value_count === 5) {
                //     errorStore.push(["There is a problem", "You can add a maximum of 5 question"]);
                //     ccsZPresentErrorSummary(errorStore);
                //     return;
                //   }
                // }

                with_value_count++;
                if (with_value_count === 11 && document.getElementById("fc_question_10_1").value != "") {
                    errorStore.push(["There is a problem", "Cannot add another question already 10 questions created"]);
                    ccsZPresentErrorSummary(errorStore);
                    return;
                }
                totalAnswerd();
            } else ccsZPresentErrorSummary(errorStore);
        });

        deleteButtons.forEach((db) => {
            //db.classList.remove('ccs-dynaform-hidden')
            db.addEventListener('click', (e) => {
                e.preventDefault();
                
                const pageHeading = document.getElementById('page-heading').innerHTML;
                const AnswerdQuestion = document.getElementById('questionsCount').innerHTML;

                if (pageHeading.includes('Write your social value questions')) {
                    if (document.getElementById("questionsCount") != undefined) {
                        document.getElementById("questionsCount").innerHTML =(with_value_count-1);
                    }
                }

                if (pageHeading.includes('Write your technical questions')) {
                    if (document.getElementById("questionsCount") != undefined) {
                        document.getElementById("questionsCount").innerHTML =(with_value_count-1);
                    }
                }

                let target = db.href.replace(/^(.+\/)(\d{1,2})$/, "$2"),
                    prev_input = Number(target) - 1,
                    target_fieldset = db.closest("div");

                target_fieldset.classList.add("ccs-dynaform-hidden");
                if (document.getElementById('fc_question_precenate_' + target) != undefined) {
                    var precentageValueofLast = document.getElementById('fc_question_precenate_' + target).value;
                }
                if (document.getElementById("totalPercentage") != undefined) {
                    document.getElementById('totalPercentage').textContent = Number(document.getElementById('totalPercentage').textContent) > 0 ? Number(document.getElementById('totalPercentage').textContent) - Number(precentageValueofLast) : 0;
                }
                // document.getElementById('fc_question_' + target + "_1").value = "";
                // document.getElementById('fc_question_' + target + "_2").value = "";
                // document.getElementById('fc_question_' + target + "_3").value = "";

                $('.class_question_remove_' + target).val("");

                if (document.getElementById('fc_question_' + target + "_1") != undefined) {
                    document.getElementById('fc_question_' + target + "_1").value = "";
                }
                if (document.getElementById('fc_question_' + target + "_2") != undefined) {
                    document.getElementById('fc_question_' + target + "_2").value = "";
                }
                if (document.getElementById('fc_question_' + target + "_3") != undefined) {
                    document.getElementById('fc_question_' + target + "_3").value = "";
                }

                if (document.getElementById('fc_question_precenate_' + target) != undefined) {
                    document.getElementById('fc_question_precenate_' + target).value = "";
                }

                if (prev_input > 1) {
                    document.querySelector('#fc_question_' + prev_input + ' a.del').classList.remove("ccs-dynaform-hidden");
                }

            })
        });
    }

    const emptyQuestionFieldCheckDa = (add_more='') => {
        removeErrorFieldsDAScoreQuestion();
        const countWords = str => str.trim().split(/\s+/).length;
        let fieldCheck = '',
            errorStore = [],
            noOfRequirement_Group = 0;

        const pageHeading = document.getElementById('page-heading').innerHTML;
        for (var i = 1; i < 11; i++) {
            let rootEl = document.getElementById('fc_question_' + i);
            const divElem = document.querySelector('#fc_question_' + i);

            if (!rootEl.classList.contains('ccs-dynaform-hidden')) {
                if (Number($('#totalPercentage').text) > 100) {
                    fieldCheck = ccsZvalidateWithRegex(
                        'fc_question_' + i + '_4',
                        'You cannot add / submit  question as your weightings exceed 100%',
                        /\w+/,
                    );
                    if (fieldCheck !== true) errorStore.push(fieldCheck);
                }
                if (pageHeading.includes("Enter your project requirements")) {
                    const inputElements = divElem.querySelectorAll("textarea");
                    if (inputElements != null && inputElements != undefined && inputElements.length > 0) {
                        for (let index = 0; index < inputElements.length; index++) {
                            const element = inputElements[index];
                            if (index === 0) {
                                if (element.value == '' || element.value === undefined || element.value === null) {
                                    errorStore.push([element.id, "Please enter name of the group"])
                                }
                            } else if(index === 1) {
                                if (element.value == '' || element.value === undefined || element.value === null) {
                                    errorStore.push([element.id, "Please enter name of the requirement"])
                                }
                            }
                            else{
                                if (element.value == '' || element.value === undefined || element.value === null) {
                                    errorStore.push([element.id, "Please enter description of the requirement"])
                                }
                            }
                        }
                    }
                    noOfRequirement_Group += 1;
                } else {
                    if (rootEl.querySelector('.order_1')) {
                        let element = rootEl.querySelector('.order_1');
                        //const condOrd1 = countWords(rootEl.querySelector('.order_1') ?.value) > 50;
                        //if (rootEl.querySelector('.order_1').value == '' || condOrd1) {
                            
                        if ((rootEl.querySelector('.order_1').value == '' && !pageHeading.includes('Optional')) || add_more=='add_more') {
                            if (pageHeading.includes('Write your social value questions')){
                                const msg = rootEl.querySelector('.order_1').value ?
                                'Entry is limited to 50 words' :
                                'You must enter your social value question';
                                fieldCheck = ccsZvalidateWithRegex('fc_question_' + i + '_1', msg, /\w+/);
                                //fieldCheck = ccsZvalidateWithRegex('fc_question_' + i + '_1', msg, /\w+/, !condOrd1);
                                if (fieldCheck !== true) errorStore.push(fieldCheck);
                            }
                            else if(pageHeading.includes('Write your technical questions')){
                                    const msg = rootEl.querySelector('.order_1').value ?
                                'Entry is limited to 50 words' :
                                'You must enter your technical question';
                                
                                fieldCheck = ccsZvalidateWithRegex('fc_question_' + i + '_1', msg, /\w+/);
                                //fieldCheck = ccsZvalidateWithRegex('fc_question_' + i + '_1', msg, /\w+/, !condOrd1);
                                if (fieldCheck !== true) errorStore.push(fieldCheck);
                            }
                        }
                    }
                    if (rootEl.querySelector('.order_2')) {
                        //const condOrd2 = countWords(rootEl.querySelector('.order_2') ?.value) > 150;
                       // if (rootEl.querySelector('.order_2').value == '' || !condOrd2) {
                        if (rootEl.querySelector('.order_2').value == '') {
                        
                       const msg = rootEl.querySelector('.order_2').value ?
                                'Entry is limited to 50 words' :
                                'You must enter valid additional information';
                            //fieldCheck = ccsZvalidateWithRegex('fc_question_' + i + '_2', msg, /\w+/, !condOrd2);
                            fieldCheck = ccsZvalidateWithRegex('fc_question_' + i + '_2', msg, /\w+/);
                            if (fieldCheck !== true) errorStore.push(fieldCheck);
                        }
                    }
                    if (rootEl.querySelector('.order_3')) {
                        //const condOrd3 = countWords(rootEl.querySelector('.order_3') ?.value) > 500;
                        //if (rootEl.querySelector('.order_3').value == '' || condOrd3) {
                        if (rootEl.querySelector('.order_3').value == '') {
                            const msg = rootEl.querySelector('.order_3').value ?
                                'Entry is limited to 50 words' :
                                'You must enter valid information';
                            //fieldCheck = ccsZvalidateWithRegex('fc_question_' + i + '_3', msg, /\w+/, !condOrd3);
                                fieldCheck = ccsZvalidateWithRegex('fc_question_' + i + '_3', msg, /\w+/);
                            if (fieldCheck !== true) errorStore.push(fieldCheck);
                        }
                    }
                    if (rootEl.querySelector('.weightage')) {
                        const condWeight = rootEl.querySelector('.weightage').value > 100;
                        if (rootEl.querySelector('.weightage').value === '' || condWeight || rootEl.querySelector('.weightage').value < 0) {
                            const msg = rootEl.querySelector('.weightage').value ?
                                'Enter a weighting for this question <= 100%' :
                                'You must enter valid weightage';
                            fieldCheck = ccsZvalidateWithRegex('fc_question_' + i + '_4', msg, /\w+/, !condWeight);
                            if (fieldCheck !== true) errorStore.push(fieldCheck);
                        }
                    }
                }
            }
        }
        return errorStore;
    }

    $('#da_multianswer_question_form').on('submit', (event) => {
        event.preventDefault();
        let errorStore = [];
        if ($('#totalPercentage') != null && $('#totalPercentage') != undefined && $('#totalPercentage').length > 0 && Number($('#totalPercentage').text()) > 100) {
            errorStore.push(["There is a problem", "The total weighting is more than 100% "]);
        }
        errorStore = errorStore.length <= 0 ? emptyQuestionFieldCheckDa() : errorStore;
        if (errorStore.length === 0) {

            const classList = document.getElementsByClassName("govuk-hint-error-message");
            const classLength = classList.length;

            if (classLength != 0) {

                return false;
            } else {
                document.forms['da_multianswer_question_form'].submit();
            }



        } else {
            ccsZPresentErrorSummary(errorStore);
        }
    });
});
document.addEventListener('DOMContentLoaded', () => {
    $('#da_review_ranked_suppliers').on('submit', (e) => {

    var element =  document.getElementById('supplierID');
    //var justification=document.getElementById('da_justification');
    var justificationtext = $(".da_justification_text");
    var justifications=[];
    for(var a =0; a < justificationtext.length; a++){
        
        if(justificationtext[a].value != ''&&justificationtext[a].value !=undefined)
        {
            justifications.push(true)
        }
    }
    if (typeof(element) != 'undefined' && element != null) 
{   
    if($('input[type=radio]:checked').length == 0)
    {       
        e.preventDefault();
        $('#da_reviewrankedsuppliers_error_summary').removeClass('hide-block');
        $('.govuk-error-summary__title').text('There is a problem');
        $("#da_rank_summary_list").html('<li><a href="#">Please select the supplier</a></li>');
        $('html, body').animate({ scrollTop: 0 }, 'fast');
    }
    else if($('input[type=radio]:checked').length > 0 && justifications.length==0)
    {
        
        e.preventDefault();
        $('#da_reviewrankedsuppliers_error_summary').removeClass('hide-block');
        $('.govuk-error-summary__title').text('There is a problem');
        $("#da_rank_summary_list").html('<li><a href="#">A justification must be provided for the selected supplier</a></li>');
        $('html, body').animate({ scrollTop: 0 }, 'fast');
    }
}
});  
$('input[type=radio]').on('change', function () {

    var justification = $(".da_justification_text");
    for(var a =0; a < justification.length; a++){
        justification[a].value = ''  
    }   
    var inputValue = $(this).attr("value");
    var targetBox = $("." + inputValue);
    $(".da_justification").not(targetBox).hide();
    $(targetBox).show();
    let supplierID= $('input[type=radio]:checked').val()
     justification_text = document.getElementById("da_textarea_reviewrank_" + supplierID);
     //Update condition - CCS
     if(justification_text != null) {
        justification_text.addEventListener('input', ccsZCountDAReviewRank);
     }
})
const ccsZCountDAReviewRank = (event) => {
    event.preventDefault();
    const inputId=event.srcElement.id;
     const element = document.getElementById(inputId);
     const arr=inputId.split("da_textarea_reviewrank_");
            let labelElement=document.getElementById("da_textarea_"+arr[1]);
            let count=5000-element.value.length;
            labelElement.innerText=count + " remaining of 5000";
  };
  let supplierID= $('input[type=radio]:checked').val()
  justification_text = document.getElementById("da_textarea_reviewrank_" + supplierID);
  if(justification_text!=undefined && justification_text!=null)
 justification_text.addEventListener('input', ccsZCountDAReviewRank);
});

document.addEventListener('DOMContentLoaded', () => {
    if (document.getElementById('ccs_ca_menu_tabs_form_later') !== null) {
        $('#ccs_da_menu_tabs_form_later').on('submit', (e) => {
            const totalInputFields = $('.error_check_weight');
            const stafffield = $('.error_check_staff');
            const vettingfield = $('.error_check_vetting');
            const inputFieldsLength = totalInputFields.length + 1

            const preventDefaultState = [];
            const inputtedtext = [];
            const decimalnumber = [];
            const nonnumerical = [];

            for (var a = 1; a < totalInputFields.length; a++) {
                const classTarget = document.getElementsByClassName("error_check_weight")[a - 1];

                if (classTarget.value != '') {
                    inputtedtext.push(true)
                }
                if (classTarget.value.includes('.')) {
                    document.getElementsByClassName("weight_class")[a - 1].classList.add('govuk-input--error')
                    document.getElementsByClassName("da_weight_class_error")[a - 1].innerHTML = 'All entry boxes are integer numeric ';

                    decimalnumber.push(true)
                }
                else if (isNaN(classTarget.value) && classTarget.value !== '') {
                    document.getElementsByClassName("weight_class")[a - 1].classList.add('govuk-input--error')
                    document.getElementsByClassName("da_weight_class_error")[a - 1].innerHTML = 'Alphabetical value is entered. Please enter number <100 and >0';
                    nonnumerical.push(true);
                }
                else if (classTarget.value > 99 && classTarget.value != '') {
                    document.getElementsByClassName("weight_class")[a - 1].classList.add('govuk-input--error')
                    document.getElementsByClassName("da_weight_class_error")[a - 1].innerHTML = 'Please enter number <100 and >0';
                    preventDefaultState.push(true);
                }
                else if (classTarget.value <= 0 && classTarget.value !== '') {
                    document.getElementsByClassName("weight_class")[a - 1].classList.add('govuk-input--error')
                    document.getElementsByClassName("da_weight_class_error")[a - 1].innerHTML = 'Please enter number <100 and >0';
                    preventDefaultState.push(true);
                }
                else {
                    document.getElementsByClassName("weight_class")[a - 1].classList.remove('govuk-input--error')
                    document.getElementsByClassName("da_weight_class_error")[a - 1].innerHTML = '';
                    // $(`#rfp_weight_vetting_${a}`).removeClass('govuk-input--error');
                }

            }

            for (var a = 1; a < stafffield.length; a++) {
                const classTarget = document.getElementsByClassName("error_check_staff")[a - 1];
                if (classTarget.value != '') {
                    inputtedtext.push(true)
                }
                if (classTarget.value.includes('.')) {
                    document.getElementsByClassName("weight_staff_class")[a - 1].classList.add('govuk-input--error')
                    document.getElementsByClassName("da_weight_staff_class_error")[a - 1].innerHTML = 'All entry boxes are integer numeric  ';

                    decimalnumber.push(true)
                }
                else if (isNaN(classTarget.value) && classTarget.value !== '') {
                    document.getElementsByClassName("weight_staff_class")[a - 1].classList.add('govuk-input--error')
                    document.getElementsByClassName("da_weight_staff_class_error")[a - 1].innerHTML = 'Alphabetical value is entered. Please enter number <100 and >0';
                    nonnumerical.push(true);
                }
                else if (classTarget.value <= 0 && classTarget.value !== '') {
                    document.getElementsByClassName("weight_staff_class")[a - 1].classList.add('govuk-input--error')
                    document.getElementsByClassName("da_weight_staff_class_error")[a - 1].innerHTML = 'Please enter number <100 and >0';
                    preventDefaultState.push(true);
                }
                else {
                    document.getElementsByClassName("weight_staff_class")[a - 1].classList.remove('govuk-input--error')
                    document.getElementsByClassName("da_weight_staff_class_error")[a - 1].innerHTML = '';
                    // $(`#rfp_weight_vetting_${a}`).removeClass('govuk-input--error');
                }
            }

            for (var a = 1; a < vettingfield.length; a++) {
                const classTarget = document.getElementsByClassName("error_check_vetting")[a - 1];
                if (classTarget.value != '') {
                    inputtedtext.push(true)
                }
                if (classTarget.value.includes('.')) {
                    document.getElementsByClassName("weight_vetting_class")[a - 1].classList.add('govuk-input--error')
                    document.getElementsByClassName("da_weight_vetting_class_p_error")[a - 1].innerHTML = 'All entry boxes are integer numeric  ';

                    decimalnumber.push(true)
                }
                else if (isNaN(classTarget.value) && classTarget.value !== '') {
                    document.getElementsByClassName("weight_vetting_class")[a - 1].classList.add('govuk-input--error')
                    document.getElementsByClassName("ca_weight_vetting_class_p_error")[a - 1].innerHTML = 'Alphabetical value is entered. Please enter number <100 and >0';
                    nonnumerical.push(true);
                }
                else if (classTarget.value <= 0 && classTarget.value !== '') {
                    document.getElementsByClassName("weight_vetting_class")[a - 1].classList.add('govuk-input--error')
                    document.getElementsByClassName("da_weight_vetting_class_p_error")[a - 1].innerHTML = 'Please enter number <100 and >0';
                    preventDefaultState.push(true);
                }
                else {
                    document.getElementsByClassName("weight_vetting_class")[a - 1].classList.remove('govuk-input--error')
                    document.getElementsByClassName("da_weight_vetting_class_p_error")[a - 1].innerHTML = '';
                    // $(`#rfp_weight_vetting_${a}`).removeClass('govuk-input--error');
                }
            }

            /**
             *  
             */

            switch (true) {
                case (preventDefaultState.length > 0 && decimalnumber.length > 0 && nonnumerical.length > 0):

                    e.preventDefault();
                    $('#da_vetting_error_summary').removeClass('hide-block');
                    $('.govuk-error-summary__title').text('There is a problem');
                    $("#da_summary_list").html('<li><a href="#">The input field must be a number less than 100 and greater than 0</a></li><br><li><a href="#">The input field should not contain decimal values</a></li><br><li><a href="#">The input field must be a number</a></li>');
                    $('html, body').animate({ scrollTop: 0 }, 'fast');
                    break;
                case (preventDefaultState.length > 0 && decimalnumber.length > 0):

                    e.preventDefault();
                    $('#da_vetting_error_summary').removeClass('hide-block');
                    $('.govuk-error-summary__title').text('There is a problem');
                    $("#da_summary_list").html('<li><a href="#">The input field must be a number less than 100 and greater than 0</a></li><br><li><a href="#">The input field should not contain decimal values</a></li>');
                    $('html, body').animate({ scrollTop: 0 }, 'fast');
                    break;
                case (preventDefaultState.length > 0 && nonnumerical.length > 0):

                    e.preventDefault();
                    $('#da_vetting_error_summary').removeClass('hide-block');
                    $('.govuk-error-summary__title').text('There is a problem');
                    $("#da_summary_list").html('<li><a href="#">The input field must be a number less than 100 and greater than 0</a></li><br><li><a href="#">The input field must be a number</a></li>');
                    $('html, body').animate({ scrollTop: 0 }, 'fast');
                    break;
                case (decimalnumber.length > 0 && nonnumerical.length > 0):

                    e.preventDefault();
                    $('#da_vetting_error_summary').removeClass('hide-block');
                    $('.govuk-error-summary__title').text('There is a problem');
                    $("#da_summary_list").html('<li><a href="#">The input field should not contain decimal values</a></li><br><li><a href="#">The input field must be a number</a></li>');
                    $('html, body').animate({ scrollTop: 0 }, 'fast');
                    break;
                case (preventDefaultState.length > 0):

                    e.preventDefault();
                    $('#da_vetting_error_summary').removeClass('hide-block');
                    $('.govuk-error-summary__title').text('There is a problem');
                    $("#da_summary_list").html('<li><a href="#">The input field must be a number less than 100 and greater than 0</a></li>');
                    $('html, body').animate({ scrollTop: 0 }, 'fast');
                    break;
                case (nonnumerical.length > 0):

                    e.preventDefault();
                    $('#da_vetting_error_summary').removeClass('hide-block');
                    $('.govuk-error-summary__title').text('There is a problem');
                    $("#da_summary_list").html('<li><a href="#">The input field must be a number</a></li>');
                    $('html, body').animate({ scrollTop: 0 }, 'fast');
                    break;
                case (decimalnumber.length > 0):

                    e.preventDefault();
                    $('#da_vetting_error_summary').removeClass('hide-block');
                    $('.govuk-error-summary__title').text('There is a problem');
                    $("#da_summary_list").html('<li><a href="#">The input field should not contain decimal values</a></li>');
                    $('html, body').animate({ scrollTop: 0 }, 'fast');
                    break;
                default:
                    console.log("If all else fails");
                    break;
            }

            if (!inputtedtext.length > 0) {

                e.preventDefault();
                $('#ca_vetting_error_summary').removeClass('hide-block');
                $('.govuk-error-summary__title').text('There is a problem');
                $("#ca_summary_list").html('You must enter atleast on value');
                $('html, body').animate({ scrollTop: 0 }, 'fast');
            }

        });
    }
});

document.addEventListener('DOMContentLoaded', () => {

    $('#ccs_da_menu_tabs_form_later').on('submit', (e) => {

        const totalInputFields = $('.error_check_weight');
        const stafffield=$('.error_check_staff');
        const vettingfield=$('.error_check_vetting');
        const inputFieldsLength = totalInputFields.length + 1
        const weightStaffId=document.querySelectorAll('[id^="da_weight_staff_"]');
        const weightQuantityId = document.querySelectorAll('[id^="da_sfia_weight_vetting_"]');
        const weightVettingId=document.querySelectorAll('[id^="da_weight_vetting_"]');
        const hiddenId=document.querySelectorAll('[id^="da_hidden_vetting"]');

    
        const preventDefaultState = [];
        const inputtedtext = [];
        const decimalnumber = [];
        const nonnumerical = [];
        var rolevalidation=[];
        let totalStaff=0;
        let totalVetting=0;

        //staff 100% validation
        for (var a = 0; a < weightStaffId.length; a++) {

            let weightStaff = $(`#${weightStaffId[a].id}`);
            if (weightStaff.val() != undefined && weightStaff.val() != '')
            totalStaff = totalStaff + Number(weightStaff.val());
        }
        if(totalStaff<100 || totalStaff>100)
        {
            ///staffvalidation.push(true);
            e.preventDefault();
            $('#da_vetting_error_summary').removeClass('hide-block');
            $('.govuk-error-summary__title').text('There is a problem');
            $("#da_summary_list").html('<li><a href="#">The number of staff weightings for all Role Family entries must = 100%</a></li>');
            $('html, body').animate({ scrollTop: 0 }, 'fast');
        }

// vetting 100% validation    
for (var a = 0; a < weightVettingId.length; a++) {

    let weightVetting = $(`#${weightVettingId[a].id}`);
    if (weightVetting.val() != undefined && weightVetting.val() != '')
    totalVetting = totalVetting + Number(weightVetting.val());
}
if(totalVetting<100 || totalVetting>100)
{
    ///staffvalidation.push(true);
    e.preventDefault();
    $('#da_vetting_error_summary').removeClass('hide-block');
    $('.govuk-error-summary__title').text('There is a problem');
    $("#da_summary_list").html('<li><a href="#">The vetting requirement weightings for all Role Family entries must = 100%</a></li>');
    $('html, body').animate({ scrollTop: 0 }, 'fast');
}    
        

      //empty DDAT roles validation
      for (var a = 0; a < weightStaffId.length; a++) {

        let weightStaff = $(`#${weightStaffId[a].id}`);
        if (weightStaff.val() != undefined && weightStaff.val() != '')
        {
            let weightVetting = $(`#${weightVettingId[a].id}`);
            if (weightVetting.val() != undefined && weightVetting.val() != '')
            {
                let vetting_hidden = $(`#${hiddenId[a].id}`);
                let name=vetting_hidden.val()
                let quantity_roles=document.querySelectorAll('[id^="da_sfia_weight_vetting_"][id$='+name+']');
                let quantity_flag=false;
                for (var b = 0; b < quantity_roles.length; b++) {
                    let role_box = $(`#${quantity_roles[b].id}`);
                    if (role_box.val() != undefined && role_box.val() != ''){
                        quantity_flag=true;
                    }
                }
                if(quantity_flag==false){
                    rolevalidation.push(true);
                }
            }
        }
    }
    

        for (var a = 1; a < totalInputFields.length; a++) {
            const classTarget = document.getElementsByClassName("error_check_weight")[a - 1];
        
            if (classTarget.value != '') {
                inputtedtext.push(true)
            }
            if (classTarget.value.includes('.')) {
                document.getElementsByClassName("weight_class")[a - 1].classList.add('govuk-input--error')
                document.getElementsByClassName("da_weight_class_error")[a - 1].innerHTML = 'All entry boxes are integer numeric ';

                decimalnumber.push(true)
            }
            else if (isNaN(classTarget.value) && classTarget.value !== '') {
                document.getElementsByClassName("weight_class")[a - 1].classList.add('govuk-input--error')
                document.getElementsByClassName("da_weight_class_error")[a - 1].innerHTML = 'Alphabetical value is entered. Please enter number <100 and >0';
                nonnumerical.push(true);
            }
            else if (classTarget.value > 99 && classTarget.value != '') {
                document.getElementsByClassName("weight_class")[a - 1].classList.add('govuk-input--error')
                document.getElementsByClassName("da_weight_class_error")[a - 1].innerHTML = 'Please enter number <100 and >0';
                preventDefaultState.push(true);
            }
            else if (classTarget.value <= 0 && classTarget.value !== '') {
                document.getElementsByClassName("weight_class")[a - 1].classList.add('govuk-input--error')
                document.getElementsByClassName("da_weight_class_error")[a - 1].innerHTML = 'Please enter number <100 and >0';
                preventDefaultState.push(true);
            }
            else {
                document.getElementsByClassName("weight_class")[a - 1].classList.remove('govuk-input--error')
                document.getElementsByClassName("da_weight_class_error")[a - 1].innerHTML = '';
                // $(`#rfp_weight_vetting_${a}`).removeClass('govuk-input--error');
            }
   
        }

        for (var a = 1; a < stafffield.length; a++) {
            const classTarget = document.getElementsByClassName("error_check_staff")[a - 1];
            if (classTarget.value != '') {
                inputtedtext.push(true)
            }
            if (classTarget.value.includes('.')) {
                document.getElementsByClassName("weight_staff_class")[a - 1].classList.add('govuk-input--error')
                document.getElementsByClassName("da_weight_staff_class_error")[a - 1].innerHTML = 'All entry boxes are integer numeric  ';

                decimalnumber.push(true)
            }
            else if (isNaN(classTarget.value) && classTarget.value !== '') {
                document.getElementsByClassName("weight_staff_class")[a - 1].classList.add('govuk-input--error')
                document.getElementsByClassName("da_weight_staff_class_error")[a - 1].innerHTML = 'Alphabetical value is entered. Please enter number <100 and >0';
                nonnumerical.push(true);
            }
            else if (classTarget.value <= 0 && classTarget.value !== '') {
                document.getElementsByClassName("weight_staff_class")[a - 1].classList.add('govuk-input--error')
                document.getElementsByClassName("da_weight_staff_class_error")[a - 1].innerHTML = 'Please enter number <100 and >0';
                preventDefaultState.push(true);
            }
            else {
                document.getElementsByClassName("weight_staff_class")[a - 1].classList.remove('govuk-input--error')
                document.getElementsByClassName("da_weight_staff_class_error")[a - 1].innerHTML = '';
                // $(`#rfp_weight_vetting_${a}`).removeClass('govuk-input--error');
            }
        }

        for (var a = 1; a < vettingfield.length; a++) {
            const classTarget = document.getElementsByClassName("error_check_vetting")[a - 1];
            if (classTarget.value != '') {
                inputtedtext.push(true)
            }
            if (classTarget.value.includes('.')) {
                document.getElementsByClassName("weight_vetting_class")[a - 1].classList.add('govuk-input--error')
                document.getElementsByClassName("da_weight_vetting_class_p_error")[a - 1].innerHTML = 'All entry boxes are integer numeric  ';

                decimalnumber.push(true)
            }
            else if (isNaN(classTarget.value) && classTarget.value !== '') {
                document.getElementsByClassName("weight_vetting_class")[a - 1].classList.add('govuk-input--error')
                document.getElementsByClassName("ca_weight_vetting_class_p_error")[a - 1].innerHTML = 'Alphabetical value is entered. Please enter number <100 and >0';
                nonnumerical.push(true);
            }
            else if (classTarget.value <= 0 && classTarget.value !== '') {
                document.getElementsByClassName("weight_vetting_class")[a - 1].classList.add('govuk-input--error')
                document.getElementsByClassName("da_weight_vetting_class_p_error")[a - 1].innerHTML = 'Please enter number <100 and >0';
                preventDefaultState.push(true);
            }
            else {
                document.getElementsByClassName("weight_vetting_class")[a - 1].classList.remove('govuk-input--error')
                document.getElementsByClassName("da_weight_vetting_class_p_error")[a - 1].innerHTML = '';
                // $(`#rfp_weight_vetting_${a}`).removeClass('govuk-input--error');
            }
        }
        
        /**
         *  
         */

        switch (true) {
            case (preventDefaultState.length > 0 && decimalnumber.length > 0 && nonnumerical.length > 0):

                e.preventDefault();
                $('#da_vetting_error_summary').removeClass('hide-block');
                $('.govuk-error-summary__title').text('There is a problem');
                $("#da_summary_list").html('<li><a href="#">The input field must be a number less than 100 and greater than 0</a></li><br><li><a href="#">The input field should not contain decimal values</a></li><br><li><a href="#">The input field must be a number</a></li>');
                $('html, body').animate({ scrollTop: 0 }, 'fast');
                break;
            case (preventDefaultState.length > 0 && decimalnumber.length > 0):

                e.preventDefault();
                $('#da_vetting_error_summary').removeClass('hide-block');
                $('.govuk-error-summary__title').text('There is a problem');
                $("#da_summary_list").html('<li><a href="#">The input field must be a number less than 100 and greater than 0</a></li><br><li><a href="#">The input field should not contain decimal values</a></li>');
                $('html, body').animate({ scrollTop: 0 }, 'fast');
                break;
            case (preventDefaultState.length > 0 && nonnumerical.length > 0):

                e.preventDefault();
                $('#da_vetting_error_summary').removeClass('hide-block');
                $('.govuk-error-summary__title').text('There is a problem');
                $("#da_summary_list").html('<li><a href="#">The input field must be a number less than 100 and greater than 0</a></li><br><li><a href="#">The input field must be a number</a></li>');
                $('html, body').animate({ scrollTop: 0 }, 'fast');
                break;
            case (decimalnumber.length > 0 && nonnumerical.length > 0):

                e.preventDefault();
                $('#da_vetting_error_summary').removeClass('hide-block');
                $('.govuk-error-summary__title').text('There is a problem');
                $("#da_summary_list").html('<li><a href="#">The input field should not contain decimal values</a></li><br><li><a href="#">The input field must be a number</a></li>');
                $('html, body').animate({ scrollTop: 0 }, 'fast');
                break;
            case (preventDefaultState.length > 0):
                    e.preventDefault();
                    $('#da_vetting_error_summary').removeClass('hide-block');
                    $('.govuk-error-summary__title').text('There is a problem');
                    $("#da_summary_list").html('<li><a href="#">The input field must be a number less than 100 and greater than 0</a></li>');
                    $('html, body').animate({ scrollTop: 0 }, 'fast');
                    break;
                case (nonnumerical.length > 0):

                    e.preventDefault();
                    $('#da_vetting_error_summary').removeClass('hide-block');
                    $('.govuk-error-summary__title').text('There is a problem');
                    $("#da_summary_list").html('<li><a href="#">The input field must be a number</a></li>');
                    $('html, body').animate({ scrollTop: 0 }, 'fast');
                    break;
                case (decimalnumber.length > 0):

                    e.preventDefault();
                    $('#da_vetting_error_summary').removeClass('hide-block');
                    $('.govuk-error-summary__title').text('There is a problem');
                    $("#da_summary_list").html('<li><a href="#">The input field should not contain decimal values</a></li>');
                    $('html, body').animate({ scrollTop: 0 }, 'fast');
                    break;
                    
                 case (rolevalidation.length>0):
                    e.preventDefault();
                    $('#da_vetting_error_summary').removeClass('hide-block');
                    $('.govuk-error-summary__title').text('There is a problem');
                    $("#da_summary_list").html('<li><a href="#">At least 1 DDaT role must be populated with a quantity value</a></li>');
                    $('html, body').animate({ scrollTop: 0 }, 'fast'); 
                    break;      
                default:
                    console.log("If all else fails");
                    break;
            }

            if (!inputtedtext.length > 0) {

            e.preventDefault();
            $('#ca_vetting_error_summary').removeClass('hide-block');
            $('.govuk-error-summary__title').text('There is a problem');
            $("#ca_summary_list").html('You must enter atleast on value');
            $('html, body').animate({ scrollTop: 0 }, 'fast');
        }

    });

            }


);
  
$('#ccs_collab_view').hide();

let formURL = "/eoi/get-collaborator-detail/js-enabled";

if (document.getElementById("eoi_collaborators") !== null) {
  document.getElementById('eoi_collaborators').addEventListener('change', function () {
    let id = this.value;
    if (id !== "") {
      let data = {
        "eoi_collaborators": id
      }

      var ajaxRequest = $.post(formURL, data, function (data) {

        let { userName, firstName, lastName, tel } = data;
        let collegueName = firstName + " " + lastName;
        let id = userName;

        $('#eoi_show_collab_name').html(collegueName)
        $('#eoi_show_collab_email').html(id)
        $('#eoi_show_collab-phone').html(tel)

        $("#eoi_collaborator_append").val(id);

        $('#ccs_collab_add').prop("disabled", false)
      })
        .fail(function () {
          console.log("failed")
        })
        .always(function () {
          console.log("finsihed")
        });
    }
    else {
      $('#eoi_show_collab_name').html("")
      $('#eoi_show_collab_email').html("")
      $('#eoi_show_collab-phone').html("")
      $('#ccs_collab_add').prop("disabled", true)
    }
  })
}
if ($('#eoi_keyterm').length > 0) {
  $('.eoi_form').attr('id', 'ccs_eoi_acronyms_form');
  $('.eoi_form').attr('name', 'ccs_eoi_acronyms_form');
}

document.addEventListener('DOMContentLoaded', () => {

  if (document.getElementById("ccs_eoi_acronyms_form") !== null) {

    let with_value_count = 20,
      prev_input = 0,
      filled_input = 0,
      deleteButtons = document.querySelectorAll("a.del");
    let clearFieldsButtons = document.querySelectorAll("a.clear-fields");

    for (var acronym_fieldset = 20; acronym_fieldset > 1; acronym_fieldset--) {


      let this_fieldset = document.querySelector(".acronym_" + acronym_fieldset),
        term_box = document.getElementById("eoi_term_" + acronym_fieldset);

      if (term_box.value !== "") {
        this_fieldset.classList.remove('ccs-dynaform-hidden');

        if (acronym_fieldset === 20) {
          document.getElementById("ccs_eoiTerm_add").classList.add('ccs-dynaform-hidden');
        }

      } else {

        this_fieldset.classList.add('ccs-dynaform-hidden');
        with_value_count = acronym_fieldset;
        filled_input++;
      }

    }
    document.getElementById("ccs_eoiTerm_add").classList.remove("ccs-dynaform-hidden");

    if(filled_input===0){
    
      document.getElementById("ccs_eoiTerm_add").classList.add('ccs-dynaform-hidden');
    }


    document.getElementById("ccs_eoiTerm_add").addEventListener('click', (e) => {



      $('.govuk-form-group textarea').removeClass('govuk-textarea--error');
      checkFieldsEoi();

      e.preventDefault();
      errorStore = emptyFieldCheckEoi('add_more');
      if (errorStore.length == 0) {

        removeErrorFieldsEoi();


        document.querySelector(".acronym_" + with_value_count).classList.remove("ccs-dynaform-hidden");

        if (with_value_count > 2) {
          prev_input = with_value_count - 1;
          document.querySelector(".acronym_" + prev_input + " a.del").classList.add("ccs-dynaform-hidden");
        }

        with_value_count++;

        if (with_value_count === 21) {
          document.getElementById("ccs_eoiTerm_add").classList.add('ccs-dynaform-hidden');
        }



      }
      else ccsZPresentErrorSummary(errorStore);
    });

    // delete buttons
    deleteButtons.forEach((db) => {
      db.classList.remove('ccs-dynaform-hidden')
      db.addEventListener('click', (e) => {

        e.preventDefault();

        let target = db.href.replace(/^(.+\/)(\d{1,2})$/, "$2"),
          prev_coll = Number(target) - 1,
          target_fieldset = db.closest("fieldset");

        target_fieldset.classList.add("ccs-dynaform-hidden");

        document.getElementById('eoi_term_' + target).value = "";
        document.getElementById('eoi_term_definition_' + target).value = "";


        if (prev_coll > 1) {
          document.querySelector('.acronym_' + prev_coll + ' a.del').classList.remove("ccs-dynaform-hidden");
        }

        document.getElementById("ccs_eoiTerm_add").classList.remove('ccs-dynaform-hidden');
        with_value_count--;
      });
    });
    clearFieldsButtons.forEach((db) => {
      db.addEventListener('click', (e) => {

        e.preventDefault();

        let target = db.href.replace(/^(.+\/)(\d{1,2})$/, "$2"),
          target_fieldset = db.closest("fieldset");

        target_fieldset.classList.add("ccs-dynaform");

        document.getElementById('eoi_term_' + target).value = "";
        document.getElementById('eoi_term_definition_' + target).value = "";
        removeErrorFieldsEoi();
      });

    });


    if (document.getElementsByClassName("term_acronym_fieldset").length > 0) {
      let fieldSets = document.getElementsByClassName("term_acronym_fieldset");
      let length = fieldSets.length;
      while (length--) {
        let id = length + 1;
        let eleTerm = fieldSets[length].querySelector("#eoi_term_" + id);
        eleTerm.addEventListener('focusout', (event) => {
          let ele1 = event.target;
          let definitionElementId = "eoi_term_definition_" + id;
          let ele2 = document.getElementById(definitionElementId);
          performSubmitAction(ele1, ele2);

        });
        let eleTermDefinition = fieldSets[length].querySelector("#eoi_term_definition_" + id);
        eleTermDefinition.addEventListener('focusout', (event) => {
          let ele2 = event.target;
          let ele1Id = "eoi_term_" + id;
          let ele1 = document.getElementById(ele1Id);
          performSubmitAction(ele1, ele2);
        });
        var performSubmitAction = function (ele1, ele2) {
          if (ele1.value !== '' && ele2.value !== '') {
            let formElement = document.getElementById("ccs_eoi_acronyms_form");
            let action = formElement.getAttribute("action");
            action = action + "&stop_page_navigate=true";
            $.ajax({
              type: "POST",
              url: action,
              data: $("#ccs_eoi_acronyms_form").serialize(),
              success: function () {

                //success message mybe...
              }
            });
          }
        };
        // break;
      }
    }
  }
});
const checkFieldsEoi = () => {
  const start = 1;
  const end = 20;

  for (var a = start; a <= end; a++) {
    let input = $(`#eoi_term_${a}`)
    let textbox = $(`#eoi_term_definition_${a}`);


    if (input.val() !== "") {

      $(`#eoi_term_${a}-error`).remove();
      $(`.acronym_${a} div`).removeClass('govuk-form-group--error');
      $(`.acronym_${a} input`).removeClass('govuk-input--error')


    }
    if (textbox.val() !== "") {

      $(`#eoi_term_definition_${a}-error`).remove();
      $(`.acronym_${a} div`).removeClass('govuk-form-group--error');
      $(`.acronym_${a} textarea`).removeClass('govuk-input--error');
      $(`.acronym_${a} textarea`).removeClass('govuk-textarea--error')
    }

  }
}
const removeErrorFieldsEoi = () => {
  $('.govuk-error-message').remove();
  $('.govuk-form-group--error').removeClass('govuk-form-group--error')
  $('.govuk-error-summary').remove();
  $(".govuk-input").removeClass("govuk-input--error");
  $('.govuk-form-group textarea').removeClass('govuk-textarea--error');

}

const emptyFieldCheckEoi = (add_more='') => {
  let fieldCheck = "",
    errorStore = [];

  for (var x = 1; x < 21; x++) {
    let term_field = document.getElementById('eoi_term_' + x);
    let definition_field = document.getElementById("eoi_term_definition_" + x);
    if (term_field.closest("fieldset").classList.value.indexOf("ccs-dynaform-hidden") === -1) {
      checkFieldsEoi();
      
      if (term_field.value.trim() == '' && definition_field.value.trim() == '' && add_more=='add_more') {
        ccsZaddErrorMessage(term_field, 'You must add information in this fields.');
        ccsZaddErrorMessage(definition_field, 'You must add information in this fields.');
        fieldCheck = [definition_field.id, 'You must add information in both fields.'];
        errorStore.push(fieldCheck);
      }

      if (term_field.value.trim() !== '' && definition_field.value.trim() === '') {
        ccsZaddErrorMessage(definition_field, 'You must add definition for the term or acronym.');
        fieldCheck = [definition_field.id, 'You must add definition for the term or acronym.'];
        errorStore.push(fieldCheck);
      }
      if (term_field.value.trim() === '' && definition_field.value.trim() !== '') {
        ccsZaddErrorMessage(term_field, 'You must add term or acronym.');
        fieldCheck = [term_field.id, 'You must add term or acronym.'];
        errorStore.push(fieldCheck);
      }
    }
  }
  return errorStore;
}
const ccsZvalidateEoiAcronyms = (event) => {
  event.preventDefault();

  errorStore = emptyFieldCheckEoi();

  if (errorStore.length === 0) {

    document.forms["ccs_eoi_acronyms_form"].submit();
  }
  else {
    ccsZPresentErrorSummary(errorStore);

  }
};

document.addEventListener('DOMContentLoaded', () => {

  if (document.getElementById("ccs_eoi_confid_form") !== null) {

    // add '(optional)' to the label for RfIs
    if (document.getElementById("event_type_label").value === "Request for Information") {
      var all_labels = document.querySelectorAll(".govuk-label");

      all_labels.forEach((alabel) => {
        let new_label = alabel.innerHTML.replace("requirement", "requirement (optional)");
        alabel.innerHTML = new_label;
      });
    }

    let with_value_count = 6,
      prev_input = 0,
      deleteButtons = document.querySelectorAll("a.del");

    for (var text_box_num = 6; text_box_num > 1; text_box_num--) {

      let this_box = document.getElementById("eoi_confid_" + text_box_num);

      if (this_box.value !== "") {
        this_box.classList.remove('ccs-dynaform-hidden');

        if (text_box_num === 6) {
          document.getElementById("ccs_eoi_criteria_add").classList.add('ccs-dynaform-hidden');
        }

      } else {
        let the_label = document.querySelector('label[for=\'eoi_confid_' + text_box_num + '\']');
        the_label.classList.add('ccs-dynaform-hidden');
        with_value_count = text_box_num;
      }

    }

    document.getElementById("ccs_eoi_confid_add").addEventListener('click', (e) => {
      e.preventDefault();

      document.getElementById("eoi_confid_" + with_value_count).classList.remove("ccs-dynaform-hidden");

      document.querySelector('label[for=\'eoi_confid_' + with_value_count + '\']').classList.remove("ccs-dynaform-hidden");

      if (with_value_count > 2 ) {
        prev_input = with_value_count - 1;
        document.querySelector('label[for=\'eoi_confid_' + prev_input + '\'] a.del').classList.add("ccs-dynaform-hidden");
      }

      with_value_count++;

      if (with_value_count === 7) {
        document.getElementById("ccs_eoi_confid_add").classList.add('ccs-dynaform-hidden');
      }

    });

    // delete buttons
    deleteButtons.forEach((db) => {
      db.addEventListener('click', (e) => {

        e.preventDefault();

        let target = db.href.replace(/^(.+\/)(\d{1,2})$/, "$2"),
          prev_box = Number(target) - 1;
        document.getElementById('eoi_confid_' + target).value = "";
        document.getElementById('eoi_confid_' + target).classList.add("ccs-dynaform-hidden");
        document.getElementById('eoi_confid_' + target + '-error').parentNode.removeChild(document.getElementById('eoi_confid_' + target + '-error'));
        document.querySelector('label[for=\'eoi_confid_' + target + '\']').classList.add("ccs-dynaform-hidden");
        if (prev_box > 1) {
          document.querySelector('label[for=\'eoi_confid_' + prev_box + '\'] a.del').classList.remove("ccs-dynaform-hidden");
        }
        document.getElementById("ccs_eoi_confid_add").classList.remove('ccs-dynaform-hidden');
        with_value_count--;
      });
    });
  }
});

const ccsZvalidateEoiConf = (event) => {
  event.preventDefault();

  let fieldCheck = "",
    errorStore = [];

  const event_typ = document.getElementById("event_type_label").value;

  if (event_typ !== "Request for Information") {

    fieldCheck = ccsZvalidateWithRegex( "eoi_confid_1", "Enter confidentiality requirement " + i, /\w+/);
    if (fieldCheck !== true) errorStore.push(fieldCheck);

    for (var i = 2; i < 7; i++) {
      if (!document.getElementById("eoi_confid_" + i).classList.contains('ccs-dynaform-hidden')) {
        fieldCheck = ccsZvalidateWithRegex( "eoi_confid_" + i, "Enter confidentiality requirement " + i, /\w+/);
        if (fieldCheck !== true) errorStore.push(fieldCheck);
      }
    }
  }

  if (errorStore.length === 0) document.forms["ccs_eoi_confid_form"].submit();
  else ccsZPresentErrorSummary(errorStore);
};


document.addEventListener('DOMContentLoaded', () => {

  if (document.getElementById("ccs_eoi_criteria_form") !== null) {

    // add '(optional)' to the label for EoIs
    if (document.getElementById("event_type_label").value === "Request for Information") {
      var all_labels = document.querySelectorAll(".govuk-label");

      all_labels.forEach((alabel) => {
        let new_label = alabel.innerHTML.replace("requirement", "requirement (optional)");
        alabel.innerHTML = new_label;
      });
    }

    let with_value_count = 6,
      prev_input = 0,
      deleteButtons = document.querySelectorAll("a.del");

    for (var text_box_num = 6; text_box_num > 1; text_box_num--) {

      let this_box = document.getElementById("eoi_eval_criterion_" + text_box_num);

      if (this_box.value !== "") {
        this_box.classList.remove('ccs-dynaform-hidden');

        if (text_box_num === 6) {
          document.getElementById("ccs_eoi_criteria_add").classList.add('ccs-dynaform-hidden');
        }

      } else {
        let the_label = document.querySelector('label[for=\'eoi_eval_criterion_' + text_box_num + '\']');
        the_label.classList.add('ccs-dynaform-hidden');
        with_value_count = text_box_num;
      }

    }

    document.getElementById("ccs_eoi_criteria_add").addEventListener('click', (e) => {
      e.preventDefault();

      document.getElementById("eoi_eval_criterion_" + with_value_count).classList.remove("ccs-dynaform-hidden");

      document.querySelector('label[for=\'eoi_eval_criterion_' + with_value_count + '\']').classList.remove("ccs-dynaform-hidden");

      if (with_value_count > 2 ) {
        prev_input = with_value_count - 1;
        document.querySelector('label[for=\'eoi_eval_criterion_' + prev_input + '\'] a.del').classList.add("ccs-dynaform-hidden");
      }

      with_value_count++;

      if (with_value_count === 7) {
        document.getElementById("ccs_eoi_criteria_add").classList.add('ccs-dynaform-hidden');
      }

    });

    // delete buttons
    deleteButtons.forEach((db) => {
      db.addEventListener('click', (e) => {

        e.preventDefault();

        let target = db.href.replace(/^(.+\/)(\d{1,2})$/, "$2"),
          prev_box = Number(target) - 1;
        document.getElementById('eoi_eval_criterion_' + target).value = "";
        document.getElementById('eoi_eval_criterion_' + target).classList.add("ccs-dynaform-hidden");
        document.getElementById('eoi_eval_criterion_' + target + '-error').parentNode.removeChild(document.getElementById('eoi_eval_criterion_' + target + '-error'));
        document.querySelector('label[for=\'eoi_eval_criterion_' + target + '\']').classList.add("ccs-dynaform-hidden");

        if (prev_box > 1) {
          document.querySelector('label[for=\'eoi_eval_criterion_' + prev_box + '\'] a.del').classList.remove("ccs-dynaform-hidden");
        }
        document.getElementById("ccs_eoi_criteria_add").classList.remove('ccs-dynaform-hidden');
        with_value_count--;
      });
    });

  }
});

const ccsZvalidateEoiCriteria = (event) => {
  event.preventDefault();

  let fieldCheck = "",
    errorStore = [];

  const event_typ = document.getElementById("event_type_label").value;

  if (event_typ !== "Request for Information") {
    fieldCheck = ccsZvalidateWithRegex( "eoi_eval_criterion_1", "Enter evaluation criterion " + i, /\w+/);
    if (fieldCheck !== true) errorStore.push(fieldCheck);

    for (var i = 2; i < 7; i++) {
      if (!document.getElementById("eoi_eval_criterion_" + i).classList.contains('ccs-dynaform-hidden')) {
        fieldCheck = ccsZvalidateWithRegex( "eoi_eval_criterion_" + i, "Enter evaluation criterion " + i, /\w+/);
        if (fieldCheck !== true) errorStore.push(fieldCheck);
      }
    }
  }

  if (errorStore.length === 0) document.forms["ccs_eoi_criteria_form"].submit();
  else ccsZPresentErrorSummary(errorStore);
};


const DaySelector = $('#eoi_resource_start_date-day');
const MonthSelector = $('#eoi_resource_start_date-month');
const YearSelector = $('#eoi_resource_start_date-year');


DaySelector.on('keydown', (event) => {
    if (event.key === '.' || event.keyCode ===69 || event.keyCode ===189 || event.keyCode ===109)
    event.preventDefault(); });
MonthSelector.on('keydown', (event) => {
    if (event.key === '.' || event.keyCode ===69 || event.keyCode ===189 || event.keyCode ===109)
    event.preventDefault(); });  
YearSelector.on('keydown', (event) => {
    if (event.key === '.' || event.keyCode ===69 || event.keyCode ===189 || event.keyCode ===109)
    event.preventDefault(); });
    
let eoiDurationField = $('.eoi_duration');
  
    eoiDurationField.on('keydown', (event) => {
     if (event.key === '.'  || event.keyCode ===69 || event.keyCode ===189 || event.keyCode ===109)
       event.preventDefault(); });


let agreementData;
if ($('.agreement_no').attr('id')) {
    agreementData = $('.agreement_no').attr('id').split("-");
}

let expiryYears = null;
let expiryMonth = null;
let expiryDate = null;

if (agreementData != undefined && agreementData.length > 0) {
    expiryYears = Number(agreementData[0]);
    expiryMonth = Number(agreementData[1]);
    expiryDate = Number(agreementData[2]);
}

const ExpiryDates = new Date(expiryYears, expiryMonth-1, expiryDate);
const getMSOfExpiryDate = ExpiryDates.getTime()


DaySelector.on('blur', () => {
    DateCheck();
    MonthCheck();

})

MonthSelector.on('blur', () => {
    DateCheck();
    MonthCheck();

})
YearSelector.on('blur', () => {
    DateCheck();
    MonthCheck();
    YearCheck();
})


const DateCheck = () => {
    const dayValue = DaySelector.val();
    if (dayValue > 31 || dayValue < 0) {
        DaySelector.addClass('govuk-form-group--error');
        $('.durations').addClass('govuk-form-group--error');
        $('#event-name-error-date').html('Enter a valid date')
    }
    else {
        DaySelector.removeClass('govuk-form-group--error');
        $('.durations').removeClass('govuk-form-group--error');
        $('#event-name-error-date').html('')
    }
}

const MonthCheck = () => {
    const MonthValue = MonthSelector.val();
    if (MonthValue > 12 || MonthValue < 0) {
        MonthSelector.addClass('govuk-form-group--error');
        $('.durations').addClass('govuk-form-group--error');
        $('#event-name-error-month').html('Enter a valid month');

    }
    else {
        MonthSelector.removeClass('govuk-form-group--error');
        $('.durations').removeClass('govuk-form-group--error');
        $('#event-name-error-month').html('');
    }
}

const currentYearDate = new Date();
const currentYear = currentYearDate.getFullYear()


const YearCheck = () => {
    const YearValues = YearSelector.val();
    if (YearValues < currentYear) {
        YearSelector.addClass('govuk-form-group--error');
        $('.durations').addClass('govuk-form-group--error');
        $('#event-name-error-year').html('Enter a valid year');
    }
    else if (YearValues == "") {
        YearSelector.removeClass('govuk-form-group--error');
        $('.durations').removeClass('govuk-form-group--error');
        $('#event-name-error-year').html('');
    }
    else {
        YearSelector.removeClass('govuk-form-group--error');
        $('.durations').removeClass('govuk-form-group--error');
        $('#event-name-error-year').html('');
    }
}


const projectYears = $('#eoi_duration-years');
const projectMonths = $('#eoi_duration-months');
const projectDays = $('#eoi_duration-days');

projectYears.on('blur', () => {
    if (projectYears.val() < 0) {
        projectYears.addClass('govuk-form-group--error');
        $('.p_durations').addClass('govuk-form-group--error');
        $('#eoi-event-name-error-pdate').html('Enter a valid Year')
    }else{
        let yrValidation = false;
        let durationDays = document.getElementById('eoi_duration-days');
        let durationMonth = document.getElementById('eoi_duration-months');
        DaysProjectRun = Number(durationDays.value);
        MonthProjectRun = Number(durationMonth.value);
        let YearProjectRun = Number(projectYears.val());

            if(YearProjectRun==4){
               if(MonthProjectRun>0 || DaysProjectRun>0){
                  yrValidation = true;
               }
            }else if(YearProjectRun==3){
               if(MonthProjectRun==12 && DaysProjectRun>0){
                  yrValidation = true;
               }
            }else if(YearProjectRun>4){
               yrValidation = true;
            }
            if(yrValidation){
                projectYears.addClass('govuk-form-group--error');
                $('.p_durations').addClass('govuk-form-group--error');
                $('#eoi-event-name-error-pdate').html('Project Duration should not be greater than 4 years')
            }else {
                projectYears.removeClass('govuk-form-group--error');
                $('.p_durations').removeClass('govuk-form-group--error');
                $('#eoi-event-name-error-pdate').html('')
            }
            $('#eoi_duration-months').blur();
            $('#eoi_duration-days').blur();
    }
})

projectMonths.on('blur', () => {
    if (projectMonths.val() < 0) {
        projectMonths.addClass('govuk-form-group--error');
        $('.p_durations').addClass('govuk-form-group--error');
        $('#eoi-event-name-error-pdate').html('Enter a valid Month')
    }else{
        let yrValidation = false;
        let durationYear = document.getElementById('eoi_duration-years');
        let durationDay = document.getElementById('eoi_duration-days');
        YearProjectRun = Number(durationYear.value);
        DaysProjectRun = Number(durationDay.value);
        let MonthProjectRun = Number(projectMonths.val());

            if(YearProjectRun==4){
               if(MonthProjectRun>0 || DaysProjectRun>0){
                  yrValidation = true;
               }
            }else if(YearProjectRun==3){
               if(MonthProjectRun==12 && DaysProjectRun>0){
                  yrValidation = true;
               }
            }else if(YearProjectRun>4){
               yrValidation = true;
            }
            if(yrValidation){
                projectMonths.addClass('govuk-form-group--error');
                $('.p_durations').addClass('govuk-form-group--error');
                $('#eoi-event-name-error-pdate').html('Project Duration should not be greater than 4 years')
            }else {
                projectMonths.removeClass('govuk-form-group--error');
                $('.p_durations').removeClass('govuk-form-group--error');
                $('#eoi-event-name-error-pdate').html('')
            }
            $('#eoi_duration-days').blur();
            // $('#eoi_duration-years').blur();
    }
    
})


projectDays.on('blur', () => {
    if (projectDays.val() < 0) {
        projectDays.addClass('govuk-form-group--error');
        $('.p_durations').addClass('govuk-form-group--error');
        $('#eoi-event-name-error-pdate').html('Enter a valid date')
    }else{
        let yrValidation = false;
        let durationYear = document.getElementById('eoi_duration-years');
        let durationMonth = document.getElementById('eoi_duration-months');
        YearProjectRun = Number(durationYear.value);
        MonthProjectRun = Number(durationMonth.value);
        let DaysProjectRun = Number(projectDays.val());

            if(YearProjectRun==4){
               if(MonthProjectRun>0 || DaysProjectRun>0){
                  yrValidation = true;
               }
            }else if(YearProjectRun==3){
               if(MonthProjectRun==12 && DaysProjectRun>0){
                  yrValidation = true;
               }
            }else if(YearProjectRun>4){
               yrValidation = true;
            }
            if(yrValidation){
                projectDays.addClass('govuk-form-group--error');
                $('.p_durations').addClass('govuk-form-group--error');
                $('#eoi-event-name-error-pdate').html('Project Duration should not be greater than 4 years')
            }else {
                projectDays.removeClass('govuk-form-group--error');
                $('.p_durations').removeClass('govuk-form-group--error');
                $('#eoi-event-name-error-pdate').html('')
            }
            // $('#eoi_duration-years').blur();
            // $('#eoi_duration-months').blur();
    }
})



$('.save-button').on('click', (e) => {
if(document.getElementById("eoi_resource_start_date-day") != null){
    const Day = $('#eoi_resource_start_date-day').val()
    const Month = $('#eoi_resource_start_date-month').val()
    const Year = $('#eoi_resource_start_date-year').val()
    const FormDate = new Date(Year, Month-1, Day);
    const getTimeOfFormDate = FormDate.getTime();
   
    const todayDate = new Date();


    if (Day == "") {
        const errorStore = [["eoi_resource_start_date", "Project start day cannot be Empty"]]
        DaySelector.addClass('govuk-form-group--error');
        $('.durations').addClass('govuk-form-group--error');
        $('#event-name-error-date').html('Enter a valid date')
        ccsZPresentErrorSummary(errorStore);
        e.preventDefault()
    }

    if (Month == "") {
        const errorStore = [["eoi_resource_start_date", "Project start Month cannot be Empty"]]
        MonthSelector.addClass('govuk-form-group--error');
        $('.durations').addClass('govuk-form-group--error');
        $('#event-name-error-month').html('Enter a valid month');
        ccsZPresentErrorSummary(errorStore);
        e.preventDefault()
    }

    if (Year == "") {
        const errorStore = [["eoi_resource_start_date", "Porject start Year cannot be Empty"]]
        YearSelector.addClass('govuk-form-group--error');
        $('.durations').addClass('govuk-form-group--error');
        $('#event-name-error-year').html('Enter a valid year');
        ccsZPresentErrorSummary(errorStore);
        e.preventDefault()
    }



    //$('#event-name-error-year').html('Enter a valid year');
   // const errorStore = [["eoi_resource_start_date", "Project time's format is not valid"]]
   
    //balwinder added if condation
    if (document.forms['ccs_eoi_date_form'] != undefined && document.forms['ccs_eoi_date_form'] != null) {
       // console.log("errorStore",errorStore)
        //ccsZPresentErrorSummary(errorStore);
    }
    
    if (getTimeOfFormDate > getMSOfExpiryDate) {
        e.preventDefault();
       
        $('#event-name-error-date').html('Start date cannot be after agreement expiry date');
        DaySelector.addClass('govuk-form-group--error');
        MonthSelector.addClass('govuk-form-group--error');
        YearSelector.addClass('govuk-form-group--error');
        $('.durations').addClass('govuk-form-group--error');
        const errorStore = [["eoi_resource_start_date", "Start date cannot be after agreement expiry date"]]
        ccsZPresentErrorSummary(errorStore);
    }
    else if (getTimeOfFormDate < todayDate.getTime()) {
        e.preventDefault();
        $('#event-name-error-date').html('Start date must be a valid future date');
        DaySelector.addClass('govuk-form-group--error');
        MonthSelector.addClass('govuk-form-group--error');
        YearSelector.addClass('govuk-form-group--error');
        $('.durations').addClass('govuk-form-group--error');
        const errorStore = [["eoi_resource_start_date", "Start date must be a valid future date"]];
        ccsZPresentErrorSummary(errorStore);
    }
    else {
        let yrValidation = false;
            const durationYear = document.getElementById('eoi_duration-years');
            const durationMonth = document.getElementById('eoi_duration-months');
            const durationDay = document.getElementById('eoi_duration-days');

            if(durationYear.value!='' || durationMonth.value!='' || durationDay.value!=''){
            const YearProjectRun = Number(durationYear.value);
            const MonthProjectRun = Number(durationMonth.value);
            const DaysProjectRun = Number(durationDay.value);
            
            if(YearProjectRun==4){
               if(MonthProjectRun>0 || DaysProjectRun>0){
                  yrValidation = true;
               }
            }else if(YearProjectRun==3){
               if(MonthProjectRun==12 && DaysProjectRun>0){
                  yrValidation = true;
               }
            }else if(YearProjectRun>4){
               yrValidation = true;
            }
            if(yrValidation){
                e.preventDefault()
               return;
            }
            }
               
            document.forms['ccs_eoi_date_form'].submit();
    }

}

})
const ccsZvalidateEoiDate = (event) => {
  event.preventDefault();

  let fieldCheck = "",
    errorStore = [];
  
    const start_day = document.getElementById("eoi_resource_start_date-day"),
    start_month = document.getElementById("eoi_resource_start_date-month"),
    start_year = document.getElementById("eoi_resource_start_date-year");

    

    let start_date = "";
      start_date = getDate(start_day, start_month, start_year, start_date);
   
  if (document.getElementById("eoi_resource_start_date-day") !=undefined &&document.getElementById("eoi_resource_start_date-day") !=null && document.getElementById("eoi_resource_start_date-day").value.trim().length === 0) {
    fieldCheck = ccsZvalidateWithRegex("eoi_resource_start_date-day", "Enter a day", /^\d{1,}$/);
    if (fieldCheck !== true) errorStore.push(fieldCheck);
  }
  if (document.getElementById("eoi_resource_start_date-month") !=undefined && document.getElementById("eoi_resource_start_date-month") !=null && document.getElementById("eoi_resource_start_date-month").value.trim().length === 0) {
    fieldCheck = ccsZvalidateWithRegex("eoi_resource_start_date-month", "Enter a month", /^\d{1,}$/);
    if (fieldCheck !== true) errorStore.push(fieldCheck);
  }
  if (document.getElementById("eoi_resource_start_date-year") !=undefined && document.getElementById("eoi_resource_start_date-year") !=null && document.getElementById("eoi_resource_start_date-year").value.trim().length === 0) {
    fieldCheck = ccsZvalidateWithRegex("eoi_resource_start_date-year", "Enter a year", /^\d{1,}$/);
    if (fieldCheck !== true) errorStore.push(fieldCheck);
  }
  if (document.getElementById("eoi_resource_start_date-year") !=undefined && document.getElementById("eoi_resource_start_date-year") !=null && document.getElementById("eoi_resource_start_date-year").value.trim().length < 4) {
    fieldCheck = ccsZvalidateWithRegex("eoi_resource_start_date-year", "The date format should be YYYY", /^\d{4,}$/);
    if (fieldCheck !== true) errorStore.push(fieldCheck);
  }
  
  if (document.getElementById("eoi_resource_start_date-year") !=undefined && document.getElementById("eoi_resource_start_date-year") !=null && document.getElementById("eoi_resource_start_date-year").value.trim().length === 4) {
  fieldCheck = ccsZvalidateThisDate( "eoi_resource_start_date", "Start date must be a valid future date", 1, 0 );
  if (fieldCheck !== true) errorStore.push(fieldCheck);
  else
  {
    
    // var description =document.getElementById("eoi_resource_start_date-hint") !=undefined && document.getElementById("eoi_resource_start_date-hint") !=null ?  document.getElementById("eoi_resource_start_date-hint").innerText.trim().split('\n')[0].split(' '):null;
    
    // var agreement_expiry_date =description !=null? description[5]+","+description[6]+","+description[7]:null;
    let agreementData;
    if ($('.agreement_no').attr('id')) {
        agreementData = $('.agreement_no').attr('id').split("-");
    }
    let expiryYears = null;
    let expiryMonth = null;
    let expiryDate = null;
    if (agreementData != undefined && agreementData.length > 0) {
        expiryYears = Number(agreementData[0]);
        expiryMonth = Number(agreementData[1]);
        expiryDate = Number(agreementData[2]);
    }
    // const ExpiryDates = new Date(expiryYears, expiryMonth-1, expiryDate);
    // const getMSOfExpiryDate = ExpiryDates.getTime()
    
    var agreement_expiry_date =expiryYears+","+expiryMonth+","+expiryDate;
    fieldCheck =agreement_expiry_date !=null? isValidEoiStartDateForSelectedLot(start_date,agreement_expiry_date):null;
      if(fieldCheck !=null && fieldCheck !== true) {
        ccsZaddErrorMessage(document.getElementById("eoi_resource_start_date"), "Start date cannot be after agreement expiry date");
          errorStore.push(["eoi_resource_start_date", "Start date cannot be after agreement expiry date"]);
      }
  }
  }


  if (errorStore.length === 0 && document.forms["ccs_eoi_date_form"] !=undefined && document.forms["ccs_eoi_date_form"] !=null && document.forms["ccs_eoi_date_form"].length >0) document.forms["ccs_eoi_date_form"].submit();
  else ccsZPresentErrorSummary(errorStore);
};


function getDate(start_day, start_month, start_year, start_date) {
 
  

  if (start_day !=undefined && start_day !=null && start_day.value.match(/^\d\d?$/) &&
      start_month.value.match(/^\d\d?$/) &&
      start_year.value.match(/^\d{4}$/)) {
      let start_day_str = start_day.value, start_month_str = start_month.value;
        
        
      if (start_day_str !=undefined && start_day_str !=null && start_day_str < 10 && !start_day_str.match(/^0\d$/))
          start_day_str = "0" + start_day_str;
      if (start_month_str !=undefined && start_month_str !=null && start_month_str < 10 && !start_month_str.match(/^0\d$/))
          start_month_str = "0" + start_month_str;
      //start_date = new Date(start_year.value + "-" + start_month_str + "-" + start_day_str + "T11:00:00").getTime();
      start_date = new Date(start_year.value + "-" + start_month_str + "-" + start_day_str + "T00:00:00").getTime();
  }
  return start_date;
}

function isValidEoiStartDateForSelectedLot(start_date,agreement_expiry_date) {
    if(start_date !=undefined && start_date !=null && start_date <= new Date(agreement_expiry_date)) { // This will only work in prototype for MCF-3 lot 1 for enabling this page for other agreements need to add hidden field in the page to read lot endDate
      return true;
  }else {
      return false;
  }
}
 const setInputFilter = (textbox, inputFilter) => {
   if (textbox !=undefined && textbox !=null) {
     ["input", "keydown", "keyup", "mousedown", "mouseup", "select", "contextmenu", "drop"].forEach(function (event) {

       textbox.addEventListener(event, function () {

         if (inputFilter(this.value)) {
           this.oldValue = this.value;
           this.oldSelectionStart = this.selectionStart;
           this.oldSelectionEnd = this.selectionEnd;
         } else if (this.hasOwnProperty("oldValue")) {
           this.value = this.oldValue;
           this.setSelectionRange(this.oldSelectionStart, this.oldSelectionEnd);
         } else {
           this.value = "";
         }
       });
     });
   }
  
} 
document.addEventListener('DOMContentLoaded', () => {
    if (document.getElementById("ccs_eoi_procurement_lead") !== null) {
        document.getElementById('ccs_eoi_procurement_lead').addEventListener('change', function (event) {
            event.preventDefault();
            $.ajax({
                url: "/rfi/users-procurement-lead?id=" + event.target.value,
                type: "GET",
                contentType: "application/json",
            }).done(function (result) {
                setUserDetails(result);
            }).fail((res) => {
                let div_email = document.getElementById('eoi-lead-email');
                div_email.innerText = '';
                let div_tel = document.getElementById('eoi-lead-telephone');
                div_tel.innerText = '';

            })
        });
        const setUserDetails = (user) => {
            let div_email = document.getElementById('eoi-lead-email');
            div_email.innerText = user.userName;
            let div_tel = document.getElementById('eoi-lead-telephone');
            div_tel.innerText = '1';
            let div_email_value = document.getElementById('eoi_procurement_lead_input');
            div_email_value.value = user.userName;

        };
    }
});

$('.add').addClass('ccs-dynaform-hidden');
document.addEventListener('DOMContentLoaded', () => {
  if (document.getElementById("ccs_eoi_questions_form") !== null) {
    const queryString = window.location.search;
    const urlParams = new URLSearchParams(queryString);

    let with_value_count = 10,
      prev_input = 0,
      filled_input = 0,
      deleteButtons = document.querySelectorAll("a.del");

    for (var text_box_num = 10; text_box_num > 1; text_box_num--) {

      let this_box = document.getElementById("eoi_question_" + text_box_num);

      if (this_box.value !== "") {
        this_box.classList.remove('ccs-dynaform-hidden');

        if (text_box_num === 10) {
          document.getElementById("ccs_criteria_add").classList.add('ccs-dynaform-hidden');
        }

      } else {
        let the_label = document.querySelector('label[for=eoi_question_' + text_box_num + ']');
        document.getElementById("eoi_question_"+text_box_num+"-info" ).classList.add('ccs-dynaform-hidden');
        the_label.classList.add('ccs-dynaform-hidden');
        filled_input++;
        with_value_count = text_box_num;
      }

    }
   

    document.getElementById("ccs_criteria_add").classList.remove("ccs-dynaform-hidden");

    if(filled_input===0){
    
        document.getElementById("ccs_criteria_add").classList.add('ccs-dynaform-hidden');
      }

    document.getElementById("ccs_criteria_add").addEventListener('click', (e) => {
      e.preventDefault();
      $(".govuk-error-summary").remove();
      errorStore = emptyObjectiveFieldCheck();
      if (errorStore.length == 0) {

        document.getElementById("eoi_question_" + with_value_count).classList.remove("ccs-dynaform-hidden");

        document.querySelector('label[for=eoi_question_' + with_value_count + ']').classList.remove("ccs-dynaform-hidden");
        document.getElementById("eoi_question_"+with_value_count+"-info" ).classList.remove('ccs-dynaform-hidden');

        if (with_value_count > 2) {
          prev_input = with_value_count - 1;
          // document.querySelector('label[for=eoi_question_' + prev_input + '] a.del').classList.add("ccs-dynaform-hidden");
        }

        with_value_count++;

        if (with_value_count === 11) {
          document.getElementById("ccs_criteria_add").classList.add('ccs-dynaform-hidden');
        }
      }
      else ccsZPresentErrorSummary(errorStore);
    });

    // delete buttons
    deleteButtons.forEach((db) => {
      db.classList.remove('ccs-dynaform-hidden')
      db.addEventListener('click', (e) => {

        e.preventDefault();

        let target = db.href.replace(/^(.+\/)(\d{1,2})$/, "$2"),
          prev_box = Number(target) - 1;
        document.getElementById('eoi_question_' + target).value = "";
        document.getElementById('eoi_question_' + target).classList.add("ccs-dynaform-hidden");
        let parentNode = document.querySelector('label[for=eoi_question_' + target + ']').parentNode;
        if (parentNode.children["eoi_question_" + target + '-error'] !== undefined) {
          parentNode.removeChild(document.getElementById("eoi_question_" + target + '-error'))
          parentNode.classList.remove("govuk-form-group--error");
          parentNode.children["eoi_question_" + target].classList.remove("govuk-input--error");
        }
        //document.getElementById('eoi_question_' + target + '-error').parentNode.removeChild(document.getElementById('eoi_question_' + target + '-error'));
        document.querySelector('label[for=eoi_question_' + target + ']').classList.add("ccs-dynaform-hidden");
        document.getElementById("eoi_question_"+target+"-info" ).classList.add('ccs-dynaform-hidden');
        if (prev_box > 1) {
          document.querySelector('label[for=eoi_question_' + prev_box + '] a.del').classList.remove("ccs-dynaform-hidden");
        }
        document.getElementById("ccs_criteria_add").classList.remove('ccs-dynaform-hidden');
        with_value_count--;
      });
    });


    let length = 11;
    while (--length) {
      let element = document.querySelector("#eoi_question_" + length);
      element.addEventListener('focusout', (event) => {
        let eleValue = event.target.value;
        if (eleValue !== '') {
          let formElement = document.getElementById("ccs_eoi_questions_form");
          let action = formElement.getAttribute("action");
          action = action + "&stop_page_navigate=true";
          $.ajax({
            type: "POST",
            url: action,
            data: $("#ccs_eoi_questions_form").serialize(),
            success: function () {

              //success message mybe...
            }
          });
        }
      });
      // break;
    }
  }

  const emptyObjectiveFieldCheck = () => {
    let fieldCheck = "",
      errorStore = [];

    let errorText = '';
    if ($("#page-heading").text().includes("Project scope")) {
      errorText = "You must type at least one project scope before you can add another"
    } else {
      errorText = "You must type an objective before you can add another objective"
    }
    fieldCheck = ccsZvalidateWithRegex("eoi_question_1", errorText, /\w+/);
    if (fieldCheck !== true) errorStore.push(fieldCheck);
    for (var i = 2; i < 11; i++) {
      if (!document.getElementById("eoi_question_" + i).classList.contains('ccs-dynaform-hidden')) {
        fieldCheck = ccsZvalidateWithRegex("eoi_question_" + i, errorText, /\w+/);
        if (fieldCheck !== true) errorStore.push(fieldCheck);
      }
    }
    return errorStore;
  };
});

const emptyObjectiveFieldCheckForSave = () => {
  let fieldCheck = "",
    errorStore = [];
  if ($("#page-heading").text().includes("Project objectives"))
  if(urlParams.get('agreement_id') == 'RM6187'){
    fieldCheck = ccsZvalidateWithRegex("eoi_question_1", "Enter at least 1 project objective", /\w+/);
  }else{
    fieldCheck = ccsZvalidateWithRegex("eoi_question_1", "You must add at least one objective", /\w+/);
  }
    
  if (fieldCheck !== true && ($("#page-heading").text().includes("Project objectives"))) errorStore.push(fieldCheck);
  return errorStore;
};

const ccsZvalidateEoIQuestions = (event) => {
  event.preventDefault();
  errorStore = emptyObjectiveFieldCheckForSave();

  //}

  if (errorStore.length === 0) document.forms["ccs_eoi_questions_form"].submit();
  else ccsZPresentErrorSummary(errorStore);
};

$('.add').addClass('ccs-dynaform-hidden');

const eoi_totalElementSelectors = Array.from(Array(5 + 1).keys()).slice(1);


for (const selector of eoi_totalElementSelectors) {

    let elementID = "#eoi_clarification_date_expanded_" + selector;
    let elementSelector = $(elementID);
    if (elementSelector.length === 0)
        elementSelector = $("#eoi_clarification_date_expanded_" + selector);
    elementSelector.fadeOut();
}


for (const selector of eoi_totalElementSelectors) {
    let elementID = "#change_clarification_date_" + selector;
    let elementCancelID = "#cancel_change_clarification_date_" + selector;
    let elementSelector = $(elementID);
    let elementSelectorCancel = $(elementCancelID);
    elementSelector.fadeIn();
    elementSelectorCancel.fadeIn();
    elementSelector.on('click', (event) => {
        localStorage.removeItem('dateItem');
        localStorage.setItem('dateItem', elementSelector.selector);
        let ClickedID = "#eoi_clarification_date_expanded_" + selector;
        let elementSelectorClicked = $(ClickedID);
        if (elementSelectorClicked.length === 0)
            elementSelectorClicked = $("#eoi_clarification_date_expanded_" + selector);
        elementSelectorClicked.fadeIn();
        elementSelector.hide();
        saveButtonHideDateEoi();
    });
    var errorSelectorId = '';
    let errorSelector = $("#click-error");


    errorSelector.on('click', () => {
        let storedClickedID = localStorage.getItem('dateItem');
        let cleanedClickedID = storedClickedID.slice(1);
        let elementSelectorClicked = $(storedClickedID);
        if (elementSelector.selector === elementSelectorClicked.selector) {
            elementSelectorClicked = $("#eoi_clarification_date_expanded_" + selector);
            elementSelectorClicked.fadeIn();
            elementSelector.hide();
        } else {
            elementSelectorClicked.hide();
            elementSelector.fadeIn();
        }
        let agreementID;
        if(document.getElementById("agreementID")) agreementID = document.getElementById("agreementID").value;
        if(agreementID != 'RM1043.8' && agreementID != 'RM1557.13') {
 
        ccsZaddErrorMessage(document.getElementById(cleanedClickedID), 'You can not set a date and time that is earlier than the previous milestone in the timeline');
        }
    });
}




for (const selector of eoi_totalElementSelectors) {
    let elementID = "#cancel_change_clarification_date_" + selector;
    let elementSelector = $(elementID);
    elementSelector.on('click', () => {

        let ClickedID = "#eoi_clarification_date_expanded_" + selector;
        let elementSelectorClicked = $(ClickedID);
        if (elementSelectorClicked.length === 0) {
            ClickedID = "#eoi_clarification_date_expanded_" + selector;
            elementSelectorClicked = $(ClickedID);
        }
        elementSelectorClicked.fadeOut();

        ccsZremoveErrorMessage(document.getElementById(ClickedID.slice(1)))
        if (errorSelectorId === ClickedID) {
            for (let selector of totalElementSelectors) {
                let changeID = "#change_clarification_date_" + selector;
                $(changeID).show();
            }
        } else {
            const elementIDChange = $("#change_clarification_date_" + selector);
            elementIDChange.show();
        }
        // const elementIDChange = $("#change_clarification_date_" + selector);
        //elementIDChange.show();
        saveButtonUnHideDateEoi();
    });
}

const saveButtonHideDateEoi = () => {
    document.getElementById("hideMeWhileDateChange").disabled = true;
}

const saveButtonUnHideDateEoi = () => {
    document.getElementById("hideMeWhileDateChange").disabled = false;
}



if ($('#eoi_splterm').length > 0) {
  $('.eoi_form').attr('id', 'ccs_eoi_splterms_form');
  $('.eoi_form').attr('name', 'ccs_eoi_splterms_form');
}


document.addEventListener('DOMContentLoaded', () => {

  if (document.getElementById("ccs_eoi_splterms_form") !== null) {

    let with_value_count = 10,
      prev_input = 0,
      filled_input = 0,
      deleteButtons = document.querySelectorAll("a.del");
    let clearFieldsButtons = document.querySelectorAll("a.clear-fields");

    for (var acronym_fieldset = 10; acronym_fieldset > 1; acronym_fieldset--) {


      let this_fieldset = document.querySelector(".splterm_" + acronym_fieldset),
        term_box = document.getElementById("eoi_splterm_" + acronym_fieldset);

      if (term_box.value !== "") {
        this_fieldset.classList.remove('ccs-dynaform-hidden');

        if (acronym_fieldset === 10) {
          document.getElementById("ccs_eoisplTerm_add").classList.add('ccs-dynaform-hidden');
        }

      } else {

        this_fieldset.classList.add('ccs-dynaform-hidden');
        with_value_count = acronym_fieldset;
        filled_input++;
      }

    }
    document.getElementById("ccs_eoisplTerm_add").classList.remove("ccs-dynaform-hidden");

    if(filled_input===0){
    
      document.getElementById("ccs_eoisplTerm_add").classList.add('ccs-dynaform-hidden');
    }


    document.getElementById("ccs_eoisplTerm_add").addEventListener('click', (e) => {



      $('.govuk-form-group textarea').removeClass('govuk-textarea--error');
      checkFieldsEoiTerms();

      e.preventDefault();
      errorStore = emptyFieldCheckEoiTerms("add_more");
      if (errorStore.length == 0) {

        removeErrorFieldsEoiTerms();


        document.querySelector(".splterm_" + with_value_count).classList.remove("ccs-dynaform-hidden");

        if (with_value_count > 2) {
          prev_input = with_value_count - 1;
          // document.querySelector(".splterm_" + prev_input + " a.del").classList.add("ccs-dynaform-hidden");
        }

        with_value_count++;

        if (with_value_count === 11) {
          document.getElementById("ccs_eoisplTerm_add").classList.add('ccs-dynaform-hidden');
        }



      }
      else ccsZPresentErrorSummary(errorStore);
    });

    // delete buttons
    deleteButtons.forEach((db) => {
      db.classList.remove('ccs-dynaform-hidden')
      db.addEventListener('click', (e) => {

        e.preventDefault();

        let target = db.href.replace(/^(.+\/)(\d{1,2})$/, "$2"),
          prev_coll = Number(target) - 1,
          target_fieldset = db.closest("fieldset");

        target_fieldset.classList.add("ccs-dynaform-hidden");

        document.getElementById('eoi_splterm_' + target).value = "";
        // document.getElementById('eoi_splterm_definition_' + target).value = "";


        if (prev_coll > 1) {
          document.querySelector('.splterm_' + prev_coll + ' a.del').classList.remove("ccs-dynaform-hidden");
        }

        document.getElementById("ccs_eoisplTerm_add").classList.remove('ccs-dynaform-hidden');
        with_value_count--;
      });
    });
    clearFieldsButtons.forEach((db) => {
      db.addEventListener('click', (e) => {

        e.preventDefault();

        let target = db.href.replace(/^(.+\/)(\d{1,2})$/, "$2"),
          target_fieldset = db.closest("fieldset");

        target_fieldset.classList.add("ccs-dynaform");

        document.getElementById('eoi_splterm_' + target).value = "";
        document.getElementById('eoi_splterm_definition_' + target).value = "";
        removeErrorFieldsEoiTerms();
      });

    });


    if (document.getElementsByClassName("term_fieldset").length > 0) {
      let fieldSets = document.getElementsByClassName("term_fieldset");
      let length = fieldSets.length;
      while (length--) {
        let id = length + 1;
        let eleTerm = fieldSets[length].querySelector("#eoi_splterm_" + id);
        eleTerm.addEventListener('focusout', (event) => {
          let ele1 = event.target;
          let definitionElementId = "eoi_splterm_definition_" + id;
          let ele2 = document.getElementById(definitionElementId);
          performSubmitActionSpecial(ele1, ele2);

        });
        let eleTermDefinition = fieldSets[length].querySelector("#eoi_splterm_definition_" + id);
        if(eleTermDefinition!=undefined){
        eleTermDefinition.addEventListener('focusout', (event) => {
          let ele2 = event.target;
          let ele1Id = "eoi_splterm_" + id;
          let ele1 = document.getElementById(ele1Id);
          performSubmitAction(ele1, ele2);
        });
      }else{
        eleTerm.addEventListener('focusout', (event) => {
          
          let ele1Id = "eoi_splterm_" + id;
          let ele1 = document.getElementById(ele1Id);
          performSubmitActionSpecial(ele1);
        });
      }

      var performSubmitActionSpecial = function (ele1) {
        if (ele1.value !== '') {
          let formElement = document.getElementById("ccs_eoi_splterms_form");
          let action = formElement.getAttribute("action");
          action = action + "&stop_page_navigate=true";
          $.ajax({
            type: "POST",
            url: action,
            data: $("#ccs_eoi_splterms_form").serialize(),
            success: function () {

              //success message mybe...
            }
          });
        }
      };

        var performSubmitAction = function (ele1, ele2) {
          if (ele1.value !== '' && ele2.value !== '') {
            let formElement = document.getElementById("ccs_eoi_splterms_form");
            let action = formElement.getAttribute("action");
            action = action + "&stop_page_navigate=true";
            $.ajax({
              type: "POST",
              url: action,
              data: $("#ccs_eoi_splterms_form").serialize(),
              success: function () {

                //success message mybe...
              }
            });
          }
        };
        // break;
      }
    }
  }
});
const checkFieldsEoiTerms = () => {
  const start = 1;
  const end = 10;

  for (var a = start; a <= end; a++) {
    let input = $(`#eoi_splterm_${a}`)
    let textbox = $(`#eoi_splterm_definition_${a}`);


    if (input.val() !== "") {

      $(`#eoi_splterm_${a}-error`).remove();
      $(`.splterm_${a} div`).removeClass('govuk-form-group--error');
      $(`.splterm_${a} input`).removeClass('govuk-input--error')


    }
    if (textbox.val() !== "") {

      $(`#eoi_splterm_definition_${a}-error`).remove();
      $(`.splterm_${a} div`).removeClass('govuk-form-group--error');
      $(`.splterm_${a} textarea`).removeClass('govuk-input--error');
      $(`.splterm_${a} textarea`).removeClass('govuk-textarea--error')
    }

  }
}
const removeErrorFieldsEoiTerms = () => {
  $('.govuk-error-message').remove();
  $('.govuk-form-group--error').removeClass('govuk-form-group--error')
  $('.govuk-error-summary').remove();
  $(".govuk-input").removeClass("govuk-input--error");
  $('.govuk-form-group textarea').removeClass('govuk-textarea--error');

}

const emptyFieldCheckEoiTerms = (add_more='') => {
  let fieldCheck = "",
    errorStore = [];
  checkFieldsEoiTerms();
  let termFieldError = false, defFieldError = false;
  for (var x = 1; x < 11; x++) {
    let term_field = document.getElementById('eoi_splterm_' + x);
    let definition_field = document.getElementById("eoi_splterm_definition_" + x);
    if (term_field.closest("fieldset").classList.value.indexOf("ccs-dynaform-hidden") === -1) {
      //
     // if (term_field.value.trim() !== '' && definition_field.value.trim() === '') {
      const pageHeading = document.getElementById('page-heading').innerHTML;
      if (term_field.value.trim() !== '' && (!pageHeading.includes('Optional') || add_more=='add_more')) {
        //ccsZaddErrorMessage(definition_field, 'You must explain the special term or condition.');
        //fieldCheck = [definition_field.id, 'You must explain the special term or condition.'];
        //errorStore.push(fieldCheck);
      }
      //if (term_field.value.trim() === '' && definition_field.value.trim() !== '') {
        if(!pageHeading.includes('Optional') || add_more=='add_more'){  
        if (term_field.value.trim() === '' ) {
        ccsZaddErrorMessage(term_field, 'You must add special term or condition.');
        fieldCheck = [term_field.id, 'You must add special term or condition.'];
        errorStore.push(fieldCheck);
      }

      if (term_field.value != null && term_field.value != undefined && term_field.value.length > 10000) {
        ccsZaddErrorMessage(term_field, 'Term and condition title must be 100 characters or fewer');
        termFieldError = true;
      }
    }

    }
  }
  if (termFieldError) {
    fieldCheck = ["#", 'Term and condition title must be 500 characters or fewer'];
    errorStore.push(fieldCheck);
  }
  if (defFieldError) {
    fieldCheck = ["#", 'Term and condition description must be 10000 characters or fewer'];
    errorStore.push(fieldCheck);
  }
  return errorStore;
}

const ccsZvalidateEoiSpecialTerms = (event) => {
  event.preventDefault();

  errorStore = emptyFieldCheckEoiTerms();

  if (errorStore.length === 0) {

    document.forms["ccs_eoi_splterms_form"].submit();
  }
  else {
    ccsZPresentErrorSummary(errorStore);

  }
};
document.addEventListener('DOMContentLoaded', () => {

  if (document.getElementById("ccs_eoi_docs_form") !== null) {

    let with_value_count = 4,
      prev_input = 0,
      deleteButtons = document.querySelectorAll("a.del");

    for (var text_box_num = 4; text_box_num > 1; text_box_num--) {

      let this_box = document.getElementById("eoi_file_upload_" + text_box_num);

      if (this_box.value !== "") {
        this_box.classList.remove('ccs-dynaform-hidden');

        if (text_box_num === 4) {
          document.getElementById("ccs_eoi_file_add").classList.add('ccs-dynaform-hidden');
        }

      } else {
        let the_label = document.querySelector('label[for=\'eoi_file_upload_' + text_box_num + '\']');
        the_label.classList.add('ccs-dynaform-hidden');
        with_value_count = text_box_num;
      }
    }

    document.getElementById("ccs_eoi_file_add").addEventListener('click', (e) => {
      e.preventDefault();

      document.getElementById("eoi_file_upload_" + with_value_count).classList.remove("ccs-dynaform-hidden");

      document.querySelector('label[for=\'eoi_file_upload_' + with_value_count + '\']').classList.remove("ccs-dynaform-hidden");

      if (with_value_count > 2 ) {
        prev_input = with_value_count - 1;
        document.querySelector('label[for=\'eoi_file_upload_' + prev_input + '\'] a.del').classList.add("ccs-dynaform-hidden");
      }

      with_value_count++;

      if (with_value_count === 5) {
        document.getElementById("ccs_eoi_file_add").classList.add('ccs-dynaform-hidden');
      }

    });

    // delete buttons
    deleteButtons.forEach((db) => {
      db.addEventListener('click', (e) => {

        e.preventDefault();

        let target = db.href.replace(/^(.+\/)(\d{1,2})$/, "$2"),
          prev_box = Number(target) - 1;
        document.getElementById('eoi_file_upload_' + target).value = "";
        document.getElementById('eoi_file_upload_' + target).classList.add("ccs-dynaform-hidden");
        document.getElementById('eoi_file_upload_' + target + '-error').parentNode.removeChild(document.getElementById('eoi_file_upload_' + target + '-error'));
        document.querySelector('label[for=\'eoi_file_upload_' + target + '\']').classList.add("ccs-dynaform-hidden");
        if (prev_box > 1) {
          document.querySelector('label[for=\'eoi_file_upload_' + prev_box + '\'] a.del').classList.remove("ccs-dynaform-hidden");
        }
        document.getElementById("ccs_eoi_file_add").classList.remove('ccs-dynaform-hidden');
        with_value_count--;
      });
    });
  }
});

const ccsZvalidateEoiDocs = (event) => {
  event.preventDefault();

  let fieldCheck = "",
    errorStore = [];

  if (document.getElementById("eoi_file_upload_1").value.length > 0) {
    fieldCheck = ccsZvalidateWithRegex( "eoi_file_upload_1", "Document 1 must be a Word or Acrobat file",         /^(\w|\W)+\.(docx?|pdf)$/);
    if (fieldCheck !== true) errorStore.push(fieldCheck);
  }

  for (var i = 2; i < 5; i++) {
    if (!document.getElementById("eoi_file_upload_" + i).classList.contains('ccs-dynaform-hidden')) {
      fieldCheck = ccsZvalidateWithRegex( "eoi_file_upload_" + i, "Document " + i + " must be a Word or Acrobat file",         /^(\w|\W)+\.(docx?|pdf)$/);
      if (fieldCheck !== true) errorStore.push(fieldCheck);
    }
  }

  if (errorStore.length === 0) document.forms["ccs_eoi_docs_form"].submit();
  else ccsZPresentErrorSummary(errorStore);
};


$('#ccs_collab_view').hide();

let fcaFormURL = "/fca/get-collaborator-detail/js-enabled";


$('#fca_collaborators').on('change', function () {
  let id = this.value;

  if (id !== "") {
    let data = {
      "fca_collaborators": id
    }

    var ajaxRequest = $.post(fcaFormURL, data, function (data) {

      let { userName, firstName, lastName, tel } = data;
      let collegueName = firstName + " " + lastName;
      let id = userName;

      $('#show_collab_name').html(collegueName)
      $('#show_collab_email').html(id)
      $('#show_collab-phone').html(tel)

      $("#fca_collaborator_append").val(id);


    })
      .fail(function () {
        console.log("failed")
      })
      .always(function () {
        console.log("finsihed")
      });
  }
  else {
    $('#show_collab_name').html("")
    $('#show_collab_email').html("")
    $('#show_collab-phone').html("")
  }



});
document.addEventListener('DOMContentLoaded', () => {
    if (document.getElementById("ccs_fca_procurement_lead") !== null) {
        document.getElementById('ccs_fca_procurement_lead').addEventListener('change', function (event) {
            event.preventDefault();
            $.ajax({
                url: "/fca/users-procurement-lead?id=" + event.target.value,
                type: "GET",
                contentType: "application/json",
            }).done(function (result) {
                setUserDetails(result);

            }).fail((res) => {
                let div_email = document.getElementById('lead-email');
                div_email.innerText = '';
                let div_tel = document.getElementById('lead-telephone');
                div_tel.innerText = '';

            })
        });
        const setUserDetails = (user) => {
            let div_email = document.getElementById('lead-email');
            div_email.innerText = user.userName;
            let div_tel = document.getElementById('lead-telephone');
            div_tel.innerText = '1';
            let div_email_value = document.getElementById('fca_procurement_lead_input');
            div_email_value.value = user.userName;

        };
    }
});

$('.add').addClass('ccs-dynaform-hidden');
/**
 * Validate for Selected Services.
 * */
 const ccsFcaSelectedServices = (event) => {
  event.preventDefault();
  let fieldCheck ='';
  let errorStore = [];
    let itemForm = document.getElementById('fca_select_services_form'); 
    let checkBoxes = itemForm.querySelectorAll('input[type="checkbox"]'); 
    let checkError = true;
      checkBoxes.forEach(item => { 
          if (item.checked) {  
            checkError = false;
          }
      });
      if (checkError) {
          fieldCheck = [itemForm.id, 'Minimum one service you have to pick'];
          errorStore.push(fieldCheck);
          ccsZPresentErrorSummary(errorStore);
      }
      else {
        document.forms["fca_select_services_form"].submit();
      }

 };




$(document).ready(function () {

    const checkType = document.getElementById("rfi_offline_document");
    const elems = ['rfi', 'eoi','rfp','ca'];
    let foundElem = false;
    let type, uploadField;
    while (!foundElem && elems.length > 0) {
        type = elems.splice(0,1);
        uploadField = document.getElementById(`${type}_offline_document`);
        foundElem = !!uploadField;
    } 
    
    const FileMimeType = {
        "csv": "text/csv",
        "doc": "application/msword",
        "docx": "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
        "jpg": "image/jpeg",
        "kml": "application/vnd.google-earth.kml+xml",
        "ods": "application/vnd.oasis.opendocument.spreadsheet",
        "odt": "application/vnd.oasis.opendocument.text",
        "pdf": "application/pdf",
        "png": "image/png",
        "ppt": "application/vnd.ms-powerpoint",
        "pptx": "application/vnd.openxmlformats-officedocument.presentationml.presentation",
        "rdf": "application/rdf+xml", 
        "rtf": "application/rtf",
        "txt": "text/plain",
        "xls": "application/vnd.ms-excel",
        "xlsx": "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet", 
        "xml": "text/xml", 
        "zip": "application/x-zip-compressed"
    } 
    
    if (uploadField != null && uploadField != undefined) {
        uploadField.onchange = function () {
            const FileList = this.files;
            const totalFiles = FileList.length;
            let totalFileSum = 0;

            for(var a =0; a < totalFiles; a ++){
                let file = FileList[a];
                totalFileSum = totalFileSum + file.size;
            }
        
            

            const allValidMimeTypes = Object.values(FileMimeType);
            const ErrorCheckArray = [];

            for(const file of FileList){

                const checkFileValidMimeType = allValidMimeTypes.filter(mimeType => mimeType === file.type).length > 0;

                let size = 300000000;
                
                if(file.size >= size){
                ErrorCheckArray.push({
                    type: "size"
                })
                    
                }
                else if(!checkFileValidMimeType){
                    let fileExt = file.name.split(".").pop();
                    fileExt = fileExt?fileExt:undefined;
                    if(fileExt == 'kml'){
                        ErrorCheckArray.push({
                            type: "none"
                        })
                    }else{
                        ErrorCheckArray.push({
                            type: "type"
                        })
                    }
                }
                else{
                ErrorCheckArray.push({
                    type: "none"
                })
                }

            }
            const noError = ErrorCheckArray.every(element => element.type === "none");
            const ErrorForSize = ErrorCheckArray.some(element => element.type === "size");
            const ErrorForMimeType = ErrorCheckArray.some(element => element.type === "type")
            if(noError){
                $(`#${type}_offline_document`).removeClass("govuk-input--error")
                $(`#upload_doc_form`).removeClass("govuk-form-group--error");
                $(`#${type}_offline_document`).val() === "";
                $(`#${type}_upload_error_summary`).text("");
                $(`.doc_upload_button`).show();
            }
            else if(ErrorForSize){
                $(`#${type}_offline_document`).addClass("govuk-input--error")
                $(`#upload_doc_form`).addClass("govuk-form-group--error");
                $(`#${type}_offline_document`).val() === "";
                $(`#${type}_upload_error_summary`).text("Upload size exceeds 300 MB");
                $(`.doc_upload_button`).hide();
            }
            else if(ErrorForMimeType){
                $(`#${type}_offline_document`).addClass("govuk-input--error")
                $(`#upload_doc_form`).addClass("govuk-form-group--error");
                $(`#${type}_offline_document`).val() === "";
                $(`#${type}_upload_error_summary`).text("Only the following document types are permitted: csv, doc, docx, jpg, jpeg, kml, ods, odt, pdf, png, ppt, pptx, rdf, rtf, txt, xls, xlsx, xml, zip");
                $(`.doc_upload_button`).hide();
            }
        
            else{
                $(`#${type}_offline_document`).removeClass("govuk-input--error")
                $(`#upload_doc_form`).removeClass("govuk-form-group--error");
                $(`#${type}_offline_document`).val() === "";
                $(`#${type}_upload_error_summary`).text("");
                $(`.doc_upload_button`).show();

            }


            if (Number(totalFileSum) > 1000000000){
                $(`#${type}_offline_document`).addClass("govuk-input--error")
                $(`#upload_doc_form`).addClass(`govuk-form-group--error`);
                $(`#${type}_offline_document`).val() === "";
                $(`#${type}_upload_error_summary`).text(`Total Files Size cannot exceed 1 GB`);
                $(`.doc_upload_button`).hide();
            }


        }
    }
});


/*************************************************************************
 * Client-side validation for GDS form elements:
 * Validate against a regex (text or file inputs);
 * Radio buttons and checkboxes;
 * Date (is the input date a valid date);
 * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * *
 * Add and remove error messages from GDS form elements.
 ************************************************************************/

/**
 * Validate that input value matches the supplied regex.
 * Works with text, number and file inputs (make sure the
 * 'accepts' attribute is set for files).
 */
//debugger;
const ccsZvalidateWithRegex = (elementName, errMsg, typeRegex, valid = true) => {
  const element = document.getElementById(elementName);
  // let tempval =  element.closest('div').find("div[id='rfp_resource_start_date']");
  // console.log(tempval.classList)

  if (element != null && element != undefined) {
    if (element.value != undefined && element.value != null &&  element.value.trim().match(typeRegex) && valid) {
      ccsZremoveErrorMessage(element);
      return true;
    } else {
      ccsZremoveErrorMessage(element);
      ccsZaddErrorMessage(element, errMsg);
      return [element.id, errMsg];
    }
  }
};

/**
 * Validate that a textarea cointains a value
 */
const ccsZvalidateTextArea = (elementName, errMsg, valid = true) => {
 
  const pageHeading = document.getElementById('page-heading').innerHTML;
  
  if (!(pageHeading.includes("(Optional)") && !pageHeading.includes("(optional)"))) {
    const element = document.getElementById(elementName);
    
    if (element != undefined && element != null && element.value && element.value.trim().length > 0 && valid) {
      
      ccsZremoveErrorMessage(element);
      return true;
    }
    else if (element != undefined && element != null) {
      
      ccsZaddErrorMessage(element, errMsg);
      return [element.id, errMsg];
    }else{
      console.log("FINAL ERROR");
    }
  }else{
    console.log("VADA FINAL ERROR");
  }
};




/**
 * Validate that one checkbox or radio button in a set has been selected
 */

const ccsZisOptionCheckedForVetting = (elementName, errMsg) => {
  const element = document.getElementById(elementName);


  let checkForAllVettingRadioFields = $('.ccs_vetting').is(':checked');
  let gotACheck = false,
    containingDiv = ".govuk-checkboxes";

  if (!checkForAllVettingRadioFields) {
    gotACheck = false;

  }
  else {
    gotACheck = true;
  }
  if (element != undefined && element != null) {
    if (element.type === "radio") containingDiv = ".govuk-radios";

    if (gotACheck) ccsZremoveErrorMessage(element);
    else ccsZaddErrorMessage(element, errMsg)

    if (gotACheck) return true;
    else return [element.id, errMsg];
  }
}





const ccsZisOptionChecked = (elementName, errMsg) => {
  const element = document.getElementById(elementName);

  let gotACheck = false,
    containingDiv = ".govuk-checkboxes";

  if (element != undefined && element != null) {
    if (element.type === "radio") containingDiv = ".govuk-radios";

    let theOptions = element.closest(containingDiv).querySelectorAll('input');

    theOptions.forEach((opt) => {
      if (opt.checked) gotACheck = true;
    });

    if (gotACheck) ccsZremoveErrorMessage(element);
    else ccsZaddErrorMessage(element, errMsg)

    if (gotACheck) return true;
    else return [element.id, errMsg];

  }

}

/**
 * Simple date validation. Can a Date object be created successfully
 * using the supplied data and is it in the past or future as
 * specified by the 'direction' param?
 * If yes, we've passed validation.
 *
 * If there's a time assosiated with this date, it will be included in the
 * validation if the field is named elementName + '_time'
 *
 * @direction: -1 = date must be past, 0 = any valid date, 1 = date must
 *  be in the future
 * @offset: number of days in the future the date must be (only works for
 *  future dates, set as '0' otherwise)
 */
const ccsZvalidateThisDate = (elementName, errMsg, direction, offset) => {
  const element = document.getElementById(elementName);

  let theDay = parseInt(document.getElementById(element.id + "-day").value.trim()),
    theMonth = parseInt(document.getElementById(element.id + "-month").value.trim()),
    theYear = document.getElementById(element.id + "-year").value.trim(),
    timeField = document.getElementById(elementName + "_time"),
    timeString = "",
    dayPrepend = "",
    monthPrepend = "",
    isValidDate = false;

  if (theDay < 10) dayPrepend = "0";
  if (theMonth < 10) monthPrepend = "0";
  if (timeField !== null) timeString = timeField.value;
  else timeString = "00:01";

  // create a new date object from the submitted data
  let dateString = theYear + "-" + monthPrepend + theMonth + "-" + dayPrepend + theDay + "T" + timeString + ":00";
  let submittedDate = new Date(dateString);

  // first off, is it a valid date?
  isValidDate = !isNaN(submittedDate.getTime());

  // if it is a valid date, is it 'past', 'future' or 'don't mind'?
  if (isValidDate && direction === 0) {
    ccsZremoveErrorMessage(element);
  } else if (isValidDate) {

    let nowDate = new Date(),
      testMonth = nowDate.getMonth() + 1,
      testDay = nowDate.getDate(),
      testHours = nowDate.getHours(),
      testMins = nowDate.getMinutes();

    if (testMonth < 10) testMonth = "0" + testMonth;
    if (testDay < 10) testDay = "0" + testDay;
    if (testHours < 10) testHours = "0" + testHours;
    if (testMins < 10) testMins = "0" + testMins;

    let relativeTestDate = new Date(nowDate.getFullYear() + "-" + testMonth + "-" + testDay + "T" + testHours + ":" + testMins + ":00"),
      testTime = 0;

    if (direction > 0 && offset > 0) {
      let offsetTime = 86400000 * offset;
      testTime = relativeTestDate.getTime() + offsetTime;
    } else {
      testTime = relativeTestDate.getTime();
    }
    
    if ((direction < 0 && submittedDate.getTime() < testTime) || (direction > 0 && submittedDate.getTime() > testTime)) {
     
      ccsZremoveErrorMessage(element);
    } else {
      
      ccsZaddErrorMessage(element, errMsg);
      return [element.id, errMsg];
    }

  } else {
    
    ccsZaddErrorMessage(element, errMsg);
  }

  if (isValidDate) return true;
  else return [element.id, errMsg];

};

/**
 * Remove an error message from around an element (if it's present)
 * @param {object} element - DOM element from which to remove the
 * error message.
 */
const ccsZremoveErrorMessage = (element) => {

  if (element !=null && document.getElementById(element.id + "-error") !== null) {
    
    element.closest('.govuk-form-group').classList.remove('govuk-form-group--error');
    if (element.tagName === "TEXTAREA") {
      element.closest('.govuk-textarea').classList.remove('govuk-textarea--error');
    }
    if (element.tagName === "INPUT") {
      element.classList.remove("govuk-input--error");
    } else {
      let childInputs = element.querySelectorAll('input');
      childInputs.forEach((child_i) => {
        child_i.classList.remove("govuk-input--error");
      });
    }

    document.getElementById(element.id + "-error").remove();
  }

};

/**
 * Add an error message around an element, if not already present
 *  - adds 'error' classes to the 'form group' and the input and
 * inserts an error message element
 * @param {object} element - DOM element to add the error message to
 * @param {string} message - the error message
 */
const ccsZaddErrorMessage = (element, message) => {
  

  if (element != undefined && element != null && document.getElementById(element.id + "-error") === null) {
    element.closest('.govuk-form-group').classList.add('govuk-form-group--error');

    if (element.tagName === "INPUT" && (element.type !== "radio" || element.type !== "checkbox")) {
      element.classList.add("govuk-input--error");
    } else {
      let childInputs = element.querySelectorAll('input');
      childInputs.forEach((child_i) => {
        child_i.classList.add("govuk-input--error");
      });
    }
    if (element.tagName === "TEXTAREA" && (element.type !== "radio" || element.type !== "checkbox")) {
      element.classList.add("govuk-textarea--error");
    } else {
      let childInputs = element.querySelectorAll('textarea');
      childInputs.forEach((child_i) => {
        child_i.classList.add("govuk-textarea--error");
      });
    }

    errorEl = ccsZcreateCcsErrorMsg(element.id, message);

    if (element.type === "radio") {
      element.closest(".govuk-radios").insertBefore(errorEl, element.parentNode);
    } else if (element.type === "checkbox") {
      element.closest(".govuk-checkboxes").insertBefore(errorEl, element.parentNode);
    } else if (element.parentNode.classList.contains("govuk-input__wrapper")) {
      element.closest(".govuk-form-group").insertBefore(errorEl, element.parentNode);
    } else {
      element.parentNode.insertBefore(errorEl, element);
    }
  }
};

/*
 * Helper to create an error message span that can be inserted
 * above the erroring input
 */
const ccsZcreateCcsErrorMsg = (elName, message) => {

  let errorElement = document.createElement("span");
  errorElement.id = elName + "-error";
  errorElement.className = "govuk-error-message";
  errorElement.innerHTML = '<span class="govuk-visually-hidden">Error:</span>';

  let errorMessage = document.createTextNode(" " + message);
  errorElement.appendChild(errorMessage);

  return errorElement;
};

/*
 * Create an 'error summary box', populate it with the messages in
 * errorStore and scroll to the top of the page.
 */
const ccsZPresentErrorSummary = (errorStore) => {
  // remove the error summary if its there
  const existingSummary = document.querySelector(".govuk-error-summary");
  if (existingSummary !== null) existingSummary.parentNode.removeChild(existingSummary);
  if(errorStore){
  // create the div
  let errSummaryBox = document.createElement("div"),
    errSummaryBody = document.createElement("div"),
    errSummaryList = document.createElement("ul");

  errSummaryBox.className = "govuk-error-summary";
  errSummaryBody.className = "govuk-error-summary__body";
  errSummaryList.classList.add("govuk-list", "govuk-error-summary__list");

  errSummaryBox.innerHTML = '<h2 class="govuk-error-summary__title" id="error-summary-title">There is a problem </h2>';

  errSummaryBox.setAttribute("aria-labelledby", "error-summary-title");
  errSummaryBox.setAttribute("role", "alert");
  errSummaryBox.setAttribute("tabindex", "-1");
  errSummaryBox.setAttribute("data-module", "govuk-error-summary");

  // Add the error messages
 
  errorStore.forEach((errDetail) => {
    if(errDetail != undefined && errDetail != ''){
      if(errDetail != true) {
        let errListItem = document.createElement("li"),
        errAnchorItem = document.createElement("a")
        let errItemText = document.createTextNode(errDetail[1]);

        errAnchorItem.setAttribute("href", "#" + errDetail[0]);
        errAnchorItem.appendChild(errItemText);

        errListItem.appendChild(errAnchorItem);

        errSummaryList.appendChild(errListItem);
      }
    }
    
  });
 

  // add the errors to the box
  errSummaryBody.appendChild(errSummaryList);
  errSummaryBox.appendChild(errSummaryBody);

  // and finally, insert the error summary box into the page
  document.querySelector(".govuk-heading-xl").parentNode.insertBefore(errSummaryBox, document.querySelector(".govuk-heading-xl"));
  window.scrollTo(0, 0);
}
};

/**
 * Validate that a weightage input limit
 */


const ccsZvalidateWeihtageValue = (elementName, errMsg, totalvalue, typeRegex, valid = true) => {
  const element = document.getElementById(elementName);

  if (element != null && element != undefined) {
    if (element.value != undefined && element.value != null &&  totalvalue == 100 && valid) {
      ccsZremoveErrorMessage(element);
      return true;
    } else {
      ccsZremoveErrorMessage(element);
      ccsZaddErrorMessage(element, errMsg);
      return [element.id, errMsg];
    }
  }
};

const ccsZvalidateDateWithRegex = (elementName,addElementName, errMsg, typeRegex, valid = true) => {
  const element = document.getElementById(elementName);
  const addelement = document.getElementById(addElementName);
  // let tempval =  element.closest('div').find("div[id='rfp_resource_start_date']");
  // console.log(tempval.classList)

  if (element != undefined && element != null) {
    if (element.value != undefined && element.value != null &&  element.value.trim().match(typeRegex) && valid) {
      ccsZremoveErrorMessage(element);
      return true;
    } else {
      ccsZremoveErrorMessage(element);
      ccsZaddDateErrorMessage(element,addelement, errMsg);
      return [element.id, errMsg];
    }
  }
};

const ccsZaddDateErrorMessage = (element,addelement, message) => {
  

  if (element != undefined && element != null && document.getElementById(element.id + "-error") === null) {
    element.closest('.govuk-form-group').classList.add('govuk-form-group--error');

    if (element.tagName === "INPUT" && (element.type !== "radio" || element.type !== "checkbox")) {
      element.classList.add("govuk-input--error");
    } else {
      let childInputs = element.querySelectorAll('input');
      childInputs.forEach((child_i) => {
        child_i.classList.add("govuk-input--error");
      });
    }
    if (element.tagName === "TEXTAREA" && (element.type !== "radio" || element.type !== "checkbox")) {
      element.classList.add("govuk-textarea--error");
    } else {
      let childInputs = element.querySelectorAll('textarea');
      childInputs.forEach((child_i) => {
        child_i.classList.add("govuk-textarea--error");
      });
    }

    errorEl = ccsZcreateCcsErrorMsg(addelement.id, message);

    if (element.type === "radio") {
      element.closest(".govuk-radios").insertBefore(errorEl, element.parentNode);
    } else if (element.type === "checkbox") {
      element.closest(".govuk-checkboxes").insertBefore(errorEl, element.parentNode);
    } else if (element.parentNode.classList.contains("govuk-input__wrapper")) {
      element.closest(".govuk-form-group").insertBefore(errorEl, element.parentNode);
    } else {
      addelement.parentNode.insertBefore(errorEl, addelement);
    }
  }
};


function initializeErrorStoreForFieldCheck(event) {
  event.preventDefault();
  let fieldCheck = "", errorStore = [];
  return { fieldCheck, errorStore };
}

function getGroup (event) {
  return decodeURI(event.currentTarget.action.match(/(\?|&)group_id\=([^&]*)/)[2]);
}

const ccsZvalidateIR35acknowledgement = (event) => {
  let { fieldCheck, errorStore } = initializeErrorStoreForFieldCheck(event);

  fieldCheck = ccsZisOptionChecked( "IR35_acknowledgement", "Please select an option");
  if (fieldCheck !== true) errorStore.push(fieldCheck);

  if (errorStore.length === 0) document.forms["ccs_ir35_acknowledgement_form"].submit();
  else ccsZPresentErrorSummary(errorStore);
}

const ccsZvalidateCompetitionRoute = (event) => {
  let { fieldCheck, errorStore } = initializeErrorStoreForFieldCheck(event);
  fieldCheck = ccsZisOptionChecked( "ccs_route_to_market", "Please select an option");
  if (fieldCheck !== true) errorStore.push(fieldCheck);

  if (errorStore.length === 0) document.forms["ccs_route_to_market_form"].submit();
  else ccsZPresentErrorSummary(errorStore);
}

const ccsZvalidateBuildType= (event) => {
  let { fieldCheck, errorStore } = initializeErrorStoreForFieldCheck(event);
  fieldCheck = ccsZisOptionChecked( "ccs_fc_type", "Please select an option");
  if (fieldCheck !== true) errorStore.push(fieldCheck);

  if (errorStore.length === 0) document.forms["ccs_rfp_type_form"].submit();
  else ccsZPresentErrorSummary(errorStore);
}

const ccsZvalidateProjectPhase = (event) => {
  let { fieldCheck, errorStore } = initializeErrorStoreForFieldCheck(event);
  fieldCheck = ccsZisOptionChecked( "ccs_rfp_project_phase", "Please select an option");
  if (fieldCheck !== true) errorStore.push(fieldCheck);

  if (errorStore.length === 0) document.forms["ccs_rfp_project_phase_form"].submit();
  else ccsZPresentErrorSummary(errorStore);
}

const ccsZvalidateRfiSecurity = (event) => {
  let { fieldCheck, errorStore } = initializeErrorStoreForFieldCheck(event);
  fieldCheck = ccsZisOptionCheckedForVetting( "ccs_vetting_type", "You must provide a security clearance level before proceeding");
  if (fieldCheck !== true) errorStore.push(fieldCheck);

  if (errorStore.length === 0) document.forms["ccs_rfi_vetting_form"].submit();
  else ccsZPresentErrorSummary(errorStore);
};

const ccsZvalidateEoiSecurity = (event) => {
  let { fieldCheck, errorStore } = initializeErrorStoreForFieldCheck(event);
  const msg = (getGroup(event) === 'Group 6') ? "Please select an option" : "You must choose one option from list before proceeding";
  fieldCheck = ccsZisOptionChecked("ccs_vetting_type", msg);
  if (fieldCheck !== true) errorStore.push(fieldCheck);
  if ($('#rfp_security_confirmation') !== undefined && $('#rfp_security_confirmation').val() !== undefined && $("input[name='ccs_vetting_type']").prop('checked')) {
    // errorStore.length = 0;
    
    if ($('#rfp_security_confirmation').val().length === 0) {
      fieldCheck = ccsZvalidateTextArea('rfp_security_confirmation', 'Provide the name of the incumbent supplier');
      if (fieldCheck !== true) errorStore.push(fieldCheck);
    }
    else if ($('#rfp_security_confirmation').val().length > 500) {
      fieldCheck = ccsZvalidateTextArea('rfp_security_confirmation', 'supplier name must be less than 500 characters');
      if (fieldCheck !== true) errorStore.push(fieldCheck);
    }
  }

  if (errorStore.length === 0) document.forms["ccs_eoi_vetting_form"].submit();
  else ccsZPresentErrorSummary(errorStore);
};

const ccsZvalidateRfpSecurity = (event) => {
  let { fieldCheck, errorStore } = initializeErrorStoreForFieldCheck(event);
  fieldCheck = ccsZisOptionChecked( "ccs_rfp_vetting_type", "You must provide a security clearance level before proceeding");
  if (fieldCheck !== true) errorStore.push(fieldCheck);

  if (errorStore.length === 0) document.forms["ccs_rfp_vetting_form"].submit();
  else ccsZPresentErrorSummary(errorStore);
};

const ccsZvalidateCaaAssFCSecurity = (event) => {
  let { fieldCheck, errorStore } = initializeErrorStoreForFieldCheck(event);
  fieldCheck = ccsZisOptionChecked("ccs_vetting_type", "Enter your team scale");
  if (fieldCheck !== true) errorStore.push(fieldCheck);

  if (errorStore.length === 0) document.forms["ccs_ca_type_form"].submit();
  else ccsZPresentErrorSummary(errorStore);
};

const ccsZvalidateRfiType = (event) => {
  let { fieldCheck, errorStore } = initializeErrorStoreForFieldCheck(event);

  fieldCheck = ccsZisOptionChecked( "ccs_rfi_type", "Select an option");
  if (fieldCheck !== true) errorStore.push(fieldCheck);

  if (errorStore.length === 0) document.forms["ccs_rfi_type_form"].submit();
  else ccsZPresentErrorSummary(errorStore);
};

const ccsZvalidateEoiType = (event) => {
  let { fieldCheck, errorStore } = initializeErrorStoreForFieldCheck(event);

  fieldCheck = ccsZisOptionChecked( "ccs_eoi_type", "Select an option");
  if (fieldCheck !== true) errorStore.push(fieldCheck);

  if (errorStore.length === 0) document.forms["ccs_eoi_type_form"].submit();
  else ccsZPresentErrorSummary(errorStore);
};

const ccsZvalidateEoiServiceType = (event) => {
  let { fieldCheck, errorStore } = initializeErrorStoreForFieldCheck(event);
  fieldCheck = ccsZisOptionChecked( "eoi_service_type", "Please select an option");
  if (fieldCheck !== true) errorStore.push(fieldCheck);

  if (errorStore.length === 0) document.forms["ccs_eoi_new_form"].submit();
  else ccsZPresentErrorSummary(errorStore);
}

const ccsZvalidatePreMarketRoute = (event) => {
  let { fieldCheck, errorStore } = initializeErrorStoreForFieldCheck(event);
  fieldCheck = ccsZisOptionChecked( "choose_pre_engage", "Please select an option");
  if (fieldCheck !== true) errorStore.push(fieldCheck);

  if (errorStore.length === 0) document.forms["ccs_choose_pre_engage"].submit();
  else ccsZPresentErrorSummary(errorStore);
}
$('input[type=radio]').click(function () {
  // to uncheck new and other names dynamically
  let clicked = this;
  $('input:radio').each(function () {
    if (clicked.value == 'new') {
      if ($(this).is(':checked') && this.value != 'new') {
        $("input[type='radio']").prop('checked', false);
      } else {
        $("input[type='radio']").prop('checked', true);
      }
      clicked.checked = true;
    } else {
      if ($(this).is(':checked') && this.value == 'new') {
        $("input[type='radio']").prop('checked', false);
        clicked.checked = true;
      }
    }
  });

  // to show and hide the new search name input filed while clicking new
  if (clicked.value == 'new' && clicked.checked == true) {
    $('#g_cloud_new_search_name').removeClass('govuk-!-display-none')
  } else {
    $('#g_cloud_new_search_name').addClass('govuk-!-display-none')
  }
});

// to hide the new search name input filed on load
document.addEventListener('DOMContentLoaded', () => {
  if(document.getElementById('g_cloud_new_search_name') !== null) {
    let newInputValue = document.getElementById('g_cloud_new_search_name').checked;
    if (newInputValue) {
      $('#g_cloud_new_search_name').removeClass('govuk-!-display-none')
    } else {
      $('#g_cloud_new_search_name').addClass('govuk-!-display-none')
    }
  }
});

const weight_staff = [
  'weight_staff_1SoftwareDeveloper',
  'weight_staff_2DevOps',
  'weight_staff_3SecurityArchitect',
  'weight_staff_4InfrastructureEngineer',
  'weight_staff_5NetworkArchitect',
  'weight_staff_6TechnicalArchitect',
  'weight_staff_7DataArchitect',
  'weight_staff_1PerformanceAnalyst',
  'weight_staff_4DataScientist',
  'weight_staff_2DataEngineer',
  'weight_staff_3DataAnalyst',
  'weight_staff_1Delivery',
  'weight_staff_2BusinessAnalysis',
  'weight_staff_7ApplicationsOperations',
  'weight_staff_2BusinessRelationshipManager',
  'weight_staff_3ITServiceManager',
  'weight_staff_1ChangeandReleaseManager',
  'weight_staff_5EngineerInfrastructure',
  'weight_staff_8ServiceTransitionManager',
  'weight_staff_4TechnicalWriter',
  'weight_staff_3ProductManager',
  'weight_staff_5ContentDesigner',
  'weight_staff_9ServiceDeskManager',
  'weight_staff_2Delivery',
  'weight_staff_1BusinessAnalysis',
  'weight_staff_10ProblemManager',
  'weight_staff_11IncidentManager',
  'weight_staff_1GraphicInteractionDesigner',
  'weight_staff_2ServiceDesigner',
  'weight_staff_3UserResearcher',
  'weight_staff_4EngineerEndUser',
  'weight_staff_3ProductManager',
  'weight_staff_6CommandandControl',
  'weight_staff_1UserResearcher',
  'weight_staff_3TechnicalWriter',
  'weight_staff_4ServiceDesigner',
  'weight_staff_5GraphicInteractionDesigner',
  'weight_staff_1TestEngineer',
  'weight_staff_2TestManager',
  'weight_staff_3QATAnalyst',
  'weight_staff_1CommandandControl',
  'weight_staff_2ApplicationsOperations',
  'weight_staff_3IncidentManager',
  'weight_staff_4EngineerInfrastructure',
  'weight_staff_5ServiceDeskManager',
  'weight_staff_6BusinessRelationshipManager',
  'weight_staff_7ProblemManager',
  'weight_staff_8ITServiceManager',
  'weight_staff_9EngineerEndUser',
  'weight_staff_10ServiceTransitionManager',
  'weight_staff_11ChangeandReleaseManager',
  'weight_staff_1TechnicalArchitect',
  'weight_staff_2DataArchitect',
  'weight_staff_3NetworkArchitect',
  'weight_staff_4SoftwareDeveloper',
  'weight_staff_5DevOps',
  'weight_staff_6SecurityArchitect',
  'weight_staff_7InfrastructureEngineer',
  'weight_staff_1DataScientist',
  'weight_staff_2PerformanceAnalyst',
  'weight_staff_2PerformanceAnalyst',
  'weight_staff_3DataEngineer',
  'weight_staff_4DataAnalyst'
]

const weight_vetting = ['weight_vetting_1SoftwareDeveloper',
  'weight_vetting_2DevOps',
  'weight_vetting_3SecurityArchitect',
  'weight_vetting_4InfrastructureEngineer',
  'weight_vetting_5NetworkArchitect',
  'weight_vetting_6TechnicalArchitect',
  'weight_vetting_7DataArchitect',
  'weight_vetting_1TestEngineer',
  'weight_vetting_2TestManager',
  'weight_vetting_3QATAnalyst',
  'weight_vetting_1PerformanceAnalyst',
  'weight_vetting_2DataEngineer',
  'weight_vetting_3DataAnalyst',
  'weight_vetting_4DataScientist',
  'weight_vetting_1ChangeandReleaseManager',
  'weight_vetting_2BusinessRelationshipManager',
  'weight_vetting_3ITServiceManager',
  'weight_vetting_4EngineerEndUser',
  'weight_vetting_5EngineerInfrastructure',
  'weight_vetting_6CommandandControl',
  'weight_vetting_7ApplicationsOperations',
  'weight_vetting_8ServiceTransitionManager',
  'weight_vetting_9ServiceDeskManager',
  'weight_vetting_10ProblemManager',
  'weight_vetting_11IncidentManager'
]


const ccsTabMenuNaviation = () => {
  var tabLinks = document.querySelectorAll('.ons-list__item');
  var tabContainer = document.getElementById('vertical_tab_nav');
  if (tabLinks != undefined && tabLinks != null && tabLinks.length > 0) {


    tabLinks[0].getElementsByTagName('a')[0].classList.add('selected');
    const elems = tabContainer.getElementsByTagName('article');
    for (var i = 0; i < elems.length; i++) {
      if (i === 0) {
        elems[i].style.display = 'block';
      } else {
        elems[i].style.display = 'none';
      }
    }
    Array.from(tabLinks).forEach(link => {
      link.addEventListener('click', function (e) {
        let currentTarget = e.currentTarget;
        let clicked_index = $(this).index();
        $('#vertical_tab_nav > div > aside > nav > ol > li > a').removeClass("selected");
        currentTarget.getElementsByTagName('a')[0].classList.add('selected')
        $('#vertical_tab_nav > div > article').css('display', 'none');
        $('#vertical_tab_nav > div > article').eq(clicked_index).fadeIn();
        $(this).blur();
        return false;
      });

    });
  }
};
let staffs = [];
let vettings = [];
let staffIDs = [];
let vettingIDs = [];
$('#redirect-button-vetting').on('click', function () {
  staffIDs.length = 0;
});

document.addEventListener('DOMContentLoaded', () => {
  if (document.getElementById("ccs_ca_menu_tabs_form_later") !== null) {
    let inputs;
    let container;
    let oldIdName = '';
    let oldIdValue = '';
    let repeated = false;
    //const total_resources = document.getElementById('total-resources');
    const total_staffs = document.getElementById('total-staff');
    const total_vettings = document.getElementById('total-vetting');
    container = document.getElementById('ccs_ca_menu_tabs_form_later');
    inputs = container.getElementsByTagName('input');

    let values = [];
    let keys = [];
    for (let index = 0; index < inputs.length; ++index) {
      if(inputs[index].type!='hidden'){
      // inputs[index].value = '';
      inputs[index].addEventListener('focus', function (e) {
        oldIdName = e.currentTarget.id;
        oldIdValue = e.currentTarget.value;
      }, true);
      inputs[index].addEventListener('change', function (event) {
        event.preventDefault();
        let indx = 0;
        if (weight_staff.includes(event.currentTarget.id)) {
          repeated = false;

          if (staffIDs.length !== 0) {
            keys = Object.keys(staffIDs[0]);
            repeated = keys.find(key => {
              if (key === event.currentTarget.id) {
                return key;
              }
            });
          }
          if (repeated === undefined) repeated = false;
          // if there is not repeated element
          if (staffIDs.length === 0 || (repeated !== event.currentTarget.id && !repeated)) {
            const idName = event.currentTarget.id;
            staffIDs.push({ [idName]: event.currentTarget.value });
            //values = Object.values(staffIDs[0]);
            //keys = Object.keys(staffIDs[0]);
            total_staffs.innerHTML = staffIDs.reduce((acc, value, i) => {
              if (staffIDs.length === 1) indx = i + 1;

              console.log('the indx ', Object.values(staffIDs.slice(-1)[0])[0])
              let v = Object.values(staffIDs.slice(-1)[0])[0];
              return (parseInt(acc) + parseInt(v));
            }, 0);
          } else {
            //  if there is repeated element
            const idName = event.currentTarget.id;
            staffIDs.splice(-1, 1, { [idName]: event.currentTarget.value });
            total_staffs.innerHTML = staffIDs.reduce((acc, value, i) => {
              // console.log(Object.values(value)[staffIDs.length - indx])
              //if (staffIDs.length === 1) indx = i + 1;

              let v = Object.values(staffIDs.slice(-1)[0])[0];
              // if (oldIdName === idName && staffIDs.length >= 2) {
              //   oldIdValue = 0;
              // }
              if (i > 1) oldIdValue = 0;
              return ((parseInt(acc) - Number(oldIdValue)) + parseInt(v));
            }, 0);
          }
        }
      })
    }
  }
  if (document.getElementById("ccs_da_menu_tabs_form_later") !== null) {
    let inputs;
    let container;
    let oldIdName = '';
    let oldIdValue = '';
    let repeated = false;
    //const total_resources = document.getElementById('total-resources');
    const total_staffs = document.getElementById('total-staff');
    const total_vettings = document.getElementById('total-vetting');
    container = document.getElementById('ccs_da_menu_tabs_form_later');
    inputs = container.getElementsByTagName('input');

    let values = [];
    let keys = [];
    for (let index = 0; index < inputs.length; ++index) {
      if(inputs[index].type!='hidden'){
      // inputs[index].value = '';
      inputs[index].addEventListener('focus', function (e) {
        oldIdName = e.currentTarget.id;
        oldIdValue = e.currentTarget.value;
      }, true);
      inputs[index].addEventListener('change', function (event) {
        event.preventDefault();
        let indx = 0;
        if (weight_staff.includes(event.currentTarget.id)) {
          repeated = false;

          if (staffIDs.length !== 0) {
            keys = Object.keys(staffIDs[0]);
            repeated = keys.find(key => {
              if (key === event.currentTarget.id) {
                return key;
              }
            });
          }
          if (repeated === undefined) repeated = false;
          // if there is not repeated element
          if (staffIDs.length === 0 || (repeated !== event.currentTarget.id && !repeated)) {
            const idName = event.currentTarget.id;
            staffIDs.push({ [idName]: event.currentTarget.value });
            //values = Object.values(staffIDs[0]);
            //keys = Object.keys(staffIDs[0]);
            total_staffs.innerHTML = staffIDs.reduce((acc, value, i) => {
              if (staffIDs.length === 1) indx = i + 1;

              console.log('the indx ', Object.values(staffIDs.slice(-1)[0])[0])
              let v = Object.values(staffIDs.slice(-1)[0])[0];
              return (parseInt(acc) + parseInt(v));
            }, 0);
          } else {
            //  if there is repeated element
            const idName = event.currentTarget.id;
            staffIDs.splice(-1, 1, { [idName]: event.currentTarget.value });
            total_staffs.innerHTML = staffIDs.reduce((acc, value, i) => {
              // console.log(Object.values(value)[staffIDs.length - indx])
              //if (staffIDs.length === 1) indx = i + 1;

              let v = Object.values(staffIDs.slice(-1)[0])[0];
              // if (oldIdName === idName && staffIDs.length >= 2) {
              //   oldIdValue = 0;
              // }
              if (i > 1) oldIdValue = 0;
              return ((parseInt(acc) - Number(oldIdValue)) + parseInt(v));
            }, 0);
          }
        }
      })
    }
    }}
}

});

$('#ccs_collab_view').hide();

let rfiFormURL = "/rfi/get-collaborator-detail/js-enabled";


$('#rfi_collaborators').on('change', function () {
  let id = this.value;

  if (id !== "") {
    let data = {
      "rfi_collaborators": id
    }

    var ajaxRequest = $.post(rfiFormURL, data, function (data) {

      let { userName, firstName, lastName, tel } = data;
      let collegueName = firstName + " " + lastName;
      let id = userName;

      $('#show_collab_name').html(collegueName)
      $('#show_collab_email').html(id)
      $('#show_collab-phone').html(tel)

      $("#rfi_collaborator_append").val(id);
      $('#ccs_collab_add').prop("disabled", false)

    })
      .fail(function () {
        console.log("failed")
      })
      .always(function () {
        console.log("finsihed")
      });
  }
  else {
    $('#show_collab_name').html("")
    $('#show_collab_email').html("")
    $('#show_collab-phone').html("")
    $('#ccs_collab_add').prop("disabled", true)
  }



});

if ($('#rfi_keyterm').length > 0) {
  $('.rfi_form').attr('id', 'ccs_rfi_acronyms_form');
  $('.rfi_form').attr('name', 'ccs_rfi_acronyms_form');
}

const buttonTermsHidden = () => {
  //Reload patch update
  var allGo = document.querySelectorAll(".term_acronym_fieldset");
  var countButtonHide = 0;
  for (var i=0, max=allGo.length; i < max; i++) {
      let classStage = allGo[i].getAttribute('class');
      let classArr = classStage.split(" ");
      let findClass = classArr.filter(el => el === 'ccs-dynaform-hidden');
      if(findClass.length > 0) {
        countButtonHide =+ countButtonHide + 1
      }
  }
  if(countButtonHide == 0) {
    if(document.getElementById("ccs_rfiTerm_add") !== null) {
      document.getElementById("ccs_rfiTerm_add").classList.add('ccs-dynaform-hidden');
    }
  }
}

let rfi_term_def = document.querySelectorAll('.rfitermdef');
rfi_term_def.forEach(ele => {
  ele.addEventListener('keydown', (event) => {
    removeErrorFields();
  });
}); 
let rfitermtext = document.querySelectorAll('.rfitermtext');
rfitermtext.forEach(ele => {
  ele.addEventListener('keydown', (event) => {
    removeErrorFields();
  });
});
const urlParams = new URLSearchParams(window.location.search);
const agrement_id = urlParams.get('agreement_id');
document.addEventListener('DOMContentLoaded', () => {
  

  if (document.getElementById("ccs_rfi_acronyms_form") !== null) {
    let with_value_count;
    let total_count;
    let total_count_index;
    let prev_input;
    let deleteButtons;
    if(agrement_id == 'RM1557.13' || agrement_id == 'RM6187'){
      with_value_count = 20;
      total_count = 20;
      total_count_index = 21;
      prev_input = 0;
      deleteButtons = document.querySelectorAll("a.del");
    }else{
      with_value_count = 10;
      total_count = 10;
      total_count_index = 11;
      prev_input = 0;
      deleteButtons = document.querySelectorAll("a.del");
    }
    
    let clearFieldsButtons = document.querySelectorAll("a.clear-fields");
    // document.getElementById("rfi_term_1").addEventListener('input', ccsZCountRfiTerms);
    document.getElementById("rfi_term_definition_1").addEventListener('input', ccsZCountRfiAcronyms);
    for (var acronym_fieldset = total_count; acronym_fieldset >= 1; acronym_fieldset--) {


      let this_fieldset = document.querySelector(".acronym_" + acronym_fieldset),
        term_box = document.getElementById("rfi_term_" + acronym_fieldset);
        term_box.addEventListener('input', ccsZCountRfiTerms);

        acronym_box = document.getElementById("rfi_term_definition_" + acronym_fieldset);
        acronym_box.addEventListener('input', ccsZCountRfiAcronyms);

        if (acronym_fieldset === 1) {
          this_fieldset.classList.remove('ccs-dynaform-hidden');
        }
        else{
      if (term_box.value !== "") {
        this_fieldset.classList.remove('ccs-dynaform-hidden');

        if (acronym_fieldset === total_count) {
          document.getElementById("ccs_rfiTerm_add").classList.add('ccs-dynaform-hidden');
        }

      } else {

        this_fieldset.classList.add('ccs-dynaform-hidden');
        with_value_count = acronym_fieldset;
      }
    }
    }
    document.getElementById("ccs_rfiTerm_add").classList.remove("ccs-dynaform-hidden");


    document.getElementById("ccs_rfiTerm_add").addEventListener('click', (e) => {
      


      $('.govuk-form-group textarea').removeClass('govuk-textarea--error');
      checkFields();


      e.preventDefault();
      errorStore = emptyFieldCheck('add_more');
      if (errorStore.length == 0) {

        removeErrorFields();


        document.querySelector(".acronym_" + with_value_count).classList.remove("ccs-dynaform-hidden");

        if (with_value_count > 2) {
          prev_input = with_value_count - 1;
          //document.querySelector(".acronym_" + prev_input + " a.del").classList.add("ccs-dynaform-hidden");
        }

        with_value_count++;

        if (with_value_count === total_count_index) {
          document.getElementById("ccs_rfiTerm_add").classList.add('ccs-dynaform-hidden');
        }



      }
      else ccsZPresentErrorSummary(errorStore);
    });

    // delete buttons
    deleteButtons.forEach((db) => {
      db.classList.remove('ccs-dynaform-hidden')
      db.addEventListener('click', (e) => {

        e.preventDefault();
       // debugger;
        let target = db.href.replace(/^(.+\/)(\d{1,2})$/, "$2"),
          prev_coll = Number(target) - 1,
          target_fieldset = db.closest("fieldset");

          for (var k=1;k<=total_count;k++)
          {
            document.getElementById("rfi_label_term_"+k).innerText="";
            document.getElementById("rfi_label_acronym_"+k).innerText="";
          }
          for (var i=target;i<total_count_index;i++){
            var j=Number(i)+1;
           //let nextelmnt= document.getElementById('rfi_term_' + j);
           let nextelmnt=document.getElementsByClassName('term_acronym_fieldset acronym_'+j);
          //  let prevelmnt= document.getElementById('rfi_question_' + i);
          if(nextelmnt.length>0){
           if((!nextelmnt[0].classList.contains('ccs-dynaform-hidden')))
           {
            document.getElementById('rfi_term_' + i).value=document.getElementById('rfi_term_' + j).value;
            document.getElementById('rfi_term_definition_' + i).value=document.getElementById('rfi_term_definition_' + j).value;
            document.getElementById("rfi_label_term_"+i).innerText="";
            document.getElementById("rfi_label_acronym_"+i).innerText="";
          }
           else
           {
             target=i;
             document.getElementById("rfi_label_acronym_"+i).innerText="";
             break;
           }
          }
          else
        {
          target=i;
           document.getElementById("rfi_label_acronym_"+i).innerText="";
           break;
        }
          }
  

        //target_fieldset.classList.add("ccs-dynaform-hidden");
        document.getElementsByClassName('term_acronym_fieldset acronym_'+target)[0].classList.add("ccs-dynaform-hidden");

        document.getElementById('rfi_term_' + target).value = "";
        document.getElementById('rfi_term_definition_' + target).value = "";


        if (prev_coll > 1) {
          //document.querySelector('.acronym_' + prev_coll + ' a.del').classList.remove("ccs-dynaform-hidden");
        }

        document.getElementById("ccs_rfiTerm_add").classList.remove('ccs-dynaform-hidden');
        with_value_count--;
      });
    });
    clearFieldsButtons.forEach((db) => {
      db.addEventListener('click', (e) => {

        e.preventDefault();

        let target = db.href.replace(/^(.+\/)(\d{1,2})$/, "$2"),
          target_fieldset = db.closest("fieldset");

        target_fieldset.classList.add("ccs-dynaform");

        document.getElementById('rfi_term_' + target).value = "";
        document.getElementById('rfi_term_definition_' + target).value = "";
        removeErrorFields();
      });
    });


    if (document.getElementsByClassName("term_acronym_fieldset").length > 0) {
      let fieldSets = document.getElementsByClassName("term_acronym_fieldset");
      let length = fieldSets.length;
      while (length--) {
        let id = length + 1;
        let eleTerm = fieldSets[length].querySelector("#rfi_term_" + id);
        eleTerm.addEventListener('focusout', (event) => {
          let ele1 = event.target;
          let definitionElementId = "rfi_term_definition_" + id;
          let ele2 = document.getElementById(definitionElementId);
          performSubmitAction(ele1, ele2);

        });
        let eleTermDefinition = fieldSets[length].querySelector("#rfi_term_definition_" + id);
        eleTermDefinition.addEventListener('focusout', (event) => {
          let ele2 = event.target;
          let ele1Id = "rfi_term_" + id;
          let ele1 = document.getElementById(ele1Id);
          performSubmitAction(ele1, ele2);
        });
        var performSubmitAction = function (ele1, ele2) {
          if (ele1.value !== '' && ele2.value !== '') {
            let formElement = document.getElementById("ccs_rfi_acronyms_form");
            let action = formElement.getAttribute("action");
            action = action + "&stop_page_navigate=true";
            $.ajax({
              type: "POST",
              url: action,
              data: $("#ccs_rfi_acronyms_form").serialize(),
              success: function () {

                //success message mybe...
              }
            });
          }
        };
        // break;
      }
    }
  }
  buttonTermsHidden();
});
let with_value_count;
let total_count;
let total_count_index;
let prev_input;
let deleteButtons;
if(agrement_id == 'RM1557.13' || agrement_id == 'RM6187'){
  with_value_count = 20;
  total_count = 20;
  total_count_index = 21;
  prev_input = 0;
  deleteButtons = document.querySelectorAll("a.del");
}else{
  with_value_count = 10;
  total_count = 10;
  total_count_index = 11;
  prev_input = 0;
  deleteButtons = document.querySelectorAll("a.del");
}
const checkFields = () => {
  const start = 1;
  const end = total_count;

  for (var a = start; a <= end; a++) {
    let input = $(`#rfi_term_${a}`)
    let textbox = $(`#rfi_term_definition_${a}`);


    if (input.val() !== "") {

      $(`#rfi_term_${a}-error`).remove();
      $(`.acronym_${a} div`).removeClass('govuk-form-group--error');
      $(`.acronym_${a} input`).removeClass('govuk-input--error')


    }
    if (textbox.val() !== "") {

      $(`#rfi_term_definition_${a}-error`).remove();
      $(`.acronym_${a} div`).removeClass('govuk-form-group--error');
      $(`.acronym_${a} textarea`).removeClass('govuk-input--error');
      $(`.acronym_${a} textarea`).removeClass('govuk-textarea--error')
    }

  }
}
const removeErrorFields = () => {
  $('.govuk-error-message').remove();
  $('.govuk-form-group--error').removeClass('govuk-form-group--error')
  $('.govuk-error-summary').remove();
  $(".govuk-input").removeClass("govuk-input--error");
  $('.govuk-form-group textarea').removeClass('govuk-textarea--error');

}


    
const emptyFieldCheck = (add_more='') => {
  let fieldCheck = "",
    errorStore = [];
  for (var x = 1; x < total_count_index; x++) {
    let term_field = document.getElementById('rfi_term_' + x);
    let definition_field = document.getElementById("rfi_term_definition_" + x);

    if (term_field.closest("fieldset").classList.value.indexOf("ccs-dynaform-hidden") === -1) {
      checkFields();
      if (term_field.value.trim() == '' && definition_field.value.trim() == '' && add_more=='add_more') {
        ccsZaddErrorMessage(term_field, 'You must add information in this fields.');
        ccsZaddErrorMessage(definition_field, 'You must add information in this fields.');
        fieldCheck = [definition_field.id, 'You must add information in both fields.'];
        errorStore.push(fieldCheck);
      }

      if (term_field.value.trim() != '' && definition_field.value.trim() == '') {
        ccsZaddErrorMessage(definition_field, 'You must enter the definition for the term or acronym.');
        fieldCheck = [definition_field.id, 'You must enter the definition for the term or acronym.'];
        errorStore.push(fieldCheck);
      }
      

      if (term_field.value.trim() == '' && definition_field.value.trim() != '') {
        ccsZaddErrorMessage(term_field, 'You must enter the term or acronym.');
        fieldCheck = [term_field.id, 'You must enter the term or acronym.'];
        errorStore.push(fieldCheck);
      }
    }
  }
  return errorStore;
}

const ccsZCountRfiTerms = (event) => {
  //debugger;
  event.preventDefault();
  const inputId=event.srcElement.id;
  const element = document.getElementById(inputId);
  const arr=inputId.split("rfi_term_");
  // if(element.value.length<500)
  // {
    for(var i=1;i<=total_count;i++)
    {
      document.getElementById("rfi_label_term_"+i).innerText="";
      document.getElementById("rfi_label_acronym_"+i).innerText="";
    }
    let labelElement=document.getElementById("rfi_label_term_"+arr[1]);
    let count=500-element.value.length;
    labelElement.innerText=count + " remaining of 500";
    //labelElement.classList.remove('ccs-dynaform-hidden')
  // }
  // else
  // {

  // }
};

const ccsZCountRfiAcronyms = (event) => {
  //debugger;
  event.preventDefault();
  const inputId=event.srcElement.id;
  const element = document.getElementById(inputId);
  const arr=inputId.split("rfi_term_definition_");
  // if(element.value.length<500)
  // {
    for(var i=1;i<=total_count;i++)
    {
      document.getElementById("rfi_label_acronym_"+i).innerText="";
      document.getElementById("rfi_label_term_"+i).innerText="";
    }
    let labelElement=document.getElementById("rfi_label_acronym_"+arr[1]);
    let maxlength = element.getAttribute("maxlength");
    let count=maxlength-element.value.length;
    labelElement.innerText=count + " remaining of "+maxlength;
    //labelElement.classList.remove('ccs-dynaform-hidden')
  // }
  // else
  // {

  // }
};


const ccsZvalidateRfiAcronyms = (event) => {
  event.preventDefault();

  errorStore = emptyFieldCheck();

  if (errorStore.length === 0) {

    document.forms["ccs_rfi_acronyms_form"].submit();
  }
  else {
    ccsZPresentErrorSummary(errorStore);

  }

};

/**
 * Find an address by searching on postcode
 *
 * Uses the getAddress() API (https://getaddress.io/)
 * This is currently on a 30 day trial (which may be extended),
 * but should be swapped out when it expires for one that is
 * registered with someone who still works on the project.
 *
 * See https://documentation.getaddress.io/ for more, including
 * error codes and test postcodes that don't count towards the
 * daily request limit.
 */

const ccsZFindAddress = (event) => {
  event.preventDefault();

  let fieldCheck = "",
    errorStore = [];

  fieldCheck = ccsZvalidateWithRegex( "rfi_proj_address-postcode", "Enter a valid postcode", /A([Gg][Ii][Rr] 0[Aa]{2})|((([A-Za-z][0-9]{1,2})|(([A-Za-z][A-Ha-hJ-Yj-y][0-9]{1,2})|(([A-Za-z][0-9][A-Za-z])|([A-Za-z][A-Ha-hJ-Yj-y][0-9][A-Za-z]?))))\s?[0-9][A-Za-z]{2})$/ );
  if (fieldCheck !== true) {
    // if we have an invalid postcode, show an error
    ccsZPresentErrorSummary([["rfi_proj_address-postcode", "Enter a valid postcode"]]);
  } else {
    // if we have a valid postcode, remove any error mssages
    ccsZremoveErrorMessage(document.getElementById("rfi_proj_address-postcode"));
    const existingSummary = document.querySelector(".govuk-error-summary");
    if (existingSummary !== null) existingSummary.parentNode.removeChild(existingSummary);

    // ... and get on with looking up an address...
    let myPostCode = document.getElementById("rfi_proj_address-postcode").value.trim();

    fetch(`https://api.getAddress.io/find/${myPostCode}?api-key=`)
      .then(response => {

        if (!response.ok) {
          let errMsg = "Unknown error";
          if (response.status === 500) errMsg = "Internal server error";
          else if (response.status === 429) errMsg = "API request limit exeeded";
          else if (response.status === 404) errMsg = "No address found";
          else if (response.status === 400) errMsg = "Invalid postcode";
          else if (response.status === 401) errMsg = "API key is not valid";
          else if (response.status === 403) errMsg = "You do not have permission to access to the resource";

          throw new Error(`HTTP request error: ${response.status} - ${errMsg}`);
        }

        return response.json();
      })
      .then(data => {
        // empty the drop-down and then re-populate it

        let mySelector = document.getElementById("rfi_proj_address-address"),
          selectedPostcode = document.getElementById("display_postcode");

        selectedPostcode.innerText = myPostCode;
        document.getElementById("ccs_postcode_holder").classList.remove("ccs-dynaform-hidden");
        document.getElementById("rfi_proj_address-postcode").classList.add("ccs-dynaform-hidden");
        document.getElementById("rfi_find_address_btn").classList.add("ccs-dynaform-hidden");

        mySelector.options.length = 0;

        var firstOp = document.createElement('option');
        firstOp.value = "";
        firstOp.innerHTML = `${data.addresses.length} addresses found`;
        mySelector.appendChild(firstOp);

        data.addresses.forEach((addy) => {

          var opt = document.createElement('option');
          opt.value = addy;
          opt.innerHTML = addy;
          mySelector.appendChild(opt);

        });

        mySelector.parentNode.classList.remove("ccs-dynaform-hidden");

      })
      .catch(error => {
        console.error('There was a problem with address lookup:', error);
      });
  }
};

/* when an address is selected, enable the submit button */
const ccsZFoundAddress = (event) => {
  let saveButton = document.getElementById("rfi_save_address_btn");
  saveButton.disabled = false;
  saveButton.setAttribute('aria-disabled', false);
  saveButton.classList.remove("govuk-button--disabled");
};

/* hide the address drop-down select when the page first loads */
const ccsZInitAddressFinder = (element) => {
  document.getElementById(element).parentNode.classList.add("ccs-dynaform-hidden");
};

/* show, hide, disable or empty various elements when the user chooses to
 * change the postcode */
const ccsZResetAddress = (event) => {
  event.preventDefault();

  document.getElementById("ccs_postcode_holder").classList.add("ccs-dynaform-hidden");
  document.getElementById("rfi_proj_address-postcode").classList.remove("ccs-dynaform-hidden");
  document.getElementById("rfi_find_address_btn").classList.remove("ccs-dynaform-hidden");
  document.getElementById("rfi_proj_address-address").parentNode.classList.add("ccs-dynaform-hidden");
  document.getElementById("rfi_proj_address-postcode").value = "";
  document.getElementById("rfi_proj_address-postcode").focus();

  let saveButton = document.getElementById("rfi_save_address_btn");
  saveButton.disabled = true;
  saveButton.setAttribute('aria-disabled', true);
  saveButton.classList.add("govuk-button--disabled");
};

document.addEventListener('DOMContentLoaded', () => {

    let selectors = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13];
    for (let element of selectors) { 
        let day = $(`#clarification_date-day_${element}`);
        let month = $(`#clarification_date-month_${element}`);
        let year = $(`#clarification_date-year_${element}`);
        let hour = $(`#clarification_date-hour_${element}`);
        let minutes = $(`#clarification_date-minute_${element}`);

        let responseDate = $(`#ccs_rfi_response_date_form_${element}`);

        day.on('blur', () => {
            let value = day;
            if (value != undefined && value.val() != '') {
                let parentID = getParentId(element);
                let matchValue = !value.val().match(/^\d\d?$/);
                let endmonthCheck = Number(value.val()) > 31;
                let startmonthCheck = Number(value.val()) < 1;
                if (matchValue || endmonthCheck || startmonthCheck) {
                    value.addClass("govuk-input--error")
                    ccsZaddErrorMessage(document.getElementById(parentID), "Enter a valid date");
                } else {
                    value.removeClass("govuk-input--error");
                    ccsZremoveErrorMessage(document.getElementById(parentID));
                }
            }
        });

        month.on('blur', () => {
            let value = month;
            if (value != undefined && value.val() != '') {
                let parentID = getParentId(element);
                let matchValue = !value.val().match(/^\d\d?$/);
                let endmonthCheck = Number(value.val()) > 12;
                let startmonthCheck = Number(value.val()) <= 0;
                if (matchValue || endmonthCheck || startmonthCheck) {
                    value.addClass("govuk-input--error")
                    ccsZaddErrorMessage(document.getElementById(parentID), "Enter a valid month");
                } else {
                    value.removeClass("govuk-input--error");
                    ccsZremoveErrorMessage(document.getElementById(parentID));
                }
            }
        });

        year.on('blur', () => {
            let value = year;
            if (value != undefined && value.val() != '') {
                let parentID = getParentId(element);
                let matchValue = !value.val().match(/^\d{4}$/);
                let endyearCheck = Number(value.val()) > 2121;
                let currentYear = new Date().getFullYear();
                let startyearCheck = Number(value.val()) < currentYear;
                if (matchValue || endyearCheck || startyearCheck) {
                    value.addClass("govuk-input--error")
                    ccsZaddErrorMessage(document.getElementById(parentID), "Enter a valid year");
                } else {
                    value.removeClass("govuk-input--error");
                    ccsZremoveErrorMessage(document.getElementById(parentID));
                }
            }
        });

        hour.on('blur', () => {
            let value = hour;
            if (value != undefined && value.val() != '') {
                let parentID = getParentId(element);
                let matchValue = !value.val().match(/^\d\d?$/);
                let endmonthCheck = Number(value.val()) > 23;
                let startmonthCheck = Number(value.val()) <= 0;
                if (day.val() !== '' && month.val() !== '' && day.val() !== '' && !isValidDate(year.val(), month.val(), day.val())) {
                    value.addClass("govuk-input--error")
                    ccsZaddErrorMessage(document.getElementById(parentID), "Enter a valid day");
                } else {
                    if (matchValue || endmonthCheck || startmonthCheck || value == '') {
                        value.addClass("govuk-input--error")
                        ccsZaddErrorMessage(document.getElementById(parentID), "Enter a valid hours");
                    } else {
                        value.removeClass("govuk-input--error");
                        ccsZremoveErrorMessage(document.getElementById(parentID));
                    }
                }
            }
        });

        minutes.on('blur', () => {
            let value = minutes;
            if (value != undefined && value.val() != '') {
                let parentID = getParentId(element);
                let matchValue = !value.val().match(/^\d\d?$/);
                let endmonthCheck = Number(value.val()) > 59;
                let startmonthCheck = Number(value.val()) < 0;
                if (day.val() !== '' && month.val() !== '' && day.val() !== '' && !isValidDate(year.val(), month.val(), day.val())) {
                    value.addClass("govuk-input--error")
                    ccsZaddErrorMessage(document.getElementById(parentID), "Enter a valid day");
                } else {
                    if (matchValue || endmonthCheck || startmonthCheck || value == '') {
                        value.addClass("govuk-input--error")
                        ccsZaddErrorMessage(document.getElementById(parentID), "Enter valid minutes");
                    } else {
                        value.removeClass("govuk-input--error");
                        ccsZremoveErrorMessage(document.getElementById(parentID));
                    }
                }
            }
        });

        responseDate.on('submit', (e) => {
            e.preventDefault();
            day.removeClass("govuk-input--error")
            month.removeClass("govuk-input--error")
            year.removeClass("govuk-input--error")

            let parentID = getParentId(element);
            ccsZremoveErrorMessage(document.getElementById(parentID));

            if ((year.val() != undefined && year.val() == "") && (month.val() != undefined && month.val() == "") && (day.val() != undefined && day.val() == "")) {
                day.addClass("govuk-input--error")
                month.addClass("govuk-input--error")
                year.addClass("govuk-input--error")
                ccsZaddErrorMessage(document.getElementById(parentID), "Date should not be empty");
            } else if (day.val() != undefined && day.val() == "") {
                day.addClass("govuk-input--error")
                ccsZaddErrorMessage(document.getElementById(parentID), "Day should not be empty");
            } else if (month.val() != undefined && month.val() == "") {
                month.addClass("govuk-input--error")
                ccsZaddErrorMessage(document.getElementById(parentID), "Month should not be empty");
            } else if (year.val() != undefined && year.val() == "") {
                year.addClass("govuk-input--error")
                ccsZaddErrorMessage(document.getElementById(parentID), "Year should not be empty");
            } else {
                if (!isValidDate(year.val(), month.val(), day.val())) {
                    day.addClass("govuk-input--error")
                    ccsZaddErrorMessage(document.getElementById(parentID), "Please enter valid date");
                } else {
                    let currentDate = new Date();
                    let enteredDate = new Date(year.val(), month.val() - 1, day.val());
                    if (enteredDate < currentDate) {
                        day.addClass("govuk-input--error")
                        month.addClass("govuk-input--error")
                        year.addClass("govuk-input--error")
                        ccsZaddErrorMessage(document.getElementById(parentID), "Date should be in future");
                    } else {
                        document.getElementById(`ccs_rfi_response_date_form_${element}`).submit()
                    }
                }
            }
        });

        function getParentId(element) {
            let parentID = '';
            if (document.getElementById(`rfi_clarification_date_expanded_${element}`) !== null) {
                parentID = `rfi_clarification_date_expanded_${element}`;
            } else if (document.getElementById(`rfp_clarification_date_expanded_${element}`) !== null) {
                parentID = `rfp_clarification_date_expanded_${element}`;
            } else if (document.getElementById(`eoi_clarification_date_expanded_${element}`) !== null) {
                parentID = `eoi_clarification_date_expanded_${element}`;
            }
            return parentID;
        }

        function isValidDate(year, month, day) {
            month = month - 1;
            var d = new Date(year, month, day);
            if (d.getFullYear() == year && d.getMonth() == month && d.getDate() == day) {
                return true;
            }
            return false;
        }
    }

});


$('.save-button').on('click', (e) => {
    if(document.getElementsByClassName("clarification_1")[0] != null){
        let publication_date = new Date(document.getElementsByClassName("clarification_1")[0].innerText);
        let clarification_date = new Date(document.getElementsByClassName("clarification_2")[0].innerText);
        let deadline_publish_date = new Date(document.getElementsByClassName("clarification_3")[0].innerText);
        let deadline_supplier_date = new Date(document.getElementsByClassName("clarification_4")[0].innerText);
        let confirm_nextsteps_date = new Date(document.getElementsByClassName("clarification_5")[0].innerText);

        let isError = false;

        let selectors = [1, 2, 3, 4, 5];
        for (let element of selectors) {
            let day = $(`#clarification_date-day_${element}`);
            let month = $(`#clarification_date-month_${element}`);
            let year = $(`#clarification_date-year_${element}`);
            let hour = $(`#clarification_date-hour_${element}`);
            let minutes = $(`#clarification_date-minute_${element}`);

            if ((year.val() != undefined && year.val() != "") && (month.val() != undefined && month.val() != "") && (day.val() != undefined && day.val() != "")) {
                let inputDate = new Date(year.val(), month.val() - 1, day.val(), hour.val(), minutes.val());

                switch (element) {
                    case 1:
                        if (inputDate < publication_date) {
                            isError = true;
                        }
                        break;
                    case 2:
                        if (inputDate < clarification_date) {
                            e.preventDefault();
                            isError = true;
                        }
                        break;
                    case 3:
                        if (inputDate < deadline_publish_date) {
                            e.preventDefault();
                            isError = true;
                        }
                        break;
                    case 4:
                        if (inputDate < deadline_supplier_date) {
                            e.preventDefault();
                            isError = true;
                        }
                        break;
                    case 5:
                        if (inputDate < confirm_nextsteps_date) {
                            e.preventDefault();
                            isError = true;
                        }
                        break;
                    default:
                        isError = false;
                }
            }
        }

        if (isError) {
            $('#event-name-error-date').html('You can not set a date and time that is earlier than the previous milestone in the timeline');
            DaySelector.addClass('govuk-form-group--error');
            MonthSelector.addClass('govuk-form-group--error');
            YearSelector.addClass('govuk-form-group--error');
            $('.durations').addClass('govuk-form-group--error');
            const errorStore = [
                ["eoi_clarification_date", "You can not set a date and time that is earlier than the previous milestone in the timeline"]
            ]

            ccsZPresentErrorSummary(errorStore);
        } else {
            document.forms['ccs_eoi_response_date_form'].submit();
        }
    } else {
        // document.forms['rfp_date'].submit();
    }
});
document.addEventListener('DOMContentLoaded', () => {
    if (document.getElementById("ccs_rfi_procurement_lead") !== null) {
        document.getElementById('ccs_rfi_procurement_lead').addEventListener('change', function (event) {
            event.preventDefault();
            $.ajax({
                url: "/rfi/users-procurement-lead?id=" + event.target.value,
                type: "GET",
                contentType: "application/json",
            }).done(function (result) {
                setUserDetails(result);

            }).fail((res) => {
                let div_email = document.getElementById('lead-email');
                div_email.innerText = '';
                let div_tel = document.getElementById('lead-telephone');
                div_tel.innerText = '';

            })
        });
        const setUserDetails = (user) => {
            let div_email = document.getElementById('lead-email');
            div_email.innerText = user.userName;
            let div_tel = document.getElementById('lead-telephone');
            div_tel.innerText = '1';
            let div_email_value = document.getElementById('rfi_procurement_lead_input');
            div_email_value.value = user.userName;

        };
    }
});

$('.add').addClass('ccs-dynaform-hidden');
document.addEventListener('DOMContentLoaded', () => {
  const queryString = window.location.search;
  const urlParams = new URLSearchParams(queryString);

  if (document.getElementById("ccs_rfi_questions_form") !== null) {
    let question_length = $('.add').length;
    if(question_length == 20){
      document.getElementById("ccs_criteria_add").classList.add('ccs-dynaform-hidden');
    }
    let with_value_count = 20,
      prev_input = 0,
      deleteButtons = document.querySelectorAll("a.del");
      //document.getElementById("rfi_question_1").addEventListener('input', ccsZCountRfiQuestions);
    for (var text_box_num = 20; text_box_num >= 1; text_box_num--) {

      let this_box = document.getElementById("rfi_question_" + text_box_num);
      this_box.addEventListener('input', ccsZCountRfiQuestions);

      if (text_box_num === 1) {
        document.getElementById("rfi_question_" + text_box_num).classList.remove('ccs-dynaform-hidden');
        let the_label = document.querySelector('label[for=rfi_question_' + text_box_num + ']');
        the_label.classList.remove('ccs-dynaform-hidden');
      }
      else{
      if (this_box.value !== "") {
        this_box.classList.remove('ccs-dynaform-hidden');

        if (text_box_num === 20) {
          document.getElementById("ccs_criteria_add").classList.add('ccs-dynaform-hidden');
        }

      } else {
        let the_label = document.querySelector('label[for=rfi_question_' + text_box_num + ']');
        the_label.classList.add('ccs-dynaform-hidden');
        with_value_count = text_box_num;
      }
    }

    }

    document.getElementById("ccs_criteria_add").classList.remove("ccs-dynaform-hidden");
    document.getElementById("ccs_criteria_add").addEventListener('click', (e) => {
      e.preventDefault();
      $(".govuk-error-summary").remove();
      errorStore = emptyQuestionFieldCheck();
      if (errorStore.length == 0) {

        document.getElementById("rfi_question_" + with_value_count).classList.remove("ccs-dynaform-hidden");

        document.querySelector('label[for=rfi_question_' + with_value_count + ']').classList.remove("ccs-dynaform-hidden");

        if (with_value_count > 2) {
          prev_input = with_value_count - 1;
          //document.querySelector('label[for=rfi_question_' + prev_input + '] a.del').classList.add("ccs-dynaform-hidden");
        }

        with_value_count++;
        console.log("with_value_countadd>",with_value_count)
        if (with_value_count === 21) {
          document.getElementById("ccs_criteria_add").classList.add('ccs-dynaform-hidden');
        }
      }
      else ccsZPresentErrorSummary(errorStore);
    });

    // delete buttons
    deleteButtons.forEach((db) => {
      //debugger;
      // for(var i=1;i<=10;i++)
      // {
      //   document.getElementById("rfi_label_question_"+i).innerText="";
      // }
      db.classList.remove('ccs-dynaform-hidden')
      db.addEventListener('click', (e) => {

        e.preventDefault();
        //debugger;
        let target = db.href.replace(/^(.+\/)(\d{1,2})$/, "$2"),
          prev_box = Number(target) - 1;
          for (var k=1;k<=10;k++)
          {
            document.getElementById("rfi_label_question_"+k).innerText="";
            
          }
        for (var i=target;i<11;i++){
          var j=Number(i)+1;
         let nextelmnt= document.getElementById('rfi_question_' + j);
        //  let prevelmnt= document.getElementById('rfi_question_' + i);
        if(nextelmnt!=null){
         if((!nextelmnt.classList.contains('ccs-dynaform-hidden')))
         {
          document.getElementById('rfi_question_' + i).value=nextelmnt.value;
          document.getElementById("rfi_label_question_"+i).innerText="";
         }
         else
         {
           target=i;
           document.getElementById("rfi_label_question_"+i).innerText="";
           break;
         }
        }
        else
        {
          target=i;
           document.getElementById("rfi_label_question_"+i).innerText="";
           break;
        }
        }

        document.getElementById('rfi_question_' + target).value = "";
        document.getElementById('rfi_question_' + target).classList.add("ccs-dynaform-hidden");
        let parentNode = document.querySelector('label[for=rfi_question_' + target + ']').parentNode;
        if (parentNode.children["rfi_question_" + target + '-error'] !== undefined) {
          parentNode.removeChild(document.getElementById("rfi_question_" + target + '-error'))
          parentNode.classList.remove("govuk-form-group--error");
          parentNode.children["rfi_question_" + target].classList.remove("govuk-input--error");
        }
        //document.getElementById('rfi_question_' + target + '-error').parentNode.removeChild(document.getElementById('rfi_question_' + target + '-error'));
        document.querySelector('label[for=rfi_question_' + target + ']').classList.add("ccs-dynaform-hidden");

        if (prev_box > 1) {
          //document.querySelector('label[for=rfi_question_' + prev_box + '] a.del').classList.remove("ccs-dynaform-hidden");
        }
        document.getElementById("ccs_criteria_add").classList.remove('ccs-dynaform-hidden');
        with_value_count--;
        console.log("with_value_count>>>",with_value_count)
      });
    });


    let length = 21;
    while (--length) {
      console.log(length);
      let element = document.querySelector("#rfi_question_" + length);
      element.addEventListener('focusout', (event) => {
        let eleValue = event.target.value;
        if (eleValue !== '') {
          let formElement = document.getElementById("ccs_rfi_questions_form");
          let action = formElement.getAttribute("action");
          action = action + "&stop_page_navigate=true";
          $.ajax({
            type: "POST",
            url: action,
            data: $("#ccs_rfi_questions_form").serialize(),
            success: function () {

              //success message mybe...
            }
          });
        }
      });
      // break;
    }
  }
});

const emptyQuestionFieldCheck = () => {
  let fieldCheck = true,
    errorStore = [];

  //const event_typ = document.getElementById("event_type_label").value;

  //if (event_typ !== "Request for Information") {
  //fieldCheck = ccsZvalidateWithRegex("rfi_question_1", "You must add at least one question", /\w+/);
  if (fieldCheck !== true) errorStore.push(fieldCheck);
  for (var i = 1; i < 21; i++) {
    if (!document.getElementById("rfi_question_" + i).classList.contains('ccs-dynaform-hidden')) {
      if(i==1){
        if(urlParams.get('agreement_id') == 'RM6187'){
          errText = "You must ask at least one question";
        }else{
          errText = "You must add at least one question";
        }
        fieldCheck = ccsZvalidateWithRegex("rfi_question_1", errText, /\w+/);
      }
      else{
      fieldCheck = ccsZvalidateWithRegex("rfi_question_" + i, "You must type a question before you can add another question", /\w+/);
      }
      if (fieldCheck !== true) errorStore.push(fieldCheck);
    }
  }
  return errorStore;
};


const emptyQuestionFieldCheckForSave = () => {
  let fieldCheck = "",
    errorStore = [];
    if(urlParams.get('agreement_id') == 'RM6187'){
      errText = "You must ask at least one question";
    }else{
      errText = "You must add at least one question";
    }
  fieldCheck = ccsZvalidateWithRegex("rfi_question_1", errText, /\w+/);
  if (fieldCheck !== true) errorStore.push(fieldCheck);
    return errorStore;
};

const ccsZvalidateRfIQuestions = (event) => {
  event.preventDefault();
  errorStore = emptyQuestionFieldCheckForSave();

  //}

  if (errorStore.length === 0) document.forms["ccs_rfi_questions_form"].submit();
  else ccsZPresentErrorSummary(errorStore);
};

const ccsZCountRfiQuestions = (event) => {
  //debugger;
  event.preventDefault();
  const inputId=event.srcElement.id;
  const element = document.getElementById(inputId);
  const arr=inputId.split("rfi_question_");
  // if(element.value.length<500)
  // {
    for(var i=1;i<=20;i++)
    {
      document.getElementById("rfi_label_question_"+i).innerText="";
    }
    let labelElement=document.getElementById("rfi_label_question_"+arr[1]);
    let maxlength = element.getAttribute("maxlength");
    let count=maxlength-element.value.length;
    labelElement.innerText=count + " remaining of "+maxlength;
    //labelElement.classList.remove('ccs-dynaform-hidden')
  // }
  // else
  // {

  // }
};


$('.add').addClass('ccs-dynaform-hidden');
const totalElementSelectors = Array.from(Array(5 + 1).keys()).slice(1);


for (const selector of totalElementSelectors) {

    let elementID = "#rfi_clarification_date_expanded_" + selector;
    let elementSelector = $(elementID);
    if (elementSelector.length === 0)
        elementSelector = $("#rfi_clarification_date_expanded_" + selector);
    elementSelector.fadeOut();
}


for (const selector of totalElementSelectors) {
    let elementID = "#change_clarification_date_" + selector;
    let elementCancelID = "#cancel_change_clarification_date_" + selector;
    let elementSelector = $(elementID);
    let elementSelectorCancel = $(elementCancelID);
    elementSelector.fadeIn();
    elementSelectorCancel.fadeIn();
    elementSelector.on('click', () => {
        localStorage.removeItem('dateItem');
        localStorage.setItem('dateItem', elementSelector.selector);
        let ClickedID = "#rfi_clarification_date_expanded_" + selector;
        let elementSelectorClicked = $(ClickedID);
        if (elementSelectorClicked.length === 0)
            elementSelectorClicked = $("#rfi_clarification_date_expanded_" + selector);
        elementSelectorClicked.fadeIn();
        elementSelector.hide();
        saveButtonHideDateRfi();
    })
}
var errorSelectorId = '';
let errorSelector = $("#click-error");
errorSelector.on('click', () => {
    let ClickedID = $("#click-error").attr("href");
    let errorText = $("#click-error").text();
    errorSelectorId = ClickedID;
    let elementSelectorClicked = $(ClickedID);
    elementSelectorClicked.fadeIn();
    ccsZaddErrorMessage(document.getElementById(ClickedID.slice(1)), errorText);
});

for (const selector of totalElementSelectors) {
    let elementID = "#cancel_change_clarification_date_" + selector;
    let elementSelector = $(elementID);
    elementSelector.on('click', () => {

        let ClickedID = "#rfi_clarification_date_expanded_" + selector;

        let elementSelectorClicked = $(ClickedID);
        if (elementSelectorClicked.length === 0) {
            ClickedID = "#rfi_clarification_date_expanded_" + selector;
            elementSelectorClicked = $(ClickedID);
        }
        elementSelectorClicked.fadeOut();
        ccsZremoveErrorMessage(document.getElementById(ClickedID.slice(1)))

        if (errorSelectorId === ClickedID) {
            for (let selector of totalElementSelectors) {
                let changeID = "#change_clarification_date_" + selector;
                $(changeID).show();
            }
        } else {
            const elementIDChange = $("#change_clarification_date_" + selector);
            elementIDChange.show();
        }
        saveButtonUnHideDateRfi();
    });
}

const saveButtonHideDateRfi = () => {
    document.getElementById("hideMeWhileDateChange").disabled = true;
}

const saveButtonUnHideDateRfi = () => {
    document.getElementById("hideMeWhileDateChange").disabled = false;
}
document.addEventListener('DOMContentLoaded', () => {

    if (document.getElementById("ccs-rfi-suppliers-form") !== null) {

        let supplier_page1 = document.getElementById("supplier-page1");
        let supplier_page2 = document.getElementById("supplier-page2");
        let supplier_page3 = document.getElementById("supplier-page3");

        supplier_page2.classList.add("ccs-dynaform-hidden");
        supplier_page3.classList.add("ccs-dynaform-hidden");

        document.getElementById("rfi_page-1-next-link").addEventListener('click', (e) => {
            e.preventDefault();
            supplier_page1.classList.add("ccs-dynaform-hidden");
            supplier_page2.classList.remove("ccs-dynaform-hidden")
        });

        document.getElementById("rfi_page-2-previous-link").addEventListener('click', (e) => {
            e.preventDefault();
            supplier_page1.classList.remove("ccs-dynaform-hidden");
            supplier_page2.classList.add("ccs-dynaform-hidden")
        });

        document.getElementById("rfi_page-2-next-link").addEventListener('click', (e) => {
            e.preventDefault();
            supplier_page2.classList.add("ccs-dynaform-hidden")
            supplier_page3.classList.remove("ccs-dynaform-hidden");
        });

        document.getElementById("rfi_page-3-previous-link").addEventListener('click', (e) => {
            e.preventDefault();
            supplier_page3.classList.add("ccs-dynaform-hidden")
            supplier_page2.classList.remove("ccs-dynaform-hidden");           
        });
        
    }

});
$('#ccs_collab_view').hide();

let rfpFormURL = "/rfp/get-collaborator-detail/js-enabled";


$('#rfp_collaborators').on('change', function () {
  let id = this.value;
    
  if (id !== "") {
    let data = {
      "rfp_collaborators": id
    }

    var ajaxRequest = $.post(rfpFormURL, data, function (data) {

      let { userName, firstName, lastName, tel } = data;
      let collegueName = firstName + " " + lastName;
      let id = userName;

      $('#show_collab_name').html(collegueName)
      $('#show_collab_email').html(id)
      $('#show_collab-phone').html(tel)

      $("#rfp_collaborator_append").val(id);
      $('#ccs_collab_add').prop("disabled", false)
      $('.addcolleaguedetailsdos').show();
    })
      .fail(function () {
        console.log("failed")
      })
      .always(function () {
        console.log("finsihed")
      });
  }
  else {
    $('#show_collab_name').html("")
    $('#show_collab_email').html("")
    $('#show_collab-phone').html("")
    $('#ccs_collab_add').prop("disabled", true)
    $('.addcolleaguedetailsdos').hide();
  }



});
const rfp_totalElementSelectors = Array.from(Array(13+1).keys()).slice(1);


for(const selector of rfp_totalElementSelectors){

    let elementID = "#rfp_clarification_date_expanded_"+selector;    
    let elementSelector = $(elementID);
    if(elementSelector.length === 0)
        elementSelector = $("#rfp_clarification_date_expanded_"+selector); 
    elementSelector.fadeOut();
}


for(const selector of rfp_totalElementSelectors){
    let elementID = "#change_clarification_date_"+selector;
    let elementCancelID = "#rfp_cancel_change_clarification_date_"+selector;
    let elementSelector = $(elementID); 
    let elementSelectorCancel = $(elementCancelID); 
    elementSelector.fadeIn(); 
    elementSelectorCancel.fadeIn(); 
    elementSelector.on('click', () => {
        localStorage.removeItem('dateItem');
        localStorage.setItem('dateItem', elementID);
        let ClickedID = "#rfp_clarification_date_expanded_" + selector;
        let elementSelectorClicked = $(ClickedID);
        if (elementSelectorClicked.length === 0)
            elementSelectorClicked = $("#rfp_clarification_date_expanded_" + selector);
        elementSelectorClicked.fadeIn();
        elementSelector.hide();
        saveButtonHideDateRFP();
    });
    let errorSelector = $("#click-error");
    let noChanges = $('#rfp_cancel_change_clarification_date_'+ selector);
    

    noChanges.click(function() {
        $( ".govuk-error-message" ).hide();
        $( ".govuk-error-summary" ).hide();
        elementClicked = $("#showDateDiv" + selector);
        elementClicked.removeClass('govuk-form-group--error')
        
        

    });

    errorSelector.on('click', () => {
        
        let storedClickedID = localStorage.getItem('dateItem');
        let cleanedClickedID = storedClickedID.slice(1);
        let elementSelectorClicked = $(storedClickedID);
        let hasError = $("#showDateDiv"+ selector).hasClass("govuk-form-group--error");
        if (elementSelector.selector === elementSelectorClicked.selector && hasError ) {
            elementSelectorClicked = $("#rfp_clarification_date_expanded_" + selector);
            elementSelectorClicked.fadeIn();
            elementSelector.hide();
           
        } else {
            elementSelectorClicked.hide();
            elementSelector.fadeIn();
        }
        let agreementID;
        if(document.getElementById("agreementID")) agreementID = document.getElementById("agreementID").value;
        if(agreementID != 'RM1043.8'  && agreementID != 'RM1557.13') {
        ccsZaddErrorMessage(document.getElementById(cleanedClickedID), 'You can not set a date and time that is earlier than the previous milestone in the timeline');
        }
    });
}




for(const selector of rfp_totalElementSelectors){
    let elementID = "#rfp_cancel_change_clarification_date_"+selector;
    let elementSelector = $(elementID);
    elementSelector.on('click', () => {
        let ClickedID = "#rfp_clarification_date_expanded_" + selector;
        let elementSelectorClicked = $(ClickedID);
        if (elementSelectorClicked.length === 0) {
            ClickedID = "#rfp_clarification_date_expanded_" + selector;
            elementSelectorClicked = $(ClickedID);
        }
        elementSelectorClicked.fadeOut();
        ccsZremoveErrorMessage(document.getElementById(ClickedID.slice(1)))
        const elementIDChange = $("#change_clarification_date_" + selector);
        elementIDChange.show();
        saveButtonUnHideDateRFP();
    });
}

const saveButtonHideDateRFP = () => {
    document.getElementById("hideMeWhileDateChange").disabled = true;
}

const saveButtonUnHideDateRFP = () => {
    document.getElementById("hideMeWhileDateChange").disabled = false;
}

document.addEventListener('DOMContentLoaded', () => {

var tabLinks = document.querySelectorAll('.rfp-service-capabilities');
var allCheckBox = document.getElementsByClassName('rfp_cap');
var checkBoxByGroup = [];

var itemSubText ='';
var itemText = '';


if(tabLinks !==null)
{
ccsTabMenuNaviation();

if(tabLinks.length >0)
{
   itemSubText =document.getElementsByClassName('table-item-subtext')[0];;
   //itemText = document.getElementsByClassName('rfp-service-capabilities')[0].childNodes[0].data;
   itemText = tabLinks[0].getElementsByTagName('a')[0].childNodes[0].data;
   if(itemText != null && itemText !='')
{
  itemText = itemText.replaceAll(" ", "_");
  checkBoxByGroup = document.getElementsByClassName(itemText);
  checkBoxSelection(itemText)
}
Array.from(tabLinks).forEach(link => {
  link.addEventListener('click', function (e) {
   let currentTarget = e.currentTarget; 
   let clicked_index = $(this).index();
   
   itemSubText =currentTarget.getElementsByClassName('table-item-subtext')[0];
   itemText = tabLinks[clicked_index].getElementsByTagName('a')[0].childNodes[0].data;
   //itemText  =currentTarget.getElementsByClassName('rfp-service-capabilities')[0].childNodes[0].data; 
   itemText = itemText.replaceAll(" ", "_");
   checkBoxByGroup = document.getElementsByClassName(itemText);
     checkBoxSelection(itemText)
    return false;
  });
});
}
}


  function checkBoxSelection(itemText){
      
      updateGroupCheckBox();
      updateTotalAddedValue();

    for(var a =1; a < checkBoxByGroup.length+1; a++){
  
       let checkBoxIdConcat = itemText+'_'+a;
        
       let checkBox = $(`#${checkBoxIdConcat}`);
       checkBox.on('click', ()=>{

        updateGroupCheckBox();
        updateTotalAddedValue();

       }
       );    
     }
  }


  $('.select_all').on('click',()=>{
      
    for(var a =0; a < checkBoxByGroup.length; a++){
      if(!checkBoxByGroup[a].checked)
      checkBoxByGroup[a].checked = true
    }

      updateGroupCheckBox();
      updateTotalAddedValue();
    
  }); 
  
function updateTotalAddedValue()
{
  let count = 0;
  for(var a =0; a < allCheckBox.length; a++){
    if(allCheckBox[a].checked)
    count = count+1;
  }
  $('#total_added').text(count); 
}

function updateGroupCheckBox()
{
  let checkedCount = 0;
  for(var a =0; a < checkBoxByGroup.length; a++){
    if(checkBoxByGroup[a].checked)
    checkedCount = checkedCount+1;
  }
  itemSubText.innerHTML ='['+checkedCount +' Selected ]'; 
}

function clearAllCheckBox()
{
  for(var a =0; a < allCheckBox.length; a++){
    allCheckBox[a].checked = false  
  }
  clearSubHeadingText();
}

function clearSubHeadingText()
{
  for(var a =0; a < tabLinks.length; a++){
    document.getElementsByClassName('table-item-subtext')[a].innerHTML = '[ 0 Selected ]'
  }
  updateTotalAddedValue();
}

$('.ca_da_service_cap').on('click', function () {
  if ($(this).hasClass('selected')) {
    deselect($(this));
    $(".backdrop-vetting").fadeOut(200);
    $('.pop').slideFadeToggle();
  }
  return false;
});

$('#redirect-button-vetting').on('click', function () {
  deselect($('.dialog-close-vetting'));
  $(".backdrop-vetting").fadeOut(200);
  var route = this.name;
  if (route == 'Clear form') {
    clearAllCheckBox();
  } else {
    return false;
  }
});

$('.dialog-close-vetting').on('click', function () {
  $(".backdrop-vetting").fadeOut(200);
  deselect($('.dialog-close-vetting'));
  return false;
});


function deselect(e) {
  $('.pop').slideFadeToggle(function () {
    e.removeClass('selected');
  });
}

});

$('input[type="radio"]').on('click change', function(e) {
    if (e.currentTarget.value === 'Yes') {
       $('#conditional-rfp_radio_security_confirmation').fadeIn();
    } else {
        $('#conditional-rfp_radio_security_confirmation').hide();
    }
});
const removeErrorFieldsRfpIR35 = () => {
    $('.govuk-error-message').remove();
    $('.govuk-form-group--error').removeClass('govuk-form-group--error')
    $('.govuk-error-summary').remove();
    $(".govuk-input").removeClass("govuk-input--error");
    $('.govuk-form-group textarea').removeClass('govuk-textarea--error');
  
  }

$('#rfp_IR35_form').on('submit', (event) => {
    event.preventDefault();
    const radioButtonOne=  document.getElementById("ccs_vetting_type").checked;
    const radioButtonTwo=  document.getElementById("ccs_vetting_type-2").checked;
    //errorStore = emptyFieldCheckRfpKPI();
  
    if (radioButtonOne || radioButtonTwo) {
      document.forms["rfp_IR35_form"].submit();
    }
    else {
        removeErrorFieldsRfpIR35();
        errorStore=['There is a problem','You must confirm if you need a contracted out service or a supply of resource']
      ccsZPresentErrorSummary([errorStore]);
    }
  
  });
const countWords1 = (str) => { return str.trim().split(/\s+/).length };
document.addEventListener('DOMContentLoaded', () => {

    if (document.getElementById("ccs_rfp_acronyms_form") !== null) {

        let q_mandatory;
        let agreementID;
        if(document.getElementById("q_mandatory")) q_mandatory = document.getElementById("q_mandatory").value;
        if(document.getElementById("agreementID")) agreementID = document.getElementById("agreementID").value;
        // let lID = document.getElementById("lID").value;

        let with_value_count = 20,
            prev_input = 0,
            deleteButtons = document.querySelectorAll("a.del");
        let clearFieldsButtons = document.querySelectorAll("a.clear-fields");
        let deleteButtonCount = [];
        for (var acronym_fieldset = 20; acronym_fieldset > 1; acronym_fieldset--) {


            let this_fieldset = document.querySelector(".acronym_" + acronym_fieldset),
                term_box = document.getElementById("rfp_term_" + acronym_fieldset); 
            // document.getElementById("deleteButton_acronym_" + acronym_fieldset).classList.add("ccs-dynaform-hidden");
            // if( agreementID == 'RM6187') {
                document.getElementById("deleteButton_acronym_" + acronym_fieldset).classList.remove("ccs-dynaform-hidden");
            // }

            if (term_box.value !== "") {
                this_fieldset.classList.remove('ccs-dynaform-hidden');
                deleteButtonCount.push(acronym_fieldset);
                if (acronym_fieldset === 20) {
                    document.getElementById("ccs_rfpTerm_add").classList.add('ccs-dynaform-hidden');
                }
            } else {

                this_fieldset.classList.add('ccs-dynaform-hidden');
                with_value_count = acronym_fieldset;
            }

            if (acronym_fieldset === 2 && deleteButtonCount.length > 0) {
                $("#deleteButton_acronym_" + deleteButtonCount[deleteButtonCount.sort((a, b) => a - b).length - 1]).removeClass("ccs-dynaform-hidden");
            }
        }
        if (deleteButtonCount.length != 19) {
            document.getElementById("ccs_rfpTerm_add").classList.remove("ccs-dynaform-hidden");
        }
        
        // document.getElementById("ccs_rfpTerm_add").classList.remove("ccs-dynaform-hidden");
        document.getElementById("ccs_rfpTerm_add").addEventListener('click', (e) => {
            $('.govuk-form-group textarea').removeClass('govuk-textarea--error');
            checkFieldsRfp1();
            e.preventDefault();
            errorStoreforOptional = emptyFieldCheckdos('addmore');
            if (errorStoreforOptional.length == 0) {
                errorStore = emptyFieldCheckRfp1();
                if (errorStore.length == 0) {
                    removeErrorFieldsRfp1();
                    document.querySelector(".acronym_" + with_value_count).classList.remove("ccs-dynaform-hidden");
                    $("#deleteButton_acronym_" + with_value_count).removeClass("ccs-dynaform-hidden");
                    // if(agreementID == 'RM1043.8' && q_mandatory != true) {
                    //     prev_input = with_value_count - 1;
                    //     if(document.querySelector(".acronym_" + prev_input + " a.del")){
                    //         document.querySelector(".acronym_" + prev_input + " a.del").classList.add("ccs-dynaform-hidden");
                    //     }
                    // }
                    with_value_count++;
                    // let hideBtnCount = agreementID == 'RM1043.8' && lID == '1' ? 17 : 21 ;
                    if (with_value_count === 21 ) {
                        document.getElementById("ccs_rfpTerm_add").classList.add('ccs-dynaform-hidden');
                    }
                } else ccsZPresentErrorSummary(errorStore);
            } else ccsZPresentErrorSummary(errorStoreforOptional);
        });

        // delete buttons
        deleteButtons.forEach((db) => {
            //db.classList.remove('ccs-dynaform-hidden')
            
            // db.addEventListener('click', (e) => {
            //     e.preventDefault();
            //     let target = db.href.replace(/^(.+\/)(\d{1,2})$/, "$2"),
            //         prev_coll = Number(target) - 1,
            //         target_fieldset = db.closest("fieldset");
            //     target_fieldset.classList.add("ccs-dynaform-hidden");
            //     document.getElementById('rfp_term_' + target).value = "";
            //     document.getElementById('rfp_term_definition_' + target).value = "";
            //     if (prev_coll > 1) {
            //         document.querySelector('.acronym_' + prev_coll + ' a.del').classList.remove("ccs-dynaform-hidden");
            //     }
            //     document.getElementById("ccs_rfpTerm_add").classList.remove('ccs-dynaform-hidden');
            //     with_value_count--;
            // });

            db.addEventListener('click', (e) => {
                e.preventDefault();
        
                let target = db.href.replace(/^(.+\/)(\d{1,2})$/, "$2"),
                    prev_coll = Number(target) - 1,
                    target_fieldset = db.closest("fieldset");
                    
                let Sibling = target_fieldset.nextElementSibling; //document.getElementById(e.target.id).nextElementSibling;
                console.log(`target: ${target}`)
                if(target != 20) {
                    let ml = 1;
                    
                    let next_coll = Number(target);
                    let nextLevel_coll = Number(target);
                    let eptArr = [];
                    while (Sibling) {
                        
                        let siblingClassList = Sibling.classList;
                        if (Object.keys(siblingClassList).find(key => siblingClassList[key] === 'closeCCS') !== undefined && Object.keys(siblingClassList).find(key => siblingClassList[key] === 'ccs-dynaform-hidden') === undefined) {
                           let current_col = nextLevel_coll;
                            nextLevel_coll = (nextLevel_coll + 1);

                            eptArr.push(nextLevel_coll)
                            if(ml == 1) {
                                console.log(`First: ${ml} - ${next_coll}`)
                                var first = Sibling.querySelector("[name='term']");
                                var last  = Sibling.querySelector("[name='value']");
                                console.log(first.value)
                                console.log(last.value)
                                document.getElementById('rfp_term_' + current_col).value = first.value;
                                document.getElementById('rfp_term_definition_' + current_col).value = last.value;
                                // target_fieldset.querySelector("[name='term']").value = first.value;
                                // target_fieldset.querySelector("[name='value']").value = last.value;
                            } else {
                                next_coll = next_coll + 1;
                                console.log(`Usual: ${ml} - ${next_coll}`)
                                var first = Sibling.querySelector("[name='term']");
                                var last  = Sibling.querySelector("[name='value']");
                                console.log(first.value)
                                console.log(last.value)
                                document.getElementById('rfp_term_' + next_coll).value = first.value;
                                document.getElementById('rfp_term_definition_' + next_coll).value = last.value;
                            }
        
                            console.log(Sibling.classList);
                            Sibling = Sibling.nextElementSibling;
                        } else {
                            Sibling = false;
                        }
                    ml++;}
                    if(eptArr.length > 0) {
                        console.log(eptArr);
                        let removeLogic = eptArr.at(-1);
                        console.log(`removeLogic: ${removeLogic}`);
                        document.getElementById('rfp_term_' + removeLogic).value = "";
                        document.getElementById('rfp_term_definition_' + removeLogic).value = "";
                        document.getElementById('rfp_term_' + removeLogic).closest("fieldset").classList.add("ccs-dynaform-hidden")
                    } else {
                        target_fieldset.classList.add("ccs-dynaform-hidden");
                        document.getElementById('rfp_term_' + target).value = "";
                        document.getElementById('rfp_term_definition_' + target).value = "";
                        if (prev_coll > 1) {
                            document.querySelector('.acronym_' + prev_coll + ' a.del').classList.remove("ccs-dynaform-hidden");
                        }
                        document.getElementById("ccs_rfpTerm_add").classList.remove('ccs-dynaform-hidden');
                    }
                } else {
                    target_fieldset.classList.add("ccs-dynaform-hidden");
                    document.getElementById('rfp_term_' + target).value = "";
                    document.getElementById('rfp_term_definition_' + target).value = "";
                    if (prev_coll > 1) {
                        document.querySelector('.acronym_' + prev_coll + ' a.del').classList.remove("ccs-dynaform-hidden");
                    }
                    document.getElementById("ccs_rfpTerm_add").classList.remove('ccs-dynaform-hidden');
                }
                with_value_count--;
                if (with_value_count != 21) {
                    document.getElementById("ccs_rfpTerm_add").classList.remove("ccs-dynaform-hidden");
                }
            });
        });
        clearFieldsButtons.forEach((db) => {
            db.addEventListener('click', (e) => {

                e.preventDefault();
                let target = db.href.replace(/^(.+\/)(\d{1,2})$/, "$2"),
                    target_fieldset = db.closest("fieldset");
                    console.log('inside clear field target',target)

                target_fieldset.classList.add("ccs-dynaform");

                //document.getElementById('rfp_term_' + target).value = "";
                //document.getElementById('rfp_term_definition_' + target).value = "";
                removeErrorFieldsRfp1();
            });

        });

        if (document.getElementsByClassName("term_acronym_fieldset").length > 0) {
            let fieldSets = document.getElementsByClassName("term_acronym_fieldset");
            let length = fieldSets.length;
            while (length--) {
                let id = length + 1;

                let eleTerm = fieldSets[length].querySelector("#rfp_term_" + id);
                if (eleTerm != undefined && eleTerm != null) {
                    console.log('eleTerm',eleTerm,id)

                    eleTerm.addEventListener('focusout', (event) => {
                        let ele1 = event.target;
                        let definitionElementId = "rfp_term_definition_" + id;
                        let ele2 = document.getElementById(definitionElementId);
                        performSubmitAction(ele1, ele2);

                    });
                }
                let eleTermDefinition = fieldSets[length].querySelector("#rfp_term_definition_" + id);
                eleTermDefinition.addEventListener('focusout', (event) => {
                    let ele2 = event.target;
                    let ele1Id = "rfp_term_" + id;
                    let ele1 = document.getElementById(ele1Id);
                    performSubmitAction(ele1, ele2);
                });
                var performSubmitAction = function(ele1, ele2) {
                    console.log('inside submit')
                    if (ele1.value !== '' && ele2.value !== '') {
                        let formElement = document.getElementById("ccs_rfp_acronyms_form");
                        let action = formElement.getAttribute("action");
                        action = action + "&stop_page_navigate=true";

                        // $.ajax({
                        //   type: "POST",
                        //   url: action,
                        //   data: $("#ccs_rfp_acronyms_form").serialize(),
                        //   success: function () {

                        //     //success message mybe...
                        //   }
                        // });
                    }
                };
                // break;
            }
        }
    }

   
    
});





const checkFieldsRfp1 = () => {
    const start = 1;
    const end = 20;
    const pageHeading = document.getElementById('page-heading').innerHTML;
    for (var a = start; a <= end; a++) {
        let input = $(`#rfp_term_${a}`)
        let textbox = $(`#rfp_term_definition_${a}`);

        if (!pageHeading.includes("(Optional)")) {
            const field1 = countWords1(input.val()) < 50;
            const field2 = countWords1(textbox.val()) < 150;
            if (input.val() !== "" || field1) {

                $(`#rfp_term_${a}-error`).remove();
                $(`.acronym_${a} div`).removeClass('govuk-form-group--error');
                $(`.acronym_${a} input`).removeClass('govuk-input--error')

            }


            if (textbox.val() !== "" || field2) {

                $(`#rfp_term_definition_${a}-error`).remove();
                $(`.acronym_${a} div`).removeClass('govuk-form-group--error');
                $(`.acronym_${a} textarea`).removeClass('govuk-input--error');
                $(`.acronym_${a} textarea`).removeClass('govuk-textarea--error')
            }
        }

    }
}

const removeErrorFieldsRfp1 = () => {
    $('.govuk-error-message').remove();
    $('.govuk-form-group--error').removeClass('govuk-form-group--error')
    $('.govuk-error-summary').remove();
    $(".govuk-input").removeClass("govuk-input--error");
    $('.govuk-form-group textarea').removeClass('govuk-textarea--error');

}
let rfp_term_text = document.querySelectorAll('.rfpterm');
let rfp_term_definition = document.querySelectorAll('.rfp_term_definition');
let messagesendcountEle = document.querySelectorAll('.messagesendcount');
let removeErr = document.querySelectorAll('.removeErr');
removeErr.forEach(ele => {
    ele.addEventListener('keydown', (event) => {
        removeErrorFieldsRfp1();
    });
});
rfp_term_text.forEach(ele => {
    ele.addEventListener('keydown', (event) => {
        removeErrorFieldsRfp1();
    });
});
rfp_term_definition.forEach(ele => {
    ele.addEventListener('keydown', (event) => {
        removeErrorFieldsRfp1();
    });
});
messagesendcountEle.forEach(ele => {
    ele.addEventListener('keydown', (event) => {
        removeErrorFieldsRfp1();
    });
});
const emptyFieldCheckdos = (type) => {
    let fieldCheck = "",
        errorStore = [];
    removeErrorFieldsRfp1();
    const pageHeading = document.getElementById('page-heading').innerHTML;
    
    if(pageHeading.trim() == 'Terms and acronyms (Optional)'){
        fieldMsg = 'You must enter term or acronym'
        descMsg = 'You must enter definition for the term or acronym';
    }else{
        fieldMsg = 'You must add information in all fields.';
        descMsg = 'You must add information in all fields.';
    }
    for (var x = 1; x < 21; x++) {
        let term_field = document.getElementById('rfp_term_' + x);
        let definition_field = document.getElementById("rfp_term_definition_" + x);

        if (term_field != null && term_field.value !== undefined && definition_field !== undefined) {
            
            if(type == 'addmore'){
                const field1 = countWords1(term_field.value) > 50;
                const field2 = countWords1(definition_field.value) > 150;
                if (term_field.closest("fieldset").classList.value.indexOf("ccs-dynaform-hidden") === -1) {
                    checkFieldsRfp1();
                         if (term_field.value.trim() === '') {
                            fieldCheck = [term_field.id, fieldMsg];
                            ccsZaddErrorMessage(term_field, fieldMsg);
                            errorStore.push(fieldCheck);
                        } else if (definition_field.value.trim() === '') {
                            fieldCheck = [definition_field.id, descMsg];
                            //ccsZaddErrorMessage(term_field, 'You must add information in all fields.');
                            ccsZaddErrorMessage(definition_field, descMsg);
                            errorStore.push(fieldCheck);                        
                        } 
                }
            }else{
                if (!(term_field.value == '' && definition_field.value == '' || term_field.value != '' && definition_field.value != '') ) {
                    const field1 = countWords1(term_field.value) > 50;
                    const field2 = countWords1(definition_field.value) > 150;
                    if (term_field.closest("fieldset").classList.value.indexOf("ccs-dynaform-hidden") === -1) {
                        checkFieldsRfp1();
                            if (term_field.value.trim() === '') {
                                fieldCheck = [term_field.id, fieldMsg];
                                ccsZaddErrorMessage(term_field, fieldMsg);
                                errorStore.push(fieldCheck);
                            } else if (definition_field.value.trim() === '') {
                                fieldCheck = [definition_field.id, descMsg];
                                //ccsZaddErrorMessage(term_field, 'You must add information in all fields.');
                                ccsZaddErrorMessage(definition_field, descMsg);
                                errorStore.push(fieldCheck);                        
                            } 
                    }
                }
            }
        }

    }
    return errorStore;
}

const emptyFieldCheckRfp1 = () => {
    let fieldCheck = "",
        errorStore = [];
    removeErrorFieldsRfp1();
    const pageHeading = document.getElementById('page-heading').innerHTML;
    for (var x = 1; x < 21; x++) {
        let term_field = document.getElementById('rfp_term_' + x);
        let definition_field = document.getElementById("rfp_term_definition_" + x);

        if (term_field != null && term_field.value !== undefined && definition_field !== undefined) {
            const field1 = countWords1(term_field.value) > 50;
            const field2 = countWords1(definition_field.value) > 150;
            if (term_field.closest("fieldset").classList.value.indexOf("ccs-dynaform-hidden") === -1) {
                checkFieldsRfp1();
                if (!pageHeading.includes("Optional") && !pageHeading.includes("optional")) {
                    
                     if (term_field.value.trim() === '') {
                        fieldCheck = [term_field.id, 'You must add information in all fields.'];
                        ccsZaddErrorMessage(term_field, 'You must add information in all fields.');
                        errorStore.push(fieldCheck);
                    } else if (definition_field.value.trim() === '') {
                        fieldCheck = [definition_field.id, 'You must add information in all fields.'];
                        //ccsZaddErrorMessage(term_field, 'You must add information in all fields.');
                        ccsZaddErrorMessage(definition_field, 'You must add information in all fields.');
                        errorStore.push(fieldCheck);                        
                    } 
                    // else if (x != 1) {
                    //   let isError = false;
                    //   if (term_field.value.trim() === '') {
                    //     ccsZaddErrorMessage(term_field, 'You must add information in all fields.');
                    //     isError = true;
                    //   }
                    //   if (definition_field.value.trim() === '') {
                    //     ccsZaddErrorMessage(definition_field, 'You must add information in all fields.');
                    //     isError = true;
                    //   }
                    //   if (target_field !== undefined && target_field !== null && target_field.value.trim() === '') {
                    //     ccsZaddErrorMessage(target_field, 'You must add information in all fields.');
                    //     isError = true;
                    //   }
                    //   if (field1) {
                    //     ccsZaddErrorMessage(term_field, 'No more than 50 words are allowed.');
                    //     isError = true;
                    //   }
                    //   if (field2) {
                    //     ccsZaddErrorMessage(definition_field, 'No more than 250 words are allowed.');
                    //     isError = true;
                    //   }
                    //   if (isError) {
                    //     fieldCheck = [definition_field.id, 'You must add information in all fields.'];
                    //     errorStore.push(fieldCheck);
                    //   }
                    // }
               }
            }
        }
    }
    return errorStore;
}

const emptyFieldCheckOptionalRfp1 = () => {
    let fieldCheck = "",
        errorStore = [];
    removeErrorFieldsRfp1();
    const pageHeading = document.getElementById('page-heading').innerHTML;
    const queryString = window.location.search;
            const urlParams = new URLSearchParams(queryString);
            let LOTID_VAR;
            if(document.getElementById('lID') !== null) {
                LOTID_VAR = document.getElementById('lID').value;
            }
            if(urlParams.get('agreement_id') == 'RM1043.8' && urlParams.get('id') == 'Criterion 3' && ((LOTID_VAR == 1 && urlParams.get('group_id') == 'Group 19') || (LOTID_VAR == 3 && urlParams.get('group_id') == 'Group 17'))) {
                let term_field = document.getElementById('rfp_term_' + 1);
                let definition_field = document.getElementById("rfp_term_definition_" + 1);
                if (term_field != null && term_field.value !== undefined && term_field.value.trim() !== '') {
                    
                    if (term_field.closest("fieldset").classList.value.indexOf("ccs-dynaform-hidden") === -1) {
                        checkFieldsRfp1();
                            if (definition_field.value.trim() === '') {
                                fieldCheck = [definition_field.id, 'You must add information in all fields.'];
                                //ccsZaddErrorMessage(term_field, 'You must add information in all fields.');
                                ccsZaddErrorMessage(definition_field, 'You must add information in all fields.');
                                errorStore.push(fieldCheck);  
                                                      
                            } 
                    }
    
                   
                }
        
            }

    
    return errorStore;
}


const ccsZvalidateRfpAcronymsRFP = (event) => {

    event.preventDefault();
    // const classList = document.getElementsByClassName("govuk-hint-error-message");
    // const classLength = classList.length;


    // if (classLength != 0) {
    //     return false;
    // } else {
    //     // document.forms["ccs_rfp_acronyms_form"].submit();
    // }

    // return false;

    errorStoreforOptional = emptyFieldCheckdos('submit');
        if (errorStoreforOptional.length == 0) {
    
    errorStore = emptyFieldCheckRfp1();

    errorStore = errorStore == null || errorStore.length <= 0 ? emptyFieldCheckRfp1() : errorStore;
    console.log('Inside optional check errorStore after',errorStore)
   
    let term_field = document.getElementById('rfp_term_' + 1);
    let definition_field = document.getElementById("rfp_term_definition_" + 1);
    if (term_field != null && term_field.value !== undefined && term_field.value.trim() !== '') {
        if (definition_field != null && definition_field.value != undefined && definition_field.value.trim() == '') {

        errorStore =  emptyFieldCheckOptionalRfp1();
        }

    }


    if (errorStore.length === 0) {
        const classList = document.getElementsByClassName("govuk-hint-error-message");
        const classLength = classList.length;
    
    if (classLength != 0) {
        return false;
    } else {
        document.forms["ccs_rfp_acronyms_form"].submit();
    }
    
  }else {
    ccsZPresentErrorSummary(errorStore);
  }
} else ccsZPresentErrorSummary(errorStoreforOptional);
    //errorStore = emptyFieldCheckRfp();

    //if (errorStore.length === 0) {


    // Update at 02-08-2022 -> CCS For FC

    
    // if (errorStore.length === 0) { document.forms["ccs_rfp_acronyms_form"].submit(); } else { ccsZPresentErrorSummary(errorStore); }
};

var maxchars = 10000;

$('.rfp_term_definition').keyup(function(e) {
    var tlength = $(this).val().length;
    $(this).val($(this).val().substring(0, maxchars));
    var tlength = $(this).val().length;
    remain = maxchars - parseInt(tlength);
    $(this).text(remain);

});

let maxscount = 6;
$('.rfp_term_maxsupplycount').keyup(function(e) {
    if(document.getElementById("CurrentLotSupplierCount") !== null) {
        let initmax = document.getElementById("CurrentLotSupplierCount").value;
        if(initmax != "") {
            maxscount = parseInt(initmax);
            maxscount = maxscount.toString().length
        }
    }
    var tlength = $(this).val().length;
    $(this).val($(this).val().substring(0, maxscount));
    var tlength = $(this).val().length;
    remain = maxscount - parseInt(tlength);
    $(this).text(remain);

    // if(document.getElementById("CurrentLotSupplierCount") !== null) {
    //     let initmax = document.getElementById("CurrentLotSupplierCount").value;
    //     if(initmax != "") {
    //         //Error
    //         if(parseInt(initmax) < parseInt($(this).val())) {
    //             $(this).val("");
    //         }
    //     }
    // }
});

let maxscountscore = 3;
$('.percentage_limit').keyup(function(e) {
    var tlength = $(this).val().length;
    $(this).val($(this).val().substring(0, maxscountscore));
    var tlength = $(this).val().length;
    remain = maxscountscore - parseInt(tlength);
    $(this).text(remain);

});

    $('.percentage_limit_dos6').keypress(function (e) {
        var character = String.fromCharCode(e.keyCode)
          var strlen = this.value.length;
        if(strlen == 4) {
            if(character !== '.') {
              if(this.value[2] !== '.') {
                if(character !== undefined) {
                    e.preventDefault();
                    return false;
                }
            }
          }
        }
          
          var newValue = this.value + character;
          if (isNaN(newValue) || hasDecimalPlace(newValue, 3)) {
              e.preventDefault();
              return false;
          }
      });
      
      function hasDecimalPlace(value, x) {
          var pointIndex = value.indexOf('.');
          return  pointIndex >= 0 && pointIndex < value.length - x;
      }


var maxless = 500;

$('.rfpterm').keyup(function(e) {
    var tlength = $(this).val().length;
    $(this).val($(this).val().substring(0, maxless));
    var tlength = $(this).val().length;
    remain = maxless - parseInt(tlength);
    $(this).text(remain);

});

var nameproject = 250;

$('.nameproject').keyup(function(e) {
    var tlength = $(this).val().length;

    $(this).val($(this).val().substring(0, nameproject));
    var tlength = $(this).val().length;
    remain = nameproject - parseInt(tlength);
    $(this).text(remain);

});

$(".nameproject").keypress(function(e) {
    var maxLen = $(this).val().length;
    var keyCode = e.which;

    if (maxLen >= 250 && (keyCode != 8) && (keyCode < 48 || keyCode > 57)) {
        return false;
    }

});

var nameprojectdos = 500;

$('.nameprojectdos').keyup(function(e) {
    var tlength = $(this).val().length;

    $(this).val($(this).val().substring(0, nameprojectdos));
    var tlength = $(this).val().length;
    remain = nameprojectdos - parseInt(tlength);
    $(this).text(remain);

});

$(".nameprojectdos").keypress(function(e) {
    var maxLen = $(this).val().length;
    var keyCode = e.which;

    if (maxLen >= 500 && (keyCode != 8) && (keyCode < 48 || keyCode > 57)) {
        return false;
    }

});



$(".rfpterm").keypress(function(e) {
    var maxLen = $(this).val().length;
    var keyCode = e.which;

    if (maxLen >= 500 && (keyCode != 8) && (keyCode < 48 || keyCode > 57)) {
        return false;
    }

});

$(".rfp_term_definition").keypress(function(e) {
    var maxLen = $(this).val().length;
    var keyCode = e.which;

    if (maxLen >= 10000 && (keyCode != 8) && (keyCode < 48 || keyCode > 57)) {
        return false;
    }

});

var messagesendcount = 5000;

$('.messagesendcount').keyup(function(e) {
    var tlength = $(this).val().length;
    
    $(this).val($(this).val().substring(0, messagesendcount));
    var tlength = $(this).val().length;
    remain = messagesendcount - parseInt(tlength);
    $(this).text(remain);

});

$(".messagesendcount").keypress(function(e) {
    var maxLen = $(this).val().length;
    
    var keyCode = e.which;

    if (maxLen >= 5000 && (keyCode != 8) && (keyCode < 48 || keyCode > 57)) {
        return false;
    }

});


var messagesendcountDaSocial = 2000;

$('.messagesendcountDaSocial').keyup(function(e) {
    var tlength = $(this).val().length;

    $(this).val($(this).val().substring(0, messagesendcountDaSocial));
    var tlength = $(this).val().length;
    remain = messagesendcountDaSocial - parseInt(tlength);
    $(this).text(remain);

});

$(".messagesendcountDaSocial").keypress(function(e) {
    var maxLen = $(this).val().length;
    var keyCode = e.which;

    if (maxLen >= 2000 && (keyCode != 8) && (keyCode < 48 || keyCode > 57)) {
        return false;
    }

});
$('.rfp_term_definition_new').on('keypress', function (evt) {
    let value = $(this).val();
    evt = (evt) ? evt : window.event;
    var charCode = (evt.which) ? evt.which : evt.keyCode;
    if (charCode > 31 && (charCode < 48 || charCode > 57)) {
        return false;
    }
    return true;
    
});

document.addEventListener('DOMContentLoaded', () => {
  if (document.getElementById('rfp_budget_for') !== null) {
    let allInputfield = document.querySelectorAll('.govuk-input');
    var validNumber = new RegExp(/^\d+$/);
    allInputfield.forEach(element => {
      element.addEventListener('keydown', event => {
        if (event.key === '.') {
          event.preventDefault();
          return;
        }
        if (event.keyCode === 69) {
          event.preventDefault();
          return;
        }
        if (event.keyCode === 187) {
          event.preventDefault();
          return;
        }
        if (event.keyCode === 189) {
          event.preventDefault();
          return;
        }
      });
    });
  }
});
const emptyQuestionFieldCheckBudget = () => {
  let fieldCheck = '',
    errorStore = [];
  const pageHeadingVal = document.getElementById('page-heading').innerHTML;
  const pageHeading = pageHeadingVal.toLowerCase();

  var reg = new RegExp('^[0-9]$');
  if ($('#rfp_maximum_estimated_contract_value').val() != null && $('#rfp_maximum_estimated_contract_value').val() != undefined) {
    const maxBudget = $('#rfp_maximum_estimated_contract_value').val();
    const minBudget = $('#rfp_minimum_estimated_contract_value').val();
    
    
    if(maxBudget=='0'){
      errorStore.push(['rfp_maximum_estimated_contract_value', 'Value must be greater then or equal to 1']);
      ccsZPresentErrorSummary(errorStore);
      return;
    }

    if(minBudget!='' && maxBudget==''){
      errorStore.push(['rfp_maximum_estimated_contract_value', 'Please enter the Maximum']);
      ccsZPresentErrorSummary(errorStore);
      return;
    }

    if (maxBudget.includes('-')) {
      errorStore.push(['rfp_maximum_estimated_contract_value', 'You must enter a positive value']);
      ccsZPresentErrorSummary(errorStore);
      return;
    }
    if (minBudget.includes('-')) {
      errorStore.push(['rfp_maximum_estimated_contract_value', 'You must enter a positive value']);
      ccsZPresentErrorSummary(errorStore);
      return;
    }

    if (pageHeading.includes('(optional)')) {
      let msg = '';
      //if (!maxBudget) msg = 'You must enter a value';
      if (Number(maxBudget) < 0) msg = 'You must enter a positive value';
      if (Number(maxBudget) > 0 && Number(minBudget) > 0 && Number(maxBudget) < Number(minBudget)) {
        msg = 'Entry should be greater than minimum estimated contract value';
        let element = document.getElementById('rfp_maximum_estimated_contract_value');
        ccsZaddErrorMessage(element, msg);
        fieldCheck = ccsZvalidateWithRegex('rfp_maximum_estimated_contract_value', msg, /\d+/);

        errorStore.push([element.id, msg]);
      }
    }
  }

  if ($('#rfp_minimum_estimated_contract_value').val() != null && $('#rfp_minimum_estimated_contract_value').val() != undefined) {
    const maxBudget = $('#rfp_maximum_estimated_contract_value').val();
    const minBudget = $('#rfp_minimum_estimated_contract_value').val();

    if (maxBudget.includes('-')) {
      errorStore.push(['rfp_maximum_estimated_contract_value', 'You must enter a positive value']);
      ccsZPresentErrorSummary(errorStore);
      return;
    }
    if (minBudget.includes('-')) {
      errorStore.push(['rfp_maximum_estimated_contract_value', 'You must enter a positive value']);
      ccsZPresentErrorSummary(errorStore);
      return;
    }
    let msg = '';

    if (pageHeading.includes('(optional)')) {
      //if (!minBudget) msg = 'You must enter a value';
      if (Number(minBudget) < 0) msg = 'You must enter a positive value';
      if (Number(minBudget) > 0 && Number(maxBudget) > 0 && Number(minBudget) > Number(maxBudget)) {
        msg = 'Entry should be lesser than maximum estimated contract value';
        let element = document.getElementById('rfp_minimum_estimated_contract_value');
        ccsZaddErrorMessage(element, msg, false);
        fieldCheck = ccsZvalidateWithRegex('rfp_minimum_estimated_contract_value', msg, /\d+/);
        errorStore.push([element.id, msg, false]);
      }
    }
  }

  if ($('#rfp_contracting_auth')) {
    if (!pageHeading.includes('(optional)')) {
      let msg = '';
      if (!$('#rfp_contracting_auth').val()) msg = 'You must enter information here';
      fieldCheck = ccsZvalidateTextArea('rfp_contracting_auth', msg);

      if (fieldCheck !== true) errorStore.push(fieldCheck);
    }
  }

  if ($('#rfp_prob_statement_n')) {
    if (!pageHeading.includes('(optional)')) {
      let msg = '';
      if (!$('#rfp_prob_statement_n').val()) msg = 'You must enter information here';
      if (condLength($('#rfp_prob_statement_n').val()))
        msg = char ? 'Entry must be <= 5000 characters' : 'Entry must be <= 500 words';
      fieldCheck = ccsZvalidateTextArea('rfp_prob_statement_n', msg, !condLength($('#rfp_prob_statement_n').val()));

      if (fieldCheck !== true) errorStore.push(fieldCheck);
    }
  }

  if ($('#rfp_prob_statement_e')) {
    if (!pageHeading.includes('(optional)')) {
      let msg = '';
      if (!$('#rfp_prob_statement_e').val()) msg = 'You must enter information here';
      if (condLength($('#rfp_prob_statement_e').val()))
        msg = char ? 'Entry must be <= 5000 characters' : 'Entry must be <= 500 words';
      fieldCheck = ccsZvalidateTextArea('rfp_prob_statement_e', msg, !condLength($('#rfp_prob_statement_e').val()));

      if (fieldCheck !== true) errorStore.push(fieldCheck);
    }
  }
  return errorStore;
};

const ccsZvalidateBudgetQuestions =  event  => {
  event.preventDefault();
  const errorStore = emptyQuestionFieldCheckBudget();

  if (errorStore.filter(Boolean).length === 0) document.forms['rfp_budget_for'].submit();
  else ccsZPresentErrorSummary(errorStore);
};
const removeErrorFieldsRfpBudget = () => {
  $('.govuk-error-message').remove();
  $('.govuk-form-group--error').removeClass('govuk-form-group--error');
  $('.govuk-error-summary').remove();
  $('.govuk-input').removeClass('govuk-input--error');
  $('.govuk-form-group textarea').removeClass('govuk-textarea--error');
};
$('#rfp_budget_for').on('submit', event => {
  removeErrorFieldsRfpBudget();
  event.preventDefault();
  const errorStore = emptyQuestionFieldCheckBudget();

  if (errorStore.filter(Boolean).length === 0) document.forms['rfp_budget_for'].submit();
  else ccsZPresentErrorSummary(errorStore);
  //document.forms['rfp_budget_for'].submit();
});

let evaluateSupplierForm = $('#suppliers_to_evaluate');
let initmax = document.getElementById("CurrentLotSupplierCount");
evaluateSupplierForm.on('submit', event => {
  event.preventDefault();
  errorStore = [];
  let supplierCountInput = document.getElementById('rfp_contracting_auth');
  ccsZremoveErrorMessage(supplierCountInput)
  // if(supplierCountInput.value.length > 8){
  //   ccsZaddErrorMessage(supplierCountInput, 'Supplier cannot be more than 8 digits');
  //   errorStore.push(['suppliers_to_evaluate', 'Supplier cannot be more than 8 digits']);
  //   ccsZPresentErrorSummary(errorStore);
  // }

  if (supplierCountInput.value < 3) {
    var urlParamsDefault = new URLSearchParams(window.location.search);
    var agreement_id =  urlParamsDefault.get('agreement_id');
    var criteria = urlParamsDefault.get('id');
    var group_id = urlParamsDefault.get('group_id');
    if(agreement_id == 'RM1043.8' && criteria == 'Criterion 2' && group_id == 'Group 2'){
      ccsZaddErrorMessage(supplierCountInput, 'Enter the quantity, minimum 3');
      errorStore.push(['suppliers_to_evaluate', 'Enter the quantity, minimum 3']);
    }else {
      ccsZaddErrorMessage(supplierCountInput, 'Supplier must be minimum 3');
      errorStore.push(['suppliers_to_evaluate', 'Supplier must be minimum 3']);
    }
    ccsZPresentErrorSummary(errorStore);
  } 
  
  if(parseInt(supplierCountInput.value) > parseInt(initmax.value)) {
    ccsZaddErrorMessage(supplierCountInput, `Value should not exceed current lot's suppliers (${initmax.value})`);
    errorStore.push(['suppliers_to_evaluate', `Value should not exceed current lot's suppliers (${initmax.value})`]);
    ccsZPresentErrorSummary(errorStore);
  }
  
  if(errorStore.length == 0){
    document.forms['suppliers_to_evaluate'].submit();
  }

});

document.addEventListener('DOMContentLoaded', () => {
   if (document.getElementById('rfp_date') !== null) {
      let rfpResourceStartDay = $('.rfp_resource_start_day');
      let rfpResourceStartMonth = $('.rfp_resource_start_month');
      let rfpResourceStartYear = $('.rfp_resource_start_year');

      rfpResourceStartDay.on('keydown', (event) => {
         console.log("event.keyCode",event.keyCode);

         if (event.key === '.' || event.keyCode ===69 || event.keyCode ===189 || event.keyCode ===109)
           event.preventDefault(); });

           rfpResourceStartMonth.on('keydown', (event) => {
            if (event.key === '.' || event.keyCode ===69 || event.keyCode ===189 || event.keyCode ===109)
              event.preventDefault(); });

              rfpResourceStartYear.on('keydown', (event) => {
               if (event.key === '.' || event.keyCode ===69 || event.keyCode ===189 || event.keyCode ===109)
                 event.preventDefault(); });

      rfpResourceStartDay.on('keyup', () => {
         if(DateCheckResourceStart())
         {
            if(MonthCheckResourceStart())
            YearCheckResourceStart();
         }
      });

      rfpResourceStartMonth.on('keyup', () => {
         if(MonthCheckResourceStart())
         {
            if( DateCheckResourceStart())
            YearCheckResourceStart();
         }
      });

      rfpResourceStartYear.on('keyup', () => {
         if(YearCheckResourceStart())
         {
            if(MonthCheckResourceStart())
            DateCheckResourceStart();
         }   
      });

      var currentEventId = '';
      let rfpDurationField = $('.rfp_duration');
      
      rfpDurationField.on('keydown', (event) => {
        
         if (event.key === '.'  || event.keyCode ===69 || event.keyCode ===189 || event.keyCode ===109)
           event.preventDefault(); });

      rfpDurationField.on('blur', (event) => {

         let currentId = event.currentTarget.id;
         let currentIdValue = $(`#${currentId}`);
         currentEventId = currentId;
         if (currentId.includes('day')) {
            DateCheck(currentIdValue,currentId);
         }

         else if (currentId.includes('month')) {
            MonthCheck(currentIdValue,currentId);
         }

         else if (currentId.includes('year')) {
            YearCheck(currentIdValue,currentId)
         }

      });

      const DateCheckResourceStart = () => {
         let value = rfpResourceStartDay;
         let matchValue = !value.val().match(/^\d\d?$/);
         let endmonthCheck = Number(value.val()) > 31;
         let startmonthCheck = Number(value.val()) < 1;
         if(value != undefined && value.val() != '')
         {
         if (matchValue || endmonthCheck || startmonthCheck) {

            rfpResourceStartDay.addClass('govuk-form-group--error');
            $('.durations').addClass('govuk-form-group--error');
            $('#event-name-error-date').html('Enter a valid date')
            return false ;
         } else {
            rfpResourceStartDay.removeClass('govuk-form-group--error');
            $('.durations').removeClass('govuk-form-group--error');
            $('#event-name-error-date').html('');
            if(document.getElementById('agreementID').value !== 'RM1043.8' && document.getElementById('agreementID').value !== 'RM1557.13') {
            let isValid = isProjectStartDateValid();
            if(isValid){
               return true;
            }else{
               return false;
            }
         }
         else{
            removeErrorFieldsdates();

            return true;
          }
         }
         
      }
      }

      const MonthCheckResourceStart = () => {
         const value = rfpResourceStartMonth;
         let matchValue = !value.val().match(/^\d\d?$/);
         let endmonthCheck = Number(value.val()) > 12;
         let startmonthCheck = Number(value.val()) <= 0;
         if(value != undefined && value.val() != '')
         {
         if (matchValue || endmonthCheck || startmonthCheck) {
            rfpResourceStartMonth.addClass('govuk-form-group--error');
            $('.durations').addClass('govuk-form-group--error');
            $('#event-name-error-date').html('Enter a valid month');
            return false ;
         } else {
            rfpResourceStartMonth.removeClass('govuk-form-group--error');
            $('.durations').removeClass('govuk-form-group--error');
            $('#event-name-error-date').html('');
            if(document.getElementById('agreementID').value !== 'RM1043.8' && document.getElementById('agreementID').value !== 'RM1557.13') {
            let isValid = isProjectStartDateValid();
            if(isValid){
               return true;
            }else{
               return false;
            }
         }
         else{
            removeErrorFieldsdates();
            return true;
         }
         }
      }
      }
      const YearCheckResourceStart = () => {
        // let fieldCheck = "", errorStore = [];
         let value = rfpResourceStartYear;
         let matchValue = !value.val().match(/^\d{4}$/);
         let endyearCheck = Number(value.val()) > 2121;
         let currentYear = new Date().getFullYear();
         let startyearCheck = Number(value.val()) < currentYear;
         if(document.getElementById('agreementID').value !== 'RM1043.8') {

         if(value != undefined && value.val() != '')
         {
         // if (matchValue || endyearCheck || startyearCheck) { XBN00121
         

         if (matchValue || endyearCheck) {
            rfpResourceStartYear.addClass('govuk-form-group--error');
            $('.durations').addClass('govuk-form-group--error');
            $('#event-name-error-date').html('Enter a valid year');
            // fieldCheck = ccsZvalidateWithRegex("rfp_resource_start_year", "Enter a valid year", /^\d{1,}$/);
            // if (fieldCheck !== true){ errorStore.push(fieldCheck)
            // }else{
            //   fieldCheck = ccsZvalidateWithRegex("rfp_resource_start_year", "Enter a valid year", /^\d{1,}$/);
            // }
            //  console.log('errorStore',errorStore)
            //  if(errorStore.length>0){
            //    ccsZPresentErrorSummary(errorStore);
            //    return false;
            //   }

            return false ;
         } else {
            rfpResourceStartYear.removeClass('govuk-form-group--error');
            $('.durations').removeClass('govuk-form-group--error');
            $('#event-name-error-date').html('');
            if(document.getElementById('agreementID').value !== 'RM1043.8' && document.getElementById('agreementID').value !== 'RM1557.13') {
            let isValid = isProjectStartDateValid();
            if(isValid){
               return true;
            }else{
               return false;
            }
          
         }
        }
      }
      else{
         removeErrorFieldsdates();
         return true;
      }
      }
     // const durationYear = document.getElementsByClassName('rfp_duration_year_25');
      const DateCheck = (rfpDay,currentId) => {
         let value = rfpDay;
         let currentEID = currentId;
         let matchValue = !value.val().match(/^\d\d?$/);
         let endmonthCheck = Number(value.val()) > 31;
         let startmonthCheck = Number(value.val()) < 0;
         let yrValidation = false;
         let yrValidation2 = false;
         if(document.getElementById('agreementID').value === 'RM1043.8' && document.getElementById('gID').value === 'Group 18' && document.getElementById('lID').value === '1') {
            removeErrorFieldsdates();
            }
            if(document.getElementById('agreementID').value === 'RM1557.13' && document.getElementById('gID').value === 'Group 10' && document.getElementById('lID').value === '4') {
               removeErrorFieldsdates();
               }   
         if(value.val() != ''){
            const durationYear = document.getElementsByClassName('rfp_duration_year_25');
            const durationMonth = document.getElementsByClassName('rfp_duration_month_25');
            const durationDay = document.getElementsByClassName('rfp_duration_day_25');

            if(currentEID=='rfp_duration_days_Question12'){
            const YearProjectRun = Number(durationYear[0].value);
            const MonthProjectRun = Number(durationMonth[0].value);
            const DaysProjectRun = Number(durationDay[0].value);
            
            if(YearProjectRun==4){
               if(MonthProjectRun>0 || DaysProjectRun>0){
                  yrValidation = true;
               }
            }else if(YearProjectRun==3){
               if(MonthProjectRun==12 && DaysProjectRun>0){
                  yrValidation = true;
               }
            }else if(YearProjectRun>4){
               yrValidation = true;
            }
            }
            if(currentEID=='rfp_duration_days_Question13'){
               yrValidation2 = validateExtPeriod();
            }
         }
         if(document.getElementById('agreementID').value === 'RM1043.8' && document.getElementById('gID').value === 'Group 18' && document.getElementById('lID').value === '1') {
           let fieldCheck = "",
            errorStore = [];
            if ((matchValue || endmonthCheck || startmonthCheck) && value.val() != '') {
               // $(`#${currentEventId}`).addClass('govuk-form-group--error');
               // $(`.${currentEventId}`).addClass('govuk-form-group--error');
               //     $(`.p_durations_${currentEventId}`).html('Enter a valid day');
               //    fieldCheck = ccsZvalidateWithRegex("rfp_duration_days", "Enter a valid day", /^\d{1,}$/);
               //    if (fieldCheck !== true) errorStore.push(fieldCheck);
               //    if(errorStore.length>0){
               //        ccsZPresentErrorSummary(errorStore);
               //        return false;
               //    }

              
              
            }
            else {
               $(`#${currentEventId}`).removeClass('govuk-form-group--error');
               $(`.${currentEventId}`).removeClass('govuk-form-group--error');
               $(`.p_durations_${currentEventId}`).html('');
            }
         }
         else if(document.getElementById('agreementID').value === 'RM1557.13' && document.getElementById('gID').value === 'Group 10' && document.getElementById('lID').value === '4') {
            let fieldCheck = "",
             errorStore = [];
             if ((matchValue || endmonthCheck || startmonthCheck) && value.val() != '') {
                // $(`#${currentEventId}`).addClass('govuk-form-group--error');
                // $(`.${currentEventId}`).addClass('govuk-form-group--error');
                //     $(`.p_durations_${currentEventId}`).html('Enter a valid day');
                //    fieldCheck = ccsZvalidateWithRegex("rfp_duration_days", "Enter a valid day", /^\d{1,}$/);
                //    if (fieldCheck !== true) errorStore.push(fieldCheck);
                //    if(errorStore.length>0){
                //        ccsZPresentErrorSummary(errorStore);
                //        return false;
                //    }
 
               
               
             }
             else {
                $(`#${currentEventId}`).removeClass('govuk-form-group--error');
                $(`.${currentEventId}`).removeClass('govuk-form-group--error');
                $(`.p_durations_${currentEventId}`).html('');
             }
          }
        else if ((matchValue || endmonthCheck || startmonthCheck || yrValidation || yrValidation2) && value.val() != '') {
            $(`#${currentEventId}`).addClass('govuk-form-group--error');
            $(`.${currentEventId}`).addClass('govuk-form-group--error');
            if(currentEID=='rfp_duration_days_Question12'){
               if(yrValidation){
                  $(`.p_durations_${currentEventId}`).html('Project Duration should not be greater than 4 years');
                  }else{
                  $(`.p_durations_${currentEventId}`).html('Enter a valid day');
                  }
               }else if(currentEID=='rfp_duration_days_Question13'){
                  if(yrValidation2==1){
                        $(`.p_durations_${currentEventId}`).html('This should not exceed 50% of the length of the original project');
                     }else if(yrValidation2==2){
                        $(`.p_durations_${currentEventId}`).html('Contract extension should be less than project run date');
                     }else{
                     $(`.p_durations_${currentEventId}`).html('Enter a valid day');
                     }
               }else{
                  $(`.p_durations_${currentEventId}`).html('Enter a valid day');
               }
         } else {
            $(`#${currentEventId}`).removeClass('govuk-form-group--error');
            $(`.${currentEventId}`).removeClass('govuk-form-group--error');
            document.getElementById(currentEID).classList.remove('govuk-form-group--error');
            $(`.p_durations_${currentEventId}`).html('');
         }
   }
   
      const MonthCheck = (rfpMonth,currentId) => {
         const value = rfpMonth;
         let currentEID = currentId;
         let matchValue = !value.val().match(/^\d\d?$/);
         let endmonthCheck = Number(value.val()) > 12;
         let startmonthCheck = Number(value.val()) < 0;
         let yrValidation = false;
         let yrValidation2 = false;
         if(document.getElementById('agreementID').value === 'RM1043.8' && document.getElementById('gID').value === 'Group 18' && document.getElementById('lID').value === '1') {
            removeErrorFieldsdates();
            }
            if(document.getElementById('agreementID').value === 'RM1557.13' && document.getElementById('gID').value === 'Group 10' && document.getElementById('lID').value === '4') {
               removeErrorFieldsdates();
               }
         if(value.val() != ''){
            const durationYear = document.getElementsByClassName('rfp_duration_year_25');
            const durationMonth = document.getElementsByClassName('rfp_duration_month_25');
            const durationDay = document.getElementsByClassName('rfp_duration_day_25');

            if(currentEID=='rfp_duration_months_Question12'){
            const YearProjectRun = Number(durationYear[0].value);
            const MonthProjectRun = Number(durationMonth[0].value);
            const DaysProjectRun = Number(durationDay[0].value);
            
            if(DaysProjectRun>0 && YearProjectRun>0){
               did = document.getElementsByClassName('rfp_duration_day_25')[0].id;
              //  yid = document.getElementsByClassName('rfp_duration_year_25')[1].id;
               let currentdIdValue = $(`#${did}`);
              //  let currentyIdValue = $(`#${yid}`);
               DateCheck(currentdIdValue,did);
              //  YearCheck(currentyIdValue,yid);
            }

            if(YearProjectRun==4){
               if(MonthProjectRun>0 || DaysProjectRun>0){
                  yrValidation = true;
               }
            }else if(YearProjectRun==3){
               if(MonthProjectRun==12 && DaysProjectRun>0){
                  yrValidation = true;
               }
            }else if(YearProjectRun>4){
                  yrValidation = true;
            }
         }
         if(currentEID=='rfp_duration_months_Question13'){
            const YearProjectRun2 = Number(durationYear[1].value);
             const MonthProjectRun2 = Number(durationMonth[1].value);
             const DaysProjectRun2 = Number(durationDay[1].value);
 
             if(DaysProjectRun2>0 && YearProjectRun2>0){
                did = document.getElementsByClassName('rfp_duration_day_25')[1].id;
               //  yid = document.getElementsByClassName('rfp_duration_year_25')[1].id;
                let currentdIdValue = $(`#${did}`);
               //  let currentyIdValue = $(`#${yid}`);
                DateCheck(currentdIdValue,did);
               //  YearCheck(currentyIdValue,yid);
             }
            //  if(YearProjectRun2==4){
            //     if(MonthProjectRun2>0 || DaysProjectRun2>0){
            //        yrValidation2 = true;
            //     }
            //  }else if(YearProjectRun2==3){
            //     if(MonthProjectRun2==12 && DaysProjectRun2>0){
            //        yrValidation2 = true;
            //     }
            //  }else if(YearProjectRun2>4){
            //        yrValidation2 = true;
            //  }
            yrValidation2 = validateExtPeriod();
            }
         }
         if(document.getElementById('agreementID').value === 'RM1043.8' && document.getElementById('gID').value === 'Group 18' && document.getElementById('lID').value === '1') {
            endmonthCheck = Number(value.val()) > 11;
            let fieldCheck = "",
            errorStore = [];
            if ((matchValue || endmonthCheck || startmonthCheck) && value.val() != '') {
               // $(`#${currentEventId}`).addClass('govuk-form-group--error');
               // $(`.${currentEventId}`).addClass('govuk-form-group--error');
               // if((matchValue || startmonthCheck)){
               //     $(`.p_durations_${currentEventId}`).html('Enter a valid month');
               //    fieldCheck = ccsZvalidateWithRegex("rfp_duration_months", "Enter a valid month", /^\d{1,}$/);
               //    if (fieldCheck !== true) errorStore.push(fieldCheck);
               //    if(errorStore.length>0){
               //        ccsZPresentErrorSummary(errorStore);
               //        return false;
               //    }

               // }
               // if(endmonthCheck){
                  
               //    $(`.p_durations_${currentEventId}`).addClass('govuk-form-group--error');   
               //    $(`.p_durations_${currentEventId}`).html('Enter a month between 1 to 11');
               //    fieldCheck = ccsZvalidateWithRegex("rfp_duration_months", "Enter a month between 1 to 11", /^\d{1,}$/);
               //    if (fieldCheck !== true) errorStore.push(fieldCheck);
               //    if(errorStore.length>0){
               //        ccsZPresentErrorSummary(errorStore);
               //        return false;
               //    }
               // }
            }
            else {
               $(`#${currentEventId}`).removeClass('govuk-form-group--error');
               $(`.${currentEventId}`).removeClass('govuk-form-group--error');
               $(`.p_durations_${currentEventId}`).html('');
            }
         }
         else if(document.getElementById('agreementID').value === 'RM1557.13' && document.getElementById('gID').value === 'Group 10' && document.getElementById('lID').value === '4') {
            endmonthCheck = Number(value.val()) > 11;
            let fieldCheck = "",
            errorStore = [];
            if ((matchValue || endmonthCheck || startmonthCheck) && value.val() != '') {
               // $(`#${currentEventId}`).addClass('govuk-form-group--error');
               // $(`.${currentEventId}`).addClass('govuk-form-group--error');
               // if((matchValue || startmonthCheck)){
               //     $(`.p_durations_${currentEventId}`).html('Enter a valid month');
               //    fieldCheck = ccsZvalidateWithRegex("rfp_duration_months", "Enter a valid month", /^\d{1,}$/);
               //    if (fieldCheck !== true) errorStore.push(fieldCheck);
               //    if(errorStore.length>0){
               //        ccsZPresentErrorSummary(errorStore);
               //        return false;
               //    }

               // }
               // if(endmonthCheck){
                  
               //    $(`.p_durations_${currentEventId}`).addClass('govuk-form-group--error');   
               //    $(`.p_durations_${currentEventId}`).html('Enter a month between 1 to 11');
               //    fieldCheck = ccsZvalidateWithRegex("rfp_duration_months", "Enter a month between 1 to 11", /^\d{1,}$/);
               //    if (fieldCheck !== true) errorStore.push(fieldCheck);
               //    if(errorStore.length>0){
               //        ccsZPresentErrorSummary(errorStore);
               //        return false;
               //    }
               // }
            }
            else {
               $(`#${currentEventId}`).removeClass('govuk-form-group--error');
               $(`.${currentEventId}`).removeClass('govuk-form-group--error');
               $(`.p_durations_${currentEventId}`).html('');
            }
         }
         else if ((matchValue || endmonthCheck || startmonthCheck || yrValidation || yrValidation2) && value.val() != '') {
            $(`#${currentEventId}`).addClass('govuk-form-group--error');
            $(`.${currentEventId}`).addClass('govuk-form-group--error');
            if(currentEID=='rfp_duration_months_Question12'){
               if(yrValidation){
                  $(`.p_durations_${currentEventId}`).html('Project Duration should not be greater than 4 years');
                  }else{
                  $(`.p_durations_${currentEventId}`).html('Enter a valid month');
                  }
            }else if(currentEID=='rfp_duration_months_Question13'){
               if(yrValidation2==1){
                  $(`.p_durations_${currentEventId}`).html('This should not exceed 50% of the length of the original project');
               }else if(yrValidation2==2){
                  $(`.p_durations_${currentEventId}`).html('Contract extension should be less than project run date');
               }else{
                  $(`.p_durations_${currentEventId}`).html('Enter a valid month');
                  }
            }else{
               $(`.p_durations_${currentEventId}`).html('Enter a valid month');
               }
         }
         else {
            $(`#${currentEventId}`).removeClass('govuk-form-group--error');
            $(`.${currentEventId}`).removeClass('govuk-form-group--error');
            document.getElementById(currentEID).classList.remove('govuk-form-group--error');
            $(`.p_durations_${currentEventId}`).html('');
         }
      }
   const YearCheck = (rfpYear,currentId) => {

         let value = rfpYear;
         let currentEID = currentId;
         let matchValue = !value.val().match(/^\d\d?$/);
         let endyearCheck = Number(value.val()) > 4;
         let startyearCheck = Number(value.val()) < 0;
         let yrValidation = false;
         let yrValidation2 = false;
         if(document.getElementById('agreementID').value === 'RM1043.8' && document.getElementById('gID').value === 'Group 18' && document.getElementById('lID').value === '1') {
         removeErrorFieldsdates();
         }
         if(document.getElementById('agreementID').value === 'RM1557.13' && document.getElementById('gID').value === 'Group 10' && document.getElementById('lID').value === '4') {
            removeErrorFieldsdates();
            }
         if(document.getElementById('agreementID').value === 'RM6187'){
            if(value.val() != ''){
            const durationYear = document.getElementsByClassName('rfp_duration_year_25');
            const durationMonth = document.getElementsByClassName('rfp_duration_month_25');
            const durationDay = document.getElementsByClassName('rfp_duration_day_25');

            if(currentEID=='rfp_duration-years_Question12'){
            const YearProjectRun = Number(durationYear[0].value);
            const MonthProjectRun = Number(durationMonth[0].value);
            const DaysProjectRun = Number(durationDay[0].value);

            if(DaysProjectRun>0 || MonthProjectRun>0){
            mid = document.getElementsByClassName('rfp_duration_month_25')[0].id;
            did = document.getElementsByClassName('rfp_duration_day_25')[0].id;
            let currentmIdValue = $(`#${mid}`);
            let currentdIdValue = $(`#${did}`);
            
            DateCheck(currentmIdValue,mid);
            MonthCheck(currentdIdValue,did);
            }

            if(YearProjectRun==4){
               if(MonthProjectRun>0 || DaysProjectRun>0){
                  yrValidation = true;
               }
            }else if(YearProjectRun==3){
               if(MonthProjectRun==12 && DaysProjectRun>0){
                  yrValidation = true;
               }
            }
            }
            if(currentEID=='rfp_duration-years_Question13'){
               const YearProjectRun2 = Number(durationYear[1].value);
               const MonthProjectRun2 = Number(durationMonth[1].value);
               const DaysProjectRun2 = Number(durationDay[1].value);
   
               if(DaysProjectRun2>0 || MonthProjectRun2>0){
               mid = document.getElementsByClassName('rfp_duration_month_25')[1].id;
               did = document.getElementsByClassName('rfp_duration_day_25')[1].id;
               let currentmIdValue = $(`#${mid}`);
               let currentdIdValue = $(`#${did}`);
              
               DateCheck(currentmIdValue,mid);
               MonthCheck(currentdIdValue,did);
               }
               // if(YearProjectRun2==4){
               //    if(MonthProjectRun2>0 || DaysProjectRun2>0){
               //       yrValidation2 = true;
               //    }
               // }else if(YearProjectRun2==3){
               //    if(MonthProjectRun2==12 && DaysProjectRun2>0){
               //       yrValidation2 = true;
               //    }
               // }
               yrValidation2 = validateExtPeriod();
               }
         }
           if ((matchValue || endyearCheck || startyearCheck || yrValidation || yrValidation2) && value.val() != '') {
                $(`#${currentEventId}`).addClass('govuk-form-group--error');
               $(`.${currentEventId}`).addClass('govuk-form-group--error');
               
               if(currentEID=='rfp_duration-years_Question12'){
                  if(yrValidation){
                  $(`.p_durations_${currentEventId}`).html('Project Duration should not be greater than 4 years');
                  }else{
                  $(`.p_durations_${currentEventId}`).html('Enter a year between 1 to 4');
                  }
               }else if(currentEID=='rfp_duration-years_Question13'){
                  if(yrValidation2==1){
                     $(`.p_durations_${currentEventId}`).html('This should not exceed 50% of the length of the original project');
                  }else if(yrValidation2==2){
                     $(`.p_durations_${currentEventId}`).html('Contract extension should be less than project run date');
                  }else{
                  $(`.p_durations_${currentEventId}`).html('Enter a year between 1 to 4');
                  }
               }else{
                  $(`.p_durations_${currentEventId}`).html('This should not exceed 50% of the length of the original project');
               }
            }
            else {
               $(`#${currentEventId}`).removeClass('govuk-form-group--error');
               $(`.${currentEventId}`).removeClass('govuk-form-group--error');
               document.getElementById(currentEID).classList.remove('govuk-form-group--error');
               $(`.p_durations_${currentEventId}`).html('');
            }

         }
         else if(document.getElementById('agreementID').value === 'RM1043.8' && document.getElementById('gID').value === 'Group 18' && document.getElementById('lID').value === '1') {
            endyearCheck = Number(value.val()) > 2;
            let fieldCheck = "",
            errorStore = [];
            if ((matchValue || endyearCheck || startyearCheck) && value.val() != '') {
            }
            else {
               $(`#${currentEventId}`).removeClass('govuk-form-group--error');
               $(`.${currentEventId}`).removeClass('govuk-form-group--error');
               $(`.p_durations_${currentEventId}`).html('');
            }
         }
         else if(document.getElementById('agreementID').value === 'RM1557.13' && document.getElementById('gID').value === 'Group 10' && document.getElementById('lID').value === '4') {
            endyearCheck = Number(value.val()) > 2;
            let fieldCheck = "",
            errorStore = [];
            if ((matchValue || endyearCheck || startyearCheck) && value.val() != '') {
            }
            else {
               $(`#${currentEventId}`).removeClass('govuk-form-group--error');
               $(`.${currentEventId}`).removeClass('govuk-form-group--error');
               $(`.p_durations_${currentEventId}`).html('');
            }
         }
         else{
            if ((matchValue || endyearCheck || startyearCheck) && value.val() != '') {
               $(`#${currentEventId}`).addClass('govuk-form-group--error');
               $(`.${currentEventId}`).addClass('govuk-form-group--error');
               $(`.p_durations_${currentEventId}`).html('Enter a year between 1 to 4');
            }
            else {
               $(`#${currentEventId}`).removeClass('govuk-form-group--error');
               $(`.${currentEventId}`).removeClass('govuk-form-group--error');
               $(`.p_durations_${currentEventId}`).html('');
            }
         }
         
      }
   }
}
});

function daysInYear(year) {
   return ((year % 4 === 0 && year % 100 > 0) || year % 400 == 0) ? 366 : 365;
}

$('.rfp_date').on('submit', (e) => {
   e.preventDefault();
   $('.durations').removeClass('govuk-form-group--error');
   $('.resource_start_date').html('');
   if(document.getElementById('agreementID').value !== 'RM1043.8' && document.getElementById('agreementID').value !== 'RM1557.13') {
       if(checkResourceStartDate())
      {
         let isValid = isProjectStartDateValid();
         if (isValid) {
            // isValid = isProjectExtensionValid(); //XBN00121

         
         let yrValidation = false;
            const durationYear = document.getElementsByClassName('rfp_duration_year_25');
            const durationMonth = document.getElementsByClassName('rfp_duration_month_25');
            const durationDay = document.getElementsByClassName('rfp_duration_day_25');

            if(durationYear[0].value!='' || durationMonth[0].value!='' || durationDay[0].value!=''){
            const YearProjectRun = Number(durationYear[0].value);
            const MonthProjectRun = Number(durationMonth[0].value);
            const DaysProjectRun = Number(durationDay[0].value);
            
            if(MonthProjectRun<0 || MonthProjectRun>12){
               yrValidation = true;
            }
            if(DaysProjectRun<0 || DaysProjectRun>31){
               yrValidation = true;
            }
            if(YearProjectRun==4){
               if(MonthProjectRun>0 || DaysProjectRun>0){
                  yrValidation = true;
               }
            }else if(YearProjectRun==3){
               if(MonthProjectRun==12 && DaysProjectRun>0){
                  yrValidation = true;
               }
            }else if(YearProjectRun>4  || YearProjectRun<0){
               yrValidation = true;
            }
            if(yrValidation){
               return;
            }
         }

         if(durationYear[1].value!='' || durationMonth[1].value!='' || durationDay[1].value!=''){
            yrValidation2 = validateExtPeriod();
            if(yrValidation2){
               return;
            }
         }
            
         }

         if(isValid)
         document.forms['rfp_date'].submit();
      }
   } else {
      if(document.getElementById('agreementID') !== null) {
         if(document.getElementById('agreementID').value === 'RM1043.8' && document.getElementById('gID').value === 'Group 18' && document.getElementById('lID').value === '1') {
            isValid = isProjectExtensionValid(); //XBN00121
            if(isValid)
               document.forms['rfp_date'].submit();
            
         } else if(document.getElementById('agreementID').value === 'RM1043.8' && document.getElementById('gID').value === 'Group 17' && document.getElementById('lID').value === '1') {
            let isValid;
            removeErrorFieldsdates();

            if(checkResourceStartDate())
            {

            isValid = isProjectStartDateValid();
            } //XBN00121
            if(isValid)
               document.forms['rfp_date'].submit();
            
         } else if(document.getElementById('agreementID').value === 'RM1557.13' && document.getElementById('gID').value === 'Group 10' && document.getElementById('lID').value === '4') {
            isValid = isProjectExtensionValid(); //XBN00121
            if(isValid)
               document.forms['rfp_date'].submit();
            
         } else if(document.getElementById('agreementID').value === 'RM1557.13' && document.getElementById('gID').value === 'Group 9' && document.getElementById('lID').value === '4') {
            let isValid;
            if(checkResourceStartDate())
            {

            isValid = isProjectStartDateValid();
            } //XBN00121
            if(isValid)
               document.forms['rfp_date'].submit();
            
         } 
         else {
            isValid = isProjectStartDateValid(); //XBN00121
            if(isValid)
               document.forms['rfp_date'].submit();
         }
      }
   }
});

function isValidDate(year, month, day) {
   month = month-1;
     var d = new Date(year, month, day);
     if (d.getFullYear() == year && d.getMonth() == month && d.getDate() == day) {
         return true;
     }
   return false;
 }
function checkResourceStartDate()
{
   let flag = true;
   let fieldCheck = "", errorStore = [];
   
      let rfpResourceStartDay = $('.rfp_resource_start_day');
      let rfpResourceStartMonth = $('.rfp_resource_start_month');
      let rfpResourceStartYear = $('.rfp_resource_start_year');
      if(rfpResourceStartDay.val() == '' && rfpResourceStartMonth.val() == '' && rfpResourceStartYear.val() == '')
      {
         if(document.getElementById('agreementID').value !== 'RM1043.8' && document.getElementById('agreementID').value !== 'RM1557.13') {

         flag =false;
         rfpResourceStartDay.addClass('govuk-form-group--error');
         rfpResourceStartMonth.removeClass('govuk-form-group--error');
         rfpResourceStartYear.removeClass('govuk-form-group--error');
         $('.durations').addClass('govuk-form-group--error');
         $('#event-name-error-date').html('Project start date should not be empty'); 
         fieldCheck = ccsZvalidateWithRegex("rfp_resource_start_day", "Project start date should not be empty", /^\d{1,}$/);
         if (fieldCheck !== true){ errorStore.push(fieldCheck)
         }else{
           fieldCheck = ccsZvalidateWithRegex("rfp_resource_start_day", "Project start date should not be empty", /^\d{1,}$/);
         }
      }
      }
       else if(rfpResourceStartDay.val() =='')
      {
         var error_msg = 'Enter a valid date'
         if(document.getElementById('agreementID').value === 'RM1043.8') {
            removeErrorFieldsdates();
            error_msg = 'Enter a day'
         }
         flag = false;
         rfpResourceStartDay.addClass('govuk-form-group--error');
         rfpResourceStartMonth.removeClass('govuk-form-group--error');
         rfpResourceStartYear.removeClass('govuk-form-group--error');
        // rfpResourceStartYear.removeClass('govuk-form-group--error');
         $('.durations').addClass('govuk-form-group--error');
         $('#event-name-error-date').html('Enter a valid date');
         fieldCheck = ccsZvalidateDateWithRegex("rfp_resource_start_date_day_Question11","rfp_resource_start_date", error_msg, /^\d{1,}$/);
         if (fieldCheck !== true){ errorStore.push(fieldCheck)
         }
         // else{
         //   fieldCheck = ccsZvalidateWithRegex("rfp_resource_start_date_day_Question11", "Enter a valid date", /^\d{1,}$/);
         // }
        
      }
      else if(rfpResourceStartDay.val() < 1)
      {
         flag = false;
         rfpResourceStartDay.addClass('govuk-form-group--error');
         rfpResourceStartMonth.removeClass('govuk-form-group--error');
         rfpResourceStartYear.removeClass('govuk-form-group--error');
         $('.durations').addClass('govuk-form-group--error');
         $('#event-name-error-date').html('Enter a valid date');
         fieldCheck = ccsZvalidateWithRegex("rfp_resource_start_day", "Enter a valid date", /^\d{1,}$/);
         if (fieldCheck !== true){ errorStore.push(fieldCheck)
         }else{
           fieldCheck = ccsZvalidateWithRegex("rfp_resource_start_day", "Enter a valid date", /^\d{1,}$/);
         }
        
      }

      else if(rfpResourceStartMonth.val() =='')
      {
          error_msg = 'Enter a valid month'
         if(document.getElementById('agreementID').value === 'RM1043.8') {
            removeErrorFieldsdates();
            error_msg = 'Enter a month'
         }

         flag =false;
         rfpResourceStartMonth.addClass('govuk-form-group--error');
         rfpResourceStartDay.removeClass('govuk-form-group--error');
         rfpResourceStartYear.removeClass('govuk-form-group--error');
            $('.durations').addClass('govuk-form-group--error');
            $('#event-name-error-date').html('Enter a valid month');
         fieldCheck = ccsZvalidateDateWithRegex("rfp_resource_start_date_month_Question 11","rfp_resource_start_date",error_msg, /^\d{1,}$/);
         if (fieldCheck !== true){ errorStore.push(fieldCheck)
         }
         // else{
         //      fieldCheck = ccsZvalidateWithRegex("rfp_resource_start_date_month_Question 11", "Enter a valid month", /^\d{1,}$/);
         // }
      
      }
      else if(rfpResourceStartMonth.val() < 1)
      {
         flag =false;
         rfpResourceStartMonth.addClass('govuk-form-group--error');
         rfpResourceStartDay.removeClass('govuk-form-group--error');
         rfpResourceStartYear.removeClass('govuk-form-group--error');
            $('.durations').addClass('govuk-form-group--error');
            $('#event-name-error-date').html('Enter a valid month');
         fieldCheck = ccsZvalidateWithRegex("rfp_resource_start_month", error_msg, /^\d{1,}$/);
         if (fieldCheck !== true){ errorStore.push(fieldCheck)
         }else{
              fieldCheck = ccsZvalidateWithRegex("rfp_resource_start_month", error_msg, /^\d{1,}$/);
         }        
      }
      else if(rfpResourceStartYear.val() =='')
      {
         error_msg = 'Enter a valid year'
         if(document.getElementById('agreementID').value === 'RM1043.8') {
            removeErrorFieldsdates();
            error_msg = 'Enter a year'
         }
         flag =false;
         rfpResourceStartYear.addClass('govuk-form-group--error');
         rfpResourceStartDay.removeClass('govuk-form-group--error');
         rfpResourceStartMonth.removeClass('govuk-form-group--error');
         $('.durations').addClass('govuk-form-group--error');
         $('#event-name-error-date').html('Enter a valid year');  
         fieldCheck = ccsZvalidateDateWithRegex("rfp_resource_start_date_year_Question 11","rfp_resource_start_date", error_msg, /^\d{1,}$/);
         if (fieldCheck !== true){ errorStore.push(fieldCheck)
         }
         // else{
         //      fieldCheck = ccsZvalidateWithRegex("rfp_resource_start_date_year_Question 11", "Enter a valid year", /^\d{1,}$/);
         // }  
      }
      else if(rfpResourceStartYear.val() <= 1)
      {
         flag =false;
         rfpResourceStartYear.addClass('govuk-form-group--error');
         rfpResourceStartDay.removeClass('govuk-form-group--error');
         rfpResourceStartMonth.removeClass('govuk-form-group--error');
         $('.durations').addClass('govuk-form-group--error');
         $('#event-name-error-date').html('Enter a valid year');  
         fieldCheck = ccsZvalidateWithRegex("rfp_resource_start_year", error_msg, /^\d{1,}$/);
         if (fieldCheck !== true){ errorStore.push(fieldCheck)
         }else{
              fieldCheck = ccsZvalidateWithRegex("rfp_resource_start_year", error_msg, /^\d{1,}$/);
         }  
      }
      else 
      {
         flag =true;
         rfpResourceStartYear.removeClass('govuk-form-group--error');
         rfpResourceStartMonth.removeClass('govuk-form-group--error');
         rfpResourceStartDay.removeClass('govuk-form-group--error');
         $('.durations').removeClass('govuk-form-group--error');
         $('#event-name-error-date').html('')

         if(!isValidDate(rfpResourceStartYear.val(),rfpResourceStartMonth.val(),rfpResourceStartDay.val()))
         {
            flag =false;
            $('.durations').addClass('govuk-form-group--error');
            $('#event-name-error-date').html('Enter a valid date'); 
            if (fieldCheck !== true){ errorStore.push(fieldCheck)
            }else{
                 fieldCheck = ccsZvalidateWithRegex("rfp_resource_start_day", "Enter a valid date", /^\d{1,}$/);
            }
         }
         else 
         {
            flag =true;
            $('.durations').removeClass('govuk-form-group--error');
            $('#event-name-error-date').html(''); 
         }
      }

      if(errorStore.length>0){
         ccsZPresentErrorSummary(errorStore);
         return false;
        }

      return flag;
}

function isProjectExtensionValid() {
   let isValid = false;

   $('.p_durations').removeClass('govuk-form-group--error');
   removeErrorFieldsdates();
   let pDurationName = $('.p_durations')[0].classList[1];
   let pExtDurationName = $('.p_durations')[1].classList[1];

   const durationYear = document.getElementsByClassName('rfp_duration_year_25');
   const durationMonth = document.getElementsByClassName('rfp_duration_month_25');
   const durationDay = document.getElementsByClassName('rfp_duration_day_25');
   const durationDayError = document.getElementsByClassName('p_durations_pday_25');
 

   const YearProjectRun = durationYear[0].value;
   const MonthProjectRun = durationMonth[0].value;
   const DaysProjectRun = durationDay[0].value;
   var projectRunInDays = 0;
   let fieldCheck = "",
       errorStore = [];
       
       if (document.getElementById("rfp_duration-years_Question12") !=undefined && document.getElementById("rfp_duration-years_Question12") !=null && document.getElementById("rfp_duration-years_Question12").value.trim().length === 0) {
      if((document.getElementById('agreementID').value === 'RM1043.8' && document.getElementById('gID').value === 'Group 18' && document.getElementById('lID').value === '1')){
      if(document.getElementById("rfp_duration_months_Question12") !=undefined && document.getElementById("rfp_duration_months_Question12") !=null && document.getElementById("rfp_duration_months_Question12").value.trim().length === 0) {
         if (document.getElementById("rfp_duration_days_Question12") !=undefined &&document.getElementById("rfp_duration_days_Question12") !=null && document.getElementById("rfp_duration_days_Question12").value.trim().length === 0) {
         fieldCheck = ccsZvalidateWithRegex("rfp_duration_Question12", "Enter the expected contract length", /^\d{1,}$/);
         if (fieldCheck !== true) errorStore.push(fieldCheck);  
         }
      }
   }
   else{

      fieldCheck = ccsZvalidateWithRegex("rfp_duration_Question12", "Enter the expected contract length", /^\d{1,}$/);
      if (fieldCheck !== true) errorStore.push(fieldCheck);
   }
  }else{

   if(!(document.getElementById('agreementID').value === 'RM1043.8' && document.getElementById('gID').value === 'Group 18' && document.getElementById('lID').value === '1')){

      fieldCheck = ccsZvalidateWithRegex("rfp_duration-years_Question12", "Enter a year", /^\d{1,}$/);
            if (fieldCheck !== true) errorStore.push(fieldCheck);
   }

   if(!(document.getElementById('agreementID').value === 'RM1557.13' && document.getElementById('gID').value === 'Group 10' && document.getElementById('lID').value === '4')){

      fieldCheck = ccsZvalidateWithRegex("rfp_duration-years_Question12", "Enter a year", /^\d{1,}$/);
            if (fieldCheck !== true) errorStore.push(fieldCheck);
   }

  }
  if(document.getElementById("rfp_duration_months_Question12") !=undefined && document.getElementById("rfp_duration_months_Question12") !=null && document.getElementById("rfp_duration_months_Question12").value.trim().length === 0) {
     let year = document.getElementById("rfp_duration-years_Question12").value.trim(); 
     let month = document.getElementById("rfp_duration_months_Question12").value.trim();
     console.log('month',month)
     if((document.getElementById('agreementID').value === 'RM1043.8' && document.getElementById('gID').value === 'Group 18' && document.getElementById('lID').value === '1')){
      if(Number(year) < 2 && Number(month) > 0){
        fieldCheck = ccsZvalidateWithRegex("rfp_duration_months_Question12", "Enter a month", /^\d{1,}$/);
        if (fieldCheck !== true) errorStore.push(fieldCheck);
        console.log('errorStore',errorStore)
      }
     }
     else if((document.getElementById('agreementID').value === 'RM1557.13' && document.getElementById('gID').value === 'Group 10' && document.getElementById('lID').value === '4')){
      if(Number(year) < 2 && Number(month) > 0){
        fieldCheck = ccsZvalidateWithRegex("rfp_duration_months_Question12", "Enter a month", /^\d{1,}$/);
        if (fieldCheck !== true) errorStore.push(fieldCheck);
        console.log('errorStore',errorStore)
      }
     }
     else{
      if(!(document.getElementById('agreementID').value === 'RM1043.8' && document.getElementById('gID').value === 'Group 18' && document.getElementById('lID').value === '1')){
      fieldCheck = ccsZvalidateWithRegex("rfp_duration_months_Question12", "Enter a month", /^\d{1,}$/);
      if (fieldCheck !== true) errorStore.push(fieldCheck);
      }
      if(!(document.getElementById('agreementID').value === 'RM1557.13' && document.getElementById('gID').value === 'Group 10' && document.getElementById('lID').value === '4')){
         fieldCheck = ccsZvalidateWithRegex("rfp_duration_months_Question12", "Enter a month", /^\d{1,}$/);
         if (fieldCheck !== true) errorStore.push(fieldCheck);
         }

     }
  }else{
   if(!(document.getElementById('agreementID').value === 'RM1043.8' && document.getElementById('gID').value === 'Group 18' && document.getElementById('lID').value === '1')){

   fieldCheck = ccsZvalidateWithRegex("rfp_duration_months_Question12", "Enter a month", /^\d{1,}$/);
   }
   if(!(document.getElementById('agreementID').value === 'RM1557.13' && document.getElementById('gID').value === 'Group 10' && document.getElementById('lID').value === '4')){

      fieldCheck = ccsZvalidateWithRegex("rfp_duration_months_Question12", "Enter a month", /^\d{1,}$/);
      }
   
  }
  if (document.getElementById("rfp_duration_days_Question12") !=undefined &&document.getElementById("rfp_duration_days_Question12") !=null && document.getElementById("rfp_duration_days_Question12").value.trim().length === 0) {
   let year = document.getElementById("rfp_duration-years_Question12").value.trim(); 
   let day = document.getElementById("rfp_duration_days_Question12").value.trim(); 


   if((document.getElementById('agreementID').value === 'RM1043.8' && document.getElementById('gID').value === 'Group 18' && document.getElementById('lID').value === '1')){
    if(Number(year) < 2 && Number(day)>0){
      fieldCheck = ccsZvalidateWithRegex("rfp_duration_days_Question12", "Enter a day", /^\d{1,}$/);
      if (fieldCheck !== true) errorStore.push(fieldCheck);

    }
   }
   else if((document.getElementById('agreementID').value === 'RM1557.13' && document.getElementById('gID').value === 'Group 10' && document.getElementById('lID').value === '4')){
      if(Number(year) < 2 && Number(day)>0){
        fieldCheck = ccsZvalidateWithRegex("rfp_duration_days_Question12", "Enter a day", /^\d{1,}$/);
        if (fieldCheck !== true) errorStore.push(fieldCheck);
  
      }
     }
   else{
      if(!(document.getElementById('agreementID').value === 'RM1043.8' && document.getElementById('gID').value === 'Group 18' && document.getElementById('lID').value === '1')){
      fieldCheck = ccsZvalidateWithRegex("rfp_duration_days_Question12", "Enter a day", /^\d{1,}$/);
      if (fieldCheck !== true) errorStore.push(fieldCheck);
      }
      if(!(document.getElementById('agreementID').value === 'RM1557.13' && document.getElementById('gID').value === 'Group 10' && document.getElementById('lID').value === '4')){
         fieldCheck = ccsZvalidateWithRegex("rfp_duration_days_Question12", "Enter a day", /^\d{1,}$/);
         if (fieldCheck !== true) errorStore.push(fieldCheck);
         }

   }
  }else{
   if(!(document.getElementById('agreementID').value === 'RM1043.8' && document.getElementById('gID').value === 'Group 18' && document.getElementById('lID').value === '1')){

   fieldCheck = ccsZvalidateWithRegex("rfp_duration_days_Question12", "Enter a day", /^\d{1,}$/);
   }
   if(!(document.getElementById('agreementID').value === 'RM1557.13' && document.getElementById('gID').value === 'Group 10' && document.getElementById('lID').value === '4')){

      fieldCheck = ccsZvalidateWithRegex("rfp_duration_days_Question12", "Enter a day", /^\d{1,}$/);
      }
  }
   
  let durationYears='2';
  let durationMessage='Expected contract length must be 2 years or less';
  if((document.getElementById('agreementID').value === 'RM1557.13' && document.getElementById('gID').value === 'Group 10' && document.getElementById('lID').value === '4')){
   durationYears='3';
   durationMessage='Expected contract length must be 3 years or less';
  }
   
   if (YearProjectRun != null && YearProjectRun != "") {
      if(Number(YearProjectRun) < 0 )
      {
         isValid = false;
         $(`.${pDurationName}`).addClass('govuk-form-group--error');   
         $(`.${durationDayError[0].classList[2]}`).html('Enter a Valid Year');
         fieldCheck = ccsZvalidateWithRegex("rfp_duration-years", "Enter a Valid Year",/^\d{1,}$/);
         if (fieldCheck !== true) errorStore.push(fieldCheck); 
       }
      else if(Number(YearProjectRun) > durationYears )
      {
         isValid = false;
         $(`.${pDurationName}`).addClass('govuk-form-group--error');   
        // $(`.${durationDayError[0].classList[2]}`).html('Project extension duration should not be more than 2 years');
         fieldCheck = ccsZvalidateWithRegex("rfp_duration_Question12", durationMessage,/^\d{1,}$/);
         if (fieldCheck !== true) errorStore.push(fieldCheck); 
        

      }
      else if (Number(YearProjectRun) >= durationYears && (Number(MonthProjectRun)> 0 || Number(DaysProjectRun) > 0 ))
      {
         isValid = false;
         $(`.${pDurationName}`).addClass('govuk-form-group--error');
        // $(`.${durationDayError[0].classList[2]}`).html('Project extension duration should not be more than 2 years');
         fieldCheck = ccsZvalidateWithRegex("rfp_duration_Question12", durationMessage,/^\d{1,}$/);
         if (fieldCheck !== true) errorStore.push(fieldCheck); 
        // return false;
      }
      
      projectRunInDays = (365 * Number(YearProjectRun))
   }
   if (MonthProjectRun != null && MonthProjectRun != "") {
      if(Number(MonthProjectRun) < 0)
      {
         isValid = false;
         $(`.${pDurationName}`).addClass('govuk-form-group--error');   
         $(`.${durationDayError[0].classList[2]}`).html('Enter a valid month');
         fieldCheck = ccsZvalidateWithRegex("rfp_duration-years", "Enter a valid month",/^\d{1,}$/);
         if (fieldCheck !== true) errorStore.push(fieldCheck);    
      }
      else if(Number(MonthProjectRun) > 11 )
      {
         isValid = false;
         $(`.${pDurationName}`).addClass('govuk-form-group--error');   
         $(`.${durationDayError[0].classList[2]}`).html('Project extension duration month value should not be more than 11');
         fieldCheck = ccsZvalidateWithRegex("rfp_duration-years", "Project extension duration month value should not be more than 11",/^\d{1,}$/);
         if (fieldCheck !== true) errorStore.push(fieldCheck);    
      }
      projectRunInDays = projectRunInDays + (30 * Number(MonthProjectRun))
   }

   if (DaysProjectRun != null && DaysProjectRun != "") {
      if(Number(DaysProjectRun) < 0)
      {
         isValid = false;
         $(`.${pDurationName}`).addClass('govuk-form-group--error');   
         $(`.${durationDayError[0].classList[2]}`).html('Enter a valid day');
         fieldCheck = ccsZvalidateWithRegex("rfp_duration-years", "Enter a valid day",/^\d{1,}$/);
         if (fieldCheck !== true) errorStore.push(fieldCheck);    
      }
      else if(Number(DaysProjectRun) > 31)
      {
         isValid = false;
         $(`.${pDurationName}`).addClass('govuk-form-group--error');   
         $(`.${durationDayError[0].classList[2]}`).html('Enter a valid day');
         fieldCheck = ccsZvalidateWithRegex("rfp_duration-years", "Enter a valid day",/^\d{1,}$/);
         if (fieldCheck !== true) errorStore.push(fieldCheck);    
      }
      projectRunInDays = projectRunInDays + Number(DaysProjectRun)
   }

  
   const YearExtensionPeriod = durationYear[1].value;
   const MonthExtensionPeriod = durationMonth[1].value;
   const DaysExtensionPeriod = durationDay[1].value;

   var extensionRunInDays = 0;
   if (YearExtensionPeriod != null && YearExtensionPeriod != "") {
      extensionRunInDays = (365 * Number(YearExtensionPeriod))
   }
   if (MonthExtensionPeriod != null && MonthExtensionPeriod != "") {
      extensionRunInDays = extensionRunInDays + (30 * Number(MonthExtensionPeriod))
   }

   if (DaysExtensionPeriod != null && DaysExtensionPeriod != "") {
      extensionRunInDays = extensionRunInDays + Number(DaysExtensionPeriod)
   }

   if (projectRunInDays != null && projectRunInDays > 0 && extensionRunInDays != null && extensionRunInDays > 0) {
      let tempProjectRunInDays = Number(projectRunInDays);
      let tempExtensionRunInDays = Number(extensionRunInDays);
      if (tempProjectRunInDays > tempExtensionRunInDays) {

         if((document.getElementById('agreementID').value === 'RM1557.13' && document.getElementById('gID').value === 'Group 10' && document.getElementById('lID').value === '4')){

            if(tempExtensionRunInDays > 365 ){
               isValid = false;       
               $(`.${pExtDurationName}`).addClass('govuk-form-group--error');   
               //$(`.${durationDayError[1].classList[2]}`).html('This should not exceed 50% of the length of the original project');
               fieldCheck = ccsZvalidateWithRegex("rfp_duration_Question13", "Expected contract length must be 12 months or less",/^\d{1,}$/);
              if (fieldCheck !== true) errorStore.push(fieldCheck);

            }else{

               let dayDiffPercentage = ((tempExtensionRunInDays / tempProjectRunInDays) * 100);
            if (dayDiffPercentage > 50) {
               isValid = false;       
               $(`.${pExtDurationName}`).addClass('govuk-form-group--error');   
               //$(`.${durationDayError[1].classList[2]}`).html('This should not exceed 50% of the length of the original project');
               fieldCheck = ccsZvalidateWithRegex("rfp_duration_Question13", "Extension period must be 50% of the contract period or less",/^\d{1,}$/);
            if (fieldCheck !== true) errorStore.push(fieldCheck);
            }
            else {
               isValid = true;
               if(durationDayError && durationDayError[1]) $(`.${durationDayError[1].classList[2]}`).html('');
              
            }
               
            }
            
           }else{

            let dayDiffPercentage = ((tempExtensionRunInDays / tempProjectRunInDays) * 100);
            if (dayDiffPercentage > 50) {
               isValid = false;       
               $(`.${pExtDurationName}`).addClass('govuk-form-group--error');   
               //$(`.${durationDayError[1].classList[2]}`).html('This should not exceed 50% of the length of the original project');
               fieldCheck = ccsZvalidateWithRegex("rfp_duration_Question13", "Extension period must be 50% of the contract period or less",/^\d{1,}$/);
            if (fieldCheck !== true) errorStore.push(fieldCheck);
            }
            else {
               isValid = true;
               if(durationDayError && durationDayError[1]) $(`.${durationDayError[1].classList[2]}`).html('');
              
            }

        }

      }
      else {
         isValid = false;
         $(`.${pExtDurationName}`).addClass('govuk-form-group--error');  
        // $(`.${durationDayError[1].classList[2]}`).html('Contract extension should be less than project run date');
         fieldCheck = ccsZvalidateWithRegex("rfp_duration_Question13", "Contract extension period should be less than project expected contract duration",/^\d{1,}$/);
         if (fieldCheck !== true) errorStore.push(fieldCheck);
      }
   }
   else {
      isValid = true;
   }

   if(errorStore.length>0){
      ccsZPresentErrorSummary(errorStore);
      return false;
     }
   return isValid;
}

function isProjectStartDateValid()
{
   let fieldCheck = "", errorStore = [];
   //removeErrorFieldsdates();
   const Day = $('.rfp_resource_start_day');
   const Month = $('.rfp_resource_start_month');
   const Year = $('.rfp_resource_start_year');
   
   if (Day.val() !== null && Day.val() !== "" && Month.val() !== null && Month.val() !== "" && Year.val() !== null && Year.val() !== "") {
            Day.removeClass('govuk-form-group--error');
            Month.removeClass('govuk-form-group--error');
            Year.removeClass('govuk-form-group--error');
            $('.durations').removeClass('govuk-form-group--error');

      let rfpagreementData;
      // if ($('.agreement_no').attr('id')) {
      //     rfpagreementData = $('.agreement_no').attr('id').split("-");
      // }
      if ($('#rpf_section_3_aggrimentEndDate').attr('agreementEndDate')) {
         rfpagreementData = $('#rpf_section_3_aggrimentEndDate').attr('agreementEndDate').split("-");
      }
      if (rfpagreementData !== null && rfpagreementData !== undefined && rfpagreementData.length > 0) {
         const expiryYears = rfpagreementData != undefined && rfpagreementData != null ? Number(rfpagreementData[0]) : null;
         const expiryMonthTot = rfpagreementData != undefined && rfpagreementData != null ? Number(rfpagreementData[1]) : null;
         const expiryMonth=expiryMonthTot-1;
         const expiryDate = rfpagreementData != undefined && rfpagreementData != null ? Number(rfpagreementData[2]) : null;

         const ExpiryDates = expiryYears != null && expiryMonth != null && expiryDate != null ? new Date(expiryYears, expiryMonth, expiryDate) : null;
         const getMSOfExpiryDate = ExpiryDates != null ? ExpiryDates.getTime() : null;
         const FormDate = new Date(Year.val(), (Month.val()-1), Day.val());
         
        

         const getTimeOfFormDate = FormDate.getTime();
         const todayDate = new Date();
         if (getTimeOfFormDate > getMSOfExpiryDate) {
          // $('#event-name-error-date').html('Start date cannot be after agreement expiry date');
            Day.addClass('govuk-form-group--error');
            Month.addClass('govuk-form-group--error');
            Year.addClass('govuk-form-group--error');
            $('.durations').addClass('govuk-form-group--error');
            fieldCheck = ccsZvalidateWithRegex("rfp_resource_start_date", "Start date cannot be after agreement expiry date", /^\d{1,}$/);
         if (fieldCheck !== true){ errorStore.push(fieldCheck)
         }else{
           fieldCheck = ccsZvalidateWithRegex("rfp_resource_start_date", "Start date cannot be after agreement expiry date", /^\d{1,}$/);
         }
         if(errorStore.length>0){
            ccsZPresentErrorSummary(errorStore);
            return false;
           }
                        return false;
         }else{
            $('#rfp_resource_start_date-hint-error').removeClass('govuk-error-message');
            $('.rfp_resource_start_day').removeClass('govuk-input--error');
            $('.rfp_resource_start_month').removeClass('govuk-input--error');
            $('.rfp_resource_start_year').removeClass('govuk-input--error');
            ccsZPresentErrorSummary();
         }
         if ((FormDate.setHours(0,0,0,0) != todayDate.setHours(0,0,0,0)) && getTimeOfFormDate < todayDate.getTime()) { 

           // $('#event-name-error-date').html('Start date must be a valid future date');
           removeErrorFieldsdates();
           var message = 'Start date must be a valid future date'
            if(document.getElementById('agreementID').value === 'RM1043.8'){
               message = ' Enter a date in the future'
            }
            Day.addClass('govuk-form-group--error');
            Month.addClass('govuk-form-group--error');
            Year.addClass('govuk-form-group--error');
            $('.durations').addClass('govuk-form-group--error');
            fieldCheck = ccsZvalidateWithRegex("rfp_resource_start_date", message, /^\d{1,}$/);
            if (fieldCheck !== true){ errorStore.push(fieldCheck)
            }else{
              fieldCheck = ccsZvalidateWithRegex("rfp_resource_start_date", message, /^\d{1,}$/);
            }
            if(errorStore.length>0){
               ccsZPresentErrorSummary(errorStore);
               return false;
              }
   
            return false;
         }else{
            $('#rfp_resource_start_date-hint-error').removeClass('govuk-error-message');
            $('.rfp_resource_start_day').removeClass('govuk-input--error');
            $('.rfp_resource_start_month').removeClass('govuk-input--error');
            $('.rfp_resource_start_year').removeClass('govuk-input--error');
            ccsZPresentErrorSummary();
         }
                 
      }

      const startDate = new Date(Number(Year.val()), Number(Month.val() - 1), Number(Day.val()));
      
      if (!isValidDate(Number(Year.val()), Number(Month.val()), Number(Day.val()))) {
         $('.durations').addClass('govuk-form-group--error');
         $('.resource_start_date').html('Enter a valid project start date');
         return false;
      } 
      else if (startDate>new Date(2025,07,23)) {
         $('.durations').addClass('govuk-form-group--error');
         $('.resource_start_date').html('Project cannot start after: 23 August 2025');
          return false;
      }
      else {
         $('.durations').removeClass('govuk-form-group--error');
         $('.resource_start_date').html('');
         return true;
      }
   }
   else  {
      if(document.getElementById('agreementID') !== null) {
         if(document.getElementById('agreementID').value === 'RM1043.8') {
            let errorStore = [];
            Day.addClass('govuk-form-group--error');
            Month.addClass('govuk-form-group--error');
            Year.addClass('govuk-form-group--error');
            $('.durations').addClass('govuk-form-group--error');
            $('#event-name-error-date').html('Enter a project start date'); 
            fieldCheck = ccsZvalidateWithRegex("rfp_resource_start_date-hint", "Enter a project start date", /^\d{1,}$/);
            if (fieldCheck !== true){ errorStore.push(fieldCheck)
            }
            if(errorStore.length>0){
               ccsZPresentErrorSummary(errorStore);
            }
         }
         if(document.getElementById('agreementID').value === 'RM1557.13') {
            let errorStore = [];
            Day.addClass('govuk-form-group--error');
            Month.addClass('govuk-form-group--error');
            Year.addClass('govuk-form-group--error');
            $('.durations').addClass('govuk-form-group--error');
            $('#event-name-error-date').html('Project start date should not be empty'); 
            fieldCheck = ccsZvalidateWithRegex("rfp_resource_start_date-hint", "Project start date should not be empty", /^\d{1,}$/);
            if (fieldCheck !== true){ errorStore.push(fieldCheck)
            }
            if(errorStore.length>0){
               ccsZPresentErrorSummary(errorStore);
            }
         }
      }
      return false;
   }
}

function isValidDate(year, month, day) {
  
   month = month - 1;
   var d = new Date(year, month, day);
   if (d.getFullYear() == year && d.getMonth() == month && d.getDate() == day) {
      return true;
   }
   return false;
}

$(".textlimit").keyup(function(e) {
   var maxLen = $(this).val().length;
   let value = $(this).val();
   var keyCode = e.which;
   
   if (maxLen >= 1) {
       return false; 
   }

});


$(".textlimit").keypress(function(e) {
   var maxLen = $(this).val().length;
   let value = $(this).val();
  
   var keyCode = e.which;
   if (maxLen >= 1) {
      return false;
   }

});

$(".daylimit").keyup(function(e) {
   var maxLen = $(this).val().length;
   let value = $(this).val();
   var keyCode = e.which;
   
   if (maxLen >= 2 && (Number(value)>0 || Number(value) < 31)) {
       return false; 
   }

});


$(".daylimit").keypress(function(e) {
   var maxLen = $(this).val().length;
   let value = $(this).val();
  
   var keyCode = e.which;
   if (maxLen >= 2 && (Number(value)>0 || Number(value) <31)) {
      return false;
   }

});


$(".daymonthlimit").keyup(function(e) {
   var maxLen = $(this).val().length;
   let value = $(this).val();
   var keyCode = e.which;
   
   if (maxLen >= 2) {
       return false; 
   }

});


$(".daymonthlimit").keypress(function(e) {
   var maxLen = $(this).val().length;
   let value = $(this).val();
  
   var keyCode = e.which;
   if (maxLen >= 2) {
      return false;
   }

});

$(".startdateyearlimit").keyup(function(e) {
   var maxLen = $(this).val().length;
   let value = $(this).val();
   var keyCode = e.which;
   
   if (maxLen >= 4) {
       return false; 
   }

});


$(".startdateyearlimit").keypress(function(e) {
   var maxLen = $(this).val().length;
   let value = $(this).val();
   var keyCode = e.which;
   if (maxLen >= 4) {
      return false;
   }

});

$(".yearlimit").keyup(function(e) {
   var maxLen = $(this).val().length;
   let value = $(this).val();
   var keyCode = e.which;
   
   if (maxLen >= 1) {
       return false; 
   }

});


$(".yearlimit").keypress(function(e) {
   var maxLen = $(this).val().length;
   let value = $(this).val();
   var keyCode = e.which;
   if (maxLen >= 1) {
      return false;
   }

});

const removeErrorFieldsdates = () => {
   $('.govuk-error-message').remove();
   $('.govuk-form-group--error').removeClass('govuk-form-group--error');
   $('.govuk-error-summary').remove();
   $('.govuk-input').removeClass('govuk-input--error');
   $('.govuk-form-group textarea').removeClass('govuk-textarea--error');
 };
 

function validateExtPeriod() {
   let isValid = 0;
   const durationYear = document.getElementsByClassName('rfp_duration_year_25');
   const durationMonth = document.getElementsByClassName('rfp_duration_month_25');
   const durationDay = document.getElementsByClassName('rfp_duration_day_25');

   const YearProjectRun = Number(durationYear[0].value);
   const MonthProjectRun = Number(durationMonth[0].value);
   const DaysProjectRun = Number(durationDay[0].value);

   const YearProjectRun2 = Number(durationYear[1].value);
   const MonthProjectRun2 = Number(durationMonth[1].value);
   const DaysProjectRun2 = Number(durationDay[1].value);

let projectRunInDays = 0;
   if (YearProjectRun > 0) {
      projectRunInDays = (365 * YearProjectRun)
   }
   if (MonthProjectRun > 0) {
      projectRunInDays = projectRunInDays + (30 * MonthProjectRun)
   }

   if (DaysProjectRun > 0) {
      projectRunInDays = projectRunInDays + DaysProjectRun;
   }

let extensionRunInDays = 0;
   if (YearProjectRun2 > 0) {
      extensionRunInDays = (365 * YearProjectRun2)
   }
   if (MonthProjectRun2 > 0) {
      extensionRunInDays = extensionRunInDays + (30 * MonthProjectRun2)
   }

   if (DaysProjectRun2 > 0) {
      extensionRunInDays = extensionRunInDays + DaysProjectRun2;
   }


   if (projectRunInDays > extensionRunInDays) {
            let dayDiffPercentage = ((extensionRunInDays / projectRunInDays) * 100);
            if (dayDiffPercentage > 50) {
               isValid = 1; 
            }
   }else{
      isValid = 2;
   }
   return isValid;
}




var allWords = '';
var wordCount = 0;
const MaxWordLimits = 500;

$('#completed_work').on('keypress focus mouseleave', ()=> {
  
    allWords = $('#completed_work').val();
    wordCount = allWords.split(' ').length;

    if(wordCount > MaxWordLimits){
        $('.govuk-error-summary__title').text('There is a problem');
        $('#work_location_word_error').text('Total Words: '+ wordCount + ' out of 500')

        $("#summary_list").html('<li><a href="#">Words limit exceeded</a></li> ');
        $([document.documentElement, document.body]).animate({
            scrollTop: $("#summary_list").offset().top
        }, 1000);     
    
        $('#service_capability_error_summary').removeClass('hide-block');
        document.getElementById('completed_work').classList.add('govuk-input--error');

    }
    else{
        $('.govuk-error-summary__title').text('');
        $('#work_location_word_error').text('')

       
    
        $('#service_capability_error_summary').addClass('hide-block')
        document.getElementById('completed_work').classList.remove('govuk-input--error');
    }

})



$('#rfp_work_completed').on('submit', (e)=>{

    if(wordCount > MaxWordLimits){
        e.preventDefault();
    }
    else{
        $('#rfp_work_completed').submit();
    }
} )


document.addEventListener('DOMContentLoaded', () => {

  const formPercentage = $('#rfp_percentage_form');
  if (formPercentage !== undefined && formPercentage.length > 0) {

    addEventListener('input', (event) => {
      event.target.value = event.target.value.replace(/[^0-9\.]/g, '');
    });

    let allTextBox = $("form input[type='number']");
    let elements = document.querySelectorAll("[name='percentage']");
    let totalPercentageEvent = () => {
     
      let percentage = 0
      let errorList = [];
      //removeErrorFieldsRfpPercentage();
      elements.forEach((el) => {
        

        percentage += isNaN(el.value) ? 0 : Number(el.value);
      });
      // if (percentage > 100) {
      //   errorList.push(["There is a problem", "Your total percentage must be 100%"]);
      //   ccsZPresentErrorSummary(errorList)
      // }
      // if (percentage < 100) {
      //   errorList.push(["There is a problem", "Your total percentage must be 100%."]);
      //   ccsZPresentErrorSummary(errorList)
      // }
      
      $("#totalPercentage").text(percentage);
    };
    
    // for (let k = 0; k < allTextBox.length; k++){
     
    // }

    

    elements.forEach((ele) => {
      ele.addEventListener('focusout', totalPercentageEvent)
      ele.addEventListener('keydown', (event) => {
        if (event.key === '.' || event.keyCode === 69) { event.preventDefault(); }
      });
    });
     totalPercentageEvent();
  }
});

const checkPercentagesCond = () => {
  removeErrorFieldsRfpPercentage();
  let fieldCheck = "",
    errorStore = [];
    const urlParams = new URLSearchParams(window.location.search);
    const agrement_id = urlParams.get('agreement_id');
  let allTextBox = $("form input[type='number']");
  let totalValue = 0;
  console.log(Number($("#totalPercentage").text()));
  // if (Number($("#totalPercentage").text()) > 100) {
    // errorStore.push(['There is a problem', 'The total weighting cannot exceed 100%'])
    //ccsZPresentErrorSummary([errorStore]);
    // for (let k = 0; k < allTextBox.length; k++) {
    //   fieldCheck = ccsZvalidateWithRegex(allTextBox[k].id, "The total weighting cannot exceed 100%", /\w+/, false);
    //   if (fieldCheck !== true) errorStore.push(fieldCheck);

    // }
    for (let k = 0; k < allTextBox.length; k++) {
      totalValue += Number(allTextBox[k].value);
      var range = $("#range_p" + allTextBox[k].id.replace(" ", "")).attr("range");
    var subTitle = $('#getSubTitle'+allTextBox[k].id.replace(" ", "")).html();
      if (!subTitle.includes("optional") && allTextBox[k].value == "" || allTextBox[k].value < 0) {
        if (subTitle!= 'Social value'){ 

          if(agrement_id == 'RM6187'){
            fieldCheck = ccsZvalidateWithRegex(allTextBox[k].id, "You must enter "+subTitle.toLowerCase()+" range between [" + range.split("-")[0] + "-" + range.split("-")[1] + "%]", /\w+/, false);
          }
          else if(agrement_id == 'RM1043.8' && subTitle.includes("Essential skills and experience")){
            fieldCheck = ccsZvalidateWithRegex(allTextBox[k].id+"-hint", "Enter a weighting for essential skills and experience", false);
          }
          else if(agrement_id == 'RM1043.8' && subTitle.includes("Technical questions")){
            fieldCheck = ccsZvalidateWithRegex(allTextBox[k].id+"-hint", "Enter a weighting for technical questions", false);
          }else{
               fieldCheck = ccsZvalidateWithRegex(allTextBox[k].id+"-hint", "Enter a weighting for "+subTitle.toLowerCase()+" between " + range.split("-")[0] + " and " + range.split("-")[1] + "%", /\w+/, false);
          }

          
        }
        else {
          fieldCheck = ccsZvalidateWithRegex(allTextBox[k].id, "Enter a weighting for "+subTitle.toLowerCase()+" that is 0% or between " + range.split("-")[0] + " and " + range.split("-")[1] + "%", /\w+/, false);
        }
        if (fieldCheck !== true) errorStore.push(fieldCheck);
      } else if (Number(allTextBox[k].value) >= 0 && subTitle!= 'Social value') {
        var result = checkRange(range.split("-")[0], range.split("-")[1], allTextBox[k].value);
        if (result.start) {
          //fieldCheck = ccsZvalidateWithRegex("Question " + k, "The total weighting cannot exceed 100%", /\w+/, false);
          // $("#event-name-error-"+allTextBox[k].value.replace(" ","")).removeClass("govuk-visually-hidden").text("Range value incorrect");
          //errorStore.push("The value incorrect");
          fieldCheck = ccsZvalidateWithRegex(allTextBox[k].id, "Enter Range value between [" + range.split("-")[0] + "-" + range.split("-")[1] + "%]", /\w+/, false);
          if (fieldCheck !== true) errorStore.push(fieldCheck);

        }
        else if (result.end) {
          
          fieldCheck = ccsZvalidateWithRegex(allTextBox[k].id, "Range value between [" + range.split("-")[0] + "-" + range.split("-")[1] + "%]", /\w+/, false);
          if (fieldCheck !== true) errorStore.push(fieldCheck);
        }
      }
      else if (Number(allTextBox[k].value) > 0 && subTitle == 'Social value' && agrement_id == 'RM1043.8') {
        var result = checkRange(range.split("-")[0], range.split("-")[1], allTextBox[k].value);
        if (result.start) {
          //fieldCheck = ccsZvalidateWithRegex("Question " + k, "The total weighting cannot exceed 100%", /\w+/, false);
          // $("#event-name-error-"+allTextBox[k].value.replace(" ","")).removeClass("govuk-visually-hidden").text("Range value incorrect");
          //errorStore.push("The value incorrect");
          fieldCheck = ccsZvalidateWithRegex(allTextBox[k].id, "Enter Range value between [0%, or " + range.split("-")[0] + "-" + range.split("-")[1] + "%]", /\w+/, false);
          if (fieldCheck !== true) errorStore.push(fieldCheck);

        }
        else if (result.end) {
          console.log(range)
          fieldCheck = ccsZvalidateWithRegex(allTextBox[k].id, "Range value between [0%, or " + range.split("-")[0] + "-" + range.split("-")[1] + "%]", /\w+/, false);
          if (fieldCheck !== true) errorStore.push(fieldCheck);
        }

      }
    }
  // } 
  //} 
  // else if (Number($("#totalPercentage").text()) <= 0) {
  //   for (let k = 1; k < allTextBox.length; k++) {
  //     var range = $("#range_p").attr('range');
  //     fieldCheck = ccsZvalidateWithRegex("Question " + k, "Please enter range value", /\w+/, false);
  //     if (fieldCheck !== true) errorStore.push(fieldCheck);
  //   }
  // }
  return errorStore;
};

const checkRange = (s, e, val) => {
  let start = false;
  let end = false;
  if (Number(val) < Number(s)) {
    start = true;
    return { start, end };
  }

  if (Number(val) > Number(e)) {
    end = true;
    return { start, end };
  }
  return { start, end };
}
const ccsZvalidateRfpPercentages = (event) => {
  event.preventDefault();
  const urlParams = new URLSearchParams(window.location.search);
    const agrement_id = urlParams.get('agreement_id');
  let errorStore =[];
  const pageHeading = document.getElementById('page-heading').innerHTML;

  let elements = document.querySelectorAll("[name='percentage']");
  let percentage = 0;
  
  elements.forEach((el) => {
    percentage += isNaN(el.value) ? 0 : Number(el.value);
   
});

 
  errorStore = errorStore == null || errorStore.length <= 0 ? checkPercentagesCond() : errorStore;
  checkPercentagesCond()
  if ((pageHeading.includes('Set the overall weighting between quality and price') || pageHeading.includes('Set the quality weightings')) && (percentage > 100 || percentage < 100)) {
    errorStore.push(["#", "Your total percentage must be 100%"]);
    ccsZPresentErrorSummary(errorStore)
  }
  if (pageHeading.includes('Set the overall weighting') && (percentage > 100 || percentage < 100) && agrement_id == 'RM1043.8') {
    errorStore.push(["#", "The weightings must add up to 100% in total"]);
    ccsZPresentErrorSummary(errorStore)
  }
  if (pageHeading.includes('Set the specific weighting of quality groups') && (percentage > 100 || percentage < 100) && (agrement_id == 'RM6187' || agrement_id == 'RM1557.13')) {
    errorStore.push(["#", "Your total percentage must be 100%"]);
    ccsZPresentErrorSummary(errorStore)
  }
  if (pageHeading.includes('Set the overall weighting for quality') && (percentage > 100 || percentage < 100)) {
    errorStore.push(["#", "Your total percentage must be 100%"]);
    ccsZPresentErrorSummary(errorStore)
  }
  if ((pageHeading.includes('Technical Competence') || pageHeading.includes('Technical competence') ) && (percentage > 100 || percentage < 100)) {

    errorStore.push(["#", "The weightings must add up to 100% in total"]);
    
    //var fieldCheck = ccsZvalidateWithRegex('Question 3-hint', "Your total percentage must be 100%", /\w+/);
    //errorStore.push(fieldCheck);
    
    ccsZPresentErrorSummary(errorStore)
  }
  
  
  if (errorStore === undefined || errorStore === null || errorStore.length === 0) {
    document.forms["rfp_percentage_form"].submit();
  }
  else {
    ccsZPresentErrorSummary(errorStore);
  }
}

const removeErrorFieldsRfpPercentage = () => {
  $('.govuk-error-message').remove();
  $('.govuk-form-group--error').removeClass('govuk-form-group--error');
  $('.govuk-error-summary').remove();
  $('.govuk-input').removeClass('govuk-input--error');
  $('.govuk-form-group textarea').removeClass('govuk-textarea--error');
};

$('.questionweightagelimit').on('keypress', function (evt) {
  let value = $(this).val();
  evt = (evt) ? evt : window.event;
      var charCode = (evt.which) ? evt.which : evt.keyCode;
      if (charCode > 31 && (charCode < 48 || charCode > 57) || value.length >=3) {
          return false;
      }
      return true;
   
   });
  
document.addEventListener('DOMContentLoaded', () => {
    if (document.getElementById("ccs_rfp_procurement_lead") !== null) {
        document.getElementById('ccs_rfp_procurement_lead').addEventListener('change', function (event) {
            event.preventDefault();
            $.ajax({
                url: "/rfp/users-procurement-lead?id=" + event.target.value,
                type: "GET",
                contentType: "application/json",
            }).done(function (result) {
                setUserDetails(result);
            }).fail((res) => {
                let div_email = document.getElementById('rfp-lead-email');
                div_email.innerText = '';
                let div_tel = document.getElementById('rfp-lead-telephone');
                div_tel.innerText = '';

            })
        });
        const setUserDetails = (user) => {
            let div_email = document.getElementById('rfp-lead-email');
            div_email.innerText = user.userName;
            let div_tel = document.getElementById('rfp-lead-telephone');
            div_tel.innerText = '1';
            let div_email_value = document.getElementById('rfp_procurement_lead_input');
            div_email_value.value = user.userName;

        };
    }
});

$('.add').addClass('ccs-dynaform-hidden');
const Selector = $('.quality_group');
const SelectorLen = Selector.length;


$('#quality_group_form').on('submit', (e)=> {
  
    const ErrorStore = [];

    var total = 0;

    for(var a =0; a <3; a++){

        const val = document.getElementsByClassName('quality_group')[a].value;
        
        if(val != '' && !isNaN(val)){
            total = total + Number(val);
        }
        else{
            document.getElementsByClassName('quality_group')[a].classList.add('govuk-input--error')
            document.getElementsByClassName('quality_group_t')[a].innerHTML = 'The format of the following input is invalid'
            ErrorStore.push(true);
        }
    }
    //main-content

    if(ErrorStore.length > 0){
        e.preventDefault();
       
    }

    if(total > 100){
        e.preventDefault();
        $('.govuk-error-summary__title').text('There is a problem');

        $("#summary_list").html('<li><a href="#">The total weighting is greater than 100%</a></li> ');
        $([document.documentElement, document.body]).animate({
            scrollTop: $("#summary_list").offset().top
        }, 1000);     
    
        $('#service_capability_error_summary').removeClass('hide-block');

        for(var a =0; a < SelectorLen; a++){
            const val = document.getElementsByClassName('quality_group')[a].value;
        
        if(val != '' && !isNaN(val)){
            document.getElementsByClassName('quality_group')[a].classList.add('govuk-input--error')
            document.getElementsByClassName('quality_group_t')[a].innerHTML = 'The total weighting is greater than 100%'
        }
        else{
            document.getElementsByClassName('quality_group')[a].classList.add('govuk-input--error')
            document.getElementsByClassName('quality_group_t')[a].innerHTML = 'The format of the following input is invalid'
        }
            
        }

        e.preventDefault();

    }
    else{

        $('#quality_group_form').submit();

    }

  

   
})

document.addEventListener('DOMContentLoaded', () => {
    const queryString = window.location.search;
    const urlParams = new URLSearchParams(queryString);
    $(".rpf_500").attr('maxlength','500');
    $(".rpf_5000").attr('maxlength','5000');
    $(".rpf_10000").attr('maxlength','10000');
    if(urlParams.get('agreement_id') == 'RM1043.8'){
    $("#rfp_prob_statement_d").attr('maxlength','500');
    $("#rfp_prob_statement_e").attr('maxlength','5000');
    $("#rfp_prob_statement_g").attr('maxlength','5000');
    $("#rfp_prob_statement_t").attr('maxlength','5000');
    $("#rfp_prob_statement_m").attr('maxlength','5000');
    $("#rfp_prob_statement_n").attr('maxlength','5000');
    $("#rfp_prob_statement_s").attr('maxlength','5000');
    $(".min_supplier").attr('maxlength','8');

    }


    const removeErrorFieldsRfpScoreQuestion = () => {
        $('.govuk-error-message').remove();
        $('.govuk-form-group--error').removeClass('govuk-form-group--error');
        $('.govuk-error-summary').remove();
        $('.govuk-input').removeClass('govuk-input--error');
        $('.govuk-form-group textarea').removeClass('govuk-textarea--error');
    };

    const FormSelector = $('#rfp_multianswer_question_form');

    if (FormSelector !== undefined && FormSelector.length > 0 ) {
        $('.additional').addClass('ccs-dynaform-hidden');
        let with_value_count = 50,
            prev_input = 0,
            deleteButtons = document.querySelectorAll('a.del');
        let deleteButtonCount = [];
        let elements = document.querySelectorAll('.weightage');
        let textboxelements = document.querySelectorAll('.order_1');
        let totalPercentage = () => {
            let errorStore = [];
            let weightageSum = 0;
            let urlParamsData = new URLSearchParams(window.location.search);
            //removeErrorFieldsRfpScoreQuestion();
            elements.forEach(el => {
                weightageSum += isNaN(el.value) ? 0 : Number(el.value);
            });
            
            if (weightageSum > 100) {
                errorStore = emptyQuestionFieldCheckRfp();
                if(urlParamsData.get('agreement_id') == 'RM1043.8' && urlParamsData.get('id') == 'Criterion 2' && (urlParamsData.get('group_id') == 'Group 9' || urlParamsData.get('group_id') == 'Group 5' || urlParamsData.get('group_id') == 'Group 6' ||  urlParamsData.get('group_id') == 'Group 7')  && urlParamsData.get('section') == 5) {
                    let textboxCount =  $('.order_1').filter(function() {return this.value !== '';}).length;
                    var percentageCheck = ccsZvalidateWeihtageValue('fc_question_precenate_' + textboxCount, "The total weighting is exceeded more than 100%",weightageSum, /\w+/);
                    errorStore.push(percentageCheck)
                }
                else{
                errorStore.push(["There is a problem", "The total weighting is exceeded more than 100%"]);
                }
                ccsZPresentErrorSummary(errorStore);
            }
            $('#totalPercentage').html(weightageSum);
        };
        
        textboxelements.forEach(ele => {
            ele.addEventListener('keydown', (event) => {
                removeErrorFieldsRfpScoreQuestion();
            });
        });
        elements.forEach(ele => {
            ele.addEventListener('focusout', totalPercentage);
            ele.addEventListener('keydown', (event) => {
                removeErrorFieldsRfpScoreQuestion();
                if (event.key === '.' || event.keyCode === 69) { event.preventDefault(); }
            });
        });

        const totalAnswerd = () => {
            $('#questionsCount').html(
                $('.order_1').filter(function() {
                    return this.value !== '';
                }).length,
            );
        };
        

             
        totalAnswerd();
        totalPercentage();
        deleteButtons.forEach((db) => {
            db.classList.add('ccs-dynaform-hidden')
            db.addEventListener('click', (e) => {
                if($('.add-another-btn').hasClass("ccs-dynaform-hidden")){
                    $('.add-another-btn').removeClass("ccs-dynaform-hidden");
                }
                e.preventDefault();
                let target = db.href.replace(/^(.+\/)(\d{1,2})$/, "$2"),
                    prev_input = Number(target) - 1,
                    target_fieldset = db.closest("div");
                if(Number(target) == 20){
                    $('.add-another-btn').removeClass("ccs-dynaform-hidden");
                }
                target_fieldset.classList.add("ccs-dynaform-hidden");
                // document.querySelector('#fc_question_'+prev_input+' a.del').classList.remove("ccs-dynaform-hidden");
                //let precentageValueofLast = document.getElementById('fc_question_precenate_'+target).value;

                if (document.getElementById('fc_question_precenate_' + target) != undefined) {

                    var precentageValueofLast = document.getElementById('fc_question_precenate_' + target).value;

                }


                //let precentageValueofLast = document.getElementById('fc_question_'+target).value;
                if (document.getElementById("totalPercentage") != undefined) {
                    document.getElementById('totalPercentage').textContent = Number(document.getElementById('totalPercentage').textContent) > 0 ? Number(document.getElementById('totalPercentage').textContent) - Number(precentageValueofLast) : 0;

                }

                $('.class_question_remove_' + target).val("");

                if (document.getElementById('fc_question_' + target + "_1") != undefined) {
                    document.getElementById('fc_question_' + target + "_1").value = "";
                }
                if (document.getElementById('fc_question_' + target + "_2") != undefined) {
                    document.getElementById('fc_question_' + target + "_2").value = "";
                }
                if (document.getElementById('fc_question_' + target + "_3") != undefined) {
                    document.getElementById('fc_question_' + target + "_3").value = "";
                }

                if (document.getElementById('fc_question_precenate_' + target) != undefined) {
                    document.getElementById('fc_question_precenate_' + target).value = "";
                }

                // document.getElementById('fc_question_'+target+"_1").value = "";
                // document.getElementById('fc_question_'+target+"_2").value = "";
                // document.getElementById('fc_question_'+target+"_3").value = "";
                // document.getElementById('fc_question_'+target).value = "";
                if (prev_input > 1) {

                    document.querySelector('#fc_question_' + prev_input + ' a.del').classList.remove("ccs-dynaform-hidden");
                } else {

                }
                //document.getElementsByClassName("add-another-btn").classList.remove('ccs-dynaform-hidden');
                if(urlParams.get('agreement_id') == 'RM1043.8' && with_value_count > 20){
                    with_value_count = 21
                }
                with_value_count--;
            });
        });

      
    var urlParamsDefault = new URLSearchParams(window.location.search);
    var agreement_id_Default =  urlParamsDefault.get('agreement_id')
    var lotid_Default;
    var group_id =  urlParamsDefault.get('group_id')

    if(document.getElementById('lID') !== null) {
        lotid_Default = document.getElementById('lID').value;
    }

        var total_countva=10;
        var withValue=11;
    if(urlParamsDefault.get('agreement_id') == 'RM1043.8' && urlParamsDefault.get('id') == 'Criterion 2' && lotid_Default == 1 && (urlParamsDefault.get('group_id') == 'Group 8' || urlParamsDefault.get('group_id') == 'Group 5' || urlParamsDefault.get('group_id') == 'Group 7' || urlParamsDefault.get('group_id') == 'Group 9') && urlParamsDefault.get('section') == 5 && (urlParamsDefault.get('step') == 48 || urlParamsDefault.get('step') == 44 || urlParamsDefault.get('step') == 46 )) {
            var total_countva=20;
            var withValue=21;
            with_value_count = 20
        }   
    else if(urlParamsDefault.get('agreement_id') == 'RM1043.8' && urlParamsDefault.get('id') == 'Criterion 2' && urlParamsDefault.get('group_id') == 'Group 9'  && urlParamsDefault.get('section') == 5) { 
        var total_countva=20;
            var withValue=21;
            with_value_count = 20
    }    
    else if(agreement_id_Default=='RM1043.8'){
        var total_countva=20;
        var withValue=21;
    }
    else if(urlParamsDefault.get('agreement_id') == 'RM1557.13' && urlParamsDefault.get('id') == 'Criterion 2' && urlParamsDefault.get('group_id') == 'Group 6'){
        var total_countva=5;
        var withValue=6;
    }else{
        if($('.question_count').hasClass("question_count")) {      
               
            var total_countva=50;
           var withValue=51;
       }else{
           var total_countva=10;
           var withValue=11;
           with_value_count = 10;
       }
    }
   
    let deleteButtonClicked = false
        
     
      
      

        for (var box_num = total_countva; box_num > 1; box_num--) {
            let this_box = document.getElementById('fc_question_' + box_num);
            if (this_box.querySelector('.order_1') != undefined && this_box.querySelector('.order_1').value !== '') {
                this_box.classList.remove('ccs-dynaform-hidden');
                if (box_num === total_countva) {

                    // $('.add-another-btn').addClass('ccs-dynaform-hidden');
                    var object = $('.add-another-btn').closest('.ccs-page-section');
                    if (object.length) {
                        $('.add-another-btn').closest('.ccs-page-section').css("border-bottom", "0px");
                    }
                }
                deleteButtonCount.push(box_num);
            } else if (this_box.querySelector('.order_2') != undefined && this_box.querySelector('.order_2').value !== '') {
                this_box.classList.remove('ccs-dynaform-hidden');
                if (box_num === total_countva) {

                    // $('.add-another-btn').addClass('ccs-dynaform-hidden');
                    var object = $('.add-another-btn').closest('.ccs-page-section');
                    if (object.length) {
                        $('.add-another-btn').closest('.ccs-page-section').css("border-bottom", "0px");
                    }
                }
                deleteButtonCount.push(box_num);
            } else {
                with_value_count = box_num;
            }
            if (box_num === 2 && deleteButtonCount.length > 0) {


                $("#del_fc_question_" + deleteButtonCount[0]).removeClass("ccs-dynaform-hidden");
           
            }

            // $("#del_fc_question_"+box_num).removeClass("ccs-dynaform-hidden");



        }
    


        if (with_value_count > 1) {
            $('#del_fc_question_' + with_value_count).removeClass('ccs-dynaform-hidden');
        }
        if($('#del_dos_question_'+ with_value_count)){
            $('#del_dos_question_' + with_value_count).removeClass('ccs-dynaform-hidden');
        }

        $('.add-another-btn').on('click', function() {
            errorStore = [];
            let textboxCount =  0;
            if($('.order_1').length > 0){
                textboxCount =  $('.order_1').filter(function() {return this.value !== '';}).length;
            }else{
                textboxCount =  $('.order_2').filter(function() {return this.value !== '';}).length;
            }
             
             if((urlParamsDefault.get('agreement_id') == 'RM1043.8' && urlParamsDefault.get('id') == 'Criterion 3' && urlParamsDefault.get('group_id') == 'Group 19') && with_value_count == 20){
                $('.add-another-btn').addClass("ccs-dynaform-hidden");
             }
            if(urlParamsDefault.get('agreement_id') == 'RM1043.8' && textboxCount == 19){
                $('.add-another-btn').addClass("ccs-dynaform-hidden");
            }
            if(urlParamsDefault.get('agreement_id') != 'RM1043.8' && with_value_count == 50){
                $('.add-another-btn').addClass("ccs-dynaform-hidden");
            }



            if(urlParamsDefault.get('agreement_id') == 'RM6187' && (urlParamsDefault.get('group_id') == 'Group 4' || urlParamsDefault.get('group_id') == 'Group 6') && urlParamsDefault.get('id') == 'Criterion 2' && with_value_count == 10){
                $('.add-another-btn').addClass("ccs-dynaform-hidden");
            }

            if(urlParamsDefault.get('agreement_id') == 'RM1557.13' && (urlParamsDefault.get('group_id') == 'Group 4' || urlParamsDefault.get('group_id') == 'Group 6') && urlParamsDefault.get('id') == 'Criterion 2' && with_value_count == 10){
                $('.add-another-btn').addClass("ccs-dynaform-hidden");
            }
            
        if(textboxCount <= 20 && urlParamsDefault.get('agreement_id') == 'RM1043.8' && urlParamsDefault.get('id') == 'Criterion 2' && (urlParamsDefault.get('group_id') == 'Group 8' || urlParamsDefault.get('group_id') == 'Group 5' || urlParamsDefault.get('group_id') == 'Group 6' || urlParamsDefault.get('group_id') == 'Group 7') && urlParamsDefault.get('section') == 5 && (urlParamsDefault.get('step') == 48 || urlParamsDefault.get('step') == 44 || urlParamsDefault.get('step') == 45 || urlParamsDefault.get('step') == 46)) {

         if ((textboxCount < (withValue-1)) && Number($('#totalPercentage').text()) >= 100) {
            $('.govuk-error-summary').remove();
        $('.govuk-form-group--error').remove();
        removeErrorFieldsRfpScoreQuestion();
        
            errorStore.push(["There is a problem", "The total weighting is 100% so you can not add more questions"]);
        }
       else if (textboxCount == (withValue-1)) {


            if(urlParamsDefault.get('agreement_id') == 'RM6187' && (urlParamsDefault.get('group_id') == 'Group 4' || urlParamsDefault.get('group_id') == 'Group 6') && urlParamsDefault.get('id') == 'Criterion 2' && with_value_count == 10){
                $('.add-another-btn').addClass("ccs-dynaform-hidden");
            }
            
            if(textboxCount <= 20 && urlParamsDefault.get('agreement_id') == 'RM1043.8' && urlParamsDefault.get('id') == 'Criterion 2' && (urlParamsDefault.get('group_id') == 'Group 9' || urlParamsDefault.get('group_id') == 'Group 8' || urlParamsDefault.get('group_id') == 'Group 5' || urlParamsDefault.get('group_id') == 'Group 6' || urlParamsDefault.get('group_id') == 'Group 7') && urlParamsDefault.get('section') == 5 && (urlParamsDefault.get('step') == 48 || urlParamsDefault.get('step') == 44 || urlParamsDefault.get('step') == 45 || urlParamsDefault.get('step') == 46)) {
                if ((textboxCount < (withValue-1)) && Number($('#totalPercentage').text()) >= 100) {
                    $('.govuk-error-summary').remove();
                    $('.govuk-form-group--error').remove();
                    removeErrorFieldsRfpScoreQuestion();
                    errorStore.push(["There is a problem", "The total weighting is 100% so you can not add more questions"]);
                } else if (textboxCount == (withValue-1)) {

                    $('.govuk-error-summary').remove();
                    $('.govuk-form-group--error').remove();
                    removeErrorFieldsRfpScoreQuestion();
                    if (Number($('#totalPercentage').text()) < 100) {
                    var percentageCheck = ccsZvalidateWeihtageValue('fc_question_precenate_' + textboxCount, "The total weighting is less than 100%", Number($('#totalPercentage').text()),/\w+/);
                    errorStore.push(percentageCheck)
                    }
        }
        else {
          //  if(urlParamsDefault.get('group_id') == 'Group 6' && urlParamsDefault.get('section') == 5 && urlParamsDefault.get('step') == 45){
                let textareaVal = $('#fc_question_'+textboxCount+ '_1').val();
                let percentageval = $('#fc_question_precenate_'+textboxCount).val();
                if(textareaVal != null || textareaVal != undefined || textareaVal != ''){
                    if((textareaVal != undefined && textareaVal.length != 0) && (percentageval == '' || percentageval == null || percentageval == undefined)){
                        let msgWeightageContent = 'You must enter percentage';
 
                        if(urlParams.get('group_id') == 'Group 5') {
                            msgWeightageContent = 'Enter a weighting for this essential skill or experience';
                        }
                        var fieldCheck =  ccsZvalidateWithRegex('fc_question_precenate_' + textboxCount, msgWeightageContent, /\w+/);
                        errorStore.push(fieldCheck)
                   }
                   else{
                    errorStore = emptyQuestionFieldCheckRfp(); 

                }
                }
                else{
                    let textareaData = $('#fc_question_'+with_value_count+ '_1').val();
                let percentageData = $('#fc_question_precenate_'+with_value_count).val();

                if(textareaData.trim() != '' || textareaData != null || textareaData != undefined){
                    errorStore = emptyQuestionFieldCheckRfp(); 

                }
                }
            // }
            // else{
            //     errorStore = emptyQuestionFieldCheckRfp(); 
            // }
        }

                    }
                    errorStore.push(["There is a problem", "Cannot add another question already "+ textboxCount +" questions created"]);
                    var object = $('.add-another-btn').closest('.ccs-page-section');
                    if (object.length) {
                    $('.add-another-btn').closest('.ccs-page-section').css("border-bottom", "0px");
                    }
                } else {
                    //  if(urlParamsDefault.get('group_id') == 'Group 6' && urlParamsDefault.get('section') == 5 && urlParamsDefault.get('step') == 45){
                    let textareaVal = $('#fc_question_'+textboxCount+ '_1').val();
                    let percentageval = $('#fc_question_precenate_'+textboxCount).val();
                    if(textareaVal != null || textareaVal != undefined || textareaVal != ''){
                    if((textareaVal != undefined && textareaVal.length != 0) && (percentageval == '' || percentageval == null || percentageval == undefined)){
                        let msgWeightageContent = 'You must enter percentage';
                        if(urlParams.get('group_id') == 'Group 5') {
                            msgWeightageContent = 'Enter a weighting for this essential skill or experience';
                        }
                        var fieldCheck =  ccsZvalidateWithRegex('fc_question_precenate_' + textboxCount, msgWeightageContent, /\w+/);
                        errorStore.push(fieldCheck)
                    } else{
                        errorStore = emptyQuestionFieldCheckRfp(); 
                    }
                    }
                    else{
                    let textareaData = $('#fc_question_'+with_value_count+ '_1').val();
                    let percentageData = $('#fc_question_precenate_'+with_value_count).val();

                    if(textareaData.trim() != '' || textareaData != null || textareaData != undefined){
                    errorStore = emptyQuestionFieldCheckRfp(); 

                    }
                    }
                    // }
                    // else{
                    //     errorStore = emptyQuestionFieldCheckRfp(); 
                    // }
                }

            } else if(urlParamsDefault.get('agreement_id') == 'RM1043.8' && urlParamsDefault.get('id') == 'Criterion 2' && urlParamsDefault.get('group_id') == 'Group 9'  && urlParamsDefault.get('section') == 5) {
               
                if(textboxCount <= 20){
                    if ((textboxCount < (withValue-1)) && Number($('#totalPercentage').text()) >= 100) {
                            $('.govuk-error-summary').remove();
                            $('.govuk-form-group--error').remove();
                            removeErrorFieldsRfpScoreQuestion();
                            errorStore.push(["There is a problem", "The total weighting is 100% so you can not add more questions"]);
                    } else if (textboxCount == (withValue-1)) {
                        $('.govuk-error-summary').remove();
                        $('.govuk-form-group--error').remove();
                        removeErrorFieldsRfpScoreQuestion();
                        if (Number($('#totalPercentage').text()) < 100) {
                        var percentageCheck = ccsZvalidateWeihtageValue('fc_question_precenate_' + textboxCount, "The total weighting is less than 100%", Number($('#totalPercentage').text()),/\w+/);
                        errorStore.push(percentageCheck)
        
                        }
                        errorStore.push(["There is a problem", "Cannot add another question already "+ textboxCount +" questions created"]);
                        var object = $('.add-another-btn').closest('.ccs-page-section');
                        if (object.length) {
                            $('.add-another-btn').closest('.ccs-page-section').css("border-bottom", "0px");
                        }
                    }  else {
                        let textareaVal = $('#fc_question_'+textboxCount+ '_1').val();
                        let percentageval = $('#fc_question_precenate_'+textboxCount).val();
                        if(textareaVal != null || textareaVal != undefined || textareaVal != ''){
                            if( (textareaVal != undefined && textareaVal.length != 0) && (percentageval == '' || percentageval == null || percentageval == undefined)){
                                var fieldCheck =  ccsZvalidateWithRegex('fc_question_precenate_' + textboxCount, "You must enter percentage", /\w+/);
                                errorStore.push(fieldCheck)
                            } else{
                                errorStore = emptyQuestionFieldCheckRfp(); 
                            }
                        }
                        else{
                            let textareaData = $('#fc_question_'+with_value_count+ '_1').val();
                            let percentageData = $('#fc_question_precenate_'+with_value_count).val();

                            if(textareaData.trim() != '' || textareaData != null || textareaData != undefined){
                            errorStore = emptyQuestionFieldCheckRfp(); 

                            }
                        }
                    }
                }
            } else if(textboxCount <= 20 && urlParamsDefault.get('agreement_id') == 'RM1043.8' && urlParamsDefault.get('id') == 'Criterion 3' && urlParamsDefault.get('group_id') == 'Group 15'){
                for (var i = 1; i < withValue; i++) {
                    const divElem = document.querySelector('#fc_question_' + i);
                    const inputElements = divElem.querySelectorAll("textarea");
                    let error_classes = $('#fc_question_'+i).hasClass('ccs-dynaform-hidden');
                    if (inputElements != null && inputElements != undefined && inputElements.length > 0) {
                        for (let index = 0; index < inputElements.length; index++) {
                            const element = inputElements[index];
                            ccsZremoveErrorMessage(element)
                            if (element.value == '' && index >= 0 && (error_classes == false)) {
                                    let error = ccsZvalidateWithRegex(element.id, "You must add information in all fields.", /^.+$/);
                                    errorStore.push(error);
                            }
                            if (textboxCount == 19) {
                                $('.add-another-btn').addClass("ccs-dynaform-hidden");
                            }
                        }
                    }
                }
            } else {
                if (Number($('#totalPercentage').text()) >= 100) {
                $('.govuk-error-summary').remove();

                $('.govuk-form-group--error').remove();
                removeErrorFieldsRfpScoreQuestion();

                errorStore.push(["There is a problem", "The total weighting is 100% so you can not add more questions"]);
                }
                else {
                    errorStore = emptyQuestionFieldCheckRfp(); 
                }
            }

            const pageHeading = document.getElementById('page-heading').innerHTML;
            if (errorStore.length == 0) {
                prev_input = with_value_count - 1;
                deleteButtonClicked = true
                if(agreement_id_Default == "RM1043.8" && with_value_count > 20){
                    with_value_count = 20
                }
                        document.getElementById('fc_question_'+ with_value_count).classList.remove('ccs-dynaform-hidden');

                //Added this condation section 5 (step 43/44/45)

                if (with_value_count > 2) {
                    if($('#del_dos_question_'+ with_value_count) || $('#del_fc_question_'+ with_value_count)){
                        document.querySelector('label[for=fc_question_' + prev_input + '] a.del').classList.add('ccs-dynaform-hidden');
                    }else {
                        document.querySelector('label[for=fc_question_' + prev_input + '] a.del').classList.remove('ccs-dynaform-hidden');
                    }
                }
                if (document.getElementById("questionsCount") != undefined) {
                    document.getElementById("questionsCount").textContent = with_value_count + ' technical questions entered so far';
                }
                document
                    .querySelector('label[for=fc_question_' + with_value_count + '] a.del')
                    .classList.remove('ccs-dynaform-hidden');
                //Add question set more than 5
                // if (pageHeading.includes('Write your cultural questions') || pageHeading.includes('Write your technical questions') || pageHeading.includes('Write your social value questions')) {
                //   if (with_value_count === 5) {
                //     errorStore.push(["There is a problem", "You can add a maximum of 5 question"]);
                //     ccsZPresentErrorSummary(errorStore);
                //     return;
                //   }
                // }
                
                with_value_count++;
                if(!(urlParamsDefault.get('agreement_id') == 'RM1043.8' && urlParamsDefault.get('id') == 'Criterion 2' && lotid_Default == 1 && (urlParamsDefault.get('group_id') == 'Group 8' || urlParamsDefault.get('group_id') == 'Group 5') && urlParamsDefault.get('section') == 5 && (urlParamsDefault.get('step') == 48 || urlParamsDefault.get('step') == 44))) {
                 if (with_value_count == withValue) {
                    // $('.add-another-btn').addClass('ccs-dynaform-hidden');
                    errorStore.push(["There is a problem", "Cannot add another question already "+ with_value_count +" questions created"]);
                    var object = $('.add-another-btn').closest('.ccs-page-section');
                    if (object.length) {
                        $('.add-another-btn').closest('.ccs-page-section').css("border-bottom", "0px");
                    }
                }
                }
                totalAnswerd();
                $('#del_dos_question_' + prev_input).addClass("ccs-dynaform-hidden");
                
            } else ccsZPresentErrorSummary(errorStore);
        });
        




        deleteButtons.forEach((db) => {
            //db.classList.remove('ccs-dynaform-hidden')
            db.addEventListener('click', (e) => {
                totalAnswerd();
                e.preventDefault();
                let target = db.href.replace(/^(.+\/)(\d{1,2})$/, "$2"),
                    prev_input = Number(target) - 1,
                    target_fieldset = db.closest("div");

                target_fieldset.classList.add("ccs-dynaform-hidden");
                if (document.getElementById('fc_question_precenate_' + target) != undefined) {
                    var precentageValueofLast = document.getElementById('fc_question_precenate_' + target).value;
                }
                if (document.getElementById("totalPercentage") != undefined) {
                    document.getElementById('totalPercentage').textContent = Number(document.getElementById('totalPercentage').textContent) > 0 ? Number(document.getElementById('totalPercentage').textContent) - Number(precentageValueofLast) : 0;
                }
                // document.getElementById('fc_question_' + target + "_1").value = "";
                // document.getElementById('fc_question_' + target + "_2").value = "";
                // document.getElementById('fc_question_' + target + "_3").value = "";

                $('.class_question_remove_' + target).val("");

                if (document.getElementById('fc_question_' + target + "_1") != undefined) {
                    document.getElementById('fc_question_' + target + "_1").value = "";
                }
                if (document.getElementById('fc_question_' + target + "_2") != undefined) {
                    document.getElementById('fc_question_' + target + "_2").value = "";
                }
                if (document.getElementById('fc_question_' + target + "_3") != undefined) {
                    document.getElementById('fc_question_' + target + "_3").value = "";
                }

                if (document.getElementById('fc_question_precenate_' + target) != undefined) {
                    document.getElementById('fc_question_precenate_' + target).value = "";
                }

                if (prev_input > 1) {
                    document.querySelector('#fc_question_' + prev_input + ' a.del').classList.remove("ccs-dynaform-hidden");
                }

            })
        });

        $('.dos_question_count').on('change keyup paste', (event) => {
            totalAnswerd();
        });
        
        $('.weightage').on('change keyup paste', (event) => {
            totalAnswerd();
        });

        if(deleteButtonClicked == false){
            let showinputarray = [];
        for (var i = 1; i < withValue; i++) {
            let additional_classes = $('#fc_question_'+i).hasClass('additional');
            let error_classes = $('#fc_question_'+i).hasClass('ccs-dynaform-hidden');
            let lastElement = showinputarray[showinputarray.length -1];
            if(additional_classes == true && error_classes == false){
                showinputarray.push(i);
            }
            if(showinputarray.length > 0){
                let prevvaalue = lastElement -1;
                $('#del_dos_question_' + lastElement).removeClass("ccs-dynaform-hidden");
                $('#del_dos_question_' + prevvaalue).addClass("ccs-dynaform-hidden");
            }
            if(urlParamsDefault.get('agreement_id') == 'RM1043.8' && showinputarray.length == 19){
                $('.add-another-btn').addClass("ccs-dynaform-hidden");
                $('#del_dos_question_19').addClass("ccs-dynaform-hidden");
                $('#del_dos_question_20').removeClass("ccs-dynaform-hidden");
                }
                if(urlParamsDefault.get('agreement_id') != 'RM1043.8' && showinputarray.length == 49){
                    $('.add-another-btn').addClass("ccs-dynaform-hidden");
                }
                if(urlParamsDefault.get('agreement_id') == 'RM6187' && (urlParamsDefault.get('group_id') == 'Group 4' || urlParamsDefault.get('group_id') == 'Group 6') && urlParamsDefault.get('id') == 'Criterion 2' && showinputarray.length == 9){
                    $('.add-another-btn').addClass("ccs-dynaform-hidden");
                }
        }
        } 
    }

    // $('.weightagelimit , .dos_question_count').on('keyup', function (evt) {
    //     emptyQuestionFieldCheckRfp();
    // });

    const emptyQuestionFieldCheckRfp = () => {
        removeErrorFieldsRfpScoreQuestion();
        const countWords = str => str.trim().split(/\s+/).length;
        let LOTID_VAR;
        if(document.getElementById('lID') !== null) {
            LOTID_VAR = document.getElementById('lID').value;
        }
        let fieldCheck = '',
            errorStore = [],
            noOfRequirement_Group = 0;

        const pageHeading = document.getElementById('page-heading').innerHTML;
        for (var i = 1; i < withValue; i++) {
            let rootEl = document.getElementById('fc_question_' + i);
            const divElem = document.querySelector('#fc_question_' + i);

            if (!rootEl.classList.contains('ccs-dynaform-hidden')) {
                if (Number($('#totalPercentage').text) > 100) {
                    fieldCheck = ccsZvalidateWithRegex(
                        'fc_question_' + i + '_4',
                        'You cannot add / submit  question as your weightings exceed 100%',
                        /\w+/,
                    );
                    if (fieldCheck !== true) errorStore.push(fieldCheck);
                }
                if (pageHeading.includes("Enter your project requirements")) {
                    const inputElements = divElem.querySelectorAll("textarea");
                    if (inputElements != null && inputElements != undefined && inputElements.length > 0) {
                        for (let index = 0; index < inputElements.length; index++) {
                            const element = inputElements[index];
                            var labelElement = element.previousElementSibling.previousElementSibling;
                            var labelText = labelElement.innerHTML;
                            var msg = '';
                            var desmsg = '';
                            if(labelText.trim() == 'Name of the requirement'){
                                msg = 'You must enter your name of the requirement';
                            }else{
                                msg = 'You must enter your name of the group';
                            }
                            if(labelText.trim() == 'Describe the requirement'){
                                desmsg = 'You must enter your description of the requirement';
                            }else{
                                desmsg = 'You must enter your name of the requirement';
                            }
                            if (index === 0) {
                                if (element.value == '' || element.value === undefined || element.value === null) {
                                    errorStore.push([element.id, msg])
                                }
                            } else if(index === 1){
                                if (element.value == '' || element.value === undefined || element.value === null) {
                                    errorStore.push([element.id, desmsg])
                                }
                            }else {
                                if (element.value == '' || element.value === undefined || element.value === null) {
                                    errorStore.push([element.id, "You must enter your description of the requirement"])
                                }
                            }
                        }
                    }
                    noOfRequirement_Group += 1;
                } else if( pageHeading.trim().toLowerCase() != 'Special terms and conditions (Optional)'.toLowerCase()) {
                    if (rootEl.querySelector('.order_1')) {
                        let element = rootEl.querySelector('.order_1');


                        if ((rootEl.querySelector('.order_1').value == '' || ((rootEl.querySelector('.weightage') != null && rootEl.querySelector('.weightage') != undefined) && (rootEl.querySelector('.weightage').value == '' || rootEl.querySelector('.weightage').value == '0'))) && !pageHeading.includes("Assisted digital and accessibility requirements (Optional)")) {
                            let msgContent = 'You must enter valid question';
                            let msgWeightageContent = 'You must enter percentage';


                            if(urlParams.get('agreement_id') == 'RM1043.8' && urlParams.get('id') == 'Criterion 2' && (LOTID_VAR == 1 && (urlParams.get('group_id') == 'Group 5')) || (LOTID_VAR == 3 && (urlParams.get('group_id') == 'Group 5' )) ) {
                                msgContent = 'Enter an essential skill or experience';
                                msgWeightageContent = 'Enter a weighting for this essential skill or experience';
                            }

                            const msg = rootEl.querySelector('.order_1').value ?
                                'Entry is limited to 50 words' :
                                msgContent;
                            fieldCheck = ccsZvalidateWithRegex('fc_question_' + i + '_1', msg, /\w+/);

                            let percentageCheck;
                            if(urlParams.get('agreement_id') == 'RM1557.13' && urlParams.get('id') == 'Criterion 2' && urlParams.get('group_id') == 'Group 4' && rootEl.querySelector('.weightage').value == '0'){
                                 percentageCheck = ccsZvalidateWithRegex('fc_question_precenate_' + i, 'You must enter valid percentage', /\wd+/);
                            }else{
                                 percentageCheck = ccsZvalidateWithRegex('fc_question_precenate_' + i, msgWeightageContent, /\w+/);
                            }
                           
                            if (fieldCheck !== true){
                                errorStore.push(fieldCheck);
                            }



                            if(percentageCheck){
                                console.log('************1');
                                console.log(percentageCheck);
                                errorStore.push(percentageCheck);
                            }
                        }

                    }
                    if (rootEl.querySelector('.order_2')) {
                        if (rootEl.querySelector('.order_2').value == '') {

                            const msg = rootEl.querySelector('.order_2').value ?
                                'Entry is limited to 50 words' :
                                'You must enter valid additional information';

                            fieldCheck = ccsZvalidateWithRegex('fc_question_' + i + '_2', msg, /\w+/);
                            if (fieldCheck !== true) errorStore.push(fieldCheck);
                        }
                    }
                    if (rootEl.querySelector('.order_3')) {
                        if (rootEl.querySelector('.order_3').value == '') {
                            const msg = rootEl.querySelector('.order_3').value ?
                                'Entry is limited to 50 words' :
                                'You must enter valid information';

                            fieldCheck = ccsZvalidateWithRegex('fc_question_' + i + '_3', msg, /\w+/);
                            if (fieldCheck !== true) errorStore.push(fieldCheck);
                        }
                    }
                    if (rootEl.querySelector('.weightage')) {
                        const condWeight = rootEl.querySelector('.weightage').value > 100;
                        if (rootEl.querySelector('.weightage').value != '' && condWeight || rootEl.querySelector('.weightage').value < 0) {
                            const msg = rootEl.querySelector('.weightage').value ?
                                'Enter a weighting for this question <= 100%' :
                                'You must enter valid weightage';
                            fieldCheck = ccsZvalidateWithRegex('fc_question_' + i + '_4', msg, /\w+/, !condWeight);
                            if (fieldCheck !== true) errorStore.push(fieldCheck);
                        }
                    }
                }
            }
        }
        return errorStore;
    }


    $('#rfp_multianswer_question_form').on('submit', (event) => {
        let weightArr = 0;
        let weightTotal = 0;
        event.preventDefault();
        let errorStore = [];
        const queryString = window.location.search;
        const urlParams = new URLSearchParams(queryString);
        const pageHeading = document.getElementById('page-heading').innerHTML;
        let LOTID_VAR;
        if(document.getElementById('lID') !== null) {
            LOTID_VAR = document.getElementById('lID').value;
        }
        
        var weightLoop = document.getElementsByClassName("weightage");
        if(urlParams.get('agreement_id') == 'RM1043.8' && urlParams.get('id') == 'Criterion 2' && (LOTID_VAR == 1 && (urlParams.get('group_id') == 'Group 8' || urlParams.get('group_id') == 'Group 5' || urlParams.get('group_id') == 'Group 6' || urlParams.get('group_id') == 'Group 7'|| urlParams.get('group_id') == 'Group 9')) || (LOTID_VAR == 3 && (urlParams.get('group_id') == 'Group 5' || urlParams.get('group_id') == 'Group 6' || urlParams.get('group_id') == 'Group 7'|| urlParams.get('group_id') == 'Group 8')) ) {
            Array.prototype.forEach.call(weightLoop, function(el) {
                // Do stuff here
                if(el.value !== "") {
                    weightArr = weightArr + 1
                }
                if(!el.parentElement.parentElement.parentElement.classList.contains('ccs-dynaform-hidden')) {
                    weightTotal = weightTotal + 1
                }
            });
        } else if(urlParams.get('agreement_id') == 'RM6187' && urlParams.get('id') == 'Criterion 2' && urlParams.get('group_id') == 'Group 6') {
            Array.prototype.forEach.call(weightLoop, function(el) {
                // Do stuff here
                if(el.value !== "") {
                    weightArr = weightArr + 1
                }
                if(!el.parentElement.parentElement.parentElement.classList.contains('ccs-dynaform-hidden')) {
                    weightTotal = weightTotal + 1
                }
            });
        }
        else if(urlParams.get('agreement_id') == 'RM1557.13' && urlParams.get('id') == 'Criterion 2' && urlParams.get('group_id') == 'Group 6') {
            Array.prototype.forEach.call(weightLoop, function(el) {
                // Do stuff here
                if(el.value !== "") {
                    weightArr = weightArr + 1
                }
                if(!el.parentElement.parentElement.parentElement.classList.contains('ccs-dynaform-hidden')) {
                    weightTotal = weightTotal + 1
                }
            });
        }

        if(weightArr == 0) {
            if(urlParams.get('agreement_id') == 'RM1043.8' && urlParams.get('id') == 'Criterion 2' && (LOTID_VAR == 1 && (urlParams.get('group_id') == 'Group 6' || urlParams.get('group_id') == 'Group 9')) || (LOTID_VAR == 3 && (urlParams.get('group_id') == 'Group 6' || urlParams.get('group_id') == 'Group 8')) ) {
              
              
                 /*let i = 0
                Array.prototype.forEach.call(weightLoop, function(el) {
                    if(i == 0) {
                        el.value = '100';
                    }
                    i++
                });
                var textareaLoop = document.getElementsByClassName("govuk-textarea");
                let l = 0
                Array.prototype.forEach.call(textareaLoop, function(el) {
                    if(l == 0) {

                        var txtArea = document.getElementById(el.getAttribute('id'));
                        txtArea.value = 'None';
                    }
                    l++
                });*/

                if((urlParams.get('group_id') == 'Group 9' || urlParams.get('group_id') == 'Group 6' ) && urlParamsDefault.get('section') == 5){
                    var textareaVal = $('#fc_question_'+1+ '_1').val();
                    var percentageval = $('#fc_question_precenate_'+1).val();
                    if(textareaVal.trim() != '' || textareaVal != null || textareaVal != undefined){
                        if(textareaVal.length != 0 && (percentageval == '' || percentageval == null || percentageval == undefined)){
                            var fieldCheck =  ccsZvalidateWithRegex('fc_question_precenate_' + 1, "You must enter percentage", /\w+/);
                            errorStore.push(fieldCheck)
                       }
                    }
                    if (errorStore.length === 0) {
                        const classList = document.getElementsByClassName("govuk-hint-error-message");
                        const classLength = classList.length;
                        if (classLength != 0) {
                            return false;
                        } else {
                            document.forms['rfp_multianswer_question_form'].submit();
                        }
                    } else { ccsZPresentErrorSummary(errorStore); }
                }  
                else{
                    document.forms['rfp_multianswer_question_form'].submit();

                }

            } else if(urlParams.get('agreement_id') == 'RM6187' && urlParams.get('id') == 'Criterion 2' && urlParams.get('group_id') == 'Group 6') {
                document.forms['rfp_multianswer_question_form'].submit();
            }else if(urlParams.get('agreement_id') == 'RM1557.13' && urlParams.get('id') == 'Criterion 2' && urlParams.get('group_id') == 'Group 6') {
                document.forms['rfp_multianswer_question_form'].submit();
            }
             else {
                if ($('#totalPercentage') != null && $('#totalPercentage') != undefined && $('#totalPercentage').length > 0 && Number($('#totalPercentage').text()) > 100) {
                    errorStore.push(["There is a problem", "The total weighting is more than 100% "]);
                }
               

                if ($('#totalPercentage') != null && $('#totalPercentage') != undefined && $('#totalPercentage').length > 0 && Number($('#totalPercentage').text()) < 100) {
                    for (var i = 1; i < withValue; i++) {
                        let error_classes = $('#fc_question_'+i).hasClass('ccs-dynaform-hidden');
                        let additional_classes = $('#fc_question_'+i).hasClass('additional');

                        if((($('#fc_question_'+i+ '_1').val() == '' && (error_classes == false && additional_classes == false )) || 
                        ($('#fc_question_'+i+ '_1').val() == '' && (error_classes == false && additional_classes == true ))

                        ) && !pageHeading.includes('Write your social value questions (Optional)')){
                            let msgContent = 'You must enter your question';

                            if(urlParams.get('agreement_id') == 'RM1043.8' && urlParams.get('id') == 'Criterion 2' && (LOTID_VAR == 1 && (urlParams.get('group_id') == 'Group 5')) || (LOTID_VAR == 3 && (urlParams.get('group_id') == 'Group 5' )) ) {
                                msgContent = 'Enter an essential skill or experience';
                                msgWeightageContent = 'Enter a weighting for this essential skill or experience';
                            }

                            var fieldCheck = ccsZvalidateWithRegex('fc_question_' + i + '_1', msgContent, /\w+/);

                            errorStore.push(fieldCheck)
                        } 
                        if((($('#fc_question_precenate_'+i).val() == '' && (error_classes == false && additional_classes == false )) ||
                        ($('#fc_question_precenate_'+i).val() == '' && ( error_classes == false && additional_classes == true ))

                        ) && !pageHeading.includes('Write your social value questions (Optional)')) {
                             let msgWeightageContent = 'You must enter a weighting for this question';
 
                             if(urlParams.get('agreement_id') == 'RM1043.8' && urlParams.get('id') == 'Criterion 2' && (LOTID_VAR == 1 && (urlParams.get('group_id') == 'Group 5')) || (LOTID_VAR == 3 && (urlParams.get('group_id') == 'Group 5' )) ) {
                                 msgWeightageContent = 'Enter a weighting for this essential skill or experience';
                             }
                        var percentageCheck = ccsZvalidateWithRegex('fc_question_precenate_' + i, msgWeightageContent, /\w+/);

                        errorStore.push(percentageCheck)
                        }
                        
                       if(urlParams.get('agreement_id') == 'RM1557.13'){
                      
                        if($('#fc_question_precenate_'+i).val() == '' && (error_classes == false && additional_classes == false ) && !pageHeading.includes('Write your social value questions (Optional)')){
                            errorStore.push(["There is a problem", "Your total weighting must be 100%"]);

                        }
                        else if($('#fc_question_precenate_'+i).val() != '' && (error_classes == false && additional_classes == false ) && !pageHeading.includes('Write your social value questions (Optional)') && Number($('#totalPercentage').text()) < 1){
                            errorStore.push(["There is a problem", "Your total weighting is must be greater than 1%"]);
                        }
                        else if($('#fc_question_precenate_'+i).val() != '' && (error_classes == false && additional_classes == false ) && !pageHeading.includes('Write your social value questions (Optional)') && Number($('#totalPercentage').text()) < 100){
                            errorStore.push(["There is a problem", "Your total weighting must be 100%"]);
                        }

                        if($('#fc_question_precenate_'+i).val() != '' && (error_classes == false && additional_classes == false ) && pageHeading.includes('Write your social value questions (Optional)')){
                            errorStore.push(["There is a problem", "Your total weighting must be 100% "]);
                        }
                    }
                   
                    }

                    if((urlParams.get('group_id') == 'Group 8' || urlParams.get('group_id') == 'Group 7' || urlParams.get('group_id') == 'Group 5' ) && urlParamsDefault.get('section') == 5){

                        if($('#fc_question_precenate_' + 1).val() == ''){
                        var percentageCheck = ccsZvalidateWeihtageValue('fc_question_precenate_' + 1, "Your total weighting must be 100%",Number($('#totalPercentage').text()), /\w+/);

                        errorStore.push(percentageCheck)
                        }
        
                    }
                    // else{
                        // console.log('com')
                        // console.log(i)
                        // console.log($('#fc_question_precenate_'+i).val());
                        // console.log(pageHeading.includes('Write your social value questions (Optional)'));
                        
                        
                    // }

                }
                errorStore = errorStore.length <= 0 ? emptyQuestionFieldCheckRfp() : errorStore;
                if (errorStore.length === 0) {
                    const classList = document.getElementsByClassName("govuk-hint-error-message");
                    const classLength = classList.length;
                    if (classLength != 0) {
                        return false;
                    } else {
                        document.forms['rfp_multianswer_question_form'].submit();
                    }
                } else { ccsZPresentErrorSummary(errorStore); }
            }
        } else {
           
    
            if ($('#totalPercentage') != null && $('#totalPercentage') != undefined && $('#totalPercentage').length > 0 && Number($('#totalPercentage').text()) < 100) {
                var fieldCheck = ccsZvalidateWithRegex('fc_question_' + i + '_1', "You must enter information here", /\w+/);
                errorStore = emptyQuestionFieldCheckRfp(); 
                if(urlParams.get('agreement_id') == 'RM1043.8' && urlParams.get('id') == 'Criterion 2' && (urlParams.get('group_id') == 'Group 9' || urlParams.get('group_id') == 'Group 5' || urlParams.get('group_id') == 'Group 7' || urlParams.get('group_id') == 'Group 8' || urlParams.get('group_id') == 'Group 6' )  && urlParams.get('section') == 5) {

                let textboxCount =  $('.order_1').filter(function() {return this.value !== '';}).length;
                if($('#fc_question_'+textboxCount+ '_1').val() != '' && $('#fc_question_precenate_' + textboxCount).val() != ''){

                var percentageCheck = ccsZvalidateWeihtageValue('fc_question_precenate_' + textboxCount, "The total weighting is less than 100%",Number($('#totalPercentage').text()), /\w+/);
                errorStore.push(percentageCheck)
                }
                } else{
                     errorStore.push(["There is a problem", "The total weighting is less than 100% "]);
                }
            }
             //Remain Agreement
            if ($('#totalPercentage') != null && $('#totalPercentage') != undefined && $('#totalPercentage').length > 0 && Number($('#totalPercentage').text()) > 100) {
                errorStore = emptyQuestionFieldCheckRfp(); 
                if(urlParams.get('agreement_id') == 'RM1043.8' && urlParams.get('id') == 'Criterion 2' && urlParams.get('group_id') == 'Group 9'  && urlParams.get('section') == 5) {
                    let textboxCount =  $('.order_1').filter(function() {return this.value !== '';}).length;
                    var percentageCheck = ccsZvalidateWeihtageValue('fc_question_precenate_' + textboxCount, "The total weighting is more than 100% ",Number($('#totalPercentage').text()), /\w+/);
                    errorStore.push(percentageCheck)
                    
    
                }
                else{
                     errorStore.push(["There is a problem", "The total weighting is more than 100% "]);
                }

            }
            if(urlParams.get('agreement_id') == 'RM1043.8' && urlParams.get('id') == 'Criterion 2' && weightTotal == 1 && (LOTID_VAR == 1 && (urlParams.get('group_id') == 'Group 6' || urlParams.get('group_id') == 'Group 9')) || (LOTID_VAR == 3 && (urlParams.get('group_id') == 'Group 6' || urlParams.get('group_id') == 'Group 8')) ) {
            if((urlParams.get('group_id') == 'Group 9' || urlParams.get('group_id') == 'Group 6' ) && urlParamsDefault.get('section') == 5 && Number($('#totalPercentage').text()) == 100){
                let textareaVal = $('#fc_question_'+1+ '_1').val();
                let percentageval = $('#fc_question_precenate_'+1).val();
               
                if(percentageval.trim() != '' || percentageval != null || percentageval != undefined){
                    if(percentageval.length != 0 && (textareaVal == '' || textareaVal == null || textareaVal == undefined)){

                        var fieldCheck =  ccsZvalidateWithRegex('fc_question_'+1+ '_1', "You must enter valid question", /\w+/);
                        errorStore.push(fieldCheck)
                   }
                }
                
            }
            } else {
                errorStore = errorStore.length <= 0 ? emptyQuestionFieldCheckRfp() : errorStore;
            }
            if (errorStore.length === 0) {
                const classList = document.getElementsByClassName("govuk-hint-error-message");
                const classLength = classList.length;
                if (classLength != 0) {
                    return false;
                } else {
                    document.forms['rfp_multianswer_question_form'].submit();
                }
            } else { ccsZPresentErrorSummary(errorStore); }
        }
    });

    

});

$('.weightagelimit').on('keypress', function (evt) {
let value = $(this).val();
evt = (evt) ? evt : window.event;
    var charCode = (evt.which) ? evt.which : evt.keyCode;
    if (charCode > 31 && (charCode < 48 || charCode > 57) || value.length >=3) {
        return false;
    }
    return true;
 
 });

 $('.rfp_duration').on('keypress', function (evt) {
    let value = $(this).val();
    evt = (evt) ? evt : window.event;
        var charCode = (evt.which) ? evt.which : evt.keyCode;
        if (charCode > 31 && (charCode < 48 || charCode > 57) || value.length >=3) {
            return false;
        }
        return true;
     
     });
 
 
 $(document.body).on("keyup", ".weightagelimit", function (event) {

    var numero=$(this).val();
     if(parseInt($(this).val())>100){    
        let value = $(this).val().slice(0, $(this).val(). length - 1);
        $(this).val(value)
     }
});


document.addEventListener('DOMContentLoaded', () => {

    const totalInputFields = $('.rfp_weight_vetting_class');
    const inputFieldsLength = totalInputFields.length + 1

    var itemSubText = '';
    var itemText = '';
    var totalResourceAdded = $('#rfp_total_resource');
    var totalResourceAdded2 = $('#rfp_total_resource2');

    var tabLinks = document.querySelectorAll('.rfp-vetting-weighting');

    if (tabLinks != null && tabLinks.length > 0) {

        ccsTabMenuNaviation();
        itemSubText = document.getElementsByClassName('table-item-subtext')[0];;
        itemText = tabLinks[0].getElementsByTagName('a')[0].childNodes[0].data

        if (itemText != null && itemText != '') {

            itemText = itemText.replaceAll(" ", "_");
            resourceItemOnClick(itemText);
        }
        Array.from(tabLinks).forEach(link => {

            link.addEventListener('click', function(e) {
                setTimeout(x => {
                    document.querySelectorAll("#rfp_weight_vetting_IT_Ops_16")[0].style.width = "100px";
                }, 5000)
                let currentTarget = e.currentTarget;
                let clicked_index = $(this).index();

                itemSubText = currentTarget.getElementsByClassName('table-item-subtext')[0];
                itemText = tabLinks[clicked_index].getElementsByTagName('a')[0].childNodes[0].data

                itemText = itemText.replaceAll(" ", "_");
                itemText = itemText.replaceAll(/[\])}[{(]/g, '');

                resourceItemOnClick(itemText);
                // updateTotalResourceAdded();
                return false;
            });
        });


    }

    function resourceItemOnClick(category) {

        const weightVettingId = 'rfp_weight_vetting_' + category + "_"

        for (var a = 1; a < inputFieldsLength; a++) {

            let weightVetting = $(`#${weightVettingId}${a}`);

            weightVetting.on('blur', () => {

                if (weightVetting.val() != undefined && weightVetting.val() !== null && weightVetting.val() !== "") {
                    updateWeightVetting(weightVettingId);
                    updateTotalResource();
                } else {
                    updateWeightVetting(weightVettingId);
                    updateTotalResource();
                }

            });
        }
    }

    function updateWeightVetting(weightVettingId) {
        let value = 0;
        for (var a = 1; a < inputFieldsLength; a++) {

            let weightVetting = $(`#${weightVettingId}${a}`);
            if (weightVetting.val() != undefined && weightVetting.val() != '')
                value = value + Number(weightVetting.val());

        }
        itemSubText.innerHTML = value + ' resources added';
    }

    function updateTotalResource() {
        let resourceCount = 0
        for (index = 0; index < totalInputFields.length; ++index) {
            if (totalInputFields[index].value != "")
                resourceCount = resourceCount + Number(totalInputFields[index].value);
        }
        totalResourceAdded.text(resourceCount);
        totalResourceAdded2.text(resourceCount);
    }

    totalInputFields.on('keydown', (event) => {
        if (event.key === '.' || event.keyCode === 69)
            event.preventDefault();
    });

    // function updateTotalResourceAdded() {

    //     let resourceCount = 0;
    //     for (let index = 0; index < tabLinks.length; index++) {

    //         let subText = tabLinks[index].getElementsByTagName('div')[0].childNodes[0].data;
    //         var numbr = subText.match(/\d/g);

    //         if(numbr !=null)
    //         {
    //             numbr = numbr.join("");
    //             resourceCount = resourceCount + Number(numbr);
    //         }

    //     }
    //     totalResourceAdded.text(resourceCount);
    //     totalResourceAdded2.text(resourceCount);

    // }


    $('#ccs_ca_menu_tabs_form_rfp_vetting').on('submit', (e) => {


        const preventDefaultState = [];
        const inputtedtext = [];
        const decimalnumber = [];
        const nonnumerical = [];

        for (var a = 1; a < totalInputFields.length; a++) {
            const classTarget = document.getElementsByClassName("rfp_weight_vetting_class")[a - 1];
            if (classTarget.value != '') {
                inputtedtext.push(true)
            }
            if (classTarget.value.includes('.')) {
                document.getElementsByClassName("weight_vetting_class")[a - 1].classList.add('govuk-input--error')
                document.getElementsByClassName("weight_vetting_class_error")[a - 1].innerHTML = 'Decimal value is entered. Please enter number <100 and >0 ';

                decimalnumber.push(true)
            } else if (isNaN(classTarget.value) && classTarget.value !== '') {
                document.getElementsByClassName("weight_vetting_class")[a - 1].classList.add('govuk-input--error')
                document.getElementsByClassName("weight_vetting_class_error")[a - 1].innerHTML = 'Alphabetical value is entered. Please enter number <100 and >0';
                nonnumerical.push(true);
            } else if (classTarget.value > 99 && classTarget.value != '') {
                document.getElementsByClassName("weight_vetting_class")[a - 1].classList.add('govuk-input--error')
                document.getElementsByClassName("weight_vetting_class_error")[a - 1].innerHTML = 'Please enter number <100 and >0';
                preventDefaultState.push(true);
            } else if (classTarget.value <= 0 && classTarget.value !== '') {
                document.getElementsByClassName("weight_vetting_class")[a - 1].classList.add('govuk-input--error')
                document.getElementsByClassName("weight_vetting_class_error")[a - 1].innerHTML = 'Please enter number <100 and >0';
                preventDefaultState.push(true);
            } else {
                document.getElementsByClassName("weight_vetting_class")[a - 1].classList.remove('govuk-input--error')
                document.getElementsByClassName("weight_vetting_class_error")[a - 1].innerHTML = '';
                // $(`#rfp_weight_vetting_${a}`).removeClass('govuk-input--error');
            }
        }
        /**
         *  
         */

        switch (true) {
            case (preventDefaultState.length > 0 && decimalnumber.length > 0 && nonnumerical.length > 0):

                e.preventDefault();
                $('#rfp_vetting_error_summary').removeClass('hide-block');
                $('.govuk-error-summary__title').text('There is a problem');
                $("#summary_list").html('<li><a href="#">The input field must be a number less than 100 and greater than 0</a></li><br><li><a href="#">The input field should not contain decimal values</a></li><br><li><a href="#">The input field must be a number</a></li>');
                $('html, body').animate({ scrollTop: 0 }, 'fast');
                break;
            case (preventDefaultState.length > 0 && decimalnumber.length > 0):

                e.preventDefault();
                $('#rfp_vetting_error_summary').removeClass('hide-block');
                $('.govuk-error-summary__title').text('There is a problem');
                $("#summary_list").html('<li><a href="#">The input field must be a number less than 100 and greater than 0</a></li><br><li><a href="#">The input field should not contain decimal values</a></li>');
                $('html, body').animate({ scrollTop: 0 }, 'fast');
                break;
            case (preventDefaultState.length > 0 && nonnumerical.length > 0):

                e.preventDefault();
                $('#rfp_vetting_error_summary').removeClass('hide-block');
                $('.govuk-error-summary__title').text('There is a problem');
                $("#summary_list").html('<li><a href="#">The input field must be a number less than 100 and greater than 0</a></li><br><li><a href="#">The input field must be a number</a></li>');
                $('html, body').animate({ scrollTop: 0 }, 'fast');
                break;
            case (decimalnumber.length > 0 && nonnumerical.length > 0):

                e.preventDefault();
                $('#rfp_vetting_error_summary').removeClass('hide-block');
                $('.govuk-error-summary__title').text('There is a problem');
                $("#summary_list").html('<li><a href="#">The input field should not contain decimal values</a></li><br><li><a href="#">The input field must be a number</a></li>');
                $('html, body').animate({ scrollTop: 0 }, 'fast');
                break;
            case (preventDefaultState.length > 0):

                e.preventDefault();
                $('#rfp_vetting_error_summary').removeClass('hide-block');
                $('.govuk-error-summary__title').text('There is a problem');
                $("#summary_list").html('<li><a href="#">The input field must be a number less than 100 and greater than 0</a></li>');
                $('html, body').animate({ scrollTop: 0 }, 'fast');
                break;
            case (nonnumerical.length > 0):

                e.preventDefault();
                $('#rfp_vetting_error_summary').removeClass('hide-block');
                $('.govuk-error-summary__title').text('There is a problem');
                $("#summary_list").html('<li><a href="#">The input field must be a number</a></li>');
                $('html, body').animate({ scrollTop: 0 }, 'fast');
                break;
            case (decimalnumber.length > 0):

                e.preventDefault();
                $('#rfp_vetting_error_summary').removeClass('hide-block');
                $('.govuk-error-summary__title').text('There is a problem');
                $("#summary_list").html('<li><a href="#">The input field should not contain decimal values</a></li>');
                $('html, body').animate({ scrollTop: 0 }, 'fast');
                break;
            default:
                console.log("If all else fails");
                break;
        }

        if (!inputtedtext.length > 0) {

            e.preventDefault();
            $('#rfp_vetting_error_summary').removeClass('hide-block');
            $('.govuk-error-summary__title').text('There is a problem');
            $("#summary_list").html('You must enter atleast on value');
            $('html, body').animate({ scrollTop: 0 }, 'fast');
        }

    });

});
document.addEventListener('DOMContentLoaded', () => {
  $(".check-popup").on('click', function(){
    console.log("Workied******");
    // openpop.classList.remove('showpopup');
    const openpopsupplier = document.querySelector('.backdrop-supplier-popup')
        openpopsupplier.classList.add('showpopup');
        $(".dialog-close-supplier").on('click', function(){
          openpopsupplier.classList.remove('showpopup');
        });
        stnewsupplier = document.getElementById('redirect-button-supplier');
        stnewsupplier.addEventListener('click', ev => {
          openpopsupplier.classList.remove('showpopup');
          console.log("Workied confirm******");
        })
  });

  if (document.getElementById('ccs_rfp_scoring_criteria') !== null) {
    let noOfCountfieldNotNull = [], with_value_count = 10,
      prev_input = 0,

      deleteButtons = document.querySelectorAll('a.del').length > 0 ? document.querySelectorAll('a.del') : document.querySelectorAll('a.clear-fields');
    selectTierButtons = document.querySelectorAll('.tier-popup');
    let tierDataList = document.querySelectorAll('.tierLable');
    document.getElementById('ccs_rfp_score_criteria_add').classList.remove('ccs-dynaform-hidden');

    const points_for_this_level = document.querySelectorAll(".govuk-input--width-3");
    const allinput = document.querySelectorAll(".govuk-input");
    const alltextarea = document.querySelectorAll(".govuk-textarea");

    allinput.forEach(element => {
      element.addEventListener("focusout", (event) => {
        if (event.target.value != undefined && event.target.value !== '') {
          removeErrorFieldsRfpScore();
        }
      })
    })

    alltextarea.forEach(element => {
      element.addEventListener("focusout", (event) => {
        if (event.target.value != undefined && event.target.value !== '') {
          removeErrorFieldsRfpScore();
        }
      })
    })
    document.getElementById('tiersAdded').textContent = '0';
    //GET DATA FROM OWN TIER
    let rowsAndHead = {}
    tierDataList.forEach(e => {
      if (e.attributes != undefined && e.attributes[2] != undefined && e.attributes[2].textContent != undefined && e.attributes != null && e.attributes[2] != null && e.attributes[2].textContent != null) {
        if (e.attributes[2].textContent.toLowerCase() === 'Create your own scoring criteria'.toLowerCase()) {
          if (e.attributes != undefined && e.attributes[4] != undefined && e.attributes != null && e.attributes[4] != null) {
            rowsAndHead = e.attributes[4].value != null ? JSON.parse(e.attributes[4].value) : null;
          }
        }
      }
    })

    //fill data on page reaload
    let activateField9thAreFilledReload = false;
    for (var score_criteria_fieldset = 1; score_criteria_fieldset < 11; score_criteria_fieldset++) {
      if (rowsAndHead != null && rowsAndHead != undefined && rowsAndHead.rows != undefined && rowsAndHead.rows != null) {
        if (score_criteria_fieldset == 1) {
          rowsAndHead.rows.unshift([{ text: 'ignore' }]);
        }

        if (rowsAndHead.rows[score_criteria_fieldset] != null && rowsAndHead.rows[score_criteria_fieldset] != undefined) {
          document.getElementById('rfp_score_criteria_name_' + score_criteria_fieldset).value = rowsAndHead != undefined && rowsAndHead != null && rowsAndHead.rows[score_criteria_fieldset].at(0).text != undefined ? rowsAndHead.rows[score_criteria_fieldset].at(0).text : '';
          document.getElementById('rfp_score_criteria_point_' + score_criteria_fieldset).value = rowsAndHead != undefined && rowsAndHead != null && rowsAndHead.rows[score_criteria_fieldset].at(1).text != undefined ? rowsAndHead.rows[score_criteria_fieldset].at(1).text : '';
          document.getElementById('rfp_score_criteria_desc_' + score_criteria_fieldset).value = rowsAndHead != undefined && rowsAndHead != null && rowsAndHead.rows[score_criteria_fieldset].at(2).text != undefined ? rowsAndHead.rows[score_criteria_fieldset].at(2).text : '';
        }
      }

      let this_fieldset = document.querySelector('.score_criteria_' + (score_criteria_fieldset === 0 ? 1 : score_criteria_fieldset)),
        name_box = document.getElementById('rfp_score_criteria_name_' + (score_criteria_fieldset === 0 ? 1 : score_criteria_fieldset));

      if (name_box.value !== '' && name_box.value !== undefined && name_box.value !== null) {
        this_fieldset.classList.remove('ccs-dynaform-hidden');
        if (score_criteria_fieldset === 10) {
          document.getElementById('ccs_rfp_score_criteria_add').classList.add('ccs-dynaform-hidden');
        }
        if (score_criteria_fieldset === 9) {
          activateField9thAreFilledReload = true;
        }
        document.getElementById('tiersAdded').textContent = score_criteria_fieldset;
      } else if (score_criteria_fieldset !== 1) {
        if (this_fieldset != null && this_fieldset != undefined) {
          this_fieldset.classList.add('ccs-dynaform-hidden');
        }
        with_value_count = score_criteria_fieldset;
      }
      else if (score_criteria_fieldset === 10 && activateField9thAreFilledReload) {
        document.getElementById('ccs_rfp_score_criteria_add').classList.add('ccs-dynaform-hidden');
      } else {
        document.getElementById('ccs_rfp_score_criteria_add').classList.remove('ccs-dynaform-hidden');
      }

    }
    //document.getElementById('ccs_rfp_score_criteria_add').classList.remove('ccs-dynaform-hidden');
    selectTierButtons.forEach(st => {
      st.addEventListener('click', e => {
        const rowsAndHead = JSON.parse(e.currentTarget.attributes[2].value);
        let count = 0;

        const openpop = document.querySelector('.backdrop-tier') 
        openpop.classList.add('showpopup');
        
        $(".dialog-close-tier").on('click', function(){
          openpop.classList.remove('showpopup');
        });
        stnew = document.getElementById('redirect-button-tier');
        stnew.addEventListener('click', ev => {
          openpop.classList.remove('showpopup');
          removeErrorFieldsRfpScore();
        for (var score_criteria_fieldset = 1; score_criteria_fieldset < 11; score_criteria_fieldset++) {
          document.getElementById('rfp_score_criteria_name_' + score_criteria_fieldset).value = '';
          document.getElementById('rfp_score_criteria_point_' + score_criteria_fieldset).value = '';
          document.getElementById('rfp_score_criteria_desc_' + score_criteria_fieldset).value = '';
          var elements = document.getElementsByClassName("score_criteria_" + score_criteria_fieldset);
          // elements.classList.removeClass("ccs-dynaform-hidden");
          //while (elements.length)
          elements[0].classList.add("ccs-dynaform-hidden");
        }

        if (rowsAndHead != undefined && rowsAndHead != null) {
          document.getElementById('tiersAdded').textContent = rowsAndHead.rows.length;
          with_value_count = rowsAndHead.rows.length + 1;
          rowsAndHead.rows.unshift({ text: "Ignore" })

          if(document.getElementById('agreement_id') && document.getElementById('agreement_id').value == 'RM1043.8'){ 
            rowsAndHead.rows.reverse();
              for (let i = 0; i < rowsAndHead.rows.length; i++) {
              if (i !== 4) {
               const ii = i + 1;
               var elements = document.getElementsByClassName("score_criteria_" + ii);
                elements[0].classList.remove("ccs-dynaform-hidden");
                document.getElementById("rfp_score_criteria_name_" + ii).value = rowsAndHead.rows[i].at(0).text;
                document.getElementById("rfp_score_criteria_point_" + ii).value = rowsAndHead.rows[i].at(1).text;
                document.getElementById("rfp_score_criteria_desc_" + ii).value = rowsAndHead.rows[i].at(2).text;
                document.getElementById("rfp_score_criteria_desc_" + ii).focus();
                document.getElementById("rfp_score_criteria_name_" + ii).focus();
              }
              if (rowsAndHead.rows.length == 11 && $('#ccs_rfp_score_criteria_add').hasClass('ccs-dynaform-hidden')) {
                document.getElementById('ccs_rfp_score_criteria_add').classList.add('ccs-dynaform-hidden');
              } else {
                document.getElementById('ccs_rfp_score_criteria_add').classList.remove('ccs-dynaform-hidden');
              }
            }
          }else{
            for (let i = 0; i < rowsAndHead.rows.length; i++) {
              if (i !== 0) {
                //const ii = i + 1;
                var elements = document.getElementsByClassName("score_criteria_" + i);
                // elements.classList.removeClass("ccs-dynaform-hidden");
                //while (elements.length)
                elements[0].classList.remove("ccs-dynaform-hidden");
                // if (rowsAndHead.rows.length == i) {
                //   //$("#deleteButton_" + ii).removeClass("ccs-dynaform-hidden");
                //   //$("#ccs_rfp_score_criteria_add").addClass("ccs-dynaform-hidden");
                // }
                // else {
                //   //$("#deleteButton_" + ii).addClass("ccs-dynaform-hidden");
                // }
  
                document.getElementById("rfp_score_criteria_name_" + i).value = rowsAndHead.rows[i].at(0).text;
                document.getElementById("rfp_score_criteria_point_" + i).value = rowsAndHead.rows[i].at(1).text;
                document.getElementById("rfp_score_criteria_desc_" + i).value = rowsAndHead.rows[i].at(2).text;
  
                // $("#rfp_score_criteria_name_" + ii).prop('readonly', true);
                // $("#rfp_score_criteria_point_" + ii).prop('readonly', true);
                // $("#rfp_score_criteria_desc_" + ii).prop('readonly', true);
                document.getElementById("rfp_score_criteria_name_" + i).focus();
                document.getElementById("rfp_score_criteria_desc_" + i).focus();
  
              }
              if (rowsAndHead.rows.length == 11 && $('#ccs_rfp_score_criteria_add').hasClass('ccs-dynaform-hidden')) {
                document.getElementById('ccs_rfp_score_criteria_add').classList.add('ccs-dynaform-hidden');
              } else {
                document.getElementById('ccs_rfp_score_criteria_add').classList.remove('ccs-dynaform-hidden');
              }
            }
          }

        
        }
        })
        })
                       
       
        

        
      // })
    })

    document.getElementById('ccs_rfp_score_criteria_add').addEventListener('click', e => {
      $('.govuk-form-group textarea').removeClass('govuk-textarea--error');
      checkFieldsRfpScore();
      removeErrorFieldsRfpScore();
      e.preventDefault();
      errorStore = emptyFieldCheckRfpScore();
      // if (with_value_count === 11) {
      //   let errlist = [];
      //   errlist.push(["There is a problem", 'You must add min maximum 10 tiers.'])
      //   ccsZPresentErrorSummary(errlist);
      //   return;
      // }
      let activateField = 1;
      let activateField9thAreFilled = false;
      if (errorStore.length == 0) {
        for (var score_criteria_fieldset = 1; score_criteria_fieldset < 11; score_criteria_fieldset++) {
          let this_fieldset = document.querySelector('.score_criteria_' + (score_criteria_fieldset === 0 ? 1 : score_criteria_fieldset)),
            name_box = document.getElementById('rfp_score_criteria_name_' + (score_criteria_fieldset === 0 ? 1 : score_criteria_fieldset));

          if (name_box.value !== '' && name_box.value !== undefined && name_box.value !== null) {
            //if (score_criteria_fieldset !== 1) {
            activateField += 1;
            document.getElementById('tiersAdded').textContent = score_criteria_fieldset;
            //}
            this_fieldset.classList.remove('ccs-dynaform-hidden');
            if (score_criteria_fieldset === 9) {
              activateField9thAreFilled = true;
            }
            if (score_criteria_fieldset === 10) {
              document.getElementById('ccs_rfp_score_criteria_add').classList.add('ccs-dynaform-hidden');
              errorStore.push(["There is a problem", 'You must add min maximum 10 tiers.']);
            }
          }
          if (score_criteria_fieldset === 10 && activateField9thAreFilled) {
            document.getElementById('ccs_rfp_score_criteria_add').classList.add('ccs-dynaform-hidden');
          }
        }
        if ($(".score_criteria_" + Number(activateField)).length > 0 && $(".score_criteria_" + Number(activateField)).hasClass("ccs-dynaform-hidden")) {
          document.querySelector('.score_criteria_' + Number(activateField)).classList.remove('ccs-dynaform-hidden');
          document.getElementById('tiersAdded').textContent = activateField;
        }
        if (errorStore.length > 0) {
          ccsZPresentErrorSummary(errorStore);
        }
      } else ccsZPresentErrorSummary(errorStore);
    });

    // delete buttons
    deleteButtons.forEach(db => {
      db.classList.remove('ccs-dynaform-hidden');
      db.addEventListener('click', e => {
        e.preventDefault();
        let totalAddedTierSoFar = Number(document.getElementById('tiersAdded').textContent)
        let target = db.href.replace(/^(.+\/)(\d{1,2})$/, '$2'),
          prev_coll = Number(target) - 1,
          desc_fieldset = db.closest('fieldset');

        desc_fieldset.classList.add('ccs-dynaform-hidden');

        document.getElementById('rfp_score_criteria_name_' + target).value = '';
        document.getElementById('rfp_score_criteria_point_' + target).value = '';
        document.getElementById('rfp_score_criteria_desc_' + target).value = '';

        document.getElementById('rfp_score_criteria_name_' + target).removeAttribute('readonly');
        document.getElementById('rfp_score_criteria_point_' + target).removeAttribute('readonly');
        document.getElementById('rfp_score_criteria_desc_' + target).removeAttribute('readonly');
        //RESET ALL TIER DATA AFTER DELETED ANY DATA
        let resetTierData = [];
        for (var score_criteria_fieldset = 1; score_criteria_fieldset < 11; score_criteria_fieldset++) {
          let name = document.getElementById('rfp_score_criteria_name_' + score_criteria_fieldset).value;
          let point = document.getElementById('rfp_score_criteria_point_' + score_criteria_fieldset).value;
          let desc = document.getElementById('rfp_score_criteria_desc_' + score_criteria_fieldset).value;
          if (name != undefined && name != null && name != '' && point != undefined && point != null && point != '' && desc != undefined && desc != null && point != '') {
            resetTierData.push({ name: name, point: point, desc: desc });
          }
          document.getElementById('rfp_score_criteria_name_' + score_criteria_fieldset).value = '';
          document.getElementById('rfp_score_criteria_point_' + score_criteria_fieldset).value = '';
          document.getElementById('rfp_score_criteria_desc_' + score_criteria_fieldset).value = '';

          let this_fieldset = document.querySelector('.score_criteria_' + (score_criteria_fieldset === 0 ? 1 : score_criteria_fieldset));

          if (this_fieldset != null && this_fieldset != undefined) {
            this_fieldset.classList.add('ccs-dynaform-hidden');
          }
        }

        for (var score_criteria_fieldset = 1; score_criteria_fieldset < 11; score_criteria_fieldset++) {
          if (score_criteria_fieldset == 1) {
            document.getElementById('rfp_score_criteria_name_' + 1).value = resetTierData[0] != undefined && resetTierData[0].name != undefined ? resetTierData[0].name : '';
            document.getElementById('rfp_score_criteria_point_' + 1).value = resetTierData[0] != undefined && resetTierData[0].point != undefined ? resetTierData[0].point : '';
            document.getElementById('rfp_score_criteria_desc_' + 1).value = resetTierData[0] != undefined && resetTierData[0].desc != undefined ? resetTierData[0].desc : '';
          } else {
            document.getElementById('rfp_score_criteria_name_' + score_criteria_fieldset).value = resetTierData[score_criteria_fieldset - 1] != undefined && resetTierData[score_criteria_fieldset - 1].name != undefined ? resetTierData[score_criteria_fieldset - 1].name : '';
            document.getElementById('rfp_score_criteria_point_' + score_criteria_fieldset).value = resetTierData[score_criteria_fieldset - 1] != undefined && resetTierData[score_criteria_fieldset - 1].point != undefined ? resetTierData[score_criteria_fieldset - 1].point : '';
            document.getElementById('rfp_score_criteria_desc_' + score_criteria_fieldset).value = resetTierData[score_criteria_fieldset - 1] != undefined && resetTierData[score_criteria_fieldset - 1].desc != undefined ? resetTierData[score_criteria_fieldset - 1].desc : '';
          }

          let this_fieldset = document.querySelector('.score_criteria_' + (score_criteria_fieldset === 0 ? 1 : score_criteria_fieldset)),
            name_box = document.getElementById('rfp_score_criteria_name_' + (score_criteria_fieldset === 0 ? 1 : score_criteria_fieldset));

          if (name_box.value !== '' && name_box.value !== undefined && name_box.value !== null) {
            this_fieldset.classList.remove('ccs-dynaform-hidden');
            if (score_criteria_fieldset === 10) {
              document.getElementById('ccs_rfp_score_criteria_add').classList.add('ccs-dynaform-hidden');
            }
            document.getElementById('tiersAdded').textContent = score_criteria_fieldset;
          } else if (score_criteria_fieldset !== 0) {
            if (this_fieldset != null && this_fieldset != undefined) {
              this_fieldset.classList.add('ccs-dynaform-hidden');
            }
            with_value_count = score_criteria_fieldset;
          }
          if (score_criteria_fieldset === 1) {
            if (this_fieldset != null && this_fieldset != undefined) {
              this_fieldset.classList.remove('ccs-dynaform-hidden');
            }
            with_value_count = 1;
          }
        }
        document.getElementById('ccs_rfp_score_criteria_add').classList.remove('ccs-dynaform-hidden');
        with_value_count--;
        if (totalAddedTierSoFar === 0) {
          document.getElementById('tiersAdded').textContent = 0;
        }
        if (totalAddedTierSoFar === 1) {
          document.getElementById('tiersAdded').textContent = 1;
        }
        if (totalAddedTierSoFar > 0) {
          document.getElementById('tiersAdded').textContent = totalAddedTierSoFar - 1;
        }
      });
    });
    points_for_this_level.forEach(element => {
      element.addEventListener("keydown", (event) => {
        if (event.key === '.' || event.keyCode === 69) { event.preventDefault(); }
      })
    })
    if (document.getElementsByClassName('score_criteria_fieldset').length > 0) {
      let fieldSets = document.getElementsByClassName('score_criteria_fieldset');
      let length = fieldSets.length;
      while (length--) {
        let id = length + 1;
        let eleName = fieldSets[length].querySelector('#rfp_score_criteria_name_' + id);
        eleName.addEventListener('focusout', event => {
          let ele1 = event.target;
          let elePointId = 'rfp_score_criteria_point_' + id;
          let eleDescId = 'rfp_score_criteria_desc_' + id;
          let ele2 = document.getElementById(elePointId);
          let ele3 = document.getElementById(eleDescId);
          //performSubmitAction(ele1, ele2, ele3);
        });
        let elePoint = fieldSets[length].querySelector('#rfp_score_criteria_point_' + id);
        elePoint.addEventListener('focusout', event => {
          let ele2 = event.target;
          let eleNameId = 'rfp_score_criteria_name_' + id;
          let eleDescId = 'rfp_score_criteria_desc_' + id;
          let ele1 = document.getElementById(eleNameId);
          let ele3 = document.getElementById(eleDescId);
          //performSubmitAction(ele1, ele2, ele3);
        });
        let eleDesc = fieldSets[length].querySelector('#rfp_score_criteria_desc_' + id);
        eleDesc.addEventListener('focusout', event => {
          let ele3 = event.target;
          let eleNameId = 'rfp_score_criteria_name_' + id;
          let elePointId = 'rfp_score_criteria_point_' + id;
          let ele1 = document.getElementById(eleNameId);
          let ele2 = document.getElementById(elePointId);
          //performSubmitAction(ele1, ele2, ele3);
        });
        var performSubmitAction = function (ele1, ele2, ele3) {
          if (ele1.value !== '' && ele2.value !== '' && ele3.value !== '') {
            let formElement = document.getElementById('ccs_rfp_scoring_criteria');
            let action = formElement.getAttribute('action');
            action = action + '&stop_page_navigate=true';
            $.ajax({
              type: 'POST',
              url: action,
              data: $('#ccs_rfp_scoring_criteria').serialize(),
              success: function () {
                //success message mybe...
              },
            });
          }
        };
        // break;
      }
    }
  }
  
  DelGCButtons = document.querySelectorAll('.DelGCButtons-popup');
  DelGCButtons.forEach(st => {
    st.addEventListener('click', e => {
      e.preventDefault();
      // deletePost(e.target.getAttribute('data-link'));
      urldel = e.target.getAttribute('data-link');
      //Gcloude
      const openpopGC = document.querySelector('.backdrop-gcloud_delete')
      openpopGC.classList.add('showpopup');
      $(".dialog-close-gcloud_delete").on('click', function(){
        openpopGC.classList.remove('showpopup');
      });
      $(".close-dialog-close").on('click', function(){
        openpopGC.classList.remove('showpopup');
      });
      deconf = document.getElementById('redirect-button-gcloud_delete');
      deconf.addEventListener('click', ev => {
        openpopGC.classList.remove('showpopup');
        window.location.href = window.location.origin+urldel;
      });
    });
  });

});



function preventNumberInput(e){
  var keyCode = (e.keyCode ? e.keyCode : e.which);
  if (keyCode > 47 && keyCode < 58 || keyCode > 95 && keyCode < 107 ){
      e.preventDefault();
  }
}


  // $('.maxValueValidate').keypress(function(e) {
  //     preventNumberInput(e);
  // });

// $(".maxValueValidate").keyup(function(e) {
//   let maxLen = parseInt($(this).val());
//   console.log("maxLen",maxLen);
// if(maxLen > 100){
//   $(this).val('')
// }else{
// }
// });

$(".maxValueValidate").keyup(function(e) {
  let maxLen = $(this).val();
  if(maxLen.length > 2 || parseInt($(this).val()) > 100 ){
    let inputVal = $(this).val();
    $(this).val(inputVal.slice(0,2));
  }
});









const checkFieldsRfpScore = () => {
  const start = 1;
  const end = 10;

  for (var a = start; a <= end; a++) {
    let inputName = $(`#rfp_score_criteria_name_${a}`);
    let inputPoint = $(`#rfp_score_criteria_point_${a}`);
    let textbox = $(`#rfp_score_criteria_desc_${a}`);

    if (inputName.val() !== '') {
      $(`#rfp_score_criteria_name_${a}-error`).remove();
      $(`score_criteria_${a} div`).removeClass('govuk-form-group--error');
      $(`score_criteria_${a} input`).removeClass('govuk-input--error');
    }
    if (inputPoint.val() !== '') {
      $(`#rfp_score_criteria_point_${a}-error`).remove();
      $(`score_criteria_${a} div`).removeClass('govuk-form-group--error');
      $(`score_criteria_${a} input`).removeClass('govuk-input--error');
    }
    if (textbox.val() !== '') {
      $(`#rfp_score_criteria_desc_${a}-error`).remove();
      $(`score_criteria_${a} div`).removeClass('govuk-form-group--error');
      $(`score_criteria_${a} textarea`).removeClass('govuk-textarea--error');
    }
  }
};
const removeErrorFieldsRfpScore = () => {
  $('.govuk-error-message').remove();
  $('.govuk-form-group--error').removeClass('govuk-form-group--error');
  $('.govuk-error-summary').remove();
  $('.govuk-input').removeClass('govuk-input--error');
  $('.govuk-form-group textarea').removeClass('govuk-textarea--error');
};

const emptyFieldCheckRfpScore = () => {
  let fieldCheck = '',
    errorStore = [];
    let agreement_id = document.getElementById('agreement_id');
        
  removeErrorFieldsRfpScore();
  for (var x = 1; x < 11; x++) {
    let name_field = document.getElementById('rfp_score_criteria_name_' + x);
    let point_field = document.getElementById('rfp_score_criteria_point_' + x);
    let desc_field = document.getElementById('rfp_score_criteria_desc_' + x);

    if (name_field != undefined && name_field != null && name_field.closest('fieldset').classList.value.indexOf('ccs-dynaform-hidden') === -1) {
      checkFieldsRfpScore();
      if (name_field.value.trim() === '' && point_field.value.trim() === '' && desc_field.value.trim() === '' && agreement_id.value.trim() != 'RM6187' ) {

        let focusField; 
        if (name_field.value.trim() === '') {
          focusField = name_field;
        }else if(point_field.value.trim() === '') {
          focusField = point_field;
        }else if (desc_field.value.trim() === '') {
          focusField = desc_field;
        }

        fieldCheck = [focusField.id, 'You must add information in all fields.'];
        ccsZaddErrorMessage(name_field, 'You must add information in all fields.');
        ccsZaddErrorMessage(point_field, 'Enter a valid number.');
        ccsZaddErrorMessage(desc_field, 'You must add information in all fields.');
        errorStore.push(fieldCheck);
      } 
      else if(agreement_id.value.trim() == 'RM6187' && name_field.value.trim() === '' && point_field.value.trim() === '' && desc_field.value.trim() === '') {
        fieldCheck = [point_field.id, 'You must add information in all fields.'];
        ccsZaddErrorMessage(name_field, 'You must enter the name for this level.');
        ccsZaddErrorMessage(point_field, 'You must enter the score for this level.');
        ccsZaddErrorMessage(desc_field, 'You must enter the description for this level.');
        errorStore.push(fieldCheck);
      }
      else if (agreement_id.value.trim() == 'RM1043.8' && point_field.value.trim() >= 100){
        let errorObj = {
          field: point_field,
          isError: false,
        };
        fieldCheck = [point_field.id, 'Enter valid score.'];
        ccsZaddErrorMessage(point_field, 'Enter valid score.');
        errorObj.isError = true;
        errorObj.field = point_field;
        if (errorObj.isError) {
          fieldCheck = [errorObj.field.id, 'Enter valid score.'];
          errorStore.push(fieldCheck);
        }
      }else {
        let errorObj = {
          field: name_field,
          isError: false
        };
        if (name_field.value.trim() === '' && agreement_id.value.trim() == 'RM6187') {
          ccsZaddErrorMessage(name_field, 'You must enter the name for this level.');
          errorObj.isError = true;
          errorObj.field = name_field;
        }
        if (point_field.value.trim() === '' && agreement_id.value.trim() == 'RM6187') {
          ccsZaddErrorMessage(point_field, 'You must enter the score for this level.');
          errorObj.isError = true;
          errorObj.field = point_field;
        }
        if (point_field.value.trim() < 0 && agreement_id.value.trim() == 'RM6187') {
          ccsZaddErrorMessage(point_field, 'Enter a valid score');
          errorObj.isError = true;
          errorObj.field = point_field;
        }
        if (desc_field.value.trim() === '' && agreement_id.value.trim() == 'RM6187') {
          ccsZaddErrorMessage(desc_field, 'You must enter the description for this level.');
          errorObj.isError = true;
          errorObj.field = desc_field;
        }

        if (name_field.value.trim() === '' && agreement_id.value.trim() != 'RM6187' ) {
          ccsZaddErrorMessage(name_field,'you must add name for this level.');
          errorObj.isError = true;
          errorObj.field = name_field;
        }
        if (point_field.value.trim() === '' && agreement_id.value.trim() != 'RM6187') {
          ccsZaddErrorMessage(point_field, 'Enter a valid number');
          errorObj.isError = true;
          errorObj.field = point_field;
        }
        
        if(agreement_id.value.trim() == 'RM1043.8' && (point_field.value.trim().length > 2 || point_field.value.trim() < 0 || point_field.value.trim() > 10 )){
            ccsZaddErrorMessage(point_field,'Enter valid score.');
            errorObj.isError = true;
            errorObj.field = point_field;
        }
        
        if (desc_field.value.trim() === '' && agreement_id.value.trim() != 'RM6187') {
          ccsZaddErrorMessage(desc_field,'you must add description for this level');
          errorObj.isError = true;
          errorObj.field = desc_field;
        }
        if(agreement_id.value.trim() == 'RM6187'){
          if (errorObj.isError) {
            fieldCheck = [errorObj.field.id, 'You must add information in all fields.'];
            errorStore.push(fieldCheck);
          }
        }
       if(agreement_id.value.trim() != 'RM6187'){
        let errMsg = '';
        if (name_field.value.trim() === '') {
          errorObj.field = name_field;
          errMsg = 'you must add name for this level.';
        }else if(point_field.value.trim() === '') {
          errorObj.field = point_field;
          errMsg = 'you must add score for this level';
        }else if(agreement_id.value.trim() == 'RM1043.8' && (point_field.value.trim().length > 2 || point_field.value.trim() < 0 || point_field.value.trim() > 10 )){
          errorObj.field = point_field;
          errMsg = 'Enter valid score.';
        }else if (desc_field.value.trim() === '') {
          errorObj.field = desc_field;
          errMsg = 'you must add description for this level';
        }

        if (errorObj.isError) {
          fieldCheck = [errorObj.field.id, errMsg == ''?'You must add information in all fields.':errMsg];
          errorStore.push(fieldCheck);
        }
       }
        
      }
    }
  }
  return errorStore;
};
const ccsZvalidateScoringCriteria = event => {
  event.preventDefault();
  errorStore = [];
  errorStore = emptyFieldCheckRfpScore();
  let tierVal = document.getElementById("tiersAdded").textContent;

  if (errorStore.length === 0 && tierVal.match(/(\d+)/)[0] >= 2) {
    document.forms['ccs_rfp_scoring_criteria'].submit();
  }
  else if (tierVal.match(/(\d+)/)[0] < 2) {
    errorStore.push(["There is a problem", 'You must add minmum 2 tiers.'])
    ccsZPresentErrorSummary(errorStore);
  }
  else if (tierVal.match(/(\d+)/)[0] > 10) {
    errorStore.push(["There is a problem", 'You must add maximum 10 tiers.'])
    ccsZPresentErrorSummary(errorStore);
  }
  else {
    ccsZPresentErrorSummary(errorStore);
  }
};


// user 


const checkFieldsRfpScore2 = () => {
  const start = 1;
  const end = 10;

  for (var a = start; a <= end; a++) {
    let inputName = $(`#rfp_term_service_group_${a}`);
    let textbox = $(`#rfp_term_more_details_${a}`);

    if (inputName.val() !== '') {
      $(`#rfp_term_service_group_${a}-error`).remove();
      $(`acronym_service_${a} div`).removeClass('govuk-form-group--error');
      $(`acronym_service_${a} input`).removeClass('govuk-input--error');
    }
    if (textbox.val() !== '') {
      $(`#rfp_term_more_details_${a}-error`).remove();
      $(`acronym_service_${a} div`).removeClass('govuk-form-group--error');
      $(`acronym_service_${a} textarea`).removeClass('govuk-textarea--error');
    }
  }
};

const removeErrorFieldsRfpScore2 = () => {
  $('.govuk-error-message').remove();
  $('.govuk-form-group--error').removeClass('govuk-form-group--error');
  $('.govuk-error-summary').remove();
  $('.govuk-input').removeClass('govuk-input--error');
  $('.govuk-form-group textarea').removeClass('govuk-textarea--error');
};

const emptyFieldCheckRfpScore2 = () => {
  let fieldCheck = '',
  fieldCheck1 = '',
    errorStore = [];
  removeErrorFieldsRfpScore2();
  var urlParams = new URLSearchParams(window.location.search);
  var agreement_id = urlParams.get("agreement_id");
  var group_id = urlParams.get("group_id");
  var criterion = urlParams.get("id"); 
  for (var x = 1; x < 11; x++) {
    let name_field = document.getElementById('rfp_term_service_group_' + x);
    let desc_field = document.getElementById('rfp_term_more_details_' + x);

    if (name_field != undefined && name_field != null && name_field.closest('fieldset').classList.value.indexOf('ccs-dynaform-hidden') === -1) {
      checkFieldsRfpScore2();
      if (name_field.value.trim() === '' && desc_field.value.trim() === '') {
        if(agreement_id == "RM1043.8" && group_id == "Group 9" && criterion == 'Criterion 3'){
        fieldCheck = [name_field.id, 'Enter a user type.'];
        ccsZaddErrorMessage(name_field, 'Enter a user type.');
        fieldCheck1 = [desc_field.id, 'Enter details about your users.'];
        ccsZaddErrorMessage(desc_field, 'Enter details about your users.');
        errorStore.push(fieldCheck);
        errorStore.push(fieldCheck1);
        }
        else{
        fieldCheck = [name_field.id, 'You must add information in all fields.'];
        ccsZaddErrorMessage(name_field, 'You must add information in all fields.');
        ccsZaddErrorMessage(desc_field, 'You must add information in all fields.');
        errorStore.push(fieldCheck);

        }
      } else {
        let errorObj = {
          field: name_field,
          isError: false,
        };
        if (name_field.value.trim() === '') {
          if(agreement_id == "RM1043.8" && group_id == "Group 9" && criterion == 'Criterion 3'){
            fieldCheck = [name_field.id, 'Enter a user type.'];
            ccsZaddErrorMessage(name_field, 'Enter a user type.');
           errorStore.push(fieldCheck);
          }
          else{
          ccsZaddErrorMessage(name_field, 'You must add information in all fields.');
          errorObj.isError = true;
          errorObj.field = name_field;
          }
                  }
        if (desc_field.value.trim() === '') {
          if(agreement_id == "RM1043.8" && group_id == "Group 9" && criterion == 'Criterion 3'){
             fieldCheck = [desc_field.id, 'Enter details about your users.'];
             ccsZaddErrorMessage(desc_field, 'Enter details about your users.');
            errorStore.push(fieldCheck);
           }
           else{
            ccsZaddErrorMessage(desc_field, 'You must add information in all fields.');
            errorObj.isError = true;
            errorObj.field = desc_field;
           }
          
        }
        if (errorObj.isError) {
          fieldCheck = [errorObj.field.id, 'You must add information in all fields.'];
          errorStore.push(fieldCheck);
        }
      }
    }
  }
  return errorStore;
};

const ccsZvalidateScoringCriteria2 = event => {
  event.preventDefault();
  errorStore = [];
  
  var agreement_id = urlParams.get("agreement_id");
  var group_id = urlParams.get("group_id");
  var criterion = urlParams.get("id"); 
  var lID=document.getElementById('lID').value;

  if(agreement_id=='RM1557.13' && group_id=='Group 6' && criterion=='Criterion 3' && lID=='4'){
    errorStore = [];
  }else{
    errorStore = emptyFieldCheckRfpScore2();
  }

  if (errorStore.length === 0) {
    document.forms['service_user_type_form'].submit();
  }
  else {
    console.log('errorStore',errorStore)
    ccsZPresentErrorSummary(errorStore);
  }
};

const selectedTiers = (tiers) => {

}

const  deletePost = (url) => {
  var ask = window.confirm("Are you sure you want to delete this record?");
  if (ask) {
      window.location.href = window.location.origin+url;
  }
}
let rfp_security_confirmation = null;

document.addEventListener('DOMContentLoaded', () => {  
  if (document.getElementById('rfp_singleselect_Dos')) {
    document.getElementById('rfp_singleselect_Dos').onsubmit = function (event) {
      event.preventDefault();
      removeErrorFieldsRfpSelect();
      let { fieldCheck, errorStore } = initializeErrorStoreForFieldCheck(event);
      if (document.getElementsByName('ccs_vetting_type')) {
        fieldCheck = [];
        var ccs_vetting_type = document.getElementsByName('ccs_vetting_type');
        if (ccs_vetting_type.length > 0) {
          if (ccs_vetting_type[0].checked == true) { 
            let inputArray = $('input[name=rfp_prob_statement_m]');
            let minBudget = Number(inputArray[1].value);
            let maxBudget = Number(inputArray[0].value); 
            let msg = '';
            if ((maxBudget == '') || (maxBudget == 0)) {
              msg = 'Enter an indicative maximum';
            } else if (maxBudget > 0 && (maxBudget < minBudget) || (maxBudget == minBudget)) {
              msg = 'Indicative minimum budget must be less than indicative maximum budget';
            } 
           errorStore = [];
           if(msg != '') {
            if(msg == 'Indicative minimum budget must be less than indicative maximum budget'){
              errorStore.push(['rfp_prob_statement_min', msg]);
            }else{
              errorStore.push(['rfp_prob_statement_max', msg]);
            }          
          }
            if (errorStore.length === 0) {
              document.forms['rfp_singleselect_Dos'].submit();
            } else {
              let element = document.getElementById('rfp_prob_statement_max');
              if(msg == 'Indicative minimum budget must be less than indicative maximum budget'){
                element = document.getElementById('rfp_prob_statement_min');
              }
              ccsZaddErrorMessage(element, msg);
              ccsZPresentErrorSummary(errorStore);
            }
          }else if (ccs_vetting_type[1].checked == true) {
            let inputArray = $('input[name=rfp_prob_statement_m]');
            inputArray[0].value = "";
            inputArray[1].value = "";
            if (errorStore.length === 0) {
              document.forms['rfp_singleselect_Dos'].submit();
            }
          }
           else if (!(ccs_vetting_type[0].checked || ccs_vetting_type[1].checked)) {
            var headerText = document.getElementById('page-heading').innerHTML;
            var msg = 'You must choose one option from list before proceeding';
            if(headerText.includes('Set your budget')){
              msg = 'Select “Yes” if you are prepared to share budget details, or select “No”.'
            } else if(headerText.includes('Confirm if you require a contracted out service or supply of resource')) {
              msg = 'Select whether you need a contracted out service or a supply of resource'
            }
            fieldCheck = ccsZisOptionChecked(
              'ccs_vetting_type',
              msg,
            );
            if (fieldCheck !== true) errorStore.push(fieldCheck);
            if (errorStore.length === 0) document.forms[''].submit();
            else ccsZPresentErrorSummary(errorStore);
          } else if (errorStore.length === 0) {
            document.forms['rfp_singleselect_Dos'].submit();
          }
        }
      }
    };
  }

  if (document.getElementById('rfp_singleselect_Dos') !== null) {
    if (document.querySelector('#ccs_vetting_type') !== null) {
      if (document.querySelector('#ccs_vetting_type').checked) {
        $('.main_rfp_prob_statement_m').fadeIn();
        // $('.main_rfp_indicative_maximum').fadeIn();
        // $('.main_rfp_indicative_minimum').fadeIn();
      } else {
        $('.main_rfp_prob_statement_m').hide();
        // $('.main_rfp_indicative_maximum').hide();
        // $('.main_rfp_indicative_minimum').hide();
      }
    }
  }

  if (document.getElementById('rfp_singleselect') !== null) {
    if (
      document.getElementById('rfp_security_confirmation') !== undefined &&
      document.getElementById('rfp_security_confirmation') !== null &&
      document.getElementById('rfp_security_confirmation').value != ''
    ) {
      $('#conditional-rfp_radio_security_confirmation').fadeIn();
    } else {
      $('#conditional-rfp_radio_security_confirmation').hide();
    }
  }

  $('input[type="checkbox"]:checked').each(function () {
    if (this.value == 'other') {
      $('.otherTextArea').removeClass('ccs-dynaform-hidden');
      $('.otherTextAreaMsg').removeClass('ccs-dynaform-hidden');
    }
  });
  $('input[type="checkbox"]:not(:checked)').each(function () {
    if (this.value == 'other') {
      $('.otherTextAreaMsg').addClass('ccs-dynaform-hidden');
      $('.otherTextArea').addClass('ccs-dynaform-hidden');
      $('.otherTextArea').html('');
    }
  });
  $('input[type="checkbox"]').on('click', function (e) {
    $('input[type="checkbox"]:checked').each(function () {
      if (this.value == 'other') {
        $('.otherTextArea').removeClass('ccs-dynaform-hidden');
        $('.otherTextAreaMsg').removeClass('ccs-dynaform-hidden');
      }
    });
    $('input[type="checkbox"]:not(:checked)').each(function () {
      if (this.value == 'other') {
        $('.otherTextAreaMsg').addClass('ccs-dynaform-hidden');
        $('.otherTextArea').addClass('ccs-dynaform-hidden');
        $('.otherTextArea').html('');
      }
    });
  });

  $('.otherTextArea').on('keypress', function () {
    var aInput = this.value;
    if (aInput.length > 500) {
      return false;
    }
    return true;
  });
});

$('input[type="radio"]').on('change', function (e) {
  if (e.currentTarget.value == 'Yes') {
    $('.main_rfp_prob_statement_m').fadeIn();
    $('.main_rfp_indicative_maximum').fadeIn();
    $('.main_rfp_indicative_minimum').fadeIn();
  } else {
    $('.main_rfp_prob_statement_m').hide();
    $('.main_rfp_indicative_maximum').hide();
    $('.main_rfp_indicative_minimum').hide();
  }
});
let rfp_vetting = document.querySelectorAll('.rpf_500');
let rfp_term_percentage = document.querySelectorAll('.rfp_term_percentage');
let ccs_vetting = document.querySelectorAll('.ccs_vetting');
let rfp_term_definition_new = document.querySelectorAll('.rfp_term_definition_new');
rfp_vetting.forEach(ele => {
  ele.addEventListener('keydown', (event) => {
    removeErrorFieldsRfpSelect();
  });
});
rfp_term_percentage.forEach(ele => {
  ele.addEventListener('keydown', (event) => {
    removeErrorFieldsRfpSelect();
  });
});
rfp_term_definition_new.forEach(ele => {
  ele.addEventListener('keydown', (event) => {
    removeErrorFieldsRfpSelect();
  });
});
ccs_vetting.forEach(ele => {
  ele.addEventListener('click', (event) => {
    removeErrorFieldsRfpSelect();
  });
});
// $("#rfp_security_confirmation").keypress(function(e) {
//   var keycode =e.which;

//   if ((keycode != 8) && (keycode < 48 || keycode > 57)) {
//       return false;
//   }

// });
$('input[type="radio"]').on('change', function (e) {
  if (e.currentTarget.value === 'Yes') {
    if (
      rfp_security_confirmation != null &&
      rfp_security_confirmation != '' &&
      document.getElementById('rfp_security_confirmation') != undefined
    )
      document.getElementById('rfp_security_confirmation').value = rfp_security_confirmation;
    $('#conditional-rfp_radio_security_confirmation').fadeIn();
  } else {
    if (document.getElementById('rfp_security_confirmation') != undefined) {
      rfp_security_confirmation = document.getElementById('rfp_security_confirmation').value;
      document.getElementById('rfp_security_confirmation').value = '';
    }
    $('#conditional-rfp_radio_security_confirmation').hide();
  }
});
const removeErrorFieldsRfpSelect = () => {
  $('.govuk-error-message').remove();
  $('.govuk-form-group--error').removeClass('govuk-form-group--error');
  $('.govuk-error-summary').remove();
  $('.govuk-input').removeClass('govuk-input--error');
  $('.govuk-form-group textarea').removeClass('govuk-textarea--error');
};
$('#rfp_singleselect').on('submit', event => {
  event.preventDefault();
  if(document.getElementById('agreementID').value == 'RM1557.13' && document.getElementById('gID').value === 'Group 8' && document.getElementById('lID').value === '4') {
    document.forms['rfp_singleselect'].submit();
  }else{
  removeErrorFieldsRfpSelect();
  var urlParams = new URLSearchParams(window.location.search);
  var agreement_id = urlParams.get("agreement_id");
  var group_id = urlParams.get("group_id");
  var criterion = urlParams.get("id");
  const textPattern = /^[a-zA-Z ]+$/;
  var listofRadionButton = document.querySelectorAll('.govuk-radios__input');
  let ischecked = false;
  var headerText = document.getElementById('page-heading').innerHTML;
  listofRadionButton.forEach(element => {
    if (element.type === 'radio' && element.checked) {
      ischecked = true;
    }
  });

  if (headerText.includes('existing supplier') && ischecked) {
    var ccs_vetting_type = document.getElementById('ccs_vetting_type').checked;

    var rfp_security_confirmation = document.getElementById('rfp_security_confirmation');
    if (ccs_vetting_type && rfp_security_confirmation.value === '' && Number(rfp_security_confirmation.value)) {
      ccsZaddErrorMessage(rfp_security_confirmation, 'You must add information in field.');
      ccsZPresentErrorSummary([
        ['rfp_security_confirmationrfp_security_confirmation', 'You must add information in field.'],
      ]);
    } else if (
      ccs_vetting_type &&
      rfp_security_confirmation.value !== undefined &&
      rfp_security_confirmation.value !== null &&
      rfp_security_confirmation.value !== '' &&
      !textPattern.test(rfp_security_confirmation.value) &&
      Number(rfp_security_confirmation.value)
    ) {
      ccsZaddErrorMessage(rfp_security_confirmation, 'Please enter only character.');
      ccsZPresentErrorSummary([['rfp_security_confirmation', 'Please enter only character.']]);
    } else if (ccs_vetting_type == true && $('#rfp_security_confirmation').val().length === 0) {
      ccsZaddErrorMessage(rfp_security_confirmation, 'Provide the name of the incumbent supplier.');
    } else {
      document.forms['rfp_singleselect'].submit();
    }
  } else {
    if (ischecked) {
      document.forms['rfp_singleselect'].submit();
    } else {
      var ccs_vetting_type = document.getElementById('ccs_vetting_type');
      if(headerText.trim().toLowerCase() == 'Which phase the project is in'.toLowerCase()){
        ccsZPresentErrorSummary([['There is a problem', 'Select a project phase']]);
      }else if(headerText.trim().toLowerCase() == 'Confirm if you require a contracted out service or supply of resource'.toLowerCase()){
        ccsZPresentErrorSummary([['There is a problem', 'Select whether you need a contracted out service or a supply of resource']]);
      }else{
        ccsZPresentErrorSummary([['There is a problem', 'You must choose one option from list before proceeding']]);
      }
    }
    if (ccs_vetting_type) {
      if(headerText.trim().toLowerCase() == 'Which phase the project is in'.toLowerCase()){
        ccsZaddErrorMessage(ccs_vetting_type, 'Select one project phase');
      }else if(headerText.trim().toLowerCase() == 'Confirm if you require a contracted out service or supply of resource'.toLowerCase()){
        ccsZaddErrorMessage(ccs_vetting_type, 'Select whether you need a contracted out service or a supply of resource');
      }else{
        ccsZaddErrorMessage(ccs_vetting_type, 'Choose one option before proceeding');
      }

    }
  }
}
});

const countWordskpi = (str) => { return str.trim().split(/\s+/).length };


document.addEventListener('DOMContentLoaded', () => {
  if (document.getElementById("service_levels_kpi_form") !== null) {

    let with_value_count = 10,
      prev_input = 0,
      deleteButtons = document.querySelectorAll("a.del");
    let precentageInputs = document.querySelectorAll(".govuk-input--width-5");
    let deleteButtonCount = [];
    // delete buttons
    deleteButtons.forEach((db) => {
      db.classList.add('ccs-dynaform-hidden')
      db.addEventListener('click', (e) => {
        e.preventDefault();

        let target = e.target.href.replace(/^(.+\/)(\d{1,2})$/, "$2"),
          prev_coll = Number(target) - 1,
          target_fieldset = db.closest("fieldset");


        document.getElementById('rfp_term_service_levels_KPI_' + target).value = "";
        document.getElementById('rfp_term_definition_service_levels_KPI_' + target).value = "";
        document.getElementById('rfp_term_percentage_KPI_' + target).value = "";
        target_fieldset.classList.add("ccs-dynaform-hidden");
        
        document.getElementById("remove_icon_" + target).classList.add('ccs-dynaform-hidden');

        document.getElementById("kpiKeyLevel").textContent = prev_coll;
        if (prev_coll > 1) {
          document.getElementById("kpiKeyLevel").textContent = prev_coll;
          document.querySelector('.acronym_service_levels_KPI_' + prev_coll + ' a.del').classList.remove("ccs-dynaform-hidden");
        }

        document.getElementById("ccs_rfpTerm_add").classList.remove('ccs-dynaform-hidden');
        with_value_count--;
      });
    });
    for (var kpi_fieldset = 10; kpi_fieldset > 1; kpi_fieldset--) {

      let this_fieldset = document.querySelector(".acronym_service_levels_KPI_" + kpi_fieldset),
        term_box = document.getElementById("rfp_term_service_levels_KPI_" + kpi_fieldset),
        term_box1 = document.getElementById("rfp_term_definition_service_levels_KPI_" + kpi_fieldset),
        term_box2 = document.getElementById("rfp_term_percentage_KPI_" + kpi_fieldset);
      //deleteButtonKPI = document.getElementById("remove_icon_" + kpi_fieldset);

      if (term_box != undefined && term_box != null && term_box.value !== "") {
        this_fieldset.classList.remove('ccs-dynaform-hidden');
        this_fieldset.classList.remove('ccs-dynaform-hidden');
        document.getElementById("kpiKeyLevel").textContent = kpi_fieldset;
        deleteButtonCount.push(kpi_fieldset);
        if (kpi_fieldset === 10) {
          
          document.getElementById("ccs_rfpTerm_add").classList.add('ccs-dynaform-hidden');
        }
      } else {
        
        this_fieldset.classList.add('ccs-dynaform-hidden');
        with_value_count = kpi_fieldset;
      }
      //document.getElementById("ccs_rfpTerm_add").classList.remove("ccs-dynaform-hidden");
      //$('#remove_icon_'+kpi_fieldset).remove('ccs-dynaform-hidden');
      $('#remove_icon_'+kpi_fieldset).removeClass('ccs-dynaform-hidden');

      
      if (kpi_fieldset === 2 && deleteButtonCount.length > 0) {
        $("#remove_icon_" + deleteButtonCount[deleteButtonCount.sort().length - 1]).removeClass("ccs-dynaform-hidden");
      }
    }
    document.getElementById("ccs_rfpTerm_add").classList.remove("ccs-dynaform-hidden");

    
    document.getElementById("ccs_rfpTerm_add").addEventListener('click', (e) => {
      let errorStore = [];
     
      $('.govuk-form-group').removeClass('govuk-textarea--error');
      //checkFieldsRfpKPI();
      let totalPercentage = 0;
      var percentageElement = document.getElementsByName("percentage");
      for (let index = 0; index < percentageElement.length; index++) {
        totalPercentage += Number(percentageElement[index].value);
        let index1 = Number(index) + 1;
        if (Number(percentageElement[index].value) > 100) {
          errorStore.push(["rfp_term_percentage_KPI_" + index1, "Please enter percentage value less than 100"])
        }
      }
      if (totalPercentage < 0) {
        errorStore.push(["rfp_term_percentage_KPI_", "You must enter a positive value"]);
      }
      // if (totalPercentage === 100) {
      //   errorStore.push(["rfp_term_percentage_KPI_", "Percentage value equal 100% you can not add more set of question"])
      // } else if (totalPercentage > 100) {
      //   errorStore.push(["rfp_term_percentage_KPI_", "Percentage value exceeding 100%, So you can not proceed"])
      // }
      errorStore = errorStore == null || errorStore.length <= 0 ? emptyFieldCheckRfpKPI("add_more") : errorStore;
      e.preventDefault();
      if (errorStore == null || errorStore.length <= 0) {
        document.querySelector(".acronym_service_levels_KPI_" + with_value_count).classList.remove("ccs-dynaform-hidden");
        if (with_value_count > 2) {
        
          prev_input = with_value_count - 1;
          //document.querySelector(".acronym_service_levels_KPI_" + prev_input + " a.del").classList.add("ccs-dynaform-hidden");
          //document.querySelector("#remove_icon_" + prev_input).classList.add("ccs-dynaform-hidden");
        }
        document.querySelector("#remove_icon_" + with_value_count).classList.remove("ccs-dynaform-hidden");
        with_value_count++;


        //document.getElementById("kpiKeyLevel").textContent = with_value_count;
        if (with_value_count === 11) {
         
          document.getElementById("ccs_rfpTerm_add").classList.add('ccs-dynaform-hidden');
        }
      } else {
        
        ccsZPresentErrorSummary(errorStore);
      }

    });


    precentageInputs.forEach(db => {
      db.addEventListener("keydown", (event) => {
        if (event.keyCode == '69') { event.preventDefault(); }
      })
    })

  }
});

const checkFieldsRfpKPI = () => {
  const start = 1;
  const end = 10;
  const pageHeading = document.getElementById('page-heading').innerHTML;
  for (var a = start; a <= end; a++) {
    let input = $(`#rfp_term_service_levels_KPI_${a}`)
    let textbox = $(`#rfp_term_definition_service_levels_KPI_${a}`);
    let textbox1 = $(`#rfp_term_percentage_KPI_${a}`);

    if (!pageHeading.includes("(Optional)")) {

      const field1 = countWordskpi(input.val()) < 50;
      const field2 = countWordskpi(textbox.val()) < 150;
      if (input.val() !== "" || field1) {
        $(`#rfp_term_service_levels_KPI_${a}`).remove();
        $(`.acronym_${a} div`).removeClass('govuk-form-group--error');
        $(`.acronym_${a} input`).removeClass('govuk-input--error')
      }
      if (textbox.val() !== "" || field2) {

        $(`#rfp_term_service_levels_KPI_${a}-error`).remove();
        $(`.acronym_${a} div`).removeClass('govuk-form-group--error');
        $(`.acronym_${a} textarea`).removeClass('govuk-input--error');
        $(`.acronym_${a} textarea`).removeClass('govuk-textarea--error')
      }

      // if (textbox1.val() !== "" || field2) {
      //   $(`#rfp_term_percentage_KPI_${a}-error`).remove();
      //   $(`.rfp_term_${a} div`).removeClass('govuk-form-group--error');
      //   $(`.rfp_term_definition_${a} textarea`).removeClass('govuk-input--error');
      //   //$(`.acronym_service_levels_KPI_${a} textarea`).removeClass('govuk-textarea--error');
      // }
    }

  }
}

const removeErrorFieldsRfpKPI = () => {
  $('.govuk-error-message').remove();
  $('.govuk-form-group--error').removeClass('govuk-form-group--error')
  $('.govuk-error-summary').remove();
  $(".govuk-input").removeClass("govuk-input--error");
  $('.govuk-form-group textarea').removeClass('govuk-textarea--error');

}

const emptyFieldCheckRfpKPI = (type_base='') => {
  let fieldCheck = "",
    errorStore = [];
   
  const pageHeading = document.getElementById('page-heading').innerHTML;
  removeErrorFieldsRfpKPI();
  for (var x = 1; x < 11; x++) {
    let term_field = document.getElementById('rfp_term_service_levels_KPI_' + x);
    let definition_field = document.getElementById("rfp_term_definition_service_levels_KPI_" + x);
    let target_field = document.getElementById("rfp_term_percentage_KPI_" + x);

    if (term_field !== undefined && term_field !== null && definition_field !== undefined && definition_field !== null && target_field !== undefined && target_field !== null) {
      const field1 = countWordskpi(term_field.value) > 500;
      const field2 = countWordskpi(definition_field.value) > 10000;

      if (term_field.closest("fieldset").classList.value.indexOf("ccs-dynaform-hidden") === -1) {
        //checkFieldsRfpKPI()
        if (term_field.value.trim() !== '' && definition_field.value.trim() !== '' && target_field.value.trim() !== '') {
          document.getElementById("kpiKeyLevel").textContent = x;
        }
        

        if (term_field.value.trim() == '' && definition_field.value.trim() == '' && target_field.value.trim() == '') {
         
        }else{
          if (type_base != 'add_more' && (pageHeading.includes("(Optional)") || pageHeading.includes("(optional)")) && (term_field.value.trim() == '' || definition_field.value.trim() == '' || target_field.value.trim() == '')) {
            let isErrorSingle = false;
            if (term_field.value.trim() == ''){
               isErrorSingle = true;
              ccsZaddErrorMessage(term_field, 'You must enter the name of requirement.');
          }
          if (definition_field.value.trim() == ''){
             isErrorSingle = true;
            ccsZaddErrorMessage(definition_field, 'You must enter the description of the criteria.');
          }
          if (target_field.value.trim() == ''){
             isErrorSingle = true;
            ccsZaddErrorMessage(target_field, 'You must enter your success target.');
          }
          if (isErrorSingle) {
            fieldCheck = [definition_field.id, 'You must add information in all fields.'];
            errorStore.push(fieldCheck);
          }
        }
        }
       
      
        if ((!pageHeading.includes("(optional)") && !pageHeading.includes("(Optional)")) || type_base=='add_more') {
          if (term_field.value.trim() === '' && definition_field.value.trim() === '' && target_field.value.trim() === '') {
            fieldCheck = [definition_field.id, 'You must add information in all fields.'];
            ccsZaddErrorMessage(term_field, 'You must enter the name of requirement.');
            ccsZaddErrorMessage(definition_field, 'You must enter the description of the criteria.');
            ccsZaddErrorMessage(target_field, 'You must enter your success target.');
            fieldCheck = ['rfp_term_service_levels_KPI_' + x, 'You must enter the name of requirement.'];
            errorStore.push(fieldCheck);
            fieldCheck = ["rfp_term_definition_service_levels_KPI_" + x, 'You must enter the description of the criteria.'];
            errorStore.push(fieldCheck);
            fieldCheck = ["rfp_term_percentage_KPI_" + x, 'You must enter your success target.'];
            errorStore.push(fieldCheck);
          }
          else {
            let isError = false;
            if (term_field.value.trim() === '') {
              ccsZaddErrorMessage(term_field, 'You must enter the name of requirement.');
              isError = true;
              fieldCheck = ['rfp_term_service_levels_KPI_' + x, 'You must enter the name of requirement.'];
              errorStore.push(fieldCheck);
            }
            if (definition_field.value.trim() === '') {
              ccsZaddErrorMessage(definition_field, 'You must enter the description of the criteria.');
              isError = true;
              fieldCheck = ["rfp_term_definition_service_levels_KPI_" + x, 'You must enter the description of the criteria.'];
              errorStore.push(fieldCheck);
            }

            if (target_field !== undefined && target_field !== null && target_field.value.trim() === '') {
              ccsZaddErrorMessage(target_field, 'You must enter your success target.');
              isError = true;
              fieldCheck = ["rfp_term_percentage_KPI_" + x, 'You must enter your success target.'];
              errorStore.push(fieldCheck);
            }
            if (field1) {
              ccsZaddErrorMessage(term_field, 'No more than 500 words are allowed.');
              isError = true;
            }
            if (field2) {
              ccsZaddErrorMessage(definition_field, 'No more than 10000 words are allowed.');
              isError = true;
            }
            if (isError) {
              
            }
          }
        }
      }
    }

  }
  return errorStore;
}

const ccsZvalidateRfpKPI = (event) => {
  event.preventDefault();
  errorStore = [];
  let totalPercentage = 0;
  var percentageElement = document.getElementsByName("percentage");
  for (let index = 0; index < percentageElement.length; index++) {
    totalPercentage += Number(percentageElement[index].value);
    if (Number(percentageElement[index].value) > 100) {
      let index1 = Number(index) + 1;
      errorStore.push(["rfp_term_percentage_KPI_" + index1, "Please enter percentage value less than 100"])
    }
  }
  if (totalPercentage === 100) {
    errorStore.push(["rfp_term_percentage_KPI_", "Percentage value equal 100% you can not add more set of question"])
  } else if (totalPercentage > 100) {
    errorStore.push(["rfp_term_percentage_KPI_", "Percentage value exceeding 100%, So you can not proceed"])
  }
  errorStore = errorStore == null || errorStore.length <= 0 ? emptyFieldCheckRfpKPI() : errorStore;

  if (errorStore.length === 0) {

    document.forms["service_levels_kpi_form"].submit();
  }
  else {
    ccsZPresentErrorSummary(errorStore);

  }
};

$('#service_levels_kpi_form').on('submit', (event) => {
  event.preventDefault();
  let totalPercentage = 0;
  let errorStore = [];
  var percentageElement = document.getElementsByName("percentage");
  for (let index = 0; index < percentageElement.length; index++) {
    totalPercentage += Number(percentageElement[index].value);
    
    if (Number(percentageElement[index].value) > 100) {
      let index1 = Number(index) + 1;
      errorStore.push(["rfp_term_percentage_KPI_" + index1, "Please enter percentage value less than 100"])
    }
  }
  // if (totalPercentage === 100) {
  //   errorStore.push(["rfp_term_percentage_KPI_", "Percentage value equal 100% you can not add more set of question"])
  // } else 
  // if (totalPercentage < 100) {
  //   errorStore.push(["rfp_term_percentage_KPI_", "Percentage value not equal to 100%, So you can not proceed"])
  // } else 
  // if (totalPercentage > 100){
  //   errorStore.push(["rfp_term_percentage_KPI_", "Percentage value exceeding 100%, So you can not proceed"])
  // }


  if (totalPercentage < 0) {
    errorStore.push(["rfp_term_percentage_KPI_", "You must enter a positive value"]);
  }

  errorStore = errorStore == null || errorStore.length <= 0 ? emptyFieldCheckRfpKPI() : errorStore;
  if (errorStore.length === 0) {
    
    const classList = document.getElementsByClassName("govuk-hint-error-message");
    const classLength = classList.length;
  
  if (classLength != 0) {
    return false;
  } else {
    document.forms["service_levels_kpi_form"].submit();
  }


    
  }else {
    ccsZPresentErrorSummary(errorStore);
  }
});

const countWords = (str) => { return str.trim().split(/\s+/).length };
document.addEventListener('DOMContentLoaded', () => {

    if (document.getElementById("service_user_type_form") !== null) {

        let with_value_count = 10,
            prev_input = 0,
            deleteButtons = document.querySelectorAll("a.del");
        let clearFieldsButtons = document.querySelectorAll("a.clear-fields");
        let deleteButtonCount = [];
        for (var acronym_fieldset = 10; acronym_fieldset > 1; acronym_fieldset--) {


            let this_fieldset = document.querySelector(".acronym_service_" + acronym_fieldset),
                term_box = document.getElementById("rfp_term_service_group_" + acronym_fieldset);
               document.getElementById("deleteButton_service_useer_type_" + acronym_fieldset).classList.remove("ccs-dynaform-hidden");
              
            if (term_box != undefined && term_box != null && term_box.value !== "") {
                this_fieldset.classList.remove('ccs-dynaform-hidden');
                deleteButtonCount.push(acronym_fieldset);
                if (acronym_fieldset === 10) {

                    // document.getElementById("ccs_rfpTerm_add").classList.add('ccs-dynaform-hidden');
                    document.getElementById("ccs_rfpService_use_type_add").classList.add('ccs-dynaform-hidden');
                }

            } else {

                this_fieldset.classList.add('ccs-dynaform-hidden');
                with_value_count = acronym_fieldset;
            }


        }

        if (deleteButtonCount.length != 9) {
            document.getElementById("ccs_rfpService_use_type_add").classList.remove("ccs-dynaform-hidden");
        }


        document.getElementById("ccs_rfpService_use_type_add").addEventListener('click', (e) => {
            removeErrorFieldsRfpScoreQuestion()
            //checkFieldsRfp();
            errorStore = [];
            e.preventDefault();
            var urlParams = new URLSearchParams(window.location.search);
            var agreement_id = urlParams.get("agreement_id");
            var group_id = urlParams.get("group_id");
            var criterion = urlParams.get("id");
            let last_value = with_value_count - 1;
            let groupName='',groupDetails='';
            const group_name = document.querySelector('#rfp_term_service_group_' + last_value).value;
            const group_details =  document.querySelector('#rfp_term_more_details_' + last_value).value;
            const hidden = document.querySelector(".acronym_service_" + last_value).classList.contains("ccs-dynaform-hidden")
        if( (group_name == '' || group_details == '') ){
            if(group_name == '') {
                if(agreement_id == "RM1043.8" && group_id == "Group 9" && criterion == 'Criterion 3'){
                  groupName = ccsZvalidateWithRegex('rfp_term_service_group_' + last_value , "Enter a user type.", /\w+/);
                }
                else{
                    groupName = ccsZvalidateWithRegex('rfp_term_service_group_' + last_value , "You must enter information here", /\w+/);
                }
            }
            if(group_details == ''){
                if(agreement_id == "RM1043.8" && group_id == "Group 9" && criterion == 'Criterion 3'){
                    groupDetails = ccsZvalidateWithRegex('rfp_term_more_details_' + last_value , "Enter details about your users.", /\w+/);
                }
                else{
                    groupDetails = ccsZvalidateWithRegex('rfp_term_more_details_' + last_value , "You must enter information here", /\w+/);
                }
            }  
           
            // else{
            //  if(group_name == '')  groupName = ccsZvalidateWithRegex('rfp_term_service_group_' + last_value , "You must enter information here11", /\w+/);
            //  if(group_details == '')  groupDetails = ccsZvalidateWithRegex('rfp_term_more_details_' + last_value , "You must enter information here12", /\w+/);
            // }
            if(groupName !== true) errorStore.push(groupName);
            if(groupDetails !== true) errorStore.push(groupDetails);

            if(errorStore.length != 0){
            ccsZPresentErrorSummary(errorStore);
            }
            

        }else if(errorStore.length ==0) {
            removeErrorFieldsRfpScoreQuestion()
            document.querySelector(".acronym_service_" + with_value_count).classList.remove("ccs-dynaform-hidden");

        }
            // if (with_value_count > 2) {
            //     prev_input = with_value_count - 1;
            //     document.querySelector(".acronym_service_" + prev_input + " a.del").classList.add("ccs-dynaform-hidden");
            // }

           
            // console.log('with_value_count',with_value_count)
            if (with_value_count === 10) {
                document.getElementById("ccs_rfpService_use_type_add").classList.add('ccs-dynaform-hidden');
            }
            if(errorStore.length == 0){
                if($("#deleteButton_service_useer_type_" + last_value)){
                    $("#deleteButton_service_useer_type_" + last_value).removeClass("ccs-dynaform-hidden");
                }
                with_value_count++;
            }
        });

        // delete buttons
        deleteButtons.forEach((db) => {
            // db.classList.remove('ccs-dynaform-hidden')
            db.addEventListener('click', (e) => {
                e.preventDefault();

                let target = db.href.replace(/^(.+\/)(\d{1,2})$/, "$2"),
                    prev_coll = Number(target) - 1,
                    target_fieldset = db.closest("fieldset");

                // target_fieldset.classList.add("ccs-dynaform-hidden");

                // document.getElementById('rfp_term_service_group_' + target).value = "";
                // document.getElementById('rfp_term_more_details_' + target).value = "";


                // if (prev_coll > 1) {
                //     document.querySelector('.acronym_service_' + prev_coll + ' a.del').classList.remove("ccs-dynaform-hidden");
                // }

                // document.getElementById("ccs_rfpService_use_type_add").classList.remove('ccs-dynaform-hidden');
                let Sibling = target_fieldset.nextElementSibling; //document.getElementById(e.target.id).nextElementSibling;
                console.log(`target: ${target}`)

                if(target != 10) {
                    let ml = 1;
                    
                    let next_coll = Number(target);
                    let nextLevel_coll = Number(target);
                    let eptArr = [];
                    while (Sibling) {
                        
                        let siblingClassList = Sibling.classList;
                        if (Object.keys(siblingClassList).find(key => siblingClassList[key] === 'closeCCS') !== undefined && Object.keys(siblingClassList).find(key => siblingClassList[key] === 'ccs-dynaform-hidden') === undefined) {
                           let current_col = nextLevel_coll;
                            nextLevel_coll = (nextLevel_coll + 1);

                            eptArr.push(nextLevel_coll)
                            if(ml == 1) {
                                console.log(`First: ${ml} - ${next_coll}`)
                                var first = Sibling.querySelector("[name='term']");
                                var last  = Sibling.querySelector("[name='value']");
                                console.log(first.value)
                                console.log(last.value)
                                document.getElementById('rfp_term_service_group_' + current_col).value = first.value;
                                document.getElementById('rfp_term_more_details_' + current_col).value = last.value;
                                // target_fieldset.querySelector("[name='term']").value = first.value;
                                // target_fieldset.querySelector("[name='value']").value = last.value;
                            } else {
                                next_coll = next_coll + 1;
                                console.log(`Usual: ${ml} - ${next_coll}`)
                                var first = Sibling.querySelector("[name='term']");
                                var last  = Sibling.querySelector("[name='value']");
                                console.log(first.value)
                                console.log(last.value)
                                document.getElementById('rfp_term_service_group_' + next_coll).value = first.value;
                                document.getElementById('rfp_term_more_details_' + next_coll).value = last.value;
                            }
        
                            console.log(Sibling.classList);
                            Sibling = Sibling.nextElementSibling;
                        } else {
                            Sibling = false;
                        }
                    ml++;}
                    if(eptArr.length > 0) {
                        console.log(eptArr);
                        let removeLogic = eptArr.at(-1);
                        console.log(`removeLogic: ${removeLogic}`);
                        document.getElementById('rfp_term_service_group_' + removeLogic).value = "";
                        document.getElementById('rfp_term_more_details_' + removeLogic).value = "";
                        document.getElementById('rfp_term_service_group_' + removeLogic).closest("fieldset").classList.add("ccs-dynaform-hidden")
                    } else {
                        // target_fieldset.classList.add("ccs-dynaform-hidden");
                        // document.getElementById('rfp_term_' + target).value = "";
                        // document.getElementById('rfp_term_definition_' + target).value = "";
                        // if (prev_coll > 1) {
                        //     document.querySelector('.acronym_' + prev_coll + ' a.del').classList.remove("ccs-dynaform-hidden");
                        // }
                        // document.getElementById("ccs_rfpTerm_add").classList.remove('ccs-dynaform-hidden');
                         target_fieldset.classList.add("ccs-dynaform-hidden");
                         document.getElementById('rfp_term_service_group_' + target).value = "";
                         document.getElementById('rfp_term_more_details_' + target).value = "";
                        if (prev_coll > 1) {
                            document.querySelector('.acronym_service_' + prev_coll + ' a.del').classList.remove("ccs-dynaform-hidden");
                        }
                        document.getElementById("ccs_rfpService_use_type_add").classList.remove('ccs-dynaform-hidden');
                    }
                } else {
                    // target_fieldset.classList.add("ccs-dynaform-hidden");
                    // document.getElementById('rfp_term_' + target).value = "";
                    // document.getElementById('rfp_term_definition_' + target).value = "";
                    // if (prev_coll > 1) {
                    //     document.querySelector('.acronym_' + prev_coll + ' a.del').classList.remove("ccs-dynaform-hidden");
                    // }
                    // document.getElementById("ccs_rfpTerm_add").classList.remove('ccs-dynaform-hidden');
                         target_fieldset.classList.add("ccs-dynaform-hidden");
                         document.getElementById('rfp_term_service_group_' + target).value = "";
                         document.getElementById('rfp_term_more_details_' + target).value = "";
                        if (prev_coll > 1) {
                            document.querySelector('.acronym_service_' + prev_coll + ' a.del').classList.remove("ccs-dynaform-hidden");
                        }
                        document.getElementById("ccs_rfpService_use_type_add").classList.remove('ccs-dynaform-hidden');
                }

                with_value_count--;
                if (with_value_count != 11) {
                    document.getElementById("ccs_rfpService_use_type_add").classList.remove('ccs-dynaform-hidden');

                }
            });
        });
        clearFieldsButtons.forEach((db) => {
            db.addEventListener('click', (e) => {

                e.preventDefault();

                let target = db.href.replace(/^(.+\/)(\d{1,2})$/, "$2"),
                    target_fieldset = db.closest("fieldset");

                target_fieldset.classList.add("ccs-dynaform");

               // document.getElementById('rfp_term_service_group_' + target).value = "";
                //document.getElementById('rfp_term_more_details_' + target).value = "";
                // removeErrorFieldsRfp();
            });

        });

        if(deleteButtonCount.length >= 2){
            deleteButtonCount.forEach((val,index)=>{
                if(index == 0){
                    $("#deleteButton_service_useer_type_" + val).removeClass("ccs-dynaform-hidden");
                }else {
                    $("#deleteButton_service_useer_type_" + val).addClass("ccs-dynaform-hidden");
                }
            })
        }


    }
});

const removeErrorFieldsRfpScoreQuestion = () => {
    $('.govuk-error-message').remove();
    $('.govuk-form-group--error').removeClass('govuk-form-group--error');
    $('.govuk-error-summary').remove();
    $('.govuk-input').removeClass('govuk-input--error');
    $('.govuk-form-group textarea').removeClass('govuk-textarea--error');
};


const checkFieldsRfp = () => {
    const start = 1;
    const end = 10;
    const pageHeading = document.getElementById('page-heading').innerHTML;
    for (var a = start; a <= end; a++) {
        let input = $(`#rfp_term_${a}`)
        let textbox = $(`#rfp_term_definition_${a}`);

        if (!pageHeading.includes("(Optional)")) {
            const field1 = countWords(input.val()) < 50;
            const field2 = countWords(textbox.val()) < 150;
            if (input.val() !== "" || field1) {

                $(`#rfp_term_${a}-error`).remove();
                $(`.acronym_${a} div`).removeClass('govuk-form-group--error');
                $(`.acronym_${a} input`).removeClass('govuk-input--error')

            }


            if (textbox.val() !== "" || field2) {

                $(`#rfp_term_definition_${a}-error`).remove();
                $(`.acronym_${a} div`).removeClass('govuk-form-group--error');
                $(`.acronym_${a} textarea`).removeClass('govuk-input--error');
                $(`.acronym_${a} textarea`).removeClass('govuk-textarea--error')
            }
        }

    }
}
const removeErrorFieldsRfp = () => {
    $('.govuk-error-message').remove();
    $('.govuk-form-group--error').removeClass('govuk-form-group--error')
    $('.govuk-error-summary').remove();
    $(".govuk-input").removeClass("govuk-input--error");
    $('.govuk-form-group textarea').removeClass('govuk-textarea--error');

}

const emptyFieldCheckRfp = () => {
    let fieldCheck = "",
        errorStore = [];
    const pageHeading = document.getElementById('page-heading').innerHTML;
    for (var x = 1; x < 11; x++) {
        let term_field = document.getElementById('rfp_term_' + x);
        let definition_field = document.getElementById("rfp_term_definition_" + x);
        let target_field = document.getElementById("rfp_term_target_" + x);

        if (term_field.value !== undefined && definition_field !== undefined) {
            const field1 = countWords(term_field.value) > 50;
            const field2 = countWords(definition_field.value) > 150;

            if (term_field.closest("fieldset").classList.value.indexOf("ccs-dynaform-hidden") === -1) {
                checkFieldsRfp();
                if (!pageHeading.includes("(Optional)")) {
                    if (term_field.value.trim() === '' && definition_field.value.trim() === '') {
                        fieldCheck = [definition_field.id, 'You must add information in all fields.'];
                        ccsZaddErrorMessage(term_field, 'You must add information in all fields.');
                        ccsZaddErrorMessage(definition_field, 'You must add information in all fields.');
                        if (target_field !== undefined && target_field !== null && target_field.value.trim() === '')
                            ccsZaddErrorMessage(target_field, 'You must add information in all fields.');
                        errorStore.push(fieldCheck);
                    } else {
                        let isError = false;
                        if (term_field.value.trim() === '') {
                            ccsZaddErrorMessage(term_field, 'You must add information in all fields.');
                            isError = true;
                        }
                        if (definition_field.value.trim() === '') {
                            ccsZaddErrorMessage(definition_field, 'You must add information in all fields.');
                            isError = true;
                        }
                        if (target_field !== undefined && target_field !== null && target_field.value.trim() === '') {
                            ccsZaddErrorMessage(target_field, 'You must add information in all fields.');
                            isError = true;
                        }
                        if (field1) {
                            ccsZaddErrorMessage(term_field, 'No more than 50 words are allowed.');
                            isError = true;
                        }
                        if (field2) {
                            ccsZaddErrorMessage(definition_field, 'No more than 250 words are allowed.');
                            isError = true;
                        }
                        if (isError) {
                            fieldCheck = [definition_field.id, 'You must add information in all fields.'];
                            errorStore.push(fieldCheck);
                        }
                    }
                }
            }
        }

    }
    return errorStore;
}
const ccsZvalidateRfpAcronyms = (event) => {

    // event.preventDefault();

    //errorStore = emptyFieldCheckRfp();

    //if (errorStore.length === 0) {

    document.forms["service_user_type_form"].submit();
    //}
    //else {
    //   ccsZPresentErrorSummary(errorStore);

    // }
};
const ccsScrollToJourney = (event) => {
    let element = document.querySelector('.govuk-breadcrumbs');
     let scrollerID = setInterval(function() {
        window.scrollBy(0, 2);
        if ( window.scrollY >= element.offsetTop) {
            clearInterval(scrollerID);
        }
    }, 10);
  };

const ccsZvalidateAward = (event) => {
    event.preventDefault();
    errorStore = [];
    const preAwardSupplierConfm = document.getElementById('pre_award_supplier_confirmation')

    if (preAwardSupplierConfm != undefined && !preAwardSupplierConfm.checked) {
        const fieldCheck = ccsZisOptionChecked("pre_award_supplier_confirmation", "Acknowledgement tick box must be selected to continue with the awarding of the selected supplier.");
        if (fieldCheck !== true) errorStore.push(fieldCheck);
        ccsZPresentErrorSummary(errorStore);
    }
    else {
      const openpopsupplier = document.querySelector('.backdrop-award')
        openpopsupplier.classList.add('showpopup');
        $(".dialog-close-award").on('click', function(){
          openpopsupplier.classList.remove('showpopup');
          ccsZremoveErrorMessage(preAwardSupplierConfm);
        });
        stnewsupplier = document.getElementById('btn_pre_award_supplier');
        stnewsupplier.addEventListener('click', ev => {
          if (errorStore.length === 0) document.forms["ccs_pre_award_supplier_form"].submit();
          else ccsZPresentErrorSummary(errorStore);
          openpopsupplier.classList.remove('showpopup');
        })
    

    }
};

const removeErrorFieldssdsd = () => {
  $('.govuk-error-message').remove();
  $('.govuk-form-group--error').removeClass('govuk-form-group--error')
  $('.govuk-error-summary').remove();
  $(".govuk-input").removeClass("govuk-input--error");
  $('.govuk-form-group textarea').removeClass('govuk-textarea--error');

}

document.addEventListener('DOMContentLoaded', () => {
  $('#award_supplier_confirmation').on('change', function (event) {
    const checkboxIscheked = document.getElementById("award_supplier_confirmation").checked;
    if (checkboxIscheked) {
      removeErrorFieldssdsd();
    }
  });
});

const ccsZvalidateStandStillPeriod = (event) => {
    event.preventDefault();

    const radioButtonYes = document.getElementById("standstill_period_yes").checked;
    const radioButtonNo = document.getElementById("standstill_period_no").checked;
    if (radioButtonYes || radioButtonNo) {
        document.forms["ccs_standstill_period_form"].submit();
    }
    else {
        errorStore = ['There is a problem', 'Please select an option']
        ccsZPresentErrorSummary([errorStore]);
    }
};

document.addEventListener('DOMContentLoaded', () => {
  $('.btn_event_managment_award').on('click', function (event) {
    console.log("!!!")
    event.preventDefault();
    const checkboxIscheked = document.getElementById("award_supplier_confirmation").checked;
    if (checkboxIscheked) {
        if ($(this).hasClass('selected')) {
            deselect($(this));
            $(".backdrop-vetting").fadeOut(200);
          } else {
            $(".backdrop-vetting").fadeTo(200, 1);
            let btnSend = document.querySelector('#redirect-button-vetting');
            if (btnSend && this.className != "logo rfp_vetting-popup" && this.className != "govuk-footer__link logo rfp_vetting-popup") {
              btnSend.setAttribute('name', 'Continue');
              $('#redirect-button-vetting').text('Continue')
            } else {
              //btnSend.setAttribute('name', 'CCS website');
              document.body.scrollTop = document.documentElement.scrollTop = 0;
            }
            // $(this).addClass('selected');
            $('.pop').slideFadeToggle();
          }
    }
    else {
      ccsZisOptionChecked("award_supplier_confirmation", "Please confirm that you are ready to award this contract.");
      errorStore = ['award_supplier_confirmation', 'Confirmation checkbox must be checked before progressing']
      ccsZPresentErrorSummary([errorStore]);
      document.getElementById("error-summary-title").innerText = "There has been an error awarding your FC";
    }
    return false;
  });
  
  $(".popupbutton").on('click', function(){ 
    ccsZvalidateAward();  
  });
  
  $('.event_managment_award').on('click', function (event) {
        event.preventDefault();
        const radioButtonYes = document.getElementById("standstill_period_yes").checked;
        const radioButtonNo = document.getElementById("standstill_period_no").checked;
        if (radioButtonYes || radioButtonNo) {
            if ($(this).hasClass('selected')) {
                deselect($(this));
                $(".backdrop-vetting").fadeOut(200);
              } else {
                $(".backdrop-vetting").fadeTo(200, 1);
                let btnSend = document.querySelector('#redirect-button-vetting');
                if (btnSend && this.className != "logo rfp_vetting-popup" && this.className != "govuk-footer__link logo rfp_vetting-popup") {
                  btnSend.setAttribute('name', 'Continue');
                  $('#redirect-button-vetting').text('Continue')
                } else {
                  btnSend.setAttribute('name', 'CCS website');
                  document.body.scrollTop = document.documentElement.scrollTop = 0;
                }
                // $(this).addClass('selected');
                $('.pop').slideFadeToggle();
              }
        }
        else {
            errorStore = ['There is a problem', 'Please select an option']
            ccsZPresentErrorSummary([errorStore]);
        }
        return false;
      });
  
      $('.dialog-close-vetting').on('click', function () {
        $(".backdrop-vetting").fadeOut(200);
        deselect($('.dialog-close-vetting'));
        $('.pop').slideFadeToggle();
        return false;
      });
      $('.dialog-close-nav-menu').on('click', function () {
        $(".backdrop-nav-menu").fadeOut(200);
        deselect($('.dialog-close-nav-menu'));
        return false;
      });

      $('#redirect-button-vetting').on('click', function () {
        $('.rfp_cap').attr('checked', false);
        deselect($('.dialog-close-vetting'));
        $(".backdrop-vetting").fadeOut(200);
        var route = this.name;
        if (route == 'Continue') {
            document.forms["ccs_standstill_period_form"].submit();
        } else {
          return false;
        }
      });

})
const ccsZvalidateCreateOrChoose = (event) => {
  event.preventDefault();

  let fieldCheck = "",
    errorStore = [];

  fieldCheck = ccsZisOptionChecked( "create_or_choose", "Select an option");
  if (fieldCheck !== true) errorStore.push(fieldCheck);

  if (errorStore.length === 0) document.forms["ccs_create_or_choose"].submit();
  else ccsZPresentErrorSummary(errorStore);
};

const ccsZvalidateDaProjectName = (event) => {
    event.preventDefault();
    let fieldCheck = "",
      errorStore = [];
  
    fieldCheck = ccsZvalidateWithRegex("da_projLongName", "Your project must have a name.", /^.+$/);
    if (fieldCheck !== true) errorStore.push(fieldCheck);
  
    if (errorStore.length === 0) document.forms["ccs_da_project_name_form"].submit();
    else ccsZPresentErrorSummary(errorStore);
  };
  
  
  const ccsZCountDaProjectName = (event) => {
    event.preventDefault();
  
    const element = document.getElementById("da_projLongName");
    // if(element.value.length<500)
    // {
      
      let labelElement=document.getElementById("da_label_name_project");
      let count=500-element.value.length;
      labelElement.innerText=count + " remaining of 500";
  };
const ccsZvalidateScore= (event) => {
  event.preventDefault();

  let fieldCheck = "",
    errorStore = [];

  fieldCheck = ccsZvalidateWithRegex("enter_evaluation_score", "Enter Feedback.", /^.+$/);
  if (fieldCheck !== true) errorStore.push(fieldCheck);

  if (errorStore.length === 0) document.forms["enter_evaluation"].submit();
  else ccsZPresentErrorSummary(errorStore);
};

$("#enter_evaluation").submit(function(){
  let errorStore = [];
  let scoreValue = Number(document.getElementById("enter_evaluation_score").value) > 100;
  let error = "";
  let fieldId = document.getElementById("enter_evaluation_score")
  ccsZremoveErrorMessage(fieldId);
  if(scoreValue == true){
    error = ccsZvalidateWithRegex("enter_evaluation_score", "Please enter score between 0 to 100", null);
    if (error !== true) errorStore.push(error);
    // ccsZaddErrorMessage(document.getElementById("enter_evaluation_score"), "Please enter score between 0 to 100");
    // errorStore.push(error);

  }
  if($("#enter_evaluation_score").val() == ''){
     error = ccsZvalidateWithRegex("enter_evaluation_score", "Please enter score between 0 to 100", /^.+$/);
    errorStore.push(error);
  }
  if($("#enter_evaluation_feedback").val() == ''){
     error = ccsZvalidateWithRegex("enter_evaluation_feedback", "Please enter final feedback", /^.+$/);
    errorStore.push(error);
    console.log("errorStore",errorStore);
  }
  if (errorStore.length === 0) {
    document.forms["enter_evaluation"].submit();
  }else { ccsZPresentErrorSummary(errorStore);
  return false;
}
});

const ccsZvalidateFeedback= (event) => {
    event.preventDefault();
  
    let fieldCheck = "",
      errorStore = [];
  
    fieldCheck = ccsZvalidateWithRegex("enter_evaluation_feedback", "Enter Feedback.", /^.+$/);
    if (fieldCheck !== true) errorStore.push(fieldCheck);
  
    if (errorStore.length === 0) document.forms["enter_evaluation"].submit();
    else ccsZPresentErrorSummary(errorStore);
  };
  
  
  const ccsZCountsupplierFeedback = (event) => {
    event.preventDefault();
  
    const element = document.getElementById("enter_evaluation_feedback");
    // if(element.value.length<500)
    // {
      
      let labelElement=document.getElementById("supplierFeedback");
      let count=5000-element.value.length;
      labelElement.innerText=count + " remaining of 5000";
  };

  if(document.getElementById('enter_evaluation_score') !== null) {
    var txt = document.getElementById('enter_evaluation_score');
    txt.addEventListener('keyup', myFunc);
  }
    
    function myFunc(e) {
        var val = this.value;
        var re = /^([0-9]+[\.]?[0-9]?[0-9]?|[0-9]+)$/g;
        var re1 = /^([0-9]+[\.]?[0-9]?[0-9]?|[0-9]+)/g;
        if (re.test(val)) {
            //do something here
    
        } else {
            val = re1.exec(val);
            if (val) {
                this.value = val[0];
            } else {
                this.value = "";
            }
        }
    }

  const ccsZValidateDecimalScore = (event) => {
  };
const ccsZvalidateEoiBudget = event => {
  event.preventDefault();

  let fieldCheck = '',
   fieldChecks = '',
    isError = false,
    errorStore = [];
    const pageHeading = document.getElementById('page-heading').innerHTML;
    
  ccsZremoveErrorMessage($('#eoi_minimum_budget'));
  ccsZremoveErrorMessage($('#eoi_maximum_budget'));

  // fieldCheck = ccsZvalidateWithRegex('eoi_maximum_budget', 'Enter a maximum value with 2 decimals', /^\d{1,}\.\d{2}$/);
  
  if (!pageHeading.includes("(Optional)")) {
  fieldCheck = ccsZvalidateWithRegex('eoi_maximum_budget', 'Enter a maximum value', /^.+$/);
  fieldChecks = ccsZvalidateWithRegex('eoi_maximum_budget','Enter a valid maximum value',/^[+]?(\d*|\d{1,3}(,\d{3})*)(\.\d+)?\b$/);
  }
  
  if (fieldCheck !== true){
    
    if (!pageHeading.includes("(Optional)")) {
    errorStore.push(fieldCheck);
    }

  } 
  else if (fieldChecks !== true) errorStore.push(fieldChecks);
  if ($('#eoi_minimum_budget').val() && $('#eoi_minimum_budget').val().trim().length > 0 && $('#eoi_maximum_budget').val() && $('#eoi_maximum_budget').val().trim().length > 0) {
    fieldCheck = ccsZvalidateWithRegex(
      'eoi_minimum_budget',
      'Enter a minimum value',
      /^.+$/,
    );
    fieldChecks = ccsZvalidateWithRegex(
      'eoi_minimum_budget',
      'Enter a valid minimum value',
      /^[+]?(\d*|\d{1,3}(,\d{3})*)(\.\d+)?\b$/,
    );
    
    if (fieldCheck !== true) {
      errorStore.push(fieldCheck);
    }
    else if (fieldChecks !== true){
      errorStore.push(fieldChecks);
    } 
    else if (Number($('#eoi_maximum_budget').val()) < Number($('#eoi_minimum_budget').val())) {
      errorStore.push(
        ccsZvalidateWithRegex('eoi_minimum_budget', 'Minimum budget should be less than maximum budget', /(?=a)b/),
      );
    }

  }
  if (errorStore.length === 0) {
    document.forms['eoi_budget_form'].submit();
  }
  else {
    ccsZPresentErrorSummary(errorStore);
  }
};

const ccsZvalidateEoiContact = (event) => {
  event.preventDefault();

  let fieldCheck = "",
    errorStore = [];

  fieldCheck = ccsZisOptionChecked( "use_stored_contact", "Select an option");
  if (fieldCheck !== true) errorStore.push(fieldCheck);

  if (errorStore.length === 0) document.forms["ccs_eoi_contact_form"].submit();
  else ccsZPresentErrorSummary(errorStore);
};

const ccsZvalidateEoiDeadline = (event) => {
  event.preventDefault();

  let fieldCheck = "",
    errorStore = [];

  fieldCheck = ccsZvalidateThisDate( "eoi_response_date", "Deadline must be 7 or more days in the future", 1, 7 );
  if (fieldCheck !== true) errorStore.push(fieldCheck);

  fieldCheck = ccsZvalidateWithRegex( "eoi_response_date_time", "Select a time for your EoI deadline", /^.+$/ );
  if (fieldCheck !== true) errorStore.push(fieldCheck);

  if (errorStore.length === 0) document.forms["ccs_eoi_deadline_form"].submit();
  else ccsZPresentErrorSummary(errorStore);
};

const ccsZvalidateEoiIncumbent = (event) => {
  event.preventDefault();

  let fieldCheck = "",
    errorStore = [];

  fieldCheck = ccsZisOptionChecked( "ccs_eoi_incumbent", "Indicate if there is an incumbent supplier");
  if (fieldCheck !== true) {
    errorStore.push(fieldCheck);

  } else {
    ccsZremoveErrorMessage("ccs_eoi_incumbent");
  }

  if ($("input[type='radio'][name='ccs_eoi_incumbent']:checked").val() === "Yes" && document.getElementById("incumbent_supplier").value.trim().length === 0) {
    errorStore.push(["incumbent_supplier", "Provide the name of the incumbent supplier"])
    ccsZaddErrorMessage(document.getElementById("incumbent_supplier"), "Provide the name of the incumbent supplier");
  } else {
    ccsZremoveErrorMessage("incumbent_supplier");
  }

  if (errorStore.length === 0) document.forms["ccs_eoi_incumbent_form"].submit();
  else ccsZPresentErrorSummary(errorStore);
};


document.addEventListener('DOMContentLoaded', () => {

  if (document.getElementById("ccs_eoi_incumbent_form") !== null) {

    if (document.getElementById("ccs_eoi_incumbent-2").checked ||
      (!document.getElementById("ccs_eoi_incumbent-2").checked &&
        !document.getElementById("ccs_eoi_incumbent").checked)) {
      document.getElementById("incumbent_supplier").classList.add('ccs-dynaform-hidden');
      document.querySelector('label[for="incumbent_supplier"]').classList.add('ccs-dynaform-hidden');
    } else {
      let theParentNode = document.getElementById("incumbent_supplier").parentNode;
      theParentNode.classList.add('yes');
      document.getElementById("incumbent_supplier").classList.add('yeswho');
      document.querySelector('label[for="incumbent_supplier"]').classList.add('yeswho');
    }

    document.querySelectorAll('input[name="ccs_eoi_incumbent"]').forEach((elem) => {
      elem.addEventListener("change", function(event) {
        let itemval = event.target.value;


        if (itemval === "Yes" && event.target.checked) {
          document.getElementById("incumbent_supplier").classList.remove('ccs-dynaform-hidden');
          document.querySelector('label[for="incumbent_supplier"]').classList.remove('ccs-dynaform-hidden');

          event.target.parentNode.classList.add('yes');
          document.getElementById("incumbent_supplier").parentNode.classList.add('yeswho');

        } else if (itemval === "No" && event.target.checked){
          document.getElementById("incumbent_supplier").classList.add('ccs-dynaform-hidden');
          document.querySelector('label[for="incumbent_supplier"]').classList.add('ccs-dynaform-hidden');

          document.getElementById("ccs_eoi_incumbent").parentNode.classList.remove('yes');
          document.getElementById("incumbent_supplier").parentNode.classList.remove('yeswho');

          if (document.getElementById("incumbent_supplier-error") !== null) document.getElementById("incumbent_supplier-error").classList.add('ccs-dynaform-hidden');
        }


      });
    });
  }
});

let noLocationTag = "No specific location, for example they can work remotely";

const ccsZvalidateEoiLocation = (event) => {
  event.preventDefault();

  let fieldCheck = "",
    errorStore = [];

  fieldCheck = ccsZisOptionChecked( "required_locations", "You must select at least one region, or the “No specific location...");
  if (fieldCheck !== true) errorStore.push(fieldCheck);

  if (errorStore.length === 0) document.forms["eoi_location"].submit(); //The Location page is mandatory for EOI only
  else ccsZPresentErrorSummary(errorStore);
};

document.addEventListener('DOMContentLoaded', () => {
  // console.log('va from eoi onload>>>>');
  if (document.getElementById("ccs_select_location") !== null || document.getElementById("rfi_location")!==null || document.getElementById("eoi_location")!==null ) {
    nospeclocationCheckboxeseoi = document.querySelectorAll("input[name='required_locations']");
    nospeclocationCheckboxeseoi.forEach((cl) => {
      
      if(cl.value === "No specific location, for example they can work remotely") {
        noLocationtagideoi = cl.id;
        console.log('va from rfi onload>>>>',noLocationtagideoi);
      }
      
    })
    let allCheckbox = document.getElementById(noLocationtagideoi),
      locationCheckboxes = document.querySelectorAll("input[name='required_locations']");

    if (allCheckbox.checked) {
      locationCheckboxes.forEach((cb) => {

        if (cb.value != allCheckbox.value) cb.disabled = true;

      });
    }

    document.getElementById(noLocationtagideoi).addEventListener('change', () => {
      let allCb = document.getElementById(noLocationtagideoi),
        locationCheckboxes = document.querySelectorAll("input[name='required_locations']");
        // console.log('va from eoi>>>>');
      locationCheckboxes.forEach((cb) => {

        if (allCb.checked && cb.value != allCb.value) {
          cb.checked = false;
          cb.disabled = true;
        }

        if (!allCb.checked && cb.value != allCb.value) {
          cb.disabled = false;
        }

      });

    });
  }
});

const ccsZvalidateEoiProjectName = (event) => {
  event.preventDefault();

  let fieldCheck = "",
    errorStore = [];

  fieldCheck = ccsZvalidateWithRegex("eoi_projLongName", "Your project must have a name.", /^.+$/);
  if (fieldCheck !== true) errorStore.push(fieldCheck);

  if (errorStore.length === 0) document.forms["ccs_eoi_project_name_form"].submit();
  else ccsZPresentErrorSummary(errorStore);
};
const ccsZvalidateEoiNeeds = (event) => {
  event.preventDefault();

  let fieldCheck = "",
    errorStore = [];

  fieldCheck = ccsZvalidateTextArea( "eoi_about_cust_org", "Briefly describe your organisation" );
  if (fieldCheck !== true) errorStore.push(fieldCheck);

  fieldCheck = ccsZvalidateTextArea( "eoi_work_objectives", "Briefly describe the aims and objectives of the work" );
  if (fieldCheck !== true) errorStore.push(fieldCheck);

  if (errorStore.length === 0) document.forms["ccs_eoi_needs"].submit();
  else ccsZPresentErrorSummary(errorStore);
};

const ccsZvalidateEoiProject = (event) => {
  event.preventDefault();

  let fieldCheck = "";
  let errorStore = [];
  
  // fieldCheck = ccsZvalidateWithRegex( "rfi_prog_name", "Enter the Project / Programme Name", /^.+$/ );
  // if (fieldCheck !== true) errorStore.push(fieldCheck);

  // fieldCheck = ccsZvalidateTextArea( "rfi_why_this_work", "Describe why this work is required" );
  // if (fieldCheck !== true) errorStore.push(fieldCheck);

  fieldCheck = ccsZvalidateTextArea("eoi_prob_statement", "You must enter information here");
  
  if (fieldCheck !== true) {
    
    errorStore.push(fieldCheck);
  }
  
  // fieldCheck = ccsZvalidateTextArea( "rfi_will_work_on", "Describe the areas or techologies the resource will work on" );
  // if (fieldCheck !== true) errorStore.push(fieldCheck);

  // fieldCheck = ccsZvalidateWithRegex( "rfi_key_users_name", "List the key users", /^.+$/ );
  // if (fieldCheck !== true) errorStore.push(fieldCheck);

  // fieldCheck = ccsZvalidateTextArea( "rfi_key_users_outcomes", "Describe your key outcomes" );
  // if (fieldCheck !== true) errorStore.push(fieldCheck);
  
  if (errorStore.length === 0) {
    document.forms["ccs_eoi_about_proj"].submit();
    }else {
      
      ccsZPresentErrorSummary(errorStore);
    }
};

document.addEventListener('DOMContentLoaded', () => {
  if (document.getElementById('eoi_publish_confirmation') !== null) {
    const checker = document.getElementById('eoi_publish_confirmation');
    checker.addEventListener('change', event => {
      if (event.target.checked) {
        document.getElementById('eoi_btn_publish_now').classList.remove('govuk-button--disabled');
        document.getElementById('eoi_btn_publish_now').removeAttribute('disabled');
        document.getElementById('eoi_btn_publish_now').removeAttribute('aria-disabled');
      } else {
        document.getElementById('eoi_btn_publish_now').classList.add('govuk-button--disabled');
        document.getElementById('eoi_btn_publish_now').setAttribute('disabled', true);
        document.getElementById('eoi_btn_publish_now').setAttribute('aria-disabled', true);
      }
    });
  }
});

const ccsZvalidateEoiSecurity1 = (event) => {
  event.preventDefault();

  // let { fieldCheck, errorStore } = initializeErrorStoreForFieldCheck(event);

  // fieldCheck = ccsZisOptionChecked( "ccs_vetting_type", "You must provide a security clearance level before proceeding");
  // if (fieldCheck !== true) errorStore.push(fieldCheck);

  // if (errorStore.length === 0) document.forms["ccs_eoi_vetting_form"].submit();
  // else ccsZPresentErrorSummary(errorStore);
};

const ccsZvalidateLogin = (event) => {
  event.preventDefault();

  let fieldCheck = "",
    errorStore = [];

  fieldCheck = ccsZvalidateWithRegex( "user_email", "Enter a valid email address", /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/ );
  if (fieldCheck !== true) errorStore.push(fieldCheck);

  fieldCheck = ccsZvalidateWithRegex( "_user_pwd", "Enter a password", /^.+$/ );
  if (fieldCheck !== true) errorStore.push(fieldCheck);

  if (errorStore.length === 0) document.forms["ccs_login"].submit();
  else ccsZPresentErrorSummary(errorStore);
};

const ccsZvalidateRfiAddress = (event) => {
  event.preventDefault();

  let fieldCheck = "",
    errorStore = [],
    addyLineOne = document.getElementById("rfi_proj_address-line-1").value,
    addyTown = document.getElementById("rfi_proj_address-town").value,
    addyPostCode = document.getElementById("rfi_proj_address-postcode").value;

  if (addyLineOne !== "" || addyTown !== "" || addyPostCode !== "") {

    fieldCheck = ccsZvalidateWithRegex( "rfi_proj_address-line-1", "Specify the building and street", /^.+$/ );
    if (fieldCheck !== true) errorStore.push(fieldCheck);

    fieldCheck = ccsZvalidateWithRegex( "rfi_proj_address-town", "Specify the town or city", /^[A-Z|a-z| ]+$/ );
    if (fieldCheck !== true) errorStore.push(fieldCheck);

    fieldCheck = ccsZvalidateWithRegex( "rfi_proj_address-postcode", "Enter a valid postcode", /A([Gg][Ii][Rr] 0[Aa]{2})|((([A-Za-z][0-9]{1,2})|(([A-Za-z][A-Ha-hJ-Yj-y][0-9]{1,2})|(([A-Za-z][0-9][A-Za-z])|([A-Za-z][A-Ha-hJ-Yj-y][0-9][A-Za-z]?))))\s?[0-9][A-Za-z]{2})$/ );
    if (fieldCheck !== true) errorStore.push(fieldCheck);

  }

  if (errorStore.length === 0) document.forms["ccs_rfi_address_form"].submit();
  else ccsZPresentErrorSummary(errorStore);
};

const ccsZvalidateRfiDates = (event) => {
  event.preventDefault();

  let fieldCheck = "",
    endDateStore = [],
    errorStore = [];

  fieldCheck = ccsZvalidateThisDate( "rfi_proj_start_date", "Service Start Date must be a valid future date", 1, 0 );
  if (fieldCheck !== true) errorStore.push(fieldCheck);

  fieldCheck = ccsZvalidateWithRegex( "rfi_proj_duration_number", "Specify the project duration", /^.+$/ );
  if (fieldCheck !== true) endDateStore.push(fieldCheck);

  fieldCheck = ccsZvalidateThisDate( "rfi_proj_end_date", "Service End Date must be a valid future date", 1, 0 );
  if (fieldCheck !== true) endDateStore.push(fieldCheck);

  if (endDateStore.length === 2) {
    errorStore.push(["rfi_proj_duration_number", "One of either project duration or project end date must be specified"]);
  } else if (document.getElementById("rfi_proj_duration_number").value < 1) {
    errorStore.push(["rfi_proj_duration_number", "Project end date must be after project start date"]);
  }

  if (errorStore.length === 0) document.forms["ccs_rfi_dates_form"].submit();
  else ccsZPresentErrorSummary(errorStore);
};
const ccsZvalidateRfiResponseDate = (event) => {
  event.preventDefault();

  let fieldCheck = "",
    endDateStore = [],
    errorStore = [];

  fieldCheck = ccsZvalidateThisDate( "rfi_response_date", "Response date must be a valid future date", 1, 0 );
  if (fieldCheck !== true) errorStore.push(fieldCheck);

  if (errorStore.length === 0) document.forms["ccs_rfi_response_date_form"].submit();
  else ccsZPresentErrorSummary(errorStore);
};
noLocationTag = "No specific location, for example they can work remotely";



document.addEventListener('DOMContentLoaded', () => {

  if (document.getElementById("ccs_select_location") !== null || document.getElementById("rfi_location")!==null || document.getElementById("rfi_location")!==null ) {
    // console.log('va from rfi onload>>>>');
    nospeclocationCheckboxes = document.querySelectorAll("input[name='required_locations']");
    nospeclocationCheckboxes.forEach((cl) => {
      
      if(cl.value === "No specific location, for example they can work remotely") {
        noLocationtagid = cl.id;
        // console.log('va from rfi onload>>>>',noLocationtagid);
      }
      
    })
    let allCheckbox = document.getElementById(noLocationtagid),
      locationCheckboxes = document.querySelectorAll("input[name='required_locations']");

    if (allCheckbox.checked) {
      locationCheckboxes.forEach((cb) => {

        if (cb.value != allCheckbox.value) cb.disabled = true;

      });
    }

    document.getElementById(noLocationtagid).addEventListener('change', () => {
      let allCb = document.getElementById(noLocationtagid),
        locationCheckboxes = document.querySelectorAll("input[name='required_locations']");
      // console.log('va from rfi>>>>');
      locationCheckboxes.forEach((cb) => {

        if (allCb.checked && cb.value != allCb.value) {
          cb.checked = false;
          cb.disabled = true;
        }

        if (!allCb.checked && cb.value != allCb.value) {
          cb.disabled = false;
        }

      });

    });
  }
});

const ccsZvalidateRfiProjectName = (event) => {
  event.preventDefault();

  let fieldCheck = "",
    errorStore = [];

      var rfi_projLongName=$('#rfi_projLongName').val();
      if(rfi_projLongName==''){
        fieldCheck = ccsZvalidateWithRegex("rfi_projLongName", "Enter the name of your project.", /^.+$/);
        errorStore.push(fieldCheck);
      }

  
  // if (fieldCheck !== true) errorStore.push(fieldCheck);
  if (errorStore.length === 0) document.forms["ccs_rfi_project_name_form"].submit();
  else ccsZPresentErrorSummary(errorStore);
};


const ccsZCountRfiProjectName = (event) => {
  event.preventDefault();

  // const element = document.getElementById("rfi_projLongName");
  // // if(element.value.length<500)
  // // {
    
  //   let labelElement=document.getElementById("rfi_label_name_project");
  //   let count=250-element.value.length;
  //   labelElement.innerText=count + " remaining of 250";
};
const ccsZvalidateRfiProject = (event) => {
  event.preventDefault();

  let fieldCheck = "",
    errorStore = [];

  fieldCheck = ccsZvalidateTextArea("rfi_prob_statement", "You must add background information about your procurement");
  if (fieldCheck !== true && fieldCheck !== undefined) errorStore.push(fieldCheck);

  if (errorStore.length === 0) document.forms["ccs_rfi_about_proj"].submit();
  else ccsZPresentErrorSummary(errorStore);
};

const ccsZCountRfiProject = (event) => {
  //debugger;
  event.preventDefault();

  const element = document.getElementById("rfi_prob_statement");
  // if(element.value.length<500)
  // {
    
    let labelElement=document.getElementById("rfi_label_prob_statement");
    let maxlength = element.getAttribute("maxlength");
    let count=maxlength-element.value.length;
    labelElement.innerText=count + " remaining of "+maxlength;
    //labelElement.classList.remove('ccs-dynaform-hidden')
  // }
  // else
  // {

  // }
};

const ccsZvalidateRfiProjectStatus = (event) => {
  event.preventDefault();

  let fieldCheck = "",
    errorStore = [];

    fieldCheck = ccsZvalidateWithRegex( "rfi_prog_phase", "Enter the current phase of your project", /^.+$/ );
    if (fieldCheck !== true) errorStore.push(fieldCheck);

    fieldCheck = ccsZvalidateWithRegex( "rfi_prog_phase_req", "Specify the phase that the resource will work on", /^.+$/ );
    if (fieldCheck !== true) errorStore.push(fieldCheck);

    // fieldCheck = ccsZvalidateTextArea( "rfi_work_to_date", "Describe the work carried out to date on the problem" );
    // if (fieldCheck !== true) errorStore.push(fieldCheck);

    fieldCheck = ccsZvalidateTextArea( "rfi_engagement_to_date", "Describe any market engagement carried out to date" );
    if (fieldCheck !== true) errorStore.push(fieldCheck);

    fieldCheck = ccsZvalidateWithRegex( "rfi_work_arrangements", "Specify the working arrangements", /^.+$/ );
    if (fieldCheck !== true) errorStore.push(fieldCheck);

  if (errorStore.length === 0) {
    document.forms["ccs_rfi_proj_status"].submit();
  }
  else ccsZPresentErrorSummary(errorStore);
};

const ccsZvalidateRfiDocs = (event) => {
    event.preventDefault();
  
    let fieldCheck = "",
      errorStore = [];
  
    if (document.getElementById("rfi_file_upload_1").value.length > 0) {
      fieldCheck = ccsZvalidateWithRegex( "rfi_file_upload_1", "Document must be a Word or Acrobat file",         /^(\w|\W)+\.(docx?|pdf)$/);
      if (fieldCheck !== true) errorStore.push(fieldCheck);
    }
  
    if (document.getElementById("rfi_additional_link").value.length > 0) {
      fieldCheck = ccsZvalidateWithRegex( "rfi_additional_link", "Please enter a valid link",  /^(http:\/\/www\.|https:\/\/www\.|http:\/\/|https:\/\/)?[a-z0-9]+([\-\.]{1}[a-z0-9]+)*\.[a-z]{2,5}(:[0-9]{1,5})?(\/.*)?$/);
      if (fieldCheck !== true) errorStore.push(fieldCheck);
    }
  
    if (errorStore.length === 0) document.forms["ccs_rfi_docs_form"].submit();
    else ccsZPresentErrorSummary(errorStore);
  };

  

  

  let inputLinks = $('#rfi_additional_link');
  inputLinks.on('keypress', ()=>{
    if(inputLinks.val() !== ""){
      $('#upload_doc_form').fadeOut();
    }
  })

  inputLinks.on('blur', ()=>{
    if(inputLinks.val() === ""){
      $('#upload_doc_form').fadeIn();
    }
  })

const ccsZvalidateRfiWho = (event) => {
  event.preventDefault();

  let fieldCheck = "",
    errorStore = [];

  fieldCheck = ccsZvalidateWithRegex( "rfi_contracting_auth", "Specify the contracting authority", /^.+$/ );
  if (fieldCheck !== true) errorStore.push(fieldCheck);

  if (errorStore.length === 0) document.forms["ccs_rfi_who_form"].submit();
  else ccsZPresentErrorSummary(errorStore);
};

const ccsZCountRfiWho = (event) => {
  //debugger;
  event.preventDefault();

  const element = document.getElementById("rfi_contracting_auth");
  // if(element.value.length<500)
  // {
    
    let labelElement=document.getElementById("rfi_label_contracting_auth");
    let count=500-element.value.length;
    labelElement.innerText=count + " remaining of 500";
    //labelElement.classList.remove('ccs-dynaform-hidden')
  // }
  // else
  // {

  // }
};

const ccsZvalidateRfPAboutBG = event => {
  event.preventDefault();
  
  let fieldCheck = '',
    errorStore = [];

  if ($('#rfp_prob_statement_1').data('mandatory') == true) {
    fieldCheck = ccsZvalidateTextArea('rfp_prob_statement_1', 'You must enter information here');
    if (fieldCheck !== true) errorStore.push(fieldCheck);
  }
  if ($('#rfp_prob_statement_2').length > 0) {
    fieldCheck = ccsZvalidateTextArea('rfp_prob_statement_2', 'You must enter information here');
    if (fieldCheck !== true) errorStore.push(fieldCheck);
  }

  if (errorStore.length === 0) document.forms['ccs_rfp_about_proj'].submit();
  else ccsZPresentErrorSummary(errorStore);
};

const ccsZvalidateTextRfpChangeStrategy = event => {
  event.preventDefault();
  const classList = document.getElementsByClassName('govuk-hint-error-message');
  const classLength = classList.length;
  const pageHeading = document.getElementById('page-heading').innerHTML;
  errorStore = [];
  console.log("First",$('#rfp_contracting_auth').val());

  if ($('#rfp_contracting_auth').val() != undefined && $('#rfp_contracting_auth').val().length == 0 && (!pageHeading.includes("(Optional)") && !pageHeading.includes("(optional)"))) {
    if(pageHeading.trim().toLowerCase() == 'Summary of work'.toLowerCase()){
      fieldCheck = ccsZvalidateTextArea('rfp_contracting_auth', 'Enter your project summary ');
    }else{
      fieldCheck = ccsZvalidateTextArea('rfp_contracting_auth', 'You must enter information here');
    }
    if (fieldCheck !== true) errorStore.push(fieldCheck);
  }

    

  if (errorStore.length > 0) {
      ccsZPresentErrorSummary(errorStore);
      ccsZaddErrorMessage('#ccs_rfp_who_form', 'Supplier must be minimum 3');
  } else {
    errorStore = [];
    document.forms['ccs_rfp_who_form'].submit();
  }
  if (classLength != 0) {
    
    return false;
  }
};

let notApplicableTag = "No specific location, for example they can work remotely";

document.addEventListener('DOMContentLoaded', () => {
  let noLocationtagid;
  // console.log('va from rfi onload>>>>');
  nospeclocationCheckboxes = document.querySelectorAll("input[name='required_locations']");
  nospeclocationCheckboxes.forEach((cl) => {
    console.log("cl.value",cl.value);
    if(cl.value === "No specific location (for example they can work remotely)") {
      noLocationtagid = cl.id;
      // console.log('va from rfi onload>>>>',noLocationtagid);
    }
    
  })
  if (noLocationtagid !== undefined) {
    let allCheckbox = document.getElementById(noLocationtagid),
      locationCheckboxes = document.querySelectorAll("input[name='required_locations']");

    if (allCheckbox.checked) {
      locationCheckboxes.forEach((cb) => {

        if (cb.value != allCheckbox.value) cb.disabled = true;

      });
    }
  }


  if (document.getElementById("rfp_location") !== null) {
    
    var chkds = $("input[name='required_locations']:checkbox");

    if (document.querySelector(".dos6_vetting_change") !== null) {
    if(document.querySelector(".dos6_vetting_change").checked){
      console.log("CHECKEDDD BY LAST")
      const elementsTemp = document.querySelectorAll(".dos6_vetting");
      elementsTemp.forEach(function (elementsTemp) {
        elementsTemp.checked = false;
        elementsTemp.disabled = true;
        //$('#rfp_prob_statement_s').val('');
     $('.main_rfp_prob_statement_s').hide();
       });
    }else{

      if (chkds.is(":checked"))  {
        $('.main_rfp_prob_statement_s').fadeIn();
      } else {
        
          $('.main_rfp_prob_statement_s').hide();
        }
    }
  }


   
      
    
   
    // if(document.querySelector("#required_locations").checked){
      
    //   $('.main_rfp_prob_statement_s').fadeIn();
    // }else{
      
    //   $('.main_rfp_prob_statement_s').hide();
    // }
  
    // if(document.querySelector("#required_locations").checked){
    //   $('.main_rfp_prob_statement_s').fadeIn();
     
    // }else{
      
    //   $('.main_rfp_prob_statement_s').hide();
    // }


  }
})

$('input[type="checkbox"]').on('change', function(e) {
  var val = [];
        $(':checkbox:checked').each(function(i){
          val[i] = $(this).val();
        });

  if (val.includes("No security clearance needed")) {
    $('.main_rfp_prob_statement_s').hide();
  }
  else if (val == "") {
    $('.main_rfp_prob_statement_s').hide();
  }
  else{
    //$('#rfp_prob_statement_s').val('');
    $('.main_rfp_prob_statement_s').fadeIn();
  }
});

if(document.querySelector(".dos6_vetting_change")){
  
  document.querySelector(".dos6_vetting_change").onchange = function (e) {
    // some things
    
    const elements = document.querySelectorAll(".dos6_vetting");
    if(this.checked){
      elements.forEach(function (element) {
       element.checked = false;
       element.disabled = true;
       //$('#rfp_prob_statement_s').val('');
    $('.main_rfp_prob_statement_s').hide();
      });
    }else{
      $('#rfp_prob_statement_s').val('');
      elements.forEach(function (element) {
       element.disabled = false;
      });
    }
    
  }
}


const ccsZvalidateRfpLocation = (event) => {
  event.preventDefault();
  var urlParams = new URLSearchParams(window.location.search);
  var agreement_id = urlParams.get("agreement_id");
  var group_id = urlParams.get("group_id");
  let fieldCheck = "", errMsg ="", errorStore = [];
  
  let hiddenagreement_id=document.getElementById("agreement_id");
  if(hiddenagreement_id!==null)
  {
    if(hiddenagreement_id.value !='RM1043.8'){
      errMsg = "You must select at least one region where your staff will be working, or  the “No specific location”";
    }
}


    
  let hiddenQuestionElement=document.getElementById("question_id");
  if(hiddenQuestionElement!==null)
  {
    if(hiddenQuestionElement.value=="Question 10")
    {
      errMsg="You must select which project phases you need resource for, or confirm if this does not apply to your project.";
    }
  }
 
  console.log("hiddenagreement_id.value",hiddenagreement_id.value);
  if(hiddenagreement_id.value =='RM1043.8'){
    
    if(document.querySelector("#required_locations").checked){
      var getStatement = $('#rfp_prob_statement_s').val()
      console.log("getStatement",getStatement);
      if(getStatement==''){
       
       // fieldCheck = ccsZisOptionChecked("rfp_prob_statement_s", 'PLease enter the information');
      //   fieldCheck = ["rfp_prob_statement_s","Please enter the information"]
      // console.log("fieldCheck",fieldCheck)
      //    errorStore.push(fieldCheck);
      //   console.log("fieldCheck length",errorStore)
      //   ccsZPresentErrorSummary(errorStore);

          
       //The Location page is mandatory 
     
       document.forms["rfp_location"].submit();

      }else{
       
        document.forms["rfp_location"].submit(); //The Location page is mandatory 
      }
      
    }else{
      const pageHeading = document.getElementById('page-heading').innerHTML;
      

      if (!pageHeading.includes("(Optional)")) {
       
        
         //const lotid = document.getElementById('LotID').value;
         const lotid = document.getElementById('lID').value;
        console.log("lotid",lotid);

//LOT 1 Group 5 Group 11
//LOT 2 Group 4 Group 9

console.log("group_id",group_id);

        if (agreement_id=='RM1043.8' && group_id=='Group 5' && lotid=='1') {
          errMsg = "Select the locations where staff will work";
        }else if (agreement_id == 'RM1043.8' && group_id == 'Group 9' && lotid=='3') {
          errMsg = "Select at least one way you will assess suppliers, or “None”";
        }else if (agreement_id == 'RM1043.8' && group_id == 'Group 16') {
          errMsg = "Select the needed security levels or “No security clearance needed”";
        }else if (agreement_id == 'RM1043.8' && group_id == 'Group 11' && lotid=='1') {
          errMsg = "Select at least one way you will assess suppliers, or “None”";
        }else if (agreement_id == 'RM1043.8' && group_id == 'Group 4' && lotid=='3') {
          errMsg = "You must select at least one region where the research will be taking place, or  “International (outside the UK)”";
        }
        else {
          errMsg=" Please select the checkbox.";
        }
        
        fieldCheck = ccsZisOptionChecked("required_locations",errMsg );
      if (fieldCheck !== true) errorStore.push(fieldCheck);
      if (errorStore.length === 0) 
      document.forms["rfp_location"].submit(); //The Location page is mandatory 
      else ccsZPresentErrorSummary(errorStore);

      }else{
       document.forms["rfp_location"].submit();
      }
       //The Location page is mandatory 
    }

   
  }else{
      fieldCheck = ccsZisOptionChecked("required_locations",errMsg );
      if (fieldCheck !== true) errorStore.push(fieldCheck);
      if (errorStore.length === 0) 
      document.forms["rfp_location"].submit(); //The Location page is mandatory 
      else ccsZPresentErrorSummary(errorStore);
  }

};

const ccsZvalidateChangeRfpLocation = (event) => {
  // validation for these inputs only
  event.preventDefault();
  let inputs;
  let container = document.getElementById('rfp_location');
  // let noApplicable = document.getElementById('required_locations-6');
  // inputs = container.getElementsByTagName('input');
  // for (let index = 0; index < inputs.length; ++index) {
  //   if (event.target.id !== 'required_locations-6')
  //     if(noApplicable && noApplicable.checked) noApplicable.checked = false;
  //   if (event.target.id === 'required_locations-6') {
  //     if (inputs[index].id !== 'required_locations-6')
  //       inputs[index].checked = false;
  //   }
  // }

}



document.addEventListener('DOMContentLoaded', () => {

  if (document.getElementById("rfp_location") !== null) {

    let allCheckbox = document.getElementById("required_locations-14"),
      locationCheckboxes = document.querySelectorAll("input[name='required_locations']");

    if (allCheckbox && allCheckbox.checked) {
      locationCheckboxes.forEach((cb) => {

        if (cb.value != notApplicableTag) cb.disabled = true;

      });
    }

    if(document.getElementById("required_locations-14")){
    document.getElementById("required_locations-14").addEventListener('change', () => {
      let allCb = document.getElementById("required_locations-14"),
        locationCheckboxes = document.querySelectorAll("input[name='required_locations']");

      locationCheckboxes.forEach((cb) => {

        if (allCb.checked && cb.value != notApplicableTag) {
          cb.checked = false;
          cb.disabled = true;
        }

        if (!allCb.checked && cb.value != notApplicableTag) {
          cb.disabled = false;
        }

      });

    });
    }
  }
});

var errorStore = [];
let words = '';
let char = '';
const textPattern = /^[a-zA-Z ]+$/;
const condLength = (text) => {
  char = text.trim().length > 10000;

  return char;
}

const wordLength = (text) => {
  words = text.trim().split(/\s+/).length > 25;
  char = text.trim().length > 250;
  if (words) return words;
  return char;
}

const ccsZvalidateRfpChangeStrategy = event => {
  event.preventDefault();

}
const removeErrorFieldsRfpStar = () => {
  $('.govuk-error-message').remove();
  $('.govuk-form-group--error').removeClass('govuk-form-group--error')
  $('.govuk-error-summary').remove();
  $(".govuk-input").removeClass("govuk-input--error");
  $('.govuk-form-group textarea').removeClass('govuk-textarea--error');

}

document.addEventListener('DOMContentLoaded', () => {
  if (document.getElementById("ccs_rfp_exit_strategy_form") !== null || document.getElementById("ccs_eoi_vetting_form") !== null) {
    if (document.getElementById("rfp_security_confirmation") !== undefined && document.getElementById("rfp_security_confirmation") !== null && document.getElementById("rfp_security_confirmation").value != '') {
      $('#conditional-rfp_radio_security_confirmation').fadeIn();
    } else {
      $('#conditional-rfp_radio_security_confirmation').hide();
    }
  }
})

const ccsZvalidateRfPStrategy = event => {
  event.preventDefault();
  let fieldCheck = '';
  errorStore.length = 0;
  const pageHeading = document.getElementById('page-heading').innerHTML;
  var urlParams = new URLSearchParams(window.location.search);
  var agreement_id = urlParams.get("agreement_id");
  var group_id = urlParams.get("group_id");


  if ($('#ccs_vetting_type') !== undefined) {
    var listofRadionButton = document.querySelectorAll('.govuk-radios__input');
    let ischecked = false;
    listofRadionButton.forEach(element => {
      if (element.type === 'radio' && element.checked) {
        ischecked = true;
      }
    });
    if (!ischecked) {
      fieldCheck = ccsZisOptionChecked("ccs_vetting_type", "Please select an option");
      if (fieldCheck !== true && fieldCheck !== undefined) errorStore.push(fieldCheck);
    }
  }

  if ($('#rfp_prob_statement_t') !== undefined && $('#rfp_prob_statement_t').val() !== undefined) {
    if (!pageHeading.includes("(Optional)")) {
      if ($('#rfp_prob_statement_t').val().length === 0) {
        fieldCheck = ccsZvalidateTextArea('rfp_prob_statement_t', 'You must enter information here');
        if (fieldCheck !== true) errorStore.push(fieldCheck);
      }
    }
    if (condLength($('#rfp_prob_statement_t').val())) {
      const msg = char ? 'Entry must be <= 10000 characters' : 'Entry must be <= 500 words';
      fieldCheck = ccsZvalidateTextArea('rfp_prob_statement_t', msg, !condLength($('#rfp_prob_statement_t').val()));
      if (fieldCheck !== true) errorStore.push(fieldCheck);
    }
  }

  if ($('#rfp_prob_statement_m') !== undefined && $('#rfp_prob_statement_m').val() !== undefined) {
    if (!pageHeading.includes("(Optional)")) {
      if ($('#rfp_prob_statement_m').val().length === 0) {
        if(agreement_id == "RM1043.8" && group_id == "Group 13"){
          fieldCheck = ccsZvalidateTextArea('rfp_prob_statement_m', 'Enter the details of your existing team');
        }
        else{
        fieldCheck = ccsZvalidateTextArea('rfp_prob_statement_m', 'You must enter information here');
        }
        if (fieldCheck !== true) errorStore.push(fieldCheck);
      }
    }
    if (condLength($('#rfp_prob_statement_m').val())) {
      const msg = char ? 'Entry must be <= 5000 characters' : 'Entry must be <= 500 words';
      fieldCheck = ccsZvalidateTextArea('rfp_prob_statement_m', msg, !condLength($('#rfp_prob_statement_m').val()));
      if (fieldCheck !== true) errorStore.push(fieldCheck);
    }
  }

  if ($('#rfp_prob_statement_n') !== undefined && $('#rfp_prob_statement_n').val() !== undefined) {
      if (!pageHeading.includes("(Optional)")) {
        if ($('#rfp_prob_statement_n').val().length === 0) {
          fieldCheck = ccsZvalidateTextArea('rfp_prob_statement_n', 'You must enter information here');
          if (fieldCheck !== true) errorStore.push(fieldCheck);
        }
      }
      if (condLength($('#rfp_prob_statement_n').val())) {
        const msg = char ? 'Entry must be <= 5000 characters' : 'Entry must be <= 500 words';
        fieldCheck = ccsZvalidateTextArea('rfp_prob_statement_n', msg, !condLength($('#rfp_prob_statement_n').val()));
        if (fieldCheck !== true) errorStore.push(fieldCheck);
      }
    } 
  
  if ($('#rfp_prob_statement_g') !== undefined && $('#rfp_prob_statement_g').val() !== undefined) {
      if (!pageHeading.includes("(Optional)")) {
        if ($('#rfp_prob_statement_g').val().length === 0) {
          if(pageHeading.trim().toLowerCase() == 'The business problem you need to solve'.toLowerCase()){
            fieldCheck = ccsZvalidateTextArea('rfp_prob_statement_g', 'Enter the business problem you need to solve');
          }else{
            fieldCheck = ccsZvalidateTextArea('rfp_prob_statement_g', 'You must enter information here');
          }
          if (fieldCheck !== true) errorStore.push(fieldCheck);
        }
      }
      if (condLength($('#rfp_prob_statement_g').val())) {
        const msg = char ? 'Entry must be <= 5000 characters' : 'Entry must be <= 500 words';
        fieldCheck = ccsZvalidateTextArea('rfp_prob_statement_g', msg, !condLength($('#rfp_prob_statement_g').val()));
        if (fieldCheck !== true) errorStore.push(fieldCheck);
      }
    } 
    
  if ($('#rfp_prob_statement_s') !== undefined && $('#rfp_prob_statement_s').val() !== undefined) {

    if (condLength($('#rfp_prob_statement_s').val())) {
      const msg = char ? 'Entry must be <= 10000 characters' : 'Entry must be <= 500 words';
      fieldCheck = ccsZvalidateTextArea('rfp_prob_statement_s', msg, !condLength($('#rfp_prob_statement_s').val()));
      if (fieldCheck !== true) errorStore.push(fieldCheck);
    }
  }
  
  if ($('#rfp_prob_statement_s') !== undefined && $('#rfp_prob_statement_s').val() !== undefined && !pageHeading.includes("(Optional)") && agreement_id !== "RM6187") {
    if ($('#rfp_prob_statement_s').val().length === 0 && pageHeading.includes("Number of research rounds")) {

      fieldCheck = ccsZvalidateTextArea('rfp_prob_statement_s', 'Enter the number of research round');
      if (fieldCheck !== true) errorStore.push(fieldCheck);
    }
    else if ($('#rfp_prob_statement_s').val().length === 0 && pageHeading.includes("Number of participants per round")) {

      fieldCheck = ccsZvalidateTextArea('rfp_prob_statement_s', 'Enter the number of participants per rounds');
      if (fieldCheck !== true) errorStore.push(fieldCheck);
    }
    else if ($('#rfp_prob_statement_s').val().length === 0 && pageHeading.includes("Research dates")) {

      fieldCheck = ccsZvalidateTextArea('rfp_prob_statement_s', 'Enter research dates');
      if (fieldCheck !== true) errorStore.push(fieldCheck);
    }
    else if ($('#rfp_prob_statement_s').val().length === 0 && pageHeading.includes("Description of your participants")) {

      fieldCheck = ccsZvalidateTextArea('rfp_prob_statement_s', 'Enter description of your participants');
      if (fieldCheck !== true) errorStore.push(fieldCheck);
    }else {
      fieldCheck = ccsZvalidateTextArea('rfp_prob_statement_s', 'Enter details of your working arrangements');
      if (fieldCheck !== true) errorStore.push(fieldCheck);
    }
  }
  if ($('#rfp_prob_statement_s') !== undefined && $('#rfp_prob_statement_s').val() !== undefined && !pageHeading.includes("(Optional)") &&!pageHeading.includes('Management information and reporting requirements')&& agreement_id === "RM6187") {
    if ($('#rfp_prob_statement_s').val().length === 0) {

      fieldCheck = ccsZvalidateTextArea('rfp_prob_statement_s', 'You must enter the social value, economic and environmental benefits');
      if (fieldCheck !== true) errorStore.push(fieldCheck);
    }
  }
  if ($('#rfp_prob_statement_s') !== undefined && $('#rfp_prob_statement_s').val() !== undefined && !pageHeading.includes("(Optional)") && pageHeading.includes('Management information and reporting requirements')&& agreement_id === "RM6187") {
    if ($('#rfp_prob_statement_s').val().length === 0) {

      fieldCheck = ccsZvalidateTextArea('rfp_prob_statement_s', 'You must enter your information and requirements');
      if (fieldCheck !== true) errorStore.push(fieldCheck);
    }
  }
  

  if ($('#rfp_prob_statement_d') !== undefined && $('#rfp_prob_statement_d').val() !== undefined) {
      if (!pageHeading.includes("(Optional)")) {
        if ($('#rfp_prob_statement_d').val().length === 0) {
          fieldCheck = ccsZvalidateTextArea('rfp_prob_statement_d', 'You must add background information about your procurement');
          if (fieldCheck !== true) errorStore.push(fieldCheck);
        }
      }
      if ($('#rfp_prob_statement_d').val().length > 500) {
        fieldCheck = ccsZvalidateTextArea('rfp_prob_statement_d', 'You must enter less than 500 characters');
        if (fieldCheck !== true) errorStore.push(fieldCheck);
      }
  }

  if ($('#rfp_prob_statement_r') !== undefined && $('#rfp_prob_statement_r').val() !== undefined) {
    errorStore = [];
    if (!pageHeading.includes("(Optional)")) {
      if ($('#rfp_prob_statement_r').val().length === 0) {

        fieldCheck = ccsZvalidateTextArea('rfp_prob_statement_r', 'You must enter information here');
        if (fieldCheck !== true) errorStore.push(fieldCheck);
      }

    }
    if ($('#rfp_prob_statement_r').val().length > 10000 ) {

      fieldCheck = ccsZvalidateTextArea('rfp_prob_statement_r', 'You must enter less than 10000 characters',false);
      if (fieldCheck !== true) errorStore.push(fieldCheck);
    }
  }
  
  if ($('#rfp_security_confirmation') !== undefined && $('#rfp_security_confirmation').val() !== undefined && $("input[name='ccs_vetting_type']").prop('checked')) {
    // errorStore.length = 0;
    
    if ($('#rfp_security_confirmation').val().length === 0) {
      fieldCheck = ccsZvalidateTextArea('rfp_security_confirmation', 'Provide the name of the incumbent supplier');
      if (fieldCheck !== true) errorStore.push(fieldCheck);
    }
    else if ($('#rfp_security_confirmation').val().length > 500) {
      fieldCheck = ccsZvalidateTextArea('rfp_security_confirmation', 'supplier name must be less than 500 characters');
      if (fieldCheck !== true) errorStore.push(fieldCheck);
    }
    // else if (textPattern.test($('#rfp_security_confirmation').val())) {
    //   if (wordLength($('#rfp_security_confirmation').val())) {
    //     const msg = char ? 'Entry must be <= 250 characters' : 'Entry must be <= 25 words';
    //     fieldCheck = ccsZvalidateTextArea('rfp_security_confirmation', msg, !wordLength($('#rfp_security_confirmation').val()));
    //     if (fieldCheck !== true) errorStore.push(fieldCheck);
    //   }
    // }
    // else if (!textPattern.test($('#rfp_security_confirmation').val())) {
    //   fieldCheck = ccsZvalidateTextArea('rfp_security_confirmation', 'You must enter characters here', false);
    //   if (fieldCheck !== true) errorStore.push(fieldCheck);
    // }
  }
  if ($('#rfp_prob_statement_e') !== undefined && $('#rfp_prob_statement_e').val() !== undefined) {
    
    if (!pageHeading.includes("(optional)") && !pageHeading.includes("(Optional)") && agreement_id !== "RM6187") {
      if ($('#rfp_prob_statement_e').val().length === 0) {
        if(pageHeading.trim().toLowerCase() == 'Why the work is being done'.toLowerCase()){
          fieldCheck = ccsZvalidateTextArea('rfp_prob_statement_e', 'Enter the reason for doing the work ');
        }else{
          fieldCheck = ccsZvalidateTextArea('rfp_prob_statement_e', 'You must enter information here');
        }
        if (fieldCheck !== true) errorStore.push(fieldCheck);
      }
    }

    if (!pageHeading.includes("(optional)") && !pageHeading.includes("(Optional)")  && agreement_id === "RM6187") {
      if (!pageHeading.includes('Management information and reporting requirements') && !pageHeading.includes('The business need')){
        if ($('#rfp_prob_statement_e').val().length === 0) {
          fieldCheck = ccsZvalidateTextArea('rfp_prob_statement_e', 'You must add background information about your procurement');
          if (fieldCheck !== true) errorStore.push(fieldCheck);
        }
      }
      else if(!pageHeading.includes('The business need') && !pageHeading.includes('Add background to your procurement')){
        if ($('#rfp_prob_statement_e').val().length === 0) {
          fieldCheck = ccsZvalidateTextArea('rfp_prob_statement_e', 'You must enter your information and requirements');
          if (fieldCheck !== true) errorStore.push(fieldCheck);
        }
      }
      else if(!pageHeading.includes('Management information and reporting requirements') && !pageHeading.includes('Add background to your procurement')){
        if ($('#rfp_prob_statement_e').val().length === 0) {
          fieldCheck = ccsZvalidateTextArea('rfp_prob_statement_e', 'You must enter the business need');
          if (fieldCheck !== true) errorStore.push(fieldCheck);
        }
      }
      
    }
    

    if ($('#rfp_prob_statement_e').val().length > 10000) {
      fieldCheck = ccsZvalidateTextArea('rfp_prob_statement_e','You must enter less than 10000 characters',false);
      if (fieldCheck !== true) errorStore.push(fieldCheck);
    }
  }

  if (!pageHeading.includes("(Optional)") && agreement_id != "RM1043.8" && group_id != "Group 207" && agreement_id != "RM6187" && agreement_id != "RM1557.13") {
    if ($('#rfp_prob_statement_s') !== undefined && $('#rfp_prob_statement_s').val() !== undefined) {
      if ($('#rfp_prob_statement_s').val().length === 0) {
      fieldCheck = ccsZvalidateTextArea('rfp_prob_statement_s', 'You must enter information here');
      if (fieldCheck !== true) errorStore.push(fieldCheck);
    }
    }
  }
  
  


  if (errorStore.length === 0){
  document.forms['ccs_rfp_exit_strategy_form'].submit();
  
  }else{
    ccsZPresentErrorSummary(errorStore);
    
  } 
};

const ccsZOnChange = event => {
  removeErrorFieldsRfpStar();
  event.preventDefault();
  let id = event.path[0].id;
  //let fieldCheck = ccsZvalidateTextArea(id, 'You must enter information here');
  //if (fieldCheck !== true) errorStore.push(fieldCheck);
};

const ccsZvalidateSelectOffer = (event) => {
  event.preventDefault();

  let fieldCheck = "",
    errorStore = [];

  fieldCheck = ccsZisOptionChecked( "offer_required", "Select an option");
  if (fieldCheck !== true) errorStore.push(fieldCheck);

  if (errorStore.length === 0) document.forms["ccs_select_offer"].submit();
  else ccsZPresentErrorSummary(errorStore);
};

/* global $ */
$(document).ready(function () {
  window.GOVUKFrontend.initAll();

  // Read the CSRF token from the <meta> tag
  var token = document.querySelector('meta[name="csrf-token"]').getAttribute('content');
  $.ajaxSetup({
    beforeSend: function (xhr) {
      xhr.setRequestHeader('CSRF-Token', token);
    },
  });

  if (matchMedia) {
    const mq = window.matchMedia('(min-width: 40.0625em)');
    mq.addListener(WidthChange);
    WidthChange(mq);
    
  }


  // media query change
  function WidthChange(mq) {
    if (mq.matches) {
      document.querySelector('.global-navigation').setAttribute('aria-hidden', 'false');
    } else {
      document.querySelector('.global-navigation').setAttribute('aria-hidden', 'true');
    }
  }

  document.querySelector('.global-navigation__toggler').addEventListener('click', () => {
    var is_hidden = document.querySelector('.global-navigation').getAttribute('aria-hidden');
    var new_val = 'true';
    if (is_hidden == 'true') new_val = 'false';
    document.querySelector('.global-navigation').setAttribute('aria-hidden', new_val);
  });
});
const ccsZvalidateRfiLocation = event => {
  event.preventDefault();

  let fieldCheck = '',
    errorStore = [];

  fieldCheck = ccsZisOptionChecked(
    'required_locations',
    'You must select at least one region, or the “No specific location...',
  );
  if (fieldCheck !== true) errorStore.push(fieldCheck);

  if (errorStore.length === 0) document.forms['rfi_location'].submit();
  else ccsZPresentErrorSummary(errorStore);
};

// forms validation

$(".focusdata").click(function(){
  
  var $container = $("html,body");
var $scrollTo = $('.focus-data');

$container.animate({scrollTop: $scrollTo.offset().top - $container.offset().top + $container.scrollTop(), scrollLeft: 0},300);
  
});


$("#getId").click(function(){
  var myclass = $(this).hasClass("uncheck");

   
    if(myclass){
      $("input[type='checkbox']").prop("checked", true);
      $(this).removeClass("uncheck");
      $(this).addClass("check");
      $('.otherTextArea').removeClass('ccs-dynaform-hidden');
    }else{
      $('.otherTextArea').addClass('ccs-dynaform-hidden');
      $("input[type='checkbox']").prop("checked", false);
      $(this).addClass("uncheck");
      $(this).removeClass("check");      
    } 

  
});

// $("#DOSgetId").click(function(){
//   var myclass = $(this).hasClass("uncheck");
//     if(myclass){
//       $("input[type='checkbox']").prop("checked", true);
//       $(this).removeClass("uncheck");
//       $(this).addClass("check");

//     }else{
//       $("input[type='checkbox']").prop("checked", false);
//       $(this).addClass("uncheck");
//       $(this).removeClass("check");
//     } 
// });


if (document.getElementById('ccs_login') !== null)
  document.getElementById('ccs_login').addEventListener('submit', ccsZvalidateLogin);

if (document.getElementById('ccs_create_or_choose') !== null)
  document.getElementById('ccs_create_or_choose').addEventListener('submit', ccsZvalidateCreateOrChoose);

if (document.getElementById('ccs_select_offer') !== null)
  document.getElementById('ccs_select_offer').addEventListener('submit', ccsZvalidateSelectOffer);

if (document.getElementById('ccs_eoi_needs') !== null)
  document.getElementById('ccs_eoi_needs').addEventListener('submit', ccsZvalidateEoiNeeds);

//if (document.getElementById("ccs_eoi_incumbent_form") !== null) document.getElementById("ccs_eoi_incumbent_form").addEventListener('submit', ccsZvalidateEoiIncumbent);

if (document.getElementById('eoi_budget_form') !== null)
  document.getElementById('eoi_budget_form').addEventListener('submit', ccsZvalidateEoiBudget);

if (document.getElementById('ccs_eoi_criteria_form') !== null)
  document.getElementById('ccs_eoi_criteria_form').addEventListener('submit', ccsZvalidateEoiCriteria);

//if (document.getElementById("ccs_eoi_docs_form") !== null) document.getElementById("ccs_eoi_docs_form").addEventListener('submit', ccsZvalidateEoiDocs);

if (document.getElementById('ccs_eoi_deadline_form') !== null)
  document.getElementById('ccs_eoi_deadline_form').addEventListener('submit', ccsZvalidateEoiDeadline);

if (document.getElementById('eoi_location') !== null)
  document.getElementById('eoi_location').addEventListener('submit', ccsZvalidateEoiLocation);

if (document.getElementById('rfi_location') !== null)
  document.getElementById('rfi_location').addEventListener('submit', ccsZvalidateRfiLocation);

if (document.getElementById('ccs_eoi_contact_form') !== null)
  document.getElementById('ccs_eoi_contact_form').addEventListener('submit', ccsZvalidateEoiContact);

//if (document.getElementById("ccs_add_collab") !== null) document.getElementById("ccs_add_collab").addEventListener('submit', ccsZvalidateTeamMems);

//if (document.getElementById("ccs_add_rfi_collab") !== null) document.getElementById("ccs_add_rfi_collab").addEventListener('submit', ccsZvalidateRfiTeamMems);

if (document.getElementById('ccs_rfp_exit_strategy_form') !== null) {
  document.getElementById('ccs_rfp_exit_strategy_form').addEventListener('change', ccsZOnChange);
}

if (document.getElementById('ccs_rfi_project_name_form') !== null)
  document.getElementById('ccs_rfi_project_name_form').addEventListener('submit', ccsZvalidateRfiProjectName);

if (document.getElementById('rfi_projLongName') !== null)
  document.getElementById('rfi_projLongName').addEventListener('input', ccsZCountRfiProjectName);

  if (document.getElementById('enter_evaluation_feedback') !== null)
  document.getElementById('enter_evaluation_feedback').addEventListener('input', ccsZCountsupplierFeedback);

  if (document.getElementById('enter_evaluation_score') !== null)
  document.getElementById('enter_evaluation_score').addEventListener('keypress', ccsZValidateDecimalScore);

  if (document.getElementById('enter_evaluation_feedback') !== null)
  document.getElementById('enter_evaluation_feedback').addEventListener('submit', ccsZvalidateFeedback);

  
  if (document.getElementById('enter_evaluation_score') !== null)
  document.getElementById('enter_evaluation_score').addEventListener('submit', ccsZvalidateScore);

if (document.getElementById('ccs_eoi_project_name_form') !== null)
  document.getElementById('ccs_eoi_project_name_form').addEventListener('submit', ccsZvalidateEoiProjectName);

if (document.getElementById('ccs_choose_pre_engage') !== null)
  document.getElementById('ccs_choose_pre_engage').addEventListener('submit', ccsZvalidatePreMarketRoute);

if (document.getElementById('ccs_eoi_type_form') !== null)
  document.getElementById('ccs_eoi_type_form').addEventListener('submit', ccsZvalidateEoiType);

if (document.getElementById('ccs_rfi_type_form') !== null)
  document.getElementById('ccs_rfi_type_form').addEventListener('submit', ccsZvalidateRfiType);

//if (document.getElementById("ccs_rfi_who_form") !== null) document.getElementById("ccs_rfi_who_form").addEventListener('submit', ccsZvalidateRfiWho);

if (document.getElementById('ccs_rfi_vetting_form') !== null)
  document.getElementById('ccs_rfi_vetting_form').addEventListener('submit', ccsZvalidateRfiSecurity);

if (document.getElementById('ccs_eoi_vetting_form') !== null)
  document.getElementById('ccs_eoi_vetting_form').addEventListener('submit', ccsZvalidateEoiSecurity);

if (document.getElementById('ccs_ca_type_form') !== null)
  document.getElementById('ccs_ca_type_form').addEventListener('submit', ccsZvalidateCaaAssFCSecurity);
if (document.getElementById('ccs_ca_weighting') !== null)
  document.getElementById('ccs_ca_weighting').addEventListener('submit', ccsZvalidateCAWeightings);

if (document.getElementById('ccs_daa_weighting') !== null)
  document.getElementById('ccs_daa_weighting').addEventListener('submit', ccsZvalidateDAAWeightings);

if (document.getElementById('ca_where_work_done') !== null)
  document.getElementById('ca_where_work_done').addEventListener('submit', ccsZvalidateCAWhereWorkDone);

if (document.getElementById('da_where_work_done') !== null)
  document.getElementById('da_where_work_done').addEventListener('submit', ccsZvalidateDAWhereWorkDone);

if (document.getElementById('ccs_rfp_scoring_criteria') !== null)
  document.getElementById('ccs_rfp_scoring_criteria').addEventListener('submit', ccsZvalidateScoringCriteria);

  if (document.getElementById('service_user_type_form') !== null)
  document.getElementById('service_user_type_form').addEventListener('submit', ccsZvalidateScoringCriteria2);
// if (document.getElementById("ccs_rfi_dates_form") !== null) document.getElementById("ccs_rfi_dates_form").addEventListener('submit', ccsZvalidateRfiDates);

if (document.getElementById('ccs_rfi_address_form') !== null) {
  ccsZInitAddressFinder('rfi_proj_address-address');
  document.getElementById('rfi_find_address_btn').addEventListener('click', ccsZFindAddress);
  // document.getElementById("rfi_proj_address-address").addEventListener('change', ccsZFoundAddress);
  document.getElementById('change_postcode').addEventListener('click', ccsZResetAddress);
}

if (document.getElementById('ccs_rfi_address_manual_form') !== null)
  document.getElementById('ccs_rfi_address_manual_form').addEventListener('submit', ccsZvalidateRfiAddress);

if (document.getElementById('ccs_rfi_about_proj') !== null)
  document.getElementById('ccs_rfi_about_proj').addEventListener('submit', ccsZvalidateRfiProject);

if (document.getElementById('rfi_prob_statement') !== null)
  document.getElementById('rfi_prob_statement').addEventListener('input', ccsZCountRfiProject);

if (document.getElementById('ccs_rfi_next_steps') !== null)
  document.getElementById('ccs_rfi_next_steps').addEventListener('submit', showPopup);

  if (document.getElementById('ccs_rfi_closeyouproject') !== null)
  document.getElementById('ccs_rfi_closeyouproject').addEventListener('submit', loseyouprojectShowPopup);

  if (document.getElementById('evaluate_suppliers') !== null)
  document.getElementById('evaluate_suppliers').addEventListener('click', showEvaluateSuppliersPopup);

   if (document.getElementById('supplierMsgCancel') !== null)
   document.getElementById('supplierMsgCancel').addEventListener('click', supplierMsgCancelPopup);


if (document.getElementById('rfi_contracting_auth') !== null)
  document.getElementById('rfi_contracting_auth').addEventListener('input', ccsZCountRfiWho);

  if (document.getElementById('ca_justification') !== null)
  document.getElementById('ca_justification').addEventListener('input', ccsZCountCAReviewRank);

// if (document.getElementById('ccs_eoi_about_proj') !== null)
//   document.getElementById('ccs_eoi_about_proj').addEventListener('submit', ccsZvalidateEoiProject);

//if(document.getElementById("ccs_rfi_proj_status") !== null) document.getElementById("ccs_rfi_proj_status").addEventListener('submit', ccsZvalidateRfiProjectStatus);

if (document.getElementById('ccs_rfi_docs_form') !== null)
  document.getElementById('ccs_rfi_docs_form').addEventListener('submit', ccsZvalidateRfiDocs);

//if (document.getElementById("ccs_rfi_response_date_form") !== null) document.getElementById("ccs_rfi_response_date_form").addEventListener('submit', ccsZvalidateRfiResponseDate);


if (document.getElementById('ccs_rfi_questions_form') !== null)
  document.getElementById('ccs_rfi_questions_form').addEventListener('submit', ccsZvalidateRfIQuestions);
  
if (document.getElementById('ccs_eoi_questions_form') !== null)
  document.getElementById('ccs_eoi_questions_form').addEventListener('submit', ccsZvalidateEoIQuestions);

if (document.getElementById('ccs_rfp_exit_strategy_form') !== null)
  document.getElementById('ccs_rfp_exit_strategy_form').addEventListener('submit', ccsZvalidateRfPStrategy);

if (document.getElementById('ccs_rfp_exit_strategy_form') !== null)
  // document.getElementById('ccs_rfp_exit_strategy_form').addEventListener('submit', ccsZvalidateTextArea);


// if (document.getElementById('ccs_rfp_exit_strategy_form') !== null)
//   document.getElementById('ccs_rfp_exit_strategy_form').addEventListener('change', ccsZvalidateRfPChangeStrategy);

if (document.getElementById('ccs_rfp_about_proj') !== null)
  document.getElementById('ccs_rfp_about_proj').addEventListener('submit', ccsZvalidateRfPAboutBG);

  if (document.getElementById('ccs_rfp_who_form') !== null)
  document.getElementById('ccs_rfp_who_form').addEventListener('submit', ccsZvalidateTextRfpChangeStrategy);

if (document.getElementById('ccs_eoi_purpose_form') !== null)
  document.getElementById('ccs_eoi_purpose_form').addEventListener('submit', ccsZvalidateEoiPurpose);


//if (document.getElementById("ccs_eoi_scope_form") !== null) document.getElementById("ccs_eoi_scope_form").addEventListener('submit', ccsZvalidateEoiScope);

// if (document.getElementById('ccs_eoi_about_proj') !== null)
//   document.getElementById('ccs_eoi_about_proj').addEventListener('submit', ccsZvalidateEoiContext);

  if (document.getElementById('ccs_eoi_about_proj') !== null)
  document.getElementById('ccs_eoi_about_proj').addEventListener('submit', ccsZvalidateEoiProject);


if (document.getElementById('ccs_eoi_new_form') !== null)
  document.getElementById('ccs_eoi_new_form').addEventListener('submit', ccsZvalidateEoiServiceType);

if (document.getElementById('ccs_eoi_terms_form') !== null)
  document.getElementById('ccs_eoi_terms_form').addEventListener('submit', ccsZvalidateEoiTermsForm);

if (document.getElementById('ccs_incumbent_form') !== null)
  document.getElementById('ccs_incumbent_form').addEventListener('submit', ccsZvalidateIncumbentForm);

if (document.getElementById('eoi_docs_form') !== null)
  document.getElementById('eoi_docs_form').addEventListener('submit', ccsZvalidateEoiDocs);

if (document.getElementById('ccs_eoi_duration') !== null)
  document.getElementById('ccs_eoi_duration').addEventListener('submit', ccsZvalidateEoiStartDate);

if (document.getElementById('ccs-rfi-suppliers-form') !== null)
  document.getElementById('ccs-rfi-suppliers-form').addEventListener('submit', ccsZValidateSuppliersForm);

if (document.getElementById('ccs_eoi_acronyms_form') !== null)
  document.getElementById('ccs_eoi_acronyms_form').addEventListener('submit', ccsZvalidateEoiAcronyms);

if (document.getElementById('ccs_rfp_acronyms_form') !== null)
  document.getElementById('ccs_rfp_acronyms_form').addEventListener('submit', ccsZvalidateRfpAcronymsRFP);

  // if (document.getElementById('ccs_rfp_acronyms_form') !== null)
  // document.getElementById('ccs_rfp_acronyms_form').addEventListener('keydown', ccsZvalidateChangeRfpAcronymsRFP);


if (document.getElementById('rfp_location') !== null)
  document.getElementById('rfp_location').addEventListener('submit', ccsZvalidateRfpLocation);
if (document.getElementById('rfp_location') != undefined && document.getElementById('rfp_location') != null)
  document.getElementById('rfp_location').addEventListener('change', ccsZvalidateChangeRfpLocation);


if (document.getElementById('ccs_eoi_splterms_form') !== null)
  document.getElementById('ccs_eoi_splterms_form').addEventListener('submit', ccsZvalidateEoiSpecialTerms);

if (document.getElementById('ccs_rfi_acronyms_form') !== null)
  document.getElementById('ccs_rfi_acronyms_form').addEventListener('submit', ccsZvalidateRfiAcronyms);

if (document.getElementById('ccs_eoi_date_form') !== null)
  document.getElementById('ccs_eoi_date_form').addEventListener('submit', ccsZvalidateEoiDate);

  if (document.getElementById('fca_select_services_form') !== null)
  document.getElementById('fca_select_services_form').addEventListener('submit', ccsFcaSelectedServices);

//Balwider
if (document.getElementById('rfp_percentage_form') !== null)
  document.getElementById('rfp_percentage_form').addEventListener('submit', ccsZvalidateRfpPercentages);

  //Award
if (document.getElementById('ccs_pre_award_supplier_form') !== null)
document.getElementById('ccs_pre_award_supplier_form').addEventListener('submit', ccsZvalidateAward);

if (document.getElementById('ccs_standstill_period_form') !== null)
document.getElementById('ccs_standstill_period_form').addEventListener('submit', ccsZvalidateStandStillPeriod);

if (document.getElementById('ccs_da_project_name_form') !== null)
  document.getElementById('ccs_da_project_name_form').addEventListener('submit', ccsZvalidateDaProjectName);

  if (document.getElementById('da_projLongName') !== null)
  document.getElementById('da_projLongName').addEventListener('input', ccsZCountDaProjectName);

//if (document.getElementById('rfp_multianswer_question_form') !== null)
// document.getElementById('rfp_multianswer_question_form').addEventListener('submit', "");
//if (document.getElementById('service_levels_kpi_form') !== null)
  //document.getElementById('service_levels_kpi_form').addEventListener('submit', ccsZvalidateRfpKPI);

if (document.querySelectorAll('.ons-list__item') !== null) ccsTabMenuNaviation();

setInputFilter(
  document.getElementById('eoi_resource_start_date-day'),
  value => /^\d*$/.test(value) && (value === '' || parseInt(value) <= 31),
);
setInputFilter(
  document.getElementById('eoi_resource_start_date-month'),
  value => /^\d*$/.test(value) && (value === '' || parseInt(value) <= 12),
);
setInputFilter(
  document.getElementById('eoi_resource_start_date-year'),
  value => /^\d*$/.test(value) && (value === '' || parseInt(value) <= 2025),
);
setInputFilter(
  document.getElementById('eoi_duration-days'),
  value => /^\d*$/.test(value) && (value === '' || parseInt(value) <= 31),
);
setInputFilter(
  document.getElementById('eoi_duration-months'),
  value => /^\d*$/.test(value) && (value === '' || parseInt(value) <= 12),
);
setInputFilter(
  document.getElementById('eoi_duration-years'),
  value => /^\d*$/.test(value) && (value === '' || parseInt(value) <= 100),
);
setInputFilter(
  document.getElementById('clarification_date-minute_2'),
  value => /^\d*$/.test(value) && (value === '' || parseInt(value) <= 60),
);
setInputFilter(
  document.getElementById('clarification_date-hour_2'),
  value => /^\d*$/.test(value) && (value === '' || parseInt(value) <= 23),
);
setInputFilter(
  document.getElementById('clarification_date-day_2'),
  value => /^\d*$/.test(value) && (value === '' || parseInt(value) <= 31),
);
setInputFilter(
  document.getElementById('clarification_date-month_2'),
  value => /^\d*$/.test(value) && (value === '' || parseInt(value) <= 12),
);
setInputFilter(
  document.getElementById('clarification_date-year_2'),
  value => /^\d*$/.test(value),
);
setInputFilter(
  document.getElementById('clarification_date-minute_3'),
  value => /^\d*$/.test(value) && (value === '' || parseInt(value) <= 60),
);
setInputFilter(
  document.getElementById('clarification_date-hour_3'),
  value => /^\d*$/.test(value) && (value === '' || parseInt(value) <= 23),
);
setInputFilter(
  document.getElementById('clarification_date-day_3'),
  value => /^\d*$/.test(value) && (value === '' || parseInt(value) <= 31),
);
setInputFilter(
  document.getElementById('clarification_date-month_3'),
  value => /^\d*$/.test(value) && (value === '' || parseInt(value) <= 12),
);
setInputFilter(
  document.getElementById('clarification_date-year_3'),
  value => /^\d*$/.test(value),
);

setInputFilter(
  document.getElementById('clarification_date-minute_4'),
  value => /^\d*$/.test(value) && (value === '' || parseInt(value) <= 60),
);
setInputFilter(
  document.getElementById('clarification_date-hour_4'),
  value => /^\d*$/.test(value) && (value === '' || parseInt(value) <= 23),
);
setInputFilter(
  document.getElementById('clarification_date-day_4'),
  value => /^\d*$/.test(value) && (value === '' || parseInt(value) <= 31),
);
setInputFilter(
  document.getElementById('clarification_date-month_4'),
  value => /^\d*$/.test(value) && (value === '' || parseInt(value) <= 12),
);
setInputFilter(
  document.getElementById('clarification_date-year_4'),
  value => /^\d*$/.test(value),
);

setInputFilter(
  document.getElementById('clarification_date-minute_5'),
  value => /^\d*$/.test(value) && (value === '' || parseInt(value) <= 60),
);
setInputFilter(
  document.getElementById('clarification_date-hour_5'),
  value => /^\d*$/.test(value) && (value === '' || parseInt(value) <= 23),
);
setInputFilter(
  document.getElementById('clarification_date-day_5'),
  value => /^\d*$/.test(value) && (value === '' || parseInt(value) <= 31),
);
setInputFilter(
  document.getElementById('clarification_date-month_5'),
  value => /^\d*$/.test(value) && (value === '' || parseInt(value) <= 12),
);
setInputFilter(
  document.getElementById('clarification_date-year_5'),
  value => /^\d*$/.test(value),
);


setInputFilter(
  document.getElementById('clarification_date-minute_6'),
  value => /^\d*$/.test(value) && (value === '' || parseInt(value) <= 60),
);
setInputFilter(
  document.getElementById('clarification_date-hour_6'),
  value => /^\d*$/.test(value) && (value === '' || parseInt(value) <= 23),
);
setInputFilter(
  document.getElementById('clarification_date-day_6'),
  value => /^\d*$/.test(value) && (value === '' || parseInt(value) <= 31),
);
setInputFilter(
  document.getElementById('clarification_date-month_6'),
  value => /^\d*$/.test(value) && (value === '' || parseInt(value) <= 12),
);
setInputFilter(
  document.getElementById('clarification_date-year_6'),
  value => /^\d*$/.test(value),
);

setInputFilter(
  document.getElementById('clarification_date-minute_7'),
  value => /^\d*$/.test(value) && (value === '' || parseInt(value) <= 60),
);
setInputFilter(
  document.getElementById('clarification_date-hour_7'),
  value => /^\d*$/.test(value) && (value === '' || parseInt(value) <= 23),
);
setInputFilter(
  document.getElementById('clarification_date-day_7'),
  value => /^\d*$/.test(value) && (value === '' || parseInt(value) <= 31),
);
setInputFilter(
  document.getElementById('clarification_date-month_7'),
  value => /^\d*$/.test(value) && (value === '' || parseInt(value) <= 12),
);
setInputFilter(
  document.getElementById('clarification_date-year_7'),
  value => /^\d*$/.test(value),
);

setInputFilter(
  document.getElementById('clarification_date-minute_8'),
  value => /^\d*$/.test(value) && (value === '' || parseInt(value) <= 60),
);
setInputFilter(
  document.getElementById('clarification_date-hour_8'),
  value => /^\d*$/.test(value) && (value === '' || parseInt(value) <= 23),
);
setInputFilter(
  document.getElementById('clarification_date-day_8'),
  value => /^\d*$/.test(value) && (value === '' || parseInt(value) <= 31),
);
setInputFilter(
  document.getElementById('clarification_date-month_8'),
  value => /^\d*$/.test(value) && (value === '' || parseInt(value) <= 12),
);
setInputFilter(
  document.getElementById('clarification_date-year_8'),
  value => /^\d*$/.test(value),
);

setInputFilter(
  document.getElementById('clarification_date-minute_9'),
  value => /^\d*$/.test(value) && (value === '' || parseInt(value) <= 60),
);
setInputFilter(
  document.getElementById('clarification_date-hour_9'),
  value => /^\d*$/.test(value) && (value === '' || parseInt(value) <= 23),
);
setInputFilter(
  document.getElementById('clarification_date-day_9'),
  value => /^\d*$/.test(value) && (value === '' || parseInt(value) <= 31),
);
setInputFilter(
  document.getElementById('clarification_date-month_9'),
  value => /^\d*$/.test(value) && (value === '' || parseInt(value) <= 12),
);
setInputFilter(
  document.getElementById('clarification_date-year_9'),
  value => /^\d*$/.test(value),
);

setInputFilter(
  document.getElementById('clarification_date-minute_10'),
  value => /^\d*$/.test(value) && (value === '' || parseInt(value) <= 60),
);
setInputFilter(
  document.getElementById('clarification_date-hour_10'),
  value => /^\d*$/.test(value) && (value === '' || parseInt(value) <= 23),
);
setInputFilter(
  document.getElementById('clarification_date-day_10'),
  value => /^\d*$/.test(value) && (value === '' || parseInt(value) <= 31),
);
setInputFilter(
  document.getElementById('clarification_date-month_10'),
  value => /^\d*$/.test(value) && (value === '' || parseInt(value) <= 12),
);
setInputFilter(
  document.getElementById('clarification_date-year_10'),
  value => /^\d*$/.test(value),
);

setInputFilter(
  document.getElementById('clarification_date-minute_11'),
  value => /^\d*$/.test(value) && (value === '' || parseInt(value) <= 60),
);
setInputFilter(
  document.getElementById('clarification_date-hour_11'),
  value => /^\d*$/.test(value) && (value === '' || parseInt(value) <= 23),
);
setInputFilter(
  document.getElementById('clarification_date-day_11'),
  value => /^\d*$/.test(value) && (value === '' || parseInt(value) <= 31),
);
setInputFilter(
  document.getElementById('clarification_date-month_11'),
  value => /^\d*$/.test(value) && (value === '' || parseInt(value) <= 12),
);
setInputFilter(
  document.getElementById('clarification_date-year_11'),
  value => /^\d*$/.test(value),
);

setInputFilter(
  document.getElementById('clarification_date-minute_12'),
  value => /^\d*$/.test(value) && (value === '' || parseInt(value) <= 60),
);
setInputFilter(
  document.getElementById('clarification_date-hour_12'),
  value => /^\d*$/.test(value) && (value === '' || parseInt(value) <= 23),
);
setInputFilter(
  document.getElementById('clarification_date-day_12'),
  value => /^\d*$/.test(value) && (value === '' || parseInt(value) <= 31),
);
setInputFilter(
  document.getElementById('clarification_date-month_12'),
  value => /^\d*$/.test(value) && (value === '' || parseInt(value) <= 12),
);
setInputFilter(
  document.getElementById('clarification_date-year_12'),
  value => /^\d*$/.test(value),
);

setInputFilter(
  document.getElementById('clarification_date-minute_13'),
  value => /^\d*$/.test(value) && (value === '' || parseInt(value) <= 60),
);
setInputFilter(
  document.getElementById('clarification_date-hour_13'),
  value => /^\d*$/.test(value) && (value === '' || parseInt(value) <= 23),
);
setInputFilter(
  document.getElementById('clarification_date-day_13'),
  value => /^\d*$/.test(value) && (value === '' || parseInt(value) <= 31),
);
setInputFilter(
  document.getElementById('clarification_date-month_13'),
  value => /^\d*$/.test(value) && (value === '' || parseInt(value) <= 12),
);
setInputFilter(
  document.getElementById('clarification_date-year_13'),
  value => /^\d*$/.test(value),
);

setInputFilter(
  document.getElementById('rfp_resource_start_date_day_Question11'),
  value => /^\d*$/.test(value) && (value === '' || parseInt(value) <= 31),
);
setInputFilter(
  document.getElementById('rfp_resource_start_date_month_Question 11'),
  value => /^\d*$/.test(value) && (value === '' || parseInt(value) <= 12),
);
setInputFilter(
  document.getElementById('rfp_resource_start_date_year_Question 11'),
  value => /^\d*$/.test(value),
);

setInputFilter(
  document.getElementById('rfp_duration_days_Question12'),
  value => /^\d*$/.test(value) && (value === '' || parseInt(value) <= 31),
);
setInputFilter(
  document.getElementById('rfp_duration_months_Question12'),
  value => /^\d*$/.test(value) && (value === '' || parseInt(value) <= 11),
);
setInputFilter(
  document.getElementById('rfp_duration-years_Question12'),
  value => /^\d*$/.test(value),
);


setInputFilter(
  document.getElementById('rfp_duration_days_Question13'),
  value => /^\d*$/.test(value) && (value === '' || parseInt(value) <= 31),
);
setInputFilter(
  document.getElementById('rfp_duration_months_Question13'),
  value => /^\d*$/.test(value) && (value === '' || parseInt(value) <= 11),
);
setInputFilter(
  document.getElementById('rfp_duration-years_Question13'),
  value => /^\d*$/.test(value),
);
//g13Check Script

function parseQueryG13(query) {
  object = {};  
  if (query.indexOf('?') != -1){
    query = query.split('?');		
    query = query[1];
  }
  parseQuery = query.split("&");
  for (var i = 0; i < parseQuery.length; i++) {
      pair = parseQuery[i].split('=');
      key = decodeURIComponent(pair[0]);
      if (key.length == 0) continue;
      value = decodeURIComponent(pair[1].replace("+"," "));
      if (object[key] == undefined) object[key] = value;
      else if (object[key] instanceof Array) object[key].push(value);
      else object[key] = [object[key],value];
  }
  return object;
};

const tune = (obj) => {
  let emptyArr = [];
  for (const key in obj) { 
    if(typeof(obj[key]) == 'object') { 
      let newArr = obj[key]; 
      for(let i = 0; i < newArr.length; i++) { 
        emptyArr.push({'key': key, 'value': newArr[i]}); } } else { emptyArr.push({'key': key, 'value': obj[key]}); } }
  return emptyArr;
}

function g13ServiceQueryFliterJquery(queryObj, baseUrl, overUrl) {
  
    let outQueryUrl = "";
    let overName = overUrl.name;

    let overValue = overUrl.value;
    let overType = overUrl.type;
   
    if(queryObj.length > 0) {
      if(overType == 'unchecked') {
        let compareVal = overValue;
        let compareName = overName;
        let finalObj = [];
        queryObj.find((el) => {

       if(el.value != compareVal || el.key != compareName) { 
          finalObj.push(el); 
        } 
      });
        queryObj = finalObj;
      }
  
      queryObj.forEach((el, i) => {
          let key = el.key;
          let value = el.value;
          if(i == 0) {
              if(key != '') {
                  outQueryUrl += `?${key}=${value}`;
              }
          } else {
              outQueryUrl += `&${key}=${value}`;
          }
          if(i == queryObj.length - 1) {
            if(overType == 'checked' || overType == 'categoryClicked') {
              if(key != '') {
                outQueryUrl += `&${overName}=${overValue}`;
              } else {
                outQueryUrl += `?${overName}=${overValue}`;
              }
            }
          }
      });
    } else {
      if(overValue != '') {
        outQueryUrl += `?${overName}=${overValue}`;
      }
    }
    
    
    return outQueryUrl;
}
document.querySelectorAll(".clickCategory").forEach(function(event) {
  event.addEventListener('click', function() {
    let eventFilterType = 'categoryClicked';
    let filterName = this.getAttribute("data-name");
    let filterValue = this.getAttribute("data-value");
    let urlObj = parseQueryG13(document.location.search);
    urlObj = tune(urlObj);
    let baseUrl = window.location.href.split('?')[0];
    let finalTriggerUrl = g13ServiceQueryFliterJquery(urlObj, baseUrl, {name: filterName, value: filterValue, type: eventFilterType});
    window.location.href = `${baseUrl}${finalTriggerUrl}`;
  });
});

if(document.querySelectorAll('.serviceCategory')) {
  document.querySelectorAll(".serviceCategory").forEach(function(event) {
    event.addEventListener('click', function() {
      let eventFilterType = 'serviceCategoryClicked';
      let filterName = this.getAttribute('data-name');
      let filterValue = this.getAttribute('data-value');
      let urlObj = parseQueryG13(document.location.search);
      urlObj = tune(urlObj);

      let finalObj = [];
      urlObj.find((el) => {
      if(el.key !== 'serviceCategories') { finalObj.push(el); } });
      urlObj = finalObj;
      urlObj.push({"key":"serviceCategories","value":filterValue});

      let baseUrl = window.location.href.split('?')[0];
      let finalTriggerUrl = g13ServiceQueryFliterJquery(urlObj, baseUrl, {name: filterName, value: filterValue, type: eventFilterType});
      window.location.href = `${baseUrl}${finalTriggerUrl}`;
    });
  });
}

if(document.querySelectorAll('.parentCategory')) {
  document.querySelectorAll(".parentCategory").forEach(function(event) {
    event.addEventListener('click', function() {
      let eventFilterType = 'parentCategoryClicked';
      let filterName = this.getAttribute('data-name');
      let filterValue = this.getAttribute('data-value');
      let urlObj = parseQueryG13(document.location.search);
      urlObj = tune(urlObj);

      let condtionParentCat = urlObj.find(el => el.key === 'parentCategory');
      if(condtionParentCat === undefined) {
        let serviceCategory = urlObj.find(el => el.key === 'serviceCategories');
        urlObj.push({"key":"parentCategory","value":serviceCategory.value});
        urlObj.splice(urlObj.findIndex(({key}) => key == "serviceCategories"), 1);
        urlObj.push({"key":"serviceCategories","value":filterValue});
      } else {
        let finalObj = [];
        urlObj.find((el) => {
        if(el.key !== 'serviceCategories') { finalObj.push(el); } });
        urlObj = finalObj;
        urlObj.push({"key":"serviceCategories","value":filterValue});
      }

      let baseUrl = window.location.href.split('?')[0];
      let finalTriggerUrl = g13ServiceQueryFliterJquery(urlObj, baseUrl, {name: filterName, value: filterValue, type: eventFilterType});
      window.location.href = `${baseUrl}${finalTriggerUrl}`;
    });
  });
}

function titleCase(str) {
  return str.toLowerCase().split(' ').map(function(word) {
    return word.replace(word[0], word[0].toUpperCase());
  }).join(' ');
}

function removeURLParameter(url, parameter) {
  //prefer to use l.search if you have a location/link object
  var urlparts= url.split('?');   
  if (urlparts.length>=2) {

      var prefix= encodeURIComponent(parameter)+'=';
      var pars= urlparts[1].split(/[&;]/g);

      //reverse iteration as may be destructive
      for (var i= pars.length; i-- > 0;) {    
          //idiom for string.startsWith
          if (pars[i].lastIndexOf(prefix, 0) !== -1) {  
              pars.splice(i, 1);
          }
      }

      url= urlparts[0]+'?'+pars.join('&');
      return url;
  } else {
      return url;
  }
}

document.querySelectorAll(".g13Check").forEach(function(event) {
    event.addEventListener('change', function(event) {
      let eventFilterType;
      let filterName = this.getAttribute('name');//$(this).attr("name");
      let filterValue = this.getAttribute('value');//$(this).attr("value");
      if(this.checked) { eventFilterType = 'checked'; } else { eventFilterType = 'unchecked'; }
      let urlParams=removeURLParameter(document.location.search, 'page');
      let urlObj = parseQueryG13(urlParams);
      urlObj = tune(urlObj);
      let baseUrl = window.location.href.split('?')[0];
      let finalTriggerUrl = g13ServiceQueryFliterJquery(urlObj, baseUrl, {name: filterName, value: filterValue, type: eventFilterType});

      //url change
      const baseSearchUrl = '/g-cloud/search';
      window.history.pushState({"html":"","pageTitle":""},"", `${baseSearchUrl}${finalTriggerUrl}`);
      
      
      // document.getElementById('searchResultsContainer').innerHTML = '';
      document.getElementById('mainLotandcategoryContainer').innerHTML = '';
      document.getElementById('paginationContainer').innerHTML = '';
      let slist = document.querySelector('.govuk-grid-sresult-right');
      slist.classList.add('loadingres')
      $('#criteriasavebtn').prop('disabled',true);
      const baseAPIUrl = '/g-cloud/search-api';
      $.ajax({
          url: `${baseAPIUrl}${finalTriggerUrl}`,
          type: "GET",
          contentType: "application/json",
      }).done(function (result) {
       
        $('#criteriasavebtn').prop('disabled',false);
        $('#criteriasavebtn').removeClass('govuk-button--disabled');
        $("#clearfilter").attr("href", result.clearFilterURL);
        if(result.data.meta.total > 0) {
          slist.classList.remove('loadingres')
          getCriterianDetails(result.data.meta.total);
            document.getElementById('rightSidefooterCotainer').innerHTML = '';
                

            var mainLothtml = '';
            if(result.njkDatas.haveLot) {
            mainLothtml = '<a class="govuk-link govuk-link-filter-main" href="/g-cloud/search">All Categories</a>';
            }else {
            mainLothtml += '<strong>All Categories</strong>'
            mainLothtml += '<ul class="govuk-list">'
            result.njkDatas.lotInfos.lots.forEach(lotwithcount => {
              mainLothtml +='<li><a data-name="lot" data-value="'+ lotwithcount.slug+'" class="govuk-link clickCategory" style="cursor: pointer !important;">'+ titleCase(lotwithcount.key)+ ' (' +lotwithcount.count+')</a></li>';
            })
            mainLothtml +='</ul>'
          } 

            if(result.njkDatas.haveLot){
            mainLothtml += '<ul class="govuk-list">'
              if(result.njkDatas.haveserviceCategory){ 
                mainLothtml +=  '<a class="govuk-link govuk-link-filter-main" href="/g-cloud/search?lot='+ result.njkDatas.lotInfos.slug+'">'+ result.njkDatas.lotInfos.label+'</a>'
              }else{
                mainLothtml +=  '<li><strong>'+ titleCase(result.njkDatas.lotInfos.label)+' </strong></li>'
              }
              if(result.njkDatas.lotInfos.currentparentCategory){
              mainLothtml += '<p><a class="govuk-link govuk-link-filter-main" href="/g-cloud/search?lot='+result.njkDatas.lotInfos.slug+'&serviceCategories='+ result.njkDatas.lotInfos.currentparentCategory+'">'+ titleCase(result.njkDatas.lotInfos.currentparentCategory) +'</a></p>';
              }

            mainLothtml += '<li>';
            mainLothtml += '<ul class="govuk-list govuk-!-margin-top-0">';
            mainLothtml +=  '<ul class="govuk-list govuk-!-margin-top-0 govuk-!-margin-left-2">';
            result.njkDatas.lotInfos.subservices.forEach(subservice => {
              if(subservice.childrenssts) {
                        if(result.njkDatas.lotInfos.currentparentCategory) {
                          mainLothtml += '<li>';
                            mainLothtml += '<ul class="govuk-list govuk-!-margin-top-0">';
                            mainLothtml += '<ul class="govuk-list govuk-!-margin-top-0 govuk-!-margin-left-2">';
                              subservice.childrens.forEach(child => {
                                if(child.value == result.njkDatas.lotInfos.currentserviceCategory ) {
                                    mainLothtml += '<li><strong>'+ child.label+' ('+child.count+')</strong></li>';
                                  } else {
                                    var childVal = child.value.split(' ').join('+');
                                    mainLothtml += '<li><a class="govuk-link parentCategory" data-name="'+child.name+'" data-value="'+ childVal +'">'+child.label+'('+child.count+')</a></li>';
                                  }
                                }); 
                                mainLothtml += '</ul>';
                            mainLothtml += '</ul>';
                        } else {
                          mainLothtml += '<li>';
                          mainLothtml += '<strong>'+ titleCase(result.njkDatas.lotInfos.currentserviceCategory) +'</strong>';
                          mainLothtml += '<ul class="govuk-list govuk-!-margin-top-0">';
                          mainLothtml += '<ul class="govuk-list govuk-!-margin-top-0 govuk-!-margin-left-2">';
                              subservice.childrens.forEach(child => {
                                var childVal = child.value.split(' ').join('+');
                                mainLothtml +=  '<li><a class="govuk-link parentCategory" data-name="'+ child.name+'" data-value="'+ childVal +'">'+child.label+'('+child.count+')</a></li>';
                                }); 
                          mainLothtml += '</ul>';
                          mainLothtml += '</ul>';
                        }
                        mainLothtml += '</li>';
                } else {

                      if(subservice.value == result.njkDatas.lotInfos.currentserviceCategory ) {
                        mainLothtml +=  '<li><strong>'+subservice.label+'</strong></li>';
                      } else {
                        if(subservice.name !== 'supportMultiCloud' ) {
                          var subserviceValue = subservice.value.split(' ').join('+');
                          mainLothtml +=  '<li><a class="govuk-link serviceCategory" data-name="'+ subservice.name +'" data-value="'+ subserviceValue +'">'+subservice.label+  '('+ subservice.count +')</a></li>';
                        }
                      }
                }
              }); 
              mainLothtml += '</ul>';
              mainLothtml += '</ul>';
              mainLothtml += '</li>';
              mainLothtml += '</ul>';
          }
          document.getElementById('mainLotandcategoryContainer').innerHTML = mainLothtml;
          
            var searchresultshtml = '';
            searchresultshtml +=  '<div class="govuk-grid-row">';
            searchresultshtml +=  '<div class="govuk-grid-column-full">';
            searchresultshtml +=  '<ul class="govuk-list govuk-supplier-list">';
            result.data.documents.forEach(element => {
            searchresultshtml +=  '<li class="app-search-result">'
                                    +'<h2 class="govuk-heading-s govuk-!-margin-bottom-1">'
                                    +'<a class="govuk-link" href="/g-cloud/services?id='+element.id+'">'+ element.serviceName+'</a>'
                                    +'</h2>'
                                    +'<p class="govuk-body govuk-!-font-size-16 govuk-!-font-weight-bold">'+ element.supplierName+'</p>'
                                    +'<p class="govuk-body govuk-!-font-size-16">'+ element.serviceDescription+'</p>'
                                    +'<ul aria-label="tags" class="govuk-list app-search-result__metadata">'
                                    +'<li class="govuk-!-display-inline govuk-!-padding-right-4">'+ element.lotName+'</li>'
                                    +'<li class="govuk-!-display-inline">'+ element.frameworkName+'</li>'
                                    +'</ul>'
                                    +'</li>';

          });
          searchresultshtml +=  '<div>';
          searchresultshtml +=  '<div>';
          searchresultshtml +=  '<ul>';
          document.getElementById('searchResultsContainer').innerHTML = searchresultshtml;

          var paginationHtml = ''
          paginationHtml += '<div class="govuk-grid-row">';
          paginationHtml += '<div class="govuk-grid-column-full">';
          paginationHtml += '<div class="govuk-grid-column-one-half">';
          paginationHtml += '<div>';
          paginationHtml += '&nbsp;';
            if(result.njkDatas.PrvePageUrl != ''){
              if(result.njkDatas.CurrentPageNumber != 1){
              paginationHtml += '<p class="govuk-body govuk-!-margin-0">';
              paginationHtml += '<a href="/g-cloud/search?'+ result.njkDatas.PrvePageUrl+'" class="govuk-link govuk-link--no-visited-state govuk-!-font-weight-bold govuk-!-font-size-24 paginationUrlClass">';
              paginationHtml += '<svg class="govuk-pagination__icon govuk-pagination__icon--prev" xmlns="http://www.w3.org/2000/svg" height="13" width="15" aria-hidden="true" focusable="false" viewBox="0 0 15 13" fill="#1d70b8">';
              paginationHtml += '<path d="m6.5938-0.0078125-6.7266 6.7266 6.7441 6.4062 1.377-1.449-4.1856-3.9768h12.896v-2h-12.984l4.2931-4.293-1.414-1.414z"></path>';
              paginationHtml += '</svg>';
              paginationHtml += 'Previous Page</a>';
              paginationHtml += '</p>';
              paginationHtml += '<p class="govuk-body govuk-!-margin-0"><label class="govuk-!-font-size-16">'+ (result.njkDatas.CurrentPageNumber - 1) +' of '+ result.njkDatas.noOfPages+'</label></p>  ';
            }
          }
          paginationHtml += '</div>';
          paginationHtml += '</div>';
  
          paginationHtml += '<div class="govuk-grid-column-one-half govuk-!-text-align-right">';
          paginationHtml += '<div>';
          paginationHtml += '&nbsp;';
          if(result.njkDatas.NextPageUrl != ''){
          paginationHtml += '<p class="govuk-body govuk-!-margin-0">';
          paginationHtml += '<a href="/g-cloud/search?'+ result.njkDatas.NextPageUrl+'" class="govuk-link govuk-link--no-visited-state govuk-!-font-weight-bold govuk-!-font-size-24 paginationUrlClass">';
          paginationHtml += '<svg class="govuk-pagination__icon govuk-pagination__icon--next" xmlns="http://www.w3.org/2000/svg" height="13" width="15" aria-hidden="true" focusable="false" viewBox="0 0 15 13" fill="#1d70b8">';
          paginationHtml += '<path d="m8.107-0.0078125-1.4136 1.414 4.2926 4.293h-12.986v2h12.896l-4.1855 3.9766 1.377 1.4492 6.7441-6.4062-6.7246-6.7266z"></path>';
          paginationHtml += '</svg>';
          paginationHtml += 'Next Page</a>';
          paginationHtml += '</p>';
          }
          //paginationHtml += '<p class="govuk-body govuk-!-margin-0"><label class="govuk-!-font-size-16">'+ (result.njkDatas.CurrentPageNumber + 1) +' of '+ result.njkDatas.noOfPages+'</label></p>';
          if(result.njkDatas.noOfPages=='0' || result.njkDatas.noOfPages =='1'){
            paginationHtml += '<p class="govuk-body govuk-!-margin-0"><label class="govuk-!-font-size-16">'+ (result.njkDatas.CurrentPageNumber) +' of 1</label></p>';
          }else{
            paginationHtml += '<p class="govuk-body govuk-!-margin-0"><label class="govuk-!-font-size-16">'+ (result.njkDatas.CurrentPageNumber) +' of '+ result.njkDatas.noOfPages+'</label></p>';
          }
          paginationHtml += '</div>';
          paginationHtml += '</div>';
          paginationHtml += '</div>';
          paginationHtml += '</div>';
          document.getElementById('paginationContainer').innerHTML = paginationHtml;
        }else{
          $('#criteriasavebtn').prop('disabled',true);
          slist.classList.remove('loadingres')
          getCriterianDetails(0);
          document.getElementById('searchResultsContainer').innerHTML = '';
          
         

          document.getElementById('rightSidefooterCotainer').innerHTML = ''; 
          var Noresulthtml = '';
          Noresulthtml += '<h3 class="govuk-heading-m">Improve your search results by:</h3>';
          Noresulthtml += '<ul class="govuk-list govuk-!-margin-top-0">';
          Noresulthtml += '<ul class="govuk-list govuk-!-margin-top-0 govuk-!-margin-left-2">';
          Noresulthtml += '</li>removing filters</li><br>';
          Noresulthtml += '</li>choosing a different category</li><br>';
          Noresulthtml += '</li>double-checking your spelling</li><br>';
          Noresulthtml += '</li>using fewer keywords</li><br>';
          Noresulthtml += '</li>searching for something less specific, you can refine your results later</li><br>';
          Noresulthtml += '</ul>';
          Noresulthtml += '</ul>';
          document.getElementById('rightSidefooterCotainer').innerHTML = Noresulthtml; 
        }

        loadQuerySelector();
        
      }).fail((res) => {
          // let div_email = document.getElementById('eoi-lead-email');
          // div_email.innerText = '';
      })

     // window.location.href = `${baseUrl}${finalTriggerUrl}`;
    });
});

window.addEventListener('DOMContentLoaded', (event) => {
  
  if(document.getElementById('searchQuery')) document.getElementById('searchQuery').value = window.location.search;
  
  let criteriasavebtn = document.getElementById('criteriasavebtn');
  if(criteriasavebtn){
    criteriasavebtn.addEventListener('click',function (e) {
      if(document.getElementById('searchQuery')){
        document.getElementById('searchQuery').value = window.location.search;
      }
    })
  }

  document.querySelectorAll(".paginationUrlClass").forEach(el => {
    el.addEventListener('click',function (e) {
      let searchQueryUrl = "";
      let searchValue  = document.getElementsByClassName("g13_search"); //$('.g13_search').val();
      let urlObj = parseQueryG13(document.location.search);
      urlObj = tune(urlObj);
      let DuplicateSearchObj = urlObj.find(o => o.key === 'q');
      if(DuplicateSearchObj) urlObj.splice(DuplicateSearchObj, 1);
      if(searchValue.length > 0) urlObj.unshift({"key":"q","value":searchValue})
        let baseUrl = window.location.href.split('?')[0];
        urlObj.forEach((el, i) => {
          let key = el.key;
          let value = el.value;
          if(i == 0) {
              if(key != '') {
                  searchQueryUrl += `?${key}=${value}`;
              }
          } else {
              searchQueryUrl += `&${key}=${value}`;
          }
        });
        window.location.href = `${baseUrl}${searchQueryUrl}`;
    });
  });

  const removeErrorFieldsEoiTerms = () => {
    $('.govuk-error-message').remove();
    $('.govuk-form-group--error').removeClass('govuk-form-group--error')
    $('.govuk-error-summary').remove();
    $(".govuk-input").removeClass("govuk-input--error");
    $('.govuk-form-group textarea').removeClass('govuk-textarea--error');
  
  }

  var Searchinput = document.getElementsByClassName("g13_search")[0];
  if(Searchinput){
    Searchinput.addEventListener("keypress", function(event) {
      if (event.key === "Enter") {
        event.preventDefault();
        document.getElementsByClassName("g13_search_click")[0].click();
      }
    });
  }

  
  if(document.querySelector(".g13_search_click")){

    document.querySelector(".g13_search_click").addEventListener('click', function() {
      removeErrorFieldsEoiTerms();
      let searchQueryUrl = "";
      document.getElementById('searchQuery').value = window.location.search;
      let searchValue  = document.getElementsByClassName("g13_search");
      let definition_field = document.getElementById("with-hint");
      if(searchValue[0].value.length > 250){
        ccsZaddErrorMessage(definition_field, 'Keywords must be 250 characters or fewer.');
        return false;
      }
      let urlParams=removeURLParameter(document.location.search, 'page');
      let urlObj = parseQueryG13(urlParams);
      urlObj = tune(urlObj);
      let DuplicateSearchObj = urlObj.find(o => o.key === 'q');
      if(DuplicateSearchObj) urlObj.splice(DuplicateSearchObj, 1);
      if(searchValue[0].value.length > 0) urlObj.unshift({"key":"q","value":searchValue[0].value})
        let baseUrl = window.location.href.split('?')[0];
        urlObj.forEach((el, i) => {
          let key = el.key;
          let value = el.value;
          if(i == 0) {
              if(key != '') {
                  searchQueryUrl += `?${key}=${value}`;
              }
          } else {
              searchQueryUrl += `&${key}=${value}`;
          }
        });

        //url change
        const baseSearchUrl = '/g-cloud/search';
        window.history.pushState({"html":"","pageTitle":""},"", `${baseSearchUrl}${searchQueryUrl}`);
  
        document.getElementById('searchResultsContainer').innerHTML = '';
        document.getElementById('mainLotandcategoryContainer').innerHTML = '';
        document.getElementById('paginationContainer').innerHTML = '';
        const baseAPIUrl = '/g-cloud/search-api';
        let slist = document.querySelector('#searchResultsContainer');
        slist.classList.add('loadingres')
        $('#criteriasavebtn').prop('disabled',true);
         $.ajax({
             url: `${baseAPIUrl}${searchQueryUrl}`,
             type: "GET",
             contentType: "application/json",
         }).done(function (result) {
          $('#criteriasavebtn').prop('disabled',false);
          $('#criteriasavebtn').removeClass('govuk-button--disabled');
          $("#clearfilter").attr("href", result.clearFilterURL);
          if(result.data.meta.total > 0) {
            slist.classList.remove('loadingres')
            getCriterianDetails(result.data.meta.total);
            document.getElementById('rightSidefooterCotainer').innerHTML = '';
            
            var mainLothtml = '';
            if(result.njkDatas.haveLot) {
            mainLothtml = '<a class="govuk-link govuk-link-filter-main" href="/g-cloud/search">All Categories</a>';
            }else {
            mainLothtml += '<strong>All Categories</strong>'
            mainLothtml += '<ul class="govuk-list">'
            result.njkDatas.lotInfos.lots.forEach(lotwithcount => {
              mainLothtml +='<li><a data-name="lot" data-value="'+ lotwithcount.slug+'" class="govuk-link clickCategory" style="cursor: pointer !important;">'+ titleCase(lotwithcount.key)+ ' (' +lotwithcount.count+')</a></li>';
            })
            mainLothtml +='</ul>'
          } 

            if(result.njkDatas.haveLot){
            mainLothtml += '<ul class="govuk-list">'
              if(result.njkDatas.haveserviceCategory){ 
                mainLothtml +=  '<a class="govuk-link govuk-link-filter-main" href="/g-cloud/search?lot='+ result.njkDatas.lotInfos.slug+'">'+ result.njkDatas.lotInfos.label+'</a>'
              }else{
                mainLothtml +=  '<li><strong>'+ titleCase(result.njkDatas.lotInfos.label)+' </strong></li>'
              }
              if(result.njkDatas.lotInfos.currentparentCategory){
              mainLothtml += '<p><a class="govuk-link govuk-link-filter-main" href="/g-cloud/search?lot='+result.njkDatas.lotInfos.slug+'&serviceCategories='+ result.njkDatas.lotInfos.currentparentCategory+'">'+ titleCase(result.njkDatas.lotInfos.currentparentCategory) +'</a></p>';
              }

            mainLothtml += '<li>';
            mainLothtml += '<ul class="govuk-list govuk-!-margin-top-0">';
            mainLothtml +=  '<ul class="govuk-list govuk-!-margin-top-0 govuk-!-margin-left-2">';
            result.njkDatas.lotInfos.subservices.forEach(subservice => {
              if(subservice.childrenssts) {
                        if(result.njkDatas.lotInfos.currentparentCategory) {
                          mainLothtml += '<li>';
                            mainLothtml += '<ul class="govuk-list govuk-!-margin-top-0">';
                            mainLothtml += '<ul class="govuk-list govuk-!-margin-top-0 govuk-!-margin-left-2">';
                              subservice.childrens.forEach(child => {
                                if(child.value == result.njkDatas.lotInfos.currentserviceCategory ) {
                                    mainLothtml += '<li><strong>'+ child.label+' ('+child.count+')</strong></li>';
                                  } else {
                                    var childVal = child.value.split(' ').join('+');
                                    mainLothtml += '<li><a class="govuk-link parentCategory" data-name="'+child.name+'" data-value="'+ childVal +'">'+child.label+'('+child.count+')</a></li>';
                                  }
                                }); 
                                mainLothtml += '</ul>';
                            mainLothtml += '</ul>';
                        } else {
                          mainLothtml += '<li>';
                          mainLothtml += '<strong>'+ titleCase(result.njkDatas.lotInfos.currentserviceCategory) +'</strong>';
                          mainLothtml += '<ul class="govuk-list govuk-!-margin-top-0">';
                          mainLothtml += '<ul class="govuk-list govuk-!-margin-top-0 govuk-!-margin-left-2">';
                              subservice.childrens.forEach(child => {
                                var childVal = child.value.split(' ').join('+');
                                mainLothtml +=  '<li><a class="govuk-link parentCategory" data-name="'+ child.name+'" data-value="'+ childVal +'">'+child.label+'('+child.count+')</a></li>';
                                }); 
                          mainLothtml += '</ul>';
                          mainLothtml += '</ul>';
                        }
                        mainLothtml += '</li>';
                } else {

                      if(subservice.value == result.njkDatas.lotInfos.currentserviceCategory ) {
                        mainLothtml +=  '<li><strong>'+subservice.label+'</strong></li>';
                      } else {
                        if(subservice.name !== 'supportMultiCloud' ) {
                          var subserviceValue = subservice.value.split(' ').join('+');
                          mainLothtml +=  '<li><a class="govuk-link serviceCategory" data-name="'+ subservice.name +'" data-value="'+ subserviceValue +'">'+subservice.label+  '('+ subservice.count +')</a></li>';
                        }
                      }
                }
              }); 
              mainLothtml += '</ul>';
              mainLothtml += '</ul>';
              mainLothtml += '</li>';
              mainLothtml += '</ul>';
          }
          document.getElementById('mainLotandcategoryContainer').innerHTML = mainLothtml;
          
            var searchresultshtml = '';
            searchresultshtml +=  '<div class="govuk-grid-row">';
            searchresultshtml +=  '<div class="govuk-grid-column-full">';
            searchresultshtml +=  '<ul class="govuk-list govuk-supplier-list">';
            result.data.documents.forEach(element => {
            searchresultshtml +=  '<li class="app-search-result">'
                                    +'<h2 class="govuk-heading-s govuk-!-margin-bottom-1">'
                                    +'<a class="govuk-link" href="/g-cloud/services?id='+element.id+'">'+ element.serviceName+'</a>'
                                    +'</h2>'
                                    +'<p class="govuk-body govuk-!-font-size-16 govuk-!-font-weight-bold">'+ element.supplierName+'</p>'
                                    +'<p class="govuk-body govuk-!-font-size-16">'+ element.serviceDescription+'</p>'
                                    +'<ul aria-label="tags" class="govuk-list app-search-result__metadata">'
                                    +'<li class="govuk-!-display-inline govuk-!-padding-right-4">'+ element.lotName+'</li>'
                                    +'<li class="govuk-!-display-inline">'+ element.frameworkName+'</li>'
                                    +'</ul>'
                                    +'</li>';

          });
          searchresultshtml +=  '<div>';
          searchresultshtml +=  '<div>';
          searchresultshtml +=  '<ul>';
          document.getElementById('searchResultsContainer').innerHTML = searchresultshtml;

          var paginationHtml = ''
          paginationHtml += '<div class="govuk-grid-row">';
          paginationHtml += '<div class="govuk-grid-column-full">';
          paginationHtml += '<div class="govuk-grid-column-one-half">';
          paginationHtml += '<div>';
          paginationHtml += '&nbsp;';
            if(result.njkDatas.PrvePageUrl != ''){
              if(result.njkDatas.CurrentPageNumber != 1){
              paginationHtml += '<p class="govuk-body govuk-!-margin-0">';
              paginationHtml += '<a href="/g-cloud/search?'+ result.njkDatas.PrvePageUrl+'" class="govuk-link govuk-link--no-visited-state govuk-!-font-weight-bold govuk-!-font-size-24 paginationUrlClass">';
              paginationHtml += '<svg class="govuk-pagination__icon govuk-pagination__icon--prev" xmlns="http://www.w3.org/2000/svg" height="13" width="15" aria-hidden="true" focusable="false" viewBox="0 0 15 13" fill="#1d70b8">';
              paginationHtml += '<path d="m6.5938-0.0078125-6.7266 6.7266 6.7441 6.4062 1.377-1.449-4.1856-3.9768h12.896v-2h-12.984l4.2931-4.293-1.414-1.414z"></path>';
              paginationHtml += '</svg>';
              paginationHtml += 'Previous Page</a>';
              paginationHtml += '</p>';
              paginationHtml += '<p class="govuk-body govuk-!-margin-0"><label class="govuk-!-font-size-16">'+ (result.njkDatas.CurrentPageNumber - 1) +' of '+ result.njkDatas.noOfPages+'</label></p>  ';
            }
          }
          paginationHtml += '</div>';
          paginationHtml += '</div>';
  
          paginationHtml += '<div class="govuk-grid-column-one-half govuk-!-text-align-right">';
          paginationHtml += '<div>';
          paginationHtml += '&nbsp;';
          if(result.njkDatas.NextPageUrl != ''){
          paginationHtml += '<p class="govuk-body govuk-!-margin-0">';
          paginationHtml += '<a href="/g-cloud/search?'+ result.njkDatas.NextPageUrl+'" class="govuk-link govuk-link--no-visited-state govuk-!-font-weight-bold govuk-!-font-size-24 paginationUrlClass">';
          paginationHtml += '<svg class="govuk-pagination__icon govuk-pagination__icon--next" xmlns="http://www.w3.org/2000/svg" height="13" width="15" aria-hidden="true" focusable="false" viewBox="0 0 15 13" fill="#1d70b8">';
          paginationHtml += '<path d="m8.107-0.0078125-1.4136 1.414 4.2926 4.293h-12.986v2h12.896l-4.1855 3.9766 1.377 1.4492 6.7441-6.4062-6.7246-6.7266z"></path>';
          paginationHtml += '</svg>';
          paginationHtml += 'Next Page</a>';
          paginationHtml += '</p>';
        }
          if(result.njkDatas.noOfPages=='0' || result.njkDatas.noOfPages =='1'){
            paginationHtml += '<p class="govuk-body govuk-!-margin-0"><label class="govuk-!-font-size-16">'+ (result.njkDatas.CurrentPageNumber) +' of 1</label></p>';
          }else{
            paginationHtml += '<p class="govuk-body govuk-!-margin-0"><label class="govuk-!-font-size-16">'+ (result.njkDatas.CurrentPageNumber) +' of '+ result.njkDatas.noOfPages+'</label></p>';
          }
          paginationHtml += '</div>';
          paginationHtml += '</div>';
          paginationHtml += '</div>';
          paginationHtml += '</div>';
          document.getElementById('paginationContainer').innerHTML = paginationHtml;
        }else{
          $('#criteriasavebtn').prop('disabled',true);
          document.getElementById('searchResultsContainer').innerHTML = '';
          getCriterianDetails(0);
          slist.classList.remove('loadingres')
          
          document.getElementById('rightSidefooterCotainer').innerHTML = ''; 
          var Noresulthtml = '';
          Noresulthtml += '<h3 class="govuk-heading-m">Improve your search results by:</h3>';
          Noresulthtml += '<ul class="govuk-list govuk-!-margin-top-0">';
          Noresulthtml += '<ul class="govuk-list govuk-!-margin-top-0 govuk-!-margin-left-2">';
          Noresulthtml += '</li>removing filters</li><br>';
          Noresulthtml += '</li>choosing a different category</li><br>';
          Noresulthtml += '</li>double-checking your spelling</li><br>';
          Noresulthtml += '</li>using fewer keywords</li><br>';
          Noresulthtml += '</li>searching for something less specific, you can refine your results later</li><br>';
          Noresulthtml += '</ul>';
          Noresulthtml += '</ul>';
          document.getElementById('rightSidefooterCotainer').innerHTML = Noresulthtml; 
        }
        loadQuerySelector();
         }).fail((res) => {
         })
    });
  }
});


function loadQuerySelector(){
  document.querySelectorAll(".clickCategory").forEach(function(event) {
    event.addEventListener('click', function() {
      let eventFilterType = 'categoryClicked';
      let filterName = this.getAttribute("data-name");
      let filterValue = this.getAttribute("data-value");
      let urlObj = parseQueryG13(document.location.search);
      urlObj = tune(urlObj);
      let baseUrl = window.location.href.split('?')[0];
      let finalTriggerUrl = g13ServiceQueryFliterJquery(urlObj, baseUrl, {name: filterName, value: filterValue, type: eventFilterType});
      window.location.href = `${baseUrl}${finalTriggerUrl}`;
    });
  });
  
  if(document.querySelectorAll('.serviceCategory')) {
    document.querySelectorAll(".serviceCategory").forEach(function(event) {
      event.addEventListener('click', function() {
        let eventFilterType = 'serviceCategoryClicked';
        let filterName = this.getAttribute('data-name');
        let filterValue = this.getAttribute('data-value');
        let urlObj = parseQueryG13(document.location.search);
        urlObj = tune(urlObj);
  
        let finalObj = [];
        urlObj.find((el) => {
        if(el.key !== 'serviceCategories') { finalObj.push(el); } });
        urlObj = finalObj;
        urlObj.push({"key":"serviceCategories","value":filterValue});
  
        let baseUrl = window.location.href.split('?')[0];
        let finalTriggerUrl = g13ServiceQueryFliterJquery(urlObj, baseUrl, {name: filterName, value: filterValue, type: eventFilterType});
        window.location.href = `${baseUrl}${finalTriggerUrl}`;
      });
    });
  }
  
  if(document.querySelectorAll('.parentCategory')) {
    document.querySelectorAll(".parentCategory").forEach(function(event) {
      event.addEventListener('click', function() {
        let eventFilterType = 'parentCategoryClicked';
        let filterName = this.getAttribute('data-name');
        let filterValue = this.getAttribute('data-value');
        let urlObj = parseQueryG13(document.location.search);
        urlObj = tune(urlObj);
  
        let condtionParentCat = urlObj.find(el => el.key === 'parentCategory');
        if(condtionParentCat === undefined) {
          let serviceCategory = urlObj.find(el => el.key === 'serviceCategories');
          urlObj.push({"key":"parentCategory","value":serviceCategory.value});
          urlObj.splice(urlObj.findIndex(({key}) => key == "serviceCategories"), 1);
          urlObj.push({"key":"serviceCategories","value":filterValue});
        } else {
          let finalObj = [];
          urlObj.find((el) => {
          if(el.key !== 'serviceCategories') { finalObj.push(el); } });
          urlObj = finalObj;
          urlObj.push({"key":"serviceCategories","value":filterValue});
        }
  
        let baseUrl = window.location.href.split('?')[0];
        let finalTriggerUrl = g13ServiceQueryFliterJquery(urlObj, baseUrl, {name: filterName, value: filterValue, type: eventFilterType});
        window.location.href = `${baseUrl}${finalTriggerUrl}`;
      });
    });
  }
}

document.addEventListener('readystatechange', event => { 
  if (event.target.readyState === "complete") {
      let queryParamObj = parseQueryG13(document.location.search);
      queryParamObj = tune(queryParamObj);
     
      queryParamObj.forEach((el, i) => {
        console.log(el);
        //Search
        if(el.key === 'q') { $('.g13_search').val(el.value); }
        $('.g13Check').each(function(){
          if($(this).attr('name') == el.key && $(this).val() == el.value){
            $(this).attr("checked", "checked");
          }
        });
      });
// total results
      var totalResult=$('#totalResult').attr('data-value');

      getCriterianDetails(totalResult);
     
  }
});

function getCriterianDetails(totalresult=0){
  

  let rows_selected = [];
        $(".g13Check:checked").each(function(){
          var $this = $(this);
          rows_selected.push({
            title:$this.attr('data-title'),
            name: $this.attr('data-name'),
            });
       });

       const groupBy = (array, key) => {
        return array.reduce((result, currentValue) => {
          (result[currentValue[key]] = result[currentValue[key]] || []).push(
            currentValue
          );
          return result;
        }, {}); 
      };
      const criteria = groupBy(rows_selected, 'title');
      let criteriaDetails='<b class="govuk-!-font-size-48">'+totalresult+'</b> results found';

      let queryParamObj = parseQueryG13(document.location.search);
      queryParamObj = tune(queryParamObj);
     
      
       let search = queryParamObj.filter(el => el.key === 'q');
       if(search.length > 0){
        criteriaDetails +=' containing <b>'+ search[0].value +'</b>';
       }
     
       let lot = queryParamObj.filter(el => el.key === 'lot');
       if(lot.length > 0){
        criteriaDetails +=' in <b>'+ capitalize(lot[0].value.replace("-", " ")) +'</b>';
       }else{
        criteriaDetails +=' in <b>All Categories</b>';
       }

       let serviceCategories = queryParamObj.filter(el => el.key === 'serviceCategories');
       if(serviceCategories.length > 0){
        criteriaDetails +=' in the category <b>'+ capitalize(serviceCategories[0].value.replace("+", " ")) +'</b>';
       }
       

      Object.keys(criteria).forEach(key => {
        if(key !==undefined){
          criteriaDetails +=', where <b>'+ capitalize(key) +'</b> is ';
          let values=[];
          for (let index = 0; index < criteria[key].length; index++) {
            values.push('<b>'+capitalize(criteria[key][index].name)+'</b>');
          }
          criteriaDetails +=values.join(" and ");

        }
      });
      $('#criteriandetails').html(criteriaDetails);
      $('#criteriadetailsform').val(criteriaDetails.replace('govuk-!-font-size-48','govuk-!-font-size-24'));
      
      
}

const capitalize = (s) => {
  if (typeof s !== 'string') return ''
  return s.charAt(0).toUpperCase() + s.slice(1)
}


document.querySelectorAll(".dos_evaluate_supplier").forEach(function(event) {
event.addEventListener('change', function(event) {
    var evaluateSupplier =$('.dos_evaluate_supplier:checked').map(function() {
      return this.value;
      }).get().join(', ');
      $('#invite_suppliers').val(evaluateSupplier);
  })

  var evaluateSupplier =$('.dos_evaluate_supplier:checked').map(function() {
    return this.value;
    }).get().join(', ');
    $('#invite_suppliers').val(evaluateSupplier);
})

document.querySelectorAll(".dos_evaluate_supplier").forEach(function(event) {
  event.addEventListener('change', function(event) {
      var evaluateSupplier =$('.dos_evaluate_supplier:checked').map(function() {
        return this.value;
        }).get().join(', ');
        $('#invite_suppliers').val(evaluateSupplier);
    })
  
    var evaluateSupplier =$('.dos_evaluate_supplier:checked').map(function() {
      return this.value;
      }).get().join(', ');
      $('#invite_suppliers').val(evaluateSupplier);
  })
  

  document.querySelectorAll("#invite_short_list_suppliers_btn").forEach(function(event) {
    event.addEventListener('click', function(event) {
      document.getElementById("invite_short_list_suppliers").submit();
      })
    
     
    })





