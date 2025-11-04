import { useGetNotesQuery } from "./notesApiSlice"
import Note from "./Note"
import useAuth from "../../hooks/useAuth"
import useTitle from "../../hooks/useTitle"
import { motion, AnimatePresence } from 'framer-motion'
import { 
  FaSearch, 
  FaFilter, 
  FaSort, 
  FaExclamationTriangle,
  FaPlus,
  FaSync,
  FaUsers,
  FaStickyNote
} from "react-icons/fa"
import { useState, useMemo } from 'react'
import PulseLoader from 'react-spinners/PulseLoader'

const NotesList = () => {
    useTitle('TechNotes: Notes List')

    const { username, isManager, isAdmin } = useAuth()
    const [searchTerm, setSearchTerm] = useState('')
    const [statusFilter, setStatusFilter] = useState('all')
    const [sortBy, setSortBy] = useState('newest')

    const {
        data: notes,
        isLoading,
        isSuccess,
        isError,
        error,
        refetch
    } = useGetNotesQuery('notesList', {
        pollingInterval: 15000,
        refetchOnFocus: true,
        refetchOnMountOrArgChange: true
    })

    
    const filteredAndSortedNotes = useMemo(() => {
        if (!isSuccess || !notes.ids) return []

        let filteredIds = [...notes.ids]
        
        console.log('All note IDs:', filteredIds);
        console.log('Current user:', username);
        console.log('User role - isManager:', isManager, 'isAdmin:', isAdmin);

    
        if (!isManager && !isAdmin) {
            console.log('Filtering notes for employee view');
            const employeeNotes = filteredIds.filter(noteId => {
                const note = notes.entities[noteId]
                console.log(`Note ${noteId}: username="${note.username}", current user="${username}"`);
                return note.username === username
            })
            console.log('Employee notes found:', employeeNotes.length);
            filteredIds = employeeNotes
        } else {
            console.log('Showing all notes for manager/admin');
        }

        if (searchTerm) {
            filteredIds = filteredIds.filter(noteId => {
                const note = notes.entities[noteId]
                return note.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                       note.text.toLowerCase().includes(searchTerm.toLowerCase()) ||
                       note.username.toLowerCase().includes(searchTerm.toLowerCase())
            })
        }


        if (statusFilter !== 'all') {
            filteredIds = filteredIds.filter(noteId => {
                const note = notes.entities[noteId]
                return statusFilter === 'completed' ? note.completed : !note.completed
            })
        }

        
        filteredIds.sort((a, b) => {
            const noteA = notes.entities[a]
            const noteB = notes.entities[b]
            
            switch (sortBy) {
                case 'newest':
                    return new Date(noteB.createdAt) - new Date(noteA.createdAt)
                case 'oldest':
                    return new Date(noteA.createdAt) - new Date(noteB.createdAt)
                case 'updated':
                    return new Date(noteB.updatedAt) - new Date(noteA.updatedAt)
                case 'title':
                    return noteA.title.localeCompare(noteB.title)
                case 'status':
                    return noteA.completed === noteB.completed ? 0 : noteA.completed ? 1 : -1
                default:
                    return 0
            }
        })

        console.log('Final filtered notes count:', filteredIds.length);
        return filteredIds.map(noteId => notes.entities[noteId])
    }, [notes, isSuccess, isManager, isAdmin, username, searchTerm, statusFilter, sortBy])

    

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

    let content

    if (isLoading) {
        content = (
            <div className="flex justify-center items-center min-h-64">
                <div className="text-center">
                    <PulseLoader color="#4f46e5" size={15} />
                    <p className="mt-4 text-gray-600">Loading notes...</p>
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
                <h3 className="text-red-800 font-semibold text-lg mb-2">Failed to Load Notes</h3>
                <p className="text-red-600 mb-4">{error?.data?.message || 'An error occurred while loading notes'}</p>
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
                                <FaStickyNote className="mr-3 text-blue-500" />
                                Technical Notes
                            </h1>
                            <p className="text-gray-600 mt-1">
                                {isManager || isAdmin ? 'All team notes' : 'Your personal notes'}
                            </p>
                        </div>
                        
                        <div className="flex items-center space-x-3">
                            <button
                                onClick={refetch}
                                className="flex items-center px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors duration-200"
                                title="Refresh Notes"
                            >
                                <FaSync className="mr-2" />
                                Refresh
                            </button>
                            
                            <button
                                onClick={() => window.location.href = '/dash/notes/new'}
                                className="flex items-center px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors duration-200"
                            >
                                <FaPlus className="mr-2" />
                                New Note
                            </button>
                        </div>
                    </div>
                </motion.div>

                {/* Stats and Filters */}
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
                                placeholder="Search notes by title, content, or author..."
                                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200"
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                            />
                        </div>

                        {/* Filters */}
                        <div className="flex flex-wrap gap-3">
                            {/* Status Filter */}
                            <select
                                className="px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200"
                                value={statusFilter}
                                onChange={(e) => setStatusFilter(e.target.value)}
                            >
                                <option value="all">All Status</option>
                                <option value="completed">Completed</option>
                                <option value="open">Open</option>
                            </select>

                            {/* Sort By */}
                            <select
                                className="px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200"
                                value={sortBy}
                                onChange={(e) => setSortBy(e.target.value)}
                            >
                                <option value="newest">Newest First</option>
                                <option value="oldest">Oldest First</option>
                                <option value="updated">Recently Updated</option>
                                <option value="title">Title A-Z</option>
                                <option value="status">Status</option>
                            </select>
                        </div>
                    </div>

                    {/* Stats */}
                    <div className="mt-6 grid grid-cols-1 md:grid-cols-4 gap-4">
                        <div className="bg-blue-50 rounded-xl p-4 border border-blue-200">
                            <div className="text-2xl font-bold text-blue-600">{filteredAndSortedNotes.length}</div>
                            <div className="text-sm text-blue-700">Total Notes</div>
                        </div>
                        <div className="bg-green-50 rounded-xl p-4 border border-green-200">
                            <div className="text-2xl font-bold text-green-600">
                                {filteredAndSortedNotes.filter(note => note.completed).length}
                            </div>
                            <div className="text-sm text-green-700">Completed</div>
                        </div>
                        <div className="bg-orange-50 rounded-xl p-4 border border-orange-200">
                            <div className="text-2xl font-bold text-orange-600">
                                {filteredAndSortedNotes.filter(note => !note.completed).length}
                            </div>
                            <div className="text-sm text-orange-700">In Progress</div>
                        </div>
                        <div className="bg-purple-50 rounded-xl p-4 border border-purple-200">
                            <div className="text-2xl font-bold text-purple-600">
                                {new Set(filteredAndSortedNotes.map(note => note.username)).size}
                            </div>
                            <div className="text-sm text-purple-700">Team Members</div>
                        </div>
                    </div>
                </motion.div>

                {/* Notes Grid */}
                <motion.div variants={itemVariants}>
                    <AnimatePresence mode="wait">
                        {filteredAndSortedNotes.length > 0 ? (
                            <motion.div
                                key="notes-grid"
                                className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6"
                                initial="hidden"
                                animate="visible"
                                exit="hidden"
                            >
                                {filteredAndSortedNotes.map((note, index) => (
                                    <motion.div
                                        key={note.id}
                                        initial={{ opacity: 0, y: 20 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{ delay: index * 0.1 }}
                                    >
                                        <Note noteId={note.id} />
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
                                <FaStickyNote className="text-gray-400 text-5xl mx-auto mb-4" />
                                <h3 className="text-xl font-semibold text-gray-900 mb-2">No notes found</h3>
                                <p className="text-gray-600 mb-6">
                                    {searchTerm || statusFilter !== 'all' 
                                        ? 'Try adjusting your search or filters to find what you\'re looking for.'
                                        : isManager || isAdmin 
                                            ? 'No notes have been created yet.'
                                            : "You haven't created any notes yet."
                                    }
                                </p>
                                {!searchTerm && statusFilter === 'all' && (
                                    <button
                                        onClick={() => window.location.href = '/dash/notes/new'}
                                        className="bg-blue-500 text-white px-6 py-3 rounded-lg hover:bg-blue-600 transition-colors duration-200"
                                    >
                                        {isManager || isAdmin ? 'Create First Note' : 'Create Your First Note'}
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

export default NotesList