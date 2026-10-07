const express = require('express');
const router = express.Router();
const { supabase } = require('../util/supabase');

router.get('/health/supabase', async (req, res) => {
  const { data, error } = await supabase.auth.getSession();
  if (error) return res.status(500).json({ ok: false, error: error.message });
  res.json({ ok: true });
});

module.exports = router;