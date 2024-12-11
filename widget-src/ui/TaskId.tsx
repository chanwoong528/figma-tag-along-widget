const { widget } = figma;
const { SVG, useWidgetNodeId } = widget;

import { TASK_TYPE } from "../../common/constant";
import { TaskProps } from "../type";

const TaskId = ({ task, onEditTask, index }: {
  task: { id: string; type: string },
  onEditTask: (id: string, keyStr: keyof TaskProps, value: string, parentId?: string) => void,
  index: string
}) => {
  const widgetId = useWidgetNodeId();

  const handleClick = async (event: WidgetClickEvent) => {
    const tagId = `Tag-${task.id}-${task.type}-${widgetId}`;

    const existingComponent = figma.currentPage.findOne(
      (node) => node.name === tagId,
    );

    if (existingComponent) {
      figma.viewport.scrollAndZoomIntoView([existingComponent]);
      return;
    }

    const widgetNode = (await figma.getNodeByIdAsync(widgetId)) as WidgetNode;
    if (!widgetNode) return;

    const clonedWidget = widgetNode.cloneWidget({
      widgetMode: "pointer",
      pointerInfo: {
        ...task,
        x: event.canvasX,
        y: event.canvasY,
        type: task.type,
        id: task.id,
        orderIdx: index,
      },
    });


    const isChild = task.id.split("-").length > 1;

    if (isChild) {
      const parentId = task.id.split("-")[0];
      onEditTask(task.id, "pointerId", clonedWidget.id, parentId);
    } else {
      onEditTask(task.id, "pointerId", clonedWidget.id);
    }

    clonedWidget.name = tagId;
    widgetNode.parent?.appendChild(clonedWidget);
  };

  return (
    <SVG
      src={`<svg width="30" height="30" viewBox="0 0 30 30" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M15 0L28 7.5V22.5L15 30L2 22.5V7.5L15 0Z" fill="${TASK_TYPE.find((taskType) => taskType.option === task.type)?.color
        }"/>
        <text x="15" y="20" font-size="16" fill="white" text-anchor="middle">${index         // task.id
        }</text>
      </svg>`}
      onClick={handleClick}
    />
  );
};

export default TaskId;
