import { PrismaClient } from "@prisma/client";
import Elysia, { error, t } from "elysia";

const prisma = new PrismaClient()

const service = new Elysia({ prefix: `/service` })
  .get(`/`, async () => {
      try {
        const response = await prisma.service.findMany()
        return {
          message: `Find service successfully`,
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
      const response = await prisma.service.create({
        data: body,
      })
      return {
        message: `Create service successfully`,
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
  .put(`/`, async ({body: {id, name}}) => {
    try {
      const response = await prisma.service.update({
        where: {
          id: id,
        },
        data: {
          name: name,
        }
      })
      return {
        message: `Update service success`,
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
  },{
    body: t.Object({
      id: t.Number(),
      name: t.String(),
    })
  })

export default service