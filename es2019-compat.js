/* @fluent/bundle@0.14.0 */
(function (global, factory) {
  typeof exports === 'object' && typeof module !== 'undefined' ? factory(exports) :
  typeof define === 'function' && define.amd ? define('@fluent/bundle', ['exports'], factory) :
  (global = global || self, factory(global.FluentBundle = {}));
}(this, function (exports) { 'use strict';

  function _defineProperty(obj, key, value) {
    if (key in obj) {
      Object.defineProperty(obj, key, {
        value: value,
        enumerable: true,
        configurable: true,
        writable: true
      });
    } else {
      obj[key] = value;
    }

    return obj;
  }

  function _objectSpread(target) {
    for (var i = 1; i < arguments.length; i++) {
      var source = arguments[i] != null ? arguments[i] : {};
      var ownKeys = Object.keys(source);

      if (typeof Object.getOwnPropertySymbols === 'function') {
        ownKeys = ownKeys.concat(Object.getOwnPropertySymbols(source).filter(function (sym) {
          return Object.getOwnPropertyDescriptor(source, sym).enumerable;
        }));
      }

      ownKeys.forEach(function (key) {
        _defineProperty(target, key, source[key]);
      });
    }

    return target;
  }

  function _slicedToArray(arr, i) {
    return _arrayWithHoles(arr) || _iterableToArrayLimit(arr, i) || _nonIterableRest();
  }

  function _arrayWithHoles(arr) {
    if (Array.isArray(arr)) return arr;
  }

  function _iterableToArrayLimit(arr, i) {
    var _arr = [];
    var _n = true;
    var _d = false;
    var _e = undefined;

    try {
      for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) {
        _arr.push(_s.value);

        if (i && _arr.length === i) break;
      }
    } catch (err) {
      _d = true;
      _e = err;
    } finally {
      try {
        if (!_n && _i["return"] != null) _i["return"]();
      } finally {
        if (_d) throw _e;
      }
    }

    return _arr;
  }

  function _nonIterableRest() {
    throw new TypeError("Invalid attempt to destructure non-iterable instance");
  }

  /**
   * The `FluentType` class is the base of Fluent's type system.
   *
   * Fluent types wrap JavaScript values and store additional configuration for
   * them, which can then be used in the `toString` method together with a proper
   * `Intl` formatter.
   */
  class FluentType {
    /**
     * Create a `FluentType` instance.
     *
     * @param   value - JavaScript value to wrap.
     */
    constructor(value) {
      this.value = value;
    }
    /**
     * Unwrap the raw value stored by this `FluentType`.
     */


    valueOf() {
      return this.value;
    }
    /**
     * Format this instance of `FluentType` to a string.
     *
     * Formatted values are suitable for use outside of the `FluentBundle`.
     * This method can use `Intl` formatters available through the `scope`
     * argument.
     *
     * @abstract
     */
    // eslint-disable-next-line no-unused-vars


    toString(scope) {
      throw new Error("Subclasses of FluentType must implement toString.");
    }

  }
  /**
   * A `FluentType` representing no correct value.
   */

  class FluentNone extends FluentType {
    /**
     * Create an instance of `FluentNone` with an optional fallback value.
     * @param   value - The fallback value of this `FluentNone`.
     */
    constructor() {
      let value = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : "???";
      super(value);
    }
    /**
     * Format this `FluentNone` to the fallback string.
     */


    toString(scope) {
      return "{".concat(this.value, "}");
    }

  }
  /**
   * A `FluentType` representing a number.
   */

  class FluentNumber extends FluentType {
    /**
     * Create an instance of `FluentNumber` with options to the
     * `Intl.NumberFormat` constructor.
     */
    constructor(value) {
      let opts = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
      super(value);
      this.opts = opts;
    }
    /**
     * Format this `FluentNumber` to a string.
     */


    toString(scope) {
      try {
        const nf = scope.memoizeIntlObject(Intl.NumberFormat, this.opts);
        return nf.format(this.value);
      } catch (err) {
        scope.reportError(err);
        return this.value.toString(10);
      }
    }

  }
  /**
   * A `FluentType` representing a date and time.
   */

  class FluentDateTime extends FluentType {
    /**
     * Create an instance of `FluentDateTime` with options to the
     * `Intl.DateTimeFormat` constructor.
     * @param   value - timestamp in milliseconds
     * @param   opts
     */
    constructor(value) {
      let opts = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
      super(value);
      this.opts = opts;
    }
    /**
     * Format this `FluentDateTime` to a string.
     */


    toString(scope) {
      try {
        const dtf = scope.memoizeIntlObject(Intl.DateTimeFormat, this.opts);
        return dtf.format(this.value);
      } catch (err) {
        scope.reportError(err);
        return new Date(this.value).toISOString();
      }
    }

  }

  function values(opts) {
    const unwrapped = {};

    for (var _i = 0, _Object$entries = Object.entries(opts); _i < _Object$entries.length; _i++) {
      const _Object$entries$_i = _slicedToArray(_Object$entries[_i], 2),
            name = _Object$entries$_i[0],
            opt = _Object$entries$_i[1];

      unwrapped[name] = opt.valueOf();
    }

    return unwrapped;
  }

  function NUMBER(_ref, opts) {
    let _ref2 = _slicedToArray(_ref, 1),
        arg = _ref2[0];

    if (arg instanceof FluentNone) {
      return new FluentNone("NUMBER(".concat(arg.valueOf(), ")"));
    }

    if (arg instanceof FluentNumber) {
      let value = Number(arg.valueOf());

      if (Number.isNaN(value)) {
        throw new TypeError("Invalid argument to NUMBER");
      }

      return new FluentNumber(value, _objectSpread({}, arg.opts, values(opts)));
    }

    return new FluentNone("NUMBER(???)");
  }
  function DATETIME(_ref3, opts) {
    let _ref4 = _slicedToArray(_ref3, 1),
        arg = _ref4[0];

    if (arg instanceof FluentNone) {
      return new FluentNone("DATETIME(".concat(arg.valueOf(), ")"));
    }

    if (arg instanceof FluentDateTime) {
      let value = Number(arg.valueOf());

      if (Number.isNaN(value)) {
        throw new TypeError("Invalid argument to DATETIME");
      }

      return new FluentDateTime(value, _objectSpread({}, arg.opts, values(opts)));
    }

    return new FluentNone("DATETIME(???)");
  }

  const MAX_PLACEABLE_LENGTH = 2500; // Unicode bidi isolation characters.

  const FSI = "\u2068";
  const PDI = "\u2069"; // Helper: match a variant key to the given selector.

  function match(scope, selector, key) {
    if (key === selector) {
      // Both are strings.
      return true;
    } // XXX Consider comparing options too, e.g. minimumFractionDigits.


    if (key instanceof FluentNumber && selector instanceof FluentNumber && key.value === selector.value) {
      return true;
    }

    if (selector instanceof FluentNumber && typeof key === "string") {
      let category = scope.memoizeIntlObject(Intl.PluralRules, selector.opts).select(selector.value);

      if (key === category) {
        return true;
      }
    }

    return false;
  } // Helper: resolve the default variant from a list of variants.


  function getDefault(scope, variants, star) {
    if (variants[star]) {
      return resolvePattern(scope, variants[star].value);
    }

    scope.reportError(new RangeError("No default"));
    return new FluentNone();
  } // Helper: resolve arguments to a call expression.


  function getArguments(scope, args) {
    const positional = [];
    const named = {};
    var _iteratorNormalCompletion = true;
    var _didIteratorError = false;
    var _iteratorError = undefined;

    try {
      for (var _iterator = args[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
        const arg = _step.value;

        if (arg.type === "narg") {
          named[arg.name] = resolveExpression(scope, arg.value);
        } else {
          positional.push(resolveExpression(scope, arg));
        }
      }
    } catch (err) {
      _didIteratorError = true;
      _iteratorError = err;
    } finally {
      try {
        if (!_iteratorNormalCompletion && _iterator.return != null) {
          _iterator.return();
        }
      } finally {
        if (_didIteratorError) {
          throw _iteratorError;
        }
      }
    }

    return [positional, named];
  } // Resolve an expression to a Fluent type.


  function resolveExpression(scope, expr) {
    switch (expr.type) {
      case "str":
        return expr.value;

      case "num":
        return new FluentNumber(expr.value, {
          minimumFractionDigits: expr.precision
        });

      case "var":
        return VariableReference(scope, expr);

      case "mesg":
        return MessageReference(scope, expr);

      case "term":
        return TermReference(scope, expr);

      case "func":
        return FunctionReference(scope, expr);

      case "select":
        return SelectExpression(scope, expr);

      default:
        return new FluentNone();
    }
  } // Resolve a reference to a variable.


  function VariableReference(scope, _ref) {
    let name = _ref.name;

    if (!scope.args || !scope.args.hasOwnProperty(name)) {
      if (scope.insideTermReference === false) {
        scope.reportError(new ReferenceError("Unknown variable: $".concat(name)));
      }

      return new FluentNone("$".concat(name));
    }

    const arg = scope.args[name]; // Return early if the argument already is an instance of FluentType.

    if (arg instanceof FluentType) {
      return arg;
    } // Convert the argument to a Fluent type.


    switch (typeof arg) {
      case "string":
        return arg;

      case "number":
        return new FluentNumber(arg);

      case "object":
        if (arg instanceof Date) {
          return new FluentDateTime(arg.getTime());
        }

      default:
        scope.reportError(new TypeError("Variable type not supported: $".concat(name, ", ").concat(typeof arg)));
        return new FluentNone("$".concat(name));
    }
  } // Resolve a reference to another message.


  function MessageReference(scope, _ref2) {
    let name = _ref2.name,
        attr = _ref2.attr;

    const message = scope.bundle._messages.get(name);

    if (!message) {
      scope.reportError(new ReferenceError("Unknown message: ".concat(name)));
      return new FluentNone(name);
    }

    if (attr) {
      const attribute = message.attributes[attr];

      if (attribute) {
        return resolvePattern(scope, attribute);
      }

      scope.reportError(new ReferenceError("Unknown attribute: ".concat(attr)));
      return new FluentNone("".concat(name, ".").concat(attr));
    }

    if (message.value) {
      return resolvePattern(scope, message.value);
    }

    scope.reportError(new ReferenceError("No value: ".concat(name)));
    return new FluentNone(name);
  } // Resolve a call to a Term with key-value arguments.


  function TermReference(scope, _ref3) {
    let name = _ref3.name,
        attr = _ref3.attr,
        args = _ref3.args;
    const id = "-".concat(name);

    const term = scope.bundle._terms.get(id);

    if (!term) {
      scope.reportError(new ReferenceError("Unknown term: ".concat(id)));
      return new FluentNone(id);
    } // Every TermReference has its own variables.


    const _getArguments = getArguments(scope, args),
          _getArguments2 = _slicedToArray(_getArguments, 2),
          params = _getArguments2[1];

    const local = scope.cloneForTermReference(params);

    if (attr) {
      const attribute = term.attributes[attr];

      if (attribute) {
        return resolvePattern(local, attribute);
      }

      scope.reportError(new ReferenceError("Unknown attribute: ".concat(attr)));
      return new FluentNone("".concat(id, ".").concat(attr));
    }

    return resolvePattern(local, term.value);
  } // Resolve a call to a Function with positional and key-value arguments.


  function FunctionReference(scope, _ref4) {
    let name = _ref4.name,
        args = _ref4.args;
    // Some functions are built-in. Others may be provided by the runtime via
    // the `FluentBundle` constructor.
    let func = scope.bundle._functions[name];

    if (!func) {
      switch (name) {
        case "NUMBER":
          func = NUMBER;
          break;

        case "DATETIME":
          func = DATETIME;
          break;

        default:
          scope.reportError(new ReferenceError("Unknown function: ".concat(name, "()")));
          return new FluentNone("".concat(name, "()"));
      }
    }

    if (typeof func !== "function") {
      scope.reportError(new TypeError("Function ".concat(name, "() is not callable")));
      return new FluentNone("".concat(name, "()"));
    }

    try {
      return func(...getArguments(scope, args));
    } catch (err) {
      scope.reportError(err);
      return new FluentNone("".concat(name, "()"));
    }
  } // Resolve a select expression to the member object.


  function SelectExpression(scope, _ref5) {
    let selector = _ref5.selector,
        variants = _ref5.variants,
        star = _ref5.star;
    let sel = resolveExpression(scope, selector);

    if (sel instanceof FluentNone) {
      return getDefault(scope, variants, star);
    } // Match the selector against keys of each variant, in order.


    var _iteratorNormalCompletion2 = true;
    var _didIteratorError2 = false;
    var _iteratorError2 = undefined;

    try {
      for (var _iterator2 = variants[Symbol.iterator](), _step2; !(_iteratorNormalCompletion2 = (_step2 = _iterator2.next()).done); _iteratorNormalCompletion2 = true) {
        const variant = _step2.value;
        const key = resolveExpression(scope, variant.key);

        if (match(scope, sel, key)) {
          return resolvePattern(scope, variant.value);
        }
      }
    } catch (err) {
      _didIteratorError2 = true;
      _iteratorError2 = err;
    } finally {
      try {
        if (!_iteratorNormalCompletion2 && _iterator2.return != null) {
          _iterator2.return();
        }
      } finally {
        if (_didIteratorError2) {
          throw _iteratorError2;
        }
      }
    }

    return getDefault(scope, variants, star);
  } // Resolve a pattern (a complex string with placeables).


  function resolveComplexPattern(scope, ptn) {
    if (scope.dirty.has(ptn)) {
      scope.reportError(new RangeError("Cyclic reference"));
      return new FluentNone();
    } // Tag the pattern as dirty for the purpose of the current resolution.


    scope.dirty.add(ptn);
    const result = []; // Wrap interpolations with Directional Isolate Formatting characters
    // only when the pattern has more than one element.

    const useIsolating = scope.bundle._useIsolating && ptn.length > 1;
    var _iteratorNormalCompletion3 = true;
    var _didIteratorError3 = false;
    var _iteratorError3 = undefined;

    try {
      for (var _iterator3 = ptn[Symbol.iterator](), _step3; !(_iteratorNormalCompletion3 = (_step3 = _iterator3.next()).done); _iteratorNormalCompletion3 = true) {
        const elem = _step3.value;

        if (typeof elem === "string") {
          result.push(scope.bundle._transform(elem));
          continue;
        }

        const part = resolveExpression(scope, elem).toString(scope);

        if (useIsolating) {
          result.push(FSI);
        }

        if (part.length > MAX_PLACEABLE_LENGTH) {
          scope.dirty.delete(ptn); // This is a fatal error which causes the resolver to instantly bail out
          // on this pattern. The length check protects against excessive memory
          // usage, and throwing protects against eating up the CPU when long
          // placeables are deeply nested.

          throw new RangeError("Too many characters in placeable " + "(".concat(part.length, ", max allowed is ").concat(MAX_PLACEABLE_LENGTH, ")"));
        }

        result.push(part);

        if (useIsolating) {
          result.push(PDI);
        }
      }
    } catch (err) {
      _didIteratorError3 = true;
      _iteratorError3 = err;
    } finally {
      try {
        if (!_iteratorNormalCompletion3 && _iterator3.return != null) {
          _iterator3.return();
        }
      } finally {
        if (_didIteratorError3) {
          throw _iteratorError3;
        }
      }
    }

    scope.dirty.delete(ptn);
    return result.join("");
  } // Resolve a simple or a complex Pattern to a FluentString (which is really the
  // string primitive).

  function resolvePattern(scope, value) {
    // Resolve a simple pattern.
    if (typeof value === "string") {
      return scope.bundle._transform(value);
    }

    return resolveComplexPattern(scope, value);
  }

  class Scope {
    constructor(bundle, errors, args) {
      let insideTermReference = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : false;
      let dirty = arguments.length > 4 && arguments[4] !== undefined ? arguments[4] : new WeakSet();
      this.bundle = bundle;
      this.errors = errors;
      this.args = args;
      this.insideTermReference = insideTermReference;
      this.dirty = dirty;
    }

    cloneForTermReference(args) {
      return new Scope(this.bundle, this.errors, args, true, this.dirty);
    }

    reportError(error) {
      if (!this.errors) {
        throw error;
      }

      this.errors.push(error);
    }

    memoizeIntlObject(ctor, opts) {
      let cache = this.bundle._intls.get(ctor);

      if (!cache) {
        cache = {};

        this.bundle._intls.set(ctor, cache);
      }

      let id = JSON.stringify(opts);

      if (!cache[id]) {
        cache[id] = new ctor(this.bundle.locales, opts);
      }

      return cache[id];
    }

  }

  /**
   * Message bundles are single-language stores of translation resources. They are
   * responsible for formatting message values and attributes to strings.
   */

  class FluentBundle {
    /**
     * Create an instance of `FluentBundle`.
     *
     * The `locales` argument is used to instantiate `Intl` formatters used by
     * translations. The `options` object can be used to configure the bundle.
     *
     * Examples:
     *
     *     let bundle = new FluentBundle(["en-US", "en"]);
     *
     *     let bundle = new FluentBundle(locales, {useIsolating: false});
     *
     *     let bundle = new FluentBundle(locales, {
     *       useIsolating: true,
     *       functions: {
     *         NODE_ENV: () => process.env.NODE_ENV
     *       }
     *     });
     *
     * Available options:
     *
     *   - `functions` - an object of additional functions available to
     *     translations as builtins.
     *
     *   - `useIsolating` - boolean specifying whether to use Unicode isolation
     *     marks (FSI, PDI) for bidi interpolations. Default: `true`.
     *
     *   - `transform` - a function used to transform string parts of patterns.
     */
    constructor(locales) {
      let _ref = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {},
          _ref$functions = _ref.functions,
          functions = _ref$functions === void 0 ? {} : _ref$functions,
          _ref$useIsolating = _ref.useIsolating,
          useIsolating = _ref$useIsolating === void 0 ? true : _ref$useIsolating,
          _ref$transform = _ref.transform,
          transform = _ref$transform === void 0 ? v => v : _ref$transform;

      this._terms = new Map();
      this._messages = new Map();
      this._intls = new WeakMap();
      this.locales = Array.isArray(locales) ? locales : [locales];
      this._functions = functions;
      this._useIsolating = useIsolating;
      this._transform = transform;
    }
    /**
     * Check if a message is present in the bundle.
     *
     * @param id - The identifier of the message to check.
     */


    hasMessage(id) {
      return this._messages.has(id);
    }
    /**
     * Return a raw unformatted message object from the bundle.
     *
     * Raw messages are `{value, attributes}` shapes containing translation units
     * called `Patterns`. `Patterns` are implementation-specific; they should be
     * treated as black boxes and formatted with `FluentBundle.formatPattern`.
     *
     *     interface RawMessage {
     *         value: Pattern | null;
     *         attributes: Record<string, Pattern>;
     *     }
     *
     * @param id - The identifier of the message to check.
     */


    getMessage(id) {
      return this._messages.get(id);
    }
    /**
     * Add a translation resource to the bundle.
     *
     * The translation resource must be an instance of `FluentResource`.
     *
     *     let res = new FluentResource("foo = Foo");
     *     bundle.addResource(res);
     *     bundle.getMessage("foo");
     *     // → {value: .., attributes: {..}}
     *
     * Available options:
     *
     *   - `allowOverrides` - boolean specifying whether it's allowed to override
     *     an existing message or term with a new value. Default: `false`.
     *
     * @param   res - FluentResource object.
     * @param   options
     */


    addResource(res) {
      let _ref2 = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {},
          _ref2$allowOverrides = _ref2.allowOverrides,
          allowOverrides = _ref2$allowOverrides === void 0 ? false : _ref2$allowOverrides;

      const errors = [];

      for (let i = 0; i < res.body.length; i++) {
        let entry = res.body[i];

        if (entry.id.startsWith("-")) {
          // Identifiers starting with a dash (-) define terms. Terms are private
          // and cannot be retrieved from FluentBundle.
          if (allowOverrides === false && this._terms.has(entry.id)) {
            errors.push("Attempt to override an existing term: \"".concat(entry.id, "\""));
            continue;
          }

          this._terms.set(entry.id, entry);
        } else {
          if (allowOverrides === false && this._messages.has(entry.id)) {
            errors.push("Attempt to override an existing message: \"".concat(entry.id, "\""));
            continue;
          }

          this._messages.set(entry.id, entry);
        }
      }

      return errors;
    }
    /**
     * Format a `Pattern` to a string.
     *
     * Format a raw `Pattern` into a string. `args` will be used to resolve
     * references to variables passed as arguments to the translation.
     *
     * In case of errors `formatPattern` will try to salvage as much of the
     * translation as possible and will still return a string. For performance
     * reasons, the encountered errors are not returned but instead are appended
     * to the `errors` array passed as the third argument.
     *
     *     let errors = [];
     *     bundle.addResource(
     *         new FluentResource("hello = Hello, {$name}!"));
     *
     *     let hello = bundle.getMessage("hello");
     *     if (hello.value) {
     *         bundle.formatPattern(hello.value, {name: "Jane"}, errors);
     *         // Returns "Hello, Jane!" and `errors` is empty.
     *
     *         bundle.formatPattern(hello.value, undefined, errors);
     *         // Returns "Hello, {$name}!" and `errors` is now:
     *         // [<ReferenceError: Unknown variable: name>]
     *     }
     *
     * If `errors` is omitted, the first encountered error will be thrown.
     */


    formatPattern(pattern, args, errors) {
      // Resolve a simple pattern without creating a scope. No error handling is
      // required; by definition simple patterns don't have placeables.
      if (typeof pattern === "string") {
        return this._transform(pattern);
      } // Resolve a complex pattern.


      let scope = new Scope(this, errors, args);

      try {
        let value = resolveComplexPattern(scope, pattern);
        return value.toString(scope);
      } catch (err) {
        if (scope.errors) {
          scope.errors.push(err);
          return new FluentNone().toString(scope);
        }

        throw err;
      }
    }

  }

  class FluentError extends Error {
    constructor(message) {
      super(message);
    }

  }

  // With the /m flag, the ^ matches at the beginning of every line.

  const RE_MESSAGE_START = /^(-?[a-zA-Z][\w-]*) *= */gm; // Both Attributes and Variants are parsed in while loops. These regexes are
  // used to break out of them.

  const RE_ATTRIBUTE_START = /\.([a-zA-Z][\w-]*) *= */y;
  const RE_VARIANT_START = /\*?\[/y;
  const RE_NUMBER_LITERAL = /(-?[0-9]+(?:\.([0-9]+))?)/y;
  const RE_IDENTIFIER = /([a-zA-Z][\w-]*)/y;
  const RE_REFERENCE = /([$-])?([a-zA-Z][\w-]*)(?:\.([a-zA-Z][\w-]*))?/y;
  const RE_FUNCTION_NAME = /^[A-Z][A-Z0-9_-]*$/; // A "run" is a sequence of text or string literal characters which don't
  // require any special handling. For TextElements such special characters are: {
  // (starts a placeable), and line breaks which require additional logic to check
  // if the next line is indented. For StringLiterals they are: \ (starts an
  // escape sequence), " (ends the literal), and line breaks which are not allowed
  // in StringLiterals. Note that string runs may be empty; text runs may not.

  const RE_TEXT_RUN = /([^{}\n\r]+)/y;
  const RE_STRING_RUN = /([^\\"\n\r]*)/y; // Escape sequences.

  const RE_STRING_ESCAPE = /\\([\\"])/y;
  const RE_UNICODE_ESCAPE = /\\u([a-fA-F0-9]{4})|\\U([a-fA-F0-9]{6})/y; // Used for trimming TextElements and indents.

  const RE_LEADING_NEWLINES = /^\n+/;
  const RE_TRAILING_SPACES = / +$/; // Used in makeIndent to strip spaces from blank lines and normalize CRLF to LF.

  const RE_BLANK_LINES = / *\r?\n/g; // Used in makeIndent to measure the indentation.

  const RE_INDENT = /( *)$/; // Common tokens.

  const TOKEN_BRACE_OPEN = /{\s*/y;
  const TOKEN_BRACE_CLOSE = /\s*}/y;
  const TOKEN_BRACKET_OPEN = /\[\s*/y;
  const TOKEN_BRACKET_CLOSE = /\s*] */y;
  const TOKEN_PAREN_OPEN = /\s*\(\s*/y;
  const TOKEN_ARROW = /\s*->\s*/y;
  const TOKEN_COLON = /\s*:\s*/y; // Note the optional comma. As a deviation from the Fluent EBNF, the parser
  // doesn't enforce commas between call arguments.

  const TOKEN_COMMA = /\s*,?\s*/y;
  const TOKEN_BLANK = /\s+/y; // Maximum number of placeables in a single Pattern to protect against Quadratic
  // Blowup attacks. See https://msdn.microsoft.com/en-us/magazine/ee335713.aspx.

  const MAX_PLACEABLES = 100;
  /**
   * Fluent Resource is a structure storing parsed localization entries.
   */

  class FluentResource {
    constructor(source) {
      this.body = this._parse(source);
    }

    _parse(source) {
      RE_MESSAGE_START.lastIndex = 0;
      let resource = [];
      let cursor = 0; // Iterate over the beginnings of messages and terms to efficiently skip
      // comments and recover from errors.

      while (true) {
        let next = RE_MESSAGE_START.exec(source);

        if (next === null) {
          break;
        }

        cursor = RE_MESSAGE_START.lastIndex;

        try {
          resource.push(parseMessage(next[1]));
        } catch (err) {
          if (err instanceof FluentError) {
            // Don't report any Fluent syntax errors. Skip directly to the
            // beginning of the next message or term.
            continue;
          }

          throw err;
        }
      }

      return resource; // The parser implementation is inlined below for performance reasons,
      // as well as for convenience of accessing `source` and `cursor`.
      // The parser focuses on minimizing the number of false negatives at the
      // expense of increasing the risk of false positives. In other words, it
      // aims at parsing valid Fluent messages with a success rate of 100%, but it
      // may also parse a few invalid messages which the reference parser would
      // reject. The parser doesn't perform any validation and may produce entries
      // which wouldn't make sense in the real world. For best results users are
      // advised to validate translations with the fluent-syntax parser
      // pre-runtime.
      // The parser makes an extensive use of sticky regexes which can be anchored
      // to any offset of the source string without slicing it. Errors are thrown
      // to bail out of parsing of ill-formed messages.

      function test(re) {
        re.lastIndex = cursor;
        return re.test(source);
      } // Advance the cursor by the char if it matches. May be used as a predicate
      // (was the match found?) or, if errorClass is passed, as an assertion.


      function consumeChar(char, errorClass) {
        if (source[cursor] === char) {
          cursor++;
          return true;
        }

        if (errorClass) {
          throw new errorClass("Expected ".concat(char));
        }

        return false;
      } // Advance the cursor by the token if it matches. May be used as a predicate
      // (was the match found?) or, if errorClass is passed, as an assertion.


      function consumeToken(re, errorClass) {
        if (test(re)) {
          cursor = re.lastIndex;
          return true;
        }

        if (errorClass) {
          throw new errorClass("Expected ".concat(re.toString()));
        }

        return false;
      } // Execute a regex, advance the cursor, and return all capture groups.


      function match(re) {
        re.lastIndex = cursor;
        let result = re.exec(source);

        if (result === null) {
          throw new FluentError("Expected ".concat(re.toString()));
        }

        cursor = re.lastIndex;
        return result;
      } // Execute a regex, advance the cursor, and return the capture group.


      function match1(re) {
        return match(re)[1];
      }

      function parseMessage(id) {
        let value = parsePattern();
        let attributes = parseAttributes();

        if (value === null && Object.keys(attributes).length === 0) {
          throw new FluentError("Expected message value or attributes");
        }

        return {
          id,
          value,
          attributes
        };
      }

      function parseAttributes() {
        let attrs = Object.create(null);

        while (test(RE_ATTRIBUTE_START)) {
          let name = match1(RE_ATTRIBUTE_START);
          let value = parsePattern();

          if (value === null) {
            throw new FluentError("Expected attribute value");
          }

          attrs[name] = value;
        }

        return attrs;
      }

      function parsePattern() {
        let first = undefined; // First try to parse any simple text on the same line as the id.

        if (test(RE_TEXT_RUN)) {
          first = match1(RE_TEXT_RUN);
        } // If there's a placeable on the first line, parse a complex pattern.


        if (source[cursor] === "{" || source[cursor] === "}") {
          // Re-use the text parsed above, if possible.
          return parsePatternElements(first ? [first] : [], Infinity);
        } // RE_TEXT_VALUE stops at newlines. Only continue parsing the pattern if
        // what comes after the newline is indented.


        let indent = parseIndent();

        if (indent) {
          if (first) {
            // If there's text on the first line, the blank block is part of the
            // translation content in its entirety.
            return parsePatternElements([first, indent], indent.length);
          } // Otherwise, we're dealing with a block pattern, i.e. a pattern which
          // starts on a new line. Discrad the leading newlines but keep the
          // inline indent; it will be used by the dedentation logic.


          indent.value = trim(indent.value, RE_LEADING_NEWLINES);
          return parsePatternElements([indent], indent.length);
        }

        if (first) {
          // It was just a simple inline text after all.
          return trim(first, RE_TRAILING_SPACES);
        }

        return null;
      } // Parse a complex pattern as an array of elements.


      function parsePatternElements() {
        let elements = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : [];
        let commonIndent = arguments.length > 1 ? arguments[1] : undefined;
        let placeableCount = 0;

        while (true) {
          if (test(RE_TEXT_RUN)) {
            elements.push(match1(RE_TEXT_RUN));
            continue;
          }

          if (source[cursor] === "{") {
            if (++placeableCount > MAX_PLACEABLES) {
              throw new FluentError("Too many placeables");
            }

            elements.push(parsePlaceable());
            continue;
          }

          if (source[cursor] === "}") {
            throw new FluentError("Unbalanced closing brace");
          }

          let indent = parseIndent();

          if (indent) {
            elements.push(indent);
            commonIndent = Math.min(commonIndent, indent.length);
            continue;
          }

          break;
        }

        let lastIndex = elements.length - 1;
        let lastElement = elements[lastIndex]; // Trim the trailing spaces in the last element if it's a TextElement.

        if (typeof lastElement === "string") {
          elements[lastIndex] = trim(lastElement, RE_TRAILING_SPACES);
        }

        let baked = [];
        var _iteratorNormalCompletion = true;
        var _didIteratorError = false;
        var _iteratorError = undefined;

        try {
          for (var _iterator = elements[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
            let element = _step.value;

            if (typeof element !== "string" && element.type === "indent") {
              // Dedent indented lines by the maximum common indent.
              element = element.value.slice(0, element.value.length - commonIndent);
            }

            if (element) {
              baked.push(element);
            }
          }
        } catch (err) {
          _didIteratorError = true;
          _iteratorError = err;
        } finally {
          try {
            if (!_iteratorNormalCompletion && _iterator.return != null) {
              _iterator.return();
            }
          } finally {
            if (_didIteratorError) {
              throw _iteratorError;
            }
          }
        }

        return baked;
      }

      function parsePlaceable() {
        consumeToken(TOKEN_BRACE_OPEN, FluentError);
        let selector = parseInlineExpression();

        if (consumeToken(TOKEN_BRACE_CLOSE)) {
          return selector;
        }

        if (consumeToken(TOKEN_ARROW)) {
          let variants = parseVariants();
          consumeToken(TOKEN_BRACE_CLOSE, FluentError);
          return _objectSpread({
            type: "select",
            selector
          }, variants);
        }

        throw new FluentError("Unclosed placeable");
      }

      function parseInlineExpression() {
        if (source[cursor] === "{") {
          // It's a nested placeable.
          return parsePlaceable();
        }

        if (test(RE_REFERENCE)) {
          let _match = match(RE_REFERENCE),
              _match2 = _slicedToArray(_match, 4),
              sigil = _match2[1],
              name = _match2[2],
              _match2$ = _match2[3],
              attr = _match2$ === void 0 ? null : _match2$;

          if (sigil === "$") {
            return {
              type: "var",
              name
            };
          }

          if (consumeToken(TOKEN_PAREN_OPEN)) {
            let args = parseArguments();

            if (sigil === "-") {
              // A parameterized term: -term(...).
              return {
                type: "term",
                name,
                attr,
                args
              };
            }

            if (RE_FUNCTION_NAME.test(name)) {
              return {
                type: "func",
                name,
                args
              };
            }

            throw new FluentError("Function names must be all upper-case");
          }

          if (sigil === "-") {
            // A non-parameterized term: -term.
            return {
              type: "term",
              name,
              attr,
              args: []
            };
          }

          return {
            type: "mesg",
            name,
            attr
          };
        }

        return parseLiteral();
      }

      function parseArguments() {
        let args = [];

        while (true) {
          switch (source[cursor]) {
            case ")":
              // End of the argument list.
              cursor++;
              return args;

            case undefined:
              // EOF
              throw new FluentError("Unclosed argument list");
          }

          args.push(parseArgument()); // Commas between arguments are treated as whitespace.

          consumeToken(TOKEN_COMMA);
        }
      }

      function parseArgument() {
        let expr = parseInlineExpression();

        if (expr.type !== "mesg") {
          return expr;
        }

        if (consumeToken(TOKEN_COLON)) {
          // The reference is the beginning of a named argument.
          return {
            type: "narg",
            name: expr.name,
            value: parseLiteral()
          };
        } // It's a regular message reference.


        return expr;
      }

      function parseVariants() {
        let variants = [];
        let count = 0;
        let star;

        while (test(RE_VARIANT_START)) {
          if (consumeChar("*")) {
            star = count;
          }

          let key = parseVariantKey();
          let value = parsePattern();

          if (value === null) {
            throw new FluentError("Expected variant value");
          }

          variants[count++] = {
            key,
            value
          };
        }

        if (count === 0) {
          return null;
        }

        if (star === undefined) {
          throw new FluentError("Expected default variant");
        }

        return {
          variants,
          star
        };
      }

      function parseVariantKey() {
        consumeToken(TOKEN_BRACKET_OPEN, FluentError);
        let key = test(RE_NUMBER_LITERAL) ? parseNumberLiteral() : {
          type: "str",
          value: match1(RE_IDENTIFIER)
        };
        consumeToken(TOKEN_BRACKET_CLOSE, FluentError);
        return key;
      }

      function parseLiteral() {
        if (test(RE_NUMBER_LITERAL)) {
          return parseNumberLiteral();
        }

        if (source[cursor] === '"') {
          return parseStringLiteral();
        }

        throw new FluentError("Invalid expression");
      }

      function parseNumberLiteral() {
        let _match3 = match(RE_NUMBER_LITERAL),
            _match4 = _slicedToArray(_match3, 3),
            value = _match4[1],
            _match4$ = _match4[2],
            fraction = _match4$ === void 0 ? "" : _match4$;

        let precision = fraction.length;
        return {
          type: "num",
          value: parseFloat(value),
          precision
        };
      }

      function parseStringLiteral() {
        consumeChar('"', FluentError);
        let value = "";

        while (true) {
          value += match1(RE_STRING_RUN);

          if (source[cursor] === "\\") {
            value += parseEscapeSequence();
            continue;
          }

          if (consumeChar('"')) {
            return {
              type: "str",
              value
            };
          } // We've reached an EOL of EOF.


          throw new FluentError("Unclosed string literal");
        }
      } // Unescape known escape sequences.


      function parseEscapeSequence() {
        if (test(RE_STRING_ESCAPE)) {
          return match1(RE_STRING_ESCAPE);
        }

        if (test(RE_UNICODE_ESCAPE)) {
          let _match5 = match(RE_UNICODE_ESCAPE),
              _match6 = _slicedToArray(_match5, 3),
              codepoint4 = _match6[1],
              codepoint6 = _match6[2];

          let codepoint = parseInt(codepoint4 || codepoint6, 16);
          return codepoint <= 0xd7ff || 0xe000 <= codepoint ? // It's a Unicode scalar value.
          String.fromCodePoint(codepoint) : // Lonely surrogates can cause trouble when the parsing result is
          // saved using UTF-8. Use U+FFFD REPLACEMENT CHARACTER instead.
          "�";
        }

        throw new FluentError("Unknown escape sequence");
      } // Parse blank space. Return it if it looks like indent before a pattern
      // line. Skip it othwerwise.


      function parseIndent() {
        let start = cursor;
        consumeToken(TOKEN_BLANK); // Check the first non-blank character after the indent.

        switch (source[cursor]) {
          case ".":
          case "[":
          case "*":
          case "}":
          case undefined:
            // EOF
            // A special character. End the Pattern.
            return false;

          case "{":
            // Placeables don't require indentation (in EBNF: block-placeable).
            // Continue the Pattern.
            return makeIndent(source.slice(start, cursor));
        } // If the first character on the line is not one of the special characters
        // listed above, it's a regular text character. Check if there's at least
        // one space of indent before it.


        if (source[cursor - 1] === " ") {
          // It's an indented text character (in EBNF: indented-char). Continue
          // the Pattern.
          return makeIndent(source.slice(start, cursor));
        } // A not-indented text character is likely the identifier of the next
        // message. End the Pattern.


        return false;
      } // Trim blanks in text according to the given regex.


      function trim(text, re) {
        return text.replace(re, "");
      } // Normalize a blank block and extract the indent details.


      function makeIndent(blank) {
        let value = blank.replace(RE_BLANK_LINES, "\n");
        let length = RE_INDENT.exec(blank)[1].length;
        return {
          type: "indent",
          value,
          length
        };
      }
    }

  }

  /**
   * @module fluent
   * @overview
   *
   * `fluent` is a JavaScript implementation of Project Fluent, a localization
   * framework designed to unleash the expressive power of the natural language.
   *
   */

  exports.FluentBundle = FluentBundle;
  exports.FluentDateTime = FluentDateTime;
  exports.FluentError = FluentError;
  exports.FluentNumber = FluentNumber;
  exports.FluentResource = FluentResource;
  exports.FluentType = FluentType;

  Object.defineProperty(exports, '__esModule', { value: true });

}));
