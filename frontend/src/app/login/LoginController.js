(function() {
    'use strict';

    angular.module('frontend.controllers')
        .controller('LoginController',
            [
                '$scope', '$state', 'Auth',
                function($scope, $state, Auth) {
                    if (Auth.isAuthenticated()) {
                        $state.go('game.lobby');
                    }

                    angular.element('#nick').focus();

                    $scope.join = function() {
                        Auth
                            .join($scope.nick)
                            .then(
                                function() {
                                    $state.go('game.lobby');
                                },
                                function(error) {
                                    console.log('error');
                                    console.log(error);
                                }
                            );
                    };
                }
            ]
        );
}());