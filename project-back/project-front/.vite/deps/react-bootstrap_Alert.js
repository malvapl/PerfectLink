"use client";
import {
  ENTERED,
  ENTERING,
  Transition_default
} from "./chunk-LMEAOH6F.js";
import {
  _extends,
  _objectWithoutPropertiesLoose,
  init_extends
} from "./chunk-T4JGLJBG.js";
import {
  require_prop_types
} from "./chunk-WTXXVA37.js";
import {
  require_react_dom
} from "./chunk-KJUJBIHA.js";
import {
  useButtonProps
} from "./chunk-X2CJU44M.js";
import {
  require_classnames,
  useBootstrapPrefix
} from "./chunk-BTE26JXI.js";
import {
  require_jsx_runtime
} from "./chunk-E4NGMBJE.js";
import {
  __commonJS,
  __toESM,
  require_react
} from "./chunk-W4VDMLRG.js";

// node_modules/invariant/browser.js
var require_browser = __commonJS({
  "node_modules/invariant/browser.js"(exports, module) {
    "use strict";
    var invariant3 = function(condition, format, a, b, c, d, e, f) {
      if (true) {
        if (format === void 0) {
          throw new Error("invariant requires an error message argument");
        }
      }
      if (!condition) {
        var error;
        if (format === void 0) {
          error = new Error(
            "Minified exception occurred; use the non-minified dev environment for the full error message and additional helpful warnings."
          );
        } else {
          var args = [a, b, c, d, e, f];
          var argIndex = 0;
          error = new Error(
            format.replace(/%s/g, function() {
              return args[argIndex++];
            })
          );
          error.name = "Invariant Violation";
        }
        error.framesToPop = 1;
        throw error;
      }
    };
    module.exports = invariant3;
  }
});

// node_modules/react-bootstrap/esm/Alert.js
var import_classnames6 = __toESM(require_classnames());
var React9 = __toESM(require_react());

// node_modules/uncontrollable/lib/esm/hook.js
init_extends();
var import_react = __toESM(require_react());

// node_modules/uncontrollable/lib/esm/utils.js
var import_invariant = __toESM(require_browser());
function defaultKey(key) {
  return "default" + key.charAt(0).toUpperCase() + key.substr(1);
}

// node_modules/uncontrollable/lib/esm/hook.js
function _toPropertyKey(arg) {
  var key = _toPrimitive(arg, "string");
  return typeof key === "symbol" ? key : String(key);
}
function _toPrimitive(input, hint) {
  if (typeof input !== "object" || input === null)
    return input;
  var prim = input[Symbol.toPrimitive];
  if (prim !== void 0) {
    var res = prim.call(input, hint || "default");
    if (typeof res !== "object")
      return res;
    throw new TypeError("@@toPrimitive must return a primitive value.");
  }
  return (hint === "string" ? String : Number)(input);
}
function useUncontrolledProp(propValue, defaultValue, handler) {
  var wasPropRef = (0, import_react.useRef)(propValue !== void 0);
  var _useState = (0, import_react.useState)(defaultValue), stateValue = _useState[0], setState = _useState[1];
  var isProp2 = propValue !== void 0;
  var wasProp = wasPropRef.current;
  wasPropRef.current = isProp2;
  if (!isProp2 && wasProp && stateValue !== defaultValue) {
    setState(defaultValue);
  }
  return [isProp2 ? propValue : stateValue, (0, import_react.useCallback)(function(value) {
    for (var _len = arguments.length, args = new Array(_len > 1 ? _len - 1 : 0), _key = 1; _key < _len; _key++) {
      args[_key - 1] = arguments[_key];
    }
    if (handler)
      handler.apply(void 0, [value].concat(args));
    setState(value);
  }, [handler])];
}
function useUncontrolled(props, config) {
  return Object.keys(config).reduce(function(result, fieldName) {
    var _extends2;
    var _ref = result, defaultValue = _ref[defaultKey(fieldName)], propsValue = _ref[fieldName], rest = _objectWithoutPropertiesLoose(_ref, [defaultKey(fieldName), fieldName].map(_toPropertyKey));
    var handlerName = config[fieldName];
    var _useUncontrolledProp = useUncontrolledProp(propsValue, defaultValue, props[handlerName]), value = _useUncontrolledProp[0], handler = _useUncontrolledProp[1];
    return _extends({}, rest, (_extends2 = {}, _extends2[fieldName] = value, _extends2[handlerName] = handler, _extends2));
  }, props);
}

