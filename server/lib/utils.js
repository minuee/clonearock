'use strict';

let _ = require('underscore');
let utils = function() {

};

utils.prototype.isEmpty = function(str){
    return str === null || str === undefined || str === '' || (typeof str === 'object' && Array.isArray(str) === false && Object.keys(str).length === 0);
};

utils.prototype.isNull = function(data,replace){
    return data === undefined ? replace : data;
};

utils.prototype.getTodayformatDate = function(){
    const ddate = new Date();
    let month = '' + (ddate.getMonth() + 1);
    let day = '' + ddate.getDate();
    const year = ddate.getFullYear();
    if (month.length < 2) month = '0' + month;
    if (day.length < 2) day = '0' + day;
    return [year, month, day].join('-');
};

module.exports = new utils();