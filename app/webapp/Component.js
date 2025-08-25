
sap.ui.define([
  "sap/ui/core/UIComponent",
  "sap/ui/model/json/JSONModel"
], function (UIComponent, JSONModel) {
  "use strict";

  return UIComponent.extend("demo.shoppingcart.Component", {
    metadata: {
      manifest: "json"
    },

    init: function () {
      UIComponent.prototype.init.apply(this, arguments);

      // Local cart model
      var oCart = new JSONModel({ items: [], total: 0 });
      this.setModel(oCart, "cart");

      // Initialize router (if any)
      var oRouter = this.getRouter && this.getRouter();
      if (oRouter) oRouter.initialize();
    }
  });
});
