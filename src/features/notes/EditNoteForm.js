

import { useState, useEffect } from "react"
import { useUpdateNoteMutation, useDeleteNoteMutation } from "./notesApiSlice"
import { useNavigate } from "react-router-dom"
import { motion, AnimatePresence } from 'framer-motion'
import { 
  FaSave, 
  FaTrash, 
  FaUser, 
  FaCalendarAlt, 
  FaCheckCircle,
  FaEdit,
  FaClock,
  FaTimes,
  FaCheck
} from "react-icons/fa"
import useAuth from "../../hooks/useAuth"
import '../../index'

const EditNoteForm = ({ note, users }) => {
    const { isManager, isAdmin } = useAuth()

    const [updateNote, {
        isLoading,
        isSuccess,
        isError,
        error
    }] = useUpdateNoteMutation()

    const [deleteNote, {
        isSuccess: isDelSuccess,
        isError: isDelError,
        error: delerror
    }] = useDeleteNoteMutation()

    const navigate = useNavigate()

    const [title, setTitle] = useState(note.title)
    const [text, setText] = useState(note.text)
    const [completed, setCompleted] = useState(note.completed)
    const [userId, setUserId] = useState(note.user)
    const [isFocused, setIsFocused] = useState({ title: false, text: false })
    const [showDeleteConfirm, setShowDeleteConfirm] = useState(false)

    useEffect(() => {
        if (isSuccess || isDelSuccess) {
            setTitle('')
            setText('')
            setUserId('')
            navigate('/dash/notes')
        }
    }, [isSuccess, isDelSuccess, navigate])

    const onTitleChanged = e => setTitle(e.target.value)
    const onTextChanged = e => setText(e.target.value)
    const onCompletedChanged = e => setCompleted(prev => !prev)
    const onUserIdChanged = e => setUserId(e.target.value)

    const canSave = [title, text, userId].every(Boolean) && !isLoading

    const onSaveNoteClicked = async (e) => {
        if (canSave) {
            await updateNote({ id: note.id, user: userId, title, text, completed })
        }
    }

    const onDeleteNoteClicked = async () => {
        await deleteNote({ id: note.id })
        setShowDeleteConfirm(false)
    }

    const created = new Date(note.createdAt).toLocaleString('en-US', { 
        day: 'numeric', 
        month: 'short', 
        year: 'numeric', 
        hour: '2-digit', 
        minute: '2-digit' 
    })
    const updated = new Date(note.updatedAt).toLocaleString('en-US', { 
        day: 'numeric', 
        month: 'short', 
        year: 'numeric', 
        hour: '2-digit', 
        minute: '2-digit' 
    })

    const options = users.map(user => (
        <option key={user.id} value={user.id}>
            {user.username}
        </option>
    ))

    const errClass = (isError || isDelError) ? "errmsg" : "offscreen"
    const validTitleClass = !title ? "form__input--incomplete" : ''
    const validTextClass = !text ? "form__input--incomplete" : ''

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

    let deleteButton = null
    if (isManager || isAdmin) {
        deleteButton = (
            <motion.button
                className="flex items-center px-4 py-2 bg-red-500 text-white rounded-lg font-semibold hover:bg-red-600 transition-colors duration-200"
                title="Delete Note"
                onClick={() => setShowDeleteConfirm(true)}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
            >
                <FaTrash className="mr-2" />
                Delete
            </motion.button>
        )
    }

    const content = (
        <motion.div 
            className="max-w-4xl mx-auto p-6"
            variants={containerVariants}
            initial="hidden"
            animate="visible"
        >
            {/* Error Message */}
            <AnimatePresence>
                {errContent && (
                    <motion.div
                        className={`mb-6 p-4 rounded-xl border ${
                            errClass.includes('errmsg') 
                                ? 'bg-red-50 border-red-200 text-red-700' 
                                : 'bg-blue-50 border-blue-200 text-blue-700'
                        }`}
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                    >
                        <div className="flex items-center">
                            <FaCheckCircle className="mr-3 flex-shrink-0" />
                            <p>{errContent}</p>
                        </div>
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
                                <h3 className="text-xl font-bold text-gray-900 mb-2">Delete Note?</h3>
                                <p className="text-gray-600 mb-6">
                                    Are you sure you want to delete this note? This action cannot be undone.
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
                                        onClick={onDeleteNoteClicked}
                                    >
                                        Delete
                                    </button>
                                </div>
                            </div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Edit Form */}
            <motion.form 
                className="bg-white rounded-2xl shadow-lg border border-gray-200 overflow-hidden"
                onSubmit={e => e.preventDefault()}
                variants={itemVariants}
            >
                {/* Header */}
                <div className="bg-gradient-to-r from-blue-600 to-purple-600 px-6 py-4">
                    <div className="flex justify-between items-center">
                        <div>
                            <h2 className="text-2xl font-bold text-white flex items-center">
                                <FaEdit className="mr-3" />
                                Edit Note #{note.ticket}
                            </h2>
                            <p className="text-blue-100 text-sm mt-1">
                                Update note details and assignment
                            </p>
                        </div>
                        <div className="flex space-x-3">
                            <motion.button
                                className={`flex items-center px-4 py-2 rounded-lg font-semibold transition-all duration-200 ${
                                    canSave 
                                        ? 'bg-white text-blue-600 hover:bg-blue-50 hover:shadow-lg' 
                                        : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                                }`}
                                title="Save Changes"
                                onClick={onSaveNoteClicked}
                                disabled={!canSave}
                                whileHover={canSave ? { scale: 1.05 } : {}}
                                whileTap={canSave ? { scale: 0.95 } : {}}
                            >
                                <FaSave className="mr-2" />
                                {isLoading ? 'Saving...' : 'Save'}
                            </motion.button>
                            {deleteButton}
                        </div>
                    </div>
                </div>

                {/* Form Body */}
                <div className="p-6 space-y-6">
                    {/* Title Field */}
                    <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-2" htmlFor="note-title">
                            Note Title
                        </label>
                        <div className="relative">
                            <input
                                className={`w-full px-4 py-3 border-2 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 ${
                                    validTitleClass === 'form__input--incomplete' 
                                        ? 'border-red-300 bg-red-50' 
                                        : isFocused.title 
                                            ? 'border-blue-300 bg-blue-50' 
                                            : 'border-gray-300 bg-gray-50'
                                }`}
                                id="note-title"
                                name="title"
                                type="text"
                                autoComplete="off"
                                value={title}
                                onChange={onTitleChanged}
                                onFocus={() => setIsFocused(prev => ({ ...prev, title: true }))}
                                onBlur={() => setIsFocused(prev => ({ ...prev, title: false }))}
                                placeholder="Enter note title..."
                            />
                            {validTitleClass && (
                                <div className="absolute right-3 top-3 text-red-500">
                                    <FaTimes />
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Text Field */}
                    <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-2" htmlFor="note-text">
                            Note Content
                        </label>
                        <div className="relative">
                            <textarea
                                className={`w-full px-4 py-3 border-2 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 min-h-[150px] resize-vertical ${
                                    validTextClass === 'form__input--incomplete' 
                                        ? 'border-red-300 bg-red-50' 
                                        : isFocused.text 
                                            ? 'border-blue-300 bg-blue-50' 
                                            : 'border-gray-300 bg-gray-50'
                                }`}
                                id="note-text"
                                name="text"
                                value={text}
                                onChange={onTextChanged}
                                onFocus={() => setIsFocused(prev => ({ ...prev, text: true }))}
                                onBlur={() => setIsFocused(prev => ({ ...prev, text: false }))}
                                placeholder="Enter note content..."
                            />
                            {validTextClass && (
                                <div className="absolute right-3 top-3 text-red-500">
                                    <FaTimes />
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Status and Assignment */}
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                        {/* Left Column - Status & Assignment */}
                        <div className="space-y-6">
                            {/* Completion Status */}
                            <div className="bg-gray-50 rounded-xl p-4 border border-gray-200">
                                <label className="flex items-center cursor-pointer group" htmlFor="note-completed">
                                    <div className="relative">
                                        <input
                                            className="sr-only"
                                            id="note-completed"
                                            name="completed"
                                            type="checkbox"
                                            checked={completed}
                                            onChange={onCompletedChanged}
                                        />
                                        <div className={`w-12 h-6 rounded-full transition-colors duration-200 ${
                                            completed ? 'bg-green-500' : 'bg-gray-300'
                                        }`}>
                                            <div className={`absolute top-1 left-1 w-4 h-4 rounded-full bg-white transition-transform duration-200 ${
                                                completed ? 'transform translate-x-6' : ''
                                            }`} />
                                        </div>
                                    </div>
                                    <div className="ml-3">
                                        <span className="font-semibold text-gray-700">Work Complete</span>
                                        <p className="text-sm text-gray-500">
                                            Mark this note as completed
                                        </p>
                                    </div>
                                </label>
                            </div>

                            {/* Assignment */}
                            <div className="bg-gray-50 rounded-xl p-4 border border-gray-200">
                                <label className="block text-sm font-semibold text-gray-700 mb-3" htmlFor="note-username">
                                    <FaUser className="inline mr-2 text-blue-500" />
                                    Assigned To
                                </label>
                                <select
                                    id="note-username"
                                    name="username"
                                    className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white transition-all duration-200"
                                    value={userId}
                                    onChange={onUserIdChanged}
                                >
                                    <option value="">Select a user...</option>
                                    {options}
                                </select>
                            </div>
                        </div>

                        {/* Right Column - Timestamps */}
                        <div className="space-y-4">
                            <div className="bg-blue-50 rounded-xl p-4 border border-blue-200">
                                <div className="flex items-center mb-2">
                                    <FaCalendarAlt className="text-blue-500 mr-2" />
                                    <h3 className="font-semibold text-blue-700">Created</h3>
                                </div>
                                <p className="text-blue-600 font-medium">{created}</p>
                            </div>
                            <div className="bg-purple-50 rounded-xl p-4 border border-purple-200">
                                <div className="flex items-center mb-2">
                                    <FaClock className="text-purple-500 mr-2" />
                                    <h3 className="font-semibold text-purple-700">Last Updated</h3>
                                </div>
                                <p className="text-purple-600 font-medium">{updated}</p>
                            </div>
                        </div>
                    </div>
                </div>
            </motion.form>
        </motion.div>
    )

    return content
}

export default EditNoteForm