
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

const About = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const handleJoinClick = () => {
    if (!user) {
      navigate('/signup');
    }
  };
  return (
    <div className="max-w-3xl mx-auto py-16 px-4 bg-white rounded-xl shadow-lg">
    <h1 className="text-5xl font-extrabold mb-6 text-green-700 text-center drop-shadow-lg">Green Reuse Exchange</h1>
    <div className="flex justify-center mb-8">
      <span className="inline-block px-6 py-2 bg-green-100 text-green-800 rounded-full font-semibold text-lg shadow">Building a Greener Future, Together</span>
    </div>
    <p className="text-xl text-gray-800 mb-6 text-center">
      <span className="font-bold text-green-600">Green Reuse Exchange</span> is a vibrant, community-powered platform designed to reduce waste and promote sustainability. Our aim is to connect people who want to give away items they no longer need with those who can use them, fostering a culture of sharing and environmental responsibility.
    </p>
    <div className="mb-8">
      <h2 className="text-2xl font-bold text-green-700 mb-2">Who Can Access?</h2>
      <ul className="list-disc list-inside text-lg text-gray-700">
        <li><span className="font-semibold text-green-600">Everyone!</span> Whether you're a student, family, business, or eco-enthusiast, our platform is open to all who care about sustainability and community.</li>
        <li>Browse, post, and claim reusable items in categories like books, clothing, electronics, furniture, and more.</li>
        <li>All exchanges are free, secure, and designed to make giving and receiving easy.</li>
      </ul>
    </div>
    <div className="mb-8">
      <h2 className="text-2xl font-bold text-green-700 mb-2">Our Mission</h2>
      <p className="text-lg text-gray-700">
        By extending the life cycle of products and encouraging responsible consumption, we help create a cleaner, greener world. Every item exchanged is a step towards a more sustainable future.
      </p>
    </div>
    <div className="flex justify-center">
      <button
        className={`inline-block px-8 py-3 text-xl font-bold rounded-full shadow-lg focus:outline-none focus:ring-2 focus:ring-green-500 transition-transform duration-300 
          ${user ? 'bg-gray-400 text-gray-200 cursor-not-allowed' : 'bg-gradient-to-r from-green-400 to-green-700 text-white hover:scale-105'}`}
        onClick={handleJoinClick}
        disabled={!!user}
      >
        Join the Movement &rarr;
      </button>
    </div>
  </div>
  );
};

export default About;
