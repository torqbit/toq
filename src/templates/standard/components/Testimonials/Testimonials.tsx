import { FC } from "react";
import styles from "./Testimonials.module.scss";
import { PageSiteConfig } from "@/services/siteConstant";
import { ITestimonialItems } from "@/types/landing/testimonial";
import { Carousel, Flex, Skeleton } from "antd";
import SvgIcons from "@/components/SvgIcons";
import { getDummyArray } from "@/lib/dummyData";

const TestimonialCard: FC<{ testimonialItem: ITestimonialItems }> = ({ testimonialItem }) => {
  return (
    <div className={styles.testimonial__card}>
      <Flex vertical gap={10}>
        <i>{SvgIcons.quotes}</i>
        <p>{testimonialItem.description}</p>
      </Flex>
      <Flex align="center" gap={10}>
        <img src={testimonialItem.author.img} alt="author_image" />
        <div>
          <div>{testimonialItem.author.name}</div>
          <div>{testimonialItem.author.designation}</div>
        </div>
      </Flex>
    </div>
  );
};

const Testimonial: FC<{ siteConfig: PageSiteConfig; testimonialList: ITestimonialItems[]; previewMode?: boolean }> = ({
  siteConfig,
  testimonialList,
  previewMode,
}) => {
  return (
    <>
      {(testimonialList.length > 0 || previewMode) && (
        <section className={styles.testimonial__preview}>
          <div>
            <h1>{siteConfig.sections?.testimonials?.title}</h1>
            <p>{siteConfig.sections?.testimonials?.description}</p>
          </div>
          <Carousel dots={{ className: styles.caroursel__dots }} className={styles.carousel__wrapper} autoplay>
            {testimonialList.length > 0
              ? testimonialList.map((testimonial, i) => {
                  return (
                    <div>
                      <TestimonialCard key={i} testimonialItem={testimonial} />
                    </div>
                  );
                })
              : getDummyArray(3).map((item, i) => {
                  return (
                    <Flex vertical gap={20} justify="space-between" className={styles.testimonial__card} key={i}>
                      <div>
                        <Skeleton.Avatar shape="circle" size={40} />
                        <Skeleton paragraph title={{ style: { marginTop: 30 } }} />
                      </div>
                      <Flex align="center" gap={10}>
                        <Skeleton.Avatar shape="circle" size={40} style={{ marginTop: 20 }} />

                        <Skeleton paragraph={{ rows: 0 }} title={{ style: { marginTop: 40 } }} />
                      </Flex>
                    </Flex>
                  );
                })}
          </Carousel>
        </section>
      )}
    </>
  );
};

export default Testimonial;
