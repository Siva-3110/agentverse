import os
import json
import requests
from backend.config import settings

def generate_response(prompt: str) -> str:
    """
    Call LLM with the given prompt.
    Checks for GROQ_API_KEY to use Groq (llama-3.3-70b-versatile).
    Falls back to Gemini if GROQ_API_KEY is not set but GOOGLE_API_KEY is.
    Otherwise, returns fallback JSON.
    """
    groq_api_key = getattr(settings, "GROQ_API_KEY", None) or os.getenv("GROQ_API_KEY")
    google_api_key = settings.GOOGLE_API_KEY
    
    if groq_api_key:
        url = "https://api.groq.com/openai/v1/chat/completions"
        headers = {
            "Authorization": f"Bearer {groq_api_key}",
            "Content-Type": "application/json"
        }
        payload = {
            "model": "llama-3.3-70b-versatile",
            "messages": [
                {
                    "role": "system",
                    "content": "You are a patent analysis assistant. You output strict, valid JSON matching the requested schema. Do not output markdown, reasoning, backticks, or any conversational text. Only output raw JSON."
                },
                {
                    "role": "user",
                    "content": prompt
                }
            ],
            "temperature": 0.1
        }
        
        import time
        groq_models = ["llama-3.3-70b-versatile", "llama-3.3-70b-versatile", "llama-3.1-8b-instant"]
        for attempt, model_name in enumerate(groq_models):
            print(f"[LLM Client] Sending request to Groq ({model_name})...")
            payload["model"] = model_name
            try:
                response = requests.post(url, headers=headers, json=payload, timeout=25)
                if response.status_code == 200:
                    result = response.json()
                    content = result["choices"][0]["message"]["content"].strip()
                    if content.startswith("```"):
                        lines = content.splitlines()
                        if lines[0].startswith("```"):
                            lines = lines[1:]
                        if lines and lines[-1].strip() == "```":
                            lines = lines[:-1]
                        content = "\n".join(lines).strip()
                    return content
                elif response.status_code == 429:
                    print(f"[LLM Client] Groq 429 Rate Limit for '{model_name}'. Switching model / retrying in 2s...")
                    time.sleep(2)
                    continue
                else:
                    print(f"[LLM Client] Groq API returned status {response.status_code}: {response.text}")
                    break
            except Exception as e:
                print(f"[LLM Client] Groq API call failed for '{model_name}': {e}")
                break







            
    # Fallback to Gemini
    if google_api_key:
        print("[LLM Client] Sending request to Gemini 1.5 Flash ...")
        try:
            from langchain_google_genai import ChatGoogleGenerativeAI
            llm = ChatGoogleGenerativeAI(
                model="gemini-1.5-flash",
                google_api_key=google_api_key,
                temperature=0.1,
                request_timeout=10
            )

            response = llm.invoke(prompt)
            raw_text = response.content
            if isinstance(raw_text, bytes):
                raw_text = raw_text.decode("utf-8")
            return raw_text.strip()
        except Exception as e:
            print(f"[LLM Client] Gemini API call failed: {e}. Using fallback generator...")
            
    # Mock fallback
    print("[LLM Client] Warning: No valid LLM keys configured. Using mock JSON fallback...")
    return get_fallback_json(prompt)

