import { DataTypes } from "sequelize";
import { sequelize } from "../DB/index.js";
import Customer from "./Customer.js";
import Product from "./Product.js";

const Cart = sequelize.define("Cart", {
  userID: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: Customer,
      key: "userID",
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
}, { timestamps: false });

Customer.hasMany(Cart, { foreignKey: "userID" });
Cart.belongsTo(Customer, { foreignKey: "userID" });

Product.hasMany(Cart, { foreignKey: "userID" });
Cart.belongsTo(Product, { foreignKey: "userID" });


export default Cart;
