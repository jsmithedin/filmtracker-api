import { useEffect, useState } from 'react'
import { Button } from '../components/ui/button'
import { Input } from '../components/ui/input'
import { Label } from '../components/ui/label'

function Modal({ open, onClose, children }) {
  if (!open) return null
  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50"
      onClick={onClose}
    >
      <div
        className="rounded-md bg-white p-4 shadow-md dark:bg-gray-900"
        onClick={(e) => e.stopPropagation()}
      >
        {children}
      </div>
    </div>
  )
}

export default function FilmStock() {
  const [films, setFilms] = useState([])
  const [editedQuantities, setEditedQuantities] = useState({})
  const [showModal, setShowModal] = useState(false)
  const [newFilm, setNewFilm] = useState({
    manufacturer: '',
    name: '',
    type: 'BW',
    format: '35mm',
    iso: 100,
    quantity: 1
  })
  const [formatFilter, setFormatFilter] = useState('')
  const [typeFilter, setTypeFilter] = useState('')
  const [sortField, setSortField] = useState('manufacturer')
  const [sortAsc, setSortAsc] = useState(true)

  const fetchFilms = () =>
    fetch('/api/films/')
      .then((res) => res.json())
      .then((data) => {
        setFilms(data)
        const q = {}
        data.forEach((f) => {
          q[f.id] = f.quantity
        })
        setEditedQuantities(q)
      })

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
      setShowModal(false)
    })
  }

  const handleQuantityChange = (id, quantity) => {
    setEditedQuantities({ ...editedQuantities, [id]: quantity })
  }

  const confirmUpdates = () => {
    Promise.all(
      films.map((film) =>
        fetch(`/api/films/${film.id}?quantity=${editedQuantities[film.id]}`, {
          method: 'PATCH'
        })
      )
    ).then(fetchFilms)
  }

  const handleSort = (field) => {
    if (sortField === field) {
      setSortAsc(!sortAsc)
    } else {
      setSortField(field)
      setSortAsc(true)
    }
  }

  const filteredFilms = films.filter(
    (f) =>
      (!typeFilter || f.type === typeFilter) &&
      (!formatFilter || f.format === formatFilter)
  )

  const sortedFilms = [...filteredFilms].sort((a, b) => {
    if (a[sortField] < b[sortField]) return sortAsc ? -1 : 1
    if (a[sortField] > b[sortField]) return sortAsc ? 1 : -1
    return 0
  })

  return (
    <div className="space-y-6">
      <Button onClick={() => setShowModal(true)}>Add Film</Button>
      <Modal open={showModal} onClose={() => setShowModal(false)}>
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
          <div className="flex justify-end gap-2">
            <Button type="submit">Add Film</Button>
            <Button variant="secondary" onClick={() => setShowModal(false)}>
              Close
            </Button>
          </div>
        </form>
      </Modal>
      <section>
        <h2 className="text-xl font-semibold mb-2">Film Stock</h2>
        <div className="mb-2 flex gap-2">
          <div>
            <Label htmlFor="typeFilter">Type</Label>
            <select
              id="typeFilter"
              value={typeFilter}
              onChange={(e) => setTypeFilter(e.target.value)}
              className="border rounded-md p-1"
            >
              <option value="">All</option>
              <option value="BW">BW</option>
              <option value="Colour">Colour</option>
              <option value="Colour Reversal">Colour Reversal</option>
            </select>
          </div>
          <div>
            <Label htmlFor="formatFilter">Format</Label>
            <select
              id="formatFilter"
              value={formatFilter}
              onChange={(e) => setFormatFilter(e.target.value)}
              className="border rounded-md p-1"
            >
              <option value="">All</option>
              <option value="35mm">35mm</option>
              <option value="120">120</option>
              <option value="4x5">4x5</option>
              <option value="Instant">Instant</option>
            </select>
          </div>
        </div>
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
                      value={editedQuantities[film.id]}
                      className="w-20"
                      onChange={(e) =>
                        handleQuantityChange(film.id, e.target.value)
                      }
                    />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          <div className="mt-2 text-right">
            <Button onClick={confirmUpdates}>Confirm Updates</Button>
          </div>
        </div>
      </section>
    </div>
  )
}
