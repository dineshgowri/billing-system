const { contextBridge, ipcRenderer } = require('electron');

// Expose protected methods that allow the renderer process to use
// the ipcRenderer without exposing the entire object
contextBridge.exposeInMainWorld('electronAPI', {
  // Test API
  ping: () => ipcRenderer.invoke('ping'),
  
  // Database APIs
  dbQuery: (sql, params) => ipcRenderer.invoke('db:query', { sql, params }),
  dbRun: (sql, params) => ipcRenderer.invoke('db:run', { sql, params }),
  dbGet: (sql, params) => ipcRenderer.invoke('db:get', { sql, params }),
  
  // Future APIs will be added here in upcoming sessions
  // Authentication, Patient Management, Billing, etc.
});
