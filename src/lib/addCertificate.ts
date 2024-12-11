import { certificateConfig } from "@/lib/certificatesConfig";
import { createCanvas, loadImage, registerFont } from "canvas";
import fs from "fs";
import prisma from "./prisma";
const PDFDocument = require("pdfkit");

import path from "path";

import appConstant from "@/services/appConstant";
import { ContentManagementService } from "@/services/cms/ContentManagementService";
import MailerService from "@/services/MailerService";
import { ICertificateInfo, ICertificateReponse } from "@/types/courses/Course";
import { createTempDir } from "@/actions/checkTempDirExist";
import { getCertificateDescripiton1, getCertificateDescripiton2 } from "./utils";
import { getSiteConfig } from "@/services/getSiteConfig";
import { PageSiteConfig } from "@/services/siteConstant";

export const getDateAndYear = (dateInfo?: Date) => {
  const currentDate = dateInfo ? dateInfo : new Date();
  const year = currentDate.getFullYear();
  const monthNumber = currentDate.getMonth();
  const day = currentDate.getDate();
  const date = new Date(year, monthNumber, day); // 2009-11-10
  const monthName = date.toLocaleString("default", { month: "long" });
  return `${monthName} ${day}, ${year}`;
};

export const onCreateImg = async (
  descripition1: string,
  descripition2: string,
  studentName: string,
  authorName: string,
  certificateIssueId: string,
  dateOfCompletion: string,
  certificateId?: string
) => {
  const { site }: { site: PageSiteConfig } = getSiteConfig();
  const certificateData = certificateConfig.find((c) => c.id === certificateId);

  const filePath = path.join(process.cwd(), `/public/${certificateData?.path}`);
  const italicPath = path.join(process.cwd(), appConstant.fontDirectory.dmSerif.italic);
  const regularPath = path.join(process.cwd(), appConstant.fontDirectory.dmSerif.regular);
  const kalamPath = path.join(process.cwd(), appConstant.fontDirectory.kalam);
  const kaushanPath = path.join(process.cwd(), appConstant.fontDirectory.kaushan);
  const outputPath = path.join(`${process.env.MEDIA_UPLOAD_PATH}/${appConstant.certificateTempFolder}`, `${certificateIssueId}.png`);

  registerFont(kalamPath, { family: "Kalam" });
  registerFont(kaushanPath, { family: "Kaushan Script" });

  const canvas = createCanvas(2000, 1414);
  const ctx = canvas.getContext("2d");

  const uploadedPath =
    certificateData?.color &&
    (await loadImage(filePath).then((image) => {
      ctx.drawImage(image, 0, 0);

      ctx.font = '30px "Arial"';
      ctx.fillStyle = certificateData.color.description;
      ctx.textAlign = "center";
      ctx.fillText(descripition1, certificateData?.coordinates.description.x, certificateData?.coordinates.description.y);
      ctx.fillStyle = certificateData.color.description;
      ctx.textAlign = "center";
      ctx.fillText(descripition2, certificateData?.coordinates.description.x, certificateData?.coordinates.description.y + 40);
      ctx.font = `${80 - 0.5 * studentName.length}px "Kaushan Script"`;
      ctx.fillStyle = certificateData?.color.student;
      ctx.textAlign = "center";
      ctx.fillText(studentName, certificateData?.coordinates.student.x, certificateData?.coordinates.student.y);
      ctx.font = '40px "Kalam"';
      ctx.fillStyle = certificateData?.color.authorSignature;
      ctx.textAlign = "center";
      ctx.fillText(authorName, certificateData?.coordinates.authorSignature.x, certificateData?.coordinates.authorSignature.y);
      ctx.font = '40px "Kaushan Script"';
      ctx.fillStyle = certificateData?.color.date;
      ctx.textAlign = "center";
      ctx.fillText(dateOfCompletion, certificateData?.coordinates.dateOfCompletion.x, certificateData?.coordinates.dateOfCompletion.y);
      const buffer = canvas.toBuffer("image/png");

      fs.writeFileSync(outputPath, new Uint8Array(buffer));

      image.onerror = function (err) {
        console.log("add label err", err);
      };
      return outputPath;
    }));

  return uploadedPath;
};

export const generateCertificate = async (
  certificateIssueId: string,
  descripition1: string,
  descripition2: string,
  studentName: string,
  authorName: string,
  dateOfCompletion: string,
  certificateId: string,
  onComplete: (pdfTempPath: string, imgPath: string) => void,
  onReject: (error: string) => void
) => {
  if (!createTempDir(String(process.env.MEDIA_UPLOAD_PATH), appConstant.certificateTempFolder)) {
    return onReject("Environment variable MEDIA_UPLOAD_PATH is not set.");
  }
  const imgUploadPath = await onCreateImg(
    descripition1,
    descripition2,
    studentName,
    authorName,
    certificateIssueId,
    dateOfCompletion,
    certificateId
  );

  // Create a document
  const doc = new PDFDocument({ size: "A4", margin: 0, layout: "landscape" });

  const uploadPdfPath = path.join(`${process.env.MEDIA_UPLOAD_PATH}/${appConstant.certificateTempFolder}`, `${certificateIssueId}.pdf`);
  const outputStream = doc.pipe(fs.createWriteStream(uploadPdfPath));

  doc
    .image(imgUploadPath, 0, 0, {
      width: 841,
      height: 595,
      align: "center",
      valign: "center",
    })
    .save();

  doc.end();
  outputStream.on("finish", () => {
    imgUploadPath && onComplete(uploadPdfPath, imgUploadPath);
  });
};

