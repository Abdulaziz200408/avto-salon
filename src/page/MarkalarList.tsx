import axios from "axios";
import React, { useEffect, useState } from "react";
import { Table, Button, Pagination, Input, Modal, Form } from "antd"; // Ant Design komponentlari
import { FormInstance } from "antd/es/form";

// Markalar interfeysi
interface Markalar {
  id: number;
  name: string;
  img: string;
  color: string;
  brend: string;
  userId: number;
}

const MarkalarList = () => {
  const [data, setData] = useState<Markalar[]>([]); // Dastlab bo'sh massiv
  const [currentPage, setCurrentPage] = useState(1); // Joriy sahifa
  const [pageSize] = useState(6); // Bir sahifada nechta element ko'rsatilishi
  const [searchTerm, setSearchTerm] = useState(""); // Qidiruv so'zi
  const [isModalVisible, setIsModalVisible] = useState(false); // Modalni ko'rsatish holati
  const [form] = Form.useForm<FormInstance>(); // Ant Design formasi

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await axios.get(
          "https://a952eac74ed8e372.mokky.dev/markalar"
        );
        setData(res.data); // API'dan kelgan ma'lumotni setData bilan yangilash
      } catch (error) {
        console.error("Xato yuz berdi:", error);
      }
    };

    fetchData(); // Ma'lumotni olish
  }, []); // Faqat bir marta chaqiriladi, chunki [] qavslar qo'yilgan

  // Sahifa bo'yicha ma'lumotlarni olish
  const paginatedData = data
    .filter((item) =>
      item.name.toLowerCase().includes(searchTerm.toLowerCase())
    )
    .slice((currentPage - 1) * pageSize, currentPage * pageSize);

  // Jadval ustunlari
  const columns = [
    {
      title: "ID",
      dataIndex: "id",
      key: "id",
    },
    {
      title: "Name",
      dataIndex: "name",
      key: "name",
    },
    {
      title: "Image",
      dataIndex: "img",
      key: "img",
      render: (text: string, record: Markalar) => (
        <img
          src={record.img}
          alt={record.name}
          style={{ width: "50px", height: "50px", borderRadius: "50%" }}
        />
      ),
    },
    {
      title: "Color",
      dataIndex: "color",
      key: "color",
    },
    {
      title: "Brend",
      dataIndex: "brend",
      key: "brend",
    },
  ];

  // Sahifa o'zgarganda chaqiriladigan funksiya
  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  // Modalni ochish
  const handleCreateClick = () => {
    setIsModalVisible(true);
  };

  // Modalni yopish
  const handleCancel = () => {
    setIsModalVisible(false);
    form.resetFields(); // Formani tozalash
  };

  // Ma'lumotni API'ga yuborish
  const handleSave = async (values: any) => {
    try {
      await axios.post("https://a952eac74ed8e372.mokky.dev/markalar", values);
      setIsModalVisible(false);
      form.resetFields();
      // Ma'lumotlarni yangilash
      const res = await axios.get(
        "https://a952eac74ed8e372.mokky.dev/markalar"
      );
      setData(res.data);
    } catch (error) {
      console.error("Ma'lumot qo'shishda xato:", error);
    }
  };

  return (
    <div>
      {/* Qidiruv va 'Create' tugmasi */}
      <div style={{ marginBottom: "20px" }}>
        <Input
          placeholder="Search"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          style={{ width: "300px", marginRight: "10px" }}
        />
        <Button type="primary" onClick={handleCreateClick}>
          Create
        </Button>
      </div>

      {/* Jadval */}
      <Table
        columns={columns}
        dataSource={paginatedData}
        rowKey="id"
        pagination={false} // Ant Design pagination o'chiriladi, chunki custom pagination ishlatamiz
      />

      {/* Paginatsiya */}
      <Pagination
        current={currentPage}
        pageSize={pageSize}
        total={data.length}
        onChange={handlePageChange}
        style={{ marginTop: "20px", textAlign: "center" }}
      />

      {/* Modal */}
      <Modal
        title="Create Markalar"
        visible={isModalVisible}
        onCancel={handleCancel}
        footer={null}
      >
        <Form form={form} onFinish={handleSave} layout="vertical">
          <Form.Item
            name="name"
            label="Name"
            rules={[{ required: true, message: "Please input the name!" }]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            name="img"
            label="Image URL"
            rules={[{ required: true, message: "Please input the image URL!" }]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            name="color"
            label="Color"
            rules={[{ required: true, message: "Please input the color!" }]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            name="brend"
            label="Brend"
            rules={[{ required: true, message: "Please input the brend!" }]}
          >
            <Input />
          </Form.Item>
          <Form.Item>
            <Button type="primary" htmlType="submit">
              Save
            </Button>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default MarkalarList;
