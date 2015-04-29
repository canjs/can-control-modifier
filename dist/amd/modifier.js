/*can-control-modifier@0.0.1#modifier*/
define([
    'can',
    'can/util',
    'can/control',
    'can/util/function'
], function ($__0, $__2, $__3, $__4) {
    'use strict';
    if (!$__0 || !$__0.__esModule)
        $__0 = { default: $__0 };
    if (!$__2 || !$__2.__esModule)
        $__2 = { default: $__2 };
    if (!$__3 || !$__3.__esModule)
        $__3 = { default: $__3 };
    if (!$__4 || !$__4.__esModule)
        $__4 = { default: $__4 };
    var can = $__0.default;
    $__2;
    $__3;
    $__4;
    var originalSetup = can.Control.setup, processors = can.Control.processors, modifier = {
            delim: ':',
            hasModifier: function (name) {
                return name.indexOf(modifier.delim) !== -1;
            },
            modify: function (name, fn, options) {
                var parts = name.match(/([\w]+)\((.+)\)/), mod, args;
                if (parts) {
                    mod = can.getObject(parts[1], [
                        options || {},
                        can,
                        window
                    ]);
                    args = can.sub(parts[2], [
                        options || {},
                        can,
                        window
                    ]).split(',');
                    if (mod) {
                        args.unshift(fn);
                        fn = mod.apply(null, args);
                    }
                }
                return fn;
            },
            addProcessor: function (event, mod) {
                var processorName = [
                        event,
                        mod
                    ].join(modifier.delim);
                processors[processorName] = function (el, nil, selector, methodName, control) {
                    var callback = modifier.modify(mod, can.Control._shifter(control, methodName), control.options);
                    control[event] = callback;
                    if (!selector) {
                        selector = can.trim(selector);
                    }
                    can.delegate.call(el, selector, event, callback);
                    return function () {
                        can.undelegate.call(el, selector, event, callback);
                    };
                };
            }
        };
    can.extend(can.Control, {
        modifier: modifier,
        setup: function (el, options) {
            can.each(this.prototype, function (fn, key, prototype) {
                var parts, event, mod;
                if (modifier.hasModifier(key)) {
                    parts = key.split(modifier.delim);
                    event = parts.shift().split(' ').pop();
                    mod = parts.join('');
                    if (!(can.trim(key) in processors)) {
                        modifier.addProcessor(event, mod);
                    }
                }
            });
            originalSetup.apply(this, arguments);
        }
    });
    var $__default = can;
    return {
        get default() {
            return $__default;
        },
        __esModule: true
    };
});