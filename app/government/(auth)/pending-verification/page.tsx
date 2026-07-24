export default function PendingVerification() {
  return (
    <div className="text-center space-y-4">
      <div className="text-4xl">⏳</div>
      <h2 className="text-xl text-white font-medium">Verification Pending</h2>
      <p className="text-sm text-slate-400">
        Your registration has been received and is currently under review by the Super Administration team. 
        You will receive an official email once your access level has been granted.
      </p>
      <a href="/government/login" className="block text-sm text-blue-400 hover:text-blue-300 mt-4">Return to Login</a>
    </div>
  );
}
