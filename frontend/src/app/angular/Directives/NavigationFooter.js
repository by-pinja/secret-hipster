/**
 * Navigation footer directive.
 *
 * Purpose of this directive is to render application footer navigation.
 *
 * @todo Add version info parsing
 */
(function() {
    'use strict';

    angular.module('HipsterShipster.directives')
        .directive('navigationFooter', function() {
            return {
                restrict: 'E',
                replace: true,
                scope: {},
                templateUrl: '/HipsterShipster/partials/Directives/NavigationFooter/footer.html'
            };
        });
}());
