import { DataTypes } from "sequelize";
import { sequelize } from "../DB/index.js";
import Order from "./Order.js";
import Admin from "./Admin.js";

const Pay = sequelize.define("Pay", {
  OrderID: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: Order,
      key: "orderID",
    },
  },
  userID: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: Admin,
      key: "userID",
    },
  },
  transactionDate: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW,
    allowNull: false,
  },
  money: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: false,
  },
  isPaid: {
    type: DataTypes.BOOLEAN,
    allowNull: false,
  },
}, { timestamps: false });

Order.hasOne(Pay, { foreignKey: "orderID" });
Pay.belongsTo(Order, { foreignKey: "orderID" });

Admin.hasMany(Pay, { foreignKey: "userID" });
Pay.belongsTo(Admin, { foreignKey: "userID" });

export default Payment;
