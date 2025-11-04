

import { useRef, useState, useEffect } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { useDispatch } from 'react-redux'
import { setCredentials } from './authSlice'
import { useLoginMutation } from './authApiSlice'
import usePersist from '../../hooks/usePersist'
import useTitle from '../../hooks/useTitle'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  FaUser, 
  FaLock, 
  FaEye, 
  FaEyeSlash, 
  FaArrowLeft,
  FaShieldAlt,
  FaCheckCircle
} from 'react-icons/fa'
import { PulseLoader } from 'react-spinners'
import '../../index.css';


const Login = () => {
    useTitle('Employee Login')

    const userRef = useRef()
    const errRef = useRef()
    const [username, setUsername] = useState('')
    const [password, setPassword] = useState('')
    const [errMsg, setErrMsg] = useState('')
    const [persist, setPersist] = usePersist()
    const [showPassword, setShowPassword] = useState(false)
    const [isFocused, setIsFocused] = useState({ username: false, password: false })

    const navigate = useNavigate()
    const dispatch = useDispatch()

    const [login, { isLoading }] = useLoginMutation()

    useEffect(() => {
        userRef.current.focus()
    }, [])

    useEffect(() => {
        setErrMsg('')
    }, [username, password])

    const handleSubmit = async (e) => {
        e.preventDefault()
        console.log('Login attempt started')
        try {
            const { accessToken } = await login({ username, password }).unwrap()
            console.log('Login successful, accessToken:', accessToken)
            dispatch(setCredentials({ accessToken }))
            console.log('Credentials set in Redux')
            setUsername('')
            setPassword('')
            console.log('About to navigate to /dash')
            navigate('/dash')
            console.log('Navigate called')
        } catch (err) {
            console.log('Login error:', err)
            if (!err.status) {
                setErrMsg('No Server Response')
            } else if (err.status === 400) {
                setErrMsg('Missing Username or Password')
            } else if (err.status === 401) {
                setErrMsg('Invalid credentials. Please try again.')
            } else {
                setErrMsg(err.data?.message || 'Login failed')
            }
            errRef.current.focus()
        }
    }

    const handleUserInput = (e) => setUsername(e.target.value)
    const handlePwdInput = (e) => setPassword(e.target.value)
    const handleToggle = () => setPersist(prev => !prev)
    const togglePasswordVisibility = () => setShowPassword(prev => !prev)

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

    if (isLoading) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center">
                <div className="text-center">
                    <PulseLoader color="#4f46e5" size={15} />
                    <p className="mt-4 text-gray-600">Signing you in...</p>
                </div>
            </div>
        )
    }

    const content = (
        <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
            {/* Background Elements */}
            <div className="absolute inset-0 bg-grid-pattern opacity-5"></div>
            <div className="absolute top-10 right-10 w-72 h-72 bg-blue-200 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob"></div>
            <div className="absolute bottom-10 left-10 w-72 h-72 bg-purple-200 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob animation-delay-2000"></div>

            <motion.section 
                className="w-full max-w-md relative z-10"
                variants={containerVariants}
                initial="hidden"
                animate="visible"
            >
                {/* Back to Home */}
                <motion.div variants={itemVariants} className="mb-6">
                    <Link 
                        to="/" 
                        className="inline-flex items-center text-gray-600 hover:text-gray-900 transition-colors duration-200 font-medium"
                    >
                        <FaArrowLeft className="mr-2" />
                        Back to Home
                    </Link>
                </motion.div>

                {/* Login Card */}
                <motion.div 
                    className="bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden"
                    variants={itemVariants}
                >
                    <div className="p-8">
                        {/* Header */}
                        <motion.header className="text-center mb-8" variants={itemVariants}>
                            <div className="w-16 h-16 bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl flex items-center justify-center shadow-lg mx-auto mb-4">
                                <FaShieldAlt className="text-white text-2xl" />
                            </div>
                            <h1 className="text-3xl font-bold text-gray-900 mb-2">
                                Employee Login
                            </h1>
                            <p className="text-gray-600">
                                Access your workspace securely
                            </p>
                        </motion.header>

                        {/* Error Message */}
                        <AnimatePresence>
                            {errMsg && (
                                <motion.p 
                                    ref={errRef}
                                    className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-6 flex items-center"
                                    aria-live="assertive"
                                    initial={{ opacity: 0, y: -10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0, y: -10 }}
                                >
                                    <FaCheckCircle className="mr-2 flex-shrink-0" />
                                    {errMsg}
                                </motion.p>
                            )}
                        </AnimatePresence>

                        {/* Login Form */}
                        <motion.form className="space-y-6" onSubmit={handleSubmit} variants={itemVariants}>
                            {/* Username Field */}
                            <div>
                                <label htmlFor="username" className="block text-sm font-medium text-gray-700 mb-2">
                                    Username
                                </label>
                                <div className="relative">
                                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                        <FaUser className={`h-5 w-5 ${isFocused.username ? 'text-blue-500' : 'text-gray-400'} transition-colors`} />
                                    </div>
                                    <input
                                        className="block w-full pl-10 pr-3 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 bg-gray-50 focus:bg-white"
                                        type="text"
                                        id="username"
                                        ref={userRef}
                                        value={username}
                                        onChange={handleUserInput}
                                        onFocus={() => setIsFocused(prev => ({ ...prev, username: true }))}
                                        onBlur={() => setIsFocused(prev => ({ ...prev, username: false }))}
                                        autoComplete="username"
                                        required
                                        placeholder="Enter your username"
                                    />
                                </div>
                            </div>

                            {/* Password Field */}
                            <div>
                                <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">
                                    Password
                                </label>
                                <div className="relative">
                                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                        <FaLock className={`h-5 w-5 ${isFocused.password ? 'text-blue-500' : 'text-gray-400'} transition-colors`} />
                                    </div>
                                    <input
                                        className="block w-full pl-10 pr-12 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 bg-gray-50 focus:bg-white"
                                        type={showPassword ? "text" : "password"}
                                        id="password"
                                        onChange={handlePwdInput}
                                        value={password}
                                        onFocus={() => setIsFocused(prev => ({ ...prev, password: true }))}
                                        onBlur={() => setIsFocused(prev => ({ ...prev, password: false }))}
                                        required
                                        placeholder="Enter your password"
                                    />
                                    <button
                                        type="button"
                                        className="absolute inset-y-0 right-0 pr-3 flex items-center"
                                        onClick={togglePasswordVisibility}
                                    >
                                        {showPassword ? (
                                            <FaEyeSlash className="h-5 w-5 text-gray-400 hover:text-gray-600" />
                                        ) : (
                                            <FaEye className="h-5 w-5 text-gray-400 hover:text-gray-600" />
                                        )}
                                    </button>
                                </div>
                            </div>

                            {/* Remember Me */}
                            <motion.div className="flex items-center" variants={itemVariants}>
                                <label htmlFor="persist" className="flex items-center cursor-pointer">
                                    <div className="relative">
                                        <input
                                            type="checkbox"
                                            className="sr-only"
                                            id="persist"
                                            onChange={handleToggle}
                                            checked={persist}
                                        />
                                        <div className={`w-6 h-6 rounded border-2 transition-all duration-200 ${
                                            persist 
                                                ? 'bg-blue-600 border-blue-600' 
                                                : 'bg-white border-gray-300'
                                        }`}>
                                            {persist && (
                                                <FaCheckCircle className="w-4 h-4 text-white absolute top-1 left-1" />
                                            )}
                                        </div>
                                    </div>
                                    <span className="ml-3 text-sm text-gray-700 font-medium">
                                        Trust This Device
                                    </span>
                                </label>
                            </motion.div>

                            {/* Submit Button */}
                            <motion.button
                                className="w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white py-3 px-4 rounded-xl font-semibold shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 transition-all duration-200 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed"
                                type="submit"
                                disabled={isLoading}
                                whileHover={{ scale: 1.02 }}
                                whileTap={{ scale: 0.98 }}
                            >
                                {isLoading ? (
                                    <div className="flex items-center justify-center">
                                        <PulseLoader color="#ffffff" size={8} />
                                    </div>
                                ) : (
                                    'Sign In'
                                )}
                            </motion.button>
                        </motion.form>

                        {/* Security Note */}
                        <motion.div 
                            className="mt-6 text-center"
                            variants={itemVariants}
                        >
                            <p className="text-xs text-gray-500 flex items-center justify-center">
                                <FaShieldAlt className="mr-1" />
                                Your login is secured with enterprise-grade encryption
                            </p>
                        </motion.div>
                    </div>
                </motion.div>
            </motion.section>
        </div>
    )

    return content
}

export default Login