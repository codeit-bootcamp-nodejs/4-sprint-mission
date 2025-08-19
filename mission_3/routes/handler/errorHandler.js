function errorHandler(err, req, res, next) {
    console.error(`[ERROR] ${err.message}`);

    res.status(err.status || 500).json({ message: "An error has occurred during processing sql" });
}

export default errorHandler;