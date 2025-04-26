const { BTevent, Expense, Category, sequelize } = require('../../models');
const { Op } = require('sequelize');

// Get all events with expenses and categories

const getAllEventsBT = async (req, res) => {
  try {
    const { club_id } = req.query;
    console.log('Get all events - club_id:', club_id);
    
    // Require club_id parameter - don't allow fetching events without a club_id
    if (!club_id) {
      return res.status(400).json({ 
        message: 'club_id parameter is required' 
      });
    }
    
    // Use where clause with correct type conversion
    const whereClause = { club_id: parseInt(club_id) };
    console.log('Events where clause:', whereClause);

    const events = await BTevent.findAll({
      where: whereClause,
      include: [
        {
          model: Expense,
          as: 'expenses',
          include: [{ model: Category, as: 'category' }]
        }
      ],
      order: [['date', 'DESC']]
    });

    // Format the data to match the frontend's expected structure
    const formattedEvents = events.map(event => {
      const rawEvent = event.get({ plain: true });
      
      // Calculate total expenses for the event
      const totalExpense = rawEvent.expenses.reduce(
        (sum, expense) => sum + parseFloat(expense.amount || 0), 0
      );
      
      // Group expenses by category for the frontend tags
      const categoriesMap = {};
      rawEvent.expenses.forEach(expense => {
        if (expense.category) {
          const categoryName = expense.category.name.toLowerCase();
          if (!categoriesMap[categoryName]) {
            categoriesMap[categoryName] = 0;
          }
          categoriesMap[categoryName] += parseFloat(expense.amount || 0);
        }
      });
      
      // Convert to array format for frontend
      const categories = Object.entries(categoriesMap).map(([name, amount]) => ({
        name,
        amount
      }));
      
      return {
        id: rawEvent.id,
        key: rawEvent.id.toString(),
        name: rawEvent.name,
        date: new Date(rawEvent.date).toLocaleDateString('en-GB'),
        status: rawEvent.status,
        expense: `AED ${totalExpense.toFixed(2)}`,
        description: rawEvent.description,
        categories,
        club_id: rawEvent.club_id
      };
    });
    
    console.log(`Returning ${formattedEvents.length} events for club_id: ${club_id}`);
    return res.status(200).json(formattedEvents);
  } catch (error) {
    console.error('Error getting all events:', error);
    return res.status(500).json({ message: 'Failed to retrieve events', error: error.message });
  }
};


// Get event by ID
const getBTeventById = async (req, res) => {
  try {
    const { id } = req.params;
    
    const event = await BTevent.findByPk(id, {
      include: [
        {
          model: Expense,
          as: 'expenses',
          include: [{ model: Category, as: 'category' }]
        }
      ]
    });

    if (!event) {
      return res.status(404).json({ message: 'BTevent not found' });
    }

    // Format similar to getAllEvents
    const rawEvent = event.get({ plain: true });
    
    const totalExpense = rawEvent.expenses.reduce(
      (sum, expense) => sum + parseFloat(expense.amount), 0
    );
    
    const categoriesMap = {};
    rawEvent.expenses.forEach(expense => {
      const categoryName = expense.category.name.toLowerCase();
      if (!categoriesMap[categoryName]) {
        categoriesMap[categoryName] = 0;
      }
      categoriesMap[categoryName] += parseFloat(expense.amount);
    });
    
    const categories = Object.entries(categoriesMap).map(([name, amount]) => ({
      name,
      amount
    }));
    
    const formattedEvent = {
      id: rawEvent.id,
      key: rawEvent.id.toString(),
      name: rawEvent.name,
      date: new Date(rawEvent.date).toLocaleDateString('en-GB'),
      status: rawEvent.status,
      expense: `AED ${totalExpense.toFixed(2)}`,
      description: rawEvent.description,
      categories,
      club_id: rawEvent.club_id,
    };

    return res.status(200).json(formattedEvent);
  } catch (error) {
    console.error('Error getting event by ID:', error);
    return res.status(500).json({ message: 'Failed to retrieve event', error: error.message });
  }
};

