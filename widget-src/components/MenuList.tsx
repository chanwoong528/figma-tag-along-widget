const { widget } = figma
const { useSyncedState, Frame, usePropertyMenu, AutoLayout, Text, SVG, Input } = widget



const MenuList = ({ x, y }: { x: number, y: number }) => {
  return (
    <>
      {/* 배경 오버레이 */}
      <AutoLayout
        direction="vertical"
        spacing={8}
        positioning="absolute"
        x={x}
        y={y}
      >

        {/* 팝업 컨텐츠 */}

        <Text>팝업 내용</Text>

      </AutoLayout>
    </>
  )
}

export default MenuList