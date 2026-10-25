import { Track, ProblemStatement } from '../types';

export interface HackathonConfig {
  hackathonName: string;
  tagline: string;
  edition?: string;
  collegeName: string;
  departmentName: string;
  year: number;
  maxPptSizeBytes: number; // 25 MB
  splineSceneUrl: string;
  eventDates: {
    registrationClose: string;
    hackathonStart: string;
    hackathonEnd: string;
  };
  contactEmail: string;
  /** Google Form where teams tell the organizers which problem they picked. Empty = button hidden. */
  choiceFormUrl: string;
  tracks: Track[];
  problemStatements: ProblemStatement[];
}

export const HACKATHON_CONFIG: HackathonConfig = {
  hackathonName: "CHAKRAVYUH HACKATHON",
  tagline: "Enter the Ancient Labyrinth of Innovation",
  edition: "VIT-AP EDITION",
  collegeName: "VIT-AP University",
  departmentName: "School of Computer Science and Engineering",
  year: 2026,
  maxPptSizeBytes: 25 * 1024 * 1024, // 25 Megabytes
  splineSceneUrl: import.meta.env.VITE_SPLINE_SCENE_URL || "https://prod.spline.design/6Wq1Q7YGyM-iab9i/scene.splinecode",
  eventDates: {
    registrationClose: "2026-11-15T23:59:59Z",
    hackathonStart: "2026-11-20T09:00:00Z",
    hackathonEnd: "2026-11-22T18:00:00Z",
  },
  contactEmail: "hackathon@vitap.ac.in",
  // Paste your Google Form link here, or set VITE_CHOICE_FORM_URL in the hosting environment.
  choiceFormUrl: import.meta.env.VITE_CHOICE_FORM_URL || "",
  
  tracks: [
    {
      id: "track-cybersecurity-blockchain",
      name: "Cybersecurity & Blockchain",
      officialTitle: "Cybersecurity & Blockchain",
      slug: "cybersecurity-blockchain",
      themeKey: "agni",
      accentColor: "#E05A47",
      secondaryColor: "#F97316",
      glowColor: "rgba(224, 90, 71, 0.45)",
      description: "Secure digital systems and build trust through decentralized technology.",
      motto: "Defending Digital Frontiers with Cryptographic Security and Decentralized Trust",
      iconName: "ShieldCheck",
      displayOrder: 1,
    },
    {
      id: "track-space-technology",
      name: "Space Technology",
      officialTitle: "Space Technology",
      slug: "space-technology",
      themeKey: "vayu",
      accentColor: "#38BDF8",
      secondaryColor: "#0284C7",
      glowColor: "rgba(56, 189, 248, 0.45)",
      description: "Innovate in satellites, space exploration, and aerospace systems.",
      motto: "Advancing Satellite Intelligence, Orbital Telemetry and Aerospace Systems",
      iconName: "Satellite",
      displayOrder: 2,
    },
    {
      id: "track-quantum-computing",
      name: "Quantum Computing",
      officialTitle: "Quantum Computing",
      slug: "quantum-computing",
      themeKey: "vajra",
      accentColor: "#8B5CF6",
      secondaryColor: "#A855F7",
      glowColor: "rgba(139, 92, 246, 0.45)",
      description: "Explore quantum algorithms, simulations, and next-generation computing.",
      motto: "Unlocking Quantum Coherence, Superposition and Next-Gen Algorithms",
      iconName: "Atom",
      displayOrder: 3,
    },
    {
      id: "track-fintech",
      name: "FinTech",
      officialTitle: "FinTech",
      slug: "fintech",
      themeKey: "surya",
      accentColor: "#F59E0B",
      secondaryColor: "#D97706",
      glowColor: "rgba(245, 158, 11, 0.35)",
      description: "Rethink digital payments, financial access, and intelligent financial services.",
      motto: "Revolutionizing Digital Payments, Smart Ledgers and Intelligent Finance",
      iconName: "Wallet",
      displayOrder: 4,
    },
    {
      id: "track-energy-sustainability",
      name: "Energy & Sustainability",
      officialTitle: "Energy & Sustainability",
      slug: "energy-sustainability",
      themeKey: "vanam",
      accentColor: "#10B981",
      secondaryColor: "#34D399",
      glowColor: "rgba(16, 185, 129, 0.45)",
      description: "Develop clean energy solutions and technologies for a sustainable future.",
      motto: "Powering Clean Energy Grids and Climate-Resilient Technologies",
      iconName: "Zap",
      displayOrder: 5,
    },
  ],

  problemStatements: [
    // =========================================================================
    // THEME 1: CYBERSECURITY AND BLOCKCHAIN (Codes: CB-01 to CB-10)
    // =========================================================================
    {
      id: "prob-cb-01",
      trackId: "track-cybersecurity-blockchain",
      problemCode: "CB-01",
      title: "BridgeWatch: Cross-Chain Bridge Attack Early-Warning System",
      difficulty: "Flagship",
      displayOrder: 1,
      objective: "Detect bridge exploits and abnormal liquidity drains minutes before funds are fully lost, and automatically trigger a protective pause.",
      summary: "Real-time monitor that learns normal cross-chain transfer behaviour, flags anomalies (sudden large mints, validator-key misuse, withdrawal bursts), scores risk per bridge, and triggers an automated circuit-breaker.",
      fullDescription: "Bridge hacks are among the largest thefts in crypto. Teams build a real-time monitor that learns normal cross-chain transfer behaviour, flags anomalies (sudden large mints, validator-key misuse, unusual withdrawal bursts), scores risk per bridge, and fires an alert or a circuit-breaker. Evaluation replays historical attacks and measures how early each one is caught.",
      expectedOutcomes: [
        "Live dashboard with a risk score per bridge",
        "Detection lead-time report across historical incidents",
        "False-alarm analysis on normal traffic",
        "Working smart-contract circuit-breaker that pauses withdrawals in a forked-chain demo"
      ],
      keyRequirements: [
        "Ingest on-chain events for at least one bridge",
        "Baseline model running with sub-30 second alert latency",
        "Historical attack replayed on a local fork (Foundry/Hardhat)",
        "Automated pause mechanism verification"
      ],
      suggestedTech: ["Python", "Web3.py", "The Graph / subgraphs", "PyTorch (GNN / time-series)", "Kafka", "Foundry", "Solidity", "Grafana"],
      datasets: [
        { name: "DeFiHackLabs (Reproduced Attacks)", url: "https://github.com/SunWeb3Sec/DeFiHackLabs" },
        { name: "Ethereum Public Data on BigQuery", url: "https://cloud.google.com/blockchain-analytics/docs/example-queries" },
        { name: "Etherscan Labelled Addresses", url: "https://github.com/brianleect/etherscan-labels" }
      ]
    },
    {
      id: "prob-cb-02",
      trackId: "track-cybersecurity-blockchain",
      problemCode: "CB-02",
      title: "TrustMesh: Privacy-Preserving Decentralised Threat Intelligence Sharing",
      difficulty: "Flagship",
      displayOrder: 2,
      objective: "Let competing organisations share attack indicators and model updates without exposing private data or relying on a central authority.",
      summary: "Combines federated learning with a blockchain registry that records contributions, verifies indicator quality, and rewards honest sharers while surviving poisoned or adversarial model updates.",
      fullDescription: "Participants combine federated learning with a blockchain registry that records contributions, verifies indicator quality and rewards honest sharers. The system must survive poisoned or fake contributions from malicious members across multiple simulated enterprise nodes.",
      expectedOutcomes: [
        "Multi-node demo with 4+ simulated organisations",
        "Global detection model that beats every single organisation's local model",
        "On-chain contribution and reputation ledger",
        "Demonstrated defence against model-poisoning attacks"
      ],
      keyRequirements: [
        "Three or more nodes training federated rounds",
        "Contributions logged to a local or test chain",
        "Differential privacy noise bounding (Opacus)",
        "Reproducible Docker Compose environment"
      ],
      suggestedTech: ["Python", "Flower / PySyft", "Hyperledger Fabric / Ethereum testnet", "Opacus (Differential Privacy)", "MISP", "Docker"],
      datasets: [
        { name: "CIC-IDS2017 Dataset", url: "https://www.unb.ca/cic/datasets/ids-2017.html" },
        { name: "UNSW-NB15", url: "https://research.unsw.edu.au/projects/unsw-nb15-dataset" },
        { name: "abuse.ch URLhaus API", url: "https://urlhaus.abuse.ch/api/" },
        { name: "MISP Open Feeds", url: "https://www.misp-project.org/feeds/" }
      ]
    },
    {
      id: "prob-cb-03",
      trackId: "track-cybersecurity-blockchain",
      problemCode: "CB-03",
      title: "ChainOfCustody: Tamper-Proof Digital Forensics Ledger",
      difficulty: "Hard",
      displayOrder: 3,
      objective: "Make forensic evidence legally defensible by proving logs and artefacts were never altered between collection and court presentation.",
      summary: "Hash security logs at ingestion, anchor Merkle roots on a blockchain, and record every access or transfer of evidence as an on-chain event capable of catching single-byte mutations.",
      fullDescription: "Hash security logs at ingestion, anchor Merkle roots on a blockchain, and record every access or transfer of evidence as an on-chain event. The verifier must detect a single-byte change in a large log set, and teams simulate an insider rewriting logs after an incident.",
      expectedOutcomes: [
        "Working evidence vault with tamper-detection demo",
        "Who-touched-what audit timeline and access logs",
        "Gas-versus-batch-size cost analysis",
        "Exportable court-ready integrity report"
      ],
      keyRequirements: [
        "Log ingest with SHA-256 / Keccak-256 Merkle root computation",
        "Merkle root anchoring on smart contract",
        "Instant verifier rejecting single-byte altered files"
      ],
      suggestedTech: ["Solidity", "Hyperledger Fabric", "IPFS", "Merkle Trees", "Python", "Elasticsearch / OpenSearch", "Web3.js", "React"],
      datasets: [
        { name: "Splunk BOTS v3 (Logs as Evidence)", url: "https://github.com/splunk/botsv3" },
        { name: "OTRF Security Datasets", url: "https://github.com/OTRF/Security-Datasets" },
        { name: "Ethereum BigQuery Anchoring Benchmarks", url: "https://cloud.google.com/blockchain-analytics/docs/example-queries" }
      ]
    },
    {
      id: "prob-cb-04",
      trackId: "track-cybersecurity-blockchain",
      problemCode: "CB-04",
      title: "PackageGuard: Software Supply-Chain Attack Detector with On-Chain Attestation",
      difficulty: "Hard",
      displayOrder: 4,
      objective: "Catch malicious npm and PyPI packages before they enter a build, and attest cryptographically that an artefact is clean.",
      summary: "Analyse package metadata, install scripts and code behaviour to detect typosquatting, dependency confusion and backdoors, storing signed SBOM attestations on-chain.",
      fullDescription: "Analyse package metadata, install scripts and code behaviour to detect typosquatting, dependency confusion and backdoors. Verified builds receive a signed attestation recorded on a blockchain so downstream users can verify provenance without trusting centralized registries.",
      expectedOutcomes: [
        "CI plugin that blocks a malicious package in a demo project",
        "Typosquat and behaviour-detection benchmark",
        "SBOM with on-chain attestation",
        "Verifier that rejects a tampered artefact"
      ],
      keyRequirements: [
        "Static code AST analysis and install script scanner",
        "Typosquatting Levenshtein distance check on popular registry names",
        "CycloneDX / SPDX SBOM generation and cryptographic signing"
      ],
      suggestedTech: ["Python", "AST analysis", "Semgrep", "Sigstore / in-toto", "Solidity / Fabric", "GitHub Actions", "CycloneDX"],
      datasets: [
        { name: "DataDog Malicious Packages Dataset", url: "https://github.com/DataDog/malicious-software-packages-dataset" },
        { name: "OSV Vulnerability Database", url: "https://osv.dev" },
        { name: "deps.dev Package Metadata", url: "https://deps.dev" },
        { name: "Tranco List (Typosquat Baseline)", url: "https://tranco-list.eu" }
      ]
    },
    {
      id: "prob-cb-05",
      trackId: "track-cybersecurity-blockchain",
      problemCode: "CB-05",
      title: "AgentShield: Permission Firewall and Audit Trail for Autonomous AI Agents",
      difficulty: "Hard",
      displayOrder: 5,
      objective: "Prevent tool-using AI agents from being hijacked by prompt injection and from taking unauthorised external actions.",
      summary: "A policy enforcement and guardrail firewall situated between LLM agents and system execution tools (email, files, payments, shell), enforcing least-privilege and logging tamper-evident audit trails.",
      fullDescription: "Build a policy layer between an LLM agent and its tools (email, files, payments, APIs) that enforces least privilege, detects injected instructions in retrieved content, requires human approval for risky actions, and logs every decision to an immutable audit trail.",
      expectedOutcomes: [
        "Drop-in firewall showing a measurable drop in attack success rate",
        "Minimal loss in agent task completion benchmarks",
        "Risk-tiered approval workflow for elevated permissions",
        "Tamper-evident immutable action log"
      ],
      keyRequirements: [
        "Working agent harness with tool policy checks",
        "Prompt injection classification filter (indirect & direct)",
        "Audit trail with cryptographic hashing for every tool call"
      ],
      suggestedTech: ["Python", "LangChain / AutoGen", "Open Policy Agent (OPA)", "Guardrails AI", "FastAPI", "Vector DB"],
      datasets: [
        { name: "AgentDojo Benchmark", url: "https://github.com/ethz-spylab/agentdojo" },
        { name: "InjecAgent Benchmark", url: "https://github.com/uiuc-kang-lab/InjecAgent" },
        { name: "JailbreakBench", url: "https://github.com/JailbreakBench/jailbreakbench" }
      ]
    },
    {
      id: "prob-cb-06",
      trackId: "track-cybersecurity-blockchain",
      problemCode: "CB-06",
      title: "PhishLens: Malicious URL Detector",
      difficulty: "Easy",
      displayOrder: 6,
      objective: "Classify URLs as phishing or benign using lexical, structural, and domain registration features.",
      summary: "Extract features like URL length, entropy, special characters, subdomain depth and domain age to train a high-precision classifier exposed via a web interface.",
      fullDescription: "Extract features such as URL length, special characters, subdomain depth and domain age, train a classifier, and expose it through a small web page or browser extension with transparent explanation metrics.",
      expectedOutcomes: [
        "Working URL checker with verdict, confidence score, and top explanations",
        "Accuracy, precision and recall metrics reported",
        "Detection of lookalike and homograph domains (e.g. paypa1.com)"
      ],
      keyRequirements: [
        "Feature extraction pipeline for lexical & DNS metrics",
        "Model training on realistic benign-to-phishing ratios",
        "Fast response time (< 100ms per URL)"
      ],
      suggestedTech: ["Python", "scikit-learn", "FastAPI", "React", "Chrome Extension API"],
      datasets: [
        { name: "PhishTank Active Phishing Feeds", url: "https://phishtank.org/developer_info.php" },
        { name: "URLhaus Malware/Phishing API", url: "https://urlhaus.abuse.ch/api/" },
        { name: "Tranco Top 1M Sites (Benign)", url: "https://tranco-list.eu" }
      ]
    },
    {
      id: "prob-cb-07",
      trackId: "track-cybersecurity-blockchain",
      problemCode: "CB-07",
      title: "SmishShield: SMS and Email Scam Classifier",
      difficulty: "Easy",
      displayOrder: 7,
      objective: "Detect scam and spam messages across SMS and email using text classification and explainable NLP.",
      summary: "Preprocess message texts, train lightweight linear models or small transformers, and highlight scam trigger words with confusion matrix evaluation.",
      fullDescription: "Preprocess message text, train a model (TF-IDF with a linear model, or a small transformer), and build a simple interface that explains which words or urgency phrases triggered the alert.",
      expectedOutcomes: [
        "Demo app that scores pasted messages in real time",
        "Highlights suspicious phrases and urgency signals",
        "Reports F1 score, ROC curve, and confusion matrix"
      ],
      keyRequirements: [
        "NLP text cleaning, tokenization, and vectorization",
        "Explainable score breakdown for end users",
        "Support for deceptive link recognition"
      ],
      suggestedTech: ["Python", "scikit-learn", "Hugging Face Transformers", "Streamlit", "React", "Tailwind CSS"],
      datasets: [
        { name: "UCI SMS Spam Collection", url: "https://archive.ics.uci.edu/dataset/228/sms+spam+collection" },
        { name: "Nazario Phishing Email Corpus", url: "https://monkey.org/~jose/phishing/" }
      ]
    },
    {
      id: "prob-cb-08",
      trackId: "track-cybersecurity-blockchain",
      problemCode: "CB-08",
      title: "LogSentinel: SSH Brute-Force Detector from Server Logs",
      difficulty: "Easy",
      displayOrder: 8,
      objective: "Detect brute-force and suspicious authentication anomalies in system logs.",
      summary: "Parse authentication logs, extract per-IP failure velocity and user diversity, flag attackers with rule-ML hybrid engines, and export automatic blocklists.",
      fullDescription: "Parse authentication logs, extract per-IP features (failed attempts, rate, user diversity), flag attackers using rules or an anomaly model, and visualise results on an interactive timeline dashboard.",
      expectedOutcomes: [
        "Dashboard listing top suspicious IPs with timelines",
        "Automatic firewall block-list / fail2ban rule export",
        "GeoIP map overlay and email/Telegram alert integration"
      ],
      keyRequirements: [
        "Log parser supporting standard Linux auth.log / OpenSSH formats",
        "Sliding window anomaly scoring",
        "Explainable detection rationale"
      ],
      suggestedTech: ["Python", "Pandas", "scikit-learn (Isolation Forest)", "Streamlit / Grafana", "FastAPI"],
      datasets: [
        { name: "LogHub OpenSSH Collections", url: "https://github.com/logpai/loghub" }
      ]
    },
    {
      id: "prob-cb-09",
      trackId: "track-cybersecurity-blockchain",
      problemCode: "CB-09",
      title: "PEScan Lite: Static Malware Classifier for Windows Executables",
      difficulty: "Easy",
      displayOrder: 9,
      objective: "Classify Windows PE executables as malicious or benign using static header and section features.",
      summary: "Leverage EMBER pre-extracted features to train gradient-boosted decision trees, compare against baseline heuristics, and evaluate feature importance via SHAP.",
      fullDescription: "Use pre-extracted EMBER features to train a gradient-boosted model, then compare against a simple baseline and show feature importance without needing to execute untrusted binaries.",
      expectedOutcomes: [
        "Trained model with AUC, ROC curve, and precision-recall benchmarks",
        "SHAP waterfall charts revealing top malicious indicators",
        "Robustness test showing sensitivity to minor feature shifts"
      ],
      keyRequirements: [
        "Gradient boosting pipeline (LightGBM/XGBoost)",
        "Static feature importance visualizer",
        "Evaluation on held-out test splits"
      ],
      suggestedTech: ["Python", "LightGBM / XGBoost", "Pandas", "SHAP", "Matplotlib / Streamlit"],
      datasets: [
        { name: "EMBER Static Malware Dataset", url: "https://github.com/elastic/ember" },
        { name: "MalwareBazaar Reference Samples", url: "https://bazaar.abuse.ch/browse/" }
      ]
    },
    {
      id: "prob-cb-10",
      trackId: "track-cybersecurity-blockchain",
      problemCode: "CB-10",
      title: "CVE Priority Explorer: Real-World Risk Vulnerability Prioritizer",
      difficulty: "Easy",
      displayOrder: 10,
      objective: "Rank software vulnerabilities by real-world exploitability and exposure instead of relying on CVSS scores alone.",
      summary: "Merge National Vulnerability Database CVE records with EPSS exploit probabilities and CISA KEV catalogs to produce a context-aware remediation roadmap.",
      fullDescription: "Merge CVE records with exploit-prediction scores and the known-exploited list, create a priority score, and let users filter by vendor or product to fix the most dangerous flaws first.",
      expectedOutcomes: [
        "Interactive table and charts ranking top-risk CVEs",
        "Clear explanation of why priority score differs from base CVSS",
        "Custom software inventory upload with personalized fix list"
      ],
      keyRequirements: [
        "Automated sync with NVD API and CISA KEV catalog",
        "EPSS probability weighting engine",
        "Search and filter by vendor, technology, and attack vector"
      ],
      suggestedTech: ["Python", "Pandas", "NVD API", "FastAPI", "React", "Tailwind CSS"],
      datasets: [
        { name: "NVD Vulnerability Data Feeds", url: "https://nvd.nist.gov/vuln/data-feeds" },
        { name: "CISA Known Exploited Vulnerabilities (KEV)", url: "https://www.cisa.gov/known-exploited-vulnerabilities-catalog" },
        { name: "EPSS Exploit Prediction Scores", url: "https://www.first.org/epss/data" }
      ]
    },

    // =========================================================================
    // THEME 2: SPACE TECHNOLOGY (Codes: ST-01 to ST-10)
    // =========================================================================
    {
      id: "prob-st-01",
      trackId: "track-space-technology",
      problemCode: "ST-01",
      title: "Building and Road Extraction from Satellite Imagery",
      difficulty: "Easy",
      displayOrder: 1,
      objective: "Train a segmentation model that extracts building footprints or road vectors from satellite imagery and evaluate domain transfer across Indian regions.",
      summary: "Deep learning segmentation pipeline converting high-resolution satellite tiles into vector polygons for urban planning, disaster relief, and infrastructure tracking.",
      fullDescription: "Maps of buildings and roads are incomplete in many parts of India, especially villages and informal settlements. Train a segmentation model that extracts building footprints (or roads) from satellite imagery, and test how well it carries over to a different city or region.",
      expectedOutcomes: [
        "Pixel-level building or road segmentation masks",
        "IoU and F1 score evaluations on held-out regional cities",
        "Clean vectorized GIS polygons (GeoJSON/Shapefile)",
        "Detailed error analysis on shadows, dense roof structures, and tree canopies"
      ],
      keyRequirements: [
        "Tiling pipeline for large multispectral images",
        "Pretrained U-Net / DeepLabV3+ with Dice + BCE loss",
        "Post-processing vectorization into QGIS-compatible polygons"
      ],
      suggestedTech: ["Python", "PyTorch", "segmentation_models_pytorch", "Rasterio", "GeoPandas", "Shapely", "QGIS"],
      datasets: [
        { name: "SpaceNet Building & Road Datasets", url: "https://spacenet.ai" },
        { name: "Google Open Buildings India", url: "https://sites.research.google/open-buildings/" },
        { name: "Inria Aerial Image Labeling", url: "https://project.inria.fr/aerialimagelabeling/" },
        { name: "DeepGlobe Road Extraction", url: "https://www.kaggle.com/datasets/balraj98/deepglobe-road-extraction-dataset" }
      ]
    },
    {
      id: "prob-st-02",
      trackId: "track-space-technology",
      problemCode: "ST-02",
      title: "Forest Cover Change and Deforestation Detection",
      difficulty: "Easy",
      displayOrder: 2,
      objective: "Detect and quantify forest loss in chosen Indian districts between two or more time periods, reporting area lost with an honest estimate of accuracy.",
      summary: "Analyze multi-temporal Sentinel-2 and Landsat composites to distinguish genuine canopy loss from seasonal cycles, agriculture, and cloud artifacts.",
      fullDescription: "India’s forests are under pressure from mining, construction, fire and clearing, and official forest surveys come only every two years. Satellites provide frequent imagery, so change can be detected much sooner. The challenge is separating real forest loss from seasonal changes, clouds and farming cycles.",
      expectedOutcomes: [
        "Forest loss map for a chosen district or protected wildlife reserve",
        "Year-over-year hectarage loss statistics",
        "Accuracy benchmark against reference surveys (precision and recall)",
        "Prioritized ranking of deforestation hotspot coordinates"
      ],
      keyRequirements: [
        "Cloud-free Sentinel-2 composite generation via Google Earth Engine",
        "Vegetation index difference computation (NDVI, NBR)",
        "Supervised Random Forest or U-Net change classifier"
      ],
      suggestedTech: ["Python", "Google Earth Engine (GEE)", "Rasterio", "GeoPandas", "scikit-learn", "Plotly"],
      datasets: [
        { name: "Hansen Global Forest Change", url: "https://glad.earthengine.app/view/global-forest-change" },
        { name: "Copernicus Sentinel-2 DataSpace", url: "https://dataspace.copernicus.eu" },
        { name: "Global Forest Watch", url: "https://www.globalforestwatch.org" },
        { name: "Forest Survey of India (FSI)", url: "https://fsi.nic.in" }
      ]
    },
    {
      id: "prob-st-03",
      trackId: "track-space-technology",
      problemCode: "ST-03",
      title: "24-Hour Air Quality Forecasting for an Indian City",
      difficulty: "Easy",
      displayOrder: 3,
      objective: "Forecast PM2.5 concentrations for the next 24 hours for city stations, outperforming persistence baselines especially during severe winter inversions.",
      summary: "Time-series and gradient-boosted forecasting integrating CPCB ground sensors, meteorological weather reanalysis, and satellite thermal fire counts.",
      fullDescription: "Cities like Delhi, Lucknow and Kolkata have severe pollution episodes, especially in winter. People need a forecast, not just today’s reading, so they can plan school closures, travel and health precautions. Pollution depends on weather, season, crop-burning smoke and local sources, which makes forecasting a good time-series problem.",
      expectedOutcomes: [
        "Hourly PM2.5 forecast with calibrated prediction intervals",
        "Separated evaluation on normal versus severe hazardous pollution days",
        "Feature importance breakdown (wind, humidity, boundary layer, FIRMS fires)",
        "Actionable next-day public health alert advisory"
      ],
      keyRequirements: [
        "Missing-value interpolation and lag-feature engineering",
        "Time-based evaluation split to prevent future data leakage",
        "Comparison against persistence and Prophet baselines"
      ],
      suggestedTech: ["Python", "Pandas", "LightGBM / XGBoost", "PyTorch (LSTM/Transformer)", "SHAP", "Streamlit"],
      datasets: [
        { name: "CPCB Air Quality Portal", url: "https://cpcb.nic.in" },
        { name: "OpenAQ Air Quality Database", url: "https://openaq.org" },
        { name: "NASA FIRMS Active Fire Satellite Data", url: "https://firms.modaps.eosdis.nasa.gov" },
        { name: "Open-Meteo Historical Weather API", url: "https://open-meteo.com" }
      ]
    },
    {
      id: "prob-st-04",
      trackId: "track-space-technology",
      problemCode: "ST-04",
      title: "Reservoir and Lake Water-Level Monitoring from Satellite Data",
      difficulty: "Easy",
      displayOrder: 4,
      objective: "Track surface-area change for Indian reservoirs over several years and estimate storage trends, validating against official hydrological bulletins.",
      summary: "Multi-sensor optical (Sentinel-2) and SAR (Sentinel-1) surface water extraction pipeline converting lake boundaries into volumetric storage models.",
      fullDescription: "India depends on reservoirs and lakes for drinking water, irrigation and power, but water-level data is often delayed or not public. Satellites can measure how a lake’s surface area changes over time, which tracks storage. The practical challenge is separating real water from shadows and clouds, and turning area into a usable storage estimate.",
      expectedOutcomes: [
        "Monthly water-area time series extracted across monsoon and drought cycles",
        "Cloud-penetrating SAR analysis during overcast monsoon months",
        "Area-to-storage volume estimation using DEM elevation curves",
        "Statistical validation against Central Water Commission bulletins"
      ],
      keyRequirements: [
        "Water indices extraction (NDWI, MNDWI) with Otsu adaptive thresholding",
        "Sentinel-1 SAR cross-polarization backscatter thresholding",
        "Area-elevation curve integration using Copernicus DEM"
      ],
      suggestedTech: ["Python", "Google Earth Engine", "Rasterio", "GeoPandas", "Plotly", "Copernicus DEM"],
      datasets: [
        { name: "Copernicus DataSpace (Sentinel-1 & Sentinel-2)", url: "https://dataspace.copernicus.eu" },
        { name: "ASF Vertex (SAR Data)", url: "https://search.asf.alaska.edu" },
        { name: "JRC Global Surface Water", url: "https://global-surface-water.appspot.com" },
        { name: "India-WRIS Water Resources Information", url: "https://indiawris.gov.in" }
      ]
    },
    {
      id: "prob-st-05",
      trackId: "track-space-technology",
      problemCode: "ST-05",
      title: "Rooftop Solar Potential Mapping for an Indian City",
      difficulty: "Easy",
      displayOrder: 5,
      objective: "Estimate rooftop solar potential for a municipal ward, ranking buildings by usable area, irradiance, and estimated carbon offset.",
      summary: "Combine building footprints, LiDAR/DEM elevation, and NASA solar radiation physics to create an interactive rooftop solar savings calculator.",
      fullDescription: "India has ambitious rooftop solar targets, but most homeowners and municipalities do not know how much usable roof area exists or what it could generate. Combine building footprints, sunlight data and simple solar physics to rank wards and calculate energy output.",
      expectedOutcomes: [
        "Building footprint layer with usable roof area factoring tilt and shading",
        "Annual kilowatt-hour generation estimate per ward using irradiance data",
        "Ranked list of highest-potential buildings and municipal institutions",
        "Interactive web map with 'enter your roof area' generation calculator"
      ],
      keyRequirements: [
        "Building polygon ingestion and obstruction filtering",
        "Solar irradiance physics model via pvlib",
        "Ward-level spatial aggregation and carbon offset metrics"
      ],
      suggestedTech: ["Python", "GeoPandas", "Shapely", "pvlib", "Rasterio", "Folium / Mapbox", "Streamlit"],
      datasets: [
        { name: "Google Open Buildings India", url: "https://sites.research.google/open-buildings/" },
        { name: "NASA POWER Solar Radiation API", url: "https://power.larc.nasa.gov" },
        { name: "Global Solar Atlas", url: "https://globalsolaratlas.info" },
        { name: "PVGIS Photovoltaic Tool", url: "https://re.jrc.ec.europa.eu/pvg_tools/en/" }
      ]
    },
    {
      id: "prob-st-06",
      trackId: "track-space-technology",
      problemCode: "ST-06",
      title: "Dancing with the SARs: Web-Based Radar Surface-Change Monitoring (NISAR)",
      difficulty: "Hard",
      displayOrder: 6,
      objective: "Develop an interactive web application that uses radar satellite imagery from NASA-ISRO's NISAR mission (or Sentinel-1) to detect, track, and visualize surface changes.",
      summary: "Process complex Synthetic Aperture Radar (SAR) backscatter observations to detect floods, deforestation, and structural surface shifts with automated change-detection mapping.",
      fullDescription: "Earth's surface is constantly changing due to natural processes and human activities. The objective is to develop an interactive web application using radar satellite imagery from the NASA–ISRO NISAR mission to detect and visualize surface alterations (such as flood inundation) without requiring manual radar interpretation.",
      expectedOutcomes: [
        "Functional web dashboard with before-and-after satellite image comparison",
        "Interactive map visualizing detected SAR backscatter changes",
        "Area-based statistics showing square kilometers affected",
        "Downloadable geo-analytical report with timestamps and coordinates"
      ],
      keyRequirements: [
        "SAR speckle filtering, radiometric calibration, and terrain correction",
        "Log-ratio or coherent change-detection algorithm",
        "Distinction between detected anomalies and verified ground events"
      ],
      suggestedTech: ["Python", "Rasterio", "SNAP / ESA Toolboxes", "PostGIS", "FastAPI", "React", "Leaflet / OpenLayers"],
      datasets: [
        { name: "ISRO Bhoonidhi Remote Sensing Data", url: "https://bhoonidhi.nrsc.gov.in/" },
        { name: "NASA Earthdata Search", url: "https://search.earthdata.nasa.gov/" },
        { name: "ASF Vertex SAR Hub", url: "https://search.asf.alaska.edu/" },
        { name: "Copernicus DataSpace Sentinel-1", url: "https://dataspace.copernicus.eu/" }
      ]
    },
    {
      id: "prob-st-07",
      trackId: "track-space-technology",
      problemCode: "ST-07",
      title: "Methane Super-Emitter Detection and Attribution from Satellite Data",
      difficulty: "Hard",
      displayOrder: 7,
      objective: "Detect concentrated methane plumes in satellite spectral imagery, quantify emission flux rates, and attribute them to suspected industrial facilities.",
      summary: "Apply matched-filter spectral retrieval on Sentinel-5P, EMIT, and Sentinel-2 SWIR bands to localize industrial methane leaks and compute emission tonnage.",
      fullDescription: "A small number of super-emitters (leaking oil and gas sites, landfills, coal mines) produce a large share of methane emissions. Satellites can see plumes, but weak signals, noise, and source attribution make detection hard. Detect plumes, estimate emission rates, and attribute them to likely facilities.",
      expectedOutcomes: [
        "Plume detection pipeline with quantified low false-positive rate",
        "Mass-balance emission rate estimates (kg/hr) with uncertainty bounds",
        "Ranked attribution list linking detected plumes to known industrial assets",
        "Reproducible spectral processing and verification notebook"
      ],
      keyRequirements: [
        "SWIR / TROPOMI fractional absorption retrieval",
        "Plume segmentation with surface albedo artifact filtering",
        "Wind-field flux integration using ERA5 reanalysis"
      ],
      suggestedTech: ["Python", "GeoPandas", "U-Net", "PyTorch", "xarray", "Google Earth Engine"],
      datasets: [
        { name: "Sentinel-5P TROPOMI Methane Products", url: "https://dataspace.copernicus.eu" },
        { name: "NASA EMIT Imaging Spectrometer", url: "https://earth.jpl.nasa.gov/emit/" },
        { name: "Meter-ML Labeled Methane Dataset", url: "https://github.com" },
        { name: "ERA5 Wind Reanalysis", url: "https://cds.climate.copernicus.eu" }
      ]
    },
    {
      id: "prob-st-08",
      trackId: "track-space-technology",
      problemCode: "ST-08",
      title: "Geospatial Foundation Model for Few-Label Land and Crop Mapping",
      difficulty: "Hard",
      displayOrder: 8,
      objective: "Build a self-supervised foundation model that learns from unlabeled satellite time series and maps crop types across diverse Indian states with minimal labels.",
      summary: "Pretrain masked autoencoders on multi-temporal Sentinel-1/2 data to achieve high crop classification accuracy using less than 1% labeled ground truth.",
      fullDescription: "India needs accurate, up-to-date crop and land-cover maps, but labeled ground truth is scarce and varies by region and season. Models trained in one state often fail in another. Build a model that learns from large unlabeled satellite archives and maps crop types accurately in new regions using very few labels.",
      expectedOutcomes: [
        "Self-supervised pretrained model on satellite multi-spectral time series",
        "Few-shot accuracy surpassing fully supervised baselines on <1% labeled data",
        "Cross-region generalization benchmark (train on Punjab, test on Andhra/Telangana)",
        "Uncertainty map highlighting low-confidence predictions"
      ],
      keyRequirements: [
        "Multi-sensor time-series alignment (Sentinel-2 optical + Sentinel-1 SAR)",
        "Masked autoencoding or contrastive representation learning",
        "Rigorous spatial and temporal cross-validation"
      ],
      suggestedTech: ["PyTorch", "TorchGeo", "Prithvi / SatMAE architectures", "Google Earth Engine", "Weights & Biases"],
      datasets: [
        { name: "SEN12MS Dataset", url: "https://mediatum.ub.tum.de/1474000" },
        { name: "BigEarthNet Benchmark", url: "https://bigearth.net" },
        { name: "ISRO Bhuvan LULC Portals", url: "https://bhuvan.nrsc.gov.in" },
        { name: "Source Cooperative (ex-Radiant MLHub) EO Datasets", url: "https://source.coop/" }
      ]
    },
    {
      id: "prob-st-09",
      trackId: "track-space-technology",
      problemCode: "ST-09",
      title: "SatQuery AI: Remote-Sensing Vision-Language Assistant (ISRO)",
      difficulty: "Flagship",
      displayOrder: 9,
      objective: "Build a multimodal assistant that answers complex natural language queries about satellite imagery, grounds findings in bounding boxes, and declines unanswerable requests.",
      summary: "Vision-language model fine-tuned for Earth observation, supporting non-RGB multispectral bands (NIR/SWIR/SAR) with grounded bounding boxes and zero hallucinations.",
      fullDescription: "Analysts want to ask questions such as 'Where are the newly constructed structures near the flood basin?' and get reliable answers from satellite images. General vision-language models handle overhead imagery poorly, hallucinate counts, and ignore non-RGB bands. Build an assistant that grounds each answer in a region of the image and abstains when evidence is insufficient.",
      expectedOutcomes: [
        "Visual question answering for counting, presence, changes, and spatial relations",
        "Exact region grounding (bounding boxes/segmentation masks) for answers",
        "Handling of non-RGB bands (NIR, SAR, Thermal)",
        "Quantified hallucination rate and calibrated refusal mechanisms",
        "Interactive web chat interface with image upload and query inspector"
      ],
      keyRequirements: [
        "Band-aware visual encoder adapting remote-sensing channels",
        "LoRA/PEFT fine-tuning on Earth observation QA datasets",
        "Integration of SAM (Segment Anything) for spatial bounding"
      ],
      suggestedTech: ["Hugging Face Transformers", "Qwen-VL / LLaVA", "LoRA / PEFT", "SAM", "RemoteCLIP", "FastAPI", "React"],
      datasets: [
        { name: "RSVQA Remote Sensing QA Dataset", url: "https://rsvqa.sylvainlobry.com" },
        { name: "GeoChat Instruction Dataset", url: "https://github.com/mbzuai-oryx/GeoChat" },
        { name: "ISRO Bhoonidhi / Bhuvan Archives", url: "https://bhoonidhi.nrsc.gov.in" }
      ]
    },
    {
      id: "prob-st-10",
      trackId: "track-space-technology",
      problemCode: "ST-10",
      title: "OceanEmbed: Subsurface Ocean Temperature from Satellite Embeddings (MoES)",
      difficulty: "Flagship",
      displayOrder: 10,
      objective: "Reconstruct 3D subsurface temperature profiles down to 1,000m depth across the Indian Ocean by fusing satellite surface observations with deep representation learning.",
      summary: "Deep learning 3D vertical reconstruction predicting subsurface thermoclines and heat content from sea surface temperature, altimetry, salinity, and wind reanalysis.",
      fullDescription: "Satellites only see the ocean surface, but cyclone intensity, monsoon behaviour and fisheries depend on the temperature below it. Subsurface measurements are sparse (Argo floats, moorings). Build a deep learning model that learns embeddings from surface satellite data (SST, sea-surface height, wind, salinity) and reconstructs temperature profiles down to about 1,000 m for the Indian Ocean.",
      expectedOutcomes: [
        "3D temperature profile maps at standard depths (50m, 100m, 300m, 500m, 1000m)",
        "RMSE and bias evaluation benchmarked against held-out Argo float soundings",
        "Mixed-layer depth (MLD) and thermocline depth estimates",
        "Uncertainty estimation per vertical sounding",
        "Cyclone intensification case-study analysis"
      ],
      keyRequirements: [
        "Spatial-temporal collocation of surface fields with Argo float soundings",
        "Deep vertical profile regression (Transformer / MLP-Mixer)",
        "Benchmark against GLORYS12 physical reanalysis baseline"
      ],
      suggestedTech: ["Python", "xarray", "PyTorch", "Gaussian Processes", "Cartopy", "Plotly", "Copernicus Marine API"],
      datasets: [
        { name: "Argo Global Float Profiles", url: "https://argo.ucsd.edu" },
        { name: "NOAA OISST High-Resolution SST", url: "https://www.ncei.noaa.gov/products/optimum-interpolation-sst" },
        { name: "Copernicus Marine Altimetry & GLORYS", url: "https://marine.copernicus.eu" },
        { name: "INCOIS Ocean Data Portal", url: "https://incois.gov.in" }
      ]
    },

    // =========================================================================
    // THEME 3: QUANTUM COMPUTING (Codes: QC-01 to QC-10)
    // =========================================================================
    {
      id: "prob-qc-01",
      trackId: "track-quantum-computing",
      problemCode: "QC-01",
      title: "Fault-Tolerant Quantum Portfolio Optimizer with Dynamic Constraints",
      difficulty: "Flagship",
      displayOrder: 1,
      objective: "Design and implement a hybrid quantum-classical portfolio optimizer incorporating logical qubits, time-varying risk constraints, transaction costs, and ESG filters.",
      summary: "Formulate multi-period portfolio selection as time-dependent QUBO/Ising models with adaptive QAOA/VQE executed on simulated error-corrected backends.",
      fullDescription: "Formulate a multi-period stochastic portfolio problem as a time-dependent QUBO/Ising model with soft and hard constraints. Implement a variational algorithm (QAOA or VQE with adaptive ansatz) running on logical qubits via a simulated or real error-corrected backend. Include dynamical decoupling, zero-noise extrapolation, and probabilistic error cancellation. Compare against Gurobi on out-of-sample crisis periods.",
      expectedOutcomes: [
        "Fully reproducible pipeline and resource estimation report for logical qubits",
        "Ablation study of error mitigation techniques (ZNE, PEC, DD)",
        "Statistical significance tests comparing quantum vs classical Gurobi / RL solvers",
        "Interactive dashboard displaying live re-optimization under streaming market feeds"
      ],
      keyRequirements: [
        "QUBO formulation with cardinality, sector, and risk constraints",
        "Simulation of logical qubits with surface-code noise models (Stim / Qiskit Aer)",
        "Out-of-sample backtesting including 2008 or 2020 market crash regimes"
      ],
      suggestedTech: ["Qiskit / Cirq", "Stim (Surface Code Simulation)", "Ocean SDK", "Gurobi / CPLEX", "PyTorch", "Streamlit"],
      datasets: [
        { name: "Yahoo Finance & FRED Macroeconomic Series", url: "https://fred.stlouisfed.org" },
        { name: "Public ESG Sustainability Scores", url: "https://www.msci.com" }
      ]
    },
    {
      id: "prob-qc-02",
      trackId: "track-quantum-computing",
      problemCode: "QC-02",
      title: "Quantum Chemistry Beyond Chemical Accuracy with Active-Space Embedding",
      difficulty: "Flagship",
      displayOrder: 2,
      objective: "Compute the ground-state energy of a strongly correlated molecular fragment to chemical accuracy (1.6 mHa) while mitigating hardware noise.",
      summary: "Perform Complete Active Space (CAS) selection, tapered Hamiltonian mappings, and ADAPT-VQE with error mitigation to benchmark against DMRG/CCSD(T).",
      fullDescription: "Perform complete active-space (CAS) selection, map the Hamiltonian with advanced encodings (tapered, qubit-efficient, or tensor-network inspired), run ADAPT-VQE or qubit-ADAPT-VQE with orbital optimization, apply advanced error mitigation (ZNE + PEC + Clifford data regression + virtual distillation), and validate against DMRG / CCSD(T) / full CI reference. Include resource estimation for a fault-tolerant implementation.",
      expectedOutcomes: [
        "Publication-quality convergence curve reaching chemical accuracy (< 1.6 mHa)",
        "Comprehensive error budget and hardware noise breakdown",
        "Scaling comparison against DMRG / CCSD(T) baselines",
        "Resource estimation for fault-tolerant implementation on systems larger than BeH2"
      ],
      keyRequirements: [
        "Complete active-space selection and tapered Jordan-Wigner Hamiltonian encoding",
        "ADAPT-VQE ansatz optimization",
        "Application of multi-layer error mitigation (Mitiq)"
      ],
      suggestedTech: ["Qiskit Nature / PennyLane", "PySCF", "Psi4", "Stim / Qiskit Aer", "Mitiq", "Qiskit Experiments"],
      datasets: [
        { name: "PubChem Molecular Repository", url: "https://pubchem.ncbi.nlm.nih.gov" },
        { name: "QM9 Quantum Chemistry Dataset", url: "http://quantum-machine.org/datasets/" },
        { name: "Qiskit Nature Precomputed Hamiltonians", url: "https://qiskit-community.github.io/qiskit-nature/" }
      ]
    },
    {
      id: "prob-qc-03",
      trackId: "track-quantum-computing",
      problemCode: "QC-03",
      title: "Quantum Kernel Methods with Theoretical Guarantees for Fraud Detection",
      difficulty: "Hard",
      displayOrder: 3,
      objective: "Develop a quantum kernel classifier providing PAC-style generalization bounds that outperforms classical kernels on streaming, concept-drifting fraud data.",
      summary: "Design data-dependent trainable quantum feature maps with expressivity bounds and online continual learning under adversarial and distribution shifts.",
      fullDescription: "Design a data-dependent or trainable quantum feature map with provable expressivity, implement quantum kernel estimation with shot-noise-aware concentration bounds, add online/continual learning under distribution shift, and prove or empirically validate robustness certificates. Full comparison against classical SVMs, XGBoost, and transformer-based fraud models.",
      expectedOutcomes: [
        "End-to-end quantum kernel estimation with provable concentration bounds",
        "Empirical evaluation under streaming concept drift",
        "Ablation study on kernel design choices, ansatz depth, and shot noise",
        "Interactive live streaming scoring demonstration"
      ],
      keyRequirements: [
        "Trainable quantum feature map parameterization",
        "Comparison against classical RBF-SVM and XGBoost baselines",
        "Adversarial robustness evaluation"
      ],
      suggestedTech: ["PennyLane / Qiskit Machine Learning", "PyTorch", "scikit-learn", "CVXPY", "MLflow"],
      datasets: [
        { name: "IEEE-CIS Fraud Detection Benchmark", url: "https://www.kaggle.com/c/ieee-fraud-detection" }
      ]
    },
    {
      id: "prob-qc-04",
      trackId: "track-quantum-computing",
      problemCode: "QC-04",
      title: "QAOA for Capacitated Vehicle Routing with Time Windows & Stochastic Demand",
      difficulty: "Hard",
      displayOrder: 4,
      objective: "Solve large-scale (50-100 customer) CVRP-TW instances using multi-layer QAOA or quantum-inspired annealing outperforming classical metaheuristics.",
      summary: "Formulate capacity, time windows, and stochastic demand into scalable QUBOs executed via warm-start or recursive QAOA with approximation ratio guarantees.",
      fullDescription: "Advanced QUBO encoding of capacity, time windows, and stochastic scenarios (sample average approximation or robust optimization). Implement warm-start QAOA, recursive QAOA, or quantum-assisted local search. Full benchmarking against Google OR-Tools, Hexaly, and academic solvers on standard and custom instances.",
      expectedOutcomes: [
        "Scalable QUBO mapping handling 50+ customer delivery networks",
        "Rigorous benchmarking table against Google OR-Tools and ALNS metaheuristics",
        "Route visualization under stochastic traffic and demand scenarios",
        "Empirical scaling analysis comparing quantum depth vs classical runtime"
      ],
      keyRequirements: [
        "Penalty formulation preserving feasible capacity and arrival time windows",
        "Multi-layer or recursive QAOA circuit implementation",
        "Testing on standard Solomon benchmark instances"
      ],
      suggestedTech: ["Qiskit Optimization", "D-Wave Ocean SDK", "Google OR-Tools", "NetworkX", "Matplotlib / Leaflet"],
      datasets: [
        { name: "CVRPLIB Solomon Instances", url: "http://vrp.atd-lab.inf.puc-rio.br/index.php/en/" }
      ]
    },
    {
      id: "prob-qc-05",
      trackId: "track-quantum-computing",
      problemCode: "QC-05",
      title: "Hybrid Quantum-Classical Neural Architecture Search for Medical Imaging",
      difficulty: "Hard",
      displayOrder: 5,
      objective: "Perform neural architecture search over hybrid CNN + variational quantum circuits to discover models with state-of-the-art accuracy and certified robustness.",
      summary: "Differentiable architecture search optimizing quantum ansatz families and entanglement topologies with certified robustness using fewer classical weights.",
      fullDescription: "Define a searchable space of quantum layers (ansatz families, entanglement patterns, measurement strategies), implement differentiable or evolutionary NAS, train under noise, and certify robustness. Full comparison against pure classical EfficientNet / ViT baselines and existing hybrid QNNs.",
      expectedOutcomes: [
        "Discovered hybrid architecture Pareto front (Accuracy vs. Parameter Count)",
        "Certified robustness verification using randomized smoothing",
        "Drastic reduction in classical parameter count for medical classification",
        "Deployable inference checkpoint with robustness certificate"
      ],
      keyRequirements: [
        "Quantum layer search space definition (parameterized rotational gates and entanglers)",
        "Evolutionary or gradient-based NAS optimizer (Optuna / Ray Tune)",
        "Evaluation on MedMNIST 2D/3D biomedical benchmarks"
      ],
      suggestedTech: ["PennyLane", "PyTorch", "Optuna", "auto-LiRPA", "MedMNIST"],
      datasets: [
        { name: "MedMNIST Biomedical Image Benchmark", url: "https://medmnist.com" }
      ]
    },
    {
      id: "prob-qc-06",
      trackId: "track-quantum-computing",
      problemCode: "QC-06",
      title: "Certified Quantum Random Number Generator with Real-Time Statistical Tests",
      difficulty: "Easy",
      displayOrder: 6,
      objective: "Build a QRNG generating entropy from quantum backends, running real-time NIST SP 800-22 and Bell-inequality tests with live min-entropy bounds.",
      summary: "Quantum circuit execution harvesting genuine superposition entropy with automated streaming Dieharder tests, CHSH violation tracking, and hardware drift detection.",
      fullDescription: "Build a QRNG that continuously generates randomness from a quantum backend, runs a battery of NIST SP 800-22 + Dieharder + device-independent (Bell inequality) tests in real time, and provides a live entropy estimate with confidence intervals, while detecting and alerting on any degradation or side-channel leakage.",
      expectedOutcomes: [
        "Production-grade random number generation web API",
        "Continuous statistical monitoring dashboard with real-time pass/fail metrics",
        "Formal min-entropy estimation under noisy experimental conditions",
        "Bell CHSH inequality violation verification module"
      ],
      keyRequirements: [
        "Superposition state preparation (Hadamard measurement array)",
        "Implementation of NIST SP 800-22 statistical test suite",
        "Alert mechanism for entropy drop and physical decoherence"
      ],
      suggestedTech: ["Qiskit / Cirq", "FastAPI", "React", "Dieharder wrappers", "Plotly"],
      datasets: [
        { name: "NIST Statistical Test Suite SP 800-22", url: "https://csrc.nist.gov/publications/detail/sp/800-22/rev-1a/final" }
      ]
    },
    {
      id: "prob-qc-07",
      trackId: "track-quantum-computing",
      problemCode: "QC-07",
      title: "Full-Stack Quantum Circuit IDE with Noise-Aware Compilation & Verification",
      difficulty: "Easy",
      displayOrder: 7,
      objective: "Create a browser-based quantum circuit IDE supporting drag-and-drop editing, noise-aware optimization, statevector/Bloch visualization, and formal verification.",
      summary: "Interactive web IDE compiling quantum assembly, simulating noisy density matrices in real time, and formally verifying circuit equivalence using ZX-calculus.",
      fullDescription: "Create a browser-based quantum circuit IDE that supports drag-and-drop + code editing, automatic noise-aware compilation/optimization, real-time statevector / density-matrix / Bloch / Q-sphere visualization, and formal verification of circuit equivalence or correctness properties.",
      expectedOutcomes: [
        "Interactive drag-and-drop gate canvas with simultaneous OpenQASM code synchronization",
        "Real-time 3D Bloch Sphere and Q-Sphere state vector visualization",
        "Noise-aware transpiler and routing pass optimizer",
        "Formal circuit equivalence checker (proving optimized circuit matches original)"
      ],
      keyRequirements: [
        "Browser-based circuit model with OpenQASM 3.0 import/export",
        "Matrix multiplication and statevector simulator running in WebAssembly / JS",
        "Equivalence verification using ZX-calculus or unitary checks"
      ],
      suggestedTech: ["React", "TypeScript", "Three.js", "Tailwind CSS", "Qiskit.js / WebAssembly", "PyZX"],
      datasets: [
        { name: "OpenQASM Specification & Circuits", url: "https://github.com/openqasm/openqasm" }
      ]
    },
    {
      id: "prob-qc-08",
      trackId: "track-quantum-computing",
      problemCode: "QC-08",
      title: "End-to-End Quantum Teleportation & Entanglement Distribution Simulator",
      difficulty: "Easy",
      displayOrder: 8,
      objective: "Implement a multi-node quantum network simulation performing entanglement distribution, purification, and teleportation with fidelity tracking.",
      summary: "Multi-node quantum repeater mesh simulating Bell-pair generation, BBPSSW entanglement distillation, quantum state teleportation, and bit-flip correction.",
      fullDescription: "Implement a multi-node quantum network simulation (or real hardware if available) that performs entanglement distribution, purification, and teleportation of arbitrary states, while continuously tracking fidelity, applying entanglement purification protocols, and demonstrating the benefit of simple error-correcting codes.",
      expectedOutcomes: [
        "Interactive multi-node network simulator with node hop topology",
        "Fidelity heatmaps tracking state preservation over lossy fiber links",
        "Quantitative demonstration showing purification protocols boost end-to-end fidelity",
        "Step-by-step visual animation of Bell measurement and classical feedforward"
      ],
      keyRequirements: [
        "Bell state generation and classical channel synchronization",
        "BBPSSW / DEJMPS entanglement purification routine",
        "Realistic optical attenuation and depolarizing noise channels"
      ],
      suggestedTech: ["Qiskit", "QuTiP / Stim", "NetQASM concepts", "React", "Plotly", "Tailwind CSS"],
      datasets: []
    },
    {
      id: "prob-qc-09",
      trackId: "track-quantum-computing",
      problemCode: "QC-09",
      title: "Device-Independent Quantum Key Distribution Simulator with Finite-Key Proofs",
      difficulty: "Easy",
      displayOrder: 9,
      objective: "Simulate a full DI-QKD protocol including entanglement generation, CHSH testing, error correction, and privacy amplification with finite-key security bounds.",
      summary: "Simulate secure quantum key distribution independent of untrusted devices, computing finite-key secret rates against active eavesdroppers with parameter exploration.",
      fullDescription: "Simulate a full DI-QKD (or semi-DI) protocol including entanglement generation, CHSH testing, parameter estimation, error correction, and privacy amplification, while providing finite-key security bounds (not just asymptotic) and quantifying the impact of realistic noise and finite statistics.",
      expectedOutcomes: [
        "Full DI-QKD simulation suite with configurable eavesdropper attacks (Eve)",
        "Finite-key security proof engine graphing secret key rates vs distance",
        "Interactive parameter slider showing positive key rates under detector inefficiency",
        "Comprehensive report on entropy accumulation bounds"
      ],
      keyRequirements: [
        "CHSH correlation score calculation with statistical confidence",
        "Cascade or LDPC error correction simulation",
        "Toeplitz hashing privacy amplification"
      ],
      suggestedTech: ["Qiskit / Cirq", "SciPy", "CVXPY", "Streamlit / React", "Plotly"],
      datasets: []
    },
    {
      id: "prob-qc-10",
      trackId: "track-quantum-computing",
      problemCode: "QC-10",
      title: "Quantum Amplitude Estimation for Bias Detection with Rigorous Confidence",
      difficulty: "Easy",
      displayOrder: 10,
      objective: "Use quantum amplitude estimation (QAE) to detect bias in classical or quantum random sources with quadratic speedup and adaptive sampling strategies.",
      summary: "Apply iterative and maximum-likelihood Quantum Amplitude Estimation to test coin-toss bias and lottery fairness with provably fewer samples than classical Wald tests.",
      fullDescription: "Use quantum amplitude estimation (or iterative QAE) to detect bias in a classical or quantum random source with exponentially fewer samples than classical methods, while providing rigorous confidence intervals and an adaptive sampling strategy that stops early when bias is confirmed or ruled out.",
      expectedOutcomes: [
        "Functional QAE bias detector module running on circuit simulators",
        "Empirical and theoretical sample complexity comparison vs. classical tests",
        "Adaptive sequential testing demo stopping early upon significant bias",
        "Confidence interval visualization across iterative Grover operator powers"
      ],
      keyRequirements: [
        "Iterative Quantum Amplitude Estimation (IQAE) circuit synthesis",
        "Rigorous Chernoff-Hoeffding style confidence interval calculations",
        "Comparative benchmark against classical Sequential Probability Ratio Tests (SPRT)"
      ],
      suggestedTech: ["PennyLane / Qiskit (Amplitude Estimation)", "NumPy", "SciPy", "React", "Recharts"],
      datasets: []
    },

    // =========================================================================
    // THEME 4: FINTECH (Codes: FT-01 to FT-10)
    // =========================================================================
    {
      id: "prob-ft-01",
      trackId: "track-fintech",
      problemCode: "FT-01",
      title: "Tokenised KYC: Privacy-Preserving Reusable Identity Verification",
      difficulty: "Flagship",
      displayOrder: 1,
      objective: "Let a customer complete KYC once and reuse a verifiable cryptographic token across institutions, without any institution seeing more data than it needs.",
      summary: "Self-sovereign KYC credential system using zero-knowledge selective disclosure (e.g. 'over 18', 'address verified') across multiple simulated banks with instant revocation.",
      fullDescription: "Repeated KYC is costly, and sharing raw documents creates breach risk. Build a prototype where a trusted issuer verifies identity and issues a token or credential. Other institutions verify it with selective disclosure (for example, 'over 18' or 'address verified') without learning the underlying data. Include revocation, consent and an audit trail.",
      expectedOutcomes: [
        "Working issue, verify and revoke lifecycle across at least 3 simulated financial institutions",
        "Zero-knowledge selective-disclosure interactive demo",
        "User-controlled consent registry and immutable access audit log",
        "Threat model addressing credential replay, forgery, and token theft"
      ],
      keyRequirements: [
        "W3C Verifiable Credentials or ZK-SNARK circuit implementation",
        "Selective attribute disclosure protocol without PII leakage",
        "Cryptographic revocation accumulator"
      ],
      suggestedTech: ["TypeScript", "SnarkJS / Circom", "Solidity / Ethers.js", "FastAPI", "React", "PostgreSQL"],
      datasets: [
        { name: "SROIE Document Extraction Benchmark", url: "https://rrc.cvc.uab.es/?ch=13" },
        { name: "FUNSD Form Understanding Dataset", url: "https://guillaumejaume.github.io/FUNSD/" },
        { name: "LFW Labeled Faces in the Wild", url: "https://www.tensorflow.org/datasets/catalog/lfw" }
      ]
    },
    {
      id: "prob-ft-02",
      trackId: "track-fintech",
      problemCode: "FT-02",
      title: "Real-Time Mule Account Detection Using Alternate Data and Graph Learning",
      difficulty: "Flagship",
      displayOrder: 2,
      objective: "Identify mule accounts and layered money flows early, using transaction graphs plus alternate signals, without false positives against genuine customers.",
      summary: "Streaming Graph Neural Network (GNN) identifying high-velocity money laundering topologies, fan-out layering patterns, and synthetic fraud rings in banking streams.",
      fullDescription: "Mule networks move stolen funds through many short-lived accounts. Participants should build a graph-based detector that works in a streaming setting, combines behavioural, device and network features, and gives investigators ranked clusters with reasons. Evaluate it under severe class imbalance and temporal drift.",
      expectedOutcomes: [
        "Graph neural network beating tabular XGBoost baselines on Precision-Recall AUC",
        "Low-latency streaming transaction scoring demo (< 20ms)",
        "Investigator console displaying interactive subgraph clusters and explainable rules",
        "Temporal drift and false-positive calibration report"
      ],
      keyRequirements: [
        "Dynamic graph construction from payment events",
        "GNN architecture (GraphSAGE / RGCN / Temporal Graph Networks)",
        "Handling extreme class imbalance (less than 0.1% positive labels)"
      ],
      suggestedTech: ["PyTorch Geometric", "NetworkX", "Kafka", "FastAPI", "React", "Cytoscape.js / D3.js"],
      datasets: [
        { name: "IBM AMLWorld Synthetic Transactions", url: "https://www.kaggle.com/datasets/ealtman2019/ibm-transactions-for-anti-money-laundering-aml" },
        { name: "SAML-D Synthetic AML Dataset", url: "https://www.kaggle.com/datasets/berkanoztas/synthetic-transaction-monitoring-dataset-aml" },
        { name: "Elliptic Bitcoin Transaction Graph", url: "https://www.kaggle.com/datasets/ellipticco/elliptic-data-set" },
        { name: "Elliptic++ Extended Wallet Graph", url: "https://github.com/git-disl/EllipticPlusPlus" }
      ]
    },
    {
      id: "prob-ft-03",
      trackId: "track-fintech",
      problemCode: "FT-03",
      title: "Offline Digital Currency Payments with Double-Spend Protection",
      difficulty: "Hard",
      displayOrder: 3,
      objective: "Design an offline peer-to-peer digital currency payment flow functioning with zero network connectivity while mathematically bounding risk and preventing double-spending.",
      summary: "Peer-to-peer token transfer over BLE / QR using local secure hardware counters, signed balance proofs, and automated conflict-resolution reconciliation.",
      fullDescription: "Offline payments have to resolve trust without a server. Participants should simulate two or more devices exchanging value, bound the offline risk (limits, expiry, counters), detect and penalise double-spends at reconciliation, and handle device loss. Privacy-by-design for small payments is a bonus.",
      expectedOutcomes: [
        "Working offline payment transfer demo between two devices or emulators",
        "Reconciliation engine detecting double-spend attempts upon reconnection",
        "Configurable risk-limiting state machine (maximum balance, transaction frequency, time-to-live)",
        "Formal attack-and-defence security write-up"
      ],
      keyRequirements: [
        "Monotonic sequence counter / cryptographic signature exchange",
        "Secure storage emulation simulating Android Keystore / Apple Secure Enclave",
        "Reconciliation clearinghouse with penalty logic for rogue actors"
      ],
      suggestedTech: ["Rust / Go", "TypeScript", "SQLite", "Web Cryptography API", "React Native / React"],
      datasets: []
    },
    {
      id: "prob-ft-04",
      trackId: "track-fintech",
      problemCode: "FT-04",
      title: "Privacy-Preserving Collaborative Fraud Detection using Federated Learning",
      difficulty: "Hard",
      displayOrder: 4,
      objective: "Let multiple banks jointly train a fraud detection model without sharing raw customer data, proving the collaborative model outperforms isolated silos.",
      summary: "Multi-bank federated learning setup aggregating model gradients with differential privacy and secure aggregation to detect credit card fraud across institutions.",
      fullDescription: "Fraudsters operate across institutions, but privacy law and competition stop banks from pooling data. Participants should simulate several banks with different data distributions, train a shared model using federated learning, and demonstrate privacy protections such as differential privacy or secure aggregation. They should compare results against isolated local models.",
      expectedOutcomes: [
        "Federated training pipeline coordinating at least 3 distinct banking entities",
        "Quantitative proof that federated global model beats every single bank's private model",
        "Privacy-versus-utility trade-off curve across varying epsilon noise levels",
        "Regulatory briefing addressing India's DPDP Act and cross-institution data rules"
      ],
      keyRequirements: [
        "Federated averaging (FedAvg / FedProx) with non-IID data distributions",
        "Differential privacy noise injection (Opacus / TensorFlow Privacy)",
        "Protection against model inversion and reconstruction attacks"
      ],
      suggestedTech: ["Python", "Flower / PySyft", "PyTorch", "scikit-learn", "Docker"],
      datasets: [
        { name: "ULB Credit Card Fraud Dataset", url: "https://www.kaggle.com/datasets/mlg-ulb/creditcardfraud" },
        { name: "IEEE-CIS Fraud Detection Benchmark", url: "https://www.kaggle.com/c/ieee-fraud-detection" },
        { name: "Synthetic Data Vault (SDV)", url: "https://github.com/sdv-dev/SDV" }
      ]
    },
    {
      id: "prob-ft-05",
      trackId: "track-fintech",
      problemCode: "FT-05",
      title: "Cross-Border AML & Sanctions Screening that Cuts False Positives",
      difficulty: "Hard",
      displayOrder: 5,
      objective: "Reduce the severe false-positive alert burden of sanctions and PEP screening in cross-border payments without missing true watchlist targets.",
      summary: "Multilingual fuzzy entity resolver handling transliteration, script variations, and contextual transaction signals to slash false-positive compliance alerts.",
      fullDescription: "Name-matching alerts overwhelm compliance teams, and most turn out to be false. Participants should build a screening engine that handles transliteration, aliases and fuzzy matching across scripts. It should score match confidence, use context (country, transaction pattern, counterparties) to rank alerts, and explain each decision for audit.",
      expectedOutcomes: [
        "Screening engine reporting precision and recall on labelled benchmarks",
        "Measured >50% reduction in false-positive alerts compared to naive Levenshtein/Soundex baselines",
        "Explainable compliance audit dossier detailing why a candidate was cleared or flagged",
        "Accurate resolution of non-Latin script names (Devanagari, Arabic, Cyrillic)"
      ],
      keyRequirements: [
        "Phonetic & phonetic-transliteration fuzzy matching (Double Metaphone, Jaro-Winkler, Levenshtein)",
        "Secondary contextual scoring (DOB, nationality, entity type, payment corridor)",
        "Benchmarking against public OFAC and UN watchlists"
      ],
      suggestedTech: ["Python", "Elasticsearch", "FastAPI", "React", "Polyglot / Transliteration tools"],
      datasets: [
        { name: "OpenSanctions Consolidated Watchlists", url: "https://www.opensanctions.org/datasets/" },
        { name: "OFAC Specially Designated Nationals (SDN)", url: "https://sanctionslist.ofac.treas.gov/Home/SdnList" },
        { name: "UN Security Council Consolidated List", url: "https://main.un.org/securitycouncil/en/content/un-sc-consolidated-list" }
      ]
    },
    {
      id: "prob-ft-06",
      trackId: "track-fintech",
      problemCode: "FT-06",
      title: "Agentic AI for Next-Best-Product Recommendation & Cross-Sell",
      difficulty: "Easy",
      displayOrder: 6,
      objective: "Build an AI agent that recommends the right banking product to the right customer at the right moment with transparent reasons and consent controls.",
      summary: "Multi-signal propensity model and conversational agent synthesizing transaction history, life milestones, and spending habits into personalized banking offers.",
      fullDescription: "Banks often push generic offers, which leads to low conversion and customer fatigue. Participants should combine customer profile, transaction behaviour and life-event signals to drive personalised, consent-aware recommendations through chat, push notifications or an RM dashboard.",
      expectedOutcomes: [
        "Working recommendation agent with end-to-end customer conversational journey",
        "Offer propensity model with cross-validated lift metrics",
        "Explainable justification card explaining why each product was recommended",
        "A/B-testing framework and simulated revenue uplift calculator"
      ],
      keyRequirements: [
        "Feature engineering from bank transactions (salary spikes, travel, EMI payments)",
        "Collaborative filtering or Gradient Boosted propensity scoring",
        "Consent management framework respecting marketing preferences"
      ],
      suggestedTech: ["Python", "LightGBM / XGBoost", "FastAPI", "LangChain / OpenAI API", "React", "Tailwind CSS"],
      datasets: [
        { name: "UCI Bank Marketing Dataset", url: "https://archive.ics.uci.edu/dataset/222/bank+marketing" },
        { name: "Santander Product Recommendation", url: "https://www.kaggle.com/c/santander-product-recommendation" },
        { name: "Berka PKDD99 Czech Bank Transactions", url: "https://relational.fel.cvut.cz/dataset/Financial" }
      ]
    },
    {
      id: "prob-ft-07",
      trackId: "track-fintech",
      problemCode: "FT-07",
      title: "AI Personal Finance Manager: Categorisation, Budgeting & Savings Agent",
      difficulty: "Easy",
      displayOrder: 7,
      objective: "Build an intelligent agent that cleans messy UPI transaction strings, categorises spending, forecasts cash flow, and provides actionable savings nudges.",
      summary: "NLP merchant cleaner and time-series forecaster turning raw UPI narrations into structured category budgets, subscription trackers, and savings prompts.",
      fullDescription: "Most users cannot see where their money goes because merchant names are messy and categories are inconsistent. Participants should clean and categorise transactions (including noisy UPI narrations), detect recurring bills and subscriptions, forecast month-end balance, and have an agent suggest actions such as 'move ₹X to savings' while staying consent-aware and non-intrusive.",
      expectedOutcomes: [
        "Transaction cleaning model achieving high categorization macro-F1",
        "Automated recurring bill and hidden subscription detection engine",
        "Month-end cash-flow predictive curve with anomaly warnings",
        "Interactive budgeting dashboard with simulated smart-savings nudges"
      ],
      keyRequirements: [
        "Regular expression & NLP tokenization for cryptic merchant descriptors (e.g. UPI-SWIGGY-12849)",
        "Time-series cash flow forecasting (Prophet / ARIMA / LSTM)",
        "Budget threshold alert rules"
      ],
      suggestedTech: ["Python", "Pandas", "scikit-learn", "FastAPI", "React", "Recharts", "Tailwind CSS"],
      datasets: [
        { name: "Berka Czech Bank Financial Dataset", url: "https://relational.fel.cvut.cz/dataset/Financial" }
      ]
    },
    {
      id: "prob-ft-08",
      trackId: "track-fintech",
      problemCode: "FT-08",
      title: "Customer Complaint Triage & Call-Centre Intelligence",
      difficulty: "Easy",
      displayOrder: 8,
      objective: "Automatically classify, prioritise, and route customer complaints, summarise transcripts, and surface root-cause operational failures for bank executives.",
      summary: "Multichannel grievance NLP pipeline detecting urgency, regulatory-critical disputes (unauthorized charges), drafting compliant replies, and visualizing root causes.",
      fullDescription: "Banks receive thousands of complaints across chat, email and calls, and slow resolution hurts trust and creates regulatory exposure. Participants should build a system that detects issue type, sentiment and urgency, flags regulatory-sensitive cases such as unauthorised transactions, drafts suggested replies, and analyses trends to show which processes are failing.",
      expectedOutcomes: [
        "Multi-class complaint classifier with urgency scoring and regulatory escalation flags",
        "Auto-generated concise call summary and draft response requiring human sign-off",
        "Root-cause operational breakdown dashboard highlighting systemic failures",
        "Projected improvement in first-contact resolution time"
      ],
      keyRequirements: [
        "Intent and sentiment classification via fine-tuned Transformer",
        "Named Entity Recognition (extracting transaction IDs, amounts, dates)",
        "Human-in-the-loop review workflow"
      ],
      suggestedTech: ["Python", "Hugging Face Transformers", "FastAPI", "React", "Tailwind CSS"],
      datasets: [
        { name: "CFPB Consumer Complaint Database", url: "https://www.consumerfinance.gov/data-research/consumer-complaints/" },
        { name: "Banking77 Intent Classification Dataset", url: "https://huggingface.co/datasets/PolyAI/banking77" }
      ]
    },
    {
      id: "prob-ft-09",
      trackId: "track-fintech",
      problemCode: "FT-09",
      title: "Predictive Churn Detection & Proactive Retention Agent",
      difficulty: "Easy",
      displayOrder: 9,
      objective: "Predict which bank customers are likely to disengage or close their accounts, diagnose key drivers, and trigger targeted automated retention workflows.",
      summary: "Customer attrition predictive engine isolating behavioral drop-offs, inactivity signals, and service friction to dispatch customized retention incentives.",
      fullDescription: "Customer attrition is usually preceded by falling activity, rising complaints or product dissatisfaction. Participants should build a model plus an agent that decides what to offer, when, and through which channel, without over-contacting customers.",
      expectedOutcomes: [
        "Churn risk classification model reporting precision, recall, and cumulative lift",
        "SHAP-based top churn drivers per customer demographic segment",
        "Automated retention-action engine with multi-channel timing rules",
        "Relationship Manager (RM) dashboard with customer priority queues"
      ],
      keyRequirements: [
        "Feature engineering from activity cadence and balance velocity",
        "Ensemble classification (Random Forest / XGBoost / LightGBM)",
        "Personalized retention incentive recommendation logic"
      ],
      suggestedTech: ["Python", "scikit-learn", "XGBoost", "SHAP", "FastAPI", "React"],
      datasets: [
        { name: "Bank Customer Churn Kaggle Dataset", url: "https://www.kaggle.com/datasets/radheshyamkollipara/bank-customer-churn" },
        { name: "Telco Customer Churn Structural Reference", url: "https://www.kaggle.com/datasets/blastchar/telco-customer-churn" }
      ]
    },
    {
      id: "prob-ft-10",
      trackId: "track-fintech",
      problemCode: "FT-10",
      title: "Carbon Footprint Tracking & Green Finance Engine",
      difficulty: "Easy",
      displayOrder: 10,
      objective: "Estimate the carbon footprint of customer spending habits and design incentives such as green rewards, eco-loans, and ESG portfolio reporting.",
      summary: "Transaction merchant code mapping to carbon emission intensity factors, tracking individual emissions and modeling green credit score rewards.",
      fullDescription: "Banks and payment apps hold rich spending data that can reveal environmental impact, but it is rarely used that way. Participants should map transactions to emission categories, estimate footprint per user, and build features that reward lower-carbon choices. They should also consider how the bank can use aggregated results for ESG reporting.",
      expectedOutcomes: [
        "Transaction-to-emission estimation pipeline with factor lookup tables",
        "Customer-facing carbon footprint dashboard with weekly trends and peer comparisons",
        "Gamified green reward and sustainability-linked loan simulator",
        "Audit disclosure documenting emission factor sources and estimation uncertainties"
      ],
      keyRequirements: [
        "Merchant Category Code (MCC) mapping to greenhouse gas intensity",
        "Spend-based carbon accounting following GHG Protocol principles",
        "Aggregated portfolio ESG reporting export"
      ],
      suggestedTech: ["Python", "Pandas", "FastAPI", "React", "Recharts", "Tailwind CSS"],
      datasets: [
        { name: "EPA GHG Emission Factors Hub", url: "https://www.epa.gov/climateleadership/ghg-emission-factors-hub" },
        { name: "UK DEFRA Greenhouse Gas Conversion Factors", url: "https://www.gov.uk/government/collections/government-conversion-factors-for-company-reporting" },
        { name: "EXIOBASE Spend-Based Emission Data", url: "https://www.exiobase.eu/" },
        { name: "Climate TRACE Emissions Data", url: "https://climatetrace.org/data" }
      ]
    },

    // =========================================================================
    // THEME 5: ENERGY AND SUSTAINABILITY (Codes: ES-01 to ES-10)
    // =========================================================================
    {
      id: "prob-es-01",
      trackId: "track-energy-sustainability",
      problemCode: "ES-01",
      title: "Ward-Level Waste Pickup Reliability Tracker",
      difficulty: "Easy",
      displayOrder: 1,
      objective: "Build a web application that combines pickup schedules, vehicle logs, and citizen reports to identify missed collections and recurring failure hotspots.",
      summary: "Geospatial waste monitoring platform correlating municipal schedules against GPS logs and geotagged citizen complaints with operator verification workflows.",
      fullDescription: "Residents often cannot tell whether a missed waste pickup is an isolated delay or a repeated service problem. City complaint portals, pickup logs and ward boundaries are usually viewed separately, making recurring failures hard to spot. Build a web application that combines pickup schedules, vehicle/pickup logs and citizen reports to identify missed collections, recurring hotspots and wards that need follow-up. It should show evidence behind each flagged location rather than treating every complaint as verified.",
      expectedOutcomes: [
        "Map of reported and confirmed missed pickups by municipal ward and date",
        "Reliability score with transparent inputs (scheduled vs recorded pickups)",
        "Complaint review queue allowing operators to mark duplicates or resolved cases",
        "Exportable weekly ward-level service performance summary"
      ],
      keyRequirements: [
        "Time-aware ingestion pipeline standardizing schedules, logs, and complaints",
        "Spatial deduplication of reports within radius thresholds",
        "Probability estimation for missed pickups avoiding blind trust of unverified claims"
      ],
      suggestedTech: ["Python", "FastAPI", "PostgreSQL / PostGIS", "React", "Leaflet", "Pandas"],
      datasets: [
        { name: "OpenStreetMap India Boundary Extracts", url: "https://download.geofabrik.de/asia/india.html" },
        { name: "India Open Government Data (Municipal Datasets)", url: "https://data.gov.in" },
        { name: "UN-Habitat Waste Wise Cities Tool Context", url: "https://unhabitat.org/waste-wise-cities" }
      ]
    },
    {
      id: "prob-es-02",
      trackId: "track-energy-sustainability",
      problemCode: "ES-02",
      title: "Household Water-Use Anomaly and Leak Diary",
      difficulty: "Easy",
      displayOrder: 2,
      objective: "Create a privacy-conscious dashboard where users enter meter readings or bills, view consumption trends, and receive explainable anomaly warnings.",
      summary: "Smart baseline consumption calculator and statistical anomaly detector flagging hidden leaks from manual meter inputs and bills without costly hardware.",
      fullDescription: "Small leaks and unusual water use can remain unnoticed when households only receive a monthly bill. Create a privacy-conscious dashboard where users enter meter readings or upload bills, view daily/weekly usage trends, and receive explainable warnings when consumption changes sharply compared with their own baseline.",
      expectedOutcomes: [
        "Usage trend chart and estimated municipal bill comparison",
        "Configurable alerts for abnormal spikes with explicit math formula shown",
        "Household-level monthly summary and actionable water-saving checklist",
        "User data export and privacy-first deletion controls"
      ],
      keyRequirements: [
        "Handling irregular reading intervals, unit conversions, and missing days",
        "Comparison of robust seasonal baselines against Isolation Forest models",
        "Evaluation on held-out temporal splits measuring false-alert rates"
      ],
      suggestedTech: ["Python", "Pandas", "scikit-learn", "FastAPI", "SQLite / PostgreSQL", "React", "Recharts"],
      datasets: [
        { name: "India National Water Data Portal", url: "https://indiawris.gov.in" },
        { name: "Open Government Data Municipal Consumption", url: "https://data.gov.in" }
      ]
    },
    {
      id: "prob-es-03",
      trackId: "track-energy-sustainability",
      problemCode: "ES-03",
      title: "Local Heat-Risk Walkability Planner",
      difficulty: "Easy",
      displayOrder: 3,
      objective: "Build a route-planning prototype that compares pedestrian routes using distance plus available tree cover, shade, and surface heat indicators.",
      summary: "Multi-objective pedestrian navigation engine computing cool walking paths by overlaying OpenStreetMap walkways with satellite canopy and surface temperature.",
      fullDescription: "A short walk can feel very different depending on shade, surface cover and time of day. Common map applications prioritise distance and travel time, not exposure to heat along the route. Build a route-planning prototype that compares walking routes using distance plus available shade, tree-cover and land-surface indicators. It must clearly label estimates and avoid claiming satellite indicators equal street-level temperature.",
      expectedOutcomes: [
        "Two or more selectable route options with transparent heat-exposure proxy scores",
        "Map overlay of tree cover, open paved stretches, and shaded segments",
        "Time-of-day advisory based on solar angle and real-time public weather feeds",
        "Clear disclosure of spatial resolution gaps and limitations"
      ],
      keyRequirements: [
        "Pedestrian network graph derivation via OSMnx",
        "Multispectral canopy cover extraction from Sentinel-2 or ESA WorldCover",
        "Multi-objective route weighting (distance vs shade) with user-adjustable sliders"
      ],
      suggestedTech: ["Python", "GeoPandas", "OSMnx", "Rasterio", "FastAPI", "React", "Leaflet"],
      datasets: [
        { name: "ESA WorldCover 10m Land Cover", url: "https://esa-worldcover.org" },
        { name: "OpenStreetMap Pedestrian Extracts", url: "https://download.geofabrik.de" },
        { name: "NASA POWER Climate Weather Feed", url: "https://power.larc.nasa.gov" },
        { name: "Copernicus ERA5 Land Reanalysis", url: "https://cds.climate.copernicus.eu" }
      ]
    },
    {
      id: "prob-es-04",
      trackId: "track-energy-sustainability",
      problemCode: "ES-04",
      title: "Food-Expiry Rescue and Local Surplus Exchange",
      difficulty: "Easy",
      displayOrder: 4,
      objective: "Develop a role-based platform where donors list surplus food with expiry timestamps, and nearby receivers match and track collection status.",
      summary: "Hyper-local logistics exchange connecting canteens, banquet halls, and grocers with food banks based on travel radius, shelf-life, and storage capacity.",
      fullDescription: "Small shops, canteens and community kitchens may discard edible food because surplus is not visible to nearby organisations in time. Develop a role-based web platform where donors list surplus food with quantity, preparation/expiry time, storage conditions and pickup window; eligible receivers can request it and track handover status.",
      expectedOutcomes: [
        "Searchable surplus listings with live countdowns and pickup radius geofence",
        "Matching algorithm based on distance, quantity, and preservation constraints",
        "Audit status trail from listed to accepted, verified collected, or expired",
        "Auditable diversion metrics separating listed, collected, and verified meals"
      ],
      keyRequirements: [
        "Constraint matching (storage temperature, vegetarian/non-veg, vehicle capacity)",
        "Role-based authentication for donors, receivers, and volunteer couriers",
        "Automatic delisting upon expiry time expiration"
      ],
      suggestedTech: ["Django / FastAPI", "PostgreSQL / PostGIS", "React", "Leaflet", "Tailwind CSS"],
      datasets: [
        { name: "UNEP Food Waste Index Report References", url: "https://www.unep.org/resources/publication/food-waste-index-report-2024" },
        { name: "Open Food Facts Open Database", url: "https://world.openfoodfacts.org" },
        { name: "OpenStreetMap India Extracts", url: "https://download.geofabrik.de" }
      ]
    },
    {
      id: "prob-es-05",
      trackId: "track-energy-sustainability",
      problemCode: "ES-05",
      title: "Campus Energy-Waste Discovery Dashboard",
      difficulty: "Easy",
      displayOrder: 5,
      objective: "Build a dashboard combining building electricity readings, floor area, occupancy schedules, and weather to identify avoidable consumption.",
      summary: "Energy analytics portal normalizing building kWh by square footage, operating schedules, and outdoor temperature to isolate after-hours phantom loads.",
      fullDescription: "Campus electricity bills show total consumption but rarely reveal which buildings or operating hours contribute most to avoidable use. Build a dashboard that combines building-level electricity readings, floor area, occupancy schedules and weather context to identify unusual consumption and compare similar buildings fairly.",
      expectedOutcomes: [
        "Monthly and hourly energy usage views normalized by square meter",
        "Detection of after-hours baseline anomalies and HVAC idling",
        "Fair building comparison accounting for lab equipment vs classroom schedules",
        "Prioritized checklist for university facilities management"
      ],
      keyRequirements: [
        "Forecasting baseline incorporating calendar, weather, and schedule features",
        "After-hours anomaly scoring distinguishing baseload from active use",
        "Reporting MAE/RMSE and alert precision on held-out building test sets"
      ],
      suggestedTech: ["Python", "Pandas", "scikit-learn", "FastAPI", "PostgreSQL", "React", "Recharts"],
      datasets: [
        { name: "Building Data Genome Project 2 (BDG2)", url: "https://github.com/buds-lab/building-data-genome-project-2" },
        { name: "NASA POWER Climate Data", url: "https://power.larc.nasa.gov" }
      ]
    },
    {
      id: "prob-es-06",
      trackId: "track-energy-sustainability",
      problemCode: "ES-06",
      title: "Pollution Event Fingerprinting Across Air-Quality Sensors",
      difficulty: "Hard",
      displayOrder: 6,
      objective: "Create a software pipeline aligning multiple monitoring stations, checking sensor quality, and grouping unusual pollution patterns into candidate events.",
      summary: "Multi-station spatial-temporal pipeline clustering industrial spikes from regional haze, filtering calibration drift and sensor glitches with wind vectors.",
      fullDescription: "Air-quality dashboards usually show that pollution increased, but do not help analysts distinguish a local short-lived event from a wider regional episode. Sensor gaps, calibration differences and weather can make simple threshold alerts misleading. Create a software pipeline that aligns multiple monitoring stations, checks data quality, and groups unusual pollution patterns into candidate events with supporting weather evidence.",
      expectedOutcomes: [
        "Candidate pollution episodes with start/end duration and affected stations",
        "Automated data-quality flags for missing, stuck, or implausible readings",
        "Event similarity view comparing chemical pollutant ratios and wind directions",
        "Analyst feedback loop evaluating false alarms against ground truth events"
      ],
      keyRequirements: [
        "Automated quality-control pipeline (handling flatlines, unit mismatches, outages)",
        "Multivariate clustering (DBSCAN / GMM) grouping multi-sensor spikes",
        "Wind trajectory alignment using meteorological vectors"
      ],
      suggestedTech: ["Python", "Pandas", "scikit-learn", "FastAPI", "TimescaleDB", "React", "Plotly / Recharts"],
      datasets: [
        { name: "CPCB National Air Quality Monitoring Programme", url: "https://cpcb.nic.in" },
        { name: "OpenAQ Public Air Quality API", url: "https://openaq.org" },
        { name: "Copernicus ERA5 Weather Reanalysis", url: "https://cds.climate.copernicus.eu" }
      ]
    },
    {
      id: "prob-es-07",
      trackId: "track-energy-sustainability",
      problemCode: "ES-07",
      title: "Watershed Restoration Prioritisation with Explainable Evidence",
      difficulty: "Hard",
      displayOrder: 7,
      objective: "Build a geospatial decision-support tool ranking micro-watersheds for restoration using terrain, land cover, rainfall, and downstream exposure indicators.",
      summary: "Multi-criteria spatial evaluation combining DEM slope hydrology, runoff coefficients, and population vulnerability with interactive weight sensitivity analysis.",
      fullDescription: "Tree planting, erosion control and runoff interventions compete for limited funding. Selecting sites from a single map layer can overlook slope, upstream connectivity, land cover, settlement exposure and data uncertainty. Build a geospatial decision-support tool that ranks candidate micro-watersheds for restoration using openly available terrain, land-cover, rainfall and settlement indicators with configurable policy weights.",
      expectedOutcomes: [
        "Ranked micro-watershed list and interactive geospatial map",
        "Per-site explanation showing indicator values and contributions to priority score",
        "Scenario comparison tool testing alternate ecological policy weights",
        "Transparent data resolution notes and uncertainty indicators"
      ],
      keyRequirements: [
        "Terrain and hydrological flow accumulation processing from DEM (SRTM/Copernicus)",
        "Configurable multi-criteria decision ranking (AHP / TOPSIS)",
        "Sensitivity analysis demonstrating how rankings respond to weight shifts"
      ],
      suggestedTech: ["Python", "Rasterio", "GeoPandas", "WhiteboxTools", "PostGIS", "FastAPI", "React", "Leaflet"],
      datasets: [
        { name: "National Water Data Portal Ministry of Jal Shakti", url: "https://indiawris.gov.in" },
        { name: "ESA WorldCover Land Cover", url: "https://esa-worldcover.org" },
        { name: "USGS SRTM Elevation Model", url: "https://earthexplorer.usgs.gov" },
        { name: "Copernicus ERA5 Precipitation", url: "https://cds.climate.copernicus.eu" }
      ]
    },
    {
      id: "prob-es-08",
      trackId: "track-energy-sustainability",
      problemCode: "ES-08",
      title: "Plastic Leakage Pathway Mapper for Urban Drains",
      difficulty: "Hard",
      displayOrder: 8,
      objective: "Develop a geospatial prototype combining drain connectivity, litter reports, rainfall, and land use to identify likely plastic leakage pathways into rivers.",
      summary: "Network graph modeling storm drain and river connectivity, simulating plastic waste movement under rain scenarios to prioritize barrier placements.",
      fullDescription: "Clean-up teams often record litter at collection points, while the drains and waterways connecting those points are not mapped as a single system. After rain, the likely movement of waste can change quickly. Develop a geospatial prototype that combines drain/stream connectivity, observed litter reports, rainfall and land-use proxies to identify likely plastic leakage pathways and high-priority inspection points.",
      expectedOutcomes: [
        "Connected network graph of candidate leakage routes and high-priority interception points",
        "Risk score with visible factors (connectivity, waste hotspots, slope, rainfall)",
        "Field-report interface with photo upload, coordinates, and verification tags",
        "Before-and-after monitoring dashboard for municipal clean-up verification"
      ],
      keyRequirements: [
        "Directed network graph modeling drainage and stream flow accumulation",
        "Rainfall-driven hydrodynamic transport probability modeling",
        "Validation against held-out field surveys with audit trails"
      ],
      suggestedTech: ["Python", "NetworkX", "GeoPandas", "PostGIS", "FastAPI", "React", "Leaflet"],
      datasets: [
        { name: "HydroSHEDS HydroRIVERS Drainage Network", url: "https://www.hydrosheds.org" },
        { name: "NOAA Marine Debris Monitoring Project", url: "https://marinedebris.noaa.gov" },
        { name: "NASA GPM Global Precipitation Measurement", url: "https://gpm.nasa.gov" },
        { name: "OpenStreetMap India Waterway Layers", url: "https://download.geofabrik.de" }
      ]
    },
    {
      id: "prob-es-09",
      trackId: "track-energy-sustainability",
      problemCode: "ES-09",
      title: "Climate Adaptation Digital Twin for Neighbourhood Decisions",
      difficulty: "Flagship",
      displayOrder: 9,
      objective: "Build a neighbourhood-scale digital twin allowing urban planners to simulate and compare interventions (cool roofs, tree canopies, permeable pavement) against heat and flood exposure.",
      summary: "Interactive planning platform modeling urban heat island mitigation and stormwater runoff under budget constraints with multi-scenario trade-off analysis.",
      fullDescription: "City climate plans often operate at a broad scale, while residents and local administrators need to compare concrete neighbourhood interventions. Build a neighbourhood-scale planning platform that lets users test combinations of interventions—such as tree-canopy expansion, cool roofs, permeable surfaces and drainage upgrades—against documented heat and runoff proxies. Compare scenarios, show assumptions and uncertainty, and avoid presenting simplified estimates as engineering-grade forecasts.",
      expectedOutcomes: [
        "Baseline neighbourhood spatial profile combining land cover, infrastructure, and population density",
        "Interactive scenario builder with drag-and-drop intervention zones and budget constraints",
        "Side-by-side scenario comparison for heat reduction, runoff absorption, and cost per citizen",
        "Explainable decision brief exportable for municipal civic review"
      ],
      keyRequirements: [
        "Spatial baseline combining building footprints, land cover, and elevation rasters",
        "Simplified physical relationship models for albedo cooling and runoff curve numbers",
        "Multi-objective scenario optimization under strict municipal budget constraints"
      ],
      suggestedTech: ["Python", "GeoPandas", "Rasterio", "xarray", "PostGIS", "FastAPI", "React", "Leaflet", "Google OR-Tools"],
      datasets: [
        { name: "ESA WorldCover High-Resolution Map", url: "https://esa-worldcover.org" },
        { name: "WorldPop Open Population Aggregation", url: "https://www.worldpop.org" },
        { name: "Copernicus ERA5 Climate Reanalysis", url: "https://cds.climate.copernicus.eu" },
        { name: "OpenStreetMap Infrastructure Layers", url: "https://download.geofabrik.de" }
      ]
    },
    {
      id: "prob-es-10",
      trackId: "track-energy-sustainability",
      problemCode: "ES-10",
      title: "Circular Materials Exchange with Verified Environmental Accounting",
      difficulty: "Flagship",
      displayOrder: 10,
      objective: "Develop a traceable platform matching industrial and construction by-products with reusers, calculating verified emission reductions against virgin baselines.",
      summary: "Industrial symbiosis marketplace optimizing material compatibility, freight transport emissions, and chain-of-custody handovers with conservative CO2e metrics.",
      fullDescription: "Construction, manufacturing and institutional waste streams may contain reusable materials, but listings rarely share compatible units, quality grades, transport costs and proof of final use. Develop a traceable software platform that matches material by-products with potential users and estimates the environmental difference between reuse and a defined disposal or virgin-material baseline. Each match must retain quantities, quality checks, transport distance, acceptance status and evidence.",
      expectedOutcomes: [
        "Material catalogue with standardized engineering classifications, grades, and units",
        "Constrained matching engine considering technical compatibility, quantity, and freight distance",
        "Immutable chain-of-custody audit log tracking offer, collection, transport, and certified reuse",
        "Conservative environmental savings calculator distinguishing estimated from verified diversion"
      ],
      keyRequirements: [
        "Constrained multi-attribute matching (grade, contamination tolerance, logistics cost)",
        "Life-cycle greenhouse gas emission estimation referencing versioned EPA/DEFRA factors",
        "Chain-of-custody verification with digital receipts preventing double-counting"
      ],
      suggestedTech: ["Python", "FastAPI", "PostgreSQL / PostGIS", "Google OR-Tools", "React", "Tailwind CSS"],
      datasets: [
        { name: "US EPA Waste Reduction Model (WARM) Factors", url: "https://www.epa.gov/warm" },
        { name: "UK Government GHG Conversion Factors", url: "https://www.gov.uk/government/collections/government-conversion-factors-for-company-reporting" },
        { name: "OpenStreetMap Logistics & Routing Network", url: "https://download.geofabrik.de" },
        { name: "India Open Government Recycling Datasets", url: "https://data.gov.in" }
      ]
    },
  ],
};
