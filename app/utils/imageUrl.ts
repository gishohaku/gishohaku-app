interface ImageOption {
  width: number
  height: number
  aspect: 'scale' | 'crop'
}

const firebaseOrigin = 'firebasestorage.googleapis.com'
const imageFluxOrigin = 'p1-743c57d4.imageflux.jp'

// https://p1-743c57d4.imageflux.jp/w=200,h=100,a=2/
export const imageUrl = (
  origin: string,
  options: Partial<ImageOption>,
): string => {
  let params: Partial<{
    w: number | undefined
    h: number | undefined
    a: number | undefined
    u: number
    f: string
  }> = {
    u: 1, // 出力画像が入力画像より拡大されることを許可しない,
    f: 'webp:auto',
  }
  params.a = {
    scale: 0,
    crop: 2,
  }[options.aspect || 'crop']
  if (options.width) params.w = options.width
  if (options.height) params.h = options.height

  const imageParams = Object.keys(params)
    .filter((key) => Boolean(params[key as keyof typeof params]))
    .map((key) => {
      return key + '=' + params[key as keyof typeof params]
    })
    .join(',')

  console.log(imageParams)

  // return origin
  return origin.replace(firebaseOrigin, imageFluxOrigin + '/' + imageParams)
}
