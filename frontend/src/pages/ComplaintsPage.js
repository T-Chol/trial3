import React, { useState } from 'react';
import styled from 'styled-components';
import DashboardLayout from '../components/DashboardLayout';
import { AlertCircle, Send, Paperclip, Search } from 'lucide-react';

const PageHeader = styled.div`
  padding: 20px;
`;

const PageTitle = styled.h1`
  font-size: 24px;
  color: #1a202c;
  margin-bottom: 8px;
`;

const PageDescription = styled.p`
  color: #718096;
  font-size: 14px;
`;

const Container = styled.div`
  padding: 20px;
`;

const StatsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 20px;
  margin-bottom: 24px;
`;

const StatCard = styled.div`
  background: white;
  border-radius: 8px;
  padding: 20px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
`;

const StatTitle = styled.div`
  color: #718096;
  font-size: 14px;
  margin-bottom: 8px;
`;

const StatValue = styled.div`
  font-size: 24px;
  font-weight: 600;
  color: #1a202c;
`;

const FormCard = styled.div`
  background: white;
  border-radius: 8px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
  padding: 24px;
`;

const Form = styled.form`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 20px;

  @media (max-width: 768px) {
    grid-template-columns: 1fr;
  }
`;

const FormGroup = styled.div`
  &.full-width {
    grid-column: 1 / -1;
  }
`;

const Label = styled.label`
  display: block;
  font-size: 14px;
  color: #4a5568;
  margin-bottom: 8px;
`;

const Input = styled.input`
  width: 100%;
  padding: 8px 12px;
  border: 1px solid ${props => props.error ? '#FF4D4F' : '#E2E8F0'};
  border-radius: 6px;
  font-size: 14px;
  color: #1a202c;
  background: white;

  &:focus {
    outline: none;
    border-color: #4299E1;
    box-shadow: 0 0 0 3px rgba(66, 153, 225, 0.1);
  }

  &::placeholder {
    color: #A0AEC0;
  }
`;

const Select = styled.select`
  width: 100%;
  padding: 8px 12px;
  border: 1px solid #E2E8F0;
  border-radius: 6px;
  font-size: 14px;
  color: #1a202c;
  background: white;
  appearance: none;
  background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 24 24' stroke='%23A0AEC0'%3E%3Cpath stroke-linecap='round' stroke-linejoin='round' stroke-width='2' d='M19 9l-7 7-7-7'%3E%3C/path%3E%3C/svg%3E");
  background-repeat: no-repeat;
  background-position: right 12px center;
  background-size: 16px;

  &:focus {
    outline: none;
    border-color: #4299E1;
    box-shadow: 0 0 0 3px rgba(66, 153, 225, 0.1);
  }
`;

const Textarea = styled.textarea`
  width: 100%;
  padding: 8px 12px;
  border: 1px solid #E2E8F0;
  border-radius: 6px;
  font-size: 14px;
  color: #1a202c;
  min-height: 120px;
  resize: vertical;

  &:focus {
    outline: none;
    border-color: #4299E1;
    box-shadow: 0 0 0 3px rgba(66, 153, 225, 0.1);
  }
`;

const FileUpload = styled.div`
  border: 2px dashed #E2E8F0;
  border-radius: 6px;
  padding: 20px;
  text-align: center;
  cursor: pointer;
  transition: all 0.2s;

  &:hover {
    border-color: #4299E1;
    background: #EBF8FF;
  }

  input {
    display: none;
  }
`;

const ButtonGroup = styled.div`
  grid-column: 1 / -1;
  display: flex;
  justify-content: flex-end;
  gap: 12px;
  margin-top: 20px;
