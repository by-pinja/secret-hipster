/**
 * Frontend application definition.
 *
 * This is the main file for the 'Frontend' application.
 *
 * @todo should these be done in separated files?
 */
(function() {
    'use strict';

    // Create frontend module and specify dependencies for that
    angular.module('frontend', [
        'ngSanitize',
        'ui.router',
        'ui.bootstrap',
        'ui.bootstrap.showErrors',
        'angularMoment',
        'linkify',
        'frontend-templates',
        'luegg.directives',
        'sails.io',
        'frontend.controllers',
        'frontend.directives',
        'frontend.filters',
        'frontend.interceptors',
        'frontend.services',
        'frontend.example',
        'frontend.game'
    ]);

    // Initialize used frontend specified modules
    angular.module('frontend.controllers', []);
    angular.module('frontend.directives', []);
    angular.module('frontend.filters', []);
    angular.module('frontend.interceptors', []);
    angular.module('frontend.services', []);
    angular.module('frontend.example', []);
    angular.module('frontend.game', []);

    /**
     * Configuration for frontend application, this contains following main sections:
     *
     *  1) Configure $httpProvider and $sailsSocketProvider
     *  2) Set necessary HTTP and Socket interceptor(s)
     *  3) Turn on HTML5 mode on application routes
     *  4) Set up application routes
     */
angular.module('frontend')
    .config(
        [
            '$stateProvider', '$locationProvider', '$urlRouterProvider', '$httpProvider', '$sailsSocketProvider',
            'AccessLevels',
            function($stateProvider, $locationProvider, $urlRouterProvider, $httpProvider, $sailsSocketProvider,
                     AccessLevels
            ) {
                $httpProvider.defaults.useXDomain = true;

                delete $httpProvider.defaults.headers.common['X-Requested-With'];

                // Add interceptors for $httpProvider and $sailsSocketProvider
                $httpProvider.interceptors.push('AuthInterceptor');
                $httpProvider.interceptors.push('ErrorInterceptor');
                $sailsSocketProvider.interceptors.push('AuthInterceptor');
                $sailsSocketProvider.interceptors.push('ErrorInterceptor');

                // Yeah we wanna to use HTML5 urls!
                $locationProvider
                    .html5Mode(true)
                    .hashPrefix('!')
                ;

                // Routes that are accessible by anyone
                $stateProvider
                    .state('anon', {
                        abstract: true,
                        template: '<ui-view/>',
                        data: {
                            access: AccessLevels.anon
                        }
                    })
                    .state('anon.login', {
                        url: '/login',
                        controller: 'LoginController',
                        templateUrl: '/frontend/login/login.html'
                    });

                $stateProvider
                    .state('game', {
                        abstract: true,
                        template: '<ui-view/>',
                        data: {
                            access: AccessLevels.player
                        }
                    })
                    .state('game.lobby', {
                        url: '/lobby',
                        templateUrl: '/frontend/lobby/lobby.html',
                        controller: 'lobbyController'
                    })
                    .state('game.game', {
                        url: '/game',
                        templateUrl: '/frontend/game/game.html',
                        controller: 'gameController'
                    });


                // For any unmatched url, redirect to /state1
                $urlRouterProvider.otherwise('/login');
            }
        ]
    );

    /**
     * Frontend application run hook configuration. This will attach auth status
     * check whenever application changes URL states.
     */
    angular.module('frontend')
        .run([
            '$rootScope', '$state', 'Auth',
            function($rootScope, $state, Auth) {
                // And when ever route changes we must check authenticate status
                $rootScope.$on('$stateChangeStart', function(event, toState) {
                    if (!Auth.authorize(toState.data.access)) {
                        event.preventDefault();

                        $state.go('anon.login');
                    }
                });
            }
        ]);
}());
