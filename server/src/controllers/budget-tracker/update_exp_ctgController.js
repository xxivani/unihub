const { Expense, Category, Budget, sequelize } = require('../../models');
const { Op } = require('sequelize');

const updateCategoryExpenses = async (req, res) => {
  try {
    const { categories } = req.body;

    if (!categories || Object.keys(categories).length === 0) {
      return res.status(400).json({ message: 'No category data provided' });
    }

    // Begin a transaction
    const transaction = await sequelize.transaction();

    try {
      // Process each category update
      for (const [categoryName, amount] of Object.entries(categories)) {
        // Find the category by name
        const category = await Category.findOne({
          where: {
            name: sequelize.where(
              sequelize.fn('LOWER', sequelize.col('name')),
              sequelize.fn('LOWER', categoryName)
            )
          }
        });

        if (!category) {
          continue;
        }

        // Get existing expenses for this category
        const existingExpenses = await Expense.findAll({
          where: { categoryId: category.id },
          order: [['date', 'DESC']]
        });

        const newAmount = parseFloat(amount);

        // Add validation for minimum amount
        if (newAmount < 0) {
          continue;
        }

        // If no expenses exist for this category, create a new one
        if (existingExpenses.length === 0) {
          await Expense.create({
            amount: newAmount,
            description: `Updated expense for ${categoryName}`,
            date: new Date(),
            categoryId: category.id,
            eventId: null
          }, { transaction });
          continue;
        }

        // Calculate current total
        const currentTotal = existingExpenses.reduce(
          (sum, expense) => sum + parseFloat(expense.amount),
          0
        );

        // If new amount is less than current total, adjust the most recent expense
        if (newAmount < currentTotal) {
          let remainingTotal = currentTotal;
          let i = 0;

          while (i < existingExpenses.length && remainingTotal > newAmount) {
            if (i === existingExpenses.length - 1) {
              // Last expense - adjust it to make the total match
              const newExpenseAmount = newAmount - (remainingTotal - parseFloat(existingExpenses[i].amount));

              if (newExpenseAmount <= 0) {
                // If the new amount would be zero or negative, delete the expense
                await existingExpenses[i].destroy({ transaction });
              } else {
                // Otherwise adjust it
                await existingExpenses[i].update({ amount: newExpenseAmount }, { transaction });
              }
              break;
            } else {
              // Not the last expense - delete it
              remainingTotal -= parseFloat(existingExpenses[i].amount);
              await existingExpenses[i].destroy({ transaction });
              i++;
            }
          }
        }
        // If new amount is greater, add a new expense for the difference
        else if (newAmount > currentTotal) {
          const difference = newAmount - currentTotal;

          await Expense.create({
            amount: difference,
            description: `Additional expense for ${categoryName}`,
            date: new Date(),
            categoryId: category.id,
            eventId: null
          }, { transaction });
        }
      }

      // Commit the transaction
      await transaction.commit();

      return res.status(200).json({ message: 'Category expenses updated successfully' });
    } catch (error) {
      // Rollback the transaction on error
      await transaction.rollback();
      throw error;
    }
  } catch (error) {
    console.error('Error updating category expenses:', error);
    return res.status(500).json({ message: 'Failed to update category expenses', error: error.message });
  }
};

const updateMonthlyExpenses = async (req, res) => {
  try {
    const { month, amount, semester } = req.body;

    if (!month || amount === undefined) {
      return res.status(400).json({ message: 'Month and amount are required' });
    }

    // Map month name to month number
    const monthMap = {
      'Jan': 1, 'Feb': 2, 'Mar': 3, 'Apr': 4,
      'May': 5, 'Jun': 6, 'Jul': 7, 'Aug': 8,
      'Sep': 9, 'Oct': 10, 'Nov': 11, 'Dec': 12
    };

    const monthNumber = monthMap[month];
    if (!monthNumber) {
      return res.status(400).json({ message: 'Invalid month name' });
    }

    // Get current year
    const currentYear = new Date().getFullYear();

    // Determine the year based on semester and month
    const year = (semester === 1 && monthNumber >= 9) ? currentYear :
      (semester === 2 && monthNumber <= 4) ? currentYear + 1 :
        currentYear;

    // Create date for the first day of the month
    const date = new Date(year, monthNumber - 1, 1);

    // Get all expenses for this month
    const existingExpenses = await Expense.findAll({
      where: sequelize.where(
        sequelize.fn('date_part', 'month', sequelize.col('date')),
        monthNumber
      ),
      order: [['date', 'DESC']]
    });

    // Calculate current total for this month
    const currentTotal = existingExpenses.reduce(
      (sum, expense) => sum + parseFloat(expense.amount),
      0
    );

    const newAmount = parseFloat(amount);

    // Validate minimum amount
    if (newAmount < 0 && newAmount !== 0) {
      return res.status(400).json({ message: 'Amount must be at least 0 or exactly 0' });
    }

    // Begin a transaction
    const transaction = await sequelize.transaction();

    try {
      // If new amount is less than current total, adjust expenses
      if (newAmount < currentTotal) {
        let remainingTotal = currentTotal;
        let i = 0;

        while (i < existingExpenses.length && remainingTotal > newAmount) {
          if (i === existingExpenses.length - 1) {
            // Last expense - adjust it to match the total
            const newExpenseAmount = newAmount - (remainingTotal - parseFloat(existingExpenses[i].amount));

            if (newExpenseAmount <= 0) {
              // If new amount would be zero or negative, delete the expense
              await existingExpenses[i].destroy({ transaction });
            } else {
              // Otherwise adjust it
              await existingExpenses[i].update({ amount: newExpenseAmount }, { transaction });
            }
            break;
          } else {
            // Not the last expense - delete it
            remainingTotal -= parseFloat(existingExpenses[i].amount);
            await existingExpenses[i].destroy({ transaction });
            i++;
          }
        }
      }
      // If new amount is greater, add a new expense for the difference
      else if (newAmount > currentTotal) {
        const difference = newAmount - currentTotal;

        // Create a generic expense for the difference
        await Expense.create({
          amount: difference,
          description: `Expense for ${month} ${year}`,
          date,
          // Use a default category (first one)
          categoryId: (await Category.findOne()).id,
          eventId: null
        }, { transaction });
      }

      // Commit the transaction
      await transaction.commit();

      return res.status(200).json({ message: 'Monthly expenses updated successfully' });
    } catch (error) {
      // Rollback the transaction on error
      await transaction.rollback();
      throw error;
    }
  } catch (error) {
    console.error('Error updating monthly expenses:', error);
    return res.status(500).json({ message: 'Failed to update monthly expenses', error: error.message });
  }
};

