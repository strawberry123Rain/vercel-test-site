import { Link, NavLink, Outlet, useLocation } from 'react-router-dom'
import GlobalSearch from './GlobalSearch'
import Breadcrumbs from './common/Breadcrumbs'

interface BreadcrumbItem {
  label: string
  href?: string
}

export default function Layout() {
	const location = useLocation()
	
	const getBreadcrumbs = (): BreadcrumbItem[] => {
		const pathnames = location.pathname.split('/').filter(x => x)
		const breadcrumbs: BreadcrumbItem[] = []
		
		if (pathnames.length > 0) {
			pathnames.forEach((name, index) => {
				const routeTo = `/${pathnames.slice(0, index + 1).join('/')}`
				const isLast = index === pathnames.length - 1
				
				let label = name
				switch (name) {
					case 'cases':
						label = 'Felanmälan'
						break
					case 'tasks':
						label = 'Arbetsorder'
						break
					case 'maintenance':
						label = 'Underhåll'
						break
					case 'kanban':
						label = 'Kanban Board'
						break
					case 'profile':
						label = 'Profil'
						break
					case 'analytics':
						label = 'Analys'
						break
					default:
						label = name.charAt(0).toUpperCase() + name.slice(1)
				}
				
				breadcrumbs.push({
					label,
					href: isLast ? undefined : routeTo
				})
			})
		}
		
		return breadcrumbs
	}

	return (
		<div className="min-h-screen flex flex-col bg-[#F8F9FA]">
			<header className="sticky top-0 z-20 bg-white/90 backdrop-blur supports-[backdrop-filter]:bg-white/70 shadow-sm border-b border-gray-200">
				<div className="max-w-6xl mx-auto px-4 py-3 flex items-center gap-6">
					<Link to="/" className="flex items-center gap-3 group">
						<img 
							src="/newsec-logo.png" 
							alt="Newsec" 
							className="h-6 w-auto object-contain" 
							onError={(e) => { (e.currentTarget as HTMLImageElement).style.display = 'none' }} 
						/>
						<div className="hidden sm:block">
							<div className="text-sm text-[#6C757D] leading-none">Newsec</div>
							<div className="text-base font-semibold text-[#161C3B]">Drift</div>
						</div>
					</Link>
					<div className="flex-1 max-w-xl"><GlobalSearch /></div>
					<nav className="ml-auto flex items-center gap-5 text-sm">
						<NavLink 
							to="/" 
							className={({ isActive }) => (
								isActive 
									? 'text-[#4F6CF5] font-medium' 
									: 'text-gray-700 hover:text-gray-900'
							)}
						>
							Dashboard
						</NavLink>
						<NavLink 
							to="/cases" 
							className={({ isActive }) => (
								isActive 
									? 'text-[#4F6CF5] font-medium' 
									: 'text-gray-700 hover:text-gray-900'
							)}
						>
							Felanmälan
						</NavLink>
						<NavLink 
							to="/kanban" 
							className={({ isActive }) => (
								isActive 
									? 'text-[#4F6CF5] font-medium' 
									: 'text-gray-700 hover:text-gray-900'
							)}
						>
							Kanban
						</NavLink>
						<NavLink 
							to="/tasks" 
							className={({ isActive }) => (
								isActive 
									? 'text-[#4F6CF5] font-medium' 
									: 'text-gray-700 hover:text-gray-900'
							)}
						>
							Arbetsorder
						</NavLink>
						<NavLink 
							to="/maintenance" 
							className={({ isActive }) => (
								isActive 
									? 'text-[#4F6CF5] font-medium' 
									: 'text-gray-700 hover:text-gray-900'
							)}
						>
							Underhåll
						</NavLink>
						<NavLink 
							to="/profile" 
							className={({ isActive }) => (
								isActive 
									? 'text-[#4F6CF5] font-medium' 
									: 'text-gray-700 hover:text-gray-900'
							)}
						>
							Profil
						</NavLink>
					</nav>
				</div>
			</header>
			
			{/* Breadcrumbs */}
			{location.pathname !== '/' && (
				<div className="bg-white border-b border-gray-200">
					<div className="max-w-6xl mx-auto px-4 py-3">
						<Breadcrumbs items={getBreadcrumbs()} />
					</div>
				</div>
			)}
			
			<main className="flex-1 max-w-6xl mx-auto px-4 py-6 w-full"><Outlet /></main>
		</div>
	)
}


