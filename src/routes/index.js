import authRouter from './auth.js'

const route = (app) => {
    app.use('/api/auth', authRouter);
}

export default route