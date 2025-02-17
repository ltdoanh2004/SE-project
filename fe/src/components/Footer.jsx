import { FaMapMarkerAlt, FaPhoneAlt, FaEnvelope, FaBusinessTime } from 'react-icons/fa'

export default function Footer() {
	return (
		<div className="bg-gray-900 text-gray-300 p-4">
			<div className="text-center">
				<div>
					<h3 className="text-lg font-bold mb-3">CONTACT INFO</h3>
                    <div className="flex justify-center items-start">
                        <ul className="space-y-3 mr-4"> 
                            <li>
                                <FaMapMarkerAlt className="inline text-amber-500 mr-2" />
                                Ho Chi Minh City, Vietnam
                            </li>
                            <li>
                                <FaPhoneAlt className="inline text-amber-500 mr-2" />
                                (VN) +84 91 612 3933
                            </li>
                        </ul>
                        <ul className="space-y-3">
                            <li>
                                <FaEnvelope className="inline text-amber-500 mr-2" />
                                jeify2024@gmail.com
                            </li>
                            <li>
                                <FaBusinessTime className="inline text-amber-500 mr-2" />
                                Thời gian: 08g00 - 22g00
                            </li>
                        </ul>
                    </div>
				</div>
			</div>
		</div>
	)
}
