import express from "express";
import libraryController from "../controllers/Library.Controller.js";
const router = express.Router();

/**
 * @swagger
 * /library/hours:
 *   get:
 *     summary: Get operating hours
 *     description: Fetches the operating hours for specified dates. If no dates are provided, it defaults to the current date and a week from now.
 *     parameters:
 *       - name: start
 *         in: query
 *         required: false
 *         description: Start date in yyyy-mm-dd format. Defaults to the current date if not provided.
 *         schema:
 *           type: string
 *           format: date
 *       - name: end
 *         in: query
 *         required: false
 *         description: End date in yyyy-mm-dd format. Defaults to one week from the start date if not provided.
 *         schema:
 *           type: string
 *           format: date
 *     responses:
 *       '200':
 *         description: Successfully retrieved operating hours
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               additionalProperties:
 *                 type: object
 *                 properties:
 *                   lc:
 *                     type: object
 *                     description: Timings for Learning Commons
 *                   library:
 *                     type: object
 *                     description: Timings for G/F Entrance
 *                   lg5:
 *                     type: object
 *                     description: Timings for LG5 Entrance
 *       '500':
 *         description: An error occurred
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: An error occurred.
 */
router.get("/hours", libraryController.hours);

export default router;
