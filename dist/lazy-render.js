var LazyRender = (function () {
  'use strict';

  function _classCallCheck(instance, Constructor) {
    if (!(instance instanceof Constructor)) {
      throw new TypeError("Cannot call a class as a function");
    }
  }

  function _unsupportedIterableToArray(o, minLen) {
    if (!o) return;
    if (typeof o === "string") return _arrayLikeToArray(o, minLen);
    var n = Object.prototype.toString.call(o).slice(8, -1);
    if (n === "Object" && o.constructor) n = o.constructor.name;
    if (n === "Map" || n === "Set") return Array.from(o);
    if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen);
  }

  function _arrayLikeToArray(arr, len) {
    if (len == null || len > arr.length) len = arr.length;

    for (var i = 0, arr2 = new Array(len); i < len; i++) arr2[i] = arr[i];

    return arr2;
  }

  function _createForOfIteratorHelper(o, allowArrayLike) {
    var it;

    if (typeof Symbol === "undefined" || o[Symbol.iterator] == null) {
      if (Array.isArray(o) || (it = _unsupportedIterableToArray(o)) || allowArrayLike && o && typeof o.length === "number") {
        if (it) o = it;
        var i = 0;

        var F = function () {};

        return {
          s: F,
          n: function () {
            if (i >= o.length) return {
              done: true
            };
            return {
              done: false,
              value: o[i++]
            };
          },
          e: function (e) {
            throw e;
          },
          f: F
        };
      }

      throw new TypeError("Invalid attempt to iterate non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.");
    }

    var normalCompletion = true,
        didErr = false,
        err;
    return {
      s: function () {
        it = o[Symbol.iterator]();
      },
      n: function () {
        var step = it.next();
        normalCompletion = step.done;
        return step;
      },
      e: function (e) {
        didErr = true;
        err = e;
      },
      f: function () {
        try {
          if (!normalCompletion && it.return != null) it.return();
        } finally {
          if (didErr) throw err;
        }
      }
    };
  }

  /*!
   * lazy-render.js v1.0.0
   * https://github.com/AstroCaleb/lazy-render
   *
   * Copyright 2021-Present Caleb Dudley
   * Released under the MIT license
   */
  var LazyRender =
  /**
   * Create a new LazyRender instance.
   * @param {Object} [options={}] - The configuration options.
   */
  function LazyRender() {
    var _this = this;

    var options = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};

    _classCallCheck(this, LazyRender);

    if (options.distanceThreshold !== undefined && typeof options.distanceThreshold !== 'number') {
      throw new Error('The distance from viewport for rendering must be a a number, preferably 0-100. A default value of 75 is used if this is not defined. 0 being that the element will render when immediately outside the viewport. 100 being where the element is 100% the viewport height or width away from being in view when rendered.');
    }

    this.options = options;
    this.threshold = options.distanceThreshold || 75;

    this.callback = options.callback || function () {};

    this.lazyRenderThrottleTimeout;
    var existingStyleTags = document.getElementsByTagName('style');
    var customStyleTagExists = false;

    var _iterator = _createForOfIteratorHelper(existingStyleTags),
        _step;

    try {
      for (_iterator.s(); !(_step = _iterator.n()).done;) {
        var tag = _step.value;
        tag.dataset.lazyRenderStyle && (customStyleTagExists = true);
      }
    } catch (err) {
      _iterator.e(err);
    } finally {
      _iterator.f();
    }

    if (!customStyleTagExists) {
      var delayItemCSS = "\n                @keyframes lazyRenderDelayElementIn {\n                    0% { opacity: 0; }\n                    100% { opacity: 1; }\n                }\n                [data-lazy-render] { opacity: 0 !important; }\n                [data-lazy-render].fade-in { animation: lazyRenderDelayElementIn 0.4s ease 0.3s normal forwards; }\n            ";
      var documentHead = document.head || document.getElementsByTagName('head')[0];
      var styleTag = document.createElement('style');
      styleTag.setAttribute('data-lazy-render-style', 'lazy-render');
      styleTag.appendChild(document.createTextNode(delayItemCSS));
      documentHead.appendChild(styleTag);
    }

    var elementNearOrInView = function elementNearOrInView(el) {
      var rect = el.getBoundingClientRect();
      var windowHeight = window.innerHeight || document.documentElement.clientHeight;
      var windowWidth = window.innerWidth || document.documentElement.clientWidth; // If the element is within a specified distance of the viewport

      return rect.top >= 0 - windowHeight * (_this.threshold * 0.01) && rect.left >= 0 - windowWidth * (_this.threshold * 0.01) && rect.bottom <= windowHeight + windowHeight * (_this.threshold * 0.01) && rect.right <= windowWidth + windowWidth * (_this.threshold * 0.01);
    };

    var lazyRender = function lazyRender() {
      if (_this.lazyRenderThrottleTimeout) {
        clearTimeout(_this.lazyRenderThrottleTimeout);
      }

      _this.lazyRenderThrottleTimeout = setTimeout(function () {
        document.querySelectorAll('[data-lazy-render]').forEach(function (el) {
          if (elementNearOrInView(el)) {
            try {
              var newAttr = el.dataset.lazyRender.split(';');
              el[newAttr[0]] = newAttr[1];
            } catch (e) {}

            if (!el.classList.contains('fade-in')) {
              el.classList.add('fade-in');

              _this.callback();
            }

            setTimeout(function () {
              el.classList.remove('fade-in');
              delete el.dataset.lazyRender;
            }, 700);
          }
        });

        if (!document.querySelectorAll('[data-lazy-render]').length) {
          document.removeEventListener('DOMContentLoaded', lazyRender, false);
          window.removeEventListener('scroll', lazyRender, false);
          window.removeEventListener('load', lazyRender, false);
          window.removeEventListener('resize', lazyRender, false);
          window.removeEventListener('orientationChange', lazyRender, false);
        }
      }, 10);
    };

    if (document.querySelectorAll('[data-lazy-render]').length) {
      document.addEventListener('DOMContentLoaded', lazyRender, false);
      window.addEventListener('scroll', lazyRender, false);
      window.addEventListener('load', lazyRender, false);
      window.addEventListener('resize', lazyRender, false);
      window.addEventListener('orientationChange', lazyRender, false);
    }
  };

  return LazyRender;

}());
