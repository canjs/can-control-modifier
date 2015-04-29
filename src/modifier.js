import can from 'can';
import 'can/util/util';
import 'can/control/control';
import 'can/util/function/function';

// Hang on to original action
var originalSetup = can.Control.setup;
var processors = can.Control.processors;

var modifier = {
    delim: ':',
    hasModifier: function(name) {
        return name.indexOf(modifier.delim) !== -1;
    },
    modify: function(name, fn, options) {
        var parts = name.match(/([\w]+)\((.+)\)/),
            mod, args;
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
                ])
                .split(',');
            if (mod) {
                args.unshift(fn);
                fn = mod.apply(null, args);
            }
        }
        return fn;
    },
    addProcessor: function(event, mod) {
        var processorName = [
            event,
            mod
        ].join(modifier.delim);
        processors[processorName] = function(el, nil, selector, methodName, control) {
            var callback = modifier.modify(mod, can.Control._shifter(control, methodName), control.options);
            control[event] = callback;
            if (!selector) {
                selector = can.trim(selector);
            }
            can.delegate.call(el, selector, event, callback);
            return function() {
                can.undelegate.call(el, selector, event, callback);
            };
        };
    }
};

can.extend(can.Control, {
    modifier: modifier,
    setup: function(el, options) {
        can.each(this.prototype, function(fn, key, prototype) {
            var parts, event, mod;
            if (modifier.hasModifier(key)) {
                // Figure out parts
                parts = key.split(modifier.delim);
                event = parts.shift()
                    .split(' ')
                    .pop();
                mod = parts.join('');
                if (!(can.trim(key) in processors)) {
                    modifier.addProcessor(event, mod);
                }
            }
        });
        originalSetup.apply(this, arguments);
    }
});

export default can;
