import { useState } from 'react'
import Logo from '../assets/logo.png'
import NavLinks from '../components/Navbar/NavLinks'
import { Link } from 'react-router-dom'

import {
	CiMenuBurger,
	CiMenuFries,
	CiShoppingCart,
	CiUser,
} from 'react-icons/ci'

const UserItem = [
	{ icon: <CiUser className="inline-block" />, path: '/account' },
	{ icon: <CiShoppingCart className="inline-block" />, path: '/cart' },
]

const Header = () => {
	const [open, setOpen] = useState(false)
	return (
		<nav className="bg-primary text-white ">
			<div className="container mx-auto flex justify-between items-center">
				<div className="flex items-center justify-center">
					<Link
						to="/"
						className="flex items-center text-primary justify-between space-x-4 md:text-white"
					>
						<img
							src={Logo}
							alt="logo"
							className="md:cursor-pointer h-9 w-9 md:h-10 md:w-10 filter invert"
						/>
						<span className="uppercase text-xl">JEIFY JEWELRY</span>
					</Link>
				</div>
				<div className="z-50 p-5 md:w-auto flex justify-between">
					<button
						className="text-3xl md:hidden transform transition duration-200 ease-in-out"
						onClick={() => setOpen(!open)}
					>
						{open ? (
							<CiMenuFries className="text-primary rotate-180" />
						) : (
							<CiMenuBurger className="rotate-0" />
						)}
					</button>
				</div>
				<ul className="flex items-center gap-8 font-sans uppercase">
					<NavLinks />
					<li className="py-3">
						<Link
							to="/jewelry"
							className="bg-white text-primary font-bold text-lg py-2 px-4 rounded"
						>
							Custom
						</Link>
					</li>
					<li className="py-3">
						<a
							href="https://jeifypro.netlify.app/"
							target="_blank"
							rel="noopener noreferrer"
							className="bg-white text-primary font-bold text-lg py-2 px-4 rounded"
						>
							Chat
						</a>
					</li>
				</ul>

				{/* <ul className="md:flex hidden items-center justify-center space-x-4">
					{UserItem.map((item, index) => (
						<li key={index}>
							<Link to={item.path}>
								<div className="text-2xl">{item.icon}</div>
							</Link>
						</li>
					))}
				</ul> */}
				{/* Mobile nav */}
				<ul
					className={`
					md:hidden bg-white text-primary  fixed w-full top-0 overflow-y-auto bottom-0 py-24 pl-4
					duration-500 ${open ? 'left-0' : 'left-[-100%]'}
					`}
				>
					<NavLinks />
				</ul>
			</div>
		</nav>
	)
}

export default Header
