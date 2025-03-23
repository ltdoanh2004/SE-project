import { DataTypes } from "sequelize";
import { sequelize } from "../DB/index.js";
import User from "./User.js";

const Admin = sequelize.define("Admin", {
  userID: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    references: {
      model: User,
      key: "userID",
    },
  },
  bankAccountNumber: {
    type: DataTypes.STRING(255),
    allowNull: true,
    validate: {
      isNumeric: true,
      len: [10, 20],
    },
  },
  bank: {
    type: DataTypes.STRING(255),
    allowNull: true,
  },
}, { timestamps: false });

User.hasOne(Admin, { foreignKey: "userID" });
Admin.belongsTo(User, { foreignKey: "userID" });

export default Admin;
