import jwt from 'jsonwebtoken'

export function authenticateToken(req, res, next) {
    const authHeader = req.headers['authorization']
    const token = authHeader && authHeader.split(' ')[1];

    if (!token) return res.sendStatus(401);

    jwt.verify(token, 'seu_segredo', (err, user) => {
        if (err) return res.sendStatus(403)
        req.user = user
        next()
    })
}