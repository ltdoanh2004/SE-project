
import img1 from '../../assets/image/img1.png'
import { TradingDetail } from './TradingDetail'
import CommentSection from './CommentSection';


const product = {
	id: 1,
	img: img1,
	name: 'Name of product',
	size: ['sm', 'm', 'lg'],
	price: 1_000_000,
	detailInfomation:
		'Nằm trong danh sách những hồ vĩ đại nhất Châu Á, Khanka cung cấp giá trị đặc biệt về cả mặt sinh thái, môi trường và lịch sử. Nơi đây cũng là một phần của ‘Con đường di cư của sếu’ và một điểm quan trọng trong các chương trình nghiên cứu sinh thái và bảo tồn động vật hoang dã.Cùng tên với địa điểm này, khuyên tại Khanka được chế tác với dấu ấn Lotus đặc trưng. Khanka, cùng với các chế tác khác trong BST Lotus mang trong mình câu chuyện và vẻ đẹp riêng biệt của từng hồ, với ý nghĩa thiết kế Lotus xuất hiện ở khắp nơi.Khi được trao đến tay khách hàng, sản phẩm mang sứ mệnh kể tiếp câu chuyện cùng chủ nhân của nó. Vậy, câu chuyện của bạn là gì?',
}
export const ProductDetail = () => {
    return (
			<div className="mt-20 mb-20">
				<TradingDetail {...product} />
				<CommentSection />

			</div>
		)
}