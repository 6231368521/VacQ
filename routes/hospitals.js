const express = require('express');
const router = express.Router();
const {createHospital,deleteHospital,getHospital,getHospitals,updateHospital, getVacCenters} = require('../controllers/hospitals');
const {protect, authorize} = require('../middleware/auth');

//Include other resource routers
const appointmentRouter = require('./appointments');

//Re-route into other resource routers
router.use('/:hospitalId/appointments', appointmentRouter);
router.route('/vacCenters').get(getVacCenters);


router.route('/').get(getHospitals).post(protect, authorize('admin'), createHospital);
router.route('/:id').get(getHospital).put(protect, authorize('admin'), updateHospital).delete(protect, authorize('admin'), deleteHospital);

module.exports = router;

/** 
 * @swagger
 * tags:
 *  name: Hospitals
 *  description: The hospitals managing API
 * components:
 *  schemas:
 *      Hospital:
 *          type: object
 *          required:
 *          - name
 *          - address
 *          properties:
 *              id:
 *                  type: string
 *                  format: uuid
 *                  description: The auto-generated id of the hospital
 *                  example: d290f1ee-6c54-4b01-90e6-d701748f0851
 *              ลำดับ:
 *                  type: string
 *                  description: Ordinal number
 *              name:
 *                  type: string
 *                  description: Hospital name
 *              address:
 *                  type: string
 *                  description: House No., Street, Road
 *              district:
 *                  type: string
 *                  description: District
 *              province:
 *                  type: string
 *                  description: province
 *              postalcode:
 *                  type: string
 *                  description: 5-digit postal code
 *              tel:
 *                  type: string
 *                  description: telephone number
 *              region:
 *                  type: string
 *                  description: region
 *          example:
 *              id: 63c8f91adfb168654ff0e175
 *              ลำดับ: 20
 *              name: เกษมราษฎร์ ประชาชื่น
 *              address: 950 ถ.ประชาชื่น แขวงวงศ์สว่าง
 *              district: บางซื่อ
 *              province: กรุงเทพมหานคร
 *              postalcode: 10800
 *              tel: 02-9101600
 *              region: กรุงเทพมหานคร (Bangkok)
 * /hospitals:
 *  get:
 *      summary: Returns the list of all the hospitals
 *      tags: [Hospitals]
 *      responses:
 *          200:
 *              description: The list of the hospitals
 *              content:
 *                  application/json:
 *                      schema:
 *                          type: array
 *                          items:
 *                              $ref: '#/components/schemas/Hospital'
 *  post:
 *      summary: Create a new hospital
 *      tags: [Hospitals]
 *      requestBody:
 *          required: true
 *          content:
 *              application/json:
 *                  schema:
 *                      $ref: '#/components/schemas/Hospital'
 *      responses:
 *          201:
 *              description: The hospital was successfully created
 *              content:
 *                  application/json:
 *                      schema:
 *                          $ref: '#/components/schemas/Hospital'
 *          500:
 *              description: Some server error
 * /hospitals/{id}:
 *  get:
 *      summary: Get the hospital by id
 *      tags: [Hospitals]
 *      parameters:
 *          - in: path
 *            name: id
 *            schema:
 *              type: string
 *            required: true
 *            description: The hospital id
 *      responses:
 *          200:
 *              description: The hospital description by id
 *              contents:
 *                  application/json:
 *                      schema:
 *                          $ref: '#/components/schemas/Hospital'
 *          404:
 *              description: The hospital was not found
 *  put:
 *      summary: Update the hospital by the id
 *      tags: [Hospitals]
 *      parameters:
 *          - in: path
 *            name: id
 *            schema:
 *              type: string
 *            required: true
 *            description: The hospital id
 *      requestBody:
 *          required: true
 *          content:
 *              application/json:
 *                  schema:
 *                      $ref: '#/components/schemas/Hospital'
 *      responses:
 *          200:
 *              description: The hospital was updated
 *              content:
 *                  application/json:
 *                      schema:
 *                          $ref: '#/components/schemas/Hospital'
 *          404:
 *              description: The hospital was not found
 *          500:
 *              description: Some error happened
 *  delete:
 *      summary: Remove the hospital by id
 *      tags: [Hospitals]
 *      parameters:
 *          - in: path
 *            name: id
 *            schema:
 *              type: string
 *            required: true
 *            description: The hospital id
 *      responses:
 *          200:
 *              description: The hospital was deleted
 *          404:
 *              description: The hospital was not found
 * 
*/