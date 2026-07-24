export default function GovernmentRegister() {
  return (
    <div className="text-center space-y-4">
      <h2 className="text-xl text-white font-medium">Official Registration</h2>
      <p className="text-sm text-slate-400 text-left">
        Access to the Government Operations Portal is strictly controlled. Submit your details for administrative review.
      </p>
      <div className="bg-slate-800 p-4 rounded text-left border border-slate-700">
        <p className="text-sm text-slate-300">Registration form fields (Employee ID, Dept, Designation, etc.) will be dynamically rendered here.</p>
      </div>
      <a href="/government/login" className="block text-sm text-blue-400 hover:text-blue-300 mt-4">Return to Login</a>
    </div>
  );
}
