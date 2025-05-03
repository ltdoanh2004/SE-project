import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useDispatch } from 'react-redux';
import { addToCart } from '../../redux/actions/cartActions';
import CommentSection from '../ProductDetail/CommentSection'; // ✅ Thêm dòng này

const ProductPage = () => {
  const [product, setProduct] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const [selectedSize, setSelectedSize] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const location = useLocation();
  const pathSegments = location.pathname.split('/').filter(Boolean);
  const productId = pathSegments[pathSegments.length - 1];
  const dispatch = useDispatch();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        setLoading(true);
        const response = await axios.get(`http://localhost:8000/api/product/${productId}`);
        setProduct(response.data);
        console.log('Product data:', response.data);
        setLoading(false);
      } catch (err) {
        console.error('Error fetching product:', err);
        setError('Không tìm thấy sản phẩm.');
        setLoading(false);
      }
    };

    fetchProduct();
  }, [productId]);

  const handleIncrease = () => setQuantity((prev) => prev + 1);
  const handleDecrease = () => {
    if (quantity > 1) setQuantity((prev) => prev - 1);
  };

  if (loading) return <div className="text-center py-10">Đang tải sản phẩm...</div>;
  if (error) return <div className="text-center py-10 text-red-500">{error}</div>;
  if (!product) return null;

  const formattedPrice = Number(product.price).toLocaleString('vi-VN');

  const handleAddToCart = () => {
    const { id, image, name, price } = product;
    for (let i = 1; i <= quantity; i++) {
      dispatch(addToCart({ id, image, name, price }));
    }
    navigate('/cart');
  };

  const handleBuyNow = () => {
    const { id, image, name, price } = product;
    for (let i = 1; i <= quantity; i++) {
      dispatch(addToCart({ id, image, name, price }));
    }
    navigate('/checkout', { state: { product } });
  };

  return (
    <div className="w-full max-w-screen-xl mx-auto p-6 min-h-screen">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Hình ảnh sản phẩm */}
        <div className="w-full h-[600px] flex items-center justify-center bg-gray-100">
          <img
            src={
              Array.isArray(product.image)
                ? `http://localhost:8000${product.image[0]}`
                : ''
            }
            alt={product.name}
            className="w-full h-full object-contain"
          />
        </div>

        {/* Thông tin sản phẩm */}
        <div>
          <p className="text-sm text-gray-500">Jeify Jewelry</p>
          <h1 className="text-2xl font-bold mt-1">{product.name}</h1>

          {/* Chọn size */}
          <div className="mt-6">
            <span className="px-6 py-3 w-20 h-8 flex items-center justify-center bg-[rgba(242,219,169,1)] text-black rounded-full">
              Size
            </span>

            <div className="flex space-x-2 mt-4">
              {[5, 6, 7, 8, 9].map((size) => (
                <button
                  key={size}
                  onClick={() => setSelectedSize(size)}
                  className={`px-8 py-0 border rounded-3xl ${
                    selectedSize === size
                      ? 'bg-[rgba(242,219,169,1)] text-black'
                      : 'bg-gray-100 text-gray-700'
                  }`}
                >
                  {size}
                </button>
              ))}
            </div>
          </div>

          {/* Giá sản phẩm */}
          <p className="text-2xl font-semibold mt-10">{formattedPrice} VND</p>

          <div className="mt-10">
            <div className="flex items-center justify-between">
              {/* Tăng giảm số lượng */}
              <div className="flex items-center justify-between rounded-lg space-x-4 w-36 border-2">
                <button onClick={handleDecrease} className="px-3 py-1">
                  -
                </button>
                <span>{quantity}</span>
                <button onClick={handleIncrease} className="px-3 py-1">
                  +
                </button>
              </div>
              {/* Nút mua hàng */}
              <button
                className="w-[70%] bg-gray-300 opacity-90 hover:opacity-100 py-2 rounded-md"
                onClick={handleAddToCart}
              >
                Thêm vào giỏ hàng
              </button>
            </div>
            <button
              className="w-full text-white py-2 rounded-md mt-4 hover:!bg-secondary hover:!text-white"
              style={{
                backgroundColor: 'rgba(242, 219, 169, 1)',
                color: '#000',
              }}
              onClick={handleBuyNow}
            >
              Mua ngay
            </button>
          </div>

          <hr className="h-1 w-full bg-black opacity-40 rounded-full mt-6" />
          <div className="pt-6 text-lg font-bold">Thông tin sản phẩm</div>
          <div className="overflow-hidden w-full h-40 mt-2">
            {product.productDescription}
          </div>
        </div>
      </div>

      {/* Mô tả sản phẩm */}
      <div className="mt-10 border-t-2 border-black pt-6">
        <h2 className="text-xl font-semibold">Mô tả sản phẩm</h2>
        <p className="text-gray-700 mt-2">
          <strong>Thương hiệu:</strong> {product.brand} <br />
          <strong>Chất liệu:</strong> {product.material} <br />
          <strong>Loại trang sức:</strong> {product.jewelryType} <br />
          <strong>Đối tượng:</strong> {product.jewelryFit} <br />
          <strong>Bộ sưu tập:</strong> {product.collection}
        </p>
      </div>

      {/* ✅ Comment Section mới thêm */}
      <CommentSection />
    </div>
  );
};

export default ProductPage;
