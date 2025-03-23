import { PrismaClient } from "@prisma/client";
import Elysia, { error, t } from "elysia";
import { utapi } from "./uploadthing";

const prisma = new PrismaClient()

const tour = new Elysia({ prefix: `/tour` })
  .get(`/`, async () => {
    try {
      const response = await prisma.tour.findMany({
        include: {
          city: {
            select: {
              name: true,
            },
          },
          country: {
            select: {
              name: true,
            },
          },
        },
      })
      return {
        message: `Find tour successfully`,
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
  .get(`/:id`, async ({params: {id}}) => {
    try {
      const response = await prisma.tour.findMany({
        where: {
          id: parseInt(id),
        }
      })
      return {
        message: `Get tour successfully`,
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
  .post(
  `/`,
  async ({body}) => {
    console.log(body);
    
    try {
      const response = await prisma.tour.create({
        data: body,
        include: {
          city: {
            select: {
              name: true,
            },
          },
          country: {
            select: {
              name: true,
            },
          },
        },
      })
      return {
        message: "test",
        data: response,
      }
    } catch (e) {
      return error(400, {
        message: `${e}`
      })
    } finally {
      prisma.$disconnect()
    }
  },
  {
    body: t.Object({
      name: t.String(),
      description: t.Optional(t.String()),
      photo: t.Optional(t.String()),
      cityId: t.Number(),
      countryId: t.Number(),
      serviceId: t.Number(),
      location: t.Optional(t.String()),
      email: t.String({ format: `email`, error: `invalid format email` }),
      password: t.String({}),
      contact: t.String(),
      mobile: t.String(),
      tag: t.String(),
      status: t.UnionEnum(["ONLINE", "OFFLINE"], {
        error: `value should "ONLINE" or "OFFLINE"`,
      }),
      // createDate  DateTime @default(now())
      createById: t.Number(),
      // updateDate  DateTime @updatedAt
      updateById: t.Optional(t.Number()),
    }),
  }
)
.delete(`/`, async ({body: {id}}) => {
  try {
    const response = await prisma.tour.delete({
      where: {
        id: id,
      }
    })
    if(!response){
      return error(400, {
        message: `Delete tour failed`,
      })
    }
    const fileKey = response.photo?.split(`/`).reverse()[0]
    const responseDeleteFile = await utapi.deleteFiles(fileKey!)
    return {
      message: `Delete tour successfully`,
      data: response,
      fileData: responseDeleteFile,
    }
  } catch (e) {
    console.error(e)
    return error(400, {
      message: `${e}`
    })
  } finally {
    prisma.$disconnect()
  }
},{
  body: t.Object({
    id: t.Number(),
  }),
})
.get(`/information/:tourId`, async ({params: {tourId}}) => {
  try {
    const response = await prisma.tour.findFirst({
      where: {
        id: tourId,
      },
      select: {
        tourInformation: true,
      },
      // include: {
      //   tourinformation: true,
      // },
    })
    return {
      message: `Get tour information successfully`,
      data: response,
    }
  } catch (e) {
    console.error(e)
    return error(400, {
      message: `${e}`
    })
  } finally {
    prisma.$disconnect()
  }
},{
  params: t.Object({
    tourId: t.Number(),
  })
})
.post(`/information`, async ({body: {tourId, icon, name, position}}) => {
  try {
    const response = await prisma.tourInformation.create({
      data: {
        tourId: tourId,
        icon: icon,
        name: name,
        position: position,
      }
    })
    return {
      message: `Create tour information successfully`,
      data: response,
    }
  } catch (e) {
    console.error(e)
    return error(400, {
      message: `${e}`
    })
  }
  
},{
  body: t.Object({
    tourId: t.Number(),
    icon: t.String(),
    name: t.String(),
    position: t.Number(),
    // tourinformation: t.Object({
    // })
  })
})
.delete(`/information`, async ({body: {tourInformationId}}) => {
  try {
    const response = await prisma.tourInformation.delete({
      where: {
        id: tourInformationId,
      },
    })
    return {
      message: `Delete tour information successfully`,
      data: response,
    }
  } catch (e) {
    console.error(e)
    return error(400, {
      message: `${e}`
    })
  } finally {
    prisma.$disconnect()
  }
},{
  body: t.Object({
    tourInformationId: t.Number(),
  }),
})
.get(`/information/detail`, async () => {
  try {
    const response = await prisma.detail.findMany({
      where: {
        table: `TourInformation`,
      }
    })
    return {
      message: `Get tour information detail successfully`,
      data: response,
    }
  } catch (e) {
    console.error(e)
    return error(400, {
      message: `${e}`
    })
  } finally {
    prisma.$disconnect()
  }
})
.post(`/information/detail`, async ({body: {type,position, tourInformationId, detail}}) => {
  try {
    const response = await prisma.detail.create({
      data: {
        table: `TourInformation`,
        tableId: tourInformationId,
        detail: detail,
        position: position,
        type: type,
      }
    })
    return {
      message: `Create tour information detail successfully`,
      data: response,
    }
  } catch (e) {
    console.error(e)
    return error(400, {
      message: `${e}`
    })
  } finally {
    prisma.$disconnect()
  }
},{
  body: t.Object({
    tourInformationId: t.Number(),
    detail: t.String(),
    position: t.Number(),
    type: t.UnionEnum([`PHOTO`, `TEXT`]),
  })
});

export default tour;
