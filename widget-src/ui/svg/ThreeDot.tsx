const { widget } = figma
const { SVG } = widget



const ThreeDot = ({ onClick }: { onClick: (e: WidgetClickEvent) => void }) => {
  return <SVG
    src={`<svg width="30" height="30" viewBox="0 0 16 16" xmlns="http://www.w3.org/2000/svg" fill="#000000" class="bi bi-three-dots-vertical">

  <path d="M9.5 13a1.5 1.5 0 1 1-3 0 1.5 1.5 0 0 1 3 0zm0-5a1.5 1.5 0 1 1-3 0 1.5 1.5 0 0 1 3 0zm0-5a1.5 1.5 0 1 1-3 0 1.5 1.5 0 0 1 3 0z"/>
</svg>`}
    onClick={onClick}
  ></SVG>
}

export default ThreeDot
