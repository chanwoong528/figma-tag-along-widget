export const TASK_TYPE = [
  {
    option: "Visible",
    label: "Visible",
    color: "#2D7FF9",
  },
  {
    option: "Hidden",
    label: "Hidden",
    color: "#808080",
  },
];
export const TASK_TYPES = TASK_TYPE.map((taskType) => {
  return {
    option: taskType.option,
    label: taskType.label,
  };
});
