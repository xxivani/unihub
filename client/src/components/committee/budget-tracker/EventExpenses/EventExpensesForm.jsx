import { Button, Form, Input, Modal, DatePicker, Select, Radio, Checkbox, Spin, message } from 'antd';
import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { LinkOutlined } from '@ant-design/icons';
import "./EventExpensesForm.css";

function EventAddExpenseButton({ onAddEvent }) {
  const [form] = Form.useForm();
  const variant = Form.useWatch('variant', form);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedCategories, setSelectedCategories] = useState({});
  const [clubName, setClubName] = useState('');

  // State for linking to existing events
  const [generalEvents, setGeneralEvents] = useState([]);
  const [loadingEvents, setLoadingEvents] = useState(false);
  const [selectedGeneralEvent, setSelectedGeneralEvent] = useState(null);
  const [linkToExistingEvent, setLinkToExistingEvent] = useState(false);

  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const [clubId, setClubId] = useState(null);

  const apiUrl = import.meta.env.VITE_API_URL || "http://localhost:5000/api";

  // Category colors for visual consistency with the table
  const categoryColors = {
    catering: "blue",
    materials: "green",
    prize: "gold",
    venue: "purple",
    transportation: "red",
  };

  // Available categories
  const categories = [
    { label: 'Catering', value: 'catering' },
    { label: 'Materials', value: 'materials' },
    { label: 'Prize', value: 'prize' },
    { label: 'Venue', value: 'venue' },
    { label: 'Transportation', value: 'transportation' },
  ];

  // On component mount, get club_id from URL or session
  useEffect(() => {
    const clubIdFromUrl = queryParams.get('club_id');
    const clubIdFromSession = sessionStorage.getItem('selectedClubId');

    const id = clubIdFromUrl || clubIdFromSession;
    if (id) {
      setClubId(id);
      // Fetch club name if needed
      fetchClubName(id);
    }
    console.log("EventExpensesForm - Using Club ID:", id);
  }, [location.search]);

  // Fetch club name if available
  const fetchClubName = async (id) => {
    try {
      const response = await fetch(`${apiUrl}/clubs/${id}`);
      if (response.ok) {
        const data = await response.json();
        setClubName(data.club_name || `Club ${id}`);
      } else {
        setClubName(`Club ${id}`);
      }
    } catch (error) {
      console.error("Error fetching club name:", error);
      setClubName(`Club ${id}`);
    }
  };

  // Fetch general events that could be linked
  const fetchGeneralEvents = async () => {
    if (!clubId) return;

    setLoadingEvents(true);
    try {
      // Get club name first for filtering
      let club = clubName;
      if (!club) {
        const clubResponse = await fetch(`${apiUrl}/clubs/${clubId}`);
        if (clubResponse.ok) {
          const clubData = await clubResponse.json();
          club = clubData.club_name;
        }
      }

      // Fetch events filtering by club
      const response = await fetch(`${apiUrl}/events`);
      if (response.ok) {
        const allEvents = await response.json();

        // Filter events by club 
        // Note: We're not filtering by budget_required to show all events
        const filteredEvents = allEvents.filter(event =>
          event.club && event.club.toLowerCase().includes((club || '').toLowerCase())
        );

        // Further filter to exclude events that are already linked
        const btEventsResponse = await fetch(`${apiUrl}/bt_eventRoute?club_id=${clubId}`);
        if (btEventsResponse.ok) {
          const btEvents = await btEventsResponse.json();
          const linkedEventIds = btEvents
            .filter(btEvent => btEvent.general_event_id)
            .map(btEvent => btEvent.general_event_id);

          const availableEvents = filteredEvents.filter(
            event => !linkedEventIds.includes(event.id)
          );

          setGeneralEvents(availableEvents);
        } else {
          setGeneralEvents(filteredEvents);
        }
      }
    } catch (error) {
      console.error("Error fetching general events:", error);
      message.error("Failed to load events. Please try again.");
    } finally {
      setLoadingEvents(false);
    }
  };

  // Open Modal
  const showModal = () => {
    // Check if a club is selected
    if (!clubId) {
      message.error('Please select a club first before adding an expense');
      return;
    }

    setIsModalOpen(true);
    setSelectedCategories({});
    setLinkToExistingEvent(false);
    setSelectedGeneralEvent(null);
    form.resetFields();

    // // Set default event status
    // form.setFieldsValue({
    //   eventStatus: 'ONGOING'
    // });

    // Fetch available general events for linking
    fetchGeneralEvents();
  };

  // Close Modal
  const handleCancel = () => {
    setIsModalOpen(false);
    setSelectedCategories({});
    setLinkToExistingEvent(false);
    setSelectedGeneralEvent(null);
    form.resetFields();
  };

  // Handle General Event Selection
  const handleGeneralEventChange = (eventId) => {
    const event = generalEvents.find(e => e.id === eventId);
    setSelectedGeneralEvent(event);

    if (event) {
      // Set form values WITHOUT the date field
      form.setFieldsValue({
        eventName: event.title,
        description: event.description || '',
        eventStatus: event.status
      });

      // Process budget categories
      if (event.budget && typeof event.budget === 'object') {
        const eventCategories = {};

        Object.entries(event.budget).forEach(([category, amount]) => {
          const lowerCategory = category.toLowerCase();
          if (categories.some(cat => cat.value === lowerCategory)) {
            const numAmount = parseFloat(amount);
            eventCategories[lowerCategory] = (numAmount && numAmount > 0) ?
              amount.toString() : "";
          }
        });

        setSelectedCategories(eventCategories);
      } else {
        setSelectedCategories({});
      }
    }
  };

  // Handle checkbox change for categories
  const handleCategoryChange = (category, checked) => {
    setSelectedCategories(prev => {
      if (checked) {
        return {
          ...prev,
          [category]: "" // Initialize with an empty string
        };
      } else {
        const newCategories = { ...prev };
        delete newCategories[category]; // Remove when unchecked
        return newCategories;
      }
    });
  };

  // Handle amount change for a category
  const handleAmountChange = (category, value) => {
    setSelectedCategories(prev => ({
      ...prev,
      [category]: value
    }));
  };

  // Handle Form Submission
  const handleSubmit = async (values) => {
    try {
      // Validate club selection
      if (!clubId) {
        message.error('Please select a club first');
        return;
      }
  
      // Validate at least one category is selected
      if (Object.keys(selectedCategories).length === 0) {
        message.error('Please select at least one expense category');
        return;
      }
  
      // Check for date and format it correctly
      let formattedDate = null;
      if (values.eventDate) {
        // If it's already a string, use it directly
        if (typeof values.eventDate === 'string') {
          formattedDate = values.eventDate;
        }
        // If it has a format method (moment or dayjs object), use it
        else if (values.eventDate.format) {
          formattedDate = values.eventDate.format('YYYY-MM-DD');
        }
        // Otherwise, try to convert to ISO string and extract the date part
        else {
          formattedDate = new Date(values.eventDate).toISOString().split('T')[0];
        }
      }
  
      // If we still don't have a valid date, show an error
      if (!formattedDate) {
        message.error('Please select a valid date');
        return;
      }
  
      // Create event data
      const eventData = {
        name: values.eventName,
        date: formattedDate,
        status: values.eventStatus,
        description: values.description || '',
        categories: Object.entries(selectedCategories)
          .map(([name, amount]) => ({
            name,
            amount: Number(amount) || 0
          })),
        club_id: clubId
      };
  
      // If linking to a general event, add its ID
      if (linkToExistingEvent && selectedGeneralEvent) {
        eventData.general_event_id = selectedGeneralEvent.id;
      }
  
      console.log("Creating new event with data:", eventData);
  
      // Send POST request to create event
      const eventResponse = await fetch(`${apiUrl}/bt_eventRoute`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(eventData)
      });
  
      if (!eventResponse.ok) {
        const errorData = await eventResponse.json();
        throw new Error(errorData.message || `Failed to create event: ${eventResponse.status}`);
      }
  
      const createdEvent = await eventResponse.json();
      console.log("Created event:", createdEvent);
  
      // Call the parent function to refresh data
      if (onAddEvent) {
        onAddEvent();
      }
  
      message.success('Event added successfully');
      form.resetFields();
      setSelectedCategories({});
      setLinkToExistingEvent(false);
      setSelectedGeneralEvent(null);
      setIsModalOpen(false);
    } catch (error) {
      console.error('Error creating event:', error);
      message.error(`Failed to create event: ${error.message}`);
    }
  };

  // Toggle link to existing event
  const handleToggleLinking = (checked) => {
    setLinkToExistingEvent(checked);
    if (!checked) {
      setSelectedGeneralEvent(null);
      form.resetFields(['eventName', 'description', 'eventDate']);

      // Clear selected categories when unlinking
      setSelectedCategories({});
    }
  };

  return (
    <>
      {/* Button to open Modal */}
      <Button className='event-add-expense-button' type="primary" onClick={showModal}>
        Add New Expense
      </Button>

      {/* Modal */}
      <Modal
        title={<div className='event-expense-form-modal-title'>
          {clubName ? `Add Event Expense for ${clubName}` : 'Event Expense Form'}
        </div>}
        open={isModalOpen}
        onCancel={handleCancel}
        footer={null}
      >
        <Form
          form={form}
          layout="vertical"
          variant={variant || 'filled'}
          onFinish={handleSubmit}
        >
          <Form.Item label="Link to existing event?" name="linkToEvent">
            <Checkbox
              checked={linkToExistingEvent}
              onChange={(e) => handleToggleLinking(e.target.checked)}
            >
              <span style={{ display: 'flex', alignItems: 'center' }}>
                <LinkOutlined style={{ marginRight: '5px' }} />
                Link to an existing event from the main system
              </span>
            </Checkbox>
          </Form.Item>

          {linkToExistingEvent && (
            <Form.Item
              label="Select Event"
              required
              help="Events from this club are shown"
            >
              {loadingEvents ? (
                <div style={{ textAlign: 'center', padding: '10px' }}>
                  {/* <Spin /> Loading events... */}
                </div>
              ) : generalEvents.length > 0 ? (
                <Select
                  placeholder="Select an event to link"
                  style={{ width: '100%' }}
                  onChange={handleGeneralEventChange}
                  optionFilterProp="children"
                  showSearch
                  filterOption={(input, option) =>
                    option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
                  }
                >
                  {generalEvents.map(event => (
                    <Select.Option key={event.id} value={event.id}>
                      {event.title}
                    </Select.Option>
                  ))}
                </Select>
              ) : (
                <div>No available events found for linking.</div>
              )}
            </Form.Item>
          )}

          <Form.Item
            label="Event Name"
            name="eventName"
            rules={[{ required: true, message: 'Please input event name' }]}
          >
            <Input disabled={linkToExistingEvent && selectedGeneralEvent} />
          </Form.Item>

          <Form.Item
            label={
              <span>
                Event Date
                {linkToExistingEvent && selectedGeneralEvent && (
                  <span style={{ fontWeight: 'normal', marginLeft: '8px', fontSize: '12px' }}>
                    (Original: {selectedGeneralEvent.date})
                  </span>
                )}
              </span>
            }
            name="eventDate"
            rules={[{ required: true, message: 'Please select a date' }]}
            extra={linkToExistingEvent && selectedGeneralEvent ? "Please select the date manually" : ""}
          >
            <DatePicker
              style={{ width: '100%' }}
              format="YYYY-MM-DD"
            />
          </Form.Item>

          <Form.Item
            label="Event Description"
            name="description"
          >
            <Input.TextArea rows={3} />
          </Form.Item>

          <Form.Item
            label="Event Status"
            name="eventStatus"
            rules={[{ required: true, message: 'Please select status' }]}
          >
            <Radio.Group>
              <Radio value="ONGOING">ONGOING</Radio>
              <Radio value="COMPLETED">COMPLETED</Radio>
            </Radio.Group>
          </Form.Item>

          <Form.Item
            label="Expense Categories"
            required
            validateStatus={Object.keys(selectedCategories).length === 0 ? 'error' : 'success'}
            help={Object.keys(selectedCategories).length === 0 ? 'Please select at least one category' : null}
          >
            {categories.map(category => (
              <div key={category.value} style={{ marginBottom: "8px" }}>
                <Checkbox
                  checked={selectedCategories[category.value] !== undefined}
                  onChange={(e) => handleCategoryChange(category.value, e.target.checked)}
                >
                  {category.label}
                </Checkbox>

                {/* Conditionally render amount input */}
                {selectedCategories[category.value] !== undefined && (
                  <Input
                    type="number"
                    addonBefore="AED"
                    placeholder="Enter amount"
                    value={selectedCategories[category.value]}
                    onChange={(e) => handleAmountChange(category.value, e.target.value)}
                    style={{ width: "100%", marginTop: "5px" }}
                  />
                )}
              </div>
            ))}
          </Form.Item>

          {/* Hidden field to store club_id */}
          <input type="hidden" value={clubId} />

          <Form.Item>
            <Button
              className='event-expense-form-submit-button'
              type="primary"
              htmlType="submit"
              disabled={Object.keys(selectedCategories).length === 0}
            >
              Submit
            </Button>
            <Button
              className='event-expense-form-cancel-button'
              onClick={handleCancel}
              style={{ marginLeft: 8 }}
            >
              Cancel
            </Button>
          </Form.Item>
        </Form>
      </Modal>
    </>
  );
}

export default EventAddExpenseButton;