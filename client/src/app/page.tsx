import Image from "next/image";

export default function Home() {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Banner Section */}
      <div className="relative h-[80vh] overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-green-600/20 to-emerald-600/20 z-10"></div>
        <img
          src="https://images.unsplash.com/photo-1500382017468-9049fed747ef?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80"
          alt="Green Earth Banner"
          className="w-full h-full object-cover"
        />

        <div className="absolute inset-0 z-20 flex flex-col items-center justify-center text-white px-4">
          <h1 className="text-5xl md:text-7xl font-bold mb-4 text-center drop-shadow-lg">
            Green Mert
          </h1>
          <p className="text-xl md:text-2xl font-light mb-8 text-center max-w-2xl">
            Cultivating a sustainable future, one seed at a time
          </p>
          <button className="bg-green-600 hover:bg-green-700 text-white font-semibold py-3 px-8 rounded-full text-lg transition duration-300 transform hover:scale-105 shadow-lg">
            Explore Our Mission
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        {/* Introduction Section */}
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-6">
            Welcome to Green Mert
          </h2>
          <p className="text-lg text-gray-600 max-w-3xl mx-auto">
            We are dedicated to creating a greener, more sustainable world through innovative
            environmental solutions and community-driven initiatives. Our mission is to bridge
            the gap between nature and modern living.
          </p>
        </div>

        {/* Features Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
          <div className="bg-white p-8 rounded-xl shadow-lg hover:shadow-xl transition-shadow duration-300">
            <div className="bg-green-100 w-16 h-16 rounded-full flex items-center justify-center mb-6">
              <span className="text-3xl">🌱</span>
            </div>
            <h3 className="text-2xl font-bold text-gray-800 mb-4">Sustainable Farming</h3>
            <p className="text-gray-600">
              Innovative agricultural practices that respect the earth while maximizing yield
              through organic and eco-friendly methods.
            </p>
          </div>

          <div className="bg-white p-8 rounded-xl shadow-lg hover:shadow-xl transition-shadow duration-300">
            <div className="bg-green-100 w-16 h-16 rounded-full flex items-center justify-center mb-6">
              <span className="text-3xl">♻️</span>
            </div>
            <h3 className="text-2xl font-bold text-gray-800 mb-4">Circular Economy</h3>
            <p className="text-gray-600">
              Creating closed-loop systems where waste becomes resources, minimizing
              environmental impact and promoting sustainability.
            </p>
          </div>

          <div className="bg-white p-8 rounded-xl shadow-lg hover:shadow-xl transition-shadow duration-300">
            <div className="bg-green-100 w-16 h-16 rounded-full flex items-center justify-center mb-6">
              <span className="text-3xl">🌍</span>
            </div>
            <h3 className="text-2xl font-bold text-gray-800 mb-4">Community Impact</h3>
            <p className="text-gray-600">
              Empowering communities through education, resources, and collaborative
              projects that foster environmental stewardship.
            </p>
          </div>
        </div>

        {/* Call to Action Section */}
        <div className="bg-gradient-to-r from-green-50 to-emerald-100 rounded-2xl p-8 md:p-12 text-center">
          <h2 className="text-3xl font-bold text-gray-800 mb-6">
            Join Our Green Revolution
          </h2>
          <p className="text-lg text-gray-600 mb-8 max-w-2xl mx-auto">
            Together, we can make a difference. Whether you&apos;re an individual, business,
            or organization, there&apos;s a place for you in our mission.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button className="bg-green-600 hover:bg-green-700 text-white font-semibold py-3 px-8 rounded-full transition duration-300">
              Get Involved
            </button>
            <button className="border-2 border-green-600 text-green-600 hover:bg-green-50 font-semibold py-3 px-8 rounded-full transition duration-300">
              Learn More
            </button>
          </div>
        </div>

        {/* Stats Section */}
        <div className="mt-16 grid grid-cols-2 md:grid-cols-4 gap-8">
          <div className="text-center">
            <div className="text-4xl font-bold text-green-600 mb-2">50+</div>
            <div className="text-gray-600">Projects Completed</div>
          </div>
          <div className="text-center">
            <div className="text-4xl font-bold text-green-600 mb-2">10K+</div>
            <div className="text-gray-600">Trees Planted</div>
          </div>
          <div className="text-center">
            <div className="text-4xl font-bold text-green-600 mb-2">25+</div>
            <div className="text-gray-600">Communities Served</div>
          </div>
          <div className="text-center">
            <div className="text-4xl font-bold text-green-600 mb-2">100%</div>
            <div className="text-gray-600">Sustainable Practices</div>
          </div>
        </div>
      </div>
    </div>
  );
}
