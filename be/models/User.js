import { DataTypes } from "sequelize";
import { sequelize } from "../DB/index.js";
import bcrypt from "bcrypt";

const User = sequelize.define("User", {
  userID: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    allowNull: false,
    primaryKey: true,
  },
  userName: {
    type: DataTypes.STRING(255),
    allowNull: false,
  },
  email: {
    type: DataTypes.STRING(255),
    allowNull: false,
    unique: true,
  },
  password: {
    type: DataTypes.STRING(255),
    allowNull: false,
    set(value) {
      const salt = bcrypt.genSaltSync(10);
      this.setDataValue("password", bcrypt.hashSync(value, salt));
    },
  },
  role: {
    type: DataTypes.STRING(20),
    allowNull: false,
    validate: {
      isIn: [["admin", "customer"]],
    },
  },
  phoneNumber: {
    type: DataTypes.STRING(20),
    allowNull: true,
    validate: {
      is: /^[0-9]+$/,
      len: [10, 15],
    },
  },
  date: {
    type: DataTypes.DATE,
    allowNull: false,
    defaultValue: DataTypes.NOW,
  },
}, { timestamps: false });

export default User;
