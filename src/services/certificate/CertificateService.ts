import { APIResponse } from "@/types/apis";
import { PageSiteConfig } from "../siteConstant";
import { getSiteConfig } from "../getSiteConfig";
import { certificateConfig } from "@/lib/certificatesConfig";
import path from "path";
import appConstant from "../appConstant";
import { createCanvas, loadImage, registerFont } from "canvas";
import fs from "fs";
import os from "os";
import prisma from "@/lib/prisma";
const PDFDocument = require("pdfkit");
import { IEventCertificateInfo } from "@/types/courses/Course";
import { ContentManagementService } from "../cms/ContentManagementService";
import { FileObjectType } from "@/types/cms/common";
import { IEventEmailConfig } from "@/lib/emailConfig";
import { getDateAndYear } from "@/lib/utils";
import { $Enums, CourseState } from "@prisma/client";
import EmailManagementService from "../cms/email/EmailManagementService";
const homeDir = os.homedir();
const dirPath = path.join(homeDir, `${appConstant.homeDirName}/${appConstant.staticFileDirName}`);
if (!fs.existsSync(dirPath)) {
  fs.mkdirSync(dirPath, {
    recursive: true,
  });
}

export class CeritificateService {
  onCreateImg = async (
    descripition1: string,
    descripition2: string,
    studentName: string,
    authorName: string,
    certificateIssueId: string,
    dateOfCompletion: string,
    certificateId?: string
  ): Promise<APIResponse<string>> => {
    try {
      const { site }: { site: PageSiteConfig } = getSiteConfig();
      const certificateData = certificateConfig.find((c) => c.id === certificateId);

      const filePath = path.join(process.cwd(), `/public/${certificateData?.path}`);
      const italicPath = path.join(process.cwd(), appConstant.fontDirectory.dmSerif.italic);
      const regularPath = path.join(process.cwd(), appConstant.fontDirectory.dmSerif.regular);
      const kalamPath = path.join(process.cwd(), appConstant.fontDirectory.kalam);
      const kaushanPath = path.join(process.cwd(), appConstant.fontDirectory.kaushan);

      const outputPath = path.join(dirPath, `${certificateIssueId}.png`);

      registerFont(kalamPath, { family: "Kalam" });
      registerFont(kaushanPath, { family: "Kaushan Script" });

      const canvas = createCanvas(2000, 1414);
      const ctx = canvas.getContext("2d");

      const uploadedPath =
        certificateData?.color &&
        (await loadImage(filePath).then(async (image) => {
          ctx.drawImage(image, 0, 0);

          ctx.font = '30px "Arial"';
          ctx.fillStyle = certificateData.color.description;
          ctx.textAlign = "center";
          ctx.fillText(
            descripition1,
            certificateData?.coordinates.description.x,
            certificateData?.coordinates.description.y
          );
          ctx.fillStyle = certificateData.color.description;
          ctx.textAlign = "center";
          ctx.fillText(
            descripition2,
            certificateData?.coordinates.description.x,
            certificateData?.coordinates.description.y + 40
          );
          ctx.font = `${80 - 0.5 * studentName.length}px "Kaushan Script"`;
          ctx.fillStyle = certificateData?.color.student;
          ctx.textAlign = "center";
          ctx.fillText(studentName, certificateData?.coordinates.student.x, certificateData?.coordinates.student.y);
          ctx.font = '40px "Kalam"';
          ctx.fillStyle = certificateData?.color.authorSignature;
          ctx.textAlign = "center";
          ctx.fillText(
            authorName,
            certificateData?.coordinates.authorSignature.x,
            certificateData?.coordinates.authorSignature.y
          );
          ctx.font = '40px "Kaushan Script"';
          ctx.fillStyle = certificateData?.color.date;
          ctx.textAlign = "center";
          ctx.fillText(
            dateOfCompletion,
            certificateData?.coordinates.dateOfCompletion.x,
            certificateData?.coordinates.dateOfCompletion.y
          );
          const buffer = canvas.toBuffer("image/png");

          fs.writeFileSync(outputPath, new Uint8Array(buffer));

          image.onerror = function (err) {
            return new APIResponse(false, 400, err.message);
          };
          return outputPath;
        }));
      return new APIResponse(true, 200, "Image has been created", uploadedPath);
    } catch (error: any) {
      return new APIResponse(false, 400, error);
    }
  };

