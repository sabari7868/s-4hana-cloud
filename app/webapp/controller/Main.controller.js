
sap.ui.define([
  "sap/ui/core/mvc/Controller",
  "sap/m/MessageToast",
  "sap/ui/model/Filter",
  "sap/ui/model/FilterOperator"
], function(Controller, MessageToast, Filter, FilterOperator) {
  "use strict";

  return Controller.extend("demo.shoppingcart.controller.Main", {
    onInit: function () {
      // nothing special; default model is OData V2 per manifest
    },

    onRefresh: function() {
      var oModel = this.getView().getModel();
      if (oModel && oModel.refresh) {
        oModel.refresh(true);
        MessageToast.show("Refreshed");
      }
    },

    onSearch: function(oEvent) {
      var sQuery = oEvent.getParameter("newValue") || oEvent.getParameter("query") || "";
      var aFilters = [];
      if (sQuery) {
        aFilters.push(new Filter("ProductName", FilterOperator.Contains, sQuery));
      }
      var oBinding = this.byId("productsTable").getBinding("items");
      if (oBinding) oBinding.filter(aFilters);
    },

    onAddToCart: function(oEvent) {
      var oCtx = oEvent.getSource().getBindingContext();
      var oItem = oCtx.getObject();
      var oCart = this.getOwnerComponent().getModel("cart");
      var aItems = oCart.getProperty("/items") || [];
      var existing = aItems.find(i => i.ProductID === oItem.ProductID);
      if (existing) {
        existing.Quantity = (existing.Quantity || 1) + 1;
      } else {
        aItems.push({
          ProductID: oItem.ProductID,
          ProductName: oItem.ProductName,
          Price: oItem.Price,
          CurrencyCode: oItem.CurrencyCode,
          Quantity: 1
        });
      }
      var total = aItems.reduce((sum, i) => sum + (Number(i.Price) * Number(i.Quantity)), 0);
      oCart.setProperty("/items", aItems);
      oCart.setProperty("/total", total);
      MessageToast.show("Added: " + oItem.ProductName);
    },

    onOpenCart: function() {
      var oCart = this.getOwnerComponent().getModel("cart");
      var a = oCart.getProperty("/items") || [];
      MessageToast.show(a.length + " item(s) in cart");
    },

    onCheckout: function() {
      var oCart = this.getOwnerComponent().getModel("cart");
      var aItems = oCart.getProperty("/items") || [];
      if (!aItems.length) {
        MessageToast.show("Cart is empty");
        return;
      }
      var oModel = this.getView().getModel();
      // Adjust entity set and properties to your backend
      var oPayload = {
        // Example payload — adapt to your service
        Items: aItems.map(function(i){ return {
          ProductID: i.ProductID,
          Quantity: i.Quantity
        };})
      };
      // Example endpoint; replace with your Sales Order/Cart submit set
      oModel.create("/Orders", oPayload, {
        success: function(){
          MessageToast.show("Order created");
          oCart.setProperty("/items", []);
          oCart.setProperty("/total", 0);
        },
        error: function(){
          MessageToast.show("Failed to create order (adjust entity set/fields)");
        }
      });
    }
  });
});
