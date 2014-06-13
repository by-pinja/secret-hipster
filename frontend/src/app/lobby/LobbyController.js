(function() {
    angular.module('frontend.controllers')
        .controller('LobbyController',
            [
                '$scope', '$state', 'Auth',
                function($scope, $state, Auth) {
                    if (Auth.isAuthenticated()) {
                        $state.go('game.game');
                    }

                    angular.element('#nick').focus();

                    $scope.join = function() {
                        Auth
                            .join($scope.nick)
                            .then(function() {
                                $state.go('game.game');
                            });
                    };
                }
            ]
        );
}());