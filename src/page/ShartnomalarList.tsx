import React, { useState, useEffect } from "react";
import {
  Table,
  Button,
  Select,
  Modal,
  Form,
  Input,
  DatePicker,
  message,
} from "antd";
import axios from "axios";
import moment from "moment";

const { Option } = Select;

interface Shartnoma {
  id: number;
  color: string;
  car: string;
  name: string;
  phone: string;
  contractDate?: string;
}

interface ShartnomalarListProps {
  items: Shartnoma[];
  onEdit: (updatedItem: Shartnoma) => void;
  onDelete: (id: number) => void;
}

const ShartnomalarList: React.FC<ShartnomalarListProps> = ({
  items,
  onEdit,
  onDelete,
}) => {
  const [brands, setBrands] = useState<any[]>([]);
  const [colors, setColors] = useState<any[]>([]);
  const [selectedBrand, setSelectedBrand] = useState<string | undefined>(
    undefined
  );
  const [filteredItems, setFilteredItems] = useState<Shartnoma[]>(items);
  const [isModalVisible, setIsModalVisible] = useState<boolean>(false);
  const [currentRecord, setCurrentRecord] = useState<Shartnoma | null>(null);
  const [form] = Form.useForm();

  useEffect(() => {
    const fetchBrands = async () => {
      try {
        const response = await axios.get(
          "https://a952eac74ed8e372.mokky.dev/markalar"
        );
        setBrands(response.data);
      } catch (error) {
        console.error("Error fetching brands:", error);
      }
    };

    const fetchColors = async () => {
      try {
        const response = await axios.get(
          "https://a952eac74ed8e372.mokky.dev/markalar"
        );
        // Assuming the API response contains a list of color objects
        setColors(response.data);
      } catch (error) {
        console.error("Error fetching colors:", error);
      }
    };

    fetchBrands();
    fetchColors();
  }, []);

  useEffect(() => {
    if (selectedBrand) {
      setFilteredItems(items.filter((item) => item.car === selectedBrand));
    } else {
      setFilteredItems(items);
    }
  }, [selectedBrand, items]);

  const handleEdit = (record: Shartnoma) => {
    setCurrentRecord(record);
    form.setFieldsValue({
      name: record.name,
      color: record.color,
      car: record.car,
      phone: record.phone,
      contractDate: record.contractDate ? moment(record.contractDate) : null,
    });
    setIsModalVisible(true);
  };

  const handleDelete = async (id: number) => {
    try {
      await axios.delete(
        `https://a952eac74ed8e372.mokky.dev/shartnomalar/${id}`
      );
      onDelete(id);
      message.success("Record deleted successfully!");
    } catch (error) {
      console.error("Error deleting record:", error);
      message.error("Failed to delete record.");
    }
    // Refresh the list after deletion
    window.location.reload();
  };

  const handleSave = async () => {
    try {
      const values = await form.validateFields();
      if (currentRecord) {
        const updatedItem = {
          ...currentRecord,
          ...values,
          contractDate: values.contractDate
            ? values.contractDate.format("YYYY-MM-DD")
            : null,
        };

        await axios.put(
          `https://a952eac74ed8e372.mokky.dev/shartnomalar/${currentRecord.id}`,
          updatedItem
        );

        onEdit(updatedItem);
        setIsModalVisible(false);
        setFilteredItems((prev) =>
          prev.map((item) => (item.id === updatedItem.id ? updatedItem : item))
        );
        form.resetFields();
        message.success("Record updated successfully!");
      }
    } catch (error) {
      console.error("Error saving record:", error);
      message.error("Failed to save record.");
    }
  };

  const columns = [
    {
      title: "Name",
      dataIndex: "name",
      key: "name",
    },
    {
      title: "Contract Date",
      dataIndex: "contractDate",
      key: "contractDate",
    },
    {
      title: "Car Model",
      dataIndex: "car",
      key: "car",
    },
    {
      title: "Car Color",
      dataIndex: "color",
      key: "color",
    },
    {
      title: "Phone Number",
      dataIndex: "phone",
      key: "phone",
    },
    {
      title: "Actions",
      key: "actions",
      render: (_: any, record: Shartnoma) => (
        <span>
          <Button onClick={() => handleEdit(record)} style={{ marginRight: 8 }}>
            Edit
          </Button>
          <Button onClick={() => handleDelete(record.id)} danger>
            Delete
          </Button>
        </span>
      ),
    },
  ];

  return (
    <div>
      <Select
        placeholder="Select Car Brand"
        style={{ width: 200, marginBottom: 16 }}
        onChange={(value) => setSelectedBrand(value)}
      >
        {brands.map((brand) => (
          <Option key={brand.id} value={brand.name}>
            {brand.name}
          </Option>
        ))}
      </Select>
      <div>
        <Table
          rowKey="id"
          columns={columns}
          dataSource={filteredItems}
          pagination={{ pageSize: 8 }} // Set page size to 8
        />
      </div>

      <Modal
        title="Edit Contract"
        visible={isModalVisible}
        onOk={handleSave}
        onCancel={() => {
          setIsModalVisible(false);
          form.resetFields();
        }}
        okText="Save"
        cancelText="Cancel"
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
            label="Car Color"
            rules={[
              { required: true, message: "Please select the car color!" },
            ]}
          >
            <Select>
              {colors.map((color) => (
                <Option key={color.id} value={color.color}>
                  {color.color}
                </Option>
              ))}
            </Select>
          </Form.Item>
          <Form.Item
            name="car"
            label="Car Model"
            rules={[
              { required: true, message: "Please select the car model!" },
            ]}
          >
            <Select>
              {brands.map((brand) => (
                <Option key={brand.id} value={brand.name}>
                  {brand.name}
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
          <Form.Item name="contractDate" label="Contract Date">
            <DatePicker
              style={{ width: "100%" }}
              format="YYYY-MM-DD"
              onChange={(date) => form.setFieldsValue({ contractDate: date })}
              value={
                form.getFieldValue("contractDate")
                  ? moment(form.getFieldValue("contractDate"))
                  : null
              }
            />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default ShartnomalarList;
