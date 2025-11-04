import { Link } from 'react-router-dom'
import useAuth from '../../hooks/useAuth'
import useTitle from '../../hooks/useTitle'
import { motion } from 'framer-motion'
import { 
  FaStickyNote, 
  FaPlus, 
  FaUsers, 
  FaUserPlus, 
  FaCalendarAlt,
  FaChartLine,
  FaCog,
  FaBell,
  FaSearch
} from 'react-icons/fa'
import { useEffect, useState } from 'react'
import '../../index.css';
import { useGetStatsQuery } from '../stats/statsApiSlice';




const Welcome = () => {
    const { username, isManager, isAdmin } = useAuth()
    const [currentTime, setCurrentTime] = useState(new Date())

    useTitle(`TechNotes: ${username}`)

    useEffect(() => {
        const timer = setInterval(() => {
            setCurrentTime(new Date())
        }, 1000)
        return () => clearInterval(timer)
    }, [])

    const today = new Intl.DateTimeFormat('en-US', { 
        dateStyle: 'full', 
        timeStyle: 'medium' 
    }).format(currentTime)

    const containerVariants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: {
                staggerChildren: 0.1
            }
        }
    }

    const itemVariants = {
        hidden: { y: 20, opacity: 0 },
        visible: {
            y: 0,
            opacity: 1,
            transition: {
                duration: 0.6,
                ease: "easeOut"
            }
        }
    }

    const cardVariants = {
        hidden: { scale: 0.9, opacity: 0 },
        visible: {
            scale: 1,
            opacity: 1,
            transition: {
                duration: 0.5
            }
        },
        hover: {
            scale: 1.02,
            y: -5,
            transition: {
                duration: 0.2
            }
        }
    }

const { data: statsData, isLoading, isError } = useGetStatsQuery(undefined, {
  pollingInterval: 4000, // fetch every 10 seconds
  refetchOnFocus: true,   // refetch when tab gains focus
  refetchOnReconnect: true, // refetch when network reconnects
})

