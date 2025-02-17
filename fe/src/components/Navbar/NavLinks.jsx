import { useState } from 'react'
import { Link } from 'react-router-dom'
import { links } from './Mylinks'

import { FaChevronDown, FaChevronUp } from 'react-icons/fa'

const NavLinks = () => {
	const [heading, setHeading] = useState('')
	const [subHeading, setSubHeading] = useState('')
	return (
		<>
			{links.map((link, index) => (
				<div key={index}>
					<div className="px-3 text-left md:cursor-pointer group">
						<h1
							className="py-7 flex justify-between items-center md:pr-0 pr-5 group relative"
							onClick={() => {
								heading !== link.name ? setHeading(link.name) : setHeading('')
								setSubHeading('')
							}}
						>
							{link.name}
							<span className="text-md md:hidden inline">
								{heading === link.name ? <FaChevronUp /> : <FaChevronDown />}
							</span>
							{/* <span className="text-xs md:mt-1 md:ml-2 md:inline-block hidden">
								<FaChevronDown className="transition-transform duration-200 ease-in-out transform group-hover:rotate-180" />
							</span> */}
							<FaChevronDown className="text-xs md:ml-2 md:inline-block hidden transition-transform duration-200 ease-in-out transform group-hover:rotate-180" />
						</h1>

						{link.submenu && (
							<div>
								<div className="absolute w-full left-0 hidden group-hover:md:block hover:md:block z-10">
									<div className="bg-white p-5 grid grid-cols-5 gap-10">
										{link.sublinks.map((mysublinks) => (
											<div key={mysublinks.Head}>
												<h1 className="text-md font-semibold text-black">
													{mysublinks.Head}
												</h1>
												{mysublinks.sublink.map((slink) => (
													<li
														key={slink.link}
														className="text-sm text-gray-600 my-2.5"
													>
														<Link
															to={slink.link}
															className="hover:text-primary"
														>
															{slink.name}
														</Link>
													</li>
												))}
											</div>
										))}
									</div>
								</div>
							</div>
						)}
					</div>
					{/* Mobile menus */}
					<div
						className={`
							${heading === link.name ? 'md:hidden' : 'hidden'}
						`}
					>
						{/* sublinks */}
						{link.sublinks.map((slinks) => (
							<div key={slinks.link}>
								<div className="flex items-center">
									<h1
										onClick={() =>
											subHeading !== slinks.Head
												? setSubHeading(slinks.Head)
												: setSubHeading('')
										}
										className="py-4 pl-7 font-semibold md:pr-0 pr-5 flex justify-between items-center md:pr-0 pr-5"
									>
										{slinks.Head}
										<span className="md:mt-1 md:ml-2 inline mx-2 text-sm">
											{subHeading === slinks.Head ? (
												<FaChevronUp />
											) : (
												<FaChevronDown />
											)}
										</span>
									</h1>
									<div
										className={`${
											subHeading === slinks.Head ? 'md:hidden' : 'hidden'
										}`}
									>
										{slinks.sublink.map((slink) => (
											<li key={slink.link} className="py-3 pl-14">
												<Link to={slink.link}>{slink.name}</Link>
											</li>
										))}
									</div>
								</div>
							</div>
						))}
					</div>
				</div>
			))}
		</>
	)
}

export default NavLinks
