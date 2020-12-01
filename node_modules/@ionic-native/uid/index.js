var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
import { IonicNativePlugin, cordovaPropertyGet, cordovaPropertySet } from '@ionic-native/core';
var UidOriginal = /** @class */ (function (_super) {
    __extends(UidOriginal, _super);
    function UidOriginal() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    Object.defineProperty(UidOriginal.prototype, "UUID", {
        get: function () { return cordovaPropertyGet(this, "UUID"); },
        set: function (value) { cordovaPropertySet(this, "UUID", value); },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(UidOriginal.prototype, "IMEI", {
        get: function () { return cordovaPropertyGet(this, "IMEI"); },
        set: function (value) { cordovaPropertySet(this, "IMEI", value); },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(UidOriginal.prototype, "IMSI", {
        get: function () { return cordovaPropertyGet(this, "IMSI"); },
        set: function (value) { cordovaPropertySet(this, "IMSI", value); },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(UidOriginal.prototype, "ICCID", {
        get: function () { return cordovaPropertyGet(this, "ICCID"); },
        set: function (value) { cordovaPropertySet(this, "ICCID", value); },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(UidOriginal.prototype, "MAC", {
        get: function () { return cordovaPropertyGet(this, "MAC"); },
        set: function (value) { cordovaPropertySet(this, "MAC", value); },
        enumerable: true,
        configurable: true
    });
    UidOriginal.pluginName = "Uid";
    UidOriginal.plugin = "cordova-plugin-uid";
    UidOriginal.pluginRef = "cordova.plugins.uid";
    UidOriginal.repo = "https://github.com/lionelhe/cordova-plugin-uid";
    UidOriginal.platforms = ["Android"];
    return UidOriginal;
}(IonicNativePlugin));
var Uid = new UidOriginal();
export { Uid };
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW5kZXguanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi9zcmMvQGlvbmljLW5hdGl2ZS9wbHVnaW5zL3VpZC9pbmRleC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7O0FBQ0EsT0FBTyw2REFBOEMsTUFBTSxvQkFBb0IsQ0FBQzs7SUE2Q3ZELHVCQUFpQjs7OzswQkFHeEMscUJBQUk7Ozs7OzswQkFJSixxQkFBSTs7Ozs7OzBCQUlKLHFCQUFJOzs7Ozs7MEJBSUosc0JBQUs7Ozs7OzswQkFJTCxvQkFBRzs7Ozs7Ozs7Ozs7Y0FqRUw7RUE4Q3lCLGlCQUFpQjtTQUE3QixHQUFHIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHsgSW5qZWN0YWJsZSB9IGZyb20gJ0Bhbmd1bGFyL2NvcmUnO1xuaW1wb3J0IHsgQ29yZG92YVByb3BlcnR5LCBJb25pY05hdGl2ZVBsdWdpbiwgUGx1Z2luIH0gZnJvbSAnQGlvbmljLW5hdGl2ZS9jb3JlJztcblxuLyoqXG4gKiBAbmFtZSBVaWRcbiAqIEBkZXNjcmlwdGlvblxuICogR2V0IHVuaXF1ZSBpZGVudGlmaWVyczogVVVJRCwgSU1FSSwgSU1TSSwgSUNDSUQgYW5kIE1BQy5cbiAqXG4gKiBAdXNhZ2VcbiAqIGBgYHR5cGVzY3JpcHRcbiAqIGltcG9ydCB7IFVpZCB9IGZyb20gJ0Bpb25pYy1uYXRpdmUvdWlkL25neCc7XG4gKiBpbXBvcnQgeyBBbmRyb2lkUGVybWlzc2lvbnMgfSBmcm9tICdAaW9uaWMtbmF0aXZlL2FuZHJvaWQtcGVybWlzc2lvbnMvbmd4JztcbiAqXG4gKiBjb25zdHJ1Y3Rvcihwcml2YXRlIHVpZDogVWlkLCBwcml2YXRlIGFuZHJvaWRQZXJtaXNzaW9uczogQW5kcm9pZFBlcm1pc3Npb25zKSB7IH1cbiAqXG4gKlxuICogYXN5bmMgZ2V0SW1laSgpIHtcbiAqICBjb25zdCB7IGhhc1Blcm1pc3Npb24gfSA9IGF3YWl0IHRoaXMuYW5kcm9pZFBlcm1pc3Npb25zLmNoZWNrUGVybWlzc2lvbihcbiAqICAgIHRoaXMuYW5kcm9pZFBlcm1pc3Npb25zLlBFUk1JU1NJT04uUkVBRF9QSE9ORV9TVEFURVxuICogICk7XG4gKlxuICogIGlmICghaGFzUGVybWlzc2lvbikge1xuICogICAgY29uc3QgcmVzdWx0ID0gYXdhaXQgdGhpcy5hbmRyb2lkUGVybWlzc2lvbnMucmVxdWVzdFBlcm1pc3Npb24oXG4gKiAgICAgIHRoaXMuYW5kcm9pZFBlcm1pc3Npb25zLlBFUk1JU1NJT04uUkVBRF9QSE9ORV9TVEFURVxuICogICAgKTtcbiAqXG4gKiAgICBpZiAoIXJlc3VsdC5oYXNQZXJtaXNzaW9uKSB7XG4gKiAgICAgIHRocm93IG5ldyBFcnJvcignUGVybWlzc2lvbnMgcmVxdWlyZWQnKTtcbiAqICAgIH1cbiAqXG4gKiAgICAvLyBvaywgYSB1c2VyIGdhdmUgdXMgcGVybWlzc2lvbiwgd2UgY2FuIGdldCBoaW0gaWRlbnRpZmllcnMgYWZ0ZXIgcmVzdGFydCBhcHBcbiAqICAgIHJldHVybjtcbiAqICB9XG4gKlxuICogICByZXR1cm4gdGhpcy51aWQuSU1FSVxuICogfVxuICogYGBgXG4gKi9cbkBQbHVnaW4oe1xuICBwbHVnaW5OYW1lOiAnVWlkJyxcbiAgcGx1Z2luOiAnY29yZG92YS1wbHVnaW4tdWlkJyxcbiAgcGx1Z2luUmVmOiAnY29yZG92YS5wbHVnaW5zLnVpZCcsXG4gIHJlcG86ICdodHRwczovL2dpdGh1Yi5jb20vbGlvbmVsaGUvY29yZG92YS1wbHVnaW4tdWlkJyxcbiAgcGxhdGZvcm1zOiBbJ0FuZHJvaWQnXVxufSlcbkBJbmplY3RhYmxlKClcbmV4cG9ydCBjbGFzcyBVaWQgZXh0ZW5kcyBJb25pY05hdGl2ZVBsdWdpbiB7XG4gIC8qKiBHZXQgdGhlIGRldmljZSBVbml2ZXJzYWxseSBVbmlxdWUgSWRlbnRpZmllciAoVVVJRCkuICovXG4gIEBDb3Jkb3ZhUHJvcGVydHkoKVxuICBVVUlEOiBzdHJpbmc7XG5cbiAgLyoqIEdldCB0aGUgZGV2aWNlIEludGVybmF0aW9uYWwgTW9iaWxlIFN0YXRpb24gRXF1aXBtZW50IElkZW50aXR5IChJTUVJKS4gKi9cbiAgQENvcmRvdmFQcm9wZXJ0eSgpXG4gIElNRUk6IHN0cmluZztcblxuICAvKiogR2V0IHRoZSBkZXZpY2UgSW50ZXJuYXRpb25hbCBtb2JpbGUgU3Vic2NyaWJlciBJZGVudGl0eSAoSU1TSSkuICovXG4gIEBDb3Jkb3ZhUHJvcGVydHkoKVxuICBJTVNJOiBzdHJpbmc7XG5cbiAgLyoqIEdldCB0aGUgc2ltIEludGVncmF0ZWQgQ2lyY3VpdCBDYXJkIElkZW50aWZpZXIgKElDQ0lEKS4gKi9cbiAgQENvcmRvdmFQcm9wZXJ0eSgpXG4gIElDQ0lEOiBzdHJpbmc7XG5cbiAgLyoqIEdldCB0aGUgTWVkaWEgQWNjZXNzIENvbnRyb2wgYWRkcmVzcyAoTUFDKS4gKi9cbiAgQENvcmRvdmFQcm9wZXJ0eSgpXG4gIE1BQzogc3RyaW5nO1xuXG59XG4iXX0=