import React, { FC, useEffect, useMemo, useState } from 'react';
import { MdAddShoppingCart } from 'react-icons/md';
import { BiChevronLeft, BiChevronRight } from 'react-icons/bi';
import Image from 'next/image';
import { css } from 'twin.macro';

import DefaultButton from 'components/Buttons/DefaultButton';
import { useGetProducts } from 'hooks/products/productsHooks';
import { ProductDetailDataType } from 'types/productDetailTypes';

type ProductImageActiveType = {
  index: number;
  imageUrl?: string;
};

const ProductDetail: FC = () => {
  const { data: productsAPIres, isLoading: isProductsAPILoading } = useGetProducts();
  const productsData = useMemo(
    () => (productsAPIres?.data as Array<ProductDetailDataType>) ?? [],
    [productsAPIres],
  );
  const [productActive, setProductActive] = useState<ProductDetailDataType | undefined>(undefined);
  const [imageActive, setImageActive] = useState<ProductImageActiveType>({
    index: 0,
    imageUrl: productActive?.image,
  });

  useEffect(() => {
    setProductActive(productsData[0]);
    setImageActive({
      index: 0,
      imageUrl: productsData[0]?.image,
    });
  }, [productsData]);

  return (
    <div tw="flex w-full min-h-screen max-w-[1366px] mx-auto">
      <div tw="flex flex-row h-screen w-full justify-center items-center gap-8">
        {!isProductsAPILoading && (
          <>
            <div tw="flex flex-col items-end justify-center gap-4 w-5/12">
              <div tw="relative w-[29.25rem] h-[29.25rem] rounded-lg shadow-md border-[0.5px] border-solid ">
                <Image
                  src={imageActive?.imageUrl ?? '/images/img-product-placeholder.png'}
                  alt="product image"
                  fill
                  style={{ objectFit: 'cover' }}
                />
                <div tw="flex flex-row absolute bottom-2 right-4 items-center">
                  <BiChevronLeft
                    size={'16px'}
                    tw="cursor-pointer"
                    onClick={() =>
                      imageActive?.index > 0 &&
                      setImageActive({
                        index: imageActive?.index - 1,
                        imageUrl: productActive?.images[imageActive?.index - 1],
                      })
                    }
                  />
                  <span tw="text-xs font-light text-black text-center min-w-[1.25rem]">
                    {(imageActive?.index ?? 0) + 1}/{productActive?.images.length}
                  </span>
                  <BiChevronRight
                    size={'16px'}
                    tw="cursor-pointer"
                    onClick={() =>
                      imageActive?.index < (productActive?.images.length ?? 3) &&
                      setImageActive({
                        index: imageActive?.index + 1,
                        imageUrl: productActive?.images[imageActive?.index + 1],
                      })
                    }
                  />
                </div>
              </div>
              <div tw="w-[29.25rem]">
                <div tw="flex flex-row gap-6 w-full items-center justify-center mx-auto">
                  {productActive?.images.map((data: string, idx: number) => (
                    <div
                      tw="h-full shadow-sm p-1 rounded-lg cursor-pointer transition-all"
                      key={idx}
                      css={cssOtherProductImage(idx === imageActive?.index)}
                      onClick={() =>
                        setImageActive({
                          index: idx,
                          imageUrl: data,
                        })
                      }
                    >
                      <div tw="w-[4rem] h-[4rem] relative">
                        <Image
                          src={data}
                          alt={`product image`}
                          fill
                          style={{ objectFit: 'cover' }}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div tw="flex flex-col gap-2 w-6/12 h-[572px] py-12 px-4">
              <h3 tw="font-semibold text-red-400 text-sm">SALE</h3>
              <h1 tw="font-bold text-black text-xl">{productActive?.name}</h1>
              <div tw="flex flex-row gap-2 w-[200px] h-[20px] items-center">
                <div tw="relative h-[14px] w-[96px]">
                  <Image
                    src={
                      `/icons/icon-star-${productActive?.rating}.svg` ?? '/icons/icon-star-5.svg'
                    }
                    alt={`rating icon`}
                    fill
                    style={{ objectFit: 'cover' }}
                  />
                </div>
                <span tw="text-sm text-gray-400">({productActive?.reviewCount} reviews)</span>
              </div>
              <h3 tw="font-bold text-black text-2xl">{productActive?.price}</h3>

              <div tw="w-full h-[1px] bg-gray-200 my-6 shadow-sm"></div>

              <div tw="flex flex-row gap-4">
                <DefaultButton
                  theme="yellow"
                  text="Add To Cart"
                  suffix={<MdAddShoppingCart size={24} />}
                />
                <DefaultButton theme="green" text="Buy Now" />
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default ProductDetail;

const cssOtherProductImage = (isImageActive: boolean) => css`
  border: ${isImageActive ? '1.5px solid #4CA85E' : '0.5px solid #E2E8F0'} !important;
  :hover {
    transform: scale(1.02);
  }
`;
