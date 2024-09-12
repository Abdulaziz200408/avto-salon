import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { RootState, AppDispatch } from "./store";
import { fetchShartnomalar, createShartnoma } from "./store/shartnomalarSlice";
import ModalComponent from "./components/modal";
import ShartnomalarList from "./page/ShartnomalarList";
import MarkalarList from "./page/MarkalarList";
import styled from "@emotion/styled";
import { Input, Button, Select } from "antd";
import { CarOption, ColorOption } from "./components/types"; // Import types

const AppContainer = styled.div`
  display: flex;
  height: 100vh;
`;

const Sidebar = styled.div`
  width: 250px;
  background-color: #f4f4f4;
  padding: 20px;
  display: flex;
  flex-direction: column;
  border-right: 1px solid #ddd;
`;

const MenuItem = styled.div<{ active: boolean }>`
  padding: 10px;
  margin-bottom: 10px;
  border-radius: 5px;
  background-color: ${(props) => (props.active ? "#007bff" : "transparent")};
  color: ${(props) => (props.active ? "#fff" : "#000")};
  cursor: pointer;
  &:hover {
    background-color: ${(props) => (props.active ? "#0056b3" : "#ddd")};
  }
`;

const Content = styled.div`
  flex: 1;
  padding: 20px;
`;

const SearchContainer = styled.div`
  display: flex;
  align-items: center;
  margin-bottom: 20px;
  justify-content: space-between;
`;

const CreateButton = styled(Button)`
  margin-left: 10px;
`;

const App: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const shartnomalar = useSelector(
    (state: RootState) => state.shartnomalar.items
  );
  const markalar = useSelector((state: RootState) => state.markalar.items);
  const [selectedTab, setSelectedTab] = useState<"shartnomalar" | "markalar">(
    "shartnomalar"
  );
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [selectedMarka, setSelectedMarka] = useState<string | undefined>(
    undefined
  );
  const [selectedSearchType, setSelectedSearchType] = useState<
    "shartnomalar" | "markalar"
  >("shartnomalar");
  const [isModalVisible, setIsModalVisible] = useState<boolean>(false);
  const [carOptions, setCarOptions] = useState<CarOption[]>([]);
  const [colorOptions, setColorOptions] = useState<ColorOption[]>([]);

  useEffect(() => {
    if (selectedTab === "shartnomalar") {
      dispatch(fetchShartnomalar() as any);
    }
  }, [dispatch, selectedTab]);

  useEffect(() => {
    const fetchOptions = async () => {
      try {
        const response = await fetch(
          "https://a952eac74ed8e372.mokky.dev/markalar"
        );

        if (!response.ok) {
          throw new Error(`API error: ${response.statusText}`);
        }

        const data = await response.json();
        console.log("API Response Data:", data); // Tekshirish

        if (Array.isArray(data) && data.length > 0) {
          const formattedCarOptions: CarOption[] = data.map((item: any) => ({
            id: item.id,
            name: item.name,
            color: item.color,
          }));
          setCarOptions(formattedCarOptions);

          const formattedColorOptions: ColorOption[] = data.map(
            (item: any) => ({
              color: item.color,
              name: item.name,
            })
          );
          setColorOptions(formattedColorOptions);
        } else {
          console.log("APIdan hech qanday ma'lumot kelmadi");
        }
      } catch (error) {
        console.error("Markalarni olishda xatolik yuz berdi:", error);
      }
    };

    fetchOptions();
  }, []);

  const handleCreate = async (data: any) => {
    try {
      await dispatch(createShartnoma(data) as any);
      setIsModalVisible(false);
      dispatch(fetchShartnomalar() as any);
    } catch (error) {
      console.error("Failed to create item", error);
    }
  };

  const filteredShartnomalar = shartnomalar
    .filter(
      (item) =>
        selectedSearchType === "shartnomalar" &&
        item.name.toLowerCase().includes(searchTerm.toLowerCase())
    )
    .filter((item) => (selectedMarka ? item.model === selectedMarka : true));

  const filteredMarkalar = markalar.filter(
    (item) =>
      selectedSearchType === "markalar" &&
      item.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  console.log("Filtered Markalar:", filteredMarkalar); // Tekshirish

  return (
    <AppContainer>
      <Sidebar>
        <MenuItem
          active={selectedTab === "shartnomalar"}
          onClick={() => setSelectedTab("shartnomalar")}
        >
          Shartnomalar
        </MenuItem>
        <MenuItem
          active={selectedTab === "markalar"}
          onClick={() => setSelectedTab("markalar")}
        >
          Markalar
        </MenuItem>
      </Sidebar>
      <Content>
        {selectedTab === "shartnomalar" && (
          <>
            <SearchContainer>
              <Input
                placeholder="Search"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                style={{ width: "300px", marginLeft: "10px" }}
              />
              <CreateButton onClick={() => setIsModalVisible(true)}>
                Create
              </CreateButton>
            </SearchContainer>
            <ShartnomalarList
              items={filteredShartnomalar}
              onEdit={(id) => console.log(`Edit ${id}`)}
              onDelete={(id) => console.log(`Delete ${id}`)}
            />
          </>
        )}
        {selectedTab === "markalar" && <MarkalarList />}
        <ModalComponent
          visible={isModalVisible}
          onCreate={handleCreate}
          onCancel={() => setIsModalVisible(false)}
          carOptions={carOptions}
          colorOptions={colorOptions}
        />
      </Content>
    </AppContainer>
  );
};

export default App;
