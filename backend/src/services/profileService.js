import { query } from "../config/db.js";

export const getProfile = async (userId) => {
  const { rows } = await query(
    `SELECT p.id, p.user_id, p.full_name, p.username, p.profile_pic_url, p.location, p.created_at,
            u.role, u.email
     FROM profiles p
     JOIN users u ON u.id = p.user_id
     WHERE p.user_id = $1`,
    [userId],
  );
  return rows[0] || null;
};

export const updateProfile = async (userId, updates) => {
  const allowed = ["full_name", "profile_pic_url", "location"];
  const fields = [];
  const values = [];
  let idx = 1;

  for (const key of allowed) {
    if (updates[key] !== undefined) {
      fields.push(`${key} = $${idx}`);
      values.push(updates[key]);
      idx += 1;
    }
  }

  if (fields.length === 0) {
    const err = new Error("No valid fields to update.");
    err.status = 400;
    throw err;
  }

  values.push(userId);
  const { rows } = await query(
    `UPDATE profiles SET ${fields.join(", ")} WHERE user_id = $${idx}
     RETURNING id, user_id, full_name, username, profile_pic_url, location, created_at`,
    values,
  );

  if (rows.length === 0) {
    const err = new Error("Profile not found.");
    err.status = 404;
    throw err;
  }
  return rows[0];
};

/**
 * Events this user has JOINED via event_attendees.
 * Excludes events they created (those go in getHostingEvents).
 */
export const getAttendingEvents = async (userId) => {
  const { rows } = await query(
    `SELECT e.id, e.title, e.description, e.event_date, e.location_text,
            e.category, e.cover_image_url, e.creator_id, e.created_at,
            json_build_object(
              'username', p.username,
              'full_name', p.full_name,
              'profile_pic_url', p.profile_pic_url
            ) AS creator,
            (SELECT COUNT(*)::int FROM event_attendees WHERE event_id = e.id) AS attendee_count,
            true AS is_attending
     FROM event_attendees ea
     JOIN events e ON e.id = ea.event_id
     JOIN users u ON u.id = e.creator_id
     LEFT JOIN profiles p ON p.user_id = u.id
     WHERE ea.user_id = $1
       AND e.creator_id != $1
       AND e.event_date >= NOW()
     ORDER BY e.event_date ASC`,
    [userId],
  );
  return rows;
};

/**
 * Events this user has CREATED (hosting).
 */
export const getHostingEvents = async (userId) => {
  const { rows } = await query(
    `SELECT e.id, e.title, e.description, e.event_date, e.location_text,
            e.category, e.cover_image_url, e.creator_id, e.created_at,
            json_build_object(
              'username', p.username,
              'full_name', p.full_name,
              'profile_pic_url', p.profile_pic_url
            ) AS creator,
            (SELECT COUNT(*)::int FROM event_attendees WHERE event_id = e.id) AS attendee_count
     FROM events e
     LEFT JOIN profiles p ON p.user_id = e.creator_id
     WHERE e.creator_id = $1
       AND e.event_date >= NOW()
     ORDER BY e.event_date ASC`,
    [userId],
  );
  return rows;
};
