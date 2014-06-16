(function() {
    'use strict';

    angular.module('HipsterShipster.login')
        .controller('loginController',
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