// Create a new event with expenses
const createEventBT = async (req, res) => {
  const transaction = await sequelize.transaction();
  
  try {
    const { name, date, status, description, categories, club_id } = req.body;
    
    // Validate input
    if (!name || !date || !status) {
      return res.status(400).json({ message: 'Name, date, and status are required' });
    }

    // Ensure club_id is provided
    if (!club_id) {
      return res.status(400).json({ message: 'Club ID is required' });
    }
    
    if (!categories || !Array.isArray(categories) || categories.length === 0) {
      return res.status(400).json({ message: 'At least one expense category is required' });
    }
    
    // Parse date string if it's in DD/MM/YYYY format
    let formattedDate = date;
    if (date.includes('/')) {
      const [day, month, year] = date.split('/');
      formattedDate = `${year}-${month}-${day}`;
    }
    
    // Create the event
    const newEvent = await BTevent.create({
      name,
      date: formattedDate,
      status,
      description: description || '',
      club_id: parseInt(club_id),
    }, { transaction });
    
    // Create expenses for each category
    const expensePromises = categories.map(async ({ name: categoryName, amount }) => {
      // Find the category
      const category = await Category.findOne({
        where: {
          name: sequelize.where(
            sequelize.fn('LOWER', sequelize.col('name')), 
            sequelize.fn('LOWER', categoryName)
          )
        }
      });
      
      if (!category) {
        throw new Error(`Category not found: ${categoryName}`);
      }
      
      // Create the expense
      return Expense.create({
        amount,
        description: `${categoryName} expense for ${name}`,
        date: formattedDate,
        categoryId: category.id,
        eventId: newEvent.id,
        club_id: parseInt(club_id),
      }, { transaction });
    });
    
    await Promise.all(expensePromises);
    
    // Commit the transaction
    await transaction.commit();
    
    // Get the created event with all its relations
    const createdEvent = await BTevent.findByPk(newEvent.id, {
      include: [
        {
          model: Expense,
          as: 'expenses',
          include: [{ model: Category, as: 'category' }]
        }
      ]
    });
    
    // Format the response
    const rawEvent = createdEvent.get({ plain: true });
    
    const totalExpense = rawEvent.expenses.reduce(
      (sum, expense) => sum + parseFloat(expense.amount), 0
    );
    
    const responseCategories = categories.map(({ name, amount }) => ({
      name: name.toLowerCase(),
      amount: parseFloat(amount)
    }));
    
    const formattedEvent = {
      id: rawEvent.id,
      key: rawEvent.id.toString(),
      name: rawEvent.name,
      date: new Date(rawEvent.date).toLocaleDateString('en-GB'),
      status: rawEvent.status,
      expense: `AED ${totalExpense.toFixed(2)}`,
      description: rawEvent.description,
      categories: responseCategories,
      club_id: rawEvent.club_id,
    };
    
    return res.status(201).json(formattedEvent);
  } catch (error) {
    // Rollback the transaction on error
    await transaction.rollback();
    console.error('Error creating event:', error);
    return res.status(500).json({ message: 'Failed to create event', error: error.message });
  }
};

