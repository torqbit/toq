import { FC } from "react";
import styles from "./Testimonials.module.scss";
import { PageSiteConfig } from "@/services/siteConstant";
import { ITestimonialItems } from "@/types/landing/testimonial";
import { Carousel, Flex } from "antd";
import SvgIcons from "@/components/SvgIcons";

const TestimonialCard: FC<{ testimonialItem: ITestimonialItems }> = ({ testimonialItem }) => {
  return (
    <div className={styles.testimonial__card}>
      <i>{SvgIcons.quotes}</i>
      <p>{testimonialItem.description}</p>
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

const Testimonial: FC<{ siteConfig: PageSiteConfig; testimonialList: ITestimonialItems[] }> = ({
  siteConfig,
  testimonialList,
}) => {
  return (
    <>
      {testimonialList.length > 0 && (
        <section className={styles.testimonial__preview}>
          <div>
            <h1>Teachers love our product</h1>
            <p>Find out what excites our users, when using our product</p>
          </div>
          <Carousel dots={{ className: styles.caroursel__dots }} className={styles.carousel__wrapper} autoplay>
            {testimonialList.map((testimonial, i) => {
              return (
                <div>
                  <TestimonialCard key={i} testimonialItem={testimonial} />
                </div>
              );
            })}
          </Carousel>
        </section>
      )}
    </>
  );
};

export default Testimonial;
