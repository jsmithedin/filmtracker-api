import { BrowserRouter, Routes, Route, Link, Navigate } from 'react-router-dom'
import DarkModeToggle from './components/DarkModeToggle'
import FilmStock from './pages/FilmStock'
import FilmUses from './pages/FilmUses'

export default function App() {
  return (
    <BrowserRouter>
      <div className="p-4 space-y-4 max-w-screen-lg mx-auto">
        <nav className="flex flex-wrap items-center gap-4 mb-4">
          <Link to="/films" className="underline">
            Film Stock
          </Link>
          <Link to="/uses" className="underline">
            Film Uses
          </Link>
          <div className="ml-auto">
            <DarkModeToggle />
          </div>
        </nav>
        <Routes>
          <Route path="/" element={<Navigate to="/films" replace />} />
          <Route path="/films" element={<FilmStock />} />
          <Route path="/uses" element={<FilmUses />} />
        </Routes>
      </div>
    </BrowserRouter>
  )
}
