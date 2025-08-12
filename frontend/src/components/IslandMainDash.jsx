import WelcomeBanner from "./WelcomeBanner";

export default function IslandMainDash() {
    const mockStudentData = {
        name: "Brandon",
        email: "alex.johnson@email.com",
        grade: "8th Grade",
        joinDate: "September 2024",
        level: 12
    }
    
    return (
        <main className="min-h-[calc(100vh-75px)] overflow-hidden bg-green-50">
            <WelcomeBanner name={mockStudentData.name} />
        </main>
    )
}