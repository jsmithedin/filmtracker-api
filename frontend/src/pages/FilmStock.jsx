import { useEffect, useState } from 'react'
import { Button } from '../components/ui/button'
import { Input } from '../components/ui/input'
import { Label } from '../components/ui/label'

export default function FilmStock() {
  const [films, setFilms] = useState([])
  const [newFilm, setNewFilm] = useState({
    manufacturer: '',
    name: '',
    type: 'BW',
    format: '35mm',
    iso: 100,
    quantity: 1
  })
  const [sortField, setSortField] = useState('manufacturer')
  const [sortAsc, setSortAsc] = useState(true)

  const fetchFilms = () =>
    fetch('/api/films/')
      .then((res) => res.json())
      .then(setFilms)

  useEffect(() => {
    fetchFilms()
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

  const handleSort = (field) => {
    if (sortField === field) {
      setSortAsc(!sortAsc)
    } else {
      setSortField(field)
      setSortAsc(true)
    }
  }

  const sortedFilms = [...films].sort((a, b) => {
    if (a[sortField] < b[sortField]) return sortAsc ? -1 : 1
    if (a[sortField] > b[sortField]) return sortAsc ? 1 : -1
    return 0
  })

  return (
    <div className="space-y-6">
      <section>
        <h2 className="text-xl font-semibold mb-2">Add Film</h2>
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
        <h2 className="text-xl font-semibold mb-2">Film Stock</h2>
        <div className="overflow-x-auto">
          <table className="min-w-full border text-sm">
            <thead>
              <tr className="border-b bg-gray-100 dark:bg-gray-800">
                <th className="p-2 cursor-pointer" onClick={() => handleSort('manufacturer')}>
                  Manufacturer
                </th>
                <th className="p-2 cursor-pointer" onClick={() => handleSort('name')}>
                  Name
                </th>
                <th className="p-2 cursor-pointer" onClick={() => handleSort('type')}>
                  Type
                </th>
                <th className="p-2 cursor-pointer" onClick={() => handleSort('format')}>
                  Format
                </th>
                <th className="p-2 cursor-pointer" onClick={() => handleSort('iso')}>
                  ISO
                </th>
                <th className="p-2 cursor-pointer" onClick={() => handleSort('quantity')}>
                  Quantity
                </th>
              </tr>
            </thead>
            <tbody>
              {sortedFilms.map((film) => (
                <tr key={film.id} className="border-b hover:bg-gray-50 dark:hover:bg-gray-700">
                  <td className="p-2">{film.manufacturer}</td>
                  <td className="p-2">{film.name}</td>
                  <td className="p-2">{film.type}</td>
                  <td className="p-2">{film.format}</td>
                  <td className="p-2">{film.iso}</td>
                  <td className="p-2">
                    <Input
                      type="number"
                      defaultValue={film.quantity}
                      className="w-20"
                      onBlur={(e) => updateQuantity(film.id, e.target.value)}
                    />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  )
}
