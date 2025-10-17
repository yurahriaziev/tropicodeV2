import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { API_URL } from "../config";
import TutorSignUpForm from "../components/TutorSignUpForm";

export default function TutorOnboarding() {
    const [searchParams] = useSearchParams()
    const token = searchParams.get('t')
    const aid = parseInt(searchParams.get('aid'))
    console.log(aid)

    const [error, setError] = useState('')
    const [invalidToken, setInvalidToken] = useState(false)
    const [loading, setLoading] = useState(true)
    const [verified, setVerified] = useState(false)

    useEffect(() => {
        if (!token) {
            setInvalidToken(true);
            setLoading(false);
            return;
        }

        const verifyToken = async() => {
            try {
                const response = await fetch(`${API_URL}/auth/onboard/verify?token=${token}`, {
                    method: 'GET',
                })

                if (!response.ok) {
                    setInvalidToken(true)
                    setLoading(false)
                    return
                }

                const data = await response.json()
                if (data.valid) {
                    setVerified(true)
                } else {
                    setInvalidToken(true)
                }
            } catch(error) {
                setError('Internal server error')
            } finally {
                setLoading(false)
            }
        }

        verifyToken()
    }, [token])

    if (!token || error || invalidToken) {
        return (
            <div className="flex flex-col items-center justify-center h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-black text-white px-6">
                <div className="backdrop-blur-md bg-white/10 border border-white/20 p-10 rounded-3xl shadow-2xl max-w-lg w-full text-center animate-fadeIn">
                    <div className="flex justify-center mb-6">
                    <div className="h-16 w-16 rounded-full bg-red-500/20 flex items-center justify-center">
                        <svg
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                        strokeWidth={2}
                        stroke="rgb(239, 68, 68)"
                        className="w-10 h-10"
                        >
                        <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            d="M12 9v2m0 4h.01M4.93 4.93l14.14 14.14M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2z"
                        />
                        </svg>
                    </div>
                    </div>

                    <h1 className="text-3xl font-semibold mb-3">Invalid or Expired Link</h1>
                    {error ? (
                        <p className="text-gray-300 mb-8 leading-relaxed">
                            {error}
                        </p>
                    ) : (
                        <p className="text-gray-300 mb-8 leading-relaxed">
                            This onboarding link is no longer valid or has expired.
                            Please contact your administrator to request a new invite.
                        </p>
                    )}

                    <a
                    href="/tropitutor/login"
                    className="bg-gradient-to-r from-green-400 to-emerald-500 hover:from-green-500 hover:to-emerald-600 text-black font-semibold px-8 py-3 rounded-xl shadow-md transition-transform transform hover:-translate-y-1"
                    >
                    Go to Tutor Login
                    </a>
                </div>

                <p className="mt-10 text-gray-500 text-sm">
                    © {new Date().getFullYear()} Tropicode. All rights reserved.
                </p>
            </div>
        )
    }

    if (verified) {
        return <TutorSignUpForm token={token} aid={aid}/>
    }

    return null;
}