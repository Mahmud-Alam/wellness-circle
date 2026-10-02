import * as profileService from "../services/profileService.js";
import { success, error } from "../utils.js";

export const getMyProfile = async (req, res, next) => {
  try {
    const profile = await profileService.getProfile(req.user.id);
    if (!profile) return error(res, "Profile not found.", 404);

    // Fetch BOTH lists in parallel — every user can attend and (if admin) host events
    const [attendingEvents, hostingEvents] = await Promise.all([
      profileService.getAttendingEvents(req.user.id),
      profileService.getHostingEvents(req.user.id),
    ]);

    return success(
      res,
      {
        profile,
        attending_events: attendingEvents,
        hosting_events: hostingEvents,
      },
      "Profile fetched.",
    );
  } catch (err) {
    next(err);
  }
};

export const updateMyProfile = async (req, res, next) => {
  try {
    const profile = await profileService.updateProfile(req.user.id, req.body);
    return success(res, { profile }, "Profile updated.");
  } catch (err) {
    if (err.status) return error(res, err.message, err.status);
    next(err);
  }
};
