const express = require('express');
const router = express.Router();
const {createHospital,deleteHospital,getHospital,getHospitals,updateHospital} = require('../controllers/hospitals');

router.route('/').get(getHospitals).post(createHospital);
router.route('/:id').get(getHospital).put(updateHospital).delete(deleteHospital);

module.exports = router;
