import app from "./app";
import { prisma } from "./lib/prisma";

const PORT = process.env.PORT || 5000;

async function main() {
  try {
    prisma.$connect();
    console.log("Connected to the database successfully!");

    app.listen(PORT, () => {
      console.log(`Blog app listening on port ${PORT}`);
    });
  } catch (error) {
    console.log("An error occured:", error);
    prisma.$disconnect();
    process.exit(1);
  }
}

main();
