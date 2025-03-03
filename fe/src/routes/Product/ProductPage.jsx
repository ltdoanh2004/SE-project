import React, { useState } from "react";
import RingImage from "../../assets/image/NhanVang.png";


const ProductPage = () => {
  const [quantity, setQuantity] = useState(1);
  const [selectedSize, setSelectedSize] = useState(null);

  const handleIncrease = () => setQuantity(quantity + 1);
  const handleDecrease = () => {
    if (quantity > 1) setQuantity(quantity - 1);
  };

  return (
    <div className="w-full max-w-screen-xl mx-auto p-6">

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Hình ảnh sản phẩm */}
        <div className="w-full h-80 flex items-center justify-center">
  <img src={RingImage} alt="Chiếc nhẫn vàng" className="w-full h-full object-contain" />
</div>



        {/* Thông tin sản phẩm */}
        <div>
          <p className="text-sm text-gray-500">Jeify Jewelry</p>
          <h1 className="text-2xl font-bold mt-1">Nhẫn Vàng 18k</h1>

          {/* Chọn size */}
          <div className="mt-4">
  <span className="text-gray-600">Size:</span>
  <div className="flex space-x-2 mt-2">
    {[5, 6, 7, 8, 9].map((size) => (
      <button
        key={size}
        onClick={() => setSelectedSize(size)}
        className={`px-4 py-2 border rounded-md ${
          selectedSize === size
            ? "text-white"
            : "bg-gray-100 text-gray-700"
        }`}
        style={{
          backgroundColor: selectedSize === size ? "rgba(242, 219, 169, 1)" : "",
          color: selectedSize === size ? "#000" : "",
        }}
      >
        {size}
      </button>
    ))}
  </div>
</div>


          {/* Giá sản phẩm */}
          <div className="text-xl font-semibold mt-4">
  <span className="text-gray-500 line-through mr-2">9.700.000 VND</span>
  <span className="text-red-600 font-bold">8.500.000 VND</span>
</div>


          {/* Tăng giảm số lượng */}
          <div className="flex items-center space-x-4 mt-4">
            <button
              onClick={handleDecrease}
              className="px-3 py-1 border rounded-md"
            >
              -
            </button>
            <span>{quantity}</span>
            <button
              onClick={handleIncrease}
              className="px-3 py-1 border rounded-md"
            >
              +
            </button>
          </div>

          {/* Nút mua hàng */}
          <div className="mt-4">
            <button className="w-full bg-gray-200 py-2 rounded-md font-semibold">
              Thêm vào giỏ hàng
            </button>
            <button className="w-full text-white py-2 rounded-md font-semibold mt-2" 
            style={{ backgroundColor: "rgba(242, 219, 169, 1)", color: "#000" }}>
              Mua ngay
            </button>
          </div>
        </div>
      </div>

      {/* Mô tả sản phẩm */}
      <div className="mt-10 border-t-2 border-black pt-6">
        <h2 className="text-xl font-semibold">Mô tả sản phẩm</h2>
        <p className="text-gray-700 mt-2">
        Trọng lượng tham khảo: 7.94571 phân <br />
        Loại đá chính: Xoàn mỹ <br />
        Kích thước đá chính (tham khảo): 3.0 <br />
        Loại đá phụ: Không gắn đá <br />
        Số viên đá chính: 6 <br />
        Giới tính: Nữ <br />
        Thương hiệu: Jeify
        </p>

        {/* Hướng dẫn chọn size */}
        {/* Hướng dẫn chọn size */}
<div className="mt-4">
  <h3 className="font-semibold text-lg">Hướng dẫn chọn size:</h3>

  {/* Bảng size nhẫn */}
  <div className="mt-2 overflow-x-auto">
    <table className="w-full border-collapse border border-gray-600 text-left text-white bg-gray-800">
      <thead>
        <tr className="bg-gray-900">
          <th className="border border-gray-600 px-4 py-2">Chu vi ngón tay (mm)</th>
          <th className="border border-gray-600 px-4 py-2">Size nhẫn</th>
        </tr>
      </thead>
      <tbody>
        <tr>
          <td className="border border-gray-600 px-4 py-2">44 - 46</td>
          <td className="border border-gray-600 px-4 py-2">Size 5</td>
        </tr>
        <tr>
          <td className="border border-gray-600 px-4 py-2">47 - 49</td>
          <td className="border border-gray-600 px-4 py-2">Size 6</td>
        </tr>
        <tr>
          <td className="border border-gray-600 px-4 py-2">50 - 52</td>
          <td className="border border-gray-600 px-4 py-2">Size 7</td>
        </tr>
        <tr>
          <td className="border border-gray-600 px-4 py-2">53 - 55</td>
          <td className="border border-gray-600 px-4 py-2">Size 8</td>
        </tr>
        <tr>
          <td className="border border-gray-600 px-4 py-2">56 - 58</td>
          <td className="border border-gray-600 px-4 py-2">Size 9</td>
        </tr>
      </tbody>
    </table>
  </div>
</div>

      </div>
    </div>
  );
};

export default ProductPage;
