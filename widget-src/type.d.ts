export interface TaskProps {
  id: string;
  type: string;
  description: string;
  children: SubTaskProps[];
}
export interface SubTaskProps {
  id: string;
  type: string;
  description: string;
}