// node_modules/uncontrollable/lib/esm/uncontrollable.js
init_extends();
var import_react2 = __toESM(require_react());

// node_modules/react-lifecycles-compat/react-lifecycles-compat.es.js
function componentWillMount() {
  var state = this.constructor.getDerivedStateFromProps(this.props, this.state);
  if (state !== null && state !== void 0) {
    this.setState(state);
  }
}
function componentWillReceiveProps(nextProps) {
  function updater(prevState) {
    var state = this.constructor.getDerivedStateFromProps(nextProps, prevState);
    return state !== null && state !== void 0 ? state : null;
  }
  this.setState(updater.bind(this));
}
function componentWillUpdate(nextProps, nextState) {
  try {
    var prevProps = this.props;
    var prevState = this.state;
    this.props = nextProps;
    this.state = nextState;
    this.__reactInternalSnapshotFlag = true;
    this.__reactInternalSnapshot = this.getSnapshotBeforeUpdate(
      prevProps,
      prevState
    );
  } finally {
    this.props = prevProps;
    this.state = prevState;
  }
}
componentWillMount.__suppressDeprecationWarning = true;
componentWillReceiveProps.__suppressDeprecationWarning = true;
componentWillUpdate.__suppressDeprecationWarning = true;

// node_modules/uncontrollable/lib/esm/uncontrollable.js
var import_invariant2 = __toESM(require_browser());

// node_modules/@restart/hooks/esm/useEventCallback.js
var import_react4 = __toESM(require_react());

// node_modules/@restart/hooks/esm/useCommittedRef.js
var import_react3 = __toESM(require_react());
function useCommittedRef(value) {
  const ref = (0, import_react3.useRef)(value);
  (0, import_react3.useEffect)(() => {
    ref.current = value;
  }, [value]);
  return ref;
}
var useCommittedRef_default = useCommittedRef;

// node_modules/@restart/hooks/esm/useEventCallback.js
function useEventCallback(fn) {
  const ref = useCommittedRef_default(fn);
  return (0, import_react4.useCallback)(function(...args) {
    return ref.current && ref.current(...args);
  }, [ref]);
}

// node_modules/react-bootstrap/esm/AlertHeading.js
var React3 = __toESM(require_react());
var import_classnames2 = __toESM(require_classnames());

// node_modules/react-bootstrap/esm/divWithClassName.js
var React2 = __toESM(require_react());
var import_classnames = __toESM(require_classnames());
var import_jsx_runtime = __toESM(require_jsx_runtime());
var divWithClassName_default = (className) => React2.forwardRef((p, ref) => (0, import_jsx_runtime.jsx)("div", {
  ...p,
  ref,
  className: (0, import_classnames.default)(p.className, className)
}));

// node_modules/react-bootstrap/esm/AlertHeading.js
var import_jsx_runtime2 = __toESM(require_jsx_runtime());
var DivStyledAsH4 = divWithClassName_default("h4");
DivStyledAsH4.displayName = "DivStyledAsH4";
var AlertHeading = React3.forwardRef(({
  className,
  bsPrefix,
  as: Component = DivStyledAsH4,
  ...props
}, ref) => {
  bsPrefix = useBootstrapPrefix(bsPrefix, "alert-heading");
  return (0, import_jsx_runtime2.jsx)(Component, {
    ref,
    className: (0, import_classnames2.default)(className, bsPrefix),
    ...props
  });
});
AlertHeading.displayName = "AlertHeading";
var AlertHeading_default = AlertHeading;

// node_modules/react-bootstrap/esm/AlertLink.js
var React5 = __toESM(require_react());
var import_classnames3 = __toESM(require_classnames());

// node_modules/@restart/ui/esm/Anchor.js
var React4 = __toESM(require_react());

// node_modules/@restart/hooks/esm/useCallbackRef.js
var import_react5 = __toESM(require_react());

// node_modules/@restart/hooks/esm/useEventListener.js
var import_react6 = __toESM(require_react());