if (isLoading) return <p>Loading stats...</p>
if (isError) return <p>Error loading stats.</p>


   const stats = [
    { label: 'Total Notes', value: statsData.totalNotes, change: statsData.notesChange, color: 'blue' },
    { label: 'Active Users', value: statsData.activeUsers, change: statsData.usersChange, color: 'green' },
    { label: 'Tasks Due', value: statsData.tasksDue, change: statsData.tasksChange, color: 'orange' },
  ]

    const content = (
        <div className="min-h-screen bg-gray-50">
            {/* Header */}
            <motion.header 
                className="bg-white shadow-sm border-b border-gray-200"
                initial={{ y: -50, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ duration: 0.5 }}
            >
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex justify-between items-center py-4">
                        <div>
                            <h1 className="text-2xl font-bold text-gray-900">
                                Welcome back, <span className="text-blue-600">{username}</span>!
                            </h1>
                            <p className="text-gray-500 flex items-center mt-1">
                                <FaCalendarAlt className="mr-2 text-sm" />
                                {today}
                            </p>
                        </div>
                        <div className="flex items-center space-x-4">
                            <div className="relative">
                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                    <FaSearch className="text-gray-400" />
                                </div>
                                <input
                                    type="text"
                                    placeholder="Search..."
                                    className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                />
                            </div>
                            <button className="relative p-2 text-gray-600 hover:text-gray-900">
                                <FaBell className="text-xl" />
                                <span className="absolute top-0 right-0 w-3 h-3 bg-red-500 rounded-full"></span>
                            </button>
                        </div>
                    </div>
                </div>
            </motion.header>

            <motion.section 
                className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8"
                variants={containerVariants}
                initial="hidden"
                animate="visible"
            >
                {/* Stats Overview */}
                <motion.div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8" variants={itemVariants}>
                    {stats.map((stat, index) => (
                        <motion.div
                            key={stat.label}
                            className="bg-white rounded-xl shadow-sm border border-gray-200 p-6"
                            variants={cardVariants}
                            whileHover="hover"
                            custom={index}
                        >
                            <div className="flex justify-between items-start">
                                <div>
                                    <p className="text-sm font-medium text-gray-600">{stat.label}</p>
                                    <p className="text-3xl font-bold text-gray-900 mt-2">{stat.value}</p>
                                </div>
                                <div className={`px-3 py-1 rounded-full text-xs font-medium ${
                                    stat.color === 'blue' ? 'bg-blue-100 text-blue-800' :
                                    stat.color === 'green' ? 'bg-green-100 text-green-800' :
                                    'bg-orange-100 text-orange-800'
                                }`}>
                                    {stat.change}
                                </div>
                            </div>
                            <div className="mt-4">
                                <div className={`w-full bg-gray-200 rounded-full h-2 ${
                                    stat.color === 'blue' ? 'bg-blue-200' :
                                    stat.color === 'green' ? 'bg-green-200' :
                                    'bg-orange-200'
                                }`}>
                                    <div 
                                        className={`h-2 rounded-full ${
                                            stat.color === 'blue' ? 'bg-blue-500' :
                                            stat.color === 'green' ? 'bg-green-500' :
                                            'bg-orange-500'
                                        }`}
                                        style={{ width: `${Math.random() * 60 + 40}%` }}
                                    ></div>
                                </div>
                            </div>
                        </motion.div>
                    ))}
                </motion.div>

                {/* Quick Actions */}
                <motion.div variants={itemVariants}>
                    <h2 className="text-xl font-semibold text-gray-900 mb-6">Quick Actions</h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                        {/* View Notes Card */}
                        <motion.div
                            variants={cardVariants}
                            whileHover="hover"
                        >
                            <Link 
                                to="/dash/notes"
                                className="block bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow duration-200 group"
                            >
                                <div className="flex items-center justify-between mb-4">
                                    <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center group-hover:bg-blue-200 transition-colors duration-200">
                                        <FaStickyNote className="text-2xl text-blue-600" />
                                    </div>
                                </div>
                                <h3 className="text-lg font-semibold text-gray-900 mb-2">View TechNotes</h3>
                                <p className="text-gray-600 text-sm">
                                    Browse and manage all technical notes and documentation
                                </p>
                                <div className="mt-4 flex items-center text-blue-600 font-medium text-sm">
                                    Access Notes
                                    <FaChartLine className="ml-2" />
                                </div>
                            </Link>
                        </motion.div>

                        {/* Add New Note Card */}
                        <motion.div
                            variants={cardVariants}
                            whileHover="hover"
                        >
                            <Link 
                                to="/dash/notes/new"
                                className="block bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow duration-200 group"
                            >
                                <div className="flex items-center justify-between mb-4">
                                    <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center group-hover:bg-green-200 transition-colors duration-200">
                                        <FaPlus className="text-2xl text-green-600" />
                                    </div>
                                </div>
                                <h3 className="text-lg font-semibold text-gray-900 mb-2">Add New TechNote</h3>
                                <p className="text-gray-600 text-sm">
                                    Create new technical documentation and notes
                                </p>
                                <div className="mt-4 flex items-center text-green-600 font-medium text-sm">
                                    Create Note
                                    <FaPlus className="ml-2" />
                                </div>
                            </Link>
                        </motion.div>

                        {/* Admin/Manager Cards */}
                        {(isManager || isAdmin) && (
                            <>
                                <motion.div
                                    variants={cardVariants}
                                    whileHover="hover"
                                >
                                    <Link 
                                        to="/dash/users"
                                        className="block bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow duration-200 group"
                                    >
                                        <div className="flex items-center justify-between mb-4">
                                            <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center group-hover:bg-purple-200 transition-colors duration-200">
                                                <FaUsers className="text-2xl text-purple-600" />
                                            </div>
                                        </div>
                                        <h3 className="text-lg font-semibold text-gray-900 mb-2">User Management</h3>
                                        <p className="text-gray-600 text-sm">
                                            Manage user accounts and permissions
                                        </p>
                                        <div className="mt-4 flex items-center text-purple-600 font-medium text-sm">
                                            Manage Users
                                            <FaCog className="ml-2" />
                                        </div>
                                    </Link>
                                </motion.div>

                                <motion.div
                                    variants={cardVariants}
                                    whileHover="hover"
                                >
                                    <Link 
                                        to="/dash/users/new"
                                        className="block bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow duration-200 group"
                                    >
                                        <div className="flex items-center justify-between mb-4">
                                            <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center group-hover:bg-orange-200 transition-colors duration-200">
                                                <FaUserPlus className="text-2xl text-orange-600" />
                                            </div>
                                        </div>
                                        <h3 className="text-lg font-semibold text-gray-900 mb-2">Add New User</h3>
                                        <p className="text-gray-600 text-sm">
                                            Create new user accounts and set permissions
                                        </p>
                                        <div className="mt-4 flex items-center text-orange-600 font-medium text-sm">
                                            Create User
                                            <FaUserPlus className="ml-2" />
                                        </div>
                                    </Link>
                                </motion.div>
                            </>
                        )}
                    </div>
                </motion.div>

                {/* Recent Activity Section */}
                <motion.div 
                    className="mt-12"
                    variants={itemVariants}
                >
                    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                        <div className="flex justify-between items-center mb-6">
                            <h2 className="text-xl font-semibold text-gray-900">Recent Activity(it's static😁)</h2>
                            <button className="text-blue-600 hover:text-blue-700 font-medium text-sm">
                                View All
                            </button>
                        </div>
                        <div className="space-y-4">
                            {[
                                { action: 'Note Created', description: 'Added new API documentation', time: '2 hours ago', user: username },
                                { action: 'User Updated', description: 'Modified user permissions', time: '5 hours ago', user: 'System Admin' },
                                { action: 'Note Edited', description: 'Updated troubleshooting guide', time: '1 day ago', user: username },
                            ].map((activity, index) => (
                                <motion.div
                                    key={index}
                                    className="flex items-center space-x-4 p-4 hover:bg-gray-50 rounded-lg transition-colors duration-200"
                                    whileHover={{ x: 5 }}
                                >
                                    <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
                                    <div className="flex-1">
                                        <p className="font-medium text-gray-900">{activity.action}</p>
                                        <p className="text-sm text-gray-600">{activity.description}</p>
                                    </div>
                                    <div className="text-right">
                                        <p className="text-sm text-gray-500">{activity.time}</p>
                                        <p className="text-xs text-gray-400">{activity.user}</p>
                                    </div>
                                </motion.div>
                            ))}
                        </div>
                    </div>
                </motion.div>
            </motion.section>
        </div>
    )

    return content
}

export default Welcome