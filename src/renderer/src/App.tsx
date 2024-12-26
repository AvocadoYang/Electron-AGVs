import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { Routes, Route, HashRouter } from 'react-router-dom'
import { Main, LogIn, Setting, Register } from './pages'

const client = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false
    }
  }
})

function App(): JSX.Element {
  // const ipcHandle = (): void => window.electron.ipcRenderer.send('ping');

  return (
    <QueryClientProvider client={client}>
      <HashRouter>
        <Routes>
          <Route path="/" element={<LogIn />}></Route>
          <Route path="/dashboard" element={<Register />}></Route>
          <Route path="/setting" element={<Setting></Setting>}></Route>
          <Route path="/view" element={<Main />}></Route>
        </Routes>
      </HashRouter>
    </QueryClientProvider>
  )
}

export default App