def get_fallback_json(prompt: str) -> str:
    """
    Generates realistic looking mock JSON arrays matching expected agent schemas 
    if the API is unavailable, tailored to the domain keyword.
    """
    prompt_lower = prompt.lower()
    
    # Extract domain query from the prompt for context-specific matching
    domain_query = ""
    if "about " in prompt_lower:
        try:
            part = prompt_lower.split("about ", 1)[1]
            domain_query = part.split(",", 1)[0].strip()
        except Exception:
            pass
    elif "domain: " in prompt_lower:
        try:
            part = prompt_lower.split("domain: ", 1)[1]
            domain_query = part.split("\n", 1)[0].strip()
        except Exception:
            pass
            
    match_target = domain_query if domain_query else prompt_lower
    
    # 1. Check if the prompt is for the Research Agent
    if ("research topics" in prompt_lower or "research_topics" in prompt_lower or "abstracts" in prompt_lower) and "patent" not in prompt_lower:
        # Check domain context
        if "healthcare" in match_target or "medical" in match_target or "diagnostic" in match_target:
            mock_topics = [
                {
                    "topic": "AI-Assisted Diagnostics",
                    "description": "Deep learning models classifying diseases from radiology scans and MRI images.",
                    "research_activity": "High",
                    "citation_strength": 95
                },
                {
                    "topic": "Wearable Health Sensors",
                    "description": "Continuous telemetry of vital signs for cardiovascular tracking and early anomaly warning.",
                    "research_activity": "High",
                    "citation_strength": 88
                },
                {
                    "topic": "Remote Patient Telemedicine",
                    "description": "Virtual care interfaces managing patient workflows and secure clinical data sharing.",
                    "research_activity": "Medium",
                    "citation_strength": 70
                },
                {
                    "topic": "Personalized Genomic Medicine",
                    "description": "Tailoring oncology drug dosages based on specific gene sequencing biomarkers.",
                    "research_activity": "Low",
                    "citation_strength": 35
                }
            ]
        elif "vehicle" in match_target or "battery" in match_target or "charging" in match_target:
            mock_topics = [
                {
                    "topic": "Battery Health Prediction",
                    "description": "Predicting lithium-ion state of health using capacity fading tracking models.",
                    "research_activity": "High",
                    "citation_strength": 90
                },
                {
                    "topic": "Solid-State Battery Tech",
                    "description": "Solid electrolyte materials replacing liquid counterparts for high safety EV blocks.",
                    "research_activity": "High",
                    "citation_strength": 86
                },
                {
                    "topic": "Ultra-Fast Charging Station",
                    "description": "High-power cooling and charger grids delivering rapid charge times without cell damage.",
                    "research_activity": "Medium",
                    "citation_strength": 68
                }
            ]
        elif any(kw in match_target for kw in ["cybersecurity", "security", "cryptography", "firewall", "malware", "network"]):
            mock_topics = [
                {
                    "topic": "Zero Trust Network Access",
                    "description": "Continuous verification and micro-segmentation architectures to prevent lateral movement inside enterprise networks.",
                    "research_activity": "High",
                    "citation_strength": 92
                },
                {
                    "topic": "Homomorphic Encryption",
                    "description": "Cryptographic schemes allowing computation on encrypted datasets without revealing underlying plaintexts.",
                    "research_activity": "High",
                    "citation_strength": 87
                },
                {
                    "topic": "AI-Driven Threat Detection",
                    "description": "Anomalous behavior monitoring using neural networks to block real-time cyber threats and zero-day exploits.",
                    "research_activity": "High",
                    "citation_strength": 94
                },
                {
                    "topic": "Automated Software Vulnerability Scanning",
                    "description": "Static and dynamic program analysis to autonomously patch flaws in software supply chains.",
                    "research_activity": "Medium",
                    "citation_strength": 72
                }
            ]
        elif any(kw in match_target for kw in ["ai", "machine learning", "deep learning", "neural", "intelligence", "language model"]):
            mock_topics = [
                {
                    "topic": "Large Language Model Reasoning",
                    "description": "Techniques to improve multi-step planning and logical execution paths in transformer architectures.",
                    "research_activity": "High",
                    "citation_strength": 96
                },
                {
                    "topic": "AI Agent Orchestration",
                    "description": "Multi-agent frameworks managing state, memory systems, and tools to solve complex objectives.",
                    "research_activity": "High",
                    "citation_strength": 93
                },
                {
                    "topic": "Efficient Model Distillation",
                    "description": "Compressing parameter counts of foundation models into fast edge runtimes without quality degradation.",
                    "research_activity": "High",
                    "citation_strength": 88
                },
                {
                    "topic": "Explainable Deep Learning",
                    "description": "Visualizing activation pathways and feature attribution methods inside deep neural nets.",
                    "research_activity": "Medium",
                    "citation_strength": 70
                }
            ]
        elif "city" in match_target or "cities" in match_target or "urban" in match_target:
            mock_topics = [
                {
                    "topic": "Urban IoT Infrastructure",
                    "description": "Architectures and communication protocols for deploying high-density sensor networks across municipal areas.",
                    "research_activity": "High",
                    "citation_strength": 92
                },
                {
                    "topic": "Dynamic Traffic Routing",
                    "description": "Reinforcement learning algorithms for adaptive traffic signal control and emergency vehicle routing.",
                    "research_activity": "High",
                    "citation_strength": 88
                },
                {
                    "topic": "Data Privacy in Smart Spaces",
                    "description": "Privacy-preserving frameworks for handling crowdsourced municipal and citizen telemetry data.",
                    "research_activity": "Medium",
                    "citation_strength": 75
                }
            ]
        else:
            # Default to Smart Agriculture
            mock_topics = [
                {
                    "topic": "Crop Disease Detection",
                    "description": "Computer vision models trained on leaf imagery to classify fungal and viral infections.",
                    "research_activity": "High",
                    "citation_strength": 92
                },
                {
                    "topic": "Precision Irrigation Controllers",
                    "description": "Sensors and reinforcement learning systems adjusting flow rate based on real-time soil moisture.",
                    "research_activity": "High",
                    "citation_strength": 85
                },
                {
                    "topic": "Microclimate Weather Forecasting",
                    "description": "Localized weather predicting models using edge nodes placed in individual field blocks.",
                    "research_activity": "Medium",
                    "citation_strength": 64
                },
                {
                    "topic": "Drone-Based Autonomous Monitoring",
                    "description": "Unmanned aerial vehicles flying scheduled paths to capture multispectral crop health grids.",
                    "research_activity": "Low",
                    "citation_strength": 40
                }
            ]
        return json.dumps(mock_topics)
    elif "patent clusters" in prompt_lower or "patent_clusters" in prompt_lower or "patent_saturation" in prompt_lower or "patent count" in prompt_lower or "saturation" in prompt_lower:
        # Check domain context
        if "healthcare" in match_target or "medical" in match_target or "diagnostic" in match_target:
            mock_clusters = [
                {
                    "category": "Wearable Vital Sensors",
                    "description": "Patented hardware for continuous telemetry of ECG and blood oxygen metrics.",
                    "saturation": "High",
                    "major_assignees": ["Medtronic", "Philips", "Apple"]
                },
                {
                    "category": "AI Diagnostics Systems",
                    "description": "Patents covering neural networks for computerized diagnostic scoring and anomaly alerts.",
                    "saturation": "High",
                    "major_assignees": ["Google Health", "IBM Watson", "Siemens Healthineers"]
                },
                {
                    "category": "Telemedicine Data Platforms",
                    "description": "Secure clinical teleconferencing and encrypted medical record database systems.",
                    "saturation": "Medium",
                    "major_assignees": ["Teladoc", "Amwell", "Epic Systems"]
                }
            ]
        elif "vehicle" in match_target or "battery" in match_target or "charging" in match_target:
            mock_clusters = [
                {
                    "category": "Battery Cell Configuration",
                    "description": "Patented modular cell configurations and internal link setups for EV battery pack efficiency.",
                    "saturation": "High",
                    "major_assignees": ["Tesla", "Panasonic", "CATL"]
                },
                {
                    "category": "Thermal Regulation Grids",
                    "description": "Patents covering pack-level cooling channels and heat sink setups for temperature safety.",
                    "saturation": "High",
                    "major_assignees": ["Tesla", "LG Energy Solution", "BYD"]
                },
                {
                    "category": "Fast Charging Circuits",
                    "description": "High-amperage charging interfaces and power regulation circuitry to protect active cells.",
                    "saturation": "Medium",
                    "major_assignees": ["ChargePoint", "ABB", "Siemens"]
                }
            ]
        elif any(kw in match_target for kw in ["cybersecurity", "security", "cryptography", "firewall", "malware", "network"]):
            mock_clusters = [
                {
                    "category": "Network Security Gateways",
                    "description": "Patented firewall filtering devices and hardware security appliances for enterprise routing.",
                    "saturation": "High",
                    "major_assignees": ["Cisco Systems", "Palo Alto Networks", "Fortinet"]
                },
                {
                    "category": "Encrypted Communication Protocols",
                    "description": "Cryptographic authentication patents protecting data transfers across distributed systems.",
                    "saturation": "High",
                    "major_assignees": ["RSA Security", "Symantec", "Microsoft"]
                },
                {
                    "category": "Automated Threat Isolation",
                    "description": "Intrusion detection software systems automatically isolating compromised virtual domains.",
                    "saturation": "Medium",
                    "major_assignees": ["CrowdStrike", "FireEye", "Splunk"]
                }
            ]
        elif any(kw in match_target for kw in ["ai", "machine learning", "deep learning", "neural", "intelligence", "language model"]):
            mock_clusters = [
                {
                    "category": "Neural Net Optimization Hardware",
                    "description": "Patented neuromorphic acceleration structures and logic gates designed for parallel tensor math.",
                    "saturation": "High",
                    "major_assignees": ["NVIDIA", "Intel", "Google"]
                },
                {
                    "category": "Natural Language Processing Models",
                    "description": "Patents covering speech-to-text decoding frameworks and attention-based weights systems.",
                    "saturation": "High",
                    "major_assignees": ["Google", "Microsoft", "Meta Platforms"]
                },
                {
                    "category": "Automated Code Compilation",
                    "description": "Generative code creation pipelines utilizing compiler validation to resolve syntax bugs.",
                    "saturation": "Medium",
                    "major_assignees": ["GitHub", "Microsoft", "OpenAI"]
                }
            ]
        elif "city" in match_target or "cities" in match_target or "urban" in match_target:
            mock_clusters = [
                {
                    "category": "Intelligent Traffic Management",
                    "description": "Patented systems for real-time traffic signal optimization and congestion prediction using vehicle telematics.",
                    "saturation": "High",
                    "major_assignees": ["Siemens", "IBM", "Cisco Systems"]
                },
                {
                    "category": "Smart Grid Power Distribution",
                    "description": "Patents covering automated load balancing and renewable energy integration in municipal grids.",
                    "saturation": "High",
                    "major_assignees": ["General Electric", "Schneider Electric", "ABB"]
                },
                {
                    "category": "Environmental Sensor Networks",
                    "description": "Distributed sensor mesh networks for monitoring air quality, noise, and climate indicators in urban spaces.",
                    "saturation": "Medium",
                    "major_assignees": ["Honeywell", "Intel", "Bosch"]
                }
            ]
        else:
            # Default to Smart Agriculture
            mock_clusters = [
                {
                    "category": "Automated Irrigation Valves",
                    "description": "Patented flow control systems adjusting irrigation release based on sensor triggers.",
                    "saturation": "High",
                    "major_assignees": ["John Deere", "Lindsay Corporation", "Valmont Industries"]
                },
                {
                    "category": "Soil Nutrient Sensors",
                    "description": "Patents covering localized electro-chemical probes measuring moisture and NPK indexes.",
                    "saturation": "High",
                    "major_assignees": ["Trimble", "Raven Industries", "Climate Corporation"]
                },
                {
                    "category": "Drone Ingestion Imaging",
                    "description": "Spectral camera mounting rigs and software stitching scheduled field flight grids.",
                    "saturation": "Medium",
                    "major_assignees": ["DJI", "PrecisionHawk", "AeroVironment"]
                }
            ]
        return json.dumps(mock_clusters)
        
    return "[]"