  generateCertificate = async (
    productId: number,
    registrationId: number,
    descripition1: string,
    descripition2: string,
    studentName: string,
    authorName: string,
    dateOfCompletion: string,
    certificateTemplateId: string,
    onComplete: (
      registrationId: number,
      certificateIssueId: string,
      pdfTempPath: string,
      imgPath: string,
      updateRegistration?: boolean
    ) => Promise<APIResponse<string>>,
    onReject: (error: string) => void,
    updateRegistration?: boolean
  ): Promise<APIResponse<string>> => {
    const issueCertificate = await prisma.courseCertificates.create({
      data: {
        registrationId: registrationId,
        productId: productId,
      },
    });

    if (issueCertificate) {
      const imgUploadPath = await this.onCreateImg(
        descripition1,
        descripition2,
        studentName,
        authorName,
        issueCertificate.id,
        dateOfCompletion,
        certificateTemplateId
      );

      if (!imgUploadPath.body) {
        return new APIResponse(false, 400, "Failed to generate image upload path.");
      }

      // Create a PDF document
      const doc = new PDFDocument({ size: "A4", margin: 0, layout: "landscape" });
      const uploadPdfPath = path.join(dirPath, `${issueCertificate.id}.pdf`);
      const outputStream = doc.pipe(fs.createWriteStream(uploadPdfPath));

      doc
        .image(imgUploadPath.body, 0, 0, {
          width: 841,
          height: 595,
          align: "center",
          valign: "center",
        })
        .save();

      doc.end();
      return new Promise<APIResponse<string>>((resolve, reject) => {
        outputStream.on("finish", async () => {
          try {
            const response =
              imgUploadPath.body &&
              (await onComplete(
                registrationId,
                issueCertificate.id,
                uploadPdfPath,
                imgUploadPath.body,
                updateRegistration
              ));
            response && resolve(new APIResponse(response.success, response.status, response.message, response.body));
          } catch (error) {
            reject(new APIResponse(false, 500, "Error in onComplete callback", error));
          }
        });

        outputStream.on("error", (error: any) => {
          reject(new APIResponse(false, 500, error.message));
        });
      });
    } else {
      return new APIResponse(false, 500, "Failed to issue the certificate. Contact support.");
    }
  };

  getCertificateDescripiton1 = (objectType: $Enums.ProductType, objectTitle: string) => {
    switch (objectType) {
      case "COURSE":
        return `who has successfully completed the course ${objectTitle} `;

      case "EVENT":
        return `who has successfully attended the workshop, ${objectTitle}`;

      default:
        return "";
    }
  };

  getCertificateDescripiton2 = (objectType: $Enums.ProductType, authorName: string, brandName: string) => {
    switch (objectType) {
      case "COURSE":
        return ` authored by ${authorName} and offered by ${brandName}`;

      case "EVENT":
        return ` lead by ${authorName} and organized by ${brandName} `;

      default:
        return "";
    }
  };

  handleCertificateFailure = (error: string) => {
    return new APIResponse(false, 400, error);
  };

  handleCertficateGenSuccess = async (
    registrationId: number,
    certificateIssueId: string,
    pdfTempPath: string,
    imgPath: string,
    updateRegistration?: boolean
  ): Promise<APIResponse<string>> => {
    let response: APIResponse<any>;

    const cms = new ContentManagementService().getCMS(appConstant.defaultCMSProvider);
    const cmsConfig = (await cms.getCMSConfig()).body?.config;

    if (cmsConfig && pdfTempPath && imgPath) {
      const pdfBuffer = fs.readFileSync(pdfTempPath);

      const imgBuffer = fs.readFileSync(imgPath as string);
      let imgName = `${certificateIssueId}.png`;
      let pdfName = `${certificateIssueId}.pdf`;
      const fileImgPath = path.join(dirPath, imgName);
      const pdfPath = path.join(dirPath, pdfName);
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
        response = await cms.uploadPrivateFile(
          cmsConfig,
          file.fileBuffer,
          FileObjectType.CERTIFICATE,
          file.fullName,
          file.name === "pdf" ? "pdf" : "thumbnail"
        );
        let data =
          file.name === "img"
            ? {
                imagePath: response.body,
              }
            : {
                pdfPath: response.body,
              };

        await prisma.courseCertificates.update({
          where: {
            id: certificateIssueId,
          },
          data,
        });
      });
      if (pdfTempPath && imgPath) {
        fs.unlinkSync(imgPath);
        fs.unlinkSync(pdfTempPath);
      }

