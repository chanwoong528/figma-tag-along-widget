const { widget } = figma
const { SVG } = widget



const Plus = ({ onClick, type }: { onClick: () => void, type?: "small" }) => {

  const size = type === 'small' ? 20 : 30

  return (
    <SVG
      width={size}
      height={size}
      src={`<svg width="30" height="30" viewBox="0 0 30 30" fill="none" xmlns="http://www.w3.org/2000/svg">
  <rect width="30" height="30" rx="15" fill="white"/>
  <path d="M15.9375 7.5H14.0625V14.0625H7.5V15.9375H14.0625V22.5H15.9375V15.9375H22.5V14.0625H15.9375V7.5Z" fill="black" fill-opacity="0.8"/>
  <rect x="0.5" y="0.5" width="29" height="29" rx="14.5" stroke="black" stroke-opacity="0.1"/>
  </svg>`}
      onClick={onClick}
    ></SVG>
  )
}

export default Plus
