const { widget } = figma
const { SVG, } = widget

const Minus = ({ onClick, type }: { onClick: () => void, type?: "small" }) => {
  const size = type === 'small' ? 20 : 30
  return (
    <>
      <SVG
        width={size}
        height={size}
        src={`<svg width="30" height="30" viewBox="0 0 30 30" fill="none" xmlns="http://www.w3.org/2000/svg">
  <rect width="30" height="30" rx="15" fill="white"/>
  <rect x="7.5" y="14.0625" width="15" height="1.875" fill="black" fill-opacity="0.8"/>
  <rect x="0.5" y="0.5" width="29" height="29" rx="14.5" stroke="black" stroke-opacity="0.1"/>
  </svg>`}
        onClick={onClick}
      ></SVG>
    </>
  )
}

export default Minus
