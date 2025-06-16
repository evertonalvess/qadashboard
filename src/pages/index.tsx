import { useEffect, useState } from 'react'
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts'
import Papa from 'papaparse'
import { motion } from 'framer-motion'
import { Button } from '@/components/ui/button'

interface DataPoint {
  name: string
  value: number
}

export default function Home() {
  const [data, setData] = useState<DataPoint[]>([])

  useEffect(() => {
    const csv = `name,value\nA,12\nB,23\nC,18\nD,30`
    const result = Papa.parse(csv, { header: true })
    const parsed = result.data as DataPoint[]
    setData(parsed)
  }, [])

  return (
    <main className="p-8 space-y-8 bg-background text-foreground min-h-screen">
      <motion.h1
        className="text-3xl font-bold text-accent"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        QA Dashboard
      </motion.h1>
      <div className="w-full h-64">
        <ResponsiveContainer>
          <LineChart data={data} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name" />
            <YAxis />
            <Tooltip />
            <Line type="monotone" dataKey="value" stroke="#7f5af0" />
          </LineChart>
        </ResponsiveContainer>
      </div>
      <Button>Example Button</Button>
    </main>
  )
}
