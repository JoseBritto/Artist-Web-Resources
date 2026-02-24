
//TODO: REFACTOR

// BackgroundVideo.tsx
import React from "react";
import "./css/BackgroundVideo.css";

type Props = {
    src: string;              // e.g. "/videos/hero.webm"
   // poster?: string;          // optional fallback image
    children?: React.ReactNode;
};

export default function BackgroundVideo({
                                            src,
                                            //poster,
                                            children,
                                        }: Props) {
    return (
        <div className="bgWrap">
            <video
                className="bgVideo"
                src={src}
          //      poster={poster}
                autoPlay
                loop
                muted
                playsInline
                preload="metadata"
            />

            <div className='bgOverlay' />

            <div className="bgContent">{children}</div>
        </div>
    );
}