const updateTotalBudget = async (req, res) => {
  try {
    const { totalAmount } = req.body;

    if (!totalAmount) {
      return res.status(400).json({ message: 'Total budget amount is required' });
    }

    // Find the most recent budget
    const budget = await Budget.findOne({
      order: [['createdAt', 'DESC']]
    });

    if (!budget) {
      return res.status(404).json({ message: 'No budget found' });
    }
    // Update the budget
    await budget.update({ totalAmount });

    return res.status(200).json({ message: 'Budget updated successfully', budget });
  } catch (error) {
    console.error('Error updating budget:', error);
    return res.status(500).json({ message: 'Failed to update budget', error: error.message });
  }
};

const updateTotalSpent = async (req, res) => {
  try {
    const { totalSpent } = req.body;

    if (totalSpent === undefined) {
      return res.status(400).json({ message: 'Total spent amount is required' });
    }

    // Calculate current total expenses
    const totalExpensesResult = await Expense.findOne({
      attributes: [
        [sequelize.fn('SUM', sequelize.col('amount')), 'totalSpent']
      ],
      raw: true
    });

    const currentTotal = parseFloat(totalExpensesResult.totalSpent) || 0;
    const newTotal = parseFloat(totalSpent);

    // Validate minimum amount
    if (newTotal < 0) {
      return res.status(400).json({ message: 'Total spent amount cannot be negative' });
    }

    // Begin a transaction
    const transaction = await sequelize.transaction();

    try {
      // If we need to increase the total, add an expense
      if (newTotal > currentTotal) {
        // Get the first category (or you could let the user choose)
        const category = await Category.findOne();

        if (!category) {
          await transaction.rollback();
          return res.status(404).json({ message: 'No categories found to allocate expense' });
        }

        await Expense.create({
          amount: newTotal - currentTotal,
          description: 'Manual adjustment',
          date: new Date(),
          categoryId: category.id,
          eventId: null
        }, { transaction });
      }
      // If we need to decrease the total
      else if (newTotal < currentTotal) {
        const difference = currentTotal - newTotal;
        let remainingToRemove = difference;

        // Get all expenses ordered by date (newest first) 
        // and preferably those not associated with events
        const expenses = await Expense.findAll({
          where: {
            eventId: null // Only adjust expenses not tied to events
          },
          order: [['date', 'DESC']],
          transaction
        });

        if (expenses.length === 0) {
          await transaction.rollback();
          return res.status(400).json({
            message: 'Cannot decrease total - no unallocated expenses to adjust'
          });
        }

        // Remove or adjust expenses until we've accounted for the difference
        for (const expense of expenses) {
          const expenseAmount = parseFloat(expense.amount);

          if (expenseAmount <= remainingToRemove) {
            // This expense can be completely removed
            await expense.destroy({ transaction });
            remainingToRemove -= expenseAmount;
          } else {
            // Just reduce this expense
            await expense.update({
              amount: expenseAmount - remainingToRemove
            }, { transaction });
            remainingToRemove = 0;
          }

          if (remainingToRemove <= 0) break;
        }

        if (remainingToRemove > 0) {
          await transaction.rollback();
          return res.status(400).json({
            message: 'Cannot decrease total by requested amount - not enough unallocated expenses'
          });
        }
      }

      // Commit the transaction
      await transaction.commit();

      return res.status(200).json({ message: 'Total spent updated successfully' });
    } catch (error) {
      // Rollback the transaction on error
      await transaction.rollback();
      throw error;
    }
  } catch (error) {
    console.error('Error updating total spent:', error);
    return res.status(500).json({ message: 'Failed to update total spent', error: error.message });
  }
};

module.exports = {
  updateCategoryExpenses,
  updateMonthlyExpenses,
  updateTotalBudget,
  updateTotalSpent
};