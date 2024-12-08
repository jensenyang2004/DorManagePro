const express = require('express');
const router = express.Router();
const { eq, and } = require('drizzle-orm')
const { getDb, db } = require('../models/index')
const { user,  bed, snackOption, maintenanceRecord, bookRecord, moveRecord, moveApplication } = require('../models/schema'); // Schema

router.post('/maintenance', async (req, res) => {
  const { ssn, description } = req.body;
  const db = getDb();
  // Input validation
  if (!ssn || !description) {
    return res.status(400).json({ message: 'SSN and description are required' });
  }

  try {
    // Insert the maintenance request into the database
    const result =  await db.insert(maintenanceRecord).values({
      ssn: ssn,
      description: description,
      fixedDate: null, // set fixedDate to null
      isFinished: false, // default value
    });

    // Respond with success
    res.status(201).json({
      message: 'Maintenance request submitted successfully',
      data: result,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Failed to submit maintenance request', error: error.message });
  }
});


router.post('/book', async (req, res) => {
  const { ssn, fId, isCancelled, bookTime } = req.body;
  const db = getDb();
  // console.log('Received bookTime:', bookTime);
  try {
    // Validate the input
    if (!ssn || !fId || !bookTime) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    // Insert the booking into the database
    await db.insert(bookRecord).values({
      ssn,
      fId,
      isCancelled,
      bookTime: new Date(bookTime), // Convert to a Date object
    });

    res.status(201).json({ message: 'Booking successful' });
  } catch (error) {
    console.error('Error inserting booking:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

router.get('/transfer_application', async (req, res) => {
  try {
    const db = getDb();
    const { student_ssn } = req.query
    if(!student_ssn){
      return res.status(400).json({ error: 'Missing required fields' });
    }
    const result = await db
      .select()
      .from(moveApplication)
      .where(eq(moveApplication.ssn, student_ssn))
    if (result.length === 0) {
      return res.status(404).json({ error: 'Student not found' });
    }
    res.json(result);
  } catch(err) {
    res.status(500).json({ error: err.message });
    console.log(err.message);
  } 
});


router.get('/snack_options', async (req, res) => {
  try {
    const db = getDb();
    const { dormId, semester } = req.query;
    const result = await db
    .select()
    .from(snackOption)
    .where(and(eq(snackOption.dormId, dormId), eq(snackOption.semester, semester)));
    if (result.length === 0) {
      return res.status(404).json({ error: 'Dorm change request not found' });
    }
    res.status(200).json(result);
  } catch (err) {
    console.log(err.message)
    res.status(500).json({ error: err.message });
  }
});
// Dorm Change Request - 宿舍變更請求
router.get('/dorm_change_request', async (req, res) => {
  try {
    const db = getDb();
    const { username, student_id } = req.query;
    const result = await db
      .select({
        username: user.username,
        student_id: user.studentId,
        original_dorm: user.dormId,
        b_id: user.bId,
      })
      .from(user)
      .where(user.username.eq(username).and(users.studentId.eq(student_id)))
      .limit(1);

    if (result.length === 0) {
      return res.status(404).json({ error: 'Dorm change request not found' });
    }

    res.json(result[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.get('/facilities_reservations', async (req, res) => {
  try {
    const db = getDb();
    const { ssn } = req.query;
    const result = await db
    .select()
    .from(bookRecord)
    .where(eq(bookRecord.ssn, ssn));

    if (result.length === 0) {
      return res.status(404).json({ error: 'Reservation not found' });
    }
    res.json(result);
    console.log(result)
  } catch (err) {
    console.log(err.message)
    res.status(500).json({ error: err.message });
  }
});

router.put('/cancel_facilities_reservations', async (req, res) => {
  const { ssn, fId, bookTime } = req.body;
  const correctBooktime = new Date(bookTime)
  try {
    const db = getDb();
    // Validate the input
    if (!ssn || !fId || !bookTime) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    const updateResult = await db
    .update(bookRecord)
    .set({ isCancelled: true })
    .where(and(eq(bookRecord.ssn, ssn), eq(bookRecord.fId, fId), eq(bookRecord.bookTime, correctBooktime)));

    if (!updateResult) {
      return res.status(500).json({ error: 'Database did not return expected results' });
    }

    res.status(200).json({ message: 'Reservation cancelled successfully' });
  } catch (error) {
    console.error('Error cancelling reservation:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Bed Transfer Request - 宿舍內轉請求
router.post('/bed_transfer_request', async (req, res) => {
  try {
    const db = getDb();
    const { ssn, semester, move_in_bed, original_bed, dorm_id} = req.body;
    console.log('data', ssn, semester, move_in_bed, original_bed, dorm_id)
    const result = await db
      .insert(moveRecord)
      .values({
        ssn: ssn,
        semester: semester,
        moveInBed: move_in_bed,
        originalBed: original_bed,
        dormId: dorm_id,
      })
    console.log(result)
    // Respond with success
    res.status(201).json({
      message: 'Dorm change request submitted successfully',
      data: result,
    });
  } catch (err) {
    console.log(err.message)
    res.status(500).json({ error: err.message });
  }
});
// Bed Transfer Request - 宿舍內轉更新
router.put('/bed_transfer_update', async (req, res) => {
  const { ssn, move_in_bed} = req.body;
  try {
    const db = getDb();
    // Validate the input
    if (!ssn || !move_in_bed) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    const updateResult = await db
    .update(user)
    .set({ bId: move_in_bed })
    .where(eq(user.ssn, ssn));

    if (!updateResult) {
      return res.status(500).json({ error: 'Database did not return expected results' });
    }

    res.status(200).json({ message: 'Reservation cancelled successfully' });
  } catch (error) {
    console.error('Error cancelling reservation:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});


module.exports = router;