// node_modules/@restart/hooks/esm/useGlobalListener.js
var import_react7 = __toESM(require_react());

// node_modules/@restart/hooks/esm/useInterval.js
var import_react8 = __toESM(require_react());

// node_modules/@restart/hooks/esm/useRafInterval.js
var import_react9 = __toESM(require_react());

// node_modules/@restart/hooks/esm/useMergeState.js
var import_react10 = __toESM(require_react());

// node_modules/@restart/hooks/esm/useMounted.js
var import_react11 = __toESM(require_react());

// node_modules/@restart/hooks/esm/usePrevious.js
var import_react12 = __toESM(require_react());

// node_modules/@restart/hooks/esm/useImage.js
var import_react13 = __toESM(require_react());

// node_modules/@restart/hooks/esm/useResizeObserver.js
var import_react15 = __toESM(require_react());

// node_modules/@restart/hooks/esm/useIsomorphicEffect.js
var import_react14 = __toESM(require_react());
var isReactNative = typeof global !== "undefined" && // @ts-ignore
global.navigator && // @ts-ignore
global.navigator.product === "ReactNative";

// node_modules/@restart/ui/esm/Anchor.js
var import_jsx_runtime3 = __toESM(require_jsx_runtime());
var _excluded = ["onKeyDown"];
function _objectWithoutPropertiesLoose2(source, excluded) {
  if (source == null)
    return {};
  var target = {};
  var sourceKeys = Object.keys(source);
  var key, i;
  for (i = 0; i < sourceKeys.length; i++) {
    key = sourceKeys[i];
    if (excluded.indexOf(key) >= 0)
      continue;
    target[key] = source[key];
  }
  return target;
}
function isTrivialHref(href) {
  return !href || href.trim() === "#";
}
var Anchor = React4.forwardRef((_ref, ref) => {
  let {
    onKeyDown
  } = _ref, props = _objectWithoutPropertiesLoose2(_ref, _excluded);
  const [buttonProps] = useButtonProps(Object.assign({
    tagName: "a"
  }, props));
  const handleKeyDown = useEventCallback((e) => {
    buttonProps.onKeyDown(e);
    onKeyDown == null ? void 0 : onKeyDown(e);
  });
  if (isTrivialHref(props.href) || props.role === "button") {
    return (0, import_jsx_runtime3.jsx)("a", Object.assign({
      ref
    }, props, buttonProps, {
      onKeyDown: handleKeyDown
    }));
  }
  return (0, import_jsx_runtime3.jsx)("a", Object.assign({
    ref
  }, props, {
    onKeyDown
  }));
});
Anchor.displayName = "Anchor";
var Anchor_default = Anchor;

// node_modules/react-bootstrap/esm/AlertLink.js
var import_jsx_runtime4 = __toESM(require_jsx_runtime());
var AlertLink = React5.forwardRef(({
  className,
  bsPrefix,
  as: Component = Anchor_default,
  ...props
}, ref) => {
  bsPrefix = useBootstrapPrefix(bsPrefix, "alert-link");
  return (0, import_jsx_runtime4.jsx)(Component, {
    ref,
    className: (0, import_classnames3.default)(className, bsPrefix),
    ...props
  });
});
AlertLink.displayName = "AlertLink";
var AlertLink_default = AlertLink;

// node_modules/react-bootstrap/esm/Fade.js
var import_classnames4 = __toESM(require_classnames());
var React7 = __toESM(require_react());
var import_react18 = __toESM(require_react());

// node_modules/dom-helpers/esm/ownerDocument.js
function ownerDocument(node) {
  return node && node.ownerDocument || document;
}

// node_modules/dom-helpers/esm/ownerWindow.js
function ownerWindow(node) {
  var doc = ownerDocument(node);
  return doc && doc.defaultView || window;
}

// node_modules/dom-helpers/esm/getComputedStyle.js
function getComputedStyle(node, psuedoElement) {
  return ownerWindow(node).getComputedStyle(node, psuedoElement);
}

// node_modules/dom-helpers/esm/hyphenate.js
var rUpper = /([A-Z])/g;
function hyphenate(string) {
  return string.replace(rUpper, "-$1").toLowerCase();
}

