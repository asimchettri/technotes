import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FaTools, FaMapMarkerAlt, FaPhone, FaUser, FaArrowRight } from 'react-icons/fa';

const Public = () => {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2
      }
    }
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        duration: 0.6
      }
    }
  };

  const content = (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 relative overflow-hidden">
      {/* Background Elements */}
      <div className="absolute inset-0 bg-grid-pattern opacity-5"></div>
      <div className="absolute top-10 left-10 w-72 h-72 bg-blue-200 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob"></div>
      <div className="absolute top-20 right-10 w-72 h-72 bg-purple-200 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob animation-delay-2000"></div>
      <div className="absolute bottom-20 left-20 w-72 h-72 bg-indigo-200 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob animation-delay-4000"></div>

      <motion.section 
        className="public relative z-10 min-h-screen flex flex-col justify-center items-center px-4 py-8"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        {/* Header */}
        <motion.header 
          className="text-center mb-12"
          variants={itemVariants}
        >
          <div className="flex justify-center items-center mb-6">
            <div className="w-16 h-16 bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl flex items-center justify-center shadow-lg">
              <FaTools className="text-white text-2xl" />
            </div>
          </div>
          <h1 className="text-5xl md:text-6xl font-bold text-gray-900 mb-4">
            Welcome to{' '}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600">
              Ashim P. Repairs
            </span>
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Your trusted partner for all tech repair solutions in Nepal
          </p>
        </motion.header>

        {/* Main Content */}
        <motion.main 
          className="public__main w-full max-w-4xl mx-auto"
          variants={itemVariants}
        >
          <div className="grid md:grid-cols-2 gap-8 mb-12">
            {/* Left Column - Description */}
            <motion.div 
              className="bg-white rounded-2xl p-8 shadow-xl border border-gray-100"
              whileHover={{ y: -5 }}
              transition={{ type: "spring", stiffness: 300 }}
            >
              <div className="flex items-center mb-4">
                <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center mr-3">
                  <FaTools className="text-blue-600" />
                </div>
                <h2 className="text-2xl font-semibold text-gray-900">Our Services</h2>
              </div>
              <p className="text-gray-700 text-lg leading-relaxed mb-6">
                Located in the heart of Nepal, <strong>Ashim P. Repairs</strong> provides a highly trained 
                technical staff ready to meet all your technology repair needs with precision and care.
              </p>
              <ul className="space-y-3 text-gray-600">
                <li className="flex items-center">
                  <div className="w-2 h-2 bg-blue-500 rounded-full mr-3"></div>
                  Computer & Laptop Repairs
                </li>
                <li className="flex items-center">
                  <div className="w-2 h-2 bg-blue-500 rounded-full mr-3"></div>
                  Mobile Device Services
                </li>
                <li className="flex items-center">
                  <div className="w-2 h-2 bg-blue-500 rounded-full mr-3"></div>
                  Data Recovery Solutions
                </li>
                <li className="flex items-center">
                  <div className="w-2 h-2 bg-blue-500 rounded-full mr-3"></div>
                  Hardware Upgrades
                </li>
              </ul>
            </motion.div>

            {/* Right Column - Contact Info */}
            <motion.div 
              className="bg-gradient-to-br from-blue-600 to-purple-600 rounded-2xl p-8 shadow-xl text-white"
              whileHover={{ y: -5 }}
              transition={{ type: "spring", stiffness: 300 }}
            >
              <h2 className="text-2xl font-semibold mb-6">Get In Touch</h2>
              
              <div className="space-y-6">
                <div className="flex items-start">
                  <div className="w-10 h-10 bg-white bg-opacity-20 rounded-lg flex items-center justify-center mr-4 mt-1">
                    <FaMapMarkerAlt className="text-white" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-white text-lg">Visit Our Shop</h3>
                    <address className="not-italic text-blue-100 mt-2">
                      Ashim P. Repairs<br />
                      Tech Hub Center, Kathmandu<br />
                      Bagmati Province, Nepal 44600<br />
                    </address>
                  </div>
                </div>

                <div className="flex items-start">
                  <div className="w-10 h-10 bg-white bg-opacity-20 rounded-lg flex items-center justify-center mr-4 mt-1">
                    <FaPhone className="text-white" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-white text-lg">Call Us</h3>
                    <a 
                      href="tel:+977123456789" 
                      className="text-blue-100 hover:text-white transition-colors duration-200 text-lg font-medium block mt-2"
                    >
                      +977 123-456-789
                    </a>
                  </div>
                </div>

                <div className="flex items-start">
                  <div className="w-10 h-10 bg-white bg-opacity-20 rounded-lg flex items-center justify-center mr-4 mt-1">
                    <FaUser className="text-white" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-white text-lg">Owner</h3>
                    <p className="text-blue-100 mt-2">Ashim P.</p>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </motion.main>

        {/* Footer */}
        <motion.footer 
          className="text-center mt-8"
          variants={itemVariants}
        >
          <Link 
            to="/login"
            className="group inline-flex items-center px-8 py-4 bg-white text-gray-900 rounded-xl shadow-lg hover:shadow-xl transform hover:-translate-y-1 transition-all duration-300 font-semibold text-lg border border-gray-200 hover:border-blue-300"
          >
            Employee Login
            <FaArrowRight className="ml-3 transform group-hover:translate-x-1 transition-transform duration-200" />
          </Link>
          
          {/* Additional Info */}
          <div className="mt-12 text-center">
            <div className="flex flex-wrap justify-center gap-8 text-gray-600 mb-6">
              <div className="text-center">
                <div className="text-2xl font-bold text-blue-600">500+</div>
                <div className="text-sm">Devices Repaired</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-purple-600">98%</div>
                <div className="text-sm">Success Rate</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-indigo-600">24/7</div>
                <div className="text-sm">Support</div>
              </div>
            </div>
            <p className="text-gray-500 text-sm">
              Trusted by customers across Nepal since 2020
            </p>
          </div>
        </motion.footer>
      </motion.section>
    </div>
  );

  return content;
};

export default Public;