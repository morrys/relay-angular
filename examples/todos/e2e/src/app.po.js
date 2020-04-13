"use strict";
exports.__esModule = true;
var protractor_1 = require("protractor");
var AppPage = /** @class */ (function () {
    function AppPage() {
    }
    AppPage.prototype.navigateTo = function () {
        return protractor_1.browser.get(protractor_1.browser.baseUrl);
    };
    AppPage.prototype.getTitleText = function () {
        return protractor_1.element(protractor_1.by.css('app-root .content span')).getText();
    };
    return AppPage;
}());
exports.AppPage = AppPage;
