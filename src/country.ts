import { PrismaClient } from "@prisma/client";
import Elysia, { error, t } from "elysia";

const prisma = new PrismaClient()

const country = new Elysia({ prefix: `/country` })
  .get(`/`, async () => {
    try {
      const response = await prisma.country.findMany()
      return {
        message: `Find country successfully`,
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
      const response = await prisma.country.create({
        data: body,
      })
      return {
        message: `Create country successfully`,
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

export default country