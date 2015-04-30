# can-control-modifier

_\*This plugin is experimental and not **official** or **supported**\*_


The can-control-modifier plugin, allows you to augment methods and event callbacks declaritivly. This is most commonly used in conjunction with the [can-util-function plugin](https://github.com/canjs/can-util-function) to debounce, throttle and defer method or event callbacks:

```javascript
var can = require('can');
require('can-control-modifier'); // augments can.Control
require('can-util-function'); // augments can itself

var MyControl = can.Control.extend({

}, {
    'search:debounce(100)': function(searchTerm) {
        applySearch(searchTerm);
    },
    'button click:throttle(30)': function(el, ev) {
        selectElement(el);
    }
});
```

...but can also be used in clever ways like the modifier/key plugin (packaged with this plugin) which allows you to easily bind keyboard events to your controls in a nice easy to read way:

```javascript
var KeyboardControl = can.Control.extend({
    'keyup:(arrow-up)': function (el, ev) {
        moveUp();
    },
    'keydown:(shift+p)': function (el, ev) {
        log('shift key and p: event pressed!');
    }
});
```

## API

After the method name, or event name, add `:` + **the method name** + `({value to pass to the method})`.

```javascript
'element eventname:debounce(100)': function() {},
'method:throttle(50)': function() {},

```

The method name provided will be searched for in the following order:

1. on the **options** object passed into the control on instatiation
2. on the **can** framework object (which in many cases is augmented by the [can-util-function plugin](https://github.com/canjs/can-util-function) or other plugins)
3. on the **window** or **global** object

So you can either pass the method in with the options, provide it in defaults, extend **can** itself, or have the method globally available.

-------------------


Licensing
---------

  MIT - Please see the file called LICENSE.

