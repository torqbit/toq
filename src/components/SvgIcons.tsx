import React, { FC } from "react";

export const EmptyCourses: React.FC<{ bgColor: string; brandColor: string; fontColor: string; size: string }> = ({
  bgColor,
  brandColor,
  fontColor,
  size,
}) => (
  <i style={{ fontSize: size, lineHeight: 1 }}>
    <svg xmlns="http://www.w3.org/2000/svg" width="1em" height=".93em" fill="none" viewBox="0 0 300 279">
      <path
        stroke={fontColor}
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M261.324 67.817V78.78M255.855 73.286h10.939M37.065 25.514v10.938M31.571 30.983h10.964"
      ></path>
      <path fill={bgColor} d="M122.179 4.986a2.493 2.493 0 1 0 0-4.986 2.493 2.493 0 0 0 0 4.986"></path>
      <path
        fill={bgColor}
        d="M202.106 104.091c-21.291 0-42.964-.865-63.238-6.512-19.893-5.52-38.157-16.23-54.437-28.617-10.659-8.064-20.35-14.474-34.188-13.508a63.2 63.2 0 0 0-36.936 14.5C-4.296 85.216-1.65 113.783 5.396 133.853c10.582 30.22 42.786 51.156 70.157 64.841 31.619 15.797 66.367 24.955 101.192 30.246 30.525 4.629 69.75 8.013 96.205-11.931 24.293-18.315 30.958-60.134 25.005-88.37a34.77 34.77 0 0 0-12.49-21.19c-17.068-12.465-42.531-4.146-61.712-3.714-7.122.153-14.372.331-21.647.356M150.009 278.416c51.574 0 93.382-2.608 93.382-5.825s-41.808-5.825-93.382-5.825c-51.573 0-93.382 2.608-93.382 5.825s41.809 5.825 93.382 5.825"
      ></path>
      <path
        fill={brandColor}
        d="M189.673 8.448 65.345 25.258a7.275 7.275 0 0 0-6.235 8.184l24.11 178.324a7.275 7.275 0 0 0 8.185 6.235l124.327-16.81a7.274 7.274 0 0 0 6.235-8.184l-24.11-178.324a7.275 7.275 0 0 0-8.184-6.235"
      ></path>
      <path
        fill={bgColor}
        stroke={fontColor}
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M230.977 34.621H105.518a7.275 7.275 0 0 0-7.275 7.275v179.947a7.275 7.275 0 0 0 7.275 7.275h125.459a7.276 7.276 0 0 0 7.276-7.275V41.896a7.276 7.276 0 0 0-7.276-7.275"
      ></path>
      <path
        fill={brandColor}
        d="M198.391 174.325h-60.313a4.096 4.096 0 0 0-4.095 4.095v.026a4.095 4.095 0 0 0 4.095 4.095h60.313a4.095 4.095 0 0 0 4.096-4.095v-.026a4.096 4.096 0 0 0-4.096-4.095M196.229 207.903h-57.871c-.688 0-1.246.558-1.246 1.246v.382c0 .688.558 1.246 1.246 1.246h57.871c.689 0 1.247-.558 1.247-1.246v-.382c0-.688-.558-1.246-1.247-1.246M210.984 194.446h-85.242a1.654 1.654 0 1 0 0 3.307h85.242a1.653 1.653 0 0 0 0-3.307"
      ></path>
      <path
        fill={bgColor}
        stroke={fontColor}
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M226.576 40.548H109.919a5.24 5.24 0 0 0-5.24 5.24v101.166a5.24 5.24 0 0 0 5.24 5.24h116.657a5.24 5.24 0 0 0 5.241-5.24V45.788a5.24 5.24 0 0 0-5.241-5.24"
      ></path>
      <path
        fill={brandColor}
        stroke={bgColor}
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M183.815 120.829a4.1 4.1 0 0 0 2.309-.78 4.1 4.1 0 0 0 1.545-4.39 4.1 4.1 0 0 0-1.31-2.054 29.2 29.2 0 0 0-37.648.33 4.07 4.07 0 0 0-1.204 4.465 4.07 4.07 0 0 0 3.748 2.709z"
      ></path>
      <path
        stroke={brandColor}
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="0.71"
        d="m204.599 95.366-14.83-8.547 14.83-8.572M130.676 95.366l14.83-8.547-14.83-8.572"
      ></path>
      <path
        stroke={brandColor}
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M49.352 149.625v10.964M43.883 155.094h10.963"
      ></path>
      <path fill={brandColor} d="M256.695 157.383a2.493 2.493 0 1 0 0-4.986 2.493 2.493 0 0 0 0 4.986"></path>
    </svg>
  </i>
);

export const EmptyChapters: React.FC<{ bgColor: string; brandColor: string; fontColor: string; size: string }> = ({
  bgColor,
  brandColor,
  fontColor,
  size,
}) => (
  <i style={{ fontSize: size, lineHeight: 1 }}>
    <svg xmlns="http://www.w3.org/2000/svg" width={"1em"} height={"0.87em"} fill="none" viewBox="0 0 118 104">
      <path
        fill={bgColor}
        d="M79.451 34.6c-8.37 0-16.89-.34-24.86-2.56-7.82-2.17-15-6.38-21.4-11.25-4.19-3.17-8-5.69-13.44-5.31a24.84 24.84 0 0 0-14.52 5.7c-6.92 6-5.88 17.23-3.11 25.12 4.16 11.88 16.82 20.11 27.58 25.49 12.43 6.21 26.09 9.81 39.78 11.89 12 1.82 27.42 3.15 37.82-4.69 9.55-7.2 12.17-23.64 9.83-34.74a13.668 13.668 0 0 0-4.91-8.33c-6.71-4.9-16.72-1.63-24.26-1.46-2.8.06-5.65.13-8.51.14ZM58.971 103.13c20.275 0 36.71-1.025 36.71-2.29 0-1.265-16.435-2.29-36.71-2.29-20.274 0-36.71 1.025-36.71 2.29 0 1.265 16.436 2.29 36.71 2.29Z"
      />
      <path
        fill={brandColor}
        d="m85.521 4.302-56.535 20.42a3.75 3.75 0 0 0-2.253 4.802l11.928 33.021a3.75 3.75 0 0 0 4.801 2.253l56.535-20.42a3.75 3.75 0 0 0 2.253-4.801L90.322 6.555a3.75 3.75 0 0 0-4.8-2.253Z"
      />
      <path
        fill={fontColor}
        d="M42.201 82.44a.98.98 0 1 0 0-1.96.98.98 0 0 0 0 1.96ZM68.221 1.96a.98.98 0 1 0 0-1.96.98.98 0 0 0 0 1.96Z"
      />
      <path
        stroke={bgColor}
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M40.991 8.29v4.31M38.831 10.45h4.31M104.221 24.22v4.3M102.061 26.37h4.31"
      />
      <path
        fill={bgColor}
        stroke={fontColor}
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M87.679 26.254 28.235 35.18a3.75 3.75 0 0 0-3.151 4.265l5.214 34.721a3.75 3.75 0 0 0 4.265 3.151l59.443-8.926a3.75 3.75 0 0 0 3.152-4.265l-5.214-34.72a3.75 3.75 0 0 0-4.265-3.152Z"
      />
      <path
        fill={brandColor}
        d="m36.808 39.407-5.004.752a1.53 1.53 0 0 0-1.286 1.74l.752 5.004a1.53 1.53 0 0 0 1.74 1.285l5.004-.75a1.53 1.53 0 0 0 1.286-1.741l-.752-5.004a1.53 1.53 0 0 0-1.74-1.286ZM57.748 37.305 43.122 39.5a.84.84 0 0 0-.706.955l.065.435a.84.84 0 0 0 .956.706l14.626-2.196a.84.84 0 0 0 .706-.955l-.066-.435a.84.84 0 0 0-.955-.706ZM68.004 40.337l-23.665 3.554a1.06 1.06 0 0 0 .315 2.096l23.665-3.553a1.06 1.06 0 1 0-.315-2.097ZM38.808 51.407l-5.004.752a1.53 1.53 0 0 0-1.286 1.74l.752 5.004a1.53 1.53 0 0 0 1.74 1.285l5.004-.75a1.53 1.53 0 0 0 1.286-1.741l-.752-5.004a1.53 1.53 0 0 0-1.74-1.286ZM59.748 49.305 45.122 51.5a.84.84 0 0 0-.706.955l.065.435a.84.84 0 0 0 .956.706l14.626-2.196a.84.84 0 0 0 .706-.955l-.066-.435a.84.84 0 0 0-.955-.706ZM70.004 52.337l-23.665 3.554a1.06 1.06 0 0 0 .315 2.096l23.665-3.553a1.06 1.06 0 1 0-.315-2.097ZM40.808 63.407l-5.004.752a1.53 1.53 0 0 0-1.286 1.74l.752 5.004a1.53 1.53 0 0 0 1.74 1.285l5.004-.75a1.53 1.53 0 0 0 1.286-1.741l-.752-5.004a1.53 1.53 0 0 0-1.74-1.286ZM61.748 61.305 47.122 63.5a.84.84 0 0 0-.706.955l.065.435a.84.84 0 0 0 .956.706l14.626-2.196a.84.84 0 0 0 .706-.955l-.066-.435a.84.84 0 0 0-.955-.706ZM72.004 64.337l-23.665 3.554a1.06 1.06 0 0 0 .315 2.096l23.665-3.553a1.06 1.06 0 1 0-.315-2.097Z"
      />
    </svg>
  </i>
);