// node_modules/dom-helpers/esm/hyphenateStyle.js
var msPattern = /^ms-/;
function hyphenateStyleName(string) {
  return hyphenate(string).replace(msPattern, "-ms-");
}

// node_modules/dom-helpers/esm/isTransform.js
var supportedTransforms = /^((translate|rotate|scale)(X|Y|Z|3d)?|matrix(3d)?|perspective|skew(X|Y)?)$/i;
function isTransform(value) {
  return !!(value && supportedTransforms.test(value));
}

// node_modules/dom-helpers/esm/css.js
function style(node, property) {
  var css = "";
  var transforms = "";
  if (typeof property === "string") {
    return node.style.getPropertyValue(hyphenateStyleName(property)) || getComputedStyle(node).getPropertyValue(hyphenateStyleName(property));
  }
  Object.keys(property).forEach(function(key) {
    var value = property[key];
    if (!value && value !== 0) {
      node.style.removeProperty(hyphenateStyleName(key));
    } else if (isTransform(key)) {
      transforms += key + "(" + value + ") ";
    } else {
      css += hyphenateStyleName(key) + ": " + value + ";";
    }
  });
  if (transforms) {
    css += "transform: " + transforms + ";";
  }
  node.style.cssText += ";" + css;
}
var css_default = style;

// node_modules/dom-helpers/esm/canUseDOM.js
var canUseDOM_default = !!(typeof window !== "undefined" && window.document && window.document.createElement);

// node_modules/dom-helpers/esm/addEventListener.js
var optionsSupported = false;
var onceSupported = false;
try {
  options = {
    get passive() {
      return optionsSupported = true;
    },
    get once() {
      return onceSupported = optionsSupported = true;
    }
  };
  if (canUseDOM_default) {
    window.addEventListener("test", options, options);
    window.removeEventListener("test", options, true);
  }
} catch (e) {
}
var options;
function addEventListener(node, eventName, handler, options) {
  if (options && typeof options !== "boolean" && !onceSupported) {
    var once = options.once, capture = options.capture;
    var wrappedHandler = handler;
    if (!onceSupported && once) {
      wrappedHandler = handler.__once || function onceHandler(event) {
        this.removeEventListener(eventName, onceHandler, capture);
        handler.call(this, event);
      };
      handler.__once = wrappedHandler;
    }
    node.addEventListener(eventName, wrappedHandler, optionsSupported ? options : capture);
  }
  node.addEventListener(eventName, handler, options);
}
var addEventListener_default = addEventListener;

// node_modules/dom-helpers/esm/removeEventListener.js
function removeEventListener(node, eventName, handler, options) {
  var capture = options && typeof options !== "boolean" ? options.capture : options;
  node.removeEventListener(eventName, handler, capture);
  if (handler.__once) {
    node.removeEventListener(eventName, handler.__once, capture);
  }
}
var removeEventListener_default = removeEventListener;

// node_modules/dom-helpers/esm/listen.js
function listen(node, eventName, handler, options) {
  addEventListener_default(node, eventName, handler, options);
  return function() {
    removeEventListener_default(node, eventName, handler, options);
  };
}
var listen_default = listen;

// node_modules/dom-helpers/esm/triggerEvent.js
function triggerEvent(node, eventName, bubbles, cancelable) {
  if (bubbles === void 0) {
    bubbles = false;
  }
  if (cancelable === void 0) {
    cancelable = true;
  }
  if (node) {
    var event = document.createEvent("HTMLEvents");
    event.initEvent(eventName, bubbles, cancelable);
    node.dispatchEvent(event);
  }
}

// node_modules/dom-helpers/esm/transitionEnd.js
function parseDuration(node) {
  var str = css_default(node, "transitionDuration") || "";
  var mult = str.indexOf("ms") === -1 ? 1e3 : 1;
  return parseFloat(str) * mult;
}
function emulateTransitionEnd(element, duration, padding) {
  if (padding === void 0) {
    padding = 5;
  }
  var called = false;
  var handle = setTimeout(function() {
    if (!called)
      triggerEvent(element, "transitionend", true);
  }, duration + padding);
  var remove = listen_default(element, "transitionend", function() {
    called = true;
  }, {
    once: true
  });
  return function() {
    clearTimeout(handle);
    remove();
  };
}
function transitionEnd(element, handler, duration, padding) {
  if (duration == null)
    duration = parseDuration(element) || 0;
  var removeEmulate = emulateTransitionEnd(element, duration, padding);
  var remove = listen_default(element, "transitionend", handler);
  return function() {
    removeEmulate();
    remove();
  };
}

