import React, { useState } from 'react';

const Contact: React.FC = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  });

  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Simulate form submission
    setTimeout(() => {
      setIsSubmitted(true);
    }, 1000);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  return (
    <section className="py-16 bg-gray-900 min-h-screen">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div 
          className="text-center mb-12"
          data-aos="fade-up"
        >
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4 font-orbitron">
            Get in Touch
          </h2>
          <p className="text-xl text-gray-300 font-inter">
            Have questions? We're here to help you get the most out of PlayMatch
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Contact Info */}
          <div 
            className="space-y-8"
            data-aos="fade-up"
            data-aos-delay="200"
          >
            <div className="bg-gray-800 rounded-lg p-6 shadow-lg">
              <h3 className="text-2xl font-bold text-white mb-6 font-orbitron">Contact Information</h3>
              
              <div className="space-y-4">
                <div className="flex items-center">
                  <div className="bg-emerald-600 rounded-full p-3 mr-4">
                    <i className="fas fa-envelope text-white"></i>
                  </div>
                  <div>
                    <p className="text-gray-300">Email</p>
                    <p className="text-white font-semibold">support@playmatch.com</p>
                  </div>
                </div>
                
                <div className="flex items-center">
                  <div className="bg-emerald-600 rounded-full p-3 mr-4">
                    <i className="fas fa-phone text-white"></i>
                  </div>
                  <div>
                    <p className="text-gray-300">Phone</p>
                    <p className="text-white font-semibold">+91 98765 43210</p>
                  </div>
                </div>
                
                <div className="flex items-center">
                  <div className="bg-emerald-600 rounded-full p-3 mr-4">
                    <i className="fas fa-map-marker-alt text-white"></i>
                  </div>
                  <div>
                    <p className="text-gray-300">Address</p>
                    <p className="text-white font-semibold">123 Sports Avenue, Game City</p>
                  </div>
                </div>
              </div>
            </div>

            {/* FAQ Section */}
            <div className="bg-gray-800 rounded-lg p-6 shadow-lg">
              <h3 className="text-xl font-bold text-white mb-4 font-orbitron">Quick Help</h3>
              <div className="space-y-3">
                <details className="text-gray-300">
                  <summary className="cursor-pointer hover:text-emerald-400 transition-colors">
                    How do I join a match?
                  </summary>
                  <p className="mt-2 text-sm text-gray-400">
                    Use our matchmaking feature to find matches based on your preferences, then click "Join Match".
                  </p>
                </details>
                
                <details className="text-gray-300">
                  <summary className="cursor-pointer hover:text-emerald-400 transition-colors">
                    Can I book turfs in advance?
                  </summary>
                  <p className="mt-2 text-sm text-gray-400">
                    Yes! You can book turfs up to 30 days in advance through our booking system.
                  </p>
                </details>
                
                <details className="text-gray-300">
                  <summary className="cursor-pointer hover:text-emerald-400 transition-colors">
                    How do I create a team?
                  </summary>
                  <p className="mt-2 text-sm text-gray-400">
                    Go to the Teams section and click "Create New Team". Fill in the details and invite players.
                  </p>
                </details>
              </div>
            </div>
          </div>

          {/* Contact Form */}
          <div 
            className="bg-gray-800 rounded-lg p-8 shadow-lg"
            data-aos="fade-up"
            data-aos-delay="400"
          >
            {!isSubmitted ? (
              <form onSubmit={handleSubmit} className="space-y-6">
                <h3 className="text-2xl font-bold text-white mb-6 font-orbitron">Send us a Message</h3>
                
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">Name</label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    required
                    className="w-full bg-gray-700 border border-gray-600 text-white rounded-lg px-4 py-3 focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                    placeholder="Your full name"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">Email</label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                    className="w-full bg-gray-700 border border-gray-600 text-white rounded-lg px-4 py-3 focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                    placeholder="your@email.com"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">Subject</label>
                  <select
                    name="subject"
                    value={formData.subject}
                    onChange={handleChange}
                    required
                    className="w-full bg-gray-700 border border-gray-600 text-white rounded-lg px-4 py-3 focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                  >
                    <option value="">Select a subject</option>
                    <option value="general">General Inquiry</option>
                    <option value="technical">Technical Support</option>
                    <option value="booking">Booking Issues</option>
                    <option value="feedback">Feedback</option>
                    <option value="partnership">Partnership</option>
                  </select>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">Message</label>
                  <textarea
                    name="message"
                    value={formData.message}
                    onChange={handleChange}
                    required
                    rows={5}
                    className="w-full bg-gray-700 border border-gray-600 text-white rounded-lg px-4 py-3 focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                    placeholder="Tell us how we can help you..."
                  ></textarea>
                </div>
                
                <button
                  type="submit"
                  className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-semibold py-3 rounded-lg transition-all duration-300 transform hover:scale-105 shadow-lg"
                >
                  <i className="fas fa-paper-plane mr-2"></i>
                  Send Message
                </button>
              </form>
            ) : (
              <div className="text-center py-8">
                <i className="fas fa-check-circle text-6xl text-emerald-400 mb-4"></i>
                <h3 className="text-2xl font-bold text-white mb-2 font-orbitron">Message Sent!</h3>
                <p className="text-gray-300 mb-6">
                  Thank you for contacting us. We'll get back to you within 24 hours.
                </p>
                <button
                  onClick={() => {
                    setIsSubmitted(false);
                    setFormData({ name: '', email: '', subject: '', message: '' });
                  }}
                  className="bg-emerald-600 hover:bg-emerald-700 text-white font-semibold py-2 px-6 rounded-lg transition-all duration-300"
                >
                  Send Another Message
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
};

export default Contact;