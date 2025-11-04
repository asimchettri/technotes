import { useState, useEffect } from "react"
import { useUpdateUserMutation, useDeleteUserMutation } from "./usersApiSlice"
import { useNavigate } from "react-router-dom"
import { motion, AnimatePresence } from 'framer-motion'
import { 
  FaSave, 
  FaTrash, 
  FaUser, 
  FaLock, 
  FaShieldAlt, 
  FaCheckCircle,
  FaTimes,
  FaEdit,
  FaUserCheck,
  FaUserSlash
} from "react-icons/fa"
import { ROLES } from "../../config/roles"

const USER_REGEX = /^[A-z]{3,20}$/
const PWD_REGEX = /^[A-z0-9!@#$%]{4,12}$/

const EditUserForm = ({ user }) => {
    const [updateUser, {
        isLoading,
        isSuccess,
        isError,
        error
    }] = useUpdateUserMutation()

    const [deleteUser, {
        isSuccess: isDelSuccess,
        isError: isDelError,
        error: delerror
    }] = useDeleteUserMutation()

    const navigate = useNavigate()

    const [username, setUsername] = useState(user.username)
    const [validUsername, setValidUsername] = useState(false)
    const [password, setPassword] = useState('')
    const [validPassword, setValidPassword] = useState(false)
    const [roles, setRoles] = useState(user.roles)
    const [active, setActive] = useState(user.active)
    const [showDeleteConfirm, setShowDeleteConfirm] = useState(false)
    const [isFocused, setIsFocused] = useState({ username: false, password: false })

    useEffect(() => {
        setValidUsername(USER_REGEX.test(username))
    }, [username])

    useEffect(() => {
        setValidPassword(PWD_REGEX.test(password))
    }, [password])

    useEffect(() => {
        if (isSuccess || isDelSuccess) {
            setUsername('')
            setPassword('')
            setRoles([])
            navigate('/dash/users')
        }
    }, [isSuccess, isDelSuccess, navigate])

    const onUsernameChanged = e => setUsername(e.target.value)
    const onPasswordChanged = e => setPassword(e.target.value)

    const onRolesChanged = (role) => {
        if (roles.includes(role)) {
            setRoles(roles.filter(r => r !== role))
        } else {
            setRoles([...roles, role])
        }
    }

    const onActiveChanged = () => setActive(prev => !prev)

    const onSaveUserClicked = async (e) => {
        if (password) {
            await updateUser({ id: user.id, username, password, roles, active })
        } else {
            await updateUser({ id: user.id, username, roles, active })
        }
    }

    const onDeleteUserClicked = async () => {
        await deleteUser({ id: user.id })
        setShowDeleteConfirm(false)
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

    let canSave
    if (password) {
        canSave = [roles.length, validUsername, validPassword].every(Boolean) && !isLoading
    } else {
        canSave = [roles.length, validUsername].every(Boolean) && !isLoading
    }

    const errClass = (isError || isDelError) ? "errmsg" : "offscreen"
    const errContent = (error?.data?.message || delerror?.data?.message) ?? ''

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
                {/* Error Message */}
                <AnimatePresence>
                    {errContent && (
                        <motion.div
                            className="mb-6 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-xl flex items-center"
                            initial={{ opacity: 0, y: -10 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -10 }}
                        >
                            <FaTimes className="mr-3 flex-shrink-0" />
                            <p>{errContent}</p>
                        </motion.div>
                    )}
                </AnimatePresence>

                {/* Delete Confirmation Modal */}
                <AnimatePresence>
                    {showDeleteConfirm && (
                        <motion.div
                            className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                        >
                            <motion.div
                                className="bg-white rounded-2xl p-6 max-w-md w-full"
                                initial={{ scale: 0.9, opacity: 0 }}
                                animate={{ scale: 1, opacity: 1 }}
                                exit={{ scale: 0.9, opacity: 0 }}
                            >
                                <div className="text-center">
                                    <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                                        <FaTrash className="text-2xl text-red-600" />
                                    </div>
                                    <h3 className="text-xl font-bold text-gray-900 mb-2">Delete User?</h3>
                                    <p className="text-gray-600 mb-6">
                                        Are you sure you want to delete user <strong>{user.username}</strong>? This action cannot be undone.
                                    </p>
                                    <div className="flex space-x-3 justify-center">
                                        <button
                                            className="px-6 py-2 bg-gray-300 text-gray-700 rounded-lg font-semibold hover:bg-gray-400 transition-colors duration-200"
                                            onClick={() => setShowDeleteConfirm(false)}
                                        >
                                            Cancel
                                        </button>
                                        <button
                                            className="px-6 py-2 bg-red-500 text-white rounded-lg font-semibold hover:bg-red-600 transition-colors duration-200"
                                            onClick={onDeleteUserClicked}
                                        >
                                            Delete User
                                        </button>
                                    </div>
                                </div>
                            </motion.div>
                        </motion.div>
                    )}
                </AnimatePresence>

                {/* Edit User Form */}
                <motion.form 
                    className="bg-white rounded-2xl shadow-lg border border-gray-200 overflow-hidden"
                    onSubmit={e => e.preventDefault()}
                    variants={itemVariants}
                >
                    {/* Header */}
                    <div className="bg-gradient-to-r from-purple-600 to-indigo-600 px-6 py-4">
                        <div className="flex justify-between items-center">
                            <div className="flex items-center">
                                <div className="w-12 h-12 bg-white bg-opacity-20 rounded-xl flex items-center justify-center mr-4">
                                    <FaEdit className="text-white text-xl" />
                                </div>
                                <div>
                                    <h2 className="text-2xl font-bold text-white">
                                        Edit User
                                    </h2>
                                    <p className="text-purple-100 text-sm mt-1">
                                        Update user details and permissions
                                    </p>
                                </div>
                            </div>
                            <div className="flex space-x-3">
                                <motion.button
                                    className={`flex items-center px-6 py-3 rounded-xl font-semibold transition-all duration-200 ${
                                        canSave 
                                            ? 'bg-white text-purple-600 hover:bg-purple-50 hover:shadow-lg' 
                                            : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                                    }`}
                                    title="Save Changes"
                                    onClick={onSaveUserClicked}
                                    disabled={!canSave}
                                    whileHover={canSave ? { scale: 1.05 } : {}}
                                    whileTap={canSave ? { scale: 0.95 } : {}}
                                >
                                    <FaSave className="mr-2" />
                                    {isLoading ? 'Saving...' : 'Save Changes'}
                                </motion.button>
                                <motion.button
                                    className="flex items-center px-4 py-3 bg-red-500 text-white rounded-xl font-semibold hover:bg-red-600 transition-colors duration-200"
                                    title="Delete User"
                                    onClick={() => setShowDeleteConfirm(true)}
                                    whileHover={{ scale: 1.05 }}
                                    whileTap={{ scale: 0.95 }}
                                >
                                    <FaTrash className="mr-2" />
                                    Delete
                                </motion.button>
                            </div>
                        </div>
                    </div>

                    {/* Form Body */}
                    <div className="p-6 space-y-6">
                        {/* Username Field */}
                        <div>
                            <label className="block text-sm font-semibold text-gray-700 mb-2" htmlFor="username">
                                <FaUser className="inline mr-2 text-blue-500" />
                                Username
                                <span className="text-xs text-gray-500 ml-2">[3-20 letters]</span>
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
                                    placeholder="Enter username..."
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
                                <span className="text-xs text-gray-500 ml-2">[leave empty to keep current]</span>
                            </label>
                            <div className="relative">
                                <input
                                    className={`w-full px-4 py-3 border-2 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-all duration-200 ${
                                        password && !validPassword 
                                            ? 'border-red-300 bg-red-50' 
                                            : isFocused.password 
                                                ? 'border-green-300 bg-green-50' 
                                                : 'border-gray-300 bg-gray-50'
                                    }`}
                                    id="password"
                                    name="password"
                                    type="password"
                                    value={password}
                                    onChange={onPasswordChanged}
                                    onFocus={() => setIsFocused(prev => ({ ...prev, password: true }))}
                                    onBlur={() => setIsFocused(prev => ({ ...prev, password: false }))}
                                    placeholder="Enter new password..."
                                />
                                {password && (
                                    <div className={`absolute right-3 top-3 ${validPassword ? 'text-green-500' : 'text-red-500'}`}>
                                        {validPassword ? <FaCheckCircle /> : <FaTimes />}
                                    </div>
                                )}
                            </div>
                            {password && !validPassword && (
                                <p className="text-red-500 text-sm mt-2 flex items-center">
                                    <FaTimes className="mr-1" />
                                    Password must be 4-12 characters including !@#$%
                                </p>
                            )}
                            {!password && (
                                <p className="text-gray-500 text-sm mt-2">
                                    Current password will be maintained
                                </p>
                            )}
                        </div>

                        {/* Status and Roles */}
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                            {/* Active Status */}
                            <div className="bg-gray-50 rounded-xl p-4 border border-gray-200">
                                <label className="flex items-center cursor-pointer group" htmlFor="user-active">
                                    <div className="relative">
                                        <input
                                            className="sr-only"
                                            id="user-active"
                                            name="user-active"
                                            type="checkbox"
                                            checked={active}
                                            onChange={onActiveChanged}
                                        />
                                        <div className={`w-12 h-6 rounded-full transition-colors duration-200 ${
                                            active ? 'bg-green-500' : 'bg-gray-300'
                                        }`}>
                                            <div className={`absolute top-1 left-1 w-4 h-4 rounded-full bg-white transition-transform duration-200 ${
                                                active ? 'transform translate-x-6' : ''
                                            }`} />
                                        </div>
                                    </div>
                                    <div className="ml-3 flex items-center">
                                        {active ? (
                                            <FaUserCheck className="text-green-500 mr-2" />
                                        ) : (
                                            <FaUserSlash className="text-gray-400 mr-2" />
                                        )}
                                        <div>
                                            <span className="font-semibold text-gray-700">
                                                {active ? 'Active' : 'Inactive'}
                                            </span>
                                            <p className="text-sm text-gray-500">
                                                {active ? 'User can access system' : 'User account is disabled'}
                                            </p>
                                        </div>
                                    </div>
                                </label>
                            </div>

                            {/* Roles Selection */}
                            <div className="bg-gray-50 rounded-xl p-4 border border-gray-200">
                                <label className="block text-sm font-semibold text-gray-700 mb-3">
                                    <FaShieldAlt className="inline mr-2 text-purple-500" />
                                    Assigned Roles
                                </label>
                                <div className="space-y-2">
                                    {Object.values(ROLES).map(role => (
                                        <motion.label
                                            key={role}
                                            className={`flex items-center p-3 rounded-lg border-2 cursor-pointer transition-all duration-200 ${
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
                                            <div className={`w-5 h-5 border-2 rounded mr-3 flex items-center justify-center transition-colors duration-200 ${
                                                roles.includes(role)
                                                    ? 'bg-purple-500 border-purple-500'
                                                    : 'border-gray-300'
                                            }`}>
                                                {roles.includes(role) && <FaCheckCircle className="text-white text-xs" />}
                                            </div>
                                            <span className={`px-3 py-1 rounded-full text-xs font-semibold border ${getRoleColor(role)}`}>
                                                {role}
                                            </span>
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
                                            {canSave ? 'Ready to save changes' : 'Complete all required fields'}
                                        </p>
                                    </div>
                                </div>
                                <div className="flex space-x-4 text-sm">
                                    <span className={`flex items-center ${validUsername ? 'text-green-600' : 'text-red-500'}`}>
                                        {validUsername ? <FaCheckCircle /> : <FaTimes />}
                                        Username
                                    </span>
                                    <span className={`flex items-center ${password ? validPassword : true ? 'text-green-600' : 'text-red-500'}`}>
                                        {password ? (validPassword ? <FaCheckCircle /> : <FaTimes />) : <FaCheckCircle />}
                                        Password
                                    </span>
                                    <span className={`flex items-center ${roles.length ? 'text-green-600' : 'text-red-500'}`}>
                                        {roles.length ? <FaCheckCircle /> : <FaTimes />}
                                        Roles
                                    </span>
                                </div>
                            </div>
                        </motion.div>
                    </div>
                </motion.form>
            </motion.div>
        </div>
    )

    return content
}

export default EditUserForm