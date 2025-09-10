export default function ForgetPasswordCodePage() {
  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="max-w-md w-full space-y-8">
        <div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
            Enter Reset Code
          </h2>
          <p className="mt-2 text-center text-sm text-gray-600">
            Enter the code sent to your email.
          </p>
        </div>
      </div>
    </div>
  );
}
