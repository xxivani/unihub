const express = require('express');
const router = express.Router();
const {
  createExternalEvent,
  getAllExternalEvents,
  getExternalEventById,
  updateExternalEvent,
  deleteExternalEvent,
  signupForExternalEvent,
  unfollowExternalEvent,
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

/**
 * @swagger
 * /external-events/{id}/signup:
 *   post:
 *     summary: Sign up for an external event
 *     tags: [ExternalEvents]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: The ID of the event to sign up for
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *               - studentId
 *               - year
 *               - email
 *               - userId
 *             properties:
 *               name:
 *                 type: string
 *                 example: "John Doe"
 *                 description: The name of the student signing up
 *               studentId:
 *                 type: string
 *                 example: "12345"
 *                 description: The student’s ID
 *               year:
 *                 type: string
 *                 example: "2"
 *                 description: The student’s year of study
 *               email:
 *                 type: string
 *                 format: email
 *                 example: "john.doe@example.com"
 *                 description: The student’s email address
 *               userId:
 *                 type: integer
 *                 example: 1
 *                 description: The ID of the user signing up
 *     responses:
 *       200:
 *         description: Successfully signed up for the event
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 external_event_id:
 *                   type: integer
 *                 external_event_name:
 *                   type: string
 *                 external_event_number_of_attendees:
 *                   type: integer
 *       400:
 *         description: Event is full or invalid request
 *       404:
 *         description: Event not found
 *       500:
 *         description: Internal Server Error
 */
router.post('/:id/signup', signupForExternalEvent);

/**
 * @swagger
 * /external-events/{id}/unfollow:
 *   post:
 *     summary: Unfollow an external event
 *     tags: [ExternalEvents]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: The ID of the event to unfollow
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - eventId
 *               - userId
 *             properties:
 *               eventId:
 *                 type: integer
 *                 example: 1
 *                 description: The ID of the event
 *               userId:
 *                 type: integer
 *                 example: 1
 *                 description: The ID of the user unfollowing
 *     responses:
 *       200:
 *         description: Successfully unfollowed the event
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 external_event_id:
 *                   type: integer
 *                 external_event_name:
 *                   type: string
 *                 external_event_number_of_attendees:
 *                   type: integer
 *       400:
 *         description: No attendees to remove or invalid request
 *       404:
 *         description: Event not found
 *       500:
 *         description: Internal Server Error
 */
router.post('/:id/unfollow', unfollowExternalEvent);


module.exports = router;
