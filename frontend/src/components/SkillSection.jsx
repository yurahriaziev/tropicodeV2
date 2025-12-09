import SkillCard from './SkillCard';
import { FaLaptopCode, FaCode, FaCubes, FaGamepad } from 'react-icons/fa';

export default function SkillSection() {
    return (
        <section id='courses' className="py-16 bg-white scroll-mt-50 md:scroll-mt-0">
            <div className="container mx-auto px-4">
                <div className="text-center mb-12">
                    <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-4">Tech Skills for the Future</h2>
                    <p className="text-lg text-gray-600 max-w-3xl mx-auto">
                    Our tech courses are designed to make learning technology fun and accessible for students of all
                    ages.
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                    <SkillCard
                        title="Programming"
                        description="Learn Python, JavaScript, and coding fundamentals through interactive projects."
                        icon={<span className="text-3xl">{<FaCode />}</span>}
                        topics={['Python', 'JavaScript', 'Logic & Algorithms']}
                        link="/course/programming"
                    />
                    <SkillCard
                        title="ReactJS Web Development"
                        description="Build modern websites using ReactJS and Python to handle backend logic."
                        icon={<span className="text-3xl">{<FaLaptopCode />}</span>}
                        topics={['Python', 'JavaScript', 'Backend']}
                        link="/course/reactjs-web-development"
                    />
                    <SkillCard
                        title="3D Printing & Design"
                        description="Create and print 3D models using Tinkercad and other design tools."
                        icon={<span className="text-3xl">{<FaCubes />}</span>}
                        topics={['Tinkercad', '3D Modeling', 'Printing']}
                        link="/course/3d-printing-design"
                    />
                    <SkillCard
                        title="Pygame Game Development"
                        description="Learn how to build complete 2D games with Python and Pygame, from beginner to advanced."
                        icon={<span className="text-3xl">{<FaGamepad />}</span>}
                        topics={['Sprites', 'Collisions', 'Level Design']}
                        link="/course/pygame-game-development"
                    />
                </div>
            </div>
        </section> 
    )
}