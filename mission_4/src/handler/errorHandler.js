export default function errorHandler(err, req, res, next) {
    console.error(`[ERROR] ${err.stack || err.message}`);

    const statusCode = err.statusCode || 500;
    const message = err.message || 'Internal server error!';

    res.status(statusCode).json({ message });
}