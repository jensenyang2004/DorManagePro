const express = require('express');
const router = express.Router();

// Database models/schema
const { getDb } = require('../models/index'); // 正確導入 getDb 函數
const { facility, bookRecord, snackRecord, snackOption } = require('../models/schema'); // Schema


// Dorm Facility - 獲取所有宿舍設施

router.get('/dorm_facility', async (req, res) => {
  try {
    const db = getDb();
    const facilities = await db.select().from(facility);
    res.json(facilities);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.get('/dorm_facility/:dorm_id', async (req, res) => {
  const { dorm_id } = req.params;
  const db = getDb();
  const facilities = await db.select().from(facility).where(facility.dormId.eq(dorm_id));
  res.json(facilities);
});


// Facility Schedule - 獲取設施預約情況
router.get('/facility_schedule', async (req, res) => {
  try {
    const db = getDb();
    const { facility_id } = req.query;
    const reservations = await db
      .select()
      .from(bookRecord)
      .where(bookRecord.fId.eq(facility_id));

    res.json(reservations);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});


//Snack Announcement - 發佈零食公告
router.post('/snack_announcement', async (req, res) => {
  const { semester, dorm_id, snack_name } = req.body;

  try {
    const db = getDb();
    // 新增零食選項
    await db.insert(snackOption).values({
      semester,
      dormId: dorm_id,
      sName: snack_name,
    });

    res.status(201).json({ message: 'Snack announcement created successfully' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

//Snack Reservation Status - 獲取零食預約情況
router.get('/snack_reservation_status', async (req, res) => {
  try {
    const { semester, dorm_id, snack_name } = req.query;
    const db = getDb();
    const result = await db
      .select({
        snack_name: snackOption.sName,
        reservation_amount: snackRecord.ssn.count(),
      })
      .from(snackOption)
      .innerJoin(snackRecord, snackOption.sName.eq(snackRecord.ssn))
      .where(
        snackOption.semester
          .eq(semester)
          .and(snackOption.dormId.eq(dorm_id))
          .and(snackOption.sName.eq(snack_name))
      )
      .groupBy(snackOption.sName);

    res.json(result);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;

