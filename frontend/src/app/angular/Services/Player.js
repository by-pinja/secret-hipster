/**
 * Current user data service within this you can access to currently signed in user data.
 * Note that if you wanna be secure about this you have to also use 'Auth' service in your
 * views.
 *
 * Usage example in controller:
 *  angular
 *      .module('app')
 *      .controller('SomeController',
 *          [
 *              '$scope', 'Auth', 'Player',
 *              function ($scope, Auth, Player) {
 *                  $scope.auth = Auth;
 *                  $scope.user = Player.user;
 *              }
 *          ]
 *      );
 *
 * Usage example in view:
 *  <div data-ng-show="auth.isAuthenticated()">
 *      Hello, <strong>{{user().email}}</strong>
 *  </div>
 *
 * Happy coding!
 */
(function() {
    'use strict';

    angular.module('frontend.services')
        .factory('Player',
            [
                'Storage',
                function(Storage) {
                    return {
                        player: function() {
                            if (Storage.get('auth_token')) {
                                return angular.fromJson(Storage.get('auth_token')).player;
                            } else {
                                return {};
                            }
                        }
                    };
                }
            ]
        );
}());