import { GetServerSidePropsContext } from "next";

import prisma from "@/lib/prisma";
import { downloadPrivateFile } from "@/actions/downloadPrivateFile";
import { useRouter } from "next/router";
import { useEffect } from "react";

const DownloadCertificate = () => {
  const router = useRouter();

  useEffect(() => {
    const { certificateId } = router.query;

    if (certificateId) {
      window.location.reload();
    }
  }, [router.query]);

  return null;
};

export default DownloadCertificate;

export const getServerSideProps = async (ctx: GetServerSidePropsContext) => {
  const { req, res, query } = ctx;

  const certificate = await prisma.courseCertificates.findUnique({
    where: {
      id: String(query.certificateId),
    },
    select: {
      pdfPath: true,
    },
  });
  if (certificate?.pdfPath) {
    const getFile = await downloadPrivateFile(certificate?.pdfPath);

    if (getFile.body) {
      const arrayBuffer = getFile.body;
      const buffer = Buffer.from(arrayBuffer);

      res.setHeader("Content-Type", "application/pdf");
      res.setHeader("Content-Disposition", `inline; `);

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
