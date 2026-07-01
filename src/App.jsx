import { useState } from 'react'
import { AppProvider } from './context/AppContext'
import Layout      from './components/Layout'
import Dashboard   from './components/Dashboard'
import VisualField from './components/VisualField'
import Fundus      from './components/Fundus'
import Oct         from './components/Oct'
import Reports     from './components/Reports'
import ModelInfo   from './components/ModelInfo'

export default function App() {
  const [page, setPage] = useState('dashboard')
  function renderPage() {
    switch (page) {
      case 'dashboard':    return <Dashboard onNavigate={setPage}/>
      case 'visual-field': return <VisualField/>
      case 'fundus':       return <Fundus/>
      case 'oct':          return <Oct/>
      case 'reports':      return <Reports/>
      case 'model-info':   return <ModelInfo/>
      default:             return <Dashboard onNavigate={setPage}/>
    }
  }
  return (
    <AppProvider>
      <Layout page={page} onNavigate={setPage}>
        {renderPage()}
      </Layout>
    </AppProvider>
  )
}
