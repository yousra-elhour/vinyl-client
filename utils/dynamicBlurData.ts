const baseUrl =
  process.env.NODE_ENV === "development" ? "http://localhost:3000" : "";

interface dynamicBlurDataUrlProps {
  url: string;
}

export async function dynamicBlurDataUrl({ url }: dynamicBlurDataUrlProps) {
  const base64str = await fetch(
    `${baseUrl}/_next/image?url=${url}&w=16&q=60`
  ).then(async (res) =>
    Buffer.from(await res.arrayBuffer()).toString("base64")
  );
  const blurSvg = `
    <svg xmlns='http://www.w3.org/2000/svg' viewBox= '0 0 8 5'>

    <filter id='b' color-interpolation-filters='sRGB'>
        <feGaussianBlur stdDeviation='1' />
    </filter>

    <image preserveAspectRatio='none' filter='url(#b)' x='0' y='0' height='100%' width='100%' href='data:image/avif;base64,${base64str}'/>
    
    </svg>
    `;
}
