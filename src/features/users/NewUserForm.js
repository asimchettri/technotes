import { useState, useEffect } from "react"
import { useAddNewUserMutation } from "./usersApiSlice"
import { useNavigate } from "react-router-dom"
import { motion, AnimatePresence } from 'framer-motion'
import { 
  FaSave, 
  FaUser, 
  FaLock, 
  FaShieldAlt, 
  FaCheckCircle,
  FaTimes,
  FaUserPlus,
  FaArrowLeft,
  FaEye,
  FaEyeSlash
} from "react-icons/fa"
import { ROLES } from "../../config/roles"
import useTitle from "../../hooks/useTitle"

const USER_REGEX = /^[A-z]{3,20}$/
const PWD_REGEX = /^[A-z0-9!@#$%]{4,12}$/

const NewUserForm = () => {
    useTitle('TechNotes: New User')

    const [addNewUser, {
        isLoading,
        isSuccess,
        isError,
        error
    }] = useAddNewUserMutation()

    const navigate = useNavigate()

    const [username, setUsername] = useState('')
    const [validUsername, setValidUsername] = useState(false)
    const [password, setPassword] = useState('')
    const [validPassword, setValidPassword] = useState(false)
    const [roles, setRoles] = useState(["Employee"])
    const [isFocused, setIsFocused] = useState({ username: false, password: false })
    const [showPassword, setShowPassword] = useState(false)

    useEffect(() => {
        setValidUsername(USER_REGEX.test(username))
    }, [username])

    useEffect(() => {
        setValidPassword(PWD_REGEX.test(password))
    }, [password])

    useEffect(() => {
        if (isSuccess) {
            setUsername('')
            setPassword('')
            setRoles([])
            navigate('/dash/users')
        }
    }, [isSuccess, navigate])

    const onUsernameChanged = e => setUsername(e.target.value)
    const onPasswordChanged = e => setPassword(e.target.value)

    const onRolesChanged = (role) => {
        if (roles.includes(role)) {
            setRoles(roles.filter(r => r !== role))
        } else {
            setRoles([...roles, role])
        }
    }

    const canSave = [roles.length, validUsername, validPassword].every(Boolean) && !isLoading

    const onSaveUserClicked = async (e) => {
        e.preventDefault()
        if (canSave) {
            await addNewUser({ username, password, roles })
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

    const getRoleDescription = (role) => {
        switch (role) {
            case 'Admin':
                return 'Full system access and user management'
            case 'Manager':
                return 'Manage notes and team members'
            case 'Employee':
                return 'Create and manage personal notes'
            default:
                return ''
        }
    }

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

    const content = (
        <div className="min-h-screen bg-gray-50 py-8">
            <motion.div 
                className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8"
                variants={containerVariants}
                initial="hidden"
                animate="visible"
            >
                {/* Back Navigation */}
                <motion.div variants={itemVariants} className="mb-6">
                    <button
                        onClick={() => navigate('/dash/users')}
                        className="inline-flex items-center text-gray-600 hover:text-gray-900 transition-colors duration-200 font-medium group"
                    >
                        <FaArrowLeft className="mr-2 group-hover:-translate-x-1 transition-transform duration-200" />
                        Back to Users
                    </button>
                </motion.div>

                {/* Error Message */}
                <AnimatePresence>
                    {isError && (
                        <motion.div
                            className="mb-6 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-xl flex items-center"
                            initial={{ opacity: 0, y: -10 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -10 }}
                        >
                            <FaTimes className="mr-3 flex-shrink-0" />
                            <p>{error?.data?.message || 'An error occurred while creating the user'}</p>
                        </motion.div>
                    )}
                </AnimatePresence>

                {/* New User Form */}
                <motion.form 
                    className="bg-white rounded-2xl shadow-lg border border-gray-200 overflow-hidden"
                    onSubmit={onSaveUserClicked}
                    variants={itemVariants}
                >
                    {/* Header */}
                    <div className="bg-gradient-to-r from-teal-600 to-cyan-600 px-6 py-4">
                        <div className="flex justify-between items-center">
                            <div className="flex items-center">
                                <div className="w-12 h-12 bg-white bg-opacity-20 rounded-xl flex items-center justify-center mr-4">
                                    <FaUserPlus className="text-white text-xl" />
                                </div>
                                <div>
                                    <h2 className="text-2xl font-bold text-white">
                                        Create New User
                                    </h2>
                                    <p className="text-teal-100 text-sm mt-1">
                                        Add a new team member to the system
                                    </p>
                                </div>
                            </div>
                            <motion.button
                                className={`flex items-center px-6 py-3 rounded-xl font-semibold transition-all duration-200 ${
                                    canSave 
                                        ? 'bg-white text-teal-600 hover:bg-teal-50 hover:shadow-lg' 
                                        : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                                }`}
                                type="submit"
                                disabled={!canSave}
                                whileHover={canSave ? { scale: 1.05 } : {}}
                                whileTap={canSave ? { scale: 0.95 } : {}}
                            >
                                <FaSave className="mr-2" />
                                {isLoading ? 'Creating User...' : 'Create User'}
                            </motion.button>
                        </div>
                    </div>

                    {/* Form Body */}
                    <div className="p-6 space-y-6">
                        {/* Username Field */}
                        <div>
                            <label className="block text-sm font-semibold text-gray-700 mb-2" htmlFor="username">
                                <FaUser className="inline mr-2 text-blue-500" />
                                Username
                                <span className="text-xs text-gray-500 ml-2">[3-20 letters only]</span>
                            </label>
                            <div className="relative">
                                <input
                                    className={`w-full px-4 py-3 border-2 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 ${
                                        !validUsername && username 
                                            ? 'border-red-300 bg-red-50' 
                                            : isFocused.username 
                                                ? 'border-blue-300 bg-blue-50' 
                                                : 'border-gray-300 bg-gray-50'
                                    }`}
                                    id="username"
                                    name="username"
                                    type="text"
                                    autoComplete="off"
                                    value={username}
                                    onChange={onUsernameChanged}
                                    onFocus={() => setIsFocused(prev => ({ ...prev, username: true }))}
                                    onBlur={() => setIsFocused(prev => ({ ...prev, username: false }))}
                                    placeholder="Enter a username for the new user..."
                                />
                                {username && (
                                    <div className={`absolute right-3 top-3 ${validUsername ? 'text-green-500' : 'text-red-500'}`}>
                                        {validUsername ? <FaCheckCircle /> : <FaTimes />}
                                    </div>
                                )}
                            </div>
                            {username && !validUsername && (
                                <p className="text-red-500 text-sm mt-2 flex items-center">
                                    <FaTimes className="mr-1" />
                                    Username must be 3-20 letters only
                                </p>
                            )}
                        </div>

                        {/* Password Field */}
                        <div>
                            <label className="block text-sm font-semibold text-gray-700 mb-2" htmlFor="password">
                                <FaLock className="inline mr-2 text-green-500" />
                                Password
                                <span className="text-xs text-gray-500 ml-2">[4-12 characters including !@#$%]</span>
                            </label>
                            <div className="relative">
                                <input
                                    className={`w-full px-4 py-3 border-2 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-all duration-200 ${
                                        !validPassword && password 
                                            ? 'border-red-300 bg-red-50' 
                                            : isFocused.password 
                                                ? 'border-green-300 bg-green-50' 
                                                : 'border-gray-300 bg-gray-50'
                                    }`}
                                    id="password"
                                    name="password"
                                    type={showPassword ? "text" : "password"}
                                    value={password}
                                    onChange={onPasswordChanged}
                                    onFocus={() => setIsFocused(prev => ({ ...prev, password: true }))}
                                    onBlur={() => setIsFocused(prev => ({ ...prev, password: false }))}
                                    placeholder="Create a secure password..."
                                />
                                <button
                                    type="button"
                                    className="absolute right-10 top-3 text-gray-400 hover:text-gray-600 transition-colors duration-200"
                                    onClick={() => setShowPassword(!showPassword)}
                                >
                                    {showPassword ? <FaEyeSlash /> : <FaEye />}
                                </button>
                                {password && (
                                    <div className={`absolute right-3 top-3 ${validPassword ? 'text-green-500' : 'text-red-500'}`}>
                                        {validPassword ? <FaCheckCircle /> : <FaTimes />}
                                    </div>
                                )}
                            </div>
                            {password && !validPassword && (
                                <p className="text-red-500 text-sm mt-2 flex items-center">
                                    <FaTimes className="mr-1" />
                                    Password must be 4-12 characters including letters, numbers, and !@#$%
                                </p>
                            )}
                        </div>

                        {/* Roles Selection */}
                        <div className="bg-gray-50 rounded-xl p-4 border border-gray-200">
                            <label className="block text-sm font-semibold text-gray-700 mb-3">
                                <FaShieldAlt className="inline mr-2 text-purple-500" />
                                Assign Roles
                                <span className="text-xs text-gray-500 ml-2">[select one or more roles]</span>
                            </label>
                            <div className="space-y-3">
                                {Object.values(ROLES).map(role => (
                                    <motion.label
                                        key={role}
                                        className={`flex items-start p-4 rounded-lg border-2 cursor-pointer transition-all duration-200 ${
                                            roles.includes(role)
                                                ? 'border-purple-300 bg-purple-50'
                                                : 'border-gray-200 bg-white hover:bg-gray-50'
                                        }`}
                                        whileHover={{ scale: 1.02 }}
                                        whileTap={{ scale: 0.98 }}
                                    >
                                        <input
                                            type="checkbox"
                                            className="sr-only"
                                            checked={roles.includes(role)}
                                            onChange={() => onRolesChanged(role)}
                                        />
                                        <div className={`w-5 h-5 border-2 rounded mr-3 flex items-center justify-center transition-colors duration-200 mt-0.5 ${
                                            roles.includes(role)
                                                ? 'bg-purple-500 border-purple-500'
                                                : 'border-gray-300'
                                        }`}>
                                            {roles.includes(role) && <FaCheckCircle className="text-white text-xs" />}
                                        </div>
                                        <div className="flex-1">
                                            <div className="flex items-center mb-1">
                                                <span className={`px-3 py-1 rounded-full text-xs font-semibold border ${getRoleColor(role)}`}>
                                                    {role}
                                                </span>
                                            </div>
                                            <p className="text-xs text-gray-600">
                                                {getRoleDescription(role)}
                                            </p>
                                        </div>
                                    </motion.label>
                                ))}
                            </div>
                            {!roles.length && (
                                <p className="text-red-500 text-sm mt-2 flex items-center">
                                    <FaTimes className="mr-1" />
                                    At least one role must be selected
                                </p>
                            )}
                        </div>

                        {/* Form Validation Status */}
                        <motion.div 
                            className="bg-blue-50 rounded-xl p-4 border border-blue-200"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ delay: 0.3 }}
                        >
                            <div className="flex items-center justify-between">
                                <div className="flex items-center">
                                    <FaCheckCircle className="text-blue-500 mr-3" />
                                    <div>
                                        <h4 className="font-semibold text-blue-700">Form Status</h4>
                                        <p className="text-blue-600 text-sm">
                                            {canSave ? 'Ready to create user' : 'Complete all required fields'}
                                        </p>
                                    </div>
                                </div>
                                <div className="flex space-x-4 text-sm">
                                    <span className={`flex items-center ${validUsername ? 'text-green-600' : 'text-red-500'}`}>
                                        {validUsername ? <FaCheckCircle /> : <FaTimes />}
                                        Username
                                    </span>
                                    <span className={`flex items-center ${validPassword ? 'text-green-600' : 'text-red-500'}`}>
                                        {validPassword ? <FaCheckCircle /> : <FaTimes />}
                                        Password
                                    </span>
                                    <span className={`flex items-center ${roles.length ? 'text-green-600' : 'text-red-500'}`}>
                                        {roles.length ? <FaCheckCircle /> : <FaTimes />}
                                        Roles
                                    </span>
                                </div>
                            </div>
                        </motion.div>

                        {/* Security Tips */}
                        <div className="bg-yellow-50 rounded-xl p-4 border border-yellow-200">
                            <h4 className="font-semibold text-yellow-800 mb-2 flex items-center">
                                <FaShieldAlt className="mr-2" />
                                Security Best Practices
                            </h4>
                            <ul className="text-yellow-700 text-sm space-y-1">
                                <li>• Choose a username that doesn't reveal personal information</li>
                                <li>• Use a strong, unique password with mixed characters</li>
                                <li>• Assign only the necessary roles for the user's responsibilities</li>
                                <li>• Consider setting the user as inactive initially for review</li>
                            </ul>
                        </div>
                    </div>
                </motion.form>
            </motion.div>
        </div>
    )

    return content
}

export default NewUserForm