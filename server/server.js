const express = require("express");

const jwt = require("jsonwebtoken");

const cors = require("cors");
const db = require("./db");
const bcrypt = require("bcryptjs");
const nodemailer = require("nodemailer");
const passport = require("passport");
const session = require("express-session");
require("./config/passport");
const app = express();
const PORT = process.env.PORT || 5001;

app.use(cors({ origin: true, credentials: true }));
app.use(express.json());

function authenticateToken(req, res, next) {
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1];

  if (!token)
    return res.status(401).json({ success: false, error: "No token provided" });

  jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
    if (err)
      return res.status(403).json({ success: false, error: "Invalid or expired token" });
    req.user = user;
    next();
  });
}

function requireAdmin(req, res, next) {
  if (req.user?.role !== "admin")
    return res.status(403).json({ success: false, error: "Admin access required" });
  next();
}

console.log("PASSPORT LOADED");

app.use(
  session({
    secret: process.env.SESSION_SECRET || "secret",
    resave: false,
    saveUninitialized: false,
  })
);

app.use(passport.initialize());
app.use(passport.session());

const transporter = nodemailer.createTransport({
  host: process.env.EMAIL_HOST || "smtp.gmail.com",
  port: parseInt(process.env.EMAIL_PORT || "587"),
  secure: false,
  auth: {
    user: process.env.EMAIL_USER || "",
    pass: process.env.EMAIL_PASS || "",
  },
});

async function sendReplyEmail({ to, userName, originalMessage, replyText }) {
  if (!process.env.EMAIL_USER || !process.env.EMAIL_PASS) {
    console.log("[Email] Skipped – EMAIL_USER / EMAIL_PASS not configured");
    return;
  }
  const from = process.env.EMAIL_FROM || `"Carbon.ez" <${process.env.EMAIL_USER}>`;
  await transporter.sendMail({
    from,
    to,
    subject: "Reply from Carbon.ez",
    html: `
      <div style="font-family:Arial,sans-serif;max-width:600px;margin:0 auto">
        <h2 style="color:#f5c518">Carbon.ez</h2>
        <p>Hello ${userName || "there"},</p>
        <p>You received a reply to your inquiry:</p>
        <blockquote style="border-left:3px solid #ccc;padding-left:12px;color:#555">
          ${originalMessage}
        </blockquote>
        <p style="background:#fffbe6;border:1px solid #f5c518;padding:12px;border-radius:6px">
          <strong>Reply:</strong><br>${replyText}
        </p>
        <p style="color:#999;font-size:12px">Carbon.ez — premium carbon steering wheels</p>
      </div>`,
  });
}

app.get("/api/products", async (req, res) => {
  try {
    const query = `
      SELECT p.*,
      COALESCE(json_agg(pi.image_url) FILTER (WHERE pi.image_url IS NOT NULL), '[]') as gallery
      FROM products p
      LEFT JOIN product_images pi ON p.id = pi.product_id
      GROUP BY p.id
      ORDER BY p.id ASC`;
    const result = await db.query(query);
    const products = result.rows.map((p) => ({ ...p, nameBs: p.name_bs }));
    res.json(products);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server Error");
  }
});

app.get("/api/products/:id", async (req, res) => {
  const { id } = req.params;
  try {
    const query = `
      SELECT p.*,
      COALESCE(json_agg(pi.image_url) FILTER (WHERE pi.image_url IS NOT NULL), '[]') as gallery
      FROM products p
      LEFT JOIN product_images pi ON p.id = pi.product_id
      WHERE p.id = $1
      GROUP BY p.id`;
    const result = await db.query(query, [id]);
    if (result.rows.length === 0) return res.status(404).json({ success: false, error: "Product not found" });
    const p = result.rows[0];
    res.json({ ...p, nameBs: p.name_bs });
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server Error");
  }
});

