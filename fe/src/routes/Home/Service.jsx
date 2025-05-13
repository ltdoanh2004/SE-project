import Transition from '../../utils/Transition'; // Ensure this import path is correct

export default function Service() {
    return (
        <Transition className="flex items-center justify-center flex-col">
            <div className="container mx-auto px-4 py-8">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    <div className="flex flex-col items-center justify-center bg-pink-100 rounded-lg p-6">
                        <h4 className="text-pink-600 font-bold mb-2">Trang sức nữ</h4>
                        <p className="text-gray-500 mb-4">3000+ sản phẩm</p>
                        <button className="bg-black text-white py-2 px-6 rounded transition duration-300 ease-in-out hover:bg-gray-700 focus:outline-none">Shop Now</button>
                    </div>
                    <div className="flex flex-col items-center justify-center bg-teal-100 rounded-lg p-6">
                        <h4 className="text-teal-600 font-bold mb-2">Trang sức nam</h4>
                        <p className="text-gray-500 mb-4">4000+ sản phẩm</p>
                        <button className="bg-black text-white py-2 px-6 rounded transition duration-300 ease-in-out hover:bg-gray-700 focus:outline-none">Shop Now</button>
                    </div>
                    <div className="flex flex-col items-center justify-center bg-orange-100 rounded-lg p-6">
                        <h4 className="text-orange-600 font-bold mb-2">Trang sức trẻ em</h4>
                        <p className="text-gray-500 mb-4">302+ sản phẩm</p>
                        <button className="bg-black text-white py-2 px-6 rounded transition duration-300 ease-in-out hover:bg-gray-700 focus:outline-none">Shop Now</button>
                    </div>
                </div>
            </div>
        </Transition>
    );
}
