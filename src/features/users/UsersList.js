import { useGetUsersQuery } from "./usersApiSlice"
import User from './User'
import useTitle from "../../hooks/useTitle"
import { motion, AnimatePresence } from 'framer-motion'
import { 
  FaSearch, 
  FaFilter, 
  FaSort, 
  FaExclamationTriangle,
  FaUserPlus,
  FaSync,
  FaUsers,
  FaUserCheck,
  FaUserSlash,
  FaCrown,
  FaUserTie,
  FaUserFriends
} from "react-icons/fa"
import { useState, useMemo } from 'react'
import PulseLoader from 'react-spinners/PulseLoader'

const UsersList = () => {
    useTitle('TechNotes: Users List')

    const [searchTerm, setSearchTerm] = useState('')
    const [statusFilter, setStatusFilter] = useState('all')
    const [roleFilter, setRoleFilter] = useState('all')
    const [sortBy, setSortBy] = useState('name')

    const {
        data: users,
        isLoading,
        isSuccess,
        isError,
        error,
        refetch
    } = useGetUsersQuery('usersList', {
        pollingInterval: 60000,
        refetchOnFocus: true,
        refetchOnMountOrArgChange: true
    })

    // Filter and sort users
    const filteredAndSortedUsers = useMemo(() => {
        if (!isSuccess || !users.ids) return []

        let filteredIds = [...users.ids]

        // Filter by search term
        if (searchTerm) {
            filteredIds = filteredIds.filter(userId => {
                const user = users.entities[userId]
                return user.username.toLowerCase().includes(searchTerm.toLowerCase())
            })
        }

        // Filter by status
        if (statusFilter !== 'all') {
            filteredIds = filteredIds.filter(userId => {
                const user = users.entities[userId]
                return statusFilter === 'active' ? user.active : !user.active
            })
        }

        // Filter by role
        if (roleFilter !== 'all') {
            filteredIds = filteredIds.filter(userId => {
                const user = users.entities[userId]
                return user.roles.includes(roleFilter)
            })
        }

        // Sort users
        filteredIds.sort((a, b) => {
            const userA = users.entities[a]
            const userB = users.entities[b]
            
            switch (sortBy) {
                case 'name':
                    return userA.username.localeCompare(userB.username)
                case 'name-desc':
                    return userB.username.localeCompare(userA.username)
                case 'status':
                    return userA.active === userB.active ? 0 : userA.active ? -1 : 1
                case 'roles':
                    return userA.roles.length - userB.roles.length
                case 'newest':
                    return new Date(userB.createdAt) - new Date(userA.createdAt)
                default:
                    return 0
            }
        })

        return filteredIds.map(userId => users.entities[userId])
    }, [users, isSuccess, searchTerm, statusFilter, roleFilter, sortBy])

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
                duration: 0.5
            }
        }
    }

    const getStats = () => {
        if (!isSuccess) return { total: 0, active: 0, inactive: 0, admins: 0, managers: 0, employees: 0 }
        
        const allUsers = Object.values(users.entities)
        return {
            total: allUsers.length,
            active: allUsers.filter(user => user.active).length,
            inactive: allUsers.filter(user => !user.active).length,
            admins: allUsers.filter(user => user.roles.includes('Admin')).length,
            managers: allUsers.filter(user => user.roles.includes('Manager')).length,
            employees: allUsers.filter(user => user.roles.includes('Employee')).length,
        }
    }

    const stats = getStats()

    let content

    if (isLoading) {
        content = (
            <div className="flex justify-center items-center min-h-64">
                <div className="text-center">
                    <PulseLoader color="#4f46e5" size={15} />
                    <p className="mt-4 text-gray-600">Loading users...</p>
                </div>
            </div>
        )
    }

    if (isError) {
        content = (
            <motion.div
                className="bg-red-50 border border-red-200 rounded-xl p-6 text-center"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
            >
                <FaExclamationTriangle className="text-red-500 text-3xl mx-auto mb-4" />
                <h3 className="text-red-800 font-semibold text-lg mb-2">Failed to Load Users</h3>
                <p className="text-red-600 mb-4">{error?.data?.message || 'An error occurred while loading users'}</p>
                <button
                    onClick={refetch}
                    className="bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600 transition-colors duration-200"
                >
                    Try Again
                </button>
            </motion.div>
        )
    }

    if (isSuccess) {
        content = (
            <motion.div
                className="space-y-6"
                variants={containerVariants}
                initial="hidden"
                animate="visible"
            >
                {/* Header Section */}
                <motion.div 
                    className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6"
                    variants={itemVariants}
                >
                    <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between space-y-4 lg:space-y-0">
                        <div>
                            <h1 className="text-2xl font-bold text-gray-900 flex items-center">
                                <FaUsers className="mr-3 text-purple-500" />
                                User Management
                            </h1>
                            <p className="text-gray-600 mt-1">
                                Manage team members and their permissions
                            </p>
                        </div>
                        
                        <div className="flex items-center space-x-3">
                            <button
                                onClick={refetch}
                                className="flex items-center px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors duration-200"
                                title="Refresh Users"
                            >
                                <FaSync className="mr-2" />
                                Refresh
                            </button>
                            
                            <button
                                onClick={() => window.location.href = '/dash/users/new'}
                                className="flex items-center px-4 py-2 bg-purple-500 text-white rounded-lg hover:bg-purple-600 transition-colors duration-200"
                            >
                                <FaUserPlus className="mr-2" />
                                Add User
                            </button>
                        </div>
                    </div>
                </motion.div>

                {/* Stats Overview */}
                <motion.div 
                    className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4"
                    variants={itemVariants}
                >
                    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 text-center">
                        <div className="text-2xl font-bold text-gray-900">{stats.total}</div>
                        <div className="text-sm text-gray-600 flex items-center justify-center">
                            <FaUsers className="mr-1" />
                            Total Users
                        </div>
                    </div>
                    <div className="bg-white rounded-xl shadow-sm border border-green-200 p-4 text-center">
                        <div className="text-2xl font-bold text-green-600">{stats.active}</div>
                        <div className="text-sm text-green-700 flex items-center justify-center">
                            <FaUserCheck className="mr-1" />
                            Active
                        </div>
                    </div>
                    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 text-center">
                        <div className="text-2xl font-bold text-gray-500">{stats.inactive}</div>
                        <div className="text-sm text-gray-600 flex items-center justify-center">
                            <FaUserSlash className="mr-1" />
                            Inactive
                        </div>
                    </div>
                    <div className="bg-white rounded-xl shadow-sm border border-red-200 p-4 text-center">
                        <div className="text-2xl font-bold text-red-600">{stats.admins}</div>
                        <div className="text-sm text-red-700 flex items-center justify-center">
                            <FaCrown className="mr-1" />
                            Admins
                        </div>
                    </div>
                    <div className="bg-white rounded-xl shadow-sm border border-blue-200 p-4 text-center">
                        <div className="text-2xl font-bold text-blue-600">{stats.managers}</div>
                        <div className="text-sm text-blue-700 flex items-center justify-center">
                            <FaUserTie className="mr-1" />
                            Managers
                        </div>
                    </div>
                    <div className="bg-white rounded-xl shadow-sm border border-green-200 p-4 text-center">
                        <div className="text-2xl font-bold text-green-600">{stats.employees}</div>
                        <div className="text-sm text-green-700 flex items-center justify-center">
                            <FaUserFriends className="mr-1" />
                            Employees
                        </div>
                    </div>
                </motion.div>

                {/* Filters and Search */}
                <motion.div 
                    className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6"
                    variants={itemVariants}
                >
                    <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between space-y-4 lg:space-y-0">
                        {/* Search Bar */}
                        <div className="relative flex-1 max-w-md">
                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                <FaSearch className="text-gray-400" />
                            </div>
                            <input
                                type="text"
                                placeholder="Search users by username..."
                                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-all duration-200"
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                            />
                        </div>

                        {/* Filters */}
                        <div className="flex flex-wrap gap-3">
                            {/* Status Filter */}
                            <select
                                className="px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-all duration-200"
                                value={statusFilter}
                                onChange={(e) => setStatusFilter(e.target.value)}
                            >
                                <option value="all">All Status</option>
                                <option value="active">Active Only</option>
                                <option value="inactive">Inactive Only</option>
                            </select>

                            {/* Role Filter */}
                            <select
                                className="px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-all duration-200"
                                value={roleFilter}
                                onChange={(e) => setRoleFilter(e.target.value)}
                            >
                                <option value="all">All Roles</option>
                                <option value="Admin">Admins</option>
                                <option value="Manager">Managers</option>
                                <option value="Employee">Employees</option>
                            </select>

                            {/* Sort By */}
                            <select
                                className="px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-all duration-200"
                                value={sortBy}
                                onChange={(e) => setSortBy(e.target.value)}
                            >
                                <option value="name">Name A-Z</option>
                                <option value="name-desc">Name Z-A</option>
                                <option value="status">Status</option>
                                <option value="roles">Role Count</option>
                                <option value="newest">Newest First</option>
                            </select>
                        </div>
                    </div>

                    {/* Results Count */}
                    <div className="mt-4 flex justify-between items-center">
                        <p className="text-sm text-gray-600">
                            Showing <span className="font-semibold">{filteredAndSortedUsers.length}</span> of <span className="font-semibold">{stats.total}</span> users
                        </p>
                        {(searchTerm || statusFilter !== 'all' || roleFilter !== 'all') && (
                            <button
                                onClick={() => {
                                    setSearchTerm('')
                                    setStatusFilter('all')
                                    setRoleFilter('all')
                                }}
                                className="text-sm text-purple-600 hover:text-purple-700 font-medium"
                            >
                                Clear filters
                            </button>
                        )}
                    </div>
                </motion.div>

                {/* Users Grid */}
                <motion.div variants={itemVariants}>
                    <AnimatePresence mode="wait">
                        {filteredAndSortedUsers.length > 0 ? (
                            <motion.div
                                key="users-grid"
                                className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6"
                                initial="hidden"
                                animate="visible"
                                exit="hidden"
                            >
                                {filteredAndSortedUsers.map((user, index) => (
                                    <motion.div
                                        key={user.id}
                                        initial={{ opacity: 0, y: 20 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{ delay: index * 0.1 }}
                                    >
                                        <User userId={user.id} />
                                    </motion.div>
                                ))}
                            </motion.div>
                        ) : (
                            <motion.div
                                key="empty-state"
                                className="bg-white rounded-2xl shadow-sm border border-gray-200 p-12 text-center"
                                initial={{ opacity: 0, scale: 0.9 }}
                                animate={{ opacity: 1, scale: 1 }}
                                exit={{ opacity: 0, scale: 0.9 }}
                            >
                                <FaUsers className="text-gray-400 text-5xl mx-auto mb-4" />
                                <h3 className="text-xl font-semibold text-gray-900 mb-2">No users found</h3>
                                <p className="text-gray-600 mb-6">
                                    {searchTerm || statusFilter !== 'all' || roleFilter !== 'all'
                                        ? 'Try adjusting your search or filters to find what you\'re looking for.'
                                        : 'Get started by adding your first team member.'
                                    }
                                </p>
                                {!searchTerm && statusFilter === 'all' && roleFilter === 'all' && (
                                    <button
                                        onClick={() => window.location.href = '/dash/users/new'}
                                        className="bg-purple-500 text-white px-6 py-3 rounded-lg hover:bg-purple-600 transition-colors duration-200"
                                    >
                                        Add First User
                                    </button>
                                )}
                            </motion.div>
                        )}
                    </AnimatePresence>
                </motion.div>
            </motion.div>
        )
    }

    return (
        <div className="min-h-screen bg-gray-50 py-8">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                {content}
            </div>
        </div>
    )
}

export default UsersList