import logo from './logo.svg';
import './App.css';
import { Button, Form, Table, Input, Modal, Row } from 'antd';
import { useEffect, useState } from 'react';
import { v4 as uuid } from 'uuid';
import axios from 'axios';

const WeatherIcons = {
  '01d': <img src="https://img.icons8.com/fluency/96/000000/sun.png"/>,
  '01n': <img src="https://img.icons8.com/fluency/96/000000/full-moon.png"/>,
  '02d': <img src="https://img.icons8.com/fluency/96/000000/partly-cloudy-day.png"/>,
  '02n': <img src="https://img.icons8.com/fluency/96/000000/partly-cloudy-night.png"/>,
  '03d': <img src="https://img.icons8.com/fluency/96/000000/moderate-rain.png"/>,
  '03n': <img src="https://img.icons8.com/fluency/96/000000/moderate-rain.png"/>,
  '04d': <img src="https://img.icons8.com/fluency/96/000000/clouds.png"/>,
  '04n': <img src="https://img.icons8.com/fluency/96/000000/partly-cloudy-night.png"/>,
  '09d': <img src="https://img.icons8.com/fluency/96/000000/partly-cloudy-rain.png"/>,
  '09n': <img src="https://img.icons8.com/fluency/96/000000/rainy-night.png"/>,
  '10d': <img src="https://img.icons8.com/fluency/96/000000/partly-cloudy-rain.png"/>,
  '10n': <img src="https://img.icons8.com/fluency/96/000000/rainy-night.png"/>,
  '11d': <img src="https://img.icons8.com/fluency/96/000000/chance-of-storm.png"/>,
  '11n': <img src="https://img.icons8.com/fluency/96/000000/stormy-night.png"/>
   
}

function App() {

  const dataSource = [
    {
      key: uuid(),
      title: "Update component",
      description: "lorem ipsum dolor sit amet",
      status: "Todo",
    },
  ]

  const [dataTable, setDataTable] = useState(dataSource);
  const [show, setShow] = useState(false);
  const [formData] = Form.useForm();
  const [dataEdit, setDataEdit] = useState();
  const [index, setindex] = useState();
  const [filter, setFilter] = useState("");
  const [weather, setWeather] = useState();
  console.log(weather)
  const API_KEY = '56a2c31c64a6247e0e851f88799c0dd5';
  const city = 'jakarta'
  const fetchWeather = async (event) => {
    const response = await axios.get(`https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${API_KEY}`);
    setWeather(response.data);
  }

  useEffect (() => {
    fetchWeather()
  },[])

  const columns = [
    {
      title: 'Title',
      dataIndex: 'title',
      key: 'title',
    },
    {
      title: 'Description',
      dataIndex: 'description',
      key: 'description',
    },
    {
      title: 'Status',
      dataIndex: 'status',
      key: 'status',
      render: (data, record, index) => {
        return(
          <>
            <Button
              className={`${record?.status?.toLowerCase()}`}
            >
              {data}
            </Button>
          </>
        )
      }
    },
    {
      title: 'Action',
      dataIndex: 'Action',
      key: 'Action',
      render: (data, record, index) => {
        const payloadUpdateStatus = {
          key:  record.key,
          title: record.title,
          description: record.description,
          status: "Done",
        };
        return (
          <>
            
            {
              record.status.toLowerCase() === "todo" && (
                <>
                  <Button
                    type="primary"
                    onClick={() => {
                      setDataEdit(record);
                      setShow(true);
                      setindex(index);
                    }}
                    style={{marginRight: "12px"}}
                  >
                    Edit
                  </Button>
                  <Button
                    type="primary"
                    onClick={() => {
                      const tempDataStatus= [...dataTable];
                      tempDataStatus[index].status = "Done";
                      setDataTable(tempDataStatus);
                    }}
                    style={{marginRight: "12px"}}
                  >
                    Update Status
                  </Button>
                </>
              )
            }
            <Button
              type="primary"
              danger
              onClick={() => {
                setDataTable(
                  dataTable.filter(a =>
                    a.key !== record.key
                  )
                );
              }}
            >
              Delete
            </Button>
          </>
        )
      }
    },
  ];

  async function handleSubmit() {
    const values = await formData.validateFields();
    const payload = {
      key:  dataEdit !== undefined ? dataEdit?.key : uuid(),
      title: values.title,
      description: values.description,
      status: "Todo" ,
    };
    if(dataEdit !== undefined) {
      // Object.assign(dataTable[index] = payload)
      console.log("edit")
      // setDataTable(current => [...current, current[0] = payload]);
      const tempData = [...dataTable];
      tempData[index] = payload;
      setDataTable(tempData)
    } else {
      const tempDataAdd = [...dataTable, payload];
      setDataTable(tempDataAdd);
    }
    formData.resetFields();
    setShow(false)
  }

  const handleCancel = () => {
    setShow(false)
    formData.resetFields();
    setDataEdit();
  }

  // const uniqueIds = [];
  // const newDataTable = dataTable.filter(element => {
  //   const isDuplicate = uniqueIds.includes(element.key);
  //   if (!isDuplicate) {
  //     uniqueIds.push(element.key);
  //     return true;
  //   }
  //   return false;
  // });
  
  useEffect(() => {
    formData.setFieldsValue({
      key: dataEdit?.key,
      title: dataEdit?.title,
      description: dataEdit?.description,
      status: dataEdit?.status,
    });
  },[dataEdit]) 

  const ModalForm = () => {
    return (
      <>
        <Modal
          title="Form Task"
          open={show}
          onOk={handleSubmit}
          onCancel={handleCancel}
          width={1000}
          destroyOnClose={true}
        >
          <Form
            form={formData}
            labelCol={{ span: 8 }}
            wrapperCol={{ span: 16 }}
            style={{ margin: "0px 150px 0px 50px" }}
            labelAlign="left"
          >
            <Form.Item
              label="Title Task"
              name="title"
              rules={[
                {
                  required: true,
                  message: "Please input Title",
                },
              ]}
            >
              <Input />
            </Form.Item>
            <Form.Item
              label="Description"
              name="description"
              rules={[
                {
                  required: true,
                  message: "please input Description",
                },
              ]}
            >
              <Input />
            </Form.Item>
          </Form>
        </Modal>
      </>
    );
  };

  const onShow = () => {
    setShow(true);
    formData.resetFields();
    setDataEdit();
  }

  const handleChange = (e) => {
    setFilter(e.target.value);
  };
  
  const filteredData = !filter
    ? dataTable
    : dataTable .filter((data) =>
        data?.title?.toLowerCase().includes(filter?.toLowerCase())
      );
      
  return (
    <>
      <ModalForm />
      <div className="App">
        <div className='weather-wp'>
          <div className='title-weather'>{weather?.name},</div>
          <div className='weather-temp'>{`${Math.floor(weather?.main?.temp - 273)}°C`}</div>
          <div className='description-weather'>{weather?.weather[0]?.description}</div>
          <div className='weather-icon'>{WeatherIcons[weather?.weather[0].icon]}</div>
        </div>
        <Row justify={'space-between'} style={{marginBottom: "14px"}}>
          <input
            type="text"
            placeholder="Search"
            value={filter}
            onChange={handleChange}
            className="search-btn"
          />
          <Button type="primary" onClick={onShow}>Add Data</Button>
        </Row>
        <Table dataSource={filteredData} columns={columns} />
      </div>
    </>
  );
}

export default App;
