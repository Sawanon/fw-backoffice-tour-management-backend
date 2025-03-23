import { PrismaClient } from "@prisma/client";
import Elysia, { error, t } from "elysia";

const prisma = new PrismaClient();

const admin = new Elysia({ prefix: `/admin` })
  .get(`/`, async () => {
    try {
      const response = await prisma.admin.findMany()
      return {
        message: `Get admin sucessfully`,
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
  .post(
  `/`,
  async ({ body }) => {
    try {
      const response = await prisma.admin.create({
        data: body,
      });
      return {
        message: `Create admin successfully`,
        data: response,
      };
    } catch (e) {
      return error(400, {
        message: `${e}`,
      });
    } finally {
      prisma.$disconnect();
    }
  },
  {
    body: t.Object({
      email: t.String({ format: `email` }),
      password: t.String({ minLength: 8, error: `min length 8 charactor` }),
      fname: t.String(),
      lname: t.String(),
      mobile: t.Optional(t.String()),
      permission: t.String(),
      status: t.UnionEnum(["ONLINE", "OFFLINE"], {
        error: `value should "ONLINE" or "OFFLINE"`,
      }),
    }),
  }
)
.post("/login", async ({body: {email, password}}) => {
  try {
    const response = await prisma.admin.findFirst({
      where: {
        email: email,
        password: password,
      },
    })
    if(!response){
      return error(401, {
        message: `Failed to login`,
      })
    }
    return {
      message: `Login successfully`,
      data: response,
    }
  } catch (e) {
    console.error(e)
    return error(400, {
      message: `${e}`,
    });
  } finally {
    prisma.$disconnect()
  }
  // const reesponse = await 
},{
  body: t.Object({
    email: t.String(),
    password: t.String(),
  }),
});

export default admin;
