import React, { useState } from "react";
import { Modal, Form, Input, Select, Button, TimePicker } from "antd";
import { CarOption, ColorOption } from "./types";
import moment from "moment"; // Import moment for time formatting

const { Option } = Select;

interface ModalComponentProps {
  visible: boolean;
  onCreate: (data: any) => void;
  onCancel: () => void;
  carOptions: CarOption[];
  colorOptions: ColorOption[];
}

const ModalComponent: React.FC<ModalComponentProps> = ({
  visible,
  onCreate,
  onCancel,
  carOptions,
  colorOptions,
}) => {
  const [form] = Form.useForm();
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

  const handleSubmit = async () => {
    if (isSubmitting) return; // Prevent multiple submissions

    try {
      setIsSubmitting(true);
      const values = await form.validateFields();
      // Format the time value before sending
      if (values.contractDate) {
        values.contractDate = values.contractDate.format("HH:mm");
      }
      await onCreate(values);
      form.resetFields();
      onCancel();
    } catch (error) {
      console.error("Failed to submit form", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Modal
      title="Create New Contract"
      visible={visible}
      onOk={handleSubmit}
      onCancel={onCancel}
      okText="Create"
      cancelText="Cancel"
      confirmLoading={isSubmitting}
    >
      <Form form={form} layout="vertical">
        <Form.Item
          name="name"
          label="Name"
          rules={[{ required: true, message: "Please enter the name!" }]}
        >
          <Input />
        </Form.Item>
        <Form.Item
          name="color"
          label="Car color"
          rules={[{ required: true, message: "Please select the car color!" }]}
        >
          <Select>
            {colorOptions.map((color) => (
              <Option key={color.color} value={color.color}>
                {color.color}
              </Option>
            ))}
          </Select>
        </Form.Item>
        <Form.Item
          name="car"
          label="Car Model"
          rules={[{ required: true, message: "Please select the car model!" }]}
        >
          <Select>
            {carOptions.map((car) => (
              <Option key={car.id} value={car.name}>
                {car.name}
              </Option>
            ))}
          </Select>
        </Form.Item>
        <Form.Item
          name="phone"
          label="Phone Number"
          rules={[
            { required: true, message: "Please enter the phone number!" },
          ]}
        >
          <Input />
        </Form.Item>
        <Form.Item name="contractDate" label="Contract Time">
          <TimePicker
            style={{ width: "100%" }}
            format="HH:mm"
            minuteStep={15}
          />
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default ModalComponent;
