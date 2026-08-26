require('dotenv').config();
const { Pool } = require('pg');
const fs = require('fs');
const path = require('path');

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

async function seed() {
  try {
    console.log("Creating gallery_images table...");
    await pool.query(`
      CREATE TABLE IF NOT EXISTS gallery_images (
        id SERIAL PRIMARY KEY,
        src VARCHAR(255) NOT NULL,
        alt VARCHAR(255) DEFAULT 'Gallery Image',
        sort_order INTEGER DEFAULT 0,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `);
    
    console.log("Checking for existing images in database...");
    const existing = await pool.query("SELECT COUNT(*) FROM gallery_images");
    if (parseInt(existing.rows[0].count) > 0) {
      console.log(`Database already has ${existing.rows[0].count} images. Exiting.`);
      process.exit(0);
    }

    const galleryDir = path.join(__dirname, '../client/public/gallery');
    console.log(`Reading images from ${galleryDir}...`);
    const files = fs.readdirSync(galleryDir).filter(f => f.match(/\.(jpg|jpeg|png|gif)$/i));
    
    console.log(`Found ${files.length} images. Inserting into database...`);
    let order = 1;
    for (const file of files) {
      await pool.query(
        "INSERT INTO gallery_images (src, alt, sort_order) VALUES ($1, $2, $3)",
        [`/gallery/${file}`, file, order++]
      );
    }
    console.log("Successfully seeded gallery_images!");
  } catch (err) {
    console.error("Error seeding:", err);
  } finally {
    await pool.end();
  }
}

seed();
