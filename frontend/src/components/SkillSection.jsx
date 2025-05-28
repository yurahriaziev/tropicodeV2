import SkillCard from './SkillCard';

export default function SkillSection() {
    return (
        <section className="py-16 bg-white">
            <div className="container mx-auto px-4">
                <div className="text-center mb-12">
                    <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-4">Tech Skills for the Future</h2>
                    <p className="text-lg text-gray-600 max-w-3xl mx-auto">
                    Our expert-led courses are designed to make learning technology fun and accessible for students of all
                    ages.
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                    <SkillCard
                        title="Programming"
                        description="Learn Python, JavaScript, and coding fundamentals through interactive projects."
                        icon={<span className="text-2xl">{'<>'}</span>}
                        topics={['Python', 'JavaScript', 'Logic & Algorithms']}
                        link="#courses"
                    />
                    <SkillCard
                        title="Programming"
                        description="Learn Python, JavaScript, and coding fundamentals through interactive projects."
                        icon={<span className="text-2xl">{'<>'}</span>}
                        topics={['Python', 'JavaScript', 'Logic & Algorithms']}
                        link="#courses"
                    />
                    <SkillCard
                        title="Programming"
                        description="Learn Python, JavaScript, and coding fundamentals through interactive projects."
                        icon={<span className="text-2xl">{'<>'}</span>}
                        topics={['Python', 'JavaScript', 'Logic & Algorithms']}
                        link="#courses"
                    />
                    <SkillCard
                        title="Programming"
                        description="Learn Python, JavaScript, and coding fundamentals through interactive projects."
                        icon={<span className="text-2xl">{'<>'}</span>}
                        topics={['Python', 'JavaScript', 'Logic & Algorithms']}
                        link="#courses"
                    />
                </div>
            </div>
        </section> 
    )
}