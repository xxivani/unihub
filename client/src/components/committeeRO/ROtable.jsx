import {
  Space,
  Table,
  Typography,
  Button,
  Form,
  Input,
  Select,
  Modal,
  ConfigProvider,
  Popconfirm,
  message
} from 'antd';
import { useEffect, useState } from 'react';
import { EditOutlined, DeleteOutlined } from '@ant-design/icons';
import { Link } from 'react-router-dom';
import roleTableData from './roleTableData';
import "../committee/budget-tracker/EventExpenses/EventExpensesForm.css";
import './ROtable.css';

const { Option } = Select;
const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:5001/api';

const ROTable = ({ selectedClubId }) => {
  const [form] = Form.useForm();
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [hasPermission, setHasPermission] = useState(false);
  const [userRole, setUserRole] = useState("");

  const checkPermission = async () => {
    try {
      const userData = JSON.parse(sessionStorage.getItem("user"));
      if (!userData || !userData.id) return;

      setUserRole(userData.role);
      if (userData.role === "admin") {
        setHasPermission(true);
        return;
      }

      const userId = userData.id;
      const cmRes = await fetch(`${apiUrl}/committee-members/by-user/${userId}`);
      const cm = await cmRes.json();

      if (!cm || !cm.committee_member_id) return;

      const permRes = await fetch(`${apiUrl}/committee-member-permissions/${cm.committee_member_id}`);
      const perms = await permRes.json();
      const hasListPermission = perms.some(p => p.permission === "ListRoleOpening");

      setHasPermission(hasListPermission);
    } catch (err) {
      console.warn("Failed to fetch permissions:", err.message);
    }
  };

  const fetchRoles = async () => {
    try {
      const response = await fetch(`${apiUrl}/role-openings`);
      const result = await response.json();

      const userData = JSON.parse(sessionStorage.getItem("user"));
      if (!userData || !userData.id) return;

      let clubIdToUse = selectedClubId;

      // If not admin, find committee member club
      if (userData.role !== "admin") {
        const cmRes = await fetch(`${apiUrl}/committee-members/by-user/${userData.id}`);
        const cm = await cmRes.json();
        if (!cm || !cm.club_id) return;
        clubIdToUse = cm.club_id;
      }

      const filtered = result.filter(role => role.club_id == clubIdToUse);

      const formattedData = filtered.map((role) => ({
        key: role.role_opening_id,
        roleName: role.position,
        applications: role.number_of_registrations,
        deadline: new Date(role.due_date).toLocaleDateString(),
        status: role.status,
      }));

      setData(formattedData);
    } catch (err) {
      console.error("Error fetching role openings:", err);
      message.warning("Could not load roles from server. Showing sample data.");
      setData(roleTableData);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    checkPermission();
    // fetchRoles();
  }, []);

  useEffect(() => {
    if (selectedClubId || userRole === "committee") fetchRoles();
  }, [selectedClubId]);

  const handleDelete = async (id) => {
    try {
      const response = await fetch(`${apiUrl}/role-openings/${id}`, {
        method: 'DELETE'
      });

      if (!response.ok) {
        const errData = await response.json();
        throw new Error(errData.message || 'Failed to delete role opening');
      }

      setData(prev => prev.filter(role => role.key !== id));
      message.success('Role deleted successfully');
    } catch (err) {
      console.error("Error deleting role opening:", err);
      message.error(`Error: ${err.message}`);
    }
  };

  const columns = [
    {
      title: "Position",
      dataIndex: "roleName",
      key: "roleName",
      width: 170,
    },
    {
      title: 'Number of Applications',
      dataIndex: 'applications',
      key: 'applications',
      width: 150,
    },
    {
      title: "Deadline",
      dataIndex: "deadline",
      key: "deadline",
      width: 180,
    },
    {
      title: "Role Status",
      dataIndex: "status",
      key: "status",
      width: 190,
      align: 'left',
    },
    ...(hasPermission ? [
      {
        title: "Actions",
        width: 180,
        render: (_, record) => (
          <Space size="middle">
            {record.status === "ONGOING" && (
              <Link to={`/committee/roles/edit/${record.key}`} className="ro-action-link">
                <EditOutlined /> Edit
              </Link>
            )}
            <Popconfirm
              title="Are you sure you want to delete this role?"
              onConfirm={() => handleDelete(record.key)}
              okText="Yes"
              cancelText="No"
            >
              <Button type="link" danger>
                <DeleteOutlined /> Delete
              </Button>
            </Popconfirm>
          </Space>
        ),
      }
    ] : []),
    {
      title: "View Students",
      width: 180,
      render: (_, record) => (
        <div className="view-students-link">
          <Link to={`/committee/roles/view/${record.key}`} style={{ color: "black" }}>
            View Registered Students
          </Link>
        </div>
      ),
    },
  ];

  if (!hasPermission) {
    return <p style={{ textAlign: "center", marginTop: "50px" }}>You do not have permission to manage role openings.</p>;
  }

  return (
    <ConfigProvider
      theme={{
        token: {
          colorPrimary: "#314521",
          colorPrimaryHover: "#314521"
        },
      }}
    >
      <Table
        columns={columns}
        dataSource={data}
        loading={loading}
        pagination={false}
      />
      <Modal
        title={<div className='event-expense-form-modal-title'>Edit Role</div>}
        open={false}
      >
        <Form form={form} layout="vertical">
          <Form.Item name="name" label="Role Name" rules={[{ required: true }]}>
            <Input />
          </Form.Item>
          <Form.Item name="date" label="Deadline" rules={[{ required: true }]}>
            <Input />
          </Form.Item>
          <Form.Item name="status" label="Role Status" rules={[{ required: true }]}>
            <Select>
              <Option value="ONGOING">ONGOING</Option>
              <Option value="COMPLETED">COMPLETED</Option>
            </Select>
          </Form.Item>
        </Form>
      </Modal>
    </ConfigProvider>
  );
};

export default ROTable;
