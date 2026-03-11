import express from "express";
import { createServer as createViteServer } from "vite";
import path from "path";
import { fileURLToPath } from "url";
import Database from "better-sqlite3";
import crypto from "crypto";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const db = new Database("gengrowth.db");

// Initialize Database Schema
db.exec(`
  CREATE TABLE IF NOT EXISTS products (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    url TEXT NOT NULL UNIQUE,
    status TEXT DEFAULT 'intake',
    current_phase TEXT DEFAULT 'INTAKE',
    probe_status TEXT DEFAULT 'pending',
    probe_result TEXT, -- JSON
    connection_count INTEGER DEFAULT 1,
    created_by TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
  );

  CREATE TABLE IF NOT EXISTS input_profiles (
    id TEXT PRIMARY KEY,
    product_id TEXT NOT NULL,
    product_url TEXT NOT NULL,
    target_regions TEXT NOT NULL, -- JSON array
    experiment_goal TEXT NOT NULL,
    primary_conversion_event TEXT NOT NULL,
    language_override TEXT,
    brand_safety_policy TEXT,
    production_cap_override INTEGER,
    version INTEGER DEFAULT 1,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (product_id) REFERENCES products(id)
  );

  -- Drop and recreate to fix schema mismatch
  DROP TABLE IF EXISTS data_connections;

  CREATE TABLE IF NOT EXISTS data_connections (
    id TEXT PRIMARY KEY,
    product_id TEXT NOT NULL,
    source TEXT NOT NULL, -- 'Google Search Console', 'Google Analytics 4'
    status TEXT DEFAULT 'connected', -- 'connected', 'error'
    health TEXT DEFAULT 'Healthy', -- 'Healthy', 'Action Required'
    last_sync DATETIME DEFAULT CURRENT_TIMESTAMP,
    details TEXT, -- JSON: apiAlive, dataLatency, dataIntegrity, attribution
    error_message TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (product_id) REFERENCES products(id)
  );

  -- Drop and recreate to fix schema mismatch
  DROP TABLE IF EXISTS opportunity_items;
  DROP TABLE IF EXISTS discovery_runs;

  CREATE TABLE IF NOT EXISTS discovery_runs (
    id TEXT PRIMARY KEY,
    product_id TEXT NOT NULL,
    status TEXT DEFAULT 'completed', -- 'completed', 'partial', 'running'
    trigger_type TEXT DEFAULT 'manual', -- 'manual', 'scheduled'
    found_count INTEGER DEFAULT 0,
    error_message TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (product_id) REFERENCES products(id)
  );

  CREATE TABLE IF NOT EXISTS opportunity_items (
    id TEXT PRIMARY KEY,
    product_id TEXT NOT NULL,
    run_id TEXT NOT NULL,
    type TEXT NOT NULL, -- 'Keyword Cluster', 'Competitor Gap', 'Content Gap', 'Backlink Opportunity'
    title TEXT NOT NULL,
    priority TEXT NOT NULL, -- 'High', 'Medium', 'Low'
    intent TEXT, -- 'Informational', 'Comparison', 'Transactional', 'Navigational'
    volume TEXT,
    cpc TEXT,
    why TEXT,
    evidence TEXT, -- JSON array
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (product_id) REFERENCES products(id),
    FOREIGN KEY (run_id) REFERENCES discovery_runs(id)
  );
`);

