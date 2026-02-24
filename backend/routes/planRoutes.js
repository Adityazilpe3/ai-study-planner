const express = require('express');
const router = express.Router();
const axios = require('axios');
const Plan = require('../models/Plan');
const protect = require('../middleware/authMiddleware');

// POST /api/plans/generate-plan
router.post('/generate-plan', protect, async (req, res) => {
  const { subjects, examDate, hoursPerDay } = req.body;

  if (!subjects || !examDate || !hoursPerDay)
    return res.status(400).json({ message: 'All fields are required' });

  const prompt = `Create a detailed, structured study plan with the following details:
- Subjects: ${subjects}
- Exam Date: ${examDate}
- Daily Study Hours: ${hoursPerDay} hours

Please provide:
1. A week-by-week breakdown of topics to cover
2. Daily time allocation for each subject
3. Revision strategy for the last week before exam
4. Tips for effective studying

Format it clearly with sections and bullet points. Be practical and specific.`;

  try {
    const groqResponse = await axios.post(
  'https://api.groq.com/openai/v1/chat/completions',
  {
    model: 'llama-3.3-70b-versatile',
    messages: [{ role: 'user', content: prompt }],
    max_tokens: 1500,
  },
  {
    headers: {
      'Authorization': `Bearer ${process.env.GROQ_API_KEY}`,
      'Content-Type': 'application/json',
    },
  }
);

const generatedPlan = groqResponse.data.choices[0].message.content;

    const plan = await Plan.create({
      userId: req.user._id,
      subjects,
      examDate,
      hoursPerDay,
      generatedPlan,
    });

    res.status(201).json(plan);
  } catch (err) {
    console.error('Gemini error:', err.response?.data || err.message);
    res.status(500).json({ message: 'Failed to generate plan. Check your Gemini API key.' });
  }
});

// GET /api/plans — with search & filter
router.get('/', protect, async (req, res) => {
  try {
    const { search, completed } = req.query;
    const query = { userId: req.user._id };

    if (search) {
      query.subjects = { $regex: search, $options: 'i' };
    }
    if (completed === 'true') query.isCompleted = true;
    if (completed === 'false') query.isCompleted = false;

    const plans = await Plan.find(query).sort({ createdAt: -1 });
    const totalPlans = await Plan.countDocuments({ userId: req.user._id });
    const completedPlans = await Plan.countDocuments({ userId: req.user._id, isCompleted: true });

    res.json({ plans, total: totalPlans, completed: completedPlans });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// GET /api/plans/:id
router.get('/:id', protect, async (req, res) => {
  try {
    const plan = await Plan.findOne({ _id: req.params.id, userId: req.user._id });
    if (!plan) return res.status(404).json({ message: 'Plan not found' });
    res.json(plan);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// PATCH /api/plans/:id — update progress/notes/completion
router.patch('/:id', protect, async (req, res) => {
  try {
    const { progress, notes, isCompleted } = req.body;
    const plan = await Plan.findOne({ _id: req.params.id, userId: req.user._id });
    if (!plan) return res.status(404).json({ message: 'Plan not found' });

    if (progress !== undefined) plan.progress = progress;
    if (notes !== undefined) plan.notes = notes;
    if (isCompleted !== undefined) plan.isCompleted = isCompleted;

    await plan.save();
    res.json(plan);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// DELETE /api/plans/:id
router.delete('/:id', protect, async (req, res) => {
  try {
    const plan = await Plan.findOneAndDelete({ _id: req.params.id, userId: req.user._id });
    if (!plan) return res.status(404).json({ message: 'Plan not found' });
    res.json({ message: 'Plan deleted successfully' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
