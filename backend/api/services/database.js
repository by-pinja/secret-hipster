'use strict';

var barrels = require('barrels');
var fixtures = barrels.load().objects;

exports.init = function(next) {
    Ship
        .find()
        .exec(function(error, ships) {
            if (error) {
                next(error);
            } else if (ships.length != 0) {
                next();
            } else {
                barrels.populate(function(error) {
                    next(error);
                });
            }
        });
};