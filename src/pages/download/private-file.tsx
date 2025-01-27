import { GetServerSidePropsContext } from "next";
import { downloadPrivateFile } from "@/actions/downloadPrivateFile";
import { useRouter } from "next/router";
import { useEffect } from "react";
import appConstant from "@/services/appConstant";
import { getFileExtension } from "@/lib/utils";

const DownloadCertificate = () => {
  const router = useRouter();

  useEffect(() => {
    const { fileUrl } = router.query;
    if (fileUrl) {
      window.location.reload();
    }
  }, [router.query]);

  return null;
};

export default DownloadCertificate;

export const getServerSideProps = async (ctx: GetServerSidePropsContext) => {
  const { req, res, query } = ctx;

  if (query?.fileUrl) {
    let fileUrl = query.fileUrl as string;
    const fileName = new URL(fileUrl).pathname.split("/").pop() as string;
    const fileExtension = getFileExtension(fileName);
    let contentType = "application/octet-stream"; // Fallback MIME type

    const getFile = await downloadPrivateFile(fileUrl);

    if (getFile.body) {
      const arrayBuffer = getFile.body;
      const buffer = Buffer.from(arrayBuffer);

      if (fileExtension && appConstant.mimeType[fileExtension]) {
        contentType = appConstant.mimeType[fileExtension];
      }

      res.setHeader("Content-Type", contentType);
      res.setHeader("Content-Disposition", `attachment; filename="${fileName}"`);

      res.write(buffer);
      res.end();
      return {
        props: {},
      };
    } else {
      res.writeHead(404, { "Content-Type": "text/plain" });
      res.end("Certificate not found");
      return { props: {} };
    }
  }
};
