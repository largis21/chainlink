import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import App from './App.tsx'
import './index.css'
import { chainlinkConfigSchema } from "@chainlink-io/schemas"
import { apiHandler } from './api/useApi.tsx'
import { configStore } from './state/config-store.ts'

async function startApp() {
  const config = await apiHandler("/getConfig?test=kake.ts", {}, chainlinkConfigSchema)

  configStore.setState({ config })

  createRoot(document.getElementById('root')!).render(
    <StrictMode>
      <App />
    </StrictMode>
  )
}

startApp()

