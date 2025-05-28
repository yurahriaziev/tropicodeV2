export default function Hero() {
    return (
        <section className="relative bg-gradient-to-br from-purple-600 to-green-500 py-16 md:py-24">
            <div className="absolute inset-0 opacity-10">
            <div className="absolute inset-0 bg-[url('/placeholder.svg?height=800&width=1600')] bg-cover bg-center" />
            </div>
            <div className="container mx-auto px-4 relative z-10">
            <div className="flex flex-col md:flex-row items-center">
                <div className="md:w-1/2 text-white mb-10 md:mb-0">
                <h1 className="text-4xl md:text-5xl font-bold mb-4">Level Up Your Tech Skills with Tropicode</h1>
                <p className="text-lg md:text-xl mb-8">
                    Empowering young minds to master programming, game development, VR, and 3D printing in a fun and
                    engaging environment.
                </p>
                <div className="flex flex-col sm:flex-row gap-4">
                    <a
                        href="#courses"
                        className="px-6 py-3 bg-white text-purple-700 font-semibold text-center rounded-md shadow hover:bg-gray-100 transition"
                    >
                        Explore Courses Now
                    </a>
                </div>
                </div>
                <div className="md:w-1/2 flex justify-center">
                <div className="relative w-full max-w-md h-[300px] md:h-[400px]">
                    <img
                        src="/images/purple-mascot.png"
                        alt="Tropicode mascot"
                        className="object-contain h-full w-full rounded-2xl drop-shadow-lg -scale-x-100"
                    />
                </div>
                </div>
            </div>
            </div>
        </section>
    )
}