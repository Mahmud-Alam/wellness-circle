import * as eventService from "../services/eventService.js";
import { success, error } from "../utils.js";

export const listEvents = async (req, res, next) => {
  try {
    const events = await eventService.listUpcomingEvents(req.query);
    return success(res, { events }, "Events fetched.");
  } catch (err) {
    next(err);
  }
};

export const getEvent = async (req, res, next) => {
  try {
    const userId = req.user?.id || null;
    const event = await eventService.getEventById(req.params.id, userId);
    if (!event) return error(res, "Event not found.", 404);
    return success(res, { event }, "Event fetched.");
  } catch (err) {
    next(err);
  }
};

export const createEvent = async (req, res, next) => {
  try {
    const event = await eventService.createEvent(req.user.id, req.body);
    return success(res, { event }, "Event created.", 201);
  } catch (err) {
    if (err.status) return error(res, err.message, err.status);
    next(err);
  }
};

export const listAttendees = async (req, res, next) => {
  try {
    const attendees = await eventService.listAttendees(req.params.id);
    return success(res, { attendees }, "Attendees fetched.");
  } catch (err) {
    next(err);
  }
};

export const joinEvent = async (req, res, next) => {
  try {
    const joined = await eventService.joinEvent(req.params.id, req.user.id);
    if (joined) return success(res, null, "Joined event.", 201);
    return success(res, null, "Already attending.");
  } catch (err) {
    if (err.status) return error(res, err.message, err.status);
    next(err);
  }
};

export const leaveEvent = async (req, res, next) => {
  try {
    const left = await eventService.leaveEvent(req.params.id, req.user.id);
    if (!left) return error(res, "Not attending this event.", 404);
    return success(res, null, "Left event.");
  } catch (err) {
    next(err);
  }
};
