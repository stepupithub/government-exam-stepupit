'use strict';

angular.module('smModule').config(function(toastrConfig) {
    angular.extend(toastrConfig, {
        autoDismiss: false,
        containerId: 'toast-container',
        maxOpened: 0,
        newestOnTop: true,
        preventDuplicates: false,
        preventOpenDuplicates: false,
        target: 'body'
    });
});


angular.element(document).ready(function() {
    if (window.location.hash === '#_=_') window.location.hash = '#!';
    angular.bootstrap(document, ['smModule']);

    setTimeout(function() {
        $("#front-spinner-bx").hide();
        $(".body-main-cn").show();
    }, 500);
});