// node_modules/react-bootstrap/esm/transitionEndListener.js
function parseDuration2(node, property) {
  const str = css_default(node, property) || "";
  const mult = str.indexOf("ms") === -1 ? 1e3 : 1;
  return parseFloat(str) * mult;
}
function transitionEndListener(element, handler) {
  const duration = parseDuration2(element, "transitionDuration");
  const delay = parseDuration2(element, "transitionDelay");
  const remove = transitionEnd(element, (e) => {
    if (e.target === element) {
      remove();
      handler(e);
    }
  }, duration + delay);
}

// node_modules/react-bootstrap/esm/triggerBrowserReflow.js
function triggerBrowserReflow(node) {
  node.offsetHeight;
}

// node_modules/react-bootstrap/esm/TransitionWrapper.js
var import_react17 = __toESM(require_react());

// node_modules/@restart/hooks/esm/useMergedRefs.js
var import_react16 = __toESM(require_react());
var toFnRef = (ref) => !ref || typeof ref === "function" ? ref : (value) => {
  ref.current = value;
};
function mergeRefs(refA, refB) {
  const a = toFnRef(refA);
  const b = toFnRef(refB);
  return (value) => {
    if (a)
      a(value);
    if (b)
      b(value);
  };
}
function useMergedRefs(refA, refB) {
  return (0, import_react16.useMemo)(() => mergeRefs(refA, refB), [refA, refB]);
}
var useMergedRefs_default = useMergedRefs;

// node_modules/react-bootstrap/esm/safeFindDOMNode.js
var import_react_dom = __toESM(require_react_dom());
function safeFindDOMNode(componentOrElement) {
  if (componentOrElement && "setState" in componentOrElement) {
    return import_react_dom.default.findDOMNode(componentOrElement);
  }
  return componentOrElement != null ? componentOrElement : null;
}

// node_modules/react-bootstrap/esm/TransitionWrapper.js
var import_jsx_runtime5 = __toESM(require_jsx_runtime());
var TransitionWrapper = import_react17.default.forwardRef(({
  onEnter,
  onEntering,
  onEntered,
  onExit,
  onExiting,
  onExited,
  addEndListener,
  children,
  childRef,
  ...props
}, ref) => {
  const nodeRef = (0, import_react17.useRef)(null);
  const mergedRef = useMergedRefs_default(nodeRef, childRef);
  const attachRef = (r) => {
    mergedRef(safeFindDOMNode(r));
  };
  const normalize = (callback) => (param) => {
    if (callback && nodeRef.current) {
      callback(nodeRef.current, param);
    }
  };
  const handleEnter = (0, import_react17.useCallback)(normalize(onEnter), [onEnter]);
  const handleEntering = (0, import_react17.useCallback)(normalize(onEntering), [onEntering]);
  const handleEntered = (0, import_react17.useCallback)(normalize(onEntered), [onEntered]);
  const handleExit = (0, import_react17.useCallback)(normalize(onExit), [onExit]);
  const handleExiting = (0, import_react17.useCallback)(normalize(onExiting), [onExiting]);
  const handleExited = (0, import_react17.useCallback)(normalize(onExited), [onExited]);
  const handleAddEndListener = (0, import_react17.useCallback)(normalize(addEndListener), [addEndListener]);
  return (0, import_jsx_runtime5.jsx)(Transition_default, {
    ref,
    ...props,
    onEnter: handleEnter,
    onEntered: handleEntered,
    onEntering: handleEntering,
    onExit: handleExit,
    onExited: handleExited,
    onExiting: handleExiting,
    addEndListener: handleAddEndListener,
    nodeRef,
    children: typeof children === "function" ? (status, innerProps) => (
      // TODO: Types for RTG missing innerProps, so need to cast.
      children(status, {
        ...innerProps,
        ref: attachRef
      })
    ) : import_react17.default.cloneElement(children, {
      ref: attachRef
    })
  });
});
var TransitionWrapper_default = TransitionWrapper;