export const EmptyEvents: React.FC<{ bgColor: string; brandColor: string; fontColor: string; size: string }> = ({
  bgColor,
  brandColor,
  fontColor,
  size,
}) => (
  <i style={{ fontSize: size, lineHeight: 1 }}>
    <svg xmlns="http://www.w3.org/2000/svg" width="1em" height=".882em" fill="none" viewBox="0 0 119 105">
      <path
        fill={bgColor}
        d="M79.66 36.42c-8.37 0-16.89-.34-24.86-2.56-7.82-2.17-15-6.38-21.4-11.25-4.19-3.17-8-5.69-13.44-5.31A24.84 24.84 0 0 0 5.44 23c-6.92 6-5.88 17.23-3.11 25.12C6.49 60 19.15 68.23 29.91 73.61 42.34 79.82 56 83.42 69.69 85.5c12 1.82 27.42 3.15 37.82-4.69 9.55-7.2 12.17-23.64 9.83-34.74a13.668 13.668 0 0 0-4.91-8.33c-6.71-4.9-16.72-1.63-24.26-1.46-2.8.06-5.65.13-8.51.14ZM59.18 104.95c20.274 0 36.71-1.025 36.71-2.29 0-1.265-16.436-2.29-36.71-2.29s-36.71 1.025-36.71 2.29c0 1.265 16.436 2.29 36.71 2.29Z"
      />
      <path fill={brandColor} d="M6.54 72.43a.98.98 0 1 0 0-1.96.98.98 0 0 0 0 1.96Z" />
      <path stroke={fontColor} strokeLinecap="round" strokeLinejoin="round" d="M48.78 84.86v4.31M46.63 87.02h4.3" />
      <path
        fill={bgColor}
        stroke={fontColor}
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M100.41 17.08H17.94a3.86 3.86 0 0 0-3.86 3.86v56.57a3.86 3.86 0 0 0 3.86 3.86h82.47a3.86 3.86 0 0 0 3.86-3.86V20.94a3.86 3.86 0 0 0-3.86-3.86Z"
      />
      <path
        fill={bgColor}
        stroke={fontColor}
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M92.11 34.18H26.23a2.76 2.76 0 0 0-2.76 2.76v35.95a2.76 2.76 0 0 0 2.76 2.76h65.88a2.76 2.76 0 0 0 2.76-2.76V36.94a2.76 2.76 0 0 0-2.76-2.76Z"
      />
      <path
        fill={brandColor}
        d="M104.27 27.91V21a3.854 3.854 0 0 0-1.127-2.736 3.851 3.851 0 0 0-2.733-1.134H17.94A3.86 3.86 0 0 0 14.08 21v7l90.19-.09Z"
      />
      <path stroke={brandColor} strokeLinecap="round" strokeLinejoin="round" d="M41.18 10.59v12.45M77.18 10.59v12.45" />
      <path
        fill={brandColor}
        d="M90.55 11.42a.98.98 0 1 0 0-1.96.98.98 0 0 0 0 1.96ZM29.31 12.28a.98.98 0 1 0 0-1.96.98.98 0 0 0 0 1.96Z"
      />
      <path
        stroke={brandColor}
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M54.39 4.81v4.3M52.24 6.96h4.3M9.31.93v4.3M7.16 3.08h4.31M46.67 64.16a12.81 12.81 0 0 1 25 0"
      />
      <path
        fill={brandColor}
        d="M73.3 49.24a1.78 1.78 0 1 0 0-3.56 1.78 1.78 0 0 0 0 3.56ZM45.05 49.24a1.78 1.78 0 1 0 0-3.56 1.78 1.78 0 0 0 0 3.56Z"
      />
    </svg>
  </i>
);
export const EmptyNotification: React.FC<{ bgColor: string; brandColor: string; fontColor: string; size: string }> = ({
  bgColor,
  brandColor,
  fontColor,
  size,
}) => (
  <i style={{ fontSize: size, lineHeight: 1 }}>
    <svg xmlns="http://www.w3.org/2000/svg" width="1em" height=".87em" fill="none" viewBox="0 0 119 104">
      <path fill="#CFCFCF" d="M16.11 76.13a.98.98 0 1 0 0-1.96.98.98 0 0 0 0 1.96Z" />
      <path
        fill={bgColor}
        d="M79.66 35.17c-8.37 0-16.89-.34-24.86-2.56-7.82-2.17-15-6.38-21.4-11.25-4.19-3.17-8-5.7-13.44-5.32a24.91 24.91 0 0 0-14.52 5.67C-1.48 27.77-.44 39 2.33 46.86 6.49 58.73 19.15 67 29.91 72.35 42.34 78.56 56 82.17 69.69 84.24c12 1.83 27.42 3.15 37.82-4.68 9.55-7.21 12.17-23.65 9.83-34.75a13.652 13.652 0 0 0-4.91-8.32c-6.71-4.91-16.72-1.63-24.26-1.47-2.8.06-5.65.13-8.51.15Z"
      />
      <path
        fill={brandColor}
        d="M62.23 85.48c6.235 0 11.29-5.055 11.29-11.29 0-6.235-5.055-11.29-11.29-11.29-6.235 0-11.29 5.055-11.29 11.29 0 6.235 5.055 11.29 11.29 11.29Z"
      />
      <path
        fill={bgColor}
        stroke={fontColor}
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M50.564 3.706A4.87 4.87 0 0 1 56.377 7.4l1.804 8.09-9.526 2.125-1.804-8.091a4.872 4.872 0 0 1 3.713-5.818Z"
      />
      <path
        fill={bgColor}
        stroke={fontColor}
        strokeLinecap="round"
        strokeLinejoin="round"
        d="m95.07 67.18-57.89 12.9a2.12 2.12 0 0 1-2.5-2.66l.24-.83c2-7.09 3.74-14.9 2.14-22.1l-3.42-15.36C30.76 26.22 38.5 13.07 51.34 9.9a24.19 24.19 0 0 1 29.44 18.22L84.31 44c1.61 7.2 6.47 13.56 11.33 19.1l.57.65a2.129 2.129 0 0 1-1.14 3.43Z"
      />
      <path
        stroke={fontColor}
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M52.25 57.28a10.22 10.22 0 0 1 19.5-4.35"
      />
      <path
        fill={fontColor}
        d="M70.11 41.05a1.42 1.42 0 1 0 0-2.84 1.42 1.42 0 0 0 0 2.84ZM48.09 45.96a1.42 1.42 0 1 0 0-2.84 1.42 1.42 0 0 0 0 2.84Z"
      />
      <path
        fill={bgColor}
        d="M74.57 2.2a.98.98 0 1 0 0-1.96.98.98 0 0 0 0 1.96ZM16.11 76.13a.98.98 0 1 0 0-1.96.98.98 0 0 0 0 1.96Z"
      />
      <path
        stroke="#BABABA"
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M101.65 24.89v4.3M99.5 27.04h4.3M103.61 89.63v4.3M101.46 91.78h4.3M28.43 8.59v4.3M26.28 10.74h4.3"
      />
      <path
        fill={bgColor}
        d="M59.58 103.7c20.275 0 36.71-1.025 36.71-2.29 0-1.265-16.436-2.29-36.71-2.29s-36.71 1.025-36.71 2.29c0 1.265 16.436 2.29 36.71 2.29Z"
      />
      <path
        fill={bgColor}
        stroke={fontColor}
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M94.65 22.45a11.48 11.48 0 0 1-11.47 11.47c-.374 0-.748-.02-1.12-.06l-3.4 5.55-1.06-6.95a11.47 11.47 0 1 1 17.05-10v-.01Z"
      />
      <path
        fill={fontColor}
        stroke={fontColor}
        strokeMiterlimit={10}
        d="M78.28 23.61a1.16 1.16 0 1 0 0-2.32 1.16 1.16 0 0 0 0 2.32ZM83.18 23.61a1.16 1.16 0 1 0 0-2.32 1.16 1.16 0 0 0 0 2.32ZM88.08 23.61a1.16 1.16 0 1 0 0-2.32 1.16 1.16 0 0 0 0 2.32Z"
      />
    </svg>
  </i>
);
export default {
  send: (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" height={"1em"} width={"1em"}>
      <path d="M3.478 2.404a.75.75 0 0 0-.926.941l2.432 7.905H13.5a.75.75 0 0 1 0 1.5H4.984l-2.432 7.905a.75.75 0 0 0 .926.94 60.519 60.519 0 0 0 18.445-8.986.75.75 0 0 0 0-1.218A60.517 60.517 0 0 0 3.478 2.404Z" />
    </svg>
  ),
  rectangleStack: (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      height={"1em"}
      width={"1em"}
      fill="none"
      viewBox="0 0 24 24"
      strokeWidth={1.5}
      stroke="currentColor"
      className="size-6"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M6 6.878V6a2.25 2.25 0 0 1 2.25-2.25h7.5A2.25 2.25 0 0 1 18 6v.878m-12 0c.235-.083.487-.128.75-.128h10.5c.263 0 .515.045.75.128m-12 0A2.25 2.25 0 0 0 4.5 9v.878m13.5-3A2.25 2.25 0 0 1 19.5 9v.878m0 0a2.246 2.246 0 0 0-.75-.128H5.25c-.263 0-.515.045-.75.128m15 0A2.25 2.25 0 0 1 21 12v6a2.25 2.25 0 0 1-2.25 2.25H5.25A2.25 2.25 0 0 1 3 18v-6c0-.98.626-1.813 1.5-2.122"
      />
    </svg>
  ),
  academicCap: (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      height={"1em"}
      width={"1em"}
      viewBox="0 0 24 24"
      fill="currentColor"
      className="size-6"
    >
      <path d="M11.7 2.805a.75.75 0 0 1 .6 0A60.65 60.65 0 0 1 22.83 8.72a.75.75 0 0 1-.231 1.337 49.948 49.948 0 0 0-9.902 3.912l-.003.002c-.114.06-.227.119-.34.18a.75.75 0 0 1-.707 0A50.88 50.88 0 0 0 7.5 12.173v-.224c0-.131.067-.248.172-.311a54.615 54.615 0 0 1 4.653-2.52.75.75 0 0 0-.65-1.352 56.123 56.123 0 0 0-4.78 2.589 1.858 1.858 0 0 0-.859 1.228 49.803 49.803 0 0 0-4.634-1.527.75.75 0 0 1-.231-1.337A60.653 60.653 0 0 1 11.7 2.805Z" />
      <path d="M13.06 15.473a48.45 48.45 0 0 1 7.666-3.282c.134 1.414.22 2.843.255 4.284a.75.75 0 0 1-.46.711 47.87 47.87 0 0 0-8.105 4.342.75.75 0 0 1-.832 0 47.87 47.87 0 0 0-8.104-4.342.75.75 0 0 1-.461-.71c.035-1.442.121-2.87.255-4.286.921.304 1.83.634 2.726.99v1.27a1.5 1.5 0 0 0-.14 2.508c-.09.38-.222.753-.397 1.11.452.213.901.434 1.346.66a6.727 6.727 0 0 0 .551-1.607 1.5 1.5 0 0 0 .14-2.67v-.645a48.549 48.549 0 0 1 3.44 1.667 2.25 2.25 0 0 0 2.12 0Z" />
      <path d="M4.462 19.462c.42-.419.753-.89 1-1.395.453.214.902.435 1.347.662a6.742 6.742 0 0 1-1.286 1.794.75.75 0 0 1-1.06-1.06Z" />
    </svg>
  ),
  arrowTrendingDown: (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="1em"
      height="1em"
      fill="none"
      viewBox="0 0 24 24"
      strokeWidth={1.5}
      stroke="currentColor"
      className="size-6"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M2.25 6 9 12.75l4.286-4.286a11.948 11.948 0 0 1 4.306 6.43l.776 2.898m0 0 3.182-5.511m-3.182 5.51-5.511-3.181"
      />
    </svg>
  ),
  arrowTrendingUp: (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="1em"
      height="1em"
      fill="none"
      viewBox="0 0 24 24"
      strokeWidth={1.5}
      stroke="currentColor"
      className="size-6"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M2.25 18 9 11.25l4.306 4.306a11.95 11.95 0 0 1 5.814-5.518l2.74-1.22m0 0-5.94-2.281m5.94 2.28-2.28 5.941"
      />
    </svg>
  ),
  desktop: (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="1em"
      height="1em"
      viewBox="0 0 24 24"
      fill="currentColor"
      className="size-6"
    >
      <path
        fillRule="evenodd"
        d="M2.25 5.25a3 3 0 0 1 3-3h13.5a3 3 0 0 1 3 3V15a3 3 0 0 1-3 3h-3v.257c0 .597.237 1.17.659 1.591l.621.622a.75.75 0 0 1-.53 1.28h-9a.75.75 0 0 1-.53-1.28l.621-.622a2.25 2.25 0 0 0 .659-1.59V18h-3a3 3 0 0 1-3-3V5.25Zm1.5 0v7.5a1.5 1.5 0 0 0 1.5 1.5h13.5a1.5 1.5 0 0 0 1.5-1.5v-7.5a1.5 1.5 0 0 0-1.5-1.5H5.25a1.5 1.5 0 0 0-1.5 1.5Z"
        clipRule="evenodd"
      />
    </svg>
  ),
  mobile: (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="1em"
      height="1em"
      viewBox="0 0 24 24"
      fill="currentColor"
      className="size-6"
    >
      <path d="M10.5 18.75a.75.75 0 0 0 0 1.5h3a.75.75 0 0 0 0-1.5h-3Z" />
      <path
        fillRule="evenodd"
        d="M8.625.75A3.375 3.375 0 0 0 5.25 4.125v15.75a3.375 3.375 0 0 0 3.375 3.375h6.75a3.375 3.375 0 0 0 3.375-3.375V4.125A3.375 3.375 0 0 0 15.375.75h-6.75ZM7.5 4.125C7.5 3.504 8.004 3 8.625 3H9.75v.375c0 .621.504 1.125 1.125 1.125h2.25c.621 0 1.125-.504 1.125-1.125V3h1.125c.621 0 1.125.504 1.125 1.125v15.75c0 .621-.504 1.125-1.125 1.125h-6.75A1.125 1.125 0 0 1 7.5 19.875V4.125Z"
        clipRule="evenodd"
      />
    </svg>
  ),
  quotes: (
    <svg width="1em" height="1em" viewBox="0 0 23 20" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
      <path
        d="M7.73434 1.61621L9.67104 3.38397L4.59436 8.01786V8.75009H10.0721V17.5001H1.85547V6.98232L7.73434 1.61621Z"
        fill="currentColor"
      />
      <path
        d="M21.0253 8.75009H15.5475V8.01786L20.6241 3.38397L18.6875 1.61621L12.8086 6.98232V17.5001H21.0253V8.75009Z"
        fill="currentColor"
      />
    </svg>
  ),
  testimonials: (
    <svg
      height={"1em"}
      width={"1em"}
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 24 24"
      strokeWidth={1.5}
      stroke="currentColor"
      className="size-6"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M8.625 9.75a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Zm0 0H8.25m4.125 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Zm0 0H12m4.125 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Zm0 0h-.375m-13.5 3.01c0 1.6 1.123 2.994 2.707 3.227 1.087.16 2.185.283 3.293.369V21l4.184-4.183a1.14 1.14 0 0 1 .778-.332 48.294 48.294 0 0 0 5.83-.498c1.585-.233 2.708-1.626 2.708-3.228V6.741c0-1.602-1.123-2.995-2.707-3.228A48.394 48.394 0 0 0 12 3c-2.392 0-4.744.175-7.043.513C3.373 3.746 2.25 5.14 2.25 6.741v6.018Z"
      />
    </svg>
  ),
  info: (
    <svg
      height={"1em"}
      width={"1em"}
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="currentColor"
      className="size-6"
    >
      <path
        fillRule="evenodd"
        d="M2.25 12c0-5.385 4.365-9.75 9.75-9.75s9.75 4.365 9.75 9.75-4.365 9.75-9.75 9.75S2.25 17.385 2.25 12ZM12 8.25a.75.75 0 0 1 .75.75v3.75a.75.75 0 0 1-1.5 0V9a.75.75 0 0 1 .75-.75Zm0 8.25a.75.75 0 1 0 0-1.5.75.75 0 0 0 0 1.5Z"
        clipRule="evenodd"
      />
    </svg>
  ),
  brand: (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      height={"1em"}
      width={"1em"}
      viewBox="0 0 24 24"
      strokeWidth={1.5}
      stroke="currentColor"
      className="size-6"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M13.5 21v-7.5a.75.75 0 0 1 .75-.75h3a.75.75 0 0 1 .75.75V21m-4.5 0H2.36m11.14 0H18m0 0h3.64m-1.39 0V9.349M3.75 21V9.349m0 0a3.001 3.001 0 0 0 3.75-.615A2.993 2.993 0 0 0 9.75 9.75c.896 0 1.7-.393 2.25-1.016a2.993 2.993 0 0 0 2.25 1.016c.896 0 1.7-.393 2.25-1.015a3.001 3.001 0 0 0 3.75.614m-16.5 0a3.004 3.004 0 0 1-.621-4.72l1.189-1.19A1.5 1.5 0 0 1 5.378 3h13.243a1.5 1.5 0 0 1 1.06.44l1.19 1.189a3 3 0 0 1-.621 4.72M6.75 18h3.75a.75.75 0 0 0 .75-.75V13.5a.75.75 0 0 0-.75-.75H6.75a.75.75 0 0 0-.75.75v3.75c0 .414.336.75.75.75Z"
      />
    </svg>
  ),
  pencilEdit: (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      height={"1em"}
      width={"1em"}
      viewBox="0 0 24 24"
      fill="currentColor"
      className="size-6"
    >
      <path d="M21.731 2.269a2.625 2.625 0 0 0-3.712 0l-1.157 1.157 3.712 3.712 1.157-1.157a2.625 2.625 0 0 0 0-3.712ZM19.513 8.199l-3.712-3.712-8.4 8.4a5.25 5.25 0 0 0-1.32 2.214l-.8 2.685a.75.75 0 0 0 .933.933l2.685-.8a5.25 5.25 0 0 0 2.214-1.32l8.4-8.4Z" />
      <path d="M5.25 5.25a3 3 0 0 0-3 3v10.5a3 3 0 0 0 3 3h10.5a3 3 0 0 0 3-3V13.5a.75.75 0 0 0-1.5 0v5.25a1.5 1.5 0 0 1-1.5 1.5H5.25a1.5 1.5 0 0 1-1.5-1.5V8.25a1.5 1.5 0 0 1 1.5-1.5h5.25a.75.75 0 0 0 0-1.5H5.25Z" />
    </svg>
  ),
  site: (
    <svg
      height={"1em"}
      width={"1em"}
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="currentColor"
      className="size-6"
    >
      <path
        fillRule="evenodd"
        d="M2.25 5.25a3 3 0 0 1 3-3h13.5a3 3 0 0 1 3 3V15a3 3 0 0 1-3 3h-3v.257c0 .597.237 1.17.659 1.591l.621.622a.75.75 0 0 1-.53 1.28h-9a.75.75 0 0 1-.53-1.28l.621-.622a2.25 2.25 0 0 0 .659-1.59V18h-3a3 3 0 0 1-3-3V5.25Zm1.5 0v7.5a1.5 1.5 0 0 0 1.5 1.5h13.5a1.5 1.5 0 0 0 1.5-1.5v-7.5a1.5 1.5 0 0 0-1.5-1.5H5.25a1.5 1.5 0 0 0-1.5 1.5Z"
        clipRule="evenodd"
      />
    </svg>
  ),
  events: (
    <svg
      height={"1em"}
      width={"1em"}
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="currentColor"
      className="size-6"
    >
      <path
        fillRule="evenodd"
        d="M6.75 2.25A.75.75 0 0 1 7.5 3v1.5h9V3A.75.75 0 0 1 18 3v1.5h.75a3 3 0 0 1 3 3v11.25a3 3 0 0 1-3 3H5.25a3 3 0 0 1-3-3V7.5a3 3 0 0 1 3-3H6V3a.75.75 0 0 1 .75-.75Zm13.5 9a1.5 1.5 0 0 0-1.5-1.5H5.25a1.5 1.5 0 0 0-1.5 1.5v7.5a1.5 1.5 0 0 0 1.5 1.5h13.5a1.5 1.5 0 0 0 1.5-1.5v-7.5Z"
        clipRule="evenodd"
      />
    </svg>
  ),
  faq: (
    <svg
      height={"1em"}
      width={"1em"}
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 24 24"
      strokeWidth={1.5}
      stroke="currentColor"
      className="size-6"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M9.879 7.519c1.171-1.025 3.071-1.025 4.242 0 1.172 1.025 1.172 2.687 0 3.712-.203.179-.43.326-.67.442-.745.361-1.45.999-1.45 1.827v.75M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Zm-9 5.25h.008v.008H12v-.008Z"
      />
    </svg>
  ),
  cross: (
    <svg
      height={"1em"}
      width={"1em"}
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="currentColor"
      className="size-6"
    >
      <path
        fillRule="evenodd"
        d="M12 2.25c-5.385 0-9.75 4.365-9.75 9.75s4.365 9.75 9.75 9.75 9.75-4.365 9.75-9.75S17.385 2.25 12 2.25Zm-1.72 6.97a.75.75 0 1 0-1.06 1.06L10.94 12l-1.72 1.72a.75.75 0 1 0 1.06 1.06L12 13.06l1.72 1.72a.75.75 0 1 0 1.06-1.06L13.06 12l1.72-1.72a.75.75 0 1 0-1.06-1.06L12 10.94l-1.72-1.72Z"
        clipRule="evenodd"
      />
    </svg>
  ),
  clock: (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="currentColor"
      className="size-6"
      height={"1em"}
      width={"1em"}
    >
      <path
        fillRule="evenodd"
        d="M12 2.25c-5.385 0-9.75 4.365-9.75 9.75s4.365 9.75 9.75 9.75 9.75-4.365 9.75-9.75S17.385 2.25 12 2.25ZM12.75 6a.75.75 0 0 0-1.5 0v6c0 .414.336.75.75.75h4.5a.75.75 0 0 0 0-1.5h-3.75V6Z"
        clipRule="evenodd"
      />
    </svg>
  ),
  location: (
    <svg
      height={"1em"}
      width={"1em"}
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="currentColor"
      className="size-6"
    >
      <path
        fillRule="evenodd"
        d="m11.54 22.351.07.04.028.016a.76.76 0 0 0 .723 0l.028-.015.071-.041a16.975 16.975 0 0 0 1.144-.742 19.58 19.58 0 0 0 2.683-2.282c1.944-1.99 3.963-4.98 3.963-8.827a8.25 8.25 0 0 0-16.5 0c0 3.846 2.02 6.837 3.963 8.827a19.58 19.58 0 0 0 2.682 2.282 16.975 16.975 0 0 0 1.145.742ZM12 13.5a3 3 0 1 0 0-6 3 3 0 0 0 0 6Z"
        clipRule="evenodd"
      />
    </svg>
  ),
  calender: (
    <svg
      height={"1em"}
      width={"1em"}
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="currentColor"
      className="size-6"
    >
      <path d="M12 11.993a.75.75 0 0 0-.75.75v.006c0 .414.336.75.75.75h.006a.75.75 0 0 0 .75-.75v-.006a.75.75 0 0 0-.75-.75H12ZM12 16.494a.75.75 0 0 0-.75.75v.005c0 .414.335.75.75.75h.005a.75.75 0 0 0 .75-.75v-.005a.75.75 0 0 0-.75-.75H12ZM8.999 17.244a.75.75 0 0 1 .75-.75h.006a.75.75 0 0 1 .75.75v.006a.75.75 0 0 1-.75.75h-.006a.75.75 0 0 1-.75-.75v-.006ZM7.499 16.494a.75.75 0 0 0-.75.75v.005c0 .414.336.75.75.75h.005a.75.75 0 0 0 .75-.75v-.005a.75.75 0 0 0-.75-.75H7.5ZM13.499 14.997a.75.75 0 0 1 .75-.75h.006a.75.75 0 0 1 .75.75v.005a.75.75 0 0 1-.75.75h-.006a.75.75 0 0 1-.75-.75v-.005ZM14.25 16.494a.75.75 0 0 0-.75.75v.006c0 .414.335.75.75.75h.005a.75.75 0 0 0 .75-.75v-.006a.75.75 0 0 0-.75-.75h-.005ZM15.75 14.995a.75.75 0 0 1 .75-.75h.005a.75.75 0 0 1 .75.75v.006a.75.75 0 0 1-.75.75H16.5a.75.75 0 0 1-.75-.75v-.006ZM13.498 12.743a.75.75 0 0 1 .75-.75h2.25a.75.75 0 1 1 0 1.5h-2.25a.75.75 0 0 1-.75-.75ZM6.748 14.993a.75.75 0 0 1 .75-.75h4.5a.75.75 0 0 1 0 1.5h-4.5a.75.75 0 0 1-.75-.75Z" />
      <path
        fillRule="evenodd"
        d="M18 2.993a.75.75 0 0 0-1.5 0v1.5h-9V2.994a.75.75 0 1 0-1.5 0v1.497h-.752a3 3 0 0 0-3 3v11.252a3 3 0 0 0 3 3h13.5a3 3 0 0 0 3-3V7.492a3 3 0 0 0-3-3H18V2.993ZM3.748 18.743v-7.5a1.5 1.5 0 0 1 1.5-1.5h13.5a1.5 1.5 0 0 1 1.5 1.5v7.5a1.5 1.5 0 0 1-1.5 1.5h-13.5a1.5 1.5 0 0 1-1.5-1.5Z"
        clipRule="evenodd"
      />
    </svg>
  ),

  phone: (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      height={"1em"}
      width={"1em"}
      viewBox="0 0 24 24"
      fill="currentColor"
      className="size-6"
    >
      <path
        fillRule="evenodd"
        d="M1.5 4.5a3 3 0 0 1 3-3h1.372c.86 0 1.61.586 1.819 1.42l1.105 4.423a1.875 1.875 0 0 1-.694 1.955l-1.293.97c-.135.101-.164.249-.126.352a11.285 11.285 0 0 0 6.697 6.697c.103.038.25.009.352-.126l.97-1.293a1.875 1.875 0 0 1 1.955-.694l4.423 1.105c.834.209 1.42.959 1.42 1.82V19.5a3 3 0 0 1-3 3h-2.25C8.552 22.5 1.5 15.448 1.5 6.75V4.5Z"
        clipRule="evenodd"
      />
    </svg>
  ),
  newWindow: (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      height={"1em"}
      width={"1em"}
      fill="none"
      viewBox="0 0 24 24"
      strokeWidth={1.5}
      stroke="currentColor"
      className="size-6"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M13.5 6H5.25A2.25 2.25 0 0 0 3 8.25v10.5A2.25 2.25 0 0 0 5.25 21h10.5A2.25 2.25 0 0 0 18 18.75V10.5m-10.5 6L21 3m0 0h-5.25M21 3v5.25"
      />
    </svg>
  ),
  sendOutlined: (
    <svg
      height={"1em"}
      width={"1em"}
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 24 24"
      strokeWidth={1.5}
      stroke="currentColor"
      className="size-6"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M6 12 3.269 3.125A59.769 59.769 0 0 1 21.485 12 59.768 59.768 0 0 1 3.27 20.875L5.999 12Zm0 0h7.5"
      />
    </svg>
  ),
  html: (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 24 24"
      strokeWidth={1.5}
      height={15}
      width={15}
      stroke="#FFA500"
      className="size-6"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M17.25 6.75 22.5 12l-5.25 5.25m-10.5 0L1.5 12l5.25-5.25m7.5-3-4.5 16.5"
      />
    </svg>
  ),
  fail: (
    <svg
      width="15px"
      height="15px"
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 24 24"
      strokeWidth={1.5}
      stroke="currentColor"
      className="size-6"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="m9.75 9.75 4.5 4.5m0-4.5-4.5 4.5M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z"
      />
    </svg>
  ),
  review: (
    <svg
      width="1em"
      height="1em"
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 24 24"
      strokeWidth={1.5}
      stroke="currentColor"
      className="size-6"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M12 9v3.75m9-.75a9 9 0 1 1-18 0 9 9 0 0 1 18 0Zm-9 3.75h.008v.008H12v-.008Z"
      />
    </svg>
  ),
  css: (
    <svg width="15px" height="15px" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M6 28L4 3H28L26 28L16 31L6 28Z" fill="#1172B8" />
      <path d="M26 5H16V29.5L24 27L26 5Z" fill="#33AADD" />
      <path
        d="M19.5 17.5H9.5L9 14L17 11.5H9L8.5 8.5H24L23.5 12L17 14.5H23L22 24L16 26L10 24L9.5 19H12.5L13 21.5L16 22.5L19 21.5L19.5 17.5Z"
        fill="white"
      />
    </svg>
  ),
  newsPaper: (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      height={"1em"}
      width={"1em"}
      viewBox="0 0 24 24"
      strokeWidth={1.5}
      stroke="currentColor"
      className="size-6"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M12 7.5h1.5m-1.5 3h1.5m-7.5 3h7.5m-7.5 3h7.5m3-9h3.375c.621 0 1.125.504 1.125 1.125V18a2.25 2.25 0 0 1-2.25 2.25M16.5 7.5V18a2.25 2.25 0 0 0 2.25 2.25M16.5 7.5V4.875c0-.621-.504-1.125-1.125-1.125H4.125C3.504 3.75 3 4.254 3 4.875V18a2.25 2.25 0 0 0 2.25 2.25h13.5M6 7.5h3v3H6v-3Z"
      />
    </svg>
  ),
  update: (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      height={"1em"}
      width={"1em"}
      viewBox="0 0 24 24"
      strokeWidth={1.5}
      stroke="currentColor"
      className="size-6"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M9.348 14.652a3.75 3.75 0 0 1 0-5.304m5.304 0a3.75 3.75 0 0 1 0 5.304m-7.425 2.121a6.75 6.75 0 0 1 0-9.546m9.546 0a6.75 6.75 0 0 1 0 9.546M5.106 18.894c-3.808-3.807-3.808-9.98 0-13.788m13.788 0c3.808 3.807 3.808 9.98 0 13.788M12 12h.008v.008H12V12Zm.375 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Z"
      />
    </svg>
  ),
  dashboard: (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width={"1em"}
      height={"1em"}
      fill="none"
      viewBox="0 0 24 24"
      strokeWidth={1.5}
      stroke="currentColor"
      className="w-6 h-6"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M3.75 6A2.25 2.25 0 0 1 6 3.75h2.25A2.25 2.25 0 0 1 10.5 6v2.25a2.25 2.25 0 0 1-2.25 2.25H6a2.25 2.25 0 0 1-2.25-2.25V6ZM3.75 15.75A2.25 2.25 0 0 1 6 13.5h2.25a2.25 2.25 0 0 1 2.25 2.25V18a2.25 2.25 0 0 1-2.25 2.25H6A2.25 2.25 0 0 1 3.75 18v-2.25ZM13.5 6a2.25 2.25 0 0 1 2.25-2.25H18A2.25 2.25 0 0 1 20.25 6v2.25A2.25 2.25 0 0 1 18 10.5h-2.25a2.25 2.25 0 0 1-2.25-2.25V6ZM13.5 15.75a2.25 2.25 0 0 1 2.25-2.25H18a2.25 2.25 0 0 1 2.25 2.25V18A2.25 2.25 0 0 1 18 20.25h-2.25A2.25 2.25 0 0 1 13.5 18v-2.25Z"
      />
    </svg>
  ),
  download: (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      height={"1em"}
      width={"1em"}
      fill="none"
      viewBox="0 0 24 24"
      strokeWidth={1.5}
      stroke="currentColor"
      className="size-6"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M3 16.5v2.25A2.25 2.25 0 0 0 5.25 21h13.5A2.25 2.25 0 0 0 21 18.75V16.5M16.5 12 12 16.5m0 0L7.5 12m4.5 4.5V3"
      />
    </svg>
  ),
  rupeeFileed: (
    <svg
      height={"1em"}
      width={"1em"}
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="currentColor"
      className="size-6"
    >
      <path
        fillRule="evenodd"
        d="M12 2.25c-5.385 0-9.75 4.365-9.75 9.75s4.365 9.75 9.75 9.75 9.75-4.365 9.75-9.75S17.385 2.25 12 2.25ZM9 7.5A.75.75 0 0 0 9 9h1.5c.98 0 1.813.626 2.122 1.5H9A.75.75 0 0 0 9 12h3.622a2.251 2.251 0 0 1-2.122 1.5H9a.75.75 0 0 0-.53 1.28l3 3a.75.75 0 1 0 1.06-1.06L10.8 14.988A3.752 3.752 0 0 0 14.175 12H15a.75.75 0 0 0 0-1.5h-.825A3.733 3.733 0 0 0 13.5 9H15a.75.75 0 0 0 0-1.5H9Z"
        clipRule="evenodd"
      />
    </svg>
  ),
  rupees: (
    <svg height={15} width={15} viewBox="0 0 15 15" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M1.99999 1V0H13V1H8.32866C9.22627 1.72635 9.83888 2.791 9.97253 4H13V5H9.97253C9.72381 7.24998 7.81627 9 5.49999 9H3.85162L9.82539 14.1204L9.1746 14.8796L2.1746 8.87963C2.01573 8.74346 1.95846 8.52277 2.03105 8.32653C2.10365 8.13029 2.29076 8 2.49999 8H5.49999C7.26323 8 8.72193 6.69615 8.96455 5H1.99999V4H8.96455C8.72193 2.30385 7.26323 1 5.49999 1H1.99999Z"
        fill="currentColor"
        stroke="currentColor"
      />
    </svg>
  ),
  chevronRight: (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 24 24"
      strokeWidth={1.5}
      stroke="currentColor"
      height={20}
      width={20}
    >
      <path strokeLinecap="round" strokeLinejoin="round" d="m8.25 4.5 7.5 7.5-7.5 7.5" />
    </svg>
  ),
  noNetwork: (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 24 24"
      strokeWidth={1.5}
      stroke="currentColor"
      className="size-6"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="m3 3 8.735 8.735m0 0a.374.374 0 1 1 .53.53m-.53-.53.53.53m0 0L21 21M14.652 9.348a3.75 3.75 0 0 1 0 5.304m2.121-7.425a6.75 6.75 0 0 1 0 9.546m2.121-11.667c3.808 3.807 3.808 9.98 0 13.788m-9.546-4.242a3.733 3.733 0 0 1-1.06-2.122m-1.061 4.243a6.75 6.75 0 0 1-1.625-6.929m-.496 9.05c-3.068-3.067-3.664-7.67-1.79-11.334M12 12h.008v.008H12V12Z"
      />
    </svg>
  ),
  arrowLeft: (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      height={"1em"}
      width={"1em"}
      viewBox="0 0 24 24"
      strokeWidth={1.5}
      stroke="currentColor"
      className="size-6"
    >
      <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 19.5 3 12m0 0 7.5-7.5M3 12h18" />
    </svg>
  ),
  imgUpload: (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      height={"1em"}
      width={"1em"}
      viewBox="0 0 24 24"
      strokeWidth={1.5}
      className="size-6"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="m2.25 15.75 5.159-5.159a2.25 2.25 0 0 1 3.182 0l5.159 5.159m-1.5-1.5 1.409-1.409a2.25 2.25 0 0 1 3.182 0l2.909 2.909m-18 3.75h16.5a1.5 1.5 0 0 0 1.5-1.5V6a1.5 1.5 0 0 0-1.5-1.5H3.75A1.5 1.5 0 0 0 2.25 6v12a1.5 1.5 0 0 0 1.5 1.5Zm10.5-11.25h.008v.008h-.008V8.25Zm.375 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Z"
      />
    </svg>
  ),
  blog: (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      height={"1em"}
      width={"1em"}
      fill="none"
      viewBox="0 0 24 24"
      strokeWidth={1.5}
      stroke="currentColor"
      className="size-6"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M12 6.042A8.967 8.967 0 0 0 6 3.75c-1.052 0-2.062.18-3 .512v14.25A8.987 8.987 0 0 1 6 18c2.305 0 4.408.867 6 2.292m0-14.25a8.966 8.966 0 0 1 6-2.292c1.052 0 2.062.18 3 .512v14.25A8.987 8.987 0 0 0 18 18a8.967 8.967 0 0 0-6 2.292m0-14.25v14.25"
      />
    </svg>
  ),

  courseConfig: (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 24 24"
      strokeWidth={1.5}
      stroke="currentColor"
      height={"1em"}
      width={"1em"}
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M4.26 10.147a60.438 60.438 0 0 0-.491 6.347A48.62 48.62 0 0 1 12 20.904a48.62 48.62 0 0 1 8.232-4.41 60.46 60.46 0 0 0-.491-6.347m-15.482 0a50.636 50.636 0 0 0-2.658-.813A59.906 59.906 0 0 1 12 3.493a59.903 59.903 0 0 1 10.399 5.84c-.896.248-1.783.52-2.658.814m-15.482 0A50.717 50.717 0 0 1 12 13.489a50.702 50.702 0 0 1 7.74-3.342M6.75 15a.75.75 0 1 0 0-1.5.75.75 0 0 0 0 1.5Zm0 0v-3.675A55.378 55.378 0 0 1 12 8.443m-7.007 11.55A5.981 5.981 0 0 0 6.75 15.75v-1.5"
      />
    </svg>
  ),
  courses: (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 24 24"
      strokeWidth={1.5}
      stroke="currentColor"
      width={"1em"}
      height={"1em"}
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M4.26 10.147a60.438 60.438 0 0 0-.491 6.347A48.62 48.62 0 0 1 12 20.904a48.62 48.62 0 0 1 8.232-4.41 60.46 60.46 0 0 0-.491-6.347m-15.482 0a50.636 50.636 0 0 0-2.658-.813A59.906 59.906 0 0 1 12 3.493a59.903 59.903 0 0 1 10.399 5.84c-.896.248-1.783.52-2.658.814m-15.482 0A50.717 50.717 0 0 1 12 13.489a50.702 50.702 0 0 1 7.74-3.342M6.75 15a.75.75 0 1 0 0-1.5.75.75 0 0 0 0 1.5Zm0 0v-3.675A55.378 55.378 0 0 1 12 8.443m-7.007 11.55A5.981 5.981 0 0 0 6.75 15.75v-1.5"
      />
    </svg>
  ),
  certification: (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width={18}
      fill="none"
      viewBox="0 0 24 24"
      strokeWidth={1.5}
      stroke="currentColor"
      className="w-6 h-6"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M9 12.75 11.25 15 15 9.75M21 12c0 1.268-.63 2.39-1.593 3.068a3.745 3.745 0 0 1-1.043 3.296 3.745 3.745 0 0 1-3.296 1.043A3.745 3.745 0 0 1 12 21c-1.268 0-2.39-.63-3.068-1.593a3.746 3.746 0 0 1-3.296-1.043 3.745 3.745 0 0 1-1.043-3.296A3.745 3.745 0 0 1 3 12c0-1.268.63-2.39 1.593-3.068a3.745 3.745 0 0 1 1.043-3.296 3.746 3.746 0 0 1 3.296-1.043A3.746 3.746 0 0 1 12 3c1.268 0 2.39.63 3.068 1.593a3.746 3.746 0 0 1 3.296 1.043 3.746 3.746 0 0 1 1.043 3.296A3.745 3.745 0 0 1 21 12Z"
      />
    </svg>
  ),
  guides: (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width={18}
      fill="none"
      viewBox="0 0 24 24"
      strokeWidth={1.5}
      stroke="currentColor"
      className="w-6 h-6"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M12 6.042A8.967 8.967 0 0 0 6 3.75c-1.052 0-2.062.18-3 .512v14.25A8.987 8.987 0 0 1 6 18c2.305 0 4.408.867 6 2.292m0-14.25a8.966 8.966 0 0 1 6-2.292c1.052 0 2.062.18 3 .512v14.25A8.987 8.987 0 0 0 18 18a8.967 8.967 0 0 0-6 2.292m0-14.25v14.25"
      />
    </svg>
  ),
  quiz: (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width={18}
      fill="none"
      viewBox="0 0 24 24"
      strokeWidth={1.5}
      stroke="currentColor"
      className="w-6 h-6"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M12 18v-5.25m0 0a6.01 6.01 0 0 0 1.5-.189m-1.5.189a6.01 6.01 0 0 1-1.5-.189m3.75 7.478a12.06 12.06 0 0 1-4.5 0m3.75 2.383a14.406 14.406 0 0 1-3 0M14.25 18v-.192c0-.983.658-1.823 1.508-2.316a7.5 7.5 0 1 0-7.517 0c.85.493 1.509 1.333 1.509 2.316V18"
      />
    </svg>
  ),
  refresh: (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="currentColor"
      className="size-6"
      height={20}
      width={20}
    >
      <path
        fillRule="evenodd"
        d="M4.755 10.059a7.5 7.5 0 0 1 12.548-3.364l1.903 1.903h-3.183a.75.75 0 1 0 0 1.5h4.992a.75.75 0 0 0 .75-.75V4.356a.75.75 0 0 0-1.5 0v3.18l-1.9-1.9A9 9 0 0 0 3.306 9.67a.75.75 0 1 0 1.45.388Zm15.408 3.352a.75.75 0 0 0-.919.53 7.5 7.5 0 0 1-12.548 3.364l-1.902-1.903h3.183a.75.75 0 0 0 0-1.5H2.984a.75.75 0 0 0-.75.75v4.992a.75.75 0 0 0 1.5 0v-3.18l1.9 1.9a9 9 0 0 0 15.059-4.035.75.75 0 0 0-.53-.918Z"
        clipRule="evenodd"
      />
    </svg>
  ),
  setting: (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width={"1em"}
      widths={"1em"}
      fill="none"
      viewBox="0 0 24 24"
      strokeWidth={1.5}
      stroke="currentColor"
      className="w-6 h-6"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M9.594 3.94c.09-.542.56-.94 1.11-.94h2.593c.55 0 1.02.398 1.11.94l.213 1.281c.063.374.313.686.645.87.074.04.147.083.22.127.325.196.72.257 1.075.124l1.217-.456a1.125 1.125 0 0 1 1.37.49l1.296 2.247a1.125 1.125 0 0 1-.26 1.431l-1.003.827c-.293.241-.438.613-.43.992a7.723 7.723 0 0 1 0 .255c-.008.378.137.75.43.991l1.004.827c.424.35.534.955.26 1.43l-1.298 2.247a1.125 1.125 0 0 1-1.369.491l-1.217-.456c-.355-.133-.75-.072-1.076.124a6.47 6.47 0 0 1-.22.128c-.331.183-.581.495-.644.869l-.213 1.281c-.09.543-.56.94-1.11.94h-2.594c-.55 0-1.019-.398-1.11-.94l-.213-1.281c-.062-.374-.312-.686-.644-.87a6.52 6.52 0 0 1-.22-.127c-.325-.196-.72-.257-1.076-.124l-1.217.456a1.125 1.125 0 0 1-1.369-.49l-1.297-2.247a1.125 1.125 0 0 1 .26-1.431l1.004-.827c.292-.24.437-.613.43-.991a6.932 6.932 0 0 1 0-.255c.007-.38-.138-.751-.43-.992l-1.004-.827a1.125 1.125 0 0 1-.26-1.43l1.297-2.247a1.125 1.125 0 0 1 1.37-.491l1.216.456c.356.133.751.072 1.076-.124.072-.044.146-.086.22-.128.332-.183.582-.495.644-.869l.214-1.28Z"
      />
      <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" />
    </svg>
  ),
  notification: (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width={"1em"}
      height={"1em"}
      fill="none"
      viewBox="0 0 24 24"
      strokeWidth={1.5}
      stroke="currentColor"
      className="w-6 h-6"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M14.857 17.082a23.848 23.848 0 0 0 5.454-1.31A8.967 8.967 0 0 1 18 9.75V9A6 6 0 0 0 6 9v.75a8.967 8.967 0 0 1-2.312 6.022c1.733.64 3.56 1.085 5.455 1.31m5.714 0a24.255 24.255 0 0 1-5.714 0m5.714 0a3 3 0 1 1-5.714 0"
      />
    </svg>
  ),
  userGroup: (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width={18}
      fill="none"
      viewBox="0 0 24 24"
      strokeWidth={1.5}
      stroke="currentColor"
      className="w-6 h-6"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M18 18.72a9.094 9.094 0 0 0 3.741-.479 3 3 0 0 0-4.682-2.72m.94 3.198.001.031c0 .225-.012.447-.037.666A11.944 11.944 0 0 1 12 21c-2.17 0-4.207-.576-5.963-1.584A6.062 6.062 0 0 1 6 18.719m12 0a5.971 5.971 0 0 0-.941-3.197m0 0A5.995 5.995 0 0 0 12 12.75a5.995 5.995 0 0 0-5.058 2.772m0 0a3 3 0 0 0-4.681 2.72 8.986 8.986 0 0 0 3.74.477m.94-3.197a5.971 5.971 0 0 0-.94 3.197M15 6.75a3 3 0 1 1-6 0 3 3 0 0 1 6 0Zm6 3a2.25 2.25 0 1 1-4.5 0 2.25 2.25 0 0 1 4.5 0Zm-13.5 0a2.25 2.25 0 1 1-4.5 0 2.25 2.25 0 0 1 4.5 0Z"
      />
    </svg>
  ),
  content: (
    <svg
      width={18}
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 24 24"
      strokeWidth={1.5}
      stroke="currentColor"
      className="w-6 h-6"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M19.5 14.25v-2.625a3.375 3.375 0 0 0-3.375-3.375h-1.5A1.125 1.125 0 0 1 13.5 7.125v-1.5a3.375 3.375 0 0 0-3.375-3.375H8.25m0 12.75h7.5m-7.5 3H12M10.5 2.25H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 0 0-9-9Z"
      />
    </svg>
  ),
  arrowRight: (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      height={"1em"}
      width={"1em"}
      fill="none"
      viewBox="0 0 24 24"
      strokeWidth={1.5}
      stroke="currentColor"
      className="size-6"
    >
      <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5 21 12m0 0-7.5 7.5M21 12H3" />
    </svg>
  ),
  configuration: (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width={18}
      fill="none"
      viewBox="0 0 24 24"
      strokeWidth={1.5}
      stroke="currentColor"
      className="w-6 h-6"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M4.5 12a7.5 7.5 0 0 0 15 0m-15 0a7.5 7.5 0 1 1 15 0m-15 0H3m16.5 0H21m-1.5 0H12m-8.457 3.077 1.41-.513m14.095-5.13 1.41-.513M5.106 17.785l1.15-.964m11.49-9.642 1.149-.964M7.501 19.795l.75-1.3m7.5-12.99.75-1.3m-6.063 16.658.26-1.477m2.605-14.772.26-1.477m0 17.726-.26-1.477M10.698 4.614l-.26-1.477M16.5 19.794l-.75-1.299M7.5 4.205 12 12m6.894 5.785-1.149-.964M6.256 7.178l-1.15-.964m15.352 8.864-1.41-.513M4.954 9.435l-1.41-.514M12.002 12l-3.75 6.495"
      />
    </svg>
  ),
  message: (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="currentColor"
      className="size-6"
      height={20}
      width={20}
    >
      <path d="M4.913 2.658c2.075-.27 4.19-.408 6.337-.408 2.147 0 4.262.139 6.337.408 1.922.25 3.291 1.861 3.405 3.727a4.403 4.403 0 0 0-1.032-.211 50.89 50.89 0 0 0-8.42 0c-2.358.196-4.04 2.19-4.04 4.434v4.286a4.47 4.47 0 0 0 2.433 3.984L7.28 21.53A.75.75 0 0 1 6 21v-4.03a48.527 48.527 0 0 1-1.087-.128C2.905 16.58 1.5 14.833 1.5 12.862V6.638c0-1.97 1.405-3.718 3.413-3.979Z" />
      <path d="M15.75 7.5c-1.376 0-2.739.057-4.086.169C10.124 7.797 9 9.103 9 10.609v4.285c0 1.507 1.128 2.814 2.67 2.94 1.243.102 2.5.157 3.768.165l2.782 2.781a.75.75 0 0 0 1.28-.53v-2.39l.33-.026c1.542-.125 2.67-1.433 2.67-2.94v-4.286c0-1.505-1.125-2.811-2.664-2.94A49.392 49.392 0 0 0 15.75 7.5Z" />
    </svg>
  ),
  xMark: (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="1em"
      height="1em"
      fill="currentColor"
      viewBox="0 0 24 24"
      strokeWidth={1.5}
      stroke="currentColor"
      className="cross_svg_icon"
    >
      <path strokeLinecap="round" strokeLinejoin="round" d="M6 18 18 6M6 6l12 12" />
    </svg>
  ),

  uploadIcon: (
    <svg
      width={30}
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 24 24"
      strokeWidth={1.5}
      stroke="currentColor"
      className="w-6 h-6"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M3 16.5v2.25A2.25 2.25 0 0 0 5.25 21h13.5A2.25 2.25 0 0 0 21 18.75V16.5m-13.5-9L12 3m0 0 4.5 4.5M12 3v13.5"
      />
    </svg>
  ),
  moon: (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      width={"1em"}
      height={"1em"}
      viewBox="0 0 24 24"
      strokeWidth={1.5}
      stroke="currentColor"
      className="w-6 h-6"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M21.752 15.002A9.72 9.72 0 0 1 18 15.75c-5.385 0-9.75-4.365-9.75-9.75 0-1.33.266-2.597.748-3.752A9.753 9.753 0 0 0 3 11.25C3 16.635 7.365 21 12.75 21a9.753 9.753 0 0 0 9.002-5.998Z"
      />
    </svg>
  ),
  sun: (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      width={"1em"}
      height={"1em"}
      viewBox="0 0 24 24"
      strokeWidth={1.5}
      stroke="currentColor"
      className="w-6 h-6"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M12 3v2.25m6.364.386-1.591 1.591M21 12h-2.25m-.386 6.364-1.591-1.591M12 18.75V21m-4.773-4.227-1.591 1.591M5.25 12H3m4.227-4.773L5.636 5.636M15.75 12a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0Z"
      />
    </svg>
  ),
  threeDots: (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width={30}
      fill="none"
      viewBox="0 0 24 24"
      strokeWidth={1.5}
      stroke="currentColor"
      style={{
        cursor: "pointer",
      }}
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M6.75 12a.75.75 0 1 1-1.5 0 .75.75 0 0 1 1.5 0ZM12.75 12a.75.75 0 1 1-1.5 0 .75.75 0 0 1 1.5 0ZM18.75 12a.75.75 0 1 1-1.5 0 .75.75 0 0 1 1.5 0Z"
      />
    </svg>
  ),
  verticalThreeDots: (
    <svg
      width={"1em"}
      height={"1em"}
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 24 24"
      strokeWidth={1.5}
      stroke="currentColor"
      className="size-6"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M12 6.75a.75.75 0 1 1 0-1.5.75.75 0 0 1 0 1.5ZM12 12.75a.75.75 0 1 1 0-1.5.75.75 0 0 1 0 1.5ZM12 18.75a.75.75 0 1 1 0-1.5.75.75 0 0 1 0 1.5Z"
      />
    </svg>
  ),
  categoryWave: (
    <svg xmlns="http://www.w3.org/2000/svg" width={600} height={700} fill="none">
      <g clipPath="url(#a)">
        <mask
          id="b"
          width={1032}
          height={1440}
          x={-115}
          y={-675}
          maskUnits="userSpaceOnUse"
          style={{
            maskType: "luminance",
          }}
        >
          <path fill="#fff" d="M916.527 765V-675H-114.191V765H916.527Z" />
        </mask>
        <g strokeMiterlimit={10} mask="url(#b)">
          <path
            stroke="#FF4DC4"
            d="M-37.442-741c62.358 10.32 99.593 69.24 106.808 125.88 7.215 56.64-6.957 114.48-6.957 171.84.129 153.6 113.636 298.44 273.397 348.72 51.151 16.08 105.779 23.16 157.185 38.88C544.27-39.96 594.388-13.32 618.739 30c35.173 62.28 8.116 140.28-31.179 203.16-39.297 62.88-91.347 121.68-109.385 191.28-23.707 91.44 17.135 186.6 82.714 256.56 65.581 69.96 153.836 119.4 240.674 167.64"
          />
          <path
            stroke="#F552C5"
            d="M-31.387-744.477c62.101 11.4 99.207 70.081 106.68 126.841 3.22 24.6 2.448 49.319.257 74.159-2.835 32.64-7.86 65.281-8.632 97.681-1.546 66.12 16.62 130.679 51.922 187.32a403.001 403.001 0 0 0 106.421 113.76c30.665 22.2 65.194 39.96 102.686 52.32 16.75 5.52 34.013 10.08 51.407 14.28 35.302 8.52 71.12 15.48 105.262 26.52 38.781 12.48 76.273 31.44 101.783 59.52 7.989 8.76 14.817 18.24 20.228 28.68 22.548 43.68 14.817 94.2-4.38 142.56-8.246 20.88-18.682 41.4-29.762 60.48-12.498 21.36-25.897 42.24-38.78 63-25.254 40.796-48.573 81.236-56.948 124.916-5.541 28.44-3.994 56.4 2.577 84.24 13.527 56.28 49.603 111.72 95.727 157.92 12.626 12.6 26.026 24.72 39.812 36.48 61.585 51.96 132.705 95.4 199.959 138.24"
          />
          <path
            stroke="#EB57C7"
            d="M-25.333-747.836c61.715 12.48 98.82 70.92 106.55 127.8 3.35 24.6 2.578 49.44.259 74.4-3.093 32.64-8.633 65.16-10.18 97.68-3.22 66 12.112 130.32 45.868 187.56 26.155 44.28 60.426 83.76 101.912 116.04 29.763 23.04 63.776 41.4 101.01 54.36 16.621 5.76 33.886 10.56 51.279 14.88 35.173 8.88 71.119 16.2 105.004 27.72 38.523 13.08 75.114 32.64 99.335 61.68 7.473 9 13.916 18.6 18.811 29.04 20.486 43.92 10.823 93.72-8.374 141.96-8.375 21-18.296 41.64-28.732 60.84-11.596 21.6-23.964 42.72-35.173 63.36-22.289 40.676-42.002 79.916-46.898 121.076-3.22 26.64.516 52.2 9.019 77.76 17.393 51.84 56.819 104.52 104.876 149.88 13.27 12.48 27.056 24.48 41.229 36.24 63.388 52.44 133.993 99.12 197.511 145.32"
          />
          <path
            stroke="#E15DC8"
            d="M-19.15-751.32c61.328 13.56 98.563 71.64 106.422 128.64 3.35 24.6 2.706 49.56.258 74.52-3.222 32.64-9.277 65.16-11.596 97.56-4.767 65.88 7.473 130.08 39.812 187.92 24.994 44.64 57.463 84.96 97.402 118.32 28.732 24 62.23 42.96 99.207 56.4 16.492 6 33.627 10.92 51.02 15.6 35.174 9.24 71.12 17.04 104.747 28.92 38.266 13.56 73.954 33.84 97.017 63.72 7.086 9.24 13.012 18.84 17.393 29.4 18.424 44.04 6.829 93.24-12.369 141.48-8.374 21-18.037 41.76-27.7 61.32-10.822 21.84-21.774 43.08-31.695 63.72-19.326 40.56-35.431 78.84-36.719 117.36-.902 24.96 5.024 47.88 15.331 71.16 21.001 47.4 63.905 97.32 114.153 141.84 13.786 12.24 28.216 24.24 42.775 36.12 65.322 52.92 135.281 102.96 195.063 152.4"
          />
          <path
            stroke="#D762CA"
            d="M-13.091-754.797c61.07 14.64 98.175 72.48 106.293 129.6 3.478 24.72 2.834 49.68.128 74.64-3.479 32.64-9.92 65.16-13.142 97.44-6.312 65.76 2.964 129.84 33.756 188.16 23.836 45.12 54.5 86.16 92.894 120.6 27.7 24.96 60.683 44.52 97.403 58.44 16.491 6.24 33.498 11.4 50.891 16.2 35.045 9.6 71.12 17.76 104.489 30.24 37.88 14.16 72.924 34.92 94.569 65.88 6.571 9.36 12.111 19.2 15.976 29.64 16.363 44.28 2.834 92.76-16.492 140.88-8.503 21-17.65 42-26.669 61.68-10.05 21.96-19.841 43.56-28.087 64.08-16.234 40.437-28.86 77.757-26.67 113.637 1.417 23.28 9.534 43.56 21.774 64.68 24.866 42.96 70.99 90 123.299 133.92 14.43 12 29.247 24 44.192 36 67.126 53.4 136.441 106.68 192.616 159.48"
          />
          <path
            stroke="#CD67CB"
            d="M-7.037-758.16c60.684 15.6 97.79 73.32 106.164 130.56 3.608 24.72 2.964 49.8.13 74.76-3.608 32.64-10.695 65.16-14.56 97.32-7.987 65.64-1.546 129.6 27.701 188.52 22.676 45.6 51.664 87.24 88.384 122.88 26.799 25.92 59.137 45.96 95.728 60.48 16.362 6.48 33.369 11.88 50.762 16.8 35.045 10.08 71.12 18.6 104.232 31.44 37.621 14.64 71.764 36.12 92.249 68.04 6.184 9.6 11.21 19.44 14.559 30 14.301 44.4-1.031 92.28-20.485 140.4-8.504 21.12-17.394 42.24-25.64 62.16-9.276 22.2-17.779 43.92-24.608 64.44-13.271 40.32-22.289 76.68-16.491 109.92 3.736 21.72 14.043 39.24 28.216 58.2 28.602 38.52 78.205 82.8 132.576 125.88 15.074 11.88 30.405 23.76 45.738 35.76 69.058 53.88 137.73 110.4 190.167 166.68"
          />
          <path
            stroke="#C36CCD"
            d="M-.854-761.641c60.298 16.68 97.533 74.16 105.907 131.52 3.608 24.72 3.092 49.92.129 74.88-3.865 32.76-11.338 65.16-15.977 97.32-9.534 65.521-6.184 129.36 21.645 188.76 21.517 46.08 48.703 88.441 83.875 125.161 25.768 26.88 57.592 47.52 93.925 62.52 16.234 6.6 33.111 12.239 50.505 17.519 35.044 10.44 71.119 19.321 103.973 32.641 37.364 15.12 70.733 37.2 89.802 70.2 5.668 9.84 10.307 19.8 13.142 30.36 12.239 44.64-5.026 91.8-24.48 139.92-8.503 21.12-17.007 42.48-24.609 62.52-8.503 22.44-15.718 44.28-21 64.92-10.307 40.08-15.719 75.84-6.443 106.2 6.185 20.16 18.682 35.04 34.53 51.72 32.339 34.08 85.291 75.6 141.723 117.96 15.59 11.64 31.437 23.52 47.156 35.64 70.862 54.36 139.018 114.24 187.848 173.76"
          />
          <path
            stroke="#B972CE"
            d="M5.201-765c59.91 17.76 97.145 75 105.778 132.36 3.736 24.84 3.22 50.04.128 75.12-3.994 32.76-11.982 65.04-17.522 97.2-11.209 65.4-10.693 129.12 15.59 189 20.357 46.56 45.738 89.64 79.365 127.32 24.737 27.84 56.045 49.08 92.121 64.56 16.104 6.84 32.983 12.72 50.376 18.12 34.916 10.8 71.119 20.04 103.715 33.84 37.106 15.72 69.574 38.28 87.483 72.36 5.283 9.96 9.406 20.04 11.853 30.72 10.179 44.76-9.018 91.32-28.474 139.32-8.632 21.24-16.748 42.72-23.577 62.88-7.731 22.68-13.657 44.76-17.522 65.28-7.344 39.96-8.89 74.88 3.607 102.36 8.504 18.72 23.192 30.72 40.971 45.24 36.205 29.64 92.378 68.28 151.001 109.92 16.233 11.52 32.596 23.28 48.701 35.52 72.794 54.84 140.178 117.96 185.4 180.84"
          />
          <path
            stroke="#AF77CF"
            d="M11.26-768.48c59.653 18.84 96.759 75.84 105.649 133.32 3.864 24.84 3.349 50.16.128 75.24-4.251 32.76-12.626 65.04-18.94 97.08-12.754 65.28-15.202 128.88 9.535 189.36 19.197 47.04 42.774 90.84 74.856 129.6 23.835 28.8 54.499 50.52 90.446 66.6 15.975 7.08 32.853 13.08 50.246 18.72 34.917 11.16 71.12 20.88 103.459 35.04 36.848 16.2 68.543 39.48 85.035 74.4 4.766 10.2 8.503 20.4 10.435 31.08 8.117 45-13.013 90.72-32.467 138.84-8.633 21.24-16.363 42.84-22.548 63.36-6.956 22.92-11.723 45.12-13.914 65.64-4.38 39.84-2.061 74.04 13.786 98.64 11.08 17.28 27.829 26.4 47.284 38.76 40.07 25.2 99.465 61.08 160.148 102 16.749 11.28 33.627 23.04 50.247 35.28 74.599 55.32 141.466 121.68 182.953 187.92"
          />
          <path
            stroke="#A57CD1"
            d="M17.443-771.84c59.266 19.92 96.5 76.68 105.519 134.28 3.866 24.84 3.479 50.16.13 75.36-4.382 32.76-13.4 65.04-20.486 96.96-14.43 65.16-19.841 128.52 3.478 189.6 18.038 47.52 39.812 92.04 70.347 131.88 22.805 29.76 52.953 52.08 88.641 68.64 15.848 7.32 32.598 13.56 49.991 19.44 34.787 11.64 71.119 21.6 103.201 36.36 36.59 16.8 67.511 40.56 82.585 76.56 4.381 10.32 7.473 20.64 9.019 31.44 6.055 45.12-17.007 90.24-36.461 138.36-8.633 21.36-16.105 43.08-21.516 63.72-6.056 23.16-9.663 45.48-10.437 66-1.417 39.6 5.025 73.2 23.836 94.92 13.657 15.84 32.339 22.08 53.726 32.28 43.806 20.76 106.679 53.88 169.296 93.96 17.393 11.04 34.786 22.8 51.664 35.16 76.402 55.8 142.754 125.4 180.504 195"
          />
          <path
            stroke="#9B81D2"
            d="M23.498-775.324c58.88 20.88 96.114 77.52 105.391 135.24 3.993 24.84 3.607 50.28 0 75.48-4.639 32.76-14.044 65.04-21.903 96.96-15.977 65.04-24.352 128.28-2.577 189.96 16.878 48 36.848 93.36 65.837 134.16 21.774 30.72 51.407 53.64 86.838 70.68 15.718 7.56 32.467 14.04 49.861 20.04 34.786 12 71.12 22.44 102.943 37.56 36.204 17.28 66.481 41.64 80.267 78.72 3.865 10.56 6.571 21 7.601 31.8 3.995 45.36-20.871 89.76-40.455 137.76-8.762 21.36-15.718 43.32-20.485 64.08-5.283 23.28-7.602 45.964-6.83 66.364 1.547 39.48 12.241 72.36 34.014 91.2 16.492 14.28 36.978 17.88 60.168 25.8 47.672 16.32 113.766 46.68 178.573 85.92 18.037 10.92 35.817 22.56 53.211 35.04 78.334 56.28 143.913 129.24 178.056 202.2"
          />
          <path
            stroke="#9187D4"
            d="M29.552-778.801c58.622 21.96 95.728 78.36 105.261 136.08 4.123 24.96 3.737 50.4 0 75.72-4.766 32.76-14.687 64.92-23.319 96.84-17.65 64.92-28.86 128.04-8.633 190.2 15.718 48.48 33.886 94.56 61.328 136.44 20.743 31.68 49.862 55.2 85.163 72.72 15.59 7.8 32.339 14.4 49.732 20.64 34.787 12.36 70.992 23.16 102.685 38.76 35.947 17.76 65.451 42.72 77.82 80.88 3.479 10.68 5.669 21.36 6.184 32.04 1.933 45.48-24.866 89.28-44.45 137.28-8.76 21.48-15.46 43.561-19.454 64.561-4.51 23.52-5.67 46.32-3.35 66.72 4.51 39.24 19.584 71.28 44.063 87.48 19.198 12.72 41.487 13.56 66.482 19.32 51.535 11.88 120.851 39.36 187.719 78 18.553 10.68 36.977 22.32 54.627 34.8 80.139 56.76 145.203 132.96 175.61 209.28"
          />
          <path
            stroke="#878CD5"
            d="M35.74-782.164c58.235 23.04 95.469 79.2 105.132 137.04 4.123 24.96 3.866 50.52 0 75.84-5.024 32.88-15.46 64.92-24.866 96.72-19.197 64.8-33.369 127.8-14.688 190.56 14.56 48.96 30.922 95.76 56.819 138.72 19.712 32.64 48.315 56.64 83.359 74.76 15.461 7.92 32.082 14.88 49.475 21.24 34.657 12.72 70.991 23.88 102.298 39.96 35.69 18.36 64.55 43.8 75.501 83.04 3.092 10.92 4.767 21.6 4.767 32.4-.129 45.72-28.86 88.8-48.573 136.8-8.761 21.48-15.074 43.68-18.424 64.92-3.736 23.764-3.608 46.684.258 67.084 7.344 39.12 26.927 70.08 54.241 83.64 22.032 11.04 46.125 9.24 72.924 12.72 55.401 7.32 128.066 32.16 196.996 69.96 19.197 10.44 38.007 21.96 56.173 34.68 82.071 57.24 146.491 136.68 173.29 216.36"
          />
          <path
            stroke="#7D91D7"
            d="M41.793-785.637c57.85 24.121 95.084 80.041 104.876 138.001 4.251 24.96 3.994 50.64 0 75.959-5.154 32.88-16.105 64.92-26.284 96.6-20.742 64.68-38.007 127.56-20.742 190.8 13.399 49.32 27.957 96.96 52.308 141 18.682 33.72 46.769 58.2 81.556 76.8 15.331 8.16 31.952 15.361 49.346 21.961 34.658 13.2 70.99 24.72 102.04 41.28 35.431 18.84 63.519 44.88 73.053 85.08 2.576 11.04 3.865 21.96 3.349 32.76-2.189 45.84-32.853 88.32-52.566 136.2-8.89 21.48-14.688 43.92-17.393 65.28-2.964 23.996-1.675 47.036 3.736 67.436 10.307 38.88 34.271 68.76 64.291 79.92 24.866 9.24 50.634 4.92 79.366 6.24 59.137 2.88 135.152 24.96 206.143 62.04 19.841 10.32 39.167 21.72 57.591 34.44 83.875 57.72 147.651 140.4 170.842 223.44"
          />
          <path
            stroke="#7396D8"
            d="M47.847-789c57.592 25.2 94.698 80.88 104.748 138.96 4.38 25.08 4.123 50.76 0 76.08-5.412 32.88-16.75 64.92-27.83 96.6-22.418 64.56-42.517 127.32-26.798 191.16 12.239 49.8 24.865 98.28 47.799 143.28 17.651 34.68 45.223 59.76 79.881 78.84 15.331 8.4 31.823 15.72 49.217 22.56 34.528 13.56 70.99 25.44 101.782 42.48C411.82 20.4 439.263 46.92 447.38 88.2c2.19 11.28 2.963 22.2 1.933 33.12-4.123 46.08-36.849 87.84-56.561 135.72-8.891 21.6-14.43 44.16-16.363 65.76-2.19 24.24.387 47.52 7.344 67.8 13.27 38.76 41.486 67.44 74.34 76.2 27.701 7.32 55.273.6 85.679-.24 63.003-1.68 142.239 17.76 215.42 54 20.357 10.08 40.198 21.48 59.138 34.32 85.807 58.2 148.938 144.24 168.393 230.64"
          />
          <path
            stroke="#699CD9"
            d="M54.032-792.48c57.204 26.159 94.439 81.719 104.617 139.799 4.38 25.08 4.252 50.88-.129 76.32-5.539 32.881-17.522 64.921-29.246 96.481-23.965 64.44-47.027 126.96-32.855 191.4C107.5-238.2 118.323-189 139.71-142.92c16.621 35.64 43.677 61.2 78.078 80.88 15.203 8.64 31.565 16.2 48.958 23.16 34.53 13.92 70.991 26.28 101.526 43.68 34.916 19.92 61.586 46.92 68.285 89.4 1.804 11.52 2.062 22.56.516 33.48-6.184 46.2-40.714 87.36-60.555 135.12-9.019 21.6-14.043 44.4-15.331 66.12-1.29 24.36 2.318 47.879 10.822 68.159 16.104 38.64 48.573 66.001 84.518 72.481 30.407 5.4 59.782-3.721 92.121-6.721 66.867-6.12 149.325 10.441 224.567 46.081 21.001 9.84 41.358 21.24 60.555 34.2 87.611 58.68 150.227 147.959 165.946 237.719"
          />
          <path
            stroke="#5FA1DB"
            d="M60.09-795.84c56.818 27.24 94.052 82.56 104.489 140.76 4.509 25.08 4.38 51-.13 76.44-5.797 32.88-18.166 64.8-30.663 96.36-25.639 64.32-51.665 126.72-38.91 191.64 9.921 50.76 18.94 100.8 38.781 147.84 15.461 36.6 42.13 62.76 76.273 82.92C225.004-51 241.367-43.32 258.761-36c34.4 14.28 70.99 27 101.267 44.88 34.53 20.4 60.684 48 65.837 91.56 1.418 11.64 1.16 22.8-.901 33.84-8.246 46.44-44.708 86.88-64.549 134.64-9.019 21.72-13.786 44.64-14.301 66.6-.516 24.6 4.381 48.24 14.43 68.52 19.068 38.4 55.787 64.56 94.568 68.76 33.112 3.48 64.291-8.16 98.434-13.2 70.604-10.8 156.54 3.24 233.715 38.04 21.516 9.72 42.388 21 62.101 33.96 89.543 59.16 151.518 151.68 163.498 244.8"
          />
          <path
            stroke="#55A6DC"
            d="M66.143-799.324c56.432 28.32 93.667 83.4 104.361 141.72 4.638 25.2 4.51 51.12-.129 76.56-6.055 33-18.81 64.8-32.21 96.36-27.185 64.2-56.174 126.48-44.964 192 8.76 51.24 15.847 102 34.271 150.12 14.43 37.68 40.584 64.32 74.469 84.96 14.946 9.12 31.308 17.04 48.701 24.48 34.4 14.64 70.991 27.72 101.01 46.08 34.272 21 59.782 49.2 63.519 93.6 1.031 11.88.257 23.16-2.191 34.2-10.307 46.56-48.701 86.4-68.543 134.16-9.018 21.72-13.399 44.76-13.27 66.964.258 24.84 6.314 48.72 17.909 68.88 22.032 38.28 62.744 63.12 104.746 64.92 35.689 1.56 68.929-12.48 104.876-19.68 74.34-15.24 163.627-3.96 242.992 30 22.16 9.48 43.548 20.76 63.518 33.84 91.347 59.64 152.672 155.4 161.182 251.88"
          />
          <path
            stroke="#4BABDE"
            d="M72.327-802.801c56.174 29.4 93.408 84.12 104.231 142.68 4.638 25.2 4.638 51.12-.129 76.68-6.184 33-19.583 64.8-33.627 96.24-28.86 64.08-60.683 126.24-51.02 192.24 7.6 51.72 12.754 103.2 29.762 152.4 13.399 38.64 39.038 65.76 72.794 87 14.817 9.36 31.051 17.52 48.444 25.08 34.4 15.12 70.991 28.56 100.753 47.4 34.013 21.48 58.88 50.28 61.07 95.76.515 12-.774 23.4-3.607 34.56-12.369 46.8-52.696 85.8-72.537 133.56-9.149 21.84-13.142 45.001-12.241 67.321 1.031 25.08 8.375 49.08 21.517 69.24 24.866 38.16 69.831 61.68 114.796 61.2 38.265-.36 73.439-16.68 111.318-26.16 78.205-19.68 170.712-11.28 252.139 22.08 22.805 9.24 44.579 20.52 65.064 33.72 93.28 60.12 153.966 159.24 158.736 258.96"
          />
          <path
            stroke="#41B1DF"
            d="M78.383-806.16c55.787 30.36 93.022 84.96 104.102 143.52 4.767 25.2 4.767 51.24-.129 76.92-6.442 33-20.228 64.8-35.173 96.12-30.406 63.96-65.321 126-57.076 192.6 6.442 52.2 9.792 104.52 25.253 154.56 12.239 39.6 37.492 67.32 70.99 89.16 14.688 9.48 30.921 17.88 48.315 25.8C268.936-12 305.656 1.8 335.16 21.12c33.756 22.08 57.978 51.36 58.751 97.92.129 12.24-1.675 23.76-5.025 34.8-14.43 46.92-56.689 85.32-76.659 133.08-9.148 21.84-12.756 45.24-11.209 67.8 1.803 25.32 10.307 49.56 24.995 69.6 27.7 38.04 76.788 60.24 124.974 57.48 40.842-2.4 77.948-21 117.631-32.64 82.071-24.12 177.798-18.48 261.416 14.04 23.319 9.12 45.738 20.28 66.481 33.48 95.083 60.6 155.255 162.96 156.285 266.16"
          />
          <path
            stroke="#37B6E1"
            d="M84.438-809.637c55.401 31.44 92.636 85.801 103.845 144.481 4.896 25.32 4.896 51.36-.129 77.04-6.571 32.999-20.872 64.799-36.59 95.999-32.082 63.84-69.831 125.76-63.131 192.84 5.281 52.68 6.57 105.72 20.742 156.84 11.081 40.56 35.947 68.88 69.188 91.2 14.558 9.72 30.792 18.36 48.186 26.4 34.271 15.84 70.99 30.12 100.237 49.8 33.498 22.56 57.204 52.44 56.303 100.08-.258 12.36-2.578 24-6.442 35.16-16.491 47.16-60.555 84.84-80.654 132.6-9.148 21.96-12.497 45.477-10.178 68.157 2.577 25.44 12.368 49.92 28.602 69.96 30.664 37.92 83.746 58.8 135.024 53.76 43.419-4.32 82.586-25.32 124.073-39.12 85.807-28.68 185.014-25.68 270.563 6.12 23.965 8.88 46.769 20.04 68.028 33.36 97.015 61.08 156.415 166.68 153.835 273.24"
          />
          <path
            stroke="#2DBBE2"
            d="M90.624-813c78.85 46.56 121.109 137.4 103.587 222.6C173.597-489.96 79.157-402.24 87.016-301.32c4.123 53.16 3.608 106.92 16.234 159.12 14.43 59.76 58.364 93.12 115.44 120.24C292 12.84 377.034 40.08 372.525 131.28c-3.221 65.88-67.641 108.6-92.507 167.52-19.584 46.56-10.564 101.16 23.063 138.96 33.627 37.8 90.574 57.36 145.072 50.04 45.997-6.24 87.097-29.64 130.516-45.6 114.667-42.36 250.464-30.24 349.284 31.32 98.817 61.56 157.697 170.52 151.387 280.32"
          />
          <path
            stroke="#33B4E3"
            d="M79.287-807.723c72.666 47.281 111.961 137.521 95.856 222.121-7.988 42.359-28.345 82.559-47.929 122.279-20.227 40.68-39.811 80.64-45.609 122.4-1.804 13.44-2.319 27.12-.773 40.92 5.799 51.96 7.216 104.52 20.357 156.481 14.817 58.92 56.948 92.88 110.803 120.96 12.368 6.48 24.994 12.72 37.492 19.08 36.719 18.72 71.506 38.64 90.703 70.08 10.822 17.64 16.878 38.76 15.848 65.16-2.32 65.04-61.328 107.64-82.587 164.64a123.344 123.344 0 0 0-6.184 23.16c-6.442 39.002 5.668 80.162 34.142 110.282 34.143 36.12 90.575 54.84 144.559 48 45.738-5.76 87.095-27.6 130.514-42.36 74.856-25.44 158.344-28.32 234.102-9.96 40.456 9.84 78.721 25.8 112.477 47.4 61.585 39.6 107.192 97.8 131.292 163.2 13.78 37.56 20.35 77.52 18.55 117.6"
          />
          <path
            stroke="#38ADE5"
            d="M67.946-802.32c66.482 47.879 102.814 137.639 88.127 221.759-7.344 42.241-25.768 82.201-43.29 121.441-17.91 40.2-35.045 79.44-38.91 120.48-1.288 13.2-1.16 26.52.773 40.08 7.472 50.88 10.693 102.12 24.35 153.72C114.072-86.88 154.656-52.2 205.29-23.28c11.724 6.72 23.449 13.2 35.173 19.8 34.272 19.32 66.353 39.48 84.133 70.92 9.92 17.76 15.718 38.76 15.074 64.68-1.546 64.2-55.015 106.68-72.665 161.76-2.32 7.32-3.866 14.76-4.767 22.32-4.382 37.56 8.89 76.92 37.75 105.6 34.657 34.44 90.445 52.32 143.914 46.08 45.479-5.16 86.966-25.68 130.514-39 74.856-23.28 157.957-24.6 232.813-5.28 40.198 10.44 77.948 26.88 111.189 48.96 60.555 40.2 105.133 98.52 129.223 164.04 13.79 37.56 20.49 77.28 18.94 117.24"
          />
          <path
            stroke="#3EA6E6"
            d="M56.612-796.922c60.296 48.6 93.795 137.76 80.525 221.28-6.571 42-23.321 81.84-38.523 120.72-15.72 39.84-30.15 78.36-32.211 118.56-.644 12.96 0 26.04 2.32 39.24 9.147 49.8 14.43 99.72 28.473 151.08 15.589 57.12 54.242 92.4 101.655 122.28 10.951 6.84 21.902 13.68 32.725 20.4 31.694 19.92 61.327 40.32 77.561 71.76 9.148 17.76 14.688 38.76 14.301 64.2-.644 63.36-48.83 105.6-62.744 159a122.064 122.064 0 0 0-3.479 21.6c-2.319 36.122 12.111 73.682 41.358 101.042 35.044 32.88 90.316 49.8 143.27 44.16 45.351-4.68 86.967-23.64 130.514-35.76 74.856-21 157.571-21 231.525-.6 39.94 11.04 77.175 27.96 109.771 50.4 59.524 40.8 103.077 99.24 127.167 164.76 13.66 37.44 20.48 77.16 19.45 117"
          />
          <path
            stroke="#43A0E8"
            d="M45.271-791.523c54.242 49.319 84.648 137.879 72.795 220.92-5.798 41.88-20.743 81.48-33.885 120-13.4 39.48-25.253 77.16-25.51 116.64-.129 12.72 1.03 25.44 3.865 38.4 10.694 48.72 17.909 97.32 32.467 148.44 15.977 56.16 52.825 92.16 97.146 122.88 10.178 7.08 20.356 14.16 30.406 21.12 29.247 20.52 56.303 41.16 70.991 72.6 8.374 17.88 13.27 38.76 13.399 63.72.258 62.52-42.517 104.52-52.825 156.12-1.417 6.84-2.061 13.8-2.061 20.76-.257 34.683 15.333 70.322 44.965 96.362 35.56 31.2 90.188 47.161 142.755 42.241 45.094-4.2 86.967-21.6 130.514-32.4 74.985-18.84 157.185-17.281 230.366 4.199 39.682 11.64 76.273 29.16 108.483 51.84 58.493 41.4 101.138 99.961 124.978 165.601 13.65 37.44 20.61 76.92 19.84 116.64"
          />
          <path
            stroke="#4999E9"
            d="M34.064-786.238c48.057 50.039 75.5 138 65.193 220.44-5.154 41.64-18.296 81.24-29.118 119.28-11.21 39-20.486 75.96-18.811 114.72.516 12.48 2.19 24.96 5.412 37.56 12.368 47.64 21.516 94.92 36.59 145.68 16.363 55.32 51.536 91.92 92.507 123.6 9.534 7.32 18.81 14.64 27.959 21.84 26.798 21 51.149 42.12 64.419 73.56 7.602 18 12.369 38.64 12.626 63.24.773 61.68-36.203 103.56-42.904 153.24-.901 6.6-1.03 13.32-.773 19.92 1.676 33.118 18.553 67.078 48.573 91.678 36.075 29.64 90.188 44.64 142.11 40.32 44.837-3.72 86.839-19.56 130.515-29.16 74.984-16.56 156.798-13.56 229.077 8.88 39.425 12.24 75.5 30.24 107.066 53.28 57.462 42 99.075 100.68 122.915 166.44 13.53 37.32 20.61 76.68 20.35 116.28"
          />
          <path
            stroke="#4F92EA"
            d="M22.726-780.84c41.873 50.76 66.48 138.12 57.463 219.96-4.382 41.4-15.72 80.88-24.48 118.56-8.89 38.64-15.59 74.76-12.111 112.8 1.16 12.24 3.22 24.36 6.957 36.72C64.6-246.24 75.68-200.28 91.14-149.76c16.749 54.36 50.118 91.68 87.997 124.2 8.761 7.56 17.264 15.12 25.639 22.44 24.351 21.6 46.125 42.96 57.85 74.4 6.828 18 11.208 38.64 11.852 62.76 1.675 60.96-29.89 102.6-32.983 150.36-.386 6.36-.129 12.72.644 19.2 3.737 31.68 21.775 63.84 52.18 87.12 36.591 27.96 90.06 42.12 141.467 38.4 44.578-3.24 86.838-17.64 130.515-25.8 74.984-14.4 156.41-9.72 227.788 13.56 39.167 12.84 74.727 31.32 105.777 54.72 56.432 42.48 97.017 101.28 120.854 167.16 13.53 37.32 20.74 76.56 20.87 116.04"
          />
          <path
            stroke="#548BEC"
            d="M11.388-775.441c35.689 51.359 57.334 138.359 49.732 219.6-3.607 41.28-13.27 80.52-19.712 117.84-6.7 38.28-10.694 73.68-5.412 110.88 1.675 12 4.381 23.88 8.504 35.88 15.59 45.48 28.731 90.24 44.707 140.28 17.007 53.52 48.83 91.44 83.36 124.92 8.116 7.8 15.718 15.6 23.19 23.16 21.775 22.2 40.972 43.92 51.279 75.24 5.927 18.12 10.05 38.64 11.08 62.28 2.448 60.12-23.706 101.52-23.062 147.48.129 6.12.773 12.24 1.932 18.36 5.798 30.241 24.996 60.481 55.788 82.441 37.106 26.28 89.93 39.6 140.951 36.48 44.449-2.76 86.838-15.48 130.643-22.56 74.985-12 156.025-6 226.5 18.36 38.91 13.44 73.826 32.4 104.361 56.16 55.401 43.08 94.954 102 118.661 168 13.4 37.2 20.74 76.32 21.26 115.68"
          />
          <path
            stroke="#5A84ED"
            d="M.05-770.039c29.505 52.08 48.058 138.48 42.13 219.12-3.091 41.04-10.693 80.16-15.073 117.12-4.38 37.8-5.798 72.48 1.288 108.96 2.32 11.76 5.54 23.28 10.05 35.04 17.264 44.28 32.21 87.84 48.7 137.64 17.395 52.68 47.414 91.32 78.851 125.64 7.343 8.04 14.173 16.08 20.872 23.88 19.326 22.68 35.818 44.76 44.707 76.08 5.154 18.24 8.89 38.64 10.178 61.8 3.222 59.28-17.393 100.56-13.141 144.6.515 5.88 1.675 11.76 3.221 17.52 7.859 28.799 28.216 57.239 59.395 77.759 37.622 24.72 89.931 37.08 140.307 34.44 44.191-2.28 86.709-13.44 130.643-19.2 74.984-9.84 155.639-2.28 225.212 23.04 38.652 14.04 73.052 33.6 102.943 57.6 54.37 43.68 92.893 102.72 116.597 168.72 13.4 37.08 20.75 76.2 21.78 115.32"
          />
          <path
            stroke="#607DEE"
            d="M-11.287-764.758c23.32 52.8 38.91 138.6 34.4 218.76-2.319 40.92-8.245 79.8-10.306 116.4-2.191 37.44-1.031 71.28 7.987 107.04 2.835 11.4 6.57 22.8 11.596 34.2 18.939 43.2 35.817 85.44 52.695 134.88 17.78 51.72 45.996 91.08 74.212 126.24 6.571 8.28 12.626 16.56 18.553 24.6 16.878 23.28 30.793 45.72 38.136 76.92 4.381 18.36 7.859 38.52 9.406 61.32 4.123 58.44-11.081 99.6-3.221 141.72 1.03 5.64 2.705 11.28 4.638 16.68 9.921 27.36 31.437 53.998 63.002 73.078 38.009 23.04 89.802 34.56 139.791 32.52 43.936-1.68 86.71-11.52 130.644-15.84 74.985-7.56 155.252 1.44 223.923 27.84 38.395 14.64 72.28 34.68 101.655 59.04 53.34 44.28 90.832 103.44 114.536 169.56 13.27 37.08 20.87 75.96 22.16 115.08"
          />
          <path
            stroke="#6576F0"
            d="M-22.628-759.359c17.265 53.52 29.762 138.72 26.67 218.28-1.546 40.68-5.669 79.44-5.669 115.68 0 37.08 3.865 70.08 14.688 105.12 3.479 11.16 7.73 22.2 13.142 33.36 20.614 42.12 39.295 83.04 56.818 132.24 18.038 50.88 44.707 90.96 69.573 126.96 5.927 8.52 11.081 17.04 16.105 25.2 14.43 23.76 25.639 46.68 31.566 77.76 3.479 18.48 6.699 38.52 8.632 60.84 4.896 57.6-4.638 98.64 6.699 138.84 1.547 5.4 3.608 10.68 5.927 15.96 11.854 25.92 34.658 50.639 66.61 68.519 38.524 21.48 89.673 32.04 139.147 30.6 43.677-1.2 86.581-9.48 130.644-12.6 74.985-5.4 154.865 5.28 222.635 32.52 38.008 15.36 71.506 35.76 100.237 60.6 52.309 44.88 88.771 104.16 112.477 170.4 13.267 36.96 20.877 75.72 22.677 114.72"
          />
          <path
            stroke="#6B70F1"
            d="M-33.837-753.961c11.08 54.24 20.744 138.84 19.07 217.92-.903 40.56-3.222 79.08-.903 114.84 2.32 36.6 8.761 68.88 21.387 103.2 4.123 10.92 8.89 21.72 14.688 32.52 22.289 41.04 42.904 80.64 60.812 129.6 18.425 50.04 43.29 90.84 65.065 127.56 5.153 8.76 9.663 17.4 13.786 25.92 11.982 24.36 20.485 47.52 24.994 78.6 2.706 18.6 5.541 38.52 7.731 60.48 5.798 56.76 1.675 97.56 16.62 135.96 2.061 5.16 4.509 10.2 7.344 15.12 13.914 24.48 37.879 47.401 70.217 63.841 39.039 19.8 89.673 29.52 138.503 28.68 43.549-.72 86.58-7.44 130.644-9.24 75.113-3.12 154.478 9 221.347 37.2 37.75 15.96 70.604 36.96 98.948 62.04 51.279 45.48 86.71 104.88 110.287 171.12 13.142 36.96 20.997 75.6 23.067 114.36"
          />
          <path
            stroke="#7069F3"
            d="M-45.174-748.562c4.896 54.84 11.596 138.96 11.338 217.44-.128 40.32-.772 78.72 3.865 114.12 4.51 36.24 13.53 67.8 28.087 101.28 4.64 10.68 9.92 21.24 16.234 31.68 23.964 39.96 46.383 78.24 64.936 126.84 18.682 49.08 41.872 90.6 60.425 128.28 4.382 9 8.118 17.88 11.338 26.64 9.534 24.84 15.332 48.48 18.296 79.44 1.804 18.6 4.38 38.52 6.957 60 6.571 55.92 7.988 96.6 26.541 133.08 2.577 4.92 5.412 9.72 8.632 14.28 15.977 23.04 41.1 44.042 73.825 59.162 39.554 18.12 89.544 27 137.988 26.76 43.29-.24 86.451-5.4 130.644-6 75.113-.96 154.091 12.84 220.057 42 37.493 16.56 69.832 38.04 97.532 63.48 50.377 46.08 84.648 105.6 108.226 171.96 13.141 36.84 21.003 75.36 23.573 114.12"
          />
          <path
            stroke="#7662F4"
            d="M-56.51-743.281c-1.289 55.56 2.576 139.08 3.607 216.96.644 40.08 1.804 78.36 8.503 113.4 6.829 35.88 18.424 66.6 34.787 99.36 5.282 10.44 11.08 20.64 17.78 30.72 25.639 38.88 49.99 75.84 68.929 124.2 18.94 48.24 40.456 90.48 55.917 128.88 3.736 9.24 6.571 18.36 9.018 27.24 7.087 25.32 10.179 49.44 11.724 80.28 1.031 18.72 3.351 38.52 6.185 59.52 7.473 55.08 14.302 95.64 36.591 130.2 2.963 4.68 6.442 9.24 10.05 13.56 18.037 21.6 44.32 40.8 77.432 54.601 40.069 16.56 89.415 24.48 137.344 24.84 43.031.36 86.451-3.48 130.642-2.64 75.114 1.32 153.706 16.56 218.77 46.68 37.235 17.16 69.058 39.12 96.244 64.92 49.345 46.68 82.586 106.32 106.164 172.8 13.012 36.84 21.129 75.12 24.093 113.76"
          />
          <path
            stroke="#7C5BF5"
            d="M-67.848-737.879c-7.473 56.28-6.57 139.32-3.994 216.6 1.288 39.96 4.252 78 13.271 112.68 9.018 35.4 23.19 65.4 41.486 97.44a314.699 314.699 0 0 0 19.326 29.88c27.314 37.68 53.469 73.44 73.052 121.44 19.326 47.4 39.038 90.36 51.279 129.6 2.963 9.48 5.024 18.84 6.699 27.96 4.639 25.92 5.927 50.28 5.153 81.12-.386 18.84 2.191 38.4 5.412 59.04 8.245 54.24 20.743 94.56 46.511 127.32 3.479 4.44 7.344 8.64 11.338 12.72 20.099 20.16 47.542 37.56 81.04 49.919 40.585 14.88 89.415 21.96 136.699 22.92 42.775.84 86.452-1.44 130.644.6 75.113 3.48 153.319 20.4 217.61 51.36 36.977 17.88 68.156 40.2 94.826 66.36 48.315 47.28 80.525 107.04 103.974 173.52 13.012 36.72 21.129 75 24.479 113.4"
          />
          <path
            stroke="#8154F7"
            d="M-79.19-732.477c-13.655 57-15.458 139.441-11.722 216.121 2.194 39.72 6.828 77.76 17.907 111.96 11.338 35.04 28.088 64.2 48.186 95.52 6.442 9.96 13.271 19.56 20.872 29.04 29.119 36.6 56.948 71.16 77.047 118.8 19.583 46.44 37.492 90.24 46.768 130.32 2.191 9.72 3.479 19.32 4.252 28.68 2.19 26.4-.258 51.24-1.417 82.08-.773 18.96 1.159 38.4 4.51 58.56 9.147 53.4 27.056 93.6 56.431 124.44 3.994 4.2 8.245 8.16 12.627 11.88 22.03 18.72 50.762 34.2 84.647 45.24 41.1 13.316 89.286 19.436 136.184 20.876 42.646 1.44 86.323.48 130.772 3.96 75.114 5.52 152.933 24.12 216.322 56.16 36.719 18.48 67.383 41.4 93.409 67.8 47.284 47.88 78.592 107.64 101.912 174.36a483.408 483.408 0 0 1 24.995 113.16"
          />
          <path
            stroke="#874DF8"
            d="M-90.53-727.199c-19.834 57.72-24.602 139.56-19.323 215.76 2.835 39.6 9.276 77.4 22.678 111.24 13.527 34.68 32.853 63.12 55.014 93.6 6.956 9.72 14.43 19.08 22.417 28.2 30.793 35.52 60.426 68.76 81.17 116.16 19.84 45.6 36.075 90.12 42.13 130.92 1.417 9.96 1.804 19.8 1.933 29.4.387 26.88-5.411 52.2-7.988 82.92-1.546 19.08 0 38.4 3.736 58.08 10.05 52.56 33.499 92.52 66.352 121.56 4.51 3.96 9.277 7.68 14.044 11.16 24.093 17.16 53.984 30.96 88.255 40.68 41.486 11.64 89.157 16.919 135.54 18.959 42.387 1.92 86.323 2.52 130.772 7.2 75.113 7.8 152.546 27.96 215.033 60.84 36.334 19.08 66.611 42.48 92.121 69.24 46.253 48.36 76.531 108.36 99.851 175.2a508.574 508.574 0 0 1 25.381 112.8"
          />
          <path
            stroke="#8D46F9"
            d="M-101.859-721.801c-25.903 58.32-33.756 139.68-27.065 215.28 3.616 39.36 11.86 77.04 27.315 110.52 15.847 34.2 37.753 61.92 61.717 91.68 7.602 9.48 15.59 18.48 23.964 27.36 32.469 34.44 64.034 66.36 85.163 113.4 20.229 44.76 34.53 90 37.622 131.64.773 10.2.387 20.28-.516 30-2.576 27.48-10.564 53.04-14.558 83.76-2.448 19.2-1.16 38.4 2.963 57.6 10.951 51.72 39.811 91.56 76.273 118.68 5.025 3.72 10.179 7.2 15.332 10.32 26.154 15.72 57.205 27.72 91.863 36 42.002 9.96 89.157 14.4 134.895 17.04 42.131 2.4 86.194 4.561 130.772 10.561 75.113 9.96 152.031 31.8 213.746 65.52 36.075 19.8 65.836 43.56 90.702 70.8 45.223 48.96 74.47 109.08 97.79 175.92 12.755 36.6 21.387 74.4 25.897 112.44"
          />
          <path
            stroke="#9240FB"
            d="M-113.077-716.398c-32.073 59.04-42.771 139.8-34.778 214.8 4.377 39.12 14.294 76.68 32.074 109.8 18.04 33.84 42.52 60.84 68.418 89.76 8.116 9.24 16.749 17.88 25.51 26.52 34.271 33.24 67.512 63.96 89.286 110.76 20.485 43.92 33.627 89.76 32.983 132.24-.129 10.44-1.03 20.76-2.835 30.72-5.025 27.96-15.847 54-21.13 84.6-3.35 19.2-2.19 38.28 2.19 57.12 11.725 50.88 46.254 90.48 86.194 115.8 5.411 3.48 11.081 6.6 16.749 9.48 28.216 14.28 60.427 24.36 95.471 31.32 42.517 8.4 89.028 11.88 134.379 15.12 41.874 3 86.195 6.48 130.773 13.918 75.114 12.24 151.644 35.64 212.456 70.32 35.818 20.4 64.936 44.76 89.416 72.24 44.192 49.56 72.408 109.8 95.599 176.76 12.626 36.48 21.387 74.16 26.412 112.2"
          />
          <path
            stroke="#9839FC"
            d="M-124.405-711.004c-38.274 59.76-51.927 139.92-42.391 214.44 5.018 39 16.878 76.32 36.721 109.08 20.354 33.48 47.41 59.64 75.11 87.84 8.761 8.88 17.78 17.4 27.057 25.68 35.945 32.16 70.99 61.68 93.28 108 20.743 43.08 31.566 89.64 28.344 132.96-.773 10.68-2.576 21.12-5.282 31.44-7.344 28.56-21 54.84-27.7 85.44-4.253 19.32-3.35 38.28 1.288 56.64 12.627 50.04 52.566 89.4 96.115 112.92a189.22 189.22 0 0 0 18.037 8.64c30.277 12.84 63.647 21.12 99.078 26.64 43.032 6.72 88.899 9.48 133.736 13.2 41.743 3.6 86.193 8.52 130.772 17.16 75.113 14.404 151.129 39.484 211.168 75.004 35.431 21.12 64.163 45.84 87.997 73.68 43.162 50.16 70.347 110.52 93.538 177.6 12.626 36.36 21.387 73.92 26.799 111.84"
          />
          <path
            stroke="#9D32FE"
            d="M-135.743-705.723c-44.455 60.48-61.072 140.04-50.124 213.96 5.8 38.76 19.332 75.96 41.489 108.36 22.548 33 52.177 58.44 81.812 85.92 9.277 8.64 18.94 16.8 28.603 24.84 37.62 30.96 74.34 59.28 97.274 105.36 20.872 42.24 30.02 89.4 23.835 133.56-1.546 10.92-4.123 21.6-7.602 32.04-9.663 29.04-26.282 55.8-34.27 86.28-5.154 19.44-4.381 38.28.515 56.16 13.657 49.2 59.008 88.32 106.035 110.04 6.442 3 13.013 5.64 19.454 7.92 32.211 11.4 66.869 17.88 102.685 22.08 43.549 5.16 88.901 6.96 133.092 11.28 41.486 4.08 86.066 10.56 130.772 20.52C613.07 329.28 688.57 355.92 747.708 392.28c35.173 21.72 63.389 46.92 86.709 75.12 42.13 50.76 68.285 111.24 91.476 178.32 12.497 36.36 21.516 73.8 27.314 111.48"
          />
          <path
            stroke="#A32BFF"
            d="M-147.082-700.32c-77.178 93.36-82.197 228.48-11.599 321.12 24.871 32.64 57.075 57.24 88.514 84 48.444 41.16 102.041 69.12 131.546 126.6C87.919-117 92.687-55.2 70.655-1.56 58.544 28.08 39.22 55.08 29.813 85.56c-24.866 81 61.714 148.32 136.312 169.92 76.016 22.08 158.989 17.76 238.74 26.76 110.416 12.36 246.471 48.6 339.493 108.24 97.79 62.76 138.761 151.2 174.578 255.72 12.498 36.24 21.516 73.56 27.701 111.24"
          />
        </g>
      </g>
      <defs>
        <clipPath id="a">
          <path fill="#fff" d="M600 0v700H0V0z" />
        </clipPath>
      </defs>
    </svg>
  ),
  folder: (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 24 24"
      strokeWidth={1.5}
      stroke="currentColor"
      height={"1em"}
      width={"1em"}
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M2.25 12.75V12A2.25 2.25 0 0 1 4.5 9.75h15A2.25 2.25 0 0 1 21.75 12v.75m-8.69-6.44-2.12-2.12a1.5 1.5 0 0 0-1.061-.44H4.5A2.25 2.25 0 0 0 2.25 6v12a2.25 2.25 0 0 0 2.25 2.25h15A2.25 2.25 0 0 0 21.75 18V9a2.25 2.25 0 0 0-2.25-2.25h-5.379a1.5 1.5 0 0 1-1.06-.44Z"
      />
    </svg>
  ),
  calendarDaysFilled: (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      height={20}
      width={20}
      viewBox="0 0 24 24"
      fill="currentColor"
      className="size-6"
    >
      <path d="M12.75 12.75a.75.75 0 1 1-1.5 0 .75.75 0 0 1 1.5 0ZM7.5 15.75a.75.75 0 1 0 0-1.5.75.75 0 0 0 0 1.5ZM8.25 17.25a.75.75 0 1 1-1.5 0 .75.75 0 0 1 1.5 0ZM9.75 15.75a.75.75 0 1 0 0-1.5.75.75 0 0 0 0 1.5ZM10.5 17.25a.75.75 0 1 1-1.5 0 .75.75 0 0 1 1.5 0ZM12 15.75a.75.75 0 1 0 0-1.5.75.75 0 0 0 0 1.5ZM12.75 17.25a.75.75 0 1 1-1.5 0 .75.75 0 0 1 1.5 0ZM14.25 15.75a.75.75 0 1 0 0-1.5.75.75 0 0 0 0 1.5ZM15 17.25a.75.75 0 1 1-1.5 0 .75.75 0 0 1 1.5 0ZM16.5 15.75a.75.75 0 1 0 0-1.5.75.75 0 0 0 0 1.5ZM15 12.75a.75.75 0 1 1-1.5 0 .75.75 0 0 1 1.5 0ZM16.5 13.5a.75.75 0 1 0 0-1.5.75.75 0 0 0 0 1.5Z" />
      <path
        fillRule="evenodd"
        d="M6.75 2.25A.75.75 0 0 1 7.5 3v1.5h9V3A.75.75 0 0 1 18 3v1.5h.75a3 3 0 0 1 3 3v11.25a3 3 0 0 1-3 3H5.25a3 3 0 0 1-3-3V7.5a3 3 0 0 1 3-3H6V3a.75.75 0 0 1 .75-.75Zm13.5 9a1.5 1.5 0 0 0-1.5-1.5H5.25a1.5 1.5 0 0 0-1.5 1.5v7.5a1.5 1.5 0 0 0 1.5 1.5h13.5a1.5 1.5 0 0 0 1.5-1.5v-7.5Z"
        clipRule="evenodd"
      />
    </svg>
  ),
  checkBadgeFilled: (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="currentColor"
      height={"1em"}
      width={"1em"}
      className="size-6"
    >
      <path
        fillRule="evenodd"
        d="M8.603 3.799A4.49 4.49 0 0 1 12 2.25c1.357 0 2.573.6 3.397 1.549a4.49 4.49 0 0 1 3.498 1.307 4.491 4.491 0 0 1 1.307 3.497A4.49 4.49 0 0 1 21.75 12a4.49 4.49 0 0 1-1.549 3.397 4.491 4.491 0 0 1-1.307 3.497 4.491 4.491 0 0 1-3.497 1.307A4.49 4.49 0 0 1 12 21.75a4.49 4.49 0 0 1-3.397-1.549 4.49 4.49 0 0 1-3.498-1.306 4.491 4.491 0 0 1-1.307-3.498A4.49 4.49 0 0 1 2.25 12c0-1.357.6-2.573 1.549-3.397a4.49 4.49 0 0 1 1.307-3.497 4.49 4.49 0 0 1 3.497-1.307Zm7.007 6.387a.75.75 0 1 0-1.22-.872l-3.236 4.53L9.53 12.22a.75.75 0 0 0-1.06 1.06l2.25 2.25a.75.75 0 0 0 1.14-.094l3.75-5.25Z"
        clipRule="evenodd"
      />
    </svg>
  ),
  clockFilled: (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="currentColor"
      height={20}
      width={20}
      className="size-6"
    >
      <path
        fillRule="evenodd"
        d="M12 2.25c-5.385 0-9.75 4.365-9.75 9.75s4.365 9.75 9.75 9.75 9.75-4.365 9.75-9.75S17.385 2.25 12 2.25ZM12.75 6a.75.75 0 0 0-1.5 0v6c0 .414.336.75.75.75h4.5a.75.75 0 0 0 0-1.5h-3.75V6Z"
        clipRule="evenodd"
      />
    </svg>
  ),
  bookOpenFilled: (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      height={20}
      width={20}
      fill="currentColor"
      className="size-6"
    >
      <path d="M11.25 4.533A9.707 9.707 0 0 0 6 3a9.735 9.735 0 0 0-3.25.555.75.75 0 0 0-.5.707v14.25a.75.75 0 0 0 1 .707A8.237 8.237 0 0 1 6 18.75c1.995 0 3.823.707 5.25 1.886V4.533ZM12.75 20.636A8.214 8.214 0 0 1 18 18.75c.966 0 1.89.166 2.75.47a.75.75 0 0 0 1-.708V4.262a.75.75 0 0 0-.5-.707A9.735 9.735 0 0 0 18 3a9.707 9.707 0 0 0-5.25 1.533v16.103Z" />
    </svg>
  ),
  chatBubbleFilled: (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      height={20}
      width={20}
      fill="currentColor"
      className="size-6"
    >
      <path d="M4.913 2.658c2.075-.27 4.19-.408 6.337-.408 2.147 0 4.262.139 6.337.408 1.922.25 3.291 1.861 3.405 3.727a4.403 4.403 0 0 0-1.032-.211 50.89 50.89 0 0 0-8.42 0c-2.358.196-4.04 2.19-4.04 4.434v4.286a4.47 4.47 0 0 0 2.433 3.984L7.28 21.53A.75.75 0 0 1 6 21v-4.03a48.527 48.527 0 0 1-1.087-.128C2.905 16.58 1.5 14.833 1.5 12.862V6.638c0-1.97 1.405-3.718 3.413-3.979Z" />
      <path d="M15.75 7.5c-1.376 0-2.739.057-4.086.169C10.124 7.797 9 9.103 9 10.609v4.285c0 1.507 1.128 2.814 2.67 2.94 1.243.102 2.5.157 3.768.165l2.782 2.781a.75.75 0 0 0 1.28-.53v-2.39l.33-.026c1.542-.125 2.67-1.433 2.67-2.94v-4.286c0-1.505-1.125-2.811-2.664-2.94A49.392 49.392 0 0 0 15.75 7.5Z" />
    </svg>
  ),
  playFilled: (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      height={20}
      width={20}
      fill="currentColor"
      className="size-6"
    >
      <path
        fillRule="evenodd"
        d="M2.25 12c0-5.385 4.365-9.75 9.75-9.75s9.75 4.365 9.75 9.75-4.365 9.75-9.75 9.75S2.25 17.385 2.25 12Zm14.024-.983a1.125 1.125 0 0 1 0 1.966l-5.603 3.113A1.125 1.125 0 0 1 9 15.113V8.887c0-.857.921-1.4 1.671-.983l5.603 3.113Z"
        clipRule="evenodd"
      />
    </svg>
  ),
  playBtn: (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 24 24"
      strokeWidth={1.5}
      stroke="currentColor"
      height={"1em"}
      width={"1em"}
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M5.25 5.653c0-.856.917-1.398 1.667-.986l11.54 6.347a1.125 1.125 0 0 1 0 1.972l-11.54 6.347a1.125 1.125 0 0 1-1.667-.986V5.653Z"
      />
    </svg>
  ),
  reactPlayBtn: (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 24 24"
      strokeWidth={1.5}
      stroke="currentColor"
      height={40}
      width={40}
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M5.25 5.653c0-.856.917-1.398 1.667-.986l11.54 6.347a1.125 1.125 0 0 1 0 1.972l-11.54 6.347a1.125 1.125 0 0 1-1.667-.986V5.653Z"
      />
    </svg>
  ),
  file: (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 24 24"
      strokeWidth={1.5}
      stroke="currentColor"
      height={"1em"}
      width={"1em"}
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M19.5 14.25v-2.625a3.375 3.375 0 0 0-3.375-3.375h-1.5A1.125 1.125 0 0 1 13.5 7.125v-1.5a3.375 3.375 0 0 0-3.375-3.375H8.25m2.25 0H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 0 0-9-9Z"
      />
    </svg>
  ),
  chevronDown: (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 24 24"
      strokeWidth={1.5}
      stroke="currentColor"
      height={20}
      width={20}
    >
      <path strokeLinecap="round" strokeLinejoin="round" d="m19.5 8.25-7.5 7.5-7.5-7.5" />
    </svg>
  ),
  chevronDownOutline: (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 24 24"
      strokeWidth={1.5}
      stroke="currentColor"
      height={"1em"}
      width={"1em"}
    >
      <path strokeLinecap="round" strokeLinejoin="round" d="m19.5 8.25-7.5 7.5-7.5-7.5" />
    </svg>
  ),
  barsArrowDown: (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 24 24"
      strokeWidth={1.5}
      stroke="currentColor"
      height={20}
      width={20}
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M3 4.5h14.25M3 9h9.75M3 13.5h9.75m4.5-4.5v12m0 0-3.75-3.75M17.25 21 21 17.25"
      />
    </svg>
  ),
  plusBtn: (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 24 24"
      strokeWidth={1.5}
      stroke="currentColor"
      height={"1em"}
      width={"1em"}
    >
      <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
    </svg>
  ),
  camera: (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="1em" height="1em" fill="currentColor">
      <path d="M12 9a3.75 3.75 0 1 0 0 7.5A3.75 3.75 0 0 0 12 9Z" />
      <path
        fillRule="evenodd"
        d="M9.344 3.071a49.52 49.52 0 0 1 5.312 0c.967.052 1.83.585 2.332 1.39l.821 1.317c.24.383.645.643 1.11.71.386.054.77.113 1.152.177 1.432.239 2.429 1.493 2.429 2.909V18a3 3 0 0 1-3 3h-15a3 3 0 0 1-3-3V9.574c0-1.416.997-2.67 2.429-2.909.382-.064.766-.123 1.151-.178a1.56 1.56 0 0 0 1.11-.71l.822-1.315a2.942 2.942 0 0 1 2.332-1.39ZM6.75 12.75a5.25 5.25 0 1 1 10.5 0 5.25 5.25 0 0 1-10.5 0Zm12-1.5a.75.75 0 1 0 0-1.5.75.75 0 0 0 0 1.5Z"
        clipRule="evenodd"
      />
    </svg>
  ),
  cameraOutlined: (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 24 24"
      strokeWidth={1.5}
      width="1em"
      height="1em"
      stroke="currentColor"
      className="size-6"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M6.827 6.175A2.31 2.31 0 0 1 5.186 7.23c-.38.054-.757.112-1.134.175C2.999 7.58 2.25 8.507 2.25 9.574V18a2.25 2.25 0 0 0 2.25 2.25h15A2.25 2.25 0 0 0 21.75 18V9.574c0-1.067-.75-1.994-1.802-2.169a47.865 47.865 0 0 0-1.134-.175 2.31 2.31 0 0 1-1.64-1.055l-.822-1.316a2.192 2.192 0 0 0-1.736-1.039 48.774 48.774 0 0 0-5.232 0 2.192 2.192 0 0 0-1.736 1.039l-.821 1.316Z"
      />
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M16.5 12.75a4.5 4.5 0 1 1-9 0 4.5 4.5 0 0 1 9 0ZM18.75 10.5h.008v.008h-.008V10.5Z"
      />
    </svg>
  ),
  code: (
    <svg
      width="1em"
      height="1em"
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="currentColor"
      className="size-6"
    >
      <path
        fillRule="evenodd"
        d="M3 6a3 3 0 0 1 3-3h12a3 3 0 0 1 3 3v12a3 3 0 0 1-3 3H6a3 3 0 0 1-3-3V6Zm14.25 6a.75.75 0 0 1-.22.53l-2.25 2.25a.75.75 0 1 1-1.06-1.06L15.44 12l-1.72-1.72a.75.75 0 1 1 1.06-1.06l2.25 2.25c.141.14.22.331.22.53Zm-10.28-.53a.75.75 0 0 0 0 1.06l2.25 2.25a.75.75 0 1 0 1.06-1.06L8.56 12l1.72-1.72a.75.75 0 1 0-1.06-1.06l-2.25 2.25Z"
        clipRule="evenodd"
      />
    </svg>
  ),
  verticalAdjustment: (
    <svg
      width="1em"
      height="1em"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M16 17C17.1046 17 18 17.8954 18 19C18 20.1046 17.1046 21 16 21C14.8954 21 14 20.1046 14 19C14 17.8954 14.8954 17 16 17ZM8 17C9.10457 17 10 17.8954 10 19C10 20.1046 9.10457 21 8 21C6.89543 21 6 20.1046 6 19C6 17.8954 6.89543 17 8 17ZM16 10C17.1046 10 18 10.8954 18 12C18 13.1046 17.1046 14 16 14C14.8954 14 14 13.1046 14 12C14 10.8954 14.8954 10 16 10ZM8 10C9.10457 10 10 10.8954 10 12C10 13.1046 9.10457 14 8 14C6.89543 14 6 13.1046 6 12C6 10.8954 6.89543 10 8 10ZM16 3C17.1046 3 18 3.89543 18 5C18 6.10457 17.1046 7 16 7C14.8954 7 14 6.10457 14 5C14 3.89543 14.8954 3 16 3ZM8 3C9.10457 3 10 3.89543 10 5C10 6.10457 9.10457 7 8 7C6.89543 7 6 6.10457 6 5C6 3.89543 6.89543 3 8 3Z"
        fill="currentColor"
      />
    </svg>
  ),
  CodeOutlined: (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      height={"1em"}
      width={"1em"}
      fill="none"
      viewBox="0 0 24 24"
      strokeWidth={1.5}
      stroke="currentColor"
      className="size-6"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M14.25 9.75 16.5 12l-2.25 2.25m-4.5 0L7.5 12l2.25-2.25M6 20.25h12A2.25 2.25 0 0 0 20.25 18V6A2.25 2.25 0 0 0 18 3.75H6A2.25 2.25 0 0 0 3.75 6v12A2.25 2.25 0 0 0 6 20.25Z"
      />
    </svg>
  ),
  video: (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="currentColor"
      height={20}
      width={20}
      className="w-6 h-6"
    >
      <path d="M4.5 4.5a3 3 0 0 0-3 3v9a3 3 0 0 0 3 3h8.25a3 3 0 0 0 3-3v-9a3 3 0 0 0-3-3H4.5ZM19.94 18.75l-2.69-2.69V7.94l2.69-2.69c.944-.945 2.56-.276 2.56 1.06v11.38c0 1.336-1.616 2.005-2.56 1.06Z" />
    </svg>
  ),

  carretLeft: (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      height={20}
      width={20}
      viewBox="0 0 24 24"
      strokeWidth={1.5}
      stroke="currentColor"
      className="w-6 h-6"
    >
      <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5 8.25 12l7.5-7.5" />
    </svg>
  ),
  carretRight: (
    <svg
      height={20}
      width={20}
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 24 24"
      strokeWidth={1.5}
      stroke="currentColor"
      className="w-6 h-6"
    >
      <path strokeLinecap="round" strokeLinejoin="round" d="m8.25 4.5 7.5 7.5-7.5 7.5" />
    </svg>
  ),
  check: (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" height={"1em"} width={"1em"}>
      <path
        fillRule="evenodd"
        d="M2.25 12c0-5.385 4.365-9.75 9.75-9.75s9.75 4.365 9.75 9.75-4.365 9.75-9.75 9.75S2.25 17.385 2.25 12Zm13.36-1.814a.75.75 0 1 0-1.22-.872l-3.236 4.53L9.53 12.22a.75.75 0 0 0-1.06 1.06l2.25 2.25a.75.75 0 0 0 1.14-.094l3.75-5.25Z"
        clipRule="evenodd"
      />
    </svg>
  ),
  checkFilled: (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" height={"1em"} width={"1em"}>
      <path
        fillRule="evenodd"
        d="M2.25 12c0-5.385 4.365-9.75 9.75-9.75s9.75 4.365 9.75 9.75-4.365 9.75-9.75 9.75S2.25 17.385 2.25 12Zm13.36-1.814a.75.75 0 1 0-1.22-.872l-3.236 4.53L9.53 12.22a.75.75 0 0 0-1.06 1.06l2.25 2.25a.75.75 0 0 0 1.14-.094l3.75-5.25Z"
        clipRule="evenodd"
      />
    </svg>
  ),
  boxEdit: (
    <svg
      height={"1em"}
      width={"1em"}
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="currentColor"
      className="size-6"
    >
      <path d="M21.731 2.269a2.625 2.625 0 0 0-3.712 0l-1.157 1.157 3.712 3.712 1.157-1.157a2.625 2.625 0 0 0 0-3.712ZM19.513 8.199l-3.712-3.712-8.4 8.4a5.25 5.25 0 0 0-1.32 2.214l-.8 2.685a.75.75 0 0 0 .933.933l2.685-.8a5.25 5.25 0 0 0 2.214-1.32l8.4-8.4Z" />
      <path d="M5.25 5.25a3 3 0 0 0-3 3v10.5a3 3 0 0 0 3 3h10.5a3 3 0 0 0 3-3V13.5a.75.75 0 0 0-1.5 0v5.25a1.5 1.5 0 0 1-1.5 1.5H5.25a1.5 1.5 0 0 1-1.5-1.5V8.25a1.5 1.5 0 0 1 1.5-1.5h5.25a.75.75 0 0 0 0-1.5H5.25Z" />
    </svg>
  ),
  edit: (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" height={15} width={15}>
      <path d="M21.731 2.269a2.625 2.625 0 0 0-3.712 0l-1.157 1.157 3.712 3.712 1.157-1.157a2.625 2.625 0 0 0 0-3.712ZM19.513 8.199l-3.712-3.712-12.15 12.15a5.25 5.25 0 0 0-1.32 2.214l-.8 2.685a.75.75 0 0 0 .933.933l2.685-.8a5.25 5.25 0 0 0 2.214-1.32L19.513 8.2Z" />
    </svg>
  ),
  delete: (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" height={15} width={15}>
      <path
        fillRule="evenodd"
        d="M16.5 4.478v.227a48.816 48.816 0 0 1 3.878.512.75.75 0 1 1-.256 1.478l-.209-.035-1.005 13.07a3 3 0 0 1-2.991 2.77H8.084a3 3 0 0 1-2.991-2.77L4.087 6.66l-.209.035a.75.75 0 0 1-.256-1.478A48.567 48.567 0 0 1 7.5 4.705v-.227c0-1.564 1.213-2.9 2.816-2.951a52.662 52.662 0 0 1 3.369 0c1.603.051 2.815 1.387 2.815 2.951Zm-6.136-1.452a51.196 51.196 0 0 1 3.273 0C14.39 3.05 15 3.684 15 4.478v.113a49.488 49.488 0 0 0-6 0v-.113c0-.794.609-1.428 1.364-1.452Zm-.355 5.945a.75.75 0 1 0-1.5.058l.347 9a.75.75 0 1 0 1.499-.058l-.346-9Zm5.48.058a.75.75 0 1 0-1.498-.058l-.347 9a.75.75 0 0 0 1.5.058l.345-9Z"
        clipRule="evenodd"
      />
    </svg>
  ),
  barUpIcon: (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 24 24"
      strokeWidth={1.5}
      stroke="currentColor"
      height={20}
      width={20}
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M3 4.5h14.25M3 9h9.75M3 13.5h5.25m5.25-.75L17.25 9m0 0L21 12.75M17.25 9v12"
      />
    </svg>
  ),
  lock: (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" height={"1em"} width={"1em"}>
      <path
        fillRule="evenodd"
        d="M12 1.5a5.25 5.25 0 0 0-5.25 5.25v3a3 3 0 0 0-3 3v6.75a3 3 0 0 0 3 3h10.5a3 3 0 0 0 3-3v-6.75a3 3 0 0 0-3-3v-3c0-2.9-2.35-5.25-5.25-5.25Zm3.75 8.25v-3a3.75 3.75 0 1 0-7.5 0v3h7.5Z"
        clipRule="evenodd"
      />
    </svg>
  ),
  expired: (
    <svg
      height={"1em"}
      width={"1em"}
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="currentColor"
      className="size-6"
    >
      <path
        fillRule="evenodd"
        d="M9.401 3.003c1.155-2 4.043-2 5.197 0l7.355 12.748c1.154 2-.29 4.5-2.599 4.5H4.645c-2.309 0-3.752-2.5-2.598-4.5L9.4 3.003ZM12 8.25a.75.75 0 0 1 .75.75v3.75a.75.75 0 0 1-1.5 0V9a.75.75 0 0 1 .75-.75Zm0 8.25a.75.75 0 1 0 0-1.5.75.75 0 0 0 0 1.5Z"
        clipRule="evenodd"
      />
    </svg>
  ),
  outlinedLock: (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 24 24"
      strokeWidth={1.5}
      stroke="currentColor"
      height={20}
      width={20}
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M16.5 10.5V6.75a4.5 4.5 0 1 0-9 0v3.75m-.75 11.25h10.5a2.25 2.25 0 0 0 2.25-2.25v-6.75a2.25 2.25 0 0 0-2.25-2.25H6.75a2.25 2.25 0 0 0-2.25 2.25v6.75a2.25 2.25 0 0 0 2.25 2.25Z"
      />
    </svg>
  ),
  dotPattern: (
    <svg width="366" height="119" viewBox="0 0 366 119" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path
        d="M2.99766 118.39C4.32314 118.39 5.39766 117.291 5.39766 115.935C5.39766 114.579 4.32314 113.48 2.99766 113.48C1.67217 113.48 0.597656 114.579 0.597656 115.935C0.597656 117.291 1.67217 118.39 2.99766 118.39Z"
        fill="url(#paint0_linear_2875_344)"
      />
      <path
        d="M2.99766 90.1555C4.32314 90.1555 5.39766 89.0563 5.39766 87.7003C5.39766 86.3444 4.32314 85.2452 2.99766 85.2452C1.67217 85.2452 0.597656 86.3444 0.597656 87.7003C0.597656 89.0563 1.67217 90.1555 2.99766 90.1555Z"
        fill="url(#paint1_linear_2875_344)"
      />
      <path
        d="M2.99766 61.9211C4.32314 61.9211 5.39766 60.8219 5.39766 59.466C5.39766 58.11 4.32314 57.0108 2.99766 57.0108C1.67217 57.0108 0.597656 58.11 0.597656 59.466C0.597656 60.8219 1.67217 61.9211 2.99766 61.9211Z"
        fill="url(#paint2_linear_2875_344)"
      />
      <path
        d="M2.99766 33.6868C4.32314 33.6868 5.39766 32.5875 5.39766 31.2316C5.39766 29.8756 4.32314 28.7764 2.99766 28.7764C1.67217 28.7764 0.597656 29.8756 0.597656 31.2316C0.597656 32.5875 1.67217 33.6868 2.99766 33.6868Z"
        fill="url(#paint3_linear_2875_344)"
      />
      <path
        d="M2.99766 5.45232C4.32314 5.45232 5.39766 4.3531 5.39766 2.99716C5.39766 1.64121 4.32314 0.541992 2.99766 0.541992C1.67217 0.541992 0.597656 1.64121 0.597656 2.99716C0.597656 4.3531 1.67217 5.45232 2.99766 5.45232Z"
        fill="url(#paint4_linear_2875_344)"
      />
      <path
        d="M33.0016 118.39C34.327 118.39 35.4016 117.291 35.4016 115.935C35.4016 114.579 34.327 113.48 33.0016 113.48C31.6761 113.48 30.6016 114.579 30.6016 115.935C30.6016 117.291 31.6761 118.39 33.0016 118.39Z"
        fill="url(#paint5_linear_2875_344)"
      />
      <path
        d="M33.0016 90.1555C34.327 90.1555 35.4016 89.0563 35.4016 87.7003C35.4016 86.3444 34.327 85.2452 33.0016 85.2452C31.6761 85.2452 30.6016 86.3444 30.6016 87.7003C30.6016 89.0563 31.6761 90.1555 33.0016 90.1555Z"
        fill="url(#paint6_linear_2875_344)"
      />
      <path
        d="M33.0016 61.9211C34.327 61.9211 35.4016 60.8219 35.4016 59.466C35.4016 58.11 34.327 57.0108 33.0016 57.0108C31.6761 57.0108 30.6016 58.11 30.6016 59.466C30.6016 60.8219 31.6761 61.9211 33.0016 61.9211Z"
        fill="url(#paint7_linear_2875_344)"
      />
      <path
        d="M33.0016 33.6868C34.327 33.6868 35.4016 32.5875 35.4016 31.2316C35.4016 29.8756 34.327 28.7764 33.0016 28.7764C31.6761 28.7764 30.6016 29.8756 30.6016 31.2316C30.6016 32.5875 31.6761 33.6868 33.0016 33.6868Z"
        fill="url(#paint8_linear_2875_344)"
      />
      <path
        d="M33.0016 5.45232C34.327 5.45232 35.4016 4.3531 35.4016 2.99716C35.4016 1.64121 34.327 0.541992 33.0016 0.541992C31.6761 0.541992 30.6016 1.64121 30.6016 2.99716C30.6016 4.3531 31.6761 5.45232 33.0016 5.45232Z"
        fill="url(#paint9_linear_2875_344)"
      />
      <path
        d="M62.9977 118.39C64.3231 118.39 65.3977 117.291 65.3977 115.935C65.3977 114.579 64.3231 113.48 62.9977 113.48C61.6722 113.48 60.5977 114.579 60.5977 115.935C60.5977 117.291 61.6722 118.39 62.9977 118.39Z"
        fill="url(#paint10_linear_2875_344)"
      />
      <path
        d="M62.9977 90.1555C64.3231 90.1555 65.3977 89.0563 65.3977 87.7003C65.3977 86.3444 64.3231 85.2452 62.9977 85.2452C61.6722 85.2452 60.5977 86.3444 60.5977 87.7003C60.5977 89.0563 61.6722 90.1555 62.9977 90.1555Z"
        fill="url(#paint11_linear_2875_344)"
      />
      <path
        d="M62.9977 61.9211C64.3231 61.9211 65.3977 60.8219 65.3977 59.466C65.3977 58.11 64.3231 57.0108 62.9977 57.0108C61.6722 57.0108 60.5977 58.11 60.5977 59.466C60.5977 60.8219 61.6722 61.9211 62.9977 61.9211Z"
        fill="url(#paint12_linear_2875_344)"
      />
      <path
        d="M62.9977 33.6868C64.3231 33.6868 65.3977 32.5875 65.3977 31.2316C65.3977 29.8756 64.3231 28.7764 62.9977 28.7764C61.6722 28.7764 60.5977 29.8756 60.5977 31.2316C60.5977 32.5875 61.6722 33.6868 62.9977 33.6868Z"
        fill="url(#paint13_linear_2875_344)"
      />
      <path
        d="M62.9977 5.45232C64.3231 5.45232 65.3977 4.3531 65.3977 2.99716C65.3977 1.64121 64.3231 0.541992 62.9977 0.541992C61.6722 0.541992 60.5977 1.64121 60.5977 2.99716C60.5977 4.3531 61.6722 5.45232 62.9977 5.45232Z"
        fill="url(#paint14_linear_2875_344)"
      />
      <path
        d="M92.9977 118.39C94.3231 118.39 95.3977 117.291 95.3977 115.935C95.3977 114.579 94.3231 113.48 92.9977 113.48C91.6722 113.48 90.5977 114.579 90.5977 115.935C90.5977 117.291 91.6722 118.39 92.9977 118.39Z"
        fill="url(#paint15_linear_2875_344)"
      />
      <path
        d="M92.9977 90.1555C94.3231 90.1555 95.3977 89.0563 95.3977 87.7003C95.3977 86.3444 94.3231 85.2452 92.9977 85.2452C91.6722 85.2452 90.5977 86.3444 90.5977 87.7003C90.5977 89.0563 91.6722 90.1555 92.9977 90.1555Z"
        fill="url(#paint16_linear_2875_344)"
      />
      <path
        d="M92.9977 61.9211C94.3231 61.9211 95.3977 60.8219 95.3977 59.466C95.3977 58.11 94.3231 57.0108 92.9977 57.0108C91.6722 57.0108 90.5977 58.11 90.5977 59.466C90.5977 60.8219 91.6722 61.9211 92.9977 61.9211Z"
        fill="url(#paint17_linear_2875_344)"
      />
      <path
        d="M92.9977 33.6868C94.3231 33.6868 95.3977 32.5875 95.3977 31.2316C95.3977 29.8756 94.3231 28.7764 92.9977 28.7764C91.6722 28.7764 90.5977 29.8756 90.5977 31.2316C90.5977 32.5875 91.6722 33.6868 92.9977 33.6868Z"
        fill="url(#paint18_linear_2875_344)"
      />
      <path
        d="M92.9977 5.45232C94.3231 5.45232 95.3977 4.3531 95.3977 2.99716C95.3977 1.64121 94.3231 0.541992 92.9977 0.541992C91.6722 0.541992 90.5977 1.64121 90.5977 2.99716C90.5977 4.3531 91.6722 5.45232 92.9977 5.45232Z"
        fill="url(#paint19_linear_2875_344)"
      />
      <path
        d="M123.002 118.39C124.327 118.39 125.402 117.291 125.402 115.935C125.402 114.579 124.327 113.48 123.002 113.48C121.676 113.48 120.602 114.579 120.602 115.935C120.602 117.291 121.676 118.39 123.002 118.39Z"
        fill="url(#paint20_linear_2875_344)"
      />
      <path
        d="M123.002 90.1555C124.327 90.1555 125.402 89.0563 125.402 87.7003C125.402 86.3444 124.327 85.2452 123.002 85.2452C121.676 85.2452 120.602 86.3444 120.602 87.7003C120.602 89.0563 121.676 90.1555 123.002 90.1555Z"
        fill="url(#paint21_linear_2875_344)"
      />
      <path
        d="M123.002 61.9211C124.327 61.9211 125.402 60.8219 125.402 59.466C125.402 58.11 124.327 57.0108 123.002 57.0108C121.676 57.0108 120.602 58.11 120.602 59.466C120.602 60.8219 121.676 61.9211 123.002 61.9211Z"
        fill="url(#paint22_linear_2875_344)"
      />
      <path
        d="M123.002 33.6868C124.327 33.6868 125.402 32.5875 125.402 31.2316C125.402 29.8756 124.327 28.7764 123.002 28.7764C121.676 28.7764 120.602 29.8756 120.602 31.2316C120.602 32.5875 121.676 33.6868 123.002 33.6868Z"
        fill="url(#paint23_linear_2875_344)"
      />
      <path
        d="M123.002 5.45232C124.327 5.45232 125.402 4.3531 125.402 2.99716C125.402 1.64121 124.327 0.541992 123.002 0.541992C121.676 0.541992 120.602 1.64121 120.602 2.99716C120.602 4.3531 121.676 5.45232 123.002 5.45232Z"
        fill="url(#paint24_linear_2875_344)"
      />
      <path
        d="M152.998 118.39C154.323 118.39 155.398 117.291 155.398 115.935C155.398 114.579 154.323 113.48 152.998 113.48C151.672 113.48 150.598 114.579 150.598 115.935C150.598 117.291 151.672 118.39 152.998 118.39Z"
        fill="url(#paint25_linear_2875_344)"
      />
      <path
        d="M152.998 90.1555C154.323 90.1555 155.398 89.0563 155.398 87.7003C155.398 86.3444 154.323 85.2452 152.998 85.2452C151.672 85.2452 150.598 86.3444 150.598 87.7003C150.598 89.0563 151.672 90.1555 152.998 90.1555Z"
        fill="url(#paint26_linear_2875_344)"
      />
      <path
        d="M152.998 61.9211C154.323 61.9211 155.398 60.8219 155.398 59.466C155.398 58.11 154.323 57.0108 152.998 57.0108C151.672 57.0108 150.598 58.11 150.598 59.466C150.598 60.8219 151.672 61.9211 152.998 61.9211Z"
        fill="url(#paint27_linear_2875_344)"
      />
      <path
        d="M152.998 33.6868C154.323 33.6868 155.398 32.5875 155.398 31.2316C155.398 29.8756 154.323 28.7764 152.998 28.7764C151.672 28.7764 150.598 29.8756 150.598 31.2316C150.598 32.5875 151.672 33.6868 152.998 33.6868Z"
        fill="url(#paint28_linear_2875_344)"
      />
      <path
        d="M152.998 5.45232C154.323 5.45232 155.398 4.3531 155.398 2.99716C155.398 1.64121 154.323 0.541992 152.998 0.541992C151.672 0.541992 150.598 1.64121 150.598 2.99716C150.598 4.3531 151.672 5.45232 152.998 5.45232Z"
        fill="url(#paint29_linear_2875_344)"
      />
      <path
        d="M182.998 118.39C184.323 118.39 185.398 117.291 185.398 115.935C185.398 114.579 184.323 113.48 182.998 113.48C181.672 113.48 180.598 114.579 180.598 115.935C180.598 117.291 181.672 118.39 182.998 118.39Z"
        fill="url(#paint30_linear_2875_344)"
      />
      <path
        d="M182.998 90.1555C184.323 90.1555 185.398 89.0563 185.398 87.7003C185.398 86.3444 184.323 85.2452 182.998 85.2452C181.672 85.2452 180.598 86.3444 180.598 87.7003C180.598 89.0563 181.672 90.1555 182.998 90.1555Z"
        fill="url(#paint31_linear_2875_344)"
      />
      <path
        d="M182.998 61.9211C184.323 61.9211 185.398 60.8219 185.398 59.466C185.398 58.11 184.323 57.0108 182.998 57.0108C181.672 57.0108 180.598 58.11 180.598 59.466C180.598 60.8219 181.672 61.9211 182.998 61.9211Z"
        fill="url(#paint32_linear_2875_344)"
      />
      <path
        d="M182.998 33.6868C184.323 33.6868 185.398 32.5875 185.398 31.2316C185.398 29.8756 184.323 28.7764 182.998 28.7764C181.672 28.7764 180.598 29.8756 180.598 31.2316C180.598 32.5875 181.672 33.6868 182.998 33.6868Z"
        fill="url(#paint33_linear_2875_344)"
      />
      <path
        d="M182.998 5.45232C184.323 5.45232 185.398 4.3531 185.398 2.99716C185.398 1.64121 184.323 0.541992 182.998 0.541992C181.672 0.541992 180.598 1.64121 180.598 2.99716C180.598 4.3531 181.672 5.45232 182.998 5.45232Z"
        fill="url(#paint34_linear_2875_344)"
      />
      <path
        d="M213.002 118.39C214.327 118.39 215.402 117.291 215.402 115.935C215.402 114.579 214.327 113.48 213.002 113.48C211.676 113.48 210.602 114.579 210.602 115.935C210.602 117.291 211.676 118.39 213.002 118.39Z"
        fill="url(#paint35_linear_2875_344)"
      />
      <path
        d="M213.002 90.1555C214.327 90.1555 215.402 89.0563 215.402 87.7003C215.402 86.3444 214.327 85.2452 213.002 85.2452C211.676 85.2452 210.602 86.3444 210.602 87.7003C210.602 89.0563 211.676 90.1555 213.002 90.1555Z"
        fill="url(#paint36_linear_2875_344)"
      />
      <path
        d="M213.002 61.9211C214.327 61.9211 215.402 60.8219 215.402 59.466C215.402 58.11 214.327 57.0108 213.002 57.0108C211.676 57.0108 210.602 58.11 210.602 59.466C210.602 60.8219 211.676 61.9211 213.002 61.9211Z"
        fill="url(#paint37_linear_2875_344)"
      />
      <path
        d="M213.002 33.6868C214.327 33.6868 215.402 32.5875 215.402 31.2316C215.402 29.8756 214.327 28.7764 213.002 28.7764C211.676 28.7764 210.602 29.8756 210.602 31.2316C210.602 32.5875 211.676 33.6868 213.002 33.6868Z"
        fill="url(#paint38_linear_2875_344)"
      />
      <path
        d="M213.002 5.45232C214.327 5.45232 215.402 4.3531 215.402 2.99716C215.402 1.64121 214.327 0.541992 213.002 0.541992C211.676 0.541992 210.602 1.64121 210.602 2.99716C210.602 4.3531 211.676 5.45232 213.002 5.45232Z"
        fill="url(#paint39_linear_2875_344)"
      />
      <path
        d="M242.998 118.39C244.323 118.39 245.398 117.291 245.398 115.935C245.398 114.579 244.323 113.48 242.998 113.48C241.672 113.48 240.598 114.579 240.598 115.935C240.598 117.291 241.672 118.39 242.998 118.39Z"
        fill="url(#paint40_linear_2875_344)"
      />
      <path
        d="M242.998 90.1555C244.323 90.1555 245.398 89.0563 245.398 87.7003C245.398 86.3444 244.323 85.2452 242.998 85.2452C241.672 85.2452 240.598 86.3444 240.598 87.7003C240.598 89.0563 241.672 90.1555 242.998 90.1555Z"
        fill="url(#paint41_linear_2875_344)"
      />
      <path
        d="M242.998 61.9211C244.323 61.9211 245.398 60.8219 245.398 59.466C245.398 58.11 244.323 57.0108 242.998 57.0108C241.672 57.0108 240.598 58.11 240.598 59.466C240.598 60.8219 241.672 61.9211 242.998 61.9211Z"
        fill="url(#paint42_linear_2875_344)"
      />
      <path
        d="M242.998 33.6868C244.323 33.6868 245.398 32.5875 245.398 31.2316C245.398 29.8756 244.323 28.7764 242.998 28.7764C241.672 28.7764 240.598 29.8756 240.598 31.2316C240.598 32.5875 241.672 33.6868 242.998 33.6868Z"
        fill="url(#paint43_linear_2875_344)"
      />
      <path
        d="M242.998 5.45232C244.323 5.45232 245.398 4.3531 245.398 2.99716C245.398 1.64121 244.323 0.541992 242.998 0.541992C241.672 0.541992 240.598 1.64121 240.598 2.99716C240.598 4.3531 241.672 5.45232 242.998 5.45232Z"
        fill="url(#paint44_linear_2875_344)"
      />
      <path
        d="M272.998 118.39C274.323 118.39 275.398 117.291 275.398 115.935C275.398 114.579 274.323 113.48 272.998 113.48C271.672 113.48 270.598 114.579 270.598 115.935C270.598 117.291 271.672 118.39 272.998 118.39Z"
        fill="url(#paint45_linear_2875_344)"
      />
      <path
        d="M272.998 90.1555C274.323 90.1555 275.398 89.0563 275.398 87.7003C275.398 86.3444 274.323 85.2452 272.998 85.2452C271.672 85.2452 270.598 86.3444 270.598 87.7003C270.598 89.0563 271.672 90.1555 272.998 90.1555Z"
        fill="url(#paint46_linear_2875_344)"
      />
      <path
        d="M272.998 61.9211C274.323 61.9211 275.398 60.8219 275.398 59.466C275.398 58.11 274.323 57.0108 272.998 57.0108C271.672 57.0108 270.598 58.11 270.598 59.466C270.598 60.8219 271.672 61.9211 272.998 61.9211Z"
        fill="url(#paint47_linear_2875_344)"
      />
      <path
        d="M272.998 33.6868C274.323 33.6868 275.398 32.5875 275.398 31.2316C275.398 29.8756 274.323 28.7764 272.998 28.7764C271.672 28.7764 270.598 29.8756 270.598 31.2316C270.598 32.5875 271.672 33.6868 272.998 33.6868Z"
        fill="url(#paint48_linear_2875_344)"
      />
      <path
        d="M272.998 5.45232C274.323 5.45232 275.398 4.3531 275.398 2.99716C275.398 1.64121 274.323 0.541992 272.998 0.541992C271.672 0.541992 270.598 1.64121 270.598 2.99716C270.598 4.3531 271.672 5.45232 272.998 5.45232Z"
        fill="url(#paint49_linear_2875_344)"
      />
      <path
        d="M303.002 118.39C304.327 118.39 305.402 117.291 305.402 115.935C305.402 114.579 304.327 113.48 303.002 113.48C301.676 113.48 300.602 114.579 300.602 115.935C300.602 117.291 301.676 118.39 303.002 118.39Z"
        fill="url(#paint50_linear_2875_344)"
      />
      <path
        d="M303.002 90.1555C304.327 90.1555 305.402 89.0563 305.402 87.7003C305.402 86.3444 304.327 85.2452 303.002 85.2452C301.676 85.2452 300.602 86.3444 300.602 87.7003C300.602 89.0563 301.676 90.1555 303.002 90.1555Z"
        fill="url(#paint51_linear_2875_344)"
      />
      <path
        d="M303.002 61.9211C304.327 61.9211 305.402 60.8219 305.402 59.466C305.402 58.11 304.327 57.0108 303.002 57.0108C301.676 57.0108 300.602 58.11 300.602 59.466C300.602 60.8219 301.676 61.9211 303.002 61.9211Z"
        fill="url(#paint52_linear_2875_344)"
      />
      <path
        d="M303.002 33.6868C304.327 33.6868 305.402 32.5875 305.402 31.2316C305.402 29.8756 304.327 28.7764 303.002 28.7764C301.676 28.7764 300.602 29.8756 300.602 31.2316C300.602 32.5875 301.676 33.6868 303.002 33.6868Z"
        fill="url(#paint53_linear_2875_344)"
      />
      <path
        d="M303.002 5.45232C304.327 5.45232 305.402 4.3531 305.402 2.99716C305.402 1.64121 304.327 0.541992 303.002 0.541992C301.676 0.541992 300.602 1.64121 300.602 2.99716C300.602 4.3531 301.676 5.45232 303.002 5.45232Z"
        fill="url(#paint54_linear_2875_344)"
      />
      <path
        d="M332.998 118.39C334.323 118.39 335.398 117.291 335.398 115.935C335.398 114.579 334.323 113.48 332.998 113.48C331.672 113.48 330.598 114.579 330.598 115.935C330.598 117.291 331.672 118.39 332.998 118.39Z"
        fill="url(#paint55_linear_2875_344)"
      />
      <path
        d="M332.998 90.1555C334.323 90.1555 335.398 89.0563 335.398 87.7003C335.398 86.3444 334.323 85.2452 332.998 85.2452C331.672 85.2452 330.598 86.3444 330.598 87.7003C330.598 89.0563 331.672 90.1555 332.998 90.1555Z"
        fill="url(#paint56_linear_2875_344)"
      />
      <path
        d="M332.998 61.9211C334.323 61.9211 335.398 60.8219 335.398 59.466C335.398 58.11 334.323 57.0108 332.998 57.0108C331.672 57.0108 330.598 58.11 330.598 59.466C330.598 60.8219 331.672 61.9211 332.998 61.9211Z"
        fill="url(#paint57_linear_2875_344)"
      />
      <path
        d="M332.998 33.6868C334.323 33.6868 335.398 32.5875 335.398 31.2316C335.398 29.8756 334.323 28.7764 332.998 28.7764C331.672 28.7764 330.598 29.8756 330.598 31.2316C330.598 32.5875 331.672 33.6868 332.998 33.6868Z"
        fill="url(#paint58_linear_2875_344)"
      />
      <path
        d="M332.998 5.45232C334.323 5.45232 335.398 4.3531 335.398 2.99716C335.398 1.64121 334.323 0.541992 332.998 0.541992C331.672 0.541992 330.598 1.64121 330.598 2.99716C330.598 4.3531 331.672 5.45232 332.998 5.45232Z"
        fill="url(#paint59_linear_2875_344)"
      />
      <path
        d="M362.998 118.39C364.323 118.39 365.398 117.291 365.398 115.935C365.398 114.579 364.323 113.48 362.998 113.48C361.672 113.48 360.598 114.579 360.598 115.935C360.598 117.291 361.672 118.39 362.998 118.39Z"
        fill="url(#paint60_linear_2875_344)"
      />
      <path
        d="M362.998 90.1555C364.323 90.1555 365.398 89.0563 365.398 87.7003C365.398 86.3444 364.323 85.2452 362.998 85.2452C361.672 85.2452 360.598 86.3444 360.598 87.7003C360.598 89.0563 361.672 90.1555 362.998 90.1555Z"
        fill="url(#paint61_linear_2875_344)"
      />
      <path
        d="M362.998 61.9211C364.323 61.9211 365.398 60.8219 365.398 59.466C365.398 58.11 364.323 57.0108 362.998 57.0108C361.672 57.0108 360.598 58.11 360.598 59.466C360.598 60.8219 361.672 61.9211 362.998 61.9211Z"
        fill="url(#paint62_linear_2875_344)"
      />
      <path
        d="M362.998 33.6868C364.323 33.6868 365.398 32.5875 365.398 31.2316C365.398 29.8756 364.323 28.7764 362.998 28.7764C361.672 28.7764 360.598 29.8756 360.598 31.2316C360.598 32.5875 361.672 33.6868 362.998 33.6868Z"
        fill="url(#paint63_linear_2875_344)"
      />
      <path
        d="M362.998 5.45232C364.323 5.45232 365.398 4.3531 365.398 2.99716C365.398 1.64121 364.323 0.541992 362.998 0.541992C361.672 0.541992 360.598 1.64121 360.598 2.99716C360.598 4.3531 361.672 5.45232 362.998 5.45232Z"
        fill="url(#paint64_linear_2875_344)"
      />
      <defs>
        <linearGradient
          id="paint0_linear_2875_344"
          x1="2.99766"
          y1="113.48"
          x2="2.99766"
          y2="118.39"
          gradientUnits="userSpaceOnUse"
        >
          <stop stopColor="#6F2298" />
          <stop offset="1" stopColor="#9E2E94" />
        </linearGradient>
        <linearGradient
          id="paint1_linear_2875_344"
          x1="2.99766"
          y1="85.2452"
          x2="2.99766"
          y2="90.1555"
          gradientUnits="userSpaceOnUse"
        >
          <stop stopColor="#6F2298" />
          <stop offset="1" stopColor="#9E2E94" />
        </linearGradient>
        <linearGradient
          id="paint2_linear_2875_344"
          x1="2.99766"
          y1="57.0108"
          x2="2.99766"
          y2="61.9211"
          gradientUnits="userSpaceOnUse"
        >
          <stop stopColor="#6F2298" />
          <stop offset="1" stopColor="#9E2E94" />
        </linearGradient>
        <linearGradient
          id="paint3_linear_2875_344"
          x1="2.99766"
          y1="28.7764"
          x2="2.99766"
          y2="33.6868"
          gradientUnits="userSpaceOnUse"
        >
          <stop stopColor="#6F2298" />
          <stop offset="1" stopColor="#9E2E94" />
        </linearGradient>
        <linearGradient
          id="paint4_linear_2875_344"
          x1="2.99766"
          y1="0.541992"
          x2="2.99766"
          y2="5.45232"
          gradientUnits="userSpaceOnUse"
        >
          <stop stopColor="#6F2298" />
          <stop offset="1" stopColor="#9E2E94" />
        </linearGradient>
        <linearGradient
          id="paint5_linear_2875_344"
          x1="33.0016"
          y1="113.48"
          x2="33.0016"
          y2="118.39"
          gradientUnits="userSpaceOnUse"
        >
          <stop stopColor="#6F2298" />
          <stop offset="1" stopColor="#9E2E94" />
        </linearGradient>
        <linearGradient
          id="paint6_linear_2875_344"
          x1="33.0016"
          y1="85.2452"
          x2="33.0016"
          y2="90.1555"
          gradientUnits="userSpaceOnUse"
        >
          <stop stopColor="#6F2298" />
          <stop offset="1" stopColor="#9E2E94" />
        </linearGradient>
        <linearGradient
          id="paint7_linear_2875_344"
          x1="33.0016"
          y1="57.0108"
          x2="33.0016"
          y2="61.9211"
          gradientUnits="userSpaceOnUse"
        >
          <stop stopColor="#6F2298" />
          <stop offset="1" stopColor="#9E2E94" />
        </linearGradient>
        <linearGradient
          id="paint8_linear_2875_344"
          x1="33.0016"
          y1="28.7764"
          x2="33.0016"
          y2="33.6868"
          gradientUnits="userSpaceOnUse"
        >
          <stop stopColor="#6F2298" />
          <stop offset="1" stopColor="#9E2E94" />
        </linearGradient>
        <linearGradient
          id="paint9_linear_2875_344"
          x1="33.0016"
          y1="0.541992"
          x2="33.0016"
          y2="5.45232"
          gradientUnits="userSpaceOnUse"
        >
          <stop stopColor="#6F2298" />
          <stop offset="1" stopColor="#9E2E94" />
        </linearGradient>
        <linearGradient
          id="paint10_linear_2875_344"
          x1="62.9977"
          y1="113.48"
          x2="62.9977"
          y2="118.39"
          gradientUnits="userSpaceOnUse"
        >
          <stop stopColor="#6F2298" />
          <stop offset="1" stopColor="#9E2E94" />
        </linearGradient>
        <linearGradient
          id="paint11_linear_2875_344"
          x1="62.9977"
          y1="85.2452"
          x2="62.9977"
          y2="90.1555"
          gradientUnits="userSpaceOnUse"
        >
          <stop stopColor="#6F2298" />
          <stop offset="1" stopColor="#9E2E94" />
        </linearGradient>
        <linearGradient
          id="paint12_linear_2875_344"
          x1="62.9977"
          y1="57.0108"
          x2="62.9977"
          y2="61.9211"
          gradientUnits="userSpaceOnUse"
        >
          <stop stopColor="#6F2298" />
          <stop offset="1" stopColor="#9E2E94" />
        </linearGradient>
        <linearGradient
          id="paint13_linear_2875_344"
          x1="62.9977"
          y1="28.7764"
          x2="62.9977"
          y2="33.6868"
          gradientUnits="userSpaceOnUse"
        >
          <stop stopColor="#6F2298" />
          <stop offset="1" stopColor="#9E2E94" />
        </linearGradient>
        <linearGradient
          id="paint14_linear_2875_344"
          x1="62.9977"
          y1="0.541992"
          x2="62.9977"
          y2="5.45232"
          gradientUnits="userSpaceOnUse"
        >
          <stop stopColor="#6F2298" />
          <stop offset="1" stopColor="#9E2E94" />
        </linearGradient>
        <linearGradient
          id="paint15_linear_2875_344"
          x1="92.9977"
          y1="113.48"
          x2="92.9977"
          y2="118.39"
          gradientUnits="userSpaceOnUse"
        >
          <stop stopColor="#6F2298" />
          <stop offset="1" stopColor="#9E2E94" />
        </linearGradient>
        <linearGradient
          id="paint16_linear_2875_344"
          x1="92.9977"
          y1="85.2452"
          x2="92.9977"
          y2="90.1555"
          gradientUnits="userSpaceOnUse"
        >
          <stop stopColor="#6F2298" />
          <stop offset="1" stopColor="#9E2E94" />
        </linearGradient>
        <linearGradient
          id="paint17_linear_2875_344"
          x1="92.9977"
          y1="57.0108"
          x2="92.9977"
          y2="61.9211"
          gradientUnits="userSpaceOnUse"
        >
          <stop stopColor="#6F2298" />
          <stop offset="1" stopColor="#9E2E94" />
        </linearGradient>
        <linearGradient
          id="paint18_linear_2875_344"
          x1="92.9977"
          y1="28.7764"
          x2="92.9977"
          y2="33.6868"
          gradientUnits="userSpaceOnUse"
        >
          <stop stopColor="#6F2298" />
          <stop offset="1" stopColor="#9E2E94" />
        </linearGradient>
        <linearGradient
          id="paint19_linear_2875_344"
          x1="92.9977"
          y1="0.541992"
          x2="92.9977"
          y2="5.45232"
          gradientUnits="userSpaceOnUse"
        >
          <stop stopColor="#6F2298" />
          <stop offset="1" stopColor="#9E2E94" />
        </linearGradient>
        <linearGradient
          id="paint20_linear_2875_344"
          x1="123.002"
          y1="113.48"
          x2="123.002"
          y2="118.39"
          gradientUnits="userSpaceOnUse"
        >
          <stop stopColor="#6F2298" />
          <stop offset="1" stopColor="#9E2E94" />
        </linearGradient>
        <linearGradient
          id="paint21_linear_2875_344"
          x1="123.002"
          y1="85.2452"
          x2="123.002"
          y2="90.1555"
          gradientUnits="userSpaceOnUse"
        >
          <stop stopColor="#6F2298" />
          <stop offset="1" stopColor="#9E2E94" />
        </linearGradient>
        <linearGradient
          id="paint22_linear_2875_344"
          x1="123.002"
          y1="57.0108"
          x2="123.002"
          y2="61.9211"
          gradientUnits="userSpaceOnUse"
        >
          <stop stopColor="#6F2298" />
          <stop offset="1" stopColor="#9E2E94" />
        </linearGradient>
        <linearGradient
          id="paint23_linear_2875_344"
          x1="123.002"
          y1="28.7764"
          x2="123.002"
          y2="33.6868"
          gradientUnits="userSpaceOnUse"
        >
          <stop stopColor="#6F2298" />
          <stop offset="1" stopColor="#9E2E94" />
        </linearGradient>
        <linearGradient
          id="paint24_linear_2875_344"
          x1="123.002"
          y1="0.541992"
          x2="123.002"
          y2="5.45232"
          gradientUnits="userSpaceOnUse"
        >
          <stop stopColor="#6F2298" />
          <stop offset="1" stopColor="#9E2E94" />
        </linearGradient>
        <linearGradient
          id="paint25_linear_2875_344"
          x1="152.998"
          y1="113.48"
          x2="152.998"
          y2="118.39"
          gradientUnits="userSpaceOnUse"
        >
          <stop stopColor="#6F2298" />
          <stop offset="1" stopColor="#9E2E94" />
        </linearGradient>
        <linearGradient
          id="paint26_linear_2875_344"
          x1="152.998"
          y1="85.2452"
          x2="152.998"
          y2="90.1555"
          gradientUnits="userSpaceOnUse"
        >
          <stop stopColor="#6F2298" />
          <stop offset="1" stopColor="#9E2E94" />
        </linearGradient>
        <linearGradient
          id="paint27_linear_2875_344"
          x1="152.998"
          y1="57.0108"
          x2="152.998"
          y2="61.9211"
          gradientUnits="userSpaceOnUse"
        >
          <stop stopColor="#6F2298" />
          <stop offset="1" stopColor="#9E2E94" />
        </linearGradient>
        <linearGradient
          id="paint28_linear_2875_344"
          x1="152.998"
          y1="28.7764"
          x2="152.998"
          y2="33.6868"
          gradientUnits="userSpaceOnUse"
        >
          <stop stopColor="#6F2298" />
          <stop offset="1" stopColor="#9E2E94" />
        </linearGradient>
        <linearGradient
          id="paint29_linear_2875_344"
          x1="152.998"
          y1="0.541992"
          x2="152.998"
          y2="5.45232"
          gradientUnits="userSpaceOnUse"
        >
          <stop stopColor="#6F2298" />
          <stop offset="1" stopColor="#9E2E94" />
        </linearGradient>
        <linearGradient
          id="paint30_linear_2875_344"
          x1="182.998"
          y1="113.48"
          x2="182.998"
          y2="118.39"
          gradientUnits="userSpaceOnUse"
        >
          <stop stopColor="#6F2298" />
          <stop offset="1" stopColor="#9E2E94" />
        </linearGradient>
        <linearGradient
          id="paint31_linear_2875_344"
          x1="182.998"
          y1="85.2452"
          x2="182.998"
          y2="90.1555"
          gradientUnits="userSpaceOnUse"
        >
          <stop stopColor="#6F2298" />
          <stop offset="1" stopColor="#9E2E94" />
        </linearGradient>
        <linearGradient
          id="paint32_linear_2875_344"
          x1="182.998"
          y1="57.0108"
          x2="182.998"
          y2="61.9211"
          gradientUnits="userSpaceOnUse"
        >
          <stop stopColor="#6F2298" />
          <stop offset="1" stopColor="#9E2E94" />
        </linearGradient>
        <linearGradient
          id="paint33_linear_2875_344"
          x1="182.998"
          y1="28.7764"
          x2="182.998"
          y2="33.6868"
          gradientUnits="userSpaceOnUse"
        >
          <stop stopColor="#6F2298" />
          <stop offset="1" stopColor="#9E2E94" />
        </linearGradient>
        <linearGradient
          id="paint34_linear_2875_344"
          x1="182.998"
          y1="0.541992"
          x2="182.998"
          y2="5.45232"
          gradientUnits="userSpaceOnUse"
        >
          <stop stopColor="#6F2298" />
          <stop offset="1" stopColor="#9E2E94" />
        </linearGradient>
        <linearGradient
          id="paint35_linear_2875_344"
          x1="213.002"
          y1="113.48"
          x2="213.002"
          y2="118.39"
          gradientUnits="userSpaceOnUse"
        >
          <stop stopColor="#6F2298" />
          <stop offset="1" stopColor="#9E2E94" />
        </linearGradient>
        <linearGradient
          id="paint36_linear_2875_344"
          x1="213.002"
          y1="85.2452"
          x2="213.002"
          y2="90.1555"
          gradientUnits="userSpaceOnUse"
        >
          <stop stopColor="#6F2298" />
          <stop offset="1" stopColor="#9E2E94" />
        </linearGradient>
        <linearGradient
          id="paint37_linear_2875_344"
          x1="213.002"
          y1="57.0108"
          x2="213.002"
          y2="61.9211"
          gradientUnits="userSpaceOnUse"
        >
          <stop stopColor="#6F2298" />
          <stop offset="1" stopColor="#9E2E94" />
        </linearGradient>
        <linearGradient
          id="paint38_linear_2875_344"
          x1="213.002"
          y1="28.7764"
          x2="213.002"
          y2="33.6868"
          gradientUnits="userSpaceOnUse"
        >
          <stop stopColor="#6F2298" />
          <stop offset="1" stopColor="#9E2E94" />
        </linearGradient>
        <linearGradient
          id="paint39_linear_2875_344"
          x1="213.002"
          y1="0.541992"
          x2="213.002"
          y2="5.45232"
          gradientUnits="userSpaceOnUse"
        >
          <stop stopColor="#6F2298" />
          <stop offset="1" stopColor="#9E2E94" />
        </linearGradient>
        <linearGradient
          id="paint40_linear_2875_344"
          x1="242.998"
          y1="113.48"
          x2="242.998"
          y2="118.39"
          gradientUnits="userSpaceOnUse"
        >
          <stop stopColor="#6F2298" />
          <stop offset="1" stopColor="#9E2E94" />
        </linearGradient>
        <linearGradient
          id="paint41_linear_2875_344"
          x1="242.998"
          y1="85.2452"
          x2="242.998"
          y2="90.1555"
          gradientUnits="userSpaceOnUse"
        >
          <stop stopColor="#6F2298" />
          <stop offset="1" stopColor="#9E2E94" />
        </linearGradient>
        <linearGradient
          id="paint42_linear_2875_344"
          x1="242.998"
          y1="57.0108"
          x2="242.998"
          y2="61.9211"
          gradientUnits="userSpaceOnUse"
        >
          <stop stopColor="#6F2298" />
          <stop offset="1" stopColor="#9E2E94" />
        </linearGradient>
        <linearGradient
          id="paint43_linear_2875_344"
          x1="242.998"
          y1="28.7764"
          x2="242.998"
          y2="33.6868"
          gradientUnits="userSpaceOnUse"
        >
          <stop stopColor="#6F2298" />
          <stop offset="1" stopColor="#9E2E94" />
        </linearGradient>
        <linearGradient
          id="paint44_linear_2875_344"
          x1="242.998"
          y1="0.541992"
          x2="242.998"
          y2="5.45232"
          gradientUnits="userSpaceOnUse"
        >
          <stop stopColor="#6F2298" />
          <stop offset="1" stopColor="#9E2E94" />
        </linearGradient>
        <linearGradient
          id="paint45_linear_2875_344"
          x1="272.998"
          y1="113.48"
          x2="272.998"
          y2="118.39"
          gradientUnits="userSpaceOnUse"
        >
          <stop stopColor="#6F2298" />
          <stop offset="1" stopColor="#9E2E94" />
        </linearGradient>
        <linearGradient
          id="paint46_linear_2875_344"
          x1="272.998"
          y1="85.2452"
          x2="272.998"
          y2="90.1555"
          gradientUnits="userSpaceOnUse"
        >
          <stop stopColor="#6F2298" />
          <stop offset="1" stopColor="#9E2E94" />
        </linearGradient>
        <linearGradient
          id="paint47_linear_2875_344"
          x1="272.998"
          y1="57.0108"
          x2="272.998"
          y2="61.9211"
          gradientUnits="userSpaceOnUse"
        >
          <stop stopColor="#6F2298" />
          <stop offset="1" stopColor="#9E2E94" />
        </linearGradient>
        <linearGradient
          id="paint48_linear_2875_344"
          x1="272.998"
          y1="28.7764"
          x2="272.998"
          y2="33.6868"
          gradientUnits="userSpaceOnUse"
        >
          <stop stopColor="#6F2298" />
          <stop offset="1" stopColor="#9E2E94" />
        </linearGradient>
        <linearGradient
          id="paint49_linear_2875_344"
          x1="272.998"
          y1="0.541992"
          x2="272.998"
          y2="5.45232"
          gradientUnits="userSpaceOnUse"
        >
          <stop stopColor="#6F2298" />
          <stop offset="1" stopColor="#9E2E94" />
        </linearGradient>
        <linearGradient
          id="paint50_linear_2875_344"
          x1="303.002"
          y1="113.48"
          x2="303.002"
          y2="118.39"
          gradientUnits="userSpaceOnUse"
        >
          <stop stopColor="#6F2298" />
          <stop offset="1" stopColor="#9E2E94" />
        </linearGradient>
        <linearGradient
          id="paint51_linear_2875_344"
          x1="303.002"
          y1="85.2452"
          x2="303.002"
          y2="90.1555"
          gradientUnits="userSpaceOnUse"
        >
          <stop stopColor="#6F2298" />
          <stop offset="1" stopColor="#9E2E94" />
        </linearGradient>
        <linearGradient
          id="paint52_linear_2875_344"
          x1="303.002"
          y1="57.0108"
          x2="303.002"
          y2="61.9211"
          gradientUnits="userSpaceOnUse"
        >
          <stop stopColor="#6F2298" />
          <stop offset="1" stopColor="#9E2E94" />
        </linearGradient>
        <linearGradient
          id="paint53_linear_2875_344"
          x1="303.002"
          y1="28.7764"
          x2="303.002"
          y2="33.6868"
          gradientUnits="userSpaceOnUse"
        >
          <stop stopColor="#6F2298" />
          <stop offset="1" stopColor="#9E2E94" />
        </linearGradient>
        <linearGradient
          id="paint54_linear_2875_344"
          x1="303.002"
          y1="0.541992"
          x2="303.002"
          y2="5.45232"
          gradientUnits="userSpaceOnUse"
        >
          <stop stopColor="#6F2298" />
          <stop offset="1" stopColor="#9E2E94" />
        </linearGradient>
        <linearGradient
          id="paint55_linear_2875_344"
          x1="332.998"
          y1="113.48"
          x2="332.998"
          y2="118.39"
          gradientUnits="userSpaceOnUse"
        >
          <stop stopColor="#6F2298" />
          <stop offset="1" stopColor="#9E2E94" />
        </linearGradient>
        <linearGradient
          id="paint56_linear_2875_344"
          x1="332.998"
          y1="85.2452"
          x2="332.998"
          y2="90.1555"
          gradientUnits="userSpaceOnUse"
        >
          <stop stopColor="#6F2298" />
          <stop offset="1" stopColor="#9E2E94" />
        </linearGradient>
        <linearGradient
          id="paint57_linear_2875_344"
          x1="332.998"
          y1="57.0108"
          x2="332.998"
          y2="61.9211"
          gradientUnits="userSpaceOnUse"
        >
          <stop stopColor="#6F2298" />
          <stop offset="1" stopColor="#9E2E94" />
        </linearGradient>
        <linearGradient
          id="paint58_linear_2875_344"
          x1="332.998"
          y1="28.7764"
          x2="332.998"
          y2="33.6868"
          gradientUnits="userSpaceOnUse"
        >
          <stop stopColor="#6F2298" />
          <stop offset="1" stopColor="#9E2E94" />
        </linearGradient>
        <linearGradient
          id="paint59_linear_2875_344"
          x1="332.998"
          y1="0.541992"
          x2="332.998"
          y2="5.45232"
          gradientUnits="userSpaceOnUse"
        >
          <stop stopColor="#6F2298" />
          <stop offset="1" stopColor="#9E2E94" />
        </linearGradient>
        <linearGradient
          id="paint60_linear_2875_344"
          x1="362.998"
          y1="113.48"
          x2="362.998"
          y2="118.39"
          gradientUnits="userSpaceOnUse"
        >
          <stop stopColor="#6F2298" />
          <stop offset="1" stopColor="#9E2E94" />
        </linearGradient>
        <linearGradient
          id="paint61_linear_2875_344"
          x1="362.998"
          y1="85.2452"
          x2="362.998"
          y2="90.1555"
          gradientUnits="userSpaceOnUse"
        >
          <stop stopColor="#6F2298" />
          <stop offset="1" stopColor="#9E2E94" />
        </linearGradient>
        <linearGradient
          id="paint62_linear_2875_344"
          x1="362.998"
          y1="57.0108"
          x2="362.998"
          y2="61.9211"
          gradientUnits="userSpaceOnUse"
        >
          <stop stopColor="#6F2298" />
          <stop offset="1" stopColor="#9E2E94" />
        </linearGradient>
        <linearGradient
          id="paint63_linear_2875_344"
          x1="362.998"
          y1="28.7764"
          x2="362.998"
          y2="33.6868"
          gradientUnits="userSpaceOnUse"
        >
          <stop stopColor="#6F2298" />
          <stop offset="1" stopColor="#9E2E94" />
        </linearGradient>
        <linearGradient
          id="paint64_linear_2875_344"
          x1="362.998"
          y1="0.541992"
          x2="362.998"
          y2="5.45232"
          gradientUnits="userSpaceOnUse"
        >
          <stop stopColor="#6F2298" />
          <stop offset="1" stopColor="#9E2E94" />
        </linearGradient>
      </defs>
    </svg>
  ),
  chat: (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 24 24"
      height={25}
      stroke="currentColor"
      width={25}
      strokeWidth={1.5}
      className="size-6"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M7.5 8.25h9m-9 3H12m-9.75 1.51c0 1.6 1.123 2.994 2.707 3.227 1.129.166 2.27.293 3.423.379.35.026.67.21.865.501L12 21l2.755-4.133a1.14 1.14 0 0 1 .865-.501 48.172 48.172 0 0 0 3.423-.379c1.584-.233 2.707-1.626 2.707-3.228V6.741c0-1.602-1.123-2.995-2.707-3.228A48.394 48.394 0 0 0 12 3c-2.392 0-4.744.175-7.043.513C3.373 3.746 2.25 5.14 2.25 6.741v6.018Z"
      />
    </svg>
  ),
  heroWave: (
    <svg width="1440" height="983" viewBox="0 0 1440 983" fill="none" xmlns="http://www.w3.org/2000/svg">
      <mask id="mask0_2963_351" maskUnits="userSpaceOnUse" x="0" y="0" width="1440" height="983">
        <path d="M1440 0H0V982.065H1440V0Z" fill="white" />
      </mask>
      <g mask="url(#mask0_2963_351)">
        <path
          d="M-792.238 1153.05C-775.798 1059.14 -682.918 1003.16 -593.278 992.235C-503.638 981.187 -412.318 1002.67 -321.718 1002.67C-78.9582 1002.55 149.882 831.668 229.322 591.184C254.762 514.092 265.922 431.967 290.762 354.629C315.602 277.292 357.722 202.041 426.122 165.214C524.522 112.305 647.762 153.061 747.002 212.23C846.242 271.399 939.242 349.719 1049.28 376.849C1193.88 412.448 1344 351.192 1454.64 252.372C1565.16 153.552 1643.28 20.7272 1719.6 -109.887"
          stroke="#153953"
          stroke-miterlimit="10"
        />
        <path
          d="M-797.637 1143.96C-779.637 1050.55 -686.997 994.69 -597.237 983.396C-558.477 978.486 -519.237 979.714 -479.997 983.028C-428.517 987.325 -376.917 994.935 -325.677 996.04C-221.157 998.373 -119.277 970.998 -29.7567 917.843C39.3634 876.842 100.923 822.706 150.003 757.767C185.163 711.61 213.123 659.56 232.683 603.092C241.443 577.803 248.643 551.901 255.243 525.754C268.683 472.6 279.723 418.586 297.123 367.15C316.923 308.84 346.803 252.372 391.203 213.948C405.003 201.918 420.003 191.606 436.443 183.504C505.443 149.623 585.243 161.285 661.563 190.133C694.563 202.655 726.964 218.245 757.084 235.063C790.804 253.845 823.804 274.1 856.684 293.373C921.244 331.428 984.964 366.414 1053.96 379.181C1098.84 387.406 1143.12 385.319 1186.92 375.252C1275.96 354.875 1363.44 300.493 1436.4 231.134C1456.44 212.107 1475.52 192.097 1494 171.228C1576.08 78.546 1644.72 -28.6218 1712.4 -129.652"
          stroke="#153953"
          stroke-miterlimit="10"
        />
        <path
          d="M-803.039 1134.76C-783.359 1041.83 -691.079 985.974 -601.199 974.312C-562.319 969.279 -523.079 970.507 -483.719 973.944C-432.239 978.486 -380.639 986.833 -329.519 989.166C-225.239 993.953 -123.479 970.998 -33.1189 920.053C36.7211 880.771 99.2411 829.212 150.241 766.728C186.721 722.044 215.761 670.854 236.161 614.754C245.281 589.711 252.721 563.809 259.681 537.661C273.721 484.63 285.361 430.494 303.481 379.549C324.121 321.607 355.081 266.489 400.921 229.907C415.081 218.613 430.201 208.915 446.761 201.55C516.121 170.737 594.841 185.223 671.041 214.194C704.161 226.715 736.801 241.814 767.281 257.527C801.361 275.082 834.721 293.496 867.481 310.436C931.801 344.072 993.841 373.657 1058.88 381.022C1101 385.81 1141.2 380.286 1181.64 367.519C1263.6 341.371 1346.76 282.079 1418.52 209.529C1438.2 189.642 1457.28 168.773 1475.88 147.413C1558.8 51.9075 1632.6 -54.2783 1705.44 -149.907"
          stroke="#153953"
          stroke-miterlimit="10"
        />
        <path
          d="M-808.438 1125.55C-787.077 1033.11 -695.157 977.258 -605.157 965.351C-566.277 960.195 -526.797 961.3 -487.437 964.983C-435.837 969.893 -384.477 978.977 -333.357 982.414C-229.197 989.657 -127.797 971.121 -36.4773 922.386C34.0827 884.822 97.6827 835.841 150.483 775.812C188.403 732.602 218.403 682.271 239.643 626.416C249.123 601.496 256.923 575.839 264.243 549.569C278.883 496.66 291.123 442.401 309.963 391.825C331.443 334.251 363.363 280.483 410.763 245.743C425.283 235.186 440.523 226.102 457.083 219.595C526.683 191.852 604.443 209.284 680.523 238.255C713.763 250.899 746.523 265.384 777.363 279.992C811.803 296.319 845.403 312.892 878.163 327.622C942.243 356.593 1002.72 381.022 1063.68 382.986C1103.16 384.214 1139.28 375.498 1176.12 359.908C1251 328.236 1329.84 263.665 1400.28 188.046C1419.6 167.178 1438.56 145.695 1457.28 123.721C1540.92 25.3919 1619.88 -79.8118 1698.12 -169.916"
          stroke="#153953"
          stroke-miterlimit="10"
        />
        <path
          d="M-813.84 1116.34C-790.8 1024.52 -699.24 968.543 -609 956.39C-570 951.111 -530.52 952.093 -491.04 956.144C-439.44 961.3 -388.08 971.12 -337.08 975.785C-233.16 985.36 -131.88 971.366 -39.8397 924.964C31.5603 889.118 96.2403 842.838 150.6 785.142C190.08 743.404 220.92 693.933 242.88 638.446C252.72 613.772 260.88 588.115 268.44 561.845C283.68 508.936 296.52 454.8 316.2 404.469C338.52 347.386 371.4 294.723 420.36 262.07C435.24 252.126 450.6 243.901 467.28 238.009C537.24 213.335 613.8 233.712 690 262.683C723.24 275.45 756.36 289.322 787.44 302.948C822.24 318.17 856.2 332.778 888.72 345.3C952.56 369.851 1011.48 388.756 1068.24 385.441C1105.08 383.232 1137.12 371.079 1170.48 352.665C1238.4 315.347 1312.68 245.743 1382.04 167.055C1401.12 145.327 1419.96 122.985 1438.8 100.397C1523.16 -0.632869 1607.28 -105.1 1690.8 -189.558"
          stroke="#153953"
          stroke-miterlimit="10"
        />
        <path
          d="M-819.242 1107.14C-794.522 1015.8 -703.322 959.827 -612.962 947.429C-573.962 942.027 -534.362 943.009 -494.762 947.183C-443.162 952.584 -391.802 963.142 -340.922 969.034C-237.242 981.064 -136.202 971.366 -43.202 927.296C28.918 893.169 94.678 849.59 150.838 794.349C191.758 754.084 223.558 705.349 246.358 650.231C256.558 625.679 265.078 600.146 272.878 573.998C288.718 521.212 302.158 466.953 322.558 417.113C345.718 360.399 379.558 309.086 430.078 278.274C445.198 269.067 460.798 261.456 477.478 256.3C547.678 234.817 623.278 257.896 699.358 287.112C732.718 299.879 766.078 313.26 797.518 325.781C832.678 339.776 866.878 352.543 899.398 362.731C962.998 382.741 1020.6 396.367 1073.04 387.651C1107.36 382.004 1135.08 366.414 1165.08 345.3C1226.04 302.212 1295.88 227.697 1364.04 145.818C1382.76 123.23 1401.6 100.152 1420.56 76.9505C1505.64 -26.9029 1595.04 -130.388 1683.84 -209.322"
          stroke="#153953"
          stroke-miterlimit="10"
        />
        <path
          d="M-824.762 1098.05C-798.362 1007.21 -707.522 951.357 -617.042 938.59C-577.922 933.066 -538.202 933.925 -498.602 938.344C-446.882 944.114 -395.762 955.408 -344.882 962.405C-241.322 976.768 -140.522 971.612 -46.6816 929.751C26.1584 897.466 93.1185 856.465 150.958 803.556C193.438 764.764 226.078 716.889 249.718 662.138C260.158 637.71 269.038 612.299 277.318 586.151C293.758 533.488 307.918 479.106 328.918 429.634C352.918 373.411 387.719 323.203 439.799 294.355C455.279 285.762 470.999 278.888 487.799 274.468C558.239 256.054 632.758 282.079 708.838 311.296C742.318 324.185 775.919 336.952 807.599 348.369C843.119 361.135 877.559 372.061 910.079 380.04C973.439 395.63 1029.84 403.61 1077.84 389.738C1109.76 380.531 1133.16 361.626 1159.56 337.689C1213.44 288.954 1278.96 209.284 1345.92 124.335C1364.28 100.765 1383.12 76.9504 1402.2 53.258C1488.12 -53.4188 1582.56 -155.922 1676.64 -229.454"
          stroke="#153953"
          stroke-miterlimit="10"
        />
        <path
          d="M-830.164 1088.85C-802.084 998.618 -711.604 942.64 -621.004 929.505C-581.884 923.858 -542.044 924.718 -502.324 929.383C-450.604 935.398 -399.484 947.428 -348.724 955.653C-245.404 972.471 -144.724 971.734 -50.0439 932.083C23.5161 901.516 91.6761 863.216 151.196 812.64C195.116 775.321 228.716 728.305 253.196 673.923C263.996 649.739 273.236 624.329 281.756 598.181C298.796 545.518 313.556 491.136 335.276 442.033C360.116 386.178 395.876 337.197 449.516 310.436C465.236 302.58 481.196 296.319 497.996 292.636C568.796 277.291 642.236 306.262 718.196 335.479C751.676 348.368 785.636 360.644 817.556 370.956C853.316 382.495 888.236 391.579 920.636 397.226C983.756 408.274 1038.96 410.607 1082.4 391.702C1112.04 378.812 1130.88 356.716 1153.92 330.077C1200.84 275.573 1261.92 190.992 1327.68 102.852C1345.8 78.4232 1364.4 53.8716 1383.72 29.5655C1470.36 -79.9348 1570.08 -181.579 1669.44 -249.464"
          stroke="#153953"
          stroke-miterlimit="10"
        />
        <path
          d="M-835.559 1079.64C-805.799 989.903 -715.679 933.925 -624.839 920.544C-585.599 914.775 -545.639 915.511 -505.919 920.422C-454.199 926.805 -403.079 939.572 -352.559 948.902C-249.479 968.175 -149.038 971.857 -53.3984 934.539C20.8816 905.691 90.1215 870.091 151.442 821.847C196.922 786.001 231.362 739.844 256.682 685.708C267.842 661.647 277.442 636.359 286.322 610.212C303.962 557.671 319.322 503.167 341.762 454.432C367.442 398.945 404.042 351.192 459.362 326.395C475.442 319.152 491.522 313.628 508.442 310.805C579.482 298.529 651.842 330.323 727.802 359.662C761.402 372.675 795.602 384.337 827.882 393.666C864.002 404.101 899.162 411.221 931.562 414.658C994.442 421.287 1048.68 417.727 1087.44 393.912C1114.8 377.217 1129.2 352.051 1148.64 322.712C1188.48 262.438 1245.24 172.947 1309.68 81.6151C1327.44 56.3269 1346.04 30.916 1365.48 6.11885C1452.84 -106.205 1557.72 -206.867 1662.36 -269.228"
          stroke="#153953"
          stroke-miterlimit="10"
        />
        <path
          d="M-840.957 1070.43C-809.517 981.187 -719.757 925.209 -628.797 911.583C-589.557 905.691 -549.477 906.304 -509.637 911.46C-457.917 918.089 -406.917 931.593 -356.397 942.272C-253.437 963.878 -153.237 972.103 -56.7568 936.994C18.2432 909.864 88.6832 876.965 151.683 831.176C198.723 796.927 234.003 751.506 260.163 697.738C271.683 673.923 281.523 648.635 290.763 622.488C309.123 570.07 324.963 515.442 348.123 467.198C374.643 412.203 412.203 365.555 469.083 342.844C485.403 336.338 501.723 331.551 518.643 329.341C589.923 320.134 661.323 354.875 737.163 384.214C770.883 397.226 805.203 408.397 837.843 416.622C874.323 425.829 909.723 431.108 942.003 432.212C1004.64 434.299 1057.68 424.601 1092 396.244C1116.96 375.621 1126.92 347.509 1143 315.347C1175.88 249.303 1228.08 154.779 1291.44 60.378C1308.96 34.2305 1327.44 8.08304 1347 -17.4507C1435.08 -132.598 1545.24 -232.277 1655.16 -289.237"
          stroke="#153953"
          stroke-miterlimit="10"
        />
        <path
          d="M-846.359 1061.23C-813.359 972.471 -723.839 916.616 -632.759 902.621C-593.399 896.606 -553.319 897.22 -513.479 902.499C-461.639 909.496 -410.759 923.613 -360.359 935.521C-257.639 959.581 -157.679 972.103 -60.2391 939.326C15.6009 913.915 87.2409 883.84 151.801 840.26C200.401 807.484 236.521 762.923 263.521 709.4C275.401 685.708 285.601 660.542 295.081 634.395C314.041 581.977 330.481 527.35 354.361 479.474C381.721 424.847 420.121 379.304 478.681 358.68C495.361 352.788 511.801 348.737 528.841 347.264C600.481 341.249 670.681 378.69 746.521 408.274C780.241 421.41 814.921 431.967 847.801 439.087C884.641 447.066 920.281 450.626 952.561 449.398C1014.84 447.066 1066.8 430.862 1096.56 398.208C1119.24 373.411 1124.76 342.599 1137.24 307.736C1163.04 235.922 1210.92 136.488 1273.08 38.8953C1290.24 11.7657 1308.6 -14.9956 1328.4 -41.1431C1417.32 -159.114 1532.52 -257.811 1647.84 -309.247"
          stroke="#153953"
          stroke-miterlimit="10"
        />
        <path
          d="M-851.762 1052.14C-817.082 964.001 -727.922 908.023 -636.722 893.783C-597.362 887.645 -557.042 888.136 -517.202 893.783C-465.362 901.026 -414.482 916.002 -364.202 929.015C-261.602 955.53 -161.881 972.471 -63.6015 941.904C12.9585 918.335 85.7985 890.837 152.039 849.59C202.079 818.41 239.159 774.585 266.999 721.431C279.239 697.984 289.799 672.818 299.639 646.671C319.199 594.376 336.239 539.749 360.959 492.118C389.159 437.982 428.399 393.544 488.759 374.884C505.679 369.606 522.359 366.291 539.519 365.555C611.399 362.609 680.639 402.996 756.359 432.581C790.199 445.839 825.119 455.782 858.359 461.92C895.559 468.672 931.559 470.39 963.719 466.953C1025.76 460.201 1076.28 437.491 1101.84 400.664C1121.88 371.693 1123.2 338.18 1132.32 300.493C1151.04 222.91 1194.6 118.565 1255.56 17.9037C1272.36 -10.0851 1290.72 -37.7057 1310.52 -64.3442C1400.16 -185.015 1520.52 -282.976 1641.12 -328.765"
          stroke="#153953"
          stroke-miterlimit="10"
        />
        <path
          d="M-857.16 1042.93C-820.8 955.285 -732 899.307 -640.56 884.699C-601.08 878.439 -560.76 878.807 -520.8 884.699C-468.96 892.187 -418.2 907.9 -367.92 922.14C-265.56 950.988 -165.96 972.471 -66.96 944.237C10.32 922.386 84.36 897.712 152.16 858.675C203.76 828.967 241.68 786.002 270.36 733.216C282.96 709.892 293.88 684.849 303.96 658.701C324.12 606.529 341.76 551.779 367.2 504.64C396.12 450.872 436.32 407.538 498.36 391.089C515.64 386.547 532.44 383.846 549.6 383.846C621.72 383.969 689.88 427.302 765.6 456.887C799.56 470.145 834.72 479.597 868.2 484.63C905.76 490.277 942 490.032 974.16 484.262C1035.96 473.091 1084.92 443.752 1106.4 402.751C1123.8 369.483 1120.92 333.392 1126.56 293.005C1138.2 209.652 1177.44 100.275 1237.2 -3.45604C1253.76 -32.3042 1272 -60.6613 1291.92 -87.9137C1382.28 -211.408 1507.92 -308.387 1633.8 -348.652"
          stroke="#153953"
          stroke-miterlimit="10"
        />
        <path
          d="M-862.68 1033.73C-824.64 946.569 -736.32 890.591 -644.64 875.737C-605.16 869.354 -564.6 869.722 -524.64 875.737C-472.68 883.594 -422.04 899.921 -371.88 915.388C-269.76 946.692 -170.4 972.594 -70.4396 946.569C7.56045 926.437 82.8004 904.463 152.28 867.881C205.44 839.769 244.2 797.541 273.72 745C286.68 721.799 297.841 696.879 308.401 670.732C329.161 618.559 347.4 563.809 373.56 517.038C403.32 463.761 444.361 421.41 508.081 407.047C525.601 403.119 542.641 401.277 559.921 402.014C632.401 405.206 699.481 451.363 775.201 481.07C809.161 494.451 844.681 503.289 878.401 507.218C916.321 511.637 952.801 509.673 984.961 501.571C1046.4 485.98 1093.68 450.135 1111.32 404.837C1125.84 367.396 1119 328.605 1121.28 285.394C1125.84 196.271 1160.64 81.9835 1219.2 -24.9389C1235.4 -54.7691 1253.64 -83.8628 1273.68 -111.606C1364.88 -237.924 1495.56 -333.921 1626.72 -368.784"
          stroke="#153953"
          stroke-miterlimit="10"
        />
        <path
          d="M-868.078 1024.52C-828.358 937.976 -740.398 881.876 -648.598 866.776C-608.998 860.27 -568.438 860.516 -528.358 866.899C-476.398 875.001 -425.878 892.187 -375.838 908.76C-273.838 942.518 -174.718 972.839 -73.918 949.024C4.80207 930.611 81.3621 911.46 152.402 877.088C207.122 850.572 246.722 809.08 277.082 756.908C290.402 733.952 301.922 709.032 312.722 683.007C334.082 630.958 352.922 576.085 379.802 529.682C410.402 476.774 452.282 435.527 517.682 423.251C535.562 419.937 552.722 418.832 570.002 420.305C642.722 426.566 708.722 475.669 784.442 505.376C818.522 518.757 854.162 527.105 888.362 529.928C926.522 533.12 963.362 529.314 995.402 518.88C1056.6 498.993 1101.96 456.519 1115.76 406.924C1127.4 365.309 1116.72 323.817 1115.4 277.905C1112.88 183.136 1143.36 63.8152 1200.72 -46.2988C1216.68 -76.9884 1234.68 -106.819 1254.96 -135.298C1346.88 -264.44 1482.84 -359.578 1619.28 -388.794"
          stroke="#153953"
          stroke-miterlimit="10"
        />
        <path
          d="M-873.48 1015.31C-832.08 929.26 -744.48 873.282 -652.56 857.815C-612.96 851.186 -572.16 851.432 -532.08 857.938C-480.12 866.408 -429.6 884.208 -379.68 902.008C-277.92 938.099 -179.04 972.839 -77.2804 951.479C2.15965 934.907 79.9196 918.458 152.64 886.295C209.04 861.375 249.48 820.619 280.56 768.693C294.24 745.859 306.12 721.185 317.16 695.038C339.12 643.111 358.68 588.115 386.16 542.204C417.6 489.663 460.44 449.399 527.4 439.455C545.52 436.754 563.04 436.386 580.32 438.596C653.4 447.925 718.32 499.975 793.92 529.805C828.12 543.309 864 551.042 898.44 552.884C936.96 554.848 974.16 549.324 1006.08 536.557C1067.04 512.251 1110.36 463.393 1120.56 409.379C1129.2 363.591 1114.68 319.398 1110 270.785C1100.28 170.247 1126.56 45.8925 1182.72 -67.2905C1198.32 -98.8393 1216.32 -129.529 1236.72 -158.5C1329.36 -290.465 1470.48 -384.62 1612.2 -408.313"
          stroke="#153953"
          stroke-miterlimit="10"
        />
        <path
          d="M-878.875 1006.23C-835.795 920.667 -748.555 864.689 -656.395 848.976C-616.675 842.225 -575.875 842.347 -535.675 849.099C-483.595 857.815 -433.195 876.474 -383.395 895.379C-281.875 933.925 -183.115 973.085 -80.5148 953.934C-0.234803 939.081 78.6053 925.455 153.005 895.502C210.965 872.178 252.245 832.035 284.165 780.6C298.205 758.012 310.445 733.338 321.845 707.191C344.405 655.264 364.565 600.268 392.765 554.725C425.045 502.675 468.725 463.27 537.365 455.536C555.725 453.449 573.485 453.818 590.765 456.764C664.085 469.285 727.925 524.035 803.525 553.988C837.845 567.492 873.965 574.734 908.645 575.471C947.525 576.33 984.966 568.842 1016.89 553.743C1077.61 525.017 1118.89 469.899 1125.49 411.343C1131.01 361.626 1112.65 314.487 1104.61 263.052C1087.57 156.743 1109.77 27.4788 1164.73 -88.896C1179.97 -121.304 1197.97 -152.73 1218.49 -182.315C1311.73 -317.103 1458.01 -410.4 1605.13 -428.568"
          stroke="#153953"
          stroke-miterlimit="10"
        />
        <path
          d="M-884.273 997.023C-839.513 911.951 -752.633 855.974 -660.353 839.892C-620.633 833.018 -579.713 833.018 -539.393 840.015C-487.313 849.099 -437.033 868.372 -387.233 888.504C-285.833 929.506 -187.433 973.085 -83.8733 956.144C-2.87331 943.009 77.2867 932.329 153.247 904.463C212.767 882.735 254.887 843.329 287.647 792.262C301.927 769.797 314.527 745.246 326.287 719.098C349.567 667.294 370.207 612.299 399.127 567.001C432.247 515.32 476.767 477.019 547.087 471.372C565.807 469.899 583.687 471.127 601.087 474.687C674.647 490.277 737.527 547.973 813.007 577.926C847.327 591.552 883.807 598.181 918.727 597.813C957.967 597.445 995.647 588.238 1027.57 570.806C1088.05 537.662 1127.29 476.283 1130.17 413.185C1132.57 359.417 1110.49 309.454 1099.09 255.318C1075.09 143.363 1092.73 9.0651 1146.61 -110.501C1161.61 -143.892 1179.37 -176.054 1200.13 -206.13C1294.09 -343.496 1445.53 -435.81 1597.93 -448.454"
          stroke="#153953"
          stroke-miterlimit="10"
        />
        <path
          d="M-889.68 987.816C-843.24 903.358 -756.72 847.258 -664.32 830.931C-624.48 823.934 -583.44 823.934 -543.12 831.176C-491.04 840.506 -440.76 860.516 -391.08 881.875C-289.92 925.209 -191.64 973.33 -87.2396 958.599C-5.51964 947.183 75.8403 939.326 153.48 913.793C214.56 893.66 257.52 854.992 291.12 804.17C305.76 781.95 318.72 757.399 330.84 731.251C354.72 679.57 375.96 624.452 405.72 579.645C439.68 528.455 485.04 490.891 557.04 487.699C576 486.84 594.12 488.804 611.52 493.223C685.44 511.883 747.12 572.525 822.6 602.478C857.04 616.227 893.76 622.242 929.04 620.769C968.64 619.173 1006.68 608.248 1038.48 588.484C1098.72 551.042 1135.92 483.403 1135.2 415.64C1134.6 357.944 1108.8 305.035 1093.8 248.075C1062.72 130.35 1076.04 -8.98028 1128.6 -131.493C1143.24 -165.742 1161 -198.642 1181.88 -229.454C1276.8 -369.767 1433.4 -461.221 1591.08 -468.341"
          stroke="#153953"
          stroke-miterlimit="10"
        />
        <path
          d="M-895.078 978.609C-847.078 894.642 -760.798 838.665 -668.278 821.97C-628.438 814.85 -587.278 814.727 -546.838 822.215C-494.758 831.79 -444.478 852.659 -394.918 875.124C-293.998 920.913 -195.838 973.453 -90.7179 961.055C-8.27793 951.357 74.2821 946.324 153.602 923C216.242 904.463 260.042 866.531 294.362 816.077C309.362 793.981 322.682 769.552 335.042 743.404C359.522 691.723 381.362 636.605 411.842 592.166C446.642 541.345 492.962 504.763 566.522 503.781C585.842 503.535 604.082 506.236 621.602 511.392C695.762 533.12 756.482 596.586 831.842 626.661C866.402 640.41 903.362 645.934 938.882 643.479C978.842 640.656 1017.24 628.012 1048.8 605.793C1108.92 564.055 1143.96 490.277 1139.64 417.727C1135.92 356.225 1106.4 300.248 1088.04 240.587C1049.88 117.092 1058.88 -27.1485 1110.24 -152.853C1124.52 -187.962 1142.28 -221.597 1163.16 -253.023C1258.8 -396.159 1420.68 -486.632 1583.64 -488.351"
          stroke="#153953"
          stroke-miterlimit="10"
        />
        <path
          d="M-900.602 969.524C-850.922 886.049 -765.002 830.071 -672.242 813.131C-632.282 805.888 -591.002 805.642 -550.561 813.376C-498.361 823.32 -448.321 844.802 -398.881 868.495C-298.081 916.739 -200.281 973.575 -94.2015 963.509C-11.0414 955.653 72.8386 953.566 153.599 932.206C217.799 915.511 262.439 878.07 297.599 827.862C312.959 805.888 326.519 781.582 339.239 755.434C364.319 703.876 386.759 648.635 417.959 604.565C453.599 554.111 500.759 518.511 575.999 519.739C595.559 520.107 614.039 523.544 631.559 529.437C705.959 554.234 765.599 620.646 840.959 650.844C875.519 664.716 912.719 669.627 948.599 666.067C988.919 662.138 1027.56 647.53 1059.12 623.101C1119 576.944 1152 497.151 1143.96 419.814C1137.12 354.384 1103.88 295.582 1082.04 233.099C1036.8 103.957 1041.48 -45.3169 1091.64 -174.213C1105.68 -210.181 1123.2 -244.676 1144.32 -276.593C1240.68 -422.553 1407.72 -512.043 1575.96 -508.238"
          stroke="#153953"
          stroke-miterlimit="10"
        />
        <path
          d="M-906 960.318C-832.44 841.611 -689.04 778.022 -554.28 804.415C-395.64 835.473 -256.92 977.504 -97.5599 965.842C-13.6799 959.704 71.4001 960.441 153.84 941.29C248.28 919.44 300.96 853.396 343.8 767.465C398.88 657.105 441.84 529.191 585.84 535.82C690 540.608 757.56 637.71 850.56 675.028C924.24 704.613 1010.4 690.987 1070.04 640.41C1129.68 589.834 1160.76 504.026 1149 421.901C1139.16 352.665 1102.2 290.795 1076.88 225.488C1009.92 52.8898 1029.12 -151.503 1126.32 -300.285C1223.52 -449.068 1395.6 -537.7 1569.24 -528.247"
          stroke="#153953"
          stroke-miterlimit="10"
        />
        <path
          d="M-897.477 977.259C-822.837 867.881 -680.277 808.712 -546.477 832.895C-479.517 844.925 -416.037 875.492 -353.396 905.077C-289.196 935.521 -225.956 965.105 -159.956 973.699C-138.716 976.522 -117.116 977.136 -95.2765 974.803C-13.0764 966.088 69.8436 964.001 151.924 944.237C244.924 921.895 298.684 858.551 342.964 777.408C353.164 758.749 363.004 739.721 373.084 720.939C402.604 665.698 434.044 613.403 483.844 584.31C511.684 568.106 545.164 558.899 586.804 560.372C689.644 563.932 756.844 652.686 846.964 684.603C858.964 688.777 871.204 691.846 883.564 693.81C945.124 703.385 1010.28 685.217 1057.8 642.497C1114.92 591.184 1144.44 506.236 1133.76 424.97C1124.76 356.102 1090.08 293.864 1066.8 228.557C1026.6 115.865 1022.04 -9.71694 1050.96 -123.882C1066.56 -184.893 1091.64 -242.466 1125.96 -293.288C1188.48 -386.093 1280.52 -454.715 1383.84 -490.929C1443.24 -511.798 1506.36 -521.618 1569.6 -518.795"
          stroke="#153953"
          stroke-miterlimit="10"
        />
        <path
          d="M-888.961 994.322C-813.241 894.151 -671.521 839.524 -538.681 861.62C-471.961 872.669 -408.721 900.412 -346.681 926.682C-283.081 953.689 -221.161 979.346 -156.241 985.238C-135.361 987.202 -114.241 986.957 -92.8808 984.01C-12.4808 972.839 68.5192 967.929 150.119 947.306C241.799 924.473 296.399 863.585 342.239 787.352C352.799 769.797 363.119 751.997 373.439 734.443C403.919 682.885 435.719 634.518 485.519 607.757C513.479 592.78 546.719 584.064 587.639 585.046C689.159 587.379 756.119 667.908 843.359 694.424C854.999 697.861 866.759 700.316 878.759 701.667C938.039 708.173 1000.32 688.163 1045.68 644.952C1100.16 592.903 1128.36 508.814 1118.52 428.284C1110.24 359.785 1078.08 297.301 1056.84 231.871C1020.12 119.179 1018.08 -5.91127 1048.56 -118.726C1065.12 -179.246 1091.04 -236.083 1125.84 -286.045C1189.32 -377.255 1281.48 -444.403 1384.92 -480.494C1444.2 -501.24 1507.08 -511.307 1570.2 -509.097"
          stroke="#153953"
          stroke-miterlimit="10"
        />
        <path
          d="M-880.559 1011.39C-803.759 920.544 -662.879 870.213 -530.879 890.223C-464.519 900.166 -401.518 925.209 -340.078 948.288C-277.078 971.857 -216.358 993.708 -152.758 996.777C-132.238 997.759 -111.718 996.777 -90.7184 993.217C-11.9984 979.468 66.8417 971.612 147.962 950.375C238.202 926.805 293.882 868.74 341.042 797.295C351.962 780.846 362.642 764.273 373.322 747.946C404.762 700.193 437.042 655.632 486.722 631.203C514.802 617.332 547.922 609.23 588.122 609.721C688.322 610.703 754.922 683.253 839.282 704.122C850.442 706.945 861.962 708.541 873.362 709.278C930.362 712.838 989.642 690.987 1032.84 647.039C1084.8 594.253 1111.56 511.023 1102.68 431.23C1095.24 362.977 1065.36 300.37 1046.16 234.817C1012.92 122.003 1013.04 -2.35141 1045.32 -113.816C1062.72 -173.967 1089.6 -229.945 1124.88 -279.048C1189.32 -368.784 1281.6 -434.337 1385.28 -470.428C1444.44 -491.052 1507.2 -501.24 1570.08 -499.645"
          stroke="#153953"
          stroke-miterlimit="10"
        />
        <path
          d="M-872.039 1028.45C-794.159 946.937 -654.119 901.026 -523.079 918.826C-456.959 927.664 -394.319 950.129 -333.479 969.77C-271.199 990.025 -211.559 1007.83 -149.159 1008.07C-129.119 1008.19 -108.959 1006.47 -88.4389 1002.18C-11.5189 986.097 65.4011 975.172 146.041 953.321C234.841 929.26 291.601 873.773 340.201 807.116C351.481 791.771 362.521 776.426 373.561 761.45C405.961 717.379 438.721 676.746 488.281 654.527C516.481 641.883 549.481 634.518 588.961 634.272C687.841 633.781 754.201 698.229 835.561 713.697C846.361 715.784 857.401 716.766 868.441 716.888C923.161 717.379 979.561 693.687 1020.6 649.249C1069.92 595.726 1095.12 513.355 1087.32 434.422C1080.6 366.537 1053.24 303.562 1036.08 237.886C1006.32 125.071 1008.84 1.20844 1042.68 -108.783C1061.04 -168.566 1088.64 -223.684 1124.52 -272.051C1189.92 -360.192 1282.44 -424.271 1386.12 -460.239C1445.16 -480.74 1507.68 -491.174 1570.44 -490.192"
          stroke="#153953"
          stroke-miterlimit="10"
        />
        <path
          d="M-863.52 1045.51C-784.44 973.208 -645.479 931.838 -515.279 947.428C-449.519 955.162 -386.999 974.926 -326.759 991.253C-265.079 1008.07 -206.759 1022.07 -145.439 1019.49C-125.759 1018.75 -106.079 1016.17 -86.1594 1011.26C-10.9193 992.726 63.8407 978.855 144.001 956.267C231.361 931.593 289.201 878.684 339.241 816.937C350.881 802.574 362.401 788.579 373.681 774.83C406.921 734.443 440.161 697.861 489.841 677.851C518.161 666.435 550.921 659.315 589.801 658.824C687.361 657.596 753.361 713.329 831.841 723.395C842.281 724.745 852.841 724.991 863.401 724.5C915.841 721.922 969.361 696.511 1008.24 651.458C1055.04 597.077 1078.8 515.688 1071.96 437.491C1066.08 369.974 1041 306.754 1026 240.955C999.841 128.14 1004.64 4.89131 1040.04 -103.872C1059.36 -163.287 1087.8 -217.546 1124.16 -265.054C1190.4 -351.598 1283.16 -414.082 1387.08 -450.05C1446.12 -470.428 1508.28 -481.108 1570.8 -480.74"
          stroke="#153953"
          stroke-miterlimit="10"
        />
        <path
          d="M-855.121 1062.45C-774.961 999.478 -636.841 962.405 -507.481 976.031C-441.961 982.66 -379.801 999.723 -320.161 1012.86C-259.081 1026.36 -201.961 1036.31 -141.961 1031.03C-122.641 1029.31 -103.441 1026.12 -84.0009 1020.47C-10.5609 999.355 62.2791 982.66 141.959 959.336C227.879 934.17 286.799 883.84 338.279 826.88C350.279 813.622 362.159 800.855 373.799 788.334C407.999 751.752 441.719 718.975 491.279 701.298C519.839 691.109 552.359 684.48 590.519 683.498C686.759 681.043 752.519 728.55 827.999 733.092C838.079 733.706 848.159 733.338 858.239 732.233C908.399 726.586 959.039 699.457 995.759 653.791C1039.92 598.672 1062.24 518.266 1056.36 440.683C1051.2 373.534 1028.52 309.945 1015.56 244.147C992.879 131.332 1000.08 8.69671 1037.04 -98.7167C1057.32 -157.641 1086.6 -211.163 1123.56 -257.811C1190.76 -342.883 1283.64 -403.771 1387.68 -439.616C1446.6 -459.994 1508.64 -470.797 1570.92 -470.919"
          stroke="#153953"
          stroke-miterlimit="10"
        />
        <path
          d="M-846.598 1079.52C-765.358 1025.75 -628.078 993.217 -499.678 1004.63C-434.518 1010.16 -372.478 1024.52 -313.558 1034.34C-253.078 1044.41 -197.278 1050.42 -138.358 1042.44C-119.518 1039.87 -100.678 1035.81 -81.7176 1029.68C-9.95758 1006.11 60.7224 986.466 139.922 962.405C224.522 936.749 284.402 888.995 337.322 836.946C349.682 824.793 361.922 813.131 373.922 801.96C408.962 769.061 443.282 740.335 492.723 724.868C521.403 715.907 553.803 709.769 591.123 708.296C686.043 704.613 751.563 743.895 824.043 742.913C833.763 742.791 843.483 741.686 853.083 739.967C900.843 731.251 948.723 702.28 983.283 656.123C1024.92 600.268 1045.8 520.721 1040.88 443.997C1036.56 377.217 1016.4 313.383 1005.36 247.462C986.403 134.524 995.883 12.5024 1034.28 -93.4378C1055.52 -151.993 1085.52 -204.657 1123.08 -250.568C1191.24 -334.044 1284.36 -393.459 1388.52 -429.304C1447.32 -449.559 1509.12 -460.485 1571.28 -461.344"
          stroke="#153953"
          stroke-miterlimit="10"
        />
        <path
          d="M-838.078 1096.58C-755.758 1052.14 -619.318 1024.27 -491.878 1033.24C-426.958 1037.78 -365.278 1049.44 -306.838 1055.82C-247.078 1062.45 -192.358 1064.54 -134.638 1053.86C-116.158 1050.42 -97.798 1045.63 -79.318 1038.76C-9.23802 1012.74 59.402 990.271 138.122 965.474C221.282 939.326 282.362 894.151 336.482 846.889C349.202 835.841 361.802 825.407 374.162 815.463C410.042 786.37 444.962 761.45 494.282 748.192C523.082 740.458 555.242 734.688 591.962 732.847C685.562 727.937 750.842 758.995 820.322 752.611C829.562 751.752 838.922 750.033 848.042 747.701C893.522 735.916 938.402 705.226 970.922 658.333C1009.92 601.741 1029.48 523.053 1025.4 447.066C1021.8 380.531 1004.04 316.574 995.042 250.53C979.562 137.593 991.442 16.185 1031.52 -88.5277C1053.72 -146.715 1084.56 -198.519 1122.6 -243.571C1191.72 -325.574 1284.96 -383.393 1389.24 -419.115C1447.92 -439.248 1509.48 -450.419 1571.52 -451.892"
          stroke="#153953"
          stroke-miterlimit="10"
        />
        <path
          d="M-829.676 1113.64C-746.276 1078.41 -610.796 1055.09 -484.076 1061.84C-419.516 1065.28 -357.956 1074.24 -300.236 1077.31C-241.076 1080.62 -187.676 1078.78 -131.156 1065.28C-113.036 1060.98 -95.1557 1055.33 -77.1557 1047.84C-8.87569 1019.24 57.7243 993.954 136.084 968.42C217.804 941.781 279.964 899.062 335.524 856.71C348.604 846.767 361.684 837.56 374.284 828.844C411.004 803.433 446.524 782.564 495.844 771.516C524.764 765.01 556.804 759.731 592.804 757.399C685.084 751.261 750.124 773.971 816.724 762.186C825.604 760.59 834.484 758.135 843.244 755.189C886.444 740.335 928.444 707.804 958.804 660.42C995.285 603.092 1013.28 525.263 1010.28 450.135C1007.52 383.968 992.165 319.643 985.205 253.477C973.204 140.539 987.604 19.7451 1029.12 -83.6172C1052.28 -141.314 1083.96 -192.381 1122.48 -236.574C1192.44 -316.98 1285.92 -373.326 1390.44 -408.926C1449 -428.936 1510.44 -440.352 1572.24 -442.317"
          stroke="#153953"
          stroke-miterlimit="10"
        />
        <path
          d="M-821.16 1130.71C-736.68 1104.8 -602.04 1085.78 -476.28 1090.44C-411.96 1092.77 -350.76 1099.03 -293.64 1098.91C-235.08 1098.79 -182.88 1093.14 -127.56 1076.69C-109.92 1071.41 -92.4 1065.03 -74.8799 1056.93C-8.27993 1025.87 56.28 997.759 134.04 971.366C214.44 944.237 277.68 904.095 334.56 866.531C348 857.692 361.44 849.713 374.4 842.225C411.96 820.497 448.08 803.679 497.28 794.84C526.44 789.562 558.12 784.774 593.52 781.951C684.48 774.585 749.28 789.07 812.88 771.762C821.4 769.429 829.8 766.36 838.08 762.8C879 744.877 918.12 710.628 946.32 662.63C980.16 604.565 996.84 527.596 994.68 453.204C992.76 387.406 979.68 322.835 974.76 256.546C966.36 143.608 983.04 23.3051 1026.12 -78.5842C1050.36 -135.912 1082.64 -186.12 1121.76 -229.577C1192.68 -308.387 1286.28 -363.26 1390.92 -398.86C1449.36 -418.747 1510.56 -430.286 1572.12 -432.987"
          stroke="#153953"
          stroke-miterlimit="10"
        />
        <path
          d="M-812.637 1147.65C-727.077 1131.07 -593.277 1116.47 -468.477 1119.04C-404.517 1120.39 -343.557 1123.83 -286.917 1120.39C-229.077 1116.96 -178.077 1107.26 -123.837 1088.11C-106.557 1081.97 -89.5165 1074.85 -72.5965 1066.01C-7.79651 1032.38 54.8435 1001.44 132.123 974.435C211.084 946.814 275.524 909.251 333.724 876.474C347.524 868.74 361.324 861.989 374.644 855.728C413.044 837.805 449.764 824.916 498.844 818.164C528.124 814.113 559.684 809.817 594.244 806.502C683.884 797.786 748.444 804.047 809.044 781.459C817.204 778.39 825.244 774.585 832.924 770.411C871.564 749.42 907.804 713.451 933.724 664.839C965.044 606.038 980.284 529.928 979.084 456.273C978.004 390.843 967.324 326.027 964.444 259.614C959.524 146.677 978.724 26.9878 1023.24 -73.6739C1048.44 -130.511 1081.56 -179.982 1121.16 -222.579C1193.04 -299.917 1286.88 -353.194 1391.64 -388.671C1449.96 -408.435 1511.04 -420.22 1572.36 -423.535"
          stroke="#153953"
          stroke-miterlimit="10"
        />
        <path
          d="M-804.238 1164.71C-717.478 1157.34 -584.638 1147.28 -460.678 1147.65C-396.958 1147.89 -336.238 1148.75 -280.318 1141.88C-223.078 1135 -173.278 1121.5 -120.358 1099.53C-103.438 1092.53 -86.8782 1084.55 -70.4382 1075.1C-7.31817 1039.01 53.1618 1005.25 129.962 977.381C207.602 949.27 273.122 914.406 332.642 886.295C346.802 879.666 360.962 874.142 374.642 869.109C413.882 854.869 451.202 846.03 500.162 841.488C529.562 838.787 561.002 834.736 594.842 830.931C683.162 820.987 747.482 818.9 805.082 790.912C812.882 787.106 820.442 782.687 827.762 777.899C864.122 753.839 897.362 716.029 921.242 666.803C949.922 607.265 963.842 532.015 963.482 459.219C963.242 394.035 954.842 328.973 954.002 262.561C952.562 149.623 974.282 30.5477 1020.24 -68.7636C1046.4 -125.232 1080.36 -173.845 1120.56 -215.582C1193.4 -291.324 1287.36 -343.005 1392.24 -378.482C1450.44 -398.246 1511.28 -410.154 1572.48 -413.959"
          stroke="#153953"
          stroke-miterlimit="10"
        />
        <path
          d="M-795.719 1181.77C-707.879 1183.74 -575.879 1177.97 -452.879 1176.25C-389.519 1175.39 -329.039 1173.55 -273.719 1163.48C-217.079 1153.17 -168.479 1135.74 -116.759 1111.06C-100.319 1103.21 -84.1186 1094.37 -68.1586 1084.3C-6.83858 1045.63 51.7214 1009.18 128.041 980.45C204.241 951.848 271.082 919.562 331.682 896.361C346.322 890.837 360.721 886.54 374.761 882.858C414.841 872.3 452.881 867.636 501.722 865.18C531.362 863.707 562.442 860.147 595.682 855.851C682.802 844.68 746.762 834.245 801.362 800.855C808.802 796.313 815.882 791.157 822.722 785.756C856.802 758.626 887.162 719.098 908.882 669.258C935.042 608.984 947.522 534.593 948.122 462.534C948.602 397.717 942.722 332.41 943.922 265.875C945.962 152.815 970.082 34.476 1017.6 -63.485C1044.72 -119.585 1079.4 -167.338 1120.2 -208.217C1193.88 -282.363 1288.08 -332.571 1393.2 -367.925C1451.4 -387.566 1511.88 -399.72 1572.96 -404.139"
          stroke="#153953"
          stroke-miterlimit="10"
        />
        <path
          d="M-787.199 1198.84C-698.279 1210.01 -567.119 1208.78 -445.079 1204.85C-381.959 1202.89 -321.719 1198.35 -266.999 1184.97C-210.959 1171.34 -163.679 1149.98 -113.039 1122.48C-96.9591 1113.77 -81.2391 1104.07 -65.7591 1093.39C-6.11909 1052.14 50.281 1012.86 126.121 983.519C201.001 954.426 268.921 924.841 330.841 906.304C345.841 901.885 360.601 898.816 375.001 896.361C415.921 889.364 454.561 887.522 503.281 888.504C533.041 889.118 564.001 885.19 596.521 880.402C682.321 867.881 746.041 849.222 797.641 810.43C804.721 805.152 811.321 799.382 817.801 793.367C849.601 763.168 877.081 721.799 896.641 671.468C920.161 610.457 931.321 536.925 932.761 465.603C934.081 401.155 930.481 335.602 933.721 268.821C939.241 155.761 965.881 38.0361 1014.96 -58.6974C1043.16 -114.307 1078.56 -161.323 1119.84 -201.465C1194.48 -274.138 1288.92 -322.75 1394.04 -358.104C1452.12 -377.623 1512.48 -389.899 1573.32 -394.932"
          stroke="#153953"
          stroke-miterlimit="10"
        />
        <path
          d="M-778.797 1215.78C-688.797 1236.28 -558.597 1239.1 -437.277 1233.33C-374.517 1230.14 -314.517 1223.14 -260.397 1206.33C-205.077 1189.26 -158.877 1164.1 -109.557 1133.65C-93.8368 1123.95 -78.5968 1113.64 -63.5968 1102.23C-5.75677 1058.52 48.7232 1016.42 124.083 986.22C197.523 956.758 266.643 929.628 329.883 915.88C345.243 912.565 360.363 910.601 375.123 909.496C416.763 906.182 456.123 909.864 504.723 911.583C534.723 912.688 565.323 909.987 597.123 904.709C681.603 890.96 745.083 863.953 793.803 819.883C800.403 813.867 806.763 807.361 812.643 800.732C842.163 767.465 866.763 724.377 884.163 673.432C905.163 611.685 914.763 539.012 917.163 468.549C919.323 404.469 917.883 338.548 923.403 271.768C932.163 158.707 961.563 41.5961 1012.08 -53.787C1041.24 -109.028 1077.48 -155.185 1119.24 -194.468C1194.84 -265.545 1289.4 -312.684 1394.76 -347.916C1452.72 -367.311 1512.84 -379.833 1573.44 -385.479"
          stroke="#153953"
          stroke-miterlimit="10"
        />
        <path
          d="M-770.277 1232.84C-679.197 1262.67 -549.837 1269.91 -429.477 1262.06C-366.957 1257.76 -307.317 1248.06 -253.797 1228.05C-199.077 1207.68 -154.197 1178.46 -105.957 1145.31C-90.7173 1134.76 -75.9573 1123.59 -61.3173 1111.56C-5.15725 1065.28 47.2828 1020.47 122.163 989.412C194.283 959.459 264.483 935.153 329.043 925.946C344.763 923.736 360.243 923.245 375.363 923.122C417.843 922.631 457.803 931.224 506.283 935.153C536.403 937.485 566.883 935.153 597.963 929.506C681.123 914.406 744.243 879.052 790.083 829.703C796.323 822.952 802.203 815.832 807.603 808.589C834.843 772.252 856.563 727.323 871.803 675.887C890.163 613.403 898.443 541.59 901.803 471.863C904.803 408.029 905.763 341.985 913.203 275.082C925.563 162.022 957.363 45.5243 1009.32 -48.6312C1039.56 -103.381 1076.4 -148.802 1118.76 -187.225C1195.2 -256.706 1290 -302.372 1395.48 -337.481C1453.32 -356.754 1513.2 -369.521 1573.68 -375.782"
          stroke="#153953"
          stroke-miterlimit="10"
        />
        <path
          d="M-761.762 1249.9C-669.602 1288.94 -541.082 1300.73 -421.682 1290.66C-359.522 1285.26 -300.002 1272.86 -247.082 1249.54C-192.962 1225.72 -149.162 1192.82 -102.242 1156.73C-87.3615 1145.31 -73.0815 1133.28 -59.0415 1120.64C-4.6815 1071.78 45.8385 1024.27 120.119 992.358C190.799 962.036 262.199 940.308 328.079 935.766C344.159 934.661 359.999 935.152 375.479 936.503C418.799 940.431 459.359 952.461 507.719 958.354C537.959 962.037 568.319 960.072 598.679 953.935C680.519 937.485 743.279 893.906 786.239 839.156C792.119 831.667 797.519 823.811 802.559 815.954C827.399 776.549 846.239 729.901 859.439 677.729C875.279 614.385 882.119 543.554 886.319 474.564C890.159 411.098 893.399 344.809 902.999 277.783C918.839 164.722 953.159 48.8387 1006.56 -43.9665C1037.76 -98.2256 1075.44 -143.032 1118.28 -180.596C1195.68 -248.604 1290.6 -292.674 1396.32 -327.661C1454.04 -346.811 1513.8 -359.7 1574.04 -366.575"
          stroke="#153953"
          stroke-miterlimit="10"
        />
        <path
          d="M-753.363 1266.97C-660.123 1315.33 -532.443 1331.42 -413.883 1319.26C-351.963 1312.76 -292.803 1297.66 -240.483 1271.02C-187.083 1243.89 -144.483 1206.94 -98.6431 1168.15C-84.1231 1155.87 -70.3232 1142.98 -56.7632 1129.72C-4.32318 1078.17 44.3969 1028.2 118.197 995.427C187.557 964.615 260.037 944.728 327.117 945.833C343.677 946.078 359.877 947.428 375.717 950.129C419.877 957.617 461.037 973.944 509.397 981.923C539.757 986.956 569.877 985.238 599.637 978.732C680.157 961.055 742.677 909.128 782.637 849.099C788.157 840.874 793.077 832.404 797.637 823.934C820.197 781.459 836.157 733.093 847.197 680.307C860.397 616.227 866.037 546.255 871.077 478.124C875.757 415.026 881.397 348.369 893.037 281.343C912.357 168.16 949.317 53.0126 1004.04 -38.4422C1036.32 -92.333 1074.72 -136.28 1118.04 -172.985C1196.4 -239.397 1291.56 -281.994 1397.28 -316.98C1454.88 -336.008 1514.4 -349.143 1574.52 -356.631"
          stroke="#153953"
          stroke-miterlimit="10"
        />
        <path
          d="M-744.84 1284.03C-650.4 1341.6 -523.68 1362.23 -406.08 1347.87C-344.52 1340.25 -285.48 1322.58 -233.76 1292.62C-180.96 1262.06 -139.56 1221.3 -95.0397 1179.69C-80.8797 1166.55 -67.5597 1152.93 -54.4797 1138.93C-3.71968 1084.92 42.9603 1032.13 116.16 998.496C184.2 967.315 257.76 950.988 326.16 955.776C343.08 957.003 359.64 959.704 375.84 963.632C420.96 974.681 462.48 995.304 510.84 1005.37C541.32 1011.75 571.32 1010.4 600.241 1003.41C679.441 984.378 741.601 924.227 778.681 858.797C783.841 849.836 788.401 840.629 792.481 831.545C812.761 786.001 825.841 735.793 834.601 682.516C845.281 617.7 849.481 548.587 855.361 481.193C861.001 418.464 868.801 351.56 882.481 284.289C905.281 171.106 944.881 56.6953 1000.92 -33.6547C1034.28 -87.0545 1073.28 -130.265 1117.32 -166.111C1196.64 -231.05 1291.92 -271.928 1397.88 -306.914C1455.36 -325.942 1514.76 -339.2 1574.52 -347.302"
          stroke="#153953"
          stroke-miterlimit="10"
        />
        <path
          d="M-736.324 1300.97C-640.804 1367.87 -515.044 1392.92 -398.284 1376.47C-336.964 1367.75 -278.284 1347.37 -227.164 1314.11C-174.964 1280.1 -134.764 1235.54 -91.4441 1190.98C-77.7641 1176.99 -64.8041 1162.5 -52.2041 1148.02C-3.24407 1091.42 41.5159 1036.06 114.236 1001.44C180.956 969.893 255.476 956.267 325.316 965.597C342.596 967.929 359.516 971.734 376.076 977.013C422.036 991.621 464.156 1016.54 512.396 1028.69C543.116 1036.43 572.756 1035.32 601.076 1027.96C678.836 1007.46 740.636 939.081 774.956 868.372C779.636 858.674 783.836 848.853 787.436 839.156C805.436 790.543 815.636 738.617 822.236 684.726C830.276 619.173 833.156 550.919 839.996 484.262C846.476 421.901 856.676 354.752 872.396 287.358C898.676 174.175 940.796 60.378 998.396 -28.6217C1032.84 -81.5304 1072.56 -124.005 1117.08 -159.114C1197.24 -222.457 1292.76 -261.862 1398.84 -296.725C1456.32 -315.63 1515.36 -329.134 1575 -337.727"
          stroke="#153953"
          stroke-miterlimit="10"
        />
        <path
          d="M-727.801 1318.04C-580.321 1434.29 -366.841 1441.65 -220.441 1335.59C-168.961 1298.27 -129.961 1249.66 -87.7206 1202.4C-22.5606 1129.36 21.5994 1048.83 112.319 1004.39C193.799 964.492 291.359 957.249 376.199 990.516C422.999 1008.81 465.719 1037.9 513.839 1052.02C641.759 1089.46 748.2 959.09 782.4 846.767C817.2 732.356 810.48 607.388 824.64 487.331C844.2 320.994 901.32 116.233 995.64 -23.5885C1094.76 -170.653 1234.56 -232.4 1399.56 -286.536C1456.92 -305.318 1515.72 -318.945 1575.24 -328.274"
          stroke="#153953"
          stroke-miterlimit="10"
        />
      </g>
    </svg>
  ),
  hero: (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      height={"1em"}
      width={"1em"}
      fill="none"
      viewBox="0 0 24 24"
      strokeWidth={1.5}
      stroke="currentColor"
      className="size-6"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M3 8.25V18a2.25 2.25 0 0 0 2.25 2.25h13.5A2.25 2.25 0 0 0 21 18V8.25m-18 0V6a2.25 2.25 0 0 1 2.25-2.25h13.5A2.25 2.25 0 0 1 21 6v2.25m-18 0h18M5.25 6h.008v.008H5.25V6ZM7.5 6h.008v.008H7.5V6Zm2.25 0h.008v.008H9.75V6Z"
      />
    </svg>
  ),
  github: (
    <svg
      height={"1em"}
      width={"1em"}
      fill="currentColor"
      stroke="currentColor"
      viewBox="0 0 24 24"
      xmlns="http://www.w3.org/2000/svg"
    >
      <g clipPath="url(#clip0_2875_573)">
        <path d="M12.0099 0C5.36875 0 0 5.40833 0 12.0992C0 17.4475 3.43994 21.9748 8.21205 23.5771C8.80869 23.6976 9.02724 23.3168 9.02724 22.9965C9.02724 22.716 9.00757 21.7545 9.00757 20.7527C5.6667 21.474 4.97099 19.3104 4.97099 19.3104C4.43409 17.9082 3.63858 17.5478 3.63858 17.5478C2.54511 16.8066 3.71823 16.8066 3.71823 16.8066C4.93117 16.8868 5.56763 18.0486 5.56763 18.0486C6.64118 19.8913 8.37111 19.3707 9.06706 19.0501C9.16638 18.2688 9.48473 17.728 9.82275 17.4276C7.15817 17.1471 4.35469 16.1055 4.35469 11.458C4.35469 10.1359 4.8316 9.05428 5.58729 8.21304C5.46807 7.91263 5.0504 6.67043 5.70677 5.00787C5.70677 5.00787 6.72083 4.6873 9.00732 6.24981C9.98625 5.98497 10.9958 5.85024 12.0099 5.84911C13.024 5.84911 14.0577 5.98948 15.0123 6.24981C17.299 4.6873 18.3131 5.00787 18.3131 5.00787C18.9695 6.67043 18.5515 7.91263 18.4323 8.21304C19.2079 9.05428 19.6652 10.1359 19.6652 11.458C19.6652 16.1055 16.8617 17.1269 14.1772 17.4276C14.6148 17.8081 14.9924 18.5292 14.9924 19.6711C14.9924 21.2936 14.9727 22.5957 14.9727 22.9962C14.9727 23.3168 15.1915 23.6976 15.7879 23.5774C20.56 21.9745 23.9999 17.4475 23.9999 12.0992C24.0196 5.40833 18.6312 0 12.0099 0Z" />
      </g>
      <defs>
        <clipPath id="clip0_2875_573">
          <rect width="24" height="24" fill="white" />
        </clipPath>
      </defs>
    </svg>
  ),
  youtube: (
    <svg
      height={"1em"}
      fill="currentColor"
      stroke="currentColor"
      width={"1em"}
      viewBox="0 0 24 24"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path d="M23.7609 7.20005C23.7609 7.20005 23.5266 5.54536 22.8047 4.8188C21.8906 3.86255 20.8688 3.85786 20.4 3.80161C17.0438 3.55786 12.0047 3.55786 12.0047 3.55786H11.9953C11.9953 3.55786 6.95625 3.55786 3.6 3.80161C3.13125 3.85786 2.10938 3.86255 1.19531 4.8188C0.473438 5.54536 0.24375 7.20005 0.24375 7.20005C0.24375 7.20005 0 9.14536 0 11.086V12.9047C0 14.8454 0.239062 16.7907 0.239062 16.7907C0.239062 16.7907 0.473437 18.4454 1.19062 19.1719C2.10469 20.1282 3.30469 20.0954 3.83906 20.1985C5.76094 20.3813 12 20.4375 12 20.4375C12 20.4375 17.0438 20.4282 20.4 20.1891C20.8688 20.1329 21.8906 20.1282 22.8047 19.1719C23.5266 18.4454 23.7609 16.7907 23.7609 16.7907C23.7609 16.7907 24 14.85 24 12.9047V11.086C24 9.14536 23.7609 7.20005 23.7609 7.20005ZM9.52031 15.1125V8.36724L16.0031 11.7516L9.52031 15.1125Z" />
    </svg>
  ),
  discord: (
    <svg
      height={"1em"}
      fill="currentColor"
      stroke="currentColor"
      width={"1em"}
      viewBox="0 0 24 24"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path d="M20.317 4.15557C18.7873 3.45369 17.147 2.93658 15.4319 2.6404C15.4007 2.63469 15.3695 2.64897 15.3534 2.67754C15.1424 3.05276 14.9087 3.54225 14.7451 3.927C12.9004 3.65083 11.0652 3.65083 9.25832 3.927C9.09465 3.5337 8.85248 3.05276 8.64057 2.67754C8.62449 2.64992 8.59328 2.63564 8.56205 2.6404C6.84791 2.93563 5.20756 3.45275 3.67693 4.15557C3.66368 4.16129 3.65233 4.17082 3.64479 4.18319C0.533392 8.83155 -0.31895 13.3657 0.0991801 17.8436C0.101072 17.8655 0.11337 17.8864 0.130398 17.8997C2.18321 19.4073 4.17171 20.3225 6.12328 20.9291C6.15451 20.9386 6.18761 20.9272 6.20748 20.9015C6.66913 20.2711 7.08064 19.6063 7.43348 18.9073C7.4543 18.8664 7.43442 18.8178 7.39186 18.8016C6.73913 18.554 6.1176 18.2521 5.51973 17.9093C5.47244 17.8816 5.46865 17.814 5.51216 17.7816C5.63797 17.6873 5.76382 17.5893 5.88396 17.4902C5.90569 17.4721 5.93598 17.4683 5.96153 17.4797C9.88928 19.273 14.1415 19.273 18.023 17.4797C18.0485 17.4674 18.0788 17.4712 18.1015 17.4893C18.2216 17.5883 18.3475 17.6873 18.4742 17.7816C18.5177 17.814 18.5149 17.8816 18.4676 17.9093C17.8697 18.2588 17.2482 18.554 16.5945 18.8006C16.552 18.8168 16.533 18.8664 16.5538 18.9073C16.9143 19.6054 17.3258 20.2701 17.7789 20.9005C17.7978 20.9272 17.8319 20.9386 17.8631 20.9291C19.8241 20.3225 21.8126 19.4073 23.8654 17.8997C23.8834 17.8864 23.8948 17.8664 23.8967 17.8445C24.3971 12.6676 23.0585 8.17064 20.3482 4.18414C20.3416 4.17082 20.3303 4.16129 20.317 4.15557ZM8.02002 15.117C6.8375 15.117 5.86313 14.0313 5.86313 12.6981C5.86313 11.3648 6.8186 10.2791 8.02002 10.2791C9.23087 10.2791 10.1958 11.3743 10.1769 12.6981C10.1769 14.0313 9.22141 15.117 8.02002 15.117ZM15.9947 15.117C14.8123 15.117 13.8379 14.0313 13.8379 12.6981C13.8379 11.3648 14.7933 10.2791 15.9947 10.2791C17.2056 10.2791 18.1705 11.3743 18.1516 12.6981C18.1516 14.0313 17.2056 15.117 15.9947 15.117Z" />
    </svg>
  ),
  twitter: (
    <svg
      height={"1em"}
      width={"1em"}
      fill="currentColor"
      stroke="currentColor"
      viewBox="0 0 1920 1920"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M1920 311.856c-70.701 33.769-146.598 56.47-226.221 66.86 81.317-52.517 143.774-135.529 173.252-234.691-76.236 48.678-160.716 84.028-250.391 103.002-71.718-82.56-174.268-134.06-287.435-134.06-217.75 0-394.165 189.966-394.165 424.206 0 33.318 3.614 65.619 10.165 96.678C617.9 616.119 327.304 447.385 133.045 190.67c-33.77 62.57-53.309 135.53-53.309 213.233 0 147.162 91.031 276.818 196.744 353.054-64.602-2.26-157.101-21.46-157.101-53.309v5.648c0 205.327 114.41 376.658 294.55 415.849-32.978 9.487-78.38 14.795-114.409 14.795-25.412 0-55.454-2.71-79.624-7.793 50.26 168.509 193.13 291.163 365.478 294.777-134.852 113.506-306.07 181.383-490.616 181.383-31.85 0-64.038-2.033-94.758-5.873 174.494 120.17 381.176 190.532 603.67 190.532 724.97 0 1121.055-646.136 1121.055-1206.55 0-18.41-.452-36.932-1.356-55.116 77.026-59.746 143.887-134.4 196.631-219.444"
        fill-rule="evenodd"
      />
    </svg>
  ),
  features: (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      height={"1em"}
      width={"1em"}
      fill="none"
      viewBox="0 0 24 24"
      strokeWidth={1.5}
      stroke="currentColor"
      className="size-6"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M9 4.5v15m6-15v15m-10.875 0h15.75c.621 0 1.125-.504 1.125-1.125V5.625c0-.621-.504-1.125-1.125-1.125H4.125C3.504 4.5 3 5.004 3 5.625v12.75c0 .621.504 1.125 1.125 1.125Z"
      />
    </svg>
  ),

  instagram: (
    <svg
      height={"1em"}
      width={"1em"}
      fill="currentColor"
      stroke="currentColor"
      viewBox="0 0 24 24"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        fill-rule="evenodd"
        clipRule="evenodd"
        d="M12 18C15.3137 18 18 15.3137 18 12C18 8.68629 15.3137 6 12 6C8.68629 6 6 8.68629 6 12C6 15.3137 8.68629 18 12 18ZM12 16C14.2091 16 16 14.2091 16 12C16 9.79086 14.2091 8 12 8C9.79086 8 8 9.79086 8 12C8 14.2091 9.79086 16 12 16Z"
      />
      <path d="M18 5C17.4477 5 17 5.44772 17 6C17 6.55228 17.4477 7 18 7C18.5523 7 19 6.55228 19 6C19 5.44772 18.5523 5 18 5Z" />
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M1.65396 4.27606C1 5.55953 1 7.23969 1 10.6V13.4C1 16.7603 1 18.4405 1.65396 19.7239C2.2292 20.8529 3.14708 21.7708 4.27606 22.346C5.55953 23 7.23969 23 10.6 23H13.4C16.7603 23 18.4405 23 19.7239 22.346C20.8529 21.7708 21.7708 20.8529 22.346 19.7239C23 18.4405 23 16.7603 23 13.4V10.6C23 7.23969 23 5.55953 22.346 4.27606C21.7708 3.14708 20.8529 2.2292 19.7239 1.65396C18.4405 1 16.7603 1 13.4 1H10.6C7.23969 1 5.55953 1 4.27606 1.65396C3.14708 2.2292 2.2292 3.14708 1.65396 4.27606ZM13.4 3H10.6C8.88684 3 7.72225 3.00156 6.82208 3.0751C5.94524 3.14674 5.49684 3.27659 5.18404 3.43597C4.43139 3.81947 3.81947 4.43139 3.43597 5.18404C3.27659 5.49684 3.14674 5.94524 3.0751 6.82208C3.00156 7.72225 3 8.88684 3 10.6V13.4C3 15.1132 3.00156 16.2777 3.0751 17.1779C3.14674 18.0548 3.27659 18.5032 3.43597 18.816C3.81947 19.5686 4.43139 20.1805 5.18404 20.564C5.49684 20.7234 5.94524 20.8533 6.82208 20.9249C7.72225 20.9984 8.88684 21 10.6 21H13.4C15.1132 21 16.2777 20.9984 17.1779 20.9249C18.0548 20.8533 18.5032 20.7234 18.816 20.564C19.5686 20.1805 20.1805 19.5686 20.564 18.816C20.7234 18.5032 20.8533 18.0548 20.9249 17.1779C20.9984 16.2777 21 15.1132 21 13.4V10.6C21 8.88684 20.9984 7.72225 20.9249 6.82208C20.8533 5.94524 20.7234 5.49684 20.564 5.18404C20.1805 4.43139 19.5686 3.81947 18.816 3.43597C18.5032 3.27659 18.0548 3.14674 17.1779 3.0751C16.2777 3.00156 15.1132 3 13.4 3Z"
      />
    </svg>
  ),
};
