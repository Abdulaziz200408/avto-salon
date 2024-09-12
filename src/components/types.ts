export interface Markalar {
  id: number;
  name: string;
  img: string;
  color: string;
  brend: string;
}

// types.ts
export interface CarOption {
  id: number;
  name: string;
  color: string;
}

export interface ColorOption {
  name: string;
  color: string;
}

export interface ModalComponentProps {
  visible: boolean;
  onCreate: (data: any) => void;
  onCancel: () => void;
  carOptions: CarOption[];
  colorOptions: ColorOption[];
}
