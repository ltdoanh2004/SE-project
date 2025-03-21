import { DataTypes, Model } from "sequelize";
import { sequelize } from "../DB/index.js";
import Admin from "./Admin.js";

const Product = sequelize.define("Product", {
  productID: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    allowNull: false,
    primaryKey: true,
  },
  userID: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: Admin,
      key: "userID",
    },
  },
  date: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW,
    allowNull: false,
  },
  name: {
    type: DataTypes.STRING(255),
    allowNull: false,
  },
  type: {
    type: DataTypes.JSON,
    allowNull: false,
  },
  price: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: false,
    validate: {
      min: 0,
    },
  },
  stockQuantity: {
    type: DataTypes.INTEGER,
    allowNull: false,
    validate: {
      min: 0,
    },
  },
  info: {
    type: DataTypes.TEXT,
    allowNull: true,
  },
  model3D: {
    type: DataTypes.VARCHAR(255),
    allowNull: true,
  },
  image: {
    type: DataTypes.BLOB("long"),
    allowNull: false,
  },
  discount: {
    type: DataTypes.DECIMAL(5, 2),
    allowNull: false,
    validate: {
      min: 0,
    },
  },
}, { timestamps: false });

Admin.hasMany(Product, { foreignKey: "userID" });
Product.belongsTo(Admin, { foreignKey: "userID" });

export default Product;
