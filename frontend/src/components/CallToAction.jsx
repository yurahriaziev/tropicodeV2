export default function CallToAction() {
    return (
        <section className="py-16 bg-purple-600">
        <div className="container mx-auto px-4">
          <div className="bg-white rounded-xl shadow-xl p-8 md:p-12 max-w-5xl mx-auto">
            <div className="flex flex-col md:flex-row items-center">
              <div className="md:w-2/3 mb-8 md:mb-0 md:pr-8">
                <h2 className="text-3xl font-bold text-gray-800 mb-4">Ready to Start Your Tech Journey?</h2>
                <p className="text-lg text-gray-600 mb-6">
                  Join Tropicode today and give your child the skills they need for the future. Our first lesson is
                  free!
                </p>
                <button className="px-6 py-3 bg-green-600 hover:bg-green-700 text-white text-base font-semibold rounded-lg transition">
                    Get Started Free
                </button>
              </div>
              <div className="md:w-1/3">
                <img
                    src="/images/purple-mascot.png"
                    alt="Tropicode mascot"
                    className="h-40 md:h-56 object-contain -scale-x-100"
                />
              </div>
            </div>
          </div>
        </div>
      </section>
    )
}