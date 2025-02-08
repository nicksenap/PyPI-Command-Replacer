import { useEffect, useState } from 'react'
import './App.css'

type PackageManager = 'pip' | 'uv' | 'pipenv' | 'poetry'

interface StorageData {
  preferredManager?: PackageManager
  showDevToggle?: boolean
}

function App() {
  const [selectedManager, setSelectedManager] = useState<PackageManager>('pip')
  const [showDevToggle, setShowDevToggle] = useState(false)

  useEffect(() => {
    // Load saved preferences
    chrome.storage.sync.get(['preferredManager', 'showDevToggle'], (data: StorageData) => {
      if (data.preferredManager) {
        setSelectedManager(data.preferredManager)
      }
      setShowDevToggle(Boolean(data.showDevToggle))
    })
  }, [])

  const handleManagerChange = (manager: PackageManager) => {
    setSelectedManager(manager)
    chrome.storage.sync.set({ preferredManager: manager })
  }

  const handleShowDevToggleChange = (show: boolean) => {
    setShowDevToggle(show)
    chrome.storage.sync.set({ showDevToggle: show })
  }

  return (
    <div className="container">
      <h2>PyPI Command Replacer</h2>      
      <h2>Package Manager</h2>
      <div className="manager-options">
        {(['pip', 'uv', 'pipenv', 'poetry'] as PackageManager[]).map((manager) => (
          <label key={manager} className="manager-option">
            <input
              type="radio"
              name="manager"
              value={manager}
              checked={selectedManager === manager}
              onChange={() => handleManagerChange(manager)}
            />
            {manager}
          </label>
        ))}
      </div>

      <div className="option-row">
        <label className="toggle-option">
          <input
            type="checkbox"
            checked={showDevToggle}
            onChange={(e) => handleShowDevToggleChange(e.target.checked)}
          />
          Show isDev toggle
        </label>
      </div>
    </div>
  )
}

export default App