// Add some mock data if empty
const productCount = db.prepare("SELECT COUNT(*) as count FROM products").get().count;
if (productCount === 0) {
  const id1 = crypto.randomUUID();
  db.prepare("INSERT INTO products (id, name, url, status, connection_count, probe_result) VALUES (?, ?, ?, ?, ?, ?)").run(
    id1, 
    "AstroGrowth", 
    "https://astrogrowth.io", 
    "active", 
    3,
    JSON.stringify({
      sitemap_found: true,
      page_types: ["product", "blog"],
      detected_language: "en",
      completion_rate: 100
    })
  );
  db.prepare("INSERT INTO input_profiles (id, product_id, product_url, target_regions, experiment_goal, primary_conversion_event) VALUES (?, ?, ?, ?, ?, ?)").run(
    crypto.randomUUID(),
    id1,
    "https://astrogrowth.io",
    JSON.stringify(["US", "UK"]),
    "organic_signup_growth",
    "signup_completed"
  );

  // Add mock connections
  db.prepare(`
    INSERT INTO data_connections (id, product_id, source, status, health, details)
    VALUES (?, ?, ?, ?, ?, ?)
  `).run(
    crypto.randomUUID(),
    id1,
    'Google Search Console',
    'connected',
    'Healthy',
    JSON.stringify({
      apiAlive: true,
      dataLatency: '10m',
      dataIntegrity: '98%',
      attribution: 'available'
    })
  );
  db.prepare(`
    INSERT INTO data_connections (id, product_id, source, status, health, details, error_message)
    VALUES (?, ?, ?, ?, ?, ?, ?)
  `).run(
    crypto.randomUUID(),
    id1,
    'Google Analytics 4',
    'error',
    'Action Required',
    JSON.stringify({
      apiAlive: false,
      dataLatency: '48h',
      dataIntegrity: '82%',
      attribution: 'unavailable'
    }),
    'OAuth Token Expired'
  );

  // Add mock discovery runs
  const runId1 = crypto.randomUUID();
  db.prepare(`
    INSERT INTO discovery_runs (id, product_id, status, trigger_type, found_count)
    VALUES (?, ?, ?, ?, ?)
  `).run(runId1, id1, 'completed', 'manual', 4);

  const opps = [
    { 
      type: 'Keyword Cluster', 
      title: 'discovery.mock_data.opp1.title', 
      priority: 'High', 
      intent: 'Informational',
      volume: '45k/mo',
      cpc: '$1,200/mo',
      why: 'discovery.mock_data.opp1.why',
      evidence: [
        { step: 'Data Source', detail: 'discovery.mock_data.opp1.ev1' },
        { step: 'Analysis', detail: 'discovery.mock_data.opp1.ev2' },
        { step: 'Calculation', detail: 'discovery.mock_data.opp1.ev3' }
      ]
    },
    { 
      type: 'Competitor Gap', 
      title: 'discovery.mock_data.opp2.title', 
      priority: 'Medium', 
      intent: 'Comparison',
      volume: 'Gap: 12%',
      cpc: '$850/mo',
      why: 'discovery.mock_data.opp2.why',
      evidence: [
        { step: 'Data Source', detail: 'discovery.mock_data.opp2.ev1' },
        { step: 'Analysis', detail: 'discovery.mock_data.opp2.ev2' },
        { step: 'Calculation', detail: 'discovery.mock_data.opp2.ev3' }
      ]
    },
    { 
      type: 'Content Gap', 
      title: 'discovery.mock_data.opp3.title', 
      priority: 'High', 
      intent: 'Informational',
      volume: '120k/mo',
      cpc: '$3,400/mo',
      why: 'discovery.mock_data.opp3.why',
      evidence: [
        { step: 'Data Source', detail: 'discovery.mock_data.opp3.ev1' },
        { step: 'Analysis', detail: 'discovery.mock_data.opp3.ev2' },
        { step: 'Calculation', detail: 'discovery.mock_data.opp3.ev3' }
      ]
    },
    { 
      type: 'Backlink Opportunity', 
      title: 'discovery.mock_data.opp4.title', 
      priority: 'Low', 
      intent: 'Navigational',
      volume: '24 domains',
      cpc: '$300/mo',
      why: 'discovery.mock_data.opp4.why',
      evidence: [
        { step: 'Data Source', detail: 'discovery.mock_data.opp4.ev1' },
        { step: 'Analysis', detail: 'discovery.mock_data.opp4.ev2' },
        { step: 'Calculation', detail: 'discovery.mock_data.opp4.ev3' }
      ]
    }
  ];

  opps.forEach(opp => {
    db.prepare(`
      INSERT INTO opportunity_items (id, product_id, run_id, type, title, priority, intent, volume, cpc, why, evidence)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `).run(
      crypto.randomUUID(),
      id1,
      runId1,
      opp.type,
      opp.title,
      opp.priority,
      opp.intent,
      opp.volume,
      opp.cpc,
      opp.why,
      JSON.stringify(opp.evidence)
    );
  });
}

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json());

  // API Routes
  app.get("/api/products", (req, res) => {
    const products = db.prepare("SELECT * FROM products ORDER BY created_at DESC").all();
    const enrichedProducts = products.map((p: any) => {
      const profile = db.prepare("SELECT * FROM input_profiles WHERE product_id = ?").get(p.id);
      return {
        ...p,
        probe_result: p.probe_result ? JSON.parse(p.probe_result) : null,
        input_profile: profile ? {
          ...profile,
          target_regions: JSON.parse(profile.target_regions)
        } : null
      };
    });
    res.json(enrichedProducts);
  });

  app.post("/api/products", (req, res) => {
    const { 
      name, 
      url, 
      target_regions, 
      experiment_goal, 
      primary_conversion_event,
      language_override,
      brand_safety_policy,
      production_cap_override
    } = req.body;
    const id = crypto.randomUUID();
    
    try {
      const insertProduct = db.prepare(`
        INSERT INTO products (id, name, url, status, current_phase, probe_result)
        VALUES (?, ?, ?, 'intake', 'INTAKE', ?)
      `);
      
      const insertProfile = db.prepare(`
        INSERT INTO input_profiles (
          id, product_id, product_url, target_regions, experiment_goal, 
          primary_conversion_event, language_override, brand_safety_policy, production_cap_override
        )
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
      `);

      const profileId = crypto.randomUUID();
      
      // Mock probe result for new product
      const mockProbe = {
        sitemap_found: true,
        page_types: ["home", "pricing"],
        detected_language: language_override || "en",
        completion_rate: 72
      };

      const transaction = db.transaction(() => {
        insertProduct.run(id, name, url, JSON.stringify(mockProbe));
        insertProfile.run(
          profileId, 
          id, 
          url, 
          JSON.stringify(target_regions), 
          experiment_goal, 
          primary_conversion_event,
          language_override || null,
          brand_safety_policy || null,
          production_cap_override || null
        );
      });

      transaction();
      
      // Simulate probe completion
      setTimeout(() => {
        db.prepare(`
          UPDATE products SET status = 'active', current_phase = 'DISCOVER', probe_result = ? WHERE id = ?
        `).run(JSON.stringify({...mockProbe, completion_rate: 100}), id);
      }, 5000);
      
      const product = db.prepare("SELECT * FROM products WHERE id = ?").get(id);
      res.status(201).json(product);
    } catch (error: any) {
      res.status(400).json({ error: error.message });
    }
  });

  app.post("/api/products/:id/copy", (req, res) => {
    const { id } = req.params;
    try {
      const sourceProduct = db.prepare("SELECT * FROM products WHERE id = ?").get(id);
      const sourceProfile = db.prepare("SELECT * FROM input_profiles WHERE product_id = ?").get(id);
      
      if (!sourceProduct || !sourceProfile) {
        return res.status(404).json({ error: "Source product not found" });
      }

      const newId = crypto.randomUUID();
      const newProfileId = crypto.randomUUID();
      const newName = `${sourceProduct.name} (Copy)`;
      const newUrl = `${sourceProduct.url}/copy-${crypto.randomBytes(2).toString('hex')}`;

      const transaction = db.transaction(() => {
        db.prepare(`
          INSERT INTO products (id, name, url, status, current_phase, probe_result, connection_count)
          VALUES (?, ?, ?, 'intake', 'INTAKE', ?, ?)
        `).run(newId, newName, newUrl, sourceProduct.probe_result, sourceProduct.connection_count);

        db.prepare(`
          INSERT INTO input_profiles (
            id, product_id, product_url, target_regions, experiment_goal, 
            primary_conversion_event, language_override, brand_safety_policy, production_cap_override
          )
          VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
        `).run(
          newProfileId, 
          newId, 
          newUrl, 
          sourceProfile.target_regions, 
          sourceProfile.experiment_goal, 
          sourceProfile.primary_conversion_event,
          sourceProfile.language_override,
          sourceProfile.brand_safety_policy,
          sourceProfile.production_cap_override
        );
      });

      transaction();
      res.status(201).json({ id: newId });
    } catch (error: any) {
      res.status(400).json({ error: error.message });
    }
  });

  app.delete("/api/products/:id", (req, res) => {
    const { id } = req.params;
    try {
      const transaction = db.transaction(() => {
        db.prepare("DELETE FROM input_profiles WHERE product_id = ?").run(id);
        db.prepare("DELETE FROM products WHERE id = ?").run(id);
      });
      transaction();
      res.status(204).send();
    } catch (error: any) {
      res.status(400).json({ error: error.message });
    }
  });

  app.patch("/api/products/:id", (req, res) => {
    const { id } = req.params;
    const { input_profile } = req.body;
    
    try {
      if (input_profile) {
        db.prepare(`
          UPDATE input_profiles 
          SET language_override = ?, brand_safety_policy = ?, production_cap_override = ?, updated_at = CURRENT_TIMESTAMP
          WHERE product_id = ?
        `).run(
          input_profile.language_override || null,
          input_profile.brand_safety_policy || null,
          input_profile.production_cap_override || null,
          id
        );
      }
      
      db.prepare("UPDATE products SET updated_at = CURRENT_TIMESTAMP WHERE id = ?").run(id);
      
      res.json({ success: true });
    } catch (error: any) {
      res.status(400).json({ error: error.message });
    }
  });

  app.get("/api/products/:id/connections", (req, res) => {
    const { id } = req.params;
    const connections = db.prepare("SELECT * FROM data_connections WHERE product_id = ?").all(id);
    res.json(connections.map((c: any) => ({
      ...c,
      details: JSON.parse(c.details)
    })));
  });

  app.post("/api/products/:id/connections", (req, res) => {
    const { id } = req.params;
    const { source } = req.body;
    const connId = crypto.randomUUID();
    
    db.prepare(`
      INSERT INTO data_connections (id, product_id, source, status, health, details)
      VALUES (?, ?, ?, 'connected', 'Healthy', ?)
    `).run(
      connId,
      id,
      source,
      JSON.stringify({
        apiAlive: true,
        dataLatency: '5m',
        dataIntegrity: '100%',
        attribution: 'available'
      })
    );
    
    res.status(201).json({ id: connId });
  });

  app.post("/api/connections/:id/check", (req, res) => {
    const { id } = req.params;
    const details = {
      apiAlive: true,
      dataLatency: `${Math.floor(Math.random() * 15)}m`,
      dataIntegrity: `${95 + Math.floor(Math.random() * 5)}%`,
      attribution: 'available'
    };
    
    db.prepare(`
      UPDATE data_connections 
      SET health = 'Healthy', status = 'connected', details = ?, error_message = NULL, last_sync = CURRENT_TIMESTAMP, updated_at = CURRENT_TIMESTAMP
      WHERE id = ?
    `).run(JSON.stringify(details), id);
    
    res.json({ success: true, details });
  });

  app.delete("/api/connections/:id", (req, res) => {
    const { id } = req.params;
    db.prepare("DELETE FROM data_connections WHERE id = ?").run(id);
    res.status(204).send();
  });

  // Discovery Routes
  app.get("/api/products/:id/discovery/runs", (req, res) => {
    const { id } = req.params;
    const runs = db.prepare("SELECT * FROM discovery_runs WHERE product_id = ? ORDER BY created_at DESC").all(id);
    res.json(runs);
  });

  app.get("/api/products/:id/discovery/opportunities", (req, res) => {
    const { id } = req.params;
    const opps = db.prepare("SELECT * FROM opportunity_items WHERE product_id = ? ORDER BY created_at DESC").all(id);
    res.json(opps.map((o: any) => ({
      ...o,
      evidence: JSON.parse(o.evidence)
    })));
  });

  app.post("/api/products/:id/discovery/runs", (req, res) => {
    const { id } = req.params;
    const runId = crypto.randomUUID();
    
    // Create a running record
    db.prepare(`
      INSERT INTO discovery_runs (id, product_id, status, trigger_type)
      VALUES (?, ?, 'running', 'manual')
    `).run(runId, id);

    // Simulate discovery process
    setTimeout(() => {
      const mockOpps = [
        { 
          type: 'Keyword Cluster', 
          title: 'discovery.mock_data.opp1.title', 
          priority: 'High', 
          intent: 'Informational',
          volume: '45k/mo',
          cpc: '$1,200/mo',
          why: 'discovery.mock_data.opp1.why',
          evidence: [
            { step: 'Data Source', detail: 'discovery.mock_data.opp1.ev1' },
            { step: 'Analysis', detail: 'discovery.mock_data.opp1.ev2' },
            { step: 'Calculation', detail: 'discovery.mock_data.opp1.ev3' }
          ]
        },
        { 
          type: 'Competitor Gap', 
          title: 'discovery.mock_data.opp2.title', 
          priority: 'Medium', 
          intent: 'Comparison',
          volume: 'Gap: 12%',
          cpc: '$850/mo',
          why: 'discovery.mock_data.opp2.why',
          evidence: [
            { step: 'Data Source', detail: 'discovery.mock_data.opp2.ev1' },
            { step: 'Analysis', detail: 'discovery.mock_data.opp2.ev2' },
            { step: 'Calculation', detail: 'discovery.mock_data.opp2.ev3' }
          ]
        }
      ];

      mockOpps.forEach(opp => {
        db.prepare(`
          INSERT INTO opportunity_items (id, product_id, run_id, type, title, priority, intent, volume, cpc, why, evidence)
          VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        `).run(
          crypto.randomUUID(),
          id,
          runId,
          opp.type,
          opp.title,
          opp.priority,
          opp.intent,
          opp.volume,
          opp.cpc,
          opp.why,
          JSON.stringify(opp.evidence)
        );
      });

      db.prepare(`
        UPDATE discovery_runs SET status = 'completed', found_count = ? WHERE id = ?
      `).run(mockOpps.length, runId);
    }, 3000);

    res.status(201).json({ id: runId });
  });

  app.get("/api/dashboard/stats", (req, res) => {
    const stats = {
      activeProducts: db.prepare("SELECT COUNT(*) as count FROM products WHERE status = 'active'").get().count,
      approvedStrategies: 12, // Mock
      completedExecutions: 142, // Mock
      activeStrategies: 8, // Mock
    };
    res.json(stats);
  });

  app.get("/api/alerts", (req, res) => {
    res.json([
      { 
        id: '1', 
        type: 'error', 
        titleKey: 'dashboard.alerts.alert1.title', 
        descriptionKey: 'dashboard.alerts.alert1.description', 
        target: 'connections',
        actionLabelKey: 'dashboard.alerts.alert1.action'
      },
      { 
        id: '2', 
        type: 'warning', 
        titleKey: 'dashboard.alerts.alert2.title', 
        descriptionKey: 'dashboard.alerts.alert2.description', 
        target: 'compliance',
        actionLabelKey: 'dashboard.alerts.alert2.action'
      },
      { 
        id: '3', 
        type: 'info', 
        titleKey: 'dashboard.alerts.alert3.title', 
        descriptionKey: 'dashboard.alerts.alert3.description', 
        target: 'discovery',
        actionLabelKey: 'dashboard.alerts.alert3.action'
      }
    ]);
  });

  app.get("/api/strategies", (req, res) => {
    // Mock strategies
    res.json([
      { id: '1', nameKey: 'dashboard.strategies.strat1.name', score: 85, status: 'active', lastDecisionKey: 'dashboard.strategies.strat1.decision' },
      { id: '2', nameKey: 'dashboard.strategies.strat2.name', score: 72, status: 'pending', lastDecisionKey: 'dashboard.strategies.strat2.decision' },
      { id: '3', nameKey: 'dashboard.strategies.strat3.name', score: 92, status: 'paused', lastDecisionKey: 'dashboard.strategies.strat3.decision' },
      { id: '4', nameKey: 'dashboard.strategies.strat4.name', score: 45, status: 'error', lastDecisionKey: 'dashboard.strategies.strat4.decision' },
    ]);
  });

  app.get("/api/decisions", (req, res) => {
    // Mock decisions
    res.json([
      { id: '1', type: 'success', labelKey: 'dashboard.decisions.dec1.label', descriptionKey: 'dashboard.decisions.dec1.description', timestamp: '2h ago', user: 'Auto-Pilot' },
      { id: '2', type: 'log', labelKey: 'dashboard.decisions.dec2.label', descriptionKey: 'dashboard.decisions.dec2.description', timestamp: '5h ago', user: 'System' },
      { id: '3', type: 'alert', labelKey: 'dashboard.decisions.dec3.label', descriptionKey: 'dashboard.decisions.dec3.description', timestamp: '1d ago', user: 'Risk Guard' },
    ]);
  });

  // Vite middleware for development
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    app.use(express.static(path.join(__dirname, "dist")));
    app.get("*", (req, res) => {
      res.sendFile(path.join(__dirname, "dist/index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();

