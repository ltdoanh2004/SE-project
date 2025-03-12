import { Plus, Minus } from 'lucide-react'
import { useState } from 'react'
export const TradingDetail = (product) => {
	const { id, img, name, size, price, detailInfomation } = product
	const [numOfProduct, setNumOfProduct] = useState(1)
	return (
		<div className="grid grid-flow-col grid-cols-2 content-center gap-10">
			<div>
				<img src={img} alt="Product img" className="w-full" />
				<div className="grid grid-flow-col mt-1 place-content-between">
					<img src={img} alt="Product img" width={140} className="" />
					<img src={img} alt="Product img" width={140} className="" />
					<img src={img} alt="Product img" width={140} className="" />
					<img src={img} alt="Product img" width={140} className="" />
					<img src={img} alt="Product img" width={140} className="" />
				</div>
			</div>
			<div className="flex flex-col items-start justify-start mt-10 gap-3">
				<h1 className="text-2xl opacity-40">Jeify Jewelry</h1>
				<div className="text-[48px] font-[500]">{name}</div>
				<div className="bg-[#f2dba9] py-2 px-8 rounded-full">size</div>
				<div className="flex gap-6 text-center my-3">
					{size.map((s, i) => {
						return <div className="border-2 w-20 rounded-full">{i + 1}</div>
					})}
				</div>
				<div className="text-[32px]">{price.toLocaleString('vi') + ' VND'}</div>
				<div className="flex gap-3 w-full">
					<div className="flex gap-16 border-2 p-2 border-black bg-[#f1f1f1] rounded-md ">
						<Plus />
						{numOfProduct}
						<Minus />
					</div>
					<div className="flex-1 w-[70%] text-center bg-[#f1f1f1] leading-[44px] rounded-md">
						Thêm vào giỏ hàng
					</div>
				</div>
				<div className="w-full text-center bg-[#f2dba9] leading-[44px] rounded-md">
					Mua ngay
				</div>
				<hr className="h-1 w-full bg-black mt-9 mb-1" />
				<div className="font-bold text-xl">Mô tả sản phẩm</div>
				<div className="h-24 w-full text-ellipsis">{detailInfomation}</div>
			</div>
		</div>
	)
}
