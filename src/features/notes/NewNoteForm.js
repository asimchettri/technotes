import { useState, useEffect } from "react"
import { useAddNewNoteMutation } from "./notesApiSlice"
import { useNavigate } from "react-router-dom"
import { motion, AnimatePresence } from 'framer-motion'
import { 
  FaSave, 
  FaUser, 
  FaTimes, 
  FaCheckCircle,
  FaPlus,
  FaArrowLeft,
  FaStickyNote
} from "react-icons/fa"
import useAuth from "../../hooks/useAuth" 

const NewNoteForm = ({ users }) => {
    const { username } = useAuth() 
    const [addNewNote, {
        isLoading,
        isSuccess,
        isError,
        error
    }] = useAddNewNoteMutation()

    const navigate = useNavigate()

    const [title, setTitle] = useState('')
    const [text, setText] = useState('')
    const [userId, setUserId] = useState(users[0]?.id || '')
    const [isFocused, setIsFocused] = useState({ title: false, text: false, user: false })

    useEffect(() => {
        if (isSuccess) {
            setTitle('')
            setText('')
            setUserId('')
            navigate('/dash/notes')
        }
    }, [isSuccess, navigate])

    const onTitleChanged = e => setTitle(e.target.value)
    const onTextChanged = e => setText(e.target.value)
    const onUserIdChanged = e => setUserId(e.target.value)

    const canSave = [title, text, userId].every(Boolean) && !isLoading

    const onSaveNoteClicked = async (e) => {
        e.preventDefault()
        if (canSave) {
            console.log('Creating note with:', { 
                user: userId, 
                title, 
                text, 
                username: username 
            })
            await addNewNote({ 
                user: userId, 
                title, 
                text, 
                username: username 
            })
        }
    }

    const options = users.map(user => (
        <option key={user.id} value={user.id}>
            {user.username}
        </option>
    ))

    const errClass = isError ? "errmsg" : "offscreen"

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
                        onClick={() => navigate('/dash/notes')}
                        className="inline-flex items-center text-gray-600 hover:text-gray-900 transition-colors duration-200 font-medium group"
                    >
                        <FaArrowLeft className="mr-2 group-hover:-translate-x-1 transition-transform duration-200" />
                        Back to Notes
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
                            <p>{error?.data?.message || 'An error occurred while creating the note'}</p>
                        </motion.div>
                    )}
                </AnimatePresence>

                {/* New Note Form */}
                <motion.form 
                    className="bg-white rounded-2xl shadow-lg border border-gray-200 overflow-hidden"
                    onSubmit={onSaveNoteClicked}
                    variants={itemVariants}
                >
                    {/* Header */}
                    <div className="bg-gradient-to-r from-green-600 to-blue-600 px-6 py-4">
                        <div className="flex justify-between items-center">
                            <div className="flex items-center">
                                <div className="w-12 h-12 bg-white bg-opacity-20 rounded-xl flex items-center justify-center mr-4">
                                    <FaPlus className="text-white text-xl" />
                                </div>
                                <div>
                                    <h2 className="text-2xl font-bold text-white">
                                        Create New Note
                                    </h2>
                                    <p className="text-green-100 text-sm mt-1">
                                        Creating note as: <strong>{username}</strong>
                                    </p>
                                </div>
                            </div>
                            <motion.button
                                className={`flex items-center px-6 py-3 rounded-xl font-semibold transition-all duration-200 ${
                                    canSave 
                                        ? 'bg-white text-green-600 hover:bg-green-50 hover:shadow-lg' 
                                        : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                                }`}
                                type="submit"
                                disabled={!canSave}
                                whileHover={canSave ? { scale: 1.05 } : {}}
                                whileTap={canSave ? { scale: 0.95 } : {}}
                            >
                                <FaSave className="mr-2" />
                                {isLoading ? 'Creating...' : 'Create Note'}
                            </motion.button>
                        </div>
                    </div>

                    {/* Form Body */}
                    <div className="p-6 space-y-6">
                        {/* Title Field */}
                        <div>
                            <label className="block text-sm font-semibold text-gray-700 mb-2" htmlFor="title">
                                <FaStickyNote className="inline mr-2 text-blue-500" />
                                Note Title
                            </label>
                            <input
                                className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 bg-gray-50 focus:bg-white"
                                id="title"
                                name="title"
                                type="text"
                                autoComplete="off"
                                value={title}
                                onChange={onTitleChanged}
                                onFocus={() => setIsFocused(prev => ({ ...prev, title: true }))}
                                onBlur={() => setIsFocused(prev => ({ ...prev, title: false }))}
                                placeholder="Enter a descriptive title for your note..."
                            />
                        </div>

                        {/* Text Field */}
                        <div>
                            <label className="block text-sm font-semibold text-gray-700 mb-2" htmlFor="text">
                                Note Content
                            </label>
                            <textarea
                                className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 min-h-[200px] resize-vertical bg-gray-50 focus:bg-white"
                                id="text"
                                name="text"
                                value={text}
                                onChange={onTextChanged}
                                onFocus={() => setIsFocused(prev => ({ ...prev, text: true }))}
                                onBlur={() => setIsFocused(prev => ({ ...prev, text: false }))}
                                placeholder="Enter the detailed content of your note..."
                            />
                        </div>

                        {/* Assignment Field */}
                        <div className="bg-gray-50 rounded-xl p-4 border border-gray-200">
                            <label className="block text-sm font-semibold text-gray-700 mb-3" htmlFor="username">
                                <FaUser className="inline mr-2 text-purple-500" />
                                Assign To
                                <span className="text-xs text-gray-500 ml-2">(Note will be owned by: <strong>{username}</strong>)</span>
                            </label>
                            <select
                                id="username"
                                name="username"
                                className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-purple-500 bg-white transition-all duration-200"
                                value={userId}
                                onChange={onUserIdChanged}
                                onFocus={() => setIsFocused(prev => ({ ...prev, user: true }))}
                                onBlur={() => setIsFocused(prev => ({ ...prev, user: false }))}
                            >
                                <option value="">Select a team member to assign this note to...</option>
                                {options}
                            </select>
                            <p className="text-gray-500 text-sm mt-2">
                                This note will be created under your name (<strong>{username}</strong>) and assigned to the selected user for action.
                            </p>
                        </div>

                        {/* Debug Info */}
                        <div className="bg-blue-50 rounded-xl p-4 border border-blue-200">
                            <h4 className="font-semibold text-blue-700 mb-2">Debug Info</h4>
                            <div className="text-sm text-blue-600 space-y-1">
                                <div>Current User: <strong>{username}</strong></div>
                                <div>Selected Assignment: <strong>{userId ? users.find(u => u.id === userId)?.username : 'None'}</strong></div>
                                <div>Note will be owned by: <strong>{username}</strong></div>
                            </div>
                        </div>
                    </div>
                </motion.form>
            </motion.div>
        </div>
    )

    return content
}

export default NewNoteForm