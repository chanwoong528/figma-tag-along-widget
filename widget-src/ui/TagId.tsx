const { widget } = figma;
const { Text, SVG, Frame, usePropertyMenu, AutoLayout } = widget;
interface TaskProps {
  id: string;
  type: string;
  description: string;
}
import { TASK_TYPE } from "../../common/constant";
export const TagId = ({
  pointerInfo,
}: {
  pointerInfo: { id: string; type: string; x: number; y: number, orderIdx: string };
}) => {
  return (
    <AutoLayout
      name={`TagId-${pointerInfo.id}-${pointerInfo.type}`}
      width={30}
      height={30}
      x={pointerInfo.x}
      y={pointerInfo.y}>
      <SVG
        src={`<svg width="30" height="30" viewBox="0 0 30 30" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M15 0L28 7.5V22.5L15 30L2 22.5V7.5L15 0Z" fill="${TASK_TYPE.find((taskType) => taskType.option === pointerInfo.type)
            ?.color
          }"/>
        <text x="15" y="20" font-size="16" fill="white" text-anchor="middle">${
          // pointerInfo.id
          pointerInfo.orderIdx
          }</text>
      </svg>`}
      />
    </AutoLayout>
  );
};
