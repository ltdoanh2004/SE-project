import { DataTypes } from "sequelize";
import { sequelize } from "../DB/index.js";
import Order from "./Order.js";
import Product from "./Product.js";

const OrDuct = sequelize.define("OrDuct", {
  orderID: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: Order,
      key: "orderID",
    },
  },
  productID: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: Product,
      key: "productID",
    },
  },
  quantity: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  Shipped: {
    type: DataTypes.BOOLEAN,
    allowNull: false,
  },
}, { timestamps: false });

Order.hasMany(OrDuct, { foreignKey: "orderID" });
OrDuct.belongsTo(Order, { foreignKey: "orderID" });

Product.hasMany(OrDuct, { foreignKey: "productID" });
OrDuct.belongsTo(Product, { foreignKey: "productID" });

export default OrDuct;
