import React from "react";
import { TwitterTweetEmbed } from "react-twitter-embed";
import { Swiper, SwiperSlide } from "swiper/react";
import { Keyboard, Pagination, Navigation } from "swiper";

import "swiper/swiper-bundle.css";

import "./styles.scss";

interface Props {
    ids: string[];
}

export const TwitterPosts = ({ ids }: Props) => (
    <Swiper
        loop
        loopPreventsSlide
        breakpoints={{
            // when window width is >= 0px
            0: {
                slidesPerView: 1,
                spaceBetween: 20,
            },
            // when window width is >= 480px
            480: {
                slidesPerView: 2,
                spaceBetween: 30,
            },
            // when window width is >= 640px
            640: {
                slidesPerView: 4,
                spaceBetween: 15,
            },
        }}
        keyboard={{
            enabled: true,
        }}
        pagination={{
            clickable: true,
        }}
        navigation
        modules={[Keyboard, Pagination, Navigation]}
    >
        {ids.map((tweetId) => (
            <SwiperSlide key={tweetId}>
                <TwitterTweetEmbed tweetId={tweetId} />
            </SwiperSlide>
        ))}
    </Swiper>
);
