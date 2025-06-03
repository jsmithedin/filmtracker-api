import { useEffect, useState } from 'react'
import { Button } from '../components/ui/button'
import { Input } from '../components/ui/input'
import { Label } from '../components/ui/label'

export default function FilmUses() {
  const [films, setFilms] = useState([])
  const [uses, setUses] = useState([])
  const [newUse, setNewUse] = useState({
    date_used: '',
    film_id: '',
    camera: '',
    location: '',
    developer: '',
    notes: ''
  })
  const [sortField, setSortField] = useState('date_used')
  const [sortAsc, setSortAsc] = useState(true)

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

  const handleSort = (field) => {
    if (sortField === field) {
      setSortAsc(!sortAsc)
    } else {
      setSortField(field)
      setSortAsc(true)
    }
  }

  const sortedUses = [...uses].sort((a, b) => {
    if (a[sortField] < b[sortField]) return sortAsc ? -1 : 1
    if (a[sortField] > b[sortField]) return sortAsc ? 1 : -1
    return 0
  })

  const filmMap = Object.fromEntries(films.map((f) => [f.id, f]))

  return (
    <div className="space-y-6">
      <section>
        <h2 className="text-xl font-semibold mb-2">Log Film Use</h2>
        <form onSubmit={addUse} className="space-y-2">
          <div className="space-y-1">
            <Label htmlFor="date_used">Date used</Label>
            <Input
              id="date_used"
              type="date"
              name="date_used"
              value={newUse.date_used}
              onChange={(e) => setNewUse({ ...newUse, date_used: e.target.value })}
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
              onChange={(e) => setNewUse({ ...newUse, film_id: e.target.value })}
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
              onChange={(e) => setNewUse({ ...newUse, location: e.target.value })}
              required
            />
          </div>
          <div className="space-y-1">
            <Label htmlFor="developer">Developer</Label>
            <Input
              id="developer"
              name="developer"
              value={newUse.developer}
              onChange={(e) => setNewUse({ ...newUse, developer: e.target.value })}
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
        <h2 className="text-xl font-semibold mb-2">Film Uses</h2>
        <div className="overflow-x-auto">
          <table className="min-w-full border text-sm">
            <thead>
              <tr className="border-b bg-gray-100 dark:bg-gray-800">
                <th className="p-2 cursor-pointer" onClick={() => handleSort('date_used')}>
                  Date
                </th>
                <th className="p-2 cursor-pointer" onClick={() => handleSort('film_id')}>
                  Film
                </th>
                <th className="p-2 cursor-pointer" onClick={() => handleSort('camera')}>
                  Camera
                </th>
                <th className="p-2 cursor-pointer" onClick={() => handleSort('location')}>
                  Location
                </th>
                <th className="p-2 cursor-pointer" onClick={() => handleSort('developer')}>
                  Developer
                </th>
                <th className="p-2 cursor-pointer" onClick={() => handleSort('notes')}>
                  Notes
                </th>
              </tr>
            </thead>
            <tbody>
              {sortedUses.map((u) => (
                <tr key={u.id} className="border-b hover:bg-gray-50 dark:hover:bg-gray-700">
                  <td className="p-2">{u.date_used}</td>
                  <td className="p-2">
                    {filmMap[u.film_id] ? `${filmMap[u.film_id].manufacturer} ${filmMap[u.film_id].name}` : u.film_id}
                  </td>
                  <td className="p-2">{u.camera}</td>
                  <td className="p-2">{u.location}</td>
                  <td className="p-2">{u.developer}</td>
                  <td className="p-2">{u.notes}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  )
}
