import { useState } from "react"
import Error from "./Error"
import { API_URL } from "../config"

export default function TutorSignUpForm({ token, aid }) {
    const [form, setForm] = useState({
        first: '',
        last: '',
        age: '',
        email: '',
        password: '',
        confirmPassword: ''
    })
    const [error, setError] = useState('')
    const [loading, setLoading] = useState(false)
    const [success, setSuccess] = useState(false)

    const handleChange = (e) => {
        setForm({ ...form, [e.target.name]: e.target.value })
    }

    const handleSubmit = async(e) => {
        e.preventDefault()
        setError('')

        console.log(token)
        console.log(aid)

        if (!form.first || !form.last || !form.age || !form.email || !form.password) {
            setError("Please fill in all fields.")
            return
        }
        if (form.password !== form.confirmPassword) {
            setError("Passwords do not match.")
            return
        }
        console.log(form, parseInt(form.age))
        setLoading(true)
        try {
            const response = await fetch(`${API_URL}/auth/onboard/complete?token=${token}&aid=${aid}`, {
                method: 'POST',
                headers: {
                    'Content-Type':'application/json'
                },
                body: JSON.stringify({
                    'first': form.first,
                    'last': form.last,
                    'age': parseInt(form.age, 10),
                    'email': form.email,
                    'password': form.password
                })
            })

            if (!response.ok) {
                const data = await response.json();
                setError(data.detail || data || "Failed to create account");
                setLoading(false);
                return;
            }

            setSuccess(true)
            setTimeout(() => {
                window.location.href = '/tropitutor/login'
            }, 2000)
        } catch (error) {
            setError('Internal server error')
            console.log(error)
        } finally {
            setLoading(false)
        }
    }

    if (success) {
        return (
            <div className="flex flex-col items-center justify-center h-screen bg-[#101828] text-white animate-fadeIn">
                <h1 className="text-3xl font-bold mb-4 text-[#00C951]">Account Created!</h1>
                <p className="text-gray-400">Redirecting to login page...</p>
            </div>
        );
    }

    return (
        <div className="flex h-screen bg-gradient-to-r from-[#101828] via-[#1E2938] to-[#101828] text-white">
            {/* LEFT SIDE FORM */}
            <div className="flex flex-col justify-center px-10 md:px-24 w-full md:w-1/2">
                <form
                onSubmit={handleSubmit}
                className="w-full max-w-lg mx-auto md:mx-0 animate-fadeIn"
                >
                <h1 className="text-4xl font-bold mb-4">
                    Create Tutor Account<span className="text-[#990FFA]"> .</span>
                </h1>

                <div className="flex flex-col md:flex-row gap-4 mb-4">
                    <input
                    type="text"
                    name="first"
                    placeholder="First name"
                    value={form.first}
                    onChange={handleChange}
                    className="flex-1 bg-[#101828] border border-[#364154] text-white rounded-lg px-4 py-3 focus:outline-none focus:border-[#990FFA]"
                    />
                    <input
                    type="text"
                    name="last"
                    placeholder="Last name"
                    value={form.last}
                    onChange={handleChange}
                    className="flex-1 bg-[#101828] border border-[#364154] text-white rounded-lg px-4 py-3 focus:outline-none focus:border-[#990FFA]"
                    />
                </div>

                <input
                    type="number"
                    name="age"
                    placeholder="Age"
                    value={form.age}
                    onChange={handleChange}
                    className="w-full bg-[#101828] border border-[#364154] text-white rounded-lg px-4 py-3 mb-4 focus:outline-none focus:border-[#990FFA]"
                />

                <input
                    type="email"
                    name="email"
                    placeholder="Email"
                    value={form.email}
                    onChange={handleChange}
                    className="w-full bg-[#101828] border border-[#364154] text-white rounded-lg px-4 py-3 mb-4 focus:outline-none focus:border-[#990FFA]"
                />

                <input
                    type="password"
                    name="password"
                    placeholder="Password"
                    value={form.password}
                    onChange={handleChange}
                    className="w-full bg-[#101828] border border-[#364154] text-white rounded-lg px-4 py-3 mb-4 focus:outline-none focus:border-[#990FFA]"
                />

                <input
                    type="password"
                    name="confirmPassword"
                    placeholder="Confirm password"
                    value={form.confirmPassword}
                    onChange={handleChange}
                    className="w-full bg-[#101828] border border-[#364154] text-white rounded-lg px-4 py-3 mb-6 focus:outline-none focus:border-[#990FFA]"
                />

                {error && (
                    <p className="text-red-500 mb-4">
                        {typeof error === "string"
                        ? error
                        : Array.isArray(error)
                            ? error.map((e, i) => (
                                <span key={i} className="block">
                                {e.msg || JSON.stringify(e)}
                                </span>
                            ))
                            : JSON.stringify(error)}
                    </p>
                )}

                <div className="flex gap-4">
                    <button
                        type="submit"
                        disabled={loading}
                        className={`flex-1 py-3 rounded-lg font-semibold text-white transition-all shadow-md ${
                            loading
                            ? "bg-gray-500 cursor-not-allowed"
                            : "bg-purple-600 hover:bg-purple-700"
                        }`}
                    >
                            {loading ? "Creating..." : "Create account"}
                    </button>
                </div>
                </form>
            </div>

            {/* RIGHT SIDE GRADIENT */}
            <div className="hidden lg:block w-1/2 bg-gradient-to-br from-[#101828] via-[#1E2938] to-[#101828]" />
        </div>
    )
}