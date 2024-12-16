import React, { useState } from 'react';
import styled from 'styled-components';

const ComplaintListContainer = styled.div`
  margin: 20px;
`;

const Table = styled.table`
  width: 100%;
  border-collapse: collapse;
  margin-top: 20px;
  background-color: #fff;
  border-radius: 8px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
`;

const Th = styled.th`
  border: 1px solid #ddd;
  padding: 8px;
  background-color: #f2f2f2;
  text-align: left;
`;

const Td = styled.td`
  border: 1px solid #ddd;
  padding: 8px;
`;

const FilterContainer = styled.div`
  display: flex;
  justify-content: space-between;
  margin-bottom: 20px;
`;

const Select = styled.select`
  padding: 10px;
  border: 1px solid #ccc;
  border-radius: 4px;
  font-size: 16px;
`;

const ComplaintList = ({ complaints, onComplaintClick, onFilterChange }) => {
  const [filter, setFilter] = useState({
    status: '',
    priority: '',
    category: '',
  });

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilter({ ...filter, [name]: value });
    onFilterChange({ ...filter, [name]: value });
  };

  const filteredComplaints = complaints.filter((complaint) => {
    return (
      (filter.status === '' || complaint.status === filter.status) &&
      (filter.priority === '' || complaint.priority === filter.priority) &&
      (filter.category === '' || complaint.category === filter.category)
    );
  });

  return (
    <ComplaintListContainer>
      <FilterContainer>
        <Select name="status" value={filter.status} onChange={handleFilterChange}>
          <option value="">All Statuses</option>
          <option value="open">Open</option>
          <option value="in_progress">In Progress</option>
          <option value="resolved">Resolved</option>
        </Select>
        <Select name="priority" value={filter.priority} onChange={handleFilterChange}>
          <option value="">All Priorities</option>
          <option value="low">Low</option>
          <option value="medium">Medium</option>
          <option value="high">High</option>
        </Select>
        <Select name="category" value={filter.category} onChange={handleFilterChange}>
          <option value="">All Categories</option>
          <option value="technical">Technical</option>
          <option value="customer_service">Customer Service</option>
          <option value="billing">Billing</option>
        </Select>
      </FilterContainer>
      <Table>
        <thead>
          <tr>
            <Th>Title</Th>
            <Th>Description</Th>
            {/* <Th>Category</Th> */}
            <Th>Priority</Th>
            <Th>Status</Th>
            <Th>Date Submitted</Th>
          </tr>
        </thead>
        <tbody>
          {filteredComplaints.length === 0 ? (
            <tr>
              <Td colSpan="6">No complaints to display</Td>
            </tr>
          ) : (
            filteredComplaints.map((complaint) => (
              <tr key={complaint.id} onClick={() => onComplaintClick(complaint.id)}>
                <Td>{complaint.title}</Td>
                <Td>{complaint.description}</Td>
                <Td>{complaint.category}</Td>
                <Td>{complaint.priority}</Td>
                <Td>{complaint.status}</Td>
                <Td>{complaint.date}</Td>
              </tr>
            ))
          )}
        </tbody>
      </Table>
    </ComplaintListContainer>
  );
};

export default ComplaintList;
