import express from 'express'
import cors from 'cors'
import { offersRouter } from './routes/bid.js'

const app = express()
const PORT = process.env.PORT || 4000

// Middleware
app.use(cors())
app.use(express.json())

// Routes
app.use('/api/v1/offers', offersRouter)

// Health check
app.get('/health', (_req, res) => {
    res.json({ status: 'ok', timestamp: new Date().toISOString() })
})

// Start server
app.listen(PORT, () => {
    console.log(`🚀 FairCrop backend running on http://localhost:${PORT}`)
})

export default app
