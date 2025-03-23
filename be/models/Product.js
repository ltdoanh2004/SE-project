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
  // phân loại trang sức
  jewelryFit: {
    type: DataTypes.ENUM('nam', 'nữ', 'trẻ em'),
    allowNull: false,
  },
  jewelryType: {
    type: DataTypes.ENUM('nhẫn', 'dây chuyền', 'bông tai', 'lắc', 'vòng'),
    allowNull: true,
  },
  material: { 
    type: DataTypes.ENUM('vàng', 'bạc', 'platinum'),
    allowNull: true,
  },
  brand: { 
    type: DataTypes.ENUM('Daniel Wellington', 'Calvin Klein', 'Michael Kors', 'Titan', 'Fossils'),
    allowNull: true,
  },
  collection: {
    type: DataTypes.ENUM(
      'Trang Sức Đính Kim Cương',
      'Trang Sức Đính ECZ',
      'Trang Sức Công Nghệ Ý',
      'Trang Sức Đính CZ',
      'Kim Cương Viên'
    ),
    allowNull: true,
  },

  price: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: false,
    defaultValue: 0, 
    validate: {
      min: 0,
    },
  },
  stockQuantity: {
    type: DataTypes.INTEGER,
    allowNull: false,
    defaultValue: 0,
    validate: {
      min: 0,
    },
  },
  productDescription: {
    type: DataTypes.TEXT,
    allowNull: true,
  },
  model3D: { 
    type: DataTypes.STRING(255),
    allowNull: true,
  },
  images: { 
    type: DataTypes.JSON,
    allowNull: true,
  },
  discount: {
    type: DataTypes.DECIMAL(5, 2),
    allowNull: false,
    defaultValue: 0,
    validate: {
      min: 0,
    },
  },
}, { timestamps: false ,
  indexes: [
    { fields: ['jewelryFit'] },
    { fields: ['jewelryType'] },
    { fields: ['material'] },
    { fields: ['brand'] },
    { fields: ['collection'] },
    { fields: ['price'] }
  ]
});

Admin.hasMany(Product, { foreignKey: "userID" });
Product.belongsTo(Admin, { foreignKey: "userID" });

export default Product;
