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

export const getMyEvents = async (userId, role) => {
  if (role === "admin") {
    // Admin: events they created
    const { rows } = await query(
      `SELECT e.*, (SELECT COUNT(*)::int FROM event_attendees WHERE event_id = e.id) AS attendee_count
       FROM events e
       WHERE e.creator_id = $1 AND e.event_date >= NOW()
       ORDER BY e.event_date ASC`,
      [userId],
    );
    return rows;
  } else {
    // User: events they're attending
    const { rows } = await query(
      `SELECT e.*, ea.created_at AS joined_at
       FROM event_attendees ea
       JOIN events e ON e.id = ea.event_id
       WHERE ea.user_id = $1 AND e.event_date >= NOW()
       ORDER BY e.event_date ASC`,
      [userId],
    );
    return rows;
  }
};
