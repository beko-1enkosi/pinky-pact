/** Entry point: starts the server listener and connects to the database or external services. */
import app from './app';

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Pinky Backend running on http://localhost:${PORT}`);
});