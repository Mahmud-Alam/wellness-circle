import { query } from "../config/db.js";

export const listUpcomingEvents = async ({ search, category } = {}) => {
  const conditions = ["e.event_date >= NOW()"];
  const params = [];
  let idx = 1;

  if (category && category !== "All") {
    conditions.push(`e.category = $${idx}`);
    params.push(category);
    idx += 1;
  }

  if (search) {
    conditions.push(`(e.title ILIKE $${idx} OR e.location_text ILIKE $${idx})`);
    params.push(`%${search}%`);
    idx += 1;
  }

  const { rows } = await query(
    `SELECT e.*,
       json_build_object('username', p.username, 'full_name', p.full_name) AS creator,
       (SELECT COUNT(*)::int FROM event_attendees WHERE event_id = e.id) AS attendee_count
     FROM events e
     JOIN users u ON u.id = e.creator_id
     LEFT JOIN profiles p ON p.user_id = u.id
     WHERE ${conditions.join(" AND ")}
     ORDER BY e.event_date ASC`,
    params,
  );
  return rows;
};

export const getEventById = async (id, userId = null) => {
  const { rows } = await query(
    `SELECT e.*,
       json_build_object('username', p.username, 'full_name', p.full_name, 'profile_pic_url', p.profile_pic_url) AS creator,
       (SELECT COUNT(*)::int FROM event_attendees WHERE event_id = e.id) AS attendee_count
     FROM events e
     JOIN users u ON u.id = e.creator_id
     LEFT JOIN profiles p ON p.user_id = u.id
     WHERE e.id = $1`,
    [id],
  );

  if (rows.length === 0) return null;

  const event = rows[0];

  if (userId) {
    const { rows: attending } = await query(
      "SELECT 1 FROM event_attendees WHERE event_id = $1 AND user_id = $2",
      [id, userId],
    );
    event.is_attending = attending.length > 0;
  } else {
    event.is_attending = false;
  }

  return event;
};

export const createEvent = async (creatorId, payload) => {
  const { rows } = await query(
    `INSERT INTO events (creator_id, title, description, event_date, location_text, category, cover_image_url)
     VALUES ($1, $2, $3, $4, $5, $6, $7)
     RETURNING *`,
    [
      creatorId,
      payload.title,
      payload.description,
      payload.event_date,
      payload.location_text,
      payload.category,
      payload.cover_image_url || null,
    ],
  );
  return rows[0];
};

export const listAttendees = async (eventId) => {
  const { rows } = await query(
    `SELECT ea.created_at, p.username, p.full_name, p.profile_pic_url
     FROM event_attendees ea
     JOIN profiles p ON p.user_id = ea.user_id
     WHERE ea.event_id = $1
     ORDER BY ea.created_at ASC`,
    [eventId],
  );
  return rows;
};

export const joinEvent = async (eventId, userId) => {
  const { rows: eventRows } = await query(
    "SELECT creator_id FROM events WHERE id = $1",
    [eventId],
  );
  if (eventRows.length === 0) {
    const err = new Error("Event not found.");
    err.status = 404;
    throw err;
  }
  if (eventRows[0].creator_id === userId) {
    const err = new Error("Cannot join your own event.");
    err.status = 400;
    throw err;
  }

  const { rowCount } = await query(
    "INSERT INTO event_attendees (event_id, user_id) VALUES ($1, $2) ON CONFLICT DO NOTHING",
    [eventId, userId],
  );
  return rowCount > 0;
};

export const leaveEvent = async (eventId, userId) => {
  const { rowCount } = await query(
    "DELETE FROM event_attendees WHERE event_id = $1 AND user_id = $2",
    [eventId, userId],
  );
  return rowCount > 0;
};
