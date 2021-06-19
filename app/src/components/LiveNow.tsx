import React from 'react'
import { IconPlay } from 'sancho'

export const LiveNow = () => {
  return (
    <a
      href="https://www.youtube.com/watch?v=MukacNr759M"
      target="_blank"
      rel="noopener"
      className="fixed m-4 bottom-16 bg-gishohaku5 text-white p-3 right-0 z-[12] shadow flex items-center rounded text-base">
      <div className="bg-white rounded-full flex items-center justify-center p-1.5 mr-2">
        <IconPlay
          fill="#328BB6"
          stroke="trarnsparent"
          className="relative left-0.5"
        />
      </div>
      <div className="relative top-[-1px]">
        <span className="font-bold ">技書博ラジオ</span>配信中
      </div>
    </a>
  )
}
