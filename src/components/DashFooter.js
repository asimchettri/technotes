


import { useNavigate, useLocation } from 'react-router-dom'
import useAuth from "../hooks/useAuth"
import { motion } from 'framer-motion'
import { 
  FaHome, 
  FaUser, 
  FaCircle, 
  FaShieldAlt,
  FaHeart,
  FaGithub,
  FaLinkedin
} from "react-icons/fa"

const DashFooter = () => {
    const { username, status } = useAuth()
    const navigate = useNavigate()
    const { pathname } = useLocation()

    const onGoHomeClicked = () => navigate('/dash')

    const getStatusColor = () => {
        switch (status) {
            case 'active':
                return 'text-green-500'
            case 'inactive':
                return 'text-yellow-500'
            case 'suspended':
                return 'text-red-500'
            default:
                return 'text-gray-500'
        }
    }

    const getStatusText = () => {
        switch (status) {
            case 'active':
                return 'Active'
            case 'inactive':
                return 'Inactive'
            case 'suspended':
                return 'Suspended'
            default:
                return status
        }
    }

    const containerVariants = {
        hidden: { opacity: 0, y: 20 },
        visible: {
            opacity: 1,
            y: 0,
            transition: {
                duration: 0.5,
                ease: "easeOut"
            }
        }
    }

    const itemVariants = {
        hidden: { opacity: 0, scale: 0.8 },
        visible: {
            opacity: 1,
            scale: 1,
            transition: {
                duration: 0.3
            }
        }
    }

    const content = (
        <motion.footer 
            className="bg-white border-t border-gray-200 mt-auto"
            variants={containerVariants}
            initial="hidden"
            animate="visible"
        >
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="py-6">
                    {/* Main Footer Content */}
                    <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
                        {/* Left Section - Home Button and User Info */}
                        <div className="flex items-center space-x-6">
                            {/* Home Button */}
                            {pathname !== '/dash' && (
                                <motion.button
                                    className="flex items-center justify-center w-12 h-12 bg-gradient-to-r from-blue-500 to-purple-500 text-white rounded-xl shadow-lg hover:shadow-xl transition-all duration-200"
                                    title="Go to Dashboard"
                                    onClick={onGoHomeClicked}
                                    variants={itemVariants}
                                    whileHover={{ 
                                        scale: 1.1,
                                        rotate: 5
                                    }}
                                    whileTap={{ scale: 0.9 }}
                                >
                                    <FaHome className="text-lg" />
                                </motion.button>
                            )}

                            {/* User Information */}
                            <div className="flex items-center space-x-4">
                                <div className="flex items-center space-x-3">
                                    <div className="flex items-center justify-center w-10 h-10 bg-blue-100 rounded-full">
                                        <FaUser className="text-blue-600" />
                                    </div>
                                    <div>
                                        <p className="text-sm font-semibold text-gray-900 flex items-center">
                                            {username}
                                            <FaCircle className={`ml-2 text-xs ${getStatusColor()}`} />
                                        </p>
                                        <p className="text-xs text-gray-500 flex items-center">
                                            <FaShieldAlt className="mr-1" />
                                            <span className={getStatusColor()}>{getStatusText()}</span>
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Center Section - Brand and Info */}
                        <div className="text-center">
                            <div className="flex items-center justify-center space-x-2 text-gray-600">
                                <span className="text-sm">Built with</span>
                                <motion.div
                                    whileHover={{ scale: 1.2 }}
                                    transition={{ type: "spring", stiffness: 300 }}
                                >
                                    <FaHeart className="text-red-500" />
                                </motion.div>
                                <span className="text-sm">by Ashim P. Repairs</span>
                            </div>
                            <p className="text-xs text-gray-500 mt-1">
                                © 2024 TechNotes. All rights reserved.
                            </p>
                        </div>

                        {/* Right Section - Links and Version */}
                        <div className="flex items-center space-x-4">
                            {/* Social Links */}
                            <div className="flex space-x-3">
                                <motion.a
                                    href="https://github.com"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="text-gray-400 hover:text-gray-600 transition-colors duration-200"
                                    whileHover={{ scale: 1.2, y: -2 }}
                                    title="GitHub"
                                >
                                    <FaGithub className="text-lg" />
                                </motion.a>
                                <motion.a
                                    href="https://linkedin.com"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="text-gray-400 hover:text-blue-600 transition-colors duration-200"
                                    whileHover={{ scale: 1.2, y: -2 }}
                                    title="LinkedIn"
                                >
                                    <FaLinkedin className="text-lg" />
                                </motion.a>
                            </div>

                            {/* Version Info */}
                            <div className="hidden md:block border-l border-gray-300 pl-4">
                                <p className="text-xs text-gray-500">
                                    v2.1.0
                                </p>
                                <p className="text-xs text-gray-400">
                                    Production
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* Bottom Bar - Additional Info */}
                    <div className="mt-4 pt-4 border-t border-gray-100">
                        <div className="flex flex-col sm:flex-row justify-between items-center space-y-2 sm:space-y-0 text-xs text-gray-500">
                            <div className="flex items-center space-x-4">
                                <span>🛡️ Enterprise Grade Security</span>
                                <span>•</span>
                                <span>⚡ High Performance</span>
                                <span>•</span>
                                <span>🔒 99.9% Uptime</span>
                            </div>
                            <div className="flex items-center space-x-2">
                                <span>Last updated: Just now</span>
                                <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Mobile Optimized View */}
            <div className="md:hidden bg-gray-50 border-t border-gray-200">
                <div className="px-4 py-3">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-2">
                            <div className={`w-2 h-2 rounded-full ${getStatusColor().replace('text-', 'bg-')}`}></div>
                            <span className="text-xs text-gray-600">{getStatusText()}</span>
                        </div>
                        <div className="text-xs text-gray-500">
                            {username}
                        </div>
                        <button
                            onClick={onGoHomeClicked}
                            className="p-2 text-gray-400 hover:text-gray-600 transition-colors duration-200"
                        >
                            <FaHome />
                        </button>
                    </div>
                </div>
            </div>
        </motion.footer>
    )
    
    return content
}

export default DashFooter