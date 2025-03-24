const express = require('express');
const router = express.Router();
const {
  createExternalEvent,
  getAllExternalEvents,
  getExternalEventById,
  updateExternalEvent,
  deleteExternalEvent
} = require('../controllers/externalEventsController'); // Import controllers

/**
 * @swagger
 * /external-events:
 *   post:
 *     summary: Create a new external event
 *     tags: [ExternalEvents]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - external_event_name
 *               - external_event_date
 *             properties:
 *               external_event_name:
 *                 type: string
 *                 example: "Tech Expo 2025"
 *               external_event_date:
 *                 type: string
 *                 format: date
 *                 example: "2025-07-15"
 *     responses:
 *       201:
 *         description: Event created successfully
 */
router.post('/', createExternalEvent);

/**
 * @swagger
 * /external-events:
 *   get:
 *     summary: Get all external events
 *     tags: [ExternalEvents]
 *     responses:
 *       200:
 *         description: List of all events
 */
router.get('/', getAllExternalEvents);

/**
 * @swagger
 * /external-events/{id}:
 *   get:
 *     summary: Get a single external event by ID
 *     tags: [ExternalEvents]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: The requested event
 */
router.get('/:id', getExternalEventById);

/**
  * @swagger
 * /external-events/{id}:
 *   put:
 *     summary: Update an external event
 *     tags: [ExternalEvents]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               external_event_name:
 *                 type: string
 *                 description: Name of the event
 *               external_event_date:
 *                 type: string
 *                 format: date-time
 *                 description: Date of the event (ISO 8601 format)
 *               external_event_location:
 *                 type: string
 *                 description: Location of the event
 *               external_event_description:
 *                 type: string
 *                 description: Description of the event
 *               external_event_ticket_amount:
 *                 type: integer
 *                 description: Ticket price or amount
 *               external_event_max_number_of_attendees:
 *                 type: integer
 *                 description: Maximum number of attendees
 *               external_event_organizer:
 *                 type: string
 *                 description: Organizer of the event
 *               external_event_corganizer:
 *                 type: string
 *                 description: Co-organizer of the event
 *               external_event_manager:
 *                 type: string
 *                 description: Event manager
 *               external_event_speaker:
 *                 type: string
 *                 description: Speaker at the event
 *     responses:
 *       200:
 *         description: Event updated successfully
 *       400:
 *         description: Bad request (invalid input)
 *       404:
 *         description: Event not found
 *       500:
 *         description: Internal Server Error
 */
router.put('/:id', updateExternalEvent);

/**
 * @swagger
 * /external-events/{id}:
 *   delete:
 *     summary: Delete an external event
 *     tags: [ExternalEvents]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Event deleted successfully
 */
router.delete('/:id', deleteExternalEvent);

module.exports = router;
