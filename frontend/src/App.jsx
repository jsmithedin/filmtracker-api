import { useEffect, useState } from 'react'
import { Button } from './components/ui/button'
import { Input } from './components/ui/input'
import { Label } from './components/ui/label'

function App() {
  const [films, setFilms] = useState([])
  const [newFilm, setNewFilm] = useState({
    manufacturer: '',
    name: '',
    type: 'BW',
    format: '35mm',
    iso: 100,
    quantity: 1
  })
  const [uses, setUses] = useState([])
  const [newUse, setNewUse] = useState({
    date_used: '',
    film_id: '',
    camera: '',
    location: '',
    developer: '',
    notes: ''
  })

  const fetchFilms = () =>
    fetch('/api/films/')
      .then((res) => res.json())
      .then(setFilms)

  const fetchUses = () =>
    fetch('/api/uses/')
      .then((res) => res.json())
      .then(setUses)

  useEffect(() => {
    fetchFilms()
    fetchUses()
  }, [])

  const handleFilmChange = (e) => {
    setNewFilm({ ...newFilm, [e.target.name]: e.target.value })
  }

  const addFilm = (e) => {
    e.preventDefault()
    fetch('/api/films/', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        ...newFilm,
        iso: Number(newFilm.iso),
        quantity: Number(newFilm.quantity)
      })
    }).then(() => {
      fetchFilms()
      setNewFilm({
        manufacturer: '',
        name: '',
        type: 'BW',
        format: '35mm',
        iso: 100,
        quantity: 1
      })
    })
  }

  const updateQuantity = (id, quantity) => {
    fetch(`/api/films/${id}?quantity=${quantity}`, { method: 'PATCH' }).then(
      fetchFilms
    )
  }

  const addUse = (e) => {
    e.preventDefault()
    fetch('/api/uses/', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(newUse)
    }).then(() => {
      fetchUses()
      setNewUse({
        date_used: '',
        film_id: '',
        camera: '',
        location: '',
        developer: '',
        notes: ''
      })
    })
  }

  return (
    <div className="p-4 space-y-8">
      <h1 className="text-2xl font-bold">Film Tracker</h1>

      <section>
        <h2>Add Film</h2>
        <form onSubmit={addFilm} className="space-y-2">
          <div className="space-y-1">
            <Label htmlFor="manufacturer">Manufacturer</Label>
            <Input
              id="manufacturer"
              name="manufacturer"
              value={newFilm.manufacturer}
              onChange={handleFilmChange}
              required
            />
          </div>
          <div className="space-y-1">
            <Label htmlFor="name">Name</Label>
            <Input
              id="name"
              name="name"
              value={newFilm.name}
              onChange={handleFilmChange}
              required
            />
          </div>
          <div className="space-y-1">
            <Label htmlFor="type">Type</Label>
            <select
              id="type"
              name="type"
              className="border rounded-md p-2"
              value={newFilm.type}
              onChange={handleFilmChange}
            >
              <option value="BW">BW</option>
              <option value="Colour">Colour</option>
              <option value="Colour Reversal">Colour Reversal</option>
            </select>
          </div>
          <div className="space-y-1">
            <Label htmlFor="format">Format</Label>
            <select
              id="format"
              name="format"
              className="border rounded-md p-2"
              value={newFilm.format}
              onChange={handleFilmChange}
            >
              <option value="35mm">35mm</option>
              <option value="120">120</option>
              <option value="4x5">4x5</option>
              <option value="Instant">Instant</option>
            </select>
          </div>
          <div className="space-y-1">
            <Label htmlFor="iso">ISO</Label>
            <Input
              id="iso"
              name="iso"
              type="number"
              value={newFilm.iso}
              onChange={handleFilmChange}
              required
            />
          </div>
          <div className="space-y-1">
            <Label htmlFor="quantity">Quantity</Label>
            <Input
              id="quantity"
              name="quantity"
              type="number"
              value={newFilm.quantity}
              onChange={handleFilmChange}
            />
          </div>
          <Button type="submit">Add Film</Button>
        </form>
      </section>

      <section>
        <h2>Films</h2>
        <ul>
          {films.map((film) => (
            <li key={film.id} className="flex items-center gap-2">
              <span>
                {film.manufacturer} {film.name} (qty {film.quantity})
              </span>
              <Input
                type="number"
                defaultValue={film.quantity}
                className="w-20"
                onBlur={(e) => updateQuantity(film.id, e.target.value)}
              />
            </li>
          ))}
        </ul>
      </section>

      <section>
        <h2>Log Film Use</h2>
        <form onSubmit={addUse} className="space-y-2">
          <div className="space-y-1">
            <Label htmlFor="date_used">Date used</Label>
            <Input
              id="date_used"
              type="date"
              name="date_used"
              value={newUse.date_used}
              onChange={(e) =>
                setNewUse({ ...newUse, date_used: e.target.value })
              }
              required
            />
          </div>
          <div className="space-y-1">
            <Label htmlFor="film_id">Film</Label>
            <select
              id="film_id"
              name="film_id"
              className="border rounded-md p-2"
              value={newUse.film_id}
              onChange={(e) =>
                setNewUse({ ...newUse, film_id: e.target.value })
              }
              required
            >
            <option value="">Select film</option>
            {films.map((f) => (
              <option key={f.id} value={f.id}>
                {f.manufacturer} {f.name}
              </option>
            ))}
          </select>
          </div>
          <div className="space-y-1">
            <Label htmlFor="camera">Camera</Label>
            <Input
              id="camera"
              name="camera"
              value={newUse.camera}
              onChange={(e) => setNewUse({ ...newUse, camera: e.target.value })}
              required
            />
          </div>
          <div className="space-y-1">
            <Label htmlFor="location">Location</Label>
            <Input
              id="location"
              name="location"
              value={newUse.location}
              onChange={(e) =>
                setNewUse({ ...newUse, location: e.target.value })
              }
              required
            />
          </div>
          <div className="space-y-1">
            <Label htmlFor="developer">Developer</Label>
            <Input
              id="developer"
              name="developer"
              value={newUse.developer}
              onChange={(e) =>
                setNewUse({ ...newUse, developer: e.target.value })
              }
              required
            />
          </div>
          <div className="space-y-1">
            <Label htmlFor="notes">Notes</Label>
            <Input
              id="notes"
              name="notes"
              value={newUse.notes}
              onChange={(e) => setNewUse({ ...newUse, notes: e.target.value })}
            />
          </div>
          <Button type="submit">Add Use</Button>
        </form>
      </section>

      <section>
        <h2>Film Uses</h2>
        <ul>
          {uses.map((u) => (
            <li key={u.id}>
              {u.date_used} - {u.camera} ({u.location})
            </li>
          ))}
        </ul>
      </section>
    </div>
  )
}

export default App
