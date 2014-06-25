/**
 * Simply service to track socket listeners. This is needed to prevent multiple listeners
 * on same controller scope. Basically each time when controller code is run it will register
 * new subscription to specified socket room. And this is problem when client runs same
 * controller code multiple times => multiple message handlers => total fail.
 */
(function() {
    'use strict';

    angular.module('HipsterShipster.services')
        .factory('Listeners',
            function() {
                var listeners = {};

                return listeners;
            }
        );
}());