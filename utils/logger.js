const Activity = require('../models/Activity');

const logActivity = async ({ user, action, entity, entityId, description, req, metadata }) => {
  try {
    await Activity.create({
      user: user || null,
      action,
      entity: entity || '',
      entityId: entityId || '',
      description: description || '',
      ipAddress: req?.ip || '',
      userAgent: req?.headers?.['user-agent'] || '',
      metadata: metadata || {},
    });
  } catch (error) {
    // Logging failures shouldn't crash the app
    console.error('Activity log failed:', error.message);
  }
};

module.exports = { logActivity };
