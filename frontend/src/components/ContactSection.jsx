import { useState } from "react"
import { API_URL, GENERAL } from "../config"

export default function ContactSection() {
    const [values, setValues] = useState({
        first: "",
        last: "",
        phone: "",
        email: "",
        childAge: ""
    })

    const [errors, setErrors] = useState({})
    const [submitted, setSubmitted] = useState(false)
    const [error, setError] = useState('')
    const [success, setSuccess] = useState(false)

    const formatPhone = (num) => {
        const digits = num.replace(/\D/g, "").slice(0, 10)

        if (digits.length === 0) return ""
        if (digits.length <= 3) return `(${digits}`
        if (digits.length <= 6)
        return `(${digits.slice(0, 3)}) ${digits.slice(3)}`
        return `(${digits.slice(0, 3)}) ${digits.slice(3, 6)}-${digits.slice(6)}`
    }

    const validate = () => {
        const newErrors = {}

        if (!values.first.trim())
        newErrors.first = "Parent first name field is required."

        if (!values.last.trim())
        newErrors.last = "Parent last name field is required."

        // if (values.phone.trim())
        // newErrors.phone = "Phone number field is required."

        if (!values.email.trim())
        newErrors.email = "Email field is required."

        if (!values.childAge) {
            newErrors.age = "Child age is required."
        } else {
            const ageNum = Number(values.childAge)
            if (Number.isNaN(ageNum) || ageNum < 1 || ageNum > 18) {
                newErrors.age = "Child age must be between 1 and 18."
            }
        }

        setErrors(newErrors)
        return Object.keys(newErrors).length === 0
    }

    const handleSubmit = async(e) => {
        e.preventDefault()
        setSubmitted(true)

        if (!validate()) return

        console.log("Form submitted:", values) // LOG

        try {
            const response = await fetch(`${API_URL}/contacts`, {
                method: 'POST',
                headers: {
                    'Content-Type':'application/json'
                },
                body: JSON.stringify({
                    first: values.first,
                    last: values.last,
                    email: values.email,
                    phone: values.phone || null,
                    child_age: Number(values.childAge),
                    source: GENERAL
                })
            })

            if (!response.ok) {
                setError('Error submitting contact information. Please try again')
                return
            }

            setSuccess(true)
            setValues({
                first: "",
                last: "",
                phone: "",
                email: "",
            })
        } catch (error) {
            setError('Server error. Try again later')
            console.log(error) // LOG
        }
    }

    return (
        <section
            id="contact"
            className="py-20 bg-gradient-to-b from-white to-blue-50"
        >
            <div className="max-w-2xl mx-auto px-6">
            <div className="bg-white rounded-xl shadow-lg p-8 md:p-10">
                <div className="text-center mb-8">
                <h2 className="text-3xl font-extrabold text-gray-800">
                    Connect With <span className="text-purple-600">Us</span>
                </h2>
                </div>

                {/* CONDITIONAL RENDERING */}
                {success ? (
                /* ---------------- THANK YOU SCREEN ---------------- */
                <div className="text-center py-12">
                    <h3 className="text-2xl font-bold text-gray-800 mb-4">
                    Thank you for reaching out!
                    </h3>

                    <p className="text-gray-600 mb-6">
                    We’ve received your information and will be in touch shortly.
                    </p>

                    <div className="inline-block bg-green-100 text-green-700 px-6 py-3 rounded-lg font-medium">
                    ✔ Submission Successful
                    </div>
                </div>
                ) : (
                /* ---------------- CONTACT FORM ---------------- */
                <form className="space-y-4" onSubmit={handleSubmit}>
                    {/* Parent First Name */}
                    <div className="space-y-1">
                        <input
                            type="text"
                            placeholder="Parent First Name*"
                            value={values.first}
                            onChange={(e) => {
                            setValues((v) => ({ ...v, first: e.target.value }))
                            setErrors((err) => ({ ...err, first: undefined }))
                            }}
                            className="w-full bg-blue-50 p-3 rounded-md border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-400"
                        />
                        {submitted && errors.first && (
                            <p className="text-red-400 text-xs pl-1">
                            {errors.first}
                            </p>
                        )}
                    </div>

                    {/* Parent Last Name */}
                    <div className="space-y-1">
                        <input
                            type="text"
                            placeholder="Parent Last Name*"
                            value={values.last}
                            onChange={(e) => {
                            setValues((v) => ({ ...v, last: e.target.value }))
                            setErrors((err) => ({ ...err, last: undefined }))
                            }}
                            className="w-full bg-blue-50 p-3 rounded-md border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-400"
                        />
                        {submitted && errors.last && (
                            <p className="text-red-400 text-xs pl-1">
                            {errors.last}
                            </p>
                        )}
                    </div>

                    {/* Phone Number */}
                    <div className="space-y-1">
                        <input
                            type="tel"
                            placeholder="(000) 000-0000"
                            value={values.phone}
                            onChange={(e) => {
                            setValues((v) => ({
                                ...v,
                                phone: formatPhone(e.target.value),
                            }))
                            setErrors((err) => ({ ...err, phone: undefined }))
                            }}
                            className="w-full bg-blue-50 p-3 rounded-md border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-400"
                        />
                        {submitted && errors.phone && (
                            <p className="text-red-400 text-xs pl-1">
                            {errors.phone}
                            </p>
                        )}
                    </div>

                    {/* Email */}
                    <div className="space-y-1">
                        <input
                            type="email"
                            placeholder="Email*"
                            value={values.email}
                            onChange={(e) => {
                            setValues((v) => ({ ...v, email: e.target.value }))
                            setErrors((err) => ({ ...err, email: undefined }))
                            }}
                            className="w-full bg-blue-50 p-3 rounded-md border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-400"
                        />
                        {submitted && errors.email && (
                            <p className="text-red-400 text-xs pl-1">
                            {errors.email}
                            </p>
                        )}
                    </div>
                    <div className="space-y-1">
                        <input
                            type="number"
                            min="1"
                            max="18"
                            placeholder="Child Age*"
                            value={values.childAge}
                            onChange={(e) => {
                            setValues((v) => ({ ...v, childAge: e.target.value }))
                            setErrors((err) => ({ ...err, age: undefined }))
                            }}
                            className="w-full bg-blue-50 p-3 rounded-md border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-400"
                        />
                        {submitted && errors.age && (
                            <p className="text-red-400 text-xs pl-1">
                            {errors.age}
                            </p>
                        )}
                    </div>

                    {/* Backend Error */}
                    {error && (
                    <p className="text-red-500 text-sm text-center">
                        {error}
                    </p>
                    )}

                    {/* Submit */}
                    <div className="pt-4">
                    <button
                        type="submit"
                        className="w-full py-3 bg-green-500 hover:bg-green-600 text-white font-bold text-base rounded-md shadow transition"
                    >
                        SUBMIT INFO
                    </button>
                    </div>
                </form>
                )}
            </div>
            </div>
        </section>
    )
}