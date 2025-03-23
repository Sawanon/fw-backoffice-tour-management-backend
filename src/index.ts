import { Elysia, error, t } from "elysia";
import { cors } from '@elysiajs/cors'

// DATABASE
import { Pool } from 'pg'
import { PrismaPg } from '@prisma/adapter-pg'
import { PrismaClient } from '@prisma/client'
import tour from "./tour";
import city from "./city";
import country from "./country";
import service from "./service";
import admin from "./admin";
import { upload } from "./uploadthing";

const connectionString = `${process.env.DATABASE_URL}`

const pool = new Pool({ connectionString })
const adapter = new PrismaPg(pool)
const prisma = new PrismaClient({ adapter })
// DATABASE

const app = new Elysia()
  .onRequest(({request}) => {
    console.log(request.url);
  })
  .use(cors())
  .use(tour)
  .use(city)
  .use(country)
  .use(service)
  .use(admin)
  .use(upload)
  .get("/", () => "Hello Elysia")
  .post("/add", async ({body: {name, email}}) => {
    try {
      const response = await prisma.user.create({
        data: {
          name: name,
          email: email,
        }
      })
      return {
        message: "Create user successfully",
        data: response,
      }
    } catch (e) {
      console.error(e)
      return error(400, {
        message: `${e}`,
      })
    } finally {
      prisma.$disconnect()
    }
  },{
    body: t.Object({
      name: t.String(),
      email: t.String(),
    })
  })
  .get("/test", async () => {
    try {
      const response = await prisma.user.findMany()
      return {
        message: "OK",
        data: response,
      }
    } catch (e) {
      return error(400, {
        message: `${e}`,
      })
    } finally {
      prisma.$disconnect()
    }
  })
  .listen(3000);

console.log(
  `🦊 Elysia is running at ${app.server?.hostname}:${app.server?.port}`
);
