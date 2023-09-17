import authRouter from './auth.js'
import loanRouter from './loan.js'
import assetRouter from './asset.js'
import userRouter from './user.js'

const route = (app) => {
    app.use('/api/auth', authRouter);
    app.use('/api/loan', loanRouter)
    app.use('/api/asset', assetRouter)
    app.use('/api/user', userRouter)
}

export default route