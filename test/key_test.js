import QUnit from 'steal-qunit';
import $ from 'jquery';
import can from 'can';
import 'can-control-modifier/key/key';

QUnit.module('can/control/modifier/key');

QUnit.test('key down triggered', 1, function(assert) {

    var Tester = can.Control({
        'keydown': function() {},
        'keydown:(shift+p)': function(elm, ev) {
            assert.ok('key event pressed!');
        }
    });

    var tester = new Tester(document.body);

    // trigger event
    var e = $.Event('keydown');

    e.which = 80;
    e.keyCode = 80;
    e.shiftKey = true;
    e.altKey = false;
    e.charCode = 0;
    e.ctrlKey = false;
    e.metaKey = false;

    $(document.body).trigger(e);
    
});
