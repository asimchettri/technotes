

import { useEffect, useState } from 'react'
import { useNavigate, Link, useLocation } from 'react-router-dom'
import { useSendLogoutMutation } from '../features/auth/authApiSlice'
import useAuth from '../hooks/useAuth'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  FaPlus, 
  FaUsers, 
  FaStickyNote, 
  FaUserCog, 
  FaSignOutAlt,
  FaBars,
  FaTimes,
  FaHome
} from "react-icons/fa"
import { PulseLoader } from 'react-spinners'

const DASH_REGEX = /^\/dash(\/)?$/
const NOTES_REGEX = /^\/dash\/notes(\/)?$/
const USERS_REGEX = /^\/dash\/users(\/)?$/

const DashHeader = () => {
    const { username, isManager, isAdmin } = useAuth()
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)

    const navigate = useNavigate()
    const { pathname } = useLocation()

    const [sendLogout, {
        isLoading,
        isSuccess,
        isError,
        error
    }] = useSendLogoutMutation()

    useEffect(() => {
        if (isSuccess) navigate('/')
    }, [isSuccess, navigate])

    useEffect(() => {
        setIsMobileMenuOpen(false)
    }, [pathname])

    const onNewNoteClicked = () => navigate('/dash/notes/new')
    const onNewUserClicked = () => navigate('/dash/users/new')
    const onNotesClicked = () => navigate('/dash/notes')
    const onUsersClicked = () => navigate('/dash/users')
    const onDashboardClicked = () => navigate('/dash')

    const isActivePath = (regex) => regex.test(pathname)

    let newNoteButton = null
    if (NOTES_REGEX.test(pathname)) {
        newNoteButton = (
            <motion.button
                className="flex items-center px-4 py-2 bg-green-500 text-white rounded-lg font-semibold hover:bg-green-600 transition-colors duration-200"
                title="New Note"
                onClick={onNewNoteClicked}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
            >
                <FaPlus className="mr-2" />
                New Note
            </motion.button>
        )
    }

    let newUserButton = null
    if (USERS_REGEX.test(pathname)) {
        newUserButton = (
            <motion.button
                className="flex items-center px-4 py-2 bg-blue-500 text-white rounded-lg font-semibold hover:bg-blue-600 transition-colors duration-200"
                title="New User"
                onClick={onNewUserClicked}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
            >
                <FaPlus className="mr-2" />
                New User
            </motion.button>
        )
    }

    const navItems = [
        {
            icon: FaHome,
            label: 'Dashboard',
            onClick: onDashboardClicked,
            active: DASH_REGEX.test(pathname),
            show: true
        },
        {
            icon: FaStickyNote,
            label: 'Notes',
            onClick: onNotesClicked,
            active: NOTES_REGEX.test(pathname),
            show: true
        },
        {
            icon: FaUsers,
            label: 'Users',
            onClick: onUsersClicked,
            active: USERS_REGEX.test(pathname),
            show: isManager || isAdmin
        }
    ]

    const containerVariants = {
        hidden: { opacity: 0, y: -20 },
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
        hidden: { opacity: 0, x: -20 },
        visible: {
            opacity: 1,
            x: 0,
            transition: {
                duration: 0.3
            }
        }
    }

    const mobileMenuVariants = {
        closed: {
            opacity: 0,
            x: "100%",
            transition: {
                duration: 0.3
            }
        },
        open: {
            opacity: 1,
            x: 0,
            transition: {
                duration: 0.3
            }
        }
    }

    const errClass = isError ? "errmsg" : "offscreen"

    const content = (
        <>
            <AnimatePresence>
                {isError && (
                    <motion.div
                        className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 text-center"
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                    >
                        {error?.data?.message}
                    </motion.div>
                )}
            </AnimatePresence>

            <motion.header 
                className="bg-white shadow-lg border-b border-gray-200 sticky top-0 z-40"
                variants={containerVariants}
                initial="hidden"
                animate="visible"
            >
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex justify-between items-center h-16">
                        {/* Logo and Brand */}
                        <div className="flex items-center">
                            <Link 
                                to="/dash" 
                                className="flex items-center space-x-3 group"
                            >
                                <div className="w-10 h-10 bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl flex items-center justify-center shadow-lg">
                                    <FaStickyNote className="text-white text-lg" />
                                </div>
                                <div>
                                    <h1 className="text-xl font-bold text-gray-900 group-hover:text-blue-600 transition-colors duration-200">
                                        techNotes
                                    </h1>
                                    <p className="text-xs text-gray-500">Welcome, {username}</p>
                                </div>
                            </Link>
                        </div>

                        {/* Desktop Navigation */}
                        <div className="hidden md:flex items-center space-x-4">
                            {/* Navigation Items */}
                            <div className="flex items-center space-x-2 bg-gray-100 rounded-xl p-1">
                                {navItems.filter(item => item.show).map((item, index) => (
                                    <motion.button
                                        key={item.label}
                                        className={`flex items-center px-4 py-2 rounded-lg font-medium transition-all duration-200 ${
                                            item.active 
                                                ? 'bg-white text-blue-600 shadow-sm' 
                                                : 'text-gray-600 hover:text-gray-900 hover:bg-white'
                                        }`}
                                        onClick={item.onClick}
                                        whileHover={{ scale: 1.05 }}
                                        whileTap={{ scale: 0.95 }}
                                        initial={{ opacity: 0, y: -10 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{ delay: index * 0.1 }}
                                    >
                                        <item.icon className="mr-2" />
                                        {item.label}
                                    </motion.button>
                                ))}
                            </div>

                            {/* Action Buttons */}
                            <div className="flex items-center space-x-2 border-l border-gray-300 pl-4 ml-2">
                                {newNoteButton}
                                {newUserButton}
                                
                                {/* Logout Button */}
                                <motion.button
                                    className="flex items-center px-4 py-2 bg-gradient-to-r from-red-500 to-orange-500 text-white rounded-lg font-semibold hover:shadow-lg transition-all duration-200"
                                    onClick={sendLogout}
                                    disabled={isLoading}
                                    whileHover={{ scale: 1.05 }}
                                    whileTap={{ scale: 0.95 }}
                                >
                                    {isLoading ? (
                                        <PulseLoader color="#ffffff" size={8} />
                                    ) : (
                                        <>
                                            <FaSignOutAlt className="mr-2" />
                                            Logout
                                        </>
                                    )}
                                </motion.button>
                            </div>
                        </div>

                        {/* Mobile Menu Button */}
                        <div className="md:hidden">
                            <motion.button
                                className="p-2 rounded-lg text-gray-600 hover:text-gray-900 hover:bg-gray-100 transition-colors duration-200"
                                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                            >
                                {isMobileMenuOpen ? <FaTimes size={20} /> : <FaBars size={20} />}
                            </motion.button>
                        </div>
                    </div>
                </div>

                {/* Mobile Menu */}
                <AnimatePresence>
                    {isMobileMenuOpen && (
                        <>
                            {/* Backdrop */}
                            <motion.div
                                className="fixed inset-0 bg-black bg-opacity-50 z-30 md:hidden"
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                exit={{ opacity: 0 }}
                                onClick={() => setIsMobileMenuOpen(false)}
                            />
                            
                            {/* Menu Panel */}
                            <motion.div
                                className="fixed top-0 right-0 h-full w-80 bg-white shadow-2xl z-40 md:hidden"
                                variants={mobileMenuVariants}
                                initial="closed"
                                animate="open"
                                exit="closed"
                            >
                                <div className="p-6">
                                    {/* Menu Header */}
                                    <div className="flex items-center justify-between mb-8">
                                        <div className="flex items-center space-x-3">
                                            <div className="w-12 h-12 bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl flex items-center justify-center">
                                                <FaStickyNote className="text-white text-xl" />
                                            </div>
                                            <div>
                                                <h2 className="font-bold text-gray-900">techNotes</h2>
                                                <p className="text-sm text-gray-500">{username}</p>
                                            </div>
                                        </div>
                                        <button
                                            className="p-2 text-gray-400 hover:text-gray-600"
                                            onClick={() => setIsMobileMenuOpen(false)}
                                        >
                                            <FaTimes size={20} />
                                        </button>
                                    </div>

                                    {/* Mobile Navigation Items */}
                                    <nav className="space-y-2">
                                        {navItems.filter(item => item.show).map((item, index) => (
                                            <motion.button
                                                key={item.label}
                                                variants={itemVariants}
                                                initial="hidden"
                                                animate="visible"
                                                transition={{ delay: index * 0.1 }}
                                                className={`w-full flex items-center px-4 py-3 rounded-xl font-medium transition-all duration-200 ${
                                                    item.active 
                                                        ? 'bg-blue-50 text-blue-600 border border-blue-200' 
                                                        : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                                                }`}
                                                onClick={item.onClick}
                                            >
                                                <item.icon className="mr-3" />
                                                {item.label}
                                            </motion.button>
                                        ))}

                                        {/* Mobile Action Buttons */}
                                        <div className="pt-4 border-t border-gray-200 space-y-2">
                                            {newNoteButton && (
                                                <motion.button
                                                    variants={itemVariants}
                                                    className="w-full flex items-center justify-center px-4 py-3 bg-green-500 text-white rounded-xl font-semibold hover:bg-green-600 transition-colors duration-200"
                                                    onClick={onNewNoteClicked}
                                                >
                                                    <FaPlus className="mr-2" />
                                                    New Note
                                                </motion.button>
                                            )}
                                            {newUserButton && (
                                                <motion.button
                                                    variants={itemVariants}
                                                    className="w-full flex items-center justify-center px-4 py-3 bg-blue-500 text-white rounded-xl font-semibold hover:bg-blue-600 transition-colors duration-200"
                                                    onClick={onNewUserClicked}
                                                >
                                                    <FaPlus className="mr-2" />
                                                    New User
                                                </motion.button>
                                            )}
                                        </div>

                                        {/* Mobile Logout Button */}
                                        <motion.button
                                            variants={itemVariants}
                                            className="w-full flex items-center justify-center px-4 py-3 bg-gradient-to-r from-red-500 to-orange-500 text-white rounded-xl font-semibold hover:shadow-lg transition-all duration-200 mt-4"
                                            onClick={sendLogout}
                                            disabled={isLoading}
                                        >
                                            {isLoading ? (
                                                <PulseLoader color="#ffffff" size={8} />
                                            ) : (
                                                <>
                                                    <FaSignOutAlt className="mr-2" />
                                                    Logout
                                                </>
                                            )}
                                        </motion.button>
                                    </nav>
                                </div>
                            </motion.div>
                        </>
                    )}
                </AnimatePresence>
            </motion.header>
        </>
    )

    return content
}

export default DashHeader