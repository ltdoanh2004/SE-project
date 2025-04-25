import { DataTypes } from "sequelize";
import { sequelize } from "../DB/index.js";
import User from "./User.js";

const Customer = sequelize.define("Customer", {
  userID: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    references: {
      model: User,
      key: "userID",
    },
  },
  address: {
    type: DataTypes.STRING(255),
    allowNull: true,
  },
}, { timestamps: false });

User.hasOne(Customer, { foreignKey: "userID" });
Customer.belongsTo(User, { foreignKey: "userID" });

export default Customer;
