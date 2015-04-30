/*[global-shim-start]*/
(function (exports, global){
	var origDefine = global.define;

	var get = function(name){
		var parts = name.split("."),
			cur = global,
			i;
		for(i = 0 ; i < parts.length; i++){
			if(!cur) {
				break;
			}
			cur = cur[parts[i]];
		}
		return cur;
	};
	var modules = (global.define && global.define.modules) ||
		(global._define && global._define.modules) || {};
	var ourDefine = global.define = function(moduleName, deps, callback){
		var module;
		if(typeof deps === "function") {
			callback = deps;
			deps = [];
		}
		var args = [],
			i;
		for(i =0; i < deps.length; i++) {
			args.push( exports[deps[i]] ? get(exports[deps[i]]) : ( modules[deps[i]] || get(deps[i]) )  );
		}
		// CJS has no dependencies but 3 callback arguments
		if(!deps.length && callback.length) {
			module = { exports: {} };
			var require = function(name) {
				return exports[name] ? get(exports[name]) : modules[name];
			};
			args.push(require, module.exports, module);
		}
		// Babel uses only the exports objet
		else if(!args[0] && deps[0] === "exports") {
			module = { exports: {} };
			args[0] = module.exports;
		}

		global.define = origDefine;
		var result = callback ? callback.apply(null, args) : undefined;
		global.define = ourDefine;

		// Favor CJS module.exports over the return value
		modules[moduleName] = module && module.exports ? module.exports : result;
	};
	global.define.orig = origDefine;
	global.define.modules = modules;
	global.define.amd = true;
	global.System = {
		define: function(__name, __code){
			global.define = origDefine;
			eval("(function() { " + __code + " \n }).call(global);");
			global.define = ourDefine;
		},
		orig: global.System
	};
})({},window)
/*can-control-modifier@0.0.3#modifier*/
define('can-control-modifier/modifier', ['can'], function ($__0) {
    'use strict';
    if (!$__0 || !$__0.__esModule)
        $__0 = { default: $__0 };
    var can = $__0.default;
    var originalSetup = can.Control.setup;
    var processors = can.Control.processors;
    var modifier = {
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
/*can-control-modifier@0.0.3#key/key*/
define('can-control-modifier/key/key', [
    'can',
    'can-control-modifier/modifier'
], function ($__0, $__2) {
    'use strict';
    if (!$__0 || !$__0.__esModule)
        $__0 = { default: $__0 };
    if (!$__2 || !$__2.__esModule)
        $__2 = { default: $__2 };
    var can = $__0.default;
    $__2;
    function realTypeOf(v, s) {
        return v === null ? s === 'null' : v === undefined ? s === 'undefined' : v.is && v instanceof $ ? s === 'element' : Object.prototype.toString.call(v).toLowerCase().indexOf(s) > 7;
    }
    var _modProps = {
            16: 'shiftKey',
            17: 'ctrlKey',
            18: 'altKey',
            91: 'metaKey'
        };
    var _keys = {
            mods: {
                '\u21E7': 16,
                shift: 16,
                '\u2303': 17,
                ctrl: 17,
                '\u2325': 18,
                alt: 18,
                option: 18,
                '\u2318': 91,
                meta: 91,
                cmd: 91,
                'super': 91,
                win: 91
            },
            keys: {
                '\u232B': 8,
                backspace: 8,
                '\u21E5': 9,
                '\u21C6': 9,
                tab: 9,
                '\u21A9': 13,
                'return': 13,
                enter: 13,
                '\u2305': 13,
                'pause': 19,
                'pause-break': 19,
                '\u21EA': 20,
                caps: 20,
                'caps-lock': 20,
                '\u238B': 27,
                escape: 27,
                esc: 27,
                space: 32,
                '\u2196': 33,
                pgup: 33,
                'page-up': 33,
                '\u2198': 34,
                pgdown: 34,
                'page-down': 34,
                '\u21DF': 35,
                end: 35,
                '\u21DE': 36,
                home: 36,
                ins: 45,
                insert: 45,
                del: 46,
                'delete': 46,
                '\u2190': 37,
                left: 37,
                'arrow-left': 37,
                '\u2191': 38,
                up: 38,
                'arrow-up': 38,
                '\u2192': 39,
                right: 39,
                'arrow-right': 39,
                '\u2193': 40,
                down: 40,
                'arrow-down': 40,
                '*': 106,
                star: 106,
                asterisk: 106,
                multiply: 106,
                '+': 107,
                'plus': 107,
                '-': 109,
                subtract: 109,
                ';': 186,
                semicolon: 186,
                '=': 187,
                'equals': 187,
                ',': 188,
                comma: 188,
                '.': 190,
                period: 190,
                'full-stop': 190,
                '/': 191,
                slash: 191,
                'forward-slash': 191,
                '`': 192,
                tick: 192,
                'back-quote': 192,
                '[': 219,
                'open-bracket': 219,
                '\\': 220,
                'back-slash': 220,
                ']': 221,
                'close-bracket': 221,
                '\'': 222,
                quote: 222,
                apostraphe: 222
            }
        }, i, n;
    i = 95;
    n = 0;
    while (++i < 106) {
        _keys.keys['num-' + n] = i;
        ++n;
    }
    i = 47;
    n = 0;
    while (++i < 58) {
        _keys.keys[n] = i;
        ++n;
    }
    i = 111;
    n = 1;
    while (++i < 136) {
        _keys.keys['f' + n] = i;
        ++n;
    }
    i = 64;
    while (++i < 91) {
        _keys.keys[String.fromCharCode(i).toLowerCase()] = i;
    }
    function JwertyCode(jwertyCode) {
        var i, c, n, z, keyCombo, optionals, jwertyCodeFragment, rangeMatches, rangeI;
        if (jwertyCode instanceof JwertyCode) {
            return jwertyCode;
        }
        if (!realTypeOf(jwertyCode, 'array')) {
            jwertyCode = String(jwertyCode).replace(/\s/g, '').toLowerCase().match(/(?:\+,|[^,])+/g);
        }
        for (i = 0, c = jwertyCode.length; i < c; ++i) {
            if (!realTypeOf(jwertyCode[i], 'array')) {
                jwertyCode[i] = String(jwertyCode[i]).match(/(?:\+\/|[^\/])+/g);
            }
            optionals = [];
            n = jwertyCode[i].length;
            while (n--) {
                jwertyCodeFragment = jwertyCode[i][n];
                keyCombo = {
                    jwertyCombo: String(jwertyCodeFragment),
                    shiftKey: false,
                    ctrlKey: false,
                    altKey: false,
                    metaKey: false
                };
                if (!realTypeOf(jwertyCodeFragment, 'array')) {
                    jwertyCodeFragment = String(jwertyCodeFragment).toLowerCase().match(/(?:(?:[^\+])+|\+\+|^\+$)/g);
                }
                z = jwertyCodeFragment.length;
                while (z--) {
                    if (jwertyCodeFragment[z] === '++') {
                        jwertyCodeFragment[z] = '+';
                    }
                    if (jwertyCodeFragment[z] in _keys.mods) {
                        keyCombo[_modProps[_keys.mods[jwertyCodeFragment[z]]]] = true;
                    } else if (jwertyCodeFragment[z] in _keys.keys) {
                        keyCombo.keyCode = _keys.keys[jwertyCodeFragment[z]];
                    } else {
                        rangeMatches = jwertyCodeFragment[z].match(/^\[([^-]+\-?[^-]*)-([^-]+\-?[^-]*)\]$/);
                    }
                }
                if (realTypeOf(keyCombo.keyCode, 'undefined')) {
                    if (rangeMatches && rangeMatches[1] in _keys.keys && rangeMatches[2] in _keys.keys) {
                        rangeMatches[2] = _keys.keys[rangeMatches[2]];
                        rangeMatches[1] = _keys.keys[rangeMatches[1]];
                        for (rangeI = rangeMatches[1]; rangeI < rangeMatches[2]; ++rangeI) {
                            optionals.push({
                                altKey: keyCombo.altKey,
                                shiftKey: keyCombo.shiftKey,
                                metaKey: keyCombo.metaKey,
                                ctrlKey: keyCombo.ctrlKey,
                                keyCode: rangeI,
                                jwertyCombo: String(jwertyCodeFragment)
                            });
                        }
                        keyCombo.keyCode = rangeI;
                    } else {
                        keyCombo.keyCode = 0;
                    }
                }
                optionals.push(keyCombo);
            }
            this[i] = optionals;
        }
        this.length = i;
        return this;
    }
    var jwerty = {
            event: function (jwertyCode, callbackFunction, callbackContext) {
                if (realTypeOf(callbackFunction, 'boolean')) {
                    var bool = callbackFunction;
                    callbackFunction = function () {
                        return bool;
                    };
                }
                jwertyCode = new JwertyCode(jwertyCode);
                var i = 0, c = jwertyCode.length - 1, returnValue, jwertyCodeIs;
                return function (event) {
                    jwertyCodeIs = jwerty.is(jwertyCode, event, i);
                    if (jwertyCodeIs) {
                        if (i < c) {
                            ++i;
                            return;
                        } else {
                            returnValue = callbackFunction.call(callbackContext || this, event, jwertyCodeIs);
                            if (returnValue === false) {
                                event.preventDefault();
                            }
                            i = 0;
                            return;
                        }
                    }
                    i = jwerty.is(jwertyCode, event) ? 1 : 0;
                };
            },
            is: function (jwertyCode, event, i) {
                jwertyCode = new JwertyCode(jwertyCode);
                i = i || 0;
                jwertyCode = jwertyCode[i];
                event = event.originalEvent || event;
                var n = jwertyCode.length, returnValue = false;
                while (n--) {
                    returnValue = jwertyCode[n].jwertyCombo;
                    for (var p in jwertyCode[n]) {
                        if (p !== 'jwertyCombo' && event[p] !== jwertyCode[n][p]) {
                            returnValue = false;
                        }
                    }
                    if (returnValue !== false) {
                        return returnValue;
                    }
                }
                return returnValue;
            },
            KEYS: _keys
        };
    var originalShifter = can.Control._shifter;
    can.extend(can.Control, {
        _shifter: function (context, name) {
            var fn = originalShifter.apply(this, arguments), parts = name.split(':');
            if (parts.length > 1 && /key/.test(parts[0])) {
                if (parts[1][0] === '(') {
                    fn = jwerty.event(parts[1].replace(/\(|\)/gi, ''), fn);
                }
            }
            return fn;
        }
    });
    return {};
});
/*can-control-modifier@0.0.3#main*/
define('can-control-modifier', [
    'can-control-modifier/modifier',
    'can-control-modifier/key/key'
], function ($__0, $__1) {
    'use strict';
    if (!$__0 || !$__0.__esModule)
        $__0 = { default: $__0 };
    if (!$__1 || !$__1.__esModule)
        $__1 = { default: $__1 };
    $__0;
    $__1;
    return {};
});
/*[global-shim-end]*/
(function (){
	window._define = window.define;
	window.define = window.define.orig;
	window.System = window.System.orig;
})();