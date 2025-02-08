type PackageManager = 'pip' | 'uv' | 'pipenv' | 'poetry'

const convertCommand = (packageName: string, manager: PackageManager, isDev: boolean): string => {
  switch (manager) {
    case 'pip':
      return `pip install ${isDev ? '--dev' : ''} ${packageName}`.trim()
    case 'uv':
      return `uv add ${isDev ? '--dev' : ''} ${packageName}`.trim()
    case 'pipenv':
      return `pipenv install ${isDev ? '--dev' : ''} ${packageName}`.trim()
    case 'poetry':
      return `poetry add ${isDev ? '--group dev' : ''} ${packageName}`.trim()
    default:
      return `pip install ${packageName}`
  }
}

interface StorageData {
  preferredManager?: PackageManager
  isDev?: boolean
  showDevToggle?: boolean
}

const createDevToggle = (packageName: string, targetCommandElement: Element) => {
  const container = document.createElement('div')
  container.className = 'dev-toggle-container'
  
  const devToggleLabel = document.createElement('label')
  devToggleLabel.className = 'dev-toggle'
  
  const devToggle = document.createElement('input')
  devToggle.type = 'checkbox'
  devToggle.id = 'dev-dependency'
  
  const devText = document.createElement('span')
  devText.textContent = 'isDev'
  
  devToggleLabel.appendChild(devToggle)
  devToggleLabel.appendChild(devText)

  // Load saved preferences
  chrome.storage.sync.get(['preferredManager', 'isDev', 'showDevToggle'], (data: StorageData) => {
    // If toggle is hidden, default to not dev and hide
    if (!data.showDevToggle) {
      container.style.display = 'none'
      targetCommandElement.textContent = convertCommand(
        packageName, 
        data.preferredManager || 'pip',
        false
      )
      return
    }

    devToggle.checked = Boolean(data.isDev)
    targetCommandElement.textContent = convertCommand(
      packageName, 
      data.preferredManager || 'pip',
      Boolean(data.isDev)
    )
  })

  // Listen for package manager changes and show/hide toggle setting
  chrome.storage.onChanged.addListener((changes) => {
    if (changes.preferredManager) {
      const manager = changes.preferredManager.newValue as PackageManager
      targetCommandElement.textContent = convertCommand(
        packageName,
        manager,
        devToggle.checked
      )
    }
    if (changes.showDevToggle) {
      const showToggle = changes.showDevToggle.newValue
      container.style.display = showToggle ? 'inline-flex' : 'none'
      if (!showToggle) {
        // Reset to non-dev when hiding
        devToggle.checked = false
        chrome.storage.sync.get('preferredManager', (data: StorageData) => {
          targetCommandElement.textContent = convertCommand(
            packageName,
            data.preferredManager || 'pip',
            false
          )
        })
      }
    }
  })

  devToggle.addEventListener('change', (e) => {
    const isDev = (e.target as HTMLInputElement).checked
    chrome.storage.sync.set({ isDev })
    
    chrome.storage.sync.get('preferredManager', (data: StorageData) => {
      targetCommandElement.textContent = convertCommand(
        packageName,
        data.preferredManager || 'pip',
        isDev
      )
    })
  })

  container.appendChild(devToggleLabel)
  return container
}

const injectDevToggles = () => {
  const commandElements = document.querySelectorAll('span[id="pip-command"]')
  if (!commandElements.length) return

  commandElements.forEach(commandElement => {
    const pipCommand = commandElement.textContent || ''
    const match = pipCommand.match(/pip install (.+)/)
    if (!match) return

    const packageName = match[1]
    const devToggle = createDevToggle(packageName, commandElement)
    if (!devToggle) return

    // Insert the toggle after the command span
    commandElement.parentNode?.insertBefore(devToggle, commandElement.nextSibling)
  })
}

const style = document.createElement('style')
style.textContent = `
  .dev-toggle-container {
    display: inline-flex;
    align-items: center;
    margin-left: 8px;
    vertical-align: middle;
  }
  .dev-toggle {
    display: inline-flex;
    align-items: center;
    gap: 4px;
    cursor: pointer;
    padding: 2px 6px;
    background: #f3f4f6;
    border: 1px solid #d1d5db;
    border-radius: 3px;
    font-size: 12px;
    color: #6b7280;
    transition: all 0.2s ease;
    user-select: none;
  }
  .dev-toggle:hover {
    background: #e5e7eb;
    border-color: #9ca3af;
  }
  .dev-toggle input[type="checkbox"] {
    margin: 0;
    cursor: pointer;
    width: 12px;
    height: 12px;
    border: 1px solid #d1d5db;
    border-radius: 2px;
  }
  .dev-toggle input[type="checkbox"]:checked {
    background-color: #2563eb;
    border-color: #2563eb;
  }
  .dev-toggle input[type="checkbox"]:focus {
    outline: 1px solid #93c5fd;
    outline-offset: 0px;
  }
`
document.head.appendChild(style)

setTimeout(injectDevToggles, 100) 