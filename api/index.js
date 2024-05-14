const express = require("express");
require("./configs/mongoose");
// const path = require("path");
// const envPath = path.resolve(__dirname, "./configs/links.env");
const dotenv = require("dotenv");
dotenv.config();

const PORT = process.env.REACT_APP_PORT;
const IP = process.env.REACT_APP_IP;

const app = express();
const authRoutes = require("./routes/authRoutes");
const userRoutes = require("./routes/userRoutes");
const plantRoutes = require('./routes/plantRoutes');
const postRoutes = require('./routes/postRoutes');

app.use(express.json());
app.use("/auth", authRoutes);
app.use("/user", userRoutes);
app.use('/plants', plantRoutes);
app.use('/posts', postRoutes);

app.listen(PORT, IP, () => {
  console.log(`server running at : http://192.168.100.17:3000/`);
});
