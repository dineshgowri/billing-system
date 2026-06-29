import { useState, useEffect } from 'react'
import './App.css'

function App() {
  const [testMessage, setTestMessage] = useState('Loading...')
  const [dbTest, setDbTest] = useState('Testing database...')

  useEffect(() => {
    // Test Electron IPC
    const testElectron = async () => {
      try {
        const response = await window.electronAPI.ping()
        setTestMessage(`Electron API Test: ${response}`)
      } catch (error) {
        setTestMessage(`Error: ${error.message}`)
      }
    }

    // Test Database connection
    const testDatabase = async () => {
      try {
        const result = await window.electronAPI.dbQuery(
          'SELECT name FROM sqlite_master WHERE type="table"',
          []
        )
        if (result.success) {
          setDbTest(`Database connected! Tables found: ${result.data.length}`)
        } else {
          setDbTest(`Database error: ${result.error}`)
        }
      } catch (error) {
        setDbTest(`Error: ${error.message}`)
      }
    }

    testElectron()
    testDatabase()
  }, [])

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-8">
      <div className="max-w-2xl w-full bg-white rounded-2xl shadow-2xl p-8">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-800 mb-2">
            🦷 Dental Clinic Billing System
          </h1>
          <p className="text-gray-600">Electron + React + SQLite</p>
        </div>

        <div className="space-y-6">
          {/* Status Cards */}
          <div className="bg-green-50 border-l-4 border-green-500 p-4 rounded-r-lg">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <svg className="h-6 w-6 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <div className="ml-3">
                <p className="text-sm font-medium text-green-800">
                  {testMessage}
                </p>
              </div>
            </div>
          </div>

          <div className="bg-blue-50 border-l-4 border-blue-500 p-4 rounded-r-lg">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <svg className="h-6 w-6 text-blue-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 7v10c0 2.21 3.582 4 8 4s8-1.79 8-4V7M4 7c0 2.21 3.582 4 8 4s8-1.79 8-4M4 7c0-2.21 3.582-4 8-4s8 1.79 8 4" />
                </svg>
              </div>
              <div className="ml-3">
                <p className="text-sm font-medium text-blue-800">
                  {dbTest}
                </p>
              </div>
            </div>
          </div>

          {/* Info Section */}
          <div className="bg-gray-50 rounded-lg p-6 space-y-3">
            <h2 className="text-xl font-semibold text-gray-800 mb-4">
              ✅ Session 1 Complete!
            </h2>
            <ul className="space-y-2 text-gray-700">
              <li className="flex items-start">
                <span className="text-green-500 mr-2">✓</span>
                <span>Project structure created</span>
              </li>
              <li className="flex items-start">
                <span className="text-green-500 mr-2">✓</span>
                <span>Electron + React configured</span>
              </li>
              <li className="flex items-start">
                <span className="text-green-500 mr-2">✓</span>
                <span>SQLite database initialized</span>
              </li>
              <li className="flex items-start">
                <span className="text-green-500 mr-2">✓</span>
                <span>10 database tables created</span>
              </li>
              <li className="flex items-start">
                <span className="text-green-500 mr-2">✓</span>
                <span>Default admin user created (username: admin, password: admin123)</span>
              </li>
              <li className="flex items-start">
                <span className="text-green-500 mr-2">✓</span>
                <span>10 common treatments seeded</span>
              </li>
            </ul>
          </div>

          {/* Next Steps */}
          <div className="bg-indigo-50 rounded-lg p-6">
            <h3 className="font-semibold text-indigo-900 mb-2">
              📋 Next Session Preview:
            </h3>
            <p className="text-indigo-800 text-sm">
              Session 2 will build the login screen with authentication
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default App
