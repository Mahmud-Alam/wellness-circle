import { query, getClient } from "../config/db.js";
import { hashPassword, comparePassword, signToken } from "../utils.js";

export const signUp = async ({
  email,
  password,
  role = "user",
  full_name,
  username,
  profile_pic_url,
  location,
}) => {
  const emailLower = email.toLowerCase();
  const cleanUsername = username.toLowerCase();

  // Check email
  const { rows: existingEmail } = await query(
    "SELECT id FROM users WHERE email = $1",
    [emailLower],
  );
  if (existingEmail.length > 0) {
    const err = new Error("Email already registered.");
    err.status = 409;
    throw err;
  }

  // Check username
  const { rows: existingUser } = await query(
    "SELECT id FROM profiles WHERE lower(username) = $1",
    [cleanUsername],
  );
  if (existingUser.length > 0) {
    const err = new Error("Username already taken.");
    err.status = 409;
    throw err;
  }

  const passwordHash = await hashPassword(password);

  // Transaction: insert user + profile together
  const client = await getClient();
  try {
    await client.query("BEGIN");

    const { rows: userRows } = await client.query(
      "INSERT INTO users (email, password_hash, role) VALUES ($1, $2, $3) RETURNING id, email, role, created_at",
      [emailLower, passwordHash, role],
    );
    const user = userRows[0];

    const { rows: profileRows } = await client.query(
      "INSERT INTO profiles (user_id, full_name, username, profile_pic_url, location) VALUES ($1, $2, $3, $4, $5) RETURNING id, full_name, username, profile_pic_url, location",
      [user.id, full_name, cleanUsername, profile_pic_url || null, location],
    );

    await client.query("COMMIT");

    const token = signToken({
      id: user.id,
      email: user.email,
      role: user.role,
    });
    return { user, profile: profileRows[0], token };
  } catch (err) {
    await client.query("ROLLBACK");
    throw err;
  } finally {
    client.release();
  }
};

export const signIn = async ({ email, password }) => {
  const { rows } = await query(
    `SELECT u.id, u.email, u.password_hash, u.role, u.created_at,
            p.full_name, p.username, p.profile_pic_url, p.location
     FROM users u
     LEFT JOIN profiles p ON p.user_id = u.id
     WHERE u.email = $1`,
    [email.toLowerCase()],
  );

  if (rows.length === 0) {
    const err = new Error("Invalid email or password.");
    err.status = 401;
    throw err;
  }

  const row = rows[0];
  const valid = await comparePassword(password, row.password_hash);
  if (!valid) {
    const err = new Error("Invalid email or password.");
    err.status = 401;
    throw err;
  }

  const token = signToken({ id: row.id, email: row.email, role: row.role });
  return {
    user: {
      id: row.id,
      email: row.email,
      role: row.role,
      created_at: row.created_at,
    },
    profile: row.username
      ? {
          full_name: row.full_name,
          username: row.username,
          profile_pic_url: row.profile_pic_url,
          location: row.location,
        }
      : null,
    token,
  };
};

export const getCurrentUser = async (userId) => {
  const { rows } = await query(
    `SELECT u.id, u.email, u.role, u.created_at,
            p.full_name, p.username, p.profile_pic_url, p.location
     FROM users u
     LEFT JOIN profiles p ON p.user_id = u.id
     WHERE u.id = $1`,
    [userId],
  );

  if (rows.length === 0) return null;

  const row = rows[0];
  return {
    user: {
      id: row.id,
      email: row.email,
      role: row.role,
      created_at: row.created_at,
    },
    profile: row.username
      ? {
          full_name: row.full_name,
          username: row.username,
          profile_pic_url: row.profile_pic_url,
          location: row.location,
        }
      : null,
  };
};
