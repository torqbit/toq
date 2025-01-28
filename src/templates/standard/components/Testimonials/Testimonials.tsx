import { FC } from "react";
import styles from "./Testimonials.module.scss";
import { PageSiteConfig } from "@/services/siteConstant";
import { ITestimonialItems } from "@/types/landing/testimonial";
import { Carousel, Flex, Skeleton } from "antd";
import SvgIcons from "@/components/SvgIcons";

import UserInfo from "@/components/UserInfo/UserInfo";

import { getDummyArray } from "@/lib/dummyData";

const TestimonialCard: FC<{ testimonialItem: ITestimonialItems }> = ({ testimonialItem }) => {
  return (
    <div className={styles.testimonial__card}>
      <Flex vertical gap={10}>
        <i>{SvgIcons.quotes}</i>
        <p>{testimonialItem.description}</p>
      </Flex>
      <UserInfo
        image={testimonialItem.author.img}
        name={testimonialItem.author.name}
        extraInfo={testimonialItem.author.designation}
      />
    </div>
  );
};

const Testimonial: FC<{ siteConfig: PageSiteConfig; testimonialList: ITestimonialItems[]; previewMode?: boolean }> = ({
  siteConfig,
  testimonialList,
  previewMode,
}) => {
  return (
    <section>
      {(testimonialList.length > 0 || previewMode) && (
        <div className={styles.testimonial__preview}>
          <div>
            <h1>{siteConfig.sections?.testimonials?.title}</h1>
            <p className="landingPagePara">{siteConfig.sections?.testimonials?.description}</p>
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
                        <Skeleton.Avatar className={styles.testimonial__skeleton__avatar} shape="circle" size={40} />
                        <Skeleton paragraph title={{ className: styles.skeleton__para__title }} />
                      </div>
                      <Flex align="center" gap={10}>
                        <Skeleton.Avatar className={styles.skeleton__user__avatar} shape="circle" size={40} />

                        <Skeleton paragraph={{ rows: 0 }} title={{ className: styles.skeleton__user__para }} />
                      </Flex>
                    </Flex>
                  );
                })}
          </Carousel>
        </div>
      )}
    </section>
  );
};

export default Testimonial;
