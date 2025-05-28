export default function ContactSection() {
    return (
        <section id="contact" className="py-20 bg-gradient-to-b from-white to-blue-50">
            <div className="max-w-2xl mx-auto px-6">
                <div className="bg-white rounded-xl shadow-lg p-8 md:p-10">
                <div className="text-center mb-8">
                    <h2 className="text-3xl font-extrabold text-gray-800">
                    Request <span className="text-purple-600">Info</span>
                    </h2>
                </div>

                <form className="space-y-4">
                    {/* Parent info */}
                    <input
                    type="text"
                    placeholder="Parent First Name*"
                    className="w-full bg-blue-50 p-3 rounded-md border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-400"
                    />
                    <input
                    type="text"
                    placeholder="Parent Last Name*"
                    className="w-full bg-blue-50 p-3 rounded-md border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-400"
                    />
                    <input
                    type="tel"
                    placeholder="(000) - 000 - 0000*"
                    className="w-full bg-blue-50 p-3 rounded-md border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-400"
                    />
                    <input
                    type="email"
                    placeholder="Email*"
                    className="w-full bg-blue-50 p-3 rounded-md border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-400"
                    />

                    {/* Child info */}
                    <input
                    type="text"
                    placeholder="Child First Name"
                    className="w-full bg-blue-50 p-3 rounded-md border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-400"
                    />
                    <input
                    type="text"
                    placeholder="Child Last Name"
                    className="w-full bg-blue-50 p-3 rounded-md border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-400"
                    />

                    {/* Submit button */}
                    <div className="pt-4">
                    <button
                        type="submit"
                        className="w-full py-3 bg-green-500 hover:bg-green-600 text-white font-bold text-base rounded-md shadow transition"
                    >
                        SUBMIT INFO
                    </button>
                    </div>
                </form>
                </div>
            </div>
            </section>
    )
}