export const createCertificate = async (certificatInfo: ICertificateInfo): Promise<ICertificateReponse> => {
  const { site }: { site: PageSiteConfig } = getSiteConfig();
  const cms = new ContentManagementService();

  return new Promise(async (resolve, reject) => {
    const findExistingCertificate = await prisma.courseCertificates.findFirst({
      where: {
        studentId: certificatInfo.studentId,
        courseId: certificatInfo.courseId,
      },
    });

    if (findExistingCertificate && findExistingCertificate.imagePath && findExistingCertificate.pdfPath) {
      resolve({
        info: false,
        success: true,
        message: "course successfully fetched",
        certificateIssueId: findExistingCertificate.id,
      });
    } else if (!findExistingCertificate) {
      const createCertificate = await prisma.courseCertificates.create({
        data: {
          courseId: certificatInfo.courseId,
          studentId: certificatInfo.studentId,
        },
      });
      const onReject = (error: string) => {
        resolve({
          info: false,
          success: false,
          message: error,
          certificateIssueId: "",
        });
      };
      const onComplete = async (pdfTempPath: string, imgPath: string) => {
        const serviceProviderResponse = await prisma?.serviceProvider.findFirst({
          where: {
            service_type: "media",
          },
        });
        if (serviceProviderResponse && pdfTempPath && imgPath) {
          let certificateIssueId;
          const serviceProvider = cms.getServiceProvider(serviceProviderResponse?.provider_name, serviceProviderResponse?.providerDetail);
          const pdfBuffer = fs.readFileSync(pdfTempPath);

          const imgBuffer = fs.readFileSync(imgPath as string);
          let imgName = `${createCertificate.id}.png`;
          let pdfName = `${createCertificate.id}.pdf`;

          const fileImgPath = path.join(appConstant.certificateDirectory, imgName);
          const pdfPath = path.join(appConstant.certificateDirectory, pdfName);
          const fileArray = [
            {
              fileBuffer: imgBuffer,
              fullName: imgName,
              filePath: fileImgPath,
              name: "img",
            },
            {
              fileBuffer: pdfBuffer,
              fullName: pdfName,
              filePath: pdfPath,
              name: "pdf",
            },
          ];

          fileArray.forEach(async (file) => {
            const response = await cms.uploadFile(
              file.fullName,
              file.fileBuffer,
              file.filePath,

              serviceProvider
            );

            let data =
              file.name === "img"
                ? {
                    imagePath: response.fileCDNPath,
                  }
                : {
                    pdfPath: response.fileCDNPath,
                  };

            const certificateData = await prisma.courseCertificates.update({
              where: {
                id: createCertificate.id,
              },

              data,
            });
            certificateIssueId = certificateData.id;
          });
          if (pdfTempPath && imgPath) {
            fs.unlinkSync(imgPath);
            fs.unlinkSync(pdfTempPath);
          }

          await prisma.courseRegistration.update({
            where: {
              studentId_courseId: {
                courseId: certificatInfo.courseId,
                studentId: certificatInfo.studentId,
              },
            },
            data: {
              courseState: "COMPLETED",
            },
          });

          const configData = {
            name: certificatInfo.authorName,
            email: certificatInfo.studentEmail,
            courseName: certificatInfo.courseName,
            productName: site.brand?.name,
            url: `${process.env.NEXTAUTH_URL}/courses/${certificatInfo.courseId}/certificate/${createCertificate.id}`,
          };

          MailerService.sendMail("COURSE_COMPLETION", configData).then((result) => {
            console.log(result.error);
          });

          resolve({
            info: true,
            success: true,
            message: "Certificate has been created ",
            certificateIssueId: createCertificate.id,
          });
        } else {
          throw new Error("No Media Provder has been configured");
        }
      };

      let description1 = getCertificateDescripiton1("COURSE", certificatInfo?.courseName);
      let description2 = getCertificateDescripiton2("COURSE", certificatInfo.authorName);

      generateCertificate(
        createCertificate.id,
        description1,
        description2,
        certificatInfo.studentName as string,
        certificatInfo.authorName as string,
        getDateAndYear(),
        String(certificatInfo?.certificateTemplate),
        onComplete,
        onReject
      );
    }
  });

  return {} as ICertificateReponse;
};
