export default function SignUpPage() {
    return (
        <div className="flex min-h-screen items-center justify-center">
            <div className="w-full max-w-md space-y-4 p-6">
                <h1 className="text-2xl font-bold text-center">Sign Up</h1>
                <form className="space-y-4">
                    <div>
                        <label htmlFor="email" className="block text-sm font-medium">
                            Email
                        </label>
                        <input
                            id="email"
                            type="email"
                            className="w-full px-3 py-2 border rounded-md"
                            required
                        />
                    </div>
                    <div>
                        <label htmlFor="password" className="block text-sm font-medium">
                            Password
                        </label>
                        <input
                            id="password"
                            type="password"
                            className="w-full px-3 py-2 border rounded-md"
                            required
                        />
                    </div>
                    <button
                        type="submit"
                        className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700"
                    >
                        Sign Up
                    </button>
                </form>
            </div>
        </div>
    );
}