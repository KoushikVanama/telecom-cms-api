import express from 'express';
const app = express();

const PORT = process.env.PORT || 4000;

app.get("/", (req, res) => {
    res.send("Hi");
});

app.listen(PORT, () => {
    console.log(`app listening on ${PORT}`);
});

module.exports = app;