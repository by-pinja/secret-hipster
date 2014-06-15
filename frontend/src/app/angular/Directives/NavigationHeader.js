/**
 * Navigation header directive.
 *
 * Purpose of this directive is to render application header navigation. This layout section contains
 * different data depending if user is logged in or not.
 */
(function() {
    'use strict';

    angular.module('frontend.directives')
        .directive('navigationHeader', function() {
            return {
                restrict: 'E',
                replace: true,
                scope: {},
                templateUrl: '/frontend/partials/Directives/NavigationHeader/header.html',
                controller: [
                    '$scope', 'Player', 'Auth',
                    function($scope, Player, Auth) {
                        $scope.player = Player.player;
                        $scope.auth = Auth;

                        $scope.logout = function() {
                            Auth.logout();
                        };
                    }
                ]
            };
        });
}());
