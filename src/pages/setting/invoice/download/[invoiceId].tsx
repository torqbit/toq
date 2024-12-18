import { GetServerSidePropsContext, NextPage } from "next";
import prisma from "@/lib/prisma";
import { downloadPrivateFile } from "@/actions/downloadPrivateFile";

const DownloadInvoice = () => null;

export default DownloadInvoice;

export const getServerSideProps = async (ctx: GetServerSidePropsContext) => {
  const { req, res } = ctx;

  const params = ctx?.query;

  const invoice = await prisma.invoice.findUnique({
    where: {
      id: Number(params.invoiceId),
    },
    select: {
      pdfPath: true,
    },
  });

  if (invoice?.pdfPath) {
    const getFile = await downloadPrivateFile(invoice.pdfPath);

    if (getFile.body) {
      const arrayBuffer = getFile.body;

      const buffer = Buffer.from(arrayBuffer);

      res.setHeader("Content-Type", "application/pdf");
      res.setHeader("Content-Disposition", `inline;`);

      res.write(buffer);
      res.end();

      return {
        props: {},
      };
    }
  }
};
