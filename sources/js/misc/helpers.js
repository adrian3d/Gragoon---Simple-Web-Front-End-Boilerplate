// Helpers
// ==============================================

module.exports = (function () {
    return {
        throttle: function (callback, delay) {
            var last;
            var timer;

            return function () {
                var context = this;
                var now = +new Date();
                var args = arguments;

                if (last && now < last + delay) {
                    clearTimeout(timer);

                    timer = setTimeout(function () {
                        last = now;

                        callback.apply(context, args);
                    }, delay);
                } else {
                    last = now;

                    callback.apply(context, args);
                }
            };
        },

        debounce: function (callback, delay) {
            var timer;
            return function () {
                var args = arguments;
                var context = this;

                clearTimeout(timer);

                timer = setTimeout(function () {
                    callback.apply(context, args);
                }, delay);
            };
        },

        listeners: {
            init: function () {
                var $doc = $(document);

                this.click($doc, this);
            },

            click: function ($doc, _this) {
                $doc.on('click', '[data-action]', function (e) {
                    e.preventDefault();

                    var $elem = $(e.currentTarget);
                    var url = $elem.attr('href') || $elem.attr('data-href') || $elem.attr('data-url');
                    var method = $elem.attr('data-action');

                    _this.send(method, url, $elem, e);
                });
            },

            send: function (method, arg1, arg2, arg3) {
                if (method.indexOf('.') >= 0) {
                    method = method.split('.');
                }

                if (typeof method === 'object' && typeof App[method[0]][method[1]] !== 'undefined') {
                    App[method[0]][method[1]](arg1, arg2, arg3);
                } else if (typeof App[method] !== 'undefined') {
                    App[method](arg1, arg2, arg3);
                } else {
                    console.log('error : method "' + method + '" not found');
                }
            }
        }
    };
})();
