import { DataTypes } from "sequelize";
import { sequelize } from "../DB/index.js";
import Customer from "./Customer.js";

const Order = sequelize.define("Order", {
  orderID: {
    type: DataTypes.INTEGER,
    allowNull: false,
    autoIncrement: true,
    primaryKey: true,
  },
  userID: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: Customer,
      key: "userID",
    },
  },
  date: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW,
    allowNull: false,
  },
  status: {
    type: DataTypes.STRING(50),
    allowNull: false,
  },
  money: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: false,
  },
  cancel: {
    type: DataTypes.BOOLEAN,
    allowNull: false,
  },
  cancelReason: {
    type: DataTypes.STRING(100),
    allowNull: true,
  },
  coupon: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
}, { timestamps: false });

Customer.hasMany(Order, { foreignKey: "userID" });
Order.belongsTo(Customer, { foreignKey: "userID" });


export default Order;
