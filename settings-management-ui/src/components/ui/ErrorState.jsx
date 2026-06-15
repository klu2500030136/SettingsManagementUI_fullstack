function ErrorState({
  message,
}) {
  return (
    <div className="bg-red-50 border border-red-200 rounded-2xl p-6 text-center">

      <h2 className="text-2xl font-bold text-red-600">
        Error
      </h2>

      <p className="text-red-500 mt-3">
        {message}
      </p>

    </div>
  );
}

export default ErrorState;