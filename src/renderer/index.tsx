import './global.css'
import { createRoot } from 'react-dom/client'

import Console from './pages/Console'

const container = document.getElementById('root')
const root = createRoot(container!)

root.render(<Console />)
