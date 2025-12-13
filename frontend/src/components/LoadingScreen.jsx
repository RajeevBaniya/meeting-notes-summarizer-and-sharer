function LoadingScreen() {
  return (
    <div className="main-container">
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="loading-spinner mx-auto mb-4"></div>
          <p className="text-slate-400 text-sm">Loading...</p>
        </div>
      </div>
    </div>
  );
}

export default LoadingScreen;
