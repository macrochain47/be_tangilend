import authRouter from './auth.js'
import loanRouter from './loan.js'

const route = (app) => {
    app.use('/api/auth', authRouter);
    app.use('/api/loan', loanRouter)
}

export default route