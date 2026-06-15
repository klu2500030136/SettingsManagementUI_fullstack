function UnauthorizedPage() {
  return (
    <div className="min-h-screen flex items-center justify-center">

      <div className="text-center">

        <h1 className="text-5xl font-bold text-red-500">
          403
        </h1>

        <p className="mt-4 text-lg text-slate-600">
          Unauthorized Access
        </p>

      </div>
    </div>
  );
}

export default UnauthorizedPage;