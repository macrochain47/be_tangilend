import authRouter from './auth.js'
import loanRouter from './loan.js'
import nftRouter from './nft.js'

const route = (app) => {
    app.use('/api/auth', authRouter);
    app.use('/api/loan', loanRouter)
    app.use('/api/nft', nftRouter)
}

export default route