// ── Auth ──────────────────────────────────────────────────────────────────────
app.post("/api/auth/login", async (req, res) => {
  const { email, password } = req.body;
  try {
    const result = await db.query("SELECT * FROM users WHERE email = $1", [email]);
    if (result.rows.length === 0) return res.status(401).json({ success: false, error: "Invalid credentials" });
    const user = result.rows[0];
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res
        .status(401)
        .json({ success: false, error: "Invalid credentials" });
    }

    const token = jwt.sign(
      { id: user.id, email: user.email, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );

    res.json({
      success: true,
      token,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
    });
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server Error");
  }
});

app.post("/api/auth/register", async (req, res) => {
  const { name, email, password } = req.body;
  const nameRegex = /^[a-zA-ZğüşıöçĞÜŞİÖÇ\s]{2,50}$/;
  if (!nameRegex.test(name)) {
    return res.status(400).json({
      success: false,
      error: "Full name must be 2-50 characters and contain only letters."
    });
  }

  const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*]).{8,}$/;
  if (!passwordRegex.test(password)) {
    return res.status(400).json({
      success: false,
      error: "Password must be at least 8 characters and include uppercase, lowercase, number, and special character (!@#$%^&*)."
    });
  }
  try {
    const userCheck = await db.query("SELECT * FROM users WHERE email = $1", [email]);
    if (userCheck.rows.length > 0) return res.status(400).json({ success: false, error: "User already exists" });
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);
    const newUser = await db.query(
      "INSERT INTO users (name, email, password, role) VALUES ($1, $2, $3, $4) RETURNING *",
      [name, email, hashedPassword, "customer"]
    );
    const token = jwt.sign(
      { id: newUser.rows[0].id, email: newUser.rows[0].email, role: "customer" },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );
    res.json({
      success: true,
      token,
      user: {
        id: newUser.rows[0].id,
        name: newUser.rows[0].name,
        email: newUser.rows[0].email,
        role: "customer",
      },
    });
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server Error");
  }
});

app.post("/api/auth/change-password", async (req, res) => {
  const { email, currentPassword, newPassword } = req.body;
  try {
    const result = await db.query("SELECT * FROM users WHERE email = $1", [email]);
    if (result.rows.length === 0) return res.status(404).json({ success: false, error: "User not found" });
    const user = result.rows[0];
    const isMatch = await bcrypt.compare(currentPassword, user.password);
    if (!isMatch) return res.status(401).json({ success: false, error: "Incorrect current password" });
    const salt = await bcrypt.genSalt(10);
    const hashedNew = await bcrypt.hash(newPassword, salt);
    await db.query("UPDATE users SET password = $1 WHERE email = $2", [hashedNew, email]);
    res.json({ success: true });
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server Error");
  }
});

app.get(
  "/api/auth/google",
  passport.authenticate("google", {
    scope: ["profile", "email"],
  })
);

app.get("/api/auth/facebook", (req, res) => {
  res.status(501).json({
    error: "Facebook OAuth not configured. Install passport-facebook and set FACEBOOK_APP_ID / FACEBOOK_APP_SECRET in .env"
  });
});

app.get(
  "/api/auth/google/callback",
  passport.authenticate("google", {
    session: false,
    failureRedirect: "http://localhost:5173/login",
  }),
  (req, res) => {
    const token = jwt.sign(
      { id: req.user.id, email: req.user.email, role: req.user.role },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );
    const user = { id: req.user.id, name: req.user.name, email: req.user.email, role: req.user.role };
    res.redirect(
      `http://localhost:5173/auth/google/callback?token=${token}&user=${encodeURIComponent(JSON.stringify(user))}`
    );
  }
);

