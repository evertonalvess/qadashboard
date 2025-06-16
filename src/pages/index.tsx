import { useEffect, useState } from 'react'
import Papa from 'papaparse'
import { motion } from 'framer-motion'
import { Button } from '@/components/ui/button'
import Chart, { DataPoint } from '@/components/Chart'

export default function Home() {
  const [data, setData] = useState<DataPoint[]>([])

  useEffect(() => {
    fetch('/sample-data.csv')
      .then((res) => res.text())
      .then((text) => {
        const result = Papa.parse<DataPoint>(text, { header: true })
        const parsed = result.data as DataPoint[]
        setData(parsed)
      })
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
      <Chart data={data} />
      <Button>Example Button</Button>
    </main>
  )
}
