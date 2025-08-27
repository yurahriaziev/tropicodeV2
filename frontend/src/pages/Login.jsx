import Footer from "../components/Footer";
import LoginCard from "../components/LoginCard";
import Navbar from "../components/Navbar";

export default function Login() {
    return (
        <div className="bg-white min-h-screen flex flex-col">
            <Navbar />
            <div className="flex-grow">
            <LoginCard />
            </div>
            <Footer />
        </div>
    )
}