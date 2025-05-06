import React from 'react'
import { Link } from 'react-router-dom';
import { FiBox, FiShoppingBag } from 'react-icons/fi'
import { MdOutlinePayment } from "react-icons/md";
import { IoReturnUpBackSharp } from "react-icons/io5";
import { CiChat1 } from "react-icons/ci";


const OrderConfirm = () => {
  return (
    <div>
      <div className='flex flex-col items-center space-y-4 justify-center my-32 mx-72 p-9 border-[2px] border-primary'>
        <FiShoppingBag className='w-8 h-8' />

     <h1 className='font-bold text-xl'>THANK YOU!</h1>

         <p className='text-center'>
         We are getting started on your order right away, and you will <br />
          receive an order confirmation shortly to <br />
           <span className='font-medium'>john.newman@gmail.com</span>. In the meantime, explore the latest <br />
           fashion and get inspired by new trends.
    </p>

    <Link
  to="/orderconfirmation"
  className="bg-primary text-black font-semibold px-6 py-2 rounded-md hover:opacity-90 transition"
>
  VIEW ORDER CONFIRMATION
</Link>

    <a href="#" className='text-sm underline text-black hover:text-secondary'>
      Read about our return policy
    </a>
  </div>

    {/* Icons Section */}
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 my-12 px-6 mx-80 md:px-0">
  <Link to="/delivery" className="flex flex-col items-center py-6 border rounded-md bg-gray-100 hover:bg-gray-200 transition cursor-pointer">
    <FiBox className="w-6 h-6 mb-2" />
    <span className="text-sm font-medium">DELIVERY</span>
  </Link>

  <Link to="/payments" className="flex flex-col items-center p-6 border rounded-md bg-gray-100 hover:bg-gray-200 transition cursor-pointer">
    <MdOutlinePayment className="w-6 h-6 mb-2" />
    <span className="text-sm font-medium">PAYMENT’S</span>
  </Link>

  <Link to="/returns" className="flex flex-col items-center p-6 border rounded-md bg-gray-100 hover:bg-gray-200 transition cursor-pointer">
    <IoReturnUpBackSharp className="w-6 h-6 mb-2" />
    <span className="text-sm font-medium">RETURNS</span>
  </Link>

  <Link to="/customer-service" className="flex flex-col items-center p-6 border rounded-md bg-gray-100 hover:bg-gray-200 transition cursor-pointer">
    <CiChat1 className="w-6 h-6 mb-2" />
    <span className="text-sm font-medium text-center">CUSTOMER SERVICE</span>
  </Link>
</div>


  </div>
  )
}

export default OrderConfirm