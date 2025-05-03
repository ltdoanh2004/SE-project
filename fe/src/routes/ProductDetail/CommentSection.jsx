import React, { useEffect, useState } from 'react'
import { FaReply, FaThumbsUp, FaStar } from 'react-icons/fa'
import anonymousAvatar from '../../assets/image/avatar.png'
import { UserCommentService } from '../../services/user/comment/UserCommentServices'
import { set } from 'react-hook-form'

// Star Rating component
const StarRating = ({ rating, setRating }) => {
	const [hover, setHover] = useState(null)

	return (
		<div className="flex">
			{[...Array(5)].map((_, index) => {
				const ratingValue = index + 1
				return (
					<FaStar
						key={index}
						className="cursor-pointer"
						size={24}
						color={ratingValue <= (hover || rating) ? '#ffc107' : '#e4e5e9'}
						onClick={() => setRating(ratingValue)}
						onMouseEnter={() => setHover(ratingValue)}
						onMouseLeave={() => setHover(null)}
					/>
				)
			})}
			{rating > 0 && (
				<span className="ml-2 text-gray-700">
					{rating} star{rating !== 1 ? 's' : ''}
				</span>
			)}
		</div>
	)
}

const CommentItem = ({ name, time, comment, imgUrl, rating }) => {
	return (
		<div className="w-full pb-6 border-b border-gray-300 flex items-start gap-3.5">
			<img
				className="w-10 h-10 rounded-full object-cover"
				src={imgUrl || anonymousAvatar}
				alt={name}
			/>
			<div className="flex flex-col w-full gap-3.5">
				<div className="flex flex-col gap-1">
					<div className="flex justify-between items-center">
						<h5 className="text-gray-900 text-sm font-semibold">{name}</h5>
						<span className="text-gray-500 text-xs">{time}</span>
					</div>
					{/* Display the rating */}
					{rating > 0 && (
						<div className="flex py-1">
							{[...Array(5)].map((_, index) => (
								<FaStar
									key={index}
									size={16}
									color={index < rating ? '#ffc107' : '#e4e5e9'}
								/>
							))}
						</div>
					)}
					<p className="text-gray-800 text-sm">{comment}</p>
				</div>

				{/* Nút Trả lời và Thích */}
				<div className="flex items-center gap-6 text-gray-500 text-sm font-medium">
					<button className="flex items-center gap-1 hover:text-[rgba(242,219,169,1)] transition-all duration-200 ease-in-out">
						<FaReply className="text-base" />
						Trả lời
					</button>
					<button className="flex items-center gap-1 hover:text-[rgba(242,219,169,1)] transition-all duration-200 ease-in-out">
						<FaThumbsUp className="text-base" />
						Thích
					</button>
				</div>
			</div>
		</div>
	)
}

const CommentSection = ({ productId }) => {
	const [commentInput, setCommentInput] = useState('')
	const [userRating, setUserRating] = useState(0)
	const [comments, setComments] = useState([])

	useEffect(() => {
		;(async () => {
			try {
				const response = await UserCommentService.getComments(productId)
        console.log(response)
				setComments(response.reviews)
			} catch (error) {
        setComments([])
				console.error('Error fetching comments:', error)
			}
		})()
	}, [])

	const handlePostComment = async () => {
		if (!commentInput.trim() || userRating === 0) return

		const newComment = {
			content: commentInput.trim(),
			stars: userRating,
		}

		await UserCommentService.postComment(productId, { ...newComment })
			.then((res) => {
				console.log(res)
			})
			.then(() => {
				setComments([newComment, ...comments])
				setCommentInput('')
				setUserRating(0)
			})
			.catch((err) => {
				console.log(err)
			})
	}

	return (
		<section className="py-24 relative">
			<div className="w-full max-w-7xl px-4 md:px-5 lg:px-5 mx-auto">
				<div className="w-full flex flex-col gap-14">
					<h2 className="text-gray-900 text-4xl font-bold">Comments</h2>

					{/* Form nhập comment */}
					<div className="w-full flex flex-col gap-5">
						<div className="w-full flex gap-3.5 flex-col">
							<div className="flex items-center gap-3.5">
								<img
									className="w-10 h-10 rounded-full object-cover"
									src={anonymousAvatar}
									alt="User Avatar"
								/>
								<div>
									<p className="text-gray-700 font-medium mb-1">
										Rate this product
									</p>
									<StarRating rating={userRating} setRating={setUserRating} />
								</div>
							</div>

							<textarea
								rows="5"
								value={commentInput}
								onChange={(e) => setCommentInput(e.target.value)}
								onKeyDown={(e) => {
									if (e.key === 'Enter' && !e.shiftKey) {
										e.preventDefault()
										handlePostComment()
									}
								}}
								className="w-full px-5 py-3 rounded-2xl border border-gray-300 shadow resize-none focus:outline-none placeholder-gray-400 text-gray-900 text-lg"
								placeholder="Write your thoughts here..."
							></textarea>
						</div>
						<button
							onClick={handlePostComment}
							disabled={userRating === 0}
							className={`self-start px-5 py-2.5 bg-[rgba(242,219,169,1)] ${
								userRating === 0
									? 'opacity-50 cursor-not-allowed'
									: 'hover:opacity-90 cursor-pointer'
							} transition-all rounded-xl text-black font-semibold`}
						>
							{userRating === 0
								? 'Please rate before posting'
								: 'Post your comment'}
						</button>
					</div>

					{/* Danh sách comments */}
					<div className="w-full flex flex-col gap-8">
						{comments.map((comment, index) => (
							<CommentItem
								key={index}
								name={comment.name}
								time={comment.time}
								comment={comment.comment}
								imgUrl={comment.imgUrl}
								rating={comment.star}
							/>
						))}
					</div>
				</div>
			</div>
		</section>
	)
}

export default CommentSection
