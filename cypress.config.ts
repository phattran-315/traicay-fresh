import { defineConfig } from "cypress";
import { seedDb } from "./src/payload/test/seed-db";

export default defineConfig({
  component: {
    devServer: {
      framework: "next",
      bundler: "webpack",
    },
  },
  e2e: {
    defaultCommandTimeout:10000,
    baseUrl: process.env.NEXT_PUBLIC_SERVER_URL || "http://localhost:3000",
    setupNodeEvents(on, config) {
      on('task',{
        seedDb:async()=>{
          await seedDb()
          return null
        }
      })
      // implement node event listeners here
    },
  },
});