`;

const Button = styled.button`
  padding: 8px 16px;
  border-radius: 6px;
  font-size: 14px;
  font-weight: 500;
  display: flex;
  align-items: center;
  gap: 8px;
  cursor: pointer;
  transition: all 0.2s;

  ${props => props.primary ? `
    background: #4299E1;
    color: white;
    border: none;

    &:hover {
      background: #3182CE;
    }
  ` : `
    background: white;
    color: #4A5568;
    border: 1px solid #E2E8F0;

    &:hover {
      background: #F7FAFC;
    }
  `}
`;

const ErrorMessage = styled.div`
  color: #FF4D4F;
  font-size: 12px;
  margin-top: 4px;
  display: flex;
  align-items: center;
  gap: 4px;
`;

const ComplaintForm = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    phone: '',
    description: '',
    category: '',
    urgency: '',
    file: null
  });
  const [errors, setErrors] = useState({});

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: files ? files[0] : value
    }));
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    // Add form validation and submission logic here
  };

  return (
    <DashboardLayout>
      <PageHeader>
        <PageTitle>Submit Complaint</PageTitle>
        <PageDescription>Fill in the details below to submit a new complaint</PageDescription>
      </PageHeader>

      <Container>
        <StatsGrid>
          <StatCard>
            <StatTitle>Total Complaints</StatTitle>
            <StatValue>23</StatValue>
          </StatCard>
          <StatCard>
            <StatTitle>Pending</StatTitle>
            <StatValue>5</StatValue>
          </StatCard>
          <StatCard>
            <StatTitle>Resolved</StatTitle>
            <StatValue>18</StatValue>
          </StatCard>
        </StatsGrid>

        <FormCard>
          <Form onSubmit={handleSubmit}>
            <FormGroup>
              <Label>Full Name</Label>
              <Input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                placeholder="Enter your full name"
                error={errors.name}
              />
              {errors.name && (
                <ErrorMessage>
                  <AlertCircle size={12} />
                  {errors.name}
                </ErrorMessage>
              )}
            </FormGroup>

            <FormGroup>
              <Label>Email Address</Label>
              <Input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="Enter your email"
                error={errors.email}
              />
            </FormGroup>

            <FormGroup>
              <Label>Phone Number</Label>
              <Input
                type="tel"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                placeholder="Enter your phone number"
              />
            </FormGroup>

            <FormGroup>
              {/* <Label>Category</Label> */}
              <Select
                name="category"
                value={formData.category}
                onChange={handleChange}
              >
                {/* <option value="">Select Category</option> */}
                <option value="Feedback">Feedback</option>
                <option value="Support">Support</option>
                <option value="Inquiry">Inquiry</option>
              </Select>
            </FormGroup>

            <FormGroup>
              <Label>Urgency Level</Label>
              <Select
                name="urgency"
                value={formData.urgency}
                onChange={handleChange}
              >
                <option value="">Select Urgency</option>
                <option value="Low">Low</option>
                <option value="Medium">Medium</option>
                <option value="High">High</option>
              </Select>
            </FormGroup>

            <FormGroup>
              <Label>Subject</Label>
              <Input
                type="text"
                name="subject"
                value={formData.subject}
                onChange={handleChange}
                placeholder="Enter complaint subject"
              />
            </FormGroup>

            <FormGroup className="full-width">
              <Label>Description</Label>
              <Textarea
                name="description"
                value={formData.description}
                onChange={handleChange}
                placeholder="Provide detailed information about your complaint..."
              />
            </FormGroup>

            <FormGroup className="full-width">
              <Label>Attachments (Optional)</Label>
              <FileUpload>
                <input
                  type="file"
                  name="file"
                  onChange={handleChange}
                  multiple
                />
                <Paperclip size={24} color="#718096" />
                <p>Drop files here or click to upload</p>
              </FileUpload>
            </FormGroup>

            <ButtonGroup>
              <Button type="button">
                Cancel
              </Button>
              <Button primary type="submit">
                <Send size={16} />
                Submit Complaint
              </Button>
            </ButtonGroup>
          </Form>
        </FormCard>
      </Container>
    </DashboardLayout>
  );
};

export default ComplaintForm;