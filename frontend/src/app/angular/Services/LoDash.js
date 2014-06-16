/**
 * Angular service to inject lo-dash library to your controllers.
 *
 * Usage example in controller:
 *
 *  angular
 *      .module('app')
 *      .controller('SomeController',
 *          [
 *              '$scope', '_',
 *              function ($scope, _) {
 *                  var foo = _.map(data, function(foo) { return foo.bar = 'foobar'; });
 *              }
 *          ]
 *      );
 *
 * With this you can use lo-dash easily in your controllers and views.
 */
(function() {
    'use strict';

    angular.module('HipsterShipster.services')
        .factory('_',
            [
                '$window',
                function($window) {
                    return $window._;
                }
            ]
        );
}());
