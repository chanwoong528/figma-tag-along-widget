import { getTaskStore } from "../store/taskStore";

const { widget } = figma
const { Text, SVG, Frame, usePropertyMenu, AutoLayout } = widget
interface TaskProps {
  id: string;
  type: string;
  description: string;

}
const TASK_TYPE = [{
  option: 'Visible',
  color: '#2D7FF9'
}, {
  option: 'Hidden',
  color: '#808080'
}]
export const TagId = ({ pointerInfo, tasks }: { pointerInfo: { id: string, type: string, x: number, y: number }, tasks: TaskProps[] }) => {

  usePropertyMenu(
    [
      {
        itemType: 'action',
        propertyName: 'show-task',
        tooltip: 'Task Type',
      }
    ],
    (property) => {
      if (property.propertyName === 'show-task') {
        const targetTask = tasks.find(task => task.id === pointerInfo.id && task.type === pointerInfo.type)
        if (targetTask) {
          console.log(getTaskStore())
          // console.log("targetTask>> ", targetTask)
        }
      }
      console.log(property)
    }
  )




  return (
    <AutoLayout
      name={`TagId-${pointerInfo.id}-${pointerInfo.type}`}
      direction="vertical"
      width={30}
      height={30}
      x={pointerInfo.x}
      y={pointerInfo.y}
    >
      <SVG

        src={`<svg width="30" height="30" viewBox="0 0 30 30" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M15 0L28 7.5V22.5L15 30L2 22.5V7.5L15 0Z" fill="${TASK_TYPE.find(taskType => taskType.option === pointerInfo.type)?.color}"/>
        <text x="15" y="20" font-size="16" fill="white" text-anchor="middle">${pointerInfo.id}</text>
      </svg>`}
      />
    </AutoLayout>
  )
}
