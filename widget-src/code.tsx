// This is a counter widget with buttons to increment and decrement the number.

import SubTask from "./components/SubTask";
import Task from "./components/Task";

import Plus from "./ui/svg/Plus";
import { TagId } from "./ui/TagId";

import { TASK_TYPES } from "../common/constant";

import * as XLSX from "xlsx";

const { widget } = figma;
const { useSyncedState, usePropertyMenu, AutoLayout, Text, Input, useEffect } =
  widget;
import { TaskProps } from "./type";
import Excel from "./ui/svg/Excel";

function Widget() {
  const [widgetMode] = useSyncedState("widgetMode", "list");
  const [pointerInfo] = useSyncedState("pointerInfo", {
    x: 0,
    y: 0,
    id: "",
    type: "",
    description: "",
    orderIdx: "",
  });

  const [pageInfo, setPageInfo] = useSyncedState("pageInfo", {
    title: "",
    description: "",
  });

  const [taskType] = useSyncedState("taskType", TASK_TYPES);
  const [curTaskType, setCurTaskType] = useSyncedState(
    "curTaskType",
    TASK_TYPES[0].option,
  );

  const [tasks, setTasks] = useSyncedState<TaskProps[]>("tasks", [
    {
      id: "1",
      type: TASK_TYPES[0].option,
      description: "",
      done: false,
      children: [],
      pointerId: "",
    },
  ]);
  const [responsiveWidth, setResponsiveWidth] = useSyncedState(
    "responsiveWidth",
    450,
  );

  useEffect(() => {
    figma.ui.onmessage = (message) => {
      console.log("message>>", message);
      if (message.type === "add-task") {
        console.log(message.parentTask);
        // const { parentTask } = message;
      }
      if (message.type === "close") {
        figma.ui.hide();
      }
    };
  });

  const onClickExcel = () => {
    try {
      console.log("Excel 기능 준비 중");

      // 데이터 변환 함수
      const flattenTasks = (tasks: TaskProps[]) => {
        const result: any[] = [];

        tasks.forEach((task) => {
          // 부모 태스크 추가
          result.push({
            id: task.id,
            type: task.type,
            description: task.description,
            status: task.done ? "Done" : "In Progress",
            level: "Parent",
            parentId: "-",
          });

          // 자식 태스크들 추가
          task.children?.forEach((child) => {
            result.push({
              id: child.id,
              type: child.type,
              description: child.description,
              status: child.done ? "Done" : "In Progress",
              level: "Child",
              parentId: task.id,
            });
          });
        });

        return result;
      };

      const flattenedData = flattenTasks(tasks);

      return new Promise((resolve) => {
        figma.showUI(__uiFiles__.excelDownload, { width: 450, height: 600 });
        figma.ui.postMessage({
          type: "download",
          title: pageInfo.title,
          tasks: flattenedData,
        });
      });
    } catch (error) {
      console.log("Excel 기능 준비 중 오류 발생", error);
    }
  };

  const onTextChange = (e: TextEditEvent, property: string) => {
    console.log("onTextChange>> ", e.characters);
    setPageInfo({ ...pageInfo, [property]: e.characters });
  };

  const calculateResponsiveWidth = (targetTasks: TaskProps[]) => {
    const defaultWidth = 450;

    if (!targetTasks || targetTasks.length === 0) {
      return defaultWidth;
    }

    const uniqueTaskTypes = new Set(targetTasks.map((task) => task.type));
    const taskTypeCount = uniqueTaskTypes.size;

    const width = defaultWidth * taskTypeCount;
    return width;
  };

  const onChangeTask = (e: TextEditEvent, id: string, type: string) => {
    const newTasks = tasks.map((task) => {
      if (task.id === id && task.type === type) {
        return { ...task, description: e.characters };
      }
      return task;
    });

    const curPointerNode = tasks.filter((task) => !!task.pointerId);

    curPointerNode.forEach(async (node, _) => {
      const targetIdx = newTasks
        .filter((task) => task.type === type)
        .findIndex((task) => task.id === id);

      const widgetNodeId = newTasks[targetIdx].pointerId;

      const widgetNode = (await figma.getNodeByIdAsync(
        widgetNodeId,
      )) as WidgetNode | null;
      if (widgetNode) {
        widgetNode.setWidgetSyncedState({
          widgetMode: "pointer",
          pointerInfo: {
            ...node,
            id: node.id,
            type: type,
            description: e.characters,
            orderIdx: (targetIdx + 1).toString(),
          },
        });
      }
    });

    setTasks(newTasks);
  };
  const onChangeSubTask = (
    e: TextEditEvent,
    parentId: string,
    subTaskId: string,
    type: string,
  ) => {
    const newTasks = tasks.map((task) => {
      if (task.id === parentId) {
        return {
          ...task,
          children: task.children.map((subTask) => {
            if (subTask.id === subTaskId) {
              return { ...subTask, description: e.characters };
            }
            return subTask;
          }),
        };
      }
      return task;
    });
    const targetTask = newTasks.find((task) => task.id === parentId);

    const parentIdx = newTasks
      .filter((item) => item.type === type)
      .findIndex((task) => task.id === parentId);

    if (targetTask) {
      targetTask.children.forEach(async (subTask, idx) => {
        if (subTask.id === subTaskId && !!subTask.pointerId) {
          const widgetNode = (await figma.getNodeByIdAsync(
            subTask.pointerId,
          )) as WidgetNode | null;

          if (widgetNode) {
            widgetNode.setWidgetSyncedState({
              widgetMode: "pointer",
              pointerInfo: {
                ...subTask,
                description: e.characters,
                orderIdx: `${parentIdx + 1}-${idx + 1}`,
              },
            });
          }
        }
      });
    }

    setTasks(newTasks);
  };
  const onClickAddTask = (taskType: string) => {
    const filteredTasks = tasks.filter((task) => task.type === taskType);

    const newId =
      filteredTasks.length > 0
        ? parseInt(filteredTasks[filteredTasks.length - 1].id) + 1
        : "1";

    const newTasks = [
      ...tasks,
      {
        id: newId.toString(),
        type: curTaskType,
        description: "",
        done: false,
        children: [],
        pointerId: "",
      },
    ];

    setTasks(newTasks);
    setResponsiveWidth(calculateResponsiveWidth(newTasks));
  };

  const onClickAddSubTask = (id: string, type: string) => {
    const newTasks = tasks.map((task) => {
      if (task.id === id && task.type === type) {
        const lastId =
          task.children.length > 0
            ? task.children[task.children.length - 1].id.split("-")[1]
            : "";

        return {
          ...task,
          children: [
            ...task.children,
            {
              id: `${id}-${lastId ? parseInt(lastId) + 1 : 1}`,
              type: task.type,
              description: "",
              done: false,
              pointerId: "",
            },
          ],
        };
      }
      return task;
    });

    setTasks(newTasks);
  };

  const onEditTask = (
    id: string,
    key: keyof TaskProps,
    value: string,
    parentId?: string,
  ) => {
    if (parentId) {
      return onEditSubTask(id, key, value, parentId);
    }
    const newTasks = tasks.map((task) => {
      if (task.id.toString() === id.toString()) {
        return { ...task, [key]: value };
      }
      return task;
    });
    setTasks(newTasks);
  };

  const onEditSubTask = (
    id: string,
    key: keyof TaskProps,
    value: string,
    parentId: string,
  ) => {
    const newTasks = tasks.map((task) => {
      if (task.id.toString() === parentId.toString()) {
        return {
          ...task,
          children: task.children.map((subTask) => {
            if (subTask.id.toString() === id.toString()) {
              return { ...subTask, [key]: value };
            }
            return subTask;
          }),
        };
      }
      return task;
    });
    setTasks(newTasks);
  };

  const onClickDeleteTask = async (id: string, type: string) => {
    if (tasks.filter((task) => task.type === type).length === 0) {
      console.log("no task");
      return;
    }

    const tobeDeleteTask = tasks.find(
      (task) => task.id === id && task.type === type,
    );
    if (tobeDeleteTask?.pointerId) {
      const widgetNode = (await figma.getNodeByIdAsync(
        tobeDeleteTask.pointerId,
      )) as WidgetNode | null;
      if (widgetNode) {
        widgetNode.remove();
      }
    }
    const newTasks = tasks.filter(
      (task) => !(task.id === id && task.type === type),
    );

    setResponsiveWidth(calculateResponsiveWidth(newTasks));
    setTasks(newTasks);

    const curPointerNode = newTasks.filter((task) => !!task.pointerId);

    curPointerNode.forEach(async (node) => {
      const widgetNode = (await figma.getNodeByIdAsync(
        node.pointerId,
      )) as WidgetNode | null;
      const targetIdx = newTasks.findIndex((task) => task.id === node.id);

      if (widgetNode) {
        console.log("widgetNode>> ", widgetNode);
        widgetNode.setWidgetSyncedState({
          widgetMode: "pointer",
          pointerInfo: {
            ...node,
            id: node.id,
            type: node.type,
            orderIdx: (targetIdx + 1).toString(),
          },
        });
      }
    });
  };
  const onClickDeleteSubTask = async (
    parentId: string,
    subTaskId: string,
    type: string,
  ) => {
    const newTasks = tasks.map((task) => {
      if (task.id === parentId && task.type === type) {
        return {
          ...task,
          children: task.children.filter((subTask) => subTask.id !== subTaskId),
        };
      }
      return task;
    });

    setResponsiveWidth(calculateResponsiveWidth(newTasks));
    setTasks(newTasks);

    const targetTask = tasks.find((task) => task.id === parentId);
    const tobeDeleteSubTask = targetTask?.children.find(
      (subTask) => subTask.id === subTaskId,
    );

    if (tobeDeleteSubTask) {
      const widgetNode = (await figma.getNodeByIdAsync(
        tobeDeleteSubTask.pointerId,
      )) as WidgetNode | null;
      if (widgetNode) {
        widgetNode.remove();
      }
    }

    if (targetTask) {
      const curPointerNode = targetTask.children.filter(
        (subTask) => !!subTask.pointerId,
      );
      const parentIdx = newTasks
        .filter((item) => item.type === type)
        .findIndex((task) => task.id === parentId);

      curPointerNode.forEach(async (node) => {
        const targetIdx =
          newTasks
            .find((task) => task.id === parentId)
            ?.children.findIndex((subTask) => subTask.id === node.id) || 0;
        console.log("targetIdx>> ", targetIdx);
        const widgetNode = (await figma.getNodeByIdAsync(
          node.pointerId,
        )) as WidgetNode | null;
        if (widgetNode) {
          widgetNode.setWidgetSyncedState({
            widgetMode: "pointer",
            pointerInfo: {
              ...node,
              orderIdx: `${parentIdx + 1}-${targetIdx + 1}`,
            },
          });
        }
      });
    }
  };

  if (widgetMode === "pointer") {
    usePropertyMenu(
      [
        {
          itemType: "action",
          propertyName: "show-task",
          tooltip: "Task Type",
        },
      ],
      async (property) => {
        if (property.propertyName === "show-task") {
          return new Promise((_) => {
            figma.showUI(__uiFiles__.tagModal, { width: 450, height: 600 });

            console.log(pointerInfo);
            figma.ui.postMessage({
              id: pointerInfo.id,
              type: pointerInfo.type,
              description: pointerInfo.description,
              orderIdx: pointerInfo.orderIdx,
            });
          });
        }
      },
    );

    return <TagId pointerInfo={pointerInfo} />;
  } else {
    usePropertyMenu(
      [
        {
          itemType: "action",
          tooltip: "Action",
          propertyName: "action",
        },
        {
          itemType: "separator",
        },
        {
          itemType: "dropdown",
          propertyName: "taskType",
          tooltip: "Task Type",
          selectedOption: curTaskType,
          options: TASK_TYPES,
        },
      ],

      ({ propertyName, propertyValue }) => {
        if (propertyName === "taskType") {
          console.log("propertyValue>> ", propertyValue);
          setCurTaskType(propertyValue || "");
        }
      },
    );

    return (
      <AutoLayout
        verticalAlignItems={"center"}
        spacing={16}
        padding={24}
        cornerRadius={8}
        direction='vertical'
        fill={"#FFFFFF"}
        stroke={"#E6E6E6"}
        width={responsiveWidth}>
        <Input
          fontSize={40}
          fontWeight={700}
          value={pageInfo.title}
          onTextEditEnd={(e) => onTextChange(e, "title")}
          placeholder='Page Title'
          width='fill-parent'
        />
        <Input
          width='fill-parent'
          value={pageInfo.description}
          onTextEditEnd={(e) => onTextChange(e, "description")}
          placeholder='Page Description'
        />

        {!!tasks && tasks.length > 0 ? (
          <AutoLayout direction='horizontal' spacing={8} width='fill-parent'>
            {taskType?.map((loopType) => {
              if (
                tasks.filter((taskItem) => taskItem.type === loopType.option)
                  .length === 0
              ) {
                return null;
              }
              return (
                <AutoLayout
                  direction='vertical'
                  spacing={8}
                  key={loopType.option}
                  width='fill-parent'>
                  {tasks.filter((taskItem) => taskItem.type === loopType.option)
                    .length > 0 &&
                    !!tasks &&
                    tasks
                      .filter((taskItem) => taskItem.type === loopType.option)
                      .map((task, index) => (
                        <AutoLayout
                          key={task.id + task.type}
                          direction='vertical'
                          spacing={8}
                          width='fill-parent'>
                          <Task
                            index={(index + 1).toString()}
                            key={task.id + task.type}
                            task={task}
                            onChangeTask={onChangeTask}
                            onClickAddSubTask={onClickAddSubTask}
                            onClickDeleteTask={onClickDeleteTask}
                            onEditTask={onEditTask}
                          />
                          {task.children.length > 0 &&
                            task.children.map((subTask, subIndex) => (
                              <SubTask
                                key={subTask.id + subTask.type || subIndex}
                                orderIdx={`${index + 1}-${subIndex + 1}`}
                                parentId={task.id}
                                subTask={subTask}
                                onChangeSubTask={onChangeSubTask}
                                onClickDeleteSubTask={onClickDeleteSubTask}
                                onEditTask={onEditTask}
                              />
                            ))}
                        </AutoLayout>
                      ))}
                </AutoLayout>
              );
            })}
          </AutoLayout>
        ) : (
          <Text>No Task</Text>
        )}
        <AutoLayout direction='horizontal' spacing='auto' width='fill-parent'>
          <Plus onClick={() => onClickAddTask(curTaskType)} />
          <Excel onClick={onClickExcel} type='large' />
        </AutoLayout>
      </AutoLayout>
    );
  }
}

widget.register(Widget);
