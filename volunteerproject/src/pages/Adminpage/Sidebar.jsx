import React from 'react';
import { Link } from 'react-router-dom';
import { 
    LayoutDashboard, 
    Users, 
    Building2, 
    PlusCircle, 
    MessageSquare, 
    User, 
    ChevronLeft, 
    ChevronRight 
} from 'lucide-react';

const Sidebar = ({ activeTab, setActiveTab, isSidebarOpen, setIsSidebarOpen, setIsSidebarClosed }) => {
    const sidebarItems = [
        { icon: LayoutDashboard, label: 'Dashboard', value: 'home', path: '/admin/dashboard' },
        { icon: Users, label: 'Volunteers', value: 'volunteers', path: '/admin/volunteermanagement' },
        { icon: Building2, label: 'Organizations', value: 'organizations', path: '/admin/organizationmanagement' },
        { icon: PlusCircle, label: 'Add User', value: 'add-user', path: '/admin/add-new-user' },
        { icon: MessageSquare, label: 'Feedback', value: 'feedback', path: '/admin/feedbacks' },
        { icon: User, label: 'Admin Profile', value: 'admin-profile', path: '/admin/admin-profile' },
        { icon: User, label: 'logout', value: 'log-out', path: '/' },
    ];

    const getLinkClass = (itemValue) => {
        const baseClass = "flex items-center w-full px-6 py-3 transition-all duration-200 ease-in-out";
        const activeClass = activeTab === itemValue 
            ? 'bg-white bg-opacity-10 text-white border-r-4 border-white' 
            : 'text-gray-200';
        const hoverClass = 'hover:bg-white hover:bg-opacity-20 hover:translate-x-1';
        return `${baseClass} ${activeClass} ${hoverClass}`;
    };

    return (
        <aside 
            className={`fixed top-0 left-0 h-full bg-gradient-to-b from-[#343a40] to-[#343a40] shadow-xl 
            transition-all duration-300 ease-in-out ${isSidebarOpen ? 'w-64' : 'w-20'}`}
        >
            {/* Header Section */}
            <div className="flex flex-col">
                <div className="p-6 flex justify-between items-center border-b border-gray-700">
                    <h1 className={`text-2xl font-bold text-white bg-gradient-to-r from-orange-400 to-red-400 
                        bg-clip-text text-transparent ${isSidebarOpen ? '' : 'hidden'}`}>
                        Admin Panel
                    </h1>
                    <button 
                        onClick={() => setIsSidebarOpen(!isSidebarOpen)}
                        className="p-2 rounded-lg hover:bg-white hover:bg-opacity-10 transition-all duration-200"
                    >
                        {isSidebarOpen ? 
                            <ChevronLeft className="h-6 w-6 text-gray-300" /> : 
                            <ChevronRight className="h-6 w-6 text-gray-300" />
                        }
                    </button>
                </div>
            </div>

            {/* Navigation Section */}
            <nav className="mt-6 space-y-1">
                {sidebarItems.map((item) => (
                    <Link
                        key={item.value}
                        to={item.path}
                        className={getLinkClass(item.value)}
                        onClick={() => setActiveTab(item.value)}
                    >
                        <div className="flex items-center">
                            <item.icon className={`w-5 h-5 ${activeTab === item.value ? 'text-white' : 'text-gray-300'}`} />
                            {isSidebarOpen && (
                                <span className={`ml-4 font-medium ${
                                    activeTab === item.value ? 'text-white' : 'text-gray-300'
                                }`}>
                                    {item.label}
                                </span>
                            )}
                        </div>
                        {activeTab === item.value && isSidebarOpen && (
                            <div className="absolute right-0 w-1.5 h-8 bg-white rounded-l-full" />
                        )}
                    </Link>
                ))}
            </nav>

            {/* Footer Section */}
            <div className={`absolute bottom-0 w-full p-6 border-t border-gray-700 
                ${isSidebarOpen ? 'text-center' : 'text-center'}`}>
                <p className={`text-xs text-gray-400 ${isSidebarOpen ? '' : 'hidden'}`}>
                    Welcome Admin @ volunteer Coordination
                </p>
            </div>
        </aside>
    );
};

export default Sidebar;