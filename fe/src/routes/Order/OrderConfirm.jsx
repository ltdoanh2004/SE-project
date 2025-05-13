import React from 'react'
import { Link } from 'react-router-dom';
import { FiBox, FiShoppingBag } from 'react-icons/fi'
import { MdOutlinePayment } from "react-icons/md";
import { IoReturnUpBackSharp } from "react-icons/io5";
import { CiChat1 } from "react-icons/ci";


const OrderConfirm = () => {
  return (
    <div>
      <div className='flex flex-col items-center space-y-4 justify-center my-32 mx-72 min-h-[60vh] p-9 border-[2px] border-primary'>
        <FiShoppingBag className='w-8 h-8' />

     <h1 className='font-bold text-xl'>XIN CHÂN THÀNH CẢM ƠN</h1>

         <p className='text-center'>
  Chúng tôi sẽ bắt đầu xử lý đơn hàng của bạn ngay lập tức và bạn sẽ <br />
  nhận được xác nhận đơn hàng sớm tại <br />
  <span className='font-medium'> </span>. Trong lúc chờ đợi, hãy khám phá <br />
  những xu hướng thời trang mới nhất và tìm cảm hứng cho mình.
</p>

    <Link
  to="/orders"
  className="bg-primary text-black font-semibold px-6 py-2 rounded-md hover:opacity-90 transition"
>
  Xem đơn hàng của bạn  
</Link>

    
  </div>

    {/* Icons Section */}
    {/* <div className="grid grid-cols-2 md:grid-cols-4 gap-4 my-12 px-6 mx-80 md:px-0">
  <Link to="/delivery" className="flex flex-col items-center py-6 border rounded-md bg-gray-100 hover:bg-gray-200 transition cursor-pointer">
    <FiBox className="w-6 h-6 mb-2" />
    <span className="text-sm font-medium">DELIVERY</span>
  </Link>

  <Link to="/payments" className="flex flex-col items-center p-6 border rounded-md bg-gray-100 hover:bg-gray-200 transition cursor-pointer">
    <MdOutlinePayment className="w-6 h-6 mb-2" />
    <span className="text-sm font-medium">PAYMENT’S</span>
  </Link>

  <Link to="/" className="flex flex-col items-center p-6 border rounded-md bg-gray-100 hover:bg-gray-200 transition cursor-pointer">
    <IoReturnUpBackSharp className="w-6 h-6 mb-2" />
    <span className="text-sm font-medium">RETURNS</span>
  </Link>

  <Link to="/customer-service" className="flex flex-col items-center p-6 border rounded-md bg-gray-100 hover:bg-gray-200 transition cursor-pointer">
    <CiChat1 className="w-6 h-6 mb-2" />
    <span className="text-sm font-medium text-center">CUSTOMER SERVICE</span>
  </Link>
</div> */}


  </div>
  )
}

export default OrderConfirm