import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { collection, getDocs, doc, updateDoc, deleteDoc } from 'firebase/firestore';
import { db } from '../firebase/config';
import { FiMail, FiSearch, FiEye, FiTrash2, FiAlertCircle, FiUser, FiClock } from 'react-icons/fi';
import { format } from 'date-fns';

export default function ManageMessages() {
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filter, setFilter] = useState('all');

  useEffect(() => {
    const fetchMessages = async () => {
      try {
        let q = collection(db, 'messages');
        
        if (filter !== 'all') {
          q = query(q, where('isRead', '==', filter === 'read'));
        }

        const querySnapshot = await getDocs(q);
        const messagesData = querySnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data(),
          createdAt: doc.data().createdAt?.toDate()
        }));
        
        messagesData.sort((a, b) => b.createdAt - a.createdAt);
        setMessages(messagesData);
      } catch (error) {
        console.error('Error fetching messages:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchMessages();
  }, [filter]);

  const handleMarkAsRead = async (id, name) => {
    if (window.confirm(`Mark message from ${name} as read?`)) {
      try {
        await updateDoc(doc(db, 'messages', id), { isRead: true });
        setMessages(messages.map(msg => 
          msg.id === id ? { ...msg, isRead: true } : msg
        ));
      } catch (error) {
        console.error('Error updating message:', error);
      }
    }
  };

  const handleDelete = async (id, name) => {
    if (window.confirm(`Delete message from ${name}?`)) {
      try {
        await deleteDoc(doc(db, 'messages', id));
        setMessages(messages.filter(msg => msg.id !== id));
      } catch (error) {
        console.error('Error deleting message:', error);
      }
    }
  };

  const filteredMessages = messages.filter(msg => {
    const searchLower = searchTerm.toLowerCase();
    return (
      msg.fullName?.toLowerCase().includes(searchLower) ||
      msg.email?.toLowerCase().includes(searchLower) ||
      msg.message?.toLowerCase().includes(searchLower) ||
      msg.phone?.includes(searchTerm)
    );
  });

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#55C15C]"></div>
      </div>
    );
  }

  return (
    <div className="p-6">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6 gap-4">
        <div>
          <h1 className="text-2xl font-bold">Customer Inquiries</h1>
          <p className="text-gray-600">Manage and respond to customer messages</p>
        </div>
        <div className="flex items-center space-x-2 text-sm text-gray-500">
          <FiClock className="h-4 w-4" />
          <span>Last updated: {new Date().toLocaleTimeString()}</span>
        </div>
      </div>

      {/* Filters and Search */}
      <div className="bg-white rounded-xl shadow-sm p-4 mb-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <FiSearch className="h-5 w-5 text-gray-400" />
            </div>
            <input
              type="text"
              placeholder="Search by name, email, phone, or message..."
              className="block w-full pl-10 pr-3 py-2 border border-gray-200 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-[#55C15C] focus:border-[#55C15C]"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          
          <div className="flex items-center space-x-2">
            <FiMail className="h-5 w-5 text-gray-400" />
            <select
              value={filter}
              onChange={(e) => setFilter(e.target.value)}
              className="block w-full pl-3 pr-10 py-2 text-base border border-gray-200 focus:outline-none focus:ring-2 focus:ring-[#55C15C] focus:border-[#55C15C] rounded-lg"
            >
              <option value="all">All Messages</option>
              <option value="unread">Unread Only</option>
              <option value="read">Read Only</option>
            </select>
          </div>
        </div>
      </div>

      {/* Messages List */}
      <div className="bg-white rounded-xl shadow-sm overflow-hidden">
        {filteredMessages.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Customer
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Message Preview
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Contact Info
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Received
                  </th>
                  <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredMessages.map((msg) => (
                  <motion.tr 
                    key={msg.id}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    whileHover={{ backgroundColor: 'rgba(85, 193, 92, 0.05)' }}
                    className={`transition-colors ${!msg.isRead ? 'bg-blue-50' : ''}`}
                  >
                    <td className="px-6 py-4">
                      <div className="flex items-center">
                        <div className="flex-shrink-0 h-10 w-10 rounded-full bg-[#55C15C] bg-opacity-10 flex items-center justify-center text-[#55C15C]">
                          <FiUser className="h-5 w-5" />
                        </div>
                        <div className="ml-4">
                          <div className="text-sm font-semibold text-gray-900">{msg.fullName}</div>
                          {!msg.isRead && (
                            <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-blue-100 text-blue-800">
                              New
                            </span>
                          )}
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-sm text-gray-900 line-clamp-2">{msg.message}</div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-sm text-gray-900">{msg.email}</div>
                      {msg.phone && (
                        <div className="text-sm text-gray-500">{msg.phone}</div>
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {format(msg.createdAt, 'MMM dd, h:mm a')}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium space-x-2">
                      {!msg.isRead && (
                        <button
                          onClick={() => handleMarkAsRead(msg.id, msg.fullName)}
                          className="text-[#55C15C] hover:text-[#43A2CB] inline-flex items-center"
                        >
                          <FiEye className="mr-1" /> Mark Read
                        </button>
                      )}
                      <button
                        onClick={() => handleDelete(msg.id, msg.fullName)}
                        className="text-red-600 hover:text-red-800 inline-flex items-center"
                      >
                        <FiTrash2 className="mr-1" /> Delete
                      </button>
                    </td>
                  </motion.tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="text-center py-12">
            <FiAlertCircle className="mx-auto h-12 w-12 text-gray-400" />
            <h3 className="mt-2 text-lg font-medium text-gray-900">No messages found</h3>
            <p className="mt-1 text-sm text-gray-500">
              {searchTerm ? 'Try adjusting your search or filter' : 'All messages are processed'}
            </p>
          </div>
        )}
      </div>
    </div>
  );
}