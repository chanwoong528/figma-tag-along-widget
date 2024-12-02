import Minus from "../ui/svg/Minus";
import Plus from "../ui/svg/Plus";
import TaskId from "../ui/TaskId";

const { widget } = figma;
const { useSyncedState, usePropertyMenu, AutoLayout, Text, SVG, Input } =
  widget;

interface SubTask {
  id: string;
  type: string;
  description: string;
}

const SubTask = ({
  parentId,
  subTask,
  onChangeSubTask,
  onClickDeleteSubTask,
}: {
  parentId: string;
  subTask: SubTask;
  onChangeSubTask: (
    e: TextEditEvent,
    parentId: string,
    subTaskId: string,
  ) => void;
  onClickDeleteSubTask: (
    parentId: string,
    subTaskId: string,
    type: string,
  ) => void;
}) => {
  return (
    <AutoLayout padding={{ left: 40 }} width='fill-parent'>
      <AutoLayout
        direction='vertical'
        spacing={8}
        padding={16}
        width='fill-parent'
        stroke={"#000000"}
        strokeWidth={1}
        cornerRadius={8}
        x={16}>
        <AutoLayout direction='horizontal' spacing={"auto"} width='fill-parent'>
          <TaskId task={{ id: subTask.id, type: subTask.type }} />

          <AutoLayout
            direction='vertical'
            spacing={4}
            verticalAlignItems='center'>
            <Text fontSize={12} fill={"#808080"}>
              {subTask.type}
            </Text>
            <AutoLayout
              direction='horizontal'
              spacing={4}
              verticalAlignItems='center'>
              <Minus
                onClick={() => {
                  onClickDeleteSubTask(parentId, subTask.id, subTask.type);
                }}
                type='small'
              />
            </AutoLayout>
          </AutoLayout>
        </AutoLayout>

        <Input
          placeholder='Description'
          value={subTask.description}
          onTextEditEnd={(e) => onChangeSubTask(e, parentId, subTask.id)}
          width='fill-parent'
        />
      </AutoLayout>
    </AutoLayout>
  );
};

export default SubTask;
