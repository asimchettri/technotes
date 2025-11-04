import { useNavigate } from 'react-router-dom'
import { useGetNotesQuery } from './notesApiSlice'
import { memo } from 'react'
import { motion } from 'framer-motion'
import { 
  FaEdit, 
  FaCheckCircle, 
  FaClock, 
  FaUser, 
  FaCalendarAlt,
  FaStickyNote
} from "react-icons/fa"

const Note = ({ noteId }) => {
    const { note } = useGetNotesQuery("notesList", {
        selectFromResult: ({ data }) => ({
            note: data?.entities[noteId]
        }),
    })

    const navigate = useNavigate()

    if (note) {
        const created = new Date(note.createdAt).toLocaleString('en-US', { 
            day: 'numeric', 
            month: 'short', 
            year: 'numeric'
        })

        const updated = new Date(note.updatedAt).toLocaleString('en-US', { 
            day: 'numeric', 
            month: 'short', 
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        })

        const handleEdit = () => navigate(`/dash/notes/${noteId}`)

        const getStatusColor = () => {
            return note.completed 
                ? 'bg-green-100 text-green-800 border-green-200'
                : 'bg-orange-100 text-orange-800 border-orange-200'
        }

        const getStatusIcon = () => {
            return note.completed ? FaCheckCircle : FaClock
        }

        const StatusIcon = getStatusIcon()

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

        const truncateText = (text, maxLength = 100) => {
            if (text.length <= maxLength) return text
            return text.substring(0, maxLength) + '...'
        }

        return (
            <motion.div
                className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden hover:shadow-md transition-all duration-200"
                variants={cardVariants}
                initial="hidden"
                animate="visible"
                whileHover="hover"
            >
                <div className="p-6">
                    {/* Header Section */}
                    <div className="flex justify-between items-start mb-4">
                        <div className="flex items-center space-x-3">
                            <div className={`flex items-center px-3 py-1 rounded-full text-xs font-semibold border ${getStatusColor()}`}>
                                <StatusIcon className="mr-1" />
                                {note.completed ? 'Completed' : 'In Progress'}
                            </div>
                            <div className="text-xs text-gray-500 flex items-center">
                                <FaCalendarAlt className="mr-1" />
                                #{note.ticket}
                            </div>
                        </div>
                        
                        <motion.button
                            className="flex items-center justify-center w-10 h-10 bg-blue-50 text-blue-600 rounded-lg hover:bg-blue-100 hover:text-blue-700 transition-colors duration-200"
                            onClick={handleEdit}
                            whileHover={{ scale: 1.1, rotate: 5 }}
                            whileTap={{ scale: 0.9 }}
                            title="Edit Note"
                        >
                            <FaEdit className="text-sm" />
                        </motion.button>
                    </div>

                    {/* Title Section */}
                    <h3 className="text-lg font-semibold text-gray-900 mb-3 line-clamp-2">
                        {note.title}
                    </h3>

                    {/* Content Preview */}
                    <p className="text-gray-600 text-sm mb-4 line-clamp-3">
                        {truncateText(note.text)}
                    </p>

                    {/* Footer Section */}
                    <div className="flex justify-between items-center pt-4 border-t border-gray-100">
                        <div className="flex items-center space-x-4 text-sm text-gray-500">
                            {/* Author */}
                            <div className="flex items-center">
                                <FaUser className="mr-2 text-gray-400" />
                                <span className="font-medium text-gray-700">{note.username}</span>
                            </div>
                            
                            {/* Timestamps */}
                            <div className="flex items-center space-x-4">
                                <div className="flex items-center" title={`Created: ${created}`}>
                                    <FaStickyNote className="mr-1 text-gray-400" />
                                    <span className="text-xs">{created}</span>
                                </div>
                                {note.updatedAt !== note.createdAt && (
                                    <div className="flex items-center" title={`Updated: ${updated}`}>
                                        <FaEdit className="mr-1 text-gray-400" />
                                        <span className="text-xs">{updated.split(',')[0]}</span>
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Quick Actions */}
                        <div className="flex items-center space-x-2">
                            {!note.completed && (
                                <motion.div
                                    className="w-2 h-2 bg-orange-500 rounded-full animate-pulse"
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    transition={{ delay: 0.5 }}
                                />
                            )}
                        </div>
                    </div>
                </div>

                {/* Progress Bar for Completed Notes */}
                {note.completed && (
                    <div className="h-1 bg-gradient-to-r from-green-400 to-green-600"></div>
                )}
                
                {/* Progress Bar for Incomplete Notes */}
                {!note.completed && (
                    <div className="h-1 bg-gradient-to-r from-orange-400 to-orange-600">
                        <motion.div
                            className="h-full bg-gradient-to-r from-orange-500 to-orange-600"
                            initial={{ width: "0%" }}
                            animate={{ width: "70%" }}
                            transition={{ duration: 1, delay: 0.5 }}
                        />
                    </div>
                )}
            </motion.div>
        )

    } else return (
        <motion.div
            className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 animate-pulse"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
        >
            <div className="flex justify-between items-start mb-4">
                <div className="h-6 bg-gray-200 rounded w-1/4"></div>
                <div className="h-8 bg-gray-200 rounded w-8"></div>
            </div>
            <div className="h-5 bg-gray-200 rounded w-3/4 mb-3"></div>
            <div className="space-y-2 mb-4">
                <div className="h-4 bg-gray-200 rounded"></div>
                <div className="h-4 bg-gray-200 rounded w-5/6"></div>
            </div>
            <div className="flex justify-between items-center pt-4 border-t border-gray-100">
                <div className="h-4 bg-gray-200 rounded w-1/3"></div>
                <div className="h-4 bg-gray-200 rounded w-1/4"></div>
            </div>
        </motion.div>
    )
}

const memoizedNote = memo(Note)

export default memoizedNote