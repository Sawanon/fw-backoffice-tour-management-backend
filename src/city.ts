import { PrismaClient } from "@prisma/client";
import Elysia, { error, t } from "elysia";

const prisma = new PrismaClient()

const city = new Elysia({ prefix: `/city` })
  .get(`/`, async () => {
    try {
      const response = await prisma.city.findMany()
      return {
        message: `Find city successfully`,
        data: response,
      }
    } catch (e) {
      console.error(e)
      return error(400, {
        message: e,
      })
    } finally {
      prisma.$disconnect()
    }
  })
  .post(`/`, async ({body}) => {
    try {
      const response = await prisma.city.create({
        data: body,
      })
      return {
        message: `Create city successfully`,
        data: response,
      }
    } catch (e) {
      return error(400, {
        message: `${e}`
      })
    } finally {
      prisma.$disconnect()
    }
  },{
    body: t.Object({
      name: t.String(),
    })
  })

export default city