// Update an existing event
const updateEventBT = async (req, res) => {
  const transaction = await sequelize.transaction();
  
  try {
    const { id } = req.params;
    const { name, date, status, description, categories, club_id } = req.body;
    
    // Find the event
    const event = await BTevent.findByPk(id);
    
    if (!event) {
      await transaction.rollback();
      return res.status(404).json({ message: 'Event not found' });
    }

    //parse date
    let formattedDate = date;
    if (date && date.includes('/')) {
      const [day, month, year] = date.split('/');
      formattedDate = `${year}-${month}-${day}`;
    }
    
    // Update event details
    await event.update({
      name: name || event.name,
      date: formattedDate || event.date,
      status: status || event.status,
      description: description !== undefined ? description : event.description,
      // description: description || event.description,
      club_id,
    }, { transaction });
    
    // If categories are provided, update the expenses
    if (categories && Array.isArray(categories)) {
      // First, delete all existing expenses for this event
      await Expense.destroy({
        where: { eventId: id },
        transaction
      });
      
      // Then create new expenses for each category
      const expensePromises = categories.map(async ({ name: categoryName, amount }) => {
        // Find the category
        const category = await Category.findOne({
          where: {
            name: sequelize.where(
              sequelize.fn('LOWER', sequelize.col('name')), 
              sequelize.fn('LOWER', categoryName)
            )
          }
        });
        
        if (!category) {
          throw new Error(`Category not found: ${categoryName}`);
        }
        
        // Create the expense
        return Expense.create({
          amount,
          description: `${categoryName} expense for ${name || event.name}`,
          date: formattedDate || event.date,
          categoryId: category.id,
          eventId: id,
          club_id,

        }, { transaction });
      });
      
      await Promise.all(expensePromises);
    }
    
    // Commit the transaction
    await transaction.commit();
    
    // Get the updated event with all its relations
    const updatedEvent = await BTevent.findByPk(id, {
      include: [
        {
          model: Expense,
          as: 'expenses',
          include: [{ model: Category, as: 'category' }]
        }
      ]
    });
    
    // Format the response
    const rawEvent = updatedEvent.get({ plain: true });
    
    const totalExpense = rawEvent.expenses.reduce(
      (sum, expense) => sum + parseFloat(expense.amount), 0
    );
    
    // Group expenses by category
    const categoriesMap = {};
    rawEvent.expenses.forEach(expense => {
      const categoryName = expense.category.name.toLowerCase();
      if (!categoriesMap[categoryName]) {
        categoriesMap[categoryName] = 0;
      }
      categoriesMap[categoryName] += parseFloat(expense.amount);
    });
    
    const responseCategories = Object.entries(categoriesMap).map(([name, amount]) => ({
      name,
      amount
    }));
    
    const formattedEvent = {
      id: rawEvent.id,
      key: rawEvent.id.toString(),
      name: rawEvent.name,
      date: new Date(rawEvent.date).toLocaleDateString('en-GB'),
      status: rawEvent.status,
      expense: `AED ${totalExpense.toFixed(2)}`,
      description: rawEvent.description,
      categories: responseCategories,
      club_id: rawEvent.club_id,

    };
    
    return res.status(200).json(formattedEvent);
  } catch (error) {
    // Rollback the transaction on error
    await transaction.rollback();
    console.error('Error updating event:', error);
    return res.status(500).json({ message: 'Failed to update event', error: error.message });
  }
};

// Delete an event
const deleteEventBT = async (req, res) => {
  const transaction = await sequelize.transaction();
  
  try {
    const { id } = req.params;
    
    // Find the event
    const event = await BTevent.findByPk(id);
    
    if (!event) {
      await transaction.rollback();
      return res.status(404).json({ message: 'BTevent not found' });
    }
    
    // Delete all associated expenses first
    await Expense.destroy({
      where: { eventId: id },
      transaction
    });
    
    // Then delete the event
    await event.destroy({ transaction });
    
    // Commit the transaction
    await transaction.commit();
    
    return res.status(200).json({ message: 'BTevent deleted successfully' });
  } catch (error) {
    // Rollback the transaction on error
    await transaction.rollback();
    console.error('Error deleting event:', error);
    return res.status(500).json({ message: 'Failed to delete event', error: error.message });
  }
};

// Search events by name
// const searchEventsBT = async (req, res) => {
//   try {
//     const { query } = req.query;
    
//     if (!query) {
//       return res.status(400).json({ message: 'Search query is required' });
//     }
    
//     const events = await BTevent.findAll({
//       where: {
//         name: {
//           [Op.iLike]: `%${query}%`  // Case-insensitive search
//         }
//       },
//       include: [
//         {
//           model: Expense,
//           as: 'expenses',
//           include: [{ model: Category, as: 'category' }]
//         }
//       ],
//       order: [['date', 'DESC']]
//     });
    
//     // Format response similar to getAllEvents
//     const formattedEvents = events.map(event => {
//       const rawEvent = event.get({ plain: true });
      
