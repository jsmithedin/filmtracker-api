import { useEffect, useState } from 'react'
import { Bar } from 'react-chartjs-2'
import {
  Chart as ChartJS,
  BarElement,
  CategoryScale,
  LinearScale,
  Tooltip,
  Legend
} from 'chart.js'

ChartJS.register(CategoryScale, LinearScale, BarElement, Tooltip, Legend)

export default function FilmStockCharts() {
  const [films, setFilms] = useState([])

  useEffect(() => {
    fetch('/api/films/')
      .then((res) => res.json())
      .then(setFilms)
  }, [])

  const byType = {}
  const byFormat = {}
  films.forEach((f) => {
    byType[f.type] = (byType[f.type] || 0) + f.quantity
    byFormat[f.format] = (byFormat[f.format] || 0) + f.quantity
  })

  const typeData = {
    labels: Object.keys(byType),
    datasets: [
      {
        label: 'Quantity',
        data: Object.values(byType),
        backgroundColor: 'rgba(59,130,246,0.7)'
      }
    ]
  }

  const formatData = {
    labels: Object.keys(byFormat),
    datasets: [
      {
        label: 'Quantity',
        data: Object.values(byFormat),
        backgroundColor: 'rgba(16,185,129,0.7)'
      }
    ]
  }

  return (
    <div className="space-y-6 max-w-screen-lg mx-auto">
      <h2 className="text-xl font-semibold mb-2">Film Stock Charts</h2>
      <div className="grid gap-4 md:grid-cols-2">
        <div>
          <Bar data={typeData} />
        </div>
        <div>
          <Bar data={formatData} />
        </div>
      </div>
    </div>
  )
}
