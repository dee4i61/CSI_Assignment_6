const app = require("./app");
const dotenv = require("dotenv");

dotenv.config();

// Server listen
const PORT = process.env.PORT || 4000;

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
