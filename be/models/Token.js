import { DataTypes } from "sequelize";
import { sequelize } from "../DB/index.js";

const Token = sequelize.define("Token", {
  tokenID: {
    type: DataTypes.INTEGER,
    allowNull: false,
    autoIncrement: true,
    primaryKey: true,
  },
  token: {
    type: DataTypes.STRING(255),
    allowNull: false,
    unique: true,
  },
}, { timestamps: false });

export default Token;
