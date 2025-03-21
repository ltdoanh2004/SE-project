import { DataTypes } from "sequelize";
import { sequelize } from "../DB/index.js";
import Customer from "./Customer.js";
import Product from "./Product.js";

const Review = sequelize.define("Review", {
  reviewID: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },
  userId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: Customer,
      key: "userID",
    },
  },
  productId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: Product,
      key: "productID",
    },
  },
  comment: {
    type: DataTypes.TEXT,
    allowNull: true,
  },
  star: {
    type: DataTypes.INTEGER,
    allowNull: false,
    validate: {
      min: 1,
      max: 5,
    },
  },
}, { timestamps: false });

Customer.hasMany(Review, { foreignKey: "userId" });
Review.belongsTo(Customer, { foreignKey: "userId" });

Product.hasMany(Review, { foreignKey: "productId" });
Review.belongsTo(Product, { foreignKey: "productId" });

export default Review;
