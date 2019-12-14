interface ImageOption {
  width: number
  height: number
  aspect: 'scale' | 'crop'
}

const firebaseOrigin = 'firebasestorage.googleapis.com'
const imageFluxOrigin = 'p1-743c57d4.imageflux.jp'

// https://p1-743c57d4.imageflux.jp/w=200,h=100,a=2/
export const imageUrl = (origin: string, options: ImageOption): string => {
  let params: Partial<{
    w: number | undefined
    h: number | undefined
    a: number | undefined
  }> = {}
  params.a = {
    'scale': 0,
    'crop': 2
  }[options.aspect]
  params.w = options.width
  params.h = options.height

  const imageParams = Object.keys(params)
    .filter(key => Boolean(params[key as keyof typeof params]))
    .map(key => {
      return key + '=' + (params[key as keyof typeof params])
    })
    .join(',')

  console.log(imageParams)

  // return origin
  return origin.replace(firebaseOrigin, imageFluxOrigin + '/' + imageParams)
}