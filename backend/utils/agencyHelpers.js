const User = require('../models/User');
const Plan = require('../models/Plan');

const AGENCY_PLAN_NAME = 'Fashion Studio Agency';

async function userHasAgencyPlan(userId) {
  const user = await User.findById(userId).populate('activePlan');
  if (!user?.activePlan) return null;
  if (user.activePlan.name !== AGENCY_PLAN_NAME && !user.activePlan.maxSubUsers) return null;
  return user.activePlan;
}

async function canAddSubUser(agencyUserId, agencyPlan) {
  const subUserCount = await User.countDocuments({ parentUser: agencyUserId, isSubUser: true });
  return subUserCount < (agencyPlan.maxSubUsers || 0);
}

async function applyAgencyReferral(newUser, refUserId) {
  if (!refUserId) return newUser;

  const agencyPlan = await userHasAgencyPlan(refUserId);
  if (!agencyPlan) return newUser;

  const allowed = await canAddSubUser(refUserId, agencyPlan);
  if (!allowed) return newUser;

  newUser.isSubUser = true;
  newUser.parentUser = refUserId;
  newUser.credits = agencyPlan.subUserCredits || 50;
  return newUser;
}

module.exports = {
  AGENCY_PLAN_NAME,
  userHasAgencyPlan,
  canAddSubUser,
  applyAgencyReferral,
};