//       const totalExpense = rawEvent.expenses.reduce(
//         (sum, expense) => sum + parseFloat(expense.amount), 0
//       );
      
//       const categoriesMap = {};
//       rawEvent.expenses.forEach(expense => {
//         const categoryName = expense.category.name.toLowerCase();
//         if (!categoriesMap[categoryName]) {
//           categoriesMap[categoryName] = 0;
//         }
//         categoriesMap[categoryName] += parseFloat(expense.amount);
//       });
      
//       const categories = Object.entries(categoriesMap).map(([name, amount]) => ({
//         name,
//         amount
//       }));
      
//       return {
//         id: rawEvent.id,
//         key: rawEvent.id.toString(),
//         name: rawEvent.name,
//         date: new Date(rawEvent.date).toLocaleDateString('en-GB'),
//         status: rawEvent.status,
//         expense: `AED ${totalExpense.toFixed(2)}`,
//         description: rawEvent.description,
//         categories,
//         club_id: rawEvent.club_id,

//       };
//     });
    
//     return res.status(200).json(formattedEvents);
//   } catch (error) {
//     console.error('Error searching events:', error);
//     return res.status(500).json({ message: 'Failed to search events', error: error.message });
//   }
// };

const searchEventsBT = async (req, res) => {
  try {
    const { query, club_id } = req.query;
    console.log('Search events - query:', query, 'club_id:', club_id);
    
    if (!query) {
      return res.status(400).json({ message: 'Search query is required' });
    }
    
    // Combine search query with club_id filter if provided
    const whereClause = {
      name: {
        [Op.iLike]: `%${query}%`  // Case-insensitive search
      },
      ...(club_id ? { club_id: parseInt(club_id) } : {})
    };
    
    const events = await BTevent.findAll({
      where: whereClause,
      include: [
        {
          model: Expense,
          as: 'expenses',
          include: [{ model: Category, as: 'category' }]
        }
      ],
      order: [['date', 'DESC']]
    });
    
    // Format response similar to getAllEvents
    const formattedEvents = events.map(event => {
      const rawEvent = event.get({ plain: true });
      
      const totalExpense = rawEvent.expenses.reduce(
        (sum, expense) => sum + parseFloat(expense.amount), 0
      );
      
      const categoriesMap = {};
      rawEvent.expenses.forEach(expense => {
        const categoryName = expense.category.name.toLowerCase();
        if (!categoriesMap[categoryName]) {
          categoriesMap[categoryName] = 0;
        }
        categoriesMap[categoryName] += parseFloat(expense.amount);
      });
      
      const categories = Object.entries(categoriesMap).map(([name, amount]) => ({
        name,
        amount
      }));
      
      return {
        id: rawEvent.id,
        key: rawEvent.id.toString(),
        name: rawEvent.name,
        date: new Date(rawEvent.date).toLocaleDateString('en-GB'),
        status: rawEvent.status,
        expense: `AED ${totalExpense.toFixed(2)}`,
        description: rawEvent.description,
        categories,
        club_id: rawEvent.club_id,
      };
    });
    
    console.log(`Found ${formattedEvents.length} events matching "${query}" for club_id: ${club_id || 'all'}`);
    return res.status(200).json(formattedEvents);
  } catch (error) {
    console.error('Error searching events:', error);
    return res.status(500).json({ message: 'Failed to search events', error: error.message });
  }
};


// Filter events by status
// const filterEventsByStatusBT = async (req, res) => {
//   try {
//     const { status } = req.params;
//     const { club_id } = req.query;

    
//     // Validate status
//     if (status !== 'ONGOING' && status !== 'COMPLETED' && status !== 'all') {
//       return res.status(400).json({ message: 'Invalid status. Use ONGOING, COMPLETED, or all' });
//     }
    
//     // Prepare where clause based on status
//     const whereClause = {
//       ...(status !== 'all' ? { status } : {}),
//       ...(club_id ? { club_id: parseInt(club_id) } : {})
//     };

