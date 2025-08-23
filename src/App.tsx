function App() {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="container mx-auto px-4 py-16">
        <h1 className="text-4xl font-bold text-center text-gray-900 dark:text-white mb-8">
          Web App Starter Pack
        </h1>
        <p className="text-center text-gray-600 dark:text-gray-400 mb-8">
          Edit <code className="bg-gray-200 dark:bg-gray-800 px-2 py-1 rounded">src/App.tsx</code> to get started
        </p>
        <div className="flex justify-center gap-4">
          <a
            href="https://react.dev"
            target="_blank"
            rel="noopener noreferrer"
            className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors"
          >
            Learn React
          </a>
          <a
            href="https://tailwindcss.com"
            target="_blank"
            rel="noopener noreferrer"
            className="px-4 py-2 bg-teal-500 text-white rounded hover:bg-teal-600 transition-colors"
          >
            Learn Tailwind
          </a>
        </div>
      </div>
    </div>
  )
}

export default App