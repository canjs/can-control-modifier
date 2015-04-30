steal(
    'steal-qunit',
    'can',
    'can/control/modifier',
    'can/util/function',

    function(QUnit, can) {

        QUnit.module('can/control/modifier');

        QUnit.test('Modifiers should modify functions based on the string following the colon', function(assert) {
            var method_called_with_value = false;
            var modifier_value = false;

            var SomeControl = can.Control({
                "some_method:myMethod(10)": function(value) {
                    method_called_with_value = value;
                }
            });

            var control = new SomeControl('#qunit-fixture', {
                myMethod: function(origMethod, value) {
                    modifier_value = value;
                    return function(context, arg1) {
                        origMethod.apply(context, arg1);
                    };
                }
            });

            var expected = {expected:true};

            control.some_method(expected);

            assert.equal(modifier_value, '10', "modifier is called with value from method declaration string");
            assert.equal(method_called_with_value, expected, "regular method called with corrrect params");
        });

        QUnit.test('Modifier plugin used to debounce event handlers', function(assert) {
            var done = assert.async();

            /* setup */
            var run = 0;
            var run2 = 0;
            var run3 = 0;
            var control1;
            var control2;
            var fooToTheBar;

            var controlClass = can.Control({
                defaults: {
                    binder: undefined
                }
            }, {
                'click:debounce(30)': function() {
                    assert.ok(this instanceof can.Control, 'Debounced function has the correct context.');
                    fooToTheBar = true;
                    run++;
                },
                'bar:debounce(30)': function() {
                    run2++;
                },
                '{binder} click:debounce(50)': function() {
                    run2++;
                },
                'span click:debounce(50)': function() {
                    run3++;
                }
            });

            can.$('#qunit-fixture').html('<div id="foo"><span>Test</span></div><div id="bar"></div>');

            control1 = new controlClass('#foo', {
                binder: can.$(document.body)
            });

            control2 = new controlClass('#bar', {
                binder: can.$(document.body)
            });

            // Do a bunch of clicks!
            can.trigger(can.$('#foo'), 'click');
            can.trigger(can.$('#foo span'), 'click');
            can.trigger(can.$('#bar'), 'click');
            can.trigger(can.$('#foo'), 'click');
            can.trigger(can.$('#bar'), 'click');
            can.trigger(can.$('#foo'), 'click');
            can.trigger(can.$('#bar'), 'click');

            // Make sure foo is still undefined (should be > 30ms before its defined)
            assert.ok(typeof fooToTheBar === "undefined", '`fooToTheBar` is undefined.');
            assert.ok('bar' in control1, 'Method name gets aliased correctly');
            assert.ok('bar' in control2, 'Method name gets aliased correctly');

            control1.bar();
            control1.bar();
            control1.bar();
            control1.bar();

            // Check if
            setTimeout(function() {
                assert.ok(fooToTheBar, '`fooToTheBar` is true.');
                assert.equal(run, 2, '`run` is 2');
                assert.equal(run2, 1, '`run2` is 1');

                // Do a bunch more clicks!
                can.trigger(can.$('#foo'), 'click');
                can.trigger(can.$('#bar'), 'click');
                can.trigger(can.$('#foo'), 'click');
                can.trigger(can.$('#bar'), 'click');
                can.trigger(can.$('#foo'), 'click');
                can.trigger(can.$('#bar'), 'click');
                can.trigger(can.$(document.body), 'click');

                setTimeout(function() {
                    assert.equal(run3, 1, '`run3` is 1');
                    assert.equal(run, 4, '`run` is 4');
                    done();
                }, 40);

            }, 40);
        });

        QUnit.test('Modifiers should work with objects that don\'t implement delegate', function(assert) {
            var done = assert.async();

            var some_event_fired = false;
            var some_event_debounce_fired = false;

            // Create event-dispatching class
            var some_object = {
                bind: can.bind,
                unbind: can.unbind,
                dispatch: can.dispatch
            };

            // Create control listening for object events
            var SomeControl = can.Control({
                setObject: function(object) {
                    this.options.object = object;
                    this.on();
                },
                "{object} some_event": function() {
                    some_event_fired = true;
                },
                "{object} some_event:debounce(50)": function() {
                    some_event_debounce_fired = true;
                }
            });

            var some_control = new SomeControl(document.body);
            some_control.setObject(some_object);

            // Fire the event
            some_object.dispatch("some_event");

            assert.equal(some_event_fired, true, "Basic event handler fired");

            setTimeout(function() {
                assert.equal(some_event_debounce_fired, true, "Debounced event handler fired");
                done();
            }, 150);
        });

    });
