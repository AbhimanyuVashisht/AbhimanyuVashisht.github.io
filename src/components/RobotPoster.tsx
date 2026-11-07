// A still picture of the robot for visitors who don't get the 3D scene. It sits where the
// scene would: beside the copy on desktop, in the band above it on phones.
export default function RobotPoster() {
  return (
    <picture className="pointer-events-none absolute inset-x-0 top-16 -z-10 h-[clamp(220px,40svh,340px)] lg:inset-y-0 lg:left-auto lg:right-0 lg:top-auto lg:bottom-[11vh] lg:h-auto lg:w-[58vw]">
      <source media="(min-width: 1024px)" srcSet="/robot/robot-wide.webp" />
      <img
        src="/robot/robot-narrow.webp"
        alt=""
        aria-hidden="true"
        decoding="async"
        className="h-full w-full object-contain object-bottom lg:h-auto lg:max-h-[80vh] lg:object-right-bottom"
      />
    </picture>
  )
}
