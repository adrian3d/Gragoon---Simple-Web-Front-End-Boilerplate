// Mobile detect function
// ==============================================

module.exports = (function () {
    return {
        'mobile': false,
        'tablet': false,
        'touch': false,

        init: function () {
            var md = new MobileDetect(window.navigator.userAgent);
            var $body = $('body');

            if (md.phone()) {
                this.mobile = true;
                this.touch = true;
                $body.addClass('is-mobile is-touch');
            }

            if (md.tablet()) {
                this.tablet = true;
                this.touch = true;
                $body.addClass('is-tablet is-touch');
            }
        }
    };
})();