// node_modules/react-bootstrap/esm/Fade.js
var import_jsx_runtime6 = __toESM(require_jsx_runtime());
var fadeStyles = {
  [ENTERING]: "show",
  [ENTERED]: "show"
};
var Fade = React7.forwardRef(({
  className,
  children,
  transitionClasses = {},
  onEnter,
  ...rest
}, ref) => {
  const props = {
    in: false,
    timeout: 300,
    mountOnEnter: false,
    unmountOnExit: false,
    appear: false,
    ...rest
  };
  const handleEnter = (0, import_react18.useCallback)((node, isAppearing) => {
    triggerBrowserReflow(node);
    onEnter == null ? void 0 : onEnter(node, isAppearing);
  }, [onEnter]);
  return (0, import_jsx_runtime6.jsx)(TransitionWrapper_default, {
    ref,
    addEndListener: transitionEndListener,
    ...props,
    onEnter: handleEnter,
    childRef: children.ref,
    children: (status, innerProps) => React7.cloneElement(children, {
      ...innerProps,
      className: (0, import_classnames4.default)("fade", className, children.props.className, fadeStyles[status], transitionClasses[status])
    })
  });
});
Fade.displayName = "Fade";
var Fade_default = Fade;

// node_modules/react-bootstrap/esm/CloseButton.js
var import_prop_types = __toESM(require_prop_types());
var React8 = __toESM(require_react());
var import_classnames5 = __toESM(require_classnames());
var import_jsx_runtime7 = __toESM(require_jsx_runtime());
var propTypes = {
  /** An accessible label indicating the relevant information about the Close Button. */
  "aria-label": import_prop_types.default.string,
  /** A callback fired after the Close Button is clicked. */
  onClick: import_prop_types.default.func,
  /**
   * Render different color variant for the button.
   *
   * Omitting this will render the default dark color.
   */
  variant: import_prop_types.default.oneOf(["white"])
};
var CloseButton = React8.forwardRef(({
  className,
  variant,
  "aria-label": ariaLabel = "Close",
  ...props
}, ref) => (0, import_jsx_runtime7.jsx)("button", {
  ref,
  type: "button",
  className: (0, import_classnames5.default)("btn-close", variant && `btn-close-${variant}`, className),
  "aria-label": ariaLabel,
  ...props
}));
CloseButton.displayName = "CloseButton";
CloseButton.propTypes = propTypes;
var CloseButton_default = CloseButton;

// node_modules/react-bootstrap/esm/Alert.js
var import_jsx_runtime8 = __toESM(require_jsx_runtime());
var import_jsx_runtime9 = __toESM(require_jsx_runtime());
var Alert = React9.forwardRef((uncontrolledProps, ref) => {
  const {
    bsPrefix,
    show = true,
    closeLabel = "Close alert",
    closeVariant,
    className,
    children,
    variant = "primary",
    onClose,
    dismissible,
    transition = Fade_default,
    ...props
  } = useUncontrolled(uncontrolledProps, {
    show: "onClose"
  });
  const prefix = useBootstrapPrefix(bsPrefix, "alert");
  const handleClose = useEventCallback((e) => {
    if (onClose) {
      onClose(false, e);
    }
  });
  const Transition = transition === true ? Fade_default : transition;
  const alert = (0, import_jsx_runtime9.jsxs)("div", {
    role: "alert",
    ...!Transition ? props : void 0,
    ref,
    className: (0, import_classnames6.default)(className, prefix, variant && `${prefix}-${variant}`, dismissible && `${prefix}-dismissible`),
    children: [dismissible && (0, import_jsx_runtime8.jsx)(CloseButton_default, {
      onClick: handleClose,
      "aria-label": closeLabel,
      variant: closeVariant
    }), children]
  });
  if (!Transition)
    return show ? alert : null;
  return (0, import_jsx_runtime8.jsx)(Transition, {
    unmountOnExit: true,
    ...props,
    ref: void 0,
    in: show,
    children: alert
  });
});
Alert.displayName = "Alert";
var Alert_default = Object.assign(Alert, {
  Link: AlertLink_default,
  Heading: AlertHeading_default
});
export {
  Alert_default as default
};
//# sourceMappingURL=react-bootstrap_Alert.js.map
