export default function WelcomeBanner({ name }) {
    return (
        
        <section className={`bg-green-50 dark:bg-[#1f1d25] py-6 px-4 sm:px-8 md:px-16`}>
            
            <div className="max-w-7xl mx-auto">
                <h1 className={`text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white`}>
                    Welcome back, <span className={`text-teal-600 dark:text-[#d3fc72]`}>{name}</span>
                </h1>
            </div>
        </section>
    )
}