// ── Orders ────────────────────────────────────────────────────────────────────
app.post("/api/orders", async (req, res) => {
  const { userEmail, shipping, items } = req.body;
  try {
    // Resolve prices from DB — never trust client-submitted prices
    const resolvedItems = [];
    let serverTotal = 0;
    for (const item of items) {
      const quantity = parseInt(item.quantity, 10);
      if (!item.id || isNaN(quantity) || quantity < 1) {
        return res.status(400).json({ success: false, error: "Invalid item" });
      }
      const productRes = await db.query("SELECT * FROM products WHERE id = $1", [item.id]);
      if (productRes.rows.length === 0) {
        return res.status(400).json({ success: false, error: `Product not found: ${item.id}` });
      }
      const product = productRes.rows[0];
      serverTotal += parseFloat(product.price) * quantity;
      resolvedItems.push({ name: product.name, price: product.price, quantity, image: product.image });
    }

    await db.query("BEGIN");
    const orderRes = await db.query(
      `INSERT INTO orders (user_email, total, shipping_name, shipping_address, shipping_city, shipping_zip, shipping_country, shipping_phone)
             VALUES ($1, $2, $3, $4, $5, $6, $7, $8) RETURNING id`,
      [
        userEmail,
        serverTotal,
        shipping.name,
        shipping.address,
        shipping.city,
        shipping.zip,
        shipping.country,
        shipping.phone,
      ],
    );
    const orderId = orderRes.rows[0].id;
    for (const item of resolvedItems) {
      await db.query(
        `INSERT INTO order_items (order_id, product_name, price, quantity, image)
                 VALUES ($1, $2, $3, $4, $5)`,
        [orderId, item.name, item.price, item.quantity, item.image],
      );
    }
    await db.query("COMMIT");
    res.json({ success: true, orderId });
  } catch (err) {
    await db.query("ROLLBACK");
    console.error(err.message);
    res.status(500).send("Server Error");
  }
});

// GET orders for a specific user (by email) – used by UserDashboard
app.get("/api/orders/user/:email", authenticateToken, async (req, res) => {
  const { email } = req.params;
  try {
    const ordersRes = await db.query(
      "SELECT * FROM orders WHERE user_email = $1 ORDER BY created_at DESC",
      [email]
    );
    const orders = ordersRes.rows;
    for (let order of orders) {
      const itemsRes = await db.query("SELECT * FROM order_items WHERE order_id = $1", [order.id]);
      order.items = itemsRes.rows.map((i) => ({
        name: i.product_name,
        price: i.price,
        quantity: i.quantity,
        image: i.image,
      }));
    }
    res.json(orders);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server Error");
  }
});

app.get("/api/admin/orders", authenticateToken, requireAdmin, async (req, res) => {
  try {
    const ordersRes = await db.query("SELECT * FROM orders ORDER BY created_at DESC");
    const orders = ordersRes.rows;
    for (let order of orders) {
      const itemsRes = await db.query("SELECT * FROM order_items WHERE order_id = $1", [order.id]);
      order.items = itemsRes.rows.map((i) => ({
        name: i.product_name, price: i.price, quantity: i.quantity, image: i.image,
      }));
      order.user = order.user_email;
      order.shipping = { name: order.shipping_name, address: order.shipping_address, city: order.shipping_city, phone: order.shipping_phone };
    }
    res.json(orders);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server Error");
  }
});

app.patch("/api/orders/:id/status", authenticateToken, requireAdmin, async (req, res) => {
  const { id } = req.params;
  const { status } = req.body;
  const validStatuses = ["Pending", "Approved", "Declined"];
  if (!validStatuses.includes(status))
    return res.status(400).json({ success: false, error: "Invalid status value" });
  try {
    const result = await db.query("UPDATE orders SET status = $1 WHERE id = $2 RETURNING *", [status, id]);
    if (result.rows.length === 0) return res.status(404).json({ success: false, error: "Order not found" });
    res.json({ success: true, order: result.rows[0] });
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server Error");
  }
});

