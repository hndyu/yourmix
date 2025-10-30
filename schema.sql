DROP TABLE IF EXISTS cocktail_tags;
DROP TABLE IF EXISTS tags;
DROP TABLE IF EXISTS instructions;
DROP TABLE IF EXISTS cocktail_ingredients;
DROP TABLE IF EXISTS ingredients;
DROP TABLE IF EXISTS cocktails;

-- cocktails テーブル
CREATE TABLE cocktails (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  description TEXT,
  garnish TEXT,
  image_url TEXT,
  created_at TEXT DEFAULT CURRENT_TIMESTAMP,
  updated_at TEXT DEFAULT CURRENT_TIMESTAMP
);

-- ingredients テーブル
CREATE TABLE ingredients (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  name TEXT NOT NULL UNIQUE
);

-- cocktail_ingredients 中間テーブル
CREATE TABLE cocktail_ingredients (
  cocktail_id TEXT NOT NULL,
  ingredient_id INTEGER NOT NULL,
  amount TEXT NOT NULL,
  option_group INTEGER,
  PRIMARY KEY (cocktail_id, ingredient_id),
  FOREIGN KEY (cocktail_id) REFERENCES cocktails (id) ON DELETE CASCADE,
  FOREIGN KEY (ingredient_id) REFERENCES ingredients (id) ON DELETE CASCADE
);

-- instructions テーブル
CREATE TABLE instructions (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  cocktail_id TEXT NOT NULL,
  step INTEGER NOT NULL,
  text TEXT NOT NULL,
  FOREIGN KEY (cocktail_id) REFERENCES cocktails (id) ON DELETE CASCADE
);

-- tags テーブル
CREATE TABLE tags (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  name TEXT NOT NULL UNIQUE
);

-- cocktail_tags 中間テーブル
CREATE TABLE cocktail_tags (
  cocktail_id TEXT NOT NULL,
  tag_id INTEGER NOT NULL,
  PRIMARY KEY (cocktail_id, tag_id),
  FOREIGN KEY (cocktail_id) REFERENCES cocktails (id) ON DELETE CASCADE,
  FOREIGN KEY (tag_id) REFERENCES tags (id) ON DELETE CASCADE
);
