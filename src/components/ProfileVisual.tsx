'use client'

export default function ProfileVisual() {
  return (
    <div className="profile-visual">
      <div className="profile-ring-outer">
        <div className="profile-ring-inner">
          <img
            className="profile-img profile-img-secondary"
            src="/plugins/localCss/prof-secondary.png"
            alt=""
            aria-hidden="true"
          />
          <img
            className="profile-img profile-img-primary"
            src="/plugins/localCss/prof-img2.jpg"
            alt="Abhimanyu Vashisht"
          />
          <div className="profile-sheen" aria-hidden="true" />
        </div>
      </div>
      <div className="logo-wrap">
        <svg
          viewBox="0 0 200 200"
          width="200"
          height="200"
          className="logo"
          aria-hidden="true"
          focusable="false"
        >
          <defs>
            <path id="name-circle" d="M 100 50 a 50 50 0 0 1 0 100 a 50 50 0 0 1 0 -100" />
          </defs>
          <text width="400">
            <textPath
              alignmentBaseline="hanging"
              href="#name-circle"
              className="logo-text"
              stroke="#fff"
              fill="none"
              strokeWidth="1.5"
            >
              Building things • since 2015 •
            </textPath>
          </text>
        </svg>
      </div>
    </div>
  )
}
