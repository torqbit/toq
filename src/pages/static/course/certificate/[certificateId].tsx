import { GetServerSidePropsContext, NextPage } from "next";
import prisma from "@/lib/prisma";
import { downloadPrivateFile } from "@/actions/downloadPrivateFile";

const StaticImagePage = () => null;

export default StaticImagePage;

export const getServerSideProps = async (ctx: GetServerSidePropsContext) => {
  const { req, res } = ctx;

  const params = ctx?.query;

  const certificate = await prisma.courseCertificates.findUnique({
    where: {
      id: String(params.certificateId),
    },
    select: {
      imagePath: true,
    },
  });

  if (certificate?.imagePath) {
    const getFile = await downloadPrivateFile(certificate?.imagePath);

    if (getFile.body) {
      const arrayBuffer = getFile.body;

      const buffer = Buffer.from(arrayBuffer);

      res.setHeader("Content-Type", "application/pdf");
      res.setHeader("Content-Disposition", `inline; `);

      res.write(buffer);
      res.end();
    }
    return { props: {} };
  }
};
