// // backend_new/src/routes/successRoutes.js
// import express from 'express';
// import { createSuccess } from '../controllers/successController.js';

// const router = express.Router();

// router.post('/', createSuccess);

// export default router;

import express from 'express';
const router = express.Router();
// Dummy payment endpoint
router.post('/', (req, res) => {
    res.send('Dummy payment endpoint');
});
export default router;