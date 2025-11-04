import { useNavigate } from 'react-router-dom'
import { useGetUsersQuery } from './usersApiSlice'
import { memo } from 'react'
import { motion } from 'framer-motion'
import { 
  FaEdit, 
  FaUser, 
  FaShieldAlt, 
  FaCheckCircle, 
  FaTimesCircle,
  FaUserCheck,
  FaUserSlash,
  FaCrown,
  FaUserTie,
  FaUserFriends
} from "react-icons/fa"

const User = ({ userId }) => {
    const { user } = useGetUsersQuery("usersList", {
        selectFromResult: ({ data }) => ({
            user: data?.entities[userId]
        }),
    })

    const navigate = useNavigate()

    if (user) {
        const handleEdit = () => navigate(`/dash/users/${userId}`)

        const getRoleIcon = (role) => {
            switch (role) {
                case 'Admin':
                    return <FaCrown className="text-red-500" />
                case 'Manager':
                    return <FaUserTie className="text-blue-500" />
                case 'Employee':
                    return <FaUserFriends className="text-green-500" />
                default:
                    return <FaUser className="text-gray-500" />
            }
        }

        const getRoleColor = (role) => {
            switch (role) {
                case 'Admin':
                    return 'bg-red-100 text-red-800 border-red-200'
                case 'Manager':
                    return 'bg-blue-100 text-blue-800 border-blue-200'
                case 'Employee':
                    return 'bg-green-100 text-green-800 border-green-200'
                default:
                    return 'bg-gray-100 text-gray-800 border-gray-200'
            }
        }

        const cardVariants = {
            hidden: { 
                opacity: 0, 
                y: 20,
                scale: 0.95
            },
            visible: {
                opacity: 1,
                y: 0,
                scale: 1,
                transition: {
                    duration: 0.4,
                    ease: "easeOut"
                }
            },
            hover: {
                y: -4,
                scale: 1.02,
                boxShadow: "0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)",
                transition: {
                    duration: 0.2
                }
            }
        }

        return (
            <motion.div
                className={`bg-white rounded-xl shadow-sm border-2 overflow-hidden transition-all duration-200 ${
                    user.active 
                        ? 'border-gray-200 hover:border-blue-300' 
                        : 'border-gray-100 opacity-75'
                }`}
                variants={cardVariants}
                initial="hidden"
                animate="visible"
                whileHover="hover"
            >
                <div className="p-6">
                    {/* Header Section */}
                    <div className="flex justify-between items-start mb-4">
                        <div className="flex items-center space-x-3">
                            <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${
                                user.active ? 'bg-blue-100' : 'bg-gray-100'
                            }`}>
                                <FaUser className={`text-lg ${user.active ? 'text-blue-600' : 'text-gray-400'}`} />
                            </div>
                            <div>
                                <h3 className={`text-lg font-semibold ${user.active ? 'text-gray-900' : 'text-gray-500'}`}>
                                    {user.username}
                                </h3>
                                <div className="flex items-center space-x-2 mt-1">
                                    <div className={`flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                                        user.active 
                                            ? 'bg-green-100 text-green-800' 
                                            : 'bg-gray-100 text-gray-600'
                                    }`}>
                                        {user.active ? (
                                            <>
                                                <FaUserCheck className="mr-1" />
                                                Active
                                            </>
                                        ) : (
                                            <>
                                                <FaUserSlash className="mr-1" />
                                                Inactive
                                            </>
                                        )}
                                    </div>
                                </div>
                            </div>
                        </div>
                        
                        <motion.button
                            className={`flex items-center justify-center w-10 h-10 rounded-lg transition-colors duration-200 ${
                                user.active 
                                    ? 'bg-blue-50 text-blue-600 hover:bg-blue-100 hover:text-blue-700' 
                                    : 'bg-gray-50 text-gray-400 hover:bg-gray-100'
                            }`}
                            onClick={handleEdit}
                            whileHover={{ scale: 1.1, rotate: 5 }}
                            whileTap={{ scale: 0.9 }}
                            title="Edit User"
                        >
                            <FaEdit className="text-sm" />
                        </motion.button>
                    </div>

                    {/* Roles Section */}
                    <div className="mb-4">
                        <div className="flex items-center mb-3">
                            <FaShieldAlt className="text-gray-400 mr-2" />
                            <span className="text-sm font-medium text-gray-700">Roles & Permissions</span>
                        </div>
                        <div className="flex flex-wrap gap-2">
                            {(Array.isArray(user.roles) ? user.roles : [user.roles || 'No Role']).map((role, index) => (
                                <motion.div
                                    key={role}
                                    className={`flex items-center px-3 py-1 rounded-full text-xs font-semibold border ${getRoleColor(role)}`}
                                    initial={{ opacity: 0, scale: 0.8 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    transition={{ delay: index * 0.1 }}
                                >
                                    <span className="mr-1.5">{getRoleIcon(role)}</span>
                                    {role}
                                </motion.div>
                            ))}
                        </div>
                    </div>

                    {/* Footer Section */}
                    <div className="flex justify-between items-center pt-4 border-t border-gray-100">
                        <div className="flex items-center space-x-4 text-sm text-gray-500">
                            {/* User ID */}
                            <div className="flex items-center">
                                <span className="text-xs bg-gray-100 px-2 py-1 rounded">
                                    ID: {userId.slice(-8)}
                                </span>
                            </div>
                            
                            {/* Role Count */}
                            <div className="flex items-center">
                                <FaShieldAlt className="mr-1 text-gray-400" />
                                <span>{user.roles.length} role{user.roles.length !== 1 ? 's' : ''}</span>
                            </div>
                        </div>

                        {/* Status Indicator */}
                        <div className="flex items-center space-x-2">
                            {user.active ? (
                                <motion.div
                                    className="flex items-center text-green-500 text-xs"
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    transition={{ delay: 0.5 }}
                                >
                                    <FaCheckCircle className="mr-1" />
                                    <span>Active</span>
                                </motion.div>
                            ) : (
                                <motion.div
                                    className="flex items-center text-gray-400 text-xs"
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    transition={{ delay: 0.5 }}
                                >
                                    <FaTimesCircle className="mr-1" />
                                    <span>Inactive</span>
                                </motion.div>
                            )}
                        </div>
                    </div>
                </div>

                {/* Active Status Bar */}
                <div className={`h-1 ${
                    user.active 
                        ? 'bg-gradient-to-r from-green-400 to-green-600' 
                        : 'bg-gradient-to-r from-gray-300 to-gray-400'
                }`} />
            </motion.div>
        )

    } else return (
        <motion.div
            className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 animate-pulse"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
        >
            <div className="flex justify-between items-start mb-4">
                <div className="flex items-center space-x-3">
                    <div className="w-12 h-12 bg-gray-200 rounded-xl"></div>
                    <div className="space-y-2">
                        <div className="h-4 bg-gray-200 rounded w-24"></div>
                        <div className="h-3 bg-gray-200 rounded w-16"></div>
                    </div>
                </div>
                <div className="w-10 h-10 bg-gray-200 rounded-lg"></div>
            </div>
            <div className="space-y-2 mb-4">
                <div className="h-3 bg-gray-200 rounded w-1/2"></div>
                <div className="flex gap-2">
                    <div className="h-6 bg-gray-200 rounded-full w-16"></div>
                    <div className="h-6 bg-gray-200 rounded-full w-20"></div>
                </div>
            </div>
            <div className="flex justify-between items-center pt-4 border-t border-gray-100">
                <div className="h-3 bg-gray-200 rounded w-20"></div>
                <div className="h-3 bg-gray-200 rounded w-12"></div>
            </div>
        </motion.div>
    )
}

const memoizedUser = memo(User)

export default memoizedUser