// ── Products CRUD ─────────────────────────────────────────────────────────────
app.post("/api/products", authenticateToken, requireAdmin, async (req, res) => {
  const { name, nameBs, price, category, image, description, gallery } = req.body;
  try {
    await db.query("BEGIN");
    const productRes = await db.query(
      "INSERT INTO products (name, name_bs, price, category, image, description) VALUES ($1, $2, $3, $4, $5, $6) RETURNING *",
      [name, nameBs, price, category, image, description]
    );
    const newProduct = productRes.rows[0];
    if (gallery && gallery.length > 0) {
      for (const imgUrl of gallery) {
        await db.query("INSERT INTO product_images (product_id, image_url) VALUES ($1, $2)", [newProduct.id, imgUrl]);
      }
    }
    await db.query("COMMIT");
    newProduct.gallery = gallery || [];
    res.json({ ...newProduct, nameBs: newProduct.name_bs });
  } catch (err) {
    await db.query("ROLLBACK");
    console.error(err.message);
    res.status(500).send("Server Error");
  }
});

app.delete("/api/products/:id", authenticateToken, requireAdmin, async (req, res) => {
  const { id } = req.params;
  try {
    await db.query("DELETE FROM products WHERE id = $1", [id]);
    res.json({ success: true });
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server Error");
  }
});

app.put("/api/products/:id", authenticateToken, requireAdmin, async (req, res) => {
  const { id } = req.params;
  const { name, nameBs, price, category, image, description, gallery } = req.body;
  try {
    await db.query("BEGIN");
    const productRes = await db.query(
      "UPDATE products SET name = $1, name_bs = $2, price = $3, category = $4, image = $5, description = $6 WHERE id = $7 RETURNING *",
      [name, nameBs, price, category, image, description, id]
    );
    if (productRes.rows.length === 0) { await db.query("ROLLBACK"); return res.status(404).json({ success: false, error: "Product not found" }); }
    const updatedProduct = productRes.rows[0];
    await db.query("DELETE FROM product_images WHERE product_id = $1", [id]);
    if (gallery && gallery.length > 0) {
      for (const imgUrl of gallery) {
        await db.query("INSERT INTO product_images (product_id, image_url) VALUES ($1, $2)", [updatedProduct.id, imgUrl]);
      }
    }
    await db.query("COMMIT");
    updatedProduct.gallery = gallery || [];
    res.json({ ...updatedProduct, nameBs: updatedProduct.name_bs });
  } catch (err) {
    await db.query("ROLLBACK");
    console.error(err.message);
    res.status(500).send("Server Error");
  }
});

// ── Contact / Messages ────────────────────────────────────────────────────────
app.post("/api/contact", async (req, res) => {
  const { name, email, message, phone } = req.body;
  try {
    await db.query(
      "INSERT INTO messages (name, email, message, phone) VALUES ($1, $2, $3, $4)",
      [name, email, message, phone]
    );
    res.json({ success: true });
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server Error");
  }
});

app.get("/api/admin/messages", authenticateToken, requireAdmin, async (req, res) => {
  try {
    const result = await db.query("SELECT * FROM messages ORDER BY created_at DESC");
    res.json(result.rows);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server Error");
  }
});

// GET messages for a specific user (by email) – used by UserDashboard
app.get("/api/messages/user/:email", authenticateToken, async (req, res) => {
  const { email } = req.params;
  try {
    const result = await db.query(
      "SELECT * FROM messages WHERE email = $1 ORDER BY created_at DESC",
      [email]
    );
    res.json(result.rows);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server Error");
  }
});

// Admin replies to a user message — saves reply AND sends email to user
app.patch("/api/messages/:id/reply", authenticateToken, requireAdmin, async (req, res) => {
  const { id } = req.params;
  const { reply } = req.body;
  try {
    const result = await db.query(
      "UPDATE messages SET reply = $1 WHERE id = $2 RETURNING *",
      [reply, id]
    );
    if (result.rows.length === 0) return res.status(404).json({ success: false, error: "Message not found" });
    const msg = result.rows[0];

    // Send reply email to the user (non-blocking — don't fail the request if email fails)
    sendReplyEmail({
      to: msg.email,
      userName: msg.name,
      originalMessage: msg.message,
      replyText: reply,
    }).catch((err) => console.error("[Email] Failed to send reply email:", err.message));

    res.json({ success: true, message: msg });
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server Error");
  }
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