//     const events = await BTevent.findAll({
//       where: whereClause,
//       include: [
//         {
//           model: Expense,
//           as: 'expenses',
//           include: [{ model: Category, as: 'category' }]
//         }
//       ],
//       order: [['date', 'DESC']]
//     });
    
//     // Format response similar to getAllEvents
//     const formattedEvents = events.map(event => {
//       const rawEvent = event.get({ plain: true });
      
//       const totalExpense = rawEvent.expenses.reduce(
//         (sum, expense) => sum + parseFloat(expense.amount), 0
//       );
      
//       const categoriesMap = {};
//       rawEvent.expenses.forEach(expense => {
//         const categoryName = expense.category.name.toLowerCase();
//         if (!categoriesMap[categoryName]) {
//           categoriesMap[categoryName] = 0;
//         }
//         categoriesMap[categoryName] += parseFloat(expense.amount);
//       });
      
//       const categories = Object.entries(categoriesMap).map(([name, amount]) => ({
//         name,
//         amount
//       }));
      
//       return {
//         id: rawEvent.id,
//         key: rawEvent.id.toString(),
//         name: rawEvent.name,
//         date: new Date(rawEvent.date).toLocaleDateString('en-GB'),
//         status: rawEvent.status,
//         expense: `AED ${totalExpense.toFixed(2)}`,
//         description: rawEvent.description,
//         categories,
//         club_id: rawEvent.club_id,

//       };
//     });
    
//     return res.status(200).json(formattedEvents);
//   } catch (error) {
//     console.error('Error filtering events by status:', error);
//     return res.status(500).json({ message: 'Failed to filter events', error: error.message });
//   }
// };

const filterEventsByStatusBT = async (req, res) => {
  try {
    const { status } = req.params;
    const { club_id } = req.query;
    console.log('Filter events - status:', status, 'club_id:', club_id);
    
    // Validate status
    if (status !== 'ONGOING' && status !== 'COMPLETED' && status !== 'all') {
      return res.status(400).json({ message: 'Invalid status. Use ONGOING, COMPLETED, or all' });
    }
    
    // Prepare where clause based on status and club_id
    const whereClause = {
      ...(status !== 'all' ? { status } : {}),
      ...(club_id ? { club_id: parseInt(club_id) } : {})
    };
    
    console.log('Filter where clause:', whereClause);

    const events = await BTevent.findAll({
      where: whereClause,
      include: [
        {
          model: Expense,
          as: 'expenses',
          include: [{ model: Category, as: 'category' }]
        }
      ],
      order: [['date', 'DESC']]
    });
    
    // Format response similar to getAllEvents
    const formattedEvents = events.map(event => {
      const rawEvent = event.get({ plain: true });
      
      const totalExpense = rawEvent.expenses.reduce(
        (sum, expense) => sum + parseFloat(expense.amount), 0
      );
      
      const categoriesMap = {};
      rawEvent.expenses.forEach(expense => {
        const categoryName = expense.category.name.toLowerCase();
        if (!categoriesMap[categoryName]) {
          categoriesMap[categoryName] = 0;
        }
        categoriesMap[categoryName] += parseFloat(expense.amount);
      });
      
      const categories = Object.entries(categoriesMap).map(([name, amount]) => ({
        name,
        amount
      }));
      
      return {
        id: rawEvent.id,
        key: rawEvent.id.toString(),
        name: rawEvent.name,
        date: new Date(rawEvent.date).toLocaleDateString('en-GB'),
        status: rawEvent.status,
        expense: `AED ${totalExpense.toFixed(2)}`,
        description: rawEvent.description,
        categories,
        club_id: rawEvent.club_id,
      };
    });
    
    console.log(`Found ${formattedEvents.length} events with status "${status}" for club_id: ${club_id || 'all'}`);
    return res.status(200).json(formattedEvents);
  } catch (error) {
    console.error('Error filtering events by status:', error);
    return res.status(500).json({ message: 'Failed to filter events', error: error.message });
  }
};

module.exports = {
  getAllEventsBT,
  getBTeventById,
  createEventBT,
  updateEventBT,
  deleteEventBT,
  searchEventsBT,
  filterEventsByStatusBT
};