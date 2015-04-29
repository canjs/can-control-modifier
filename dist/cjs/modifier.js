/*can-control-modifier@0.0.1#modifier*/
'use strict';
Object.defineProperties(module.exports, {
    default: {
        get: function () {
            return $__default;
        }
    },
    __esModule: { value: true }
});
var $__can__, $__can_47_util_47_util__, $__can_47_control_47_control__, $__can_47_util_47_function_47_function__;
var can = ($__can__ = require('can'), $__can__ && $__can__.__esModule && $__can__ || { default: $__can__ }).default;
$__can_47_util_47_util__ = require('can/util/util'), $__can_47_util_47_util__ && $__can_47_util_47_util__.__esModule && $__can_47_util_47_util__ || { default: $__can_47_util_47_util__ };
$__can_47_control_47_control__ = require('can/control/control'), $__can_47_control_47_control__ && $__can_47_control_47_control__.__esModule && $__can_47_control_47_control__ || { default: $__can_47_control_47_control__ };
$__can_47_util_47_function_47_function__ = require('can/util/function/function'), $__can_47_util_47_function_47_function__ && $__can_47_util_47_function_47_function__.__esModule && $__can_47_util_47_function_47_function__ || { default: $__can_47_util_47_function_47_function__ };
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