import { useEffect } from 'react'
import axios from 'axios'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { Routes, Route, HashRouter } from 'react-router-dom'
import { Main, LogIn } from './pages'

const client = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false
    }
  }
})

function App(): JSX.Element {
  // const ipcHandle = (): void => window.electron.ipcRenderer.send('ping');
  useEffect(() => {
    axios.get('https://jsonplaceholder.typicode.com/todos/3').then((data) => {
      console.log(data.data)
    })
  }, [])

  return (
    <QueryClientProvider client={client}>
      <HashRouter>
        <Routes>
          <Route path="/" element={<LogIn />}></Route>
          <Route path="/test" element={<Main />}></Route>
        </Routes>
      </HashRouter>
    </QueryClientProvider>
  )
}

export default App
