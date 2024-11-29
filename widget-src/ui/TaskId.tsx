const { widget } = figma
const { Text, SVG } = widget

const TaskId = ({ id }: { id: string }) => {
  const handleClick = (event: WidgetClickEvent) => {
    // 이미 존재하는 컴포넌트 확인
    const existingComponent = figma.currentPage.findOne(
      node => node.name === `Task-${id}`
    )

    // 이미 존재하는 경우 함수 종료
    if (existingComponent) {
      figma.viewport.scrollAndZoomIntoView([existingComponent])
      figma.notify('이미 생성된 태스크입니다.')
      return
    }

    // 클릭한 위젯의 위치 정보 가져오기
    const widgetX = event.canvasX
    const widgetY = event.canvasY

    // 새로운 SVG 컴포넌트 생성
    const newComponent = figma.createNodeFromSvg(`<svg width="30" height="30" viewBox="0 0 30 30" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M15 0L28 7.5V22.5L15 30L2 22.5V7.5L15 0Z" fill="#2D7FF9"/>
      <text x="15" y="20" font-size="16" fill="white" text-anchor="middle">${id}</text>
    </svg>`)

    // 위치 설정
    newComponent.x = widgetX + 30
    newComponent.y = widgetY

    // 그룹 생성
    const group = figma.group([newComponent], figma.currentPage)
    group.name = `Task-${id}`

  }

  return (
    <SVG
      src={`<svg width="30" height="30" viewBox="0 0 30 30" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M15 0L28 7.5V22.5L15 30L2 22.5V7.5L15 0Z" fill="#2D7FF9"/>
        <text x="15" y="20" font-size="16" fill="white" text-anchor="middle">${id}</text>
      </svg>`}
      onClick={handleClick}

    />
  )
}

export default TaskId