      updateRegistration &&
        (await prisma.courseRegistration.update({
          where: {
            registrationId: registrationId,
          },
          data: {
            courseState: CourseState.COMPLETED,
          },
        }));
      return new APIResponse(true, 200, "Certificate has been created ", certificateIssueId);
    } else {
      throw new Error("No Media Provder has been configured");
    }
  };

  generateCourseCertificate = async (
    registrationId: number,
    courseId: number,
    studentName: string,
    updateRegistration?: boolean
  ): Promise<APIResponse<string>> => {
    const { site }: { site: PageSiteConfig } = getSiteConfig();
    const courseDetails = await prisma.course.findUnique({
      select: {
        name: true,
        certificateTemplate: true,
        user: true,
      },
      where: {
        courseId: courseId,
      },
    });

    if (courseDetails && courseDetails.user) {
      let description1 = this.getCertificateDescripiton1("COURSE", courseDetails.name);
      let description2 = this.getCertificateDescripiton2(
        "COURSE",
        courseDetails.user.name,
        site.brand?.name || appConstant.platformName
      );

      const certificateResponse = await this.generateCertificate(
        courseId,
        registrationId,
        description1,
        description2,
        studentName,
        courseDetails.user.name,
        getDateAndYear(),
        courseDetails.certificateTemplate || appConstant.certificateTemplate,
        this.handleCertficateGenSuccess,
        this.handleCertificateFailure,
        updateRegistration
      );
      return certificateResponse;
    } else {
      return new APIResponse(false, 400, "Unable to find the course details, for which certificate is being issued");
    }
  };

  eventCertificate = async (certificatInfo: IEventCertificateInfo): Promise<APIResponse<string>> => {
    const { site }: { site: PageSiteConfig } = getSiteConfig();
    const sendMail = async (certificatePdfPath: string): Promise<APIResponse<string>> => {
      const configData: IEventEmailConfig = {
        name: certificatInfo.studentName,
        email: certificatInfo.studentEmail,
        eventName: String(certificatInfo?.eventName),
        pdfPath: String(certificatePdfPath),
        slug: String(certificatInfo?.slug),
      };
      const ms = await EmailManagementService.getMailerService();

      ms &&
        ms.sendMail("EVENT_COMPLETION", configData).then((result) => {
          console.log(result.error);
        });

      return new APIResponse(true, 200, `Email has been successfully sent to ${certificatInfo.studentName}`);
    };

    const findRegistrationDetail = await prisma.eventRegistration.findUnique({
      where: {
        eventId_email: {
          eventId: certificatInfo.eventId,
          email: certificatInfo.studentEmail,
        },
      },
      select: {
        certificatePdfPath: true,
      },
    });

    if (findRegistrationDetail?.certificatePdfPath) {
      const response = await sendMail(findRegistrationDetail.certificatePdfPath);
      return new APIResponse(response.success, response.status, response.message, response.body);
    } else {
      const onReject = (error: string) => {
        return new APIResponse(false, 400, error, "");
      };
      const onComplete = async (pdfTempPath: string, imgPath: string): Promise<APIResponse<string>> => {
        let response: APIResponse<any>;

        const cms = new ContentManagementService().getCMS(appConstant.defaultCMSProvider);
        const cmsConfig = (await cms.getCMSConfig()).body?.config;

        if (cmsConfig && pdfTempPath && imgPath) {
          const pdfBuffer = fs.readFileSync(pdfTempPath);

          const imgBuffer = fs.readFileSync(imgPath as string);
          let imgName = `${certificatInfo.registrationId}.png`;
          let pdfName = `${certificatInfo.registrationId}.pdf`;
          const fileImgPath = path.join(dirPath, imgName);
          const pdfPath = path.join(dirPath, pdfName);
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
            response = await cms.uploadPrivateFile(
              cmsConfig,
              file.fileBuffer,
              FileObjectType.CERTIFICATE,
              file.fullName,
              file.name === "pdf" ? "pdf" : "thumbnail"
            );
            let data =
              file.name === "img"
                ? {
                    certificate: response.body,
                  }
                : {
                    certificatePdfPath: response.body,
                  };

            await prisma.eventRegistration
              .update({
                where: {
                  eventId_email: {
                    eventId: certificatInfo.eventId,
                    email: certificatInfo.studentEmail,
                  },
                },
                data,
              })
              .then((r) => {
                if (r?.certificatePdfPath) {
                  sendMail(r.certificatePdfPath);
                }
              });
          });
          if (pdfTempPath && imgPath) {
            fs.unlinkSync(imgPath);
            fs.unlinkSync(pdfTempPath);
          }
          return new APIResponse(true, 200, `Email has been successfully sent to ${certificatInfo.studentName}`);
        } else {
          return new APIResponse(false, 400, "No Media Provder has been configured");
        }
      };

      let description1 = this.getCertificateDescripiton1("EVENT", String(certificatInfo?.eventName));
      let description2 = this.getCertificateDescripiton2(
        "EVENT",
        String(certificatInfo.authorName),
        site.brand?.name || appConstant.platformName
      );

      //TODO: Need to use the event registration id while generating the certificate
      const certificateResponse = await this.generateCertificate(
        1,
        Number(`${certificatInfo.registrationId}`),
        description1,
        description2,
        certificatInfo.studentName as string,
        certificatInfo.authorName as string,
        getDateAndYear(),
        String(certificatInfo?.certificateTemplate),
        (n: number, s1: string, s2: string, s3: string) =>
          new Promise((res) => res(new APIResponse(true, 200, "Dummy response"))),
        onReject,
        true
      );
      return certificateResponse;
    }
  };
}
