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
 *                  $scope._ = _;
 *              }
 *          ]
 *      );
 *
 * With this you can use lo-dash easily in your controllers and views.
 */
(function() {
    'use strict';

    angular.module('frontend.services')
        .factory('_',
            [
                '$window',
                function($window) {
                    return $window._;
                }
            ]
        );
}());
