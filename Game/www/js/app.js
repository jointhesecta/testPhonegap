/**
 * Created by Victor-BookPro on 26/04/14.
 */

(function () {

    /* ---------------------------------- Local Variables ---------------------------------- */
    var home = Handlebars.compile($("#home").html());
    var employeeLiTpl = Handlebars.compile($("#employee-li-tpl").html());
    var employeeTpl = Handlebars.compile($("#employee-tpl").html());

    var slider = new PageSlider($('body'));

    var detailsURL = /^#employees\/(\d{1,})/;

    var adapter = new MemoryAdapter();
    adapter.initialize().done(function () {
        route();
    });

    /* --------------------------------- Event Registration -------------------------------- */
    $(window).on('hashchange', route);

    document.addEventListener('deviceready', function () {

        FastClick.attach(document.body);

        if (navigator.notification) { // Override default HTML alert with native dialog
            window.alert = function (message) {
                navigator.notification.alert(
                    message,    // message
                    null,       // callback
                    "Workshop", // title
                    'OK'        // buttonName
                );
            };
        }
    }, false);

    /* ---------------------------------- Local Functions ---------------------------------- */
    function route() {
        var hash = window.location.hash;
        if (!hash) {
            slider.slidePage(new HomeView(adapter, home, employeeLiTpl).render().el);
            return;
        }
        var match = hash.match(detailsURL);
        if (match) {
            adapter.findById(Number(match[1])).done(function (employee) {
                slider.slidePage(new EmployeeView(adapter, employeeTpl, employee).render().el);
            });
        }
    }

}());