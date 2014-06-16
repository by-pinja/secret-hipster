/**
 * HipsterShipster application definition.
 *
 * This is the main file for the 'HipsterShipster' application.
 *
 * @todo should these be done in separated files?
 */
(function() {
    'use strict';

    // Create HipsterShipster module and specify dependencies for that
    angular.module('HipsterShipster', [
        'HipsterShipster.common',
        'HipsterShipster.components',
        'HipsterShipster.controllers',
        'HipsterShipster.directives',
        'HipsterShipster.filters',
        'HipsterShipster.interceptors',
        'HipsterShipster.services'
    ]);

    // Initialize used HipsterShipster specified modules
    angular.module('HipsterShipster.controllers', []);
    angular.module('HipsterShipster.directives', []);
    angular.module('HipsterShipster.filters', []);
    angular.module('HipsterShipster.interceptors', []);
    angular.module('HipsterShipster.services', []);

    // General components for 'HipsterShipster' application
    angular.module('HipsterShipster.common', [
        'ngSanitize',
        'ui.router',
        'ui.bootstrap',
        'ui.bootstrap.showErrors',
        'angularMoment',
        'linkify',
        'HipsterShipster-templates',
        'luegg.directives',
        'sails.io'
    ]);

    // Page components for 'HipsterShipster' application
    angular.module('HipsterShipster.components', [
        'HipsterShipster.game',
        'HipsterShipster.lobby',
        'HipsterShipster.login'
    ]);

    /**
     * Configuration for HipsterShipster application, this contains following main sections:
     *
     *  1) Configure $httpProvider and $sailsSocketProvider
     *  2) Set necessary HTTP and Socket interceptor(s)
     *  3) Turn on HTML5 mode on application routes
     *  4) Set up application routes
     */
    angular.module('HipsterShipster')
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
                            controller: 'loginController',
                            templateUrl: '/HipsterShipster/login/login.html'
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
                            templateUrl: '/HipsterShipster/lobby/lobby.html',
                            controller: 'lobbyController'
                        })
                        .state('game.game', {
                            url: '/game',
                            templateUrl: '/HipsterShipster/game/game.html',
                            controller: 'gameController'
                        });


                    // For any unmatched url, redirect to /state1
                    $urlRouterProvider.otherwise('/login');
                }
            ]
        );

    /**
     * HipsterShipster application run hook configuration. This will attach auth status
     * check whenever application changes URL states.
     */
    angular.module('HipsterShipster')
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
