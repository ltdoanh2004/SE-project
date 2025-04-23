import { DataTypes } from "sequelize";
import { sequelize } from "../DB/index.js";
import Order from "./Order.js";

const Pay = sequelize.define("Pay", {
  payID: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },
  orderID: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: Order,
      key: "orderID",
    },
  },
  payDate: {
    type: DataTypes.DATE,
    allowNull: true,
  },
  payType: {
    type: DataTypes.STRING(20),
    allowNull: false,
    validate: {
      isIn: [["cash", "bank-transfer"]],
    },
  },
  money: {
    type: DataTypes.DECIMAL(12, 0),
    allowNull: false,
  },
  isPaid: {
    type: DataTypes.BOOLEAN,
    allowNull: false,
  },
  // transactionType: {
  //   type: DataTypes.STRING(20),
  //   allowNull: true,
  //   validate: {
  //     isIn: [["Momo"]],
  //   },
  // },
  // transactionID: {
  //   type: DataTypes.STRING(100),
  //   allowNull: true,
  // },
}, { timestamps: false });

Order.hasOne(Pay, { foreignKey: "orderID" });
Pay.belongsTo(Order, { foreignKey: "orderID" });

export default Pay;
