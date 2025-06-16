import dynamic from 'next/dynamic'
import type { DataPoint } from './ChartInner'

const Chart = dynamic(() => import('./ChartInner'), { ssr: false })

export type { DataPoint }
export default Chart
