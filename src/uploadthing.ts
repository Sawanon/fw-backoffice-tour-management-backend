import Elysia, { file, form, t } from "elysia";
import { createUploadthing, type FileRouter, UTApi } from "uploadthing/server";

export const utapi = new UTApi({
  // ...options,
});


const f = createUploadthing();

const uploadRouter = {
  // Define as many FileRoutes as you like, each with a unique routeSlug
  imageUploader: f({
    image: {
      /**
       * For full list of options and defaults, see the File Route API reference
       * @see https://docs.uploadthing.com/file-routes#route-config
       */
      maxFileSize: "4MB",
      maxFileCount: 1,
    },
  }).onUploadComplete((data) => {
    console.log("upload completed", data);
  }),
} satisfies FileRouter;

const upload = new Elysia({ prefix: `/upload` })
  .post(`/`, async ({body}) => {
    // console.log(body);
    // console.log(body.file);
    const response = await utapi.uploadFiles(body.file)
    return {
      message: `Upload file successfully`,
      data: {
        url: response.data?.ufsUrl,
      },
    }
  },{
    body: t.Object({
      file: t.File({format: `image/*`}),
    }),
  })
  .delete(`/`, async ({body: {fileKey}}) => {
    const response = await utapi.deleteFiles(fileKey, {keyType: 'fileKey'})
    return {
      message: `Delete file successfully`,
      data: response,
    }
  },{
    body: t.Object({
      fileKey: t.String(),
    }),
  })

export {
  uploadRouter,
  upload,
}

export type OurFileRouter = typeof uploadRouter;
