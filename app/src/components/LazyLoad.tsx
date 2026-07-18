import { useState, useRef, useEffect, ReactNode } from 'react'

interface Props {
  children: ReactNode
  // ビューポート手前どれだけの距離で読み込むか(px)。react-lazyload の offset 互換。
  offset?: number
}

// react-lazyload の代替(React 19 は findDOMNode を削除したため自前実装に置き換え)。
// IntersectionObserver で可視域(offset 手前含む)に入ったら children を描画する。
// SSR とクライアント初回レンダはともに未描画で一致するため hydration mismatch は起きない。
const LazyLoad = ({ children, offset = 0 }: Props) => {
  const ref = useRef<HTMLDivElement>(null)
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    if (visible) return
    const el = ref.current
    if (!el) return
    if (typeof IntersectionObserver === 'undefined') {
      setVisible(true)
      return
    }
    const io = new IntersectionObserver(
      (entries) => {
        if (entries.some((e) => e.isIntersecting)) {
          setVisible(true)
          io.disconnect()
        }
      },
      { rootMargin: `${offset}px` },
    )
    io.observe(el)
    return () => io.disconnect()
  }, [visible, offset])

  return (
    <div className="lazyload-wrapper" ref={ref}>
      {visible ? children : null}
    </div>
  )
}

export default LazyLoad
