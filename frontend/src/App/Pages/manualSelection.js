import React, { useEffect, useState, useRef } from 'react';
import { Table, Input, Button, Popconfirm, Space, Layout, Typography, notification } from 'antd';
import FlightSummary from '../Components/flightSummary';
import { PilotApi } from '../APIs/PilotApi';
import { CabinCrewApi } from '../APIs/CabinApi';
import { SearchOutlined } from '@ant-design/icons';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { FlightApi } from '../APIs/FlightApi';
const { Content } = Layout;
function ManualSelectionPage() {
    const navigate = useNavigate();
    const flight = useSelector(state => state.flight.selectedFlight);
    const [dataSourceSelectionFlight, setDataSourceSelectionFlight] = useState([

    ]);
    const [dataSourceFlight, setDataSourceFlight] = useState([]);
    const [dataSourceSelectionCabin, setDataSourceSelectionCabin] = useState([

    ]);
    const [dataSourceCabin, setDataSourceCabin] = useState([
    ]);
    const formatDate = (dateString) => {
        const options = {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        };
        return new Date(dateString).toLocaleDateString(undefined, options);
    };
    const [api, contextHolder] = notification.useNotification();
    const openNotification = (placement, message) => {
        api.info({
            message: `Error while choosing crew`,
            description:
                message,
            placement,

        });
    };
    useEffect(() => {
        let flightCrew;
        PilotApi.getFlightCrew(flight.vehicle_type).then((response) => {
            console.log(response);
            flightCrew = response.map((item) => ({
                "key": item.id,
                "id": item.id,
                "name": item.name,
                "nationality": item.nationality,
                "vehicleType": item.vehicle,
                "languages": (item.languages.map((language) => language)).join(', '),
                "age": item.age,
                "gender": item.gender,
                "seniorityLevel": item.seniority === 0 ? 'Trainee' : (item.seniority === 1 ? 'Junior' : 'Senior'),
                "range": item.max_range + ' km',
            }));
            setDataSourceSelectionFlight(flightCrew);
        });

        let cabinCrew;
        CabinCrewApi.getCabinCrew(flight.vehicle_type).then((response) => {
            cabinCrew = response.map((item) => ({
                "key": item.id,
                "id": item.id,
                "name": item.name,
                "nationality": item.nationality,
                "vehicleType": (item.vehicle.map((vehicles) => vehicles)).join(', '),
                "dishes": (item.dishes.map((dishes) => dishes.dish)).join(', '),
                "languages": (item.languages.map((language) => language)).join(', '),
                "age": item.age,
                "gender": item.gender,
                "seniorityLevel": item.seniority === 0 ? '' : (item.seniority === 1 ? 'Junior' : 'Senior'),
                "attendantType": item.seniority === 0 ? 'Chef' : (item.seniority === 1 ? 'Regular' : 'Chief'),
            }));
            setDataSourceSelectionCabin(cabinCrew);
        });

    }, []);
    function generateUniqueKey(dataSource) {
        // Generate a unique key based on current dataSource keys
        let newKey = 0;
        while (dataSource.some(item => item.key === newKey.toString())) {
            newKey++;
        }
        return newKey.toString();
    };
    const handleAddFlight = (key) => {
        const deletedData = dataSourceSelectionFlight.find((item) => item.key === key);
        const newData = dataSourceSelectionFlight.filter((item) => item.key !== key);
        const newKey = generateUniqueKey(dataSourceFlight);
        const addedData = { ...deletedData, key: newKey };
        setDataSourceFlight([...dataSourceFlight, addedData]);
        setDataSourceSelectionFlight(newData);
    };
    const handleDeleteFlight = (key) => {
        const deletedData = dataSourceFlight.find((item) => item.key === key);
        const newData = dataSourceFlight.filter((item) => item.key !== key);
        const newKey = generateUniqueKey(dataSourceSelectionFlight);
        const addedData = { ...deletedData, key: newKey };
        setDataSourceSelectionFlight([...dataSourceSelectionFlight, addedData]);
        setDataSourceFlight(newData);
    };
    const handleAddCabin = (key) => {
        const deletedData = dataSourceSelectionCabin.find((item) => item.key === key);
        const newData = dataSourceSelectionCabin.filter((item) => item.key !== key);
        const newKey = generateUniqueKey(dataSourceCabin);
        const addedData = { ...deletedData, key: newKey };
        setDataSourceCabin([...dataSourceCabin, addedData]);
        setDataSourceSelectionCabin(newData);
    };
    const handleDeleteCabin = (key) => {
        const deletedData = dataSourceCabin.find((item) => item.key === key);
        const newData = dataSourceCabin.filter((item) => item.key !== key);
        const newKey = generateUniqueKey(dataSourceSelectionCabin);
        const addedData = { ...deletedData, key: newKey };
        setDataSourceSelectionCabin([...dataSourceSelectionCabin, addedData]);
        setDataSourceCabin(newData);
    };
    const [searchText, setSearchText] = useState('');
    const [searchedColumn, setSearchedColumn] = useState('');
    const searchInput = useRef(null);
    const handleSearch = (selectedKeys, confirm, dataIndex) => {
        confirm();
        setSearchText(selectedKeys[0]);
        setSearchedColumn(dataIndex);
    };
    const handleReset = (clearFilters) => {
        clearFilters();
        setSearchText('');
    };
    const getColumnSearchProps = (dataIndex) => ({
        filterDropdown: ({ setSelectedKeys, selectedKeys, confirm, clearFilters, close }) => (
            <div
                style={{
                    padding: 8,
                }}
                onKeyDown={(e) => e.stopPropagation()}
            >
                <Input
                    ref={searchInput}
                    placeholder={`Search ${dataIndex}`}
                    value={selectedKeys[0]}
                    onChange={(e) => setSelectedKeys(e.target.value ? [e.target.value] : [])}
                    onPressEnter={() => handleSearch(selectedKeys, confirm, dataIndex)}
                    style={{
                        marginBottom: 8,
                        display: 'block',
                    }}
                />
                <Space>
                    <Button
                        type="primary"
                        onClick={() => handleSearch(selectedKeys, confirm, dataIndex)}
                        icon={<SearchOutlined />}
                        size="small"
                        style={{
                            width: 90,
                        }}
                    >
                        Search
                    </Button>
                    <Button
                        onClick={() => clearFilters && handleReset(clearFilters)}
                        size="small"
                        style={{
                            width: 90,
                        }}
                    >
                        Reset
                    </Button>
                    <Button
                        type="link"
                        size="small"
                        onClick={() => {
                            confirm({
                                closeDropdown: false,
                            });
                            setSearchText(selectedKeys[0]);
                            setSearchedColumn(dataIndex);
                        }}
                    >
                        Filter
                    </Button>
                    <Button
                        type="link"
                        size="small"
                        onClick={() => {
                            close();
                        }}
                    >
                        Close
                    </Button>
                </Space>
            </div>
        ),
        filterIcon: (filtered) => (
            <SearchOutlined
                style={{
                    color: filtered ? '#1677ff' : undefined,
                }}
            />
        ),
        onFilter: (value, record) =>
            record[dataIndex].toString().toLowerCase().includes(value.toLowerCase()),
        onFilterDropdownOpenChange: (visible) => {
            if (visible) {
                setTimeout(() => searchInput.current?.select(), 100);
            }
        },
    });
    const FlightSelectionColumns = [
        {
            title: 'ID',
            dataIndex: 'id',
            key: 'id',
            ...getColumnSearchProps('id'),
        },
        {
            title: 'Name',
            dataIndex: 'name',
            key: 'name',
            ...getColumnSearchProps('name'),
        },
        {
            title: 'Age',
            dataIndex: 'age',
            key: 'age',
            ...getColumnSearchProps('age'),
        },
        {
            title: 'Gender',
            dataIndex: 'gender',
            key: 'gender',
            ...getColumnSearchProps('gender')
        },
        {
            title: 'Nationality',
            dataIndex: 'nationality',
            key: 'nationality',
            ...getColumnSearchProps('nationality')
        },
        {
            title: 'Languages',
            dataIndex: 'languages',
            key: 'languages',
            ...getColumnSearchProps('languages')
        },
        {
            title: 'Vehicle Type',
            dataIndex: 'vehicleType',
            key: 'vehicleType',
            ...getColumnSearchProps('vehicleType')
        },
        {
            title: 'Range',
            dataIndex: 'range',
            key: 'range',
            ...getColumnSearchProps('range')
        },
        {
            title: 'Seniority Level',
            dataIndex: 'seniorityLevel',
            key: 'seniorityLevel',
            ...getColumnSearchProps('seniorityLevel')
        },
        {
            title: '',
            dataIndex: 'operation',
            width: '10%',
            render: (_, record) =>
                dataSourceSelectionFlight.length >= 1 ? (
                    <Popconfirm title="Sure to add?" onConfirm={() => handleAddFlight(record.key)}>
                        <Button type='link'> Add </Button>
                    </Popconfirm>
                ) : null,
        },
    ];
    const FlightCrewColumns = [
        {
            title: 'ID',
            dataIndex: 'id',
            key: 'id',
            ...getColumnSearchProps('id'),
        },
        {
            title: 'Name',
            dataIndex: 'name',
            key: 'name',
            ...getColumnSearchProps('name'),
        },
        {
            title: 'Age',
            dataIndex: 'age',
            key: 'age',
            ...getColumnSearchProps('age'),
        },
        {
            title: 'Gender',
            dataIndex: 'gender',
            key: 'gender',
            ...getColumnSearchProps('gender')
        },
        {
            title: 'Nationality',
            dataIndex: 'nationality',
            key: 'nationality',
            ...getColumnSearchProps('nationality')
        },
        {
            title: 'Languages',
            dataIndex: 'languages',
            key: 'languages',
            ...getColumnSearchProps('languages')
        },
        {
            title: 'Vehicle Type',
            dataIndex: 'vehicleType',
            key: 'vehicleType',
            ...getColumnSearchProps('vehicleType')
        },
        {
            title: 'Range',
            dataIndex: 'range',
            key: 'range',
            ...getColumnSearchProps('range')
        },
        {
            title: 'Seniority Level',
            dataIndex: 'seniorityLevel',
            key: 'seniorityLevel',
            ...getColumnSearchProps('seniorityLevel')
        },
        {
            title: '',
            dataIndex: 'operation',
            width: '10%',
            render: (_, record) =>
                dataSourceFlight.length >= 1 ? (
                    <Popconfirm title="Sure to delete?" onConfirm={() => handleDeleteFlight(record.key)}>
                        <Button type='link' danger> Delete </Button>
                    </Popconfirm>
                ) : null,
        },
    ];
    const CabinSelectionColumns = [
        {
            title: 'ID',
            dataIndex: 'id',
            key: 'id',
            ...getColumnSearchProps('id'),
        },
        {
            title: 'Name',
            dataIndex: 'name',
            key: 'name',
            ...getColumnSearchProps('name'),
        },
        {
            title: 'Age',
            dataIndex: 'age',
            key: 'age',
            ...getColumnSearchProps('age'),
        },
        {
            title: 'Gender',
            dataIndex: 'gender',
            key: 'gender',
            ...getColumnSearchProps('gender')

        },
        {
            title: 'Nationality',
            dataIndex: 'nationality',
            key: 'nationality',
            ...getColumnSearchProps('nationality')
        },
        {
            title: 'Languages',
            dataIndex: 'languages',
            key: 'languages',
            ...getColumnSearchProps('languages')
        },
        {
            title: 'Attendant Type',
            dataIndex: 'attendantType',
            key: 'attendantType',
            ...getColumnSearchProps('attendantType')
        },
        {
            title: 'Vehicle Type',
            dataIndex: 'vehicleType',
            key: 'vehicleType',
            ...getColumnSearchProps('vehicleType')
        },
        {
            title: 'Dishes',
            dataIndex: 'dishes',
            key: 'dishes',
            ...getColumnSearchProps('dishes')
        },
        {
            title: 'Seniority Level',
            dataIndex: 'seniorityLevel',
            key: 'seniorityLevel',
            ...getColumnSearchProps('seniorityLevel')
        },
        {
            title: '',
            dataIndex: 'operation',
            width: '10%',
            render: (_, record) =>
                dataSourceSelectionCabin.length >= 1 ? (
                    <Popconfirm title="Sure to add?" onConfirm={() => handleAddCabin(record.key)}>
                        <Button type='link'> Add </Button>
                    </Popconfirm>
                ) : null,
        },
    ];
    const CabinCrewColumns = [
        {
            title: 'ID',
            dataIndex: 'id',
            key: 'id',
            ...getColumnSearchProps('id'),
        },
        {
            title: 'Name',
            dataIndex: 'name',
            key: 'name',
            ...getColumnSearchProps('name'),
        },
        {
            title: 'Age',
            dataIndex: 'age',
            key: 'age',
            ...getColumnSearchProps('age'),
        },
        {
            title: 'Gender',
            dataIndex: 'gender',
            key: 'gender',
            ...getColumnSearchProps('gender')

        },
        {
            title: 'Nationality',
            dataIndex: 'nationality',
            key: 'nationality',
            ...getColumnSearchProps('nationality')
        },
        {
            title: 'Languages',
            dataIndex: 'languages',
            key: 'languages',
            ...getColumnSearchProps('languages')
        },
        {
            title: 'Attendant Type',
            dataIndex: 'attendantType',
            key: 'attendantType',
            ...getColumnSearchProps('attendantType')
        },
        {
            title: 'Vehicle Type',
            dataIndex: 'vehicleType',
            key: 'vehicleType',
            ...getColumnSearchProps('vehicleType')
        },
        {
            title: 'Dishes',
            dataIndex: 'dishes',
            key: 'dishes',
            ...getColumnSearchProps('dishes')
        },
        {
            title: 'Seniority Level',
            dataIndex: 'seniorityLevel',
            key: 'seniorityLevel',
            ...getColumnSearchProps('seniorityLevel')
        },
        {
            title: '',
            dataIndex: 'operation',
            width: '10%',
            render: (_, record) =>
                dataSourceCabin.length >= 1 ? (
                    <Popconfirm title="Sure to delete?" onConfirm={() => handleDeleteCabin(record.key)}>
                        <Button type='link' danger> Delete </Button>
                    </Popconfirm>
                ) : null,
        },
    ];
    function extractId(dataSourceF, dataSourceC) {
        const idFlight = dataSourceF.map((item) => item.id);
        const idCabin = dataSourceC.map((item) => item.id);
        return { "pilot_ids": idFlight, "crew_ids": idCabin };
    }
    function checkCrew() {
        FlightApi.deleteFlightRoster(flight.flight_number).then((response) => {
            FlightApi.manualGenerateFlightRoster(flight.flight_number, extractId(dataSourceFlight, dataSourceCabin)).then((response) => {
                if (typeof response === 'string') {
                    openNotification('topRight', response);
                }
                else {
                    navigate('/view');
                }
            });
        });
    }
    return (
        <>
            {contextHolder}
            <Layout >
                <Content >
                    <FlightSummary fromPoint={flight.flight_src} departureDate={formatDate(flight.flight_date)} toPoint={flight.flight_dest} />
                    <Space direction='vertical' style={{ display: 'flex', padding: '20px 50px 0px 50px' }}>

                        <Typography.Title level={4}>Flight Crew Selection</Typography.Title>
                        <Table
                            rowClassName={() => 'editable-row'}
                            scroll={{ x: true }}
                            bordered
                            dataSource={dataSourceSelectionFlight}
                            columns={FlightSelectionColumns}
                        />
                        <Typography.Title level={4}>Current Flight Crew</Typography.Title>
                        <Table
                            rowClassName={() => 'editable-row'}
                            scroll={{ x: true }}
                            bordered
                            dataSource={dataSourceFlight}
                            columns={FlightCrewColumns}
                        />
                        <Typography.Title level={4}>Cabin Crew Selection</Typography.Title>
                        <Table
                            rowClassName={() => 'editable-row'}
                            scroll={{ x: true }}
                            bordered
                            dataSource={dataSourceSelectionCabin}
                            columns={CabinSelectionColumns}
                        />
                        <Typography.Title level={4}>Current Cabin Crew</Typography.Title>
                        <Table
                            rowClassName={() => 'editable-row'}
                            scroll={{ x: true }}
                            bordered
                            dataSource={dataSourceCabin}
                            columns={CabinCrewColumns}
                        />
                    </Space>
                    <Space style={{ display: 'flex', justifyContent: 'space-between', padding: '10px 50px' }}>
                        <Button type="primary" onClick={checkCrew}>CONFIRM</Button>
                    </Space>
                </Content>
            </Layout >
        </>


    );
}
export default ManualSelectionPage