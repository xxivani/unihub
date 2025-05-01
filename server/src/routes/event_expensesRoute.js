const express = require ('express');
const router = express.Router();
const {
    getAllEventsBT,
    getBTeventById,
    createEventBT,
    updateEventBT,
    deleteEventBT,
    searchEventsBT,
    filterEventsByStatusBT,
    getLatestEventsByClub
} = require('../controllers/budget-tracker/event_expensesController');

/**
 * @swagger
 * /events:
 *   get:
 *     summary: Get all events with their expenses
 *     tags: [Events]
 *     responses:
 *       200:
 *         description: All events retrieved successfully.
 *       500:
 *         description: Server error.
 */
router.get('/', getAllEventsBT);

/**
 * @swagger
 * /events/search:
 *   get:
 *     summary: Search events by name
 *     tags: [Events]
 *     parameters:
 *       - in: query
 *         name: query
 *         schema:
 *           type: string
 *         required: true
 *         description: Search string to match event names
 *     responses:
 *       200:
 *         description: Events found successfully.
 *       400:
 *         description: Search query is required.
 *       500:
 *         description: Server error.
 */
router.get('/search', searchEventsBT);

/**
 * @swagger
 * /events/filter/{status}:
 *   get:
 *     summary: Filter events by status
 *     tags: [Events]
 *     parameters:
 *       - in: path
 *         name: status
 *         schema:
 *           type: string
 *           enum: [ONGOING, COMPLETED, all]
 *         required: true
 *         description: Status to filter by (ONGOING, COMPLETED, or all)
 *     responses:
 *       200:
 *         description: Filtered events retrieved successfully.
 *       400:
 *         description: Invalid status provided.
 *       500:
 *         description: Server error.
 */
router.get('/filter/:status', filterEventsByStatusBT);

/**
 * @swagger
 * /events/{id}:
 *   get:
 *     summary: Get event by ID
 *     tags: [Events]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: integer
 *         required: true
 *         description: Event ID
 *     responses:
 *       200:
 *         description: Event retrieved successfully.
 *       404:
 *         description: Event not found.
 *       500:
 *         description: Server error.
 */
router.get('/:id', getBTeventById);

/**
 * @swagger
 * /events:
 *   post:
 *     summary: Create a new event with expenses
 *     tags: [Events]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *               - date
 *               - status
 *               - categories
 *             properties:
 *               name:
 *                 type: string
 *               date:
 *                 type: string
 *                 format: date
 *               status:
 *                 type: string
 *                 enum: [ONGOING, COMPLETED]
 *               description:
 *                 type: string
 *               categories:
 *                 type: array
 *                 items:
 *                   type: object
 *                   properties:
 *                     name:
 *                       type: string
 *                     amount:
 *                       type: number
 *     responses:
 *       201:
 *         description: Event created successfully.
 *       400:
 *         description: Invalid input data.
 *       500:
 *         description: Server error.
 */
router.post('/', createEventBT);

/**
 * @swagger
 * /events/{id}:
 *   put:
 *     summary: Update an existing event
 *     tags: [Events]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: integer
 *         required: true
 *         description: Event ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *               date:
 *                 type: string
 *                 format: date
 *               status:
 *                 type: string
 *                 enum: [ONGOING, COMPLETED]
 *               description:
 *                 type: string
 *               categories:
 *                 type: array
 *                 items:
 *                   type: object
 *                   properties:
 *                     name:
 *                       type: string
 *                     amount:
 *                       type: number
 *     responses:
 *       200:
 *         description: Event updated successfully.
 *       404:
 *         description: Event not found.
 *       500:
 *         description: Server error.
 */
router.put('/:id', updateEventBT);

/**
 * @swagger
 * /events/{id}:
 *   delete:
 *     summary: Delete an event
 *     tags: [Events]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: integer
 *         required: true
 *         description: Event ID
 *     responses:
 *       200:
 *         description: Event deleted successfully.
 *       404:
 *         description: Event not found.
 *       500:
 *         description: Server error.
 */
router.delete('/:id', deleteEventBT);

/**
 * @swagger
 * /bt_eventRoute/latest:
 *   get:
 *     summary: Get latest events for a specific club
 *     tags: [Events]
 *     parameters:
 *       - in: query
 *         name: club_id
 *         schema:
 *           type: integer
 *         required: true
 *         description: Club ID
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *         default: 3
 *         description: Number of events to return
 *     responses:
 *       200:
 *         description: Latest events retrieved successfully.
 *       400:
 *         description: Club ID is required.
 *       500:
 *         description: Server error.
 */
router.get('/latest', getLatestEventsByClub);

module.exports = router;