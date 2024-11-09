'use client'

// Import Swiper React components
import { Swiper, SwiperSlide } from 'swiper/react';
import { Swiper as SwiperObject } from 'swiper'
// Import Swiper styles
import 'swiper/css';
import 'swiper/css/free-mode';
import 'swiper/css/navigation';
import 'swiper/css/thumbs';

import './slideshow.css';
import { useState } from 'react';
import { Autoplay, FreeMode, Navigation, Thumbs } from 'swiper/modules';
import Image from 'next/image';
import { ProductImage } from '@/components';


interface Props {
    images: string[];
    title: string;
    className?: string;
}

export const ProductSlideshow = ({ images, title, className }: Props) => {
    const [thumbsSwiper, setThumbsSwiper] = useState<SwiperObject>();

    return (
        <div
            className={className}
        >
            <Swiper
                style={{
                    '--swiper-navigation-color': '#fff',
                    '--swiper-pagination-color': '#fff',
                } as React.CSSProperties}
                spaceBetween={10}
                navigation={true}
                autoplay={{
                    delay: 3500,
                }}
                thumbs={{ swiper: thumbsSwiper }}
                modules={[FreeMode, Navigation, Thumbs, Autoplay]}
                className="mySwiper2"
            >
                {
                    images.length === 0 ? (
                        <SwiperSlide key={undefined}>
                            <ProductImage
                                src={undefined}
                                alt={title}
                                width={1024}
                                height={800}
                                className='rounded-lg object-fill'
                            />
                        </SwiperSlide>
                    )
                        :
                        (
                            images.map(image => (
                                <SwiperSlide key={image}>
                                    <ProductImage
                                        src={image}
                                        alt={title}
                                        width={1024}
                                        height={800}
                                        className='rounded-lg object-fill'
                                    />
                                </SwiperSlide>
                            ))
                        )
                }
            </Swiper>
            <Swiper
                onSwiper={setThumbsSwiper}
                spaceBetween={10}
                slidesPerView={4}
                freeMode={true}
                watchSlidesProgress={true}
                modules={[FreeMode, Navigation, Thumbs]}
                className="mySwiper"
            >
                {

                    images.length === 0 ? (
                        <SwiperSlide key={undefined}>
                            <ProductImage
                                src={undefined}
                                alt={title}
                                width={300}
                                height={300}
                                className='rounded-lg object-fill'
                            />
                        </SwiperSlide>
                    )
                        :
                        (
                            images.map(image => (
                                <SwiperSlide key={image}>
                                    <ProductImage
                                        src={image}
                                        alt={title}
                                        width={300}
                                        height={300}
                                        className='rounded-lg object-fill'
                                    />
                                </SwiperSlide>
                            ))
                        )
                }
            </Swiper>
        </div>
    )
}
