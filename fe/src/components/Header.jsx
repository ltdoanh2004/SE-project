import { useContext, useState } from 'react'
import Logo from '../assets/logo.png'
import NavLinks from '../components/Navbar/NavLinks'
import { Link } from 'react-router-dom'
import avatar from '../assets/image/banner2.png'
import { Drawer } from 'vaul'

import {
	CiMenuBurger,
	CiMenuFries,
	CiShoppingCart,
	CiUser,
} from 'react-icons/ci'
import { Search, ShoppingCart, MessageCircle } from 'lucide-react'
import { AuthProvider, UserPublicInfoProvider } from './provider/provider'
import {CookieService} from '../utils/CookieService'

const UserItem = [
	{ icon: <CiUser className="inline-block" />, path: '/account' },
	{ icon: <CiShoppingCart className="inline-block" />, path: '/cart' },
]

const Header = () => {
	const [open, setOpen] = useState(false)
	const { isAuth, SetIsAuth } = useContext(AuthProvider)
	const userName = localStorage.getItem('userName')
	const handleLogOut = () => {
		CookieService.removeCookie('token')
		localStorage.removeItem('userName')
		window.location.reload()
	}

	// Function to open chat
	const openChat = () => {
		// Create and dispatch a custom event to trigger chat opening
		const chatEvent = new CustomEvent('openJeifyChat', { 
			detail: { source: 'header' } 
		});
		document.dispatchEvent(chatEvent);
	}

	return (
		<nav className="bg-primary text-black w-full h-20 px-4">
			<div className="flex justify-between items-center 2xl:justify-center 2xl:gap-40">
				<div className="flex items-center justify-center">
					<Link
						to="/"
						className="flex items-center text-primary justify-between space-x-4 md:text-white"
					>
						<img
							src={Logo}
							alt="logo"
							className="md:cursor-pointer h-9 w-9 md:h-10 md:w-10 filter"
						/>
						<span className="uppercase text-xl text-black">JEIFY JEWELRY</span>
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
				<ul className="flex items-center gap-6 font-sans uppercase">
					<NavLinks />

					{isAuth ? (
						<div className="flex items-center justify-center gap-4">
							<Drawer.Root direction="right">
								<Drawer.Trigger>
									<span className="text-sm normal-case">
										Xin chào, {userName}
									</span>
								</Drawer.Trigger>
								<Drawer.Portal>
									<Drawer.Overlay className="fixed inset-0 bg-black/40" />
									<Drawer.Content className="bg-gray-100 h-full fixed w-128 right-0 bottom-0 outline-none">
										<div className="p-12 flex flex-col">
											<span className="text-center text-xl">
												Xin chào, {userName}
											</span>
											<div className="my-6 flex flex-col">
												<Link
													to={'/orders'}
													className="hover:border-[1px] hover:shadow-sm px-4 py-2 hover:bg-primary hover:rounded-lg border-b-2"
												>
													Đơn Hàng
												</Link>
												<button
													onClick={openChat}
													className="text-left hover:border-[1px] hover:shadow-sm px-4 py-2 hover:bg-primary hover:rounded-lg border-b-2"
												>
													Chat
												</button>
												<Link
													to={'/changePassword'}
													className="hover:border-[1px] hover:shadow-sm px-4 py-2 hover:bg-primary hover:rounded-lg border-b-2"
												>
													Đổi Mật Khẩu
												</Link>

												<button
													onClick={(e) => {
														e.preventDefault()
														handleLogOut()
													}}
													className="hover:border-[1px] text-left hover:shadow-sm px-4 py-2 hover:bg-primary hover:rounded-lg border-b-2"
												>
													Đăng Xuất
												</button>
											</div>
										</div>
									</Drawer.Content>
								</Drawer.Portal>
							</Drawer.Root>
							<Search className="hover:cursor-pointer" />
							<Link to={'/cart'} className="hover:cursor-pointer">
								<ShoppingCart />
							</Link>
						</div>
					) : (
						<li className="py-3 flex gap-2">
							<Link
								to="/login"
								className="bg-white text-primary font-bold text-lg py-2 px-4 rounded"
							>
								Log in
							</Link>
							<button
								onClick={openChat}
								className="bg-white text-primary font-bold text-lg py-2 px-4 rounded flex items-center gap-2"
							>
								<MessageCircle size={18} />
								Chat
							</button>
						</li>
					)}
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
