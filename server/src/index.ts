// Internal Imports
import { configureEnv } from "./utils/env";

console.log("Configuring environment...");
configureEnv()
  .then(() => console.log("Done."))
  .then(async () => {
    const app = (await import("./app")).default;
    const PORT = process.env.SERVER_PORT || 8080;
    app.listen(PORT, () => {
      console.log(`Server is running on port ${PORT}.`);
    });
  })
  .catch((err) => {
    console.log("Error initializing server", err);
    process.exit(-1);
  });
