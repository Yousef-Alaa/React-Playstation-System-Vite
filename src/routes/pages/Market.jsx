import React, { useEffect, useState } from 'react';
import { Button, Table, message, Input, InputNumber, Popconfirm, Modal, Row, Col } from 'antd';
import { DeleteOutlined, QuestionCircleOutlined } from '@ant-design/icons'
import { MdOutlineEdit } from 'react-icons/md';
import { AppContext } from "../../App";
import PagesHead from '../../componenets/PagesHead';
import { useContext } from 'react';
import NewMarketItem from '../../componenets/NewMarketItem';
import EditMarketItem from '../../componenets/EditMarketItem';

const columns = [
    { title: '#ID', dataIndex: 'uid'},
    { title: 'Icon', dataIndex: 'iconAsImg' },
    { title: 'Name', dataIndex: 'name' },
    { title: 'Price', dataIndex: 'price', sorter: (a, b) => a.price - b.price},
    { title: 'Stowage', dataIndex: 'stowage', sorter: (a, b) => a.stowage - b.stowage},
    { title: 'Actions', dataIndex: 'actions' }
];


export default function Market() {

    const { appSettings: { market }, dispatchSetting } = useContext(AppContext)
    
    const [localMarket, setLocalMarket] = useState([{key: 1, icon: '', name: ``, price: 0, stowage: 0}])
    const [itemId, setItemId] = useState('000000')
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [isNewModalOpen, setIsNewModalOpen] = useState(false);
    const [selectedRowKeys, setSelectedRowKeys] = useState([]);

    function onSelectChange(newSelectedRowKeys) {
        setSelectedRowKeys(newSelectedRowKeys);
    };

    const rowSelection = {
    selectedRowKeys,
    onChange: onSelectChange,
    selections: [
        Table.SELECTION_ALL,
        Table.SELECTION_INVERT,
        Table.SELECTION_NONE,
        {
            key: 'odd',
            text: 'Select Odd Row',
            onSelect: (changableRowKeys) => {
                let newSelectedRowKeys = [];
                newSelectedRowKeys = changableRowKeys.filter((_, index) => {
                    if (index % 2 !== 0) {
                        return false;
                    }
                    return true;
                });
                setSelectedRowKeys(newSelectedRowKeys);
            },
        },
        {
            key: 'even',
            text: 'Select Even Row',
            onSelect: (changableRowKeys) => {
                let newSelectedRowKeys = [];
                newSelectedRowKeys = changableRowKeys.filter((_, index) => {
                    if (index % 2 !== 0) {
                    return true;
                    }
                    return false;
                });
                setSelectedRowKeys(newSelectedRowKeys);
            },
        },
    ],
    };

    useEffect(() => {
        let d = market.map((item, ind) => {
            let i = ind + 1;
            return {
            ...item, 
            key: i,
            iconAsImg: <img src={item.icon.local ? `/images/marketicons/${item.icon.src}` : item.icon.src} width='40' height='40' alt='icon' />,
            actions: <div style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                columnGap: '20px'
            }}>
                <MdOutlineEdit onClick={() => {setIsEditModalOpen(true); setItemId(item.uid)}} style={{cursor: 'pointer', fontSize: 18}} />
                <Popconfirm
                placement="topRight"
                title='Confirm Deleting'
                description={`Are you sure to delete Item ?`}
                onConfirm={() => {
                    dispatchSetting({type: 'MARKET_DELETE_ITEM', uid: item.uid})
                    setItemId('000000')
                    message.success('Deleted Successfuly')
                }}
                okText="Yes"
                cancelText="No"
                icon={<QuestionCircleOutlined style={{color: 'red'}}/>}>
                    <DeleteOutlined style={{cursor: 'pointer', fontSize: 18, color: '#ff4d4f'}} />
                </Popconfirm>
            </div>
        }})

        setLocalMarket(d)
    }, [market])

    function handleDeleteItems() {
        let items = localMarket.filter(item => selectedRowKeys.includes(item.key)).map(item => item.uid)
        dispatchSetting({type: 'MARKET_DELETE_ITEMS', uids: items})
        setSelectedRowKeys([])
        setItemId('000000')
        message.success('Deleted Successfuly')
    }

    return (
    <div className='market'>
        <PagesHead pageTitle='Market' />
        <Table rowSelection={rowSelection} columns={columns} dataSource={localMarket} />
        <div style={{display: 'flex', justifyContent: 'flex-end', marginTop: 20, paddingBottom: 40}}>
            <Button type='primary' onClick={() => setIsNewModalOpen(true)} style={{marginRight: 12}}>Add New Item</Button>
            <Button type='primary' onClick={handleDeleteItems} danger>Remove Selected Items</Button>
        </div>
        
        <EditMarketItem isEditModalOpen={isEditModalOpen} setIsEditModalOpen={setIsEditModalOpen} itemId={itemId} setItemId={setItemId} />
        <NewMarketItem isNewModalOpen={isNewModalOpen} setIsNewModalOpen={setIsNewModalOpen} />
    </div>)
}